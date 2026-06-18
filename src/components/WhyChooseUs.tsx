import Image from "next/image";

const features = [
  {
    title: "Intervention en 30 minutes",
    description:
      "Une equipe mobile basee a Paris 5, disponible 24h/24 et 7j/7 pour tout rideau metallique bloque ou force.",
    image: "/images/gallery/certification-qualite-depannage-rideau-metallique-drm.webp",
  },
  {
    title: "Techniciens specialises",
    description:
      "Une expertise eprouvee sur le rideau metallique : lames, axe, moteur, serrure et coffre.",
    image: "/images/gallery/test-rideau-metallique-drm.webp",
  },
  {
    title: "Pieces d'origine garanties",
    description:
      "Nous utilisons des pieces et moteurs de marques reconnues (Somfy, Simu, ACM, Sommer) avec garantie.",
    image: "/images/gallery/moteur-tubulaire-rideau-metallique-drm.webp",
  },
  {
    title: "Devis gratuit et clair",
    description:
      "Un diagnostic precis et un devis transparent avant toute intervention, sans surprise sur la facture.",
    image: "/images/gallery/prise-de-mesure-rideau-metallique-drm.webp",
  },
  {
    title: "Securite de votre commerce",
    description:
      "Apres une effraction, nous securisons votre devanture et remplacons serrure ou lame finale en urgence.",
    image: "/images/gallery/rideau-metallique-anti-effraction-blinde.webp",
  },
  {
    title: "Sur-mesure et fabrication",
    description:
      "Fabrication francaise de rideaux metalliques en acier, aluminium ou inox aux dimensions exactes.",
    image: "/images/gallery/fabrication-francaise-rideau-metallique.webp",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="choose-us"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div style={{ maxWidth: 1200, padding: "80px 30px 150px", margin: "0 auto" }}>
        {/* Section Header — LEFT title + RIGHT description */}
        <div
          className="flex flex-col lg:flex-row items-start mb-14"
          style={{ gap: 80 }}
        >
          {/* Left — Tag + Title */}
          <div style={{ maxWidth: 700 }}>
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
                Pourquoi nous choisir
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
              Pourquoi les commerces du 5e nous{" "}
              <span
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                }}
              >
                font confiance
              </span>
            </h2>
          </div>

          {/* Right — Description */}
          <div className="lg:mt-12" style={{ maxWidth: 360 }}>
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "#102228",
                opacity: 0.75,
                lineHeight: 1.6,
              }}
            >
              Un depannage de rideau metallique reussi, c'est bien plus qu'une
              reparation rapide : c'est la securite de votre commerce, un travail
              soigne et un service disponible a toute heure dans Paris 5.
            </p>
          </div>
        </div>

        {/* Horizontal scrolling marquee of feature cards with images */}
        <div
          className="overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          }}
        >
          <div
            className="flex animate-gallery-scroll"
            style={{ gap: 16 }}
          >
            {[...features, ...features, ...features].map((feature, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex flex-col overflow-hidden"
                style={{
                  width: 320,
                  height: 353,
                  backgroundColor: "#F5F3EC",
                  borderRadius: 8,
                }}
              >
                {/* Image */}
                <div className="relative flex-shrink-0" style={{ height: 180 }}>
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col" style={{ gap: 10 }}>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: "#04323F",
                      fontFamily: "var(--font-geist)",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#102228",
                      opacity: 0.7,
                      lineHeight: 1.55,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
