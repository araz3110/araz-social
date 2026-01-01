import React, { useEffect, useMemo, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

export default function Home({ user, onLogout }) {
  const [tab, setTab] = useState("feed"); // feed | trade | minds | profile

  useEffect(() => {
    const fromHash = window.location.hash?.replace("#", "");
    if (fromHash && ["feed", "trade", "minds", "profile"].includes(fromHash)) setTab(fromHash);
    else window.location.hash = "#feed";

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
    if (tab === "minds") return "Zihin Haritalarım";
    return "Profilim";
  }, [tab]);

  const go = (next) => {
    setTab(next);
    window.location.hash = `#${next}`;
  };

  // public klasöründeki görseli kullan (import hatası olmasın)
  const logoUrl = "/IMG-20251015-WA00007.png"; // sende public içinde bu vardı

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src={logoUrl} alt="ARAZ" />
          <div className="brand-text">
            <div className="brand-name">ARAZ</div>
            <div className="brand-sub">Zihin haritaları, takas ve sosyal paylaşım</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Çıkış</button>
      </header>

      <main className="content">
        <div className="page-head">
          <h1 className="page-title">{title}</h1>
          {tab === "feed" && <PlusBtn onClick={() => FeedAdd(user)} />}
          {tab === "trade" && <PlusBtn onClick={() => TradeAdd(user)} />}
          {tab === "minds" && <PlusBtn onClick={() => MindsAdd(user)} />}
          {tab === "profile" && null}
        </div>

        {tab === "feed" && <Feed user={user} />}
        {tab === "trade" && <Trade user={user} />}
        {tab === "minds" && <Minds user={user} />}
        {tab === "profile" && <Profile user={user} />}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-btn ${tab === "feed" ? "active" : ""}`} onClick={() => go("feed")}>Akış</button>
        <button className={`nav-btn ${tab === "trade" ? "active" : ""}`} onClick={() => go("trade")}>Takas</button>
        <button className={`nav-btn ${tab === "minds" ? "active" : ""}`} onClick={() => go("minds")}>Zihinlerim</button>
        <button className={`nav-btn ${tab === "profile" ? "active" : ""}`} onClick={() => go("profile")}>Profilim</button>
      </nav>
    </div>
  );
}

function PlusBtn({ onClick }) {
  return <button className="plus-btn" onClick={onClick}>+</button>;
}

/** ===== Akış ===== */
function Feed({ user }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "feedPosts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);
  return (
    <div className="card">
      {items.length === 0 ? <div className="muted">Henüz paylaşım yok.</div> : null}
      {items.map(x => (
        <div key={x.id} className="row">
          <div className="row-title">{x.text}</div>
          <div className="row-sub">{x.authorNickname || "Kullanıcı"}</div>
        </div>
      ))}
    </div>
  );
}

async function FeedAdd(user) {
  const text = prompt("Akışa ne paylaşmak istiyorsun?");
  if (!text?.trim()) return;
  const nick = await getNickname(user.uid);
  await addDoc(collection(db, "feedPosts"), {
    text: text.trim(),
    authorUid: user.uid,
    authorNickname: nick,
    createdAt: serverTimestamp(),
  });
}

/** ===== Takas ===== */
function Trade({ user }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "trades"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);
  return (
    <div className="card">
      {items.length === 0 ? <div className="muted">Henüz takas yok.</div> : null}
      {items.map(x => (
        <div key={x.id} className="row">
          <div className="row-title">{x.offer} ⇄ {x.want}</div>
          <div className="row-sub">{x.authorNickname || "Kullanıcı"}</div>
        </div>
      ))}
    </div>
  );
}

async function TradeAdd(user) {
  const offer = prompt("Sen ne veriyorsun? (ör: Excel pratiği)");
  if (!offer?.trim()) return;
  const want = prompt("Karşılığında ne istiyorsun? (ör: haftada 1 gün İngilizce konuşma)");
  if (!want?.trim()) return;
  const nick = await getNickname(user.uid);
  await addDoc(collection(db, "trades"), {
    offer: offer.trim(),
    want: want.trim(),
    authorUid: user.uid,
    authorNickname: nick,
    createdAt: serverTimestamp(),
  });
}

/** ===== Zihin Haritalarım ===== */
function Minds({ user }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "mindmaps"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);
  return (
    <div className="card">
      <div className="muted">Anonim seçilse bile sen (admin) UID’den görebilirsin.</div>
      {items.length === 0 ? <div className="muted" style={{ marginTop: 10 }}>Henüz zihin haritası yok.</div> : null}
      {items.map(x => (
        <div key={x.id} className="row">
          <div className="row-title">{x.title}</div>
          <div className="row-sub">
            {x.anonymous ? "Anonim" : (x.authorNickname || "Kullanıcı")}
          </div>
        </div>
      ))}
    </div>
  );
}

async function MindsAdd(user) {
  const title = prompt("Zihin haritası başlığı?");
  if (!title?.trim()) return;
  const content = prompt("İçerik (kısa not) yaz:");
  if (!content?.trim()) return;

  const anonymous = confirm("Anonim olarak gönderilsin mi?");
  const nick = await getNickname(user.uid);

  await addDoc(collection(db, "mindmaps"), {
    title: title.trim(),
    content: content.trim(),
    anonymous,
    authorUid: user.uid,          // admin görür
    authorNickname: anonymous ? "Anonim" : nick, // profilde anonim
    createdAt: serverTimestamp(),
  });
}

/** ===== Profil ===== */
function Profile({ user }) {
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      setMe(snap.exists() ? snap.data() : null);
    })();
  }, [user.uid]);

  return (
    <div className="card">
      <div className="row">
        <div className="row-title">{me?.nickname || "Profil"}</div>
        <div className="row-sub">{me?.name ? `${me.name} ${me.surname}` : user.email}</div>
      </div>

      <div className="stats">
        <div className="stat"><div className="num">{me?.followersCount ?? 0}</div><div className="lbl">Takipçi</div></div>
        <div className="stat"><div className="num">{me?.followingCount ?? 0}</div><div className="lbl">Takip</div></div>
      </div>

      <div className="muted">Takip/arama özelliğini bir sonraki adımda netleştirip ekleyeceğiz.</div>
    </div>
  );
}

async function getNickname(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists() && snap.data()?.nickname) return snap.data().nickname;
  return "Kullanıcı";
}