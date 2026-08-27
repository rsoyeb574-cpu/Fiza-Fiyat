import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  EnterpriseProject, 
  Quotation, 
  Invoice, 
  PaymentTransaction, 
  EmployeeProfile, 
  LeaveRequest, 
  EnterpriseTask, 
  StorageFileItem, 
  CalendarEvent, 
  ChatMessage, 
  CRMLead, 
  AuditLog, 
  SystemNotification,
  ClientFileRequest 
} from '../types/enterprise';

// Operation Error Handler according to Firebase Skill guidelines
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleDbError(error: unknown, opType: OperationType, path: string) {
  console.warn(`Firestore Enterprise DB (${opType} @ ${path}):`, error);
}

// SEED INITIAL ENTERPRISE DATA FOR DEMO & FIREBASE FALLBACK
export const initialEnterpriseProjects: EnterpriseProject[] = [
  {
    id: 'proj-ent-101',
    title: 'Grand Azure Luxury Villa & Infinity Pool',
    clientUid: 'client-demouser-1',
    clientName: 'Aarav Sharma',
    clientEmail: 'aarav.sharma@example.com',
    assignedTeam: [
      { uid: 'emp-1', name: 'Eng. Fiza Hayat', role: 'Principal Architect' },
      { uid: 'emp-2', name: 'Rohan Mehta', role: 'BIM 3D Specialist' }
    ],
    status: 'Construction',
    priority: 'Urgent',
    progressPercent: 68,
    startDate: '2026-02-15',
    estimatedCompletionDate: '2026-11-30',
    budgetINR: 12500000,
    drawings: [
      { id: 'd-1', title: '2D Architectural Floor Blueprint v3.dwg', type: 'CAD', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: '2026-03-01' },
      { id: 'd-2', title: 'Revit 3D BIM Structural Model.rvt', type: 'Revit', url: '#', uploadedAt: '2026-03-10' },
      { id: 'd-3', title: 'Structural Column Rebar Detail.pdf', type: 'PDF', url: '#', uploadedAt: '2026-04-02' }
    ],
    media: [
      { id: 'm-1', title: 'Site Excavation & Foundation Casting', type: 'Image', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80' },
      { id: 'm-2', title: '3D Exterior Render Walkthrough', type: 'Image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' }
    ],
    deliverables: [
      { id: 'del-1', title: 'Phase 1 Structural Foundation Drawings', status: 'Approved', fileUrl: '#' },
      { id: 'del-2', title: '3D Exterior Elevation Render Package', status: 'Pending Approval', fileUrl: '#' }
    ],
    milestones: [
      { id: 'm-1', title: 'Plot Boundary & Site Excavation', dueDate: '2026-03-01', completed: true, weightPercent: 20 },
      { id: 'm-2', title: 'Plinth Tie Beam & Column Casting', dueDate: '2026-05-15', completed: true, weightPercent: 30 },
      { id: 'm-3', title: 'RCC Roof Slab Concreting', dueDate: '2026-08-10', completed: false, weightPercent: 30 },
      { id: 'm-4', title: 'Interior Finishes & Handover', dueDate: '2026-11-30', completed: false, weightPercent: 20 }
    ],
    logs: [
      { id: 'l-1', date: '2026-08-01', authorName: 'Rohan Mehta', type: 'Daily', notes: 'Poured 45 cubic meters M25 concrete for 1st floor beam shuttering.' }
    ],
    clientVisible: true,
    createdAt: '2026-02-01',
    updatedAt: '2026-08-05'
  }
];

export const initialQuotations: Quotation[] = [
  {
    id: 'q-2026-001',
    quoteNumber: 'FH-QT-2026-089',
    clientName: 'Aarav Sharma',
    clientEmail: 'aarav.sharma@example.com',
    clientPhone: '+91 98765 43210',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    items: [
      { id: 'qi-1', description: 'Architectural Working Drawings & 3D BIM Modeling', category: 'Service', quantity: 1, unitPriceINR: 450000, totalINR: 450000 },
      { id: 'qi-2', description: 'High-Grade Fe500D Structural Rebar Steel', category: 'Material', quantity: 25, unitPriceINR: 65000, totalINR: 1625000 },
      { id: 'qi-3', description: 'Superstructure Framing & RCC Slab Labor Charge', category: 'Labor', quantity: 4500, unitPriceINR: 320, totalINR: 1440000 }
    ],
    subtotalINR: 3515000,
    gstRatePercent: 18,
    gstAmountINR: 632700,
    discountINR: 50000,
    grandTotalINR: 4097700,
    status: 'Approved',
    validUntil: '2026-09-01',
    termsAndConditions: '1. 30% Advance upon contract signing. 2. Work executes according to NBC codes.',
    companySignatureUrl: 'https://via.placeholder.com/150x50?text=Fiza+Hayat+Signature',
    createdAt: '2026-02-05'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-2026-001',
    invoiceNumber: 'FH-INV-2026-104',
    quotationId: 'q-2026-001',
    clientName: 'Aarav Sharma',
    clientEmail: 'aarav.sharma@example.com',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    totalAmountINR: 4097700,
    advancePaidINR: 1500000,
    remainingBalanceINR: 2597700,
    cgstAmountINR: 316350,
    sgstAmountINR: 316350,
    igstAmountINR: 0,
    paymentStatus: 'Partial',
    dueDate: '2026-08-20',
    paidAt: '2026-02-10',
    paymentMethod: 'Net Banking (HDFC Bank)',
    transactionRef: 'TXN-98213894',
    createdAt: '2026-02-10'
  }
];

export const initialEmployees: EmployeeProfile[] = [
  { id: 'emp-1', uid: 'uid-fiza', name: 'Eng. Fiza Hayat', email: 'contact@fizahayat.com', phone: '+91 98000 11122', role: 'Super Admin', department: 'Architectural', joiningDate: '2018-01-01', monthlySalaryINR: 250000, attendanceDaysThisMonth: 22, status: 'Active', performanceRating: 5 },
  { id: 'emp-2', uid: 'uid-rohan', name: 'Rohan Mehta', email: 'rohan.mehta@fizahayat.com', phone: '+91 98000 33344', role: 'Designer', department: 'BIM 3D', joiningDate: '2021-04-15', monthlySalaryINR: 110000, attendanceDaysThisMonth: 21, status: 'Active', performanceRating: 4.8 },
  { id: 'emp-3', uid: 'uid-priya', name: 'Priya Verma', email: 'priya.v@fizahayat.com', phone: '+91 98000 55566', role: 'Engineer', department: 'Structural', joiningDate: '2022-08-01', monthlySalaryINR: 125000, attendanceDaysThisMonth: 22, status: 'Active', performanceRating: 4.9 }
];

export const initialTasks: EnterpriseTask[] = [
  { id: 't-1', title: 'Review Soil Test Report for Sector 5 Plot', description: 'Analyze load bearing capacity before slab rebar calculation.', priority: 'High', status: 'In Progress', assigneeName: 'Priya Verma', dueDate: '2026-08-10', labels: ['Structural', 'Site Check'], commentsCount: 3, attachmentsCount: 1, createdAt: '2026-08-02' },
  { id: 't-2', title: 'Finalize Interior Lighting Schedule', description: 'Select warm 3000K LED recessed coves for Master Villa.', priority: 'Medium', status: 'To Do', assigneeName: 'Rohan Mehta', dueDate: '2026-08-14', labels: ['Interior', 'Lighting'], commentsCount: 0, attachmentsCount: 2, createdAt: '2026-08-04' }
];

export const initialCRMLeads: CRMLead[] = [
  { id: 'lead-1', name: 'Vikramaditya Roy', email: 'v.roy@businesshub.com', phone: '+91 91234 56789', source: 'Website Inquiry', status: 'Negotiating', estimatedDealValueINR: 8500000, notes: 'Client wants 4BHK G+2 modern villa with solar terrace.', nextFollowUpDate: '2026-08-08', createdAt: '2026-07-28' },
  { id: 'lead-2', name: 'Sneha Banerjee', email: 'sneha.b@studio.org', phone: '+91 98310 12345', source: 'Google', status: 'Proposal Sent', estimatedDealValueINR: 3200000, notes: 'Boutique interior redesign for café commercial space.', nextFollowUpDate: '2026-08-09', createdAt: '2026-08-01' }
];

// Helper functions for Firestore + Fallback storage
export async function fetchEnterpriseProjects(): Promise<EnterpriseProject[]> {
  try {
    const colRef = collection(db, 'enterprise_projects');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as EnterpriseProject));
    }
  } catch (err) {
    handleDbError(err, OperationType.LIST, 'enterprise_projects');
  }
  return initialEnterpriseProjects;
}

