import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaticPageJsonLd from "@/components/StaticPageJsonLd";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig, services, zones } from "@/config/site";

export const metadata: Metadata = {
  title: "Plan du site",
  description: "Plan du site DRM Paris 5 : toutes nos pages de services de rideau metallique par zone d'intervention.",
  alternates: { canonical: siteConfig.url + "/plan-du-site/" },
};

export default function PlanDuSite() {
  return (
    <>
      <StaticPageJsonLd pageName="Plan du site" pageUrl={`${siteConfig.url}/plan-du-site/`} />
      <Header />
      <main style={{ paddingTop: 78 }}>
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Plan du site" }]} />
            <h1 style={{ fontWeight: 700, marginBottom: 12 }}>Plan du site</h1>
            <p style={{ fontSize: 16, color: "#4A5A60", marginBottom: 32, maxWidth: 760 }}>
              Retrouvez l&apos;ensemble des pages de DRM Paris 5 : nos services de rideau metallique
              declines sur chacune de nos zones d&apos;intervention.
            </p>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Pages principales</h2>
              <ul style={{ display: "flex", flexWrap: "wrap", gap: 12, listStyle: "none" }}>
                {[["Accueil","/"],["Zones","/zones/"],["Blog","/blog/"],["Contact","/contact/"],["Mentions legales","/mentions-legales/"],["Confidentialite","/confidentialite/"]].map(([l,h]) => (
                  <li key={h}><a href={h} style={{ color: "#04323F", fontWeight: 600 }}>{l}</a></li>
                ))}
              </ul>
            </div>
            {zones.map((z) => (
              <div key={z.slug} style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{z.name}</h2>
                <ul style={{ display: "flex", flexWrap: "wrap", gap: 10, listStyle: "none" }}>
                  {services.map((s) => (
                    <li key={s.id}>
                      <a href={`/${s.slug}-${z.slug}/`} style={{ fontSize: 14, color: "#4A5A60" }}>
                        {s.name} rideau metallique a {z.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
