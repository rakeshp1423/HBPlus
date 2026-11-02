import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/env';

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
