// CAD, BIM, Engineering & Universal Drawing Master System Types

export type CadSoftwareCategory = 
  | 'Architecture / BIM'
  | 'Structural'
  | 'Civil'
  | 'Mechanical / CAD'
  | 'Graphic / Presentation'
  | 'MEP';

export interface CadSoftwareRecord {
  software_name: string;
  category: CadSoftwareCategory;
  purpose: string;
  common_file_formats: string[];
  drawing_types: string[];
  workflow: string[];
  tools: string[];
  commands: { name: string; shortcut?: string; purpose: string; howToUse: string; commonMistake: string }[];
  common_errors: { errorCode: string; message: string; cause: string; fix: string }[];
  common_problems: string[];
  solutions: string[];
  best_practices: string[];
  export_formats: string[];
  compatibility: string[];
  AI_assistance: string[];
}

export type DrawingDiscipline = 
  | 'ARCHITECTURAL'
  | 'STRUCTURAL'
  | 'MEP'
  | 'CIVIL'
  | 'MECHANICAL'
  | 'INTERIOR';

export interface UniversalDrawingTypeRecord {
  id: string;
  discipline: DrawingDiscipline;
  name: string;
  purpose: string;
  standard_scales: string[];
  mandatory_contents: string[];
  typical_layers: string[];
  key_dimensions: string[];
  standards_references: string[];
  coordination_checks: string[];
  common_drafting_errors: string[];
}

export interface DrawingAnalysisFinding {
  id: string;
  category: 
    | 'Dimension Issue'
    | 'Geometric Alignment'
    | 'Door / Window Conflict'
    | 'Circulation / Access'
    | 'Stair Geometry'
    | 'Text & Annotation Overlap'
    | 'Layer / Standard Issue'
    | 'Coordination Clash'
    | 'Missing Information'
    | 'Drafting Defect';
  findingType: 'confirmed_observation' | 'possible_issue' | 'requires_verification';
  title: string;
  description: string;
  locationReference?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  potentialImpact: string;
  recommendedResolution: string;
  verificationMethod: string;
  applicableStandardOrRule?: string;
}

export interface DrawingAnalysisReport {
  id: string;
  drawingName: string;
  fileFormat: string;
  detectedDiscipline: DrawingDiscipline | 'COORDINATION / COMPOSITE';
  summary: string;
  totalFindings: number;
  confirmedCount: number;
  possibleCount: number;
  verificationRequiredCount: number;
  criticalSeverityCount: number;
  findings: DrawingAnalysisFinding[];
  coordinationMatrix: {
    disciplinesInvolved: string[];
    clashRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    notes: string;
  };
  standardsComplianceNote: string;
  disclaimer: string;
  timestamp: string;
}

export interface RoomLayoutSpecification {
  name: string;
  widthFt: number;
  lengthFt: number;
  areaSqFt: number;
  level: string;
  purpose: string;
  minCeilingHeightFt?: number;
  x: number; // in feet relative to plot origin (0,0)
  y: number; // in feet relative to plot origin (0,0)
  doors?: { wall: 'north' | 'south' | 'east' | 'west'; widthFt: number; target: string }[];
  windows?: { wall: 'north' | 'south' | 'east' | 'west'; widthFt: number; heightFt: number }[];
  fixtures?: string[];
}

export interface GeneratedDrawingSpec {
  id: string;
  plotWidthFt: number;
  plotLengthFt: number;
  totalPlotAreaSqFt: number;
  totalBuiltUpAreaSqFt: number;
  groundCoveragePercent: number;
  roadFacing: 'North' | 'South' | 'East' | 'West';
  rooms: RoomLayoutSpecification[];
  circulationPercentage: number;
  staircaseSpec: {
    type: string;
    treadInches: number;
    riserInches: number;
    flightWidthFt: number;
    headroomFt: number;
    isCompliant: boolean;
  };
  doorWindowSchedule: {
    tag: string;
    type: 'Door' | 'Window' | 'Ventilator';
    widthFt: number;
    heightFt: number;
    material: string;
    qty: number;
  }[];
  validationResults: {
    boundaryContained: boolean;
    wallOverlapsValid: boolean;
    allRoomsAccessible: boolean;
    ventilationRatioValid: boolean;
    stairRiserTreadValid: boolean;
    messages: string[];
  };
  svgContent: string;
  dxfContent: string;
  timestamp: string;
}

export interface EngineeringCalculationRecord {
  name: string;
  category: 'Structural' | 'Civil' | 'Material' | 'Area' | 'Cost';
  inputs: { label: string; value: number | string; unit: string }[];
  formula: string;
  formulaLatex?: string;
  result: number | string;
  unit: string;
  engineeringCodeReference?: string;
  notes: string[];
}

export interface EngineeringReportData {
  reportType: 
    | 'Drawing Review Report'
    | 'Structural Inspection Report'
    | 'Material Report'
    | 'Damage Assessment Report'
    | 'Quantity Report'
    | 'Design Review Report'
    | 'Project Summary';
  projectTitle: string;
  clientOrLocation: string;
  preparedBy: string;
  observations: string[];
  identifiedIssues: { title: string; severity: string; details: string; action: string }[];
  calculations: { item: string; formula: string; result: string; unit: string }[];
  recommendations: string[];
  warnings: string[];
  professionalReviewNotice: string;
  generatedDate: string;
}
