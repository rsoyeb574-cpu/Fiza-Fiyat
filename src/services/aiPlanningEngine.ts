import { 
  AIHousePlannerInput, 
  AIPlanningReport, 
  FloorPlanData, 
  RoomLayout2D, 
  Design3DStyleConcept, 
  StructuralAdviceItem, 
  MaterialQuantityItem, 
  ProjectTimelineMilestone 
} from '../types/aiPlanning';
import { getMaterials, getLaborRates, getCities } from './constructionDb';
import { initialMaterials, initialLaborRates, initialCities } from './constructionDbSeedData';

export async function generateAIConstructionPlanningReport(input: AIHousePlannerInput): Promise<AIPlanningReport> {
  const plotArea = input.plotWidthFt * input.plotLengthFt;
  
  const floorMultiplierMap: Record<string, number> = {
    'Ground Floor': 0.88,
    'G+1': 1.70,
    'G+2': 2.45,
    'G+3': 3.20
  };
  const builtUpSqFt = Math.round(plotArea * (floorMultiplierMap[input.numberOfFloors] || 0.88));

  // Load live DB data
  const materials = await getMaterials(initialMaterials);
  const laborRates = await getLaborRates(initialLaborRates);
  const cities = await getCities(initialCities);

  const cityObj = cities.find(c => c.name.toLowerCase() === input.locationCity.toLowerCase()) || cities[0];
  const costMult = cityObj.costMultiplier || 1.0;
  const laborMult = cityObj.laborRateMultiplier || 1.0;

  const qualityMultMap: Record<string, number> = {
    'Budget': 0.80,
    'Standard': 1.0,
    'Premium': 1.35,
    'Luxury': 1.85
  };
  const qualMult = qualityMultMap[input.qualityLevel] || 1.0;

  // 1. Space Distribution
  const carpetAreaSqFt = Math.round(builtUpSqFt * 0.72);
  const wallAreaSqFt = Math.round(builtUpSqFt * 0.14);
  const circulationSqFt = Math.round(builtUpSqFt * 0.09);
  const balconyTerraceSqFt = Math.round(builtUpSqFt * 0.05);

  // 2. Vastu & Orientation
  const roomPositionsVastu = [
    { room: 'Master Bedroom', position: 'South-West Corner', reason: 'Ensures stability, privacy and optimal wind flow', vastuStatus: 'Optimal' as const },
    { room: 'Kitchen', position: 'South-East (Agni Corner)', reason: 'Favorable energy zone for thermal cooking appliances', vastuStatus: 'Optimal' as const },
    { room: 'Living Room', position: 'North-East or North-West', reason: 'Welcomes morning sunlight and guest circulation', vastuStatus: 'Favorable' as const },
    { room: 'Staircase', position: 'South-West or South', reason: 'Provides heavy structural anchoring along perimeter', vastuStatus: 'Optimal' as const },
    { room: 'Main Entry Door', position: 'North or East Facing', reason: 'Promotes natural daylighting and positive entryway flow', vastuStatus: 'Optimal' as const }
  ];

  // 3. Environmental Suggestions
  const naturalLightingSuggestions = [
    `Orient main living room windows toward ${input.northDirection} for soft diffuse daylight without harsh afternoon heat.`,
    'Incorporate 7-foot tall lintel windows in living and dining zones to maximize effective daylighting area.',
    'Use clear low-E insulated glass panes to allow maximum lux levels while reflecting infrared radiation.'
  ];

  const crossVentilationSuggestions = [
    'Align opposing window openings along East-West axis to encourage natural stack ventilation.',
    `Position kitchen exhaust louvers opposite prevailing ${input.roadDirection} road breeze for rapid smoke clearance.`,
    'Include high-level transom windows above internal bedroom doors for continuous passive air circulation.'
  ];

  const privacySuggestions = [
    'Set back master bedroom windows from primary road frontage using architectural vertical louvers.',
    'Place guest bathroom entryway in a recessed side corridor rather than direct living room view.',
    'Use frosted toughened glass for bathroom clerestory windows at 6.5ft sill height.'
  ];

  const futureExpansionSuggestions = [
    'Cast roof slab columns with 3ft exposed rebar lap splices enclosed in brick caps for future floor extension.',
    'Route main electrical conduit riser pipes with 30% spare capacity for solar PV and additional floor distribution.',
    'Design ground plinth tie beam foundation with safety reserve to comfortably support 1 additional future story.'
  ];

  // 4. Generate 2D Floor Plans
  const floorPlans: FloorPlanData[] = generateFloorPlans(input, builtUpSqFt);

  // 5. Generate 3D Design Style Concepts
  const design3DConcepts: Design3DStyleConcept[] = generate3DStyleConcepts();

  // 6. Generate Structural Guidance
  const structuralAdviceList: StructuralAdviceItem[] = [
    {
      category: 'Foundation',
      title: 'Isolated Trapezoidal Footing / Raft Mat',
      recommendation: input.numberOfFloors === 'G+3' || input.qualityLevel === 'Luxury' ? 'Continuous Monolithic Raft Mat Foundation' : 'Isolated Reinforced Footings tied with Plinth Beams',
      specification: 'Concrete Grade M25 (1:1:2) with 12mm/16mm Fe500D steel rebar mesh. Min 5ft depth below ground level.',
      codeReference: 'IS 456:2000 & IS 1080',
      iconName: 'Building'
    },
    {
      category: 'Columns & Beams',
      title: 'Seismic Structural Framing',
      recommendation: 'Main Columns (9" x 12" or 9" x 15") tied by 9" x 12" Plinth & Roof Beams',
      specification: '6 to 8 longitudinal 16mm/20mm Fe500D rebar bars with 8mm stirrups spaced at 150mm c/c.',
      codeReference: 'IS 13920 Ductile Detailing',
      iconName: 'Columns'
    },
    {
      category: 'Roof & Slab',
      title: 'Monolithic Two-Way Concrete Slab',
      recommendation: '5-Inch (125mm) M20 RCC Slab with PU Waterproof Coating',
      specification: 'Two-way cranked 8mm/10mm TMT rebar mesh at 150mm spacing with 25mm clear cover.',
      codeReference: 'IS 456:2000 Slab Design',
      iconName: 'Layers'
    },
    {
      category: 'Wall Thickness',
      title: 'Perimeter Weather & Partition Walls',
      recommendation: '9-Inch Red Clay Brick exterior walls; 5-Inch or 6-Inch AAC Block interior partitions',
      specification: 'Laid in 1:4 cement sand mortar with fiberglass mesh at lintel junctions.',
      codeReference: 'IS 2212 Brick Masonry',
      iconName: 'Square'
    },
    {
      category: 'MEP & Safety',
      title: 'Water Tank, Septic & Fire Safety',
      recommendation: 'Overhead 1000L PVC tank over stairwell; RCC Septic Tank at North-West corner.',
      specification: 'Concealed FRLSH copper wiring, earthing pit, CPVC water pipes & dual chamber septic tank.',
      codeReference: 'National Building Code (NBC 2016)',
      iconName: 'Shield'
    }
  ];

  // 7. Material Estimates
  const cementBags = Math.round(builtUpSqFt * 0.44);
  const steelKg = Math.round(builtUpSqFt * 3.75);
  const bricksCount = Math.round(builtUpSqFt * 11.2);
  const sandCuFt = Math.round(builtUpSqFt * 1.55);
  const aggregateCuFt = Math.round(builtUpSqFt * 1.30);
  const tilesSqFt = Math.round(builtUpSqFt * 0.92);
  const paintLiters = Math.round(builtUpSqFt * 0.11);
  const doorsCount = Math.max(3, input.numberOfBedrooms + input.numberOfBathrooms + 2);
  const windowsCount = Math.max(4, input.numberOfBedrooms * 2 + 2);

  const cementMat = materials.find(m => m.id.includes('cement')) || materials[0];
  const steelMat = materials.find(m => m.id.includes('steel')) || materials[1];
  const tileMat = materials.find(m => m.id.includes('tile')) || materials[3];
  const paintMat = materials.find(m => m.id.includes('paint')) || materials[4];

  const cementPrice = Math.round((cementMat.price || 375) * costMult);
  const steelPrice = Math.round((steelMat.price || 64) * costMult);
  const tilePrice = Math.round((tileMat.price || 65) * costMult);
  const paintPrice = Math.round((paintMat.price || 280) * costMult);

  const materialEstimates: MaterialQuantityItem[] = [
    { category: 'Structural', materialName: cementMat.name, quantity: cementBags, unit: 'Bags (50kg)', unitPriceINR: cementPrice, totalCostINR: cementBags * cementPrice, qualityGrade: input.qualityLevel, recommendedBrand: cementMat.brand },
    { category: 'Structural', materialName: steelMat.name, quantity: steelKg, unit: 'Kg', unitPriceINR: steelPrice, totalCostINR: steelKg * steelPrice, qualityGrade: input.qualityLevel, recommendedBrand: steelMat.brand },
    { category: 'Masonry', materialName: 'First Class Red Bricks / AAC Blocks', quantity: bricksCount, unit: 'Pieces', unitPriceINR: Math.round(11 * costMult), totalCostINR: Math.round(bricksCount * 11 * costMult), qualityGrade: input.qualityLevel, recommendedBrand: 'Kiln / Magicrete' },
    { category: 'Aggregates', materialName: 'Washed River / M-Sand', quantity: sandCuFt, unit: 'Cu.Ft', unitPriceINR: Math.round(52 * costMult), totalCostINR: Math.round(sandCuFt * 52 * costMult), qualityGrade: input.qualityLevel, recommendedBrand: 'Local Approved Quarry' },
    { category: 'Aggregates', materialName: 'Granite Stone Chips (20mm)', quantity: aggregateCuFt, unit: 'Cu.Ft', unitPriceINR: Math.round(58 * costMult), totalCostINR: Math.round(aggregateCuFt * 58 * costMult), qualityGrade: input.qualityLevel, recommendedBrand: 'Granite Crushed' },
    { category: 'Finishes', materialName: tileMat.name, quantity: tilesSqFt, unit: 'Sq.Ft', unitPriceINR: tilePrice, totalCostINR: tilesSqFt * tilePrice, qualityGrade: input.qualityLevel, recommendedBrand: tileMat.brand },
    { category: 'Finishes', materialName: paintMat.name, quantity: paintLiters, unit: 'Liters', unitPriceINR: paintPrice, totalCostINR: paintLiters * paintPrice, qualityGrade: input.qualityLevel, recommendedBrand: paintMat.brand },
    { category: 'Doors & Windows', materialName: 'Factory uPVC Windows & Flush Doors', quantity: doorsCount + windowsCount, unit: 'Units', unitPriceINR: Math.round(4200 * qualMult * costMult), totalCostINR: Math.round((doorsCount + windowsCount) * 4200 * qualMult * costMult), qualityGrade: input.qualityLevel, recommendedBrand: 'Prominance / Fenesta' }
  ];

  const totalMatCost = materialEstimates.reduce((acc, item) => acc + item.totalCostINR, 0);
  const totalLaborCost = Math.round(builtUpSqFt * 340 * laborMult * (qualMult * 0.9));
  const interiorCost = Math.round(builtUpSqFt * 150 * qualMult);
  const exteriorCost = Math.round(builtUpSqFt * 90 * qualMult);
  const miscCost = Math.round((totalMatCost + totalLaborCost) * 0.06);

  const calculatedTotalBudget = totalMatCost + totalLaborCost + interiorCost + exteriorCost + miscCost;
  const costPerSqFt = Math.round(calculatedTotalBudget / builtUpSqFt);

  // 8. Timeline
  const totalWeeks = input.numberOfFloors === 'G+3' ? 36 : input.numberOfFloors === 'G+2' ? 28 : input.numberOfFloors === 'G+1' ? 20 : 14;
  const timelineMilestones: ProjectTimelineMilestone[] = [
    { phase: 'Site Prep & Foundation', weekRange: 'Weeks 1 - 3', title: 'Excavation & Footing Casting', description: 'Plot boundary marking, earth excavation, PCC leveling & footing rebar cage placement.', keyTasks: ['Plot Marking', 'Excavation', 'PCC Laying', 'Footing Casting'], completionPercentage: 15 },
    { phase: 'Superstructure Framing', weekRange: 'Weeks 4 - 8', title: 'Columns, Beams & Roof Slab', description: 'Formwork shuttering, column rebar binding, beam placement & RCC roof slab concrete pouring.', keyTasks: ['Column Casting', 'Beam Formwork', 'Slab Rebar Mesh', 'Concrete Curing'], completionPercentage: 45 },
    { phase: 'Masonry & Concealed MEP', weekRange: 'Weeks 9 - 13', title: 'Brickwork & Conduit Piping', description: 'Perimeter brick walls, AAC partition walls, concealed electrical DB box piping & CPVC plumbing lines.', keyTasks: ['Brick Masonry', 'Concealed Piping', 'Door Window Chases', 'Lintel Casting'], completionPercentage: 65 },
    { phase: 'Plaster & Finishing', weekRange: 'Weeks 14 - 18', title: 'Wall Plaster, Tile Laying & Putty', description: '2-Coat wall plaster, bathroom waterproofing membrane, vitrified flooring tile laying & 2-coat wall putty base.', keyTasks: ['Wall Plaster', 'Waterproofing', 'Tile Grouting', 'Putty Sanding'], completionPercentage: 85 },
    { phase: 'Painting & Handover', weekRange: 'Weeks 19 - ' + totalWeeks, title: 'Paint Coat, Switches & Fixtures', description: 'Royale luxury emulsion painting, modular electrical switch installation, sanitary ware & deep site cleaning.', keyTasks: ['Final Painting', 'Modular Switches', 'Sanitaryware', 'Final Handover'], completionPercentage: 100 }
  ];

  return {
    id: `plan-report-${Date.now()}`,
    createdAt: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    input,
    totalPlotSqFt: plotArea,
    builtUpSqFt,
    spaceDistribution: {
      carpetAreaSqFt,
      wallAreaSqFt,
      circulationSqFt,
      balconyTerraceSqFt
    },
    roomPositionsVastu,
    naturalLightingSuggestions,
    crossVentilationSuggestions,
    privacySuggestions,
    futureExpansionSuggestions,
    floorPlans,
    design3DConcepts,
    structuralAdviceList,
    materialEstimates,
    costSummary: {
      materialCostINR: totalMatCost,
      laborCostINR: totalLaborCost,
      interiorCostINR: interiorCost,
      exteriorCostINR: exteriorCost,
      miscellaneousCostINR: miscCost,
      totalBudgetINR: calculatedTotalBudget,
      costPerSqFtINR: costPerSqFt,
      savingsSuggestions: [
        'Use Manufactured Sand (M-Sand) for brick masonry plaster to save up to 20% aggregate cost.',
        'Order cement and rebar directly from factory authorized distributors in bulk batches.',
        'Standardize window frame sizes (4ft x 4ft) to utilize pre-fabricated uPVC window units.'
      ],
      qualityComparison: {
        budgetLevel: Math.round(calculatedTotalBudget * 0.8),
        standardLevel: calculatedTotalBudget,
        premiumLevel: Math.round(calculatedTotalBudget * 1.35),
        luxuryLevel: Math.round(calculatedTotalBudget * 1.8)
      }
    },
    timelineMilestones,
    totalWeeks,
    totalMonths: Number((totalWeeks / 4.3).toFixed(1))
  };
}

