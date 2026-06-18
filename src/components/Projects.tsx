import Image from "next/image";

const projects = [
  {
    title: "Rideau metallique lame pleine pour commerce",
    description:
      "Pose d'un rideau metallique a lames pleines sur la devanture d'une boutique du Quartier Latin.",
    image: "/images/gallery/realisation-rideau-metallique-lame-pleine-commerce.webp",
  },
  {
    title: "Grille extensible de restaurant",
    description:
      "Installation d'une grille extensible securisee pour un restaurant.",
    image: "/images/gallery/rideau-metallique-restaurant-grille-extensible.webp",
  },
  {
    title: "Grille bijoutier renforcee",
    description:
      "Pose d'une grille bijoutier anti-effraction pour une bijouterie.",
    image: "/images/gallery/rideau-metallique-bijouterie-grille-bijoutier.webp",
  },
  {
    title: "Motorisation de rideau metallique de garage",
    description:
      "Motorisation et reglage d'un rideau metallique de garage avec commande electrique.",
    image: "/images/gallery/rideau-metallique-motorise-garage.webp",
  },
];

export default function Projects() {
  return (
    <section
      id="gallery"
      style={{ backgroundColor: "#F5F3EC" }}
    >
      <div style={{ maxWidth: 1200, padding: "80px 30px", margin: "0 auto" }}>
        {/* Section Header */}
        <div className="mb-12" style={{ maxWidth: 700 }}>
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
              Realisations
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
            Nos interventions sur{" "}
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

        {/* Bento Grid — 3 columns */}
        <div className="grid grid-cols-3 gap-4" style={{ gridAutoRows: "277px" }}>
          {/* Card 1 — tall, spans 2 rows */}
          <div
            className="relative overflow-hidden row-span-2 group cursor-pointer"
            style={{ borderRadius: 12 }}
          >
            <Image
              src={projects[0].image}
              alt={projects[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(4, 50, 63, 0.88) 0%, transparent 50%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <h3
                className="mb-1"
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-geist)",
                }}
              >
                {projects[0].title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(245, 243, 236, 0.8)",
                  lineHeight: 1.5,
                }}
              >
                {projects[0].description}
              </p>
            </div>
          </div>

          {/* Card 2 — top right */}
          <div
            className="relative overflow-hidden group cursor-pointer"
            style={{ borderRadius: 12 }}
          >
            <Image
              src={projects[1].image}
              alt={projects[1].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(4, 50, 63, 0.88) 0%, transparent 50%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-geist)",
                }}
              >
                {projects[1].title}
              </h3>
            </div>
          </div>

          {/* Card 3 — top right */}
          <div
            className="relative overflow-hidden group cursor-pointer"
            style={{ borderRadius: 12 }}
          >
            <Image
              src={projects[2].image}
              alt={projects[2].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(4, 50, 63, 0.88) 0%, transparent 50%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-geist)",
                }}
              >
                {projects[2].title}
              </h3>
            </div>
          </div>

          {/* Card 4 — bottom, spans 2 columns */}
          <div
            className="relative overflow-hidden col-span-2 group cursor-pointer"
            style={{ borderRadius: 12 }}
          >
            <Image
              src={projects[3].image}
              alt={projects[3].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(4, 50, 63, 0.88) 0%, transparent 50%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <h3
                className="mb-1"
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-geist)",
                }}
              >
                {projects[3].title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(245, 243, 236, 0.8)",
                  lineHeight: 1.5,
                }}
              >
                {projects[3].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
