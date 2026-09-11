export interface ArchitecturalDesignConcept {
  id: string;
  schemeLetter: 'A' | 'B' | 'C' | string;
  conceptName: string;
  tagline: string;
  architecturalStyle: string;
  designPhilosophy: string;
  spatialMassingStrategy: string;
  structuralEngineeringSystem: string;
  facadeAndEnvelope: string;
  materialPalette: string[];
  parameterComparison: {
    estimatedCostVariance: string; // e.g. "-8% (Est. $414,000)"
    estimatedCostValue: string;
    costRationale: string;
    constructionTimelineVariance: string; // e.g. "-6 weeks faster (Modular prefabrication)"
    energyAndSustainabilityRating: string; // e.g. "Net-Zero Operational / LEED Platinum"
    usableAreaImpact: string; // e.g. "+350 sq.ft via reduced structural footprint"
  };
  keyAdvantages: string[];
  potentialTradeoffs: string[];
  buildingCodeAndZoningNotes: string;
  recommendedBimWorkflow: string;
  visualRenderPrompt: string;
  conceptVisualKeyword: string;
  renderedImageUrl?: string;
}

export interface DesignIterationRequest {
  projectId: string;
  projectTitle: string;
  categoryName: string;
  clientName?: string;
  location?: string;
  currentSpecs: {
    estimatedCost: string;
    area: string;
    structuralType: string;
    floors: string;
    energyRating: string;
    bimLevel: string;
    materials: string[];
    softwareUsed: string[];
  };
  projectDescription?: string;
  iterationDirective?: string; // 'balanced' | 'sustainable' | 'biophilic' | 'modular_steel' | 'high_tech' | 'cost_optimized'
  customRequirements?: string;
  referenceImageUrl?: string;
  userId?: string | null;
  userEmail?: string | null;
}

export interface DesignIterationResponse {
  status: 'success' | 'error';
  projectContextSummary: string;
  concepts: ArchitecturalDesignConcept[];
  generatedAt: string;
  directiveApplied: string;
  error?: string;
  message?: string;
  usage?: any;
}
