export const siteConfig = {
  name: "DRM Paris 5",
  brand: "DRM Paris 5",
  fullName: "Depannage Rideau Metallique Paris 5e",
  domain: "depannagerideau-metallique-paris-5.fr",
  url: "https://depannagerideau-metallique-paris-5.fr",
  phone: "01 84 16 31 81",
  telephone: "01 84 16 31 81",
  phoneLink: "tel:+33184163181",
  telephoneHref: "tel:+33184163181",
  email: "contact@depannagerideau-metallique-paris-5.fr",
  city: "Paris 5e arrondissement",
  cityShort: "Paris",
  citySlug: "paris-5",
  postalCode: "75005",
  department: "Paris",
  departmentCode: "75",
  region: "Ile-de-France",
  // Adresse GBP : immeuble residentiel reel en 75005 (OSM building=apartments
  // 8 niveaux / 619 m² + BAN housenumber score 0.97). NE JAMAIS inventer.
  address: "55 Rue Geoffroy-Saint-Hilaire",
  geo: {
    latitude: 48.843233,
    longitude: 2.35508,
  },
  openingHours: "24h/24 - 7j/7",
  experience: "25+",
  delai: "30",
  rating: "4.9",
  ratingCount: "127",
  interventions: "5000+",
  // Hero background — SCENE large et impactante (rue parisienne, 2 techniciens en intervention
  //   sur devanture). Curation visuelle 2026-06-18 : ex hero-rideau-polycarbonate.webp etait un
  //   rendu produit isole sur fond blanc (INTERDIT en hero). Remplace par une vraie scene.
  heroBg: "installation-rideau-metallique-drm.webp",
  // GSC : token de verification META (balise HTML). Issu de l'API siteVerification
  // au deploy (creation de la propriete GSC). NE JAMAIS inventer une valeur.
  // Surchargeable via NEXT_PUBLIC_GSC_TOKEN au build de deploy.
  gscVerification: process.env.NEXT_PUBLIC_GSC_TOKEN || "",
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
};

export const services: Service[] = [
  {
    id: "depannage",
    name: "Depannage",
    slug: "depannage-rideau-metallique",
    description:
      "Intervention d'urgence 24h/24 sur rideau metallique en panne dans le 5e arrondissement de Paris",
    shortDescription: "Rideau bloque ? Intervention en moins de 30 minutes.",
  },
  {
    id: "installation",
    name: "Installation",
    slug: "installation-rideau-metallique",
    description:
      "Pose complete de rideaux metalliques neufs pour commerces, bureaux et locaux du Quartier Latin",
    shortDescription: "Pose sur-mesure pour commerces, bureaux et entrepots.",
  },
  {
    id: "reparation",
    name: "Reparation",
    slug: "reparation-rideau-metallique",
    description:
      "Remise en etat de rideaux metalliques endommages : lames, moteur, axe, serrure",
    shortDescription: "Lames, moteur, axe, serrure : reparation garantie.",
  },
  {
    id: "motorisation",
    name: "Motorisation",
    slug: "motorisation-rideau-metallique",
    description:
      "Automatisation de rideaux metalliques manuels avec moteurs Somfy, Simu, ACM et Nice",
    shortDescription: "Passez a l'electrique avec Somfy, Simu ou Nice.",
  },
  {
    id: "deblocage",
    name: "Deblocage",
    slug: "deblocage-rideau-metallique",
    description:
      "Liberation urgente de rideaux metalliques coinces, sans degradation de la devanture",
    shortDescription: "Rideau coince ? Liberation rapide sans degradation.",
  },
  {
    id: "entretien",
    name: "Entretien",
    slug: "entretien-rideau-metallique",
    description:
      "Maintenance preventive et contrats annuels pour rideaux metalliques de commerce",
    shortDescription: "Evitez les pannes avec un entretien regulier.",
  },
  {
    id: "fabrication",
    name: "Fabrication",
    slug: "fabrication-rideau-metallique",
    description:
      "Fabrication sur-mesure de rideaux metalliques en acier, aluminium ou inox",
    shortDescription: "Acier, aluminium, inox : fabrication aux dimensions exactes.",
  },
];

