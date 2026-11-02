import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase.native';
import { ALLOWED_DOMAIN, googleClientIds } from '../config/env';
import { toFriendlyError } from '../utils/errors';

WebBrowser.maybeCompleteAuthSession();


export function useGoogleSignIn({ onError }) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    ...googleClientIds,
    selectAccount: true,
    extraParams: { hd: ALLOWED_DOMAIN },
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      const idToken = response.params?.id_token;
      if (!idToken) return onError('Google did not return a valid token. Please try again.');
      signInWithCredential(auth, GoogleAuthProvider.credential(idToken)).catch((e) =>
        onError(toFriendlyError(e))
      );
    } else if (response.type === 'error') {
      onError('Google sign-in failed. Please try again.');
    } else if (response.type === 'cancel' || response.type === 'dismiss') {
      onError(null);
    }
  }, [response]);

  const signIn = async () => {
    try {
      await promptAsync();
    } catch (e) {
      onError(toFriendlyError(e));
    }
  };

  return { signIn, ready: !!request };
}
