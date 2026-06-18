import Image from "next/image";

const values = [
  "Chaque rideau metallique est repare avec precision et pieces d'origine.",
  "Intervention en moins de 30 minutes, 24h/24 et 7j/7 sur Paris 5.",
  "Devis gratuit et transparent, sans surprise sur la facture.",
  "Garantie sur chaque depannage, chaque pose et chaque motorisation.",
];

export default function CoreValues() {
  return (
    <section
      id="core-values"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div style={{ maxWidth: 1200, padding: "80px 30px", margin: "0 auto" }}>
        <div className="flex flex-col lg:flex-row items-stretch" style={{ gap: 80 }}>
          {/* Left — Image (tall 3:4 aspect ratio) */}
          <div className="w-full lg:w-[45%] flex-shrink-0 relative min-h-[500px] lg:min-h-[620px]">
            <div
              className="relative w-full h-full overflow-hidden"
              style={{ borderRadius: 20 }}
            >
              <Image
                src="/images/gallery/depannage-rideau-metallique-drm.webp"
                alt="Technicien depannage rideau metallique a Paris 5"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right — Content */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Tag pill */}
            <div
              className="inline-flex items-center px-4 py-2 mb-6 self-start"
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
                Nos engagements
              </span>
            </div>

            {/* Title */}
            <h2
              className="mb-6"
              style={{
                fontSize: 52,
                fontWeight: 500,
                fontFamily: "var(--font-geist)",
                color: "#04323F",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              Bien plus qu&apos;un simple{" "}
              <span
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                }}
              >
                depannage
              </span>
            </h2>

            {/* Description */}
            <p
              className="mb-10 leading-relaxed"
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "#102228",
                lineHeight: 1.7,
                opacity: 0.8,
              }}
            >
              Depuis plus de 25 ans, nous remettons en securite les rideaux
              metalliques des commerces du 5e arrondissement de Paris. Depannage
              d&apos;urgence, reparation, motorisation ou pose neuve : nos
              techniciens interviennent vite et bien, avec un materiel
              professionnel et des marques reconnues.
            </p>

            {/* Values list with checkmarks */}
            <div
              className="flex flex-col"
              style={{ borderTop: "1px solid #E2DCD0" }}
            >
              {values.map((value, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-5"
                  style={{
                    borderBottom: "1px solid #E2DCD0",
                  }}
                >
                  {/* Checkmark circle */}
                  <div
                    className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: "#C9A24B",
                      borderRadius: 1000,
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 256 256"
                      fill="#FFFFFF"
                    >
                      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#102228",
                      lineHeight: 1.5,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="tel:+33184163181"
              className="inline-flex items-center gap-2 self-start mt-8 transition-all hover:opacity-90"
              style={{
                backgroundColor: "#04323F",
                color: "#FFFFFF",
                borderRadius: 1000,
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 500,
                fontFamily: "var(--font-geist)",
              }}
            >
              Appeler le 01 84 16 31 81
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                fill="#FFFFFF"
              >
                <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
