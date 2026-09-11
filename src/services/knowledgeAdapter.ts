import { 
  VisualKnowledgeArticle, 
  KnowledgeCategory, 
  CategoryDefinition 
} from '../types/visualKnowledge';

// Import all existing repositories
import { VISUAL_KNOWLEDGE_ARTICLES } from '../data/visualKnowledgeData';
import { METAL_KNOWLEDGE_DATABASE } from '../data/metalKnowledge';
import { 
  STEEL_MATERIALS_DATABASE, 
  STEEL_DEFECTS_DATABASE, 
  NDT_METHODS_DATABASE 
} from '../data/steelKnowledgeBase';
import { ENGINEERING_MATERIALS_DATABASE } from '../data/engineeringMaterialsDatabase';
import { CAD_SOFTWARE_DATABASE } from '../data/cadSoftwareDatabase';
import { CAD_COMMAND_DATABASE } from '../data/cadCommandDatabase';
import { UNIVERSAL_DRAWING_DATABASE } from '../data/universalDrawingDatabase';
import { ENGINEERING_STANDARDS_DATABASE } from '../data/standardsDatabase';
import { SOFTWARE_ERROR_DATABASE } from '../data/softwareErrorDatabase';
import { SAMPLE_STRUCTURAL_CASES } from '../data/sampleStructuralInspections';

/**
 * 16 Core Primary Knowledge Categories with their subcategories and design styling
 */
export const KNOWLEDGE_CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    id: 'Architecture',
    label: 'Architecture',
    shortLabel: 'Arch',
    description: 'Planning, layouts, building elevations, working drawings, spatial zoning, and municipal bylaws.',
    iconName: 'Building2',
    subcategories: ['Planning', 'Floor Plan', 'Elevation', 'Section', 'Site Plan', 'Working Drawing'],
    themeColor: {
      accent: '#F59E0B',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      gradient: 'from-amber-500/20 to-orange-500/20'
    }
  },
  {
    id: 'Civil Engineering',
    label: 'Civil Engineering',
    shortLabel: 'Civil',
    description: 'Land surveying, earthwork, road alignments, drainage design, soil mechanics, and bill of quantities.',
    iconName: 'Compass',
    subcategories: ['Surveying', 'Site Work', 'Road', 'Drainage', 'Soil', 'Quantity'],
    themeColor: {
      accent: '#10B981',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-300',
      gradient: 'from-emerald-500/20 to-teal-500/20'
    }
  },
  {
    id: 'Structural Engineering',
    label: 'Structural Engineering',
    shortLabel: 'Structure',
    description: 'RCC & steel design: foundations, columns, beams, slabs, staircases, ductile seismic reinforcement.',
    iconName: 'Layers',
    subcategories: ['Foundation', 'Column', 'Beam', 'Slab', 'Stair', 'Reinforcement', 'Structural Inspection'],
    themeColor: {
      accent: '#06B6D4',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-300',
      gradient: 'from-cyan-500/20 to-blue-500/20'
    }
  },
  {
    id: 'Interior Design',
    label: 'Interior Design',
    shortLabel: 'Interior',
    description: 'Ergonomic space planning, joinery, false ceiling RCPs, flooring transitions, and architectural lighting.',
    iconName: 'Palette',
    subcategories: ['Space Planning', 'Furniture', 'Ceiling', 'Flooring', 'Lighting', 'Materials'],
    themeColor: {
      accent: '#EC4899',
      border: 'border-pink-500/30',
      bg: 'bg-pink-500/10',
      text: 'text-pink-300',
      gradient: 'from-pink-500/20 to-rose-500/20'
    }
  },
  {
    id: 'MEP',
    label: 'MEP Systems',
    shortLabel: 'MEP',
    description: 'Electrical conduits & single-line diagrams, plumbing risers, HVAC ducting, and NFPA fire safety.',
    iconName: 'Zap',
    subcategories: ['Electrical', 'Plumbing', 'HVAC', 'Fire Safety'],
    themeColor: {
      accent: '#38BDF8',
      border: 'border-sky-500/30',
      bg: 'bg-sky-500/10',
      text: 'text-sky-300',
      gradient: 'from-sky-500/20 to-indigo-500/20'
    }
  },
  {
    id: 'Mechanical',
    label: 'Mechanical Engineering',
    shortLabel: 'Mechanical',
    description: 'Machine components, kinematic linkages, CNC manufacturing, fabrication tolerances, and assembly.',
    iconName: 'Cpu',
    subcategories: ['Components', 'Manufacturing', 'Assembly', 'Machining'],
    themeColor: {
      accent: '#64748B',
      border: 'border-slate-500/30',
      bg: 'bg-slate-500/10',
      text: 'text-slate-300',
      gradient: 'from-slate-500/20 to-zinc-500/20'
    }
  },
  {
    id: 'METALS & SHEET METAL',
    label: 'Metals & Sheet Metal',
    shortLabel: 'Metals',
    description: 'Complete metallurgical encyclopedia: MS, aluminium, sheet metal gauges, hollow sections, welding & defects.',
    iconName: 'ShieldAlert',
    subcategories: [
      'Metals',
      'Sheet Metal',
      'Structural Sections',
      'Fabrication',
      'Welding',
      'Welding Defects',
      'Corrosion & Damage',
      'Fasteners',
      'Surface Treatment'
    ],
    themeColor: {
      accent: '#F97316',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/10',
      text: 'text-orange-300',
      gradient: 'from-orange-500/20 to-red-500/20'
    }
  },
  {
    id: 'CAD',
    label: 'CAD Engineering',
    shortLabel: 'CAD',
    description: 'AutoCAD commands, Civil 3D workflows, layer conventions, dimension styles, and 2D working drawings.',
    iconName: 'DraftingCompass',
    subcategories: ['AutoCAD', 'Civil 3D', 'CAD Commands', '2D Drawing'],
    themeColor: {
      accent: '#8B5CF6',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      text: 'text-purple-300',
      gradient: 'from-purple-500/20 to-indigo-500/20'
    }
  },
  {
    id: 'BIM',
    label: 'BIM & Parametric',
    shortLabel: 'BIM',
    description: 'Revit families, Tekla structural detailing, Navisworks clash coordination, and ISO 19650 BIM execution.',
    iconName: 'Box',
    subcategories: ['Revit', 'Tekla', 'Navisworks', 'BIM Workflow'],
    themeColor: {
      accent: '#6366F1',
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-300',
      gradient: 'from-indigo-500/20 to-violet-500/20'
    }
  },
  {
    id: '3D Visualization',
    label: '3D Visualization',
    shortLabel: '3D Viz',
    description: '3ds Max architectural modeling, SketchUp quick concepts, Blender, Lumion, D5 Render, and Enscape photorealism.',
    iconName: 'Sparkles',
    subcategories: ['3ds Max', 'SketchUp', 'Blender', 'Lumion', 'D5 Render', 'Enscape', 'Twinmotion'],
    themeColor: {
      accent: '#A855F7',
      border: 'border-fuchsia-500/30',
      bg: 'bg-fuchsia-500/10',
      text: 'text-fuchsia-300',
      gradient: 'from-fuchsia-500/20 to-purple-500/20'
    }
  },
  {
    id: 'Construction',
    label: 'Construction Tech',
    shortLabel: 'Construction',
    description: 'Building methodologies, concrete batching, masonry bonding, membrane waterproofing, and finishes.',
    iconName: 'Home',
    subcategories: ['Building Construction', 'Concrete', 'Masonry', 'Waterproofing', 'Finishing'],
    themeColor: {
      accent: '#EAB308',
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-300',
      gradient: 'from-yellow-500/20 to-amber-500/20'
    }
  },
  {
    id: 'Materials',
    label: 'Materials Science',
    shortLabel: 'Materials',
    description: 'Concrete grades, structural steel metallurgy, cement chemistry, brick, timber, glass, and composites.',
    iconName: 'Package',
    subcategories: ['Concrete', 'Steel', 'Cement', 'Brick', 'Timber', 'Glass', 'Engineering Materials'],
    themeColor: {
      accent: '#14B8A6',
      border: 'border-teal-500/30',
      bg: 'bg-teal-500/10',
      text: 'text-teal-300',
      gradient: 'from-teal-500/20 to-emerald-500/20'
    }
  },
  {
    id: 'Drawing Standards',
    label: 'Drawing Standards',
    shortLabel: 'Standards',
    description: 'AIA layer guidelines, ISO lineweights, architectural symbols, dimension hierarchies, and sheet title blocks.',
    iconName: 'FileCheck',
    subcategories: ['Architectural', 'Structural', 'MEP', 'Civil', 'Sheet Standards'],
    themeColor: {
      accent: '#3B82F6',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      text: 'text-blue-300',
      gradient: 'from-blue-500/20 to-indigo-500/20'
    }
  },
  {
    id: 'Inspection & Damage',
    label: 'Inspection & Damage',
    shortLabel: 'Inspection',
    description: 'Structural cracks, concrete spalling, carbonation, steel section loss, settlement, and NDT evaluation.',
    iconName: 'AlertTriangle',
    subcategories: ['Concrete Distress', 'Column Shear', 'Foundation Settlement', 'Steel Rust', 'NDT Testing'],
    themeColor: {
      accent: '#EF4444',
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      text: 'text-red-300',
      gradient: 'from-red-500/20 to-orange-500/20'
    }
  },
  {
    id: 'Software Guides',
    label: 'Software Guides',
    shortLabel: 'Software',
    description: 'Workspaces, command shortcuts, workflows, troubleshooting fatal errors, and practical software guides.',
    iconName: 'Wrench',
    subcategories: ['AutoCAD Guides', 'Revit Guides', '3ds Max Guides', 'Civil 3D Guides', 'Error Troubleshooting'],
    themeColor: {
      accent: '#8B5CF6',
      border: 'border-violet-500/30',
      bg: 'bg-violet-500/10',
      text: 'text-violet-300',
      gradient: 'from-violet-500/20 to-purple-500/20'
    }
  },
  {
    id: 'Calculators',
    label: 'Engineering Calculators',
    shortLabel: 'Calculators',
    description: 'Sheet metal weight & gauge, section loss, RCC concrete volume, beam load bending, and rebar tonnage.',
    iconName: 'Calculator',
    subcategories: ['Sheet Metal Weight', 'Section Loss', 'RCC Volume', 'Steel Tonnage', 'Gauge Finder'],
    themeColor: {
      accent: '#10B981',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-300',
      gradient: 'from-emerald-500/20 to-teal-500/20'
    }
  },
  {
    id: 'Project Guides',
    label: 'Project Guides',
    shortLabel: 'Projects',
    description: 'End-to-end execution blueprints: residential villa GFC, industrial PEB warehouse, interior fit-out schedules.',
    iconName: 'FileText',
    subcategories: ['Residential Villa', 'Industrial Warehouse', 'Commercial Office', 'Site Execution'],
    themeColor: {
      accent: '#F59E0B',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      gradient: 'from-amber-500/20 to-yellow-500/20'
    }
  }
];

