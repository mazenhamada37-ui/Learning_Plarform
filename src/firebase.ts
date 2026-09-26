import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'gen-lang-client-0229681775',
  appId: '1:34575801530:web:096a1b996a2248edaff683',
  apiKey: 'AIzaSyBgdkDJ_U6jAUeOa6a2bl2qaaZj0c0EYVo',
  authDomain: 'gen-lang-client-0229681775.firebaseapp.com',
  storageBucket: 'gen-lang-client-0229681775.firebasestorage.app',
  messagingSenderId: '34575801530',
  firestoreDatabaseId: 'ai-studio-eduplatform-32384904-1616-4a5a-97d1-120d6e0966ca',
  measurementId: '',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export { app, firebaseConfig };
