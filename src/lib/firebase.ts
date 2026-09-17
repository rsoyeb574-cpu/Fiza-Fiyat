import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Silence benign internal gRPC idle stream disconnect messages
setLogLevel('silent');

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Initialize Firestore with auto-detect long-polling for iframe and proxy stability
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId || undefined);
} catch {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
}

export const db = firestoreInstance;

export default app;
