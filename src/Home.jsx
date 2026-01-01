import React, { useEffect, useMemo, useState } from "react";
import logo from "./assets/logo.png";
import "./home.css";

import { db } from "./firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

const ADMIN_EMAIL = "araznarut@gmail.com";

export default function Home({ user, onLogout }) {
  // TAB
  const [tab, setTab] = useState("feed"); // feed | trade | minds | profile

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

  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const title = useMemo(() => {
    if (tab === "feed") return "Akış";
    if (tab === "trade") return "Takas";
    if (tab === "minds") return "Zihinlerimin";
    return "Profilim";
  }, [tab]);

  const go = (next) => {
    setTab(next);
    window.location.hash = `#${next}`;
  };

  // DATA
  const [feedItems, setFeedItems] = useState([]);
  const [tradeItems, setTradeItems] = useState([]);
  const [mindItems, setMindItems] = useState([]);

  useEffect(() => {
    const qFeed = query(collection(db, "feed"), orderBy("createdAt", "desc"));
    const qTrade = query(collection(db, "trade"), orderBy("createdAt", "desc"));
    const qMinds = query(collection(db, "minds"), orderBy("createdAt", "desc"));

    const unsub1 = onSnapshot(qFeed, (snap) => {
      setFeedItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsub2 = onSnapshot(qTrade, (snap) => {
      setTradeItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsub3 = onSnapshot(qMinds, (snap) => {
      setMindItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  // MODAL (prompt yerine)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("feed"); // feed | trade | minds
  const [text, setText] = useState("");
  const [mindTitle, setMindTitle] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const openComposer = (type) => {
    setModalType(type);
    setText("");
    setMindTitle("");
    setAnonymous(false);
    setModalOpen(true);
  };

  const closeComposer = () => setModalOpen(false);

  const submitComposer = async () => {
    try {
      if (!user?.uid) return;

      if (modalType === "feed") {
        if (!text.trim()) return;
        await addDoc(collection(db, "feed"), {
          text: text.trim(),
          uid: user.uid,
          email: user.email || "",
          createdAt: serverTimestamp(),
        });
      }

      if (modalType === "trade") {
        if (!text.trim()) return;
        await addDoc(collection(db, "trade"), {
          text: text.trim(),
          uid: user.uid,
          email: user.email || "",
          createdAt: serverTimestamp(),
        });
      }

      if (modalType === "minds") {
        if (!mindTitle.trim()) return;
        await addDoc(collection(db, "minds"), {
          title: mindTitle.trim(),
          content: text.trim(),
          anonymous: !!anonymous,
          uid: user.uid, // ✅ admin için her zaman kayıtlı
          email: user.email || "",
          createdAt: serverTimestamp(),
        });
      }

      closeComposer();
    } catch (e) {
      console.error(e);
      alert("Kayıt sırasında hata oldu. (Console'a yazdım)");
    }
  };

  // UI
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src={logo} alt="ARAZ" />
          <div className="brand-text">
            <div className="brand-name">ARAZ</div>
            <div className="brand-sub">Zihin haritaları, takas ve sosyal paylaşım</div>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Çıkış
        </button>
      </header>

      <main className="content">
        <div className="page-head">
          <h1 className="page-title">{title}</h1>
          {(tab === "feed" || tab === "trade" || tab === "minds") && (
            <button
              className="fab"
              onClick={() => openComposer(tab === "feed" ? "feed" : tab === "trade" ? "trade" : "minds")}
              aria-label="Ekle"
              title="Ekle"
            >
              +
            </button>
          )}
        </div>

        {/* FEED */}
        {tab === "feed" && (
          <div className="card">
            {feedItems.length === 0 ? (
              <div className="muted">Henüz paylaşım yok.</div>
            ) : (
              <div className="list">
                {feedItems.map((it) => (
                  <div key={it.id} className="list-item">
                    <div className="list-text">{it.text}</div>
                    <div className="list-meta">
                      {isAdmin ? `UID: ${it.uid}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRADE */}
        {tab === "trade" && (
          <div className="card">
            {tradeItems.length === 0 ? (
              <div className="muted">Henüz takas yok.</div>
            ) : (
              <div className="list">
                {tradeItems.map((it) => (
                  <div key={it.id} className="list-item">
                    <div className="list-text">{it.text}</div>
                    <div className="list-meta">{isAdmin ? `UID: ${it.uid}` : ""}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MINDS */}
        {tab === "minds" && (
          <div className="card">
            <div className="muted">
              ✅ Anonim seçilse bile sen (admin) UID’den görebilirsin.
            </div>

            <div style={{ height: 12 }} />

            {mindItems.length === 0 ? (
              <div className="muted">Henüz düşünme haritası yok.</div>
            ) : (
              <div className="list">
                {mindItems.map((it) => {
                  const showOwner = isAdmin || !it.anonymous;
                  const ownerLabel = it.anonymous ? "Anonim" : "Kullanıcı";
                  return (
                    <div key={it.id} className="list-item">
                      <div className="list-title">{it.title}</div>
                      {it.content ? <div className="list-text">{it.content}</div> : null}
                      <div className="list-meta">
                        {showOwner ? `${ownerLabel}${isAdmin ? ` • UID: ${it.uid}` : ""}` : "Anonim"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div className="card">
            <div className="profile-name">{(user?.displayName || "Arazsocial").trim()}</div>
            <div className="muted">{user?.email || ""}</div>

            <div className="profile-stats">
              <div className="stat">
                <div className="stat-num">0</div>
                <div className="stat-label">Takipçi</div>
              </div>
              <div className="stat">
                <div className="stat-num">0</div>
                <div className="stat-label">Takip</div>
              </div>
            </div>

            <div className="muted">
              Takip/arama özelliğini bir sonraki adımda ekleyeceğiz.
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-btn ${tab === "feed" ? "active" : ""}`} onClick={() => go("feed")}>
          Akış
        </button>
        <button className={`nav-btn ${tab === "trade" ? "active" : ""}`} onClick={() => go("trade")}>
          Takas
        </button>
        <button className={`nav-btn ${tab === "minds" ? "active" : ""}`} onClick={() => go("minds")}>
          Benimlerim
        </button>
        <button className={`nav-btn ${tab === "profile" ? "active" : ""}`} onClick={() => go("profile")}>
          Profilim
        </button>
      </nav>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeComposer}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {modalType === "feed" && "Akışa ne paylaşmak istiyorsun?"}
              {modalType === "trade" && "Takas metnin ne?"}
              {modalType === "minds" && "Zihin haritası ekle"}
            </div>

            {modalType === "minds" && (
              <>
                <label className="field-label">Başlık</label>
                <input
                  className="field"
                  value={mindTitle}
                  onChange={(e) => setMindTitle(e.target.value)}
                  placeholder="Örn: Para biriktirme planı"
                />

                <div className="row">
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    <span>Anonim paylaş</span>
                  </label>
                  <div className="muted small">
                    (Admin sen: UID’yi görürsün)
                  </div>
                </div>
              </>
            )}

            <label className="field-label">
              {modalType === "minds" ? "Açıklama" : "Metin"}
            </label>
            <textarea
              className="field area"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={modalType === "feed" ? "Bugün ARAZ için..." : modalType === "trade" ? "Excel öğrenmek istiyorum, karşılığında..." : "Detaylar..."}
            />

            <div className="modal-actions">
              <button className="btn ghost" onClick={closeComposer}>İptal</button>
              <button className="btn" onClick={submitComposer}>Tamam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}