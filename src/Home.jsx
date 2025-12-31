import React, { useEffect, useMemo, useState } from "react";
import "./App.css"; // tek css kullan
const logo = "/IMG-20251015-WA0007.png"; // public içindeki logonun adı buysa

export default function Home({ user, onLogout }) {
  const [tab, setTab] = useState("feed"); // feed | trade | minds | profile

  // Tab'ı URL hash ile tut
  useEffect(() => {
    const valid = ["feed", "trade", "minds", "profile"];
    const fromHash = window.location.hash?.replace("#", "");
    if (fromHash && valid.includes(fromHash)) {
      setTab(fromHash);
    } else {
      window.location.hash = "#feed";
      setTab("feed");
    }
    const onHash = () => {
      const h = window.location.hash?.replace("#", "");
      if (h && valid.includes(h)) setTab(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const title = useMemo(() => {
    if (tab === "feed") return "Akış";
    if (tab === "trade") return "Takas";
    if (tab === "minds") return "Zihinlerim";
    return "Profilim";
  }, [tab]);

  const go = (next) => {
    setTab(next);
    window.location.hash = `#${next}`;
  };

  const fabLabel = useMemo(() => {
    if (tab === "feed") return "Gönderi";
    if (tab === "trade") return "Takas";
    if (tab === "minds") return "Zihin";
    return "Düzenle";
  }, [tab]);

  const onFab = () => {
    // Şimdilik sadece örnek. Sonra her tab'a özel açılır pencere ekleriz.
    alert(`${fabLabel} ekle (sonra bunu form yapacağız)`);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src={logo} alt="ARAZ" />
          <div className="brand-text">
            <div className="brand-name">ARAZ</div>
            <div className="brand-sub">
              Zihin haritaları, takas ve sosyal paylaşım platformu.
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Çıkış
        </button>
      </header>

      <main className="content">
        <h1 className="page-title">{title}</h1>

        {tab === "feed" && <FeedView user={user} />}
        {tab === "trade" && <TradeView user={user} />}
        {tab === "minds" && <MindsView user={user} />}
        {tab === "profile" && <ProfileView user={user} />}
      </main>

      {/* + Butonu: altta sağda, nav ile çakışmaz */}
      <button className="fab" onClick={onFab} aria-label="Ekle">
        +
      </button>

      <nav className="bottom-nav">
        <button
          className={`nav-btn ${tab === "feed" ? "active" : ""}`}
          onClick={() => go("feed")}
        >
          Akış
        </button>
        <button
          className={`nav-btn ${tab === "trade" ? "active" : ""}`}
          onClick={() => go("trade")}
        >
          Takas
        </button>
        <button
          className={`nav-btn ${tab === "minds" ? "active" : ""}`}
          onClick={() => go("minds")}
        >
          Zihinlerim
        </button>
        <button
          className={`nav-btn ${tab === "profile" ? "active" : ""}`}
          onClick={() => go("profile")}
        >
          Profilim
        </button>
      </nav>
    </div>
  );
}

/* =========================
   Tek dosya içi sayfalar
   (Şimdilik temel görünüm.
   Eski kodlarını bunların içine gömeceğiz.)
========================= */

function FeedView({ user }) {
  return (
    <>
      <div className="hint-card">
        <div className="hint-title">Hoş geldin 👋</div>
        <div className="hint-text">
          + ile gönderi ekle. Karttaki <b>@nickname</b>’e dokunarak profili
          açabilirsin.
        </div>
      </div>

      <div className="card">
        <div className="muted">Henüz gönderi yok. + ile ilk gönderini ekleyebilirsin.</div>
      </div>
    </>
  );
}

function TradeView({ user }) {
  return (
    <div className="card">
      <div className="card-title">Takas</div>
      <div className="muted">Takas ilanları burada görünecek.</div>
    </div>
  );
}

function MindsView({ user }) {
  return (
    <div className="card">
      <div className="card-title">Zihin Haritalarım</div>
      <div className="muted">Zihin haritaların burada görünecek.</div>
    </div>
  );
}

function ProfileView({ user }) {
  return (
    <>
      <div className="profile-card">
        <div className="profile-row">
          <div className="avatar">A</div>
          <div className="profile-meta">
            <div className="profile-name">ARAZ</div>
            <div className="profile-nick">@arazsocial</div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <div className="stat-num">0</div>
            <div className="stat-label">Takipçi</div>
          </div>
          <div className="stat">
            <div className="stat-num">0</div>
            <div className="stat-label">Takip</div>
          </div>
          <div className="stat">
            <div className="stat-num">0</div>
            <div className="stat-label">İçerik</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Premium plan yakında ✨</div>
        <div className="muted">
          ARAZ’da öne çıkan profiller ve özel alanlar açılacak. Şimdilik keşfet,
          üret, paylaş.
        </div>
      </div>
    </>
  );
}