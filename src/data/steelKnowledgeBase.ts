import { SteelDefectRecord, NDTMethodInfo } from '../types/steelDiagnosis';

export interface SteelMaterialSpec {
  id: string;
  name: string;
  standard: string;
  grade: string;
  densityKgM3: number;
  yieldStrengthMpa: number;
  tensileStrengthMpa: number;
  elongationPercent: number;
  typicalThicknessRangeMm: string;
  weldability: 'Excellent' | 'Good' | 'Fair' | 'Requires Preheat / Special Procedure' | string;
  corrosionResistance: 'Low (Requires Coating)' | 'Moderate' | 'High (Sacrificial Zinc)' | 'Superior' | string;
  commonApplications: string[];
  fabricationNotes: string;
  indianStandardRef: string;
  internationalRef: string;
}

export const STEEL_MATERIALS_DATABASE: SteelMaterialSpec[] = [
  {
    id: 'is-2062-e250',
    name: 'Mild Steel (IS 2062 Gr. E250 / Fe 410 W)',
    standard: 'IS 2062:2011 / ASTM A36',
    grade: 'E250 (Quality A, B, C)',
    densityKgM3: 7850,
    yieldStrengthMpa: 250,
    tensileStrengthMpa: 410,
    elongationPercent: 23,
    typicalThicknessRangeMm: '1.6mm - 63mm+',
    weldability: 'Excellent',
    corrosionResistance: 'Low (Requires Coating)',
    commonApplications: [
      'Structural building frames, columns, beams (ISMB / ISMC)',
      'Trusses, purlins, industrial sheds, and canopies',
      'Fabricated base plates, gusset plates, and brackets',
      'General architectural metalwork, railings, gates, grilles'
    ],
    fabricationNotes: 'Carbon equivalent (CE) typically < 0.42. Easily welded without preheat up to 25mm thickness under normal ambient temperatures using AWS E6013 or E7018 electrodes. Bending radius minimum 1.5t to 2.0t.',
    indianStandardRef: 'BIS IS 2062:2011, IS 800:2007 (Steel Design Code)',
    internationalRef: 'ASTM A36 / EN 10025 S275JR'
  },
  {
    id: 'is-2062-e350',
    name: 'High-Strength Structural Steel (IS 2062 Gr. E350)',
    standard: 'IS 2062:2011 / ASTM A992 / EN 10025 S355',
    grade: 'E350 (Fe 490)',
    densityKgM3: 7850,
    yieldStrengthMpa: 350,
    tensileStrengthMpa: 490,
    elongationPercent: 22,
    typicalThicknessRangeMm: '5mm - 80mm+',
    weldability: 'Good',
    corrosionResistance: 'Low (Requires Coating)',
    commonApplications: [
      'Multi-story commercial framing, heavy portal frames',
      'Crane gantry girders, transfer trusses, bridge girders',
      'High-capacity columns and seismic lateral force resisting systems'
    ],
    fabricationNotes: 'Requires low-hydrogen consumables (AWS E7018 / E8018) to prevent hydrogen-induced delayed cracking. Preheat recommended when thickness exceeds 20mm or ambient temperature < 10°C.',
    indianStandardRef: 'BIS IS 2062:2011 Gr E350, IS 800:2007 Limit State Design',
    internationalRef: 'ASTM A992 / ASTM A572 Gr. 50 / EN 10025-2 S355J2'
  },
  {
    id: 'hr-sheet-plate',
    name: 'Hot Rolled (HR) Steel Sheet / Plate',
    standard: 'IS 1079 / IS 2062 / ASTM A1011',
    grade: 'HR1 to HR4 / Commercial & Structural',
    densityKgM3: 7850,
    yieldStrengthMpa: 235,
    tensileStrengthMpa: 380,
    elongationPercent: 24,
    typicalThicknessRangeMm: '1.6mm - 12.0mm (Sheets) / 12mm+ (Plates)',
    weldability: 'Excellent',
    corrosionResistance: 'Low (Requires Coating)',
    commonApplications: [
      'Base plates, stiffener plates, gussets, and end plates',
      'Heavy machinery chassis, trailer beds, agricultural implements',
      'Structural flanged channels, purlin cleats, foundation liners'
    ],
    fabricationNotes: 'Characterized by dark mill scale (Fe3O4) formed during hot rolling. Mill scale must be mechanically blasted (SSPC-SP10 / Sa 2.5) or acid-pickled prior to high-performance protective coating.',
    indianStandardRef: 'BIS IS 1079:2017 (Hot Rolled Carbon Steel Sheet & Strip)',
    internationalRef: 'ASTM A1011 / EN 10111 DD11'
  },
  {
    id: 'cr-sheet',
    name: 'Cold Rolled (CR / CRCA) Steel Sheet',
    standard: 'IS 513 / ASTM A1008',
    grade: 'CR1 (Commercial), CR2 (Drawing), CR3 (Deep Drawing)',
    densityKgM3: 7850,
    yieldStrengthMpa: 210,
    tensileStrengthMpa: 340,
    elongationPercent: 30,
    typicalThicknessRangeMm: '0.40mm - 3.20mm (26 Ga to 10 Ga)',
    weldability: 'Excellent',
    corrosionResistance: 'Low (Rusts rapidly if unoiled/unpainted)',
    commonApplications: [
      'Electrical control panels, acoustic enclosures, server racks',
      'Architectural metal doors, partition frames, ceiling tiles',
      'Automotive body panels, HVAC plenum boxes, precision ductwork'
    ],
    fabricationNotes: 'Tight dimensional tolerances, smooth uniform matte finish, free of mill scale. Excellent for CNC press-brake precision bending, laser cutting, and electro-static powder coating.',
    indianStandardRef: 'BIS IS 513:2016 (Cold Reduced Carbon Steel Sheet & Strip)',
    internationalRef: 'ASTM A1008 / EN 10130 DC01'
  },
  {
    id: 'gi-gp-sheet',
    name: 'Galvanized Iron (GI / GP) Zinc-Coated Sheet',
    standard: 'IS 277 / ASTM A653',
    grade: 'Class 1 to Class 4 (Coating: 120 to 275 g/m² - Z120 to Z275)',
    densityKgM3: 7850,
    yieldStrengthMpa: 240,
    tensileStrengthMpa: 360,
    elongationPercent: 20,
    typicalThicknessRangeMm: '0.35mm - 2.50mm',
    weldability: 'Fair (Zinc vapor hazard; requires ventilation)',
    corrosionResistance: 'High (Sacrificial Zinc)',
    commonApplications: [
      'Roofing corrugated sheets, deck slabs, cladding louvers',
      'HVAC air conditioning ducts, cable trays, rainwater gutters',
      'Pre-engineered building (PEB) light-gauge framing, cold-formed Z & C purlins'
    ],
    fabricationNotes: 'Zinc layer provides cathodic (sacrificial) protection. Welding burns off zinc coating creating toxic zinc oxide fumes (metal fume fever hazard) and creates localized bare spots requiring zinc-rich cold galvanizing compound touch-up.',
    indianStandardRef: 'BIS IS 277:2018 (Galvanized Steel Sheets Specification)',
    internationalRef: 'ASTM A653 / EN 10346 DX51D+Z'
  },
  {
    id: 'ss-304-316',
    name: 'Stainless Steel Sheet & Sections (SS 304 / SS 316)',
    standard: 'ASTM A240 / IS 6911',
    grade: 'AISI 304 (18/8) & AISI 316 (Marine Grade with 2% Mo)',
    densityKgM3: 8000,
    yieldStrengthMpa: 290,
    tensileStrengthMpa: 580,
    elongationPercent: 45,
    typicalThicknessRangeMm: '0.8mm - 25mm+',
    weldability: 'Good (GTAW/TIG, GMAW with Argon gas)',
    corrosionResistance: 'Superior',
    commonApplications: [
      'Marine and coastal architectural facades, canopies, spiders',
      'Food-grade clean rooms, chemical processing tanks, commercial kitchens',
      'Architectural balustrades, handrails, cladding panels, water storage'
    ],
    fabricationNotes: 'Austenitic stainless steel work-hardens rapidly during cutting and drilling. Requires sharp carbide tools, slower speeds, and higher feeds. Must avoid carbon steel contamination to prevent galvanic iron staining.',
    indianStandardRef: 'BIS IS 6911:2017 (Stainless Steel Plate, Sheet and Strip)',
    internationalRef: 'ASTM A240 / EN 10088-2 1.4301 / 1.4404'
  },
  {
    id: 'aluminium-sheet',
    name: 'Aluminium Alloy Sheet & Extrusions (3xxx / 5xxx / 6xxx)',
    standard: 'IS 737 / ASTM B209',
    grade: 'AA 3003-H14, AA 5052-H32, AA 6061-T6',
    densityKgM3: 2700,
    yieldStrengthMpa: 140,
    tensileStrengthMpa: 190,
    elongationPercent: 12,
    typicalThicknessRangeMm: '0.8mm - 6.0mm',
    weldability: 'Requires GTAW/GMAW with Argon & 4043/5356 wire',
    corrosionResistance: 'Superior',
    commonApplications: [
      'Curtain wall cladding, ACP composite backers, architectural louvers',
      'Structural glazing mullions, acoustic ceiling baffles',
      'Marine enclosures, lightweight transport decks'
    ],
    fabricationNotes: 'One-third the density of steel (2700 kg/m³ vs 7850 kg/m³). High thermal conductivity. Susceptible to galvanic corrosion when directly coupled with carbon steel without neoprene or nylon isolators.',
    indianStandardRef: 'BIS IS 737:2008 (Wrought Aluminium and Aluminium Alloy Sheet)',
    internationalRef: 'ASTM B209 / EN 485'
  }
];

export const NDT_METHODS_DATABASE: NDTMethodInfo[] = [
  {
    code: 'VT',
    fullName: 'Visual Testing / Inspection',
    hindiName: 'प्रत्यक्ष दृश्य परीक्षण (Visual Inspection)',
    description: 'The fundamental, mandatory first-line non-destructive test using direct eye examination, magnifying lenses, weld gauges (fillet gauge, Cambridge gauge), optical borescopes, and high-intensity illumination (min 1000 lux).',
    detectableDefects: [
      'Surface rust and corrosion scale',
      'Visible surface cracks, tears, and laminations',
      'Excessive reinforcement, undercuts, overlaps, burn-through',
      'Weld distortion, misalignments, missing bolts, loose fasteners',
      'Spatter, arc strikes, mechanical dents and gouges'
    ],
    limitations: [
      'Cannot detect subsurface defects or interior planar flaws',
      'Limited by physical line-of-sight and surface accessibility',
      'Subject to inspector visual acuity and ambient lighting'
    ],
    equipmentRequired: [
      'Hi-Lo welding gauge, bridge cam gauge, fillet weld gauge',
      'Feeler gauges, magnifying glass (5x-10x), mirror/borescope',
      'Calibrated digital vernier caliper and ultrasonic thickness gauge'
    ],
    standardReference: 'AWS B1.11, ASME Section V Article 9, IS 3658'
  },
  {
    code: 'PT',
    fullName: 'Liquid Penetrant Testing (Dye Penetrant)',
    hindiName: 'डाई पेनेट्रेंट टेस्टिंग (PT Test)',
    description: 'A sensitive surface flaw detection method where a visible red or fluorescent dye penetrant is applied to cleaned steel, dwells (10-30 min), excess is wiped, and a white developer is sprayed to draw out dye from surface-breaking cracks via capillary action.',
    detectableDefects: [
      'Hairline surface-breaking cracks in weld metal and HAZ',
      'Surface porosity, pinholes, and micro-cracks',
      'Plate edge tears, lamination breaches at free cut edges',
      'Grinding cracks, thermal fatigue fissures'
    ],
    limitations: [
      'ONLY detects defects open to the surface; cannot detect internal voids',
      'Requires thorough solvent pre-cleaning; paint, oil, and scale must be removed completely',
      'Not suitable for porous materials'
    ],
    equipmentRequired: [
      'Cleaner / Degreaser spray (Class 2 solvent)',
      'Visible red solvent-removable dye penetrant',
      'Non-aqueous wet white developer spray'
    ],
    standardReference: 'ASTM E165 / ASTM E1417, ASME Sec V Art 6, IS 3658'
  },
  {
    code: 'MT',
    fullName: 'Magnetic Particle Testing',
    hindiName: 'मैग्नेटिक पार्टिकल टेस्टिंग (MPI / MT Test)',
    description: 'A rapid, highly reliable method for ferromagnetic steels where an electromagnetic yoke induces a magnetic flux. Surface and near-subsurface flaws disrupt the flux lines (flux leakage), causing sprayed magnetic particles (black iron oxide or fluorescent) to cluster visibly along the defect.',
    detectableDefects: [
      'Surface cracks and micro-fissures in ferromagnetic structural steel',
      'Subsurface cracks up to 2mm below the surface',
      'Weld toe cracks, root cracks, lack of fusion near surface',
      'Fatigue cracks in cyclically loaded crane girders and bridge joints'
    ],
    limitations: [
      'Only works on ferromagnetic metals (Mild steel, Carbon steel). Cannot be used on austenitic stainless steel (SS304) or aluminium',
      'Requires clean surface and removal of heavy paint (>0.05mm)',
      'Components may require demagnetization after testing'
    ],
    equipmentRequired: [
      'AC/DC Electromagnetic Yoke with 4.5kg (AC) or 18kg (DC) lift capacity',
      'Magnetic dry powder or liquid suspension (black ink on white contrast paint)',
      'Pie gauge or Burmah-Castrol magnetic flux strip indicator'
    ],
    standardReference: 'ASTM E709 / ASTM E1444, ASME Sec V Art 7, IS 3703'
  },
  {
    code: 'UT',
    fullName: 'Ultrasonic Testing (including Phased Array UT & Thickness Gauging)',
    hindiName: 'अल्ट्रासोनिक टेस्टिंग (UT Test & Ultrasonic Thickness Gauge)',
    description: 'High-frequency sound waves (2 MHz to 10 MHz) are transmitted through the steel using a piezoelectric transducer and couplant gel. Sound waves reflect back from internal discontinuities and rear surfaces, producing precise echoes on an A-scan display indicating depth, size, and nature of internal flaws.',
    detectableDefects: [
      'Interior weld flaws: Lack of penetration, lack of side-wall fusion, slag inclusions',
      'Internal laminations in rolled steel plates',
      'Internal hydrogen-induced cracks and chevron cracks',
      'Accurate remaining wall thickness and corrosion section loss under paint'
    ],
    limitations: [
      'Requires certified Level II / Level III qualified technicians',
      'Requires smooth surface contact with couplant gel',
      'Difficult on thin sheet metal (< 3mm) or complex irregular geometries without specialized high-frequency delay line probes'
    ],
    equipmentRequired: [
      'Digital ultrasonic flaw detector (A-scan/PAUT)',
      'Angle beam probes (45°, 60°, 70°) and normal 0° dual element probes',
      'Calibration blocks (IIW V1, V2 blocks), ultrasonic couplant gel'
    ],
    standardReference: 'AWS D1.1 Clause 6 Part F, ASTM E164, IS 4225'
  },
  {
    code: 'RT',
    fullName: 'Radiographic Testing (X-Ray / Gamma Ray)',
    hindiName: 'रेडियोग्राफिक टेस्टिंग (X-Ray Inspection)',
    description: 'Penetrating ionizing radiation (X-ray tube or Iridium-192 isotope) passes through the welded steel onto radiographic film or a digital detector array (DR). Volumetric flaws absorb less radiation, creating darker exposure areas providing a permanent visual film record.',
    detectableDefects: [
      'Volumetric weld flaws: Internal porosity clusters, wormhole porosity',
      'Slag inclusions, tungsten inclusions from TIG welding',
      'Incomplete root penetration and root burn-through',
      'Internal shrinkage cavities and heavy internal wall thinning'
    ],
    limitations: [
      'Radiation safety hazards require strict safety exclusion cordons and radiation licensing (AERB in India / NRC)',
      'Expensive equipment and slower setup than UT',
      'Poor detection of planar cracks oriented parallel to radiation beam',
      'Requires access to both sides of the component (source on one side, film on other)'
    ],
    equipmentRequired: [
      'Portable X-ray generator or Gamma-ray camera (Ir-192 / Se-75)',
      'Radiographic film / digital flat panel detector, lead screens',
      'Image Quality Indicators (IQI / wire penetrameters ASTM/EN/IS)'
    ],
    standardReference: 'AWS D1.1 Clause 6 Part E, ASME Sec V Art 2, IS 1182'
  }
];

