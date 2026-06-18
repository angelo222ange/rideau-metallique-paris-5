"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { siteConfig, services } from "@/config/site";

const colorPrimary = "#04323F";
const colorAccent = "#C9A24B";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 220);
  };

  // Liens services -> zone valide (arrondissement voisin), JAMAIS la ville-principale (anti-cannibalisation REGLE 6.8).
  const headerZone = "paris-4";

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "rgba(4,50,63,0.97)",
          backdropFilter: "blur(10px)",
          padding: "0 30px",
          borderBottom: "1px solid rgba(201,162,75,0.18)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 78,
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img
              src="/favicon.png"
              alt="DRM Paris 5 - Depannage Rideau Metallique"
              width={36}
              height={36}
              style={{ borderRadius: 8 }}
            />
            <span style={{ fontFamily: "var(--font-geist)", fontSize: 21, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
              DRM <span style={{ fontWeight: 400, opacity: 0.75 }}>Paris 5</span>
            </span>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: 26 }} className="desktop-nav">
            <Link href="/" style={navLink}>Accueil</Link>

            <div style={{ position: "relative" }} onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
              <button style={{ ...navLink, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                Services
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke={colorAccent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {servicesOpen && (
                <div style={{ position: "absolute", top: "100%", left: -16, paddingTop: 10, zIndex: 1001 }} onMouseEnter={openDropdown}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14 }} onMouseEnter={openDropdown} />
                  <div style={{ backgroundColor: "rgba(4,50,63,0.99)", backdropFilter: "blur(12px)", border: "1px solid rgba(201,162,75,0.22)", borderRadius: 12, padding: "8px 0", minWidth: 300, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
                    {services.map((svc) => (
                      <Link
                        key={svc.slug}
                        href={`/${svc.slug}-${headerZone}/`}
                        style={{ display: "block", fontFamily: "var(--font-geist)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)", textDecoration: "none", padding: "10px 22px" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(201,162,75,0.12)"; e.currentTarget.style.color = colorAccent; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                      >
                        {svc.name} rideau metallique
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/zones/" style={navLink}>Zones</Link>
            <Link href="/blog/" style={navLink}>Blog</Link>
            <Link href="/contact/" style={navLink}>Contact</Link>
          </nav>

          <a href={siteConfig.telephoneHref} style={ctaPhone} className="desktop-cta">
            <PhoneIcon />
            {siteConfig.telephone}
          </a>

          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }} className="mobile-burger" aria-label="Menu">
            <div style={{ width: 24, height: 2, backgroundColor: colorAccent, marginBottom: 6, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
            <div style={{ width: 24, height: 2, backgroundColor: colorAccent, marginBottom: 6, opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: 24, height: 2, backgroundColor: colorAccent, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, top: 78, zIndex: 999, backgroundColor: "rgba(4,50,63,0.99)", backdropFilter: "blur(12px)", padding: "24px 30px", overflowY: "auto" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Link href="/" onClick={() => setMobileOpen(false)} style={mobileLink}>Accueil</Link>
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontFamily: "var(--font-geist)", fontSize: 18, fontWeight: 600, color: colorAccent, padding: "16px 0" }}>Services</div>
              {services.map((svc) => (
                <Link key={svc.slug} href={`/${svc.slug}-${headerZone}/`} onClick={() => setMobileOpen(false)} style={{ display: "block", fontFamily: "var(--font-geist)", fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.72)", textDecoration: "none", padding: "10px 0 10px 16px" }}>
                  {svc.name} rideau metallique
                </Link>
              ))}
            </div>
            <Link href="/zones/" onClick={() => setMobileOpen(false)} style={mobileLink}>Zones</Link>
            <Link href="/blog/" onClick={() => setMobileOpen(false)} style={mobileLink}>Blog</Link>
            <Link href="/contact/" onClick={() => setMobileOpen(false)} style={mobileLink}>Contact</Link>
            <a href={siteConfig.telephoneHref} style={{ ...ctaPhone, marginTop: 24, justifyContent: "center", fontSize: 18 }}>
              <PhoneIcon />
              {siteConfig.telephone}
            </a>
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-burger { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-burger { display: none !important; }
        }
      `}</style>
    </>
  );
}

const navLink: React.CSSProperties = { fontFamily: "var(--font-geist)", fontSize: 15, fontWeight: 500, color: "#FFFFFF", textDecoration: "none" };
const mobileLink: React.CSSProperties = { fontFamily: "var(--font-geist)", fontSize: 18, fontWeight: 500, color: "#FFFFFF", textDecoration: "none", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" };
const ctaPhone: React.CSSProperties = { fontFamily: "var(--font-geist)", fontSize: 15, fontWeight: 600, backgroundColor: colorAccent, color: colorPrimary, padding: "13px 20px", borderRadius: 1000, height: 46, display: "inline-flex", alignItems: "center", textDecoration: "none", gap: 8 };

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colorPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
