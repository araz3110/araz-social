import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && onLogin) onLogin(user);
    });
    return () => unsub();
  }, [onLogin]);

  const friendlyError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Geçersiz e-posta adresi.";
      case "auth/user-not-found":
        return "Bu e-posta ile kayıt bulunamadı.";
      case "auth/wrong-password":
        return "Şifre hatalı.";
      case "auth/email-already-in-use":
        return "Bu e-posta zaten kayıtlı.";
      case "auth/weak-password":
        return "Şifre en az 6 karakter olmalı.";
      case "auth/network-request-failed":
        return "İnternet bağlantısı sorunu var gibi görünüyor.";
      default:
        return `Hata: ${code || "Bilinmeyen hata"}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("E-posta ve şifre boş olamaz.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (onLogin) onLogin(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (onLogin) onLogin(cred.user);
      }
    } catch (err) {
      setError(friendlyError(err?.code));
      console.error("AUTH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ARAZ</h1>
          <p>Zihin haritaları, takas ve paylaşım için sosyal platform.</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
            disabled={loading}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
            disabled={loading}
          >
            Kayıt Ol
          </button>
        </div>

        {error ? <div className="auth-error">{error}</div> : null}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>E-posta</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@mail.com"
            autoComplete="email"
          />

          <label>Şifre (en az 6 karakter)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
          />

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Bekle..." : mode === "register" ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </form>

        <div className="auth-foot">
          <small>31 Aralık’ta ARAZ dünyası herkese açılıyor. ✨</small>
        </div>
      </div>
    </div>
  );
}