export type Zone = {
  name: string;
  slug: string;
  cp: string;
  distance: string;
};

// ANTI-CANNIBALISATION (REGLE 6.8) : paris-5 (ville-principale) EXCLU.
// Uniquement arrondissements voisins + communes peripheriques.
export const zones: Zone[] = [
  { name: "Paris 4e", slug: "paris-4", cp: "75004", distance: "2 km" },
  { name: "Paris 6e", slug: "paris-6", cp: "75006", distance: "2 km" },
  { name: "Paris 13e", slug: "paris-13", cp: "75013", distance: "3 km" },
  { name: "Paris 1er", slug: "paris-1", cp: "75001", distance: "3 km" },
  { name: "Paris 2e", slug: "paris-2", cp: "75002", distance: "3 km" },
  { name: "Paris 3e", slug: "paris-3", cp: "75003", distance: "3 km" },
  { name: "Paris 7e", slug: "paris-7", cp: "75007", distance: "3 km" },
  { name: "Paris 11e", slug: "paris-11", cp: "75011", distance: "4 km" },
  { name: "Paris 12e", slug: "paris-12", cp: "75012", distance: "4 km" },
  { name: "Paris 14e", slug: "paris-14", cp: "75014", distance: "4 km" },
  { name: "Paris 15e", slug: "paris-15", cp: "75015", distance: "5 km" },
  { name: "Paris 10e", slug: "paris-10", cp: "75010", distance: "5 km" },
  { name: "Paris 20e", slug: "paris-20", cp: "75020", distance: "5 km" },
  { name: "Ivry-sur-Seine", slug: "ivry-sur-seine", cp: "94200", distance: "5 km" },
  { name: "Le Kremlin-Bicetre", slug: "le-kremlin-bicetre", cp: "94270", distance: "5 km" },
  { name: "Charenton-le-Pont", slug: "charenton-le-pont", cp: "94220", distance: "5 km" },
  { name: "Gentilly", slug: "gentilly", cp: "94250", distance: "5 km" },
  { name: "Montrouge", slug: "montrouge", cp: "92120", distance: "6 km" },
  { name: "Vincennes", slug: "vincennes", cp: "94300", distance: "6 km" },
  { name: "Saint-Mande", slug: "saint-mande", cp: "94160", distance: "6 km" },
  { name: "Arcueil", slug: "arcueil", cp: "94110", distance: "6 km" },
  { name: "Malakoff", slug: "malakoff", cp: "92240", distance: "7 km" },
];

// Palette UNIQUE Paris 5 — inspiration Quartier Latin / Sorbonne / Pantheon.
// Part de la famille hue du template-1 (teal petrol sombre) + accent bronze academique.
export const colors = {
  primary: "#04323F",       // teal petrol profond (proche du template #033040)
  primaryDark: "#062932",   // plus sombre
  primaryDarker: "#041f26",
  accent: "#C9A24B",        // or bronze academique (Sorbonne) — CTA
  accentLight: "#E0C075",
  accentHover: "#B38C36",
  lightBg: "#F5F3EC",       // ivoire pierre de taille parisienne
  warmBg: "#EFEAE0",
  darkBg: "#062932",
  white: "#FFFFFF",
  textDark: "#102228",
  textMuted: "#4A5A60",
  textLight: "#7C8A90",
  border: "#E2DCD0",
  starColor: "#F59E0B",
};

export const marques = [
  "Somfy",
  "Simu",
  "ACM",
  "Came",
  "Nice",
  "FAAC",
  "BFT",
  "Sommer",
];

// PAS DE TABLEAU TARIFS — on ne publie PAS de page tarifs.
// Les prix sont mentionnes dans le contenu SEO sous la forme "a partir de X euros".
