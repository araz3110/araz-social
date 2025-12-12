import React, { useState } from "react";
import logo from "./assets/logo.png";

function Home({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "trade" | "maps" | "profile"

  return (
    <div className="app-shell">
      {/* Üst bar */}
      <header className="top-bar">
        <div className="brand">
          <img src={logo} alt="ARAZ logo" className="brand-logo" />
          <div className="brand-text">
            <h1>ARAZ</h1>
            <p>Zihin haritaları, takas ve sosyal paylaşım platformu.</p>
          </div>
        </div>

        <button className="ghost-button" onClick={onLogout}>
          Çıkış
        </button>
      </header>

      {/* Sekmeler */}
    <nav className="nav-tabs">
  <button
    className={`nav-tab ${activeTab === "feed" ? "active" : ""}`}
    onClick={() => setActiveTab("feed")}
  >
    Akış
  </button>

  <button
    className={`nav-tab ${activeTab === "trade" ? "active" : ""}`}
    onClick={() => setActiveTab("trade")}
  >
    Takas
  </button>

  <button
    className={`nav-tab ${activeTab === "maps" ? "active" : ""}`}
    onClick={() => setActiveTab("maps")}
  >
    Zihin Haritalarım
  </button>

  <button
    className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
    onClick={() => setActiveTab("profile")}
  >
    Profilim
  </button>
</nav>

      {/* İçerik */}
      <main className="content">
        {/* AKIŞ */}
        {activeTab === "feed" && (
          <section>
            <h2 className="section-title">Hoş geldin 👋</h2>
            <p className="section-subtitle">
              ARAZ&apos;da zihinsel haritalar oluşturabilir, takas ilanı
              açabilir ve bölüm bölüm gönderiyi paylaşabilirsin. İlk gönderiyi
              hazırlamaya ne dersin?
            </p>

            <article className="card">
              <h3 className="card-title">Örnek Gönderim: &quot;Hedef Haritam&quot;</h3>
              <p className="card-meta">
                Zihin Atölyesi • 2 saat önce • Zihin haritası
              </p>
              <p className="card-body">
                2026 için kariyer, maddi hedefler ve kişisel gelişim
                becerilerimi tek bir zihin gücünde topladım. Her hafta küçük
                adımlarla güncelliyorum.
              </p>
              <div className="card-tags">
                <span className="tag">#zihinharitası</span>
                <span className="tag">#hedef</span>
                <span className="tag">#araz</span>
              </div>
            </article>

            <article className="card">
              <h3 className="card-title">
                Örnek Gönderim: 1. Sınıf Okuma Kitapları Takası
              </h3>
              <p className="card-meta">Takas Köşesi • Dün • Takas ilanı</p>
              <p className="card-body">
                1. sınıf için okuma kitaplarım var. Yeni başlayan bir öğrenciyle
                takas etmek istiyorum. Senin elinde fazla kaynak varsa yaz
                lütfen. 📚
              </p>
              <div className="card-tags">
                <span className="tag">#takas</span>
                <span className="tag">#1Sınıf</span>
                <span className="tag">#kitap</span>
              </div>
            </article>

            <article className="card">
              <h3 className="card-title">
                ARAZ Günlüğü: Zihin haritasını PDF olarak dağıtma
              </h3>
              <p className="card-meta">ARAZ Günlüğü • 3 gün önce • Duyuru</p>
              <p className="card-body">
                Yakında oluşturduğun haritaları tek tıkla PDF olarak
                indirebilecek, danışanlarınla veya sınıfta paylaşabileceksin.
                Bu demo kart, gelecekte göreceğin ARAZ güncellemeleri için ayrıldı.
              </p>
              <div className="card-tags">
                <span className="tag">#araz</span>
                <span className="tag">#güncelleme</span>
              </div>
            </article>
          </section>
        )}

        {/* TAKAS */}
        {activeTab === "trade" && (
          <section>
            <h2 className="section-title">Takas Alanı (Demo)</h2>
            <p className="section-subtitle">
              Burada kitap, eğitim seti, danışmanlık saati gibi alanlarda takas
              ilanları olacak. Açılışta ilk ilanını birlikte hazırlarız. 🙂
            </p>

            <article className="card">
              <h3 className="card-title">
                Örnek İlan: İngilizce Konuşma Pratiği
              </h3>
              <p className="card-meta">Takas Köşesi • Dün • Takas ilanı</p>
              <p className="card-body">
                Haftada 1 gün online İngilizce konuşma pratiği yapmak istiyorum.
                Karşılığında başlangıç–orta seviye için okuma–yazma desteği
                verebilirim.
              </p>
              <div className="card-tags">
                <span className="tag">#takas</span>
                <span className="tag">#ingilizce</span>
                <span className="tag">#konuşma</span>
              </div>
            </article>
          </section>
        )}

        {/* ZİHİN HARİTALARIM */}
        {activeTab === "maps" && (
          <section>
            <h2 className="section-title">Zihin Haritalarım</h2>
            <p className="section-subtitle">
              Kendi zihin haritalarını burada saklayıp düzenleyebileceksin.
              Şimdilik örnek kartlar var; sistem hazır olduğunda senin gerçek
              haritaların listelenecek.
            </p>

            <article className="card">
              <h3 className="card-title">Örnek Harita: 2026 Hedeflerim</h3>
              <p className="card-meta">
                Durum: Taslak • Son güncelleme: 10 Aralık
              </p>
              <p className="card-body">
                Finans, aile, kariyer, sağlık ve ruhsal gelişim için dallara
                ayrılmış bir hedef haritası.
              </p>
            </article>

            <article className="card">
              <h3 className="card-title">Örnek Harita: ARAZ Proje Haritası</h3>
              <p className="card-meta">Etiket: #araz #proje</p>
              <p className="card-body">
                &quot;Görsel tasarım, kod, bölümler, premium üyelik, uygulama&quot;
                gibi başlıklarla ARAZ&apos;ın büyüme yolunu anlatan örnek bir
                harita.
              </p>
            </article>
          </section>
        )}

        {/* PROFİL */}
        {activeTab === "profile" && (
          <section>
            <h2 className="section-title">Profilim</h2>

            <div className="profile-card">
              <div className="profile-avatar">
                {user?.email ? user.email[0].toUpperCase() : "A"}
              </div>
              <div className="profile-info">
                <p className="profile-email">
                  {user?.email || "ornek@araz.app"}
                </p>
                <p className="profile-role">Normal kullanıcı • ARAZ üyesi</p>
              </div>
            </div>

            <article className="card">
              <h3 className="card-title">Premium plan yakında ✨</h3>
              <p className="card-body">
                ARAZ&apos;da mavi tikli marka profilleri, öne çıkan gönderiler
                ve özel takas odaları ilerleyen dönemde açılacak. Şimdilik
                keşfet, dene, kaydet.
              </p>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default Home;