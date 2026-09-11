import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  updateDoc 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { 
  ProjectRevisionMessage, 
  ProjectRevisionItem, 
  RevisionParticipant 
} from '../types/projectRevisionChat';

// Standard error reporting pattern conforming to Firebase Skill
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleDbError(error: unknown, operationType: OperationType, path: string | null) {
  console.warn(`Firestore project revision chat [${operationType}] at ${path}:`, error);
}

// Authorized Participants Directory
export const DEFAULT_PARTICIPANTS: RevisionParticipant[] = [
  {
    uid: 'client-aarav-sharma-1',
    name: 'Aarav Sharma',
    role: 'client',
    roleTitle: 'Authorized Client (Project Owner)',
    company: 'Azure Horizon Estates Ltd.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isAuthorizedClient: true,
    isVerifiedDesigner: false,
    licenseNumber: 'CLIENT-AUTH-2026-AZ',
    status: 'Online'
  },
  {
    uid: 'pm-fiza-hayat-1',
    name: 'Eng. Fiza Hayat',
    role: 'lead_architect',
    roleTitle: 'Principal Architect & Lead Director',
    company: 'Fiza Hayat Architectural Studio',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isAuthorizedClient: false,
    isVerifiedDesigner: true,
    licenseNumber: 'COA/2016/74829',
    status: 'In Studio'
  },
  {
    uid: 'pm-rohit-verma-2',
    name: 'Ar. Rohit Verma',
    role: 'structural_engineer',
    roleTitle: 'Senior Structural Lead & BIM Specialist',
    company: 'Verma & Associates Structural Consultants',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isAuthorizedClient: false,
    isVerifiedDesigner: true,
    licenseNumber: 'SE/MH/2018/1109',
    status: 'Reviewing CAD'
  },
  {
    uid: 'pm-natasha-khan-3',
    name: 'Natasha Khan',
    role: 'interior_designer',
    roleTitle: 'Lead Interior Architect & Finishes Specialist',
    company: 'Fiza Hayat Interiors',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    isAuthorizedClient: false,
    isVerifiedDesigner: true,
    licenseNumber: 'IIID/2019/554',
    status: 'On Site Review'
  }
];

// Seed Revision Topics per Project
export function getProjectRevisionItems(projectId: string): ProjectRevisionItem[] {
  return [
    {
      id: 'REV-01',
      code: 'REV-01',
      title: 'Schematic Footprint & Setback Realignment',
      discipline: 'Architectural',
      drawingSheets: ['A-101 Master Ground Plan', 'A-102 Boundary Wall Setback Detail'],
      status: 'Approved by Client',
      leadDesigner: 'Eng. Fiza Hayat',
      impactScore: 'High',
      targetDate: 'Aug 28, 2026'
    },
    {
      id: 'REV-02',
      code: 'REV-02',
      title: 'Double-Glazed Curtain Wall & Thermal Break',
      discipline: 'Façade',
      drawingSheets: ['A-301 South Façade Elevation', 'A-304 Mullion Bracket Section'],
      status: 'Approved by Client',
      leadDesigner: 'Eng. Fiza Hayat',
      impactScore: 'Medium',
      targetDate: 'Sep 02, 2026'
    },
    {
      id: 'REV-03',
      code: 'REV-03',
      title: 'Cantilever Slab Overhang Extension (1.8m → 2.1m)',
      discipline: 'Structural',
      drawingSheets: ['S-201 1st Floor Rebar Layout', 'S-305 Cantilever Drop Beam Detail'],
      status: 'Pending Client Approval',
      leadDesigner: 'Ar. Rohit Verma',
      impactScore: 'High',
      targetDate: 'Sep 15, 2026'
    },
    {
      id: 'REV-04',
      code: 'REV-04',
      title: 'HVAC Plenums & Linear Diffuser Integration',
      discipline: 'MEP',
      drawingSheets: ['M-101 Reflected Ceiling Plan', 'M-202 Fan Coil Unit Schedule'],
      status: 'In Discussion',
      leadDesigner: 'Eng. Fiza Hayat',
      impactScore: 'Low',
      targetDate: 'Sep 20, 2026'
    },
    {
      id: 'REV-05',
      code: 'REV-05',
      title: 'Foyer Marble Cladding & Hidden Joint System',
      discipline: 'Interior',
      drawingSheets: ['ID-105 Foyer Joinery Detail', 'ID-108 Stone Cladding Anchors'],
      status: 'In Discussion',
      leadDesigner: 'Natasha Khan',
      impactScore: 'Medium',
      targetDate: 'Sep 25, 2026'
    }
  ];
}

