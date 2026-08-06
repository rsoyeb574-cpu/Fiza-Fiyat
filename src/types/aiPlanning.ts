// AI Construction Planning System Types

export type RoadDirection = 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
export type QualityLevel = 'Budget' | 'Standard' | 'Premium' | 'Luxury';
export type KitchenType = 'Open American' | 'Closed L-Shaped' | 'Parallel Galley' | 'U-Shaped Island';
export type StairType = 'Internal Dog-Legged' | 'External Cantilever' | 'Helical Spiral' | 'Straight Flight';

export interface AIHousePlannerInput {
  plotWidthFt: number;
  plotLengthFt: number;
  roadDirection: RoadDirection;
  northDirection: RoadDirection;
  locationCity: string;
  targetBudgetINR: number;
  numberOfFloors: 'Ground Floor' | 'G+1' | 'G+2' | 'G+3';
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  kitchenType: KitchenType;
  livingRoom: boolean;
  diningRoom: boolean;
  parkingSpots: number;
  hasGarden: boolean;
  hasBalcony: boolean;
  hasTerrace: boolean;
  hasLift: boolean;
  stairType: StairType;
  qualityLevel: QualityLevel;
}

export interface RoomLayout2D {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'parking' | 'stair' | 'balcony' | 'corridor';
  x: number; // percentage or grid coord
  y: number;
  width: number;
  height: number;
  dimensionsFt: string;
  colorHex: string;
  doors: { wall: 'top' | 'bottom' | 'left' | 'right'; posPercent: number }[];
  windows: { wall: 'top' | 'bottom' | 'left' | 'right'; posPercent: number }[];
  furnitureItems: { name: string; xPercent: number; yPercent: number; icon: string }[];
}

export interface FloorPlanData {
  floorName: string; // 'Ground Floor', 'First Floor', etc.
  builtUpSqFt: number;
  rooms: RoomLayout2D[];
}

export interface Design3DStyleConcept {
  id: string;
  styleName: 'Modern' | 'Classic' | 'Luxury' | 'Minimal' | 'Contemporary';
  category: 'Exterior' | 'Interior Bedroom' | 'Interior Kitchen' | 'Interior Living' | 'Interior Dining' | 'Interior Bathroom' | 'Lighting Concept' | 'Landscape Concept';
  title: string;
  imageUrl: string;
  description: string;
  keyMaterials: string[];
  colorPalette: { name: string; hex: string }[];
  lightingAdvice: string;
}

export interface StructuralAdviceItem {
  category: string;
  title: string;
  recommendation: string;
  specification: string;
  codeReference?: string;
  iconName: string;
}

export interface MaterialQuantityItem {
  category: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPriceINR: number;
  totalCostINR: number;
  qualityGrade: string;
  recommendedBrand: string;
}

export interface ProjectTimelineMilestone {
  phase: string;
  weekRange: string;
  title: string;
  description: string;
  keyTasks: string[];
  completionPercentage: number;
}

export interface AIPlanningReport {
  id: string;
  createdAt: string;
  input: AIHousePlannerInput;
  totalPlotSqFt: number;
  builtUpSqFt: number;

  // Professional Planning Report Sections
  spaceDistribution: {
    carpetAreaSqFt: number;
    wallAreaSqFt: number;
    circulationSqFt: number;
    balconyTerraceSqFt: number;
  };
  roomPositionsVastu: {
    room: string;
    position: string;
    reason: string;
    vastuStatus: 'Optimal' | 'Favorable' | 'Neutral';
  }[];
  naturalLightingSuggestions: string[];
  crossVentilationSuggestions: string[];
  privacySuggestions: string[];
  futureExpansionSuggestions: string[];

  // Floor Plans
  floorPlans: FloorPlanData[];

  // 3D Concepts
  design3DConcepts: Design3DStyleConcept[];

  // Structural Guidance
  structuralAdviceList: StructuralAdviceItem[];

  // Material & Cost Estimates
  materialEstimates: MaterialQuantityItem[];
  costSummary: {
    materialCostINR: number;
    laborCostINR: number;
    interiorCostINR: number;
    exteriorCostINR: number;
    miscellaneousCostINR: number;
    totalBudgetINR: number;
    costPerSqFtINR: number;
    savingsSuggestions: string[];
    qualityComparison: {
      budgetLevel: number;
      standardLevel: number;
      premiumLevel: number;
      luxuryLevel: number;
    };
  };

  // Timeline
  timelineMilestones: ProjectTimelineMilestone[];
  totalWeeks: number;
  totalMonths: number;
}
