import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Box, 
  RotateCw, 
  Layers, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Download, 
  Camera, 
  Sun, 
  Moon, 
  Sunrise,
  Sunset,
  Lightbulb,
  Compass, 
  Sparkles, 
  Grid, 
  Info, 
  HelpCircle, 
  ShieldCheck, 
  FileCode, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Play, 
  Pause, 
  Move3d,
  ChevronRight,
  ChevronDown,
  Check,
  Sliders,
  X,
  Share2
} from 'lucide-react';
import { Project } from '../../types';

export type ModelAssetType = 'exterior' | 'structural' | 'floorplan' | 'canopy' | 'site';
export type RenderMode = 'solid' | 'wireframe' | 'xray' | 'blueprint';
export type LightingEnvironment = 'daylight' | 'sunset' | 'studio' | 'night' | 'morning';
export type TimeOfDay = LightingEnvironment;
export type CameraPreset = 'perspective' | 'isometric' | 'front' | 'side' | 'top';

export interface LightingEnvironmentOption {
  id: LightingEnvironment;
  label: string;
  shortLabel: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBg: string;
  badge: string;
}

export const LIGHTING_ENVIRONMENTS: LightingEnvironmentOption[] = [
  {
    id: 'daylight',
    label: 'Daylight',
    shortLabel: 'Daylight',
    tagline: 'High solar direct illumination & crisp architectural shadows',
    icon: Sun,
    color: 'text-amber-400',
    activeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    badge: 'Solar 5500K'
  },
  {
    id: 'sunset',
    label: 'Sunset',
    shortLabel: 'Sunset',
    tagline: 'Warm golden hour dusk with elongated atmospheric shadows',
    icon: Sunset,
    color: 'text-orange-400',
    activeBg: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
    badge: 'Golden 3200K'
  },
  {
    id: 'studio',
    label: 'Studio Lighting',
    shortLabel: 'Studio',
    tagline: 'Balanced 3-point soft diffuse lighting for BIM structure inspection',
    icon: Lightbulb,
    color: 'text-cyan-400',
    activeBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    badge: 'Neutral 4500K'
  },
  {
    id: 'night',
    label: 'Night Architectural',
    shortLabel: 'Night',
    tagline: 'Nocturnal ambient atmosphere with dramatic facade uplighting',
    icon: Moon,
    color: 'text-blue-400',
    activeBg: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
    badge: 'Nocturnal'
  },
  {
    id: 'morning',
    label: 'Morning Dawn',
    shortLabel: 'Morning',
    tagline: 'Crisp early morning sunrise with soft warm ambient gradients',
    icon: Sunrise,
    color: 'text-amber-300',
    activeBg: 'bg-amber-500/20 border-amber-400/40 text-amber-200',
    badge: 'Sunrise'
  }
];

interface Hotspot {
  id: string;
  name: string;
  category: string;
  pos: [number, number, number]; // x, y (up), z
  title: string;
  description: string;
  specs: { label: string; value: string }[];
}

interface ArchitecturalModelViewerProps {
  project: Project;
  className?: string;
}

