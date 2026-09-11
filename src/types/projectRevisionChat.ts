export type RevisionParticipantRole = 
  | 'client' 
  | 'lead_architect' 
  | 'structural_engineer' 
  | 'interior_designer' 
  | 'bim_manager';

export interface RevisionParticipant {
  uid: string;
  name: string;
  role: RevisionParticipantRole;
  roleTitle: string;
  company: string;
  avatar: string;
  isAuthorizedClient: boolean;
  isVerifiedDesigner: boolean;
  licenseNumber?: string;
  status: 'Online' | 'In Studio' | 'On Site Review' | 'Reviewing CAD';
}

export type RevisionItemStatus = 
  | 'In Discussion' 
  | 'Pending Client Approval' 
  | 'Approved by Client' 
  | 'Incorporated into BIM' 
  | 'Action Required';

export interface ProjectRevisionItem {
  id: string; // e.g. 'REV-01', 'REV-02'
  code: string;
  title: string;
  discipline: 'Architectural' | 'Structural' | 'MEP' | 'Interior' | 'Façade' | 'Landscape';
  drawingSheets: string[];
  status: RevisionItemStatus;
  leadDesigner: string;
  impactScore?: 'Low' | 'Medium' | 'High';
  targetDate?: string;
}

export interface RevisionSuggestedChange {
  element: string; // e.g., "South Cantilever Slab Depth"
  discipline: 'Architectural' | 'Structural' | 'MEP' | 'Interior' | 'Landscape';
  previousSpec: string; // e.g., "1.80m cantilever with 150mm drop"
  proposedSpec: string; // e.g., "2.10m cantilever with 200mm post-tensioned tapered slab"
  costImpact?: string; // e.g., "+₹85,000"
  structuralCompliance?: string; // e.g., "IS 456 Cl. 23.2 deflection OK"
}

export interface RevisionAttachment {
  name: string;
  url: string;
  type: 'drawing' | 'image' | 'pdf' | 'voice_note';
  sizeLabel?: string;
  caption?: string;
  durationSeconds?: number;
}

export interface ProjectRevisionMessage {
  id: string;
  projectId: string;
  projectTitle: string;
  revisionId: string; // references ProjectRevisionItem.id or 'GENERAL'
  revisionTitle: string;
  drawingSheetRef?: string;
  senderUid: string;
  senderName: string;
  senderRole: RevisionParticipantRole;
  senderRoleLabel: string;
  senderAvatar: string;
  isAuthorizedClient: boolean;
  isVerifiedDesigner: boolean;
  text: string;
  priority: 'Normal' | 'Urgent' | 'Milestone Approval' | 'Site RFI';
  revisionStatus?: 'proposed' | 'under_review' | 'client_approved' | 'resolved';
  suggestedChange?: RevisionSuggestedChange;
  attachment?: RevisionAttachment;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  clientSignoff?: {
    signedBy: string;
    clientEmail?: string;
    timestamp: number;
    signatureNote: string;
  };
  reactions?: Record<string, string[]>; // emoji => array of user names
  timestamp: number;
  createdAt: string;
}