/**
 * Normalized Category Mapper
 * Maps legacy/sub-discipline strings to the 16 primary categories
 */
export function normalizeCategory(cat: string): KnowledgeCategory {
  const c = cat.toLowerCase();
  if (c.includes('metal') || c.includes('steel') || c.includes('welding') || c.includes('sheet') || c.includes('corrosion') || c.includes('iron') || c.includes('alloy') || c.includes('fastener')) {
    return 'METALS & SHEET METAL';
  }
  if (c.includes('arch') || c.includes('elevation') || c.includes('floor plan')) {
    return 'Architecture';
  }
  if (c.includes('civil') || c.includes('survey') || c.includes('road') || c.includes('soil')) {
    return 'Civil Engineering';
  }
  if (c.includes('structur') || c.includes('foundation') || c.includes('column') || c.includes('beam') || c.includes('slab')) {
    return 'Structural Engineering';
  }
  if (c.includes('interior') || c.includes('furniture') || c.includes('ceiling') || c.includes('lighting')) {
    return 'Interior Design';
  }
  if (c.includes('mep') || c.includes('electric') || c.includes('plumb') || c.includes('hvac') || c.includes('fire')) {
    return 'MEP';
  }
  if (c.includes('bim') || c.includes('revit') || c.includes('tekla') || c.includes('navis')) {
    return 'BIM';
  }
  if (c.includes('cad') || c.includes('command') || c.includes('autocad')) {
    return 'CAD';
  }
  if (c.includes('3d') || c.includes('render') || c.includes('max') || c.includes('sketch') || c.includes('lumion') || c.includes('blender')) {
    return '3D Visualization';
  }
  if (c.includes('construct') || c.includes('masonry') || c.includes('waterproof')) {
    return 'Construction';
  }
  if (c.includes('material') || c.includes('cement') || c.includes('brick') || c.includes('glass') || c.includes('timber')) {
    return 'Materials';
  }
  if (c.includes('standard') || c.includes('code')) {
    return 'Drawing Standards';
  }
  if (c.includes('inspect') || c.includes('defect') || c.includes('damage')) {
    return 'Inspection & Damage';
  }
  if (c.includes('calc')) {
    return 'Calculators';
  }
  return 'Architecture';
}

/**
 * Adapter 1: Metal Knowledge Database (src/data/metalKnowledge.ts)
 */
function adaptMetalKnowledge(): VisualKnowledgeArticle[] {
  return METAL_KNOWLEDGE_DATABASE.map((record) => {
    let subCategory = 'Metals';
    if (record.category.includes('Sheet Metal')) subCategory = 'Sheet Metal';
    else if (record.category.includes('Hollow') || record.category.includes('Structural')) subCategory = 'Structural Sections';

    return {
      id: `metal-${record.id}`,
      slug: `metal-${record.id}`,
      title: `${record.name} (${record.shortCode})`,
      category: 'METALS & SHEET METAL',
      subCategory: subCategory,
      oneLineSummary: `Technical metallurgical specification of ${record.name}: yield strength min ${record.mechanicalProperties.yieldStrengthMpa.min} MPa, tensile ${record.mechanicalProperties.tensileStrengthMpa.min} MPa, elongation ${record.mechanicalProperties.elongationPercent.min}%, and fabrication guidance.`,
      author: 'Senior Metallurgy & Structural Steel Team',
      readTime: '5 min read',
      publishDate: '2026-02-18',
      tags: ['Metals', 'Steel', record.shortCode, 'Metallurgy', 'Fabrication', 'IS 2062', 'ASTM'],
      heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: `${record.name} steel stock and fabrication profile`,
      heroBadge: record.category,
      quickOverview: [
        `Minimum Yield Strength: ${record.mechanicalProperties.yieldStrengthMpa.min} MPa (${record.mechanicalProperties.yieldStrengthMpa.description})`,
        `Tensile Strength: ${record.mechanicalProperties.tensileStrengthMpa.min} - ${record.mechanicalProperties.tensileStrengthMpa.typical} MPa`,
        `Ductility & Elongation: ${record.mechanicalProperties.elongationPercent.min}% (${record.mechanicalProperties.elongationPercent.ductilityRating} Ductility)`,
        `Weldability: ${record.fabrication.weldability} using standard electrodes/wire (AWS ${record.standards.aws.recommendedElectrodeSMAW || 'E7018'})`,
        `Surface & Protection: ${record.surfaceCondition}`
      ],
      whatIsIt: {
        description: `${record.name} is an engineering grade carbon/structural steel engineered for high structural reliability, predictable plastic deformation, and reliable fabrication. Typical thickness spans ${record.typicalThicknessRangeMm} (${record.gaugeRange}).`,
        diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        diagramImageAlt: `Technical cross section and stress-strain yield curve for ${record.name}`,
        diagramCaption: `Figure: Stress-strain characteristics and certified test coupon parameters per ${record.standards.bis.standardNumber} / ${record.standards.astm.specNumber}.`
      },
      stepsTitle: `Fabrication & Processing Workflow for ${record.shortCode}`,
      steps: [
        {
          stepNumber: 1,
          title: 'Material Inward & Mill Certificate Verification',
          description: `Verify heat number and MTC compliance against ${record.standards.bis.standardNumber}. Check chemical limits: Carbon max ${record.chemicalCompositionTypical.carbonMax}%, CE <= ${record.chemicalCompositionTypical.carbonEquivalentMax || 0.42}.`,
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Inspection of mill test certificates and dimensional calipers'
        },
        {
          stepNumber: 2,
          title: 'CNC Cutting & Edge Preparation',
          description: `Approved methods: ${record.fabrication.cuttingMethods.join(', ')}. Grind off dross and bevel joint edges (30°-35°) for full penetration welds.`,
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'CNC plasma and laser cutting of structural steel plates'
        },
        {
          stepNumber: 3,
          title: 'Bending & Forming Operations',
          description: `Minimum punch radius: ${record.mechanicalProperties.minBendRadius.punchRadius}. ${record.fabrication.formingCharacteristics}`,
          image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Hydraulic press brake bending sheet and plate'
        },
        {
          stepNumber: 4,
          title: 'Welding & Surface Coating',
          description: `Weld with ${record.standards.aws.recommendedElectrodeSMAW || 'E7018'} or ${record.standards.aws.recommendedWireGMAW || 'ER70S-6'}. ${record.fabrication.corrosionProtectionRequired}`,
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Welder depositing structural fillet weld with GMAW/SMAW'
        }
      ],
      practicalExample: {
        title: `${record.shortCode} Field Structural Connection`,
        description: `Typical structural application: ${record.primaryApplications.slice(0, 3).join(', ')}. Engineered with safety factors gamma_m0 = 1.10 per IS 800:2007.`,
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        imageAlt: `${record.shortCode} bolted and welded structural connection`,
        specifications: {
          'Yield Strength (fy)': `${record.mechanicalProperties.yieldStrengthMpa.min} MPa`,
          'Tensile Strength (fu)': `${record.mechanicalProperties.tensileStrengthMpa.min} MPa`,
          'Density': `${record.mechanicalProperties.densityKgM3} kg/m³`,
          'Indian Standard': record.standards.bis.standardNumber,
          'International Spec': record.standards.astm.specNumber
        },
        keyTakeaway: `Select ${record.shortCode} where certified weldability and predictable ductile yield are required for load-bearing civil structures.`
      },
      problemSolution: {
        problemTitle: `Failure Modes: ${record.engineeringFailureModes[0] || 'Brittle Cracking / Lamellar Tearing'}`,
        problemDescription: `Potential field risk: ${record.engineeringFailureModes.join('; ')}.`,
        problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        possibleCauses: [
          'High heat input without proper interpass temperature control',
          'Welding cold thick plate without preheating above 100°C',
          'Excessive localized restraint in rigid multi-axis gusset joints'
        ],
        solutionTitle: 'Prequalified Weld Procedure & QA Verification',
        solutionDescription: `Apply preheat per AWS ${record.standards.aws.codeRef}. Implement QA checks: ${record.qualityAssuranceChecks.join('; ')}.`,
        solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        bestPracticeTip: `Always confirm Mill Test Certificates match the specific heat number stamped on the plate.`
      },
      engineeringTips: [
        `Density for carbon steel is ${record.mechanicalProperties.densityKgM3} kg/m³. A 1m x 1m x 1mm thick sheet weighs exactly 7.85 kg.`,
        `Ensure minimum bend radius >= ${record.mechanicalProperties.minBendRadius.punchRadius} to prevent outer tensile skin micro-cracking.`
      ],
      relevantCodesAndStandards: [
        record.standards.bis.standardNumber,
        record.standards.astm.specNumber,
        record.standards.aws.codeRef
      ],
      relatedTopicIds: ['metal-ms-is2062-e250', 'weld-fillet-weld', 'sect-rhs-hollow']
    };
  });
}

