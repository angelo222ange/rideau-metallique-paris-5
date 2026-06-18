import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaticPageJsonLd from "@/components/StaticPageJsonLd";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig, marques, zones } from "@/config/site";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "A propos de DRM rideau metallique Paris 5e",
  description:
    "DRM Paris 5, specialiste du rideau metallique a Paris 5e : depannage 24h/24, installation, motorisation et reparation par une equipe locale experimentee.",
  alternates: { canonical: siteConfig.url + "/a-propos/" },
};

const teal = "#04323F";
const tealDark = "#062932";
const or = "#C9A24B";

export default function AProposPage() {
  return (
    <>
      <StaticPageJsonLd
        pageName="A propos"
        pageUrl={`${siteConfig.url}/a-propos/`}
      />
      <Header />
      <main style={{ paddingTop: 78 }}>
        {/* HERO */}
        <section style={{ background: teal, padding: "64px 30px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <p
              style={{
                color: or,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              Notre entreprise
            </p>
            <Breadcrumb dark items={[{ name: "Accueil", href: "/" }, { name: "A propos" }]} />
            <h1 style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 36, marginBottom: 16 }}>
              DRM Paris 5, votre specialiste du rideau metallique
            </h1>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 17, maxWidth: 720, lineHeight: 1.7 }}>
              Depuis 2009, notre equipe intervient sur tous les rideaux
              metalliques du Quartier Latin et de Paris 5e arrondissement. Depannage
              d&apos;urgence, installation, motorisation et reparation : nous connaissons les
              commerces, les serrureries et les contraintes des devantures du 5e mieux que
              quiconque.
            </p>
            <div style={{ marginTop: 26 }}>
              <a
                href={siteConfig.telephoneHref}
                style={{
                  display: "inline-block",
                  background: or,
                  color: tealDark,
                  fontWeight: 700,
                  padding: "14px 26px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 17,
                }}
              >
                Appeler le {siteConfig.telephone}
              </a>
            </div>
          </div>
        </section>

        {/* NOTRE HISTOIRE */}
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: teal, marginBottom: 18 }}>
              Une expertise locale, fondee sur l&apos;experience du terrain
            </h2>
            <p style={{ fontSize: 16, color: "#4A5A60", lineHeight: 1.8, marginBottom: 16 }}>
              DRM Paris 5 est une entreprise specialisee dans le depannage et la maintenance
              de rideaux metalliques, au service des commercants de Paris 5e arrondissement
              depuis 2009. Fondee par une equipe de techniciens du metier, elle a
              accompagne des centaines de boutiques, restaurants, pharmacies et bureaux du
              Quartier Latin, de la Sorbonne au Jardin des Plantes, en passant par la Rue
              Mouffetard et la Rue Monge.
            </p>
            <p style={{ fontSize: 16, color: "#4A5A60", lineHeight: 1.8, marginBottom: 16 }}>
              Notre metier exige reactivite et savoir-faire technique. Un rideau metallique
              bloque, c&apos;est un commerce qui ne peut pas ouvrir, ou pire, une devanture qui
              reste ouverte la nuit. C&apos;est pourquoi nous garantissons une intervention rapide,
              7 jours sur 7, avec un parc de pieces detachees (lames, axes, ressorts, moteurs,
              serrures) qui nous permet de reparer sur place dans la grande majorite des cas.
            </p>
            <p style={{ fontSize: 16, color: "#4A5A60", lineHeight: 1.8 }}>
              Basee au {siteConfig.address}, {siteConfig.postalCode} {siteConfig.cityShort},
              notre equipe rayonne sur l&apos;ensemble du 5e arrondissement et les quartiers
              limitrophes. Chaque intervention est realisee par un technicien forme aux
              differents systemes de fermeture metallique : rideaux a lames pleines, a lames
              microperforees, grilles articulees ou rideaux a tablier galvanise.
            </p>
            <p style={{ fontSize: 14, color: "#7C8A90", lineHeight: 1.7, marginTop: 18 }}>
              DRM Paris 5 — SIRET : 98942786900015. Entreprise immatriculee, assurance
              responsabilite civile professionnelle.
            </p>
          </div>
        </section>

        {/* EQUIPE & EXPERTISE */}
        <section style={{ padding: "56px 30px", background: "#F5F3EC" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: teal, marginBottom: 20 }}>
              Notre equipe et notre savoir-faire
            </h2>
            <div
              className="grid-3col"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}
            >
              {[
                {
                  t: "Des techniciens specialises",
                  d: "Notre equipe de techniciens est dediee exclusivement aux rideaux metalliques. Chaque depanneur maitrise le diagnostic mecanique et electrique, du simple deblocage au remplacement de moteur tubulaire.",
                },
                {
                  t: "Une intervention 24h/24",
                  d: "Une urgence ne previent pas. Notre standard est joignable a toute heure et nos techniciens se deplacent dans le 5e arrondissement en moins de 30 minutes en moyenne, de jour comme de nuit.",
                },
                {
                  t: "Un materiel de qualite",
                  d: "Nous travaillons avec les grandes marques de motorisation et de mecanique de rideau pour garantir des reparations durables et des pieces compatibles avec votre installation existante.",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2DCD0",
                    borderRadius: 12,
                    padding: 22,
                  }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: teal, marginBottom: 10 }}>{c.t}</h3>
                  <p style={{ fontSize: 14.5, color: "#4A5A60", lineHeight: 1.7 }}>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAS VECUS */}
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: teal, marginBottom: 10 }}>
              Nos interventions recentes dans le 5e
            </h2>
            <p style={{ fontSize: 16, color: "#4A5A60", lineHeight: 1.8, marginBottom: 26 }}>
              Voici quelques exemples concrets de chantiers et de depannages realises par notre
              equipe dans le 5e arrondissement et ses rues voisines. Chaque cas illustre notre
              methode : diagnostic precis, reparation sur place et controle final avant la
              remise en service.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {caseStudies.map((cs, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: `4px solid ${or}`,
                    background: "#F5F3EC",
                    borderRadius: 8,
                    padding: "18px 22px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: teal, fontSize: 17 }}>{cs.rue}</span>
                    <span style={{ color: "#7C8A90", fontSize: 14, fontWeight: 600 }}>{cs.date}</span>
                  </div>
                  <p style={{ fontSize: 15, color: "#4A5A60", lineHeight: 1.75, margin: 0 }}>
                    {cs.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS / MARQUES */}
        <section style={{ padding: "56px 30px", background: "#062932" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#FFFFFF", marginBottom: 16 }}>
              Garanties, marques et certifications
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: 18 }}>
              Nos interventions sont couvertes par une assurance professionnelle et nos
              reparations beneficient d&apos;une garantie. Nous sommes agrees pour l&apos;installation
              et la maintenance des principaux systemes de motorisation du marche, ce qui nous
              permet de poser des pieces d&apos;origine et de respecter la norme NF EN 13241
              applicable aux fermetures industrielles.
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: 22 }}>
              Nous travaillons notamment avec les motorisations Somfy, Simu, ACM, Came et Nice,
              references reconnues pour leur fiabilite sur les rideaux metalliques de commerce.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {marques.map((m) => (
                <span
                  key={m}
                  style={{
                    background: or,
                    color: tealDark,
                    fontWeight: 700,
                    padding: "8px 16px",
                    borderRadius: 999,
                    fontSize: 14,
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ZONE DE COUVERTURE */}
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: teal, marginBottom: 16 }}>
              Notre zone d&apos;intervention
            </h2>
            <p style={{ fontSize: 16, color: "#4A5A60", lineHeight: 1.8, marginBottom: 18 }}>
              Implantee a {siteConfig.city}, notre equipe intervient en priorite dans tout le
              5e arrondissement, puis dans les arrondissements et communes limitrophes. Voici
              les principales zones que nous couvrons quotidiennement :
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {zones.map((z) => (
                <span
                  key={z.slug}
                  style={{
                    border: "1px solid #E2DCD0",
                    background: "#F5F3EC",
                    color: teal,
                    fontWeight: 600,
                    padding: "7px 14px",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                >
                  {z.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{ background: teal, padding: "52px 30px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF", marginBottom: 14 }}>
              Un rideau metallique en panne dans le 5e ?
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 24 }}>
              Notre equipe se deplace 24h/24 et 7j/7 dans Paris 5e arrondissement. Appelez-nous
              pour un diagnostic et un devis gratuit.
            </p>
            <a
              href={siteConfig.telephoneHref}
              style={{
                display: "inline-block",
                background: or,
                color: tealDark,
                fontWeight: 700,
                padding: "15px 30px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 18,
              }}
            >
              Appeler le {siteConfig.telephone}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
