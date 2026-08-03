import { 
  ConstructionGuideItem, 
  ConstructionPlotPlan, 
  RegionalRate 
} from '../types/construction';

export const initialRegionalRates: RegionalRate[] = [
  {
    id: 'rate-kolkata',
    regionName: 'Kolkata',
    currencySymbol: '₹',
    baseConstructionCostPerSqFtINR: 1850,
    materials: {
      cementBagINR: 375,
      steelKgINR: 64,
      sandCuFtINR: 52,
      aggregateCuFtINR: 58,
      brickPieceINR: 11,
      aacBlockPieceINR: 65,
      tileSqFtINR: 65,
      paintLiterINR: 280,
      wireCoilINR: 1650,
      pipeFtINR: 48
    },
    laborRatePerSqFtINR: 320
  },
  {
    id: 'rate-mumbai',
    regionName: 'Mumbai',
    currencySymbol: '₹',
    baseConstructionCostPerSqFtINR: 2450,
    materials: {
      cementBagINR: 410,
      steelKgINR: 68,
      sandCuFtINR: 75,
      aggregateCuFtINR: 70,
      brickPieceINR: 14,
      aacBlockPieceINR: 72,
      tileSqFtINR: 85,
      paintLiterINR: 320,
      wireCoilINR: 1800,
      pipeFtINR: 55
    },
    laborRatePerSqFtINR: 450
  },
  {
    id: 'rate-delhi',
    regionName: 'Delhi NCR',
    currencySymbol: '₹',
    baseConstructionCostPerSqFtINR: 2150,
    materials: {
      cementBagINR: 390,
      steelKgINR: 66,
      sandCuFtINR: 62,
      aggregateCuFtINR: 64,
      brickPieceINR: 12,
      aacBlockPieceINR: 68,
      tileSqFtINR: 75,
      paintLiterINR: 300,
      wireCoilINR: 1720,
      pipeFtINR: 50
    },
    laborRatePerSqFtINR: 380
  },
  {
    id: 'rate-bangalore',
    regionName: 'Bangalore',
    currencySymbol: '₹',
    baseConstructionCostPerSqFtINR: 2050,
    materials: {
      cementBagINR: 385,
      steelKgINR: 65,
      sandCuFtINR: 58,
      aggregateCuFtINR: 60,
      brickPieceINR: 12.5,
      aacBlockPieceINR: 66,
      tileSqFtINR: 70,
      paintLiterINR: 290,
      wireCoilINR: 1680,
      pipeFtINR: 49
    },
    laborRatePerSqFtINR: 360
  }
];

