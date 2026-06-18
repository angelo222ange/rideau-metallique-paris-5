import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteConfig.url}/blog/${slug}/` },
  };
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: siteConfig.url + post.image,
    datePublished: post.date,
    author: { "@type": "Organization", name: siteConfig.brand },
    publisher: { "@type": "Organization", name: siteConfig.brand },
  };
  const bcLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog/` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteConfig.url}/blog/${slug}/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bcLd) }} />
      <Header />
      <main style={{ paddingTop: 78 }}>
        <article style={{ maxWidth: 760, margin: "0 auto", padding: "48px 30px 64px" }}>
          <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "#7C8A90", marginBottom: 16 }}>
            <Link href="/">Accueil</Link> / <Link href="/blog/">Blog</Link> / {post.title}
          </nav>
          <h1 style={{ fontWeight: 700, marginBottom: 18 }}>{post.title}</h1>
          <img
            src={post.image}
            alt={post.title}
            title={post.title}
            width={760}
            height={360}
            style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 12, marginBottom: 26 }}
          />
          {post.content.map((p, i) => (
            <div key={i}>
              {post.headings?.[i] && (
                <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 32, marginBottom: 14, color: "#102228" }}>
                  {post.headings[i]}
                </h2>
              )}
              <p style={{ fontSize: 17, lineHeight: 1.8, color: "#4A5A60", marginBottom: 18 }}>{p}</p>
            </div>
          ))}
          <a href={siteConfig.telephoneHref} className="btn-primary" style={{ marginTop: 16 }}>Appeler {siteConfig.telephone}</a>
        </article>
      </main>
      <Footer />
    </>
  );
}