// 2D Floor Plan Generator logic
function generateFloorPlans(input: AIHousePlannerInput, totalBuiltUp: number): FloorPlanData[] {
  const numFloors = input.numberOfFloors === 'G+3' ? 4 : input.numberOfFloors === 'G+2' ? 3 : input.numberOfFloors === 'G+1' ? 2 : 1;
  const resultPlans: FloorPlanData[] = [];

  for (let f = 0; f < numFloors; f++) {
    const isGround = f === 0;
    const floorTitle = isGround ? 'Ground Floor Plan' : f === 1 ? 'First Floor Plan' : f === 2 ? 'Second Floor Plan' : 'Third Floor Plan';
    
    const rooms: RoomLayout2D[] = [];

    // Layout math for 2D floor plan rendering
    if (isGround) {
      rooms.push({
        id: 'r-parking',
        name: 'Car Parking & Entry Porch',
        type: 'parking',
        x: 5, y: 5, width: 35, height: 25,
        dimensionsFt: '10\'0" × 14\'0"',
        colorHex: '#334155',
        doors: [{ wall: 'bottom', posPercent: 50 }],
        windows: [],
        furnitureItems: [{ name: 'SUV Car', xPercent: 50, yPercent: 50, icon: 'Car' }]
      });

      rooms.push({
        id: 'r-living',
        name: 'Living & Guest Lounge',
        type: 'living',
        x: 42, y: 5, width: 53, height: 40,
        dimensionsFt: '16\'0" × 18\'0"',
        colorHex: '#1e293b',
        doors: [{ wall: 'left', posPercent: 30 }],
        windows: [{ wall: 'top', posPercent: 50 }],
        furnitureItems: [
          { name: 'Sectional Sofa', xPercent: 30, yPercent: 40, icon: 'Sofa' },
          { name: 'TV Wall Unit', xPercent: 80, yPercent: 40, icon: 'Tv' }
        ]
      });

      rooms.push({
        id: 'r-kitchen',
        name: 'Modular Kitchen (Agni Zone)',
        type: 'kitchen',
        x: 5, y: 32, width: 35, height: 30,
        dimensionsFt: '10\'0" × 12\'0"',
        colorHex: '#854d0e',
        doors: [{ wall: 'right', posPercent: 50 }],
        windows: [{ wall: 'left', posPercent: 50 }],
        furnitureItems: [{ name: 'L-Counter & Hob', xPercent: 40, yPercent: 40, icon: 'Cooking' }]
      });

      rooms.push({
        id: 'r-dining',
        name: 'Dining Area',
        type: 'dining',
        x: 42, y: 47, width: 35, height: 25,
        dimensionsFt: '12\'0" × 12\'0"',
        colorHex: '#3f6212',
        doors: [],
        windows: [{ wall: 'right', posPercent: 50 }],
        furnitureItems: [{ name: '6-Seater Table', xPercent: 50, yPercent: 50, icon: 'Table' }]
      });

      rooms.push({
        id: 'r-bed-g',
        name: 'Guest Bedroom',
        type: 'bedroom',
        x: 5, y: 64, width: 45, height: 31,
        dimensionsFt: '12\'0" × 13\'0"',
        colorHex: '#1e3a8a',
        doors: [{ wall: 'right', posPercent: 30 }],
        windows: [{ wall: 'bottom', posPercent: 50 }],
        furnitureItems: [{ name: 'Queen Bed', xPercent: 50, yPercent: 50, icon: 'Bed' }]
      });

      rooms.push({
        id: 'r-bath-g',
        name: 'Common Bathroom',
        type: 'bathroom',
        x: 52, y: 74, width: 25, height: 21,
        dimensionsFt: '6\'0" × 8\'0"',
        colorHex: '#065f46',
        doors: [{ wall: 'top', posPercent: 50 }],
        windows: [{ wall: 'right', posPercent: 50 }],
        furnitureItems: [{ name: 'Shower & Closet', xPercent: 50, yPercent: 50, icon: 'Bath' }]
      });

      rooms.push({
        id: 'r-stair',
        name: 'Dog-Legged Staircase',
        type: 'stair',
        x: 79, y: 47, width: 16, height: 48,
        dimensionsFt: '7\'0" × 15\'0"',
        colorHex: '#701a75',
        doors: [],
        windows: [],
        furnitureItems: [{ name: 'Riser Steps', xPercent: 50, yPercent: 50, icon: 'Stairs' }]
      });
    } else {
      // First/Upper Floor Plan
      rooms.push({
        id: `r-master-${f}`,
        name: 'Master Suite Bedroom',
        type: 'bedroom',
        x: 5, y: 5, width: 50, height: 42,
        dimensionsFt: '14\'0" × 16\'0"',
        colorHex: '#1e3a8a',
        doors: [{ wall: 'bottom', posPercent: 40 }],
        windows: [{ wall: 'top', posPercent: 50 }, { wall: 'left', posPercent: 50 }],
        furnitureItems: [{ name: 'King Bed & Wardrobe', xPercent: 50, yPercent: 50, icon: 'Bed' }]
      });

      rooms.push({
        id: `r-bath-attached-${f}`,
        name: 'Ensuite Bath & Walk-in Closet',
        type: 'bathroom',
        x: 57, y: 5, width: 38, height: 22,
        dimensionsFt: '8\'0" × 9\'0"',
        colorHex: '#065f46',
        doors: [{ wall: 'left', posPercent: 50 }],
        windows: [{ wall: 'right', posPercent: 50 }],
        furnitureItems: [{ name: 'Glass Shower Cubicle', xPercent: 50, yPercent: 50, icon: 'Bath' }]
      });

      rooms.push({
        id: `r-balcony-${f}`,
        name: 'Private Master Balcony',
        type: 'balcony',
        x: 5, y: 49, width: 50, height: 18,
        dimensionsFt: '14\'0" × 5\'0"',
        colorHex: '#047857',
        doors: [{ wall: 'top', posPercent: 50 }],
        windows: [],
        furnitureItems: [{ name: 'Outdoor Chairs', xPercent: 50, yPercent: 50, icon: 'Chair' }]
      });

      rooms.push({
        id: `r-bed2-${f}`,
        name: 'Kids / Guest Bedroom',
        type: 'bedroom',
        x: 5, y: 69, width: 45, height: 26,
        dimensionsFt: '12\'0" × 12\'0"',
        colorHex: '#1d4ed8',
        doors: [{ wall: 'right', posPercent: 50 }],
        windows: [{ wall: 'bottom', posPercent: 50 }],
        furnitureItems: [{ name: 'Double Bed', xPercent: 50, yPercent: 50, icon: 'Bed' }]
      });

      rooms.push({
        id: `r-lounge-${f}`,
        name: 'Family Lounge',
        type: 'living',
        x: 57, y: 29, width: 38, height: 38,
        dimensionsFt: '12\'0" × 14\'0"',
        colorHex: '#1e293b',
        doors: [{ wall: 'left', posPercent: 50 }],
        windows: [{ wall: 'right', posPercent: 50 }],
        furnitureItems: [{ name: 'Media Sofa', xPercent: 50, yPercent: 50, icon: 'Sofa' }]
      });

      rooms.push({
        id: `r-stair-${f}`,
        name: 'Stairwell Tower',
        type: 'stair',
        x: 52, y: 69, width: 43, height: 26,
        dimensionsFt: '8\'0" × 14\'0"',
        colorHex: '#701a75',
        doors: [],
        windows: [],
        furnitureItems: [{ name: 'Stair Flight', xPercent: 50, yPercent: 50, icon: 'Stairs' }]
      });
    }

    resultPlans.push({
      floorName: floorTitle,
      builtUpSqFt: Math.round(totalBuiltUp / numFloors),
      rooms
    });
  }

  // Add Roof Plan
  resultPlans.push({
    floorName: 'Terrace & Roof Plan',
    builtUpSqFt: Math.round(totalBuiltUp / numFloors),
    rooms: [
      {
        id: 'roof-main',
        name: 'Open Solar Terrace with Brickbat Coba',
        type: 'corridor',
        x: 5, y: 5, width: 70, height: 90,
        dimensionsFt: 'Terrace Open Deck',
        colorHex: '#0f172a',
        doors: [],
        windows: [],
        furnitureItems: [{ name: 'Solar PV Panels', xPercent: 30, yPercent: 30, icon: 'Sun' }]
      },
      {
        id: 'roof-headroom',
        name: 'Staircase Headroom & 1000L Water Tank',
        type: 'stair',
        x: 77, y: 5, width: 18, height: 40,
        dimensionsFt: 'Headroom Cover',
        colorHex: '#581c87',
        doors: [{ wall: 'left', posPercent: 50 }],
        windows: [],
        furnitureItems: [{ name: 'PVC Tank', xPercent: 50, yPercent: 50, icon: 'Droplet' }]
      }
    ]
  });

  return resultPlans;
}