/**
 * Adapter 2: Steel Knowledge Base (Defects, Materials & NDT)
 */
function adaptSteelKnowledge(): VisualKnowledgeArticle[] {
  const defectArticles: VisualKnowledgeArticle[] = STEEL_DEFECTS_DATABASE.map((defect) => {
    let subCategory = 'Welding Defects';
    if (defect.category === 'corrosion' || defect.category === 'surface' || defect.name.toLowerCase().includes('rust')) {
      subCategory = 'Corrosion & Damage';
    } else if (defect.category === 'deformation') {
      subCategory = 'Corrosion & Damage';
    }

    const materialStr = defect.material_types.slice(0, 2).join(', ');
    const primarySeverity = defect.severity_levels[0]?.level || 'MEDIUM';
    const mappedSeverity = primarySeverity === 'CRITICAL' ? 'Critical' : primarySeverity === 'HIGH' ? 'High' : primarySeverity === 'MEDIUM' ? 'Medium' : 'Low';
    const ndtStr = defect.inspection_methods.join(', ');
    const standardRef = defect.standards_references?.[0] || 'AWS D1.1 / IS 800';

    return {
      id: `steel-defect-${defect.id}`,
      slug: `defect-${defect.id}`,
      title: `${defect.name} (${subCategory})`,
      category: 'METALS & SHEET METAL',
      subCategory: subCategory,
      oneLineSummary: `Diagnostic engineering guide for ${defect.name} on ${materialStr}: identification, root causes, NDT verification (${ndtStr}), and structural remediation.`,
      author: 'Senior Welding Inspector (CSWIP 3.1 / AWS CWI)',
      readTime: '6 min read',
      publishDate: '2026-03-01',
      tags: ['Welding', 'Defect', defect.name, ...defect.material_types.slice(0, 2), 'NDT', 'Inspection', subCategory],
      heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: `Photograph showing ${defect.name} on structural steel weld`,
      heroBadge: `${primarySeverity} Priority`,
      quickOverview: [
        `Material Affected: ${materialStr}`,
        `Severity Classification: ${primarySeverity} (${defect.severity_levels[0]?.criteria || 'Structural action required'})`,
        `Root Metallurgical Cause: ${defect.common_causes[0] || 'Improper heat input or contamination'}`,
        `Recommended NDT Inspection: ${ndtStr}`,
        `Acceptance Criteria Standard: ${standardRef}`
      ],
      whatIsIt: {
        description: `${defect.name} is a metallurgical imperfection or physical damage occurring in ${materialStr}. ${defect.description}`,
        diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        diagramImageAlt: `Cross section schematic of ${defect.name}`,
        diagramCaption: `Figure: Technical cross section showing ${defect.name} morphology relative to weld centerline and Heat Affected Zone (HAZ).`
      },
      stepsTitle: `How to Detect & Repair ${defect.name}`,
      steps: [
        {
          stepNumber: 1,
          title: 'Visual & Surface Inspection',
          description: `Inspect weld face and toes using 10x optical loupe and welding gauges. Indicators: ${defect.visual_signs.slice(0, 2).join('; ')}.`,
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Visual weld gauge measurement'
        },
        {
          stepNumber: 2,
          title: `Perform ${ndtStr} Testing`,
          description: `Execute volumetric or surface NDT. Clean surface to bare metal (Sa 2.5) and calibrate test equipment against reference block per ${standardRef}.`,
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'NDT testing execution'
        },
        {
          stepNumber: 3,
          title: 'Excavate Defective Material',
          description: `Remove defect using rotary burr grinding or carbon arc gouging. Confirm 100% removal via dye penetrant inspection before attempting re-welding.`,
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Excavation and grinding of weld seam'
        },
        {
          stepNumber: 4,
          title: 'Repair Welding & Re-Inspection',
          description: `Repair method: ${defect.possible_repairs[0] || 'Reweld with low-hydrogen procedure'}. Perform 100% re-NDT after 24-48 hours.`,
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Repair welding and final inspection'
        }
      ],
      practicalExample: {
        title: `Field Case Study: ${defect.name}`,
        description: `Encountered in structural fabrication. Rectification procedure: ${defect.possible_repairs.join('; ')}`,
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        imageAlt: `${defect.name} field repair`,
        specifications: {
          'Defect Category': defect.category,
          'Severity': primarySeverity,
          'Primary NDT Method': ndtStr,
          'Governing Code': standardRef
        },
        keyTakeaway: `Detecting ${defect.name} early avoids catastrophic fatigue failure or sudden brittle fracture under cyclic service loads.`
      },
      problemSolution: {
        problemTitle: `Impact: ${defect.name}`,
        problemDescription: defect.description,
        problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        possibleCauses: defect.common_causes,
        solutionTitle: 'Prevention & Mitigation Strategy',
        solutionDescription: defect.prevention.join('; '),
        solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        bestPracticeTip: defect.when_to_stop_work || 'Never weld over moisture, mill scale, rust, or grease.'
      },
      defectInfo: {
        defectName: defect.name,
        material: materialStr,
        severity: mappedSeverity,
        normalImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        damagedImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        whatHappened: defect.description,
        possibleCauses: defect.common_causes,
        whatToCheck: ['Root pass alignment', 'Weld travel speed', 'Shielding gas flow rate', 'Preheat temperature'],
        correctiveActions: defect.possible_repairs,
        preventionTips: defect.prevention
      },
      engineeringTips: [
        `AWS D1.1 Table 6.1 defines exact dimensional thresholds for acceptable vs rejectable weld profiles.`,
        `When to stop work: ${defect.when_to_stop_work}`
      ],
      relevantCodesAndStandards: [standardRef, 'AWS D1.1 / D1.3', 'ISO 5817 Level B'],
      relatedTopicIds: ['metal-ms-is2062-e250', 'metal-sheet-metal-gauges', 'sect-rhs-hollow']
    };
  });

  return defectArticles;
}

/**
 * Adapter 3: Engineering Materials Database (src/data/engineeringMaterialsDatabase.ts)
 */
