import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.FIRE_BASE_API_KEY,
    authDomain: 'fixit-pictures.firebaseapp.com',
    projectId: 'fixit-pictures',
    storageBucket: 'fixit-pictures.firebasestorage.app',
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);