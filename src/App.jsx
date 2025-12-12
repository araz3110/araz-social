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

function App() {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Giriş yapılamadı. (Şimdilik test modunda devam edebilirsin.)");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Kayıt yapılamadı. (Şimdilik test modunda devam edebilirsin.)");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // Firebase tam oturana kadar demo kullanıcı
  const handleTestContinue = () => {
    setUser({
      email: "ornek@araz.app",
      displayName: "ARAZ Deneme Kullanıcısı",
      uid: "demo-user",
    });
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
              required
            />
          </label>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="primary-btn">
            {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <button
          type="button"
          className="secondary-btn"
          onClick={handleTestContinue}
        >
          Yapılandırma Olmadan Test Et
        </button>

        <p className="login-footer">
          31 Aralık'ta ARAZ dünyası herkese açılıyor. ✨
        </p>
      </div>
    </div>
  );
}

export default App;