export async function saveEnterpriseProject(proj: EnterpriseProject): Promise<void> {
  try {
    const docRef = doc(db, 'enterprise_projects', proj.id);
    await setDoc(docRef, proj, { merge: true });
  } catch (err) {
    handleDbError(err, OperationType.WRITE, `enterprise_projects/${proj.id}`);
  }
}

export async function fetchQuotations(): Promise<Quotation[]> {
  try {
    const snap = await getDocs(collection(db, 'quotations'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Quotation));
    }
  } catch (err) {
    handleDbError(err, OperationType.LIST, 'quotations');
  }
  return initialQuotations;
}

export async function saveQuotation(quote: Quotation): Promise<void> {
  try {
    await setDoc(doc(db, 'quotations', quote.id), quote, { merge: true });
  } catch (err) {
    handleDbError(err, OperationType.WRITE, `quotations/${quote.id}`);
  }
}

export async function fetchInvoices(): Promise<Invoice[]> {
  try {
    const snap = await getDocs(collection(db, 'invoices'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
    }
  } catch (err) {
    handleDbError(err, OperationType.LIST, 'invoices');
  }
  return initialInvoices;
}

export async function saveInvoice(inv: Invoice): Promise<void> {
  try {
    await setDoc(doc(db, 'invoices', inv.id), inv, { merge: true });
  } catch (err) {
    handleDbError(err, OperationType.WRITE, `invoices/${inv.id}`);
  }
}

export async function fetchEmployees(): Promise<EmployeeProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'employees'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as EmployeeProfile));
    }
  } catch (err) {
    handleDbError(err, OperationType.LIST, 'employees');
  }
  return initialEmployees;
}