export const initialConstructionGuides: ConstructionGuideItem[] = [
  {
    id: 'guide-foundation',
    slug: 'foundation-guide',
    title: 'Foundation Engineering & Ground Substructure',
    category: 'structural',
    summary: 'The critical structural load-transfer system transmitting all dead, live, seismic, and wind loads safely into soil strata.',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Foundations anchor the building to the earth, preventing uneven differential settlement, soil shear failure, water uplift, and lateral sliding during earthquakes.',
    whyRecommended: 'For a standard 20ft × 20ft Ground Floor or G+1 structure on alluvial soil (such as Kolkata clay-silt), an Isolated Trapezoidal Footing with a Plinth Beam tie ring is recommended because it balances bearing capacity with economic RCC consumption.',
    advantages: [
      'Prevents structural cracking caused by uneven ground settlement',
      'Distributes high point loads from columns across wide soil surface areas',
      'Protects reinforcement steel from ground moisture & soil sulfate corrosion',
      'Provides seismic shock attenuation and earth vibration resistance'
    ],
    disadvantages: [
      'Requires heavy excavation & soil testing beforehand',
      'High initial cement, rebar, and waterproofing material expense',
      'Vulnerable to water logging if anti-termite treatment or tanking is neglected'
    ],
    lifeExpectancy: '80 - 100+ Years',
    maintenance: 'Minimal post-curing. Requires anti-termite chemical barrier around footing perimeter every 10 years and inspection of plinth protection drains.',
    costSavingTips: [
      'Perform a SBC (Safe Bearing Capacity) soil test first to avoid costly over-designing.',
      'Use Fly Ash blended PCC (1:4:8) bed to reduce cement cost by 15%.',
      'Ensure proper compaction using mechanical rammer to eliminate void honeycombs.'
    ],
    premiumOption: {
      name: 'Raft Foundation with Damp-Proof Membrane Tanking',
      costRange: '₹350 - ₹500 / sq.ft',
      advantages: 'Monolithic continuous concrete mat providing total settlement protection, ideal for low bearing capacity waterlogged soils.'
    },
    budgetOption: {
      name: 'Isolated Stepped Footing with Plinth Tie Beam',
      costRange: '₹180 - ₹240 / sq.ft',
      advantages: 'Saves 25% concrete volume compared to Raft while fully satisfying load parameters for up to G+2 residential units.'
    },
    keyTakeaways: [
      'Minimum depth for residential footing should be 4.5 ft to 5 ft below natural ground level.',
      'Clear cover for foundation rebar must be strictly 50mm to 75mm.'
    ]
  },
  {
    id: 'guide-roof',
    slug: 'roof-guide',
    title: 'Roof Slab Engineering & Curing Protocols',
    category: 'structural',
    summary: 'The top horizontal structural barrier shielding interiors from atmospheric heat, rainfall, UV radiation, and environmental weathering.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Provides weather protection, structural ceiling diaphragm stiffness, and upper living space insulation.',
    whyRecommended: 'A 5-inch (125mm) M20 grade RCC (Reinforced Cement Concrete) slab with two-way Fe500D steel mesh and crystalline waterproofing compound is recommended for optimum thermal mass and zero leakage.',
    advantages: [
      'Monolithic fireproof & cyclone-resistant structural ceiling',
      'Allows vertical expansion for future floors',
      'Excellent acoustic damping against heavy rain noise'
    ],
    disadvantages: [
      'Heavy dead load requiring robust columns and beams',
      'Prone to thermal expansion micro-cracks if curing is cut short',
      'Requires mandatory elastomeric elastile waterproofing topcoat'
    ],
    lifeExpectancy: '60 - 80 Years',
    maintenance: 'Re-apply elastomeric solar-reflective roof coat every 5-7 years. Clean rainwater downspout drains before every monsoon.',
    costSavingTips: [
      'Maintain continuous pond curing for 14 full days to reach 99% design strength.',
      'Incorporate 1:100 slope towards drainage spouts during initial concrete screed.'
    ],
    premiumOption: {
      name: 'Insulated Post-Tensioned Slab with APP Membrane & Brickbat Coba',
      costRange: '₹220 - ₹300 / sq.ft',
      advantages: 'Zero thermal bridging, superior crack resistance, and thermal insulation reducing indoor temperature by 4°C.'
    },
    budgetOption: {
      name: 'Standard 5-inch RCC Slab with Crystalline Waterproofing',
      costRange: '₹140 - ₹180 / sq.ft',
      advantages: 'Economical, time-tested standard for Indian residential homes.'
    }
  },
  {
    id: 'guide-brick',
    slug: 'brick-guide',
    title: 'Bricks & AAC Blocks Masonry Systems',
    category: 'structural',
    summary: 'The vertical envelope partition walls providing thermal mass, acoustic privacy, and weather enclosure.',
    coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Subdivides living spaces, supports plaster coatings, and acts as thermal/sound barrier.',
    whyRecommended: 'AAC (Autoclaved Aerated Concrete) Blocks for internal partitions and First-Class Red Fly Ash Bricks for exterior weather walls yield the optimal mix of structural stability, thermal insulation, and plaster bond strength.',
    advantages: [
      'AAC blocks are 3x lighter than clay bricks, reducing building structural dead load by up to 20%',
      'High thermal resistance (R-value) saving AC electricity costs',
      'Precision dimensions require 50% less plaster mortar thickness'
    ],
    disadvantages: [
      'AAC blocks require polymer thin-bed adhesive rather than traditional thick cement sand mortar',
      'Red bricks vary in compressive strength if unburnt or overburnt'
    ],
    lifeExpectancy: '100+ Years',
    maintenance: 'Keep outer plaster painted with acrylic exterior emulsion. Check expansion joints every 10 years.',
    costSavingTips: [
      'Use AAC blocks for upper floor interior walls to downsize column steel requirements.',
      'Soak clay bricks in water for 2 hours before laying to prevent moisture absorption from mortar.'
    ],
    premiumOption: {
      name: '6-inch AAC Blocks with Polymer Thin-Bed Adhesive & Mesh Reinforcement',
      costRange: '₹65 - ₹85 / sq.ft',
      advantages: 'Faster installation, minimal cracking, eco-friendly green material.'
    },
    budgetOption: {
      name: 'First-Class Machine Molded Red Clay Bricks (1:4 Mortar)',
      costRange: '₹50 - ₹65 / sq.ft',
      advantages: 'Widely available, high compressive strength (>10.5 N/mm²).'
    }
  },
  {
    id: 'guide-column',
    slug: 'column-guide',
    title: 'Column Reinforcement & Axial Compression Design',
    category: 'structural',
    summary: 'Vertical structural members transmitting floor and roof gravity loads down to the foundation footing.',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Transfers vertical weight and resists lateral shear forces caused by earthquakes and heavy wind loads.',
    whyRecommended: 'For a 20ft × 20ft single to double-story structure, 9" × 12" columns with 6 longitudinal 16mm Fe500D TMT rebar rods and 8mm stirrups at 150mm c/c spacing are recommended as per IS 456:2000.',
    advantages: [
      'Enables open-plan flexible floor layouts without thick load-bearing interior walls',
      'Provides seismic ductility and sway resistance',
      'Concentrates structural strength efficiently'
    ],
    disadvantages: [
      'Requires precise shuttering, concrete vibration, and strict rebar lap length checks',
      'Vulnerable to buckling if under-designed or off-center'
    ],
    lifeExpectancy: '80 - 100 Years',
    maintenance: 'Inspect cover concrete for spalling or rusting rebar. Ensure 40mm minimum clear cover during casting.',
    costSavingTips: [
      'Align columns on a grid to uniform beam spans and reduce steel wastage.',
      'Use M20 or M25 ready-mix concrete for flawless compaction.'
    ],
    premiumOption: {
      name: 'M25 High-Strength Concrete Columns with 20mm TMT Rebar & Spiral Ties',
      costRange: '₹450 - ₹600 / rft',
      advantages: 'Higher load capacity, smaller column footprint, superior earthquake resistance.'
    },
    budgetOption: {
      name: 'Standard M20 9"x12" Columns with 16mm Fe500D Steel',
      costRange: '₹320 - ₹400 / rft',
      advantages: 'Economical standard for residential structures.'
    }
  },
  {
    id: 'guide-beam',
    slug: 'beam-guide',
    title: 'Plinth & Roof Beam Structural Integration',
    category: 'structural',
    summary: 'Horizontal bending members designed to bridge spans, support wall loads, and bind vertical columns into a rigid structural frame.',
    coverImage: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Prevents floor slab sag, distributes wall weight evenly to columns, and locks the structure against differential earth settlement.',
    whyRecommended: '9" × 12" Plinth Beams at ground level and 9" × 12" Roof Beams with top & bottom TMT rebar provide structural rigidity.',
    advantages: [
      'Eliminates uneven wall cracks',
      'Binds the building frame into a cohesive 3D structural box',
      'Protects ground walls from capillary soil moisture rise'
    ],
    disadvantages: [
      'Consumes ceiling clearance height if beam depth is excessive',
      'Requires careful shuttering support underneath during curing'
    ],
    lifeExpectancy: '80 - 100 Years',
    maintenance: 'Ensure damp-proof course (DPC) on plinth beam top surface before wall masonry.',
    costSavingTips: [
      'Keep beam depths uniform across a floor level to reuse shuttering formwork.',
      'Place lap splices at beam center for bottom bars and at supports for top bars.'
    ],
    premiumOption: {
      name: 'Concealed Duct RCC Beams with High-Yield Fe550D Rebar',
      costRange: '₹380 - ₹480 / rft',
      advantages: 'Flat ceiling finish without visible downstand beams.'
    },
    budgetOption: {
      name: 'Standard Downstand 9"x12" Beams (M20 Grade)',
      costRange: '₹280 - ₹350 / rft',
      advantages: 'Highest structural efficiency per rupee spent.'
    }
  },
  {
    id: 'guide-slab',
    slug: 'slab-guide',
    title: 'Slab Casting, Steel Mesh & Deflection Control',
    category: 'structural',
    summary: 'Horizontal planar elements providing floor and ceiling surfaces for each story.',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Provides flat floor surfaces to carry live furniture and human load.',
    whyRecommended: 'Two-way slab with 8mm/10mm main bars at 150mm spacing for square/rectangular room spans under 15ft.',
    advantages: ['Smooth ceiling finish', 'Monolithic strength', 'Excellent sound deadening'],
    disadvantages: ['Heavy dead weight', 'Requires 21 days formwork prop retention'],
    lifeExpectancy: '75+ Years',
    maintenance: 'Keep dry, repair any surface tile grout gaps.',
    costSavingTips: ['Use plastic cover blocks (20mm) instead of broken brick pieces during steel binding.'],
    premiumOption: { name: 'Post-Tensioned Flat Slab', costRange: '₹240/sq.ft', advantages: 'Longer column-free spans' },
    budgetOption: { name: 'Two-way RCC Slab', costRange: '₹150/sq.ft', advantages: 'Simple to construct' }
  },
  {
    id: 'guide-electrical',
    slug: 'electrical-guide',
    title: 'Electrical Layout, Load Distribution & Wiring Safety',
    category: 'mep',
    summary: 'Concealed PVC conduit network, copper wiring, earthing, circuit breakers, and modular switch positions.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Powers lighting, HVAC, appliances, and digital devices safely without fire risks or electrocution hazards.',
    whyRecommended: 'Concealed FR-LSH (Flame Retardant Low Smoke Zero Halogen) 100% pure copper multi-strand wires inside heavy-duty FRLS PVC conduits embedded in brick chaser grooves.',
    advantages: [
      'Concealed wiring maintains clean interior aesthetic',
      'RCCB/ELCB protection prevents electrical shock',
      'Dual grounding pit safeguards expensive electronic appliances'
    ],
    disadvantages: [
      'Requires wall groove cutting (chasing) before plastering',
      'Rewiring is difficult if non-standard conduit bends are used'
    ],
    lifeExpectancy: '25 - 35 Years',
    maintenance: 'Test MCB and RCCB trip switches every 6 months. Inspect main Distribution Board for loose terminal connections annually.',
    costSavingTips: [
      'Separate high-power circuits (AC, Geyser, Kitchen Oven - 2.5/4 sq.mm) from light circuits (1.5 sq.mm).',
      'Group light switches on a single modular plate near room entrance.'
    ],
    premiumOption: {
      name: 'Smart Automation Concealed Wiring with FRLSH Copper & Touch Glass Switches',
      costRange: '₹120 - ₹180 / sq.ft',
      advantages: 'App control, surge protection, smart scene dimming, energy monitoring.'
    },
    budgetOption: {
      name: 'Standard Concealed PVC Conduit with ISI Copper Wires & Modular Switches',
      costRange: '₹65 - ₹90 / sq.ft',
      advantages: 'Reliable, safe, fully compliant with National Electrical Code.'
    }
  },
  {
    id: 'guide-plumbing',
    slug: 'plumbing-guide',
    title: 'Plumbing, Water Supply & Sanitary Piping Systems',
    category: 'mep',
    summary: 'Clean water supply distribution (CPVC/PEX) and waste/sewage drainage network (SWR PVC).',
    coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Delivers pressurized potable water to fixtures and hygienic removal of wastewater and sewage to septic/sewer lines.',
    whyRecommended: 'CPVC (Chlorinated PVC) pipes for hot/cold potable water supply and SWR (Soil, Waste, Rainwater) ring-fit PVC pipes for drainage, aligned in dedicated vertical plumbing shafts.',
    advantages: [
      'CPVC pipes are lead-free, non-corrosive, and withstand water temperature up to 93°C',
      'Rubber ring joint SWR pipes eliminate leakages and absorb building expansion',
      'Plumbing shafts allow easy maintenance without breaking bathroom tiles'
    ],
    disadvantages: [
      'Improper pipe slope causes clogging and foul odor backflow',
      'Low quality solvent cement leads to joint leaks inside walls'
    ],
    lifeExpectancy: '30 - 40 Years',
    maintenance: 'Install cleanout caps at drainage bends. Flush water heater tank annually to prevent mineral scale.',
    costSavingTips: [
      'Back-to-back bathroom layouts share vertical plumbing shafts, saving 30% pipe length.',
      'Perform 10 bar hydraulic pressure testing for 24 hours before closing wall grooves.'
    ],
    premiumOption: {
      name: 'PEX-a Flexible Pipe-in-Pipe System with Concealed Diverters & Silent SWR Drainage',
      costRange: '₹140 - ₹200 / sq.ft',
      advantages: 'Zero joints inside walls, acoustic noise reduction, 50-year warranty.'
    },
    budgetOption: {
      name: 'Standard CPVC Water Supply & Rubber Ring SWR PVC Drainage',
      costRange: '₹70 - ₹100 / sq.ft',
      advantages: 'Economical, leak-free, easy replacement parts.'
    }
  },
  {
    id: 'guide-waterproofing',
    slug: 'waterproofing-guide',
    title: 'Waterproofing Protocols for Roof, Bathrooms & Foundation',
    category: 'finishing',
    summary: 'Specialized chemical barrier applications preventing water penetration, efflorescence salting, and steel rebar rust.',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Moisture ingress causes concrete degradation, peeling interior paint, mold growth, and premature rebar rusting.',
    whyRecommended: '2-coat elastomeric polymer modified cementitious slurry for wet areas (bathroom floor & sunken slab) and Polyurethane (PU) hybrid liquid membrane for flat terrace roofs.',
    advantages: [
      'Extends building structural life by preventing rebar oxidation',
      'Eliminates damp wall patches, peeling paint, and indoor fungal spores',
      'Protects ground floor tiles from subterranean capillary water rise'
    ],
    disadvantages: [
      'Requires meticulous surface preparation (cleaning, dust removal, corner coving)',
      'Fails if applied on wet or uncured mortar surfaces'
    ],
    lifeExpectancy: '15 - 25 Years',
    maintenance: 'Avoid puncturing roof membrane during antenna or solar panel installations. Re-coat exposed roofs every 8 years.',
    costSavingTips: [
      'Incorporate 45-degree angle mortar coves (fillets) at wall-floor junctions before waterproofing.',
      'Conduct a 48-hour pond test with 100mm standing water before laying bathroom tiles.'
    ],
    premiumOption: {
      name: 'Polyurethane (PU) Liquid Membrane with Fiber Mesh Reinforcement & Brickbat Coba',
      costRange: '₹80 - ₹120 / sq.ft',
      advantages: 'Elongation capability >400%, bridge micro-cracks effortlessly, UV stable.'
    },
    budgetOption: {
      name: '2-Coat Polymer Modified Cementitious Slurry Coating',
      costRange: '₹35 - ₹55 / sq.ft',
      advantages: 'Cost-effective, excellent bonding with concrete.'
    }
  },
  {
    id: 'guide-paint',
    slug: 'paint-guide',
    title: 'Paint Systems, Surface Primer & Exterior Emulsion',
    category: 'finishing',
    summary: 'Protective and decorative surface coatings shields walls against moisture, algae, dirt, and UV yellowing.',
    coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Enhances interior light reflection, protects plaster from rain erosion, and establishes color aesthetics.',
    whyRecommended: 'Low-VOC Acrylic Royal Interior Emulsion with 2 coats of acrylic wall putty for smooth interiors; Anti-fungal Silicone-modified exterior emulsion for outer walls.',
    advantages: [
      'Washable interior finish allows easy stain removal',
      'Anti-microbial additive stops mold growth in humid climates',
      'UV-resistant pigments prevent outdoor wall color fading'
    ],
    disadvantages: ['Requires complete surface sanding and dry curing of underlying plaster beforehand'],
    lifeExpectancy: '7 - 10 Years',
    maintenance: 'Wipe interior walls with soft damp cloth. Pressure wash exterior walls every 3 years.',
    costSavingTips: [
      'Apply white alkali-resistant primer before putty to increase paint coverage yield by 20%.',
      'Use water-based low-VOC paints for healthiest indoor air quality.'
    ],
    premiumOption: { name: 'Silicone Ultra Anti-Dirt Exterior & Luxury Washable Interior Silk Paint', costRange: '₹45 - ₹65 / sq.ft', advantages: 'Self-cleaning rain effect, 10-year warranty' },
    budgetOption: { name: 'Standard Premium Acrylic Emulsion with Wall Putty', costRange: '₹22 - ₹35 / sq.ft', advantages: 'Smooth matt finish, budget friendly' }
  },
  {
    id: 'guide-tile',
    slug: 'tile-guide',
    title: 'Tiles & Natural Stone Flooring Engineering',
    category: 'finishing',
    summary: 'Durable, stain-resistant, easy-to-clean floor and wall surface covering materials.',
    coverImage: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Provides abrasion-resistant, waterproof, elegant floor and wall finishes.',
    whyRecommended: 'GVT (Glazed Vitrified Tiles) 800mm × 800mm with polymer tile adhesive for living rooms, and Anti-skid Matte Vitrified Tiles with epoxy grout for wet bathrooms.',
    advantages: [
      'High stain and scratch resistance (PEI Rating 4+)',
      'Water absorption rate under 0.05% prevents tile cracking or swelling',
      'Large formats create seamless open spatial feel'
    ],
    disadvantages: ['Hard underfoot, requires precise floor level screed'],
    lifeExpectancy: '30+ Years',
    maintenance: 'Clean grout lines with non-acidic cleaner. Re-grout every 10 years.',
    costSavingTips: [
      'Use tile spacers (2mm) with epoxy grout to absorb structural thermal expansion and prevent tile tenting.',
      'Opt for standard 800x800mm tile sizes over custom slab formats to cut labor laying cost by 40%.'
    ],
    premiumOption: { name: 'Italian Marble Slabs or 1200x2400mm GVT Slab Tiles with Epoxy Laying', costRange: '₹250 - ₹500 / sq.ft', advantages: 'Ultra-luxurious seamless veins' },
    budgetOption: { name: '800x800mm Double Charged Vitrified Tiles with Cement Adhesive', costRange: '₹60 - ₹95 / sq.ft', advantages: 'Extremely durable, value for money' }
  },
  {
    id: 'guide-doors-windows',
    slug: 'doors-windows-guide',
    title: 'Doors, Windows & Thermal Fenestration',
    category: 'finishing',
    summary: 'Building envelope openings providing security, natural light, ventilation, and thermal/acoustic insulation.',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    diagramImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    whyUsed: 'Controls entry/exit, airflow, noise reduction, and daylighting.',
    whyRecommended: 'Heavy-duty uPVC (Unplasticized Polyvinyl Chloride) sliding/casement windows with 6mm toughened glass and EPDM weather gaskets, paired with Flush Doors with Teak Wood Veneer for main entrances.',
    advantages: [
      'uPVC multi-chamber frames reduce outside traffic noise by up to 30-40 dB',
      'Zero warping, rusting, or termite damage compared to wood or mild steel',
      'Multi-point locking system enhances home security'
    ],
    disadvantages: ['Higher upfront cost than simple aluminum windows'],
    lifeExpectancy: '35 - 50 Years',
    maintenance: 'Lubricate window roller tracks and hinges with silicone spray annually.',
    costSavingTips: [
      'Standardize window frame sizes (e.g., 4ft × 4ft, 5ft × 4ft) across all bedrooms to order factory mass-produced uPVC profiles.',
      'Use double glazed (DGU) glass on south/west facing windows to block solar heat.'
    ],
    premiumOption: { name: 'Thermal-Break Powder Coated Aluminum Slimline Windows & Teak Wood Doors', costRange: '₹800 - ₹1400 / sq.ft', advantages: 'Ultra-slim sightlines, maximum daylight' },
    budgetOption: { name: 'System uPVC Windows with 5mm Clear Glass & Laminated Flush Doors', costRange: '₹350 - ₹550 / sq.ft', advantages: 'Low maintenance, excellent sealing' }
  }
];

