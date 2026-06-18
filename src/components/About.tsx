import Image from "next/image";

const logos = [
  "/images/marques/moteur-simu-rideau-metallique.webp",
  "/images/marques/moteur-acm-italian-rolling-power.webp",
  "/images/marques/logo-sommer-moteur-rideau-metallique.webp",
  "/images/marques/logo-afca-moteur-rideau-metallique.webp",
  "/images/marques/logo-masinara-moteur-rideau-metallique.webp",
  "/images/marques/logo-moteur-g-doorgate-rideau-metallique-drm.webp",
];

const stats = [
  { number: "25+", label: "Annees d'experience", desc: "Un savoir-faire eprouve sur le rideau metallique a Paris 5 et alentours." },
  { number: "5000+", label: "Interventions realisees", desc: "Commerces, bureaux et locaux depannes dans tout le 5e arrondissement." },
  { number: "30 min", label: "Delai d'intervention", desc: "Une equipe mobilisee en urgence 24h/24 et 7j/7 sur Paris 5." },
  { number: "4.9/5", label: "Note Google", desc: "127 avis clients verifies pour un service fiable et garanti." },
];

export default function About() {
  return (
    <section id="about-us" style={{ backgroundColor: "#F5F3EC" }}>
      <div
        className="flex flex-col"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 30px", gap: 80 }}
      >
        {/* Row 0: Logo Bar (matches original — inside About section) */}
        <div>
          <p
            className="text-center mb-4"
            style={{ fontSize: 16, fontWeight: 400, color: "#04323F", opacity: 0.6 }}
          >
            Les grandes marques de motorisation que nous installons
          </p>
          <div
            className="overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <div className="flex animate-marquee" style={{ gap: 60 }}>
              {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 relative"
                  style={{ width: 160, height: 40, opacity: 0.55 }}
                >
                  <Image
                    src={logo}
                    alt="Marque de moteur de rideau metallique"
                    fill
                    className="object-contain"
                    style={{ filter: "grayscale(100%)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 1: Tag pill LEFT + Text RIGHT */}
        <div className="flex flex-col lg:flex-row" style={{ gap: 60 }}>
          <div className="flex-shrink-0">
            <div
              className="inline-flex items-center px-3 py-1"
              style={{ border: "1px solid #E2DCD0", borderRadius: 1000 }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#04323F", fontFamily: "var(--font-geist)" }}>
                A propos
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col" style={{ gap: 20 }}>
            <p style={{ fontSize: 28, fontWeight: 500, fontFamily: "var(--font-geist)", color: "#04323F", lineHeight: 1.3 }}>
              Chez{" "}
              <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                DRM Paris 5{" "}
              </span>
              nous depannons, installons et reparons les rideaux metalliques des
              commerces du Quartier Latin depuis plus de 25 ans. Une equipe de
              techniciens specialises intervient en urgence dans tout le 5e
              arrondissement, du Pantheon a la rue Mouffetard.
            </p>
            <p style={{ fontSize: 16, fontWeight: 400, color: "#102228", lineHeight: 1.7, opacity: 0.75 }}>
              Rideau bloque, lame voilee, moteur hors service, serrure forcee
              apres une effraction : nous traitons toutes les pannes sur place,
              de jour comme de nuit. Devis gratuit, pieces d'origine et garantie
              sur chaque intervention. Notre objectif : remettre votre devanture
              en securite le plus vite possible, sans degrader votre commerce.
            </p>
          </div>
        </div>

        {/* Row 2: Statistics — 4 cards in a ROW */}
        <div className="flex flex-col md:flex-row" style={{ gap: 16 }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col justify-between"
              style={{ backgroundColor: "#FFFFFF", borderRadius: 12, padding: "28px 20px", minHeight: 284 }}
            >
              <p style={{ fontSize: 56, fontWeight: 400, color: "#04323F", fontFamily: "var(--font-geist)", lineHeight: 1 }}>
                {stat.number}
              </p>
              <div>
                <p className="mb-2" style={{ fontSize: 16, fontWeight: 600, color: "#102228", fontFamily: "var(--font-geist)" }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 400, color: "#04323F", opacity: 0.6, lineHeight: 1.5 }}>
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
