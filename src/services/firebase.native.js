import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app } from './firebaseApp';


try {
  authInstance = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
