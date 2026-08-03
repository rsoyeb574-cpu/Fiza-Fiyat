import { 
  ConstructionPlotPlan, 
  RegionalRate, 
  MaterialEstimateItem, 
  TimelinePhaseItem, 
  CostBreakdownCategory, 
  StructuralRecommendations 
} from '../types/construction';

export function calculateConstructionPlan(
  widthFt: number,
  lengthFt: number,
  location: string,
  floors: 'Ground Floor' | 'G+1' | 'G+2' | 'G+3',
  budgetINR: number,
  rates: RegionalRate[]
): ConstructionPlotPlan {
  const plotAreaSqFt = widthFt * lengthFt;
  let floorCount = 1;
  if (floors === 'G+1') floorCount = 2;
  if (floors === 'G+2') floorCount = 3;
  if (floors === 'G+3') floorCount = 4;

  const builtUpAreaSqFt = Math.round(plotAreaSqFt * 0.85 * floorCount);

  // Find regional rate or fallback to default
  const regionalRate = rates.find(r => r.regionName.toLowerCase() === location.toLowerCase()) || rates[0];
  const mat = regionalRate?.materials || {
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
  };

  const baseCostPerSqFt = regionalRate ? regionalRate.baseConstructionCostPerSqFtINR : 1850;
  const estimatedTotalCost = builtUpAreaSqFt * baseCostPerSqFt;

  // Material quantities & costs
  const cementBags = Math.round(builtUpAreaSqFt * 0.45);
  const steelKg = Math.round(builtUpAreaSqFt * 3.8);
  const sandCuFt = Math.round(builtUpAreaSqFt * 1.55);
  const aggregateCuFt = Math.round(builtUpAreaSqFt * 1.3);
  const brickPieces = Math.round(builtUpAreaSqFt * 11);
  const tilesSqFt = Math.round(builtUpAreaSqFt * 0.9);
  const paintLiters = Math.round(builtUpAreaSqFt * 0.11);
  const wireCoils = Math.max(4, Math.round(builtUpAreaSqFt * 0.03));
  const pipeFeet = Math.round(builtUpAreaSqFt * 0.7);

  const materials: MaterialEstimateItem[] = [
    {
      id: 'm-cement',
      name: 'Cement (PPC / OPC 43)',
      unit: 'Bags (50 kg)',
      quantity: cementBags,
      ratePerUnitINR: mat.cementBagINR,
      totalCostINR: cementBags * mat.cementBagINR,
      purpose: 'Structural binding agent for foundation PCC, column/beam RCC casting, brick masonry mortar, and plaster.',
      whyUsed: 'Cement reacts chemically with water (hydration) forming crystalline calcium silicate hydrate (C-S-H) gel that locks aggregate particles together into rock-hard concrete.',
      advantages: ['High compressive strength', 'Hydraulic setting under water', 'Provides anti-corrosion alkaline passivating layer around steel rebar'],
      disadvantages: ['Low tensile strength', 'Requires 14 days moist water curing to achieve full design strength'],
      lifeExpectancyYears: '80 - 100 Years',
      maintenanceNote: 'Keep stored in elevated moisture-proof dry sacks prior to batching.',
      costSavingTip: 'Use Fly Ash blended Pozzolana Cement (PPC) for brick mortar and plaster to save 12% cement costs while minimizing micro-cracking.',
      premiumOption: 'OPC 53 Grade UltraTech / ACC Gold',
      budgetOption: 'PPC Blended Ambuja / Lafarge Cement',
      iconName: 'Package'
    },
    {
      id: 'm-steel',
      name: 'Steel Rebar (Fe500D TMT)',
      unit: 'Kg',
      quantity: steelKg,
      ratePerUnitINR: mat.steelKgINR,
      totalCostINR: steelKg * mat.steelKgINR,
      purpose: 'Provides tensile and flexural ductility in RCC columns, footings, plinth beams, and roof slabs.',
      whyUsed: 'Concrete is strong in compression but brittle in tension. Thermo-Mechanically Treated (TMT) steel bars flex under bending loads without brittle fracture.',
      advantages: ['Fe500D grade provides >16% elongation for high seismic shock absorption', 'Ribbed profile ensures strong mechanical bond with concrete'],
      disadvantages: ['Prone to rust oxidation if clear concrete cover is under 25mm'],
      lifeExpectancyYears: '80+ Years',
      maintenanceNote: 'Store stacked off bare ground on wood blocks covered with tarpaulin.',
      costSavingTip: 'Procure primary mill steel in standard 12m factory lengths to minimize cutting waste scrap.',
      premiumOption: 'Tata Tiscon Fe550D / JSW Neosteel',
      budgetOption: 'Primary Mill Fe500D Rebar',
      iconName: 'Zap'
    },
    {
      id: 'm-sand',
      name: 'Sand / Coarse M-Sand',
      unit: 'Cu. Ft',
      quantity: sandCuFt,
      ratePerUnitINR: mat.sandCuFtINR,
      totalCostINR: sandCuFt * mat.sandCuFtINR,
      purpose: 'Fine aggregate matrix filler for concrete, brick laying mortar, and wall plastering.',
      whyUsed: 'Fills voids between coarse aggregates, reducing cement paste volume requirements and preventing shrinkage cracks.',
      advantages: ['Washed M-Sand has zero clay silt content (<3%)', 'Consistent grain size distribution ensures uniform mortar strength'],
      disadvantages: ['River sand contains clay impurities if unwashed'],
      lifeExpectancyYears: '100 Years',
      maintenanceNote: 'Sieve through fine wire mesh before applying wall plaster.',
      costSavingTip: 'Opt for double-washed Manufactured Sand (M-Sand) over river sand to save up to 20% on fine aggregate budget.',
      premiumOption: 'Double-Washed Machine M-Sand',
      budgetOption: 'Sifted Local River Sand',
      iconName: 'Layers'
    },
    {
      id: 'm-aggregate',
      name: 'Stone Aggregate (20mm & 10mm)',
      unit: 'Cu. Ft',
      quantity: aggregateCuFt,
      ratePerUnitINR: mat.aggregateCuFtINR,
      totalCostINR: aggregateCuFt * mat.aggregateCuFtINR,
      purpose: 'Coarse structural skeleton providing 65% of concrete volume in footings, columns, and slabs.',
      whyUsed: 'Provides compressive strength, dimensional stability, and resistance to physical wear and weathering.',
      advantages: ['Crushed angular basalt stone interlocks firmly in concrete', 'Low moisture absorption'],
      disadvantages: ['Elongated stone chips reduce concrete workability'],
      lifeExpectancyYears: '100 Years',
      maintenanceNote: 'Wash dust off aggregate piles before mixing.',
      costSavingTip: 'Mix 60% 20mm with 40% 10mm aggregate for optimum density with minimal void ratio.',
      premiumOption: 'Crushed Granite Angular Aggregate',
      budgetOption: 'Black Basalt Local Aggregate',
      iconName: 'Box'
    },
    {
      id: 'm-brick',
      name: 'Bricks / AAC Blocks',
      unit: 'Pieces',
      quantity: brickPieces,
      ratePerUnitINR: mat.brickPieceINR,
      totalCostINR: brickPieces * mat.brickPieceINR,
      purpose: 'Masonry wall enclosure for exterior weather protection and interior spatial room partitioning.',
      whyUsed: 'Delivers thermal insulation, acoustic privacy, fire rating, and structural support for wall plaster.',
      advantages: ['High thermal mass stabilizes indoor temperature', 'Excellent plaster mechanical bond'],
      disadvantages: ['Heavy dead load requires sturdy column foundation frame'],
      lifeExpectancyYears: '100+ Years',
      maintenanceNote: 'Keep exterior walls painted with acrylic weather-shield paint.',
      costSavingTip: 'Use AAC (Autoclaved Aerated Concrete) light blocks for non-load bearing interior walls to reduce dead load by 60%.',
      premiumOption: '6-inch AAC Light Concrete Blocks',
      budgetOption: 'First-Class Kiln Red Clay Bricks',
      iconName: 'Building'
    },
    {
      id: 'm-tile',
      name: 'Vitrified Flooring Tiles',
      unit: 'Sq. Ft',
      quantity: tilesSqFt,
      ratePerUnitINR: mat.tileSqFtINR,
      totalCostINR: tilesSqFt * mat.tileSqFtINR,
      purpose: 'Durable non-porous floor finish across Living Room, Bedrooms, Kitchen, and Passages.',
      whyUsed: 'Provides stain-proof, scratch-resistant, easy-to-clean floor surface.',
      advantages: ['Water absorption <0.05%', 'PEI 4 high traffic durability', 'Polished glossy marble finish'],
      disadvantages: ['Requires skilled laying on level floor screed'],
      lifeExpectancyYears: '30 Years',
      maintenanceNote: 'Clean with non-acidic tile liquid cleaner.',
      costSavingTip: 'Choose standard 800x800mm tiles over large 1200x2400mm slabs to cut laying cost by 35%.',
      premiumOption: 'Double Charged GVT Vitrified Tile Slabs',
      budgetOption: 'Glazed Ceramic Floor Tiles',
      iconName: 'Grid'
    },
    {
      id: 'm-paint',
      name: 'Paint & Acrylic Wall Putty',
      unit: 'Liters',
      quantity: paintLiters,
      ratePerUnitINR: mat.paintLiterINR,
      totalCostINR: paintLiters * mat.paintLiterINR,
      purpose: 'Protective wall coatings shielding plaster against rain, moisture, algae, and UV fading.',
      whyUsed: 'Improves interior light reflection, seals plaster pores, and provides washable aesthetics.',
      advantages: ['Washable stain resistance', 'Anti-fungal additives', 'UV fade-proof exterior pigments'],
      disadvantages: ['Fails if applied on damp uncured plaster'],
      lifeExpectancyYears: '8 Years',
      maintenanceNote: 'Wipe interior walls with soft damp cloth.',
      costSavingTip: 'Apply 2 coats acrylic wall putty + 1 coat primer before painting to increase paint coverage yield.',
      premiumOption: 'Asian Paints Royal Luxury Emulsion & Apex Ultima',
      budgetOption: 'Acrylic Emulsion & Primer',
      iconName: 'Palette'
    },
    {
      id: 'm-wire',
      name: 'Electrical FRLS Copper Wire',
      unit: 'Coils',
      quantity: wireCoils,
      ratePerUnitINR: mat.wireCoilINR,
      totalCostINR: wireCoils * mat.wireCoilINR,
      purpose: 'Concealed copper wiring distribution inside PVC conduits for lighting, power sockets, and appliances.',
      whyUsed: 'Provides safe, low-resistance electrical distribution with fire-retardant insulation.',
      advantages: ['FR-LSH insulation prevents toxic smoke during electrical short circuits', 'Concealed installation maintains clean interiors'],
      disadvantages: ['Requires proper MCB circuit breaker sizing'],
      lifeExpectancyYears: '30 Years',
      maintenanceNote: 'Test ELCB/RCCB trip switches every 6 months.',
      costSavingTip: 'Separate 16A AC/Geyser power circuits from 6A lighting circuits to optimize copper wire gauge costs.',
      premiumOption: 'Finolex / Havells FRLSH Pure Copper Wire',
      budgetOption: 'Polycab ISI Copper Wire',
      iconName: 'Zap'
    }
  ];

  // Timeline
  const timeline: TimelinePhaseItem[] = [
    {
      id: 't-1',
      phaseName: 'Site Survey, Layout & Footing Excavation',
      estimatedDays: Math.min(14, 8 + floorCount * 2),
      description: 'Site clearing, architectural layout marking, 5ft deep footing excavation, PCC bed, and footing rebar placement.',
      whyThisOrder: 'Solid foundation substructure must be established before casting vertical column frames.',
      qualityChecklist: ['Confirm SBC soil bearing capacity depth', 'Ensure 50mm clear concrete cover under footing rebar mesh', '7 days pond curing'],
      budgetTips: 'Rent mechanical excavator for 1 day to cut excavation time and labor cost by 40%.'
    },
    {
      id: 't-2',
      phaseName: 'Plinth Beam & Ground Framing',
      estimatedDays: 7,
      dependencyPhase: 'Footing Excavation',
      description: 'Backfilling, compaction, plinth tie beam shuttering, steel binding, and M20 concrete casting.',
      whyThisOrder: 'Plinth beam binds footing columns into a rigid structural box at ground level.',
      qualityChecklist: ['Apply Damp-Proof Course (DPC) layer over plinth top', 'Vibrate concrete thoroughly with needle vibrator'],
      budgetTips: 'Use M-Sand in PCC base under plinth beam.'
    },
    {
      id: 't-3',
      phaseName: 'Column Casting & Brickwork',
      estimatedDays: 10 * floorCount,
      dependencyPhase: 'Plinth Beam',
      description: 'Erecting 9"x12" column steel cages, shuttering boxes, M20 concrete casting, and laying brick masonry walls.',
      whyThisOrder: 'Columns carry vertical structural load down to plinth and footings.',
      qualityChecklist: ['Verify column verticality with plumb bob', 'Soak red clay bricks 2 hours before laying', '14 days hessian cloth wet curing'],
      budgetTips: 'Use reusable steel shuttering boxes instead of timber plywood.'
    },
    {
      id: 't-4',
      phaseName: 'Roof Beam & Slab Concrete Casting',
      estimatedDays: 12 * floorCount,
      dependencyPhase: 'Column Casting',
      description: 'Formwork props, roof beam steel cages, 2-way slab steel mesh, electrical conduit placement, and M20 concrete pouring.',
      whyThisOrder: 'Roof slab encloses each story and creates floor ceiling diaphragm.',
      qualityChecklist: ['Maintain 14 days continuous water pond curing', 'Check electrical conduit insertion before pouring concrete'],
      budgetTips: 'Cast entire roof slab monolithically in a single continuous day.'
    },
    {
      id: 't-5',
      phaseName: 'Wall Plastering & MEP Concealed Rough-In',
      estimatedDays: 12 * floorCount,
      dependencyPhase: 'Roof Slab',
      description: 'Groove cutting for conduits, chicken wire mesh over column-brick joints, 2-coat wall plastering, CPVC water pipes, and SWR drainage.',
      whyThisOrder: 'Plaster provides smooth base for paint/tiles; pipes must be tested before closing wall grooves.',
      qualityChecklist: ['24-hour 10 bar hydraulic pressure test on water pipes', 'Apply chicken wire mesh on column-wall joints'],
      budgetTips: 'Route plumbing through dedicated vertical plumbing shafts.'
    },
    {
      id: 't-6',
      phaseName: 'Flooring Tiling, Painting & Final Handover',
      estimatedDays: 14,
      dependencyPhase: 'Wall Plastering',
      description: 'Bathroom waterproofing, 800x800mm tile laying, wall putty, acrylic emulsion paint, doors/windows, electrical switch plates, and cleaning.',
      whyThisOrder: 'Final finishing phase executed in clean dry environment before move-in.',
      qualityChecklist: ['48-hour standing water pond test in bathroom', 'Smooth sanding with 220 grit paper before painting', 'Flush all plumbing lines'],
      budgetTips: 'Use standard modular switch plates and sanitary fittings.'
    }
  ];

  // Cost breakdown
  const civilCost = Math.round(estimatedTotalCost * 0.45);
  const finishingCost = Math.round(estimatedTotalCost * 0.25);
  const mepCost = Math.round(estimatedTotalCost * 0.15);
  const interiorCost = Math.round(estimatedTotalCost * 0.10);
  const contingencyCost = Math.round(estimatedTotalCost * 0.05);

  const costBreakdown: CostBreakdownCategory[] = [
    {
      category: 'Civil Structure (Substructure & Superstructure)',
      amountINR: civilCost,
      percentage: 45,
      description: 'Footings, columns, plinth beam, roof slab, cement, rebar, sand, aggregate, shuttering formwork.',
      keyIncludes: ['Cement', 'Fe500D Steel', 'Sand', 'Stone Aggregate', 'Shuttering Formwork']
    },
    {
      category: 'Finishing Works (Plaster, Tiles, Paint, Doors & Windows)',
      amountINR: finishingCost,
      percentage: 25,
      description: 'Internal & external wall plastering, vitrified floor tiles, bathroom wall tiles, wall putty, acrylic paint, doors, and uPVC windows.',
      keyIncludes: ['Vitrified Tiles', 'Wall Putty & Paint', 'uPVC Windows', 'Flush Doors']
    },
    {
      category: 'MEP Systems (Electrical & Plumbing Infrastructure)',
      amountINR: mepCost,
      percentage: 15,
      description: 'Concealed copper electrical wiring, modular switches, CPVC water supply, SWR drainage, and sanitary fittings.',
      keyIncludes: ['Copper Wiring', 'Modular Switches', 'CPVC Pipes', 'Sanitary Ware']
    },
    {
      category: 'Interior Design & Fixtures',
      amountINR: interiorCost,
      percentage: 10,
      description: 'Modular kitchen cabinets, bedroom wardrobes, bathroom vanities, cove false ceiling, and LED lighting fixtures.',
      keyIncludes: ['Modular Kitchen', 'Bedroom Wardrobes', 'False Ceiling', 'LED Spotlights']
    },
    {
      category: 'Engineering Approval & Contingency Buffer',
      amountINR: contingencyCost,
      percentage: 5,
      description: 'Architectural blueprints, structural audit, municipal plan approval fee, and site contingency reserve.',
      keyIncludes: ['Architectural Plan', 'Structural Audit', 'Municipal Sanction', 'Site Contingency']
    }
  ];

  // Structural Recommendations
  const recommendations: StructuralRecommendations = {
    foundation: {
      type: floorCount > 2 ? 'Continuous Raft Foundation with Damp-Proof Tanking' : 'Isolated Trapezoidal RCC Footing with Plinth Tie Beam',
      description: `Individual RCC footings (5ft × 5ft × 4.5ft depth) linked at ground level with 9"x12" RCC plinth tie beams.`,
      whyRecommended: `For a ${widthFt}ft × ${lengthFt}ft ${floors} layout in ${location}, isolated footings balance safe soil load distribution with efficient concrete consumption.`,
      pros: ['High structural stability', 'Cost-effective rebar volume', 'Easy excavation'],
      cons: ['Requires thorough soil compaction'],
      depthFt: 4.5,
      rebarSpec: '12mm Fe500D steel mesh @ 125mm c/c both ways'
    },
    columnSize: {
      spec: floorCount > 2 ? '9" × 15" RCC Columns' : '9" × 12" RCC Columns',
      whyRecommended: `Provides required compression area to handle roof dead load and live load with safety factor 1.5.`,
      rebarDetails: '6 Vertical Bars of 16mm Fe500D Steel + 8mm Stirrups @ 150mm c/c',
      spacingFt: Math.min(14, Math.round(widthFt * 0.6))
    },
    beam: {
      spec: '9" × 12" Plinth Beams & Roof Beams',
      whyRecommended: 'Locks vertical column frame into a rigid 3D box structure to prevent lateral sway.',
      plinthBeamSpec: '9"x12" with 4 bars of 12mm Fe500D (2 top, 2 bottom)',
      roofBeamSpec: '9"x12" with 6 bars of 12mm/16mm Fe500D (3 top, 3 bottom)'
    },
    roof: {
      type: 'Monolithic 5-inch (125mm) M20 Grade RCC Two-Way Slab',
      thicknessInches: 5,
      concreteGrade: 'M20 (1 Cement : 1.5 Sand : 3 Aggregate)',
      whyRecommended: 'Ensures zero ceiling deflection sag and provides excellent thermal mass and sound dampening.',
      waterproofingMethod: 'Polymer modified cementitious slurry coating + 1:100 screed slope to 4" PVC downspouts'
    },
    brick: {
      type: 'Red Clay Bricks (Outer) & 4" AAC Light Blocks (Inner)',
      whyRecommended: 'Red bricks resist monsoon rain weathering while AAC blocks reduce internal partition weight by 60%.',
      outerWallThicknessInches: 9,
      innerWallThicknessInches: 4.5,
      thermalPerformance: 'U-value 1.4 W/m²K providing cool interior room temperatures during summer'
    },
    wallThickness: {
      outerSpec: '9-inch (230mm) Double Brick Wall with 1:4 Mortar',
      innerSpec: '4.5-inch (115mm) Single Brick / AAC Partition Wall',
      whyRecommended: '9-inch outer walls prevent water damp seepage during heavy regional monsoon rains.'
    },
    windowPlacement: {
      recommendation: 'Position main windows on North and East facades (4ft x 4ft) and smaller exhaust windows on South/West.',
      whyRecommended: 'Captures cool morning daylight and glare-free North illumination while blocking harsh West thermal heat.',
      glazingAreaPercent: '18% of floor area',
      orientationAdvice: 'North-East primary window orientation'
    },
    ventilation: {
      strategy: 'Cross-ventilation flow path connecting Living Room window through hallway to bedroom window shaft.',
      whyRecommended: 'Maintains minimum 6-8 air changes per hour (ACH) to dissipate indoor humidity naturally.',
      airChangePerHour: '8 ACH',
      shaftPositioning: '3ft x 3ft vertical ventilation shaft behind kitchen/bathroom'
    },
    naturalLighting: {
      strategy: 'Open-plan living & kitchen arch allowing daylight penetration up to 15 feet deep into floor center.',
      whyRecommended: 'Eliminates need for daytime electric lighting, cutting monthly power bills by 20%.',
      sunPathAdvice: 'Solar angles optimized for tropical sun movement'
    },
    waterTankPosition: {
      location: 'South-West corner above stair cabin / roof top RCC platform',
      capacityLiters: Math.max(1000, floorCount * 750),
      whyRecommended: 'Delivers strong gravity water pressure to bathroom taps while anchoring weight over strong column junction.'
    },
    septicTankPosition: {
      location: 'North-West corner of plot, 10 feet away from foundation footings',
      type: '3-Chamber Baffled RCC Tank with Soak Pit',
      capacityLiters: 2500,
      whyRecommended: 'Prevents odor drift towards living areas and adheres to Vastu and municipal environmental guidelines.',
      distanceFromFoundationFt: 10
    },
    rainwaterDrainage: {
      slope: '1:100 roof slope towards North-East downspout drain pipe',
      pipeSizeInches: 4,
      whyRecommended: 'Drains heavy monsoon rainfall rapidly without standing water pooling on roof slab.',
      rechargePitAdvice: 'Connect downspout to 6ft x 6ft gravel-filled groundwater recharge pit'
    },
    electricalLayout: {
      dbPosition: 'Inside Living Room entry hallway at 5.5ft height',
      circuits: `${3 + floorCount} Independent Circuits (Living, Bedroom, Kitchen, AC/Geyser)`,
      conduitType: 'Heavy-Duty FRLS PVC Concealed Conduit',
      whyRecommended: 'Isolates high power appliances so lighting circuits remain active even if AC trips.'
    },
    plumbingLayout: {
      pipeType: 'SDR 11 CPVC Water Lines & Ring-Fit SWR Drainage Pipes',
      shaftAlignment: 'Vertical plumbing shaft on West perimeter wall',
      dualLineAdvice: 'Separate greywater (washbasin/bath) from blackwater (toilet WC) lines',
      whyRecommended: 'Enables easy maintenance access from outside building without breaking interior tiles.'
    },
    furnitureLayout: {
      principles: 'Wall-mounted TV console, L-shaped 3-seater sofa against North wall, Queen bed against East wall.',
      clearanceFt: 3,
      whyRecommended: 'Preserves 3-foot clear walking passage loops between entrance, kitchen, bedroom, and bathroom.'
    },
    colorTheme: {
      paletteName: `${location} Luxury Greige & Deep Cobalt`,
      colors: ['#F8FAFC (Off-white Canvas)', '#2563EB (Cobalt Blue Accent)', '#334155 (Slate Charcoal)', '#F1F5F9 (Warm Cream)'],
      psychology: 'Creates a calming, visually spacious atmosphere in modern homes.',
      whyRecommended: 'High light-reflectance value (LRV 78%) bounces natural daylight deep into rooms.'
    },
    tileSuggestions: {
      livingRoom: '800x800mm Glazed Vitrified Tiles with Italian Marble Pattern',
      bathroom: '300x300mm Anti-skid Matte Vitrified Floor Tiles + 300x600mm Wall Tiles',
      kitchen: '600x600mm Stain-resistant Full Body Vitrified Tiles',
      whyRecommended: 'Anti-skid matte tiles in wet bathrooms prevent slipping, while polished tiles in living area reflect light.'
    },
    ceilingSuggestions: {
      type: 'Gypsum False Ceiling with Peripheral Perimeter LED Cove Lighting',
      heightFt: 9.5,
      whyRecommended: 'Conceals electrical conduits and AC piping while providing warm indirect ambient illumination.'
    },
    lightingSuggestions: {
      temperatureK: '3000K Warm White (Living & Bedroom) & 4000K Neutral White (Kitchen & Bath)',
      fixtures: ['COB Spotlights', 'Continuous LED Strip Light', 'Wall Sconces'],
      whyRecommended: 'Layered ambient and task lighting reduces eye strain and highlights interior design accents.'
    }
  };

  return {
    id: `calc-${widthFt}x${lengthFt}-${location.toLowerCase()}-${floors.toLowerCase().replace('+', '')}`,
    title: `Custom ${widthFt}ft × ${lengthFt}ft ${floors} House Plan (${location})`,
    plotWidthFt: widthFt,
    plotLengthFt: lengthFt,
    totalAreaSqFt: plotAreaSqFt,
    builtUpAreaSqFt,
    location,
    floors,
    budgetINR: budgetINR > 0 ? budgetINR : estimatedTotalCost,
    costPerSqFtINR: baseCostPerSqFt,
    exterior3DImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    exterior3DAltViews: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    interiorImages: [
      {
        room: 'Living & Dining Hall',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        description: 'Spacious open-plan living area with ambient cove LED lighting, acoustic wall panels, and high LRV vitrified tiles.'
      },
      {
        room: 'Master Bedroom',
        imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
        description: 'Luxury master bedroom featuring full-height floor-to-ceiling wardrobes, padded headboard, and attached bathroom.'
      },
      {
        room: 'Modular Kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        description: 'L-shaped ergonomic kitchen with quartz stone counter, tandem soft-close drawers, and high-suction auto-clean chimney.'
      },
      {
        room: 'Modern Bathroom',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        description: 'Anti-skid floor tiles with wall-hung WC, concealed thermostatic shower diverter, and vertical plumbing ventilation.'
      }
    ],
    floorPlan2DData: {
      rooms: [
        { name: 'Living & Dining', x: 10, y: 10, w: Math.round(widthFt * 7.5), h: Math.round(lengthFt * 6), color: '#1e293b', doors: ['Main Entrance'], windows: ['W1 (North)'] },
        { name: 'Master Bedroom', x: Math.round(widthFt * 8.5), y: 10, w: Math.round(widthFt * 7.5), h: Math.round(lengthFt * 8), color: '#0f172a', doors: ['D1'], windows: ['W2 (East)'] },
        { name: 'Modular Kitchen', x: 10, y: Math.round(lengthFt * 6.5), w: Math.round(widthFt * 6), h: Math.round(lengthFt * 5), color: '#1e1b4b', doors: ['Arch'], windows: ['W3'] },
        { name: 'Attached Bath', x: Math.round(widthFt * 6.5), y: Math.round(lengthFt * 8), w: Math.round(widthFt * 4.5), h: Math.round(lengthFt * 3.5), color: '#172554', doors: ['D2'], windows: ['V1'] }
      ],
      dimensions: [
        { x1: 0, y1: 0, x2: widthFt * 15, y2: 0, label: `${widthFt} FT (PLOT WIDTH)` },
        { x1: widthFt * 15, y1: 0, x2: widthFt * 15, y2: lengthFt * 12, label: `${lengthFt} FT (PLOT LENGTH)` }
      ]
    },
    materials,
    timeline,
    costBreakdown,
    recommendations
  };
}
