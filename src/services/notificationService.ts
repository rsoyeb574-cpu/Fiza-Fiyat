import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { ClientNotification, NotificationType } from '../types/enterprise';
import { playNotificationChime } from '../utils/soundEffects';

// Firestore Error Handler conforming to Firebase Integration Skill
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

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
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
  console.warn('Firestore Notification Service:', JSON.stringify(errInfo));
}

// Initial seed notifications representing authentic PM interactions
export const initialClientNotifications: ClientNotification[] = [
  {
    id: 'notif-2026-001',
    clientUid: 'client-demouser-1',
    clientEmail: 'aarav.sharma@example.com',
    clientName: 'Aarav Sharma',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    fileRequestId: 'freq-2026-001',
    fileRequestTitle: 'Balcony Cantilever Rebar & Glass Balustrade Specification',
    type: 'requirement_reviewed',
    title: 'Requirement Brief Reviewed by Principal Architect',
    message: 'Eng. Fiza Hayat has reviewed your structural overhang brief and initiated structural deflection calculations per IS 456 codes.',
    managerName: 'Eng. Fiza Hayat',
    managerRole: 'Principal Architect',
    managerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    managerEmail: 'contact@fizahayat.com',
    priority: 'Urgent',
    read: false,
    actionType: 'open_brief',
    createdAt: '10 mins ago',
    timestamp: Date.now() - 10 * 60 * 1000
  },
  {
    id: 'notif-2026-002',
    clientUid: 'client-demouser-1',
    clientEmail: 'aarav.sharma@example.com',
    clientName: 'Aarav Sharma',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    fileRequestId: 'freq-2026-001',
    fileRequestTitle: 'Balcony Cantilever Rebar & Glass Balustrade Specification',
    type: 'pm_feedback',
    title: 'New Technical Feedback on Balcony Anchorage',
    message: 'Eng. Fiza Hayat: "Side-mounted M16 chemical anchor studs have been specified into the RCC upstand beam, completely preserving the floor deck waterproofing membrane."',
    managerName: 'Eng. Fiza Hayat',
    managerRole: 'Principal Architect',
    managerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    managerEmail: 'contact@fizahayat.com',
    priority: 'High',
    read: false,
    actionType: 'open_brief',
    createdAt: '35 mins ago',
    timestamp: Date.now() - 35 * 60 * 1000
  },
  {
    id: 'notif-2026-003',
    clientUid: 'client-demouser-1',
    clientEmail: 'aarav.sharma@example.com',
    clientName: 'Aarav Sharma',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    fileRequestId: 'freq-2026-002',
    fileRequestTitle: 'Italian Travertine Marble Living Room Render & Material Schedule',
    type: 'requirement_approved',
    title: 'Material Requirement Approved & BIM Render Ready',
    message: 'Rohan Mehta approved your Travertine marble cladding schedule. 4K photorealistic renders and dry-cladding bracket schedules have been attached.',
    managerName: 'Rohan Mehta',
    managerRole: 'BIM 3D Specialist',
    managerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    managerEmail: 'rohan.mehta@fizahayat.com',
    deliverableTitle: 'FH-BAL-STR-01_Balcony_Overhang_Rebar_Draft.dwg',
    deliverableUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    priority: 'Medium',
    read: true,
    actionType: 'open_deliverables',
    createdAt: '2 hours ago',
    timestamp: Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id: 'notif-2026-004',
    clientUid: 'client-demouser-1',
    clientEmail: 'aarav.sharma@example.com',
    clientName: 'Aarav Sharma',
    projectId: 'proj-ent-101',
    projectTitle: 'Grand Azure Luxury Villa & Infinity Pool',
    type: 'project_milestone',
    title: 'Milestone Completed: Foundation & Plinth Beam Casting',
    message: 'Site inspection verified. M25 concrete casting for plinth tie beams and column starter rebars passed 28-day compressive strength cube test.',
    managerName: 'Priya Verma',
    managerRole: 'Structural Engineer',
    managerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    priority: 'Low',
    read: true,
    actionType: 'view_project',
    createdAt: 'Yesterday',
    timestamp: Date.now() - 24 * 60 * 60 * 1000
  }
];

// Local state cache for offline / fallback
let cachedNotifications: ClientNotification[] = [...initialClientNotifications];
const listeners: ((notifications: ClientNotification[]) => void)[] = [];

function notifyLocalListeners() {
  const sorted = [...cachedNotifications].sort((a, b) => b.timestamp - a.timestamp);
  listeners.forEach(cb => cb(sorted));
}

/**
 * Real-time subscription to client notifications with Firestore sync & fallback
 */
