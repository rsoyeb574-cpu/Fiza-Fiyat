import { VisualKnowledgeArticle } from '../types/visualKnowledge';

export const METAL_MATERIALS_ARTICLES: VisualKnowledgeArticle[] = [
  // 1. MILD STEEL (MS)
  {
    id: 'metal-mild-steel-is2062',
    slug: 'mild-steel-is2062-astm-a36',
    title: 'Mild Steel (MS): Structural Grade E250 / ASTM A36 Fundamentals',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Metals & Steel Materials',
    oneLineSummary: 'Standard structural mild steel with 0.15–0.22% carbon, minimum 250 MPa yield strength, 23% ductility, and exceptional weldability across structural frames.',
    author: 'Chief Metallurgical Engineer',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['MS', 'Mild Steel', 'IS 2062', 'ASTM A36', 'Structural Steel', 'E250', 'Carbon Steel'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Structural mild steel beams and fabricated members in workshop',
    heroBadge: 'IS 2062 E250 / ASTM A36',
    quickOverview: [
      'Carbon Content: 0.15% - 0.22% (Low carbon maintains weldability without preheat).',
      'Yield Strength: fy = 250 MPa (nominal up to 20mm thickness); Tensile: 410 MPa.',
      'Elongation: 23% minimum on 5.65√S0 gauge length (high ductile safety margin).',
      'Elastic Modulus: E = 200,000 MPa (200 GPa); Density: 7850 kg/m³.',
      'Governing Design Code: BIS IS 800:2007 (Limit State Design) / AISC 360-22.'
    ],
    whatIsIt: {
      description: 'Mild Steel (MS) Grade E250 (IS 2062) or ASTM A36 is the standard structural ferrous material in civil and architectural construction. With low carbon content, it avoids brittle martensite formation during welding, providing high ductility, reliable fatigue resistance, and predictable plastic hinge formation.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Stress-strain curve and cross section of structural mild steel',
      diagramCaption: 'Figure: Stress-strain curve showing well-defined upper/lower yield points (fy = 250 MPa) and long plastic plateau.'
    },
    stepsTitle: 'Fabrication & Verification Workflow',
    steps: [
      {
        stepNumber: 1,
        title: 'Material Inward Mill Test Report (MTR) Verification',
        description: 'Verify Mill Certificate 3.1 for Chemical Heat Analysis (C <= 0.22%, CE <= 0.42%) and physical bend test per IS 2062.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Mill test certificate inspection'
      },
      {
        stepNumber: 2,
        title: 'Cutting & Edge Chamfering',
        description: 'Cut with CNC fiber laser or high-definition plasma. Grind flame-cut edges 1.5mm to eliminate micro-hardening.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'CNC plasma cutting of steel'
      },
      {
        stepNumber: 3,
        title: 'Shielded Metal Arc / MIG Welding',
        description: 'Weld using AWS E7018 low-hydrogen electrodes or ER70S-6 wire. No preheat required for thickness <= 25mm in mild ambient.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Structural welding execution'
      }
    ],
    practicalExample: {
      title: 'Warehouse Portal Frame Rafter Splice Connection',
      description: 'ISMB 400 rafter moment splice using Grade E250 steel web and flange splice plates with 10.9 HSFG bolts.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Fabricated steel portal frame splice',
      specifications: {
        'Steel Grade': 'IS 2062 E250 Grade A',
        'Yield Strength': '250 MPa min',
        'Tensile Strength': '410 - 540 MPa',
        'Design Code': 'IS 800:2007 (LSD)',
        'Corrosion System': 'Sa 2.5 + Zinc Rich Epoxy + PU'
      },
      keyTakeaway: 'Low carbon mild steel provides essential ductility for earthquake plastic deformation without brittle fracture.'
    },
    problemSolution: {
      problemTitle: 'Lamellar Tearing & HAZ Cold Cracking at Heavy Fillet Welds',
      problemDescription: 'Thick flange-to-web T-joints (>25mm) develop microscopic tearing in through-thickness Z-direction from weld shrinkage constraint.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Excessive sulfur inclusions (MnS stringers)', 'High joint restraint', 'Lack of preheat on thick plates > 25mm'],
      solutionTitle: 'Specify Z-Quality Plate (IS 2062 Z25/Z35) & 100°C Preheat',
      solutionDescription: 'Specify vacuum-degassed low-sulfur steel (S <= 0.005%) with through-thickness ductility >= 25% reduction of area, and maintain 100°C preheat.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Use symmetrical double-fillet welds or peening sequence to balance thermal shrinkage forces.'
    },
    engineeringTips: [
      'For plates t > 20mm, nominal yield drops from 250 MPa to 240 MPa per IS 2062 Table 2.',
      'Never weld directly over heavy cold-formed corners without stress relief due to work-hardening microstrains.',
      'Check carbon equivalent CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 <= 0.42% for crack-safe welding.'
    ],
    relevantCodesAndStandards: ['IS 2062:2011', 'IS 800:2007', 'ASTM A36', 'AWS D1.1', 'ISO 630'],
    relatedTopicIds: ['metal-carbon-steel', 'metal-structural-steel-e350', 'steel-section-i-beam', 'metal-welding-processes-guide']
  },

  // 2. CARBON STEEL (Medium / High)
  {
    id: 'metal-carbon-steel',
    slug: 'carbon-steel-metallurgy-grades',
    title: 'Carbon Steel: Low, Medium & High Carbon Metallurgy & Applications',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Metals & Steel Materials',
    oneLineSummary: 'Engineering metallurgy of carbon steels (AISI 1018 to 1045): balancing carbon content, hardness, tensile strength, and heat-treat response.',
    author: 'Senior Metallurgist',
    readTime: '7 min read',
    publishDate: '2026-03-08',
    tags: ['Carbon Steel', 'AISI 1018', 'AISI 1045', 'EN8', 'Hardness', 'Heat Treatment'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Carbon steel shafting and billets in machine shop',
    heroBadge: 'AISI 1018 / 1045 / EN8',
    quickOverview: [
      'Low Carbon (0.05-0.25% C): High ductility, easy formability, excellent weldability.',
      'Medium Carbon (0.25-0.60% C): Quench-and-temper responsive (e.g. AISI 1045 / EN8).',
      'High Carbon (0.60-1.00% C): High hardness and wear resistance (springs, dies).',
      'Tensile Strength Range: 400 MPa (low carbon) up to 850+ MPa (quenched medium carbon).',
      'Welding Precaution: Medium/high carbon requires 150-250°C preheat to avoid brittle martensite.'
    ],
    whatIsIt: {
      description: 'Carbon steel is an iron-carbon alloy containing up to 2.1% carbon by weight with controlled manganese, phosphorus, and sulfur. As carbon content increases, tensile strength and hardness rise markedly while ductility and weldability decrease, requiring strict preheat control during fabrication.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Iron-Carbon phase equilibrium diagram',
      diagramCaption: 'Figure: Iron-Carbon Phase Diagram highlighting ferrite, pearlite, and austenite microstructures.'
    },
    stepsTitle: 'Heat Treatment Cycle for Medium Carbon Steel (AISI 1045 / C45)',
    steps: [
      {
        stepNumber: 1,
        title: 'Austenitizing at 845°C',
        description: 'Heat uniformly in controlled-atmosphere furnace to 840–860°C to dissolve cementite into full austenite phase.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Furnace austenitizing heat treat'
      },
      {
        stepNumber: 2,
        title: 'Water / Polymer Quench',
        description: 'Rapidly quench into agitated water or polymer bath to transform austenite directly into hard, needle-like martensite (55–60 HRC).',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Quenching bath agitation'
      },
      {
        stepNumber: 3,
        title: 'Tempering at 550°C',
        description: 'Reheat to 540–600°C for 2 hours to relieve internal quench stress and achieve target toughness with 28–32 HRC.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Tempering furnace cycle'
      }
    ],
    practicalExample: {
      title: 'Crane Wheel Axle & Pinion Shaft (AISI 1045 Normalized)',
      description: 'Heavy overhead gantry crane drive shafts forged from medium carbon steel normalized to 650 MPa tensile.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Machined carbon steel drive shaft',
      specifications: {
        'Carbon Content': '0.43 - 0.50% C',
        'Yield Strength': '350 MPa (Normalized) / 500 MPa (Q&T)',
        'Tensile Strength': '650 - 800 MPa',
        'Hardness': '190 - 240 BHN',
        'Machinability': '60% (relative to 1212)'
      },
      keyTakeaway: 'Medium carbon steel offers the optimum cost-to-strength ratio for rotating mechanical drive components.'
    },
    problemSolution: {
      problemTitle: 'Hardened Martensitic Underbead Cracking During Repair Welding',
      problemDescription: 'Attempting to weld a 1045 shaft with standard E6013 stick electrodes results in toe cracking within 12 hours.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['High carbon equivalent > 0.55%', 'Rapid air cooling quenching HAZ to glass-brittle martensite', 'Diffusible hydrogen from damp flux'],
      solutionTitle: 'Enforce 200°C Preheat and Low-Hydrogen E7018-H4 / ER309L',
      solutionDescription: 'Preheat component to 200°C minimum, bake electrodes at 350°C for 2 hours, and wrap in ceramic insulation for slow cooling.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'For non-critical structural repairs on medium carbon steel, austenitic stainless ER309L wire absorbs hydrogen safely.'
    },
    engineeringTips: [
      'Never specify flame cutting without subsequent post-weld heat treatment on steels with carbon > 0.35%.',
      'Verify phosphorus and sulfur remain below 0.035% to prevent hot-shortness and solidification fissures.'
    ],
    relevantCodesAndStandards: ['ASTM A29', 'AISI / SAE 1045', 'IS 5517', 'BS 970 (EN8)', 'ISO 683-1'],
    relatedTopicIds: ['metal-mild-steel-is2062', 'metal-alloy-steel', 'metal-welding-processes-guide']
  },

  // 3. STRUCTURAL HIGH-STRENGTH STEEL (E350 / ASTM A992)
  {
    id: 'metal-structural-steel-e350',
    slug: 'high-strength-structural-steel-e350-astm-a992',
    title: 'High-Strength Structural Steel: IS 2062 E350 & ASTM A992 Engineering',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Metals & Steel Materials',
    oneLineSummary: 'High-yield structural steel (fy = 350 MPa / 50 ksi) reducing steel tonnage by 20–30% in high-rise buildings and long-span bridges.',
    author: 'Structural Steel Design Lead',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['E350', 'ASTM A992', 'High Strength Steel', 'IS 2062', 'Columns', 'Heavy Beams'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'E350 high strength structural steel beams in high-rise construction',
    heroBadge: 'IS 2062 E350 / ASTM A992',
    quickOverview: [
      'Yield Strength: fy = 350 MPa (50 ksi); Tensile: 490–620 MPa.',
      'Weight Reduction: 20-30% section weight savings compared to E250 in flexural & axial members.',
      'Controlled Yield-to-Tensile Ratio: fy/fu <= 0.85 (mandatory for seismic ductility).',
      'Microalloying: Trace Vanadium, Niobium, Titanium create grain refinement.',
      'Standard Section Grade: Standard for ASTM wide-flange shapes (W-beams).'
    ],
    whatIsIt: {
      description: 'IS 2062 Grade E350 and ASTM A992 are microalloyed structural steels developed specifically for modern building frames. By adding microscopic amounts of Columbium (Niobium) and Vanadium, fine-grained ferrite-pearlite matrix is achieved, delivering 40% higher yield strength than standard mild steel while retaining excellent weldability.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Microstructural grain refinement diagram of HSLA steel',
      diagramCaption: 'Figure: Fine grain boundary pinning via carbonitride precipitate particles in E350 steel.'
    },
    stepsTitle: 'Quality Assurance Protocol for E350 High-Strength Framing',
    steps: [
      {
        stepNumber: 1,
        title: 'Yield-to-Tensile Ratio Seismic Verification',
        description: 'Verify fy/fu ratio <= 0.85 on test coupons to ensure plastic moment capacity develops before brittle fracture.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Tensile test coupon testing'
      },
      {
        stepNumber: 2,
        title: 'Electrode Matching (AWS E7018 / E8018)',
        description: 'Match weld filler metal to base metal yield: use AWS E7018 or E8018-C3 low-hydrogen basic electrodes.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Low hydrogen electrode welding'
      },
      {
        stepNumber: 3,
        title: 'Charpy V-Notch Impact Testing at 0°C',
        description: 'Verify sub-zero impact toughness >= 27 Joules at 0°C for Grade BR/B0 to resist dynamic shock loading.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Charpy impact testing pendulum'
      }
    ],
    practicalExample: {
      title: 'High-Rise Tower Transfer Girder (32m Span)',
      description: 'Heavy plate welded box girder carrying 6 tower columns using E350 steel plates up to 60mm thickness.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Transfer girder erection in skyscraper',
      specifications: {
        'Material Grade': 'IS 2062 E350 C (Killed / Normalized)',
        'Nominal Yield': '350 MPa (330 MPa for t > 40mm)',
        'Tensile Strength': '490 MPa min',
        'Impact Energy': '27 J at -20°C',
        'Deflection Limit': 'Span / 500 under dead + live load'
      },
      keyTakeaway: 'High-strength E350 steel reduces self-weight substantially, directly decreasing foundation reaction forces.'
    },
    problemSolution: {
      problemTitle: 'Excessive Deflection in E350 Members Despite Passing Bending Stress',
      problemDescription: 'Designing with 350 MPa allows smaller beam sections, but Youngs Modulus E remains identical (200 GPa), causing excessive live load sag.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Deflection is governed by moment of inertia I and E, not yield strength fy', 'Span-to-depth ratio exceeding L/20'],
      solutionTitle: 'Serviceability Limit State Check & Pre-Cambering',
      solutionDescription: 'Enforce stiffness criteria per IS 800:2007 (Table 6) and introduce pre-camber equal to 100% of dead load deflection during shop fabrication.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always check deflection and lateral-torsional buckling (LTB) first when utilizing high-strength E350 steel.'
    },
    engineeringTips: [
      'In IS 2062:2011, Sub-grades A, BR, B0, and C denote Charpy impact test temperatures of Room Temp, 0°C, 0°C guaranteed, and -20°C.',
      'Ensure preheat of 60-100°C for thickness t > 32mm to prevent root cracks in multi-pass welds.'
    ],
    relevantCodesAndStandards: ['IS 2062:2011', 'ASTM A992/A992M', 'AISC 360-22', 'IS 800:2007', 'EN 10025-2 S355JR'],
    relatedTopicIds: ['metal-mild-steel-is2062', 'steel-section-i-beam', 'steel-section-h-beam']
  },

  // 4. ALLOY STEEL (AISI 4140 / 4340)
  {
    id: 'metal-alloy-steel',
    slug: 'alloy-steel-engineering-4140-4340',
    title: 'Alloy Steel: Chromium-Molybdenum 4140 & 4340 High-Strength Steels',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Metals & Steel Materials',
    oneLineSummary: 'High-strength low-alloy Chromium-Molybdenum steels with deep hardenability, 900–1200 MPa tensile strength, and superior fatigue resistance.',
    author: 'Materials & Metallurgy Specialist',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['Alloy Steel', '4140', '4340', 'EN19', 'Chromoly', 'High Strength', 'Fatigue'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'High alloy forged steel components and machine gear blanks',
    heroBadge: 'AISI 4140 / 4340 / EN19',
    quickOverview: [
      'Composition (4140): 0.40% C, 1.0% Cr, 0.20% Mo (Chromium-Moly combination).',
      'Yield Strength (Q&T): 750 - 1000 MPa; Tensile Strength: 900 - 1200 MPa.',
      'Deep Hardenability: Molybdenum prevents temper embrittlement; Chromium enhances depth of hardness.',
      'Applications: High-strength anchor bolts, crane tie rods, hydraulic cylinder rods, heavy pinions.',
      'Welding Requirement: Requires mandatory 250-300°C preheat and immediate stress relief (PWHT).'
    ],
    whatIsIt: {
      description: 'AISI 4140 (EN19) and AISI 4340 are through-hardening Cr-Mo and Ni-Cr-Mo alloy steels. In architectural and structural engineering, they are specified for critical fatigue-loaded pins, high-capacity structural tension rods, and Grade 10.9/12.9 heavy fasteners where carbon steel fails in shear or notch toughness.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Continuous cooling transformation (CCT) diagram for 4140 alloy steel',
      diagramCaption: 'Figure: Continuous Cooling Transformation (CCT) diagram illustrating bainite and martensite transition curves.'
    },
    stepsTitle: 'Fabrication Protocol for High-Strength Structural Pins',
    steps: [
      {
        stepNumber: 1,
        title: 'Quenched & Tempered (Q&T) Heat Treatment',
        description: 'Oil quench from 850°C followed by tempering at 600°C to achieve target 28–32 HRC with high Charpy notch toughness.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Oil quenching of alloy steel pins'
      },
      {
        stepNumber: 2,
        title: 'Precision CNC Turning & Grinding',
        description: 'Turn with carbide inserts and precision ground to h7 tolerance for frictionless bearing fit in bridge hinge assemblies.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Precision cylindrical grinding'
      },
      {
        stepNumber: 3,
        title: '100% Magnetic Particle Inspection (MPI)',
        description: 'Perform wet continuous fluorescent MPI per ASTM E709 to verify zero grinding microcracks or quenching seams.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Fluorescent magnetic particle test'
      }
    ],
    practicalExample: {
      title: 'Suspension Bridge Hanger Pin Assembly (180mm Diameter)',
      description: 'Forged 4340 alloy steel pin connecting vertical cable sockets to aerodynamic bridge deck truss nodes.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Bridge cable pin connection assembly',
      specifications: {
        'Alloy': 'AISI 4340 (Vacuum Degassed)',
        'Tensile Strength': '1050 MPa',
        'Yield Strength': '930 MPa',
        'Hardness': '32 HRC',
        'Charpy V-Notch': '45 J at -40°C'
      },
      keyTakeaway: 'Nickel-Chromium-Molybdenum alloys resist multi-axial cyclic fatigue in extreme tension connections.'
    },
    problemSolution: {
      problemTitle: 'Hydrogen-Induced Delayed Cracking Under High Tensile Stress',
      problemDescription: 'High-strength 4140/4340 fasteners (>1000 MPa) exposed to acid pickling or moist galvanic environments snap spontaneously under static preload.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Atomic hydrogen absorption during acid descaling or electroplating', 'High tensile stress concentration > 70% yield'],
      solutionTitle: 'Hydrogen De-Embrittlement Baking at 200°C for 4–8 Hours',
      solutionDescription: 'Bake fasteners within 1 hour after electroplating at 190–220°C for 8 hours per ASTM F1941, or replace electroplating with mechanical zinc/geomet.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Never exceed 34 HRC hardness in high-strength bolts subject to coastal or hydrogen-rich atmospheres.'
    },
    engineeringTips: [
      'Alloy steel welding must always be followed by Post-Weld Heat Treatment (PWHT) to temper the martensitic HAZ.',
      'Specify ASTM A519 / 4140 seamless mechanical tubing for high-pressure hydraulic cylinders.'
    ],
    relevantCodesAndStandards: ['ASTM A29', 'AISI 4140 / 4340', 'IS 5517 (40Cr4Mo2)', 'ASTM A322', 'ISO 683-2'],
    relatedTopicIds: ['metal-carbon-steel', 'metal-fasteners-hsfg-bolts', 'metal-ndt-ultrasonic-inspection']
  },

  // 5. STAINLESS STEEL (SS 304 / 316)
  {
    id: 'metal-stainless-steel-ss304-316',
    slug: 'stainless-steel-ss304-ss316-architectural',
    title: 'Stainless Steel: Austenitic SS 304 & Marine-Grade SS 316 Engineering',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Metals & Steel Materials',
    oneLineSummary: 'Corrosion-resistant chromium-nickel austenitic alloys with self-healing Cr2O3 passive film for facades, chemical plants, and marine structures.',
    author: 'Corrosion & Metallurgy Director',
    readTime: '7 min read',
    publishDate: '2026-03-08',
    tags: ['Stainless Steel', 'SS 304', 'SS 316', 'Passive Film', 'Marine Grade', 'Corrosion', 'IS 6911'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Architectural stainless steel facade panels and brushed railings',
    heroBadge: 'SS 304 / SS 316 / IS 6911',
    quickOverview: [
      'SS 304 (18/8): 18% Chromium, 8% Nickel; excellent general architectural corrosion resistance.',
      'SS 316 (Marine): 16% Cr, 10% Ni + 2-3% Molybdenum (prevents chloride pitting corrosion).',
      'Yield Strength: fy = 205-240 MPa; Tensile Strength: 515-620 MPa (high work-hardening rate).',
      'Elongation: 40-50% (exceptional deep-drawing formability and energy absorption).',
      'Non-Magnetic: Austenitic FCC crystal structure in annealed condition.'
    ],
    whatIsIt: {
      description: 'Austenitic stainless steels (SS 304 / SS 316 per IS 6911 / ASTM A240) achieve corrosion resistance through an invisible, self-repairing Chromium Oxide (Cr2O3) passive film approximately 2–3 nanometers thick. When oxygen is present, this film regenerates immediately if scratched or abraded.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Microscopic diagram of chromium oxide passive film on stainless steel',
      diagramCaption: 'Figure: Self-passivating Cr2O3 layer blocking electrolyte attack on iron matrix.'
    },
    stepsTitle: 'Pickling & Passivation Workflow Post-Welding',
    steps: [
      {
        stepNumber: 1,
        title: 'Weld Heat Tint Removal',
        description: 'Remove blue/brown heat oxide scale using mechanical fine abrasive wheel or chemical pickling paste (Nitric-Hydrofluoric acid mix).',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Pickling paste application on weld'
      },
      {
        stepNumber: 2,
        title: 'High-Pressure Deionized Water Rinse',
        description: 'Rinse thoroughly with chloride-free water to neutralize residual acids and prevent pitting stains.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Water wash of pickled stainless'
      },
      {
        stepNumber: 3,
        title: 'Chemical Passivation & Ferroxyl Test',
        description: 'Treat with 20% Nitric acid or citric acid passivating bath per ASTM A967; verify free iron absence using Ferroxyl spray test.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Ferroxyl test verification'
      }
    ],
    practicalExample: {
      title: 'Coastal Hotel Exterior Curtain Wall Canopy Ties',
      description: 'Grade 316 stainless steel spider brackets and tension cables exposed to direct sea-salt aerosol 50m from coastline.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Marine grade stainless canopy spider fitting',
      specifications: {
        'Alloy': 'AISI 316 / IS 6911 X04Cr17Ni12Mo2',
        'Molybdenum Content': '2.2% Mo min',
        'Pitting Resistance (PREN)': '24 - 26',
        'Finish': 'No. 4 Satin Brushed (240 Grit)',
        'Design Life': '50+ Years without recoating'
      },
      keyTakeaway: 'Always specify SS 316 within 5 km of sea coast; SS 304 will develop brown tea-staining in chloride environments.'
    },
    problemSolution: {
      problemTitle: 'Sensitization & Intergranular Corrosion in Weld HAZ',
      problemDescription: 'Welding standard SS 304 causes chromium carbide (Cr23C6) precipitation at grain boundaries, depleting local chromium below 12% and leading to grain boundary corrosion.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Sustained exposure to 450–850°C temperature zone', 'Carbon content >= 0.08%'],
      solutionTitle: 'Specify Low-Carbon "L" Grades (SS 304L / SS 316L)',
      solutionDescription: 'Use 304L or 316L with carbon capped at <= 0.03% C, preventing carbide precipitation during multi-pass welding without needing post-weld solution annealing.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Never use carbon steel grinding discs or steel wire brushes on stainless steel to prevent iron embedding.'
    },
    engineeringTips: [
      'Calculate Pitting Resistance Equivalent Number: PREN = %Cr + 3.3(%Mo) + 16(%N). PREN >= 24 required for coastal environments.',
      'Stainless steel has 50% higher thermal expansion and 1/3 thermal conductivity compared to carbon steel; clamp rigidly to control weld distortion.'
    ],
    relevantCodesAndStandards: ['IS 6911', 'ASTM A240', 'ASTM A967', 'AWS D1.6 (Structural Welding: Stainless)', 'EN 10088-2'],
    relatedTopicIds: ['metal-sheet-metal-stainless', 'metal-corrosion-pitting', 'metal-welding-processes-guide']
  },

  // 6. GI / GALVANIZED STEEL
  {
    id: 'metal-galvanized-iron-gi',
    slug: 'galvanized-iron-steel-coating-standards',
    title: 'Galvanized Iron & Steel (GI / GP): Hot-Dip Zinc Metallurgy & Standards',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Metals & Steel Materials',
    oneLineSummary: 'Metallurgical zinc-iron alloy barrier and sacrificial cathodic protection providing 25–50 year maintenance-free structural life.',
    author: 'Corrosion Protection Group',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['GI', 'Galvanized', 'Zinc Coating', 'IS 277', 'IS 2629', 'ASTM A123', 'Cathodic Protection'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Hot-dip galvanized structural steel beams emerging from zinc kettle',
    heroBadge: 'IS 277 / IS 2629 / ASTM A123',
    quickOverview: [
      'Cathodic Sacrificial Protection: Zinc oxidizes preferentially, protecting steel even if scratched up to 2mm.',
      'Zinc Coating Weights: Continuous coil: 120 - 275 GSM (IS 277); Batch structural: 500 - 610 GSM (IS 2629 / 85 microns).',
      'Alloy Layers (Gamma, Delta, Zeta, Eta): Intermetallic Fe-Zn diffusion layers harder than structural base steel.',
      'Service Life: 25 to 50+ years in rural/urban environments (C2 to C3 corrosivity categories).',
      'Welding Precaution: Generates toxic zinc oxide fumes; requires local zinc grinding and active extraction.'
    ],
    whatIsIt: {
      description: 'Galvanized steel is steel coated with molten zinc at 450°C. Unlike organic paint, galvanizing creates a true metallurgical bond composed of four distinct iron-zinc alloy layers (Gamma, Delta, Zeta) topped by pure zinc (Eta). It provides both an impermeable barrier and galvanic sacrificial protection.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Micrograph cross section of hot dip galvanized intermetallic alloy layers',
      diagramCaption: 'Figure: Metallurgical cross section showing Gamma, Delta, Zeta intermetallic layers and Eta pure zinc layer.'
    },
    stepsTitle: 'Batch Hot-Dip Galvanizing Process (IS 2629 / ASTM A123)',
    steps: [
      {
        stepNumber: 1,
        title: 'Caustic Degreasing & Acid Pickling',
        description: 'Immerse steel in hot alkaline bath to remove grease, then pickle in 15% Hydrochloric acid (HCl) to strip all mill scale and rust.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Acid pickling bath for steel'
      },
      {
        stepNumber: 2,
        title: 'Fluxing in Zinc Ammonium Chloride',
        description: 'Dip steel into zinc ammonium chloride flux tank at 65°C to prevent oxidation before entering the molten zinc kettle.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Flux tank immersion'
      },
      {
        stepNumber: 3,
        title: 'Molten Zinc Kettle Immersion at 450°C',
        description: 'Submerge steel in molten zinc bath (98.5% pure Zn) at 445–455°C until complete thermal equilibrium and alloy diffusion occur.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Galvanizing molten zinc kettle'
      }
    ],
    practicalExample: {
      title: 'Solar PV Mounting Structure (C-Purlins & Columns)',
      description: 'Cold-formed galvanized C-channel purlins fabricated with 275 GSM pre-galvanized sheet and hot-dip galvanized base posts.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Galvanized solar module mounting structure',
      specifications: {
        'Base Metal': 'IS 2062 E250 / IS 1079',
        'Coating Class': 'HDG 85 microns (610 g/m²)',
        'Salt Spray Life': '1000 Hours to red rust per ASTM B117',
        'Vent Holes': 'Min 12mm holes on all closed tubular ends'
      },
      keyTakeaway: 'Ensure adequate drainage and venting holes in all tubular members to prevent steam explosion in the molten kettle.'
    },
    problemSolution: {
      problemTitle: 'White Rust (Wet Storage Stain) on Freshly Galvanized Steel',
      problemDescription: 'Tightly stacked galvanized sheets exposed to rainwater or condensation form a voluminous white, powdery zinc hydroxide deposit.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Stagnant moisture trapped between tightly bundled sheets', 'Lack of free airflow preventing conversion to zinc carbonate'],
      solutionTitle: 'Chromate/Polymer Passivation & Slanted Air Spacers',
      solutionDescription: 'Apply chemical passivation bath (trivalent chromium) at the galvanizer and store sheets off the ground with timber spacers on a 15° slope.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Light white rust can be brushed off with a nylon bristle brush; verify remaining zinc thickness with magnetic gauge.'
    },
    engineeringTips: [
      'Never weld directly through zinc coating without grinding 50mm on either side; zinc vapor induces severe weld root porosity.',
      'Check silicon content in base steel: Sandelin Range (0.04-0.14% Si) causes hyper-reactive, excessively thick, brittle grey zinc coatings.'
    ],
    relevantCodesAndStandards: ['IS 2629:1985', 'IS 4759', 'IS 277', 'ASTM A123 / A123M', 'ISO 1461'],
    relatedTopicIds: ['metal-sheet-metal-gi', 'metal-corrosion-mechanisms', 'metal-surface-treatment-galvanizing']
  },

  // 7. CAST IRON & WROUGHT IRON
  {
    id: 'metal-cast-iron-wrought-iron',
    slug: 'cast-iron-vs-wrought-iron-engineering',
    title: 'Cast Iron & Wrought Iron: Historical Metallurgy & Modern Structural Use',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Metals & Steel Materials',
    oneLineSummary: 'Comparative engineering: high-carbon brittle Cast Iron (high compressive strength) versus low-carbon fibrous Wrought Iron (high tensile ductility).',
    author: 'Historical Engineering Specialist',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['Cast Iron', 'Wrought Iron', 'Gray Iron', 'Ductile Iron', 'Compressive Strength', 'Heritage Restoration'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Historical cast iron architectural columns and wrought iron filigree',
    heroBadge: 'ASTM A48 / IS 210 / Heritage',
    quickOverview: [
      'Cast Iron Carbon: 2.5% to 4.0% C (High carbon creates brittle graphite flakes or nodules).',
      'Wrought Iron Carbon: < 0.08% C with 1-2% slag fibers (Fibrous grain structure, highly ductile).',
      'Compressive vs Tensile: Cast Iron has massive compressive strength (600–900 MPa) but weak tension (150–250 MPa).',
      'Damping Capacity: Gray cast iron absorbs mechanical vibration 10x better than structural steel.',
      'Modern Replacement: SG Iron / Ductile Iron (ASTM A536) replaces traditional brittle gray iron.'
    ],
    whatIsIt: {
      description: 'Cast Iron and Wrought Iron represent the foundational structural metals of the Industrial Revolution. Gray Cast Iron has high carbon in the form of graphite flakes, giving it extraordinary compressive strength and machinability but low impact resistance. Wrought iron is nearly pure iron containing microscopic iron-silicate slag fibers, conferring remarkable corrosion resistance and blacksmith forgeability.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Microscopic comparison of cast iron graphite flakes vs wrought iron slag fibers',
      diagramCaption: 'Figure: Microstructure comparison: Graphite flakes in gray iron vs fibrous slag stringers in wrought iron.'
    },
    stepsTitle: 'Heritage Structural Assessment & Repair Procedure',
    steps: [
      {
        stepNumber: 1,
        title: 'Metallographic Spark & Drill Testing',
        description: 'Distinguish cast iron from wrought iron: cast iron produces short red sparks and powdered swarf; wrought iron yields long yellow sparks and continuous chips.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Spark testing on historical metal'
      },
      {
        stepNumber: 2,
        title: 'Defect Mapping with Dye Penetrant (PT)',
        description: 'Examine capital and base connections for stress cracks using solvent-removable dye penetrant per ASTM E165.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Dye penetrant inspection on column'
      },
      {
        stepNumber: 3,
        title: 'Cold Stitching / Lock Repair (No Welding)',
        description: 'Repair cracked cast iron sections using mechanical "Metalock" cold stitching keys to avoid thermal shock cracking from welding.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Metalock stitching of cast iron'
      }
    ],
    practicalExample: {
      title: 'Heritage Railway Station Victorian Canopy Column',
      description: 'Restoration of 19th-century fluted gray cast iron columns supporting timber roof rafters.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Victorian cast iron railway column',
      specifications: {
        'Material': 'Grade 200 Gray Cast Iron (IS 210)',
        'Compressive Strength': '650 MPa',
        'Tensile Strength': '200 MPa',
        'Failure Mode': 'Brittle fracture under lateral impact',
        'Repair Standard': 'Historic England Conservation Guidelines'
      },
      keyTakeaway: 'Never apply bending or tensile moments to historic cast iron columns; support exclusively in axial compression.'
    },
    problemSolution: {
      problemTitle: 'Catastrophic Cracking When Attempting to Arc Weld Cast Iron',
      problemDescription: 'Contractor attempted to repair a broken cast iron bracket using standard E7018 steel rod, resulting in immediate louder cracking during cool-down.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['High carbon diffusion into weld pool creating high-carbon white iron', 'Zero tensile elongation unable to accommodate thermal shrinkage'],
      solutionTitle: 'High-Nickel (Ni-Rod 99/55) or Mechanical Stitching',
      solutionDescription: 'If welding is mandatory, use pure nickel (ENi-CI) electrode with 300°C uniform preheat, 25mm bead length, and immediate ball-peen hammer peening.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Prefer mechanical threaded clamping plates and epoxy locking over field welding of historic cast iron.'
    },
    engineeringTips: [
      'In structural calculations, never assign more than 20 MPa allowable tensile stress to historic gray cast iron.',
      'Ductile Iron (SG Iron) with spheroidal graphite nodules per ASTM A536 exhibits 10–18% elongation and can be engineered like carbon steel.'
    ],
    relevantCodesAndStandards: ['ASTM A48 (Gray Iron)', 'ASTM A536 (Ductile Iron)', 'IS 210', 'IS 1865', 'BS EN 1561'],
    relatedTopicIds: ['metal-mild-steel-is2062', 'metal-corrosion-mechanisms', 'metal-welding-defects-guide']
  },

  // 8. COPPER, BRASS & BRONZE
  {
    id: 'metal-copper-brass-bronze',
    slug: 'copper-brass-bronze-alloys-engineering',
    title: 'Copper, Brass & Bronze: Electrical, Plumbing & Architectural Metallurgy',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Aluminium & Non-Ferrous Metals',
    oneLineSummary: 'Non-ferrous copper alloys: C11000 ETP Copper (100% IACS conductivity), C26000 Brass (valves/fittings), and C93200 Bronze (bearing wear resistance).',
    author: 'Non-Ferrous Metallurgical Lead',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['Copper', 'Brass', 'Bronze', 'Non-Ferrous', 'Electrical Busbar', 'C11000', 'C36000', 'Bearings'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Pure copper electrical busbars and machined bronze bushing hardware',
    heroBadge: 'C11000 / C26000 / C93200',
    quickOverview: [
      'Pure Copper (C11000 ETP): 99.9% Cu, 100% IACS electrical conductivity, high thermal transfer.',
      'Brass (Copper-Zinc Alloy): C26000 / C36000; corrosion resistant, low friction, easy machinability.',
      'Bronze (Copper-Tin-Lead): C93200 SAE 660; extreme resistance to sliding friction and sea-water wear.',
      'Thermal & Electrical Conductivity: Copper thermal conductivity k = 400 W/m·K (8x higher than steel).',
      'Biostatic & Antimicrobial: Naturally suppresses bacteria, viruses, and marine biofouling.'
    ],
    whatIsIt: {
      description: 'Copper and its primary alloys (Brass and Bronze) are the most critical non-ferrous engineering metals alongside aluminium. Pure Electrolytic Tough Pitch (ETP) Copper is the foundation of modern electrical infrastructure. Brass (Cu-Zn) provides precision machinability for valves and fasteners, while Bronze (Cu-Sn) delivers exceptional anti-galling bearing performance.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Conductivity vs Hardness trade-off curve across Copper, Brass, and Phosphor Bronze',
      diagramCaption: 'Figure: Electrical conductivity (IACS %) versus mechanical tensile strength across copper-based alloy systems.'
    },
    stepsTitle: 'Fabrication of Substation Copper Busbar Assemblies',
    steps: [
      {
        stepNumber: 1,
        title: 'Punching & Cold Bending of C11000 Flat Bar',
        description: 'Bend busbars on hydraulic bar bender with minimum inside bend radius equal to thickness (R = 1.0t) to avoid outer tensile tearing.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Hydraulic copper busbar bending'
      },
      {
        stepNumber: 2,
        title: 'Electro-Tin Plating of Contact Joints',
        description: 'Electroplate contact overlap surfaces with 5-10 microns of bright tin per ASTM B545 to prevent copper oxidation and contact resistance rise.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Tin plating of electrical copper'
      },
      {
        stepNumber: 3,
        title: 'Torque Assembly with Belleville Conical Washers',
        description: 'Fasten with Grade 8.8 bolts and Belleville spring washers to maintain constant contact pressure under cyclic thermal expansion.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Torque calibrated busbar bolted joint'
      }
    ],
    practicalExample: {
      title: 'Commercial Building Main Switchboard 3200A Busbar System',
      description: 'Triple-run 100mm x 10mm ETP copper busbars rated for 65 kA short-circuit fault withstand for 1 second.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'High voltage substation switchgear busbars',
      specifications: {
        'Material': 'C11000 ETP Copper (IS 191 / ASTM B187)',
        'Conductivity': '101% IACS (58 MS/m)',
        'Yield Strength': '200 MPa',
        'Current Density': '1.2 A/mm² design limit',
        'Temperature Rise': 'Capped at 65°C over 40°C ambient'
      },
      keyTakeaway: 'Always silver-plate or tin-plate copper contact pads to maintain low contact resistance over decades.'
    },
    problemSolution: {
      problemTitle: 'Stress Corrosion Cracking (Season Cracking) in Brass Pipe Fittings',
      problemDescription: 'Plumbing brass fittings installed near cleaning chemicals develop sudden longitudinal splits along threaded nipples.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Residual tensile stress from cold-forming / pipe threading', 'Traces of airborne ammonia or cleaning vapors'],
      solutionTitle: 'Stress Relief Annealing at 260°C or DZR Brass Specification',
      solutionDescription: 'Perform post-forming stress relief at 250–280°C for 1 hour, or specify Dezincification Resistant (DZR) brass (e.g. C36500) per AS 2345.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Never overtighten tapered pipe threads in brass valves; use PTFE tape and moderate torque.'
    },
    engineeringTips: [
      'Do not couple copper directly to steel or aluminium in outdoor damp locations; copper will rapidly corrode the base metal via galvanic reaction.',
      'Phosphor Bronze (C51000) provides the highest fatigue resistance for electrical leaf springs and relay contacts.'
    ],
    relevantCodesAndStandards: ['ASTM B152', 'ASTM B187', 'IS 191', 'IS 613', 'BS EN 13601'],
    relatedTopicIds: ['metal-aluminium-profiles', 'metal-corrosion-mechanisms', 'metal-fasteners-hsfg-bolts']
  },

  // 9. ZINC & TITANIUM
  {
    id: 'metal-zinc-titanium-specialized',
    slug: 'zinc-and-titanium-architectural-engineering',
    title: 'Zinc & Titanium: Self-Healing Architectural Cladding & Aerospace Metals',
    category: 'Metal Intelligence & Machine Learning',
    subCategory: 'Aluminium & Non-Ferrous Metals',
    oneLineSummary: 'Specialized non-ferrous engineering: self-healing titanium-zinc architectural roofing (100-year life) and Grade 5 Titanium (Ti-6Al-4V) for extreme strength-to-weight.',
    author: 'Advanced Materials Lead',
    readTime: '6 min read',
    publishDate: '2026-03-08',
    tags: ['Zinc', 'Titanium', 'Ti-6Al-4V', 'Architectural Zinc', 'Rheinzink', 'Aerospace', 'Non-Ferrous'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Architectural titanium-zinc standing seam facade panels',
    heroBadge: 'Titanium-Zinc / Ti-6Al-4V',
    quickOverview: [
      'Architectural Zinc: 99.995% pure zinc alloyed with trace Titanium and Copper (EN 988).',
      'Self-Healing Patina: Develops zinc hydroxycarbonate layer that self-repairs scratches continuously.',
      'Titanium Grade 5 (Ti-6Al-4V): 900 MPa yield, 4430 kg/m³ density (half the weight of steel, twice the strength).',
      'Corrosion Immunity: Titanium is impervious to sea water, chlorine, and human body fluid.',
      'Thermal Movement: Zinc has high thermal expansion (22 x 10^-6 /K); requires sliding expansion clips.'
    ],
    whatIsIt: {
      description: 'Architectural Zinc and Titanium represent the apex of non-ferrous durability. Titanium-Zinc sheets (such as Rheinzink or VMZINC) form a protective zinc carbonate patina over decades of atmospheric exposure without requiring paint. Titanium Grade 5 is an alpha-beta alloy combining unmatched strength-to-weight ratio with total resistance to marine and chemical environments.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Chemical patina evolution of architectural zinc in atmosphere',
      diagramCaption: 'Figure: Atmospheric conversion of metallic zinc into zinc oxide, hydroxide, and durable zinc hydroxycarbonate patina.'
    },
    stepsTitle: 'Installation Steps for Standing Seam Architectural Zinc',
    steps: [
      {
        stepNumber: 1,
        title: 'Vented Structured Underlayment Installation',
        description: 'Install breathable drainage mat over timber deck to ensure continuous back-ventilation and prevent underside condensation.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Vented underlayment mat installation'
      },
      {
        stepNumber: 2,
        title: 'Double-Lock Standing Seam Seaming',
        description: 'Fold adjacent trays using mechanical seam closing tool to form a 25mm double-lock waterproof welt without solder.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Standing seam double folding tool'
      },
      {
        stepNumber: 3,
        title: 'Sliding Stainless Steel Clip Attachment',
        description: 'Anchor trays using combination of fixed clips (at ridge) and two-piece sliding clips along the run to accommodate thermal expansion.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Sliding stainless clips fastening'
      }
    ],
    practicalExample: {
      title: 'Museum Sculptural Curved Roof & Facade (VMZINC Quartz-Zinc)',
      description: 'Freeform double-curved standing seam facade engineered with 0.8mm pre-weathered architectural zinc.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Architectural zinc cladded museum building',
      specifications: {
        'Alloy': 'EN 988 Titanium-Zinc (Zn-Cu-Ti)',
        'Thickness': '0.70 - 0.80 mm',
        'Yield Strength': '100 - 140 MPa',
        'Service Life': '80 - 100+ Years',
        'Recyclability': '100% infinitely recyclable'
      },
      keyTakeaway: 'Zinc requires continuous back-ventilation of minimum 20mm air gap to prevent underside condensation corrosion.'
    },
    problemSolution: {
      problemTitle: 'Underside Corrosion from Trapped Moisture on Unvented Roofs',
      problemDescription: 'Zinc roof installed directly over plywood without an air cavity develops severe underside pitting and perforation within 5 years.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: ['Condensation without CO2 contact prevents protective carbonate patina from forming on underside'],
      solutionTitle: 'Ensure Continuous 25mm Eaves-to-Ridge Ventilation Gap',
      solutionDescription: 'Design an unobstructed 25mm counter-batten air cavity with insect mesh at eaves and continuous ridge exhaust louvers.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Never install raw zinc in contact with acidic woods such as cedar or oak; use spruce or fir.'
    },
    engineeringTips: [
      'Do not bend zinc sheet when metal temperature is below 10°C; brittle fracture will occur. Warm gently with hot air gun if working in winter.',
      'Titanium Grade 5 (Ti-6Al-4V) must be machined with rigid setups and heavy coolant due to poor thermal conductivity causing rapid tool overheating.'
    ],
    relevantCodesAndStandards: ['EN 988', 'ASTM B69', 'ASTM B265 (Titanium)', 'ASTM B348', 'ISO 9001'],
    relatedTopicIds: ['metal-aluminium-profiles', 'metal-copper-brass-bronze', 'metal-corrosion-mechanisms']
  }
];
