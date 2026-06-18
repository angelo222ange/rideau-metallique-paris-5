import Image from "next/image";

export default function CTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{ minHeight: 800, backgroundColor: "#04323F" }}
    >
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/gallery/realisation-rideau-metallique-garage.webp"
          alt="Technicien rideau metallique a Paris 5"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(4, 50, 63, 0.82)" }}
        />
      </div>

      {/* Content — LEFT text + RIGHT form */}
      <div
        className="relative z-10 mx-auto px-6 py-20 md:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
        style={{ maxWidth: 1200 }}
      >
        {/* Left — Heading + Description */}
        <div className="flex-1">
          <h2
            className="mb-5"
            style={{
              fontSize: 48,
              fontWeight: 600,
              fontFamily: "var(--font-geist)",
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Un rideau metallique a{" "}
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
              }}
            >
              depanner ?
            </span>
          </h2>
          <p
            className="leading-relaxed mb-8"
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.7,
              maxWidth: 480,
            }}
          >
            Notre equipe intervient en moins de 30 minutes dans tout le 5e
            arrondissement de Paris, 24h/24 et 7j/7. Appelez-nous ou demandez un
            devis gratuit : nous securisons votre commerce sans attendre.
          </p>
          <a
            href="tel:+33184163181"
            className="inline-flex items-center gap-3 transition-all hover:opacity-90"
            style={{
              backgroundColor: "#C9A24B",
              color: "#04323F",
              borderRadius: 1000,
              padding: "16px 32px",
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "var(--font-geist)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 256 256" fill="#04323F">
              <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z" />
            </svg>
            01 84 16 31 81
          </a>
        </div>

        {/* Right — Form Card */}
        <div
          className="w-full max-w-md p-8"
          style={{
            backgroundColor: "#062932",
            borderRadius: 14,
          }}
        >
          <h3
            className="mb-6 text-center"
            style={{
              fontSize: 22,
              fontWeight: 600,
              fontFamily: "var(--font-geist)",
              color: "#FFFFFF",
            }}
          >
            Demander un devis gratuit
          </h3>

          {/* Name Input */}
          <input
            type="text"
            placeholder="Votre nom"
            className="w-full px-5 py-4 mb-3 outline-none"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 10,
              color: "#FFFFFF",
              fontSize: 15,
              fontFamily: "var(--font-geist)",
            }}
          />

          {/* Phone Input */}
          <input
            type="tel"
            placeholder="Votre numero de telephone"
            className="w-full px-5 py-4 mb-3 outline-none"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 10,
              color: "#FFFFFF",
              fontSize: 15,
              fontFamily: "var(--font-geist)",
            }}
          />

          {/* Message Textarea */}
          <textarea
            placeholder="Decrivez votre probleme de rideau metallique..."
            rows={4}
            className="w-full px-5 py-4 mb-4 outline-none resize-none"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 10,
              color: "#FFFFFF",
              fontSize: 15,
              fontFamily: "var(--font-geist)",
            }}
          />

          {/* Submit Button */}
          <button
            className="w-full inline-flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{
              backgroundColor: "#C9A24B",
              color: "#04323F",
              borderRadius: 10,
              padding: "14px 28px",
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "var(--font-geist)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Envoyer ma demande
            <svg
              width="14"
              height="14"
              viewBox="0 0 256 256"
              fill="#04323F"
            >
              <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
