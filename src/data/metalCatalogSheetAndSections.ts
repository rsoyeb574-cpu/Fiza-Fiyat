import { VisualKnowledgeArticle } from '../types/visualKnowledge';

export const METAL_SHEET_AND_SECTIONS_ARTICLES: VisualKnowledgeArticle[] = [
  // 1. HOT ROLLED SHEET & HRPO
  {
    id: 'metal-sheet-hr-hrpo',
    slug: 'hot-rolled-sheet-hr-and-hrpo-standards',
    title: 'Hot Rolled Sheet & HRPO: Mill Scale, Pickling & Forming Standards',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Sheet Metal',
    oneLineSummary: 'Engineering guide to Hot Rolled (HR) and Hot Rolled Pickled & Oiled (HRPO) sheets (IS 1079 / ASTM A1011): mill scale removal, laser cutting speeds, and press brake bending.',
    author: 'Sheet Metal Tooling Engineer',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['Sheet Metal', 'HR Sheet', 'HRPO', 'Pickled and Oiled', 'IS 1079', 'ASTM A1011', 'Laser Cutting'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Hot rolled steel coils and precision laser cut sheet metal blanks',
    heroBadge: 'IS 1079 HR1-HR4 / ASTM A1011',
    quickOverview: [
      'Hot Rolled (HR): Cooled at mill temperatures > 900°C; coated with dark grey iron oxide mill scale (10-25 μm).',
      'HRPO (Pickled & Oiled): Acid-pickled to strip all scale, then oil-flushed for rust inhibition and clean laser cutting.',
      'Thickness Range: Standard sheets from 1.6mm to 6.0mm (plates >= 5.0mm).',
      'Formability Grades: HR1 (Commercial), HR2 (Drawing), HR3 (Deep Drawing), HR4 (Extra Deep Drawing).',
      'Laser Cutting Benefit: HRPO increases fiber laser cutting speeds by 25-35% and eliminates nozzle spatter blowouts.'
    ],
    whatIsIt: {
      description: 'Hot Rolled (HR) sheet metal is produced by rolling hot steel slabs above its recrystallization temperature (> 900°C). During cooling, atmospheric oxidation forms a hard, brittle magnetite/wustite scale layer. HRPO (Hot Rolled Pickled & Oiled) undergoes a continuous hydrochloric acid bath wash to dissolve this scale, yielding a smooth, bare matte-grey surface protected by rust-preventative electrostatic oil.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Micrograph of mill scale on HR sheet vs clean etched surface of HRPO',
      diagramCaption: 'Figure: Cross-section comparison showing rough porous mill scale on raw HR vs scale-free metallic surface of HRPO.'
    },
    stepsTitle: 'Fabrication Workflow for HR & HRPO Sheet Metal Parts',
    steps: [
      {
        stepNumber: 1,
        title: 'CNC Fiber Laser Nesting & Cutting',
        description: 'Cut using nitrogen assist gas for oxide-free weldable edges or oxygen assist for higher speeds on thick plates (> 4mm).',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'CNC fiber laser cutting HRPO sheet'
      },
      {
        stepNumber: 2,
        title: 'Rotary Vibratory Deburring',
        description: 'Tumble or pass through multi-head rotary abrasive belt machine to round sharp corners and remove micro-burrs.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Rotary deburring sheet metal pass'
      },
      {
        stepNumber: 3,
        title: 'CNC Press Brake Air Bending',
        description: 'Bend using 88° precision ground punches with V-die opening = 8x material thickness. Account for 1.5° springback.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Press brake bending HR plate'
      }
    ],
    practicalExample: {
      title: 'Heavy Electrical Inverter Enclosure Frame (3.0mm HRPO)',
      description: 'Floor-standing power cabinet chassis fabricated from 3.0mm HRPO steel with laser-cut ventilation louvers and welded gusset brackets.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Sheet metal welded electronic cabinet chassis',
      specifications: {
        'Material Grade': 'IS 1079 HR2 (Drawing Quality)',
        'Thickness': '3.0 mm (±0.12 mm tolerance)',
        'Surface Condition': 'HRPO (Acid Pickled + Lightly Oiled)',
        'Inside Bend Radius': '3.0 mm (1.0t)',
        'Finish': 'Zinc Phosphate Pre-treatment + 80μm Epoxy Powder Coat'
      },
      keyTakeaway: 'Specifying HRPO instead of raw HR prevents mill scale from flaking off underneath powder coating, guaranteeing 1000-hour salt spray adhesion.'
    },
    problemSolution: {
      problemTitle: 'Laser Cut Head Crashes & Uneven Kerf Due to Loose Mill Scale',
      problemDescription: 'Cutting thick raw HR sheet with fiber laser causes sudden nozzle blowouts when molten scale splatters into the capacitive sensor.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Uneven, non-conductive iron oxide mill scale pockets', 'Trapped oil/moisture beneath scale exploding during piercing'],
      solutionTitle: 'Switch to HRPO Sheet or Two-Stage Surface Lead-in Piercing',
      solutionDescription: 'Upgrade production blanks to HRPO sheet, or program a defocused low-power pre-pierce scan to vaporize scale prior to the main cutting beam.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always align the primary bend line perpendicular to the steel rolling direction to prevent outer bend tensile microcracking.'
    },
    engineeringTips: [
      'In press brake tooling, always maintain minimum V-die opening V = 8t for mild steel up to 6mm.',
      'HR sheet has anisotropic mechanical properties: yield strength is approximately 5-8% higher transverse to the rolling direction.'
    ],
    relevantCodesAndStandards: ['IS 1079:2017', 'ASTM A1011 / A1011M', 'EN 10111', 'ISO 3573', 'JIS G3101'],
    relatedTopicIds: ['metal-sheet-crca', 'metal-sheet-metal-gi', 'metal-fabrication-bending-kfactor']
  },

  // 2. COLD ROLLED CLOSE ANNEALED (CRCA)
  {
    id: 'metal-sheet-crca',
    slug: 'cold-rolled-close-annealed-crca-engineering',
    title: 'Cold Rolled Steel (CR / CRCA): Automotive Finish & Deep Drawing Standards',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Sheet Metal',
    oneLineSummary: 'Precision Cold Rolled Close Annealed (CRCA) steel per IS 513 / ASTM A1008: mirror surface finish, tight gauge tolerances (±0.03mm), and superior deep-draw ductility.',
    author: 'Precision Tooling Specialist',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['CRCA', 'Cold Rolled', 'IS 513', 'ASTM A1008', 'Deep Drawing', 'Sheet Metal', 'Stamping'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Precision shiny cold rolled steel coils ready for stamping',
    heroBadge: 'IS 513 CR1-CR5 / ASTM A1008',
    quickOverview: [
      'Thickness Range: 0.40mm to 3.0mm with exceptional gauge accuracy (±0.02 - 0.04mm).',
      'Surface Finish: Matte (Ra 0.8 - 1.5 μm) or Bright Smooth (Ra < 0.4 μm) ready for Class-A automotive paint.',
      'Grades per IS 513: CR1 (Commercial), CR2 (Drawing), CR3 (Deep Drawing - DD), CR4 (Extra Deep Drawing - EDD).',
      'Close Annealing: Re-crystallized in hydrogen batch furnace to relieve work hardening and eliminate yield point elongation.',
      'Applications: Appliance bodies, architectural acoustic panels, automotive stampings, switchgear doors.'
    ],
    whatIsIt: {
      description: 'Cold Rolled Close Annealed (CRCA) steel is manufactured by cold-reducing pickled hot-rolled coils at room temperature through tandem rolling mills (up to 50-70% thickness reduction). The resulting work-hardened strip is then close-annealed inside an oxygen-free protective hydrogen atmosphere bell furnace to restore ductility and eliminate stretcher strain lines.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Stretcher strain Lüders bands illustration on unstabilized CR sheet',
      diagramCaption: 'Figure: Lüders bands formation on non-skin-passed sheet versus smooth plastic flow in skin-passed CRCA.'
    },
    stepsTitle: 'Deep Drawing & Stamping Protocol for CRCA Components',
    steps: [
      {
        stepNumber: 1,
        title: 'Skin Pass (Temper Rolling) Verification',
        description: 'Verify temper mill reduction of 0.5–1.2% to eliminate yield point elongation and suppress Lüders orange-peel lines during stamping.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Temper mill roll stand inspection'
      },
      {
        stepNumber: 2,
        title: 'Erichsen Cupping Ductility Test',
        description: 'Perform Erichsen ball-punch cup test per ISO 20482 to confirm cup depth value >= 10.5mm for CR4 Extra Deep Drawing grade.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Erichsen sheet ductility cup test'
      },
      {
        stepNumber: 3,
        title: 'Progressive Die Stamping & Coining',
        description: 'Stamp on 250-ton hydraulic press using synthetic water-soluble drawing lubricants with blankholder pressure = 2.5 MPa.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Hydraulic stamping press die action'
      }
    ],
    practicalExample: {
      title: 'Precision Server Rack Door with Hexagonal Perforated Mesh (1.2mm CRCA)',
      description: 'Data center ventilation door stamped from 1.2mm CRCA Grade CR3 with 68% open area honeycomb perforations without sheet bowing.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Perforated server rack door in server room',
      specifications: {
        'Material Grade': 'IS 513 CR3 (Deep Drawing)',
        'Thickness': '1.20 mm (±0.03 mm)',
        'Tensile Strength': '270 - 370 MPa',
        'Elongation': '38% minimum',
        'Surface Roughness': 'Ra = 1.0 μm (optimal powder coat keying)'
      },
      keyTakeaway: 'High-ductility CRCA ensures micro-perforated sheet remains perfectly flat without oil-canning or residual stress curvature.'
    },
    problemSolution: {
      problemTitle: 'Stretcher Strains (Lüders Lines) Appearing Across Formed Panels',
      problemDescription: 'Visible flame-like ridges appear across aesthetic front fascia panels during press brake bending, ruining appearance after painting.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Sheet metal aged in storage past 6 weeks allowing carbon/nitrogen atoms to re-pin dislocations', 'Lack of skin-pass rolling'],
      solutionTitle: 'Roller Leveling or Specify Interstitial-Free (IF) Grade',
      solutionDescription: 'Pass aged sheets through a 19-roll precision roller leveler immediately prior to forming, or specify Titanium/Niobium stabilized IF steel (CR5).',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Use CRCA sheets within 30 days of receipt from the mill to avoid strain-aging degradation.'
    },
    engineeringTips: [
      'CRCA has no protective oxide; uncoated parts will flash-rust within 4 hours in humid ambient air without rust-preventative oil.',
      'For tight bends, CRCA can achieve zero inside bend radius (R = 0 / dead fold) on thicknesses up to 1.0mm in CR4 grade.'
    ],
    relevantCodesAndStandards: ['IS 513 (Part 1 & 2):2016', 'ASTM A1008/A1008M', 'EN 10130 (DC01-DC04)', 'JIS G3141', 'ISO 3574'],
    relatedTopicIds: ['metal-sheet-hr-hrpo', 'metal-sheet-metal-gi', 'metal-fabrication-bending-kfactor']
  },

  // 3. CHECKER PLATE & HEAVY STRUCTURAL PLATE
  {
    id: 'metal-sheet-checker-plate',
    slug: 'checker-plate-and-heavy-structural-steel-plate',
    title: 'Checker Plate & Heavy Structural Steel Plate: Floor Tread & Gussets',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Sheet Metal',
    oneLineSummary: 'Design and fabrication of Chequered/Diamond Plate (anti-slip industrial walkways) and heavy structural plates (>5mm to 100mm) for base plates and moment gussets.',
    author: 'Heavy Industrial Steel Specialist',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['Checker Plate', 'Chequered Plate', 'Base Plate', 'Gusset Plate', 'Tread Plate', 'IS 3502', 'IS 2062'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Industrial steel staircase with diamond checker plate treads and heavy column base plates',
    heroBadge: 'IS 3502 / IS 2062 Heavy Plate',
    quickOverview: [
      'Chequered Plate Patterns: Tear drop, diamond, or 5-bar rice patterns hot-rolled on top surface.',
      'Base Thickness: 3.0mm to 10.0mm (specified on plain base plate thickness excluding raised pattern height of 1.0-1.5mm).',
      'Heavy Structural Plate (t >= 5mm): Used for column base plates, moment connection end-plates, and bridge girder webs.',
      'Through-Thickness Ductility (Z-Quality): Critical for heavy plates > 25mm to resist lamellar tearing under transverse weld shrinkage.',
      'Anti-Skid Rating: Conforms to DIN 51130 R10 / R11 slip resistance for oil-grease industrial walkways.'
    ],
    whatIsIt: {
      description: 'Chequered steel plate (IS 3502 / ASTM A786) is hot-rolled steel featuring raised diamond or teardrop projections to provide positive mechanical traction for industrial personnel walkways, ramps, and stair treads. Heavy structural plate (IS 2062 / ASTM A36 / A572) encompasses flat rolled steel exceeding 5mm in thickness, engineered to carry direct axial column loads, bending moments, and heavy shear transfer in bolted and welded joints.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Tear drop checker plate dimensions and base plate bearing pressure diagram',
      diagramCaption: 'Figure: Checker plate profile geometry and cantilever bending stress distribution in column base plates.'
    },
    stepsTitle: 'Base Plate & Gusset Heavy Plate Fabrication Steps',
    steps: [
      {
        stepNumber: 1,
        title: 'CNC Oxy-Fuel / High-Def Plasma Cutting',
        description: 'Cut heavy plate (t > 20mm) using CNC oxy-fuel torch with preheat to maintain square edges and minimum bevel.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Heavy plate CNC flame cutting'
      },
      {
        stepNumber: 2,
        title: 'Radial Drilling of Anchor Rod Holes',
        description: 'Drill oversized anchor bolt holes (d + 6mm per IS 800) using radial arm drill with heavy high-speed steel twist bits.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Radial drill press drilling base plate'
      },
      {
        stepNumber: 3,
        title: 'Milling of Column Bearing Face',
        description: 'End-mill or surface grind bearing face of base plate to achieve flatness tolerance <= 0.25mm per IS 800.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Heavy plano-miller milling bearing face'
      }
    ],
    practicalExample: {
      title: 'Chemical Plant Catwalk Flooring & Tower Column Base Plate (36mm)',
      description: '6mm teardrop chequered flooring supported by ISMC 150 channels, resting on 36mm thick E250 base plates with M30 anchor rods.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Industrial catwalk chequered plate floor and heavy steel columns',
      specifications: {
        'Flooring Plate': '6.0 mm Tear Drop (IS 3502 / E250)',
        'Base Plate': '36.0 mm IS 2062 E250 B0',
        'Live Load Design': '5.0 kN/m² industrial maintenance load',
        'Bearing Pressure': '12.5 MPa on M35 non-shrink grout',
        'Anchors': '4 x M30 Grade 8.8 Rods (Embedment 550mm)'
      },
      keyTakeaway: 'Always calculate base plate thickness using cantilever bending moment at column flange face per IS 800 Clause 7.4.'
    },
    problemSolution: {
      problemTitle: 'Plate Warping and Angular Distortion During Heavy Fillet Welding',
      problemDescription: 'Welding a 300mm column to a 28mm base plate causes the base plate to cup upward by 4mm, preventing full bearing on grout.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Asymmetrical single-pass heat input', 'Lack of mechanical clamping or pre-bending'],
      solutionTitle: 'Pre-Setting Backwards & Symmetrical Multi-Pass Welding',
      solutionDescription: 'Pre-bend plate 2mm in reverse direction before welding, or clamp base plate back-to-back with another plate and weld with balanced opposing runs.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'For base plates t > 32mm, plan for post-weld surface face milling to ensure 100% true contact area with foundation grout.'
    },
    engineeringTips: [
      'In calculating self-weight of chequered plate, add 2.5 kg/m² to plain plate mass to account for the raised diamond pattern.',
      'Ensure drain holes (dia 15mm) are provided in exterior chequered plate platforms to prevent standing water and premature corrosion.'
    ],
    relevantCodesAndStandards: ['IS 3502:2009', 'IS 2062:2011', 'ASTM A786', 'IS 800:2007', 'DIN 51130'],
    relatedTopicIds: ['metal-fasteners-base-plate-connections', 'metal-mild-steel-is2062', 'steel-section-i-beam']
  },

  // 4. EQUAL & UNEQUAL ANGLES (ISA)
  {
    id: 'steel-section-angle-isa',
    slug: 'steel-angle-sections-isa-structural-design',
    title: 'Steel Angle Sections (ISA): Equal & Unequal L-Profile Design per IS 808',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Steel Sections',
    oneLineSummary: 'Complete structural design guide for Equal & Unequal Indian Standard Angles (ISA) per IS 808 & IS 800: tension ties, truss web struts, and shear cleat connections.',
    author: 'Senior Structural Designer',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['Steel Sections', 'ISA', 'Angle Section', 'IS 808', 'IS 800', 'Roof Truss', 'Struts'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Fabricated steel roof truss constructed with equal and unequal angle sections',
    heroBadge: 'IS 808 ISA / AISC L-Shapes',
    quickOverview: [
      'Equal Angles: Identical leg lengths (e.g. ISA 50x50x6, ISA 75x75x8, ISA 100x100x10).',
      'Unequal Angles: Differential legs (e.g. ISA 75x50x6, ISA 100x65x8, ISA 150x75x10) for optimized flexural stiffness in one axis.',
      'Asymmetrical Principal Axes: U-U and V-V axes are inclined at 45° to legs; minimum radius of gyration rvv governs buckling.',
      'Tension Net Section: Shear lag effect requires net effective area calculation (An = A1 + A2 * k per IS 800 Clause 6.3.3).',
      'Applications: Industrial roof trusses, bracing cross-ties, transmission towers, purlin cleats.'
    ],
    whatIsIt: {
      description: 'Indian Standard Angles (ISA) are hot-rolled L-shaped structural steel profiles manufactured per IS 808. Because their geometric centroid does not coincide with principal axes of inertia, un-symmetrical bending occurs when loaded parallel to legs. Structural designers utilize them in pairs (back-to-back) or account for the minor axis radius of gyration (rvv) when designing compression struts.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Cross section of unequal angle showing geometric x-x, y-y axes and principal u-u, v-v axes',
      diagramCaption: 'Figure: Geometric axes vs principal axes (u-u, v-v) showing minor axis radius of gyration rvv.'
    },
    stepsTitle: 'Design & Verification Sequence for Angle Truss Members',
    steps: [
      {
        stepNumber: 1,
        title: 'Slenderness Ratio (λ = KL/r) Calculation',
        description: 'Verify slenderness ratio: λ <= 180 for compression members, λ <= 350 for tension ties subject to reversal per IS 800 Table 3.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Slenderness ratio design formula'
      },
      {
        stepNumber: 2,
        title: 'Shear Lag Reduction for Single Leg Connections',
        description: 'Calculate shear lag factor β = 1.4 - 0.076(w/t)(fy/fu)(bs/Lc) to determine net effective tensile rupture capacity.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Shear lag tension tear diagram'
      },
      {
        stepNumber: 3,
        title: 'Tack Bolting / Welding of Back-to-Back Pairs',
        description: 'Provide stitch bolts with washers at intervals <= 600mm for tension and <= 1000mm for compression to ensure unified action.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Double angle stitch bolting'
      }
    ],
    practicalExample: {
      title: '24m Span Industrial Fink Roof Truss Web Member',
      description: 'Diagonal web strut fabricated using 2 x ISA 65x65x6 back-to-back connected to 10mm gusset plate with M16 Grade 8.8 bolts.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Erected industrial roof truss connection node',
      specifications: {
        'Member Profile': '2-ISA 65x65x6 (IS 808)',
        'Steel Grade': 'IS 2062 E250 A',
        'Axial Force': '125 kN Compression / 85 kN Wind Reversal',
        'Gusset Plate': '10 mm thick E250',
        'Slenderness λ': '112 (well below 180 limit)'
      },
      keyTakeaway: 'Connecting back-to-back double angles on opposite sides of a gusset cancels eccentric twisting and doubles buckling resistance.'
    },
    problemSolution: {
      problemTitle: 'Premature Buckling of Single Angle Struts Along Minor V-V Axis',
      problemDescription: 'A single angle truss diagonal calculated using rx buckled catastrophically under 60% of design load.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Using rx instead of the significantly smaller rvv (rvv is typically ~0.38 x rx)', 'Failure to account for end connection eccentricity'],
      solutionTitle: 'Enforce Design per IS 800:2007 Clause 7.5.1.2 (Equivalent Slenderness)',
      solutionDescription: 'Calculate equivalent slenderness ratio λe = √(k1 + k2*λv² + k3*λφ²) which accounts for both torsional restraint and minor axis rvv.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always orient the longer leg of an unequal angle connected to a gusset to minimize out-of-plane shear lag.'
    },
    engineeringTips: [
      'In double-angle struts, never exceed stitch bolt spacing of 40 x rmin of a single angle to prevent individual leg buckling between bolts.',
      'Check edge distance of bolt holes in angle legs: minimum 1.5 x hole diameter for punched edges and 1.7 x for hand flame cut edges.'
    ],
    relevantCodesAndStandards: ['IS 808:2021', 'IS 800:2007', 'AISC 360-22 Chapter E & G', 'BS EN 10056-1'],
    relatedTopicIds: ['steel-section-channel-ismc', 'steel-section-i-beam', 'metal-fasteners-hsfg-bolts']
  },

  // 5. CHANNEL SECTIONS (ISMC / PFC)
  {
    id: 'steel-section-channel-ismc',
    slug: 'steel-channel-sections-ismc-design',
    title: 'Steel Channel Sections (ISMC / PFC): Purlins, Columns & Cleats',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Steel Sections',
    oneLineSummary: 'Structural engineering of Indian Standard Medium Channels (ISMC 75 to ISMC 400) and Parallel Flange Channels (PFC): torsion, shear center, purlin design, and built-up laced columns.',
    author: 'Structural Engineering Team',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['ISMC', 'PFC', 'Channel Section', 'IS 808', 'Purlins', 'Laced Columns', 'Shear Center'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Stacked structural steel channels ISMC in fabrication yard',
    heroBadge: 'IS 808 ISMC / BS EN 10365 PFC',
    quickOverview: [
      'ISMC Designations: Flange tapered (ISMC 100 to ISMC 400); PFC has parallel flanges for easy bolting.',
      'Shear Center Location: Positioned outside the web; transverse loading applied through web causes twisting unless braced.',
      'Common Applications: Roof purlins, side wall girts, stair stringers, crane gantry secondary girders, built-up laced columns.',
      'Purlin Sag Rods: Channels on sloping roofs require sag rods at mid-span to support weak-axis gravity loads.',
      'Built-Up Columns: Two channels placed toe-to-toe or back-to-back with lacing flats produce efficient, high-radius columns.'
    ],
    whatIsIt: {
      description: 'Indian Standard Medium Weight Channels (ISMC) are hot-rolled C-shaped sections featuring a vertical web and two horizontal flanges. Because the section is mono-symmetric, its shear center lies outside the web on the opposite side of the centroid. If loads are not applied directly through the shear center or restrained by roofing sheeting, torsional warping stresses develop.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Cross section of ISMC channel showing shear center, centroid, and tapered flange angle',
      diagramCaption: 'Figure: Cross-section geometry highlighting shear center (Sc) located behind the web and centroid (G).'
    },
    stepsTitle: 'Design & Detailing Sequence for Channel Roof Purlins',
    steps: [
      {
        stepNumber: 1,
        title: 'Bi-Axial Bending Load Resolution',
        description: 'Resolve dead and live loads into components perpendicular (w_cosθ) and parallel (w_sinθ) to roof slope θ.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Roof slope load resolution diagram'
      },
      {
        stepNumber: 2,
        title: 'Sag Rod Spacing & Weak Axis Bracing',
        description: 'Provide 12mm or 16mm round sag rods at mid-span (for span <= 6m) to reduce weak-axis bending length by 50%.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Purlin sag rod installation'
      },
      {
        stepNumber: 3,
        title: 'Cleat Angle Bolting to Rafter',
        description: 'Bolt channel web to rafter using ISA 100x75x8 cleat with minimum 2 bolts to provide rotational restraint.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Channel purlin cleat angle connection'
      }
    ],
    practicalExample: {
      title: 'Laced Built-Up Industrial Crane Stanchion (2 x ISMC 300)',
      description: 'Factory crane stanchion carrying 15-ton crane surge fabricated using two ISMC 300 channels toe-to-toe laced with 50x6 flat bars.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Built-up laced steel column in industrial facility',
      specifications: {
        'Channels': '2 x ISMC 300 (IS 808)',
        'Spacing': '220 mm back-to-back (equalizes rxx and ryy)',
        'Lacing System': 'Single lacing at 45° using 50x6 flats',
        'Axial Capacity': '1450 kN design compression',
        'Effective Length': '8.5 m'
      },
      keyTakeaway: 'Adjusting channel spacing makes the radius of gyration identical in both x and y axes, maximizing column efficiency.'
    },
    problemSolution: {
      problemTitle: 'Torsional Twist and Purlin Lip Flange Buckling Under Heavy Wind Suction',
      problemDescription: 'Channel purlins installed with top flange facing down-slope twisted severely during an aerodynamic cyclone storm.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Unrestrained bottom flange in compression under wind uplift', 'Lack of sag rods or diagonal ridge ties'],
      solutionTitle: 'Install Bottom Flange Fly Bracings to Rafter Chords',
      solutionDescription: 'Install 40x40x5 angle fly bracings connecting the purlin bottom flange directly to the bottom chord of the roof truss at alternate purlins.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always orient channel purlins so that the top flange points up-slope toward the roof ridge to simplify sheeting attachment.'
    },
    engineeringTips: [
      'Standard ISMC sections have a 1:10 (5.7°) flange taper; use tapered washers (IS 5372) when bolting through flanges to avoid bending bolts.',
      'Parallel Flange Channels (PFC) eliminate the need for tapered washers and provide 15% higher moment capacity.'
    ],
    relevantCodesAndStandards: ['IS 808:2021', 'IS 800:2007 (Clause 7.6 Laced Columns)', 'AISC 360-22', 'BS EN 10365'],
    relatedTopicIds: ['steel-section-angle-isa', 'steel-section-i-beam', 'metal-fasteners-hsfg-bolts']
  },

  // 6. I-BEAMS & H-BEAMS (ISMB & UNIVERSAL COLUMNS)
  {
    id: 'steel-section-i-beam',
    slug: 'steel-i-beams-ismb-and-h-beams-design',
    title: 'Steel I-Beams (ISMB) & H-Beams (UC / W-Shapes): Flexure, LTB & Web Buckling',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Steel Sections',
    oneLineSummary: 'Definitive structural guide to ISMB, ISJB, ISWB, Universal Beams (UB) and Wide Flange H-Beams: flexural capacity, lateral torsional buckling (LTB), web shear buckling, and stiffeners.',
    author: 'Principal Structural Engineer',
    readTime: '7 min read',
    publishDate: '2026-03-08',
    tags: ['ISMB', 'I-Beam', 'H-Beam', 'Universal Beam', 'Wide Flange', 'IS 808', 'LTB', 'Web Buckling'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Heavy wide-flange H-beams and universal beams stacked in steel fabrication yard',
    heroBadge: 'IS 808 ISMB / AISC W-Shapes',
    quickOverview: [
      'ISMB (Medium Weight Beam): Tapered flanges (ISMB 100 to ISMB 600); efficient flexural girder along major axis.',
      'H-Beams / UC (Universal Column): Square profile with wide thick flanges (bf ≈ d) engineered for heavy axial compression.',
      'Lateral Torsional Buckling (LTB): Compression flange buckles sideways while tension flange restrains it, causing sudden torsional twist.',
      'Plastic Section Modulus Zp: Used in limit state design (IS 800) giving ~12-15% higher moment capacity than elastic Ze.',
      'Web Failure Modes: Web local yielding (shear at support), web crippling (concentrated wheel load), and web buckling (axial compression).'
    ],
    whatIsIt: {
      description: 'Hot-rolled structural steel I-sections and Wide Flange H-sections are the most efficient shapes for resisting major-axis bending moments and axial column loads. The concentrated mass in the top and bottom flanges provides massive second moment of area (Ixx), while the slender vertical web resists vertical shear forces. IS 808 specifies Indian Standard Junior (ISJB), Light (ISLB), Medium (ISMB), and Wide Flange (ISWB) beams.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Cross section of I-beam showing flange width, web thickness, root radius, and plastic stress blocks',
      diagramCaption: 'Figure: I-Beam cross-section geometric parameters and fully plastic stress distribution under limit state bending.'
    },
    stepsTitle: 'Structural Design Sequence for Laterally Unsupported Beam (IS 800:2007)',
    steps: [
      {
        stepNumber: 1,
        title: 'Section Classification (Class 1, 2, 3 or 4)',
        description: 'Verify flange outstand b/tf and web depth-to-thickness d/tw ratios per IS 800 Table 2 to confirm plastic or compact behavior.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Section classification chart'
      },
      {
        stepNumber: 2,
        title: 'Elastic Lateral Torsional Buckling Moment (Mcr)',
        description: 'Compute Mcr = (π² E Iyy / LLT²) * √( (Iw / Iyy) + (LLT² G It / π² E Iyy) ) based on unbraced length LLT.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'LTB buckling deformation formula'
      },
      {
        stepNumber: 3,
        title: 'Web Bearing & Crippling Verification',
        description: 'Check concentrated bearing capacity Fw = (b1 + n1) * tw * fyw / γm0 at beam support to determine if bearing stiffeners are required.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Web crippling 45-degree dispersion'
      }
    ],
    practicalExample: {
      title: 'Commercial Office Primary Floor Girder (ISMB 500, 9m Span)',
      description: '9-meter clear span floor beam carrying cast-in-place concrete deck with welded shear studs preventing lateral buckling.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Composite steel floor beam with welded shear studs',
      specifications: {
        'Beam Profile': 'ISMB 500 (Mass 86.9 kg/m)',
        'Steel Grade': 'IS 2062 E250 B0',
        'Factored Moment Md': '410 kN·m',
        'Factored Shear Vd': '185 kN',
        'Deflection (Live)': '14.2 mm (Span / 633, complies with limit)'
      },
      keyTakeaway: 'Encasing or connecting the compression flange to a rigid concrete slab completely eliminates LTB, allowing full plastic moment capacity Mp.'
    },
    problemSolution: {
      problemTitle: 'Web Crippling Under Heavy Rolling Crane Gantry Wheel Load',
      problemDescription: 'Localized accordion-like accordion wrinkling appeared in the upper 80mm of an ISMB 600 crane girder web directly beneath the rail.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Heavy concentrated wheel point load exceeding local web crushing capacity', 'Lack of full-depth vertical web stiffeners'],
      solutionTitle: 'Weld Full-Depth Bearing Stiffeners Directly Below Rail Joints',
      solutionDescription: 'Weld paired vertical bearing stiffeners (100x12mm flats) on both sides of the web directly under wheel contact zones per IS 800 Clause 8.7.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Snip the inner corners of bearing stiffeners by 25mm to clear the internal root radius (R1) of the hot-rolled I-beam.'
    },
    engineeringTips: [
      'Flange thickness tf in ISMB is measured at 1/6th of flange width from the edge due to the internal 8° taper.',
      'Wide-Flange H-Beams (ISWB / UC / W-Shapes) have 3x higher minor-axis buckling resistance compared to standard narrow ISMB beams.'
    ],
    relevantCodesAndStandards: ['IS 808:2021', 'IS 800:2007 (Section 8 Design of Members in Bending)', 'AISC 360-22', 'BS EN 10034'],
    relatedTopicIds: ['metal-structural-steel-e350', 'steel-section-channel-ismc', 'metal-mild-steel-is2062']
  },

  // 7. HOLLOW SECTIONS (SHS, RHS, CHS) & PIPES
  {
    id: 'steel-section-hollow-tubular',
    slug: 'structural-hollow-sections-rhs-shs-chs-pipes',
    title: 'Hollow Sections (SHS, RHS, CHS) & Steel Pipes: IS 4923 & IS 1161 Design',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Steel Sections',
    oneLineSummary: 'Complete structural guide for Square (SHS), Rectangular (RHS) and Circular Hollow Sections (CHS) per IS 4923: closed profile torsion, aerodynamic drag reduction, and tubular welded nodes.',
    author: 'Tubular Steel Structures Lead',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['Hollow Sections', 'SHS', 'RHS', 'CHS', 'Steel Pipe', 'IS 4923', 'IS 1161', 'Tubular Trusses'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Architectural tubular space frame and hollow structural steel columns',
    heroBadge: 'IS 4923 / IS 1161 / EN 10219',
    quickOverview: [
      'SHS / RHS (IS 4923): High torsional rigidity (J is up to 200x higher than equal-weight open I-beams).',
      'CHS / Pipes (IS 1161 / IS 1239): Uniform radius of gyration (r) in all radial directions; lowest wind drag coefficient (Cd = 0.65).',
      'Manufacturing: Electric Resistance Welded (ERW) from continuous hot-rolled strip with high-frequency induction seam weld.',
      'Paint & Maintenance Savings: Tubular sections have 30-40% less exterior surface area than open profiles.',
      'Architectural Appeal: Clean continuous geometries without dirt/dust traps; preferred for stadiums, airports, and canopies.'
    ],
    whatIsIt: {
      description: 'Structural Hollow Sections (HSS) encompass Cold-Formed and Hot-Finished Square (SHS), Rectangular (RHS), and Circular (CHS) steel tubes. Because they form a completely closed thin-walled cross-section, their torsional constant (It) and polar moment of inertia are exponentially higher than open profiles. When used as columns, they offer balanced radii of gyration (rxx ≈ ryy), preventing minor-axis buckling.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Torsional shear stress flow comparison: open C-channel vs closed box RHS tube',
      diagramCaption: 'Figure: Continuous closed-loop Bredt shear flow in RHS box section vs warping shear distortion in open channel.'
    },
    stepsTitle: 'Fabrication & Jointing Sequence for Tubular Welded Trusses',
    steps: [
      {
        stepNumber: 1,
        title: '5-Axis CNC Pipe Saddle Profiling',
        description: 'Profile fish-mouth saddle cuts on CHS branch tubes using 5-axis CNC laser/plasma cutter to ensure gap-free fit-up onto chord.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'CNC 5-axis pipe saddle profiling cut'
      },
      {
        stepNumber: 2,
        title: 'Full End Cap Sealing Welds',
        description: 'Weld continuous hermetic end-cap plates (t = min 6mm) on all exposed ends to seal internal chamber and prevent internal corrosion.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Hermetic end cap plate welding'
      },
      {
        stepNumber: 3,
        title: 'CIDECT Design Joint Punching Shear Check',
        description: 'Verify chord face plastification, chord punching shear, and brace sidewall failure per CIDECT Design Guide rules.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Tubular joint punching shear diagram'
      }
    ],
    practicalExample: {
      title: 'Airport Terminal Cantilever Canopy (300x200x10 RHS Chords & 168 CHS Struts)',
      description: 'Curved space truss projecting 18m outward from terminal facade subjected to high dynamic aerodynamic wind flutter.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Curved airport terminal canopy tubular steel framing',
      specifications: {
        'Chord Profile': 'RHS 300x200x10 (IS 4923 YSt 310)',
        'Struts': 'CHS 168.3 x 6.3 (IS 1161 YSt 310)',
        'Joint Standard': 'CIDECT Design Guide No. 1 / IS 800 Section 9',
        'Wind Drag Coefficient': '0.70 (vs 1.80 for sharp I-beams)',
        'Protection': 'Hot Dip Galvanized + 2-Coat Epoxy Polyurethane'
      },
      keyTakeaway: 'Circular and box sections decrease wind drag forces by up to 50% compared to sharp-edged I-beams on exposed canopies.'
    },
    problemSolution: {
      problemTitle: 'Internal Corrosion & Freezing Water Rupture in Uncapped Hollow Columns',
      problemDescription: 'Hollow columns without top seal plates accumulated trapped rainwater, which froze in winter and ruptured the tube wall longitudinally.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Unsealed open ends allowing water and humidity ingress', 'Absence of internal paint or drain weeping holes'],
      solutionTitle: 'Hermetic End Sealing or Base Drain Weep Holes',
      solutionDescription: 'Ensure 100% seal-welded end caps at top, and drill an 8mm weep hole at the lowest base plate point for drainage if internal condensation is possible.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Inside hermetically sealed hollow sections, oxygen is rapidly consumed (0.2% of air volume), after which corrosion completely ceases.'
    },
    engineeringTips: [
      'In hot-dip galvanizing of hollow sections, internal pressure will cause an explosion unless mandatory diagonal vent and drainage holes (min 12mm) are drilled.',
      'Check corner radius: cold-formed SHS/RHS per IS 4923 has outer corner radius ro ≈ 2.0t to 3.0t; account for reduced flat width when calculating bolt clearances.'
    ],
    relevantCodesAndStandards: ['IS 4923:2017 (Hollow Sections)', 'IS 1161:2014 (Tubular Steel)', 'CIDECT Design Guides 1-9', 'EN 10219 / EN 10210', 'ASTM A500'],
    relatedTopicIds: ['steel-section-i-beam', 'steel-section-angle-isa', 'metal-fabrication-assembly-fitup']
  }
];
