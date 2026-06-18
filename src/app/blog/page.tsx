import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StaticPageJsonLd from "@/components/StaticPageJsonLd";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog rideau metallique Paris 5e",
  description: "Conseils et actualites sur le rideau metallique a Paris 5e : entretien, motorisation, securite des commerces, choix des lames.",
  alternates: { canonical: siteConfig.url + "/blog/" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <>
      <StaticPageJsonLd pageName="Blog" pageUrl={`${siteConfig.url}/blog/`} />
      <Header />
      <main style={{ paddingTop: 78 }}>
        <section style={{ background: "#04323F", padding: "60px 30px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Breadcrumb dark items={[{ name: "Accueil", href: "/" }, { name: "Blog" }]} />
            <h1 style={{ color: "#FFFFFF", fontWeight: 700, marginBottom: 12 }}>Le blog du rideau metallique a Paris 5</h1>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 17, maxWidth: 720 }}>
              Retrouvez nos conseils d&apos;experts pour entretenir, motoriser et securiser votre
              rideau metallique dans le 5e arrondissement et au-dela.
            </p>
          </div>
        </section>
        <section style={{ padding: "56px 30px", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {posts.length === 0 ? (
              <p style={{ fontSize: 16, color: "#4A5A60" }}>Nos articles arrivent tres bientot.</p>
            ) : (
              <div className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
                {posts.map((p) => (
                  <a key={p.slug} href={`/blog/${p.slug}/`} style={{ border: "1px solid #E2DCD0", borderRadius: 12, overflow: "hidden", background: "#F5F3EC", display: "block" }}>
                    <img src={p.image} alt={p.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                    <div style={{ padding: "18px 20px" }}>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#102228", marginBottom: 8 }}>{p.title}</h2>
                      <p style={{ fontSize: 14, color: "#4A5A60" }}>{p.excerpt}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
