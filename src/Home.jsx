import React, { useEffect, useMemo, useState } from "react";
import Feed from "./Feed.jsx";
import Trade from "./Trade.jsx";
import Minds from "./Minds.jsx";
import Profile from "./Profile.jsx";
import logo from "./assets/logo.png";
import "./home.css";

export default function Home({ user, onLogout }) {
  // Varsayılan: Akış
  const [tab, setTab] = useState("feed"); // feed | trade | minds | profile

  // Tab'ı URL hash ile tut (paylaşınca aynı sayfaya açılır)
  useEffect(() => {
    const fromHash = window.location.hash?.replace("#", "");
    if (fromHash && ["feed", "trade", "minds", "profile"].includes(fromHash)) {
      setTab(fromHash);
    } else {
      window.location.hash = "#feed";
      setTab("feed");
    }

    const onHash = () => {
      const h = window.location.hash?.replace("#", "");
      if (h && ["feed", "trade", "minds", "profile"].includes(h)) setTab(h);
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

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src={logo} alt="ARAZ" />
          <div className="brand-text">
            <div className="brand-name">ARAZ</div>
            <div className="brand-sub">
              Zihin haritaları, takas ve sosyal paylaşım
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Çıkış
        </button>
      </header>

      <main className="content">
        <h1 className="page-title">{title}</h1>

        {tab === "feed" && <Feed user={user} />}
        {tab === "trade" && <Trade user={user} />}
        {tab === "minds" && <Minds user={user} />}
        {tab === "profile" && <Profile user={user} />}
      </main>

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
