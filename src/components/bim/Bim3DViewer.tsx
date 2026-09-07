import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Box, 
  Layers, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Download, 
  Camera, 
  Sun, 
  Moon, 
  Sunrise, 
  Lightbulb, 
  Compass, 
  Sparkles, 
  Grid, 
  RotateCw, 
  Play, 
  Pause, 
  Sliders, 
  X, 
  Upload, 
  Check, 
  RefreshCw, 
  FileCode, 
  HelpCircle, 
  Info, 
  Scissors, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';
import { Project } from '../../types';

export type BimRenderMode = 'pbr' | 'clay' | 'wireframe' | 'xray';
export type BimLightingEnv = 'daylight' | 'sunset' | 'studio' | 'night';
export type BimCameraPreset = 'perspective' | 'isometric' | 'top' | 'front' | 'side';

export interface BimModelPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'procedural' | 'url';
  url?: string;
  stats: {
    elements: number;
    floors: string;
    area: string;
    lod: string;
  };
}

export interface SelectedBimElement {
  id: string;
  name: string;
  category: string;
  dimensions: { x: number; y: number; z: number };
  triangles: number;
  materialName: string;
}

const DEFAULT_PRESETS: BimModelPreset[] = [
  {
    id: 'cantilever-villa',
    name: 'Obsidian Glass Villa (LOD 350)',
    description: 'Cantilevered post-tensioned residential massing with curtain wall facade and interior core',
    category: 'Residential Architecture',
    type: 'procedural',
    stats: { elements: 142, floors: '3 Levels', area: '6,500 sq.ft', lod: 'LOD 350' }
  },
  {
    id: 'structural-frame',
    name: 'Structural Steel & Core Frame',
    description: 'Exposed structural steel columns, cross bracing, and concrete floor plates',
    category: 'Structural Engineering',
    type: 'procedural',
    stats: { elements: 96, floors: '4 Levels', area: '12,000 sq.ft', lod: 'LOD 400' }
  },
  {
    id: 'commercial-pavilion',
    name: 'Civic Pavilion & Parametric Canopy',
    description: 'Double-curved architectural diagrid canopy with central glazed atrium',
    category: 'Commercial & Public',
    type: 'procedural',
    stats: { elements: 180, floors: '2 Levels', area: '18,500 sq.ft', lod: 'LOD 350' }
  }
];

interface Bim3DViewerProps {
  project: Project;
  className?: string;
}

