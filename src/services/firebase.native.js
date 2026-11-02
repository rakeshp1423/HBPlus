import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app } from './firebaseApp';

// Persist the Firebase session across app restarts. Firebase manages the
// ID/refresh tokens itself; we never copy tokens into our own storage.
let authInstance;
try {
  authInstance = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  authInstance = getAuth(app); // already initialised (fast refresh)
}

export const auth = authInstance;
export const db = getFirestore(app);
