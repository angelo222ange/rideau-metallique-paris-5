import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceZoneSpecific from "@/components/service-sections/ServiceZoneSpecific";
import ServiceZoneMap from "@/components/ServiceZoneMap";
import ZoneLanding from "@/components/ZoneLanding";
import { siteConfig, services, zones } from "@/config/site";
import { parseSlug, getZoneBySlug, getServiceBySlug } from "@/lib/content";
import { buildServiceZoneContent, hashZoneSlug } from "@/lib/service-content";
import { buildZoneContent } from "@/lib/zone-content";
import { pickServiceZoneImages, serviceImages, withBase } from "@/lib/image-catalog";

// Slug d'une page ZONE dediee (Phase 3) : "rideau-metallique-{zone}".
// Sous-segment unique du namespace [service_zone] ; ne cannibalise pas la home
// (paris-5 exclu des zones) ni les pages service x zone (prefixes distincts).
const ZONE_PREFIX = "rideau-metallique-";
function zoneSlugFromParam(slug: string): string | null {
  if (!slug.startsWith(ZONE_PREFIX)) return null;
  const z = slug.slice(ZONE_PREFIX.length);
  return zones.some((zo) => zo.slug === z) ? z : null;
}

export function generateStaticParams() {
  const params: { service_zone: string }[] = [];
  // ANTI-CANNIBALISATION (REGLE 6.8) : zones NE contient PAS la ville-principale (paris-5).
  // On genere UNIQUEMENT services x communes peripheriques. Aucune boucle services x ville-principale.
  for (const zone of zones) {
    for (const service of services) {
      params.push({ service_zone: `${service.slug}-${zone.slug}` });
    }
    // Phase 3 : page ZONE dediee (hub multi-services) /rideau-metallique-{zone}/.
    params.push({ service_zone: `${ZONE_PREFIX}${zone.slug}` });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ service_zone: string }> }): Promise<Metadata> {
  const { service_zone } = await params;
  // Page ZONE dediee (Phase 3).
  const zSlug = zoneSlugFromParam(service_zone);
  if (zSlug) {
    const zc = buildZoneContent(zSlug);
    if (zc) {
      return {
        title: zc.metaTitle,
        description: zc.metaDescription,
        alternates: { canonical: `${siteConfig.url}/${service_zone}/` },
      };
    }
  }
  const parsed = parseSlug(service_zone);
  if (!parsed) return { title: "Page introuvable" };
  const service = getServiceBySlug(parsed.serviceSlug);
  const zone = getZoneBySlug(parsed.zoneSlug);
  if (!service || !zone) return { title: "Page introuvable" };
  const c = buildServiceZoneContent(service.id, zone.name, zone.slug);
  return {
    title: `${c.h1}`,
    description: `${service.name} de rideau metallique a ${zone.name} (${zone.cp}). Intervention 24h/24 par DRM Paris 5. Devis gratuit, ${siteConfig.delai} min.`,
    alternates: { canonical: `${siteConfig.url}/${service_zone}/` },
  };
}

