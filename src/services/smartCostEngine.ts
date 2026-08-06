import { 
  getCities, 
  getMaterials, 
  getLaborRates, 
  getFoundationTypes, 
  getRoofTypes, 
  getSlabTypes, 
  getWallTypes 
} from './constructionDb';
import { 
  initialCities, 
  initialMaterials, 
  initialLaborRates, 
  initialFoundationTypes, 
  initialRoofTypes 
} from './constructionDbSeedData';

export interface SmartCostEngineInput {
  plotWidthFt: number;
  plotLengthFt: number;
  builtUpAreaSqFt?: number;
  cityName: string;
  floors: 'Ground Floor' | 'G+1' | 'G+2' | 'G+3';
  targetBudgetINR?: number;
  constructionType: 'Residential Villa' | 'Duplex Home' | 'Apartment' | 'Commercial Office';
  qualityLevel: 'Economy' | 'Standard' | 'Premium' | 'Luxury';
}

export interface SmartCostBreakdownItem {
  category: string;
  amountINR: number;
  percentage: number;
  description: string;
}

export interface MaterialRequirementEstimate {
  materialId: string;
  name: string;
  unit: string;
  quantity: number;
  ratePerUnitINR: number;
  totalCostINR: number;
  qualityGrade: string;
  brand: string;
  purpose: string;
}

export interface SmartCostEngineResult {
  builtUpAreaSqFt: number;
  costPerSqFtINR: number;
  
  // Breakdown Categories
  materialCostINR: number;
  laborCostINR: number;
  foundationCostINR: number;
  roofCostINR: number;
  electricalCostINR: number;
  plumbingCostINR: number;
  interiorCostINR: number;
  exteriorCostINR: number;
  paintingCostINR: number;
  tileCostINR: number;
  doorCostINR: number;
  windowCostINR: number;

  subtotalCostINR: number;
  contingencyINR: number;
  totalCostINR: number;

  estimatedCompletionDays: number;
  estimatedCompletionMonths: number;

  categoryBreakdown: SmartCostBreakdownItem[];
  materialRequirements: MaterialRequirementEstimate[];
  structuralSpecs: {
    foundation: string;
    roof: string;
    wall: string;
    column: string;
  };
}

