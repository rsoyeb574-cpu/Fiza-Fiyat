import { Project } from '../types';

export interface NormalizedProjectSpecs {
  estimatedCost: string;
  costNumeric: number;
  costPerSqFt: string;
  area: string;
  duration: string;
  structuralType: string;
  floors: string;
  energyRating: string;
  bimLevel: string;
  materials: string[];
  deliverables: string[];
  softwareUsed: string[];
  costBreakdown: {
    architectural: string;
    bimAnd3d: string;
    engineering: string;
    constructionEst: string;
  };
}

export function getProjectSpecs(project: Project): NormalizedProjectSpecs {
  // If project already has explicit values, use them
  if (project.estimatedCost && project.area && project.structuralType) {
    return {
      estimatedCost: project.estimatedCost,
      costNumeric: project.costNumeric || parseCostNumber(project.estimatedCost),
      costPerSqFt: project.costPerSqFt || '$240 / sq.ft',
      area: project.area,
      duration: project.duration || '6 Months',
      structuralType: project.structuralType,
      floors: project.floors || '2 Levels',
      energyRating: project.energyRating || 'High-Efficiency Eco Standard',
      bimLevel: project.bimLevel || 'LOD 350 (Coordination & Estimation)',
      materials: project.materials && project.materials.length > 0
        ? project.materials
        : ['Reinforced Concrete', 'Performance Glazing', 'Architectural Timber', 'Engineered Cladding'],
      deliverables: project.deliverables && project.deliverables.length > 0
        ? project.deliverables
        : ['Architectural 2D Drawings', '3D Photorealistic Renders', 'BIM Coordination Model', 'Material Schedules'],
      softwareUsed: project.softwareUsed || ['AutoCAD', '3ds Max', 'Revit'],
      costBreakdown: {
        architectural: project.costBreakdown?.architectural || formatCurrency((project.costNumeric || 500000) * 0.08),
        bimAnd3d: project.costBreakdown?.bimAnd3d || formatCurrency((project.costNumeric || 500000) * 0.04),
        engineering: project.costBreakdown?.engineering || formatCurrency((project.costNumeric || 500000) * 0.06),
        constructionEst: project.costBreakdown?.constructionEst || formatCurrency((project.costNumeric || 500000) * 0.82)
      }
    };
  }

  // Graceful intelligent defaults based on category and tags
  const cat = (project.categoryName || '').toLowerCase();
  const title = (project.title || '').toLowerCase();

  let estimatedCost = '$450,000';
  let costNumeric = 450000;
  let costPerSqFt = '$220 / sq.ft';
  let area = '4,000 sq.ft';
  let duration = '6 Months';
  let structuralType = 'Reinforced Concrete Post & Beam';
  let floors = '2 Floors + Penthouse';
  let energyRating = 'LEED Gold Certified / High-Efficiency Envelope';
  let bimLevel = 'LOD 350 (Architectural & MEP Coordination)';
  let materials = ['Honed Limestone', 'Low-E Performance Glass', 'Anodized Bronze Cladding', 'Engineered Hardwood'];
  let deliverables = ['Full 2D CAD Plans', '3D Render Package', 'Revit BIM File', 'Bill of Quantities'];

  if (cat.includes('architecture') || title.includes('villa') || title.includes('residence') || title.includes('tower')) {
    estimatedCost = '$1,650,000';
    costNumeric = 1650000;
    costPerSqFt = '$275 / sq.ft';
    area = '6,000 sq.ft';
    duration = '12 Months';
    structuralType = 'Post-Tensioned Concrete & Structural Steel Frame';
    floors = '3 Levels + Terrace';
    energyRating = 'LEED Platinum / Net-Zero Energy Ready';
    bimLevel = 'LOD 400 (Fabrication & Construction Detailing)';
    materials = ['Acoustic Triple-Glazing', 'Natural Travertine Marble', 'Weathering Zinc Paneling', 'Thermally-Treated Timber'];
    deliverables = ['Permit Drawing Set', 'LOD 400 Revit BIM Model', '8K Unreal Engine Walkthrough', 'MEP Clash Detection Report'];
  } else if (cat.includes('interior') || title.includes('penthouse') || title.includes('apartment')) {
    estimatedCost = '$380,000';
    costNumeric = 380000;
    costPerSqFt = '$125 / sq.ft';
    area = '3,200 sq.ft';
    duration = '4.5 Months';
    structuralType = 'Interior Architectural Fit-Out & Acoustic Partitions';
    floors = '1 Level (Luxury Penthouse)';
    energyRating = 'Smart KNX Energy Management / Low-VOC Finishes';
    bimLevel = 'LOD 350 (Millwork & FF&E Package)';
    materials = ['Calacatta Marble', 'Brushed Brass Metalwork', 'Acoustic Fluted Oak', 'Venetian Plaster'];
    deliverables = ['Joinery & Millwork Drawings', 'Lighting Automation Schematic', 'FF&E Material Specification Book', '8K Still Visualizations'];
  } else if (cat.includes('bim') || cat.includes('rendering') || title.includes('bim')) {
    estimatedCost = '$5,200,000';
    costNumeric = 5200000;
    costPerSqFt = '$310 / sq.ft';
    area = '18,500 sq.ft (Built-up)';
    duration = '18 Months';
    structuralType = 'Composite Steel Deck & Diagrid Bracing';
    floors = '12 Stories + 2 Underground Basements';
    energyRating = 'BREEAM Excellent / Zero Carbon Ready';
    bimLevel = 'LOD 450 (Digital Twin & Asset Management)';
    materials = ['Structural High-Grade Steel', 'Curtain Wall Double-Skin Facade', 'Lightweight Aerated Slabs'];
    deliverables = ['Multi-Disciplinary Revit Model', 'Navisworks 4D Timeline Simulation', 'Point Cloud Scan-to-BIM Audit', 'Automated BOQ Takeoffs'];
  } else if (cat.includes('ai') || cat.includes('creative') || cat.includes('generative')) {
    estimatedCost = '$75,000';
    costNumeric = 75000;
    costPerSqFt = 'N/A (Generative Studio Lab)';
    area = 'Virtual Spatial Environment';
    duration = '1.5 Months';
    structuralType = 'Volumetric Neural NeRF / 3D Gaussian Splatting';
    floors = 'Dynamic Interactive Canvas';
    energyRating = '100% Carbon-Neutral Cloud Render Compute';
    bimLevel = 'AI Volumetric Mesh & Point Cloud Asset';
    materials = ['Procedural Ray-Traced Shaders', 'Volumetric Lighting', 'Interactive Spatial Audio'];
    deliverables = ['Neural Diffusion Checkpoints & LoRAs', 'Web-ready 3D Gaussian Splatting Scene', '4K Cinematic Generative Reels', 'Prompt Taxonomy Documentation'];
  } else if (cat.includes('branding') || cat.includes('motion') || cat.includes('web')) {
    estimatedCost = '$95,000';
    costNumeric = 95000;
    costPerSqFt = 'N/A (Enterprise Digital Platform)';
    area = 'Multi-Platform Global Deployment';
    duration = '3 Months';
    structuralType = 'TypeScript Microservices & WebGL Canvas';
    floors = 'Cross-Device Responsive Ecosystem';
    energyRating = 'Edge-Accelerated Low-Emission Cloud Infrastructure';
    bimLevel = 'Interactive WebGL 3D Model Viewers';
    materials = ['Tailwind CSS Design Tokens', 'Framer Motion Physics', 'Cinema 4D Asset Library'];
    deliverables = ['Production Code Repository', 'Figma Interactive Design System', 'Motion Graphics Package (60fps)', 'Comprehensive Brand DNA Manual'];
  }

  return {
    estimatedCost: project.estimatedCost || estimatedCost,
    costNumeric: project.costNumeric || costNumeric,
    costPerSqFt: project.costPerSqFt || costPerSqFt,
    area: project.area || area,
    duration: project.duration || duration,
    structuralType: project.structuralType || structuralType,
    floors: project.floors || floors,
    energyRating: project.energyRating || energyRating,
    bimLevel: project.bimLevel || bimLevel,
    materials: project.materials && project.materials.length > 0 ? project.materials : materials,
    deliverables: project.deliverables && project.deliverables.length > 0 ? project.deliverables : deliverables,
    softwareUsed: project.softwareUsed || ['Revit', '3ds Max', 'Rhino 3D'],
    costBreakdown: {
      architectural: project.costBreakdown?.architectural || formatCurrency(costNumeric * 0.08),
      bimAnd3d: project.costBreakdown?.bimAnd3d || formatCurrency(costNumeric * 0.04),
      engineering: project.costBreakdown?.engineering || formatCurrency(costNumeric * 0.06),
      constructionEst: project.costBreakdown?.constructionEst || formatCurrency(costNumeric * 0.82)
    }
  };
}