// Generate Realistic Seed Messages for any Project
function generateSeedMessages(projectId: string, projectTitle: string): ProjectRevisionMessage[] {
  return [
    {
      id: `rev-seed-1-${projectId}`,
      projectId,
      projectTitle,
      revisionId: 'REV-01',
      revisionTitle: 'Schematic Footprint & Setback Realignment',
      drawingSheetRef: 'A-101 Master Ground Plan',
      senderUid: 'pm-fiza-hayat-1',
      senderName: 'Eng. Fiza Hayat',
      senderRole: 'lead_architect',
      senderRoleLabel: 'Principal Architect & Lead Director',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      isAuthorizedClient: false,
      isVerifiedDesigner: true,
      priority: 'Milestone Approval',
      text: 'Good morning Aarav. In response to the municipal zoning setback amendment, we shifted the western pool deck by 1.2 meters to guarantee complete compliance with NBC 2016 fire tender access requirements without sacrificing private garden acreage.',
      revisionStatus: 'client_approved',
      suggestedChange: {
        element: 'Western Deck Setback Margin',
        discipline: 'Architectural',
        previousSpec: '3.60m from plot boundary wall',
        proposedSpec: '4.80m setback clearance with permeable pavers',
        costImpact: 'Neutral (No cost delta)',
        structuralCompliance: 'NBC 2016 Fire Tender Code Sec. 4.3 Passed'
      },
      attachment: {
        name: 'FH-Ground-Setback-Rev01.dwg',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        type: 'drawing',
        sizeLabel: '3.4 MB',
        caption: 'Revised site boundary buffer with landscape setback buffer.'
      },
      resolved: true,
      resolvedBy: 'Aarav Sharma (Authorized Client)',
      resolvedAt: 'Aug 29, 2026 11:30 AM',
      clientSignoff: {
        signedBy: 'Aarav Sharma',
        clientEmail: 'aarav.sharma@azurehorizon.com',
        timestamp: Date.now() - 86400000 * 6,
        signatureNote: 'Approved. Setback shift maintains all essential terrace functionality.'
      },
      reactions: { '👍': ['Aarav Sharma', 'Ar. Rohit Verma'], '📐': ['Natasha Khan'] },
      timestamp: Date.now() - 86400000 * 6,
      createdAt: '6 days ago'
    },
    {
      id: `rev-seed-2-${projectId}`,
      projectId,
      projectTitle,
      revisionId: 'REV-02',
      revisionTitle: 'Double-Glazed Curtain Wall & Thermal Break',
      drawingSheetRef: 'A-301 South Façade Elevation',
      senderUid: 'client-aarav-sharma-1',
      senderName: 'Aarav Sharma',
      senderRole: 'client',
      senderRoleLabel: 'Authorized Client (Project Owner)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isAuthorizedClient: true,
      isVerifiedDesigner: false,
      priority: 'Normal',
      text: 'For the living pavilion south façade, could we confirm the solar heat gain coefficient (SHGC)? We want to ensure low afternoon glare while preserving maximum ocean/landscape transparency.',
      revisionStatus: 'client_approved',
      resolved: true,
      resolvedBy: 'Eng. Fiza Hayat',
      resolvedAt: 'Sep 03, 2026 04:15 PM',
      reactions: { '☀️': ['Eng. Fiza Hayat'] },
      timestamp: Date.now() - 86400000 * 4,
      createdAt: '4 days ago'
    },
    {
      id: `rev-seed-3-${projectId}`,
      projectId,
      projectTitle,
      revisionId: 'REV-02',
      revisionTitle: 'Double-Glazed Curtain Wall & Thermal Break',
      drawingSheetRef: 'A-304 Mullion Bracket Section',
      senderUid: 'pm-fiza-hayat-1',
      senderName: 'Eng. Fiza Hayat',
      senderRole: 'lead_architect',
      senderRoleLabel: 'Principal Architect & Lead Director',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      isAuthorizedClient: false,
      isVerifiedDesigner: true,
      priority: 'Normal',
      text: 'We specified Guardian SunGuard Neutral 70 HT with a thermally broken 6063-T6 aluminum extrusion. SHGC is 0.28 with 68% visible light transmission (VLT), keeping interior climate loads down by 24% while crystal clear.',
      attachment: {
        name: 'Guardian_SunGuard_Glass_Spec_Sheet.pdf',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        type: 'pdf',
        sizeLabel: '1.8 MB',
        caption: 'Spectrophotometric performance curves & thermal insulation rating.'
      },
      resolved: true,
      timestamp: Date.now() - 86400000 * 3,
      createdAt: '3 days ago'
    },
    {
      id: `rev-seed-4-${projectId}`,
      projectId,
      projectTitle,
      revisionId: 'REV-03',
      revisionTitle: 'Cantilever Slab Overhang Extension (1.8m → 2.1m)',
      drawingSheetRef: 'S-305 Cantilever Drop Beam Detail',
      senderUid: 'pm-rohit-verma-2',
      senderName: 'Ar. Rohit Verma',
      senderRole: 'structural_engineer',
      senderRoleLabel: 'Senior Structural Lead & BIM Specialist',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isAuthorizedClient: false,
      isVerifiedDesigner: true,
      priority: 'Urgent',
      text: 'Aarav and Fiza, we ran finite element analysis for extending the upper balcony cantilever from 1.80m to 2.10m. To keep slab tip deflection under Span/350 (6.0mm) under full live load (3.0 kN/m²), we recommend upgrading top rebars to 16mm Fe550D @ 100mm c/c with a subtle 20mm upward camber.',
      revisionStatus: 'under_review',
      suggestedChange: {
        element: 'First Floor Balcony Cantilever Slab',
        discipline: 'Structural',
        previousSpec: '1.80m extension with 12mm Fe500D rebar @ 150mm',
        proposedSpec: '2.10m extension with 16mm Fe550D rebar @ 100mm + 20mm pre-camber',
        costImpact: '+₹72,500 (High-grade steel & additional formwork camber)',
        structuralCompliance: 'IS 456:2000 Cl. 23.2 & IS 13920:2016 Ductile Detailing Verified'
      },
      attachment: {
        name: 'S-305_Balcony_Cantilever_Moment_Diagram.png',
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        sizeLabel: '2.1 MB',
        caption: 'Bending moment envelope showing negative cantilever hogging moments.'
      },
      resolved: false,
      reactions: { '⚡': ['Eng. Fiza Hayat'], '👀': ['Aarav Sharma'] },
      timestamp: Date.now() - 3600000 * 8,
      createdAt: '8 hours ago'
    },
    {
      id: `rev-seed-5-${projectId}`,
      projectId,
      projectTitle,
      revisionId: 'REV-03',
      revisionTitle: 'Cantilever Slab Overhang Extension (1.8m → 2.1m)',
      drawingSheetRef: 'S-201 1st Floor Rebar Layout',
      senderUid: 'client-aarav-sharma-1',
      senderName: 'Aarav Sharma',
      senderRole: 'client',
      senderRoleLabel: 'Authorized Client (Project Owner)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isAuthorizedClient: true,
      isVerifiedDesigner: false,
      priority: 'Milestone Approval',
      text: 'Thanks Rohit! The extra 30cm shade over the ground terrace makes a noticeable difference for afternoon outdoor seating. The cost delta (+₹72.5k) is well within our contingency budget. Ready to approve once Fiza confirms the fascia aesthetic.',
      revisionStatus: 'under_review',
      resolved: false,
      timestamp: Date.now() - 3600000 * 4,
      createdAt: '4 hours ago'
    },
    {
      id: `rev-seed-6-${projectId}`,
      projectId,
      projectTitle,
      revisionId: 'REV-05',
      revisionTitle: 'Foyer Marble Cladding & Hidden Joint System',
      drawingSheetRef: 'ID-105 Foyer Joinery Detail',
      senderUid: 'pm-natasha-khan-3',
      senderName: 'Natasha Khan',
      senderRole: 'interior_designer',
      senderRoleLabel: 'Lead Interior Architect & Finishes Specialist',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      isAuthorizedClient: false,
      isVerifiedDesigner: true,
      priority: 'Normal',
      text: 'Hi Aarav! We inspected the Calacatta Gold book-matched marble slabs at the stone yard this afternoon. The grey-gold veining flow will be mirrored across the main entrance double-height portal. I have uploaded 3D perspective captures to the revision sheet.',
      attachment: {
        name: 'Foyer_Marble_Bookmatch_Veneer_3D.jpg',
        url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
        type: 'image',
        sizeLabel: '4.2 MB',
        caption: 'Book-matched vein alignment across 6.4m high foyer wall.'
      },
      resolved: false,
      reactions: { '✨': ['Aarav Sharma', 'Eng. Fiza Hayat'] },
      timestamp: Date.now() - 3600000 * 2,
      createdAt: '2 hours ago'
    }
  ];
}

