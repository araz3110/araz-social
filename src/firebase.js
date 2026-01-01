import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIpxj1Pg9hkafJKdgVYa3xWEPFktK0zQA",
  authDomain: "araz2026-9cbec.firebaseapp.com",
  projectId: "araz2026-9cbec",
  storageBucket: "araz2026-9cbec.firebasestorage.app",
  messagingSenderId: "119224732188",
  appId: "1:119224732188:web:c0855cd5d2c7f440afadd9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;