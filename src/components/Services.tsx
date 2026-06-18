import Image from "next/image";

const services = [
  {
    title: "Depannage de rideau metallique",
    description:
      "Rideau bloque, lame voilee ou moteur en panne ? Intervention d'urgence 24h/24 en moins de 30 minutes dans tout le 5e arrondissement.",
    image: "/images/gallery/depannage-rideau-metallique-drm-france-rm.webp",
    href: "/depannage-rideau-metallique-paris-4/",
  },
  {
    title: "Installation de rideau metallique",
    description:
      "Pose complete de rideaux metalliques neufs sur-mesure pour les commerces, bureaux et locaux du Quartier Latin.",
    image: "/images/gallery/installation-rideau-metallique-drm.webp",
    href: "/installation-rideau-metallique-paris-4/",
  },
  {
    title: "Reparation de rideau metallique",
    description:
      "Remise en etat des lames, du moteur, de l'axe et de la serrure de votre rideau metallique endommage.",
    image: "/images/gallery/depannage-rideau-metallique-drm-reparation.webp",
    href: "/reparation-rideau-metallique-paris-4/",
  },
  {
    title: "Motorisation de rideau metallique",
    description:
      "Automatisez votre rideau manuel avec un moteur Somfy, Simu, ACM ou Nice, pose et reglage compris.",
    image: "/images/gallery/motorisation-rideau-metallique-drm-depannage.webp",
    href: "/motorisation-rideau-metallique-paris-4/",
  },
  {
    title: "Deblocage de rideau metallique",
    description:
      "Liberation rapide d'un rideau metallique coince ou bloque, sans degrader votre devanture ni votre commerce.",
    image: "/images/gallery/test-rideau-metallique-drm.webp",
    href: "/deblocage-rideau-metallique-paris-4/",
  },
  {
    title: "Entretien de rideau metallique",
    description:
      "Maintenance preventive et contrats annuels pour eviter les pannes et prolonger la duree de vie de votre rideau.",
    image: "/images/gallery/entretien-rideau-metallique-drm-france.webp",
    href: "/entretien-rideau-metallique-paris-4/",
  },
  {
    title: "Fabrication de rideau metallique",
    description:
      "Fabrication sur-mesure de rideaux metalliques en acier, aluminium ou inox, aux dimensions exactes de votre ouverture.",
    image: "/images/gallery/hero-rideau-metallique-industriel.webp",
    href: "/fabrication-rideau-metallique-paris-4/",
  },
];

export default function Services() {
  return (
    <section
      id="our-services"
      style={{ backgroundColor: "#F5F3EC" }}
    >
      <div style={{ maxWidth: 1200, padding: "80px 30px", margin: "0 auto" }}>
        {/* Section Header */}
        <div className="text-center mx-auto mb-14" style={{ maxWidth: 700 }}>
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
              Nos services
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
            Tous les services rideau metallique a{" "}
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
              }}
            >
              Paris 5
            </span>
          </h2>
        </div>

        {/* Service Cards — 3 in a ROW */}
        <div className="grid md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="relative overflow-hidden group cursor-pointer"
              style={{
                borderRadius: 12,
                height: 431,
              }}
            >
              {/* Full image background */}
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark overlay card at bottom */}
              <div
                className="absolute bottom-6 left-6 right-6"
                style={{
                  backgroundColor: "#04323F",
                  borderRadius: 10,
                  padding: "20px 20px 0px",
                }}
              >
                <h3
                  className="mb-3"
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    fontFamily: "var(--font-geist)",
                    color: "#E0C075",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  className="mb-4 leading-relaxed"
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "rgba(245, 243, 236, 0.78)",
                    lineHeight: 1.5,
                  }}
                >
                  {service.description}
                </p>
                <a
                  href={service.href}
                  className="inline-flex items-center gap-2 mb-5 transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "#C9A24B",
                    color: "#04323F",
                    borderRadius: 1000,
                    padding: "8px 18px",
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: "var(--font-geist)",
                  }}
                >
                  En savoir plus
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 256 256"
                    fill="#04323F"
                  >
                    <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