export async function saveEmployee(emp: EmployeeProfile): Promise<void> {
  try {
    await setDoc(doc(db, 'employees', emp.id), emp, { merge: true });
  } catch (err) {
    handleDbError(err, OperationType.WRITE, `employees/${emp.id}`);
  }
}

export async function fetchTasks(): Promise<EnterpriseTask[]> {
  try {
    const snap = await getDocs(collection(db, 'tasks'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as EnterpriseTask));
    }
  } catch (err) {
    handleDbError(err, OperationType.LIST, 'tasks');
  }
  return initialTasks;
}

export async function saveTask(task: EnterpriseTask): Promise<void> {
  try {
    await setDoc(doc(db, 'tasks', task.id), task, { merge: true });
  } catch (err) {
    handleDbError(err, OperationType.WRITE, `tasks/${task.id}`);
  }
}

export async function fetchCRMLeads(): Promise<CRMLead[]> {
  try {
    const snap = await getDocs(collection(db, 'crm_leads'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as CRMLead));
    }
  } catch (err) {
    handleDbError(err, OperationType.LIST, 'crm_leads');
  }
  return initialCRMLeads;
}

export async function saveCRMLead(lead: CRMLead): Promise<void> {
  try {
    await setDoc(doc(db, 'crm_leads', lead.id), lead, { merge: true });
  } catch (err) {
    handleDbError(err, OperationType.WRITE, `crm_leads/${lead.id}`);
  }
}

