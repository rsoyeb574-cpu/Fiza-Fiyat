export interface MaterialEstimateItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  ratePerUnitINR: number;
  totalCostINR: number;
  purpose: string; // Explains WHY this material is used
  whyUsed: string;
  advantages: string[];
  disadvantages: string[];
  lifeExpectancyYears: string;
  maintenanceNote: string;
  costSavingTip: string;
  premiumOption: string;
  budgetOption: string;
  iconName?: string;
}

export interface TimelinePhaseItem {
  id: string;
  phaseName: string;
  estimatedDays: number;
  dependencyPhase?: string;
  description: string;
  whyThisOrder: string;
  qualityChecklist: string[];
  budgetTips: string;
}

export interface CostBreakdownCategory {
  category: string;
  amountINR: number;
  percentage: number;
  description: string;
  keyIncludes: string[];
}

export interface StructuralRecommendations {
  foundation: {
    type: string;
    description: string;
    whyRecommended: string;
    pros: string[];
    cons: string[];
    depthFt: number;
    rebarSpec: string;
  };
  columnSize: {
    spec: string;
    whyRecommended: string;
    rebarDetails: string;
    spacingFt: number;
  };
  beam: {
    spec: string;
    whyRecommended: string;
    plinthBeamSpec: string;
    roofBeamSpec: string;
  };
  roof: {
    type: string;
    thicknessInches: number;
    concreteGrade: string;
    whyRecommended: string;
    waterproofingMethod: string;
  };
  brick: {
    type: string;
    whyRecommended: string;
    outerWallThicknessInches: number;
    innerWallThicknessInches: number;
    thermalPerformance: string;
  };
  wallThickness: {
    outerSpec: string;
    innerSpec: string;
    whyRecommended: string;
  };
  windowPlacement: {
    recommendation: string;
    whyRecommended: string;
    glazingAreaPercent: string;
    orientationAdvice: string;
  };
  ventilation: {
    strategy: string;
    whyRecommended: string;
    airChangePerHour: string;
    shaftPositioning: string;
  };
  naturalLighting: {
    strategy: string;
    whyRecommended: string;
    sunPathAdvice: string;
  };
  waterTankPosition: {
    location: string;
    capacityLiters: number;
    whyRecommended: string;
  };
  septicTankPosition: {
    location: string;
    type: string;
    capacityLiters: number;
    whyRecommended: string;
    distanceFromFoundationFt: number;
  };
  rainwaterDrainage: {
    slope: string;
    pipeSizeInches: number;
    whyRecommended: string;
    rechargePitAdvice: string;
  };
  electricalLayout: {
    dbPosition: string;
    circuits: string;
    conduitType: string;
    whyRecommended: string;
  };
  plumbingLayout: {
    pipeType: string;
    shaftAlignment: string;
    dualLineAdvice: string;
    whyRecommended: string;
  };
  furnitureLayout: {
    principles: string;
    clearanceFt: number;
    whyRecommended: string;
  };
  colorTheme: {
    paletteName: string;
    colors: string[];
    psychology: string;
    whyRecommended: string;
  };
  tileSuggestions: {
    livingRoom: string;
    bathroom: string;
    kitchen: string;
    whyRecommended: string;
  };
  ceilingSuggestions: {
    type: string;
    heightFt: number;
    whyRecommended: string;
  };
  lightingSuggestions: {
    temperatureK: string;
    fixtures: string[];
    whyRecommended: string;
  };
}

export interface ConstructionPlotPlan {
  id: string;
  title: string;
  plotWidthFt: number;
  plotLengthFt: number;
  totalAreaSqFt: number;
  builtUpAreaSqFt: number;
  location: string;
  floors: 'Ground Floor' | 'G+1' | 'G+2' | 'G+3';
  budgetINR: number;
  costPerSqFtINR: number;
  floorPlan2DSvgUrl?: string;
  floorPlan2DData?: {
    rooms: { name: string; x: number; y: number; w: number; h: number; color: string; doors?: string[]; windows?: string[] }[];
    dimensions: { x1: number; y1: number; x2: number; y2: number; label: string }[];
  };
  exterior3DImageUrl: string;
  exterior3DAltViews?: string[];
  interiorImages: {
    room: string;
    imageUrl: string;
    description: string;
  }[];
  materials: MaterialEstimateItem[];
  timeline: TimelinePhaseItem[];
  costBreakdown: CostBreakdownCategory[];
  recommendations: StructuralRecommendations;
}

export interface ConstructionGuideItem {
  id: string;
  slug: string;
  title: string;
  category: 'structural' | 'mep' | 'finishing' | 'planning' | 'boq';
  summary: string;
  coverImage: string;
  diagramImage: string;
  whyUsed: string;
  whyRecommended: string;
  advantages: string[];
  disadvantages: string[];
  lifeExpectancy: string;
  maintenance: string;
  costSavingTips: string[];
  premiumOption: {
    name: string;
    costRange: string;
    advantages: string;
  };
  budgetOption: {
    name: string;
    costRange: string;
    advantages: string;
  };
  interactiveCalculatorConfig?: {
    multiplierPerSqFt: number;
    unit: string;
    unitCostINR: number;
  };
  keyTakeaways?: string[];
}

export interface RegionalRate {
  id: string;
  regionName: string; // e.g. "Kolkata", "Mumbai", "Delhi", "Bangalore"
  currencySymbol: string;
  baseConstructionCostPerSqFtINR: number;
  materials: {
    cementBagINR: number;
    steelKgINR: number;
    sandCuFtINR: number;
    aggregateCuFtINR: number;
    brickPieceINR: number;
    aacBlockPieceINR: number;
    tileSqFtINR: number;
    paintLiterINR: number;
    wireCoilINR: number;
    pipeFtINR: number;
  };
  laborRatePerSqFtINR: number;
}
