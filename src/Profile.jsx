import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { updateProfile } from "firebase/auth";

export default function Profile({ user }) {
  const [nickname, setNickname] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNick = localStorage.getItem("araz_nickname") || "";
    setNickname(user?.displayName || savedNick || "");
  }, [user]);

  const save = async () => {
    localStorage.setItem("araz_nickname", nickname);
    try {
      if (auth?.currentUser) await updateProfile(auth.currentUser, { displayName: nickname });
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="card">
      <h2 className="card-title">Profilim</h2>
      <div className="card-meta">{user?.email || "Misafir"}</div>

      <label className="field-label">
        Nickname
        <input
          className="text-input"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="örn: Arazlı İdil"
        />
      </label>

      <button className="primary-btn" onClick={save}>Kaydet</button>
      {saved && <div className="login-footer">Kaydedildi ✅</div>}
    </div>
  );
}
