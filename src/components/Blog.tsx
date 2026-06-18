import Image from "next/image";

const articles = [
  {
    title: "Rideau metallique bloque : que faire en urgence ?",
    tag: "Depannage",
    date: "15 mars 2025",
    image: "/images/gallery/slimbox-boitiersecurise-deblocage-rideau-metallique.webp",
  },
  {
    title: "Motoriser son rideau metallique : etapes et avantages",
    tag: "Motorisation",
    date: "8 mars 2025",
    image: "/images/gallery/axe-motorise-rideau-metallique-poser.webp",
  },
  {
    title: "Securiser sa devanture apres une effraction a Paris",
    tag: "Securite",
    date: "28 fevrier 2025",
    image: "/images/gallery/installation-rideau-metallique-anti-effraction.webp",
  },
];

export default function Blog() {
  return (
    <section
      id="articles"
      style={{ backgroundColor: "#F5F3EC" }}
    >
      <div style={{ maxWidth: 1200, padding: "80px 30px", margin: "0 auto" }}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            {/* Tag pill */}
            <div
              className="inline-flex items-center px-4 py-2 mb-6"
              style={{
                border: "1px solid #E2DCD0",
                borderRadius: 1000,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#04323F",
                  fontFamily: "var(--font-geist)",
                }}
              >
                Blog
              </span>
            </div>

            <h2
              className="leading-tight"
              style={{
                fontSize: 52,
                fontWeight: 500,
                fontFamily: "var(--font-geist)",
                color: "#04323F",
                letterSpacing: "-0.01em",
              }}
            >
              Nos conseils{" "}
              <span
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                }}
              >
                rideau metallique
              </span>
            </h2>
          </div>
          <a
            href="/blog/"
            className="inline-flex items-center gap-2 flex-shrink-0 transition-all hover:opacity-90"
            style={{
              backgroundColor: "#04323F",
              color: "#FFFFFF",
              borderRadius: 1000,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 500,
              fontFamily: "var(--font-geist)",
            }}
          >
            Voir tous les articles
            <svg width="14" height="14" viewBox="0 0 256 256" fill="#FFFFFF">
              <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
            </svg>
          </a>
        </div>

        {/* Blog Cards — 3 in a ROW */}
        <div className="grid md:grid-cols-3 gap-5">
          {articles.map((article, i) => (
            <article
              key={i}
              className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
                border: "1px solid #E2DCD0",
                minHeight: 487,
              }}
            >
              {/* Image */}
              <div
                className="relative overflow-hidden"
                style={{ height: 280, padding: 20 }}
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tag + Date */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-block text-xs px-3 py-1"
                    style={{
                      backgroundColor: "#F5F3EC",
                      color: "#04323F",
                      borderRadius: 1000,
                      fontWeight: 500,
                      border: "1px solid #E2DCD0",
                    }}
                  >
                    {article.tag}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#04323F",
                      opacity: 0.5,
                    }}
                  >
                    {article.date}
                  </span>
                </div>

                <h3
                  className="mb-4 leading-snug"
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    fontFamily: "var(--font-geist)",
                    color: "#04323F",
                  }}
                >
                  {article.title}
                </h3>

                {/* Read More */}
                <a
                  href="/blog/"
                  className="inline-flex items-center gap-2 transition-all hover:opacity-80"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#04323F",
                    fontFamily: "var(--font-geist)",
                  }}
                >
                  Lire l&apos;article
                  <div
                    className="w-6 h-6 flex items-center justify-center"
                    style={{
                      backgroundColor: "#F5F3EC",
                      borderRadius: 1000,
                      border: "1px solid #E2DCD0",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 256 256"
                      fill="#04323F"
                    >
                      <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
                    </svg>
                  </div>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
