import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase"; // sende firebase.js / firebase.jsx ise yolu düzelt
import Auth from "./Auth.jsx";
import Home from "./Home.jsx";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [boot, setBoot] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setBoot(false);
    });
    return () => unsub();
  }, []);

  const onLogout = async () => {
    await signOut(auth);
    setUser(null);
    window.location.hash = "#feed";
  };

  if (boot) {
    return (
      <div className="center-loader">
        <div className="loader-card">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthed={(u) => setUser(u)} />;
  }

  return <Home user={user} onLogout={onLogout} />;
}