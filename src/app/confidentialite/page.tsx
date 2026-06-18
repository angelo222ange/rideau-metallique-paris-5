import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaticPageJsonLd from "@/components/StaticPageJsonLd";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description: "Politique de confidentialite du site DRM Paris 5 : traitement des donnees personnelles collectees via le formulaire de contact.",
  alternates: { canonical: siteConfig.url + "/confidentialite/" },
};

export default function Confidentialite() {
  return (
    <>
      <StaticPageJsonLd pageName="Politique de confidentialite" pageUrl={`${siteConfig.url}/confidentialite/`} />
      <Header />
      <main style={{ paddingTop: 78 }}>
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Politique de confidentialite" }]} />
            <h1 style={{ fontWeight: 700, marginBottom: 24 }}>Politique de confidentialite</h1>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>Donnees collectees</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4A5A60" }}>
              Lorsque vous remplissez notre formulaire de contact, nous collectons votre nom, votre
              numero de telephone, votre adresse email et votre message dans le seul but de traiter
              votre demande de depannage de rideau metallique.
            </p>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>Utilisation des donnees</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4A5A60" }}>
              Vos donnees ne sont jamais revendues. Elles servent uniquement a vous recontacter et a
              organiser l&apos;intervention. Elles sont conservees le temps necessaire au traitement.
            </p>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>Vos droits</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4A5A60" }}>
              Conformement au RGPD, vous disposez d&apos;un droit d&apos;acces, de rectification et de
              suppression de vos donnees. Pour l&apos;exercer, contactez-nous au {siteConfig.telephone}
              ou par email a {siteConfig.email}.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
