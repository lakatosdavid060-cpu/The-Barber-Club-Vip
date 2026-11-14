import { getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBgbixws2rf6VdqJQATVwZsKg0lgiqy0xI',
  authDomain: 'ordog-fizetes.firebaseapp.com',
  databaseURL: 'https://ordog-fizetes-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'ordog-fizetes',
  storageBucket: 'ordog-fizetes.firebasestorage.app',
  messagingSenderId: '672089263660',
  appId: '1:672089263660:web:3797a2fc935c63a0464b89',
  measurementId: 'G-V9Z9LYT0KL',
};

// Szándékosan lusta inicializálás: a Firebase Auth nem indul el a szerveroldali előrendereléskor.
export function getFirebaseAuth(): Auth {
  const app = getApps().find((item) => item.name === '[DEFAULT]') || initializeApp(config);
  return getAuth(app);
}
