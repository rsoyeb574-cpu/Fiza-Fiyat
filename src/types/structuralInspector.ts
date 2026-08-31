export type StructureType = 
  | 'auto_detect'
  | 'house'
  | 'apartment'
  | 'building'
  | 'bridge'
  | 'flyover'
  | 'road'
  | 'retaining_wall'
  | 'boundary_wall'
  | 'column'
  | 'beam'
  | 'slab'
  | 'foundation'
  | 'roof'
  | 'staircase'
  | 'parking'
  | 'industrial'
  | 'other';

export type DamageCategory = 
  | 'crack'
  | 'spalling'
  | 'honeycombing'
  | 'corrosion'
  | 'water_moisture'
  | 'masonry'
  | 'deformation'
  | 'joint_damage'
  | 'surface_deterioration'
  | 'other';

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical_looking';
export type ConcernLevel = 'Low concern' | 'Moderate concern' | 'High concern' | 'Critical concern';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';
export type ImmediateInspection = 'Recommended' | 'Strongly Recommended';

export interface DamageAnnotation {
  id: string;
  type: DamageCategory;
  label: string; // e.g. [CRACK], [SPALLING], [CORROSION], [WATER DAMAGE], [DEFORMATION]
  // Normalized 0 to 1000 coordinates (ymin, xmin, ymax, xmax)
  box2d: [number, number, number, number];
  severity: ConcernLevel;
  description: string;
  color?: string;
  imageIndex?: number;
}

export interface DetectedProblem {
  id: string;
  problem: string;
  location: string;
  severity: ConcernLevel;
  category: DamageCategory;
  evidence: string;
  possibleCauses: string[];
  annotationId?: string;
  imageIndex?: number;
}

export interface VideoFinding {
  timestamp: string; // e.g. "00:04"
  timestampSeconds: number;
  problem: string;
  evidence: string;
  concernLevel: ConcernLevel;
  frameThumbnail?: string;
  annotations?: DamageAnnotation[];
}

export interface PossibleRepairApproach {
  issueType: string;
  repairClassification: 'Cosmetic / Surface Repair' | 'Potential Structural Issue (Requires Professional Assessment)';
  steps: string[];
  materialsInvolved: string[];
  professionalWarning?: string;
}

export interface StructuralInspectionResult {
  id: string;
  timestamp: string;
  mediaType: 'image' | 'multi_image' | 'video';
  structureType: string;
  detectedStructureType?: string;
  overallAssessment: string;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  immediateProfessionalInspection: ImmediateInspection;
  findings: DetectedProblem[];
  annotations: DamageAnnotation[];
  videoFindings?: VideoFinding[];
  whatMayBeRequired: string[];
  possibleRepairApproaches: PossibleRepairApproach[];
  questionsForEngineer: string[];
  safetyDisclaimer: string;
  imageUrls?: string[];
  annotatedImageUrls?: string[];
  summaryParagraph?: string;
}

export interface StructuralQAInput {
  question: string;
  inspectionContext: Partial<StructuralInspectionResult>;
  conversationHistory?: { sender: 'user' | 'ai'; text: string }[];
}
