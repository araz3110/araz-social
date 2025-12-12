// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIpxj1Pg9hkafJKdgVYa3xWEPFktK0zQA",
  authDomain: "araz2026-9cbec.firebaseapp.com",
  projectId: "araz2026-9cbec",
  storageBucket: "araz2026-9cbec.firebasestorage.app",
  messagingSenderId: "119224732188",
  appId: "1:119224732188:web:c0855cd5d2c7f440afadd9",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;