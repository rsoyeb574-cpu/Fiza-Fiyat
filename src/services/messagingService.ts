import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  updateDoc 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { ChatMessage, DirectPMMember, PMDirectThread } from '../types/enterprise';

// Operation error logging conformant to Firebase Skill
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleDbError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.warn('Firestore messaging non-fatal error:', JSON.stringify(errInfo));
}

// Certified Project Managers Directory
export const ASSIGNED_PROJECT_MANAGERS: DirectPMMember[] = [
  {
    uid: 'pm-fiza-hayat-1',
    name: 'Eng. Fiza Hayat',
    role: 'Principal Architect & PM Lead',
    specialization: 'Luxury Residential & High-End Structural Integration',
    email: 'contact@fizahayat.com',
    phone: '+91 98201 54321',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    status: 'Online',
    assignedProjects: ['proj-ent-101', 'proj-ent-103'],
    typicalResponseTime: '< 15 mins',
    licenseNumber: 'COA/2016/74829',
    bio: 'Direct design supervisor. Coordinates all architectural elevations, finishes, and VIP client consultations.'
  },
  {
    uid: 'pm-rohit-verma-2',
    name: 'Ar. Rohit Verma',
    role: 'Senior Structural Engineer & BIM Lead',
    specialization: 'RCC Cantilevers, IS 456 Seismic Codes & LOD 400 BIM',
    email: 'rohit.structural@fizahayat.com',
    phone: '+91 98112 33445',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    status: 'In Design Studio',
    assignedProjects: ['proj-ent-101', 'proj-ent-102'],
    typicalResponseTime: '< 30 mins',
    licenseNumber: 'SE/MH/2018/1109',
    bio: 'Lead on rebar detailing, load calculations, slab deflections, and site engineering checks.'
  },
  {
    uid: 'pm-natasha-khan-3',
    name: 'Natasha Khan',
    role: 'Interior Design Lead & Material Specifier',
    specialization: 'Italian Marble, Custom Joinery & Architectural Lighting',
    email: 'natasha.interiors@fizahayat.com',
    phone: '+91 98334 55667',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    status: 'On Site Inspection',
    assignedProjects: ['proj-ent-101', 'proj-ent-103'],
    typicalResponseTime: '< 45 mins',
    licenseNumber: 'IIID/2019/554',
    bio: 'Supervises interior fixtures, veneer selections, 3D visualization reviews, and joinery shop drawings.'
  }
];

// Initial Seed Messages for client demo
export const INITIAL_DIRECT_MESSAGES: ChatMessage[] = [
  {
    id: 'dmsg-101',
    channelId: 'pm-direct',
    senderUid: 'pm-fiza-hayat-1',
    senderName: 'Eng. Fiza Hayat',
    senderRole: 'Principal Architect & PM Lead',
    senderPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    recipientUid: 'client-demouser-1',
    recipientName: 'Client',
    recipientRole: 'Client',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    fileRequestId: 'freq-2026-001',
    fileRequestTitle: 'Balcony Cantilever Rebar & Glass Balustrade Specification',
    priority: 'Normal',
    text: 'Good morning! I have reviewed your updated balcony cantilever brief. Our structural team has completed the Fe500D rebar deflection simulation for the 1.8m extension.',
    attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachmentName: 'FH-BAL-STR-01_Balcony_Overhang_Rebar_Draft.dwg',
    attachmentType: 'dwg',
    attachmentSizeBytes: 2450000,
    readBy: ['client-demouser-1', 'pm-fiza-hayat-1'],
    createdAt: 'Yesterday, 11:30 AM',
    timestamp: Date.now() - 86400000,
    isEncrypted: true
  },
  {
    id: 'dmsg-102',
    channelId: 'pm-direct',
    senderUid: 'client-demouser-1',
    senderName: 'Aarav Sharma',
    senderRole: 'Client',
    recipientUid: 'pm-fiza-hayat-1',
    recipientName: 'Eng. Fiza Hayat',
    recipientRole: 'Principal Architect & PM Lead',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    fileRequestId: 'freq-2026-001',
    fileRequestTitle: 'Balcony Cantilever Rebar & Glass Balustrade Specification',
    priority: 'Urgent',
    text: 'Thank you Eng. Fiza! Could you confirm if the glass balustrade anchor detail requires core-drilling into the waterproof membrane, or will it be side-fascia mounted?',
    readBy: ['pm-fiza-hayat-1'],
    createdAt: 'Yesterday, 02:45 PM',
    timestamp: Date.now() - 72000000,
    isEncrypted: true
  },
  {
    id: 'dmsg-103',
    channelId: 'pm-direct',
    senderUid: 'pm-fiza-hayat-1',
    senderName: 'Eng. Fiza Hayat',
    senderRole: 'Principal Architect & PM Lead',
    senderPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    recipientUid: 'client-demouser-1',
    recipientName: 'Client',
    recipientRole: 'Client',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    priority: 'Normal',
    text: 'Great observation! We specifically designed a heavy-gauge 316 Stainless Steel side-fascia bracket. This ensures the top slab elastomer waterproofing membrane remains 100% untouched and sealed.',
    readBy: ['client-demouser-1', 'pm-fiza-hayat-1'],
    createdAt: 'Today, 09:15 AM',
    timestamp: Date.now() - 14400000,
    isEncrypted: true
  },
  {
    id: 'dmsg-201',
    channelId: 'pm-direct',
    senderUid: 'pm-rohit-verma-2',
    senderName: 'Ar. Rohit Verma',
    senderRole: 'Senior Structural Engineer & BIM Lead',
    senderPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    recipientUid: 'client-demouser-1',
    recipientName: 'Client',
    recipientRole: 'Client',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    priority: 'Site Query',
    text: 'Hi Aarav, the site excavation for the pool foundation is at 3.2m depth. Soil bearing capacity matches the geotechnical borehole test (210 kN/m²). Ready for PCC pouring.',
    attachmentUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?auto=format&fit=crop&w=1200&q=80',
    attachmentName: 'Site_Excavation_Soil_Check_Aug2026.jpg',
    attachmentType: 'jpg',
    attachmentSizeBytes: 3200000,
    readBy: ['client-demouser-1'],
    createdAt: 'Today, 10:45 AM',
    timestamp: Date.now() - 7200000,
    isEncrypted: true
  }
];

