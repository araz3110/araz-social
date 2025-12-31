import React, { useEffect, useState } from "react";
import "./App.css";
import Home from "./Home.jsx";
import logo from "./assets/logo.png";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("E-posta veya şifre hatalı.");
      } else if (code === "auth/user-not-found") {
        setError("Bu e-posta ile kayıt bulunamadı.");
      } else if (code === "auth/too-many-requests") {
        setError("Çok fazla deneme yapıldı. Bir süre sonra tekrar deneyin.");
      } else if (code === "auth/unauthorized-domain") {
        setError("Vercel domaini Firebase tarafından yetkilendirilmemiş (Auth > Authorized domains).");
      } else {
        setError("Giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        setError("Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.");
      } else if (code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi.");
      } else if (code === "auth/weak-password") {
        setError("Şifre çok zayıf. En az 6 karakter olmalı.");
      } else if (code === "auth/unauthorized-domain") {
        setError("Vercel domaini Firebase tarafından yetkilendirilmemiş (Auth > Authorized domains).");
      } else {
        setError("Kayıt yapılamadı. Lütfen tekrar deneyin.");
      }
    }
  };

  if (loading) {
    return (
      <div className="fullscreen-bg">
        <div className="loading-text">ARAZ yükleniyor...</div>
      </div>
    );
  }

  if (user) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="fullscreen-bg">
      <div className="login-card">
        <img src={logo} alt="ARAZ logo" className="login-logo" />
        <h1 className="login-title">ARAZ</h1>
        <p className="login-subtitle">
          Zihin haritaları, takas ve paylaşım için sosyal platform.
        </p>

        <div className="login-toggle">
          <button
            type="button"
            className={`toggle-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            className={`toggle-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            Kayıt Ol
          </button>
        </div>

        <form
          onSubmit={mode === "login" ? handleLogin : handleRegister}
          className="login-form"
        >
          <label className="field-label">
            E-posta
            <input
              type="email"
              className="text-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="field-label">
            Şifre (en az 6 karakter)
            <input
              type="password"
              className="text-input"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </label>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="primary-btn">
            {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <p className="login-footer">ARAZ dünyasına hoş geldin ✨</p>
      </div>
    </div>
  );
}