export function parseCostNumber(costStr: string): number {
  if (!costStr) return 0;
  const cleaned = costStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (costStr.toLowerCase().includes('cr')) return num * 10000000;
  if (costStr.toLowerCase().includes('lakh')) return num * 100000;
  if (costStr.toLowerCase().includes('m') || costStr.toLowerCase().includes('million')) return num * 1000000;
  if (costStr.toLowerCase().includes('k')) return num * 1000;
  return num;
}

export function formatCurrency(num: number): string {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}k`;
  }
  return `$${num.toLocaleString()}`;
}

export function calculateComparisonDelta(p1: Project, p2: Project) {
  const s1 = getProjectSpecs(p1);
  const s2 = getProjectSpecs(p2);

  const costDiff = Math.abs(s1.costNumeric - s2.costNumeric);
  const maxCost = Math.max(s1.costNumeric, s2.costNumeric, 1);
  const costDiffPercent = Math.round((costDiff / maxCost) * 100);

  const higherCostProject = s1.costNumeric > s2.costNumeric ? 1 : s1.costNumeric < s2.costNumeric ? 2 : 0;

  // Common and unique software
  const soft1 = new Set(s1.softwareUsed);
  const soft2 = new Set(s2.softwareUsed);
  const commonSoftware = s1.softwareUsed.filter(s => soft2.has(s));
  const uniqueToP1Soft = s1.softwareUsed.filter(s => !soft2.has(s));
  const uniqueToP2Soft = s2.softwareUsed.filter(s => !soft1.has(s));

  // Common and unique materials
  const mat1 = new Set(s1.materials.map(m => m.toLowerCase()));
  const mat2 = new Set(s2.materials.map(m => m.toLowerCase()));
  const commonMaterials = s1.materials.filter(m => mat2.has(m.toLowerCase()));
  const uniqueToP1Mat = s1.materials.filter(m => !mat2.has(m.toLowerCase()));
  const uniqueToP2Mat = s2.materials.filter(m => !mat1.has(m.toLowerCase()));

  return {
    costDiffFormatted: formatCurrency(costDiff),
    costDiffPercent,
    higherCostProject,
    commonSoftware,
    uniqueToP1Soft,
    uniqueToP2Soft,
    commonMaterials,
    uniqueToP1Mat,
    uniqueToP2Mat
  };
}