// 3D Style Concept Generator logic
function generate3DStyleConcepts(): Design3DStyleConcept[] {
  return [
    {
      id: '3d-ext-modern',
      styleName: 'Modern',
      category: 'Exterior',
      title: 'Modern Cantilevered Villa Elevation',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      description: 'Striking modern facade featuring cantilevered concrete floor plates, vertical teak wood louvers, and warm recessed LED strip lights.',
      keyMaterials: ['White Acrylic Texture Paint', 'Teak Wood Composite Louvers', 'Grey Granite Wall Cladding', 'Toughened Glass Balustrades'],
      colorPalette: [{ name: 'Arctic White', hex: '#f8fafc' }, { name: 'Slate Charcoal', hex: '#334155' }, { name: 'Warm Oak', hex: '#d97706' }],
      lightingAdvice: 'Use 3000K warm up-down architectural sconces and concealed step lights.'
    },
    {
      id: '3d-ext-luxury',
      styleName: 'Luxury',
      category: 'Exterior',
      title: 'Grand Contemporary Villa Facade',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      description: 'Double-height glass entrance facade flanked by Italian travertine stone pillars and ambient architectural landscape lighting.',
      keyMaterials: ['Travertine Stone Slabs', 'Slimline Aluminium Glass Curtain Walls', 'Teak Wood Main Portal Door'],
      colorPalette: [{ name: 'Beige Travertine', hex: '#f5f5dc' }, { name: 'Bronze Anodized', hex: '#4a3b32' }],
      lightingAdvice: 'Highlight vertical stone columns with narrow-beam ground ingress uplighters.'
    },
    {
      id: '3d-int-living',
      styleName: 'Modern',
      category: 'Interior Living',
      title: 'Warm Minimalist Living Room Concept',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      description: 'Open-plan living room with 800x800mm vitrified marble tiles, fluted acoustic wooden panelling, and soft cove lighting.',
      keyMaterials: ['Kajaria GVT Marble Tiles', 'Gypsum False Ceiling', 'Oak Wood Fluted Panels'],
      colorPalette: [{ name: 'Warm Cream', hex: '#fdfbf7' }, { name: 'Sage Green Accent', hex: '#8a9a86' }],
      lightingAdvice: '3000K indirect perimeter LED coves supplemented by anti-glare COB ceiling spot lights.'
    },
    {
      id: '3d-int-bedroom',
      styleName: 'Contemporary',
      category: 'Interior Bedroom',
      title: 'Serene Master Bedroom Suite',
      imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
      description: 'Luxurious master bedroom with upholstered headboard wall, direct balcony terrace access, and ambient bedside pendant lamps.',
      keyMaterials: ['Engineered Oak Wood Flooring', 'Royale Washable Velvet Paint', 'Fabric Upholstered Wall Panels'],
      colorPalette: [{ name: 'Morning Mist Blue', hex: '#d0e1d4' }, { name: 'Soft Linen', hex: '#f1f1f1' }],
      lightingAdvice: 'Bedside hanging pendants with dimmable warm 2700K bulbs for circadian relaxation.'
    },
    {
      id: '3d-int-kitchen',
      styleName: 'Minimal',
      category: 'Interior Kitchen',
      title: 'Ergonomic Island Modular Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      description: 'Handleless acrylic kitchen cabinets paired with quartz countertop, under-cabinet LED Task lighting, and Blum soft-close fittings.',
      keyMaterials: ['Quartz Stone Countertop', 'High Gloss Acrylic Shutters', 'BLUM Soft-Close Hardware'],
      colorPalette: [{ name: 'Matte Charcoal', hex: '#262626' }, { name: 'Calacatta White Quartz', hex: '#f8f8f8' }],
      lightingAdvice: 'Continuous 4000K neutral white LED strip mounted inside aluminium channel under top cabinets.'
    }
  ];
}