export default async function ServiceZonePage({
  params,
}: {
  params: Promise<{ service_zone: string }>;
}) {
  const { service_zone } = await params;
  // Page ZONE dediee (Phase 3) : hub multi-services /rideau-metallique-{zone}/.
  const zSlug = zoneSlugFromParam(service_zone);
  if (zSlug) {
    const zc = buildZoneContent(zSlug);
    if (zc) return <ZoneLanding c={zc} />;
  }
  const parsed = parseSlug(service_zone);
  if (!parsed) notFound();
  const service = getServiceBySlug(parsed.serviceSlug);
  const zone = getZoneBySlug(parsed.zoneSlug);
  if (!service || !zone) notFound();

  const c = buildServiceZoneContent(service.id, zone.name, zone.slug);
  const imgs = pickServiceZoneImages(service.id, zone.slug);
  const seoBlocks = [c.seo1, c.seo2, c.seo3, c.seo4];
  const blockImgs = [imgs.block1, imgs.block2, imgs.block3, imgs.block4];
  // Image d'intro (scene intervention/realisation, distincte du hero et des 4 blocs).
  const introImg = imgs.extras[0] || imgs.block1;
  // 4 visuels pour les cards "Pourquoi nous" (intervention + realisation, dedup).
  const whyImgs = [imgs.block1, imgs.block4, imgs.finalCtaBg, imgs.preFooterBg];
  // Couleurs avatar (rotation 6 — REGLE avatars : 1 lettre blanche sur fond couleur unique).
  const avatarColors = ["#04323F", "#C9A24B", "#8C6A3F", "#3E5C66", "#A9794A", "#1F3A42"];

  const otherServices = services.filter((s) => s.id !== service.id);
  // Voisins : selection seedee de 8 zones (ordre/sous-ensemble varie par page) -> reduit
  // le bloc d'ancres maillage identique cross-zone (anti-duplicate).
  const neighborSeed = hashZoneSlug(zone.slug + ":nbr:" + service.id);
  const ctaSeed = hashZoneSlug(zone.slug + ":cta:" + service.id);
  const otherZones = (() => {
    const pool = zones.filter((z) => z.slug !== zone.slug);
    const idx = pool.map((_, i) => i);
    let a = neighborSeed >>> 0;
    for (let i = idx.length - 1; i > 0; i--) {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      const j = Math.floor(r * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, 8).map((i) => pool[i]);
  })();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: c.h1,
    provider: { "@type": "LocalBusiness", name: siteConfig.brand, telephone: siteConfig.telephone },
    areaServed: { "@type": "City", name: zone.name },
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
      { "@type": "ListItem", position: 3, name: c.h1, item: `${siteConfig.url}/${service_zone}/` },
    ],
  };
  // LocalBusiness avec GeoCoordinates (coords du siege DRM Paris 5) — coherent avec le
  // LocalBusiness des pages zone-hub. Donne le signal GeoCoordinates Schema (REGLE -1B)
  // sur toutes les pages service x zone, areaServed = la commune de la page.
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.brand,
    telephone: siteConfig.telephone,
    url: `${siteConfig.url}/${service_zone}/`,
    areaServed: { "@type": "City", name: zone.name },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      postalCode: siteConfig.postalCode,
      addressLocality: siteConfig.city,
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.rating,
      reviewCount: siteConfig.ratingCount,
      bestRating: "5",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main>
        {/* Hero + Breadcrumb */}
        <section style={{ position: "relative", minHeight: "min(70vh, 560px)", display: "flex", alignItems: "flex-end", overflow: "hidden", marginTop: 0 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <img src={imgs.hero} alt={`${c.h1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
              [siteConfig.experience, ["ans d'experience", "ans de metier", "ans a votre service"][ctaSeed % 3]],
              [siteConfig.delai + " min", ["delai d'intervention", "pour arriver sur place", "en moyenne sur site"][ctaSeed % 3]],
              ["24h/24", ["7j/7 disponible", "et 7j/7 joignables", "week-ends compris"][ctaSeed % 3]],
              [siteConfig.interventions, ["interventions", "chantiers realises", "depannages assures"][ctaSeed % 3]],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#C9A24B" }}>{n}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Intro service (2 colonnes texte + image) */}
        <section style={{ padding: "64px 30px", background: "#FFFFFF" }}>
          <div className="seo-row" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 30, fontWeight: 600, marginBottom: 18 }}>{c.h2}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4A5A60", marginBottom: 18 }}>{c.seo1.text}</p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4A5A60", marginBottom: 22 }}>
                Notre equipe DRM {siteConfig.cityShort} intervient pour le {c.serviceLabel} a {zone.name} 24h/24 et 7j/7. Appelez le {siteConfig.telephone} pour un diagnostic et un devis gratuit.
              </p>
              <a href={siteConfig.telephoneHref} className="btn-primary">Appeler {siteConfig.telephone}</a>
            </div>
            <div>
              <img src={introImg} alt={`${c.h1}`} title={`${c.serviceLabel} a ${zone.name}`} loading="lazy" decoding="async" width={580} height={420} style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 12 }} />
            </div>
          </div>
        </section>

        {/* Types d'intervention */}
        <section style={{ padding: "48px 30px", background: "#F5F3EC" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 26, fontWeight: 600, marginBottom: 24 }}>
              {c.headings.types}
            </h2>
            <div className="grid-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
              {c.types.map((t) => (
                <div key={t} style={{ background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 12, padding: "20px 18px", fontSize: 15, color: "#102228", fontWeight: 600 }}>{t}</div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 blocs SEO alternants */}
        {seoBlocks.map((b, i) => (
          <section key={i} style={{ padding: "64px 30px", background: i % 2 === 0 ? "#FFFFFF" : "#F5F3EC" }} className="section">
            <div className="seo-row" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", direction: i % 2 === 1 ? "rtl" : "ltr" }}>
              <div style={{ direction: "ltr" }}>
                <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 26, fontWeight: 600, marginBottom: 16 }}>{b.title}</h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4A5A60", marginBottom: 18 }}>{b.text}</p>
                <a href={siteConfig.telephoneHref} className="btn-primary" aria-label={`Appeler DRM ${siteConfig.cityShort} au ${siteConfig.telephone}`}>
                  {[
                    "Demander une intervention",
                    "Joindre un technicien",
                    "Obtenir un devis gratuit",
                    "Nous contacter maintenant",
                  ][(ctaSeed + i) % 4]}
                </a>
              </div>
              <div style={{ direction: "ltr" }}>
                <img src={blockImgs[i]} alt={`${b.title}`} title={b.title} loading="lazy" decoding="async" style={{ width: "100%", height: 380, objectFit: "cover", borderRadius: 12 }} />
              </div>
            </div>
          </section>
        ))}

        {/* Bloc zone-specifique */}
        <ServiceZoneSpecific serviceLabel={c.serviceLabel} zoneName={zone.name} zoneSlug={zone.slug} image={imgs.block3} />

        {/* Carte OSM */}
        <section style={{ padding: "48px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 24, fontWeight: 600, marginBottom: 18 }}>
              Zone d&apos;intervention a {zone.name}
            </h2>
            <ServiceZoneMap lat={siteConfig.geo.latitude} lng={siteConfig.geo.longitude} zoneName={zone.name} postal={zone.cp} />
          </div>
        </section>

        {/* Pourquoi nous (cards avec images) */}
        <section style={{ padding: "64px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 600, marginBottom: 28, textAlign: "center" }}>
              {c.headings.why}
            </h2>
            <div className="grid-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
              {c.whyCards.map((w, i) => (
                <div key={w.title} style={{ background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <img src={whyImgs[i % whyImgs.length]} alt={`${w.title} — ${c.serviceLabel} a ${zone.name}`} title={w.title} loading="lazy" decoding="async" width={300} height={170} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                  <div style={{ padding: "18px 18px 22px" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#102228", marginBottom: 8 }}>{w.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "#4A5A60" }}>{w.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews — 6 avis Google nommes, avatar lettre + logo Google */}
        <section style={{ padding: "64px 30px", background: "#F5F3EC" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 600, color: "#102228", marginBottom: 8 }}>
                {c.headings.reviews}
              </h2>
              <p style={{ fontSize: 16, color: "#4A5A60" }}>{siteConfig.rating}/5 — {siteConfig.ratingCount} avis Google verifies dans tout {siteConfig.cityShort} et ses environs.</p>
            </div>
            <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
              {c.reviews.map((r, i) => (
                <div key={r.author} style={{ background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 12, padding: "22px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: avatarColors[i % avatarColors.length], color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                      {r.author.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#102228" }}>{r.author}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <img src="/images/gallery/google-logo.webp" alt="Avis Google" title="Avis Google" loading="lazy" decoding="async" width={16} height={16} style={{ width: 16, height: 16 }} />
                        <span style={{ fontSize: 12, color: "#7A8A90" }}>Avis Google · {r.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ color: "#F59E0B", fontSize: 15, letterSpacing: 1, marginBottom: 10 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#4A5A60" }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ service */}
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 600, marginBottom: 24 }}>{c.headings.faq}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {c.faq.map((f) => (
                <details key={f.q} style={{ background: "#F5F3EC", borderRadius: 12, padding: "16px 20px", border: "1px solid #E2DCD0" }}>
                  <summary style={{ fontWeight: 600, fontSize: 16, cursor: "pointer", color: "#102228" }}>{f.q}</summary>
                  <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.6, color: "#4A5A60" }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Maillage services + zones voisines */}
        <section style={{ padding: "56px 30px", background: "#F5F3EC" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ fontSize: 16, color: "#4A5A60", marginBottom: 24, maxWidth: 820 }}>
              {[
                `Nous intervenons dans toute la zone d'intervention de ${zone.name} et des arrondissements voisins pour l'ensemble de nos prestations de rideau metallique.`,
                `Au-dela du ${c.serviceLabel} a ${zone.name}, nos equipes assurent tous les services de rideau metallique dans le secteur et les arrondissements limitrophes.`,
                `De ${zone.name} aux arrondissements voisins, retrouvez l'ensemble de nos interventions de rideau metallique, du depannage a la fabrication.`,
              ][neighborSeed % 3]}
            </p>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, fontWeight: 600, marginBottom: 16 }}>{c.headings.otherServices}</h2>
            {/* Cartes maillage AVEC visuel DRM (1 image pertinente par service, distincte par prestation). */}
            <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 32 }}>
              {otherServices.map((s) => {
                const img = withBase((serviceImages[s.id] || serviceImages.depannage).hero);
                const label = `${s.name} rideau métallique à ${zone.name}`;
                return (
                  <a key={s.id} href={`/${s.slug}-${zone.slug}/`} style={{ display: "block", background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 12, overflow: "hidden", textDecoration: "none", color: "#102228" }}>
                    <img src={img} alt={label} title={label} loading="lazy" decoding="async" width={300} height={170} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                    <div style={{ padding: "14px 16px 18px" }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "#04323F" }}>{s.name} rideau metallique a {zone.name}</span>
                    </div>
                  </a>
                );
              })}
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, fontWeight: 600, marginBottom: 16 }}>{c.headings.neighborZones}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {otherZones.map((z) => (
                <a key={z.slug} href={`/${service.slug}-${z.slug}/`} style={{ fontSize: 14, color: "#04323F", background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 1000, padding: "9px 16px" }}>
                  {service.name} a {z.name}
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
              {c.headings.finalCta}
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.88)", marginBottom: 26 }}>Nos techniciens interviennent 24h/24 et 7j/7. Appelez maintenant pour un devis gratuit.</p>
            <a href={siteConfig.telephoneHref} className="btn-primary" style={{ fontSize: 17 }}>Appeler {siteConfig.telephone}</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
