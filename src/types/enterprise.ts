// Enterprise Digital Business Platform Types

export type UserRole = 'Super Admin' | 'Admin' | 'Manager' | 'Designer' | 'Engineer' | 'Employee' | 'Client';

export interface EnterpriseUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  photoURL?: string;
  twoFactorEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'Pending' | 'Planning' | 'Design' | 'Approval' | 'Construction' | 'Completed' | 'Cancelled';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ProjectLog {
  id: string;
  date: string;
  authorName: string;
  type: 'Daily' | 'Weekly' | 'Monthly';
  notes: string;
  attachments?: string[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completionDate?: string;
  weightPercent: number;
}

export interface EnterpriseProject {
  id: string;
  title: string;
  clientUid: string;
  clientName: string;
  clientEmail: string;
  assignedTeam: { uid: string; name: string; role: string }[];
  status: ProjectStatus;
  priority: ProjectPriority;
  progressPercent: number;
  startDate: string;
  estimatedCompletionDate: string;
  budgetINR: number;
  drawings: { id: string; title: string; type: 'CAD' | 'Revit' | 'PDF' | '3D' | 'Image'; url: string; uploadedAt: string }[];
  media: { id: string; title: string; type: 'Image' | 'Video'; url: string }[];
  deliverables: { id: string; title: string; status: 'Pending Approval' | 'Approved' | 'Revision Requested'; fileUrl?: string; feedback?: string }[];
  milestones: ProjectMilestone[];
  logs: ProjectLog[];
  clientVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  category: 'Service' | 'Material' | 'Labor' | 'Consultation';
  quantity: number;
  unitPriceINR: number;
  totalINR: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectTitle: string;
  items: QuotationItem[];
  subtotalINR: number;
  gstRatePercent: number; // e.g. 18%
  gstAmountINR: number;
  discountINR: number;
  grandTotalINR: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Expired';
  validUntil: string;
  termsAndConditions: string;
  companySignatureUrl?: string;
  clientSignatureUrl?: string;
  createdAt: string;
}

export type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quotationId?: string;
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  totalAmountINR: number;
  advancePaidINR: number;
  remainingBalanceINR: number;
  cgstAmountINR: number;
  sgstAmountINR: number;
  igstAmountINR: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  transactionRef?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  clientName: string;
  amountINR: number;
  method: 'UPI' | 'Card' | 'Net Banking' | 'Wallet' | 'International';
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded';
  gatewayRef: string;
  createdAt: string;
}

export interface EmployeeProfile {
  id: string;
  uid?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: 'Architectural' | 'Structural' | 'BIM 3D' | 'Project Management' | 'Sales' | 'HR' | 'Finance';
  joiningDate: string;
  monthlySalaryINR: number;
  attendanceDaysThisMonth: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  performanceRating: number; // 1 to 5
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Completed';

export interface EnterpriseTask {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  assigneeName: string;
  priority: ProjectPriority;
  status: TaskStatus;
  dueDate: string;
  labels: string[];
  commentsCount: number;
  attachmentsCount: number;
  createdAt: string;
}

export interface StorageFileItem {
  id: string;
  name: string;
  folder: 'Drawings' | '3D Models' | 'Invoices' | 'Contracts' | 'General';
  fileType: 'dwg' | 'rvt' | 'pdf' | 'png' | 'mp4' | 'obj';
  sizeBytes: number;
  url: string;
  version: number;
  uploadedBy: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  category: 'Site Visit' | 'Client Call' | 'Team Meeting' | 'Milestone Deadline' | 'Presentation';
  startDate: string;
  endDate: string;
  location?: string;
  attendees: string[];
  description?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string; // 'client-chat' or 'internal-team' or 'pm-direct'
  senderUid: string;
  senderName: string;
  senderRole: string;
  senderPhoto?: string;
  recipientUid?: string;
  recipientName?: string;
  recipientRole?: string;
  projectId?: string;
  projectTitle?: string;
  fileRequestId?: string;
  fileRequestTitle?: string;
  priority?: 'Normal' | 'Urgent' | 'Milestone Review' | 'Site Query';
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'dwg' | 'rvt' | 'pdf' | 'jpg' | 'png' | 'zip' | 'doc';
  attachmentSizeBytes?: number;
  audioNoteUrl?: string;
  audioDurationSeconds?: number;
  readBy: string[];
  createdAt: string;
  timestamp?: number;
  isEncrypted?: boolean;
}

export interface DirectPMMember {
  uid: string;
  name: string;
  role: string;
  specialization: string;
  email: string;
  phone?: string;
  avatar: string;
  status: 'Online' | 'In Design Studio' | 'On Site Inspection' | 'In BIM Review' | 'Away';
  assignedProjects: string[]; // project IDs
  typicalResponseTime: string;
  licenseNumber?: string;
  bio?: string;
}

export interface PMDirectThread {
  id: string;
  pm: DirectPMMember;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSenderUid?: string;
  unreadCount: number;
  relatedProjectId?: string;
  relatedProjectTitle?: string;
}

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'Website Inquiry' | 'Google' | 'Referral' | 'Social Media' | 'Direct Call';
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Negotiating' | 'Won' | 'Lost';
  estimatedDealValueINR: number;
  notes: string;
  nextFollowUpDate: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  ipAddress?: string;
  timestamp: string;
}

