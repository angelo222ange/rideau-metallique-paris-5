import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 78 }}>
        <section style={{ padding: "100px 30px", background: "#FFFFFF", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h1 style={{ fontWeight: 700, marginBottom: 16 }}>Page introuvable</h1>
            <p style={{ fontSize: 17, color: "#4A5A60", marginBottom: 28 }}>
              La page que vous cherchez n&apos;existe pas ou a ete deplacee. Besoin d&apos;un
              depannage de rideau metallique a Paris 5e ? Appelez-nous.
            </p>
            <div className="stack-mobile" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/" className="btn-primary">Retour a l&apos;accueil</a>
              <a href={siteConfig.telephoneHref} className="btn-outline" style={{ color: "#04323F", borderColor: "#04323F" }}>Appeler {siteConfig.telephone}</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
