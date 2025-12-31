import React, { useState } from "react";

export default function Profile({ user, nickname, setNickname, followCounts, setFollowCounts }) {
  const [localNick, setLocalNick] = useState(nickname || "");

  const saveNick = () => {
    setNickname(localNick.trim());
  };

  return (
    <div className="stack">
      <div className="card">
        <h2 className="card-title">Profil</h2>
        <div className="meta">{user?.email || "Misafir"}</div>

        <div className="stats">
          <div className="stat">
            <div className="stat-num">{followCounts.followers}</div>
            <div className="stat-lbl">Takipçi</div>
          </div>
          <div className="stat">
            <div className="stat-num">{followCounts.following}</div>
            <div className="stat-lbl">Takip</div>
          </div>
        </div>

        <label className="label">Nickname</label>
        <input
          className="input"
          value={localNick}
          onChange={(e) => setLocalNick(e.target.value)}
          placeholder="örn: Arazlı İdil"
        />
        <button className="btn" onClick={saveNick} type="button">Kaydet</button>

        <div className="hint">
          Takip/Takipçi şu an demo sayaç (backend bağlayınca gerçek olacak).
        </div>

        {/* İstersen geçici test için sayaç artır/azalt */}
        <div className="row">
          <button
            className="ghost-btn"
            type="button"
            onClick={() => setFollowCounts((p) => ({ ...p, followers: Math.max(0, p.followers - 1) }))}
          >
            - Takipçi
          </button>
          <button
            className="ghost-btn"
            type="button"
            onClick={() => setFollowCounts((p) => ({ ...p, followers: p.followers + 1 }))}
          >
            + Takipçi
          </button>
        </div>
      </div>
    </div>
  );
}