export async function calculateSmartConstructionCost(input: SmartCostEngineInput): Promise<SmartCostEngineResult> {
  // Load dynamic data from Firestore collections
  const cities = await getCities(initialCities);
  const materials = await getMaterials(initialMaterials);
  const laborRates = await getLaborRates(initialLaborRates);

  // 1. Calculate Built-Up Area
  const totalPlotAreaSqFt = input.plotWidthFt * input.plotLengthFt;
  const floorMultiplierMap: Record<string, number> = {
    'Ground Floor': 0.90,
    'G+1': 1.75,
    'G+2': 2.55,
    'G+3': 3.35
  };
  const floorMultiplier = floorMultiplierMap[input.floors] || 0.90;
  const builtUpAreaSqFt = input.builtUpAreaSqFt || Math.round(totalPlotAreaSqFt * floorMultiplier);

  // 2. Determine Location & Quality Multipliers
  const selectedCity = cities.find(c => c.name.toLowerCase() === input.cityName.toLowerCase()) || cities[0];
  const cityCostMultiplier = selectedCity.costMultiplier || 1.0;
  const cityLaborMultiplier = selectedCity.laborRateMultiplier || 1.0;

  const qualityMultiplierMap: Record<string, number> = {
    'Economy': 0.85,
    'Standard': 1.0,
    'Premium': 1.35,
    'Luxury': 1.85
  };
  const qualityMultiplier = qualityMultiplierMap[input.qualityLevel] || 1.0;

  // 3. Base Rates per Sq.Ft dynamically computed from materials & labor
  const cementMat = materials.find(m => m.id.includes('cement')) || materials[0];
  const steelMat = materials.find(m => m.id.includes('steel')) || materials[1];
  const tileMat = materials.find(m => m.id.includes('tile')) || materials[3];
  const paintMat = materials.find(m => m.id.includes('paint')) || materials[4];

  // Base raw rates
  const cementRate = (cementMat.price || 375) * cityCostMultiplier;
  const steelRate = (steelMat.price || 64) * cityCostMultiplier;
  const tileRate = (tileMat.price || 65) * cityCostMultiplier;
  const paintRate = (paintMat.price || 280) * cityCostMultiplier;

  // Average labor daily rate from DB
  const avgMasonRate = (laborRates.find(l => l.role === 'Mason')?.dailyRate || 850) * cityLaborMultiplier;
  const avgCarpenterRate = (laborRates.find(l => l.role === 'Carpenter')?.dailyRate || 900) * cityLaborMultiplier;

  // Base construction cost calculation
  const baseCostPerSqFt = 1850 * cityCostMultiplier * qualityMultiplier;

  // 4. Quantities per sq ft of built-up area
  const cementBags = Math.round(builtUpAreaSqFt * 0.45);
  const steelKg = Math.round(builtUpAreaSqFt * 3.8);
  const sandCuFt = Math.round(builtUpAreaSqFt * 1.6);
  const aggregateCuFt = Math.round(builtUpAreaSqFt * 1.35);
  const bricksCount = Math.round(builtUpAreaSqFt * 11.5);
  const tileSqFt = Math.round(builtUpAreaSqFt * 0.95);
  const paintLiters = Math.round(builtUpAreaSqFt * 0.11);
  const wireCoils = Math.max(2, Math.round(builtUpAreaSqFt / 300));
  const pipeFt = Math.round(builtUpAreaSqFt * 0.75);
  const doorsCount = Math.max(3, Math.round(builtUpAreaSqFt / 120));
  const windowsCount = Math.max(3, Math.round(builtUpAreaSqFt / 100));

  // 5. Itemized Material Costs
  const totalCementCost = Math.round(cementBags * cementRate);
  const totalSteelCost = Math.round(steelKg * steelRate);
  const totalSandCost = Math.round(sandCuFt * 52 * cityCostMultiplier);
  const totalAggregateCost = Math.round(aggregateCuFt * 58 * cityCostMultiplier);
  const totalBricksCost = Math.round(bricksCount * 11 * cityCostMultiplier);
  const totalTileCost = Math.round(tileSqFt * tileRate);
  const totalPaintCost = Math.round(paintLiters * paintRate);
  const totalElectricalMatCost = Math.round(wireCoils * 1650 * cityCostMultiplier);
  const totalPlumbingMatCost = Math.round(pipeFt * 48 * cityCostMultiplier);
  const totalDoorsWindowsCost = Math.round((doorsCount * 4500 + windowsCount * 3200) * cityCostMultiplier * qualityMultiplier);

  // Material Requirements List
  const materialRequirements: MaterialRequirementEstimate[] = [
    { materialId: cementMat.id, name: cementMat.name, unit: 'Bags (50kg)', quantity: cementBags, ratePerUnitINR: Math.round(cementRate), totalCostINR: totalCementCost, qualityGrade: input.qualityLevel, brand: cementMat.brand, purpose: 'Foundation, Columns, Beams, Mortar & Plastering' },
    { materialId: steelMat.id, name: steelMat.name, unit: 'Kg', quantity: steelKg, ratePerUnitINR: Math.round(steelRate), totalCostINR: totalSteelCost, qualityGrade: input.qualityLevel, brand: steelMat.brand, purpose: 'Primary Structural Framing & Slab Rebar Mesh' },
    { materialId: 'mat-sand', name: 'Washed River / M-Sand', unit: 'Cu.Ft', quantity: sandCuFt, ratePerUnitINR: Math.round(52 * cityCostMultiplier), totalCostINR: totalSandCost, qualityGrade: input.qualityLevel, brand: 'Local Sourced', purpose: 'Concrete Mix & Masonry Plaster Mortar' },
    { materialId: 'mat-aggregate', name: 'Crushed Granite Stone Chips (20mm)', unit: 'Cu.Ft', quantity: aggregateCuFt, ratePerUnitINR: Math.round(58 * cityCostMultiplier), totalCostINR: totalAggregateCost, qualityGrade: input.qualityLevel, brand: 'Quarry Granite', purpose: 'Coarse Matrix Mass in RCC Structures' },
    { materialId: 'mat-bricks', name: 'First-Class Bricks / AAC Blocks', unit: 'Pieces', quantity: bricksCount, ratePerUnitINR: Math.round(11 * cityCostMultiplier), totalCostINR: totalBricksCost, qualityGrade: input.qualityLevel, brand: 'Standard Kiln / Magicrete', purpose: 'Exterior Perimeter & Interior Partition Walls' },
    { materialId: tileMat.id, name: tileMat.name, unit: 'Sq.Ft', quantity: tileSqFt, ratePerUnitINR: Math.round(tileRate), totalCostINR: totalTileCost, qualityGrade: input.qualityLevel, brand: tileMat.brand, purpose: 'Living, Bedroom, and Bathroom Surface Flooring' },
    { materialId: paintMat.id, name: paintMat.name, unit: 'Liters', quantity: paintLiters, ratePerUnitINR: Math.round(paintRate), totalCostINR: totalPaintCost, qualityGrade: input.qualityLevel, brand: paintMat.brand, purpose: 'Interior Washable Emulsion & Exterior Weather Shield' }
  ];

  const materialCostINR = Math.round(totalCementCost + totalSteelCost + totalSandCost + totalAggregateCost + totalBricksCost + totalTileCost + totalPaintCost + totalElectricalMatCost + totalPlumbingMatCost + totalDoorsWindowsCost);

  // 6. Component-Wise Cost Distribution
  const laborCostINR = Math.round(builtUpAreaSqFt * 340 * cityLaborMultiplier * (qualityMultiplier * 0.9));
  const foundationCostINR = Math.round(builtUpAreaSqFt * 210 * cityCostMultiplier);
  const roofCostINR = Math.round(builtUpAreaSqFt * 165 * cityCostMultiplier);
  const electricalCostINR = Math.round(builtUpAreaSqFt * 85 * cityCostMultiplier * qualityMultiplier);
  const plumbingCostINR = Math.round(builtUpAreaSqFt * 75 * cityCostMultiplier * qualityMultiplier);
  const interiorCostINR = Math.round(builtUpAreaSqFt * 140 * qualityMultiplier);
  const exteriorCostINR = Math.round(builtUpAreaSqFt * 95 * qualityMultiplier);
  const paintingCostINR = totalPaintCost + Math.round(builtUpAreaSqFt * 18 * cityLaborMultiplier);
  const tileCostINR = totalTileCost + Math.round(builtUpAreaSqFt * 22 * cityLaborMultiplier);
  const doorCostINR = Math.round(doorsCount * 4800 * cityCostMultiplier * qualityMultiplier);
  const windowCostINR = Math.round(windowsCount * 3600 * cityCostMultiplier * qualityMultiplier);

  const subtotalCostINR = Math.round(materialCostINR + laborCostINR);
  const contingencyINR = Math.round(subtotalCostINR * 0.05); // 5% Contingency
  const totalCostINR = subtotalCostINR + contingencyINR;
  const costPerSqFtINR = Math.round(totalCostINR / builtUpAreaSqFt);

  // Completion Time Estimate
  const floorCountDaysMap: Record<string, number> = {
    'Ground Floor': 90,
    'G+1': 150,
    'G+2': 210,
    'G+3': 270
  };
  const estimatedCompletionDays = floorCountDaysMap[input.floors] || 120;
  const estimatedCompletionMonths = Number((estimatedCompletionDays / 30).toFixed(1));

  // Category Breakdown Array for UI Visualizers/Charts
  const categoryBreakdown: SmartCostBreakdownItem[] = [
    { category: 'Structural Materials (Cement, Steel, Sand, Bricks)', amountINR: materialCostINR, percentage: Math.round((materialCostINR / totalCostINR) * 100), description: 'Core concrete, rebar steel, masonry walls & aggregates' },
    { category: 'Labor & Contracting Wages', amountINR: laborCostINR, percentage: Math.round((laborCostINR / totalCostINR) * 100), description: 'Masonry, shuttering, steel binding, plastering & site supervision' },
    { category: 'Foundation & Substructure', amountINR: foundationCostINR, percentage: Math.round((foundationCostINR / totalCostINR) * 100), description: 'Earth excavation, footing PCC, rebar cages & plinth tie beam' },
    { category: 'Roof Slab & Curing', amountINR: roofCostINR, percentage: Math.round((roofCostINR / totalCostINR) * 100), description: 'Centering props, RCC slab casting, water curing & waterproofing' },
    { category: 'Electrical & MEP Automation', amountINR: electricalCostINR, percentage: Math.round((electricalCostINR / totalCostINR) * 100), description: 'Concealed PVC conduits, FRLSH copper wire, DB box & modular switches' },
    { category: 'Plumbing & Drainage Network', amountINR: plumbingCostINR, percentage: Math.round((plumbingCostINR / totalCostINR) * 100), description: 'CPVC water lines, SWR drainage fittings & overhead tank' },
    { category: 'Finishes (Tiles, Paint, Doors & Windows)', amountINR: paintingCostINR + tileCostINR + doorCostINR + windowCostINR, percentage: Math.round(((paintingCostINR + tileCostINR + doorCostINR + windowCostINR) / totalCostINR) * 100), description: 'Vitrified tile laying, acrylic emulsion paint, doors & uPVC windows' },
    { category: 'Contingency Reserve (5%)', amountINR: contingencyINR, percentage: 5, description: 'Safety buffer for market fluctuation or design modifications' }
  ];

  return {
    builtUpAreaSqFt,
    costPerSqFtINR,
    materialCostINR,
    laborCostINR,
    foundationCostINR,
    roofCostINR,
    electricalCostINR,
    plumbingCostINR,
    interiorCostINR,
    exteriorCostINR,
    paintingCostINR,
    tileCostINR,
    doorCostINR,
    windowCostINR,
    subtotalCostINR,
    contingencyINR,
    totalCostINR,
    estimatedCompletionDays,
    estimatedCompletionMonths,
    categoryBreakdown,
    materialRequirements,
    structuralSpecs: {
      foundation: input.qualityLevel === 'Luxury' || input.floors === 'G+3' ? 'Raft Mat Foundation with Membrane Tanking' : 'Isolated Trapezoidal Footing with Plinth Tie Beam',
      roof: '5-Inch M20 RCC Slab with PU Waterproof Membrane',
      wall: input.qualityLevel === 'Luxury' || input.qualityLevel === 'Premium' ? '6-Inch AAC Blocks with Polymer Jointing' : '9-Inch External Red Clay Bricks',
      column: input.floors === 'G+2' || input.floors === 'G+3' ? '9" × 15" Column with 8 Nos 16mm/20mm Rebar' : '9" × 12" Column with 6 Nos 16mm Rebar'
    }
  };
}