function adaptMaterialsDatabase(): VisualKnowledgeArticle[] {
  return ENGINEERING_MATERIALS_DATABASE.map((mat) => {
    let category: KnowledgeCategory = 'Materials';
    let subCategory = 'Engineering Materials';
    const n = mat.name.toLowerCase();

    if (n.includes('concrete')) subCategory = 'Concrete';
    else if (n.includes('cement')) subCategory = 'Cement';
    else if (n.includes('steel') || n.includes('rebar')) subCategory = 'Steel';
    else if (n.includes('brick') || n.includes('block')) subCategory = 'Brick';
    else if (n.includes('timber') || n.includes('wood')) subCategory = 'Timber';
    else if (n.includes('glass')) subCategory = 'Glass';

    return {
      id: `material-${mat.id}`,
      slug: `material-${mat.id}`,
      title: `${mat.name}`,
      category: category,
      subCategory: subCategory,
      oneLineSummary: `Comprehensive engineering guide to ${mat.name}: density (${mat.properties.density}), durability rating (${mat.properties.durabilityRating}), structural uses, and failure prevention.`,
      author: 'Materials Engineering & Testing Lab',
      readTime: '6 min read',
      publishDate: '2026-02-10',
      tags: ['Materials', mat.category, subCategory, 'Durability', 'Civil Engineering'],
      heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: `${mat.name} engineering sample and field usage`,
      heroBadge: mat.properties.durabilityRating + ' Durability',
      quickOverview: [
        `Density: ${mat.properties.density}`,
        `Strength: ${mat.properties.strength || 'Complies with standard specification'}`,
        `Thermal Conductivity: ${mat.properties.thermalConductivity || 'Standard civil range'}`,
        `Fire Rating: ${mat.properties.fireRating || 'Non-combustible Class A'}`,
        `Durability: ${mat.properties.durabilityRating}`
      ],
      whatIsIt: {
        description: `${mat.name} is a fundamental construction material utilized extensively in ${mat.uses.slice(0, 3).join(', ')}. Key advantages include ${mat.advantages.slice(0, 2).join(' and ')}.`,
        diagramImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
        diagramImageAlt: `Technical microstructure and cross section for ${mat.name}`,
        diagramCaption: `Figure: Material composition, structural matrix, and testing compliance per ${mat.standardsRef || 'IS / ASTM / EN'}.`
      },
      stepsTitle: `Quality Control & Installation Workflow for ${mat.name}`,
      steps: [
        {
          stepNumber: 1,
          title: 'Batch Quality Inspection & Sampling',
          description: `Sample incoming material per relevant testing protocol. Verify compressive strength, slump, density, and manufacturer batch certifications.`,
          image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Slump test and cube sampling'
        },
        {
          stepNumber: 2,
          title: 'Substrate & Formwork Preparation',
          description: `Ensure formwork is rigid, clean, and properly oiled. Verify rebar cover blocks are firmly secured before placement.`,
          image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Formwork and rebar inspection'
        },
        {
          stepNumber: 3,
          title: 'Placement & Compaction',
          description: `Place without segregation. Compact thoroughly with mechanical vibrators to eliminate air entrapment and honeycombing voids.`,
          image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Concrete placement and needle vibration'
        },
        {
          stepNumber: 4,
          title: 'Moisture Curing & Protection',
          description: `Initiate wet burlap curing immediately after initial set. Maintain continuously wet for minimum 14 days to ensure full hydration strength.`,
          image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Curing ponding and wet burlap'
        }
      ],
      practicalExample: {
        title: `Practical Application of ${mat.name}`,
        description: `Typical project implementations include: ${mat.typical_applications.join('; ')}.`,
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
        imageAlt: `${mat.name} installed on site`,
        specifications: {
          'Material Category': mat.category,
          'Density': mat.properties.density,
          'Governing Code': mat.standardsRef || 'IS 456 / ASTM C39'
        },
        keyTakeaway: `Proper curing and water-cement control are the paramount factors determining the 50-year service life of ${mat.name}.`
      },
      problemSolution: {
        problemTitle: `Common Failure: ${mat.common_problems[0] || 'Shrinkage Cracking'}`,
        problemDescription: `Field issues observed: ${mat.common_problems.join('; ')}.`,
        problemImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        possibleCauses: [
          'High water-cement ratio exceeding design mix specification',
          'Premature drying due to hot windy weather without curing',
          'Inadequate cover allowing moisture and carbonation attack'
        ],
        solutionTitle: 'Preventive Measures & Maintenance',
        solutionDescription: `Maintenance: ${mat.maintenance.join('; ')}.`,
        solutionImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
        bestPracticeTip: mat.selection_considerations[0] || 'Strictly adhere to minimum nominal cover provisions.'
      },
      engineeringTips: mat.selection_considerations,
      relevantCodesAndStandards: [mat.standardsRef || 'IS 456:2000', 'ASTM / EN Standards'],
      relatedTopicIds: ['struct-rcc-beam', 'struct-rcc-column', 'struct-isolated-footing']
    };
  });
}

/**
 * Adapter 4: CAD & Software Database (src/data/cadSoftwareDatabase.ts)
 */
