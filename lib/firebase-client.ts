import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

// These are public Firebase Web App settings. Environment variables can override
// them in Vercel; empty/example placeholder values fall back to the supplied config.
function envOr(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && !value.startsWith('YOUR_') && !value.includes('YOUR_PROJECT') ? value : fallback;
}

const firebaseConfig = {
  apiKey: envOr('NEXT_PUBLIC_FIREBASE_API_KEY', 'AIzaSyBgbixws2rf6VdqjQATVwZsKg0lgiqy0xI'),
  authDomain: envOr('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'ordog-fizetes.firebaseapp.com'),
  databaseURL: envOr('NEXT_PUBLIC_FIREBASE_DATABASE_URL', 'https://ordog-fizetes-default-rtdb.europe-west1.firebasedatabase.app'),
  projectId: envOr('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'ordog-fizetes'),
  storageBucket: envOr('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'ordog-fizetes.firebasestorage.app'),
  messagingSenderId: envOr('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '672089263660'),
  appId: envOr('NEXT_PUBLIC_FIREBASE_APP_ID', '1:672089263660:web:3797a2fc935c63a0464b89'),
  measurementId: envOr('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', 'G-V9Z9LYT0KL'),
};

let clientApp: FirebaseApp | undefined;
let clientAuth: Auth | undefined;

/** Initialize Firebase only in the browser, never while Next.js pre-renders pages. */
export function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('A Firebase bejelentkezés csak a böngészőben indítható el.');
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.apiKey.startsWith('AIza')) {
    throw new Error('Hiányzó vagy hibás Firebase API-kulcs. Ellenőrizd a Vercel környezeti változóit.');
  }
  if (!firebaseConfig.projectId || !firebaseConfig.authDomain || !firebaseConfig.appId) {
    throw new Error('Hiányos Firebase konfiguráció. Ellenőrizd a Vercel NEXT_PUBLIC_FIREBASE_* változóit.');
  }

  if (!clientApp) {
    clientApp = getApps().some((app) => app.name === '[DEFAULT]') ? getApp() : initializeApp(firebaseConfig);
  }
  if (!clientAuth) clientAuth = getAuth(clientApp);
  return clientAuth;
}