// In-Memory & LocalStorage Cache
const LOCAL_STORAGE_KEY_PREFIX = 'fh_project_revisions_';

function getLocalStoredMessages(projectId: string, projectTitle: string): ProjectRevisionMessage[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${projectId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore local storage error
  }
  return generateSeedMessages(projectId, projectTitle);
}

function saveLocalStoredMessages(projectId: string, messages: ProjectRevisionMessage[]): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${projectId}`, JSON.stringify(messages));
  } catch (e) {
    // Ignore quota issues
  }
}

/**
 * Subscribe to real-time project-specific revision messages
 */
export function subscribeToProjectRevisions(
  projectId: string,
  projectTitle: string,
  onUpdate: (messages: ProjectRevisionMessage[]) => void,
  onError?: (err: unknown) => void
): () => void {
  // 1. Initial emission from local cache/seed for instant render
  let currentMessages = getLocalStoredMessages(projectId, projectTitle);
  onUpdate(currentMessages);

  // 2. Connect to Firestore real-time listener
  try {
    const q = query(
      collection(db, 'project_revision_chats'),
      where('projectId', '==', projectId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const docsMessages: ProjectRevisionMessage[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data
            } as ProjectRevisionMessage;
          });

          // Sort by timestamp ascending
          docsMessages.sort((a, b) => a.timestamp - b.timestamp);

          // Merge with any pre-seeded messages that haven't been pushed to DB yet
          const existingIds = new Set(docsMessages.map(m => m.id));
          const merged = [
            ...docsMessages,
            ...currentMessages.filter(m => !existingIds.has(m.id))
          ];
          merged.sort((a, b) => a.timestamp - b.timestamp);

          currentMessages = merged;
          saveLocalStoredMessages(projectId, merged);
          onUpdate(merged);
        } else {
          // If no docs in remote Firestore for this project yet, persist seed messages
          saveLocalStoredMessages(projectId, currentMessages);
          onUpdate(currentMessages);
        }
      },
      (err) => {
        handleDbError(err, OperationType.GET, `project_revision_chats[projectId=${projectId}]`);
        if (onError) onError(err);
        onUpdate(currentMessages);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleDbError(err, OperationType.GET, `project_revision_chats`);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Send a project revision message to Firestore and local state
 */
export async function sendProjectRevisionMessage(
  message: ProjectRevisionMessage
): Promise<void> {
  const projectId = message.projectId;
  const current = getLocalStoredMessages(projectId, message.projectTitle);
  const updated = [...current.filter(m => m.id !== message.id), message];
  updated.sort((a, b) => a.timestamp - b.timestamp);
  saveLocalStoredMessages(projectId, updated);

  try {
    const docRef = doc(db, 'project_revision_chats', message.id);
    await setDoc(docRef, {
      ...message,
      timestamp: message.timestamp || Date.now()
    }, { merge: true });
  } catch (err) {
    handleDbError(err, OperationType.WRITE, `project_revision_chats/${message.id}`);
  }
}

/**
 * Toggle resolution on a revision message
 */
export async function toggleRevisionResolution(
  projectId: string,
  projectTitle: string,
  messageId: string,
  resolved: boolean,
  resolvedBy: string
): Promise<void> {
  const current = getLocalStoredMessages(projectId, projectTitle);
  const updated = current.map(m => {
    if (m.id === messageId) {
      return {
        ...m,
        resolved,
        resolvedBy: resolved ? resolvedBy : undefined,
        resolvedAt: resolved ? new Date().toLocaleString() : undefined,
        revisionStatus: resolved ? ('resolved' as const) : m.revisionStatus
      };
    }
    return m;
  });
  saveLocalStoredMessages(projectId, updated);

  try {
    const docRef = doc(db, 'project_revision_chats', messageId);
    await updateDoc(docRef, {
      resolved,
      resolvedBy: resolved ? resolvedBy : null,
      resolvedAt: resolved ? new Date().toLocaleString() : null,
      revisionStatus: resolved ? 'resolved' : 'under_review'
    });
  } catch (err) {
    handleDbError(err, OperationType.UPDATE, `project_revision_chats/${messageId}`);
  }
}

/**
 * Client sign-off and approval of a revision change
 */
export async function approveRevisionChange(
  projectId: string,
  projectTitle: string,
  messageId: string,
  clientName: string,
  clientEmail: string = 'client@domain.com',
  signatureNote: string = 'Revision approved by authorized client.'
): Promise<void> {
  const current = getLocalStoredMessages(projectId, projectTitle);
  const updated = current.map(m => {
    if (m.id === messageId) {
      return {
        ...m,
        revisionStatus: 'client_approved' as const,
        resolved: true,
        resolvedBy: `${clientName} (Approved)`,
        resolvedAt: new Date().toLocaleString(),
        clientSignoff: {
          signedBy: clientName,
          clientEmail,
          timestamp: Date.now(),
          signatureNote
        }
      };
    }
    return m;
  });
  saveLocalStoredMessages(projectId, updated);

  try {
    const docRef = doc(db, 'project_revision_chats', messageId);
    await updateDoc(docRef, {
      revisionStatus: 'client_approved',
      resolved: true,
      resolvedBy: `${clientName} (Approved)`,
      resolvedAt: new Date().toLocaleString(),
      clientSignoff: {
        signedBy: clientName,
        clientEmail,
        timestamp: Date.now(),
        signatureNote
      }
    });
  } catch (err) {
    handleDbError(err, OperationType.UPDATE, `project_revision_chats/${messageId}`);
  }
}

/**
 * Add or toggle emoji reaction
 */
export async function toggleMessageReaction(
  projectId: string,
  projectTitle: string,
  messageId: string,
  emoji: string,
  userName: string
): Promise<void> {
  const current = getLocalStoredMessages(projectId, projectTitle);
  const updated = current.map(m => {
    if (m.id === messageId) {
      const reactions = { ...(m.reactions || {}) };
      const currentUsers = reactions[emoji] || [];
      if (currentUsers.includes(userName)) {
        reactions[emoji] = currentUsers.filter(u => u !== userName);
        if (reactions[emoji].length === 0) {
          delete reactions[emoji];
        }
      } else {
        reactions[emoji] = [...currentUsers, userName];
      }
      return { ...m, reactions };
    }
    return m;
  });
  saveLocalStoredMessages(projectId, updated);

  try {
    const target = updated.find(m => m.id === messageId);
    if (target) {
      const docRef = doc(db, 'project_revision_chats', messageId);
      await updateDoc(docRef, {
        reactions: target.reactions || {}
      });
    }
  } catch (err) {
    handleDbError(err, OperationType.UPDATE, `project_revision_chats/${messageId}`);
  }
}

/**
 * Simulate responsive Designer or Client AI Co-pilot Reply
 */
export async function simulateDesignerOrClientReply(
  incomingMessage: ProjectRevisionMessage,
  activeSpeaker: RevisionParticipant,
  targetResponder: RevisionParticipant,
  onReplyReceived?: (reply: ProjectRevisionMessage) => void
): Promise<ProjectRevisionMessage> {
  const designerReplies = [
    `Thank you for confirming! I have updated our Revit LOD 400 model and flagged drawing sheet ${incomingMessage.drawingSheetRef || 'A-102'} for immediate client review.`,
    `Noted with thanks. Our structural calculation verifies this revision meets IS 456 deflection criteria with 18% reserve moment capacity. Ready for sign-off.`,
    `We have coordinated this with the MEP engineering consultant. All conduit sleeves will pass above the false ceiling drop without clashing.`,
    `I have uploaded revised material finish boards to your client repository. The stone texture and shadow gaps align with the architectural intent.`,
    `Confirmed! We will incorporate this adjustment into Revision Package #${incomingMessage.revisionId} and issue the revised PDF drawings today.`
  ];

  const clientReplies = [
    `Thank you for the detailed engineering note! We have reviewed the specifications and are completely comfortable approving this change.`,
    `Understood. Could you verify if this change has any impact on the scheduled concrete casting date next Tuesday?`,
    `The revised perspective render looks spectacular. We love the seamless finish—please proceed with the site team.`,
    `Approved! The contingency allocation for this refinement is signed off from our end.`
  ];

  const replyOptions = targetResponder.isAuthorizedClient ? clientReplies : designerReplies;
  const replyText = replyOptions[Math.floor(Math.random() * replyOptions.length)];

  const replyMessage: ProjectRevisionMessage = {
    id: `rev-msg-reply-${Date.now()}`,
    projectId: incomingMessage.projectId,
    projectTitle: incomingMessage.projectTitle,
    revisionId: incomingMessage.revisionId,
    revisionTitle: incomingMessage.revisionTitle,
    drawingSheetRef: incomingMessage.drawingSheetRef,
    senderUid: targetResponder.uid,
    senderName: targetResponder.name,
    senderRole: targetResponder.role,
    senderRoleLabel: targetResponder.roleTitle,
    senderAvatar: targetResponder.avatar,
    isAuthorizedClient: targetResponder.isAuthorizedClient,
    isVerifiedDesigner: targetResponder.isVerifiedDesigner,
    priority: incomingMessage.priority === 'Urgent' ? 'Urgent' : 'Normal',
    text: replyText,
    resolved: false,
    reactions: { '✅': [activeSpeaker.name] },
    timestamp: Date.now(),
    createdAt: 'Just now'
  };

  await sendProjectRevisionMessage(replyMessage);
  if (onReplyReceived) onReplyReceived(replyMessage);
  return replyMessage;
}