export const Bim3DViewer: React.FC<Bim3DViewerProps> = ({ project, className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const clippingPlaneRef = useRef<THREE.Plane | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const originalMaterialsMap = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());
  const animationFrameId = useRef<number | null>(null);

  // Viewer State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('cantilever-villa');
  const [renderMode, setRenderMode] = useState<BimRenderMode>('pbr');
  const [lightingEnv, setLightingEnv] = useState<BimLightingEnv>('daylight');
  const [cameraPreset, setCameraPreset] = useState<BimCameraPreset>('perspective');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [sliceHeight, setSliceHeight] = useState<number>(100); // 0% to 100%
  const [explodeValue, setExplodeValue] = useState<number>(0); // 0% to 100%
  const [activeTab, setActiveTab] = useState<'tools' | 'inspector' | 'models' | 'lighting'>('tools');

  // Model & Loading State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(100);
  const [customModelName, setCustomModelName] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Model Inspection Statistics
  const [modelStats, setModelStats] = useState<{
    triangles: number;
    vertices: number;
    meshes: number;
    dimensions: { x: number; y: number; z: number };
  }>({
    triangles: 0,
    vertices: 0,
    meshes: 0,
    dimensions: { x: 0, y: 0, z: 0 }
  });

  const [selectedElement, setSelectedElement] = useState<SelectedBimElement | null>(null);
  const [snapshotSuccess, setSnapshotSuccess] = useState<boolean>(false);

  // -------------------------------------------------------------
  // PROCEDURAL BIM GEOMETRY GENERATORS (LIGHTWEIGHT, FAST, CLEAN)
  // -------------------------------------------------------------
  const buildProceduralBimModel = useCallback((presetId: string): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'BIM_Root_Model';

    // PBR Materials definitions
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.85,
      metalness: 0.1
    });
    concreteMat.name = 'Structural_Concrete_M35';

    const darkZincMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.6
    });
    darkZincMat.name = 'Zinc_Architectural_Panels';

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.85,
      ior: 1.52
    });
    glassMat.name = 'Acoustic_Triple_Glazing';

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.8
    });
    steelMat.name = 'Structural_Steel_Fe415';

    const timberMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      roughness: 0.7,
      metalness: 0.05
    });
    timberMat.name = 'Thermal_Treated_Cedar';

    if (presetId === 'cantilever-villa') {
      // 1. Foundation Podia
      const podiumGeo = new THREE.BoxGeometry(26, 1.2, 18);
      const podium = new THREE.Mesh(podiumGeo, concreteMat);
      podium.position.set(0, 0.6, 0);
      podium.castShadow = true;
      podium.receiveShadow = true;
      podium.userData = { category: 'Foundation', name: 'Cast-in-Place Ground Podium S-01' };
      group.add(podium);

      // 2. Ground Floor Core
      const coreGeo = new THREE.BoxGeometry(8, 5, 8);
      const core = new THREE.Mesh(coreGeo, concreteMat);
      core.position.set(-4, 3.7, 0);
      core.castShadow = true;
      core.receiveShadow = true;
      core.userData = { category: 'Shear Core', name: 'Post-Tensioned Elevator Core C-01' };
      group.add(core);

      // 3. Ground Level Floor Slab (First Floor)
      const slab1Geo = new THREE.BoxGeometry(24, 0.6, 16);
      const slab1 = new THREE.Mesh(slab1Geo, concreteMat);
      slab1.position.set(1, 6.5, 0);
      slab1.castShadow = true;
      slab1.receiveShadow = true;
      slab1.userData = { category: 'Floor Slab', name: 'Level 01 Post-Tensioned Slab' };
      group.add(slab1);

      // 4. Cantilevered Upper Volume (Jutting 6m out)
      const upperGeo = new THREE.BoxGeometry(18, 4.5, 14);
      const upperVolume = new THREE.Mesh(upperGeo, darkZincMat);
      upperVolume.position.set(5, 9.05, 0);
      upperVolume.castShadow = true;
      upperVolume.receiveShadow = true;
      upperVolume.userData = { category: 'Cantilever Frame', name: 'Upper Master Suite Cantilever' };
      group.add(upperVolume);

      // 5. Triple-Glazed Curtain Wall Facades
      const glassWall1Geo = new THREE.BoxGeometry(0.2, 4.2, 13.6);
      const glassWall1 = new THREE.Mesh(glassWall1Geo, glassMat);
      glassWall1.position.set(14.05, 9.05, 0);
      glassWall1.userData = { category: 'Curtain Wall', name: 'East Panoramic Curtain Wall CW-01' };
      group.add(glassWall1);

      const glassWall2Geo = new THREE.BoxGeometry(16, 4.8, 0.2);
      const glassWall2 = new THREE.Mesh(glassWall2Geo, glassMat);
      glassWall2.position.set(2, 3.8, 7.9);
      glassWall2.userData = { category: 'Curtain Wall', name: 'South Garden Living Glass CW-02' };
      group.add(glassWall2);

      // 6. Architectural Roof Slab with Overhang
      const roofGeo = new THREE.BoxGeometry(20, 0.5, 16);
      const roof = new THREE.Mesh(roofGeo, darkZincMat);
      roof.position.set(5.5, 11.55, 0);
      roof.castShadow = true;
      roof.receiveShadow = true;
      roof.userData = { category: 'Roof Envelope', name: 'Parametric Overhang Roof R-01' };
      group.add(roof);

      // 7. Structural Steel Columns Grid (HEB 300)
      const colCoords = [
        [10, 3.6, 6], [10, 3.6, -6], [4, 3.6, 6], [4, 3.6, -6],
        [-8, 3.6, 6], [-8, 3.6, -6]
      ];
      colCoords.forEach(([cx, cy, cz], idx) => {
        const colGeo = new THREE.CylinderGeometry(0.25, 0.25, 5.2, 16);
        const col = new THREE.Mesh(colGeo, steelMat);
        col.position.set(cx, cy, cz);
        col.castShadow = true;
        col.userData = { category: 'Structural Column', name: `Structural Column C-${idx + 1}` };
        group.add(col);
      });

      // 8. Timber Louver Screen Accents
      for (let i = 0; i < 7; i++) {
        const louverGeo = new THREE.BoxGeometry(0.1, 4.2, 0.6);
        const louver = new THREE.Mesh(louverGeo, timberMat);
        louver.position.set(-3.8 + i * 0.9, 9.05, 7.1);
        louver.userData = { category: 'Solar Shading', name: `Timber Brise-Soleil Blade S-${i + 1}` };
        group.add(louver);
      }

    } else if (presetId === 'structural-frame') {
      // Structural Steel Tower & Core LOD 400
      const floorCount = 4;
      const baySize = 6;
      const numBaysX = 3;
      const numBaysZ = 2;
      const floorHeight = 4.2;

      // Base Mat Foundation
      const matGeo = new THREE.BoxGeometry(baySize * numBaysX + 4, 1.0, baySize * numBaysZ + 4);
      const matMesh = new THREE.Mesh(matGeo, concreteMat);
      matMesh.position.set(0, 0.5, 0);
      matMesh.castShadow = true;
      matMesh.receiveShadow = true;
      matMesh.userData = { category: 'Foundation', name: 'Raft Foundation Mat F-01' };
      group.add(matMesh);

      // Columns Grid
      for (let ix = -numBaysX / 2; ix <= numBaysX / 2; ix++) {
        for (let iz = -numBaysZ / 2; iz <= numBaysZ / 2; iz++) {
          const colX = ix * baySize;
          const colZ = iz * baySize;
          const totalColHeight = floorCount * floorHeight;
          const colGeo = new THREE.BoxGeometry(0.5, totalColHeight, 0.5);
          const col = new THREE.Mesh(colGeo, steelMat);
          col.position.set(colX, totalColHeight / 2 + 1.0, colZ);
          col.castShadow = true;
          col.userData = { category: 'Column', name: `Steel I-Beam Column Col [${ix + 2},${iz + 2}]` };
          group.add(col);
        }
      }

      // Horizontal Girders and Concrete Slabs per level
      for (let f = 1; f <= floorCount; f++) {
        const floorY = 1.0 + f * floorHeight;
        
        // Concrete Slab
        const slabGeo = new THREE.BoxGeometry(baySize * numBaysX + 1, 0.35, baySize * numBaysZ + 1);
        const slab = new THREE.Mesh(slabGeo, concreteMat);
        slab.position.set(0, floorY, 0);
        slab.castShadow = true;
        slab.receiveShadow = true;
        slab.userData = { category: 'Floor Slab', name: `Level 0${f} Reinforced Deck` };
        group.add(slab);

        // Peripheral Girders
        const beamXGeo = new THREE.BoxGeometry(baySize * numBaysX, 0.4, 0.25);
        const beamZGeo = new THREE.BoxGeometry(0.25, 0.4, baySize * numBaysZ);
        
        const beamFront = new THREE.Mesh(beamXGeo, steelMat);
        beamFront.position.set(0, floorY - 0.2, (numBaysZ / 2) * baySize);
        group.add(beamFront);

        const beamBack = new THREE.Mesh(beamXGeo, steelMat);
        beamBack.position.set(0, floorY - 0.2, -(numBaysZ / 2) * baySize);
        group.add(beamBack);

        const beamLeft = new THREE.Mesh(beamZGeo, steelMat);
        beamLeft.position.set(-(numBaysX / 2) * baySize, floorY - 0.2, 0);
        group.add(beamLeft);

        const beamRight = new THREE.Mesh(beamZGeo, steelMat);
        beamRight.position.set((numBaysX / 2) * baySize, floorY - 0.2, 0);
        group.add(beamRight);
      }

      // Concrete Shear Core in center
      const coreGeo = new THREE.BoxGeometry(baySize, floorCount * floorHeight, baySize);
      const coreMesh = new THREE.Mesh(coreGeo, concreteMat);
      coreMesh.position.set(0, (floorCount * floorHeight) / 2 + 1.0, 0);
      coreMesh.castShadow = true;
      coreMesh.userData = { category: 'Core', name: 'Central Seismic Shear Core' };
      group.add(coreMesh);

    } else {
      // Civic Pavilion & Parametric Canopy
      const baseGeo = new THREE.CylinderGeometry(14, 15, 0.8, 32);
      const base = new THREE.Mesh(baseGeo, concreteMat);
      base.position.set(0, 0.4, 0);
      base.castShadow = true;
      base.receiveShadow = true;
      base.userData = { category: 'Plaza', name: 'Civic Plaza Podium' };
      group.add(base);

      // Glass Rotunda Atrium
      const rotundaGeo = new THREE.CylinderGeometry(8, 8, 7, 32, 1, true);
      const rotunda = new THREE.Mesh(rotundaGeo, glassMat);
      rotunda.position.set(0, 4.3, 0);
      rotunda.userData = { category: 'Curtain Wall', name: 'Double-Glazed Rotunda Enclosure' };
      group.add(rotunda);

      // Tree Columns
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const colGeo = new THREE.CylinderGeometry(0.3, 0.4, 7.5, 16);
        const col = new THREE.Mesh(colGeo, steelMat);
        col.position.set(Math.cos(angle) * 7.5, 4.2, Math.sin(angle) * 7.5);
        col.castShadow = true;
        col.userData = { category: 'Tree Column', name: `Branching Steel Support Pillar ${i + 1}` };
        group.add(col);
      }

      // Sweeping Canopy Torus/Dish
      const canopyGeo = new THREE.TorusGeometry(10, 2.5, 16, 64);
      const canopy = new THREE.Mesh(canopyGeo, darkZincMat);
      canopy.rotation.x = Math.PI / 2;
      canopy.position.set(0, 8.2, 0);
      canopy.castShadow = true;
      canopy.userData = { category: 'Canopy', name: 'Parametric Aerodynamic Diagrid Canopy' };
      group.add(canopy);
    }

    return group;
  }, []);

  // -------------------------------------------------------------
  // THREE.JS INITIALIZATION & LIFECYCLE
  // -------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 520;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Premium slate-900 neutral
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(24, 18, 28);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // Required for high-res snapshot export
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.localClippingEnabled = true; // Enables real-time section cuts!
    rendererRef.current = renderer;

    // 4. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Prevent dipping below ground
    controls.minDistance = 5;
    controls.maxDistance = 150;
    controls.target.set(0, 5, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. LIGHTING SETUP
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 0.8);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    const d = 25;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 6. GROUND GRID
    const grid = new THREE.GridHelper(60, 60, 0x3b82f6, 0x1e293b);
    grid.position.y = 0.01;
    scene.add(grid);
    gridHelperRef.current = grid;

    // 7. SECTION CLIPPING PLANE
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 50);
    clippingPlaneRef.current = clippingPlane;

    // 8. RESIZE OBSERVER
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 520;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // 9. ANIMATION LOOP
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP ON UNMOUNT
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // -------------------------------------------------------------
  // LOAD & MOUNT MODEL (GLTF/GLB or PROCEDURAL)
  // -------------------------------------------------------------
  const loadAndMountModel = useCallback((modelGroup: THREE.Group) => {
    if (!sceneRef.current || !rendererRef.current) return;

    // Remove old model if present
    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
      modelGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    originalMaterialsMap.current.clear();

    // Calculate Bounding Box and Statistics
    const bbox = new THREE.Box3().setFromObject(modelGroup);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bbox.getSize(size);
    bbox.getCenter(center);

    // Reposition to origin floor
    modelGroup.position.x -= center.x;
    modelGroup.position.z -= center.z;
    modelGroup.position.y -= bbox.min.y; // Sit cleanly on ground plane

    let triangleCount = 0;
    let vertexCount = 0;
    let meshCount = 0;

    // Traverse & assign shadows, original materials, and clipping plane
    modelGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++;
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.geometry) {
          triangleCount += child.geometry.index 
            ? child.geometry.index.count / 3 
            : child.geometry.attributes.position.count / 3;
          vertexCount += child.geometry.attributes.position.count;
        }

        // Store original materials
        originalMaterialsMap.current.set(child, child.material);

        // Assign local clipping plane
        if (clippingPlaneRef.current) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => { m.clippingPlanes = [clippingPlaneRef.current!]; m.clipShadows = true; });
          } else {
            child.material.clippingPlanes = [clippingPlaneRef.current!];
            child.material.clipShadows = true;
          }
        }
      }
    });

    setModelStats({
      triangles: Math.round(triangleCount),
      vertices: Math.round(vertexCount),
      meshes: meshCount,
      dimensions: {
        x: Number(size.x.toFixed(1)),
        y: Number(size.y.toFixed(1)),
        z: Number(size.z.toFixed(1))
      }
    });

    sceneRef.current.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Reset camera target nicely
    if (controlsRef.current) {
      controlsRef.current.target.set(0, size.y / 2, 0);
      controlsRef.current.update();
    }
  }, []);

  // -------------------------------------------------------------
  // MODEL SELECTION OR URL LOADING
  // -------------------------------------------------------------
  useEffect(() => {
    // If project has explicit modelUrl or custom model
    if (project.modelUrl && selectedPresetId === 'project-model') {
      setIsLoading(true);
      setLoadingProgress(10);
      const loader = new GLTFLoader();
      loader.load(
        project.modelUrl,
        (gltf) => {
          setIsLoading(false);
          loadAndMountModel(gltf.scene);
          setLoadError(null);
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
          }
        },
        (error) => {
          console.warn('Failed to load project modelUrl, falling back to procedural BIM:', error);
          setLoadError('Remote GLB could not be retrieved. Loaded procedural high-fidelity BIM twin.');
          setIsLoading(false);
          const fallback = buildProceduralBimModel('cantilever-villa');
          loadAndMountModel(fallback);
        }
      );
      return;
    }

    // Default: load selected procedural preset
    setIsLoading(true);
    setLoadingProgress(40);
    const timer = setTimeout(() => {
      const model = buildProceduralBimModel(selectedPresetId);
      loadAndMountModel(model);
      setIsLoading(false);
      setLoadingProgress(100);
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedPresetId, project.modelUrl, buildProceduralBimModel, loadAndMountModel]);

  // -------------------------------------------------------------
  // DRAG & DROP OR FILE PICKER FOR USER GLB/GLTF
  // -------------------------------------------------------------
  const handleUserGlbUpload = (file: File) => {
    if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
      alert('Please select a valid 3D BIM file (.glb or .gltf)');
      return;
    }

    setIsLoading(true);
    setLoadingProgress(20);
    setCustomModelName(file.name);
    setSelectedPresetId('custom-upload');

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      if (!arrayBuffer) {
        setIsLoading(false);
        return;
      }

      const loader = new GLTFLoader();
      loader.parse(
        arrayBuffer,
        '',
        (gltf) => {
          loadAndMountModel(gltf.scene);
          setIsLoading(false);
          setLoadError(null);
        },
        (err) => {
          console.error('Error parsing GLTF/GLB:', err);
          setLoadError(`Failed to parse 3D file "${file.name}". Ensure it is a valid glTF 2.0 asset.`);
          setIsLoading(false);
        }
      );
    };

    reader.readAsArrayBuffer(file);
  };

  // -------------------------------------------------------------
  // RENDER MODE TOGGLE (PBR, CLAY, WIREFRAME, X-RAY)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!modelGroupRef.current) return;

    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const orig = originalMaterialsMap.current.get(child);

        if (renderMode === 'pbr') {
          if (orig) child.material = orig;
        } else if (renderMode === 'clay') {
          const clayMat = new THREE.MeshStandardMaterial({
            color: 0xf5f5f4, // Architectural stone / plaster white
            roughness: 0.9,
            metalness: 0.05,
            clippingPlanes: clippingPlaneRef.current ? [clippingPlaneRef.current] : []
          });
          child.material = clayMat;
        } else if (renderMode === 'wireframe') {
          const wireMat = new THREE.MeshBasicMaterial({
            color: 0x60a5fa,
            wireframe: true,
            clippingPlanes: clippingPlaneRef.current ? [clippingPlaneRef.current] : []
          });
          child.material = wireMat;
        } else if (renderMode === 'xray') {
          const isCoreOrCol = child.userData?.category?.includes('Column') || child.userData?.category?.includes('Core');
          const xrayMat = new THREE.MeshPhysicalMaterial({
            color: isCoreOrCol ? 0xef4444 : 0x93c5fd,
            transparent: true,
            opacity: isCoreOrCol ? 0.85 : 0.25,
            roughness: 0.2,
            metalness: 0.1,
            clippingPlanes: clippingPlaneRef.current ? [clippingPlaneRef.current] : []
          });
          child.material = xrayMat;
        }
      }
    });
  }, [renderMode]);

  // -------------------------------------------------------------
  // SLICE SECTION PLANE (Y-AXIS FLOOR CUTTER)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!clippingPlaneRef.current || !modelStats.dimensions.y) return;

    // When sliceHeight is 100%, plane is far above building (no cut)
    // When sliceHeight is 0%, plane is at the ground (everything cut)
    const maxHeight = modelStats.dimensions.y * 1.2;
    const currentHeight = (sliceHeight / 100) * maxHeight;

    clippingPlaneRef.current.set(new THREE.Vector3(0, -1, 0), currentHeight);
  }, [sliceHeight, modelStats.dimensions.y]);

  // -------------------------------------------------------------
  // EXPLODED VIEW CALCULATION
  // -------------------------------------------------------------
  useEffect(() => {
    if (!modelGroupRef.current) return;

    const factor = explodeValue / 100; // 0 to 1

    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData?.category) {
        const cat = child.userData.category;
        
        if (cat.includes('Roof') || cat.includes('Canopy')) {
          child.position.y = (child.userData.origY || child.position.y) + factor * 6.0;
        } else if (cat.includes('Cantilever') || cat.includes('Suite')) {
          child.position.x = (child.userData.origX || child.position.x) + factor * 5.0;
        } else if (cat.includes('Curtain Wall')) {
          child.position.z = (child.userData.origZ || child.position.z) + factor * 4.0;
        }
      }
    });
  }, [explodeValue]);

  // -------------------------------------------------------------
  // LIGHTING & ENVIRONMENT ADJUSTMENT
  // -------------------------------------------------------------
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current || !ambientLightRef.current) return;

    if (lightingEnv === 'daylight') {
      sceneRef.current.background = new THREE.Color(0x0f172a);
      dirLightRef.current.color.setHex(0xfffaed);
      dirLightRef.current.intensity = 2.4;
      dirLightRef.current.position.set(30, 45, 25);
      hemiLightRef.current.intensity = 0.8;
      ambientLightRef.current.intensity = 0.7;
    } else if (lightingEnv === 'sunset') {
      sceneRef.current.background = new THREE.Color(0x181024);
      dirLightRef.current.color.setHex(0xf97316);
      dirLightRef.current.intensity = 3.0;
      dirLightRef.current.position.set(40, 15, 20); // Low sun angle
      hemiLightRef.current.intensity = 0.6;
      ambientLightRef.current.intensity = 0.5;
    } else if (lightingEnv === 'studio') {
      sceneRef.current.background = new THREE.Color(0x1e293b);
      dirLightRef.current.color.setHex(0xffffff);
      dirLightRef.current.intensity = 1.8;
      dirLightRef.current.position.set(0, 50, 0);
      hemiLightRef.current.intensity = 1.2;
      ambientLightRef.current.intensity = 1.0;
    } else if (lightingEnv === 'night') {
      sceneRef.current.background = new THREE.Color(0x05070d);
      dirLightRef.current.color.setHex(0x38bdf8);
      dirLightRef.current.intensity = 0.8;
      dirLightRef.current.position.set(-15, 30, -20);
      hemiLightRef.current.intensity = 0.3;
      ambientLightRef.current.intensity = 0.25;
    }
  }, [lightingEnv]);

  // -------------------------------------------------------------
  // CAMERA PRESETS
  // -------------------------------------------------------------
  const applyCameraPreset = (preset: BimCameraPreset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    setCameraPreset(preset);

    const dist = 36;
    const targetY = modelStats.dimensions.y ? modelStats.dimensions.y / 2 : 5;

    if (preset === 'perspective') {
      cameraRef.current.position.set(dist * 0.7, dist * 0.5, dist * 0.7);
    } else if (preset === 'isometric') {
      cameraRef.current.position.set(dist, dist * 0.8, dist);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, dist * 1.2, 0.001);
    } else if (preset === 'front') {
      cameraRef.current.position.set(0, targetY, dist);
    } else if (preset === 'side') {
      cameraRef.current.position.set(dist, targetY, 0);
    }

    controlsRef.current.target.set(0, targetY, 0);
    controlsRef.current.update();
  };

  // -------------------------------------------------------------
  // AUTO ROTATION TOGGLE
  // -------------------------------------------------------------
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  // -------------------------------------------------------------
  // GRID HELPER VISIBILITY
  // -------------------------------------------------------------
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // -------------------------------------------------------------
  // RAYCASTING / ELEMENT SELECTION
  // -------------------------------------------------------------
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !modelGroupRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(modelGroupRef.current.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      if (hit && hit.geometry) {
        const bbox = new THREE.Box3().setFromObject(hit);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        const triangles = hit.geometry.index 
          ? hit.geometry.index.count / 3 
          : hit.geometry.attributes.position.count / 3;

        setSelectedElement({
          id: hit.uuid.slice(0, 8),
          name: hit.userData?.name || hit.name || 'BIM Structural Member',
          category: hit.userData?.category || 'General Component',
          dimensions: {
            x: Number(size.x.toFixed(2)),
            y: Number(size.y.toFixed(2)),
            z: Number(size.z.toFixed(2))
          },
          triangles: Math.round(triangles),
          materialName: Array.isArray(hit.material) 
            ? hit.material.map(m => m.name).join(', ') 
            : hit.material.name || 'Standard Architectural Shader'
        });
        setActiveTab('inspector');
      }
    }
  };

  // -------------------------------------------------------------
  // HIGH-RES VIEWPORT SCREENSHOT DOWNLOAD
  // -------------------------------------------------------------
  const handleCaptureSnapshot = () => {
    if (!canvasRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // Render one frame cleanly
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = canvasRef.current.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = `${project.slug || 'project'}-bim-3d-model.png`;
    link.href = dataUrl;
    link.click();

    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 2500);
  };

  // -------------------------------------------------------------
  // TOGGLE FULLSCREEN
  // -------------------------------------------------------------
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[580px] sm:h-[680px]'
      } ${className}`}
    >
      {/* 3D CANVAS */}
      <div 
        className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files?.[0]) {
            handleUserGlbUpload(e.dataTransfer.files[0]);
          }
        }}
      >
        <canvas 
          ref={canvasRef} 
          onClick={handleCanvasClick}
          className="w-full h-full block" 
        />

        {/* LOADING OVERLAY */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full border-3 border-t-blue-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <div className="text-white font-bold text-sm tracking-wide">Compiling 3D BIM Mesh...</div>
              <div className="text-xs text-blue-400 font-mono">{loadingProgress}% Loaded</div>
            </div>
          </div>
        )}

        {/* TOP BRAND & STATUS BAR */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white font-bold text-xs flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>BIM 3D Engine (glTF/GLB)</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">WebGL 2.0</span>
            </div>

            {customModelName && (
              <div className="px-3 py-1.5 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-300 font-semibold text-xs flex items-center gap-1.5 shadow-md">
                <FileCode className="w-3.5 h-3.5" />
                <span className="max-w-[140px] truncate">{customModelName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Snapshots Button */}
            <button
              onClick={handleCaptureSnapshot}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                snapshotSuccess 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-white/10'
              }`}
              title="Capture 3D Render Snapshot (PNG)"
            >
              {snapshotSuccess ? <Check className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            </button>

            {/* Auto-Rotate Toggle */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                isAutoRotating 
                  ? 'bg-blue-600/30 text-blue-400 border-blue-500/40' 
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border-white/10'
              }`}
              title={isAutoRotating ? 'Pause Auto-Rotation' : 'Start Auto-Rotation'}
            >
              {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 text-slate-200 transition-all cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ERROR / NOTIFICATION TOAST */}
        {loadError && (
          <div className="absolute top-16 left-4 right-4 z-10 p-3 rounded-2xl bg-amber-950/90 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{loadError}</span>
            </div>
            <button onClick={() => setLoadError(null)} className="p-1 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* BOTTOM LEFT: FLOATING QUICK STATS BADGE */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-300 text-[11px] flex items-center gap-3">
            <span>Dimensions: <strong className="text-white font-mono">{modelStats.dimensions.x}m × {modelStats.dimensions.y}m × {modelStats.dimensions.z}m</strong></span>
            <span>• Triangles: <strong className="text-blue-400 font-mono">{modelStats.triangles.toLocaleString()}</strong></span>
            <span>• Meshes: <strong className="text-emerald-400 font-mono">{modelStats.meshes}</strong></span>
          </div>
        </div>
      </div>

      {/* DOCKED BOTTOM CONTROL PANEL */}
      <div className="bg-slate-900/95 border-t border-white/10 p-3 sm:p-4 space-y-3 z-10 backdrop-blur-md">
        
        {/* TAB BAR & TOOLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tools' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>BIM Inspection</span>
            </button>

            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'models' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Models & Upload (.glb)</span>
            </button>

            <button
              onClick={() => setActiveTab('lighting')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'lighting' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Sun & Environment</span>
            </button>

            <button
              onClick={() => setActiveTab('inspector')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'inspector' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Element Inspector {selectedElement && '• (Selected)'}</span>
            </button>
          </div>

          {/* Hidden File Input for Custom GLB/GLTF Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleUserGlbUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer ml-auto"
            title="Upload custom .glb or .gltf BIM model"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload GLB/glTF</span>
          </button>
        </div>

        {/* TAB 1: BIM INSPECTION (RENDER MODE, LIVE SECTION CUT, CAMERA, EXPLODE) */}
        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
            
            {/* 1. Render Mode */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-400" />
                <span>Surface Render Style</span>
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'pbr', label: 'BIM PBR' },
                  { id: 'clay', label: 'Clay White' },
                  { id: 'wireframe', label: 'Wireframe' },
                  { id: 'xray', label: 'X-Ray' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setRenderMode(mode.id as BimRenderMode)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center transition-all cursor-pointer border ${
                      renderMode === mode.id
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-300 hover:text-white border-white/5'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Live Y-Axis Floor Section Plane */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-emerald-400" />
                  <span>Floor Cut Slicer</span>
                </span>
                <span className="font-mono text-emerald-400">{sliceHeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliceHeight}
                onChange={(e) => setSliceHeight(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Ground Level</span>
                <span>Roof Cut</span>
                <span>Full Building</span>
              </div>
            </div>

            {/* 3. Exploded View Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span>Exploded Assembly</span>
                </span>
                <span className="font-mono text-violet-400">{explodeValue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={explodeValue}
                onChange={(e) => setExplodeValue(Number(e.target.value))}
                className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Assembled</span>
                <span>Expanded Envelopes</span>
              </div>
            </div>

            {/* 4. Camera View Angles */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                <span>Camera Angle</span>
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { id: 'perspective', label: '3D' },
                  { id: 'isometric', label: 'Iso' },
                  { id: 'top', label: 'Plan' },
                  { id: 'front', label: 'Front' },
                  { id: 'side', label: 'Side' }
                ].map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => applyCameraPreset(cam.id as BimCameraPreset)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer border ${
                      cameraPreset === cam.id
                        ? 'bg-cyan-600 text-white border-cyan-500'
                        : 'bg-slate-800 text-slate-300 hover:text-white border-white/5'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MODEL SELECTOR & GLB UPLOAD */}
        {activeTab === 'models' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {DEFAULT_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  setCustomModelName(null);
                  setSelectedPresetId(preset.id);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPresetId === preset.id
                    ? 'bg-blue-950/60 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                    : 'bg-slate-800/60 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase">{preset.category}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{preset.stats.lod}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight">{preset.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.description}</p>
                </div>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 mt-2 font-mono">
                  <span>{preset.stats.floors}</span>
                  <span>{preset.stats.area}</span>
                  <span className="text-emerald-400 font-bold">{selectedPresetId === preset.id ? 'Active' : 'Load'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SUNLIGHT & ATMOSPHERE */}
        {activeTab === 'lighting' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {[
              { id: 'daylight', label: 'Solar Daylight', desc: 'Direct 5500K Sun & Crisp Shadows', icon: Sun, color: 'text-amber-400' },
              { id: 'sunset', label: 'Golden Hour Dusk', desc: 'Warm 3200K Low-Angle Horizon', icon: Sunrise, color: 'text-orange-400' },
              { id: 'studio', label: 'Neutral Studio', desc: 'Clean 3-Point Diffuse Illumination', icon: Lightbulb, color: 'text-cyan-400' },
              { id: 'night', label: 'Nocturnal Uplighting', desc: 'Dramatic Facade Night Presentation', icon: Moon, color: 'text-blue-400' }
            ].map((env) => {
              const IconComp = env.icon;
              return (
                <div
                  key={env.id}
                  onClick={() => setLightingEnv(env.id as BimLightingEnv)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    lightingEnv === env.id
                      ? 'bg-blue-950/60 border-blue-500/50 shadow-md'
                      : 'bg-slate-800/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-slate-900 ${env.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{env.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{env.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: ELEMENT INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="p-3 rounded-2xl bg-slate-800/70 border border-white/10 space-y-3">
            {selectedElement ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                      {selectedElement.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ID: {selectedElement.id}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{selectedElement.name}</h4>
                  <div className="text-xs text-slate-400">
                    Material: <strong className="text-slate-200">{selectedElement.materialName}</strong> • Triangles: <strong className="text-emerald-400">{selectedElement.triangles.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-900 p-2.5 rounded-xl border border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Length (X)</span>
                    <span className="font-bold text-white">{selectedElement.dimensions.x}m</span>
                  </div>
                  <div className="border-l border-white/10 pl-3">
                    <span className="text-[10px] text-slate-400 block uppercase">Height (Y)</span>
                    <span className="font-bold text-blue-400">{selectedElement.dimensions.y}m</span>
                  </div>
                  <div className="border-l border-white/10 pl-3">
                    <span className="text-[10px] text-slate-400 block uppercase">Depth (Z)</span>
                    <span className="font-bold text-emerald-400">{selectedElement.dimensions.z}m</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-3 text-slate-400 text-xs flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Click directly on any structural column, curtain wall, or slab in the 3D model above to inspect its real-time BIM geometry and dimensions.</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
