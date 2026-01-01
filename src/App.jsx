import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Auth from "./Auth.jsx";
import Home from "./Home.jsx";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const onLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <div className="center">Yükleniyor…</div>;
  return user ? <Home user={user} onLogout={onLogout} /> : <Auth />;
}