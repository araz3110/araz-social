import React, { useMemo, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase"; // sende firebase.js / firebase.jsx ise yolu düzelt
import "./App.css";
import logo from "./assets/logo.png";

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Kayıt sonrası profil tamamla
  const [showProfile, setShowProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");

  const title = useMemo(
    () => (mode === "login" ? "Giriş" : "Kayıt Ol"),
    [mode]
  );

  const toggle = () => {
    setErr("");
    setMode((m) => (m === "login" ? "register" : "login"));
  };

  const normalizeNick = (v) =>
    v
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^\w.]/g, "");

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      onAuthed?.(res.user);
    } catch (error) {
      setErr(error?.message || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);

      // Kayıt olur olmaz profil tamamlama ekranı aç
      setShowProfile(true);

      // Not: burada onAuthed çağırmıyoruz, önce isim/nick kaydedilecek
    } catch (error) {
      setErr(error?.message || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setErr("");
    const n = normalizeNick(nickname);

    if (!fullName.trim()) return setErr("İsim Soyisim yaz.");
    if (!n) return setErr("Nickname yaz.");
    if (n.length < 3) return setErr("Nickname en az 3 karakter olsun.");

    const u = auth.currentUser;
    if (!u) return setErr("Oturum bulunamadı. Tekrar giriş yap.");

    setLoading(true);
    try {
      // Auth profile
      await updateProfile(u, { displayName: fullName.trim() });

      // Firestore user doc
      await setDoc(
        doc(db, "users", u.uid),
        {
          uid: u.uid,
          email: u.email || "",
          fullName: fullName.trim(),
          nickname: n,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setShowProfile(false);
      onAuthed?.(u);
    } catch (error) {
      setErr(error?.message || "Kaydedilemedi. (Yetki / Firestore olabilir)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <img className="auth-logo" src={logo} alt="ARAZ" />

        <div className="auth-title">ARAZ</div>
        <div className="auth-sub">
          Zihin haritaları, takas ve paylaşım için sosyal platform.
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Giriş
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
            type="button"
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
          <label className="field-label">E-posta</label>
          <input
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@mail.com"
            type="email"
            autoComplete="email"
            required
          />

          <label className="field-label">Şifre (en az 6 karakter)</label>
          <input
            className="field"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="******"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={6}
            required
          />

          {err ? <div className="auth-error">{err}</div> : null}

          <button className="primary-btn" disabled={loading} type="submit">
            {loading ? "Bekle..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </button>

          <button className="ghost-btn" type="button" onClick={toggle}>
            {mode === "login"
              ? "Hesabın yok mu? Kayıt ol"
              : "Zaten hesabın var mı? Giriş yap"}
          </button>

          <div className="auth-foot">
            31 Aralık’ta ARAZ dünyası herkese açılıyor. ✨
          </div>
        </form>
      </div>

      {/* Profil tamamla modal */}
      {showProfile && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-title">Profilini tamamla</div>
            <div className="modal-sub">
              İnsanların seni bulabilmesi için isim + nickname gerekli.
            </div>

            <input
              className="field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="İsim Soyisim"
            />

            <input
              className="field"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="nickname (örn: idilturan)"
            />

            {err ? <div className="auth-error">{err}</div> : null}

            <button className="primary-btn" onClick={saveProfile} disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>

            <button
              className="ghost-btn"
              type="button"
              onClick={() => setShowProfile(false)}
              disabled={loading}
            >
              Şimdi değil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}