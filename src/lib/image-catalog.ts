// image-catalog.ts — Classification stricte des visuels DRM (REGLE 6.7.B leson Biarritz).
// 5 pools distincts. Regle d'attribution :
//   - hero / finalCtaBg / preFooterBg / mini-CTA bg -> bgSuitablePool UNIQUEMENT (jamais produit isole)
//   - block "pieces / garanties" -> productImages OK
//   - block "formats" -> productImages OU realisations
//   - block "methode / diagnostic / preparation" -> interventionScenes
// TOUS les noms en LOWERCASE strict (macOS case-insensitive / Linux VPS case-sensitive).
// AUCUN nom contenant une autre ville DRM (beauvais, creil, paris-1, paris-19) — anti-leak REGLE 8.

const BASE = "/images/gallery/";

// 1. BG-SUITABLE : SCENES uniquement (technicien en intervention / devanture / rue / atelier).
// JAMAIS un rendu produit isole (objet sur fond uni/blanc/noir/studio) — curation visuelle 2026-06-18.
// RETIRES car produits isoles : hero-rideau-lame-pleine, hero-rideau-micro-perforee,
//   hero-rideau-polycarbonate, hero-grille-extensible (4 rendus studio sur fond uni).
export const bgSuitablePool: string[] = [
  "hero-bg-technicien-drm.webp",
  "hero-rideau-metallique-industriel.webp",
  "depannage-rideau-metallique-drm-france-rm.webp",
  "depannage-rideau-metallique-drm-reparation.webp",
  "installation-rideau-metallique-drm.webp",
  "entretien-rideau-metallique-drm-france.webp",
  "fabrication-rideau-metallique-entreprise-drm.webp",
  "realisation-rideau-metallique-lame-pleine-commerce.webp",
  "realisation-rideau-metallique-lame-pleine-boulangerie-france.webp",
  "realisation-rideau-metallique-lame-pleine-industriel-france.webp",
  "rideau-metallique-restaurant-grille-extensible.webp",
];

// 2. PRODUITS isoles — INTERDITS en bg, OK pour blocs "pieces / formats".
export const productImages: string[] = [
  "moteur-tubulaire-rideau-metallique-drm.webp",
  "moteur-externe-rideau-metallique-drm.webp",
  "lame-pleine-rideau-metallique.webp",
  "lame-p57-rideau-metallique.webp",
  "lame-finale-p90-rideau-metallique.webp",
  "lame-micro-perforee-rideau-metallique.webp",
  "lame-polycarbonate-rideau-metallique.webp",
  "grille-cobra-rideau-metallique.webp",
  "grille-extensible-rideau-metallique-france.webp",
  "serrure-lame-finale-rideau-metallique.webp",
];

// 3. INTERVENTION terrain — techniciens en action / methode.
export const interventionScenes: string[] = [
  "depannage-rideau-metallique-drm-reparation.webp",
  "depannage-rideau-metallique-drm-france-rm.webp",
  // RETIRE 2026-06-18 : rideau-metallique-bloque-* est un rendu produit isole (rideau ferme
  //   sur fond uni), pas une scene d'intervention. Alimentait le hero/CTA des pages zone.
  "raccordement-rideau-metallique-drm.webp",
  "pose-axe-rideau-metallique-drm.webp",
  "pose-coulisse-tablier-rideau-metallique.webp",
  "raccordement-rideau-metallique-drm.webp",
  "test-rideau-metallique-drm.webp",
  "prise-de-mesure-rideau-metallique-drm.webp",
  "preparation-axe-rideau-metallique-drm.webp",
  "entretien-rideau-metallique-rideau-de-fer.webp",
  "fabrication-axe-rideau-metallique-express.webp",
];

// 4. REALISATIONS — commerces avec rideau fini.
export const realisations: string[] = [
  "realisation-rideau-metallique-lame-pleine-commerce.webp",
  "realisation-rideau-metallique-lame-pleine-boulangerie-france.webp",
  "realisation-rideau-metallique-lame-pleine-industriel-france.webp",
  "realisation-rideau-metallique-garage.webp",
  "rideau-metallique-cobra-realisation-drm.webp",
  "rideau-metallique-polycarbonate-drm-realisation.webp",
  "rideau-metallique-micro-perforee-realisation-france.webp",
  "rideau-metallique-grille-bijoutier-realisation.webp",
  "rideau-metallique-restaurant-grille-extensible.webp",
];

// 5. SECTEURS — types de commerce.
export const secteurs: string[] = [
  "buralistes-bars-tabac-rideau-metallique-drm.webp",
  "centres-commerciaux-rideau-metallique-drm.webp",
  "gares-aeroports-rideau-metallique-drm.webp",
  "parkings-souterrains-rideau-metallique-drm.webp",
  "garage-rideau-metallique-anti-effraction.webp",
];

export type ServiceImageSet = {
  hero: string; // bg-suitable
  preFooterBg: string; // bg-suitable
  intervention: string[];
  product: string[];
  realisation: string[];
};