export const ArchitecturalModelViewer: React.FC<ArchitecturalModelViewerProps> = ({
  project,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lightingMenuRef = useRef<HTMLDivElement | null>(null);

  // Viewer State
  const [selectedAsset, setSelectedAsset] = useState<ModelAssetType>('exterior');
  const [renderMode, setRenderMode] = useState<RenderMode>('solid');
  const [timeOfDay, setTimeOfDay] = useState<LightingEnvironment>('daylight');
  const [showLightingMenu, setShowLightingMenu] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [explodeValue, setExplodeValue] = useState<number>(0); // 0 to 1
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 800, height: 500 });
  const [capturedFlash, setCapturedFlash] = useState<boolean>(false);
  const [snapshotToast, setSnapshotToast] = useState<{ visible: boolean; message: string; filename: string } | null>(null);
  const [showSnapshotMenu, setShowSnapshotMenu] = useState<boolean>(false);
  const [snapshotResolution, setSnapshotResolution] = useState<'viewport' | '2k' | '4k'>('2k');
  const [includeTitleBlock, setIncludeTitleBlock] = useState<boolean>(true);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 3D Camera & Transform State (Angles in radians, zoom scale, offset pan)
  const cameraRef = useRef<{
    rotX: number; // Pitch
    rotY: number; // Yaw
    zoom: number;
    panX: number;
    panY: number;
    targetRotX: number;
    targetRotY: number;
    targetZoom: number;
    targetPanX: number;
    targetPanY: number;
  }>({
    rotX: 0.45,
    rotY: -0.65,
    zoom: 1.0,
    panX: 0,
    panY: 0,
    targetRotX: 0.45,
    targetRotY: -0.65,
    targetZoom: 1.0,
    targetPanX: 0,
    targetPanY: 0
  });

  // Mouse & Touch interaction tracking
  const isDraggingRef = useRef<boolean>(false);
  const isPanningRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);

  // Model Hotspot Annotations
  const hotspots: Hotspot[] = useMemo(() => [
    {
      id: 'hs-cantilever',
      name: 'Balcony Overhang & Glass Balustrade',
      category: 'Structural Architecture',
      pos: [1.8, 1.2, 1.4],
      title: 'Post-Tensioned Cantilever Balcony',
      description: 'Extended 1.8m cantilever with Fe500D rebar reinforcement and side-fascia anchor bracket preserving top waterproofing membrane.',
      specs: [
        { label: 'Span / Overhang', value: '1.80 m' },
        { label: 'Rebar Grade', value: 'Fe500D TMT Bars' },
        { label: 'Live Load Rating', value: '3.0 kN/m²' },
        { label: 'Balustrade', value: '12mm Toughened Laminated Glass' }
      ]
    },
    {
      id: 'hs-curtainwall',
      name: 'Double-Glazed Facade',
      category: 'Building Envelope',
      pos: [-1.6, 0.8, 1.5],
      title: 'Acoustic & Low-E Curtain Wall',
      description: 'Thermally broken aluminum mullions with double-glazed solar control Low-E glass minimizing HVAC heat ingress.',
      specs: [
        { label: 'U-Value', value: '1.4 W/m²K' },
        { label: 'Acoustic Rating', value: 'STC 42 dB' },
        { label: 'Glazing Unit', value: '6mm Low-E + 12mm Argon + 6mm Clear' },
        { label: 'Wind Resistance', value: '2.4 kPa' }
      ]
    },
    {
      id: 'hs-pergola',
      name: 'Solar Pergola & Green Roof',
      category: 'Sustainable Systems',
      pos: [0.0, 2.5, -0.2],
      title: 'BIPV Solar Canopy & Rooftop Deck',
      description: 'Integrated monocrystalline photovoltaic solar louvers providing shade and 12.5 kWp off-grid renewable power generation.',
      specs: [
        { label: 'Capacity', value: '12.5 kWp Solar' },
        { label: 'Louver Material', value: 'Anodized Architectural Aluminum' },
        { label: 'Decking', value: 'Composite Thermal Ash Wood' },
        { label: 'Drainage', value: 'Siphonic Rainwater Harvesting' }
      ]
    },
    {
      id: 'hs-pool',
      name: 'Cantilever Infinity Pool',
      category: 'Civil & Hydraulic',
      pos: [1.6, -0.4, -1.2],
      title: 'Infinity Horizon Pool & Balance Tank',
      description: 'High-density cast-in-situ concrete pool shell with dual-stage crystalline waterproofing and perimeter infinity weir.',
      specs: [
        { label: 'Volume', value: '65,000 Liters' },
        { label: 'Waterproofing', value: 'Hydrophobic Crystalline Admixture' },
        { label: 'Tile Finish', value: 'Sukabumi Green Natural Stone' },
        { label: 'Filtration', value: 'Glass Media & UV Ozone Sanitation' }
      ]
    },
    {
      id: 'hs-foundation',
      name: 'Reinforced Concrete Foundation',
      category: 'Sub-Structure',
      pos: [0.0, -1.5, 0.0],
      title: 'Raft Foundation & Bored Piles',
      description: 'Monolithic RCC raft foundation designed for high seismic ductility conforming to IS 1893 & IS 13920 seismic standards.',
      specs: [
        { label: 'Concrete Grade', value: 'M35 Self-Compacting RCC' },
        { label: 'Depth', value: '3.2m Below Natural Ground' },
        { label: 'Soil Bearing', value: '220 kN/m²' },
        { label: 'Seismic Zone', value: 'Zone IV Compliant' }
      ]
    }
  ], []);

  // Set Camera Preset Handler
  const applyCameraPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    setIsAutoRotating(false);
    const cam = cameraRef.current;
    
    switch (preset) {
      case 'perspective':
        cam.targetRotX = 0.45;
        cam.targetRotY = -0.65;
        cam.targetZoom = 1.0;
        cam.targetPanX = 0;
        cam.targetPanY = 0;
        break;
      case 'isometric':
        cam.targetRotX = Math.atan(1 / Math.sqrt(2)); // ~35.26 deg
        cam.targetRotY = Math.PI / 4; // 45 deg
        cam.targetZoom = 1.1;
        cam.targetPanX = 0;
        cam.targetPanY = 0;
        break;
      case 'front':
        cam.targetRotX = 0;
        cam.targetRotY = 0;
        cam.targetZoom = 1.15;
        cam.targetPanX = 0;
        cam.targetPanY = 0;
        break;
      case 'side':
        cam.targetRotX = 0;
        cam.targetRotY = Math.PI / 2;
        cam.targetZoom = 1.15;
        cam.targetPanX = 0;
        cam.targetPanY = 0;
        break;
      case 'top':
        cam.targetRotX = Math.PI / 2;
        cam.targetRotY = 0;
        cam.targetZoom = 1.1;
        cam.targetPanX = 0;
        cam.targetPanY = 0;
        break;
    }
  }, []);

  // Focus on specific Hotspot
  const handleSelectHotspot = (hs: Hotspot) => {
    setSelectedHotspot(hs);
    setIsAutoRotating(false);
    const cam = cameraRef.current;
    // Calculate angle towards hotspot
    const angleY = Math.atan2(hs.pos[0], hs.pos[2]);
    cam.targetRotY = angleY + 0.3;
    cam.targetRotX = 0.35;
    cam.targetZoom = 1.45;
    cam.targetPanX = -hs.pos[0] * 30;
    cam.targetPanY = hs.pos[1] * 30;
  };

  // Reset Camera View
  const handleResetCamera = () => {
    applyCameraPreset('perspective');
    setSelectedHotspot(null);
    setExplodeValue(0);
  };

  // ResizeObserver for canvas dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasDimensions({
          width: Math.max(320, Math.floor(rect.width)),
          height: isFullscreen ? Math.floor(window.innerHeight) : Math.max(380, Math.min(620, Math.floor(rect.width * 0.58)))
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen]);

  // Main 3D Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Helper: 3D Point transformation & projection
    const projectPoint = (
      p: [number, number, number],
      rotX: number,
      rotY: number,
      zoom: number,
      panX: number,
      panY: number,
      cx: number,
      cy: number,
      scale: number
    ): { x: number; y: number; z: number; depth: number } => {
      // 1. Rotate Y (Yaw)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = p[0] * cosY - p[2] * sinY;
      const z1 = p[0] * sinY + p[2] * cosY;

      // 2. Rotate X (Pitch)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = p[1] * cosX - z1 * sinX;
      const z2 = p[1] * sinX + z1 * cosX;

      // 3. Perspective factor
      const fov = 800;
      const cameraDistance = 7.5;
      const distance = z2 + cameraDistance;
      const perspective = fov / Math.max(1, distance);

      return {
        x: cx + (x1 * scale * zoom * perspective) / fov + panX,
        y: cy - (y2 * scale * zoom * perspective) / fov + panY,
        z: z2,
        depth: distance
      };
    };

    // Lighting color palette based on Lighting Environment Preset
    const getLightingPalette = (env: LightingEnvironment | string) => {
      switch (env) {
        case 'morning':
          return {
            bgTop: '#0b1329',
            bgBottom: '#1e1b38',
            ambient: '#ffd8a8',
            lightDir: [0.8, 0.5, 0.6],
            sunIntensity: 0.9,
            gridColor: 'rgba(255, 200, 150, 0.08)',
            shadowAlpha: 0.45
          };
        case 'daylight':
        case 'noon':
          return {
            bgTop: '#090d16',
            bgBottom: '#111827',
            ambient: '#ffffff',
            lightDir: [0.3, 0.9, 0.4],
            sunIntensity: 1.0,
            gridColor: 'rgba(59, 130, 246, 0.12)',
            shadowAlpha: 0.5
          };
        case 'sunset':
          return {
            bgTop: '#180e29',
            bgBottom: '#29141e',
            ambient: '#ff922b',
            lightDir: [-0.9, 0.3, 0.5],
            sunIntensity: 0.85,
            gridColor: 'rgba(249, 115, 22, 0.1)',
            shadowAlpha: 0.55
          };
        case 'studio':
          return {
            bgTop: '#131b2a',
            bgBottom: '#0a0e17',
            ambient: '#f8fafc',
            lightDir: [0.55, 0.8, 0.6],
            sunIntensity: 0.95,
            gridColor: 'rgba(148, 163, 184, 0.14)',
            shadowAlpha: 0.38
          };
        case 'night':
        default:
          return {
            bgTop: '#030712',
            bgBottom: '#0a0f1d',
            ambient: '#38bdf8',
            lightDir: [0.2, 0.4, 0.9],
            sunIntensity: 0.6,
            gridColor: 'rgba(56, 189, 248, 0.06)',
            shadowAlpha: 0.7
          };
      }
    };

    // Render Frame Function
    const render = () => {
      const { width, height } = canvas;
      const cam = cameraRef.current;

      // Smooth Camera Damping (Inertia interpolation)
      if (isAutoRotating && !isDraggingRef.current) {
        cam.targetRotY += 0.004;
      }

      cam.rotX += (cam.targetRotX - cam.rotX) * 0.1;
      cam.rotY += (cam.targetRotY - cam.rotY) * 0.1;
      cam.zoom += (cam.targetZoom - cam.zoom) * 0.1;
      cam.panX += (cam.targetPanX - cam.panX) * 0.1;
      cam.panY += (cam.targetPanY - cam.panY) * 0.1;

      const cx = width / 2;
      const cy = height / 2;
      const baseScale = Math.min(width, height) * 0.28;
      const lighting = getLightingPalette(timeOfDay);

      // 1. Draw Canvas Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (renderMode === 'blueprint') {
        bgGrad.addColorStop(0, '#0a1d37');
        bgGrad.addColorStop(1, '#061124');
      } else {
        bgGrad.addColorStop(0, lighting.bgTop);
        bgGrad.addColorStop(1, lighting.bgBottom);
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw 3D Ground Grid & Coordinate Plane
      if (showGrid) {
        ctx.save();
        ctx.lineWidth = 1;
        const gridSize = 8;
        const gridStep = 0.8;
        const gridY = -1.6;

        ctx.strokeStyle = renderMode === 'blueprint' ? 'rgba(56, 189, 248, 0.2)' : lighting.gridColor;

        for (let i = -gridSize; i <= gridSize; i++) {
          const p1 = projectPoint([i * gridStep, gridY, -gridSize * gridStep], cam.rotX, cam.rotY, cam.zoom, cam.panX, cam.panY, cx, cy, baseScale);
          const p2 = projectPoint([i * gridStep, gridY, gridSize * gridStep], cam.rotX, cam.rotY, cam.zoom, cam.panX, cam.panY, cx, cy, baseScale);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          const p3 = projectPoint([-gridSize * gridStep, gridY, i * gridStep], cam.rotX, cam.rotY, cam.zoom, cam.panX, cam.panY, cx, cy, baseScale);
          const p4 = projectPoint([gridSize * gridStep, gridY, i * gridStep], cam.rotX, cam.rotY, cam.zoom, cam.panX, cam.panY, cx, cy, baseScale);
          ctx.beginPath();
          ctx.moveTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.stroke();
        }

        // Draw compass axis indicator
        const orig = projectPoint([0, gridY, 0], cam.rotX, cam.rotY, cam.zoom, cam.panX, cam.panY, cx, cy, baseScale);
        const axisX = projectPoint([1.5, gridY, 0], cam.rotX, cam.rotY, cam.zoom, cam.panX, cam.panY, cx, cy, baseScale);
        const axisZ = projectPoint([0, gridY, 1.5], cam.rotX, cam.rotY, cam.zoom, cam.panX, cam.panY, cx, cy, baseScale);

        // X-Axis (Red)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(orig.x, orig.y);
        ctx.lineTo(axisX.x, axisX.y);
        ctx.stroke();

        // Z-Axis (Blue)
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.beginPath();
        ctx.moveTo(orig.x, orig.y);
        ctx.lineTo(axisZ.x, axisZ.y);
        ctx.stroke();

        ctx.restore();
      }

      // 3. Define 3D Building Geometry Prisms & Mesh Faces
      // Explode offsets dynamically separate the roof, floor 2, floor 1, and foundation
      const exp = explodeValue * 1.8;

      interface Face {
        vertices: [number, number, number][];
        color: string;
        strokeColor?: string;
        category: 'exterior' | 'structural' | 'floorplan' | 'canopy' | 'site';
        normal: [number, number, number];
        isGlass?: boolean;
        isWater?: boolean;
        isRebar?: boolean;
      }

      const faces: Face[] = [];

      // Helper to generate 6 faces of a box prism
      const addBox = (
        min: [number, number, number],
        max: [number, number, number],
        color: string,
        category: 'exterior' | 'structural' | 'floorplan' | 'canopy' | 'site',
        isGlass = false,
        isWater = false,
        isRebar = false
      ) => {
        const [x0, y0, z0] = min;
        const [x1, y1, z1] = max;

        // 6 Quads
        // Front (+Z)
        faces.push({
          vertices: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
          color,
          category,
          normal: [0, 0, 1],
          isGlass,
          isWater,
          isRebar
        });
        // Back (-Z)
        faces.push({
          vertices: [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]],
          color,
          category,
          normal: [0, 0, -1],
          isGlass,
          isWater,
          isRebar
        });
        // Top (+Y)
        faces.push({
          vertices: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]],
          color,
          category,
          normal: [0, 1, 0],
          isGlass,
          isWater,
          isRebar
        });
        // Bottom (-Y)
        faces.push({
          vertices: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]],
          color,
          category,
          normal: [0, -1, 0],
          isGlass,
          isWater,
          isRebar
        });
        // Right (+X)
        faces.push({
          vertices: [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]],
          color,
          category,
          normal: [1, 0, 0],
          isGlass,
          isWater,
          isRebar
        });
        // Left (-X)
        faces.push({
          vertices: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]],
          color,
          category,
          normal: [-1, 0, 0],
          isGlass,
          isWater,
          isRebar
        });
      };

      // --- 1. Foundation & Substructure (Category: site / structural) ---
      const foundY = -1.5 - exp * 0.6;
      addBox([-2.6, foundY, -2.4], [2.6, foundY + 0.35, 2.4], '#334155', 'structural'); // Raft Footing
      // Foundation Piles
      [-2.0, 0, 2.0].forEach(px => {
        [-1.8, 0, 1.8].forEach(pz => {
          addBox([px - 0.15, foundY - 0.7, pz - 0.15], [px + 0.15, foundY, pz + 0.15], '#1e293b', 'structural');
        });
      });

      // --- 2. Ground Level Podium & Infinity Pool (Category: site / exterior) ---
      const groundY = -1.1 - exp * 0.2;
      addBox([-2.4, groundY, -2.2], [2.4, groundY + 0.3, 2.2], '#475569', 'exterior'); // Ground Podium
      // Infinity Pool Basin & Water
      addBox([1.2, groundY + 0.05, -1.8], [2.3, groundY + 0.25, -0.6], '#0284c7', 'site', false, true); // Water
      addBox([1.1, groundY, -1.9], [2.4, groundY + 0.28, -0.5], '#38bdf8', 'site', true); // Pool Glass Edge

      // --- 3. Ground Floor Main Volume & Glazing (Category: exterior / floorplan) ---
      const gfY = -0.7;
      // Concrete Core & Walls
      addBox([-2.0, gfY, -1.8], [0.8, gfY + 1.1, 1.6], '#e2e8f0', 'exterior');
      // Entrance Glazed Portico
      addBox([-1.9, gfY + 0.1, 1.61], [-0.4, gfY + 0.95, 1.63], '#38bdf8', 'exterior', true);
      // Double Height Side Glazing
      addBox([-2.02, gfY + 0.2, -1.2], [-2.0, gfY + 0.9, 1.0], '#0ea5e9', 'exterior', true);

      // --- Structural Columns (Category: structural) ---
      [[-1.8, -1.6], [0.6, -1.6], [-1.8, 1.4], [0.6, 1.4], [1.8, 1.2], [1.8, -0.8]].forEach(([cxPos, czPos]) => {
        addBox([cxPos - 0.08, gfY - 0.1, czPos - 0.08], [cxPos + 0.08, gfY + 1.2, czPos + 0.08], '#0284c7', 'structural', false, false, true);
      });

      // --- 4. First Floor Intermediate Slab & Cantilever (Category: structural / floorplan) ---
      const slabY = 0.45 + exp * 0.5;
      addBox([-2.2, slabY, -1.9], [2.2, slabY + 0.2, 1.9], '#94a3b8', 'structural'); // Main Slab
      // Cantilever Balcony Extension (+X and +Z)
      addBox([0.6, slabY, 0.4], [2.3, slabY + 0.18, 1.8], '#f8fafc', 'exterior'); // Balcony Slab
      // Balcony Glass Balustrade
      addBox([0.6, slabY + 0.18, 1.78], [2.3, slabY + 0.65, 1.8], '#38bdf8', 'exterior', true);
      addBox([2.28, slabY + 0.18, 0.4], [2.3, slabY + 0.65, 1.8], '#38bdf8', 'exterior', true);

      // --- 5. Upper Level Living & Master Bedroom Suite (Category: exterior / floorplan) ---
      const ufY = 0.65 + exp * 0.5;
      addBox([-1.8, ufY, -1.6], [1.5, ufY + 1.0, 1.3], '#f1f5f9', 'exterior'); // Upper volume
      // Master Suite Panoramic Corner Glazing
      addBox([-0.2, ufY + 0.1, 1.31], [1.4, ufY + 0.85, 1.33], '#0284c7', 'exterior', true);
      addBox([1.48, ufY + 0.1, -0.4], [1.51, ufY + 0.85, 1.3], '#0284c7', 'exterior', true);
      // Wood Cladding Accent Wall
      addBox([-1.82, ufY, -0.6], [-1.8, ufY + 1.0, 1.0], '#d97706', 'exterior');

      // --- 6. Roof Slab, Pergola & Solar PV Canopy (Category: canopy / exterior) ---
      const roofY = 1.7 + exp * 1.2;
      addBox([-2.1, roofY, -1.8], [1.8, roofY + 0.18, 1.6], '#64748b', 'canopy'); // Roof Slab
      // Solar Pergola Structure (Stands + PV Array)
      [[-1.4, -1.2], [1.2, -1.2], [-1.4, 1.0], [1.2, 1.0]].forEach(([px, pz]) => {
        addBox([px - 0.05, roofY + 0.18, pz - 0.05], [px + 0.05, roofY + 0.7, pz + 0.05], '#1e293b', 'canopy');
      });
      // Solar Panels Glass Surface
      addBox([-1.5, roofY + 0.7, -1.3], [1.3, roofY + 0.75, 1.1], '#1e3a8a', 'canopy', true);
      // Pergola Louver Blades
      for (let lz = -1.2; lz <= 1.0; lz += 0.3) {
        addBox([-1.5, roofY + 0.68, lz - 0.04], [1.3, roofY + 0.72, lz + 0.04], '#0f172a', 'canopy');
      }

      // Filter faces according to Selected Asset
      const filteredFaces = faces.filter(f => {
        if (selectedAsset === 'exterior') return true;
        if (selectedAsset === 'structural') return f.category === 'structural' || f.isRebar;
        if (selectedAsset === 'floorplan') return f.category === 'floorplan' || f.category === 'exterior';
        if (selectedAsset === 'canopy') return f.category === 'canopy' || f.category === 'exterior';
        if (selectedAsset === 'site') return f.category === 'site' || f.category === 'exterior';
        return true;
      });

      // 4. Project and Depth Sort All Faces (Painter's Algorithm)
      interface ProjectedFace {
        face: Face;
        points: { x: number; y: number; z: number }[];
        avgZ: number;
        intensity: number;
      }

      const projectedFaces: ProjectedFace[] = [];

      for (const face of filteredFaces) {
        const pts = face.vertices.map(v => 
          projectPoint(v, cam.rotX, cam.rotY, cam.zoom, cam.panX, cam.panY, cx, cy, baseScale)
        );

        const avgZ = pts.reduce((sum, p) => sum + p.z, 0) / pts.length;

        // Calculate Simple Lambertian Diffuse Lighting
        const [nx, ny, nz] = face.normal;
        // Transform normal with camera rotation
        const cosY = Math.cos(cam.rotY);
        const sinY = Math.sin(cam.rotY);
        const rnx = nx * cosY - nz * sinY;
        const rnz = nx * sinY + nz * cosY;

        const cosX = Math.cos(cam.rotX);
        const sinX = Math.sin(cam.rotX);
        const rny = ny * cosX - rnz * sinX;
        const trnz = ny * sinX + rnz * cosX;

        // Dot product with sun light direction
        const [lx, ly, lz] = lighting.lightDir;
        const dot = Math.max(0.15, (rnx * lx + rny * ly + trnz * lz));
        const intensity = Math.min(1.2, dot * lighting.sunIntensity + 0.25);

        projectedFaces.push({
          face,
          points: pts,
          avgZ,
          intensity
        });
      }

      // Sort back-to-front (lowest avgZ furthest away)
      projectedFaces.sort((a, b) => a.avgZ - b.avgZ);

      // 5. Draw Faces
      ctx.save();
      for (const pFace of projectedFaces) {
        const { face, points, intensity } = pFace;
        if (points.length < 3) continue;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();

        // Render Mode Styling
        if (renderMode === 'solid') {
          if (face.isWater) {
            ctx.fillStyle = timeOfDay === 'night' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(14, 165, 233, 0.75)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1.5;
          } else if (face.isGlass) {
            ctx.fillStyle = timeOfDay === 'night' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(186, 230, 253, 0.45)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 1;
          } else if (face.isRebar) {
            ctx.fillStyle = '#0284c7';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
          } else {
            // Apply lighting intensity to base color
            ctx.fillStyle = face.color;
            ctx.globalAlpha = 0.95;
            ctx.fill();

            // Overlay shadow / highlight tint
            if (intensity < 0.6) {
              ctx.fillStyle = `rgba(0, 0, 0, ${(0.6 - intensity) * 0.7})`;
              ctx.fill();
            } else if (intensity > 0.8) {
              ctx.fillStyle = `rgba(255, 255, 255, ${(intensity - 0.8) * 0.3})`;
              ctx.fill();
            }
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
            ctx.lineWidth = 0.75;
          }
          ctx.stroke();
        } else if (renderMode === 'wireframe') {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
          ctx.fill();
          ctx.strokeStyle = face.isGlass ? '#38bdf8' : (face.isRebar ? '#10b981' : '#60a5fa');
          ctx.lineWidth = face.isRebar ? 1.5 : 0.8;
          ctx.stroke();

          // Draw vertex dots
          points.forEach(pt => {
            ctx.fillStyle = '#93c5fd';
            ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3);
          });
        } else if (renderMode === 'xray') {
          ctx.fillStyle = face.isGlass ? 'rgba(56, 189, 248, 0.25)' : (face.isRebar ? 'rgba(16, 185, 129, 0.6)' : 'rgba(99, 102, 241, 0.15)');
          ctx.fill();
          ctx.strokeStyle = face.isRebar ? '#34d399' : 'rgba(165, 180, 252, 0.4)';
          ctx.lineWidth = face.isRebar ? 1.5 : 0.75;
          ctx.stroke();
        } else if (renderMode === 'blueprint') {
          ctx.fillStyle = 'rgba(10, 29, 55, 0.7)';
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.restore();

      // 6. Draw 3D Hotspot Pins & Annotations
      if (showHotspots) {
        ctx.save();
        for (const hs of hotspots) {
          const pt = projectPoint(hs.pos, cam.rotX, cam.rotY, cam.zoom, cam.panX, cam.panY, cx, cy, baseScale);
          const isSelected = selectedHotspot?.id === hs.id;

          // Pulse glow circle
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isSelected ? 14 : 9, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(59, 130, 246, 0.4)' : 'rgba(234, 179, 8, 0.25)';
          ctx.fill();

          // Inner pin solid
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isSelected ? 8 : 5, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? '#3b82f6' : '#eab308';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.fill();
          ctx.stroke();

          // Hotspot text label
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 4;
          const textWidth = ctx.measureText(hs.name).width;
          
          // Badge background
          ctx.fillStyle = isSelected ? 'rgba(30, 58, 138, 0.9)' : 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = isSelected ? '#60a5fa' : 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1;
          const bgX = pt.x + 12;
          const bgY = pt.y - 12;
          ctx.beginPath();
          ctx.roundRect(bgX, bgY, textWidth + 14, 18, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.fillText(hs.name, bgX + 7, bgY + 12);
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedAsset, renderMode, timeOfDay, showGrid, showHotspots, explodeValue, selectedHotspot, isAutoRotating]);

  // Pointer & Drag Handlers for Rotation and Pan
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    isPanningRef.current = e.button === 2 || e.shiftKey;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoRotating(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    const cam = cameraRef.current;

    if (isPanningRef.current) {
      cam.targetPanX += dx;
      cam.targetPanY += dy;
    } else {
      cam.targetRotY += dx * 0.008;
      cam.targetRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, cam.targetRotX - dy * 0.008));
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    const cam = cameraRef.current;
    cam.targetZoom = Math.max(0.4, Math.min(3.0, cam.targetZoom + zoomDelta));
  };

  // Canvas Click for Hotspot Selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const cam = cameraRef.current;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const baseScale = Math.min(canvas.width, canvas.height) * 0.28;

    // Check hit within 20px radius of any hotspot
    for (const hs of hotspots) {
      // Manual project
      const cosY = Math.cos(cam.rotY);
      const sinY = Math.sin(cam.rotY);
      const x1 = hs.pos[0] * cosY - hs.pos[2] * sinY;
      const z1 = hs.pos[0] * sinY + hs.pos[2] * cosY;

      const cosX = Math.cos(cam.rotX);
      const sinX = Math.sin(cam.rotX);
      const y2 = hs.pos[1] * cosX - z1 * sinX;
      const z2 = hs.pos[1] * sinX + z1 * cosX;

      const fov = 800;
      const distance = z2 + 7.5;
      const perspective = fov / Math.max(1, distance);

      const px = cx + (x1 * baseScale * cam.zoom * perspective) / fov + cam.panX;
      const py = cy - (y2 * baseScale * cam.zoom * perspective) / fov + cam.panY;

      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < 22) {
        handleSelectHotspot(hs);
        return;
      }
    }
  };

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (lightingMenuRef.current && !lightingMenuRef.current.contains(event.target as Node)) {
        setShowLightingMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-hide UI controls after 3 seconds of inactivity
  const resetInactivityTimer = useCallback(() => {
    setIsControlsVisible(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  }, []);

  // Set up mouse/pointer activity listeners on container to reveal controls & reset timer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleActivity = () => {
      resetInactivityTimer();
    };

    container.addEventListener('mousemove', handleActivity);
    container.addEventListener('pointermove', handleActivity);
    container.addEventListener('pointerdown', handleActivity);
    container.addEventListener('touchstart', handleActivity, { passive: true });
    container.addEventListener('touchmove', handleActivity, { passive: true });
    container.addEventListener('wheel', handleActivity, { passive: true });

    // Initial 3-second timer on mount
    resetInactivityTimer();

    return () => {
      container.removeEventListener('mousemove', handleActivity);
      container.removeEventListener('pointermove', handleActivity);
      container.removeEventListener('pointerdown', handleActivity);
      container.removeEventListener('touchstart', handleActivity);
      container.removeEventListener('touchmove', handleActivity);
      container.removeEventListener('wheel', handleActivity);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  // Determine whether UI controls should be rendered as visible
  const isUIVisible = useMemo(() => {
    return (
      isControlsVisible ||
      showLightingMenu ||
      showSnapshotMenu ||
      showInfoPanel ||
      selectedHotspot !== null ||
      showControlsGuide
    );
  }, [isControlsVisible, showLightingMenu, showSnapshotMenu, showInfoPanel, selectedHotspot, showControlsGuide]);

  // Quick Cycle through Lighting Environments
  const cycleLightingEnvironment = useCallback(() => {
    const list: LightingEnvironment[] = ['daylight', 'sunset', 'studio', 'night', 'morning'];
    const currIdx = list.indexOf(timeOfDay);
    const nextIdx = (currIdx + 1) % list.length;
    setTimeOfDay(list[nextIdx]);
  }, [timeOfDay]);

  // Current Active Lighting Environment Config
  const currentLightingOpt = useMemo(() => {
    return LIGHTING_ENVIRONMENTS.find(l => l.id === timeOfDay) || LIGHTING_ENVIRONMENTS[0];
  }, [timeOfDay]);

  // Synthesize acoustic camera shutter feedback
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch {
      // AudioContext not allowed or uninitialized
    }
  };

  // Helper: Draw 3D scene onto any Canvas Context (used for both live canvas and off-screen high-res renders)
  const drawSceneToContext = useCallback((
    targetCtx: CanvasRenderingContext2D,
    targetWidth: number,
    targetHeight: number,
    optTitleBlock = false
  ) => {
    const cam = cameraRef.current;
    const cx = targetWidth / 2;
    const cy = targetHeight / 2;
    const baseScale = Math.min(targetWidth, targetHeight) * 0.28;

    // Helper: Project point
    const projPt = (p: [number, number, number]): { x: number; y: number; z: number; depth: number } => {
      const cosY = Math.cos(cam.rotY);
      const sinY = Math.sin(cam.rotY);
      const x1 = p[0] * cosY - p[2] * sinY;
      const z1 = p[0] * sinY + p[2] * cosY;

      const cosX = Math.cos(cam.rotX);
      const sinX = Math.sin(cam.rotX);
      const y2 = p[1] * cosX - z1 * sinX;
      const z2 = p[1] * sinX + z1 * cosX;

      const fov = 800;
      const cameraDistance = 7.5;
      const distance = z2 + cameraDistance;
      const perspective = fov / Math.max(1, distance);

      return {
        x: cx + (x1 * baseScale * cam.zoom * perspective) / fov + (cam.panX * (targetWidth / 800)),
        y: cy - (y2 * baseScale * cam.zoom * perspective) / fov + (cam.panY * (targetHeight / 500)),
        z: z2,
        depth: distance
      };
    };

    // Lighting config
    const getLighting = (env: LightingEnvironment | string) => {
      switch (env) {
        case 'morning':
          return { bgTop: '#0b1329', bgBottom: '#1e1b38', sunIntensity: 0.9, lightDir: [0.8, 0.5, 0.6], gridColor: 'rgba(255, 200, 150, 0.08)' };
        case 'daylight':
        case 'noon':
          return { bgTop: '#090d16', bgBottom: '#111827', sunIntensity: 1.0, lightDir: [0.3, 0.9, 0.4], gridColor: 'rgba(59, 130, 246, 0.12)' };
        case 'sunset':
          return { bgTop: '#180e29', bgBottom: '#29141e', sunIntensity: 0.85, lightDir: [-0.9, 0.3, 0.5], gridColor: 'rgba(249, 115, 22, 0.1)' };
        case 'studio':
          return { bgTop: '#131b2a', bgBottom: '#0a0e17', sunIntensity: 0.95, lightDir: [0.55, 0.8, 0.6], gridColor: 'rgba(148, 163, 184, 0.14)' };
        case 'night':
        default:
          return { bgTop: '#030712', bgBottom: '#0a0f1d', sunIntensity: 0.6, lightDir: [0.2, 0.4, 0.9], gridColor: 'rgba(56, 189, 248, 0.06)' };
      }
    };
    const lighting = getLighting(timeOfDay);

    // 1. Background
    const bgGrad = targetCtx.createLinearGradient(0, 0, 0, targetHeight);
    if (renderMode === 'blueprint') {
      bgGrad.addColorStop(0, '#0a1d37');
      bgGrad.addColorStop(1, '#061124');
    } else {
      bgGrad.addColorStop(0, lighting.bgTop);
      bgGrad.addColorStop(1, lighting.bgBottom);
    }
    targetCtx.fillStyle = bgGrad;
    targetCtx.fillRect(0, 0, targetWidth, targetHeight);

    // 2. Ground Grid
    if (showGrid) {
      targetCtx.save();
      targetCtx.lineWidth = Math.max(1, targetWidth / 1200);
      targetCtx.strokeStyle = renderMode === 'blueprint' ? 'rgba(56, 189, 248, 0.2)' : lighting.gridColor;
      const gridSize = 8;
      const gridStep = 0.8;
      const gridY = -1.6;

      for (let i = -gridSize; i <= gridSize; i++) {
        const p1 = projPt([i * gridStep, gridY, -gridSize * gridStep]);
        const p2 = projPt([i * gridStep, gridY, gridSize * gridStep]);
        targetCtx.beginPath();
        targetCtx.moveTo(p1.x, p1.y);
        targetCtx.lineTo(p2.x, p2.y);
        targetCtx.stroke();

        const p3 = projPt([-gridSize * gridStep, gridY, i * gridStep]);
        const p4 = projPt([gridSize * gridStep, gridY, i * gridStep]);
        targetCtx.beginPath();
        targetCtx.moveTo(p3.x, p3.y);
        targetCtx.lineTo(p4.x, p4.y);
        targetCtx.stroke();
      }
      targetCtx.restore();
    }

    // 3. Geometry Mesh Faces
    const exp = explodeValue * 1.8;
    interface FaceItem {
      vertices: [number, number, number][];
      color: string;
      category: string;
      normal: [number, number, number];
      isGlass?: boolean;
      isWater?: boolean;
      isRebar?: boolean;
    }
    const facesList: FaceItem[] = [];

    const addBoxItem = (
      min: [number, number, number],
      max: [number, number, number],
      color: string,
      category: string,
      isGlass = false,
      isWater = false,
      isRebar = false
    ) => {
      const [x0, y0, z0] = min;
      const [x1, y1, z1] = max;
      facesList.push({ vertices: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], color, category, normal: [0, 0, 1], isGlass, isWater, isRebar });
      facesList.push({ vertices: [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], color, category, normal: [0, 0, -1], isGlass, isWater, isRebar });
      facesList.push({ vertices: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], color, category, normal: [0, 1, 0], isGlass, isWater, isRebar });
      facesList.push({ vertices: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], color, category, normal: [0, -1, 0], isGlass, isWater, isRebar });
      facesList.push({ vertices: [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], color, category, normal: [1, 0, 0], isGlass, isWater, isRebar });
      facesList.push({ vertices: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], color, category, normal: [-1, 0, 0], isGlass, isWater, isRebar });
    };

    // Substructure
    const foundY = -1.5 - exp * 0.6;
    addBoxItem([-2.6, foundY, -2.4], [2.6, foundY + 0.35, 2.4], '#334155', 'structural');
    [-2.0, 0, 2.0].forEach(px => {
      [-1.8, 0, 1.8].forEach(pz => {
        addBoxItem([px - 0.15, foundY - 0.7, pz - 0.15], [px + 0.15, foundY, pz + 0.15], '#1e293b', 'structural');
      });
    });

    // Ground Podium & Infinity Pool
    const groundY = -1.1 - exp * 0.2;
    addBoxItem([-2.4, groundY, -2.2], [2.4, groundY + 0.3, 2.2], '#475569', 'exterior');
    addBoxItem([1.2, groundY + 0.05, -1.8], [2.3, groundY + 0.25, -0.6], '#0284c7', 'site', false, true);
    addBoxItem([1.1, groundY, -1.9], [2.4, groundY + 0.28, -0.5], '#38bdf8', 'site', true);

    // Ground Floor
    const gfY = -0.7;
    addBoxItem([-2.0, gfY, -1.8], [0.8, gfY + 1.1, 1.6], '#e2e8f0', 'exterior');
    addBoxItem([-1.9, gfY + 0.1, 1.61], [-0.4, gfY + 0.95, 1.63], '#38bdf8', 'exterior', true);
    addBoxItem([-2.02, gfY + 0.2, -1.2], [-2.0, gfY + 0.9, 1.0], '#0ea5e9', 'exterior', true);

    // Columns
    [[-1.8, -1.6], [0.6, -1.6], [-1.8, 1.4], [0.6, 1.4], [1.8, 1.2], [1.8, -0.8]].forEach(([cxPos, czPos]) => {
      addBoxItem([cxPos - 0.08, gfY - 0.1, czPos - 0.08], [cxPos + 0.08, gfY + 1.2, czPos + 0.08], '#0284c7', 'structural', false, false, true);
    });

    // First Floor Slab & Cantilever
    const slabY = 0.45 + exp * 0.5;
    addBoxItem([-2.2, slabY, -1.9], [2.2, slabY + 0.2, 1.9], '#94a3b8', 'structural');
    addBoxItem([0.6, slabY, 0.4], [2.3, slabY + 0.18, 1.8], '#f8fafc', 'exterior');
    addBoxItem([0.6, slabY + 0.18, 1.78], [2.3, slabY + 0.65, 1.8], '#38bdf8', 'exterior', true);
    addBoxItem([2.28, slabY + 0.18, 0.4], [2.3, slabY + 0.65, 1.8], '#38bdf8', 'exterior', true);

    // Upper Level Living
    const ufY = 0.65 + exp * 0.5;
    addBoxItem([-1.8, ufY, -1.6], [1.5, ufY + 1.0, 1.3], '#f1f5f9', 'exterior');
    addBoxItem([-0.2, ufY + 0.1, 1.31], [1.4, ufY + 0.85, 1.33], '#0284c7', 'exterior', true);
    addBoxItem([1.48, ufY + 0.1, -0.4], [1.51, ufY + 0.85, 1.3], '#0284c7', 'exterior', true);
    addBoxItem([-1.82, ufY, -0.6], [-1.8, ufY + 1.0, 1.0], '#d97706', 'exterior');

    // Roof & Solar Pergola
    const roofY = 1.7 + exp * 1.2;
    addBoxItem([-2.1, roofY, -1.8], [1.8, roofY + 0.18, 1.6], '#64748b', 'canopy');
    [[-1.4, -1.2], [1.2, -1.2], [-1.4, 1.0], [1.2, 1.0]].forEach(([px, pz]) => {
      addBoxItem([px - 0.05, roofY + 0.18, pz - 0.05], [px + 0.05, roofY + 0.7, pz + 0.05], '#1e293b', 'canopy');
    });
    addBoxItem([-1.5, roofY + 0.7, -1.3], [1.3, roofY + 0.75, 1.1], '#1e3a8a', 'canopy', true);
    for (let lz = -1.2; lz <= 1.0; lz += 0.3) {
      addBoxItem([-1.5, roofY + 0.68, lz - 0.04], [1.3, roofY + 0.72, lz + 0.04], '#0f172a', 'canopy');
    }

    const filtered = facesList.filter(f => {
      if (selectedAsset === 'exterior') return true;
      if (selectedAsset === 'structural') return f.category === 'structural' || f.isRebar;
      if (selectedAsset === 'floorplan') return f.category === 'floorplan' || f.category === 'exterior';
      if (selectedAsset === 'canopy') return f.category === 'canopy' || f.category === 'exterior';
      if (selectedAsset === 'site') return f.category === 'site' || f.category === 'exterior';
      return true;
    });

    const projected = filtered.map(face => {
      const pts = face.vertices.map(v => projPt(v));
      const avgZ = pts.reduce((sum, p) => sum + p.z, 0) / pts.length;
      const [nx, ny, nz] = face.normal;
      const cosY = Math.cos(cam.rotY);
      const sinY = Math.sin(cam.rotY);
      const rnx = nx * cosY - nz * sinY;
      const rnz = nx * sinY + nz * cosY;
      const cosX = Math.cos(cam.rotX);
      const sinX = Math.sin(cam.rotX);
      const rny = ny * cosX - rnz * sinX;
      const trnz = ny * sinX + rnz * cosX;
      const [lx, ly, lz] = lighting.lightDir;
      const dot = Math.max(0.15, (rnx * lx + rny * ly + trnz * lz));
      const intensity = Math.min(1.2, dot * lighting.sunIntensity + 0.25);
      return { face, points: pts, avgZ, intensity };
    });

    projected.sort((a, b) => a.avgZ - b.avgZ);

    targetCtx.save();
    for (const pFace of projected) {
      const { face, points, intensity } = pFace;
      if (points.length < 3) continue;

      targetCtx.beginPath();
      targetCtx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        targetCtx.lineTo(points[i].x, points[i].y);
      }
      targetCtx.closePath();

      if (renderMode === 'solid') {
        if (face.isWater) {
          targetCtx.fillStyle = timeOfDay === 'night' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(14, 165, 233, 0.75)';
          targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          targetCtx.lineWidth = 1.5;
        } else if (face.isGlass) {
          targetCtx.fillStyle = timeOfDay === 'night' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(186, 230, 253, 0.45)';
          targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          targetCtx.lineWidth = 1;
        } else if (face.isRebar) {
          targetCtx.fillStyle = '#0284c7';
          targetCtx.strokeStyle = '#38bdf8';
          targetCtx.lineWidth = 1.5;
        } else {
          targetCtx.fillStyle = face.color;
          targetCtx.globalAlpha = 0.95;
          targetCtx.fill();
          if (intensity < 0.6) {
            targetCtx.fillStyle = `rgba(0, 0, 0, ${(0.6 - intensity) * 0.7})`;
            targetCtx.fill();
          } else if (intensity > 0.8) {
            targetCtx.fillStyle = `rgba(255, 255, 255, ${(intensity - 0.8) * 0.3})`;
            targetCtx.fill();
          }
          targetCtx.globalAlpha = 1.0;
          targetCtx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
          targetCtx.lineWidth = 0.75;
        }
        targetCtx.stroke();
      } else if (renderMode === 'wireframe') {
        targetCtx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        targetCtx.fill();
        targetCtx.strokeStyle = face.isGlass ? '#38bdf8' : (face.isRebar ? '#10b981' : '#60a5fa');
        targetCtx.lineWidth = face.isRebar ? 1.5 : 0.8;
        targetCtx.stroke();
      } else if (renderMode === 'xray') {
        targetCtx.fillStyle = face.isGlass ? 'rgba(56, 189, 248, 0.25)' : (face.isRebar ? 'rgba(16, 185, 129, 0.6)' : 'rgba(99, 102, 241, 0.15)');
        targetCtx.fill();
        targetCtx.strokeStyle = face.isRebar ? '#34d399' : 'rgba(165, 180, 252, 0.4)';
        targetCtx.lineWidth = face.isRebar ? 1.5 : 0.75;
        targetCtx.stroke();
      } else if (renderMode === 'blueprint') {
        targetCtx.fillStyle = 'rgba(10, 29, 55, 0.7)';
        targetCtx.fill();
        targetCtx.strokeStyle = '#38bdf8';
        targetCtx.lineWidth = 1;
        targetCtx.stroke();
      }
    }
    targetCtx.restore();

    // 4. Professional Architectural Title Block Watermark (if enabled)
    if (optTitleBlock) {
      targetCtx.save();
      const scaleFactor = targetWidth / 1920;
      const pad = Math.round(24 * scaleFactor);
      const tbWidth = Math.round(440 * scaleFactor);
      const tbHeight = Math.round(110 * scaleFactor);
      const tbX = targetWidth - tbWidth - pad;
      const tbY = targetHeight - tbHeight - pad;

      // Outer drawing boundary frame
      targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      targetCtx.lineWidth = Math.max(1, Math.round(2 * scaleFactor));
      targetCtx.strokeRect(pad, pad, targetWidth - pad * 2, targetHeight - pad * 2);

      // Title Block Box
      targetCtx.fillStyle = 'rgba(9, 13, 22, 0.92)';
      targetCtx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      targetCtx.lineWidth = Math.max(1, Math.round(1.5 * scaleFactor));
      targetCtx.beginPath();
      targetCtx.roundRect(tbX, tbY, tbWidth, tbHeight, Math.round(10 * scaleFactor));
      targetCtx.fill();
      targetCtx.stroke();

      // Title text
      targetCtx.fillStyle = '#ffffff';
      targetCtx.font = `bold ${Math.round(15 * scaleFactor)}px sans-serif`;
      targetCtx.fillText(project.title, tbX + 16 * scaleFactor, tbY + 28 * scaleFactor);

      targetCtx.fillStyle = '#60a5fa';
      targetCtx.font = `bold ${Math.round(11 * scaleFactor)}px sans-serif`;
      targetCtx.fillText('FIZA HAYAT ARCHITECTURAL & STRUCTURAL ENGINEERING', tbX + 16 * scaleFactor, tbY + 48 * scaleFactor);

      targetCtx.fillStyle = '#94a3b8';
      targetCtx.font = `${Math.round(10 * scaleFactor)}px monospace`;
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      const angleStr = `Pitch: ${(cam.rotX * 180 / Math.PI).toFixed(0)}° | Yaw: ${(cam.rotY * 180 / Math.PI).toFixed(0)}° | Zoom: ${(cam.zoom * 100).toFixed(0)}%`;
      targetCtx.fillText(`3D BIM Perspective | ${angleStr}`, tbX + 16 * scaleFactor, tbY + 70 * scaleFactor);
      targetCtx.fillText(`LOD 350 BIM Snapshot • ${dateStr} • Revit & IFC Format`, tbX + 16 * scaleFactor, tbY + 90 * scaleFactor);

      targetCtx.restore();
    }
  }, [selectedAsset, renderMode, timeOfDay, showGrid, explodeValue, project.title]);

  // Capture High-Res Snapshot Handler with Custom Resolution & Title Block
  const handleCaptureSnapshot = (res: 'viewport' | '2k' | '4k' = snapshotResolution, withTitleBlock = includeTitleBlock) => {
    // 1. Shutter sound & flash effect
    playShutterSound();
    setCapturedFlash(true);
    setTimeout(() => setCapturedFlash(false), 350);

    // 2. Determine output dimensions
    let outWidth = canvasDimensions.width;
    let outHeight = canvasDimensions.height;
    let resLabel = 'HD';

    if (res === '2k') {
      outWidth = 2560;
      outHeight = 1440;
      resLabel = '2K-QHD';
    } else if (res === '4k') {
      outWidth = 3840;
      outHeight = 2160;
      resLabel = '4K-UHD';
    }

    // 3. Render on dedicated off-screen high-res canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = outWidth;
    offCanvas.height = outHeight;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    drawSceneToContext(offCtx, outWidth, outHeight, withTitleBlock);

    // 4. Download file
    const safeSlug = (project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-+|-+$/g, '');
    const filename = `${safeSlug}-3D-BIM-Snapshot-${resLabel}.png`;
    const imageUri = offCanvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = filename;
    link.href = imageUri;
    link.click();

    // 5. Toast Feedback
    setShowSnapshotMenu(false);
    setSnapshotToast({
      visible: true,
      message: `High-Resolution (${outWidth}×${outHeight} px) Snapshot successfully captured and downloaded!`,
      filename
    });
    setTimeout(() => {
      setSnapshotToast(null);
    }, 4500);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={resetInactivityTimer}
      onPointerMove={resetInactivityTimer}
      onPointerDown={resetInactivityTimer}
      onTouchStart={resetInactivityTimer}
      onTouchMove={resetInactivityTimer}
      onWheel={resetInactivityTimer}
      className={`rounded-3xl bg-neutral-950 border border-white/10 overflow-hidden shadow-2xl flex flex-col relative transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : className
      }`}
    >
      {/* Visual Shutter Flash on Snapshot */}
      {capturedFlash && (
        <div className="absolute inset-0 bg-white/40 z-40 pointer-events-none transition-opacity duration-300" />
      )}

      {/* 1. TOP HEADER & ASSET SELECTOR */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-neutral-950 via-neutral-900 to-indigo-950/70 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-20">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Move3d className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2">
                <span>Interactive 3D Architectural Model</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                  LOD 350 BIM
                </span>
              </h3>
            </div>
            <p className="text-neutral-400 text-xs flex items-center gap-2 mt-0.5">
              <span>{project.title}</span>
              <span>•</span>
              <span className="text-blue-400 font-medium">BIM Format: IFC 4.3 / RVT 2026</span>
            </p>
          </div>
        </div>

        {/* Primary Asset Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto p-1 rounded-2xl bg-neutral-900/90 border border-white/5 text-xs">
          {[
            { id: 'exterior', label: 'Full Building Massing', icon: Box },
            { id: 'structural', label: 'RCC Rebar Skeleton', icon: Layers },
            { id: 'floorplan', label: 'Floor Plates & Interior', icon: Grid },
            { id: 'canopy', label: 'Solar Pergola & Roof', icon: Sun },
            { id: 'site', label: 'Infinity Pool & Site', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = selectedAsset === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedAsset(tab.id as ModelAssetType);
                  setSelectedHotspot(null);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUB-TOOLBAR: RENDERING MODES, LIGHTING & CAMERA CONTROLS (With Auto-Hide) */}
      <div 
        className={`px-4 py-2 bg-neutral-900/80 backdrop-blur-md border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs relative z-20 transition-all duration-500 ease-in-out ${
          isUIVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        
        {/* Shading Style Selectors */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hidden sm:inline">Shading:</span>
          <div className="flex items-center space-x-1 p-0.5 rounded-xl bg-neutral-950 border border-white/10">
            {[
              { id: 'solid', label: 'Solid Render' },
              { id: 'wireframe', label: 'CAD Wireframe' },
              { id: 'xray', label: 'X-Ray BIM' },
              { id: 'blueprint', label: 'Blueprint' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setRenderMode(m.id as RenderMode)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  renderMode === m.id
                    ? 'bg-neutral-800 text-blue-400 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Camera Views & Lighting Environment */}
        <div className="flex items-center space-x-2">
          {/* Lighting Environment Dropdown Menu */}
          <div className="relative" ref={lightingMenuRef}>
            <div className="flex items-center space-x-1 p-0.5 rounded-xl bg-neutral-950 border border-white/10">
              <button
                onClick={() => setShowLightingMenu(!showLightingMenu)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  showLightingMenu 
                    ? 'bg-blue-600/30 border border-blue-500/40 text-white shadow-sm' 
                    : `${currentLightingOpt.activeBg}`
                }`}
                title="Select Lighting Environment (Daylight, Sunset, Studio Lighting, Night)"
              >
                {React.createElement(currentLightingOpt.icon, { className: `w-3.5 h-3.5 ${currentLightingOpt.color}` })}
                <span className="text-[11px] font-bold">{currentLightingOpt.label}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${showLightingMenu ? 'rotate-180 text-white' : ''}`} />
              </button>

              {/* Quick cycle button */}
              <button
                onClick={cycleLightingEnvironment}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-all"
                title="Cycle to next lighting environment (Daylight → Sunset → Studio → Night → Morning)"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* FLOATING LIGHTING DROPDOWN MENU */}
            {showLightingMenu && (
              <div className="absolute top-full left-0 mt-2 z-50 w-72 p-2 rounded-2xl bg-neutral-950/95 backdrop-blur-xl border border-white/15 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center justify-between border-b border-white/5">
                  <span>Lighting Environments</span>
                  <span className="text-blue-400 font-mono text-[9px]">Shader Atmosphere</span>
                </div>
                {LIGHTING_ENVIRONMENTS.map(env => {
                  const EnvIcon = env.icon;
                  const isActive = timeOfDay === env.id;
                  return (
                    <button
                      key={env.id}
                      onClick={() => {
                        setTimeOfDay(env.id);
                        setShowLightingMenu(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white shadow-sm'
                          : 'hover:bg-neutral-900/80 text-neutral-300 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-neutral-400'}`}>
                        <EnvIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs">{env.label}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-neutral-900 text-neutral-400 border border-white/5 shrink-0">
                            {env.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">{env.tagline}</p>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-blue-400 mt-1 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Camera Angles */}
          <div className="flex items-center space-x-1 p-0.5 rounded-xl bg-neutral-950 border border-white/10 hidden md:flex">
            {[
              { id: 'perspective', label: 'Perspective' },
              { id: 'isometric', label: 'Axonometric' },
              { id: 'front', label: 'Elevation' },
              { id: 'top', label: 'Plan' }
            ].map(cp => (
              <button
                key={cp.id}
                onClick={() => applyCameraPreset(cp.id as CameraPreset)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  cameraPreset === cp.id
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cp.label}
              </button>
            ))}
          </div>

          {/* Auto 360° Slow Rotation Toggle Switch */}
          <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-neutral-950 border border-white/10">
            <button
              role="switch"
              aria-checked={isAutoRotating}
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-2 py-1 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                isAutoRotating
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title={isAutoRotating ? 'Disable automatic slow 360° rotation animation' : 'Enable automatic slow 360° rotation animation'}
            >
              <div className="flex items-center gap-1.5">
                <RotateCw 
                  className={`w-3.5 h-3.5 transition-transform duration-700 ${isAutoRotating ? 'text-emerald-400 animate-spin' : 'text-neutral-400'}`} 
                  style={{ animationDuration: '6s' }} 
                />
                <span className="text-[11px] font-bold select-none hidden sm:inline">360° Spin</span>
              </div>

              {/* Toggle Switch Track & Sliding Knob */}
              <div 
                className={`w-7 h-3.5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                  isAutoRotating ? 'bg-emerald-500 justify-end' : 'bg-neutral-800 justify-start'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm transform transition-transform duration-200" />
              </div>
            </button>
          </div>

          {/* Take Snapshot Action Button */}
          <div className="relative">
            <button
              onClick={() => handleCaptureSnapshot(snapshotResolution, includeTitleBlock)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer transition-all active:scale-95"
              title="Take Snapshot (Download High-Resolution PNG image of Current View)"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Take Snapshot</span>
            </button>
          </div>

          {/* Screenshot Settings & Format Options Toggle */}
          <button
            onClick={() => setShowSnapshotMenu(!showSnapshotMenu)}
            className={`p-1.5 rounded-xl border flex items-center gap-1 cursor-pointer transition-all ${
              showSnapshotMenu
                ? 'bg-blue-600/30 border-blue-500/40 text-blue-300'
                : 'bg-neutral-950 hover:bg-neutral-800 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title="Snapshot Export Options (2K / 4K / Title Block)"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold hidden lg:inline">HD/4K Settings</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-white/10 text-neutral-400 hover:text-white cursor-pointer transition-all"
            title="Reset Camera View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. MAIN CANVAS 3D INTERACTIVE VIEWPORT */}
      <div className="relative flex-1 bg-neutral-950 overflow-hidden select-none">
        
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          onClick={handleCanvasClick}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* FLOATING OVERLAY: EXPLODED AXONOMETRIC SLIDER */}
        <div 
          className={`absolute top-4 left-4 z-20 p-3 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-white/10 shadow-xl space-y-1.5 max-w-[200px] transition-all duration-500 ease-in-out ${
            isUIVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-300">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-blue-400" />
              <span>Explode Slabs</span>
            </span>
            <span className="text-blue-400 font-mono text-[10px]">
              {Math.round(explodeValue * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodeValue}
            onChange={(e) => {
              setExplodeValue(parseFloat(e.target.value));
              setIsAutoRotating(false);
            }}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
            <span>Compact</span>
            <span>Exploded</span>
          </div>
        </div>

        {/* FLOATING OVERLAY: HOTSPOT INSPECTION DETAIL MODAL */}
        {selectedHotspot && (
          <div className="absolute top-4 right-4 z-30 w-72 sm:w-80 p-4 rounded-3xl bg-neutral-900/95 backdrop-blur-xl border border-blue-500/50 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[9px] uppercase tracking-wider border border-blue-500/30">
                  {selectedHotspot.category}
                </span>
                <h4 className="text-sm font-extrabold text-white mt-1">
                  {selectedHotspot.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {selectedHotspot.description}
            </p>

            {/* Technical Specifications Grid */}
            <div className="p-2.5 rounded-2xl bg-neutral-950/80 border border-white/5 divide-y divide-white/5 text-xs">
              {selectedHotspot.specs.map((spec, i) => (
                <div key={i} className="py-1.5 flex justify-between">
                  <span className="text-neutral-400 text-[11px]">{spec.label}</span>
                  <span className="text-white font-mono font-bold text-[11px]">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Code Verified (IS 456 & Eurocode)</span>
              </span>
              <button
                onClick={() => handleResetCamera()}
                className="text-[10px] text-blue-400 hover:underline font-bold cursor-pointer"
              >
                Reset View
              </button>
            </div>
          </div>
        )}

        {/* FLOATING OVERLAY: NAVIGATION INSTRUCTIONS / CONTROLS HINT */}
        <div 
          className={`absolute bottom-4 left-4 z-20 flex items-center space-x-2 transition-all duration-500 ease-in-out ${
            isUIVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="px-3 py-1.5 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-white/10 text-neutral-400 text-[11px] font-medium flex items-center space-x-3">
            <span>🖱️ <strong>Left Click + Drag:</strong> Orbit</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">📜 <strong>Scroll:</strong> Zoom</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">📍 <strong>Click Pins:</strong> Inspect BIM Specs</span>
          </div>

          <button
            onClick={() => setShowControlsGuide(!showControlsGuide)}
            className="p-1.5 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-white/10 text-neutral-400 hover:text-white cursor-pointer"
            title="Help & Controls"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* FLOATING OVERLAY: BOTTOM RIGHT UTILITY BAR (Zoom, Snapshot, Fullscreen, Info) */}
        <div 
          className={`absolute bottom-4 right-4 z-20 flex items-center space-x-2 transition-all duration-500 ease-in-out ${
            isUIVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          
          {/* Zoom In / Out */}
          <div className="flex items-center p-0.5 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-white/10">
            <button
              onClick={() => {
                cameraRef.current.targetZoom = Math.min(3.0, cameraRef.current.targetZoom + 0.25);
              }}
              className="p-1.5 text-neutral-400 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                cameraRef.current.targetZoom = Math.max(0.4, cameraRef.current.targetZoom - 0.25);
              }}
              className="p-1.5 text-neutral-400 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Grid */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl backdrop-blur-md border cursor-pointer transition-all ${
              showGrid 
                ? 'bg-blue-600/30 border-blue-500/40 text-blue-300' 
                : 'bg-neutral-950/80 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title="Toggle Ground Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Toggle Hotspot Pins */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`p-2 rounded-xl backdrop-blur-md border cursor-pointer transition-all ${
              showHotspots 
                ? 'bg-amber-500/30 border-amber-500/40 text-amber-300' 
                : 'bg-neutral-950/80 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title="Toggle Inspection Pins"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Toggle 360° Auto-Rotation in Bottom Dock */}
          <button
            role="switch"
            aria-checked={isAutoRotating}
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-xl backdrop-blur-md border cursor-pointer transition-all ${
              isAutoRotating
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm'
                : 'bg-neutral-950/80 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title={isAutoRotating ? 'Pause 360° Auto-Rotation' : 'Enable 360° Auto-Rotation'}
          >
            <RotateCw 
              className={`w-4 h-4 transition-transform duration-700 ${isAutoRotating ? 'animate-spin text-emerald-400' : ''}`} 
              style={{ animationDuration: '6s' }} 
            />
          </button>

          {/* Quick Lighting Preset Cycle */}
          <button
            onClick={cycleLightingEnvironment}
            className={`p-2 rounded-xl backdrop-blur-md border cursor-pointer transition-all ${currentLightingOpt.activeBg}`}
            title={`Lighting: ${currentLightingOpt.label} (Click to Cycle: Daylight → Sunset → Studio → Night → Morning)`}
          >
            {React.createElement(currentLightingOpt.icon, { className: 'w-4 h-4' })}
          </button>

          {/* Take Snapshot Button in Bottom Dock */}
          <button
            onClick={() => handleCaptureSnapshot(snapshotResolution, includeTitleBlock)}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-md border border-blue-500/40 shadow-lg shadow-blue-600/30 cursor-pointer transition-all active:scale-95"
            title="Take Snapshot (Save High-Res PNG Image to Device)"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Take Snapshot</span>
          </button>

          {/* Asset Technical Info Drawer Toggle */}
          <button
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            className={`p-2 rounded-xl backdrop-blur-md border cursor-pointer transition-all ${
              showInfoPanel 
                ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300' 
                : 'bg-neutral-950/80 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title="Asset BIM & Mesh Info"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Fullscreen Mode */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white cursor-pointer transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* FLOATING POPUP: SNAPSHOT EXPORT SETTINGS MODAL */}
        {showSnapshotMenu && (
          <div className="absolute top-16 right-4 z-40 w-80 p-5 rounded-3xl bg-neutral-950/95 backdrop-blur-xl border border-blue-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-blue-600/20 text-blue-400">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Snapshot Studio</h4>
                  <p className="text-[10px] text-neutral-400">Export high-resolution 3D perspectives</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSnapshotMenu(false)}
                className="p-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Resolution Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                Export Resolution:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'viewport', label: '1080p Viewport', desc: 'Fast render' },
                  { id: '2k', label: '2K QHD', desc: '2560 × 1440' },
                  { id: '4k', label: '4K Ultra-HD', desc: '3840 × 2160' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSnapshotResolution(r.id as 'viewport' | '2k' | '4k')}
                    className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                      snapshotResolution === r.id
                        ? 'bg-blue-600/30 border-blue-500 text-white shadow-md'
                        : 'bg-neutral-900/80 border-white/5 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">{r.label}</div>
                    <div className="text-[9px] text-neutral-500 font-mono mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Block Watermark Toggle */}
            <div className="p-3 rounded-2xl bg-neutral-900/60 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Architectural Title Block</span>
                <span className="text-[10px] text-neutral-400 block">Include watermark stamp with project specs & date</span>
              </div>
              <input
                type="checkbox"
                checked={includeTitleBlock}
                onChange={(e) => setIncludeTitleBlock(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-neutral-800 border-white/20 cursor-pointer accent-blue-500"
              />
            </div>

            {/* Download Action CTA */}
            <button
              onClick={() => handleCaptureSnapshot(snapshotResolution, includeTitleBlock)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all active:scale-98"
            >
              <Camera className="w-4 h-4" />
              <span>Download {snapshotResolution.toUpperCase()} Snapshot (PNG)</span>
            </button>
          </div>
        )}

        {/* FLOATING SUCCESS TOAST */}
        {snapshotToast && snapshotToast.visible && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-emerald-500/50 shadow-2xl text-white text-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-md">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-emerald-300">Perspective Snapshot Downloaded!</div>
              <div className="text-[11px] text-neutral-300">{snapshotToast.message}</div>
              <div className="text-[10px] text-blue-400 font-mono mt-0.5">{snapshotToast.filename}</div>
            </div>
            <button
              onClick={() => setSnapshotToast(null)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ASSET METADATA PANEL DRAWER (Expandable) */}
        {showInfoPanel && (
          <div className="absolute top-16 right-4 z-30 w-72 p-4 rounded-3xl bg-neutral-950/95 backdrop-blur-xl border border-white/10 shadow-2xl space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h5 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span>BIM Asset Parameters</span>
              </h5>
              <button onClick={() => setShowInfoPanel(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-white/5 text-[11px]">
              <div className="py-1.5 flex justify-between">
                <span className="text-neutral-400">Level of Dev (LOD)</span>
                <span className="text-emerald-400 font-bold">LOD 350 (Fabrication Ready)</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-neutral-400">Coordinates System</span>
                <span className="text-white font-mono">EPSG:7755 (WGS 84)</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-neutral-400">Mesh Polygons</span>
                <span className="text-blue-300 font-mono">14,280 Triangles</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-neutral-400">Structural Software</span>
                <span className="text-white">Autodesk Revit & ETABS</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-neutral-400">Building Footprint</span>
                <span className="text-white font-mono">24.5m × 18.2m × 8.4m</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