export const STEEL_DEFECTS_DATABASE: SteelDefectRecord[] = [
  // 1. RUST
  {
    id: 'rust-surface',
    name: 'Surface Rust (Iron Oxide Layer)',
    aliases: ['Rust', 'Surface Rusting', 'जंग', 'लोहे पर जंग', 'Jang', 'Ferrous Oxidation'],
    category: 'corrosion',
    material_types: ['Mild Steel', 'Carbon Steel', 'Hot Rolled Plate', 'Uncoated Sheet Metal'],
    description: 'An initial reddish-brown flaky coating of hydrated iron(III) oxide (Fe2O3·nH2O) formed by atmospheric electrochemical reaction between unprotected iron, atmospheric moisture, and oxygen.',
    visual_signs: [
      'Reddish-orange or powdery brown surface dust/scale',
      'Rough, granular matte surface texture replacing metallic luster',
      'No significant dimensional loss when scraped with a wire brush'
    ],
    common_causes: [
      'Lack of protective primer/coating during transport or site storage',
      'High relative humidity (>60%) and rainfall exposure',
      'Damage or abrasion to original protective paint system'
    ],
    risk_factors: ['Exposure to rain and humid air', 'Condensation cycles in non-ventilated sheds', 'Absence of shop primer'],
    severity_levels: [
      { level: 'LOW', criteria: 'Light surface rust dusting; clean steel revealed upon light wire-brushing without perceptible metal loss.' },
      { level: 'MEDIUM', criteria: 'Thicker rust scale adhering to surface; pitting not yet initiated; metal loss < 5% of thickness.' },
      { level: 'HIGH', criteria: 'Heavy stratified rust flakes peeling off; initial localized pitting starting beneath scale.' }
    ],
    inspection_methods: ['VT', 'UT'],
    possible_repairs: [
      'Manual or power-tool wire brush cleaning to St 2 or St 3 per ISO 8501-1',
      'Abrasive blast cleaning to Sa 2.0 or Sa 2.5 for critical structural members',
      'Application of rust converter or zinc phosphate primer followed by epoxy/PU topcoat system'
    ],
    prevention: [
      'Apply red oxide zinc-chromate / zinc-phosphate shop primer immediately after fabrication',
      'Store steel off-ground on timber dunnage under tarp with adequate ventilation'
    ],
    when_to_stop_work: 'Stop painting work until surface is completely dry and cleared of rust dust to specified surface cleanliness standard.',
    when_engineer_required: 'Only if rust has progressed to delaminating flake scales where section loss is suspected.',
    confidence_notes: 'Easily identified visually by reddish-brown color; must verify whether section loss is present underneath.',
    standards_references: ['ISO 8501-1 (Rust Grades A, B, C, D)', 'IS 800:2007 Clause 15.2 (Corrosion Protection)', 'SSPC-SP 2/3']
  },

  // 2. CORROSION
  {
    id: 'corrosion-atmospheric',
    name: 'Atmospheric Corrosion / General Oxidation',
    aliases: ['Corrosion', 'General Corrosion', 'Uniform Corrosion', 'संक्षारण', 'General Rust Attack'],
    category: 'corrosion',
    material_types: ['Mild Steel', 'Structural Steel I-Beams/Columns', 'Carbon Steel', 'Sheet Metal'],
    description: 'Widespread electrochemical deterioration over the exposed surface area due to reaction with moisture, oxygen, sulfur dioxide, or chlorides, resulting in uniform reduction of cross-sectional metal area.',
    visual_signs: [
      'Widespread continuous rust scale over large surface zones',
      'Rough corroded metal face with flaky blistered coating',
      'Accumulation of rust debris beneath horizontal flanges or gusset pockets'
    ],
    common_causes: [
      'Prolonged environmental exposure in coastal, marine, or industrial atmospheres',
      'Breakdown of aging paint systems exceeding design service life',
      'Water ponding due to poorly detailed structural connections without drainage weep holes'
    ],
    risk_factors: ['Chemical fumes, SO2 emissions, salt spray within 5km of coastline', 'Trapped debris retaining moisture'],
    severity_levels: [
      { level: 'LOW', criteria: 'Mild uniform surface oxidation without measurable section thickness loss (<3%).' },
      { level: 'MEDIUM', criteria: 'Consistent section loss between 5% and 15%; surface profile roughened with moderate scale.' },
      { level: 'HIGH', criteria: 'Section loss between 15% and 30%; requires ultrasonic thickness measurement and load recalculation.' },
      { level: 'CRITICAL', criteria: 'Section loss >30% in primary load-bearing flange/web or connection plate; structural integrity compromised.' }
    ],
    inspection_methods: ['VT', 'UT'],
    possible_repairs: [
      'Measure exact remaining thickness via ultrasonic thickness gauge across grid pattern',
      'Grit blast to Sa 2.5 profile (50-75 microns)',
      'Apply high-build epoxy intermediate (100-150 µm) and aliphatic polyurethane finish (50 µm)',
      'For heavy loss, weld reinforcement sister plates or splice replacement sections per engineer design'
    ],
    prevention: [
      'Specify multi-coat high durability coating system according to ISO 12944 atmospheric corrosivity category (C3/C4/C5)',
      'Provide drainage holes (min 15mm dia) in bottom flanges and hollow section base plates'
    ],
    when_to_stop_work: 'Stop work if primary beam/column section thickness loss exceeds 25% until structural engineer inspects capacity.',
    when_engineer_required: 'Mandatory whenever section loss exceeds 10% on primary structural members or at bolted/welded connections.',
    confidence_notes: 'Visual assessment shows presence of corrosion; definitive severity REQUIRES physical ultrasonic or caliper measurement.',
    standards_references: ['ISO 12944 (Corrosion Protection of Steel Structures)', 'IS 800:2007 Clause 15', 'AISC 360']
  },

  // 3. PITTING CORROSION
  {
    id: 'corrosion-pitting',
    name: 'Pitting Corrosion (Localized Cavity Attack)',
    aliases: ['Pitting', 'Pitting Corrosion', 'गड्ढेदार संक्षारण', 'Localized Deep Corrosion Holes'],
    category: 'corrosion',
    material_types: ['Carbon Steel', 'Mild Steel', 'Stainless Steel (SS304 in Chlorides)', 'Galvanized Steel'],
    description: 'An extremely insidious form of extremely localized corrosive attack that produces small, deep cavities or pits that penetrate rapidly inward through the metal wall while the surrounding surface may appear largely intact.',
    visual_signs: [
      'Small black or dark brown dots/craters surrounded by white or rust-colored mounds',
      'Pin-hole depressions penetrating deep into the thickness',
      'Under-deposit cavity formation beneath dirt or scale layers'
    ],
    common_causes: [
      'Chloride ion concentration (saline spray, de-icing salts, marine fog)',
      'Breakdown of passive oxide film in localized microscopic spots',
      'Stagnant water trapped in crevices or horizontal surfaces'
    ],
    risk_factors: ['Marine coastal environment', 'Chemical plant proximity', 'Stainless steel exposed to saltwater without molybdenum'],
    severity_levels: [
      { level: 'MEDIUM', criteria: 'Scattered shallow pits (<0.5mm deep or <15% of plate thickness).' },
      { level: 'HIGH', criteria: 'Dense pitting penetrating 15% - 35% of thickness; danger of stress concentrations and fatigue initiation.' },
      { level: 'CRITICAL', criteria: 'Pits penetrating >35% of wall thickness or pin-hole perforations in pressure/containment walls.' }
    ],
    inspection_methods: ['VT', 'PT', 'UT'],
    possible_repairs: [
      'Use depth pit micrometer gauge to record maximum pit depth and pit density per square meter',
      'Grit blast or grind to clean sound metal at bottom of pits',
      'Fill deep isolated pits with qualified weld overlay and grind flush, or install reinforcement doubler plate designed by structural engineer'
    ],
    prevention: [
      'Use SS 316 with 2-3% Molybdenum in marine/saline applications instead of SS 304',
      'Apply impermeable epoxy barrier coatings and maintain smooth surface finish'
    ],
    when_to_stop_work: 'Stop work if pitting is found in pressurized vessels, fluid containment tanks, or high-tensile connection plates.',
    when_engineer_required: 'Mandatory when pit depth exceeds 20% of section thickness or occurs along high-stress tension flanges.',
    confidence_notes: 'Visual inspection shows surface opening, but pit interior is often wider than surface aperture (undercut pits).',
    standards_references: ['ASTM G46 (Standard Guide for Examination and Evaluation of Pitting Corrosion)', 'NACE SP0198']
  },

  // 4. SECTION LOSS
  {
    id: 'section-loss',
    name: 'Structural Section Loss (Thickness Depletion)',
    aliases: ['Section Loss', 'Metal Thinning', 'मोटाई कम होना', 'क्रॉस-सेक्शन नुकसान', 'Wall Thinning'],
    category: 'corrosion',
    material_types: ['Structural Beams (ISMB)', 'Columns (ISSC/UC)', 'Plate Girders', 'Pipes and Hollow Sections'],
    description: 'Reduction of nominal cross-sectional area, flange thickness, or web thickness resulting from cumulative corrosion, erosion, or mechanical abrasion, which directly reduces section modulus (Z) and moment of inertia (I).',
    visual_signs: [
      'Thinning knife-edge profile along flange tips',
      'Wavy or holed web plates near base plates or support bearings',
      'Significant difference between uncorroded and corroded metal calipers'
    ],
    common_causes: [
      'Chronic unmitigated rust over decades of maintenance neglect',
      'Industrial chemical acid condensation or coal ash contact',
      'Buried or soil-line steel without cathodic protection'
    ],
    risk_factors: ['Ground-level splash zones', 'Bearings beneath expansion joints leaking runoff', 'Non-drainable hollow sections'],
    severity_levels: [
      { level: 'LOW', criteria: 'Measured thickness reduction < 5% of original nominal design dimension.' },
      { level: 'MEDIUM', criteria: 'Section loss between 5% and 15%; reduction in safety margin but usually within reserve factors.' },
      { level: 'HIGH', criteria: 'Section loss between 15% and 30%; critical stress check required; possible shoring needed.' },
      { level: 'CRITICAL', criteria: 'Section loss > 30% or knife-edge flange degradation; imminent risk of local buckling or yielding.' }
    ],
    inspection_methods: ['UT', 'VT'],
    possible_repairs: [
      'Carry out calibrated ultrasonic thickness (UT) grid mapping at 100mm intervals',
      'Re-analyze load-carrying capacity according to IS 800:2007 limit state design using measured remaining thickness',
      'Weld longitudinal cover plates / sister channel plates or install temporary propping and replace deteriorated section'
    ],
    prevention: [
      'Maintain continuous coating schedule; conduct ultrasonic thickness baseline checks every 3-5 years in aggressive zones',
      'Encase ground-line column bases in concrete collars up to 300mm above finished grade'
    ],
    when_to_stop_work: 'STOP WORK & EVACUATE if section loss exceeds 35% on primary building columns or major truss chord members.',
    when_engineer_required: 'MANDATORY: Structural engineer must perform engineering calculation of reduced member capacity.',
    confidence_notes: 'Image can only flag suspicious thinning. True section loss MUST be measured with ultrasonic thickness gauge.',
    standards_references: ['IS 800:2007 (General Construction in Steel - Code of Practice)', 'AISC Design Guide 15', 'ASCE 11-99']
  },

  // 5. SURFACE CRACK
  {
    id: 'crack-surface',
    name: 'Surface Crack (Hairline to Macro Crack)',
    aliases: ['Crack', 'Surface Crack', 'सतही दरार', 'Darar', 'Metal Fracture Line'],
    category: 'cracking',
    material_types: ['Structural Steel', 'Cast Steel', 'High-Strength Steel', 'Welded Assemblies'],
    description: 'A sharp, linear discontinuity breaking the metal surface caused by tensile stress concentration exceeding the material ultimate fracture toughness, thermal stress, or cyclical fatigue.',
    visual_signs: [
      'Hairline black linear trace on clean or painted steel',
      'Rust bleeding or paint flaking following a straight or jagged line',
      'Sharp cleavage separation visible under 5x-10x magnification'
    ],
    common_causes: [
      'Tensile stress concentrations around notches, holes, or geometry changes',
      'Hydrogen embrittlement or cold working strains',
      'Overloading beyond yield point during lifting, transport, or service'
    ],
    risk_factors: ['Dynamic cyclic loading', 'Low temperature operations (brittle transition)', 'Stress risers from torch cuts'],
    severity_levels: [
      { level: 'MEDIUM', criteria: 'Isolated shallow micro-crack in non-critical secondary trim or non-structural sheet.' },
      { level: 'HIGH', criteria: 'Crack in structural member body or connection gusset; length < 50mm.' },
      { level: 'CRITICAL', criteria: 'Crack actively propagating across structural flange, web, or tension member under load.' }
    ],
    inspection_methods: ['VT', 'PT', 'MT', 'UT'],
    possible_repairs: [
      'Verify crack extremities using PT or MT; drill stop-holes (6mm - 10mm dia) immediately at each crack tip to relieve stress',
      'Gouge out crack completely down to sound base metal with carbon arc gouging or grinding (U or V groove)',
      'Reweld using qualified low-hydrogen welding procedure (WPS) and 100% NDT verify'
    ],
    prevention: [
      'Eliminate sharp re-entrant corners by providing smooth radii (R >= 15mm) on cut plates',
      'Avoid unground flame-cut notches in tension flanges'
    ],
    when_to_stop_work: 'STOP WORK IMMEDIATELY if crack is found in primary beam, column, crane girder, or active connection.',
    when_engineer_required: 'MANDATORY. Any crack in a structural member requires structural engineer assessment.',
    confidence_notes: 'Must not be confused with scratch in paint; scratch has flat bottom, crack has sharp depth.',
    standards_references: ['AWS D1.1 Structural Welding Code', 'BS 7910 (Flaw Assessment)', 'IS 800:2007']
  },

  // 6. LONGITUDINAL CRACK
  {
    id: 'crack-longitudinal',
    name: 'Longitudinal Crack',
    aliases: ['Longitudinal Crack', 'लंबवत दरार', 'Parallel Crack', 'Axial Crack'],
    category: 'cracking',
    material_types: ['Welded Pipes (ERW/HFW)', 'Welded Girders', 'Rolled Sections', 'Cold Formed Tubes'],
    description: 'A crack running parallel to the longitudinal axis of the member or parallel to the welding bead direction, frequently associated with residual weld solidification stress or seam pipe forming defects.',
    visual_signs: [
      'Straight, continuous crack running along the weld centerline or adjacent HAZ parallel to joint length',
      'Separation along the longitudinal seam of circular/rectangular hollow section'
    ],
    common_causes: [
      'Centerline solidification shrinkage during high-speed automated welding',
      'Excessive weld bead depth-to-width ratio (> 1.5:1)',
      'High internal hoop stress in pressurized pipes or fluid columns'
    ],
    risk_factors: ['High restraint connections', 'Concave weld bead profiles', 'Excessive travel speed during welding'],
    severity_levels: [
      { level: 'HIGH', criteria: 'Longitudinal crack in secondary framing or unstressed seam.' },
      { level: 'CRITICAL', criteria: 'Longitudinal crack in primary built-up girder web-to-flange weld or structural column seam.' }
    ],
    inspection_methods: ['VT', 'MT', 'UT', 'RT'],
    possible_repairs: [
      'Drill crack-stop holes at both ends',
      'Excavate entire cracked weld pass plus 50mm sound metal on each end by grinding',
      'Preheat to 150°C and deposit multi-pass low-hydrogen weld beads'
    ],
    prevention: [
      'Maintain weld bead width-to-depth ratio between 1:1 and 1.4:1',
      'Decrease welding travel speed and adjust joint gap fit-up'
    ],
    when_to_stop_work: 'Stop work and relieve external load if present on primary structural elements.',
    when_engineer_required: 'Mandatory engineer and AWS/CSWIP welding inspector sign-off required.',
    confidence_notes: 'Visual indication must be corroborated with MT or PT to trace subsurface continuation.',
    standards_references: ['AWS D1.1 Clause 6', 'EN ISO 5817 Level B', 'IS 9595']
  },

  // 7. TRANSVERSE CRACK
  {
    id: 'crack-transverse',
    name: 'Transverse Crack (Perpendicular Crack)',
    aliases: ['Transverse Crack', 'तिरछी दरार', 'Cross Crack', 'Perpendicular Crack'],
    category: 'cracking',
    material_types: ['Structural Steel', 'High-Strength Alloys', 'Thick Flange Welds'],
    description: 'A crack running substantially perpendicular to the longitudinal axis of the member or weld bead. Highly dangerous as it directly compromises the longitudinal tensile load path.',
    visual_signs: [
      'Short cross-cutting cracks spaced along a weld bead or plate face',
      'Notch-like opening perpendicular to beam span tension direction'
    ],
    common_causes: [
      'Hydrogen-induced cold cracking (delayed cracking) in high-strength steels with high carbon equivalent',
      'High longitudinal residual tensile contraction stresses in rigid joints',
      'Excessive hardness in heat-affected zone (HAZ > 350 HV)'
    ],
    risk_factors: ['Thick plates (>25mm) without adequate preheat', 'Moisture on electrodes or base metal', 'Rapid cooling rates'],
    severity_levels: [
      { level: 'HIGH', criteria: 'Short transverse crack in secondary member.' },
      { level: 'CRITICAL', criteria: 'Transverse crack across tension flange or butt-weld splice in crane or bridge girder.' }
    ],
    inspection_methods: ['VT', 'MT', 'PT', 'UT'],
    possible_repairs: [
      'Complete gouging of the crack and adjacent HAZ',
      'Apply 150°C - 200°C preheat and post-weld hydrogen bake-out',
      'Reweld using stringer beads with low heat input'
    ],
    prevention: [
      'Use baked low-hydrogen electrodes (E7018-H4R baked at 350°C for 2 hrs)',
      'Enforce mandatory preheat per IS 9595 / AWS D1.1 Table 3.3 based on plate thickness and CE'
    ],
    when_to_stop_work: 'STOP WORK IMMEDIATELY. Transverse cracks in tension zones present catastrophic brittle fracture danger.',
    when_engineer_required: 'MANDATORY. Full structural investigation required.',
    confidence_notes: 'Often tight and microscopic; requires MT with AC yoke or high sensitivity fluorescent PT.',
    standards_references: ['AWS D1.1 Clause 6.12', 'IS 9595 (Metal Arc Welding Code)', 'AISC 360']
  },

  // 8. WELD CRACK
  {
    id: 'crack-weld',
    name: 'Weld Crack (Toe, Root, or Throat Crack)',
    aliases: ['Weld Crack', 'Toe Crack', 'Root Crack', 'वेल्डिंग क्रैक', 'Welding Joint Fracture'],
    category: 'welding',
    material_types: ['Welded Mild Steel', 'Structural Steel Joints', 'Plate Girders', 'Purlin Connections'],
    description: 'A fracture occurring within the deposited weld metal or in the adjacent Heat Affected Zone (HAZ). Categorized as hot cracks (during solidification) or cold cracks (hydrogen-delayed cracking up to 48 hours post-welding).',
    visual_signs: [
      'Fine fissure along the weld toe (junction where weld face meets base metal)',
      'Centerline split down the throat of the weld fillet',
      'Crater crack in the terminal puddle of the weld bead'
    ],
    common_causes: [
      'Moisture in electrode flux releasing diffusible hydrogen into weld pool',
      'Rapid cooling rates producing brittle martensitic microstructure in HAZ',
      'Excessive joint restraint preventing natural thermal contraction'
    ],
    risk_factors: ['High carbon steel', 'Welding in damp/windy conditions without shelter', 'Undersized weld beads'],
    severity_levels: [
      { level: 'HIGH', criteria: 'Crater crack or localized toe crack in non-vital secondary fillet weld.' },
      { level: 'CRITICAL', criteria: 'Crack in moment connection, beam-column flange weld, or complete penetration groove weld.' }
    ],
    inspection_methods: ['VT', 'MT', 'PT', 'UT'],
    possible_repairs: [
      'Never attempt to merely cosmetically cover crack with another weld bead or paint',
      'Fully remove defect by rotary burr grinding or carbon arc gouging; verify 100% removal with PT/MT',
      'Preheat, re-weld with approved E7018 electrode, and re-inspect after 24-48 hours'
    ],
    prevention: [
      'Store welding electrodes in temperature-controlled holding ovens at 120°C - 150°C',
      'Preheat base metal to drive away moisture and slow cooling rate',
      'Always fill weld crater completely at end of each pass'
    ],
    when_to_stop_work: 'STOP WORK IMMEDIATELY on affected assembly. Tag out structure until inspected.',
    when_engineer_required: 'MANDATORY: Structural engineer and certified welding inspector (CWI) required.',
    confidence_notes: 'AWS D1.1 and IS 800 do NOT permit ANY crack in structural welds regardless of size.',
    standards_references: ['AWS D1.1 Structural Welding Code - Steel', 'IS 800:2007 Clause 10', 'IS 9595']
  },

  // 9. LAMINATION
  {
    id: 'lamination-steel',
    name: 'Plate Lamination (Internal Planar Separation)',
    aliases: ['Lamination', 'Plate Lamination', 'लैमिनेशन', 'Internal Steel Splitting'],
    category: 'surface',
    material_types: ['Heavy Steel Plates (>12mm)', 'Hot Rolled Plate', 'Base Plates', 'Gusset Plates'],
    description: 'An internal plane of weakness or physical separation running parallel to the plate rolling surface, typically caused by flattened non-metallic slag inclusions (manganese sulfides/oxides) or unhealed ingot shrinkage pipes during rolling.',
    visual_signs: [
      'Visible horizontal split or layered appearance at flame-cut plate edges',
      'Blistering or bulging of plate surface when heated by torch cutting or welding',
      'Step-like tearing during thermal cutting'
    ],
    common_causes: [
      'Defects during steel ingot casting (piping, segregations) not cropped off at mill',
      'Heavy through-thickness (Z-direction) shrinkage strains induced by heavy fillet welds (Lamellar Tearing)'
    ],
    risk_factors: ['Plates loaded in tension perpendicular to plate surface (Z-axis)', 'Thick tee and cruciform welded joints'],
    severity_levels: [
      { level: 'MEDIUM', criteria: 'Small edge lamination (<25mm length) not within load path of tension weld.' },
      { level: 'HIGH', criteria: 'Lamination extending into the weld zone of moment flange or column base plate.' },
      { level: 'CRITICAL', criteria: 'Widespread lamination in tension flange plate or lamellar tearing beneath primary connection weld.' }
    ],
    inspection_methods: ['UT', 'VT'],
    possible_repairs: [
      'Conduct 0° straight-beam ultrasonic testing (UT) on a 100mm grid to map boundaries of lamination',
      'For edge lamination: grind out and butter with weld metal if depth is minor (<10% plate width)',
      'For structural base plate or flange: condemn and replace plate with Z-grade tested steel (through-thickness certified)'
    ],
    prevention: [
      'Order Z-quality steel (Z25 or Z35 per ASTM A770 / EN 10164) for joints subject to through-thickness tensile stresses',
      'Detail weld joints to minimize through-thickness shrinkage strain'
    ],
    when_to_stop_work: 'Stop welding on laminated plate immediately; continued welding expands internal split.',
    when_engineer_required: 'Mandatory engineer review for plate disposition and ultrasonic scanning analysis.',
    confidence_notes: 'Lamination is internal; can only be seen with naked eye at flame-cut edges or via ultrasonic 0° scan.',
    standards_references: ['ASTM A578 / ASTM A435 (Straight-Beam Ultrasonic Examination)', 'AISC 360', 'IS 800:2007']
  },

  // 10. BLISTER
  {
    id: 'blister-hydrogen',
    name: 'Hydrogen Blister / Coating Blister',
    aliases: ['Blister', 'Hydrogen Blister', 'Coating Blister', 'फफोला', 'Paint Blistering'],
    category: 'surface',
    material_types: ['Sheet Metal', 'Enclosures', 'Storage Tanks', 'Coated Steel'],
    description: 'A raised, bubble-like dome on the metal or coating surface. In metal, caused by atomic hydrogen diffusing into subsurface voids and forming molecular H2 gas under extreme pressure; in coatings, caused by osmotic moisture entrapment.',
    visual_signs: [
      'Circular raised domes or bubbles on sheet metal or paint layer',
      'Hollow sound when lightly tapped with a coin or inspection hammer',
      'Burst blisters revealing unbonded metal or powdery white/rust deposit underneath'
    ],
    common_causes: [
      'Soluble salt contamination beneath paint film drawing moisture osmotically',
      'Corrosion reaction in acidic (H2S / sour gas) environments generating nascent hydrogen',
      'Trapped solvents in rapidly dried primer'
    ],
    risk_factors: ['Pickling steel in acid without inhibitors', 'Wet paint applied over damp or contaminated substrate'],
    severity_levels: [
      { level: 'LOW', criteria: 'Isolated small paint blisters (<5mm dia) with no bare steel exposed.' },
      { level: 'MEDIUM', criteria: 'Dense coating blistering with initial rust bleeding beneath.' },
      { level: 'HIGH', criteria: 'Subsurface metal blistering in pressurized piping or vessel shell.' }
    ],
    inspection_methods: ['VT', 'UT'],
    possible_repairs: [
      'Scrape and burst blistered coating down to bare steel',
      'Test for soluble salts using Bresle patch test; wash with demineralized water',
      'Sand feather edges, re-apply primer and topcoat'
    ],
    prevention: [
      'Ensure substrate is dry, dust-free, and soluble salt levels < 20 mg/m² prior to coating application'
    ],
    when_to_stop_work: 'Stop coating application if blisters appear during drying until atmospheric conditions normalize.',
    when_engineer_required: 'Required only if metal delamination/hydrogen blistering is discovered in pressure-containing steel.',
    confidence_notes: 'Differentiate between paint film blistering (cosmetic) and base metal hydrogen blistering (structural).',
    standards_references: ['ISO 4628-2 (Assessment of Degree of Blistering)', 'NACE SP0188']
  },

  // 11. SCAB
  {
    id: 'scab-rolled-in',
    name: 'Scab / Rolled-in Scale Defect',
    aliases: ['Scab', 'Rolled-in Scale', 'रोल्ड-इन स्केल', 'Ingot Shell'],
    category: 'surface',
    material_types: ['Hot Rolled Plate', 'Structural Steel Beams', 'Sheet Metal'],
    description: 'A rough, imperfectly bonded piece of metal or oxidized scale rolled onto the surface of the steel product during hot rolling, often having a thin boundary line separating it from base metal.',
    visual_signs: [
      'Flat tongue-like or irregular shell of metal pressed into the plate face',
      'Flaky metallic flap with visible oxide demarcation underneath',
      'Surface irregularity detectable during sandblasting'
    ],
    common_causes: [
      'Splash from molten steel during ingot teeming solidifying on ingot mold wall and rolled in',
      'Incomplete descaling during hot rolling mill passes'
    ],
    risk_factors: ['Plate surfaces designated for precision machining or high-aesthetic visible finishes'],
    severity_levels: [
      { level: 'LOW', criteria: 'Shallow scab (<0.5mm depth) on non-critical architectural structural member.' },
      { level: 'MEDIUM', criteria: 'Scabs in high-stress flange areas that could act as fatigue stress risers.' }
    ],
    inspection_methods: ['VT', 'MT'],
    possible_repairs: [
      'Grind off scab flush with surrounding surface using 60-grit disc',
      'Check remaining thickness with ultrasonic gauge; if metal loss < tolerance, no welding needed'
    ],
    prevention: ['Procure prime structural steel certified to IS 2062 with mill quality certificates.'],
    when_to_stop_work: 'No immediate stop-work unless scab covers large area of precision weld preparation.',
    when_engineer_required: 'Only if excavation of scab reduces plate thickness below ASTM A6 / IS 1852 allowable mill tolerances.',
    confidence_notes: 'Common mill defect; rarely causes structural failure once ground smooth.',
    standards_references: ['ASTM A6 / A6M (General Requirements for Rolled Structural Steel)', 'IS 1852 (Rolling Tolerances)']
  },

  // 12. WAVINESS
  {
    id: 'waviness-sheet',
    name: 'Waviness / Oil Canning (Sheet Metal Flatness Deviation)',
    aliases: ['Waviness', 'Oil Canning', 'वेवीनेस', 'लहरदार शीट', 'Fluting / Buckling Ripple'],
    category: 'deformation',
    material_types: ['Cold Rolled Sheet', 'Galvanized Sheet', 'Aluminium Panels', 'Metal Roofing'],
    description: 'A visible waviness, ripple, or oil canning in wide, flat areas of light-gauge sheet metal, where elastic residual stresses cause local out-of-plane curvature.',
    visual_signs: [
      'Undulating rippled surface across thin sheet metal panels',
      'Popping or snapping sound when pressed (oil-canning effect)',
      'Distorted light reflections along building facades or ductwork'
    ],
    common_causes: [
      'Thermal expansion and contraction in rigidly fixed metal panels without slotted expansion holes',
      'Residual compressive stress from roll forming or uneven coil leveling',
      'Over-tightened fasteners distorting light gauge sheet'
    ],
    risk_factors: ['Wide flat un-ribbed metal panels', 'Dark colored metal sheets exposed to intense solar heat'],
    severity_levels: [
      { level: 'LOW', criteria: 'Minor aesthetic waviness in non-structural cladding or interior ceiling.' },
      { level: 'MEDIUM', criteria: 'Pronounced oil canning affecting weather tightness or joint sealants.' },
      { level: 'HIGH', criteria: 'Waviness in shear webs or stressed skin structures indicating compressive elastic instability.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Loosen over-torqued fasteners and reinstall with EPDM washers into slotted holes',
      'Install longitudinal stiffening ribs or backer hat-channels to stiffen flat pan',
      'In severe cases, replace panel with heavier gauge sheet (e.g. step from 24 Ga to 20 Ga)'
    ],
    prevention: [
      'Detail panels with stiffening grooves, pencil ribs, or crowned surfaces',
      'Use slotted fastener holes to accommodate thermal movement',
      'Specify minimum thickness recommended for panel width by SMACNA'
    ],
    when_to_stop_work: 'Stop panel installation if misalignment causes joint sealant failure or rainwater leakage.',
    when_engineer_required: 'Required if waviness occurs in structural diaphragm or shear wall decking under wind/seismic load.',
    confidence_notes: 'Primarily an aesthetic and thermal detailing issue in sheet metal, but structural in stressed webs.',
    standards_references: ['SMACNA Architectural Sheet Metal Manual', 'ASTM A924 (Flatness Tolerances)']
  },

  // 13. BUCKLING
  {
    id: 'buckling-structural',
    name: 'Buckling (Compressive Instability of Column/Flange/Web)',
    aliases: ['Buckling', 'Structural Buckling', 'बकलिंग', 'कॉलम का मुड़ना', 'Local / Global Flange Buckle'],
    category: 'deformation',
    material_types: ['Structural Columns (ISMB / UC)', 'Beam Compression Flanges', 'Thin Webs', 'Bracing Members'],
    description: 'A sudden, catastrophic sideways failure mode of a structural member subjected to high compressive stress, where the member loses geometric stability before reaching the yield strength of the steel.',
    visual_signs: [
      'Noticeable out-of-straightness, S-curve or bow along column length (global Euler buckling)',
      'Wavy distortion or crimping of compression flange or web plate near concentrated loads (local buckling)',
      'Flaking paint or rust pops at mid-height of compressed columns'
    ],
    common_causes: [
      'Axial overload exceeding design compressive capacity (Pcr)',
      'Excessive unbraced length (high slenderness ratio KL/r)',
      'Removal or failure of lateral torsional bracings or purlins',
      'Fire exposure reducing steel modulus of elasticity (E)'
    ],
    risk_factors: ['Slender columns without intermediate ties', 'Unrestrained long-span beam top flanges under downward load'],
    severity_levels: [
      { level: 'HIGH', criteria: 'Initial local flange crimping under crane wheel or point load without overall deflection.' },
      { level: 'CRITICAL', criteria: 'Global member curvature, out-of-plumb column, or permanent lateral-torsional beam displacement.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'IMMEDIATELY erect temporary hydraulic jacking and shoring towers to de-load the buckled member',
      'Do NOT attempt to heat-straighten a severely buckled structural column without engineer calculations',
      'Replace member or install full-length reinforcement stiffeners and lateral bracing per structural engineer redesign'
    ],
    prevention: [
      'Design compressive members strictly complying with slenderness limits (IS 800:2007 Clause 7)',
      'Provide intermediate lateral restraints to compression flanges'
    ],
    when_to_stop_work: 'CRITICAL EMERGENCY: STOP ALL WORK IMMEDIATELY, EVACUATE STRUCTURE, AND RESTRICT ACCESS.',
    when_engineer_required: 'MANDATORY IMMEDIATE ATTENDANCE: Licensed Structural Engineer required on site.',
    confidence_notes: 'Image showing curvature under load indicates dangerous structural instability.',
    standards_references: ['IS 800:2007 Clause 7 & 8 (Design of Compressive & Flexural Members)', 'AISC 360 Chapter E']
  },

  // 14. BENDING
  {
    id: 'bending-plastic',
    name: 'Plastic Bending / Permanent Deflection',
    aliases: ['Bending', 'Permanent Deflection', 'झुकना', 'मुड़ाव', 'Excessive Beam Sag'],
    category: 'deformation',
    material_types: ['Beams', 'Joists', 'Girts', 'Sheet Metal Profiles', 'Purlins'],
    description: 'Permanent out-of-plane displacement or sag occurring when bending moments exceed the elastic section modulus, stressing the outermost steel fibers beyond the yield strength (Fy).',
    visual_signs: [
      'Visibly sagging beam, floor, or roof purlin',
      'Ceiling cracks or jamming of doors/windows directly below the deflected member',
      'Separation at end connection seat angles'
    ],
    common_causes: [
      'Imposition of loads exceeding design live load or snow/pond water accumulation',
      'Undersized section selection during initial construction',
      'Damage from equipment impact or heavy rigging'
    ],
    risk_factors: ['Flat roof framing prone to water ponding', 'Purlins spaced too widely for roof sheet profile'],
    severity_levels: [
      { level: 'LOW', criteria: 'Elastic deflection within code limits (Span / 300 to Span / 250).' },
      { level: 'MEDIUM', criteria: 'Deflection noticeably exceeding Span/250 but without visible yielding or connection distress.' },
      { level: 'HIGH', criteria: 'Permanent plastic deformation; beam does not rebound after removing live load.' },
      { level: 'CRITICAL', criteria: 'Extreme sag accompanied by flange yielding or connection bolt shearing.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Survey deflection using optical level or taut line from support to support',
      'Remove excess live loads immediately; shore up beam from below',
      'Strengthen beam by welding bottom flange cover plate or trussing (post-tensioned cables)'
    ],
    prevention: [
      'Verify serviceability deflection limits per IS 800:2007 Table 6 for live loads and total loads',
      'Provide adequate camber during fabrication for long-span girders'
    ],
    when_to_stop_work: 'Stop work on the floor/roof above if sag exceeds Span / 150 or if cracking is heard.',
    when_engineer_required: 'Mandatory structural engineer calculation to verify remaining plastic capacity.',
    confidence_notes: 'Distinguish between acceptable serviceability deflection and permanent plastic failure.',
    standards_references: ['IS 800:2007 Table 6 (Deflection Limits)', 'AISC 360 Serviceability Appendix L']
  },

  // 15. WARPING
  {
    id: 'warping-torsion',
    name: 'Warping / Torsional Distortion',
    aliases: ['Warping', 'Torsional Twist', 'ऐंठन', 'Warped Steel', 'Twisting Out-of-Plane'],
    category: 'deformation',
    material_types: ['Asymmetrical Sections (Channels, Angles)', 'Fabricated Girders', 'Sheet Metal Boxes'],
    description: 'Complex non-uniform twisting or angular displacement where cross-sections do not remain plane, typically induced by asymmetrical cooling, eccentric loading, or welding on one side.',
    visual_signs: [
      'Twisted member with ends out of square or axis out of plane',
      'Sheet metal door or panel that does not lay flat against its mating frame',
      'Channel or angle bowing twisting around its shear center'
    ],
    common_causes: [
      'Applying load outside the shear center of open thin-walled sections (e.g. ISMC channels)',
      'Unbalanced heat input during continuous single-sided welding',
      'Uneven cooling during hot-dip galvanizing immersion'
    ],
    risk_factors: ['Open asymmetrical sections', 'Thin-walled assemblies welded without fixtures'],
    severity_levels: [
      { level: 'LOW', criteria: 'Minor twist in secondary light gauge trim; pull-down easily achieved with screws.' },
      { level: 'MEDIUM', criteria: 'Moderate twist in girts or purlins requiring force fit that prestresses bolts.' },
      { level: 'HIGH', criteria: 'Torsional warp in primary crane girder or bridge beam creating horizontal misalignment.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Mechanical cold straightening using hydraulic press under controlled deflection limits',
      'Flame straightening (thermal wedge heating) conducted strictly by certified structural technicians (max 650°C for mild steel)'
    ],
    prevention: [
      'Use closed hollow sections (RHS/SHS) for members subjected to significant torsional moments',
      'Employ staggered, symmetrical welding sequences (back-step welding)'
    ],
    when_to_stop_work: 'Stop installation if warping prevents full bearing contact at structural column splices.',
    when_engineer_required: 'Required for any heat-straightening procedure on primary structural steel.',
    confidence_notes: 'Visual assessment shows twist; must measure angle of rotation using digital inclinometer.',
    standards_references: ['AISC Design Guide 9 (Torsional Analysis of Structural Steel)', 'IS 800:2007']
  },

  // 16. DENT
  {
    id: 'dent-impact',
    name: 'Mechanical Dent / Impact Depression',
    aliases: ['Dent', 'Impact Dent', 'डेंट', 'गड्ढा', 'Mechanical Gouge'],
    category: 'deformation',
    material_types: ['Hollow Sections (SHS/RHS)', 'Pipes', 'Sheet Metal', 'Plate Walls'],
    description: 'A localized inward depression or indentation caused by high-energy mechanical impact (forklift strike, dropped load, collision) without complete puncture of the metal wall.',
    visual_signs: [
      'Smooth or sharp localized concave depression in tube wall or sheet',
      'Cracked or chipped paint around the perimeter of the depression',
      'Slight bulging of adjacent metal outwards'
    ],
    common_causes: [
      'Vehicle, forklift, or mobile plant collision against warehouse columns',
      'Impact from heavy materials during crane hoisting',
      'Mishandling during delivery and staging'
    ],
    risk_factors: ['Exposed columns in parking lots and warehouses without crash bollards'],
    severity_levels: [
      { level: 'LOW', criteria: 'Shallow dent (<2mm depth in sheet metal, or <5% of tube dimension).' },
      { level: 'MEDIUM', criteria: 'Dent depth between 5% and 15% of hollow section dimension without sharp creases or cracks.' },
      { level: 'HIGH', criteria: 'Severe dent with sharp crease, localized wall cracking, or dent depth >15% of column size.' }
    ],
    inspection_methods: ['VT', 'MT', 'PT'],
    possible_repairs: [
      'Inspect sharp root of dent with MT or PT to confirm absence of tension cracking',
      'For non-critical sheet metal: pull out with stud-welded dent puller and refinish',
      'For structural columns: weld perimeter reinforcement channel or collar around damaged zone per engineer design'
    ],
    prevention: [
      'Install steel crash barriers, guard rails, or concrete-filled steel pipe bollards around exposed columns',
      'Use nylon sling protectors during crane lifting'
    ],
    when_to_stop_work: 'Stop using affected column/frame if dent is accompanied by visible tearing or out-of-plumb.',
    when_engineer_required: 'Mandatory if dent is in hollow structural column carrying load above.',
    confidence_notes: 'Must verify whether dent has triggered local wall micro-cracking at sharp edges.',
    standards_references: ['AISC 360 Clause M4', 'API 579 / ASME FFS-1 (Fitness for Service Assessment)']
  },

  // 17. HOLE
  {
    id: 'hole-unauthorized',
    name: 'Hole / Perforation (Corrosion, Burn-Through, or Misdrilled)',
    aliases: ['Hole', 'Perforation', 'छेद', 'सुराख', 'Unauthorized Penetration', 'Through-Wall Breach'],
    category: 'deformation',
    material_types: ['Structural Beams', 'Sheet Metal Panels', 'Ductwork', 'Plates'],
    description: 'A complete breach or opening through the thickness of the metal. Can arise from severe corrosion breakthrough, weld burn-through, or unauthorized site-drilled penetrations for MEP pipes/cables.',
    visual_signs: [
      'Through-wall daylight hole visible from opposing side',
      'Rough jagged edges with oxide fringes (corrosion hole) or round drill marks (cut hole)',
      'Sharp edges in high-stress beam web or flange zone'
    ],
    common_causes: [
      'Terminal localized pitting or ponding corrosion eating through sheet',
      'Unauthorized trades (plumbers, electricians) torch-cutting or core-drilling holes through structural beams',
      'Excessive welding heat input on thin sheet blowing a hole'
    ],
    risk_factors: ['Holes cut in beam flanges (severely weakens bending moment capacity)', 'Holes cut in web near support (high shear)'],
    severity_levels: [
      { level: 'LOW', criteria: 'Small hole (<10mm) in non-structural sheet metal panel or drip flashing.' },
      { level: 'MEDIUM', criteria: 'Hole in low-stress zone of beam web away from supports, diameter < 1/3 web depth.' },
      { level: 'HIGH', criteria: 'Hole cut in beam tension/compression flange or within high shear zone near column support.' },
      { level: 'CRITICAL', criteria: 'Multiple unreinforced penetrations through primary transfer beam or column.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'For sheet metal: patch with mechanical riveted or welded backing plate sealed with silicone/epoxy',
      'For structural beam web: weld perimeter ring stiffener or weld full-depth doubler plate designed to restore shear capacity',
      'For beam flange: weld full penetration groove-welded replacement insert plate under engineer supervision'
    ],
    prevention: [
      'Strict site rule: NEVER cut or drill structural members without written approval from Structural Engineer',
      'Coordinate MEP openings during initial BIM modeling (Revit LOD 350+)'
    ],
    when_to_stop_work: 'STOP WORK & SHORE if unauthorized hole is discovered in tension flange of loaded roof or floor beam.',
    when_engineer_required: 'MANDATORY for any hole through structural members (beams, columns, trusses).',
    confidence_notes: 'Clearly identify if hole is mechanical (smooth/drilled) or corrosion-induced (jagged/scale).',
    standards_references: ['AISC Design Guide 2 (Steel and Composite Beams with Web Openings)', 'IS 800:2007']
  },

  // 18. TEAR
  {
    id: 'tear-fracture',
    name: 'Tear / Shear Fracture',
    aliases: ['Tear', 'Shear Tear', 'फटना', 'Tearing Failure', 'Tensile Rip'],
    category: 'cracking',
    material_types: ['Sheet Metal', 'Formed Sections', 'Connection Plates', 'Bolt Holes'],
    description: 'A physical ductile or shear rip through the metal where applied stresses have exceeded the ultimate tensile or shear strength, common at sheared edges, punched holes, or connection tear-out.',
    visual_signs: [
      'Rough, fibrous separation along sheared edge or bend line',
      'Elongated bolt hole torn open to the plate edge (block shear / end tear-out)',
      'Split corner in stamped or deep-drawn sheet metal box'
    ],
    common_causes: [
      'Insufficient edge distance (e < 1.5d) in bolted connections causing tear-out',
      'Bending sheet metal too tightly below minimum allowable bend radius',
      'Excessive tool clearance during shearing or punching'
    ],
    risk_factors: ['Cold forming high-strength steel without adequate radius', 'Overloaded bolted lap joints'],
    severity_levels: [
      { level: 'MEDIUM', criteria: 'Edge tear in non-structural enclosure or duct flange.' },
      { level: 'HIGH', criteria: 'Tear in gusset plate or secondary framing bracket.' },
      { level: 'CRITICAL', criteria: 'Bolt tear-out in primary structural connection or crane support.' }
    ],
    inspection_methods: ['VT', 'MT', 'PT'],
    possible_repairs: [
      'For connection tear-out: replace gusset/end plate with increased edge distance and thicker material',
      'Add reinforcement doubler plate with additional bolt rows or bypass welds designed by engineer'
    ],
    prevention: [
      'Enforce minimum edge distances per IS 800:2007 Table 7 (1.5x hole diameter for machine-cut, 1.7x for flame-cut edges)',
      'Adhere to minimum inside bend radii (R >= 1.5t to 2t for mild steel)'
    ],
    when_to_stop_work: 'STOP WORK IMMEDIATELY if tear is observed in any bolted connection or suspension hanger.',
    when_engineer_required: 'MANDATORY structural engineer recalculation of joint connection capacity.',
    confidence_notes: 'Visual inspection shows severe mechanical separation; requires immediate structural remediation.',
    standards_references: ['IS 800:2007 Clause 10.4 (Block Shear & Tear-out)', 'AISC 360 Section J4.3']
  },

  // 19. EDGE CRACK
  {
    id: 'crack-edge',
    name: 'Edge Crack (Cold Shearing / Punching Notch)',
    aliases: ['Edge Crack', 'किनारे की दरार', 'Sheared Edge Fissure', 'Punching Rim Crack'],
    category: 'cracking',
    material_types: ['Plates', 'Flats', 'Gussets', 'Sheet Metal'],
    description: 'Micro-cracks or visible fractures initiated at the cold-sheared or mechanically punched edge of a plate or strip, triggered by cold work embrittlement and micro-tears during cutting.',
    visual_signs: [
      'Short jagged fissures propagating inward from plate free edge',
      'Radial micro-cracks radiating from circumference of punched bolt holes',
      'Rough, burred edge profile with cleavage facets'
    ],
    common_causes: [
      'Dull shear blades or excessive clearance between punch and die (>10% plate thickness)',
      'Punching thick plate (>16mm in mild steel, >12mm in high strength steel) without subsequent reaming',
      'Severe edge cold hardening without stress relief'
    ],
    risk_factors: ['Cyclic dynamic loads (fatigue initiation)', 'Bending a plate with cut edge in tension'],
    severity_levels: [
      { level: 'MEDIUM', criteria: 'Edge crack length < 3mm in secondary sheet metal or non-tension plate.' },
      { level: 'HIGH', criteria: 'Edge crack in structural gusset plate, tension splice, or crane girder component.' },
      { level: 'CRITICAL', criteria: 'Edge crack propagating across net tension section between bolt holes.' }
    ],
    inspection_methods: ['VT', 'PT', 'MT'],
    possible_repairs: [
      'Grind off cut edge by 2mm - 3mm to remove the cold-hardened, micro-cracked zone',
      'Ream punched bolt holes by at least 2mm diameter (1mm all around) per IS 800 / AWS D1.1'
    ],
    prevention: [
      'Drill rather than punch holes in thick structural plates (>12mm)',
      'Grind or mill flame-cut and sheared edges of tension flanges'
    ],
    when_to_stop_work: 'Stop fabrication if edge cracking appears repeatedly until tooling is resharpened/re-aligned.',
    when_engineer_required: 'Required if edge cracks extend into bolt pitch zones of primary connections.',
    confidence_notes: 'Look closely at sheared edge burrs; PT testing quickly exposes hairline edge cracks.',
    standards_references: ['IS 800:2007 Clause 17.2 (Fabrication Tolerances & Hole Punching)', 'AWS D1.1']
  },

  // 20. WELD POROSITY
  {
    id: 'weld-porosity',
    name: 'Weld Porosity (Gas Cavities & Pinholes)',
    aliases: ['Porosity', 'Weld Porosity', 'Gas Pocket', 'वेल्डिंग पोरोसिटी', 'Gas Cavity', 'Pinholes'],
    category: 'welding',
    material_types: ['Welded Carbon Steel', 'Mild Steel', 'Structural Welds'],
    description: 'Cavity-type discontinuities formed by gas entrapment during weld pool solidification, appearing as scattered spherical pores, surface pinholes, or elongated wormholes.',
    visual_signs: [
      'Small round holes (sponge-like) in the surface of the weld bead',
      'Clusters of pinholes in weld stop-start areas',
      'Elongated tubular wormholes visible after slag chipping'
    ],
    common_causes: [
      'Moisture, rust, oil, grease, paint, or mill scale on joint surfaces before welding',
      'Inadequate shielding gas flow, gas hose draft, or shielding gas contamination',
      'Excessive arc length or wet/unbaked SMAW electrodes'
    ],
    risk_factors: ['Welding in windy outdoor conditions without wind screens', 'Failure to grind rust/primer off joint bevel'],
    severity_levels: [
      { level: 'LOW', criteria: 'Isolated pores (<1.5mm dia, separated by >25mm) in secondary non-structural weld.' },
      { level: 'MEDIUM', criteria: 'Moderate scattered porosity; total pore area < 1% of projected weld area.' },
      { level: 'HIGH', criteria: 'Piped/wormhole porosity or pore clusters exceeding AWS D1.1 acceptance criteria.' }
    ],
    inspection_methods: ['VT', 'RT', 'UT'],
    possible_repairs: [
      'Grind out porous weld metal completely down to sound base metal',
      'Clean cavity thoroughly with wire brush and solvent',
      'Reweld with dry, low-hydrogen electrodes and appropriate shielding'
    ],
    prevention: [
      'Grind clean 25mm back from weld bevel on both sides to bright bare metal',
      'Erect wind shelters if wind speed > 8 km/h during GMAW/FCAW welding',
      'Use dry shielding gas with dew point < -40°C'
    ],
    when_to_stop_work: 'Stop welding if gas flow drops or wind blows away shielding gas.',
    when_engineer_required: 'Required if radiographic (RT) testing shows piping porosity in full penetration moment welds.',
    confidence_notes: 'Visual porosity indicates high probability of hidden internal porosity beneath the surface.',
    standards_references: ['AWS D1.1 Table 6.1 (Visual Acceptance Criteria)', 'EN ISO 5817 Class B/C', 'IS 9595']
  },

  // 21. UNDERCUT
  {
    id: 'weld-undercut',
    name: 'Weld Undercut (Groove at Weld Toe)',
    aliases: ['Undercut', 'Weld Undercut', 'अंडरकट', 'Toe Groove', 'Toe Notch'],
    category: 'welding',
    material_types: ['Welded Structural Steel', 'Fillet Welds', 'Groove Welds'],
    description: 'A groove melted into the base metal adjacent to the weld toe or weld root and left unfilled by deposited weld metal, creating a severe sharp notch and stress riser.',
    visual_signs: [
      'Continuous or intermittent trench along the weld border in parent plate',
      'Sharp groove measurable with bridge cam or undercut gauge (>0.5mm depth)',
      'Shadow line visible along weld toe under angled lighting'
    ],
    common_causes: [
      'Excessive welding current (heat input too high for electrode diameter)',
      'Excessive arc length or incorrect electrode travel angle',
      'Travel speed too fast, leaving pool insufficient time to fill groove'
    ],
    risk_factors: ['Members subjected to fatigue / dynamic cyclic loads (crane beams, bridges)'],
    severity_levels: [
      { level: 'LOW', criteria: 'Depth <= 0.5mm in static structural member with plate thickness >= 10mm.' },
      { level: 'MEDIUM', criteria: 'Depth between 0.5mm and 1.0mm in primary structural member.' },
      { level: 'HIGH', criteria: 'Depth > 1.0mm, or ANY undercut > 0.25mm in tension member subject to cyclic fatigue.' }
    ],
    inspection_methods: ['VT', 'MT'],
    possible_repairs: [
      'Measure exact depth using calibrated bridge cam undercut gauge',
      'If depth < 0.5mm: blend grind smooth with 80-grit burr to smooth radius transition without notches',
      'If depth > 1.0mm: deposit small stringer pass with smaller diameter electrode (e.g. 2.5mm E7018) and blend grind smooth'
    ],
    prevention: [
      'Reduce welding current; maintain short arc length',
      'Hold slight pause at sides of weave to allow molten filler to wash up and fill groove'
    ],
    when_to_stop_work: 'Stop welding and recalibrate welding parameters if welder consistently produces deep undercuts.',
    when_engineer_required: 'Required if undercut occurs in fatigue-sensitive cyclic tension welds (AWS D1.1 Section 6).',
    confidence_notes: 'Gauge measurement required; visual estimation often exaggerates or underestimates true depth.',
    standards_references: ['AWS D1.1 Clause 6 Table 6.1', 'IS 800:2007 Clause 10.2', 'ISO 5817']
  },

  // 22. OVERLAP
  {
    id: 'weld-overlap',
    name: 'Weld Overlap / Cold Lap',
    aliases: ['Overlap', 'Cold Lap', 'ओवरलैप', 'Unfused Rollover', 'Spillover'],
    category: 'welding',
    material_types: ['Welded Steel', 'Fillet Welds', 'Multi-pass Girders'],
    description: 'The protrusion of weld metal beyond the weld toe or weld root without fusion into the underlying base metal surface, forming an extremely tight, sharp mechanical crack-like crevice.',
    visual_signs: [
      'Rounded, protruding lip of weld metal lying loose on top of plate surface',
      'A razor blade or thin feeler gauge can slip underneath the weld toe',
      'Weld bead appears bunched up with convex bulging contour'
    ],
    common_causes: [
      'Welding travel speed too slow, allowing molten metal to pool ahead of the arc',
      'Insufficient welding current (cold arc) failing to melt base metal',
      'Incorrect electrode angle pointing too far toward molten puddle'
    ],
    risk_factors: ['Severe notch effect initiating fatigue cracks under cyclical stress'],
    severity_levels: [
      { level: 'MEDIUM', criteria: 'Minor isolated overlap in secondary non-structural bracket.' },
      { level: 'HIGH', criteria: 'Continuous overlap along toe of structural fillet weld (rejected by AWS D1.1 & IS 800).' }
    ],
    inspection_methods: ['VT', 'MT', 'PT'],
    possible_repairs: [
      'Grind off overlapping excess metal flush with sound base metal until smooth transition (transition angle >= 135°)',
      'Perform MT or PT inspection after grinding to verify that fusion exists beneath and no crack initiated'
    ],
    prevention: [
      'Increase welding travel speed slightly; increase current to ensure base metal melts cleanly ahead of puddle',
      'Direct arc at root of joint rather than at deposited weld puddle'
    ],
    when_to_stop_work: 'Stop work if overlap is widespread on fillet welds; adjust welder technique.',
    when_engineer_required: 'AWS D1.1 specifies ZERO allowable overlap on structural welds; CWI verification required.',
    confidence_notes: 'Feeler gauge or pick test easily reveals if weld toe is fused or resting loose on plate.',
    standards_references: ['AWS D1.1 Clause 6.1', 'IS 9595', 'EN ISO 5817 Quality Level B']
  },

  // 23. LACK OF FUSION
  {
    id: 'weld-lack-of-fusion',
    name: 'Lack of Fusion (Incomplete Fusion / Cold Lap)',
    aliases: ['Lack of Fusion', 'Incomplete Fusion', 'फ्यूजन की कमी', 'Cold Lap', 'Non-Bonding'],
    category: 'welding',
    material_types: ['Multi-pass Welds', 'Heavy Plates', 'Groove Welds'],
    description: 'A planar discontinuity where weld metal fails to fuse and coalesce with the parent base metal or with adjacent preceding weld beads, leaving a microscopic separation plane along the joint face.',
    visual_signs: [
      'Usually internal, but may be visible at starts/stops or cut cross-sections as an unfused seam line',
      'Weld bead peeling off base metal under mechanical hammer tap'
    ],
    common_causes: [
      'Insufficient heat input (amperage too low or travel speed too high)',
      'Failure to grind off oxide mill scale, slag, or primer between passes',
      'Arc wandering or incorrect electrode angle failing to impinge on sidewalls'
    ],
    risk_factors: ['Thick plates with high heat sink capability', 'Narrow deep groove preparations'],
    severity_levels: [
      { level: 'HIGH', criteria: 'Isolated short sidewall lack of fusion in secondary member.' },
      { level: 'CRITICAL', criteria: 'Lack of fusion in complete joint penetration (CJP) groove weld in moment frame.' }
    ],
    inspection_methods: ['UT', 'RT', 'VT'],
    possible_repairs: [
      'Excavate defective weld zone by carbon arc gouging or grinding down to base metal',
      'Verify clean groove with PT or MT',
      'Preheat and reweld with approved WPS ensuring adequate sidewall dwell time'
    ],
    prevention: [
      'Clean every pass completely of slag and glassy silica islands before next pass',
      'Ensure proper joint root opening and bevel angle (min 45°-60° for V-grooves)'
    ],
    when_to_stop_work: 'STOP WORK on affected assembly. Planar lack of fusion is a critical rejectable defect.',
    when_engineer_required: 'MANDATORY. Welder re-qualification and engineering disposition required.',
    confidence_notes: 'Ultrasonic angle-beam testing (UT) is the best method to detect planar lack of sidewall fusion.',
    standards_references: ['AWS D1.1 Table 6.2/6.3 (UT Acceptance Criteria)', 'IS 800:2007', 'ASME Sec VIII']
  },

  // 24. LACK OF PENETRATION
  {
    id: 'weld-lack-of-penetration',
    name: 'Lack of Penetration (Incomplete Joint Penetration)',
    aliases: ['Lack of Penetration', 'Incomplete Penetration', 'पेनेट्रेशन की कमी', 'Root Gap Unfused'],
    category: 'welding',
    material_types: ['Butt Welds', 'Pipe Seams', 'Structural Groove Welds'],
    description: 'Failure of the weld metal to extend completely into and fuse through the root of the joint to the specified depth, leaving an unbonded root gap that acts as an intense stress concentrator.',
    visual_signs: [
      'Unfused root face visible from backside of single-sided butt weld',
      'Original machined bevel root face edge intact and visible through weld bottom',
      'Dark linear shadow along center of root on radiographic film'
    ],
    common_causes: [
      'Root face (land) too thick or root gap too narrow for electrode diameter',
      'Welding current too low on root pass',
      'Electrode diameter too large to reach bottom of narrow groove angle'
    ],
    risk_factors: ['Joints subject to tensile bending loads (root in tension)', 'Cyclic fatigue loading'],
    severity_levels: [
      { level: 'HIGH', criteria: 'Incomplete penetration in partial penetration (PJP) weld exceeding specified allowance.' },
      { level: 'CRITICAL', criteria: 'ANY lack of penetration in Complete Joint Penetration (CJP) specified structural weld.' }
    ],
    inspection_methods: ['UT', 'RT', 'VT'],
    possible_repairs: [
      'Back-gouge the backside of the joint down to sound weld metal with carbon arc torch',
      'Grind clean groove and deposit backing pass weld to achieve complete penetration'
    ],
    prevention: [
      'Use proper fit-up tolerances (Root gap 2.5mm - 3.5mm, root land 1.5mm - 2.0mm)',
      'Use smaller diameter electrode (e.g. 2.5mm or 3.2mm) for root run before weaving larger fill passes'
    ],
    when_to_stop_work: 'Stop further welding passes until root pass penetration is verified.',
    when_engineer_required: 'Mandatory CWI / Structural engineer review for CJP joints.',
    confidence_notes: 'Can be seen with naked eye only if backside of weld is accessible; otherwise requires UT or RT.',
    standards_references: ['AWS D1.1 Clause 6', 'IS 9595', 'EN ISO 5817']
  },

  // 25. EXCESSIVE WELD REINFORCEMENT
  {
    id: 'weld-excessive-reinforcement',
    name: 'Excessive Weld Reinforcement (Crown Buildup)',
    aliases: ['Excessive Reinforcement', 'Heavy Cap', 'अत्यधिक वेल्ड उभार', 'Over-welded Cap', 'High Crown'],
    category: 'welding',
    material_types: ['Groove Welds', 'Butt Joints', 'Structural Splices'],
    description: 'Deposited weld metal in excess of the quantity required to fill a joint, forming an excessively high, steep crown (>3mm above plate surface) that creates an abrupt geometric notch at the weld toes.',
    visual_signs: [
      'High hump-shaped weld cap standing tall above the surrounding plate face',
      'Steep abrupt angle (>45°) where weld cap slopes down to meet the plate surface',
      'Height exceeds 3mm on plate thickness <= 25mm (AWS D1.1 limit)'
    ],
    common_causes: [
      'Excessive passes or deposit rate without adequate joint spread',
      'Travel speed too slow during final cap pass',
      'Misguided belief that "more weld metal equals stronger joint"'
    ],
    risk_factors: ['Fatigue failure at toes due to high geometric stress concentration factor (Kt)'],
    severity_levels: [
      { level: 'LOW', criteria: 'Cap height 3mm - 4mm in static structural member.' },
      { level: 'MEDIUM', criteria: 'Cap height > 4mm with abrupt toe transition in building frame.' },
      { level: 'HIGH', criteria: 'Excessive reinforcement in bridge, crane runway, or cyclic fatigue application.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Measure cap height with bridge cam weld gauge',
      'Carefully grind down reinforcement to smooth contour (max 1.5mm - 2mm height) with transition angle >= 135°',
      'Do not gouge into adjacent base metal during grinding'
    ],
    prevention: [
      'Control capping parameters; maintain steady travel speed and uniform oscillation',
      'Instruct welders on AWS D1.1 reinforcement limits (max 3mm for most structural applications)'
    ],
    when_to_stop_work: 'No emergency stop work, but grind smooth prior to painting and NDT testing.',
    when_engineer_required: 'Only if over-grinding occurs, reducing parent plate thickness below nominal.',
    confidence_notes: 'Easily measured accurately with a Bridge Cam or Cambridge weld gauge.',
    standards_references: ['AWS D1.1 Table 6.1 (Reinforcement Limits)', 'IS 800:2007 Clause 10.2']
  },

  // 26. WELD DISTORTION
  {
    id: 'weld-distortion',
    name: 'Weld Distortion (Angular & Longitudinal Thermal Shrinkage)',
    aliases: ['Weld Distortion', 'Welding Warpage', 'वेल्डिंग विकृति', 'वेल्डिंग से टेढ़ा होना', 'Thermal Shrinkage Bow'],
    category: 'welding',
    material_types: ['Fabricated Girders', 'Light Sheet Metal', 'T-Sections', 'Portal Frames'],
    description: 'Permanent angular, longitudinal, or transverse warping of steel components caused by non-uniform thermal expansion and contraction cycles during the heating and cooling of weld metal.',
    visual_signs: [
      'Angular distortion: Plates pulling towards the side with more weld metal (V-joint tipping)',
      'Longitudinal bowing or camber along the length of welded built-up beam',
      'Buckling ripples in thin web plates adjacent to flange fillet welds'
    ],
    common_causes: [
      'Excessive weld size beyond design requirements (e.g. 10mm fillet where 6mm was specified)',
      'Unbalanced welding: all passes deposited on one side before welding other side',
      'Lack of mechanical clamping, strongbacks, or pre-setting jigs'
    ],
    risk_factors: ['Light-gauge sheet metal fabrications', 'Long slender built-up I-girders'],
    severity_levels: [
      { level: 'LOW', criteria: 'Minor distortion within allowable mill/fabrication tolerances (IS 7215 / AWS D1.1).' },
      { level: 'MEDIUM', criteria: 'Distortion exceeding allowable camber/sweep, requiring mechanical clamping to erect.' },
      { level: 'HIGH', criteria: 'Severe distortion preventing bolt hole alignment or causing out-of-square framing.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Controlled flame straightening (line heating, spot heating, or wedge heating max 600°C - 650°C for mild steel)',
      'Mechanical straightening using hydraulic rams and jacking frames under engineer approval',
      'Avoid violent cold hammering which induces micro-cracks'
    ],
    prevention: [
      'Do not over-weld; keep weld size strictly to structural drawing requirements',
      'Use balanced welding sequences (back-step welding, alternating passes on opposite sides of neutral axis)',
      'Pre-camber or pre-set joints in opposite direction before welding'
    ],
    when_to_stop_work: 'Stop welding and re-clamp if distortion noticeably pulls member out of drawing tolerances.',
    when_engineer_required: 'Required for approval of flame-straightening procedures on major structural girders.',
    confidence_notes: 'Common fabrication issue; can be minimized through proper welding sequence.',
    standards_references: ['AWS D1.1 Clause 5.23 (Dimensional Tolerances)', 'IS 7215 (Tolerances for Fabrication of Steel Structures)']
  },

  // 27. POOR WELD PROFILE
  {
    id: 'weld-poor-profile',
    name: 'Poor Weld Profile (Uneven Leg, Asymmetry, Convexity)',
    aliases: ['Poor Weld Profile', 'Uneven Bead', 'खराब वेल्ड प्रोफाइल', 'Irregular Bead Contour', 'Asymmetrical Fillet'],
    category: 'welding',
    material_types: ['Fillet Welds', 'Cover Passes', 'Structural Connections'],
    description: 'Irregular, rough, or asymmetrical weld bead geometry failing to maintain standard 45° equal leg lengths, exhibiting excessive convexity or extreme concavity with reduced throat thickness.',
    visual_signs: [
      'Unequal fillet leg lengths (e.g. 10mm on horizontal leg, 4mm on vertical leg)',
      'Extreme ropey, bumpy bead with severe ripples and uneven widths',
      'Insufficient throat thickness (under-welded effective throat)'
    ],
    common_causes: [
      'Inconsistent travel speed and unstable manual electrode manipulation',
      'Incorrect electrode angle (held too steep or too low)',
      'Magnetic arc blow deflecting the electric arc to one side'
    ],
    risk_factors: ['Insufficient effective throat thickness reduces joint design shear capacity'],
    severity_levels: [
      { level: 'LOW', criteria: 'Minor bead waviness with effective throat thickness still verified adequate.' },
      { level: 'MEDIUM', criteria: 'Asymmetrical leg length resulting in undersized throat along portion of joint.' },
      { level: 'HIGH', criteria: 'Widespread profile irregularity with sharp valleys and undersized throat on primary joint.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Verify effective throat thickness using fillet weld gauge',
      'If throat is undersized: grind off high spots and deposit uniform wash pass to achieve required size',
      'Blend grind sharp ripples smooth'
    ],
    prevention: [
      'Employ qualified welders certified to IS 7307 / AWS D1.1',
      'Maintain steady electrode angle (45° into corner, 10°-15° drag angle)'
    ],
    when_to_stop_work: 'Stop work if welder fails visual profile tests consistently; arrange welder re-training.',
    when_engineer_required: 'Only required if throat thickness deficiency cannot be built up by re-welding.',
    confidence_notes: 'Measured with standard 2-piece fillet weld gauge (measures leg length and throat).',
    standards_references: ['AWS D1.1 Figure 5.4 (Acceptable and Unacceptable Weld Profiles)', 'IS 800:2007']
  },

  // 28. ARC STRIKE
  {
    id: 'weld-arc-strike',
    name: 'Arc Strike (Stray Arc Flash Blemish)',
    aliases: ['Arc Strike', 'Stray Arc', 'आर्क स्ट्राइक', 'Arc Mark', 'Accidental Flash Mark'],
    category: 'welding',
    material_types: ['Structural Steel', 'High Strength Steel', 'Plate Girders', 'Pressure Vessels'],
    description: 'A localized blemish, pit, or crater on the base metal surface outside the intended weld zone, caused by accidental contact of the live welding electrode or ground clamp.',
    visual_signs: [
      'Small, circular burnt craters or molten metal spatter dot outside the weld seam',
      'Localized copper-colored or heat-tinted halo on bare steel',
      'Microscopic crater with tiny radiating cracks visible under 10x glass'
    ],
    common_causes: [
      'Welder striking the electrode on base plate like a matchstick instead of inside the weld joint',
      'Loose or poorly clamped welding return lead (ground clamp) arcing on steel'
    ],
    risk_factors: ['Creates hard, brittle martensite spot (up to 600 HV) prone to fatigue cracking under cyclic load'],
    severity_levels: [
      { level: 'LOW', criteria: 'Superficial arc strike in static, low-stress mild steel secondary member.' },
      { level: 'HIGH', criteria: 'Arc strike in high-stress tension flange, seismic frame, or cyclically loaded girder.' }
    ],
    inspection_methods: ['VT', 'MT', 'PT'],
    possible_repairs: [
      'Completely grind out the arc strike crater down to sound metal (smooth dish-out with 1:10 taper)',
      'Perform MT or PT on ground area to verify complete removal of heat-affected micro-cracks',
      'Verify that remaining thickness is within mill tolerance; if not, build up with approved weld procedure'
    ],
    prevention: [
      'Never strike arc outside the joint groove; use run-on/run-off tabs for starting arc',
      'Secure ground clamps firmly with screw-type clamps directly to workpiece'
    ],
    when_to_stop_work: 'Stop work if arc strikes are found on fracture-critical tension flanges of bridges or crane girders.',
    when_engineer_required: 'Mandatory on fracture-critical structural members per AWS D1.1 Clause 5.29.',
    confidence_notes: 'Looks harmless to laymen, but metallurgically it is a high-risk fatigue crack initiation site.',
    standards_references: ['AWS D1.1 Clause 5.29 (Arc Strikes)', 'AISC 360', 'IS 800:2007']
  },

  // 29. BURN-THROUGH
  {
    id: 'weld-burn-through',
    name: 'Burn-Through (Blow Hole)',
    aliases: ['Burn-Through', 'Blow Hole', 'बर्न थ्रू', 'Melt-Through Hole', 'Hole in Weld Root'],
    category: 'welding',
    material_types: ['Sheet Metal', 'Thin Tubes', 'Root Passes in Pipe Butt Welds'],
    description: 'A hole blown completely through the root pass of a weld or through thin sheet metal caused by localized excessive heat input, allowing the molten puddle to drop through.',
    visual_signs: [
      'Open hole or gaping crater through the center of the weld root',
      'Large stalactite-like nodules of excess metal protruding from backside',
      'Irregular edges surrounding through-penetration cavity'
    ],
    common_causes: [
      'Welding current excessively high for material thickness',
      'Travel speed too slow; excessive dwell time in one spot',
      'Root face too thin or excessive root gap during joint fit-up'
    ],
    risk_factors: ['Destroys pressure containment, allows rainwater ingress, severe structural weak point'],
    severity_levels: [
      { level: 'MEDIUM', criteria: 'Isolated burn-through in thin non-structural sheet metal or ductwork.' },
      { level: 'HIGH', criteria: 'Burn-through in structural pipe joint, fluid piping, or pressure vessel root.' }
    ],
    inspection_methods: ['VT', 'RT'],
    possible_repairs: [
      'Grind around the hole to feather edges; fit a copper or ceramic backing bar behind hole',
      'Reduce welding current; bridge hole with small overlapping stringer beads',
      'In thin sheet metal: replace section or weld backing doubler'
    ],
    prevention: [
      'Calibrate welding current; use pulse welding (GMAW-P) on thin sheet metal',
      'Ensure tight, uniform root fit-up without wide gaps'
    ],
    when_to_stop_work: 'Stop welding immediately upon burn-through; continuing burns larger hole.',
    when_engineer_required: 'Required if burn-through occurs on certified pipe butt joints or pressure vessels.',
    confidence_notes: 'Easily visible; indicates gross mismatch between heat input and steel thickness.',
    standards_references: ['AWS D1.1 Clause 6', 'ASME Section IX', 'API 1104']
  },

  // 30. SPATTER
  {
    id: 'weld-spatter',
    name: 'Weld Spatter (Fused Metal Droplets)',
    aliases: ['Spatter', 'Weld Spatter', 'वेल्ड स्पैटर', 'Metal Beads', 'Slag BBs'],
    category: 'welding',
    material_types: ['Welded Steel', 'Fabricated Components', 'Sheet Metal Assemblies'],
    description: 'Metal particles expelled from the electric arc or molten puddle during welding that fuse lightly or tightly to the adjacent parent steel surface.',
    visual_signs: [
      'Small rounded metal beads or BBs scattered across steel surface adjacent to weld',
      'Rough texture clinging to paint or galvanizing surface',
      'Spatter lodged in bolt threads or sliding contact surfaces'
    ],
    common_causes: [
      'Arc length too long, causing arc instability and droplet dispersion',
      'GMAW/MIG welding using pure CO2 shielding gas without pulse',
      'Excessive welding current or incorrect polarity (e.g. AC instead of DC+)'
    ],
    risk_factors: ['Ruins architectural appearance; prevents uniform paint adhesion and causes premature paint chipping'],
    severity_levels: [
      { level: 'LOW', criteria: 'Scattered spatter on unpainted non-architectural industrial framing.' },
      { level: 'MEDIUM', criteria: 'Heavy spatter on surfaces to be galvanized, powder coated, or machined.' },
      { level: 'HIGH', criteria: 'Spatter on structural bolt faying surfaces (friction grip connection) preventing tight joint bearing.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Remove spatter using wide chisel, needle scaler, or light disc grinding',
      'Apply anti-spatter paste before welding on critical areas to allow easy wipe-off',
      'Clean bolt threads with wire brush tap if spatter entered hole'
    ],
    prevention: [
      'Spray water-soluble anti-spatter chemical on adjacent plates before welding',
      'Switch shielding gas from pure CO2 to Argon/CO2 mix (82/18) for smooth spray transfer'
    ],
    when_to_stop_work: 'No stop work, but spatter MUST be completely cleaned off before galvanizing or blast painting.',
    when_engineer_required: 'Not required unless spatter contaminated slip-critical friction bolt surfaces.',
    confidence_notes: 'Primarily a workmanship and coating adhesion issue.',
    standards_references: ['AWS D1.1 Clause 5.26', 'ISO 8501-3 (Preparation Grades of Welds)']
  },

  // 31. COATING FAILURE
  {
    id: 'coating-failure-general',
    name: 'Protective Coating Failure (Chalking, Checking, Cracking)',
    aliases: ['Coating Failure', 'Paint Degradation', 'कोटिंग विफलता', 'Chalking', 'Paint Breakdown'],
    category: 'surface',
    material_types: ['Coated Structural Steel', 'Painted Sheet Metal', 'Architectural Panels'],
    description: 'Degradation and breakdown of the protective paint/coating matrix caused by UV radiation, weathering, chemical attack, or internal film stress, leaving the underlying steel vulnerable to corrosion.',
    visual_signs: [
      'Chalking: Powdery white residue on surface when rubbed with finger',
      'Alligatoring / Checking: Micro-crack network resembling alligator skin across paint',
      'Loss of gloss, severe color fading, and flaking flakes'
    ],
    common_causes: [
      'Using aromatic epoxy primer as exposed topcoat (epoxies chalk rapidly under solar UV radiation)',
      'Applying topcoat exceeding maximum recoat time window of primer without sanding',
      'Coating thickness exceeding maximum allowable dry film thickness (DFT)'
    ],
    risk_factors: ['Exterior exposure with high solar UV index', 'Aggressive industrial acid fumes'],
    severity_levels: [
      { level: 'LOW', criteria: 'Surface chalking without breach of barrier primer.' },
      { level: 'MEDIUM', criteria: 'Micro-checking and cracking through intermediate coat with early rust spotting.' },
      { level: 'HIGH', criteria: 'Complete coating matrix failure with widespread rust breakthrough.' }
    ],
    inspection_methods: ['VT', 'PT'],
    possible_repairs: [
      'Pressure wash with clean fresh water to remove chalk residue',
      'Lightly abrade sound coating to create mechanical anchor tooth',
      'Apply aliphatic polyurethane (PU) or polysiloxane UV-resistant topcoat (50-75 µm DFT)'
    ],
    prevention: [
      'Specify complete 3-coat system per ISO 12944 (Zinc-rich primer + Epoxy MIO intermediate + Aliphatic Polyurethane finish)'
    ],
    when_to_stop_work: 'Stop painting if relative humidity > 85% or steel temperature is within 3°C of dew point.',
    when_engineer_required: 'Required if coating breakdown has permitted structural section loss.',
    confidence_notes: 'Identify whether failure is in the topcoat only or down to the primer/substrate.',
    standards_references: ['ISO 12944 (Paints and Varnishes - Corrosion Protection)', 'SSPC-PA 2']
  },

  // 32. PEELING PAINT
  {
    id: 'coating-peeling',
    name: 'Peeling Paint / Loss of Adhesion',
    aliases: ['Peeling Paint', 'Paint Flaking', 'पेंट का उखड़ना', 'Adhesion Failure', 'Paint Delamination'],
    category: 'surface',
    material_types: ['Painted Structural Steel', 'Painted GI Sheet', 'Architectural Fabrications'],
    description: 'Loss of interfacial adhesion between the paint film and the metal substrate, or between successive paint layers, causing large sheets or flakes of paint to detach cleanly.',
    visual_signs: [
      'Large curling flakes of dry paint falling away from bare metal',
      'Completely bare, smooth shiny metal visible underneath peeled paint',
      'Cross-cut adhesion test (ASTM D3359) fails with 0B or 1B rating'
    ],
    common_causes: [
      'Painting directly over mill scale, oil, grease, or chemical residues without abrasive blasting',
      'Applying paint directly onto galvanized steel without etch primer or vinyl butyral wash',
      'Painting on damp steel or condensation during early morning shifts'
    ],
    risk_factors: ['Painting galvanized iron (GI) with ordinary enamel (saponification reaction)'],
    severity_levels: [
      { level: 'LOW', criteria: 'Localized paint chipping (<0.1 m²) due to mechanical impact.' },
      { level: 'MEDIUM', criteria: 'Widespread peeling over >10% of component area.' },
      { level: 'HIGH', criteria: 'Total adhesion failure across structural framing exposing steel to rapid corrosion.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Scrape all unbonded coating back to sound tightly adhering edges',
      'Abrasive blast to Sa 2.5 (50 µm profile) or power-tool clean to St 3',
      'For galvanized steel: sweep blast or apply two-pack epoxy zinc-phosphate adhesion primer'
    ],
    prevention: [
      'Perform solvent cleaning (SSPC-SP 1) to remove oil, followed by blast cleaning to Sa 2.5',
      'Test surface profile with replica tape (Press-O-Film) to ensure 50-75 µm anchor profile'
    ],
    when_to_stop_work: 'Stop painting immediately; unbonded paint CANNOT be fixed by simply painting over it.',
    when_engineer_required: 'Coating inspector (NACE/SSPC Level 2) review required for large-scale re-coating specification.',
    confidence_notes: 'Never paint over peeling paint; all loose material must be removed to bare metal.',
    standards_references: ['ASTM D3359 (Measuring Adhesion by Tape Test)', 'ISO 8501-1', 'SSPC-SP 10']
  },

  // 33. DELAMINATION
  {
    id: 'coating-delamination',
    name: 'Coating Delamination / Intercoat Separation',
    aliases: ['Delamination', 'Intercoat Delamination', 'परत अलग होना', 'Layer Separation'],
    category: 'surface',
    material_types: ['Multi-coat Paint Systems', 'Composite Cladding Panels (ACP)', 'Laminated Sheets'],
    description: 'Separation between successive coats of a multi-layer paint system (e.g. topcoat peeling off intermediate coat), or separation of face skins from the core in architectural composite panels.',
    visual_signs: [
      'Topcoat lifting off intermediate coat in thin sheets, leaving intermediate color intact',
      'Blistering between paint layers without bare steel being exposed',
      'Buckled face skin on aluminum composite panels (ACP)'
    ],
    common_causes: [
      'Exceeding maximum recoat window of intermediate epoxy coat (surface cures too hard and slick)',
      'Contamination (dust, condensation, oil mist) settling between coats',
      'Solvent entrapment from applying second coat before first coat flash-off'
    ],
    risk_factors: ['Dusty construction sites where days elapse between primer and topcoat'],
    severity_levels: [
      { level: 'LOW', criteria: 'Small isolated intercoat separation.' },
      { level: 'MEDIUM', criteria: 'Extensive topcoat detachment requiring full scuff sanding and recoat.' },
      { level: 'HIGH', criteria: 'Delamination of architectural facade composite cladding (falling hazard).' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Remove all delaminated topcoat with high-pressure water washing or scraping',
      'Abrade remaining intermediate coat with 80-grit sandpaper to create mechanical key',
      'Wipe down with solvent and re-apply fresh topcoat within specified recoat window'
    ],
    prevention: [
      'Strictly observe manufacturer Technical Data Sheet (TDS) regarding minimum and maximum overcoating times'
    ],
    when_to_stop_work: 'Stop topcoating until surface is properly abraded and cleaned.',
    when_engineer_required: 'Required if exterior cladding panels are delaminating (wind safety hazard).',
    confidence_notes: 'Check whether failure is at the steel substrate or between paint layers.',
    standards_references: ['ISO 4624 (Pull-Off Test for Adhesion)', 'ASTM D4541']
  },

  // 34. GALVANIZING DAMAGE
  {
    id: 'galvanizing-damage',
    name: 'Galvanizing Damage / White Rust & Bare Spots',
    aliases: ['Galvanizing Damage', 'White Rust', 'गैल्वनाइजिंग डैमेज', 'सफेद जंग', 'Zinc Coating Loss', 'Wet Storage Stain'],
    category: 'corrosion',
    material_types: ['Hot-Dip Galvanized Steel (HDG)', 'GI Sheets', 'Galvanized Purlins & Bolts'],
    description: 'Deterioration of the protective zinc layer, manifesting as white voluminous zinc hydroxycarbonate (wet storage stain / white rust) or bare steel exposure caused by welding, cutting, or mechanical gouging.',
    visual_signs: [
      'Thick white, chalky deposit on galvanized sheet bundles (white rust)',
      'Black burnt bare zones adjacent to site weld seams',
      'Brown rust bleeding through damaged zinc coating'
    ],
    common_causes: [
      'Tightly nested sheets or structural sections stored wet without airflow (prevents zinc patina formation)',
      'Site flame-cutting or welding burning off the zinc layer (burns at ~900°C)',
      'Rough handling chipping thick, brittle galvanized alloy layers'
    ],
    risk_factors: ['Sheets bundled outdoors during rainy season', 'Unprotected weld splices on galvanized framing'],
    severity_levels: [
      { level: 'LOW', criteria: 'Light white chalky powder; zinc layer beneath still intact (scour off with nylon brush).' },
      { level: 'MEDIUM', criteria: 'Heavy white rust with initial black spotting, indicating consumption of zinc layer.' },
      { level: 'HIGH', criteria: 'Bare unprotected steel exposed by site welding, burning, or deep gouges.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'For light white rust: clean with nylon bristle brush and mild citric acid / fresh water wash',
      'For bare/welded spots: clean mechanically to St 3 / bright steel',
      'Apply zinc-rich paint containing at least 92% metallic zinc in dry film (cold galvanizing compound per ASTM A780) to minimum 100 µm thickness'
    ],
    prevention: [
      'Never store galvanized sheets tightly packed flat on ground; store inclined with wood spacers for drainage and air circulation',
      'Detail connections as bolted rather than field-welded to preserve galvanizing integrity'
    ],
    when_to_stop_work: 'Stop storage practices causing wet storage stain immediately.',
    when_engineer_required: 'Only if zinc degradation has allowed structural section loss of thin gauge members.',
    confidence_notes: 'White rust is zinc corrosion product, not steel rust; but if neglected, leads to rapid red rust.',
    standards_references: ['ASTM A780 (Standard Practice for Repair of Damaged HDG Surfaces)', 'IS 2629 / IS 4759', 'ISO 1461']
  },

  // 35. LOOSE BOLTS
  {
    id: 'bolts-loose',
    name: 'Loose Bolts / Loss of Pre-tension',
    aliases: ['Loose Bolts', 'ढीले बोल्ट', 'Un-torqued Fasteners', 'Missing Clamping Force'],
    category: 'connection',
    material_types: ['Structural Bolted Connections', 'HSFG Bolts (Grade 8.8 / 10.9)', 'Purlin Cleat Bolts'],
    description: 'Structural bolts lacking the specified clamping torque or initial tension, allowing joint slip, bearing pounding, bolt fatigue, and redistribution of unexpected bending moments into adjacent members.',
    visual_signs: [
      'Bolt washer can be rotated freely by hand or wiggled',
      'Visible gap between nut, washer, and connected steel ply',
      'Rust bleeding around bolt head indicating microscopic joint slippage during wind or vibration'
    ],
    common_causes: [
      'Incomplete tightening during erection (snug-tight left un-torqued)',
      'Dynamic cyclic vibrations from overhead cranes, machinery, or wind buffeting',
      'Oversized or slotted holes without hardened structural washers'
    ],
    risk_factors: ['High-Strength Friction Grip (HSFG) slip-critical connections', 'Crane runway girders and wind bracing'],
    severity_levels: [
      { level: 'MEDIUM', criteria: 'Single loose bolt in multi-bolt (8+) redundant gusset connection.' },
      { level: 'HIGH', criteria: 'Multiple loose bolts in moment frame beam-column connection.' },
      { level: 'CRITICAL', criteria: 'Loose bolts in major truss splice or crane girder support connection.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Use calibrated torque wrench or tension indicator feeler gauge to inspect 100% of bolts in connection',
      'For ordinary bolts (Grade 4.6): re-tighten snug-tight using spud wrench',
      'For HSFG bolts (Grade 8.8 / 10.9): discard previously over-yielded bolts; install fresh bolts, tighten snug-tight, then apply turn-of-nut method or calibrated torque per IS 4000'
    ],
    prevention: [
      'Use Direct Tension Indicators (DTI wash squirts) or twist-off tension control (TC) bolts',
      'Enforce mandatory torque audit per IS 4000 / AISC RCSC specification'
    ],
    when_to_stop_work: 'STOP WORK IMMEDIATELY if loose bolts allow joint opening or slipping under service load.',
    when_engineer_required: 'MANDATORY. Structural connection integrity audit required by site engineer.',
    confidence_notes: 'Visual rust powder ring around bolt head is a classic sign of cyclic slipping in loose connections.',
    standards_references: ['IS 4000:1992 (High Strength Bolts in Steel Structures - Code of Practice)', 'AISC RCSC Specification', 'IS 800:2007']
  },

  // 36. MISSING BOLTS
  {
    id: 'bolts-missing',
    name: 'Missing Bolts / Unfilled Bolt Holes',
    aliases: ['Missing Bolts', 'बोल्ट गायब होना', 'खाली छेद', 'Unbolted Connection Holes', 'Unfilled Holes'],
    category: 'connection',
    material_types: ['Structural Framing', 'Beam-Column Splices', 'Base Plates', 'Bracing Gussets'],
    description: 'Open, unfilled bolt holes in fabricated structural steel connections where design fasteners were omitted during site erection, severely reducing the shear, tension, and moment capacity of the joint.',
    visual_signs: [
      'Daylight through open circular holes in connection plates',
      'Empty holes in multi-bolt patterns (e.g. only 4 bolts installed in an 8-hole flange splice)',
      'Temporary drift pins or rebar pins left in lieu of high-strength bolts'
    ],
    common_causes: [
      'Erection crew neglecting to return and fill holes after initial framing fit-up',
      'Hole misalignment on site preventing bolt insertion, with workers simply skipping hole',
      'Shortage of specified bolt lengths on site'
    ],
    risk_factors: ['Remaining bolts carry proportional overload leading to progressive shear failure'],
    severity_levels: [
      { level: 'HIGH', criteria: 'One or more missing bolts in secondary framing connection.' },
      { level: 'CRITICAL', criteria: 'Missing bolts in primary beam-column moment connection, column splice, or base plate.' }
    ],
    inspection_methods: ['VT'],
    possible_repairs: [
      'Verify why hole was left empty (check for hole misalignment or burrs)',
      'If misaligned: ream hole carefully using rotary flute reamer (never torch-blow holes)',
      'Install specified grade, diameter, and length structural bolt with hardened washers; torque to design value per IS 4000'
    ],
    prevention: [
      'Implement strict connection sign-off tagging system before removing scaffolding or crane support',
      'Conduct 100% pre-pour / pre-closeout connection bolt audit'
    ],
    when_to_stop_work: 'STOP CRANE / ERECTION WORK above connection until all designated bolts are fully installed.',
    when_engineer_required: 'MANDATORY engineer sign-off to verify connection capacity and reaming approval.',
    confidence_notes: 'Obvious visual defect; every empty hole in structural steel connection is a severe non-conformance.',
    standards_references: ['IS 800:2007 Clause 10', 'AISC 360 Chapter J', 'OSHA 1926.756 (Structural Steel Erection)']
  },

  // 37. CONNECTION DEFORMATION
  {
    id: 'connection-deformation',
    name: 'Connection Deformation (Prying Action, Gusset Distortion, Bolt Yield)',
    aliases: ['Connection Deformation', 'Gusset Buckling', 'कनेक्शन विकृति', 'Prying Action', 'Joint Distortion'],
    category: 'connection',
    material_types: ['Gusset Plates', 'End Plate Connections', 'Base Plates', 'Angle Cleats'],
    description: 'Visible bending, curling, or plastic distortion of connection plates, end plates, base plates, or cleat angles, often accompanied by prying forces on bolts caused by extreme rotational moments or overload.',
    visual_signs: [
      'End plate bent outwards away from column flange like a flared lip',
      'Gusset plate buckled or rippled between diagonal brace and chord',
      'Base plate warped with anchors tilted or washers dished'
    ],
    common_causes: [
      'Severe overload (seismic event, excessive wind storm, unexpected crane impact)',
      'Undersized end plate thickness permitting excessive prying action forces on bolts',
      'Unbraced long gusset plate buckling under compressive bracing forces'
    ],
    risk_factors: ['Imminent brittle failure of tensile bolts due to amplified prying action forces'],
    severity_levels: [
      { level: 'HIGH', criteria: 'Visible curling (<3mm) in secondary connection plate.' },
      { level: 'CRITICAL', criteria: 'Severe plastic deformation of gusset or end plate in primary moment connection.' }
    ],
    inspection_methods: ['VT', 'MT', 'UT'],
    possible_repairs: [
      'IMMEDIATELY relieve connection load with temporary shoring and propping',
      'Replace distorted connection assembly; redesign with thicker plate, stiffener ribs, or additional bolt rows',
      '100% replace all bolts in connection (plastically deformed bolts have lost fatigue life)'
    ],
    prevention: [
      'Design end plates to eliminate prying action per AISC Design Guide 4 / 16 / IS 800:2007 Clause 10.4',
      'Provide stiffener web plates on long unbraced gusset plates'
    ],
    when_to_stop_work: 'CRITICAL DANGER: STOP ALL WORK IMMEDIATELY, CLEAR AREA BENEATH, AND INSTALL EMERGENCY SHORING.',
    when_engineer_required: 'MANDATORY IMMEDIATE Structural Engineer investigation and redesign.',
    confidence_notes: 'Connection deformation indicates the structure has entered plastic deformation range near failure.',
    standards_references: ['AISC Design Guide 4 (Extended End-Plate Moment Connections)', 'IS 800:2007 Clause 10.4 & 10.5']
  }
];

export const PRACTICAL_AI_DIALOGUE_EXAMPLES = [
  {
    userPrompt: 'My MS beam has rust.',
    scenario: 'Beam Rust Inquiry',
    aiResponsePattern: {
      observation: 'Visible reddish-brown oxidation layer on the mild steel (MS) beam surface.',
      material: 'Mild Steel / Carbon Steel (typically IS 2062 Grade E250 structural section).',
      possibleProblem: 'Atmospheric surface corrosion. Surface rust and structural section loss are very different conditions: surface rust is an early oxide layer, while section loss indicates actual metal thickness depletion that weakens load capacity.',
      severity: 'LOW to MEDIUM (pending thickness measurement).',
      possibleCauses: 'Prolonged exposure to moisture/humidity, absence or degradation of protective zinc primer/paint, or water leaks from overhead floor/roofing.',
      recommendedInspection: '1. Scrape with a wire brush to check if clean sound steel emerges immediately beneath.\n2. Perform Ultrasonic Thickness (UT) gauging or caliper measurement to verify remaining flange and web thickness against nominal drawings.\n3. Check bottom flange and bearing seat for water ponding.',
      possibleCorrectiveAction: 'If section loss is under 5%: Wire-brush / grit blast to Sa 2.5 profile, apply zinc phosphate or red oxide primer (min 50-75 µm), followed by two coats of epoxy/polyurethane finish. If section loss exceeds 15%, structural sister plating is required.',
      prevention: 'Maintain dry environmental conditions; ensure roof/pipe leaks are resolved; maintain coating schedule per ISO 12944.',
      professionalReview: 'If heavy stratified flakes peel off or caliper shows >10% thickness loss, a licensed structural engineer must verify member capacity.',
      safetyNote: 'Preliminary visual assessment only. Never assume a rusted beam is structurally sound or unsafe without physical remaining thickness measurements.'
    }
  },
  {
    userPrompt: 'There is a crack near my weld.',
    scenario: 'Crack Near Weld (HAZ Crack)',
    aiResponsePattern: {
      observation: 'Visible linear fracture/discontinuity adjacent to the weld bead in the Heat Affected Zone (HAZ) or weld toe.',
      material: 'Welded Structural Steel / Mild Steel assembly.',
      possibleProblem: 'Weld Toe Crack / HAZ Cold Crack (Hydrogen-induced delayed cracking or fatigue fissure).',
      severity: 'HIGH to CRITICAL.',
      possibleCauses: 'Excessive joint restraint, rapid cooling rate inducing brittle martensitic phase, moisture in electrodes releasing diffusible hydrogen, or cyclic stress concentration at the weld toe.',
      recommendedInspection: '1. Do NOT paint over or merely reweld on top of the crack.\n2. Request closer macro photograph if needed.\n3. Conduct Magnetic Particle Testing (MT) or Liquid Penetrant Testing (PT) to determine the exact crack tip locations and subsurface depth.\n4. Ultrasonic Testing (UT) to check depth through joint.',
      possibleCorrectiveAction: 'Drill crack-stop holes at each verified extremity. Excavate the entire crack and surrounding HAZ by grinding or carbon arc gouging down to sound metal. Re-weld using qualified preheated WPS and low-hydrogen electrodes (E7018-H4R).',
      prevention: 'Use baked low-hydrogen consumables; apply preheat according to IS 9595 / AWS D1.1 Table 3.3; avoid rapid cooling.',
      professionalReview: 'Mandatory on-site inspection by a Certified Welding Inspector (AWS CWI / CSWIP) or Structural Engineer. Never permit DIY repair of structural weld cracks.',
      safetyNote: 'Preliminary visual assessment. If this member is part of a primary structural frame or crane girder, immediately cease crane/loading operations.'
    }
  },
  {
    userPrompt: 'Sheet is bent after welding.',
    scenario: 'Sheet Metal Welding Distortion',
    aiResponsePattern: {
      observation: 'Angular distortion, bowing, or warping across the sheet metal panel after welding operations.',
      material: 'Mild Steel (CR / HR) or Stainless Steel light-gauge sheet metal.',
      possibleProblem: 'Welding thermal distortion / transverse and longitudinal shrinkage warpage.',
      severity: 'LOW to MEDIUM (Aesthetic / Fit-up issue).',
      possibleCauses: 'Non-uniform thermal expansion and contraction during weld cooling. Excessive weld heat input, oversized fillet bead, or lack of mechanical fixturing and heat-sinking.',
      recommendedInspection: 'Check with a straight edge to quantify total out-of-flatness (waviness depth in mm). Verify whether adjacent spot welds or seams suffered tearing.',
      possibleCorrectiveAction: 'For light sheet metal, mechanical press straightening or localized line-heating technique under controlled conditions. Never apply uncontrolled high heat to load-bearing structural members without engineer approval.',
      prevention: 'Use copper backing chill bars; clamp sheets securely in jigs; use intermittent or back-step welding; reduce wire diameter and heat input (e.g. pulse MIG / TIG).',
      professionalReview: 'Required only if sheet forms a shear diaphragm or pressure boundary.',
      safetyNote: 'Do not use sledgehammers on cold welded joints as this can initiate brittle micro-cracking.'
    }
  },
  {
    userPrompt: 'MS sheet has small holes.',
    scenario: 'Holes in Sheet Metal',
    aiResponsePattern: {
      observation: 'Visible small circular or irregular perforations through the mild steel sheet wall.',
      material: 'Mild Steel / Hot Rolled / Cold Rolled Sheet.',
      possibleProblem: 'Multiple possibilities: 1) Severe localized corrosion perforation (rust breakthrough), 2) Welding burn-through from excessive heat input, 3) Intentional or misdrilled fabrication holes, or 4) Mechanical puncture/damage.',
      severity: 'MEDIUM to HIGH depending on function (weather barrier, tank, structural web).',
      possibleCauses: 'Exact identification requires high-resolution image and functional context. Jagged rust-rimmed edges indicate corrosion perforation; rounded edges with melted nodules indicate burn-through; smooth cylindrical bore indicates mechanical drilling.',
      recommendedInspection: 'Visual examination of the hole perimeter under 5x magnification. Ultrasonic or micrometer thickness measurement of adjacent metal to check for widespread thinning.',
      possibleCorrectiveAction: 'If localized: weld backing patch or install mechanical doubler plate with sealant. If caused by generalized corrosion thinning, replace sheet section.',
      prevention: 'Provide adequate drainage to prevent standing water; apply anti-corrosive primer and topcoats.',
      professionalReview: 'Required if the sheet is part of a pressurized container, silo, or shear web.',
      safetyNote: 'Preliminary visual assessment. Never ignore unexpected perforations in fluid-retaining or weather-proofing assemblies.'
    }
  }
];
