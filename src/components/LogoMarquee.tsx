import Image from "next/image";

export default function LogoMarquee() {
  const logos = [
    "/images/marques/moteur-simu-rideau-metallique.webp",
    "/images/marques/moteur-acm-italian-rolling-power.webp",
    "/images/marques/logo-sommer-moteur-rideau-metallique.webp",
    "/images/marques/logo-afca-moteur-rideau-metallique.webp",
    "/images/marques/logo-masinara-moteur-rideau-metallique.webp",
    "/images/marques/logo-moteur-g-doorgate-rideau-metallique-drm.webp",
  ];

  return (
    <section
      style={{
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E2DCD0",
        borderBottom: "1px solid #E2DCD0",
      }}
    >
      <div
        className="py-5 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
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
    </section>
  );
}
