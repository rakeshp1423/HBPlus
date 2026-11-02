import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app } from './firebaseApp';

// On web, Firebase keeps the session in IndexedDB and refreshes tokens itself.
export const auth = getAuth(app);
export const db = getFirestore(app);
