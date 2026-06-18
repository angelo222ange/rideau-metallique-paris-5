import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import ScrollToTop from "@/components/ScrollToTop";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "DRM Paris 5 - Depannage Rideau Metallique 24h/24",
    template: "%s | DRM Paris 5",
  },
  description:
    "Depannage, installation et reparation de rideau metallique a Paris 5e arrondissement. Intervention 24h/24, 7j/7 en moins de 30 minutes. Devis gratuit.",
  alternates: { canonical: siteConfig.url + "/" },
  openGraph: {
    title: "DRM Paris 5 - Depannage Rideau Metallique",
    description:
      "Intervention d'urgence sur rideau metallique a Paris 5e et arrondissements voisins. 24h/24, 7j/7.",
    url: siteConfig.url,
    siteName: siteConfig.brand,
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  // GSC : verification par balise HTML (methode META, pas fichier). Le token reel
  // est injecte au deploy via NEXT_PUBLIC_GSC_TOKEN (API siteVerification). Tant
  // qu'il est vide, aucune balise n'est emise (pas de placeholder fabrique).
  ...(siteConfig.gscVerification
    ? { verification: { google: siteConfig.gscVerification } }
    : {}),
  // Signaux SEO local — meta geo (region / placename / position + ICBM).
  other: {
    "geo.region": "FR-75",
    "geo.placename": "Paris 5e arrondissement",
    "geo.position": `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
    ICBM: `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geist.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "var(--font-geist)" }}>
        {children}
        {/* Floating CTA mobile — CSS-only (REGLE 9) */}
        <a
          href={siteConfig.telephoneHref}
          aria-label={`Appeler DRM Paris 5 au ${siteConfig.telephone}`}
          className="floating-cta-round"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#04323F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          Appeler {siteConfig.telephone}
        </a>
        <ScrollToTop />
      </body>
    </html>
  );
}
