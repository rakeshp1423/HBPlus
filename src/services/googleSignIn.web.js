import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase.web';
import { ALLOWED_DOMAIN } from '../config/env';
import { toFriendlyError } from '../utils/errors';


export function useGoogleSignIn({ onError }) {
  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account', hd: ALLOWED_DOMAIN });
      await signInWithPopup(auth, provider);
    } catch (e) {
      onError(toFriendlyError(e));
    }
  };
  return { signIn, ready: true };
}
