// Construction Database System Types

export type UserRole = 'admin' | 'editor' | 'employee' | 'customer';

export interface LocationCity {
  id: string;
  name: string;
  state: string;
  country: string;
  costMultiplier: number;
  laborRateMultiplier: number;
  popular?: boolean;
}

export interface LocationState {
  id: string;
  name: string;
  code: string;
  country: string;
}

export interface LocationCountry {
  id: string;
  name: string;
  code: string;
  currencySymbol: string;
  currencyCode: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  image: string;
  description: string;
  purpose: string;
  advantages: string[];
  disadvantages: string[];
  lifeExpectancy: string;
  maintenance: string;
  price: number;
  priceUnit: string; // e.g., 'Bag (50kg)', 'Kg', 'Cu.Ft', 'Sq.Ft', 'Piece', 'Liter', 'Coil'
  availableSizes: string[];
  strength: string; // e.g., 'Fe500D', 'OPC 53 Grade', 'M25'
  qualityGrade: 'Economy' | 'Standard' | 'Premium' | 'Luxury';
  recommendedUsage: string;
  supplier: string;
  country: string;
  warranty: string;
  alternativeMaterials: string[];
  relatedMaterials: string[];
  installationMethod: string;
  videoGuide?: string;
  pdfGuide?: string;
  updatedAt?: string;
}

export type LaborRoleType = 
  | 'Mason'
  | 'Carpenter'
  | 'Electrician'
  | 'Painter'
  | 'Plumber'
  | 'Welder'
  | 'POP Worker'
  | 'Tile Installer'
  | 'Steel Fixer'
  | 'Glass Installer'
  | 'False Ceiling Worker';

export interface LaborRateItem {
  id: string;
  role: LaborRoleType;
  dailyRate: number;
  experienceYears: number;
  availability: 'Immediate' | 'Within 3 Days' | 'On Notice';
  city: string;
  contactInfo: string;
  skills: string[];
  rating: number;
  updatedAt?: string;
}

export interface ComponentTypeSpec {
  id: string;
  name: string;
  description: string;
  costUnit: string;
  baseRateINR: number;
  advantages: string[];
  disadvantages: string[];
  recommendedFor: string;
  imageUrl?: string;
}

export interface FoundationType extends ComponentTypeSpec {
  bearingCapacityReq: string;
  depthFt: number;
}

export interface ColumnType extends ComponentTypeSpec {
  rebarSpec: string;
  concreteGrade: string;
}

export interface BeamType extends ComponentTypeSpec {
  plinthOrRoof: 'Plinth Beam' | 'Roof Beam' | 'Both';
  rebarSpec: string;
}

export interface RoofType extends ComponentTypeSpec {
  thermalRating: string;
  waterproofMethod: string;
}

export interface SlabType extends ComponentTypeSpec {
  thicknessInches: number;
  spanLimitFt: number;
}

export interface WallType extends ComponentTypeSpec {
  thicknessInches: number;
  thermalRValue: string;
}

export interface BrickType extends ComponentTypeSpec {
  ratePerPiece: number;
  compressiveStrength: string;
}

export interface BlockType extends ComponentTypeSpec {
  ratePerPiece: number;
  density: string;
}

export interface DoorType extends ComponentTypeSpec {
  material: string;
  securityRating: string;
  priceRange: string;
}

export interface WindowType extends ComponentTypeSpec {
  frameMaterial: 'uPVC' | 'Aluminum' | 'Teak Wood' | 'Steel';
  glazingType: string;
  noiseReductionDb: number;
}

export interface FinishCategoryItem {
  id: string;
  name: string;
  type: string;
  brand: string;
  pricePerUnit: number;
  priceUnit: string;
  qualityLevel: string;
  image?: string;
  description?: string;
}

export interface HousePlanItem {
  id: string;
  title: string;
  plotWidthFt: number;
  plotLengthFt: number;
  totalAreaSqFt: number;
  builtUpAreaSqFt: number;
  floors: 'Ground Floor' | 'G+1' | 'G+2' | 'G+3';
  bedrooms: number;
  bathrooms: number;
  style: 'Modern' | 'Contemporary' | 'Traditional' | 'Minimalist' | 'Luxury Villa';
  estimatedCostINR: number;
  image: string;
  floorPlan2DSvgUrl?: string;
  floorPlan2DData?: {
    rooms: { name: string; x: number; y: number; w: number; h: number; color: string }[];
    dimensions: { x1: number; y1: number; x2: number; y2: number; label: string }[];
  };
  features: string[];
}

export interface Model3DItem {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  modelUrl?: string;
  description: string;
  viewCount: number;
}

export interface ConstructionTipItem {
  id: string;
  title: string;
  category: 'Structural' | 'Cost Saving' | 'MEP' | 'Interior' | 'Safety';
  content: string;
  author: string;
  image?: string;
  createdAt: string;
}

export interface ConstructionVideoItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  description: string;
}

export interface ProjectGalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  city: string;
  completionYear: number;
}

export interface CustomerReviewItem {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  projectType: string;
  avatar: string;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  active: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  city?: string;
  createdAt: string;
}

export interface UserRoleDefinition {
  id: string;
  roleName: UserRole;
  description: string;
  permissions: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface SEOSetting {
  id: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage?: string;
}

export interface AnalyticsSummary {
  id: string;
  totalViews: number;
  calculatorRuns: number;
  searchesCount: number;
  topCitySearched: string;
  lastUpdated: string;
}
