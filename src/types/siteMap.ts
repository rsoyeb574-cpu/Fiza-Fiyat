export type SiteZoneType = 
  | 'building' 
  | 'podium' 
  | 'landscape' 
  | 'circulation' 
  | 'amenity' 
  | 'infrastructure' 
  | 'residential' 
  | 'commercial' 
  | 'cultural';

export interface SiteZoneStats {
  grossFloorArea: string;
  footprintArea?: string;
  heightOrFloors?: string;
  programmaticUse: string;
  occupancyCapacity?: string;
  structuralSystem?: string;
  energyRating?: string;
  completionPhase?: string;
  budgetShare?: string;
}

export interface SiteZone {
  id: string;
  code: string;
  name: string;
  type: SiteZoneType;
  polygonPoints: string;
  center: { x: number; y: number };
  accentColor: string;
  strokeColor?: string;
  fillOpacity?: number;
  stats: SiteZoneStats;
  description: string;
  renderingImage: string;
  renderingTitle?: string;
  renderingCaption?: string;
  viewpointAngle?: string;
  keyHighlights: string[];
  materials?: string[];
}

export interface ProjectSiteMapData {
  siteName: string;
  tagline?: string;
  basePlanImage?: string;
  viewBox?: string;
  northAngle?: number;
  scaleBarMeters?: number;
  totalSiteArea?: string;
  totalBuiltArea?: string;
  greenRatio?: string;
  farRatio?: string;
  zones: SiteZone[];
}