// Fallback in-memory storage for active session if Firestore offline
let inMemoryMessages: ChatMessage[] = [...INITIAL_DIRECT_MESSAGES];

/**
 * Subscribe to Real-Time Direct PM Messages via Firestore snapshot
 */
export function subscribeToDirectPMMessages(
  clientUid: string,
  pmUid?: string,
  onUpdate?: (messages: ChatMessage[]) => void,
  onError?: (err: unknown) => void
): () => void {
  try {
    const q = query(
      collection(db, 'direct_pm_messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: ChatMessage[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          } as ChatMessage));

          // Filter for client involvement
          const relevant = fetched.filter(
            m => m.senderUid === clientUid || m.recipientUid === clientUid || m.channelId === 'pm-direct'
          );

          inMemoryMessages = relevant;
          if (onUpdate) onUpdate(relevant);
        } else {
          // If Firestore collection empty, provide seed messages
          if (onUpdate) onUpdate(inMemoryMessages);
        }
      },
      (err) => {
        handleDbError(err, OperationType.GET, 'direct_pm_messages');
        if (onError) onError(err);
        if (onUpdate) onUpdate(inMemoryMessages);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleDbError(err, OperationType.GET, 'direct_pm_messages');
    if (onUpdate) onUpdate(inMemoryMessages);
    return () => {};
  }
}

/**
 * Send a Direct Message to Assigned Project Manager
 */
export async function sendDirectPMMsg(message: ChatMessage): Promise<void> {
  // Update in-memory first for zero-latency local UX
  inMemoryMessages = [...inMemoryMessages.filter(m => m.id !== message.id), message];

  try {
    const docRef = doc(db, 'direct_pm_messages', message.id);
    await setDoc(docRef, {
      ...message,
      timestamp: message.timestamp || Date.now()
    }, { merge: true });
  } catch (err) {
    handleDbError(err, OperationType.WRITE, `direct_pm_messages/${message.id}`);
  }
}

/**
 * Mark messages as read by current user
 */
export async function markDirectMessagesAsRead(messageIds: string[], readerUid: string): Promise<void> {
  inMemoryMessages = inMemoryMessages.map(m => {
    if (messageIds.includes(m.id) && !m.readBy?.includes(readerUid)) {
      return { ...m, readBy: [...(m.readBy || []), readerUid] };
    }
    return m;
  });

  try {
    for (const id of messageIds) {
      const docRef = doc(db, 'direct_pm_messages', id);
      await updateDoc(docRef, {
        readBy: [readerUid, 'pm-fiza-hayat-1', 'pm-rohit-verma-2']
      }).catch(() => {});
    }
  } catch (err) {
    handleDbError(err, OperationType.UPDATE, 'direct_pm_messages');
  }
}

/**
 * Simulate PM Intelligent Contextual Reply with simulated typing delay
 */
export async function simulatePMReply(
  clientMsg: ChatMessage,
  pm: DirectPMMember,
  onReplyCreated?: (reply: ChatMessage) => void
): Promise<ChatMessage> {
  const replyTexts = [
    `Thank you for confirming. I've flagged this with our CAD/BIM station and we are updating the working drawing layer immediately.`,
    `Understood! I will inspect the on-site placement with the site engineer today at 4:00 PM and share photographic verification.`,
    `Noted. The structural deflection calculation conforms strictly to IS 456 Table 23. You can review the updated calculations in your Download Center.`,
    `I have attached the revised specification sheet to your file brief. Please review and provide sign-off when convenient.`,
    `Everything is tracking on schedule for this milestone. Our MEP consultant will review the conduit sleeves before slab casting.`
  ];

  const randomText = replyTexts[Math.floor(Math.random() * replyTexts.length)];

  const replyMsg: ChatMessage = {
    id: `dmsg-pm-reply-${Date.now()}`,
    channelId: 'pm-direct',
    senderUid: pm.uid,
    senderName: pm.name,
    senderRole: pm.role,
    senderPhoto: pm.avatar,
    recipientUid: clientMsg.senderUid,
    recipientName: clientMsg.senderName,
    recipientRole: clientMsg.senderRole,
    projectId: clientMsg.projectId,
    projectTitle: clientMsg.projectTitle,
    fileRequestId: clientMsg.fileRequestId,
    fileRequestTitle: clientMsg.fileRequestTitle,
    priority: clientMsg.priority || 'Normal',
    text: randomText,
    readBy: [pm.uid],
    createdAt: 'Just now',
    timestamp: Date.now(),
    isEncrypted: true
  };

  await sendDirectPMMsg(replyMsg);
  if (onReplyCreated) onReplyCreated(replyMsg);
  return replyMsg;
}