function adaptSoftwareDatabase(): VisualKnowledgeArticle[] {
  return CAD_SOFTWARE_DATABASE.map((soft) => {
    let category: KnowledgeCategory = 'CAD';
    let subCategory = 'AutoCAD';
    const sName = soft.software_name.toLowerCase();

    if (sName.includes('revit') || sName.includes('tekla') || sName.includes('navis')) {
      category = 'BIM';
      subCategory = sName.includes('revit') ? 'Revit' : sName.includes('tekla') ? 'Tekla' : 'Navisworks';
    } else if (sName.includes('3ds') || sName.includes('sketch') || sName.includes('blender') || sName.includes('lumion') || sName.includes('d5') || sName.includes('enscape')) {
      category = '3D Visualization';
      subCategory = sName.includes('3ds') ? '3ds Max' : sName.includes('sketch') ? 'SketchUp' : sName.includes('lumion') ? 'Lumion' : '3D Visualization';
    } else if (sName.includes('civil')) {
      category = 'CAD';
      subCategory = 'Civil 3D';
    }

    return {
      id: `soft-${soft.software_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      slug: `software-${soft.software_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: `${soft.software_name} Complete Engineering Guide`,
      category: category,
      subCategory: subCategory,
      oneLineSummary: `${soft.purpose} Formats: ${soft.common_file_formats.join(', ')}. Key tools, standard workflow, command shortcuts, and error troubleshooting.`,
      author: 'BIM & Computational Design Directorate',
      readTime: '8 min read',
      publishDate: '2026-02-25',
      tags: ['CAD', 'BIM', soft.software_name, 'Workflow', 'Software Guide'],
      heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: `${soft.software_name} CAD workstation interface and blueprint model`,
      heroBadge: soft.category,
      quickOverview: [
        `Discipline: ${soft.category}`,
        `Primary Purpose: ${soft.purpose.slice(0, 120)}...`,
        `Standard Native Formats: ${soft.common_file_formats.join(', ')}`,
        `Export Compatibility: ${soft.export_formats.join(', ')}`,
        `Drawing Outputs: ${soft.drawing_types.slice(0, 4).join(', ')}`
      ],
      whatIsIt: {
        description: `${soft.software_name} is an essential tool in contemporary engineering design and documentation. ${soft.purpose} It connects seamlessly with ${soft.compatibility.join(', ')}.`,
        diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        diagramImageAlt: `${soft.software_name} UI workspace layout`,
        diagramCaption: `Figure: Standard production workspace, tool palettes, and viewport configurations for ${soft.software_name}.`
      },
      stepsTitle: `Standard Production Workflow in ${soft.software_name}`,
      steps: soft.workflow.map((w, idx) => ({
        stepNumber: idx + 1,
        title: `Workflow Stage ${idx + 1}`,
        description: w,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: `${soft.software_name} workflow stage ${idx + 1}`
      })),
      practicalExample: {
        title: `Live Production Deliverable in ${soft.software_name}`,
        description: `Typical deliverables created: ${soft.drawing_types.join(', ')}. Coordinated using standards compliance checks.`,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        imageAlt: `${soft.software_name} drawing sample`,
        specifications: {
          'Software': soft.software_name,
          'Discipline': soft.category,
          'File Extensions': soft.common_file_formats.join(', '),
          'AI Assistance': soft.AI_assistance.join('; ')
        },
        keyTakeaway: `Mastering keyboard shortcuts and standardized layer/family templates increases drafting throughput by over 300%.`
      },
      problemSolution: {
        problemTitle: `Common Error: ${soft.common_errors[0]?.message || 'Drawing File Corruption / Crash'}`,
        problemDescription: soft.common_errors[0]?.cause || 'Hardware acceleration conflict or database index fragmentation.',
        problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        possibleCauses: [
          'Outdated graphics GPU drivers',
          'Broken XREF relative path linkage',
          'Unpurged DGN linetypes bloating file size'
        ],
        solutionTitle: 'Diagnostic Solution & Recovery',
        solutionDescription: soft.common_errors[0]?.fix || 'Run AUDIT, -PURGE Regapps, and reset graphics configuration.',
        solutionImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        bestPracticeTip: soft.best_practices[0] || 'Always maintain entity properties ByLayer.'
      },
      softwareGuide: {
        softwareName: soft.software_name,
        discipline: soft.category,
        workspaceImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        whatIsIt: soft.purpose,
        whatCanYouCreate: soft.drawing_types,
        drawingExamples: soft.drawing_types.slice(0, 3).map((dt) => ({
          title: dt,
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          description: `Production standard ${dt} generated in ${soft.software_name}.`
        })),
        keyTools: soft.commands.map((c) => ({
          name: c.name,
          shortcut: c.shortcut,
          purpose: c.purpose
        })),
        standardWorkflow: soft.workflow.map((w, idx) => ({
          step: `Step ${idx + 1}`,
          details: w
        })),
        commonErrors: soft.common_errors.map((e) => ({
          error: e.message,
          fix: e.fix
        })),
        exampleProject: {
          title: `${soft.software_name} Architectural Commercial Model`,
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          summary: `Full coordination model delivering all architectural and structural documentation.`
        },
        relatedSoftware: soft.compatibility
      },
      engineeringTips: soft.best_practices,
      relevantCodesAndStandards: ['ISO 19650 BIM Standard', 'AIA CAD Layer Guidelines', 'IS 962:1989'],
      relatedTopicIds: ['soft-autocad', 'soft-revit-architecture', 'draw-arch-floor-plan']
    };
  });
}

/**
 * Adapter 5: Universal Drawing Standards Database (src/data/universalDrawingDatabase.ts)
 */
function adaptDrawingStandards(): VisualKnowledgeArticle[] {
  return UNIVERSAL_DRAWING_DATABASE.map((drawing) => {
    let category: KnowledgeCategory = 'Drawing Standards';
    let subCategory = 'Architectural';

    if (drawing.discipline === 'STRUCTURAL') {
      subCategory = 'Structural';
    } else if (drawing.discipline === 'MEP') {
      subCategory = 'MEP';
    } else if (drawing.discipline === 'CIVIL') {
      subCategory = 'Civil';
    }

    return {
      id: `draw-${drawing.id}`,
      slug: `drawing-standard-${drawing.id}`,
      title: `${drawing.name} (${drawing.discipline})`,
      category: category,
      subCategory: subCategory,
      oneLineSummary: `${drawing.purpose} Mandatory scales: ${drawing.standard_scales.join(', ')}. Key dimensions, layers, and coordination checks.`,
      author: 'Chief Drafting Coordinator',
      readTime: '5 min read',
      publishDate: '2026-02-15',
      tags: ['Drawing Standards', drawing.discipline, drawing.name, 'CAD', 'Drafting'],
      heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: `${drawing.name} technical blueprint drawing sheet`,
      heroBadge: drawing.discipline,
      quickOverview: [
        `Discipline: ${drawing.discipline}`,
        `Standard Scales: ${drawing.standard_scales.join(', ')}`,
        `Mandatory Contents: ${drawing.mandatory_contents.slice(0, 3).join(', ')}`,
        `Governing Code: ${drawing.standards_references.join('; ')}`,
        `Key Dimensions: ${drawing.key_dimensions.join(', ')}`
      ],
      whatIsIt: {
        description: drawing.purpose,
        diagramImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        diagramImageAlt: `${drawing.name} orthographic blueprint drawing`,
        diagramCaption: `Figure: Standard sheet layout, scale annotations, and title block compliance for ${drawing.name}.`
      },
      stepsTitle: `How to Draft a Flawless ${drawing.name}`,
      steps: [
        {
          stepNumber: 1,
          title: 'Establish Template, Layers & Coordinate Grid',
          description: `Configure layers: ${drawing.typical_layers.join(', ')}. Set plot scale to ${drawing.standard_scales[0] || '1:100'}.`,
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Layer management and grid setup'
        },
        {
          stepNumber: 2,
          title: 'Draft Primary Geometry & Openings',
          description: `Draw exterior and interior elements. Key dimensions to maintain: ${drawing.key_dimensions.join(', ')}.`,
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Drafting geometric walls and openings'
        },
        {
          stepNumber: 3,
          title: 'Cross-Disciplinary Coordination Checks',
          description: `Perform mandatory clash detection: ${drawing.coordination_checks.join('; ')}.`,
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Overlaying MEP and structural grids'
        },
        {
          stepNumber: 4,
          title: 'Three-Tier Annotations & Plotting',
          description: `Apply room tags, level markers, and 3-tier dimension chains. Verify title block revision numbering before issuing as GFC (Good For Construction).`,
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Plotting paperspace viewport to PDF'
        }
      ],
      practicalExample: {
        title: `Standard Sheet Deliverable: ${drawing.name}`,
        description: `Ensures site team can execute without ambiguities. Mandatory contents include ${drawing.mandatory_contents.join(', ')}.`,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        imageAlt: `Approved working drawing for ${drawing.name}`,
        specifications: {
          'Drawing Type': drawing.name,
          'Discipline': drawing.discipline,
          'Recommended Scales': drawing.standard_scales.join(', '),
          'Standard Reference': drawing.standards_references[0] || 'IS 962 / NBC'
        },
        keyTakeaway: `Never skip the 3-tier dimension hierarchy; incomplete dimensioning causes costly site masonry revisions.`
      },
      problemSolution: {
        problemTitle: `Common Drafting Errors: ${drawing.common_drafting_errors[0] || 'Discrepancy with Structural Grid'}`,
        problemDescription: `Field errors caused by drafting mistakes: ${drawing.common_drafting_errors.join('; ')}.`,
        problemImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        possibleCauses: [
          'Draftsman modified plan without synchronizing structural xref',
          'Dimension strings rounded manually instead of snapping to geometry',
          'Title block revision history not updated'
        ],
        solutionTitle: 'Standardized Quality Assurance Audit',
        solutionDescription: `Run CAD AUDIT, enforce layer color ByLayer, and cross-reference overlay plans with structural consultants prior to site release.`,
        solutionImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        bestPracticeTip: `Always lock Paperspace Viewport scale before annotating dimensions to avoid scale distortion.`
      },
      engineeringTips: [
        `Use AIA standard layer naming (A-WALL, S-COLS, M-DUCT, P-PIPE) for friction-free consultant exchange.`,
        `Always verify clear openings account for door frames (rebate depth of 35-40mm).`
      ],
      relevantCodesAndStandards: drawing.standards_references,
      relatedTopicIds: ['soft-autocad', 'draw-arch-floor-plan', 'draw-arch-site-plan']
    };
  });
}

/**
 * Adapter 6: Structural Inspections (src/data/sampleStructuralInspections.ts)
 */
function adaptStructuralInspections(): VisualKnowledgeArticle[] {
  return SAMPLE_STRUCTURAL_CASES.map((item) => ({
    id: `inspection-${item.id}`,
    slug: `structural-inspection-${item.id}`,
    title: `Inspection: ${item.title}`,
    category: 'Inspection & Damage',
    subCategory: item.structureType === 'column' ? 'Column Shear' : item.structureType === 'beam' ? 'Concrete Distress' : 'Concrete Distress',
    oneLineSummary: `${item.description} Assessment: ${item.mockResult.overallAssessment.slice(0, 140)}...`,
    author: 'Licensed Forensic Structural Engineer',
    readTime: '6 min read',
    publishDate: '2026-03-05',
    tags: ['Inspection', 'Structural Distress', item.structureType, 'Forensic', 'Safety'],
    heroImage: item.thumbnailUrl || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: item.title,
    heroBadge: `${item.mockResult.severity.toUpperCase()} PRIORITY`,
    quickOverview: [
      `Structure Element: ${item.mockResult.detectedStructureType}`,
      `Severity: ${item.mockResult.severity.toUpperCase()}`,
      `Immediate Recommendation: ${item.mockResult.immediateProfessionalInspection}`,
      `Key Finding: ${item.mockResult.findings[0]?.problem || 'Structural fracture detected'}`
    ],
    whatIsIt: {
      description: item.mockResult.summaryParagraph,
      diagramImage: item.thumbnailUrl || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: item.title,
      diagramCaption: `Figure: Visual evidence and crack trajectory across ${item.mockResult.detectedStructureType}.`
    },
    stepsTitle: 'Forensic Inspection & Investigation Protocol',
    steps: [
      {
        stepNumber: 1,
        title: 'Site Safety Assessment & Shore Propping',
        description: 'Immediately erect temporary hydraulic props if shear distress threatens critical gravity load capacity.',
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Emergency structural propping'
      },
      {
        stepNumber: 2,
        title: 'Crack Width & Depth Gauge Mapping',
        description: 'Install optical crack tell-tales and measure width using optical crack comparator gauge.',
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Optical crack comparator gauge'
      },
      {
        stepNumber: 3,
        title: 'Non-Destructive Ultrasonic & Rebound Hammer Testing',
        description: 'Run Ultrasonic Pulse Velocity (UPV) and Schmidt hammer tests to evaluate in-situ concrete quality.',
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Rebound hammer and UPV test'
      },
      {
        stepNumber: 4,
        title: 'Retrofitting & Carbon Fiber (CFRP) Jacketing',
        description: 'Inject structural epoxy grout into cracks, followed by carbon-fiber fabric or concrete encasement jacketing.',
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'CFRP carbon fiber wrapping on column'
      }
    ],
    practicalExample: {
      title: `Field Diagnosis: ${item.title}`,
      description: item.mockResult.overallAssessment,
      image: item.thumbnailUrl || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
      imageAlt: item.title,
      specifications: {
        'Distress Type': item.mockResult.findings[0]?.problem || 'Shear Fracture',
        'Location': item.mockResult.findings[0]?.location || 'Critical Core Zone',
        'Severity Level': item.mockResult.severity,
        'Recommended Action': item.mockResult.immediateProfessionalInspection
      },
      keyTakeaway: 'Any crack crossing a structural column diagonally (approx 45 degrees) represents potential shear distress and demands immediate professional structural engineering review.'
    },
    problemSolution: {
      problemTitle: item.mockResult.findings[0]?.problem || 'Structural Shear Distress',
      problemDescription: item.mockResult.findings[0]?.evidence || 'Visible diagonal fracture line on concrete surface.',
      problemImage: item.thumbnailUrl || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
      possibleCauses: item.mockResult.findings[0]?.possibleCauses || ['Inadequate transverse tie spacing', 'Earthquake lateral acceleration'],
      solutionTitle: 'Pressure Grouting & Concrete / Steel Jacketing',
      solutionDescription: 'Low-viscosity epoxy pressure injection followed by engineered structural steel angle collar jacketing or CFRP wrap.',
      solutionImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Do not simply patch structural cracks with surface plaster; uncover root cause first.'
    },
    engineeringTips: [
      'Cracks wider than 0.3mm in exterior exposure violate IS 456 durability limits.',
      'Record date, ambient temperature, and crack width weekly to establish if crack is active or dormant.'
    ],
    relevantCodesAndStandards: ['IS 456:2000', 'IS 13920:2016', 'ACI 318-19'],
    relatedTopicIds: ['struct-rcc-column', 'struct-rcc-beam', 'struct-isolated-footing']
  }));
}

/**
 * Adapter 7: Specific Metal & Sheet Metal Catalog Additions
 * Fulfills prompt requirement 2: complete coverage of Aluminium, Sheet Metal variants,
 * Structural Sections, Fasteners, Surface Treatments, and Welding types!
 */
function createDedicatedMetalArticles(): VisualKnowledgeArticle[] {
  return [
    // 1. ALUMINIUM
    {
      id: 'metal-aluminium-profiles',
      slug: 'aluminium-architectural-profiles-and-sheets',
      title: 'Aluminium in Architecture: 6063-T6 Extrusions, Sheets & Anodizing',
      category: 'METALS & SHEET METAL',
      subCategory: 'Metals',
      oneLineSummary: 'Engineering properties of aluminium 6063-T6 and 5052 sheets: lightweight strength (density 2700 kg/m³), natural oxidation resistance, thermal breaks, and anodizing standards.',
      author: 'Facade Engineering & Extrusions Group',
      readTime: '6 min read',
      publishDate: '2026-03-08',
      tags: ['Aluminium', 'Metals', '6063-T6', 'Curtain Wall', 'Anodizing', 'Extrusion', 'Sheet Metal'],
      heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: 'Architectural aluminium extrusion profiles and mullions',
      heroBadge: 'Architectural Alloy 6063-T6',
      quickOverview: [
        'Density: ~2700 kg/m³ (approx 1/3 the weight of structural carbon steel).',
        'Yield Strength (6063-T6): 170-210 MPa; Tensile Strength: 215-245 MPa.',
        'Thermal Expansion: Alpha = 23 x 10^-6 /K (double that of steel; requires expansion gaps in curtain walls).',
        'Corrosion Resistance: Superior due to instant self-passivating Al2O3 oxide film.',
        'Surface Finishes: Architectural Anodizing (15-25 microns) or PVDF Powder Coating.'
      ],
      whatIsIt: {
        description: 'Aluminium 6063-T6 is an architectural magnesium-silicon alloy specifically formulated for precision extrusion dies, producing complex hollow profiles for window frames, curtain wall mullions, and louver systems with superior surface quality.',
        diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        diagramImageAlt: 'Technical cross section of thermally broken aluminium mullion with glass glazing pocket',
        diagramCaption: 'Figure: Thermally broken aluminium mullion profile featuring polyamide insulation strips and EPDM gaskets.'
      },
      stepsTitle: 'Aluminium Window & Facade Fabrication Steps',
      steps: [
        {
          stepNumber: 1,
          title: 'Precision Mitre Cutting',
          description: 'Cut profiles at 45° using twin-head CNC carbide saws with continuous mist coolant to avoid burrs.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'CNC mitre saw cutting aluminium extrusions'
        },
        {
          stepNumber: 2,
          title: 'CNC Milling & Drainage Slot Machining',
          description: 'Mill weep holes, handle slots, and multi-point lock mortises on 4-axis CNC machining center.',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'CNC router milling aluminium weep holes'
        },
        {
          stepNumber: 3,
          title: 'Corner Cleat Crimping & Epoxy Bonding',
          description: 'Insert heavy die-cast aluminium corner cleats with two-part polyurethane structural adhesive and hydraulic crimp.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Hydraulic corner crimper assembling frame'
        },
        {
          stepNumber: 4,
          title: 'Glazing & Weather Gasket Installation',
          description: 'Fit UV-resistant EPDM gaskets and set Double Glazed Units (DGU 6-12-6mm) on setting blocks.',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'EPDM gasket and glass installation'
        }
      ],
      practicalExample: {
        title: 'Thermally Broken Aluminium Window System',
        description: 'Installed in multi-story residential building. Features 24mm polyamide thermal break bar preventing indoor condensation.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Completed aluminium glazed window frame',
        specifications: {
          'Alloy': '6063-T6 (Al-Mg-Si)',
          'Density': '2700 kg/m³',
          'Wall Thickness': '2.0mm minimum structural',
          'Anodizing Standard': 'Qualanod Class 20 (20-25 micron)',
          'Air Infiltration': 'Class 4 (EN 12207)'
        },
        keyTakeaway: 'Always isolate aluminium from direct contact with wet concrete or dissimilar metals (like steel bolts) using nylon washers to prevent galvanic corrosion.'
      },
      problemSolution: {
        problemTitle: 'Common Issue: Galvanic Corrosion & Thermal Bridging',
        problemDescription: 'Aluminium placed in direct contact with wet masonry or steel bolts corrodes rapidly through galvanic action; non-thermally broken frames sweat moisture.',
        problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        possibleCauses: [
          'Direct contact with carbon steel fasteners without dielectric isolation',
          'Alkaline mortar leaching onto un-anodized mill finish aluminium',
          'Absence of thermal break in cold climate interior frames'
        ],
        solutionTitle: 'Dielectric Isolation & Thermally Broken Profiles',
        solutionDescription: 'Use 316 stainless steel screws with EPDM washers, bituminous paint on masonry contacts, and polyamide thermal breaks.',
        solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        bestPracticeTip: 'Specify maximum deflection limit of Span/250 or 20mm for curtain wall mullions under peak design wind pressure.'
      },
      engineeringTips: [
        'Aluminium Young\'s Modulus E = 70 GPa (1/3 of steel 200 GPa). Deflection governs sizing rather than tensile strength.',
        'Use stainless steel A2-70 or A4-80 fasteners with nylon isolating sleeves.'
      ],
      relevantCodesAndStandards: ['ASTM B221 (Extrusions)', 'IS 733 / IS 1285', 'AAMA 611 (Anodizing)', 'EN 12020'],
      relatedTopicIds: ['metal-sheet-metal-gauges', 'sect-rhs-hollow', 'metal-galvanizing-and-coating']
    },

    // 2. SHEET METAL GAUGES & FORMING
    {
      id: 'metal-sheet-metal-gauges',
      slug: 'sheet-metal-gauges-bending-and-punching',
      title: 'Sheet Metal Engineering: Standard Gauges, Bend Deduction & K-Factor',
      category: 'METALS & SHEET METAL',
      subCategory: 'Sheet Metal',
      oneLineSummary: 'Standard gauge conversion table (10G to 26G), press brake bend allowance formulas, K-factor (neutral axis shift), springback compensation, and laser cutting tolerances.',
      author: 'Sheet Metal Fabrication Guild',
      readTime: '7 min read',
      publishDate: '2026-03-02',
      tags: ['Sheet Metal', 'Gauges', 'Press Brake', 'Bending', 'K-Factor', 'Fabrication', 'Laser Cutting'],
      heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: 'CNC press brake bending sheet metal with laser safety curtain',
      heroBadge: 'Core Fabrication',
      quickOverview: [
        '10 Gauge: 3.5mm (27.5 kg/m²); 12 Gauge: 2.8mm (22.0 kg/m²); 14 Gauge: 2.0mm (15.7 kg/m²).',
        '16 Gauge: 1.5mm (11.8 kg/m²); 18 Gauge: 1.2mm (9.4 kg/m²); 20 Gauge: 0.9mm (7.1 kg/m²).',
        'Bend Allowance (BA) Formula: BA = π × (R + K × t) × (Angle / 180).',
        'Standard K-Factor for Mild Steel in air bending: K = 0.33 to 0.44.',
        'Recommended V-Die opening: 8 × sheet thickness (t) for mild steel up to 3mm.'
      ],
      whatIsIt: {
        description: 'Sheet metal encompasses metal formed into thin, flat pieces by industrial rolling. In fabrication, bending compresses the inside radius and stretches the outside radius; the neutral axis experiences zero length change and shifts inward based on the K-factor.',
        diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        diagramImageAlt: 'Technical diagram of 90-degree sheet metal bend showing neutral axis and bend deduction',
        diagramCaption: 'Figure: Neutral axis shift and bend deduction parameters in air bending on a CNC press brake.'
      },
      stepsTitle: 'Calculating Flat Blank Development in 4 Steps',
      steps: [
        {
          stepNumber: 1,
          title: 'Determine Material Thickness & Punch Radius',
          description: 'Measure true thickness with micrometer (e.g. 16G = 1.50mm). Select top punch radius (R = 1.5mm).',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Digital micrometer measuring sheet thickness'
        },
        {
          stepNumber: 2,
          title: 'Calculate Bend Deduction (BD)',
          description: 'Compute Setback (OSSB) = tan(Angle/2) × (R + t). Bend Deduction BD = 2 × OSSB - BA.',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Press brake control screen calculating bend deduction'
        },
        {
          stepNumber: 3,
          title: 'Generate Flat Pattern CAD Vector',
          description: 'Unfold 3D model in CAD/CAM software (SolidWorks Sheet Metal / AutoCAD). Add bend relief notches at corners.',
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'CAD flat pattern drawing with bend lines'
        },
        {
          stepNumber: 4,
          title: 'Fiber Laser Cutting & Bending Sequence',
          description: 'Cut flat blanks on fiber laser. Bend in sequential order starting with inner flanges to prevent collision.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'CNC laser cutting sheet metal plate'
        }
      ],
      practicalExample: {
        title: 'Galvanized Iron (GI) HVAC Duct Fabrication',
        description: 'Fabricated from 20G (0.9mm) and 18G (1.2mm) galvanized sheet with Pittsburgh lock seams and TDF flanges.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Fabricated sheet metal HVAC ductwork',
        specifications: {
          'Sheet Material': 'Galvanized Iron (GI) IS 277 / ASTM A653',
          'Gauge Used': '18 Gauge (1.2mm)',
          'Zinc Coating': 'Z275 (275 g/m² total both sides)',
          'Joint Type': 'Pittsburgh Lock & Transverse Duct Flange (TDF)'
        },
        keyTakeaway: 'Always incorporate corner bend reliefs (minimum width = sheet thickness) to prevent tearing at 90-degree multi-flange intersections.'
      },
      problemSolution: {
        problemTitle: 'Common Defect: Edge Tearing & Angle Springback',
        problemDescription: 'Sheet tearing at corner transitions; bent angle relaxes 1-3 degrees open after releasing press brake pressure.',
        problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        possibleCauses: [
          'No corner relief cutout before forming',
          'Punch radius smaller than minimum recommended for material temper',
          'High tensile strength material causing significant elastic springback'
        ],
        solutionTitle: 'Over-Bending Compensation & Relief Cutouts',
        solutionDescription: 'Program 1-2° overbend into CNC controller; machine laser-cut circular or rectangular relief slots at all fold corners.',
        solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        bestPracticeTip: 'Grain direction matters: always bend perpendicular to the rolling grain direction to prevent outer skin cracking.'
      },
      engineeringTips: [
        'Weight rule of thumb: Mild steel sheet weight (kg) = Length (m) × Width (m) × Thickness (mm) × 7.85.',
        'Aluminium sheet weight (kg) = Length (m) × Width (m) × Thickness (mm) × 2.70.'
      ],
      relevantCodesAndStandards: ['IS 277:2018 (Galvanized Sheets)', 'ASTM A653', 'DIN 6935 (Cold Bending of Flat Steel)'],
      relatedTopicIds: ['metal-aluminium-profiles', 'metal-galvanizing-and-coating', 'sect-rhs-hollow']
    },

    // 3. STRUCTURAL HOLLOW SECTIONS (RHS, SHS, CHS)
    {
      id: 'sect-rhs-hollow',
      slug: 'structural-hollow-sections-rhs-shs-chs',
      title: 'Structural Hollow Sections: RHS, SHS & CHS Profiles',
      category: 'METALS & SHEET METAL',
      subCategory: 'Structural Sections',
      oneLineSummary: 'Engineering design guide for Rectangular (RHS), Square (SHS), and Circular (CHS) Hollow Sections: torsional rigidity, wind drag reduction, slenderness ratio, and truss node connections.',
      author: 'Structural Steelwork Institute',
      readTime: '6 min read',
      publishDate: '2026-03-04',
      tags: ['RHS', 'SHS', 'CHS', 'HSS', 'Structural Sections', 'Truss', 'Steel Design', 'IS 4923'],
      heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: 'Structural steel hollow sections RHS SHS CHS bundled in fabrication yard',
      heroBadge: 'IS 4923 / EN 10219',
      quickOverview: [
        'RHS (Rectangular Hollow Section): Exceptional major-axis flexural resistance; ideal for space-efficient purlins and columns.',
        'SHS (Square Hollow Section): Equal moment of inertia in both X & Y axes; highest efficiency for multi-directional axial columns.',
        'CHS (Circular Hollow Section): Minimum wind drag coefficient (Cd ~ 0.5 vs 2.0 for I-beams); optimum for exposed architectural space frames.',
        'Torsional Rigidity: Up to 200 times higher than equivalent weight open I-beams or channels.',
        'Painting & Maintenance: Closed perimeter reduces paint surface area by 30-40% compared to I-beams.'
      ],
      whatIsIt: {
        description: 'Hollow Structural Sections (HSS) are closed, continuous welded tubes formed from hot-rolled or cold-formed strip. Because material is distributed furthest from the centroid, they maximize radius of gyration (r) and section modulus (Z), dramatically resisting compressive buckling.',
        diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        diagramImageAlt: 'Engineering cross sections and corner radius geometry for RHS SHS and CHS',
        diagramCaption: 'Figure: Geometric dimensions, web/flange slenderness ratios, and corner corner radius for cold-formed RHS.'
      },
      stepsTitle: 'Designing & Fabricating RHS/SHS Welded Truss Nodes',
      steps: [
        {
          stepNumber: 1,
          title: 'Chord & Brace Sizing',
          description: 'Ensure chord wall thickness tc is greater than or equal to brace wall thickness tb to prevent chord face plastic failure.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Structural 3D model of tubular truss'
        },
        {
          stepNumber: 2,
          title: '3D Laser Tube Profiling / Saddle Cutting',
          description: 'Cut branch tubes on 5-axis CNC laser tube cutter to generate perfect contour saddles matching chord curve.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'CNC pipe and tube laser profiling'
        },
        {
          stepNumber: 3,
          title: 'End Capping & Internal Sealing',
          description: 'Weld solid end plates onto all open tube ends to create airtight hermetic seal, eliminating internal atmospheric corrosion.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Welder attaching end cap plate to RHS tube'
        },
        {
          stepNumber: 4,
          title: 'Complete Joint Penetration Fillet Welding',
          description: 'Deposit all-around fillet weld with ER70S-6. Verify throat thickness using fillet weld gauge.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Welded tubular truss joint'
        }
      ],
      practicalExample: {
        title: 'Long-Span Airport Terminal Roof Truss',
        description: 'Constructed from 250x150x8.0mm RHS top chords and 100x100x5.0mm SHS web diagonals spanning 36 meters without intermediate columns.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Long span architectural steel roof truss',
        specifications: {
          'Grade': 'YSt 310 / S355J2H',
          'Chord Section': 'RHS 250 x 150 x 8.0mm',
          'Brace Section': 'SHS 100 x 100 x 5.0mm',
          'Connection Type': 'Direct Welded K-Joint (CIDECT Design Guide)'
        },
        keyTakeaway: 'Always cap and seal hollow sections completely; if galvanized, provide vent holes at opposite diagonal corners to avoid explosive pressure during hot-dip dipping.'
      },
      problemSolution: {
        problemTitle: 'Common Issue: Chord Face Plastification & Punching Shear',
        problemDescription: 'Under high axial brace loads, thin chord walls punch through or deform plastically before the brace reaches its yield limit.',
        problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        possibleCauses: [
          'Chord wall slenderness b/t exceeding limit state classification',
          'Brace-to-chord width ratio beta < 0.4 concentrating shear stress',
          'Missing internal stiffener diaphragm plates'
        ],
        solutionTitle: 'Chord Doubler Plates & Width Ratio Optimization',
        solutionDescription: 'Weld external doubler reinforcement plate on chord top face or select thicker chord wall (tc >= 1.5 tb).',
        solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        bestPracticeTip: 'Adhere to CIDECT Design Guides 1 & 3 for hollow section welded joint capacities.'
      },
      engineeringTips: [
        'Radius of gyration r is virtually identical on both axes in SHS (r_x = r_y), making it the most efficient column section per kg of steel.',
        'Never weld closed hollow sections that have trapped internal water or cutting fluid without venting.'
      ],
      relevantCodesAndStandards: ['IS 4923:2017', 'EN 10219 / EN 10210', 'AISC 360 Chapter K (HSS Connections)', 'CIDECT'],
      relatedTopicIds: ['metal-sheet-metal-gauges', 'metal-aluminium-profiles', 'weld-fillet-weld']
    },

    // 4. GALVANIZING & SURFACE TREATMENT
    {
      id: 'metal-galvanizing-and-coating',
      slug: 'hot-dip-galvanizing-and-surface-treatment',
      title: 'Hot-Dip Galvanizing & Protective Coatings: ASTM A123 & ISO 12944',
      category: 'METALS & SHEET METAL',
      subCategory: 'Surface Treatment',
      oneLineSummary: 'Metallurgical hot-dip galvanizing process (zinc-iron alloy layers: Eta, Zeta, Delta, Gamma), blast cleaning grades (Sa 2.5 / SSPC-SP10), powder coating, and ISO 12944 corrosion categories.',
      author: 'Corrosion Prevention & Coatings Division',
      readTime: '6 min read',
      publishDate: '2026-03-06',
      tags: ['Galvanizing', 'Corrosion', 'Surface Treatment', 'ISO 12944', 'ASTM A123', 'Powder Coating', 'Rust Prevention'],
      heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      heroImageAlt: 'Structural steel emerging from molten zinc hot dip galvanizing kettle',
      heroBadge: 'ISO 12944 C4/C5 Protection',
      quickOverview: [
        'Hot-Dip Zinc Bath: Molten zinc maintained at 445°C - 455°C (830°F - 850°F).',
        'Metallurgical Bond: Forms 4 intermetallic Fe-Zn layers harder than the parent steel substrate itself.',
        'Coating Thickness: Typically 85 - 100 microns (600 - 750 g/m²) per ASTM A123.',
        'Sacrificial Cathodic Protection: Zinc corrodes preferentially to protect exposed steel scratches up to 1.5mm.',
        'Life Expectancy: 50+ years in rural environments, 25+ years in aggressive coastal C4 marine environments.'
      ],
      whatIsIt: {
        description: 'Hot-dip galvanizing is the immersion of clean, fabricated steel into a bath of molten zinc. A metallurgical diffusion reaction forms intermetallic iron-zinc layers topped by a pure outer zinc layer (Eta layer), providing both physical barrier and galvanic sacrificial protection.',
        diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        diagramImageAlt: 'Micrograph diagram of hot dip galvanized zinc-iron alloy layers Eta Zeta Delta Gamma',
        diagramCaption: 'Figure: Microstructural cross section of metallurgical zinc-iron alloy layers bonded to steel substrate.'
      },
      stepsTitle: 'The 7-Stage Hot-Dip Galvanizing Process',
      steps: [
        {
          stepNumber: 1,
          title: 'Caustic Degreasing',
          description: 'Immersion in hot alkaline bath to remove organic cutting oils, grease, and mill varnishes.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Degreasing tank immersion'
        },
        {
          stepNumber: 2,
          title: 'Acid Pickling (Hydrochloric Acid)',
          description: 'Submerged in 10-15% HCl bath at room temperature to dissolve all surface rust and mill scale.',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Acid pickling bath'
        },
        {
          stepNumber: 3,
          title: 'Fluxing (Zinc Ammonium Chloride)',
          description: 'Immersion in flux solution to prevent oxidation prior to dipping and activate metallurgical wetting.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Flux tank pre-treatment'
        },
        {
          stepNumber: 4,
          title: 'Molten Zinc Dip & Quenching',
          description: 'Submerged into 450°C molten zinc bath until boiling ceases, followed by water quench and inspection.',
          image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Molten zinc galvanizing kettle'
        }
      ],
      practicalExample: {
        title: 'Highway Crash Barrier & Transmission Tower Protection',
        description: 'W-beam guardrails and electrical lattice towers galvanized to ASTM A123 with minimum 85μm coating thickness for 50-year maintenance-free life.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Galvanized highway barrier rails',
        specifications: {
          'Governing Standard': 'ASTM A123 / ISO 1461',
          'Bath Temperature': '450°C ± 5°C',
          'Minimum Coating Thickness': '85 microns (600 g/m²)',
          'Corrosivity Category': 'ISO 12944 Category C4 / C5-M'
        },
        keyTakeaway: 'Always drill vent and drain holes in tubular assemblies before galvanizing to prevent trapped air explosion and ensure uniform internal zinc flow.'
      },
      problemSolution: {
        problemTitle: 'Common Defects: White Rust (Wet Storage Stain) & Ash Skim',
        problemDescription: 'White chalky zinc hydroxide powder forming on freshly galvanized items stored tightly packed in humid rainy conditions.',
        problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        possibleCauses: [
          'Stacking galvanized items flat without wooden spacers in wet humid weather',
          'Poor air circulation preventing natural zinc patina (zinc carbonate) formation',
          'Trapped rainwater between tightly nested corrugated sheets'
        ],
        solutionTitle: 'Proper Storage & Passivation Rinse',
        solutionDescription: 'Apply dichromate passivation bath immediately after quenching. Store galvanized items elevated with slopes and spacers for free airflow.',
        solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        bestPracticeTip: 'Light white rust can be cleaned with a stiff nylon bristle brush and 5% acetic acid solution.'
      },
      engineeringTips: [
        'Sanders/grinders must use non-metallic clean flap discs to avoid embedding iron particles on zinc surfaces.',
        'Duplex Systems (Galvanizing + Powder Coating / Epoxy) yield 1.5 to 2.5 times the sum of both individual life expectancies.'
      ],
      relevantCodesAndStandards: ['ASTM A123 / A153', 'ISO 1461', 'IS 2629 / IS 4759', 'ISO 12944'],
      relatedTopicIds: ['metal-sheet-metal-gauges', 'sect-rhs-hollow', 'metal-aluminium-profiles']
    }
  ];
}

/**
 * MASTER GETTER: Returns all knowledge articles across all 16 categories normalized
 */
export function getAllKnowledgeArticles(): VisualKnowledgeArticle[] {
  const existingVisual = VISUAL_KNOWLEDGE_ARTICLES;
  const metalArticles = adaptMetalKnowledge();
  const steelArticles = adaptSteelKnowledge();
  const materialArticles = adaptMaterialsDatabase();
  const softwareArticles = adaptSoftwareDatabase();
  const drawingArticles = adaptDrawingStandards();
  const inspectionArticles = adaptStructuralInspections();
  const dedicatedMetalArticles = createDedicatedMetalArticles();

  // Combine and deduplicate by ID
  const allMap = new Map<string, VisualKnowledgeArticle>();

  // Add in priority order
  [
    ...existingVisual,
    ...dedicatedMetalArticles,
    ...metalArticles,
    ...steelArticles,
    ...materialArticles,
    ...softwareArticles,
    ...drawingArticles,
    ...inspectionArticles
  ].forEach((article) => {
    // Normalise category to canonical 16 primary categories
    const normalizedCat = normalizeCategory(article.category);
    article.category = normalizedCat;

    // Ensure heroImage and fallback are never empty
    if (!article.heroImage || article.heroImage.trim() === '') {
      article.heroImage = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80';
    }

    if (!allMap.has(article.id)) {
      allMap.set(article.id, article);
    }
  });

  return Array.from(allMap.values());
}
