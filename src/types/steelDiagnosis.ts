export type SteelSeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SteelComponentType = 
  | 'I-Beam / Universal Beam'
  | 'Column / Stanchion'
  | 'Truss / Rafter / Purlin'
  | 'Hollow Section (SHS / RHS / CHS)'
  | 'Channel (ISMC / PFC)'
  | 'Angle Section (ISA)'
  | 'Gusset Plate / Base Plate'
  | 'Sheet Metal Panel (HR / CR / GI)'
  | 'Fabricated Welded Girder'
  | 'Bolted Connection'
  | 'Welded Joint'
  | 'Ducting / Enclosure'
  | 'Storage Tank / Silo Shell'
  | 'Other Metal Component';

export type SteelMaterialType = 
  | 'Mild Steel (IS 2062 E250 / ASTM A36)'
  | 'High-Strength Structural Steel (E350 / ASTM A992)'
  | 'Hot Rolled (HR) Steel Sheet / Plate'
  | 'Cold Rolled (CR) Steel Sheet'
  | 'Galvanized Iron (GI / GP) Sheet'
  | 'Carbon Steel (Medium / High Carbon)'
  | 'Stainless Steel (SS 304 / SS 316)'
  | 'Aluminium Sheet (1xxx / 3xxx / 5xxx / 6xxx)'
  | 'Unknown / Coated Metal';

export type NDTMethodType = 'VT' | 'PT' | 'MT' | 'UT' | 'RT';

export interface NDTMethodInfo {
  code: NDTMethodType;
  fullName: string;
  hindiName: string;
  description: string;
  detectableDefects: string[];
  limitations: string[];
  equipmentRequired: string[];
  standardReference: string;
}

export interface SteelDefectRecord {
  id: string;
  name: string;
  aliases: string[]; // English, Hindi, Hinglish e.g. ["Rust", "जंग", "Corrosion", "Jang"]
  category: 'corrosion' | 'welding' | 'cracking' | 'deformation' | 'surface' | 'connection';
  material_types: string[];
  description: string;
  visual_signs: string[];
  common_causes: string[];
  risk_factors: string[];
  severity_levels: {
    level: SteelSeverityLevel;
    criteria: string;
  }[];
  inspection_methods: NDTMethodType[];
  possible_repairs: string[];
  prevention: string[];
  when_to_stop_work: string;
  when_engineer_required: string;
  confidence_notes: string;
  standards_references: string[];
}

export interface SteelAnnotation {
  id: string;
  defectName: string;
  category: string;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000 normalized
  severity: SteelSeverityLevel;
  description: string;
  confidence: number; // 0-100
}

export interface SteelDiagnosticFinding {
  id: string;
  primaryDefect: string;
  alternativeDefects: string[];
  componentType: SteelComponentType;
  materialInferred: SteelMaterialType;
  defectLocation: string;
  affectedAreaPercentage: string; // e.g. "Approx 15-20% of bottom flange"
  severity: SteelSeverityLevel;
  possibleCauses: string[];
  recommendedInspection: string[];
  recommendedNextAction: string[];
  repairGuidance: string[];
  preventionGuidance: string[];
  whenToStopWork: string;
  whenEngineerRequired: string;
  annotationId?: string;
}

export interface SteelInspectionReport {
  id: string;
  timestamp: string;
  title: string;
  mediaType: 'image' | 'text_query';
  imageUrl?: string;
  materialInferred: SteelMaterialType;
  componentType: SteelComponentType;
  overallSeverity: SteelSeverityLevel;
  preliminaryAssessmentNote: string;
  confidenceNotes: string;
  findings: SteelDiagnosticFinding[];
  annotations: SteelAnnotation[];
  ndtRecommendations: {
    method: NDTMethodType;
    rationale: string;
    priority: 'Immediate' | 'Recommended' | 'Routine';
  }[];
  safetyAlerts: {
    stopWorkRecommended: boolean;
    structuralEngineerRequired: boolean;
    message: string;
  };
  applicableStandards: string[];
  disclaimer: string;
}

export interface SectionLossCalculationInput {
  nominalThicknessMm: number;
  measuredThicknessMm: number;
  componentName?: string;
  corrosionType?: 'uniform' | 'pitting' | 'localized';
}

export interface SectionLossCalculationResult {
  nominalThicknessMm: number;
  measuredThicknessMm: number;
  lossMm: number;
  sectionLossPercentage: number;
  remainingThicknessRatio: number;
  severity: SteelSeverityLevel;
  engineeringEvaluation: string;
  structuralWarning: string;
  sourceType: 'calculated from user-provided measurements';
}

export interface SheetWeightCalculationInput {
  material: 'mild_steel' | 'stainless_steel' | 'aluminium' | 'galvanized_iron';
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  quantity: number;
}

export interface SheetWeightCalculationResult {
  materialName: string;
  densityKgM3: number;
  singleVolumeM3: number;
  singleWeightKg: number;
  totalWeightKg: number;
  areaSqM: number;
  sourceType: 'calculated from user-provided measurements';
}

export interface SteelQAInput {
  question: string;
  language?: 'en' | 'hi' | 'hinglish';
  inspectionContext?: Partial<SteelInspectionReport>;
  conversationHistory?: { sender: 'user' | 'ai'; text: string }[];
}

export interface SteelQAResponse {
  observation: string;
  material: string;
  possibleProblem: string;
  severity: SteelSeverityLevel;
  possibleCauses: string[];
  recommendedInspection: string[];
  possibleCorrectiveAction: string[];
  prevention: string[];
  professionalReview: string;
  safetyNote: string;
  rawText: string;
}
