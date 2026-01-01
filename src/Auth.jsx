import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import "./App.css";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nickname, setNickname] = useState("");

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    setErr("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (e) {
      setErr(e?.message || "Giriş hatası");
    } finally {
      setBusy(false);
    }
  };

  const onRegister = async () => {
    setErr("");
    if (!name.trim() || !surname.trim() || !nickname.trim()) {
      setErr("İsim, soyisim ve nickname zorunlu.");
      return;
    }
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await updateProfile(cred.user, { displayName: nickname.trim() });

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        name: name.trim(),
        surname: surname.trim(),
        nickname: nickname.trim(),
        createdAt: serverTimestamp(),
        followersCount: 0,
        followingCount: 0,
      });
    } catch (e) {
      setErr(e?.message || "Kayıt hatası");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">ARAZ</div>
        <div className="auth-sub">Zihin haritaları, takas ve sosyal paylaşım</div>

        <div className="auth-tabs">
          <button className={`pill ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Giriş Yap
          </button>
          <button className={`pill ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>
            Kayıt Ol
          </button>
        </div>

        {mode === "register" && (
          <>
            <label>İsim</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="İsim" />

            <label>Soyisim</label>
            <input value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Soyisim" />

            <label>Nickname</label>
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Profilde gözükecek" />
          </>
        )}

        <label>E-posta</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" />

        <label>Şifre (en az 6 karakter)</label>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Şifre" />

        {err && <div className="err">{err}</div>}

        {mode === "login" ? (
          <button className="primary" disabled={busy} onClick={onLogin}>
            {busy ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        ) : (
          <button className="primary" disabled={busy} onClick={onRegister}>
            {busy ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
          </button>
        )}

        <div className="auth-foot">31 Aralık’ta ARAZ dünyası herkese açılıyor.</div>
      </div>
    </div>
  );
}