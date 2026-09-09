export type KnowledgeCategory = 
  | 'Architecture'
  | 'Structural Engineering'
  | 'Civil Engineering'
  | 'Interior Design'
  | 'MEP Systems'
  | 'Mechanical & Fabrication'
  | 'CAD & Software'
  | 'MS & Sheet Metal'
  | 'Welding & Defects'
  | 'Drawing Standards'
  | 'Drawing Analysis'
  | 'AI & Architecture';

export interface VisualStep {
  stepNumber: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  caption?: string;
  tips?: string[];
}

export interface BeforeAfterPair {
  title: string;
  description?: string;
  beforeImage: string;
  beforeLabel: string;
  beforeNotes: string;
  afterImage: string;
  afterLabel: string;
  afterNotes: string;
}

export interface DefectAnalysis {
  defectName: string;
  material: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  normalImage: string;
  damagedImage: string;
  whatHappened: string;
  possibleCauses: string[];
  whatToCheck: string[];
  correctiveActions: string[];
  preventionTips: string[];
}

export interface PracticalExample {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  specifications?: Record<string, string>;
  keyTakeaway: string;
}

export interface CommonProblemSolution {
  problemTitle: string;
  problemDescription: string;
  problemImage: string;
  possibleCauses: string[];
  solutionTitle: string;
  solutionDescription: string;
  solutionImage: string;
  bestPracticeTip: string;
}

export interface SoftwareToolDetail {
  softwareName: string;
  version?: string;
  discipline: string;
  workspaceImage: string;
  heroImage: string;
  whatIsIt: string;
  whatCanYouCreate: string[];
  drawingExamples: { title: string; image: string; description: string }[];
  keyTools: { name: string; shortcut?: string; purpose: string }[];
  standardWorkflow: { step: string; details: string }[];
  commonErrors: { error: string; fix: string }[];
  exampleProject: { title: string; image: string; summary: string };
  relatedSoftware: string[];
}

export interface DrawingAnnotation {
  id: string;
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
  widthPercent?: number;
  heightPercent?: number;
  type: 'conflict' | 'dimension' | 'structural' | 'egress' | 'mep';
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Notice';
  description: string;
  recommendation: string;
  codeStandard?: string;
}

export interface DrawingAnalysisSample {
  id: string;
  title: string;
  drawingType: 'Floor Plan' | 'Structural Detail' | 'MEP Ducting' | 'Elevation' | 'Sheet Metal Blank';
  category: string;
  originalImage: string;
  annotatedImage?: string;
  summary: string;
  issueCount: number;
  annotations: DrawingAnnotation[];
}

export interface VisualKnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  category: KnowledgeCategory;
  subCategory?: string;
  oneLineSummary: string;
  author: string;
  readTime: string;
  publishDate: string;
  tags: string[];

  // Hero Section
  heroImage: string;
  heroImageAlt: string;
  heroBadge?: string;

  // Quick Overview
  quickOverview: string[];

  // What Is It
  whatIsIt: {
    description: string;
    diagramImage: string;
    diagramImageAlt: string;
    diagramCaption: string;
  };

  // How It Works / Steps
  stepsTitle?: string;
  steps: VisualStep[];

  // Practical Example
  practicalExample: PracticalExample;

  // Common Problems & Solution
  problemSolution: CommonProblemSolution;

  // Do / Don't or Before/After
  beforeAfter?: BeforeAfterPair;

  // MS / Sheet Metal Defect (if applicable)
  defectInfo?: DefectAnalysis;

  // Software Guide (if applicable)
  softwareGuide?: SoftwareToolDetail;

  // Drawing Analysis Sample (if applicable)
  drawingAnalysis?: DrawingAnalysisSample;

  // Tips & Standards
  engineeringTips: string[];
  relevantCodesAndStandards?: string[];

  // Related Topics
  relatedTopicIds: string[];
}
