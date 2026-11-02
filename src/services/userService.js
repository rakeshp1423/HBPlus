import {
  collection, doc, getDoc, getDocs, limit, orderBy, query,
  serverTimestamp, setDoc, updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export const ROLES = { ADMIN: 'admin', USER: 'user' };


export async function syncUserProfile(fbUser) {
  const ref = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const profile = {
      email: fbUser.email,
      displayName: fbUser.displayName || '',
      photoURL: fbUser.photoURL || '',
      role: ROLES.USER,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
    return { id: fbUser.uid, ...profile };
  }

  await updateDoc(ref, {
    displayName: fbUser.displayName || '',
    photoURL: fbUser.photoURL || '',
    lastLoginAt: serverTimestamp(),
  });
  return { id: fbUser.uid, ...snap.data() };
}

export async function fetchAllUsers(max = 50) {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
