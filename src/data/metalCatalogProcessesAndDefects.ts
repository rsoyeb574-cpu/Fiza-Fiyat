import { VisualKnowledgeArticle } from '../types/visualKnowledge';

export const METAL_PROCESSES_AND_DEFECTS_ARTICLES: VisualKnowledgeArticle[] = [
  // 1. SHEET METAL BENDING & K-FACTOR
  {
    id: 'metal-fabrication-bending-kfactor',
    slug: 'sheet-metal-bending-k-factor-and-bend-allowance',
    title: 'Sheet Metal Bending: K-Factor, Bend Allowance & Air Bending Tooling',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Metal Fabrication',
    oneLineSummary: 'Precision sheet metal forming mathematics: K-Factor (neutral axis shift), Bend Allowance (BA), Bend Deduction (BD), and CNC press brake tonnage calculations.',
    author: 'CNC Forming & Tooling Specialist',
    readTime: '7 min read',
    publishDate: '2026-03-08',
    tags: ['Sheet Metal Bending', 'K-Factor', 'Bend Allowance', 'Bend Deduction', 'Press Brake', 'Air Bending', 'Sheet Metal'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'CNC hydraulic press brake bending a precision sheet metal enclosure bracket',
    heroBadge: 'DIN 6935 / Air Bending Standards',
    quickOverview: [
      'Neutral Axis (K-Factor): Ratio K = t_inner / T (typically 0.33 for air bending mild steel; 0.42 for bottoming).',
      'Bend Allowance (BA): Formula: BA = π * (R + K*T) * (A / 180°), where R is inside radius, T is thickness, A is bend angle.',
      'Bend Deduction (BD): Formula: BD = 2*(R + T)*tan(A/2) - BA (amount subtracted from sum of flange lengths to get flat blank).',
      'Recommended V-Die Opening: V = 8*T for mild steel; V = 10*T for stainless steel; V = 6*T for soft aluminium.',
      'Springback Compensation: Mild steel experiences ~1.0° to 1.5° springback; austenitic stainless steel has 3.0° to 4.5° springback.'
    ],
    whatIsIt: {
      description: 'Sheet metal bending involves plastic deformation around a straight axis. During bending, material on the inside of the bend compresses while material on the outside stretches in tension. The boundary between tension and compression is the Neutral Axis, which experiences zero stress and shifts inwards toward the inside radius. The K-Factor mathematically quantifies this inward shift to calculate exact flat blank patterns before CNC laser cutting.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Cross section of bent sheet metal showing neutral axis shift, outer tension, inner compression, and bend allowance arc',
      diagramCaption: 'Figure: Neutral axis displacement (t_inner), inside radius (R), and tensile/compressive strain distribution across thickness T.'
    },
    stepsTitle: 'Calculating Flat Blank Flat Layout for 90° Bracket',
    steps: [
      {
        stepNumber: 1,
        title: 'Determine Inside Radius & K-Factor',
        description: 'For 2.0mm mild steel air bent on 16mm V-die (V=8T), natural inside bend radius R ≈ 0.16 * V = 2.5mm. Selected K-factor = 0.38.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'K-factor selection lookup table'
      },
      {
        stepNumber: 2,
        title: 'Compute Bend Allowance (BA) and Bend Deduction (BD)',
        description: 'Calculate BA = π * (2.5 + 0.38 * 2.0) * (90/180) = 5.12mm. Calculate Setback OSSB = 2.5 + 2.0 = 4.50mm. BD = 2 * 4.50 - 5.12 = 3.88mm.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Bend deduction math breakdown'
      },
      {
        stepNumber: 3,
        title: 'Unfold CAD Flat Pattern for CNC Laser Nesting',
        description: 'Set K = 0.38 inside SolidWorks / AutoCAD sheet metal module to export the exact DXF cutting profile for zero-tolerance fit.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'CAD sheet metal unfolding flat pattern'
      }
    ],
    practicalExample: {
      title: 'Precision Elevator Control Panel Chassis (1.6mm CRCA)',
      description: 'Multi-flange enclosure with 12 bends maintaining ±0.25mm overall box tolerance across 800mm width.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Fabricated elevator control enclosure on workbench',
      specifications: {
        'Material': '1.6 mm CRCA (IS 513 CR2)',
        'Inside Radius R': '1.6 mm (1.0t)',
        'V-Die Opening': '12 mm (V = 7.5t)',
        'K-Factor': '0.36',
        'Bending Tonnage': '14 tons/meter of bend length'
      },
      keyTakeaway: 'Accurate K-factor calculation prevents cumulative tolerance buildup across multi-bend enclosures.'
    },
    problemSolution: {
      problemTitle: 'Severe Cracking Along Outer Tensile Radius on 90° Bends',
      problemDescription: 'Bending 4mm HR sheet on a tight V-die caused tearing and micro-fractures along the entire outer seam.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Bend axis was oriented parallel to sheet rolling grain direction', 'Inside punch tip radius was too sharp (R < 0.5t)', 'Cold ambient temperature'],
      solutionTitle: 'Bend Transverse to Rolling Direction and Increase Punch Radius',
      solutionDescription: 'Nest blanks so the primary bend line is oriented at 90° (or 45°) to the rolling grain, and use a punch radius R >= 1.0t (R >= 4.0mm).',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'If parallel bending is unavoidable due to nesting efficiency, anneal the bend line or use R >= 2.0t.'
    },
    engineeringTips: [
      'Required Bending Tonnage formula: P = (1.42 * fy * L * T²) / (1000 * V), where P is tons, fy is tensile strength in MPa, L is bend length in mm.',
      'Always maintain minimum flange length B_min = (V / 2) + 2mm to prevent the sheet edge from slipping into the V-die opening before forming begins.'
    ],
    relevantCodesAndStandards: ['DIN 6935 (Cold Bending of Flat Steel)', 'ISO 7438', 'ASTM A1008', 'JIS G3141'],
    relatedTopicIds: ['metal-sheet-hr-hrpo', 'metal-sheet-crca', 'metal-mild-steel-is2062']
  },

  // 2. HSFG BOLTS & PRELOADED CONNECTIONS
  {
    id: 'metal-fasteners-hsfg-bolts',
    slug: 'hsfg-bolts-grade-8-8-10-9-structural-connections',
    title: 'HSFG Bolts & Structural Fasteners: Grade 8.8, 10.9 & Friction-Grip Joints',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Fasteners & Connections',
    oneLineSummary: 'Structural engineering of High Strength Friction Grip (HSFG) bolts (Grade 8.8 & 10.9 per IS 3757 / ASTM F3125): torque control, slip-critical clamping, and bolt shear.',
    author: 'Principal Structural Connection Specialist',
    readTime: '7 min read',
    publishDate: '2026-03-08',
    tags: ['HSFG Bolts', 'Structural Fasteners', 'Grade 8.8', 'Grade 10.9', 'Friction Grip', 'Torque Control', 'IS 4000'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'HSFG structural bolts with heavy hex nuts and hardened washers installed on bridge girder splice',
    heroBadge: 'IS 3757 / IS 4000 / ASTM F3125',
    quickOverview: [
      'Grade 8.8: Nominal Ultimate Tensile = 800 MPa; Yield = 640 MPa (80% of ultimate).',
      'Grade 10.9: Nominal Ultimate Tensile = 1000 MPa; Yield = 900 MPa (90% of ultimate).',
      'Friction-Grip (Slip-Critical) Mechanism: Clamps connecting plates with massive pre-tension (T0); load transfers entirely via inter-plate friction.',
      'Slip Coefficient (μ): Ranges from 0.20 (oiled/painted) up to 0.50 (Sa 2.5 grit blasted bare steel).',
      'Tightening Methods: Calibrated torque wrench, Part-Turn method (1/3 to 1/2 turn past snug), or Direct Tension Indicators (DTI squirt washers).'
    ],
    whatIsIt: {
      description: 'High-Strength Friction-Grip (HSFG) bolts conforming to IS 3757 / IS 4000 (or ASTM F3125 Grade A325/A490) are heat-treated alloy steel fasteners tightened to a specified minimum proof preload tension. In slip-critical joints, the clamping force develops high interfacial friction between plies, preventing any joint slip under serviceability loads and eliminating stress concentrations around the bolt hole.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Cross section of HSFG bolted joint showing clamping pre-tension T0, friction shear transfer, and hardened washers',
      diagramCaption: 'Figure: Clamping force (T0) and shear load transfer along friction interface without bolt shank bearing contact.'
    },
    stepsTitle: 'Calibrated Tightening Sequence for HSFG Preloaded Connections',
    steps: [
      {
        stepNumber: 1,
        title: 'Faying Surface Preparation (Sa 2.5 Near-White)',
        description: 'Grit-blast contact surfaces to Sa 2.5 profile (slip coefficient μ = 0.50). Leave completely free of paint, grease, and galvanizing puddles.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Grit blasted steel faying surface'
      },
      {
        stepNumber: 2,
        title: 'Snug-Tightening Phase',
        description: 'Bring all plies into full intimate contact using impact wrench starting from the center of the bolt pattern moving outward (snug torque ~100-150 Nm).',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Snug tightening with impact wrench'
      },
      {
        stepNumber: 3,
        title: 'Final Preload Application (Part-Turn / Torque Wrench)',
        description: 'Apply final rotation (typically 1/3 to 1/2 turn past snug) or torque with calibrated digital torque multiplier to achieve proof load (147 kN for M20 Grade 10.9).',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Calibrated torque wrench verification'
      }
    ],
    practicalExample: {
      title: 'High-Speed Rail Bridge Truss Node (M24 Grade 10.9 HSFG)',
      description: 'Major tension chord node connecting 4 heavy diagonal struts with 48 x M24 Grade 10.9 bolts on 20mm E350 gusset plates.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Heavy bridge truss bolted connection node',
      specifications: {
        'Bolt Specification': 'M24 x 110 Grade 10.9 (IS 3757)',
        'Preload Force T0': '212 kN per bolt',
        'Torque Required': '850 N·m (k = 0.16)',
        'Surface Condition': 'Sa 2.5 Clean Blasted (μ = 0.50)',
        'Slip Capacity Vdsf': '78.5 kN per friction interface'
      },
      keyTakeaway: 'HSFG slip-critical connections eliminate bolt slip, fatigue reversal, and hole fretting under dynamic train vibrations.'
    },
    problemSolution: {
      problemTitle: 'Premature Joint Slip Caused by Inadvertent Painting of Faying Surfaces',
      problemDescription: 'Painter inadvertently applied alkyd primer over the joint contact faces before erection, reducing slip factor μ from 0.50 to 0.18 and causing connection slip.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Alkyd/epoxy paint act as lubricants under high clamping pressure', 'Lack of masking tape during shop prime coating'],
      solutionTitle: 'Disassemble, Sweep Blast to Bare Steel, or Apply Zinc Silicate',
      solutionDescription: 'Disassemble connection, scrape and sweep-blast contact zones back to bare Sa 2.5 metal, or apply certified ethyl silicate zinc primer (Class B slip μ = 0.50).',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Mask all friction joint faying areas with heavy adhesive tape during shop painting and remove only immediately before erection.'
    },
    engineeringTips: [
      'Never reuse Grade 10.9 HSFG bolts that have been tightened past their yield proof load into the plastic zone.',
      'Always install hardened washers (IS 6649 / ASTM F436) under the element (nut or bolt head) being rotated to prevent galling the steel plate.'
    ],
    relevantCodesAndStandards: ['IS 3757:2008', 'IS 4000:1992 (HSFG Code of Practice)', 'IS 6649 (Washers)', 'ASTM F3125 / F3125M', 'AISC 360-22 Section J3'],
    relatedTopicIds: ['metal-fasteners-base-plate-connections', 'metal-structural-steel-e350', 'steel-section-i-beam']
  },

  // 3. BASE PLATE & ANCHOR ROD CONNECTIONS
  {
    id: 'metal-fasteners-base-plate-connections',
    slug: 'column-base-plate-connections-and-anchor-rods',
    title: 'Column Base Plate Connections & Anchor Rods: Bearing, Grout & IS 800',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Fasteners & Connections',
    oneLineSummary: 'Complete structural design of pinned and fixed column base plates per IS 800 Clause 7.4: plate thickness, anchor rod embedment, non-shrink grout, and shear lugs.',
    author: 'Principal Structural Designer',
    readTime: '7 min read',
    publishDate: '2026-03-08',
    tags: ['Base Plate', 'Anchor Rods', 'Holding Down Bolts', 'Non-Shrink Grout', 'IS 800', 'Foundation Connection', 'Shear Lug'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Structural steel column base plate with leveling nuts and anchor bolts mounted on concrete pedestal',
    heroBadge: 'IS 800:2007 Clause 7.4 / AISC DG 1',
    quickOverview: [
      'Base Plate Purpose: Distributes concentrated axial column loads and bending moments safely over concrete foundation pedestal.',
      'Plate Thickness Formula (IS 800): tp = √( (2.5 * w * (a² - 0.3*b²)) / (fy / γm0) ), where w is uniform bearing pressure.',
      'Non-Shrink Grout Bed: 30mm to 50mm high-strength cementitious non-shrink grout (compressive strength >= 60 MPa) compensates for pedestal unevenness.',
      'Anchor Rod Embedment: Cast-in J-bolts or heavy anchor rods with bottom anchor bearing plates resisting tension uplift and overturning moments.',
      'Shear Transfer Mechanisms: Friction between plate and grout, anchor rod dowel shear, or welded shear lugs embedded into foundation pocket.'
    ],
    whatIsIt: {
      description: 'A structural column base plate is the critical interface transmitting axial force, shear, and overturning moment from the steel superstructure into the concrete foundation. Pinned bases are designed to transfer vertical compression and horizontal shear with minimal rotational stiffness. Moment-resisting (fixed) bases utilize thick plates, gusset stiffeners, and widely spaced anchor rods to develop a force couple (tension in bolts, compression in grout).',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Cross-section of column base plate showing cantilever overhang projections a and b, grout bed, and anchor rod embedment depth',
      diagramCaption: 'Figure: Overhang cantilever distances (a, b) from column flange/web faces and uniform bearing pressure distribution.'
    },
    stepsTitle: 'Erection & Dry-Packing Protocol for Column Base Plates',
    steps: [
      {
        stepNumber: 1,
        title: 'Levelling Nut Elevation Setting',
        description: 'Set lower leveling nuts on threaded anchor rods to exact laser benchmark elevation, leaving 40mm space for grout under plate.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Laser leveling nuts on anchor rods'
      },
      {
        stepNumber: 2,
        title: 'Column Erection & Plumb Alignment',
        description: 'Erect steel column onto leveling nuts, install top washers and nuts, and verify column vertical plumb with dual optical theodolites.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Theodolite column plumb check'
      },
      {
        stepNumber: 3,
        title: 'Non-Shrink High-Strength Grouting',
        description: 'Erect watertight timber formwork around pedestal and pour flowable non-shrink cementitious grout from one side only to prevent air entrapment.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Flowable non shrink grouting under base plate'
      }
    ],
    practicalExample: {
      title: 'Heavy Industrial Plant Stanchion Moment Base (UC 356x406x287)',
      description: 'Fixed base plate designed for 4500 kN axial compression and 650 kN·m lateral wind/crane overturning moment.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Erected heavy column base plate with stiffeners and anchor bolts',
      specifications: {
        'Base Plate Dimensions': '850 mm x 950 mm x 50 mm thick',
        'Steel Grade': 'IS 2062 E250 B0',
        'Anchor Rods': '8 x M36 Grade 8.8 Rods (Embedment 850mm)',
        'Grout Specification': 'M60 Non-Shrink Free-Flow Cement Grout (45mm bed)',
        'Shear Transfer': '150x150x25mm Shear Key welded to base underside'
      },
      keyTakeaway: 'Always incorporate a welded shear lug on the underside when horizontal shear exceeds 20% of vertical axial compression.'
    },
    problemSolution: {
      problemTitle: 'Anchor Rod Misalignment or Offset in Concrete Pedestal',
      problemDescription: 'Foundations cast with anchor bolts shifted 25mm out of theoretical position, preventing the column base plate holes from dropping over.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Lack of rigid steel anchor template during concrete pour', 'Vibrator needle bumping unconsolidated bolts'],
      solutionTitle: 'Engineering Review: Slotted Holes with Welded Plate Washers',
      solutionDescription: 'If approved by structural engineer, slot hole in base plate and cover with 12mm thick welded washer plate (welded to base with 8mm fillet weld).',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always use rigid steel template plates (t >= 6mm) wired to pedestal rebar cage to lock anchor rods during concrete casting.'
    },
    engineeringTips: [
      'Grout holes (dia 50-75mm) must be provided in large base plates (width > 600mm) to allow air escape and visually verify 100% grout contact.',
      'Never weld anchor rods directly unless they are certified weldable carbon steel (ASTM A706 / IS 2062 Grade A); standard EN8/4140 rods will embrittle and snap.'
    ],
    relevantCodesAndStandards: ['IS 800:2007 Clause 7.4', 'AISC Design Guide 1: Base Plate and Anchor Rod Design', 'IS 456:2000', 'ACI 318 Chapter 17'],
    relatedTopicIds: ['metal-fasteners-hsfg-bolts', 'steel-section-i-beam', 'metal-sheet-checker-plate']
  },

  // 4. WELDING DEFECTS COMPREHENSIVE GUIDE
  {
    id: 'metal-welding-defects-guide',
    slug: 'welding-defects-causes-prevention-and-inspection',
    title: 'Welding Defects & Failure Modes: Porosity, Undercut, Cracking & Inspection',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Welding Defects',
    oneLineSummary: 'Master visual and NDT diagnostic guide to structural welding defects: transverse cracking, gas porosity, weld undercut, lack of side-wall fusion, and cold lap.',
    author: 'Chief Certified Welding Inspector (AWS CWI)',
    readTime: '8 min read',
    publishDate: '2026-03-08',
    tags: ['Welding Defects', 'Weld Cracks', 'Porosity', 'Undercut', 'Lack of Fusion', 'AWS D1.1', 'ISO 5817', 'Visual Inspection'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Macro etched cross section of welded joint revealing weld defects and heat affected zone',
    heroBadge: 'AWS D1.1 Table 6.1 / ISO 5817 Class B',
    quickOverview: [
      'Weld Cracks: Most dangerous planar defect; zero tolerance under all structural codes (AWS D1.1 / IS 800 / ISO 5817 Class B).',
      'Porosity: Spherical gas cavities (N2, H2, CO) caused by moisture, rust, wind blowing shielding gas, or oil on plate.',
      'Undercut: A groove melted into the base metal at weld toe not filled by weld metal; acts as severe stress concentration notch.',
      'Lack of Fusion (Cold Lap): Weld metal fails to fuse with base metal or previous pass due to low arc voltage or improper torch angle.',
      'Non-Destructive Testing (NDT): VT (Surface profile), PT (Surface cracks), MT (Subsurface cracks), UT/RT (Volumetric internal flaws).'
    ],
    whatIsIt: {
      description: 'Welding defects are physical discontinuities in weld metal or the Heat-Affected Zone (HAZ) that exceed the allowable acceptance thresholds defined by structural codes (AWS D1.1 / ISO 5817). Planar discontinuities (cracks, lack of fusion) create sharp notch tips that concentrate cyclic fatigue stress, leading to catastrophic brittle fracture.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Cross section diagram showing 6 primary welding defects: toe crack, undercut, porosity, slag inclusion, lack of root penetration, overlap',
      diagramCaption: 'Figure: Anatomical diagram of weld cross-section illustrating toe crack, porosity cluster, sidewall lack of fusion, and undercut.'
    },
    stepsTitle: 'Systematic Weld Quality Inspection & Defect Remediation',
    steps: [
      {
        stepNumber: 1,
        title: 'Visual Inspection (VT) with Cam-Bridge / Fillet Gauge',
        description: 'Verify fillet leg length, throat thickness, convexity, and check for undercut (allowable depth <= 1.0mm per AWS D1.1 Table 6.1).',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Cam-bridge welding gauge measuring undercut'
      },
      {
        stepNumber: 2,
        title: 'Liquid Dye Penetrant (PT) or Magnetic Particle (MT)',
        description: 'Apply fluorescent magnetic particles or red dye penetrant across weld toe to detect hairline longitudinal/transverse cracks.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Red dye penetrant crack indication'
      },
      {
        stepNumber: 3,
        title: 'Arc Gouging / Grinding Repair Protocol',
        description: 'Remove defect completely by rotary burr grinding or carbon arc gouging 50mm past visible crack ends; confirm removal with PT before re-welding.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Air carbon arc gouging groove'
      }
    ],
    practicalExample: {
      title: 'Crane Runway Girder Butt Weld Rejection & Repair (AWS D1.1)',
      description: 'Complete Joint Penetration (CJP) flange splice butt weld rejected on 100% Ultrasonic Testing (UT) due to 15mm lack of sidewall fusion.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Crane runway girder butt weld inspection'
      ,specifications: {
        'Joint Type': 'Single-Vee CJP Butt Weld with backing bar',
        'Plate Thickness': '32 mm E350 steel',
        'Defect Identified': 'Lack of Sidewall Fusion at Root Pass',
        'Rejection Standard': 'AWS D1.1 Class B (Cyclically Loaded)',
        'Repair Qualified': 'Approved WPS with 120°C preheat and E7018-H4'
      },
      keyTakeaway: 'In dynamically loaded structures, lack of fusion acts as a severe pre-existing crack that will propagate under cyclic wheel loads.'
    },
    problemSolution: {
      problemTitle: 'Cluster Porosity Emerging Across Semi-Automatic MIG Welds',
      problemDescription: 'Weld bead surface covered in spongy gas holes ("Swiss cheese" appearance) during outdoor structural steel framing.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Outdoor wind velocity > 8 km/h blowing argon/CO2 shielding gas away', 'Moisture, paint, or grease on steel joint edges', 'Contaminated welding wire'],
      solutionTitle: 'Erect Wind Shelters, Increase Gas Flow, and Clean Plate to Bright Metal',
      solutionDescription: 'Enforce windbreaks around welding stations, set gas flow to 18-22 L/min, and power wire-brush joint edges 25mm back to clean bare metal.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Switch to flux-cored arc welding (FCAW-S) self-shielded wire for high-wind field erection conditions.'
    },
    engineeringTips: [
      'Cracks of any length or depth must always be classified as CRITICAL SEVERITY: immediately reject and repair.',
      'Weld undercut exceeding 1.0mm in primary tension members reduces fatigue life by over 70%; dress smooth with pencil grinder.'
    ],
    relevantCodesAndStandards: ['AWS D1.1/D1.1M:2020', 'ISO 5817 (Quality Levels B, C, D)', 'IS 800:2007 Section 10', 'ASME Section IX', 'EN ISO 17637'],
    relatedTopicIds: ['metal-mild-steel-is2062', 'metal-ndt-ultrasonic-inspection', 'metal-fasteners-hsfg-bolts']
  },

  // 5. CORROSION MECHANISMS & DAMAGE
  {
    id: 'metal-corrosion-mechanisms',
    slug: 'metal-corrosion-mechanisms-rust-pitting-galvanic',
    title: 'Corrosion & Metal Damage: Rust, Pitting, Galvanic Cells & Section Loss',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Corrosion & Metal Damage',
    oneLineSummary: 'Electrochemistry of metal degradation: uniform atmospheric oxidation, localized pitting corrosion (ASTM G46), bimetallic galvanic cells, and structural section loss calculation.',
    author: 'Corrosion Science Director',
    readTime: '7 min read',
    publishDate: '2026-03-08',
    tags: ['Corrosion', 'Rust', 'Pitting', 'Galvanic Corrosion', 'Section Loss', 'ISO 12944', 'ASTM G46'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Severe atmospheric corrosion and flaking rust scale on historical steel bridge truss',
    heroBadge: 'ISO 12944 / ASTM G46 / NACE SP0178',
    quickOverview: [
      'Uniform Corrosion: General oxidation across entire exposed surface (Fe + O2 + H2O → FeO(OH) + Fe2O3·H2O).',
      'Pitting Corrosion: Dangerous autocatalytic micro-cavity penetration beneath stagnant chloride droplets; depth can be 10x greater than surface diameter.',
      'Galvanic (Bimetallic) Corrosion: Occurs when dissimilar metals (e.g. Copper and Steel) are electrically connected in an electrolyte; anode corrodes rapidly.',
      'Structural Section Loss: Reduction in steel thickness directly reduces moment of inertia I (drops with cube of thickness: I ∝ t³).',
      'Corrosivity Categories (ISO 12944-2): C1 (Very Low / Indoor), C2 (Low), C3 (Medium / Urban), C4 (High / Industrial), C5 (Very High / Coastal Marine).'
    ],
    whatIsIt: {
      description: 'Corrosion is an electrochemical process where metals revert to their thermodynamically stable oxidized state. In structural steel, anodic oxidation dissolves iron (Fe → Fe²⁺ + 2e⁻) while cathodic reduction consumes oxygen in moisture. Localized pitting corrosion occurs when protective oxide films break down in chloride environments, boring deep stress-concentrating needle holes into load-bearing members.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Electrochemical corrosion cell diagram showing anode, cathode, electrolyte path, and iron oxide rust precipitation',
      diagramCaption: 'Figure: Electrochemical corrosion cell: electron transfer from anode (iron dissolution) to cathode (oxygen reduction).'
    },
    stepsTitle: 'Structural Section Loss Mapping & Capacity Re-calculation',
    steps: [
      {
        stepNumber: 1,
        title: 'Surface Rust Scale Needle Descaling',
        description: 'Pneumatic needle scale or wire wheel corroded member to remove loose, flaky rust down to consolidated sound steel.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Needle scaler descaling rust'
      },
      {
        stepNumber: 2,
        title: 'Ultrasonic Thickness (UT) Grid Mapping',
        description: 'Map remaining steel thickness on a 50mm x 50mm grid using calibrated digital ultrasonic thickness gauge (velocity = 5920 m/s).',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Ultrasonic thickness gauge measurement'
      },
      {
        stepNumber: 3,
        title: 'Residual Capacity Limit State Check',
        description: 'Calculate remaining moment capacity M_residual = Zp_reduced * fy / γm0; if section loss exceeds 20-25%, install structural reinforcement plates.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Structural reinforcement plate welding'
      }
    ],
    practicalExample: {
      title: 'Marine Port Berth Crane Rail Girder (C5-M Environment)',
      description: '25-year-old port gantry girder exhibiting 35% web section loss from salt spray splash zone requiring sister plate reinforcement.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Corroded marine crane girder web with repair reinforcement',
      specifications: {
        'Original Section': 'ISMB 600 (Web thickness tw = 12.0 mm)',
        'Measured Residual tw': '7.8 mm (35% section loss)',
        'Corrosion Rate': '0.17 mm/year in C5-M marine environment',
        'Repair Action': 'STOP WORK -> Install temporary shoring -> Weld 8mm E250 doubler plates',
        'New Coating': 'ISO 12944 C5-M high durability system (320 μm DFT)'
      },
      keyTakeaway: 'Web section loss in flexural members reduces shear buckling capacity quadratically: Vcr ∝ (tw/d)².'
    },
    problemSolution: {
      problemTitle: 'Accelerated Galvanic Corrosion at Aluminium Window Mullions Bolted to Steel',
      problemDescription: 'Aluminium facade mullions directly bolted to carbon steel brackets in a coastal hotel developed severe white powder pitting and sheared bracket screws.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Direct metallic contact between aluminium (anode: -0.90V) and steel (cathode: -0.44V)', 'Rainwater acting as continuous conductive electrolyte'],
      solutionTitle: 'Dielectric Isolation (Neoprene Gaskets & EPDM Sleeves)',
      solutionDescription: 'Isolate aluminium from steel using 3mm EPDM/neoprene isolation pads, and install nylon/polycarbonate shoulder washers under bolt heads.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Never allow direct contact between copper or steel and aluminium in exterior environments without dielectric barriers.'
    },
    engineeringTips: [
      'Rust (Fe2O3) occupies 6 to 10 times the volume of the original steel it consumes, creating massive expansion pressure (rust jacking) capable of cracking concrete.',
      'In structural safety audits, any primary member with localized section loss exceeding 25% requires immediate engineer evaluation and temporary shoring.'
    ],
    relevantCodesAndStandards: ['ISO 12944-1 to 9 (Paints and Varnishes)', 'ASTM G46 (Pitting Examination)', 'IS 9172', 'NACE SP0178', 'SSPC-PA 2'],
    relatedTopicIds: ['metal-surface-treatment-coatings', 'metal-galvanized-iron-gi', 'metal-ndt-ultrasonic-inspection']
  },

  // 6. SURFACE TREATMENT & PROTECTIVE COATINGS
  {
    id: 'metal-surface-treatment-coatings',
    slug: 'metal-surface-treatment-coatings-iso-12944',
    title: 'Surface Treatment & Protective Coatings: Sa 2.5 Blasting & ISO 12944',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Surface Treatment',
    oneLineSummary: 'Industrial protective coating architecture: abrasive grit blasting to Sa 2.5 (SSPC-SP 10), zinc-rich primers, epoxy high-build intermediate barriers, and aliphatic polyurethane topcoats.',
    author: 'Coating & Corrosion Specialist (NACE / AMPP Level 3)',
    readTime: '7 min read',
    publishDate: '2026-03-08',
    tags: ['Surface Treatment', 'Sa 2.5', 'Sand Blasting', 'ISO 12944', 'Powder Coating', 'Galvanizing', 'Epoxy Paint', 'DFT Gauge'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Industrial abrasive grit blasting operator preparing structural steel to Sa 2.5 standard',
    heroBadge: 'ISO 12944 / SSPC-SP 10 (Sa 2.5)',
    quickOverview: [
      'Surface Cleanliness (ISO 8501-1): Sa 2.5 (Near-White Metal) is mandatory for high-performance epoxy/PU systems.',
      'Surface Profile (Roughness Rz): 50 to 75 microns peak-to-valley profile required for mechanical anchor mechanical keying.',
      '3-Coat Duplex System: 1) Zinc-Rich Primer (75μm) + 2) Epoxy MIO Barrier (125μm) + 3) Aliphatic Polyurethane Finish (60μm).',
      'Total Dry Film Thickness (DFT): 260 microns nominal (meets ISO 12944-5 C5 High Durability > 15-25 years).',
      'Quality Verification: Cross-hatch adhesion tape test (ASTM D3359) and magnetic dry film thickness gauge (SSPC-PA 2).'
    ],
    whatIsIt: {
      description: 'Surface treatment is the single most critical factor determining structural steel service life. Over 75% of premature paint failures stem directly from improper surface preparation rather than poor paint quality. Abrasive blast cleaning to ISO 8501-1 Sa 2.5 strips all mill scale, rust, and contaminants while imparting a microscopic angular anchor profile that guarantees mechanical adhesion.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Microscopic diagram of 3-coat protective paint system showing anchor profile, zinc primer, epoxy barrier, and PU topcoat',
      diagramCaption: 'Figure: Multi-coat paint architecture: Steel substrate (Sa 2.5), Zinc-Rich primer (cathodic), Epoxy MIO (barrier), Aliphatic PU (UV shield).'
    },
    stepsTitle: 'Application Workflow for High-Durability Industrial Coating System',
    steps: [
      {
        stepNumber: 1,
        title: 'Grit Blasting to Sa 2.5 (SSPC-SP 10)',
        description: 'Blast using angular steel grit (GL 25/40) at 7 bar nozzle pressure; verify surface anchor profile Rz = 50-75 μm using replica tape (Testex).',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Testex replica tape surface profile measurement'
      },
      {
        stepNumber: 2,
        title: 'Zinc-Rich Epoxy Primer Application (75μm)',
        description: 'Apply airless spray zinc-rich epoxy primer containing >= 80% metallic zinc by weight in dry film within 4 hours of blasting.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Airless spray zinc primer application'
      },
      {
        stepNumber: 3,
        title: 'Epoxy MIO Intermediate & Aliphatic PU Topcoat',
        description: 'Apply 125μm high-build Micaceous Iron Oxide (MIO) epoxy barrier, followed by 60μm gloss UV-resistant aliphatic polyurethane topcoat.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Polyurethane finish coat spray painting'
      }
    ],
    practicalExample: {
      title: 'Airport Terminal Exterior Roof Trusses & Canopy Columns',
      description: 'Architecturally exposed structural steel (AESS 4) coated with 3-coat C5 High system maintaining color and gloss retention for 20 years.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Finished white painted structural steel trusses in airport'
      ,specifications: {
        'Substrate': 'IS 2062 E350 Structural Tubing and Plate',
        'Surface Prep': 'Sa 2.5 (ISO 8501-1), Sharp Angular Profile Rz 65μm',
        'Primer': '2-Component Zinc-Rich Epoxy (75 μm DFT)',
        'Intermediate': 'Epoxy High-Build MIO Barrier (125 μm DFT)',
        'Topcoat': 'Aliphatic Acrylic Polyurethane (60 μm DFT, Total 260 μm)'
      },
      keyTakeaway: 'Micaceous Iron Oxide (MIO) forms overlapping microscopic laminar plates that create a tortuous obstacle path for water and oxygen.'
    },
    problemSolution: {
      problemTitle: 'Blistering and Flaking Paint Due to High Soluble Salt Contamination',
      problemDescription: 'Coating applied over blasted coastal steel formed thousands of water-filled osmotic blisters within 6 months of commissioning.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Soluble chlorides (sea salt) trapped in steel pits before blasting were not washed out', 'Osmotic pressure drawing moisture through paint film'],
      solutionTitle: 'High-Pressure Water Wash (Bresle Patch Salt Testing)',
      solutionDescription: 'Pressure wash steel at 300 bar with deionized water before blasting; confirm soluble chloride levels < 20 mg/m² using Bresle patch per ISO 8502-6.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always verify relative humidity < 85% and steel temperature at least 3°C above the ambient dew point before applying coatings.'
    },
    engineeringTips: [
      'Measure Dry Film Thickness per SSPC-PA 2 80-20 rule: no spot reading can be below 80% of specified thickness, and average must equal or exceed target DFT.',
      'Stripe coat all sharp plate edges, weld seams, and bolt heads with a manual brush prior to full spray passes to ensure adequate edge build.'
    ],
    relevantCodesAndStandards: ['ISO 12944:2018 (Parts 1-9)', 'ISO 8501-1 (Rust Grades & Prep Levels)', 'SSPC-SP 10 / NACE No. 2', 'ASTM D3359 (Cross Hatch Adhesion)', 'SSPC-PA 2'],
    relatedTopicIds: ['metal-corrosion-mechanisms', 'metal-galvanized-iron-gi', 'metal-mild-steel-is2062']
  },

  // 7. NDT & ULTRASONIC INSPECTION
  {
    id: 'metal-ndt-ultrasonic-inspection',
    slug: 'metal-inspection-ndt-ultrasonic-and-magnetic-particle',
    title: 'Metal Inspection & NDT: Ultrasonic (UT), Magnetic (MT) & Dye Penetrant (PT)',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Metal Inspection',
    oneLineSummary: 'Field non-destructive testing (NDT) methodologies for structural steel: Ultrasonic shear wave weld testing (ASTM E164), ultrasonic thickness gauging, and magnetic particle crack detection.',
    author: 'NDT Level III Specialist',
    readTime: '7 min read',
    publishDate: '2026-03-08',
    tags: ['NDT', 'Ultrasonic Testing', 'UT', 'Magnetic Particle', 'MT', 'Dye Penetrant', 'PT', 'Radiography', 'Inspection'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Certified NDT technician scanning structural steel weld with angle beam ultrasonic transducer',
    heroBadge: 'ISO 9712 / ASTM E164 / AWS D1.1',
    quickOverview: [
      'Visual Testing (VT): First line of defense (weld size, undercut, overlap, alignment, surface porosity).',
      'Dye Penetrant Testing (PT): Detects fine surface-breaking cracks and pinholes in both ferrous and non-ferrous metals (aluminium, stainless).',
      'Magnetic Particle Testing (MT): High-sensitivity detection of surface and near-subsurface cracks (up to 2mm deep) in ferromagnetic steels.',
      'Ultrasonic Testing (UT): Shear wave angle beam transducers detect internal planar defects (cracks, lack of fusion, slag) with precise depth mapping.',
      'Calibration Standards: IIW V1 and V2 reference calibration blocks establish time base, distance, and DAC (Distance Amplitude Correction) curves.'
    ],
    whatIsIt: {
      description: 'Non-Destructive Testing (NDT) encompasses engineering examination techniques used to evaluate the structural integrity of metals, welds, and fabricated joints without impairing their future usefulness. Ultrasonic Testing (UT) uses high-frequency acoustic waves (2 to 5 MHz) transmitted into the steel; internal flaws reflect sound energy back to the transducer, producing characteristic echo spikes on an A-scan display.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Ultrasonic angle beam sound path bouncing off plate backwall to locate weld root crack with CRT A-scan peak',
      diagramCaption: 'Figure: Angle beam shear wave path (skip distance) detecting root crack and corresponding A-scan time-of-flight peak.'
    },
    stepsTitle: 'Ultrasonic Testing (UT) Procedure for Complete Joint Penetration (CJP) Weld',
    steps: [
      {
        stepNumber: 1,
        title: 'Calibration on IIW Type 1 Reference Block',
        description: 'Calibrate range, time base, probe index point, and actual refracted beam angle (45°, 60°, or 70°) on calibrated IIW block.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'IIW block calibration of ultrasonic probe'
      },
      {
        stepNumber: 2,
        title: 'Establish DAC / TCG Reference Sensitivity Curve',
        description: 'Plot Distance Amplitude Correction (DAC) curve using 1.5mm side-drilled holes at 1/4T, 1/2T, and 3/4T depths per ASME Section V.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'DAC curve generation on reference block'
      },
      {
        stepNumber: 3,
        title: 'Zig-Zag Raster Scanning of Weld Seam',
        description: 'Scan across full skip distance with 10% probe overlap while applying cellulose couplant gel, watching for echo spikes exceeding the DAC curve.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Ultrasonic angle raster scanning of butt weld'
      }
    ],
    practicalExample: {
      title: 'Stadium Long-Span Roof Girder CJP Flange Splices (UT Class A)',
      description: '100% Ultrasonic shear wave testing of 40mm thick flange butt welds subject to dynamic cyclic wind gust loads.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Stadium steel girder erection and NDT inspection'
      ,specifications: {
        'Joint Standard': 'AWS D1.1 Class A (Cyclically Loaded Tension Weld)',
        'Probe Selected': '4 MHz, 60° Shear Wave Miniature Transducer',
        'Couplant': 'High-viscosity water-soluble gel',
        'Acceptance Criteria': 'AWS D1.1 Table 6.3 (Indication Level D > +5dB rejected)',
        'Testing Scope': '100% UT on all primary tension flange splices'
      },
      keyTakeaway: 'UT is superior to Radiography (RT) for detecting tight planar cracks and lack of fusion oriented perpendicular to the beam path.'
    },
    problemSolution: {
      problemTitle: 'False Defect Calls Caused by Weld Crown Root Geometry Signals',
      problemDescription: 'Technician reported severe lack of penetration along an entire pipe seam, which destructive sectioning proved was merely natural root bead geometry reflection.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Incorrect skip distance calculation', 'Failure to damp the root bead with a finger or damp cloth to identify geometric reflections'],
      solutionTitle: 'Beam Plotting & Transducer Movement Signal Verification',
      solutionDescription: 'Use a cross-section scale beam plotting overlay; confirm real flaws by observing echo dynamics as the probe is rotated and traversed.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Touch a couplant-coated finger to the weld root inside the pipe: if the A-scan echo dampens/shakes, the signal is a geometric root reflection.'
    },
    engineeringTips: [
      'In structural steel inspection, Magnetic Particle Testing (MT) is 10x more reliable than Dye Penetrant (PT) on painted or rough rolled surfaces.',
      'Digital ultrasonic thickness gauges must be calibrated on step wedges made of the same metallurgical grade and temperature as the target steel.'
    ],
    relevantCodesAndStandards: ['ASTM E164 (Ultrasonic Weld Examination)', 'ASTM E709 (Magnetic Particle)', 'ASTM E165 (Liquid Penetrant)', 'AWS D1.1 Clause 6', 'ISO 17640'],
    relatedTopicIds: ['metal-welding-defects-guide', 'metal-corrosion-mechanisms', 'metal-mild-steel-is2062']
  }
];
