import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWLNGltDuBs5oZ7LXZwEOCUtHWx7R_d9Q",
  authDomain: "nexuscrm-4d64f.firebaseapp.com",
  projectId: "nexuscrm-4d64f",
  storageBucket: "nexuscrm-4d64f.firebasestorage.app",
  messagingSenderId: "219706995000",
  appId: "1:219706995000:web:b008796542a021b3eb91cd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;