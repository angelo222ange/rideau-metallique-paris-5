import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Appel et diagnostic",
    description:
      "Vous nous appelez au 01 84 16 31 81. Nous identifions la panne par telephone et vous donnons un premier conseil immediat, 24h/24.",
    image: "/images/gallery/depannage-rideau-metallique-drm-services.webp",
  },
  {
    number: "02",
    title: "Intervention rapide",
    description:
      "Un technicien se deplace en moins de 30 minutes sur votre commerce du 5e arrondissement, equipe du materiel necessaire.",
    image: "/images/gallery/protection-zone-rideau-metallique-drm.webp",
  },
  {
    number: "03",
    title: "Reparation et devis",
    description:
      "Nous etablissons un devis gratuit et clair, puis reparons sur place : lame, axe, moteur, serrure ou coffre.",
    image: "/images/gallery/pose-axe-rideau-metallique-drm.webp",
  },
  {
    number: "04",
    title: "Test et garantie",
    description:
      "Nous testons le rideau, verifions le bon fonctionnement et vous remettons une garantie sur l'intervention realisee.",
    image: "/images/gallery/test-reglage-axe-rideau-metallique-drm.webp",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div
        className="mx-auto flex flex-col lg:flex-row"
        style={{ maxWidth: 1200, padding: "80px 30px", gap: 40, margin: "0 auto" }}
      >
        {/* LEFT — Sticky Header */}
        <div className="lg:w-[332px] flex-shrink-0 lg:sticky lg:top-32 lg:self-start">
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
              Notre methode
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
            Un depannage en{" "}
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
              }}
            >
              4 etapes
            </span>
          </h2>
        </div>

        {/* RIGHT — Step Cards (stacked vertically) */}
        <div className="flex-1 flex flex-col" style={{ gap: 50 }}>
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col md:flex-row items-stretch overflow-hidden"
              style={{
                backgroundColor: "#F5F3EC",
                borderRadius: 12,
                padding: 32,
                gap: 32,
                maxHeight: 244,
                overflow: "hidden",
              }}
            >
              {/* Image */}
              <div
                className="relative flex-shrink-0 overflow-hidden"
                style={{
                  width: 200,
                  height: 180,
                  borderRadius: 12,
                }}
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center" style={{ gap: 20 }}>
                <h3
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: "#04323F",
                    fontFamily: "var(--font-geist)",
                  }}
                >
                  {step.number}. {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#102228",
                    opacity: 0.7,
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