export function subscribeToClientNotifications(
  clientUid?: string,
  clientEmail?: string,
  onUpdate?: (notifications: ClientNotification[]) => void
): Unsubscribe {
  if (onUpdate) {
    listeners.push(onUpdate);
    // Emit initial cached state immediately
    const initialList = getFilteredNotifications(clientUid, clientEmail);
    onUpdate(initialList);
  }

  let firestoreUnsub: Unsubscribe = () => {};

  try {
    const colRef = collection(db, 'client_notifications');
    let q = query(colRef);

    if (clientUid) {
      q = query(colRef, where('clientUid', '==', clientUid));
    }

    firestoreUnsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          } as ClientNotification));

          // Merge remote documents into cache
          remoteList.forEach(rem => {
            const idx = cachedNotifications.findIndex(c => c.id === rem.id);
            if (idx >= 0) {
              cachedNotifications[idx] = rem;
            } else {
              cachedNotifications.push(rem);
            }
          });

          notifyLocalListeners();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'client_notifications');
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'client_notifications');
  }

  return () => {
    firestoreUnsub();
    if (onUpdate) {
      const idx = listeners.indexOf(onUpdate);
      if (idx >= 0) listeners.splice(idx, 1);
    }
  };
}

function getFilteredNotifications(clientUid?: string, clientEmail?: string): ClientNotification[] {
  let list = cachedNotifications;
  if (clientUid || clientEmail) {
    list = cachedNotifications.filter(n => 
      !n.clientUid || 
      n.clientUid === clientUid || 
      n.clientEmail === clientEmail ||
      n.clientEmail === 'aarav.sharma@example.com' ||
      n.clientUid === 'client-demouser-1'
    );
  }
  return [...list].sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Send a new real-time notification (e.g. from PM review, approval, feedback)
 */
export async function sendClientNotification(notification: Omit<ClientNotification, 'id' | 'timestamp' | 'createdAt'> & { id?: string; createdAt?: string }): Promise<ClientNotification> {
  const newNotif: ClientNotification = {
    ...notification,
    id: notification.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    read: false,
    createdAt: notification.createdAt || 'Just now',
    timestamp: Date.now()
  };

  // 1. Update local cache immediately
  cachedNotifications = [newNotif, ...cachedNotifications.filter(n => n.id !== newNotif.id)];
  notifyLocalListeners();

  // 2. Play subtle chime according to notification type
  if (newNotif.type === 'requirement_approved') {
    playNotificationChime('approved');
  } else if (newNotif.type === 'requirement_reviewed') {
    playNotificationChime('review');
  } else if (newNotif.type === 'pm_feedback') {
    playNotificationChime('feedback');
  } else {
    playNotificationChime('default');
  }

  // 3. Persist to Firestore
  try {
    const docRef = doc(db, 'client_notifications', newNotif.id);
    await setDoc(docRef, newNotif, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `client_notifications/${newNotif.id}`);
  }

  return newNotif;
}

/**
 * Mark single notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  cachedNotifications = cachedNotifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  notifyLocalListeners();

  try {
    const docRef = doc(db, 'client_notifications', notificationId);
    await updateDoc(docRef, { read: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `client_notifications/${notificationId}`);
  }
}

/**
 * Mark all notifications as read for client
 */
export async function markAllNotificationsAsRead(clientUid?: string): Promise<void> {
  cachedNotifications = cachedNotifications.map(n => ({ ...n, read: true }));
  notifyLocalListeners();

  try {
    const colRef = collection(db, 'client_notifications');
    let q = query(colRef);
    if (clientUid) {
      q = query(colRef, where('clientUid', '==', clientUid));
    }
    const snap = await getDocs(q);
    const updates = snap.docs.map(d => updateDoc(doc(db, 'client_notifications', d.id), { read: true }));
    await Promise.allSettled(updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, 'client_notifications');
  }
}

/**
 * Delete a notification
 */
export async function deleteClientNotification(notificationId: string): Promise<void> {
  cachedNotifications = cachedNotifications.filter(n => n.id !== notificationId);
  notifyLocalListeners();

  try {
    const docRef = doc(db, 'client_notifications', notificationId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `client_notifications/${notificationId}`);
  }
}

/**
 * Clear all notifications
 */
export async function clearAllClientNotifications(clientUid?: string): Promise<void> {
  cachedNotifications = [];
  notifyLocalListeners();

  try {
    const colRef = collection(db, 'client_notifications');
    let q = query(colRef);
    if (clientUid) {
      q = query(colRef, where('clientUid', '==', clientUid));
    }
    const snap = await getDocs(q);
    const deletes = snap.docs.map(d => deleteDoc(doc(db, 'client_notifications', d.id)));
    await Promise.allSettled(deletes);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, 'client_notifications');
  }
}