// Initial Mock File Requests for Authenticated Client Demo
export const initialFileRequests: ClientFileRequest[] = [
  {
    id: 'freq-2026-001',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    clientUid: 'client-demouser-1',
    clientName: 'Aarav Sharma',
    clientEmail: 'aarav.sharma@example.com',
    clientPhone: '+91 98765 43210',
    assignedManagerUid: 'emp-1',
    assignedManagerName: 'Eng. Fiza Hayat',
    assignedManagerRole: 'Principal Architect',
    assignedManagerEmail: 'contact@fizahayat.com',
    assignedManagerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    title: 'Balcony Cantilever Rebar & Glass Balustrade Specification',
    category: 'Structural & Foundation Specs',
    priority: 'Urgent',
    targetDueDate: '2026-08-30',
    description: 'We are requesting the updated working drawings and structural load calculation for the 2nd-floor master balcony cantilever slab extension (1.8m overhang) along with fixing details for the frameless 12mm laminated toughened glass balustrade. Please verify deflection limits according to IS 456 codes.',
    deliverablesRequested: [
      'AutoCAD 2024 .DWG Detailed Section',
      'Structural Calculation Note (PDF)',
      'Glass Balustrade Anchorage Detail',
      'Fe500D Rebar Bending Schedule'
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Client_Balcony_Markups_v2.pdf',
        sizeBytes: 1450000,
        fileType: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedAt: '2026-08-06'
      },
      {
        id: 'att-2',
        name: 'Architectural_Balcony_Photo_Ref.jpg',
        sizeBytes: 2840000,
        fileType: 'jpg',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '2026-08-06'
      }
    ],
    status: 'In Progress',
    adminNotes: 'Structural engineering team is finalizing beam anchorage depth. Reviewing with lead consultant.',
    responseDeliverables: [
      {
        id: 'resp-del-1',
        title: 'FH-BAL-STR-01_Balcony_Overhang_Rebar_Draft.dwg',
        fileType: 'dwg',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: 'Eng. Fiza Hayat',
        uploadedAt: '2026-08-07',
        notes: 'Initial section layout ready. Reviewing concrete mix design (M30).'
      }
    ],
    messages: [
      {
        id: 'fmsg-1',
        senderUid: 'client-demouser-1',
        senderName: 'Aarav Sharma',
        senderRole: 'Client',
        text: 'Hi Eng. Fiza, could you ensure the structural anchor plate does not puncture the waterproof membrane on the deck?',
        createdAt: '2026-08-06 14:15'
      },
      {
        id: 'fmsg-2',
        senderUid: 'emp-1',
        senderName: 'Eng. Fiza Hayat',
        senderRole: 'Principal Architect',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        text: 'Hello Mr. Sharma! Yes, we have designed side-mounted chemical anchor studs into the RCC upstand beam, preserving the floor membrane integrity.',
        createdAt: '2026-08-07 09:30'
      }
    ],
    createdAt: '2026-08-06',
    updatedAt: '2026-08-07'
  },
  {
    id: 'freq-2026-002',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    clientUid: 'client-demouser-1',
    clientName: 'Aarav Sharma',
    clientEmail: 'aarav.sharma@example.com',
    clientPhone: '+91 98765 43210',
    assignedManagerUid: 'emp-2',
    assignedManagerName: 'Rohan Mehta',
    assignedManagerRole: 'BIM 3D Specialist',
    assignedManagerEmail: 'rohan.mehta@fizahayat.com',
    assignedManagerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    title: 'Italian Travertine Marble Living Room Render & Material Schedule',
    category: 'Interior Fit-out & Material Palette',
    priority: 'Medium',
    targetDueDate: '2026-09-05',
    description: 'Requirement brief for 4K photorealistic interior renders of the double-height formal living room using Roman Navona Travertine wall cladding and warm brass accents. Please specify recommended slab dimensions and dry-cladding clamp hardware.',
    deliverablesRequested: [
      '3x 4K Ultra-HD Photorealistic 3D Renders',
      'Material Bill of Quantities (Sq.Ft Breakdown)',
      'Dry Cladding Clamp Detail Diagram'
    ],
    attachments: [
      {
        id: 'att-3',
        name: 'Travertine_Cladding_Inspiration.png',
        sizeBytes: 3120000,
        fileType: 'png',
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: '2026-08-03'
      }
    ],
    status: 'Under Review',
    createdAt: '2026-08-03',
    updatedAt: '2026-08-04'
  }
];

export async function fetchClientFileRequests(clientUid?: string): Promise<ClientFileRequest[]> {
  try {
    const colRef = collection(db, 'file_requests');
    let q = query(colRef);
    if (clientUid) {
      q = query(colRef, where('clientUid', '==', clientUid));
    }
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientFileRequest));
    }
  } catch (err) {
    handleDbError(err, OperationType.LIST, 'file_requests');
  }
  if (clientUid) {
    return initialFileRequests.filter(r => r.clientUid === clientUid || r.clientEmail === 'aarav.sharma@example.com');
  }
  return initialFileRequests;
}

export async function saveClientFileRequest(req: ClientFileRequest): Promise<void> {
  try {
    const docRef = doc(db, 'file_requests', req.id);
    await setDoc(docRef, req, { merge: true });
  } catch (err) {
    handleDbError(err, OperationType.WRITE, `file_requests/${req.id}`);
  }
}

export async function deleteClientFileRequest(reqId: string): Promise<void> {
  try {
    const docRef = doc(db, 'file_requests', reqId);
    await deleteDoc(docRef);
  } catch (err) {
    handleDbError(err, OperationType.DELETE, `file_requests/${reqId}`);
  }
}