// MAPPING PAR SERVICE — hero/preFooter = bgSuitable ; product = pieces coherentes.
export const serviceImages: Record<string, ServiceImageSet> = {
  depannage: {
    hero: "depannage-rideau-metallique-drm-france-rm.webp",
    preFooterBg: "realisation-rideau-metallique-lame-pleine-commerce.webp",
    intervention: [
      "depannage-rideau-metallique-drm-reparation.webp",
      "rideau-metallique-bloque-depannage-rideau-metallique.webp",
      "test-rideau-metallique-drm.webp",
    ],
    product: ["moteur-externe-rideau-metallique-drm.webp", "serrure-lame-finale-rideau-metallique.webp"],
    realisation: ["realisation-rideau-metallique-lame-pleine-commerce.webp"],
  },
  installation: {
    hero: "installation-rideau-metallique-drm.webp",
    preFooterBg: "realisation-rideau-metallique-lame-pleine-industriel-france.webp",
    intervention: [
      "pose-axe-rideau-metallique-drm.webp",
      "pose-coulisse-tablier-rideau-metallique.webp",
      "prise-de-mesure-rideau-metallique-drm.webp",
    ],
    product: ["lame-pleine-rideau-metallique.webp", "lame-p57-rideau-metallique.webp"],
    realisation: ["realisation-rideau-metallique-lame-pleine-boulangerie-france.webp"],
  },
  reparation: {
    // hero swap 2026-06-18 : distinct du nouveau hero deblocage (reparation a recupere
    //   depannage-*-reparation). Scene diagnostic/reglage sur devanture.
    hero: "test-rideau-metallique-drm.webp",
    preFooterBg: "realisation-rideau-metallique-lame-pleine-commerce.webp",
    intervention: [
      "depannage-rideau-metallique-drm-reparation.webp",
      "depannage-rideau-metallique-drm-france-rm.webp",
      "raccordement-rideau-metallique-drm.webp",
    ],
    product: ["lame-finale-p90-rideau-metallique.webp", "serrure-lame-finale-rideau-metallique.webp"],
    realisation: ["rideau-metallique-cobra-realisation-drm.webp"],
  },
  motorisation: {
    hero: "raccordement-rideau-metallique-drm.webp",
    preFooterBg: "installation-rideau-metallique-drm.webp",
    intervention: [
      "raccordement-rideau-metallique-drm.webp",
      "test-rideau-metallique-drm.webp",
      "pose-axe-rideau-metallique-drm.webp",
    ],
    product: ["moteur-tubulaire-rideau-metallique-drm.webp", "moteur-externe-rideau-metallique-drm.webp"],
    realisation: ["realisation-rideau-metallique-lame-pleine-industriel-france.webp"],
  },
  deblocage: {
    // hero swap 2026-06-18 : ex rideau-metallique-bloque-* (rendu produit isole) ->
    //   scene technicien forcant/depannant un rideau a 2 sur echelle.
    hero: "depannage-rideau-metallique-drm-reparation.webp",
    preFooterBg: "depannage-rideau-metallique-drm-france-rm.webp",
    intervention: [
      "depannage-rideau-metallique-drm-france-rm.webp",
      "test-rideau-metallique-drm.webp",
      "raccordement-rideau-metallique-drm.webp",
    ],
    product: ["serrure-lame-finale-rideau-metallique.webp"],
    realisation: ["realisation-rideau-metallique-lame-pleine-commerce.webp"],
  },
  entretien: {
    hero: "entretien-rideau-metallique-drm-france.webp",
    preFooterBg: "realisation-rideau-metallique-lame-pleine-boulangerie-france.webp",
    intervention: [
      "entretien-rideau-metallique-rideau-de-fer.webp",
      "test-rideau-metallique-drm.webp",
      "raccordement-rideau-metallique-drm.webp",
    ],
    product: ["lame-finale-p90-rideau-metallique.webp"],
    realisation: ["realisation-rideau-metallique-lame-pleine-commerce.webp"],
  },
  fabrication: {
    // hero swap 2026-06-18 : ex fabrication-*-entreprise-drm (gros plan axe/tambour, produit
    //   dominant) -> scene environnementale batiment industriel + rideau + camion (impactante,
    //   distincte des heros installation/motorisation, semantique fabrication/industriel).
    hero: "hero-rideau-metallique-industriel.webp",
    preFooterBg: "realisation-rideau-metallique-lame-pleine-industriel-france.webp",
    intervention: [
      "fabrication-axe-rideau-metallique-express.webp",
      "preparation-axe-rideau-metallique-drm.webp",
      "prise-de-mesure-rideau-metallique-drm.webp",
    ],
    product: ["lame-pleine-rideau-metallique.webp", "lame-polycarbonate-rideau-metallique.webp"],
    realisation: ["realisation-rideau-metallique-lame-pleine-industriel-france.webp"],
  },
};

// Hash deterministe (djb2) sur (serviceId + zoneSlug) pour seed la rotation.
function seedFrom(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  if (arr.length === 0) return arr[0];
  return arr[(seed + offset) % arr.length];
}

// Retourne 6 visuels SEMANTIQUEMENT corrects et uniques par page (service, zone).
export function pickServiceZoneImages(serviceId: string, zoneSlug: string) {
  const set = serviceImages[serviceId] || serviceImages.depannage;
  const seed = seedFrom(serviceId + "-" + zoneSlug);
  const interv = set.intervention.length ? set.intervention : interventionScenes;
  const prod = set.product.length ? set.product : productImages;
  const real = set.realisation.length ? set.realisation : realisations;
  return {
    hero: BASE + set.hero, // bg-suitable
    block1: BASE + pick(interv, seed, 0), // methode -> intervention
    block2: BASE + pick(prod, seed, 1), // pieces -> produit
    block3: BASE + (prod.length > 1 ? pick(prod, seed, 2) : pick(real, seed, 0)), // formats
    block4: BASE + pick(interv, seed, 1), // preparation -> intervention
    finalCtaBg: BASE + pick(real, seed, 1), // bg-suitable
    preFooterBg: BASE + set.preFooterBg,
    extras: real.map((r) => BASE + r),
  };
}

export function withBase(file: string): string {
  return BASE + file;
}
