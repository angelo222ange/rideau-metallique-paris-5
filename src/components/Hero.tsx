import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "min(88vh, 760px)",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src={`/images/gallery/${siteConfig.heroBg}`}
          alt="Depannage rideau metallique a Paris 5e arrondissement"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          fetchPriority="high"
        />
        {/* Overlay >= 40% (lisibilite REGLE 36) — gradient teal sombre */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(4,50,63,0.62) 0%, rgba(4,50,63,0.55) 45%, rgba(6,41,50,0.82) 100%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 10, margin: "0 auto", width: "100%", maxWidth: 1200, padding: "0 30px 88px" }}>
        <div style={{ maxWidth: 760 }}>
          <p style={{ marginBottom: 18, fontSize: 15, fontWeight: 600, color: "#E0C075", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Rideau metallique - Paris 5e
          </p>
          <h1 className="hero-h1" style={{ marginBottom: 20, color: "#FFFFFF", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Depannage rideau metallique a Paris 5e arrondissement
          </h1>
          <p style={{ marginBottom: 30, fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,0.9)", maxWidth: 620 }}>
            Rideau bloque, moteur en panne ou serrure forcee ? Nos techniciens interviennent
            24h/24 et 7j/7 dans le 5e et les arrondissements voisins, en moins de 30 minutes.
          </p>
          <div className="stack-mobile" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href={siteConfig.telephoneHref} className="btn-primary" style={{ fontSize: 16 }}>
              <PhoneIcon />
              Appeler {siteConfig.telephone}
            </a>
            <a href="/contact/" className="btn-outline" style={{ fontSize: 16 }}>
              Devis gratuit
            </a>
          </div>
          <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.9)", fontSize: 15 }}>
            <span style={{ color: "#F59E0B", fontSize: 18, letterSpacing: 2 }}>★★★★★</span>
            <span>
              {siteConfig.rating}/5 — {siteConfig.ratingCount} avis Google
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#04323F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