export type NotificationType = 
  | 'requirement_reviewed' 
  | 'requirement_approved' 
  | 'pm_feedback' 
  | 'deliverable_uploaded' 
  | 'clarification_requested' 
  | 'project_milestone' 
  | 'general';

export interface ClientNotification {
  id: string;
  clientUid: string;
  clientEmail?: string;
  clientName?: string;
  projectId?: string;
  projectTitle?: string;
  fileRequestId?: string;
  fileRequestTitle?: string;
  type: NotificationType;
  title: string;
  message: string;
  managerName: string;
  managerRole: string;
  managerAvatar?: string;
  managerEmail?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  read: boolean;
  deliverableTitle?: string;
  deliverableUrl?: string;
  actionType?: 'open_brief' | 'open_deliverables' | 'open_chat' | 'view_project';
  metadata?: Record<string, any>;
  createdAt: string;
  timestamp: number;
}

export interface SystemNotification {
  id: string;
  userUid?: string; // empty means broadcast to admin
  title: string;
  message: string;
  type: 'project' | 'payment' | 'meeting' | 'alert' | 'file_request';
  read: boolean;
  createdAt: string;
}

// Client File Request & Requirement Document Types
export type FileRequestStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Fulfilled' | 'Needs Clarification' | 'Cancelled';

export type FileRequestCategory = 
  | 'Architectural Working Drawings'
  | 'Structural & Foundation Specs'
  | '3D BIM Model & Exterior Renders'
  | 'MEP & Electrical Schematics'
  | 'Interior Fit-out & Material Palette'
  | 'Site Survey & Soil Test Reports'
  | 'Bill of Quantities (BOQ) & Costing'
  | 'Municipal & Authority Permit Drawings'
  | 'Change Order / Design Revision'
  | 'Other Document Brief';

export type FileRequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface FileRequestAttachment {
  id: string;
  name: string;
  sizeBytes: number;
  fileType: 'pdf' | 'dwg' | 'rvt' | 'docx' | 'png' | 'jpg' | 'zip' | 'ifc' | 'txt';
  url: string;
  uploadedAt: string;
}

export interface FileRequestResponseDeliverable {
  id: string;
  title: string;
  fileType: 'pdf' | 'dwg' | 'rvt' | 'docx' | 'png' | 'jpg' | 'zip' | 'ifc';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}

export interface FileRequestMessage {
  id: string;
  senderUid: string;
  senderName: string;
  senderRole: 'Client' | 'Project Manager' | 'Principal Architect' | 'BIM Specialist' | 'Structural Engineer';
  senderAvatar?: string;
  text: string;
  attachments?: FileRequestAttachment[];
  createdAt: string;
}

export interface ClientFileRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  clientUid: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  assignedManagerUid: string;
  assignedManagerName: string;
  assignedManagerRole: string;
  assignedManagerEmail?: string;
  assignedManagerAvatar?: string;
  title: string;
  category: FileRequestCategory;
  priority: FileRequestPriority;
  targetDueDate?: string;
  description: string;
  deliverablesRequested: string[];
  attachments: FileRequestAttachment[];
  status: FileRequestStatus;
  adminNotes?: string;
  responseDeliverables?: FileRequestResponseDeliverable[];
  messages?: FileRequestMessage[];
  createdAt: string;
  updatedAt: string;
}
