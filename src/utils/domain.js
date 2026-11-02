
import { ALLOWED_DOMAIN } from '../config/env';

// Temporary personal Gmail exception for development only.
const DEV_EMAIL = 'rakeshkumarpatra1423@gmail.com';

export function isAllowedEmail(email) {
  if (typeof email !== 'string') return false;

  const value = email.trim().toLowerCase();

  // Personal Gmail is allowed only in Expo development mode.
  if (__DEV__ && value === DEV_EMAIL) {
    return true;
  }

  const at = value.lastIndexOf('@');

  if (at < 1) return false;

  return value.slice(at + 1) === ALLOWED_DOMAIN;
}
