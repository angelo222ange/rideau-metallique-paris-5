import { Check } from "lucide-react";

const engagementsGauche = [
  "Devis gratuit et detaille avant toute intervention",
  "Intervention d'urgence en moins de 30 minutes",
  "Disponible 24h/24 et 7j/7, week-ends et jours feries",
  "Diagnostic clair, sans frais de deplacement caches",
  "Techniciens specialises rideau metallique depuis 25 ans",
];

const engagementsDroite = [
  "Pieces et moteurs d'origine (Somfy, Simu, ACM, Sommer)",
  "Garantie sur chaque depannage, pose et motorisation",
  "Securisation immediate apres effraction ou blocage",
  "Travail soigne, sans degradation de votre devanture",
  "Interventions dans tout le 5e arrondissement de Paris",
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="flex flex-col" style={{ maxWidth: 1200, padding: "80px 30px", margin: "0 auto", gap: 50 }}>
        {/* Section Header */}
        <div className="text-center mx-auto" style={{ maxWidth: 700 }}>
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
              Nos engagements
            </span>
          </div>

          <h2
            className="leading-tight mb-4"
            style={{
              fontSize: 52,
              fontWeight: 500,
              fontFamily: "var(--font-geist)",
              color: "#04323F",
              letterSpacing: "-0.01em",
            }}
          >
            Un service fiable, clair et{" "}
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
              }}
            >
              sans surprise
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "#102228",
              opacity: 0.7,
              lineHeight: 1.6,
            }}
          >
            Chaque rideau metallique est unique : nous etablissons toujours un
            devis gratuit sur place avant d'intervenir. Voici ce que nous vous
            garantissons a chaque depannage dans Paris 5.
          </p>
        </div>

        {/* Engagements — Two columns side by side */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Colonne 1 — Reactivite */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              border: "1px solid #E2DCD0",
              boxShadow: "0px 6px 20px rgba(4, 50, 63, 0.05)",
              padding: "40px 32px",
              minHeight: 420,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  backgroundColor: "#04323F",
                  borderRadius: 40,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 256 256"
                  fill="#C9A24B"
                >
                  <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#04323F",
                  fontFamily: "var(--font-geist)",
                }}
              >
                Reactivite et disponibilite
              </h3>
            </div>
            <p
              className="mb-8"
              style={{
                fontSize: 14,
                color: "#102228",
                opacity: 0.6,
              }}
            >
              Une equipe d'urgence joignable a toute heure
            </p>

            {/* Liste */}
            <ul className="space-y-4 mb-8">
              {engagementsGauche.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    size={18}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#04323F" }}
                  />
                  <span
                    style={{
                      fontSize: 15,
                      color: "#102228",
                      opacity: 0.85,
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="tel:+33184163181"
              className="w-full inline-flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                backgroundColor: "#04323F",
                color: "#FFFFFF",
                borderRadius: 1000,
                padding: "14px 24px",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Appeler le 01 84 16 31 81
              <div
                className="w-6 h-6 flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 1000,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 256 256"
                  fill="#FFFFFF"
                >
                  <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
                </svg>
              </div>
            </a>
          </div>

          {/* Colonne 2 — Qualite */}
          <div
            className="relative"
            style={{
              backgroundColor: "#04323F",
              borderRadius: 12,
              boxShadow: "0px 6px 20px rgba(4, 50, 63, 0.18)",
              padding: "40px 32px",
              minHeight: 420,
            }}
          >
            {/* Badge */}
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2"
              style={{
                backgroundColor: "#C9A24B",
                color: "#04323F",
                borderRadius: 1000,
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Qualite garantie
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  backgroundColor: "#C9A24B",
                  borderRadius: 40,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 256 256"
                  fill="#04323F"
                >
                  <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-geist)",
                }}
              >
                Qualite et garanties
              </h3>
            </div>
            <p
              className="mb-8"
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.65)",
              }}
            >
              Un travail durable, avec des pieces d&apos;origine.
            </p>

            {/* Liste */}
            <ul className="space-y-4 mb-8">
              {engagementsDroite.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    size={18}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#C9A24B" }}
                  />
                  <span
                    style={{
                      fontSize: 15,
                      color: "rgba(255, 255, 255, 0.85)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="/contact/"
              className="w-full inline-flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#04323F",
                borderRadius: 1000,
                padding: "14px 24px",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Demander un devis gratuit
              <div
                className="w-6 h-6 flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(4, 50, 63, 0.1)",
                  borderRadius: 1000,
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 256 256"
                  fill="#04323F"
                >
                  <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* CTA Bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between"
          style={{
            padding: "50px 40px",
            backgroundColor: "#F5F3EC",
            borderRadius: 14,
            border: "1px solid #E2DCD0",
            marginTop: 20,
            minHeight: 191,
            gap: 30,
          }}
        >
          <div>
            <h3
              className="mb-3"
              style={{
                fontSize: 40,
                fontWeight: 500,
                color: "#04323F",
                fontFamily: "var(--font-geist)",
              }}
            >
              Un rideau metallique en panne{" "}
              <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>?</span>
            </h3>
            <p
              style={{
                fontSize: 16,
                color: "#102228",
                opacity: 0.7,
                lineHeight: 1.6,
              }}
            >
              Decrivez-nous votre probleme et nous vous rappelons immediatement
              avec un devis gratuit, adapte a votre commerce de Paris 5.
            </p>
          </div>
          <a
            href="tel:+33184163181"
            className="inline-flex items-center gap-2 flex-shrink-0 transition-all hover:opacity-90"
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
            Appeler maintenant
            <div
              className="w-6 h-6 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 1000,
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 256 256"
                fill="#FFFFFF"
              >
                <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
