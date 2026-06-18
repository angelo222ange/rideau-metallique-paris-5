import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaticPageJsonLd from "@/components/StaticPageJsonLd";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Mentions legales",
  description: "Mentions legales du site DRM Paris 5, service de depannage de rideau metallique a Paris 5e arrondissement.",
  alternates: { canonical: siteConfig.url + "/mentions-legales/" },
};

export default function MentionsLegales() {
  return (
    <>
      <StaticPageJsonLd pageName="Mentions legales" pageUrl={`${siteConfig.url}/mentions-legales/`} />
      <Header />
      <main style={{ paddingTop: 78 }}>
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Mentions legales" }]} />
            <h1 style={{ fontWeight: 700, marginBottom: 24 }}>Mentions legales</h1>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>Editeur du site</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4A5A60" }}>
              Ce site est edite par DRM Paris 5, service de depannage de rideau metallique a Paris 5e
              arrondissement. SIRET : 98942786900015. Telephone : {siteConfig.telephone}. Email : {siteConfig.email}.
            </p>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>Zone d&apos;intervention</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4A5A60" }}>
              Paris 5e arrondissement ({siteConfig.postalCode}), {siteConfig.region}, ainsi que les
              arrondissements et communes limitrophes.
            </p>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>Hebergement</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4A5A60" }}>
              Le site est heberge sur un serveur dedie situe en France. Pour toute demande
              relative aux informations legales de l&apos;entreprise, vous pouvez nous contacter
              par telephone au {siteConfig.telephone} ou par email a {siteConfig.email}.
            </p>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>Propriete intellectuelle</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4A5A60" }}>
              L&apos;ensemble des contenus de ce site (textes, images, logo) est protege. Toute
              reproduction sans autorisation est interdite.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