export const initialConstructionPlotPlans: ConstructionPlotPlan[] = [
  {
    id: 'plan-20x20-kolkata',
    title: 'Compact Urban Villa Plan (20 ft × 20 ft)',
    plotWidthFt: 20,
    plotLengthFt: 20,
    totalAreaSqFt: 400,
    builtUpAreaSqFt: 360,
    location: 'Kolkata',
    floors: 'Ground Floor',
    budgetINR: 1000000,
    costPerSqFtINR: 1850,
    exterior3DImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    exterior3DAltViews: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      {
        room: 'Living & Dining Room',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        description: 'Open-concept compact living area with warm LED cove lighting and space-saving wall-mounted furniture.'
      },
      {
        room: 'Master Bedroom',
        imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
        description: 'Ergonomic bedroom layout with full-height wardrobe, 800x800mm vitrified tiles, and accent headboard.'
      },
      {
        room: 'Modular Kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        description: 'L-shaped compact kitchen with quartz counter, soft-close tandem drawers, and chimney exhaust.'
      },
      {
        room: 'Modern Bathroom',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        description: 'Anti-skid flooring bathroom with wall-hung WC, concealed diverter, and vertical exhaust fan.'
      }
    ],
    floorPlan2DData: {
      rooms: [
        { name: 'Living & Dining', x: 10, y: 10, w: 180, h: 140, color: '#1e293b', doors: ['Main Entry'], windows: ['W1 (North)'] },
        { name: 'Master Bedroom', x: 200, y: 10, w: 180, h: 180, color: '#0f172a', doors: ['D1'], windows: ['W2 (East)'] },
        { name: 'Modular Kitchen', x: 10, y: 160, w: 110, h: 110, color: '#1e1b4b', doors: ['Kitchen Arch'], windows: ['Exhaust W3'] },
        { name: 'Attached Bath', x: 130, y: 200, w: 60, h: 70, color: '#172554', doors: ['D2'], windows: ['V1'] }
      ],
      dimensions: [
        { x1: 0, y1: 0, x2: 400, y2: 0, label: '20 FT (WIDTH)' },
        { x1: 400, y1: 0, x2: 400, y2: 300, label: '20 FT (LENGTH)' }
      ]
    },
    materials: [
      {
        id: 'mat-1',
        name: 'Cement (PPC / OPC 43)',
        unit: 'Bags (50 kg)',
        quantity: 180,
        ratePerUnitINR: 375,
        totalCostINR: 67500,
        purpose: 'Provides structural binding strength for foundation PCC, RCC column/beam casting, brick masonry mortar, and plastering.',
        whyUsed: 'Cement undergoes a hydration chemical reaction with water to form a hard crystalline calcium-silicate matrix that locks sand and aggregate together.',
        advantages: ['High compressive strength', 'Water resistant when hydrated', 'Provides alkaline protective environment against steel rebar rust'],
        disadvantages: ['Low tensile strength requiring steel reinforcement', 'Prone to shrinkage cracks if not water-cured for 14 days'],
        lifeExpectancyYears: '80 - 100 Years',
        maintenanceNote: 'Keep stored dry in elevated moisture-proof bags prior to mixing.',
        costSavingTip: 'Use Fly Ash blended Portland Pozzolana Cement (PPC) for masonry and plastering to save 10% cost and reduce thermal micro-cracking.',
        premiumOption: 'OPC 53 Grade UltraTech / ACC Gold',
        budgetOption: 'PPC Grade Lafarge / Ambuja Cement',
        iconName: 'Package'
      },
      {
        id: 'mat-2',
        name: 'Steel Rebar (Fe500D TMT)',
        unit: 'Kg',
        quantity: 1450,
        ratePerUnitINR: 64,
        totalCostINR: 92800,
        purpose: 'Resists tensile and flexural bending stresses in RCC columns, footings, beams, and roof slab.',
        whyUsed: 'Concrete is strong in compression but weak in tension. Fe500D TMT steel bars provide ductility and flexural bending capacity to prevent catastrophic collapse.',
        advantages: ['Fe500D grade offers high elongation (>16%) for superior earthquake shock absorption', 'Ribbed surface provides mechanical bond with concrete'],
        disadvantages: ['Vulnerable to rust corrosion if concrete cover is under 25mm-40mm'],
        lifeExpectancyYears: '80+ Years',
        maintenanceNote: 'Store off ground on wooden sleepers covered with tarpaulin.',
        costSavingTip: 'Order exact cut-length steel bars directly from factory distributors to eliminate site scrap wastage.',
        premiumOption: 'Tata Tiscon Fe550D / JSW Neosteel',
        budgetOption: 'Primary Mill Fe500D (Jindal / SRMB)',
        iconName: 'Zap'
      },
      {
        id: 'mat-3',
        name: 'River Sand / Coarse M-Sand',
        unit: 'Cu. Ft',
        quantity: 620,
        ratePerUnitINR: 52,
        totalCostINR: 32240,
        purpose: 'Fine aggregate filler in concrete matrix and mortar bed for brickwork and wall plaster.',
        whyUsed: 'Fills voids between coarse aggregates and cement particles, creating a dense paste that reduces shrinkage cracking.',
        advantages: ['Washed M-Sand contains zero silt content (<3%)', 'Provides uniform grain size distribution for consistent strength'],
        disadvantages: ['Unwashed natural river sand contains organic clay impurities that degrade cement bond'],
        lifeExpectancyYears: '100 Years',
        maintenanceNote: 'Sieve through 4.75mm screen before plastering work.',
        costSavingTip: 'Use manufactured sand (M-Sand) instead of river sand to save up to 25% material cost while achieving higher mortar strength.',
        premiumOption: 'Washed Double-Screened M-Sand',
        budgetOption: 'Standard Local Sifted Sand',
        iconName: 'Layers'
      },
      {
        id: 'mat-4',
        name: 'Stone Chips / Aggregate (20mm & 10mm)',
        unit: 'Cu. Ft',
        quantity: 480,
        ratePerUnitINR: 58,
        totalCostINR: 27840,
        purpose: 'Coarse aggregate skeleton forming 60-70% of concrete volume in RCC footings, columns, beams, and roof.',
        whyUsed: 'Provides compressive mass, dimensional stability, and abrasion resistance to hard concrete.',
        advantages: ['Angular crushed granite/basalt provides interlocking matrix strength', 'Low water absorption (<0.5%)'],
        disadvantages: ['Flaky or elongated stones weaken concrete strength'],
        lifeExpectancyYears: '100 Years',
        maintenanceNote: 'Wash dust off aggregate piles before batching concrete.',
        costSavingTip: 'Mix 60% 20mm aggregate with 40% 10mm aggregate for optimum density and minimal void space.',
        premiumOption: 'Crushed Granite Angular Aggregate',
        budgetOption: 'Local Black Basalt Aggregate',
        iconName: 'Box'
      },
      {
        id: 'mat-5',
        name: 'First-Class Red Bricks / AAC Blocks',
        unit: 'Pieces',
        quantity: 4200,
        ratePerUnitINR: 11,
        totalCostINR: 46200,
        purpose: 'Masonry wall construction for exterior perimeter enclosure and interior room partitions.',
        whyUsed: 'Provides thermal insulation, sound attenuation, structural enclosure, and fire resistance.',
        advantages: ['High thermal mass retains indoor comfort', 'Excellent plaster adhesion'],
        disadvantages: ['Heavy dead load', 'Requires soaking in water before laying'],
        lifeExpectancyYears: '100+ Years',
        maintenanceNote: 'Keep exterior plaster sealed with acrylic paint.',
        costSavingTip: 'Use 4-inch AAC Blocks for interior non-load bearing partition walls to reduce total dead load and plaster mortar volume.',
        premiumOption: 'Autoclaved Aerated Concrete (AAC) Light Blocks',
        budgetOption: 'Kiln-burnt Red Clay Bricks',
        iconName: 'Building'
      },
      {
        id: 'mat-6',
        name: 'Vitrified Tiles (800x800mm)',
        unit: 'Sq. Ft',
        quantity: 360,
        ratePerUnitINR: 65,
        totalCostINR: 23400,
        purpose: 'Floor covering across Living Room, Master Bedroom, Kitchen, and Passageways.',
        whyUsed: 'Provides a non-porous, highly durable, stain-proof surface.',
        advantages: ['Scratch resistant', 'Water absorption <0.05%', 'Easy to clean'],
        disadvantages: ['Requires level floor screed and skilled laying'],
        lifeExpectancyYears: '30 Years',
        maintenanceNote: 'Clean with mild liquid detergent. Re-grout expansion joints if needed.',
        costSavingTip: 'Select standard 800x800mm tiles rather than 1200x1800mm slabs to cut material and laying costs by 35%.',
        premiumOption: 'GVT Double Charged Marble Effect Vitrified Tiles',
        budgetOption: 'Standard Ceramic Glazed Floor Tiles',
        iconName: 'Grid'
      },
      {
        id: 'mat-7',
        name: 'Paint & Surface Putty',
        unit: 'Liters',
        quantity: 42,
        ratePerUnitINR: 280,
        totalCostINR: 11760,
        purpose: 'Interior royal emulsion and exterior weather-shield silicone paint coats over putty.',
        whyUsed: 'Shields plaster against water erosion, prevents algae growth, and delivers smooth washable interior aesthetics.',
        advantages: ['Washable interior finish', 'Anti-fungal additives', 'UV fade resistance'],
        disadvantages: ['Requires dry cured plaster base'],
        lifeExpectancyYears: '8 Years',
        maintenanceNote: 'Wipe interior walls with soft damp cloth.',
        costSavingTip: 'Apply 2 coats of acrylic wall putty and 1 coat primer before paint to double paint coverage yield.',
        premiumOption: 'Asian Paints Royal Luxury Emulsion & Apex Ultima Exterior',
        budgetOption: 'Tractor Emulsion & Acrylic Primer',
        iconName: 'Palette'
      },
      {
        id: 'mat-8',
        name: 'Electrical Conduit Wire & Switches',
        unit: 'Coils / Units',
        quantity: 12,
        ratePerUnitINR: 1650,
        totalCostINR: 19800,
        purpose: 'Concealed FRLS copper electrical distribution, lighting points, power sockets, and distribution board.',
        whyUsed: 'Provides safe, fire-retardant power delivery to lighting, HVAC, and household appliances.',
        advantages: ['FR-LSH insulation stops toxic smoke during electrical short circuit', 'Concealed PVC conduit prevents wire degradation'],
        disadvantages: ['Requires proper circuit sizing to prevent tripping'],
        lifeExpectancyYears: '30 Years',
        maintenanceNote: 'Test MCB / ELCB breakers every 6 months.',
        costSavingTip: 'Separate 16A heavy power circuits (AC, Geyser) from 6A lighting circuits to optimize copper wire gauge costs.',
        premiumOption: 'Havells / Finolex FRLSH Copper Wire & Anchor Roma Switches',
        budgetOption: 'Polycab ISI Copper Wire & Standard Modular Switches',
        iconName: 'Zap'
      },
      {
        id: 'mat-9',
        name: 'Plumbing CPVC Supply & SWR Pipes',
        unit: 'Feet',
        quantity: 280,
        ratePerUnitINR: 48,
        totalCostINR: 13440,
        purpose: 'Potable water supply piping and sanitary sewage drainage network.',
        whyUsed: 'Delivers pressurized clean water and safely disposes bathroom/kitchen waste water.',
        advantages: ['CPVC withstands hot water up to 93°C without scaling', 'SWR rubber ring joints eliminate underground leaks'],
        disadvantages: ['Requires correct slope (1:100) for gravity drainage'],
        lifeExpectancyYears: '35 Years',
        maintenanceNote: 'Inspect cleanout plugs annually.',
        costSavingTip: 'Align kitchen and bathroom back-to-back to share plumbing vertical shafts.',
        premiumOption: 'Astral / Ashirvad CPVC & Silent SWR Pipe System',
        budgetOption: 'Supreme PVC Water Supply & Drainage Pipes',
        iconName: 'Droplet'
      },
      {
        id: 'mat-10',
        name: 'Doors & Window Frames',
        unit: 'Units',
        quantity: 6,
        ratePerUnitINR: 4500,
        totalCostINR: 27000,
        purpose: 'Main entrance security door, bedroom flush doors, and uPVC sliding window frames.',
        whyUsed: 'Provides entry security, weather tightness, noise reduction, and natural lighting.',
        advantages: ['uPVC windows are 100% termite and rust proof', 'EPDM gaskets prevent rain leakage'],
        disadvantages: ['Requires precision frame anchoring'],
        lifeExpectancyYears: '35 Years',
        maintenanceNote: 'Lubricate sliding window rollers annually.',
        costSavingTip: 'Use standard modular window sizes (4ft x 4ft) to order factory manufactured uPVC frames.',
        premiumOption: 'Teak Wood Main Door & Fenesta uPVC Double Glazed Windows',
        budgetOption: 'Laminated Flush Doors & Powder Coated Aluminum Windows',
        iconName: 'Compass'
      }
    ],
    timeline: [
      {
        id: 'time-1',
        phaseName: 'Foundation & Earth Excavation',
        estimatedDays: 12,
        description: 'Site clearing, layout marking, 5ft deep footing excavation, PCC bed, footings rebar binding & concrete pouring.',
        whyThisOrder: 'Ground load bearing capacity must be established before casting vertical columns.',
        qualityChecklist: ['Verify SBC soil depth', 'Maintain 50mm clear cover', '7-day pond curing of footing'],
        budgetTips: 'Rent mechanical earth excavator for 1 day instead of manual labor to save 40% time.'
      },
      {
        id: 'time-2',
        phaseName: 'Plinth Beam & Column Starter Casting',
        estimatedDays: 8,
        dependencyPhase: 'Foundation',
        description: 'Backfilling soil, compaction, plinth tie beam shuttering, steel binding, and concrete casting.',
        whyThisOrder: 'Plinth beam locks footing columns together and acts as wall base at ground level.',
        qualityChecklist: ['Apply Damp-Proof Course (DPC) layer on top', 'Compact soil with plate vibrator'],
        budgetTips: 'Use M-Sand in PCC bed under plinth beam.'
      },
      {
        id: 'time-3',
        phaseName: 'Ground Floor RCC Column Casting',
        estimatedDays: 7,
        dependencyPhase: 'Plinth Beam',
        description: 'Shuttering box erection, 9"x12" column steel cage placement, verticality plumb check, and M20 concrete pouring.',
        whyThisOrder: 'Columns carry roof and wall loads vertically down to the plinth and footing.',
        qualityChecklist: ['Use mechanical needle vibrator', 'Check verticality with plumb bob', '14-day hessian cloth wet curing'],
        budgetTips: 'Use reusable steel formwork boxes to eliminate timber shuttering waste.'
      },
      {
        id: 'time-4',
        phaseName: 'Brick Masonry Wall Construction',
        estimatedDays: 14,
        dependencyPhase: 'Columns',
        description: 'Laying 9" exterior load-bearing walls and 4.5" interior partition walls with 1:4 cement sand mortar.',
        whyThisOrder: 'Walls fill structural bays and provide temporary support for roof beam formwork.',
        qualityChecklist: ['Soak red bricks for 2 hours before laying', 'Install lintel band at 7ft door height'],
        budgetTips: 'Use AAC blocks for interior partitions to speed up wall construction.'
      },
      {
        id: 'time-5',
        phaseName: 'Roof Beam & 5-inch Slab Casting',
        estimatedDays: 12,
        dependencyPhase: 'Brick Masonry',
        description: 'Centering formwork props, roof beam steel cages, 2-way slab steel mesh, electrical conduit insertion, and M20 concrete casting.',
        whyThisOrder: 'Encloses the building structure and creates protective roof ceiling.',
        qualityChecklist: ['Maintain continuous 14-day water pond curing', 'Check electrical conduit placement before casting'],
        budgetTips: 'Cast entire roof slab monolithically in a single continuous day using ready mix concrete.'
      },
      {
        id: 'time-6',
        phaseName: 'Internal & External Wall Plastering',
        estimatedDays: 10,
        dependencyPhase: 'Roof Slab',
        description: 'Groove cutting for electrical conduits, chicken wire mesh over column-brick joints, and 12mm 1:4 cement mortar plastering.',
        whyThisOrder: 'Provides flat, smooth base for paint, tiles, and waterproofing coatings.',
        qualityChecklist: ['Apply chicken wire mesh over RCC-brick joints to prevent cracks', '7-day water curing'],
        budgetTips: 'Use machine spray plaster for uniform thickness and minimal mortar dropping.'
      },
      {
        id: 'time-7',
        phaseName: 'Concealed Electrical & Plumbing Rough-In',
        estimatedDays: 8,
        dependencyPhase: 'Plastering',
        description: 'Laying concealed PVC conduits, electrical switch boxes, CPVC water supply lines, and SWR drainage pipes.',
        whyThisOrder: 'Concealed utilities must be pressure tested before floor tiling and wall painting.',
        qualityChecklist: ['24-hour 10 bar hydraulic pressure test on CPVC lines', 'Megger insulation test on electrical wires'],
        budgetTips: 'Route pipes through pre-designed plumbing vertical shafts.'
      },
      {
        id: 'time-8',
        phaseName: 'Flooring Tiling & Bathroom Waterproofing',
        estimatedDays: 10,
        dependencyPhase: 'Plumbing',
        description: '2-coat elastomeric waterproofing in bathroom floor, 48-hour pond test, 800x800mm vitrified tile laying with tile spacers.',
        whyThisOrder: 'Waterproofing and floor tiles seal sub-floor from moisture ingress.',
        qualityChecklist: ['48-hour standing water pond test in bathroom', 'Use epoxy grout in wet areas'],
        budgetTips: 'Use polymer tile adhesive over lean mortar screed for fast zero-hollow laying.'
      },
      {
        id: 'time-9',
        phaseName: 'Interior Putty, Primer & Painting',
        estimatedDays: 9,
        dependencyPhase: 'Flooring',
        description: 'Sanding walls, applying 2 coats acrylic wall putty, 1 coat primer, and 2 coats royal acrylic emulsion paint.',
        whyThisOrder: 'Applied near project completion to protect pristine wall finish from construction dust.',
        qualityChecklist: ['Ensure wall moisture is below 8% before putty', 'Smooth sanding with 220 grit paper'],
        budgetTips: 'Use white primer to reduce number of expensive color paint coats needed.'
      },
      {
        id: 'time-10',
        phaseName: 'Doors, Windows, Fixtures & Final Cleaning',
        estimatedDays: 5,
        dependencyPhase: 'Painting',
        description: 'Installing uPVC window frames, doors, sanitaryware (WC, washbasin, taps), electrical switch plates, LED lights, and deep cleaning.',
        whyThisOrder: 'Final commissioning phase before handing keys to client.',
        qualityChecklist: ['Check window seal gaskets', 'Flush all water supply lines', 'Test ELCB electrical trip switch'],
        budgetTips: 'Use standard modular sanitary fittings for easy warranty replacements.'
      }
    ],
    costBreakdown: [
      {
        category: 'Civil Structure (Substructure & RCC Superstructure)',
        amountINR: 420000,
        percentage: 42,
        description: 'Includes excavation, footings, RCC columns, beams, roof slab, steel rebar, cement, sand, and aggregate.',
        keyIncludes: ['Cement', 'Fe500D Steel', 'Sand', 'Stone Chips', 'Shuttering Formwork']
      },
      {
        category: 'Brick Masonry & Wall Plaster',
        amountINR: 180000,
        percentage: 18,
        description: 'Includes red clay bricks / AAC blocks, mortar, internal and external 2-coat wall plastering.',
        keyIncludes: ['Red Bricks', 'Mortar Cement', 'Chicken Mesh', 'Exterior Plaster']
      },
      {
        category: 'Finishing Works (Tiles, Paint, Doors & Windows)',
        amountINR: 220000,
        percentage: 22,
        description: 'Includes 800x800mm vitrified floor tiles, bathroom wall tiles, wall putty, acrylic emulsion paint, doors, and uPVC windows.',
        keyIncludes: ['Vitrified Tiles', 'Wall Putty & Paint', 'uPVC Windows', 'Flush Doors']
      },
      {
        category: 'MEP Systems (Electrical & Plumbing Installation)',
        amountINR: 110000,
        percentage: 11,
        description: 'Includes concealed electrical conduit wiring, switch plates, CPVC water supply, SWR drainage, and sanitaryware fixtures.',
        keyIncludes: ['Copper Wires', 'Modular Switches', 'CPVC Pipes', 'Sanitary Fittings']
      },
      {
        category: 'Engineering, Permitting & Contingency Buffer',
        amountINR: 70000,
        percentage: 7,
        description: 'Includes architectural drawings, structural engineering audit, municipal plan approval fee, and site contingency.',
        keyIncludes: ['Architectural Plans', 'Structural Audit', 'Municipal Approval', 'Site Security']
      }
    ],
    recommendations: {
      foundation: {
        type: 'Isolated Trapezoidal RCC Footing with Plinth Tie Beam',
        description: 'Individual RCC footings (5ft × 5ft × 4.5ft depth) linked at ground level with 9"x12" continuous RCC plinth tie beams.',
        whyRecommended: 'For a 20ft x 20ft single story compact structure on Kolkata alluvial clay soil (SBC ~120 kN/m²), isolated footings provide optimal settlement safety without expensive raft foundation overhead.',
        pros: ['Cost-effective RCC volume', 'High settlement stability', 'Easy excavation'],
        cons: ['Requires manual backfill compaction'],
        depthFt: 4.5,
        rebarSpec: '12mm Fe500D steel mesh @ 125mm c/c both ways'
      },
      columnSize: {
        spec: '9" × 12" RCC Columns (4 Corner Columns + 2 Central Frame Columns)',
        whyRecommended: 'Provides required cross-sectional compression area (108 sq.in) to withstand total roof dead load and live load with safety factor 1.5.',
        rebarDetails: '6 Vertical Bars of 16mm Fe500D Steel + 8mm Stirrups @ 150mm c/c',
        spacingFt: 12
      },
      beam: {
        spec: '9" × 12" Continuous Plinth & Roof Beams',
        whyRecommended: 'Binds columns into a rigid structural box, preventing lateral sway during wind or seismic ground motion.',
        plinthBeamSpec: '9"x12" with 4 bars of 12mm Fe500D (2 top, 2 bottom)',
        roofBeamSpec: '9"x12" with 6 bars of 12mm/16mm Fe500D (3 top, 3 bottom)'
      },
      roof: {
        type: 'Monolithic 5-inch (125mm) M20 Grade RCC Two-Way Slab',
        thicknessInches: 5,
        concreteGrade: 'M20 (1 Cement : 1.5 Sand : 3 Aggregate)',
        whyRecommended: 'Provides seamless fireproof ceiling diaphragm with span/depth ratio < 30 to guarantee zero visible ceiling deflection sag.',
        waterproofingMethod: 'Polymer modified cementitious slurry coating + 1:100 screed slope to 4" PVC downspouts'
      },
      brick: {
        type: 'First-Class Red Clay Bricks (Outer) & 4" AAC Light Blocks (Inner)',
        whyRecommended: 'Red bricks resist outer monsoon weathering while AAC blocks reduce internal partition weight by 50%.',
        outerWallThicknessInches: 9,
        innerWallThicknessInches: 4.5,
        thermalPerformance: 'U-value 1.4 W/m²K providing cool interior room temperatures during summer'
      },
      wallThickness: {
        outerSpec: '9-inch (230mm) Double Brick Wall with 1:4 Mortar',
        innerSpec: '4.5-inch (115mm) Single Brick / AAC Partition Wall',
        whyRecommended: '9-inch outer walls prevent rain water damp seepage through exterior plaster during Kolkata monsoons.'
      },
      windowPlacement: {
        recommendation: 'Position main windows on North and East facades (4ft x 4ft) and smaller exhaust windows on West/South.',
        whyRecommended: 'Captures cool morning daylight and North ambient glare-free illumination while blocking harsh afternoon West thermal heat.',
        glazingAreaPercent: '18% of floor area',
        orientationAdvice: 'North-East primary window orientation'
      },
      ventilation: {
        strategy: 'Cross-ventilation flow path connecting Living Room North window through bedroom to East window shaft.',
        whyRecommended: 'Maintains minimum 6-8 air changes per hour (ACH) to dissipate indoor humidity without AC dependency.',
        airChangePerHour: '8 ACH',
        shaftPositioning: '3ft x 3ft vertical ventilation shaft behind kitchen/bathroom'
      },
      naturalLighting: {
        strategy: 'Open-plan living & kitchen arch allowing daylight penetration up to 15 feet deep into the floor center.',
        whyRecommended: 'Eliminates need for artificial daytime electric lighting, cutting monthly electricity bills by 20%.',
        sunPathAdvice: 'Solar angles optimized for 22° N latitude'
      },
      waterTankPosition: {
        location: 'South-West corner above stair cabin / roof top RCC platform',
        capacityLiters: 1500,
        whyRecommended: 'Provides gravity water pressure to bathroom taps while placing heavy water dead weight over strongest column junction.'
      },
      septicTankPosition: {
        location: 'North-West corner of plot, 10 feet away from foundation footings',
        type: '3-Chamber Baffled RCC Tank with Soak Pit',
        capacityLiters: 2500,
        whyRecommended: 'Prevents foul odor drift towards living areas and adheres to Vastu and environmental drainage guidelines.',
        distanceFromFoundationFt: 10
      },
      rainwaterDrainage: {
        slope: '1:100 roof slope towards North-East downspout drain pipe',
        pipeSizeInches: 4,
        whyRecommended: 'Drains heavy monsoon rainfall (up to 100mm/hr) rapidly without standing water pooling on roof slab.',
        rechargePitAdvice: 'Connect downspout to 6ft x 6ft gravel-filled groundwater recharge pit'
      },
      electricalLayout: {
        dbPosition: 'Inside Living Room entry hallway at 5.5ft height',
        circuits: '4 Independent Circuits (Living, Bedroom, Kitchen, AC/Geyser)',
        conduitType: 'Heavy-Duty FRLS PVC Concealed Conduit',
        whyRecommended: 'Isolates high power appliances so lighting circuits remain live even if AC trips.'
      },
      plumbingLayout: {
        pipeType: 'SDR 11 CPVC Water Lines & Ring-Fit SWR Drainage Pipes',
        shaftAlignment: 'Vertical plumbing shaft on West perimeter wall',
        dualLineAdvice: 'Separate greywater (washbasin/bath) from blackwater (toilet WC) lines',
        whyRecommended: 'Enables easy maintenance access from outside building without damaging interior bathroom tiles.'
      },
      furnitureLayout: {
        principles: 'Wall-mounted TV console, L-shaped 3-seater sofa against North wall, Queen bed against East wall.',
        clearanceFt: 3,
        whyRecommended: 'Preserves 3-foot clear walking passage loops between entrance, kitchen, bedroom, and bathroom.'
      },
      colorTheme: {
        paletteName: 'Warm Kolkata Heritage Greige & Terracotta',
        colors: ['#F5F5F0 (Off-white Canvas)', '#3B82F6 (Blue Accent)', '#D97706 (Terracotta Warmth)', '#1E293B (Deep Charcoal Metal)'],
        psychology: 'Creates a calming, visually spacious atmosphere in compact urban homes.',
        whyRecommended: 'High light-reflectance value (LRV 78%) bounces natural window daylight throughout the room.'
      },
      tileSuggestions: {
        livingRoom: '800x800mm Glazed Vitrified Tiles with Ivory Marble Finish',
        bathroom: '300x300mm Anti-skid Matte Vitrified Floor Tiles + 300x600mm Wall Tiles',
        kitchen: '600x600mm Stain-resistant Full Body Vitrified Tiles',
        whyRecommended: 'Matte anti-skid tiles in wet areas prevent slipping accidents, while polished vitrified tiles in living areas reflect light.'
      },
      ceilingSuggestions: {
        type: 'Gypsum False Ceiling with Peripheral Perimeter LED Cove Lighting',
        heightFt: 9.5,
        whyRecommended: 'Conceals electrical conduits and air conditioning piping while creating ambient warm indirect lighting.'
      },
      lightingSuggestions: {
        temperatureK: '3000K Warm White (Living & Bedroom) & 4000K Neutral White (Kitchen & Bath)',
        fixtures: ['COB Spotlights', 'Continuous LED Strip Light', 'Wall Sconces'],
        whyRecommended: 'Layered ambient and task lighting reduces eye strain and highlights architectural accents.'
      }
    }
  }
];
