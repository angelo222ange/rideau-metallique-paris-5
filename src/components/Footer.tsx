import { services, siteConfig } from "@/config/site";

const serviceLinks = services.map((svc) => ({
  label: svc.name + " de rideau metallique",
  href: `/${svc.slug}-paris-4/`,
}));

const zoneLinks = [
  { label: "Toutes nos zones d'intervention", href: "/zones/" },
];

const companyLinks = [
  { label: "Accueil", href: "/" },
  { label: "Contact", href: "/contact/" },
  { label: "Blog", href: "/blog/" },
  { label: "Plan du site", href: "/plan-du-site/" },
];

const legalLinks = [
  { label: "Mentions legales", href: "/mentions-legales/" },
  { label: "Confidentialite", href: "/confidentialite/" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#04323F", overflow: "hidden" }}>
      {/* Main footer content */}
      <div className="flex flex-col" style={{ maxWidth: 1200, padding: "100px 30px 40px", margin: "0 auto", gap: 40 }}>
        {/* Logo + phone CTA */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <a href="/" className="inline-flex items-center gap-3">
            <img src="/favicon.png" alt="DRM Paris 5" width={44} height={44} style={{ borderRadius: 8 }} />
            <span style={{ fontSize: 20, fontWeight: 600, color: "#FFFFFF", fontFamily: "var(--font-geist)" }}>
              {siteConfig.brand}
            </span>
          </a>
          <a
            href={siteConfig.phoneLink}
            className="inline-flex items-center gap-2 self-start transition-all hover:opacity-90"
            style={{
              backgroundColor: "#C9A24B",
              color: "#04323F",
              borderRadius: 1000,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "var(--font-geist)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 256 256" fill="#04323F">
              <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z" />
            </svg>
            {siteConfig.telephone}
          </a>
        </div>

        {/* Adresse NAP */}
        <p style={{ color: "rgba(255, 255, 255, 0.55)", fontSize: 14, margin: 0 }}>
          {siteConfig.address}, {siteConfig.postalCode} {siteConfig.cityShort}
        </p>

        {/* 4 Columns of links */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16"
        >
          {/* Services */}
          <div>
            <h3
              className="mb-5"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#FFFFFF",
                fontFamily: "var(--font-geist)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                    style={{
                      color: "rgba(255, 255, 255, 0.55)",
                      fontSize: 14,
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Zones */}
          <div>
            <h3
              className="mb-5"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#FFFFFF",
                fontFamily: "var(--font-geist)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Zones d&apos;intervention
            </h3>
            <ul className="space-y-3">
              {zoneLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                    style={{
                      color: "rgba(255, 255, 255, 0.55)",
                      fontSize: 14,
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3
              className="mb-5"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#FFFFFF",
                fontFamily: "var(--font-geist)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Entreprise
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                    style={{
                      color: "rgba(255, 255, 255, 0.55)",
                      fontSize: 14,
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Social */}
          <div>
            <h3
              className="mb-5"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#FFFFFF",
                fontFamily: "var(--font-geist)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Informations
            </h3>
            <ul className="space-y-3 mb-8">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                    style={{
                      color: "rgba(255, 255, 255, 0.55)",
                      fontSize: 14,
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="flex gap-3">
              {["facebook", "instagram", "twitter", "linkedin"].map(
                (platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-9 h-9 flex items-center justify-center transition-all hover:opacity-80"
                    style={{
                      backgroundColor: "#062932",
                      borderRadius: 1000,
                    }}
                    aria-label={platform}
                  >
                    <SocialIcon platform={platform} />
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* HUGE decorative brand text */}
        <div className="text-center overflow-hidden" style={{ height: 200 }}>
          <a
            href="/"
            className="inline-block"
            style={{
              fontSize: "clamp(70px, 13vw, 200px)",
              fontWeight: 500,
              fontFamily: "var(--font-geist)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              background:
                "linear-gradient(180deg, rgba(201, 162, 75, 0.22) 0%, rgba(4, 50, 63, 0.05) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DRM Paris 5
          </a>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <p style={{ color: "rgba(245, 243, 236, 0.5)", fontSize: 13 }}>
            &copy; 2025 DRM Paris 5 — Depannage rideau metallique Paris 5e arrondissement. Tous droits reserves.
          </p>
          <p style={{ color: "rgba(245, 243, 236, 0.35)", fontSize: 13 }}>
            {siteConfig.telephone} — 24h/24 et 7j/7
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const color = "#C9A24B";
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className="w-4 h-4" fill={color} viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg className="w-4 h-4" fill={color} viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4" fill={color} viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4" fill={color} viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  };
  return <>{icons[platform] || null}</>;
}
