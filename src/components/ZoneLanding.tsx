import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceZoneMap from "@/components/ServiceZoneMap";
import { siteConfig, services, zones } from "@/config/site";
import { ZonePageContent, serviceBlurb } from "@/lib/zone-content";
import { bgSuitablePool, interventionScenes, realisations } from "@/lib/image-catalog";
import { subcityHandcrafted } from "@/data/subcity-handcrafted";

// Selection seedee d'images DISTINCTES (Fisher-Yates) — 6 visuels uniques par page zone.
function pickImages(zoneSlug: string) {
  let h = 5381;
  for (let i = 0; i < zoneSlug.length; i++) h = ((h << 5) + h + zoneSlug.charCodeAt(i)) >>> 0;
  const pool = Array.from(new Set([...bgSuitablePool, ...interventionScenes, ...realisations]));
  const idx = pool.map((_, i) => i);
  let a = h >>> 0;
  for (let i = idx.length - 1; i > 0; i--) {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    const j = Math.floor(r * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const sel = idx.slice(0, 6).map((i) => "/images/gallery/" + pool[i]);
  return { hero: sel[0], block1: sel[1], block2: sel[2], block3: sel[3], block4: sel[4], finalCtaBg: sel[5] };
}

export default function ZoneLanding({ c }: { c: ZonePageContent }) {
  const imgs = pickImages(c.zoneSlug);
  const seoBlocks = [c.seo1, c.seo2, c.seo3, c.seo4];
  const blockImgs = [imgs.block1, imgs.block2, imgs.block3, imgs.block4];
  const whyImgs = [imgs.block1, imgs.block2, imgs.block3, imgs.block4];
  const slug = `rideau-metallique-${c.zoneSlug}`;

  // Voisins : 6 zones (selection seedee par zone) -> bloc d'ancres varie cross-zone.
  let nh = 5381;
  for (let i = 0; i < c.zoneSlug.length; i++) nh = ((nh << 5) + nh + c.zoneSlug.charCodeAt(i) + 7) >>> 0;
  const neighborPool = zones.filter((z) => z.slug !== c.zoneSlug);
  const nIdx = neighborPool.map((_, i) => i);
  let na = nh >>> 0;
  for (let i = nIdx.length - 1; i > 0; i--) {
    na = (na + 0x6d2b79f5) | 0;
    let t = Math.imul(na ^ (na >>> 15), 1 | na);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    const j = Math.floor(r * (i + 1));
    [nIdx[i], nIdx[j]] = [nIdx[j], nIdx[i]];
  }
  const neighbors = nIdx.slice(0, 6).map((i) => neighborPool[i]);

  // Bloc expertise locale profond (source canonique src/data/subcity-handcrafted.ts).
  const sub = subcityHandcrafted.find((s) => s.slug === slug);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${siteConfig.brand} — ${c.zoneName}`,
    telephone: siteConfig.telephone,
    areaServed: { "@type": "City", name: c.zoneName },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      postalCode: siteConfig.postalCode,
      addressLocality: siteConfig.cityShort,
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: c.lat, longitude: c.lng },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.rating,
      reviewCount: siteConfig.ratingCount,
      bestRating: "5",
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: "Zones", item: `${siteConfig.url}/zones/` },
      { "@type": "ListItem", position: 3, name: c.h1, item: `${siteConfig.url}/${slug}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main>
        {/* Hero + Breadcrumb */}
        <section style={{ position: "relative", minHeight: "min(70vh, 560px)", display: "flex", alignItems: "flex-end", overflow: "hidden", marginTop: 0 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <img src={imgs.hero} alt={`Rideau metallique a ${c.zoneName}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,50,63,0.6) 0%, rgba(6,41,50,0.82) 100%)" }} />
          </div>
          <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "120px 30px 64px" }}>
            <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 14 }}>
              <a href="/" style={{ color: "rgba(255,255,255,0.8)" }}>Accueil</a> / <a href="/zones/" style={{ color: "rgba(255,255,255,0.8)" }}>Zones</a> / {c.h1}
            </nav>
            <h1 className="hero-h1" style={{ color: "#FFFFFF", fontWeight: 700, maxWidth: 820, marginBottom: 18 }}>{c.h1}</h1>
            <div className="stack-mobile" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href={siteConfig.telephoneHref} className="btn-primary">Appeler {siteConfig.telephone}</a>
              <a href="/contact/" className="btn-outline">Devis gratuit</a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: "#04323F", padding: "40px 30px" }}>
          <div className="grid-4col" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
            {[
              [siteConfig.experience, "ans d'experience"],
              [siteConfig.delai + " min", "delai d'intervention"],
              ["24h/24", "7j/7 disponible"],
              [siteConfig.interventions, "interventions"],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#C9A24B" }}>{n}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Intro hyper-locale */}
        <section style={{ padding: "64px 30px", background: "#FFFFFF" }}>
          <div className="seo-row" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 30, fontWeight: 600, marginBottom: 18 }}>
                Votre specialiste du rideau metallique a {c.zoneName}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4A5A60", marginBottom: 16 }}>{c.intro}</p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4A5A60", marginBottom: 22 }}>{c.primer}</p>
              <a href={siteConfig.telephoneHref} className="btn-primary">Appeler {siteConfig.telephone}</a>
            </div>
            <div>
              <img src={blockImgs[0]} alt={`Depannage rideau metallique a ${c.zoneName}`} title={`Rideau metallique a ${c.zoneName}`} loading="lazy" decoding="async" width={580} height={420} style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 10 }} />
            </div>
          </div>
        </section>

        {/* Services proposes dans la zone (cards avec liens vers service x zone) */}
        <section style={{ padding: "56px 30px", background: "#F5F3EC" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 600, marginBottom: 8, textAlign: "center" }}>
              Nos services de rideau metallique a {c.zoneName}
            </h2>
            <p style={{ fontSize: 16, color: "#4A5A60", maxWidth: 780, margin: "0 auto 28px", textAlign: "center" }}>
              De l&apos;urgence a la fabrication sur-mesure, retrouvez l&apos;ensemble de nos prestations rideau metallique a {c.zoneName}.
            </p>
            <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {services.map((s, idx) => (
                <a key={s.id} href={`/${s.slug}-${c.zoneSlug}/`} style={{ background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 10, padding: "22px 20px", display: "block", textDecoration: "none" }}>
                  <img src={blockImgs[idx % blockImgs.length]} alt={`${s.name} rideau metallique a ${c.zoneName}`} loading="lazy" decoding="async" width={300} height={150} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 5, marginBottom: 14 }} />
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#102228", marginBottom: 6 }}>{s.name} a {c.zoneName}</h3>
                  <p style={{ fontSize: 14, color: "#4A5A60", marginBottom: 10 }}>{serviceBlurb(s.id, c.zoneSlug)}</p>
                  <span style={{ fontSize: 14, color: "#04323F", fontWeight: 600 }}>En savoir plus &rarr;</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 4 blocs SEO alternants */}
        {seoBlocks.map((b, i) => (
          <section key={i} style={{ padding: "64px 30px", background: i % 2 === 0 ? "#FFFFFF" : "#F5F3EC" }} className="section">
            <div className="seo-row" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", direction: i % 2 === 1 ? "rtl" : "ltr" }}>
              <div style={{ direction: "ltr" }}>
                <span style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#C9A24B", marginBottom: 10 }}>
                  {["Methode", "Nos services", "Savoir-faire", "Deroulement"][i]}
                </span>
                <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 26, fontWeight: 600, marginBottom: 16 }}>{b.title}</h2>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4A5A60", marginBottom: 18 }}>{b.text}</p>
                {(i === 1 || i === 3) && (
                  <a href={siteConfig.telephoneHref} className="btn-primary" aria-label={`Appeler DRM au ${siteConfig.telephone}`}>
                    {["Demander une intervention", "Obtenir un devis gratuit"][i === 1 ? 0 : 1]}
                  </a>
                )}
              </div>
              <div style={{ direction: "ltr" }}>
                <img src={blockImgs[i]} alt={`${b.title}`} title={b.title} loading="lazy" decoding="async" style={{ width: "100%", height: 380, objectFit: "cover", borderRadius: 10 }} />
              </div>
            </div>
          </section>
        ))}

        {/* Carte OSM ciblee sur la zone */}
        <section style={{ padding: "48px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 24, fontWeight: 600, marginBottom: 18 }}>
              Notre zone d&apos;intervention a {c.zoneName}
            </h2>
            <ServiceZoneMap lat={c.lat} lng={c.lng} zoneName={c.zoneName} postal={c.zone.cp} />
          </div>
        </section>

        {/* Pourquoi nous (cards avec images) */}
        <section style={{ padding: "64px 30px", background: "#F5F3EC" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 600, marginBottom: 28, textAlign: "center" }}>
              Pourquoi nous confier votre rideau metallique a {c.zoneName}
            </h2>
            <div className="grid-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
              {c.whyCards.map((w, i) => (
                <div key={w.title} style={{ background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <img src={whyImgs[i % whyImgs.length]} alt={`${w.title} — rideau metallique a ${c.zoneName}`} title={w.title} loading="lazy" decoding="async" width={300} height={170} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                  <div style={{ padding: "18px 18px 22px" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#102228", marginBottom: 8 }}>{w.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "#4A5A60" }}>{w.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expertise locale profonde (source canonique subcity-handcrafted) */}
        {sub && (
          <section style={{ padding: "64px 30px", background: "#04323F" }}>
            <div style={{ maxWidth: 980, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 600, color: "#FFFFFF", marginBottom: 18 }}>
                Notre expertise du rideau metallique a {c.zoneName}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.9)", marginBottom: 16 }}>{sub.localExpertise}</p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.82)" }}>{sub.interventionsNarrative}</p>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
              Questions frequentes — rideau metallique a {c.zoneName}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {c.faq.map((f) => (
                <details key={f.q} style={{ background: "#F5F3EC", borderRadius: 10, padding: "16px 20px", border: "1px solid #E2DCD0" }}>
                  <summary style={{ fontWeight: 600, fontSize: 16, cursor: "pointer", color: "#102228" }}>{f.q}</summary>
                  <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6, color: "#4A5A60" }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Maillage : services dans la zone + zones voisines */}
        <section style={{ padding: "56px 30px", background: "#F5F3EC" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
              Toutes nos prestations rideau metallique a {c.zoneName}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
              {services.map((s) => (
                <a key={s.id} href={`/${s.slug}-${c.zoneSlug}/`} style={{ fontSize: 14, color: "#04323F", background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 1000, padding: "9px 16px" }}>
                  {s.name} rideau metallique a {c.zoneName}
                </a>
              ))}
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
              Rideau metallique dans les zones voisines
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {neighbors.map((z) => (
                <a key={z.slug} href={`/rideau-metallique-${z.slug}/`} style={{ fontSize: 14, color: "#04323F", background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 1000, padding: "9px 16px" }}>
                  Rideau metallique a {z.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section style={{ position: "relative", padding: "72px 30px", background: "#04323F", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
            <img src={imgs.finalCtaBg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 30, fontWeight: 600, color: "#FFFFFF", marginBottom: 16 }}>
              Besoin d&apos;un rideau metallique a {c.zoneName} ?
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.88)", marginBottom: 26 }}>
              Nos techniciens interviennent 24h/24 et 7j/7. Appelez maintenant pour un devis gratuit.
            </p>
            <a href={siteConfig.telephoneHref} className="btn-primary" style={{ fontSize: 17 }}>Appeler {siteConfig.telephone}</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
