import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaticPageJsonLd from "@/components/StaticPageJsonLd";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig, zones, services } from "@/config/site";

export const metadata: Metadata = {
  title: "Zones d'intervention",
  description: "DRM Paris 5 intervient sur le rideau metallique a Paris 5e et dans les arrondissements et communes voisines : Paris 4e, 6e, 13e, Ivry, Le Kremlin-Bicetre...",
  alternates: { canonical: siteConfig.url + "/zones/" },
};

export default function ZonesPage() {
  return (
    <>
      <StaticPageJsonLd pageName="Zones d'intervention" pageUrl={`${siteConfig.url}/zones/`} />
      <Header />
      <main style={{ paddingTop: 78 }}>
        <section style={{ background: "#04323F", padding: "60px 30px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Breadcrumb dark items={[{ name: "Accueil", href: "/" }, { name: "Zones d'intervention" }]} />
            <h1 style={{ color: "#FFFFFF", fontWeight: 700, marginBottom: 12 }}>Nos zones d&apos;intervention rideau metallique</h1>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 17, maxWidth: 720 }}>
              Basee a Paris 5e arrondissement, notre equipe couvre le Quartier Latin et tous les
              arrondissements et communes limitrophes. Selectionnez une zone pour decouvrir nos
              services de rideau metallique a proximite.
            </p>
          </div>
        </section>
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p style={{ fontSize: 16, color: "#4A5A60", marginBottom: 32, maxWidth: 820 }}>
              Que vous soyez commercant rue Mouffetard, gerant d&apos;un restaurant pres de la
              Sorbonne ou proprietaire d&apos;un local a Ivry-sur-Seine, nos techniciens
              interviennent en moins de 30 minutes pour le depannage, l&apos;installation et la
              reparation de votre rideau metallique. Voici les {zones.length} zones desservies.
            </p>
            <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {zones.map((z) => (
                <div key={z.slug} style={{ border: "1px solid #E2DCD0", borderRadius: 12, padding: "20px 18px", background: "#F5F3EC" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#102228", marginBottom: 6 }}>{z.name}</h2>
                  <p style={{ fontSize: 13, color: "#7C8A90", marginBottom: 12 }}>{z.cp} — a {z.distance}</p>
                  <a href={`/rideau-metallique-${z.slug}/`} style={{ fontSize: 14, color: "#04323F", fontWeight: 600 }}>
                    Rideau metallique a {z.name} →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
