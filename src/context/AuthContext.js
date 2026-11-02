
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { onAuthStateChanged, signOut } from 'firebase/auth';

import { auth } from '../services/firebase';
import { useGoogleSignIn } from '../services/googleSignIn';
import { syncUserProfile } from '../services/userService';
import { isAllowedEmail } from '../utils/domain';
import { DOMAIN_ERROR_MESSAGE } from '../config/env';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  const handleSignInError = useCallback((message) => {
    setSigningIn(false);

    if (message) {
      setError(message);
    }
  }, []);

  const google = useGoogleSignIn({
    onError: handleSignInError,
  });

  // Single source of truth for Google authentication.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setProfile(null);
        setInitializing(false);
        return;
      }

      // Validate account domain and email verification.
      if (!isAllowedEmail(fbUser.email) || !fbUser.emailVerified) {
        await signOut(auth).catch(() => {});

        setUser(null);
        setProfile(null);
        setError(DOMAIN_ERROR_MESSAGE);
        setSigningIn(false);
        setInitializing(false);

        return;
      }

      try {
        // Load or create the user's Firestore profile.
        const p = await syncUserProfile(fbUser);

        setProfile(p);
        setUser(fbUser);
        setError(null);
      } catch (e) {
        // Log the actual Firebase error for diagnosis.
        console.error(
          '[Auth] syncUserProfile failed:',
          e?.code,
          e?.message,
          e
        );

        await signOut(auth).catch(() => {});

        setUser(null);
        setProfile(null);

        setError(
          e?.code === 'permission-denied' ||
          e?.code === 'firestore/permission-denied'
            ? 'Firestore denied access to your profile. Check the development Firestore rules.'
            : 'Could not load your account. Check your connection and try again.'
        );
      } finally {
        setSigningIn(false);
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setSigningIn(true);

    await google.signIn();

    // Spinner is cleared by onAuthStateChanged or handleSignInError.
  }, [google]);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      role: profile?.role ?? null,
      isAdmin: profile?.role === 'admin',
      initializing,
      signingIn,
      error,
      clearError: () => setError(null),
      signInWithGoogle,
      logout,
    }),
    [
      user,
      profile,
      initializing,
      signingIn,
      error,
      signInWithGoogle,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return ctx;
};
