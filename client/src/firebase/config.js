import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Live StaffSync Firebase Project Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCXNZbhb9BrdQx3_SFgG3fymunxjdvqED4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'staffsync-33c11.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'staffsync-33c11',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'staffsync-33c11.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '56036220384',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:56036220384:web:99238f66af2d381463df85'
};

// Check if valid Firebase configuration has been supplied
export const isFirebaseConfigured = () => {
  return true; // Live Firebase project staffsync-33c11 is actively configured
};

// Initialize Firebase App singleton safely
let app;
let auth;
let db;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('Firebase initialization notice:', err.message);
}

export { app, auth, db };
export default firebaseConfig;
