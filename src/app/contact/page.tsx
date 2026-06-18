import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaticPageJsonLd from "@/components/StaticPageJsonLd";
import Breadcrumb from "@/components/Breadcrumb";
import ServiceZoneMap from "@/components/ServiceZoneMap";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact rideau metallique Paris 5e",
  description: "Contactez DRM Paris 5 pour un depannage de rideau metallique a Paris 5e arrondissement. Intervention 24h/24, devis gratuit.",
  alternates: { canonical: siteConfig.url + "/contact/" },
};

const contactFaqs = [
  {
    q: "Comment contacter DRM Paris 5 pour un rideau metallique ?",
    a: "Le plus rapide est de nous appeler directement au " + siteConfig.telephone + " : notre standard est joignable 24h/24 et 7j/7 pour toute urgence sur un rideau metallique dans le 5e arrondissement de Paris. Vous pouvez aussi remplir le formulaire de demande de devis ci-dessus, nous vous rappelons dans les plus brefs delais.",
  },
  {
    q: "Quel est le delai de reponse a une demande de devis ?",
    a: "Pour une demande envoyee via le formulaire, nous vous recontactons generalement dans la journee. Pour une urgence (rideau bloque, devanture qui ne ferme plus), privilegiez l'appel telephonique : un technicien se deplace dans le 5e arrondissement et les quartiers voisins en moins de 30 minutes en moyenne.",
  },
  {
    q: "Que faire en cas d'urgence sur mon rideau metallique ?",
    a: "Ne forcez jamais un rideau metallique bloque, vous risqueriez d'aggraver la panne. Securisez votre local si le rideau est reste ouvert, puis appelez-nous au " + siteConfig.telephone + ". Nos equipes interviennent 24h/24 pour debloquer, reparer ou securiser votre devanture, de jour comme de nuit.",
  },
];

export default function ContactPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: contactFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <StaticPageJsonLd pageName="Contact" pageUrl={`${siteConfig.url}/contact/`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main style={{ paddingTop: 78 }}>
        <section style={{ background: "#04323F", padding: "60px 30px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Breadcrumb dark items={[{ name: "Accueil", href: "/" }, { name: "Contact" }]} />
            <h1 style={{ color: "#FFFFFF", fontWeight: 700, marginBottom: 12 }}>Contacter DRM Paris 5</h1>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 17, maxWidth: 640 }}>
              Une urgence sur votre rideau metallique a Paris 5e arrondissement ? Appelez-nous ou
              remplissez le formulaire : nous vous rappelons rapidement.
            </p>
          </div>
        </section>
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div className="grid-2col" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 26, fontWeight: 600, marginBottom: 18 }}>Nos coordonnees</h2>
              <p style={{ fontSize: 16, color: "#4A5A60", marginBottom: 10 }}>
                Telephone : <a href={siteConfig.telephoneHref} style={{ color: "#04323F", fontWeight: 700 }}>{siteConfig.telephone}</a>
              </p>
              <p style={{ fontSize: 16, color: "#4A5A60", marginBottom: 10 }}>Email : {siteConfig.email}</p>
              <p style={{ fontSize: 16, color: "#4A5A60", marginBottom: 10 }}>Adresse : {siteConfig.address}, {siteConfig.postalCode} {siteConfig.cityShort}</p>
              <p style={{ fontSize: 16, color: "#4A5A60", marginBottom: 10 }}>Zone : Paris 5e et arrondissements voisins</p>
              <p style={{ fontSize: 16, color: "#4A5A60", marginBottom: 24 }}>Horaires : {siteConfig.openingHours}</p>
              <ServiceZoneMap lat={siteConfig.geo.latitude} lng={siteConfig.geo.longitude} zoneName="Paris 5e arrondissement" postal={siteConfig.postalCode} />
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 26, fontWeight: 600, marginBottom: 18 }}>Demander un devis gratuit</h2>
              <ContactForm />
            </div>
          </div>
        </section>
        <section style={{ padding: "56px 30px", background: "#F5F3EC" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, fontWeight: 600, color: "#04323F", marginBottom: 24 }}>
              Questions frequentes sur le contact
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {contactFaqs.map((f, i) => (
                <div key={i} style={{ background: "#FFFFFF", border: "1px solid #E2DCD0", borderRadius: 12, padding: "20px 22px" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#04323F", marginBottom: 10 }}>{f.q}</h3>
                  <p style={{ fontSize: 15, color: "#4A5A60", lineHeight: 1.75, margin: 0 }}>{f.a}</p>
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
