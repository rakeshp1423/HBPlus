/** Maps Firebase/Google errors to short user-facing messages. Returns null for silent cancellations. */
export function toFriendlyError(e) {
  const code = e?.code || '';
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
  if (code === 'auth/popup-blocked') return 'Your browser blocked the sign-in popup. Allow popups for this site and try again.';
  if (code === 'auth/network-request-failed') return 'Network error. Check your connection and try again.';
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a moment and try again.';
  if (code === 'auth/account-exists-with-different-credential') return 'This email is already linked to a different sign-in method.';
  return 'Something went wrong while signing in. Please try again.';
}
