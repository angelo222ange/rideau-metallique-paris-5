// zone-content.ts — Moteur de contenu des PAGES ZONE dediees (Phase 3).
// Une page zone = un hub LOCAL multi-services pour /rideau-metallique-{zone}/.
// Distinct des pages service x zone ([service_zone], Phase 2) : ici on couvre TOUS
// les services dans UNE zone, avec un contenu hyper-local ecrit/tisse par zone.
//
// ANTI-DUPLICATE (REGLE 6.5 / 41 / 42) :
//   - rotation 6 angles SEO + 3 profils (urbain/residentiel/mixte) par INDICE de zone
//     (formule phase-3-zones.md : intro i%3, seo1 i%6, seo2 (i+3)%6, faq (i+1)%6,
//      why (i+2)%3) -> aucune paire de zones n'a la meme combinaison de banks.
//   - injection DENSE des proper-nouns reels de la zone (toutes rues/landmarks/
//     quartiers/commerces/transport) -> masse de tokens haute-IDF propre a chaque page.
//   - banks PROPRES a la page zone (verbatim distinct des banks service x zone) pour
//     ne pas collisionner avec les 154 pages [service_zone].
//   - 0 mention d'autre ville DRM / autre niche (REGLE 8 anti-leak).

import { getZoneLocal, ZoneLocal } from "@/lib/zone-local-data";
import { siteConfig, services, zones, Zone } from "@/config/site";

// ----------------------------------------------------------------------------
// Coordonnees reelles (centroides) par zone -> carte OSM ciblee sur la zone.
// Verifiables sur une carte. Aucune inventee de toutes pieces.
// ----------------------------------------------------------------------------
export const zoneGeo: Record<string, { lat: number; lng: number }> = {
  "paris-4": { lat: 48.8546, lng: 2.3577 },
  "paris-6": { lat: 48.8496, lng: 2.3324 },
  "paris-13": { lat: 48.8322, lng: 2.3561 },
  "paris-1": { lat: 48.8625, lng: 2.3360 },
  "paris-2": { lat: 48.8679, lng: 2.3417 },
  "paris-3": { lat: 48.8637, lng: 2.3615 },
  "paris-7": { lat: 48.8566, lng: 2.3127 },
  "paris-11": { lat: 48.8594, lng: 2.3765 },
  "paris-12": { lat: 48.8351, lng: 2.4197 },
  "paris-14": { lat: 48.8331, lng: 2.3264 },
  "paris-15": { lat: 48.8412, lng: 2.3000 },
  "paris-10": { lat: 48.8760, lng: 2.3596 },
  "paris-20": { lat: 48.8634, lng: 2.3984 },
  "ivry-sur-seine": { lat: 48.8136, lng: 2.3884 },
  "le-kremlin-bicetre": { lat: 48.8106, lng: 2.3590 },
  "charenton-le-pont": { lat: 48.8221, lng: 2.4126 },
  "gentilly": { lat: 48.8133, lng: 2.3424 },
  "montrouge": { lat: 48.8186, lng: 2.3197 },
  "vincennes": { lat: 48.8479, lng: 2.4370 },
  "saint-mande": { lat: 48.8419, lng: 2.4189 },
  "arcueil": { lat: 48.8060, lng: 2.3360 },
  "malakoff": { lat: 48.8189, lng: 2.2990 },
};

export function zoneIndex(slug: string): number {
  const i = zones.findIndex((z) => z.slug === slug);
  return i < 0 ? 0 : i;
}

// PRNG deterministe seede par un entier (mulberry32) — copie locale.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashZone(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h + slug.charCodeAt(i)) >>> 0;
  return h;
}

// Selection seedee de `count` elements DISTINCTS (Fisher-Yates seede).
function seededPick<T>(pool: T[], count: number, seed: number): T[] {
  const idx = pool.map((_, i) => i);
  const rng = mulberry32(seed);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(count, pool.length)).map((i) => pool[i]);
}

// ----------------------------------------------------------------------------
// 3 PROFILS structurels (REGLE 41) — chaque profil a un angle editorial distinct.
//   urbain      : commerces denses, flux, securite, fermetures tardives
//   residentiel : proximite, commerces de quartier, discretion, entretien
//   mixte       : melange activite/habitation, varietes de devantures
// Le profil retenu = (zoneIndex + 2) % 3 (formule "why" du phase-3-zones), CROISE
// avec le profile reel de la zone (zoneLocalData.profile) pour rester coherent.
// ----------------------------------------------------------------------------
type Profil = "urbain" | "residentiel" | "mixte";

function profilFor(slug: string, i: number): Profil {
  const real = (getZoneLocal(slug)?.profile || "").toLowerCase();
  if (real.includes("touristique") || real.includes("affaires")) return "urbain";
  if (real.includes("chic") || real.includes("populaire")) return "residentiel";
  // fallback deterministe sur l'indice de zone
  return (["urbain", "residentiel", "mixte"] as Profil[])[(i + 2) % 3];
}

// ----------------------------------------------------------------------------
// BANKS — 6 angles SEO (intro / seo1 / seo2 / seo3 / seo4) declines par profil.
// Tokens : {zone} {st1..6} {lm1..7} {qt1..4} {cm1..5} {tr1..3} {phone} {cityShort}
// ----------------------------------------------------------------------------

// 6 INTROS (angle editorial different) — i%3 du profil pioche une sous-famille.
const introBank: Record<Profil, string[]> = {
  urbain: [
    "A {zone}, les commerces se succedent sans relache de {st1} a {st2}, et chaque rideau metallique baisse protege un chiffre d'affaires reel. Du secteur de {lm1} aux abords de {lm2}, nos techniciens depannent, installent et entretiennent les fermetures metalliques 24h/24, parce qu'une devanture ouverte la nuit est une devanture exposee.",
    "Le quartier {qt1}, dense et passant, aligne {cm1} et {cm2} dont les rideaux metalliques ferment tard. A {zone}, pres de {lm1} et le long de {st1}, nous intervenons en urgence comme sur rendez-vous pour que jamais une fermeture bloquee ne laisse votre local sans protection.",
    "Entre {st3} et {lm3}, le flux permanent de {zone} use les fermetures metalliques plus vite qu'ailleurs. Nos equipes connaissent les acces et le stationnement du secteur, autour de {tr1}, et assurent depannage, reparation et motorisation de votre rideau metallique a toute heure.",
  ],
  residentiel: [
    "A {zone}, les {cm1} de proximite et les boutiques du quartier {qt1} comptent sur un rideau metallique fiable pour fermer chaque soir en confiance. De {st1} aux abords de {lm1}, nos techniciens assurent depannage, entretien et installation de fermetures metalliques discretes et robustes, 24h/24.",
    "Loin de l'agitation des grands axes, {zone} vit au rythme de ses commerces de quartier, de {st2} a {lm2}. Une fermeture metallique qui grince ou se bloque y est vite remarquee : nous intervenons rapidement pres de {lm1} et de {qt2} pour remettre votre rideau en marche.",
    "Les rues calmes de {zone}, autour de {qt1} et de {lm3}, abritent des {cm2} attaches a la securite de leur devanture. Nos equipes posent, reparent et motorisent les rideaux metalliques du secteur de {st1}, avec le soin qu'un quartier residentiel attend d'un artisan de proximite.",
  ],
  mixte: [
    "A {zone}, l'activite se partage entre commerces, ateliers et habitations, de {st1} jusqu'a {lm1}. Cette diversite impose des fermetures metalliques de toutes tailles : nos techniciens depannent et installent aussi bien la devanture d'un commerce du quartier {qt1} que le rideau d'un local d'activite pres de {lm2}.",
    "Entre les {cm1} de {st2} et les ateliers des abords de {lm2}, {zone} melange les usages et les formats de rideaux metalliques. Nos equipes maitrisent chaque configuration et interviennent 24h/24 pour le depannage, la reparation et la motorisation de votre fermeture.",
    "Le secteur de {zone}, traverse par {tr1} et borde par {st3}, brasse commerces de rue et locaux professionnels. Du quartier {qt1} aux environs de {lm3}, nous assurons l'ensemble des prestations rideau metallique, du deblocage d'urgence a la fabrication sur-mesure.",
  ],
};

// 6 SEO1 (methode / reactivite locale).
const seo1Bank: string[] = [
  "Quand un rideau metallique se bloque a {zone}, chaque minute d'arret coute. Nos camions sillonnent le secteur de {st1} a {st2} avec les pieces d'usure courantes a bord. Pres de {lm1}, nous diagnostiquons la panne sur place, moteur, axe, lame ou serrure, et relancons votre fermeture sans rendez-vous a rallonge.",
  "Notre force a {zone}, c'est la proximite : une equipe mobilisable vite, qui connait les contraintes d'acces et de stationnement de {qt1} et de {st3}. Du depannage d'urgence pres de {lm2} a l'installation programmee, nous adaptons chaque intervention a la realite du terrain.",
  "Un rideau metallique qui cale a mi-course ou refuse de remonter immobilise tout votre commerce a {zone}. Aux abords de {lm1} et le long de {st1}, nos techniciens testent l'electronique, l'axe et les coulisses, puis reparent dans la foulee pour que votre devanture redevienne operationnelle.",
  "A {zone}, nous traitons toutes les marques de moteurs et de fermetures, des grilles cobra aux lames pleines. Pres de {qt2} comme autour de {lm3}, nos artisans interviennent avec un outillage complet et des pieces de marque, gage d'une reparation durable et garantie.",
  "De {st2} au quartier {qt1}, desservi par {tr1}, notre maillage de {zone} garantit une arrivee rapide sur site. Diagnostic honnete, devis clair avant intervention et fermeture remise en etat dans les regles : voila ce que les commercants du secteur attendent et trouvent chez nous.",
  "Une effraction, un choc ou une coupure peut bloquer votre rideau metallique a tout moment a {zone}. Nous nous deplacons en urgence vers {lm2} et {st1}, securisons immediatement votre devanture, puis reparons durablement la fermeture metallique endommagee.",
];

// 6 SEO2 (gamme de services / pieces / garanties).
const seo2Bank: string[] = [
  "A {zone}, nous couvrons l'ensemble du cycle de vie de votre rideau metallique : depannage d'urgence, reparation de lames et de moteur, motorisation d'un tablier manuel, deblocage, entretien preventif et fabrication sur-mesure. Une seule equipe, du secteur de {st1} aux abords de {lm1}, pour tout votre parc de fermetures.",
  "Moteur Somfy, Simu ou ACM, serrure a barillet, ressorts de compensation, lame d'arret renforcee : nous posons des pieces de marque sur chaque fermeture de {zone}. Pres de {lm2} et dans le quartier {qt1}, chaque intervention est garantie pieces et main d'oeuvre pour une tranquillite durable.",
  "Plutot que de tout remplacer, nous privilegions la reparation durable des rideaux metalliques de {zone}. Lames voilees, axe grippe, coulisses faussees, condensateur use : nos techniciens corrigent l'usure une a une, du cote de {st2} comme aux environs de {lm3}, sans frais inutiles.",
  "Du commerce de {cm1} au local d'activite, chaque devanture de {zone} a ses contraintes. Nous dimensionnons l'axe, choisissons le type de lame et integrons les securites adaptees, le long de {st3} comme pres de {qt2}, pour une fermeture metallique a la mesure de votre activite.",
  "Nos prestations a {zone} s'accompagnent toujours d'un devis gratuit et de tarifs annonces a l'avance. Que vous soyez un {cm2} du quartier {qt1} ou une enseigne proche de {lm1}, vous validez chaque ligne avant intervention, sans surprise sur le prix ni sur le delai.",
  "Une fermeture metallique entretenue tombe rarement en panne. A {zone}, nos contrats d'entretien planifient les visites preventives, du graissage des coulisses au controle du moteur, pour les commerces de {st1} et les locaux des abords de {lm2}, avant qu'une panne n'interrompe votre activite.",
];

// 6 SEO3 (savoir-faire local / connaissance du terrain).
const seo3Bank: string[] = [
  "Implantes au coeur de {cityShort}, nos techniciens connaissent {zone} rue par rue. De {st1} a {st4}, du quartier {qt1} aux abords de {lm1}, nous savons ou se garer, comment acceder a une devanture exigue et quelles fermetures equipent les commerces du secteur.",
  "A {zone}, la confiance se construit sur la duree : diagnostic transparent, chiffrage clair et travail garanti. Les {cm1} de {st2} et les enseignes proches de {lm2} nous confient leur rideau metallique parce que nous traitons chaque fermeture comme la notre.",
  "Notre connaissance du terrain a {zone} fait gagner un temps precieux a chaque deplacement. Pres de {tr1}, dans les rues animees de {st3} et {st1}, nos vehicules arrivent vite et nos techniciens identifient la panne du premier coup d'oeil sur les fermetures du secteur.",
  "Habitues aux devantures de {zone}, du commerce d'angle de {qt2} au local en retrait de {st4}, nous adaptons chaque intervention a la configuration reelle. Cette experience locale evite les mauvaises surprises et garantit une fermeture metallique qui glisse sans accroc.",
  "Les commercants de {zone} cherchent un artisan present, joignable et fiable. Aux abords de {lm3} comme dans le quartier {qt1}, nous repondons present de jour comme de nuit, et privilegions toujours la solution durable plutot que le remplacement systematique.",
  "De {lm1} a {lm4}, en longeant {st2} et {st3}, notre secteur d'intervention a {zone} ne nous reserve aucune surprise. Outillage complet, pieces d'origine et engagement de delai : nos chantiers sont controles avant restitution, securites et fins de course comprises.",
];

// 6 SEO4 (deroulement / engagement).
const seo4Bank: string[] = [
  "Des votre appel, nous localisons votre commerce a {zone} et envoyons l'equipe la plus proche. Diagnostic sur place pres de {lm1}, devis immediat, puis intervention : votre rideau metallique repart en general le jour meme, sans immobilisation prolongee de votre activite.",
  "Une intervention a {zone} commence par l'identification precise du besoin, depannage, reparation, motorisation ou entretien. Du secteur de {st1} au quartier {qt1}, nous reparons sur place quand c'est possible et securisons toujours votre devanture avant de partir.",
  "Nous travaillons proprement et laissons le poste de travail net a {zone}, pres de {lm2} comme aux abords de {st2}. Un compte rendu ecrit vous est remis a chaque intervention, gage de transparence sur la nature exacte du travail realise sur votre fermeture metallique.",
  "Chaque chantier a {zone} se conclut par un essai complet devant vous : montee, descente, arret bas et securites. Que vous soyez rue {st3} ou pres de {lm3}, vous repartez avec une fermeture relancee et l'origine de la panne clairement expliquee.",
  "Notre engagement a {zone} : un tarif annonce avant toute intervention, des pieces de marque et une garantie ecrite. Pour les {cm1} du quartier {qt2} et les enseignes de {st1}, pas de frais caches ni de surprise sur la facture finale.",
  "A {zone}, nous planifions les installations et entretiens en dehors de vos heures d'affluence quand c'est possible. La depose de l'ancien dispositif et la pose du neuf s'enchainent vite, du cote de {st4} comme pres de {lm1}, pour reduire au minimum la fermeture de votre commerce.",
];

// 8 FAQ — la Q0 ("Qui appeler") est TOUJOURS premiere (REGLE 6.7.H). 7 autres rotees.
const faqZoneBank: { q: string; a: string }[] = [
  {
    q: "Qui appeler pour un rideau metallique a {zone} ?",
    a: "Pour toute intervention sur rideau metallique a {zone}, appelez DRM Paris 5 au {phone}. Nos techniciens interviennent 24h/24 et 7j/7, du secteur de {st1} aux abords de {lm1}, pour le depannage, la reparation, l'installation, la motorisation, le deblocage, l'entretien et la fabrication.",
  },
  {
    q: "Quel est le delai d'intervention a {zone} ?",
    a: "Nos equipes se deplacent en moins de 30 minutes a {zone} et dans les quartiers voisins, y compris autour de {st2} et de {lm2}. En cas d'urgence (rideau bloque, effraction), votre intervention est priorisee.",
  },
  {
    q: "Intervenez-vous la nuit et le week-end a {zone} ?",
    a: "Oui, nous intervenons a {zone} 24h/24 et 7j/7, week-ends et jours feries compris. Une equipe d'astreinte couvre le secteur de {qt1} et de {lm3} pour les depannages urgents de fermeture metallique.",
  },
  {
    q: "Quels services de rideau metallique proposez-vous a {zone} ?",
    a: "A {zone}, nous assurons sept prestations : depannage, reparation, installation, motorisation, deblocage, entretien et fabrication sur-mesure de rideaux metalliques, pour les commerces et locaux du quartier {qt1} comme des abords de {st3}.",
  },
  {
    q: "Combien coute une intervention a {zone} ?",
    a: "Le tarif depend de la prestation. Toute intervention a {zone} demarre a partir d'un prix raisonnable, communique apres un devis gratuit et sans engagement. Nous evaluons votre besoin sur place, pres de {lm2}, avant d'annoncer un montant clair.",
  },
  {
    q: "Quelles marques de rideaux metalliques traitez-vous a {zone} ?",
    a: "Nous intervenons sur toutes les marques (Somfy, Simu, ACM, Came, Nice, FAAC, BFT, Sommer) pour les fermetures de {zone}, du quartier {qt2} aux environs de {lm1}. Pieces de marque et garantie sur chaque intervention.",
  },
  {
    q: "Intervenez-vous sur les commerces et locaux professionnels a {zone} ?",
    a: "Oui. Nous equipons et depannons les commerces, bureaux, garages et entrepots de {zone}, notamment les {cm1} de {st2} et les locaux d'activite du secteur de {lm3}. Chaque devanture recoit une solution adaptee a son usage.",
  },
  {
    q: "Proposez-vous une garantie a {zone} ?",
    a: "Oui, chaque intervention sur rideau metallique a {zone} est garantie pieces et main d'oeuvre. Du depannage rue {st1} a la fabrication sur-mesure, nous engageons notre responsabilite sur la qualite et la durabilite du travail realise.",
  },
];

// ----------------------------------------------------------------------------
// Remplissage des tokens hyper-locaux a partir de la zoneLocalData reelle.
// ----------------------------------------------------------------------------
function fill(text: string, zoneName: string, zl: ZoneLocal | undefined, seed: number): string {
  const city = siteConfig.cityShort;
  const st = zl ? seededPick(zl.streets, zl.streets.length, seed + 1) : [];
  const lm = zl ? seededPick(zl.landmarks, zl.landmarks.length, seed + 2) : [];
  const qt = zl ? seededPick(zl.quartiers, zl.quartiers.length, seed + 3) : [];
  const cm = zl ? seededPick(zl.commerces, zl.commerces.length, seed + 4) : [];
  const tr = zl ? seededPick(zl.transport, zl.transport.length, seed + 5) : [];
  const g = (a: string[], i: number, fb: string) => (a.length ? a[i % a.length] : fb);
  return text
    .split("{zone}").join(zoneName)
    .split("{cityShort}").join(city)
    .split("{phone}").join(siteConfig.phone)
    .split("{st1}").join(g(st, 0, "votre rue"))
    .split("{st2}").join(g(st, 1, "votre rue"))
    .split("{st3}").join(g(st, 2, "votre rue"))
    .split("{st4}").join(g(st, 3, "votre rue"))
    .split("{st5}").join(g(st, 4, "votre rue"))
    .split("{st6}").join(g(st, 5, "votre rue"))
    .split("{lm1}").join(g(lm, 0, city))
    .split("{lm2}").join(g(lm, 1, city))
    .split("{lm3}").join(g(lm, 2, city))
    .split("{lm4}").join(g(lm, 3, city))
    .split("{qt1}").join(g(qt, 0, "votre quartier"))
    .split("{qt2}").join(g(qt, 1, "votre quartier"))
    .split("{cm1}").join(g(cm, 0, "commerces"))
    .split("{cm2}").join(g(cm, 1, "commerces"))
    .split("{tr1}").join(g(tr, 0, city));
}

// Primer hyper-local DENSE : enonce TOUS les reperes de la zone -> masse maximale de
// tokens haute-IDF uniques par page (le signal qui distingue 2 arrondissements voisins).
function densePrimer(zoneName: string, zl: ZoneLocal | undefined, seed: number): string {
  if (!zl) return "";
  const st = seededPick(zl.streets, zl.streets.length, seed + 11);
  const lm = seededPick(zl.landmarks, zl.landmarks.length, seed + 12);
  const qt = seededPick(zl.quartiers, zl.quartiers.length, seed + 13);
  const cm = seededPick(zl.commerces, zl.commerces.length, seed + 14);
  const tr = seededPick(zl.transport, zl.transport.length, seed + 15);
  const g = (a: string[], i: number) => a[i % a.length];
  const sentences = [
    `A ${zoneName}, notre couverture s'etend du secteur de ${g(st, 0)} jusqu'aux abords de ${g(lm, 0)}, en passant par le quartier ${g(qt, 0)}.`,
    `De ${g(st, 1)} a ${g(st, 2)}, pres de ${g(lm, 1)} et de ${g(lm, 2)}, nous desservons les ${g(cm, 0)} et les ${g(cm, 1)} du secteur sans perdre de temps.`,
    `Les stations ${tr.join(" et ")} placent ${g(qt, 1)} a quelques minutes de nos vehicules d'intervention.`,
    `Autour de ${g(lm, 3)} et le long de ${g(st, 3)}, les ${g(cm, 2)} de ${zoneName} comptent sur notre reactivite pour leur fermeture metallique.`,
    `Notre maillage de ${zoneName} englobe ${g(st, 4)}, ${g(st, 5)} et les ${g(cm, 3)} proches de ${g(lm, 4)}.`,
    `Du quartier ${g(qt, 3 % zl.quartiers.length)} aux abords de ${g(lm, 5)}, aucun recoin de ${zoneName} ne nous est etranger.`,
  ];
  return seededPick(sentences, sentences.length, seed + 16).join(" ");
}

// Phrase 100% data-locale (quartiers + commerces + transport reels), pour seo2.
function zoneFacts(zoneName: string, zl: ZoneLocal | undefined, seed: number): string {
  if (!zl) return "";
  return (
    `A ${zoneName}, nous couvrons notamment ${seededPick(zl.quartiers, Math.min(3, zl.quartiers.length), seed).join(", ")}, ` +
    `aupres des ${seededPick(zl.commerces, Math.min(3, zl.commerces.length), seed + 1).join(", des ")}. ` +
    `Le metro ${seededPick(zl.transport, Math.min(2, zl.transport.length), seed + 3).join(" et ")} et les rues ${seededPick(zl.streets, Math.min(3, zl.streets.length), seed + 2).join(", ")} ` +
    `font partie de notre secteur d'intervention quotidien, tout comme les abords de ${seededPick(zl.landmarks, Math.min(2, zl.landmarks.length), seed + 4).join(" et de ")}.`
  );
}

// ----------------------------------------------------------------------------
// Cards "Pourquoi nous" — pool propre a la page zone (8), selection seedee de 4.
// ----------------------------------------------------------------------------
const whyZoneBank: { title: string; text: string }[] = [
  { title: "Une equipe locale a {zone}", text: "Des techniciens qui connaissent {st1}, {st2} et le quartier {qt1} rue par rue, pour arriver vite et se garer sans perdre de temps pres de {lm1}." },
  { title: "Intervention en moins de 30 minutes", text: "Une equipe mobile prete a partir 24h/24 vers {lm1} et {lm2} pour remettre en marche le rideau metallique d'un commerce de {st3}." },
  { title: "Tous les services au meme endroit", text: "Depannage, reparation, installation, motorisation, deblocage, entretien et fabrication : un seul interlocuteur pour les fermetures de {qt1} et de {qt2}." },
  { title: "Pieces de marque garanties", text: "Moteurs Somfy, Simu, ACM et serrures d'origine, poses avec garantie pieces et main d'oeuvre sur les devantures de {st1}." },
  { title: "Devis gratuit et tarif clair", text: "Un prix annonce avant l'intervention, sans frais caches, pour les {cm1} du secteur de {st2} et les enseignes proches de {lm2}." },
  { title: "Disponible nuit et jours feries", text: "Week-ends et jours feries compris, nous repondons quand un commerce du quartier {qt1}, pres de {lm3}, en a besoin." },
  { title: "Reparation durable privilegiee", text: "Nous reparons plutot que de remplacer systematiquement, pour preserver le budget des {cm2} aux abords de {lm2} et de {st4}." },
  { title: "Devanture securisee avant depart", text: "Chaque intervention dans le secteur de {st3} se termine par un essai complet et une fermeture metallique remise en securite." },
  { title: "Connaissance des acces de {zone}", text: "Du stationnement de {st1} aux contraintes de circulation pres de {lm1}, nous anticipons chaque deplacement vers {qt1}." },
  { title: "Habitues aux commerces de {zone}", text: "Des {cm1} de {st2} aux locaux d'activite des abords de {lm3}, nous adaptons la fermeture a chaque type de devanture." },
  { title: "Vehicules equipes pour {zone}", text: "Nos camions embarquent les pieces courantes pour reparer des le premier passage rue {st4}, sans nouveau rendez-vous." },
  { title: "Astreinte d'urgence sur {qt1}", text: "Rideau bloque, effraction ou panne moteur : une astreinte couvre {qt1} et {qt2} de jour comme de nuit, jusqu'aux abords de {lm2}." },
];

// ----------------------------------------------------------------------------
// Type de sortie.
// ----------------------------------------------------------------------------
export type ZonePageContent = {
  zone: Zone;
  zoneName: string;
  zoneSlug: string;
  profil: Profil;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  primer: string;
  seo1: { title: string; text: string };
  seo2: { title: string; text: string };
  seo3: { title: string; text: string };
  seo4: { title: string; text: string };
  faq: { q: string; a: string }[];
  whyCards: { title: string; text: string }[];
  lat: number;
  lng: number;
  wordCountHint: number;
};

// ----------------------------------------------------------------------------
// Assemblage — rotation 6 angles x 3 profils par INDICE de zone (formule phase-3).
// ----------------------------------------------------------------------------
export function buildZoneContent(zoneSlug: string): ZonePageContent | null {
  const zone = zones.find((z) => z.slug === zoneSlug);
  if (!zone) return null;
  const zl = getZoneLocal(zoneSlug);
  const i = zoneIndex(zoneSlug);
  const profil = profilFor(zoneSlug, i);
  const zoneName = zone.name;

  // Seeds DECORRELES par bloc (hash distinct par bank) -> selecteurs independants.
  const sFill = hashZone(zoneSlug + ":fill");
  const sIntro = hashZone(zoneSlug + ":intro");
  const sPrim = hashZone(zoneSlug + ":primer");
  const sFacts = hashZone(zoneSlug + ":facts");
  const sWhy = hashZone(zoneSlug + ":why");
  const sFaq = hashZone(zoneSlug + ":faq");

  const f = (t: string) => fill(t, zoneName, zl, sFill);

  // Selection des angles : on combine la formule d'INDICE (phase-3-zones.md : intro i%3,
  // seo1 i%6, seo2 (i+3)%6, why (i+2)%3) AVEC un decalage seede par HASH de zone, decorrele
  // par bloc. Deux zones du meme profil (ex. plusieurs arrondissements "urbain") ne tirent
  // ainsi PAS le meme paragraphe -> casse la similarite TF-IDF cross-zone residuelle.
  const aIntro = (i + (hashZone(zoneSlug + ":aIntro") % 3)) % 3;
  const aSeo1 = (i + (hashZone(zoneSlug + ":aSeo1") % 6)) % 6;
  const aSeo2 = (i + 3 + (hashZone(zoneSlug + ":aSeo2") % 6)) % 6;
  const aSeo3 = (i + 2 + (hashZone(zoneSlug + ":aSeo3") % 6)) % 6;
  const aSeo4 = (i + 4 + (hashZone(zoneSlug + ":aSeo4") % 6)) % 6;

  // Chaque bloc SEO est ANCRE par un primer dense de proper-nouns (seed DECORRELE par bloc)
  // -> masse de tokens haute-IDF maximale et REPARTIE sur toute la page, ce qui fait chuter la
  // similarite cosine entre deux arrondissements voisins (le scaffolding partage pese alors peu).
  const intro = f(introBank[profil][aIntro]);
  const seo1Text = f(seo1Bank[aSeo1]) + " " + densePrimer(zoneName, zl, sPrim);
  const seo2Text = f(seo2Bank[aSeo2]) + " " + zoneFacts(zoneName, zl, sFacts);
  const seo3Text = f(seo3Bank[aSeo3]) + " " + densePrimer(zoneName, zl, sPrim + 30);
  const seo4Text = f(seo4Bank[aSeo4]) + " " + zoneFacts(zoneName, zl, sFacts + 50);
  const primer = densePrimer(zoneName, zl, sPrim + 100);

  // FAQ : Q0 forcee, 5 autres en selection seedee sur indices 1..7.
  const faq: { q: string; a: string }[] = [{ q: f(faqZoneBank[0].q), a: f(faqZoneBank[0].a) }];
  const order = Array.from({ length: faqZoneBank.length - 1 }, (_, k) => k + 1);
  for (const idx of seededPick(order, 5, sFaq)) faq.push({ q: f(faqZoneBank[idx].q), a: f(faqZoneBank[idx].a) });

  const whyCards = seededPick(whyZoneBank, 4, sWhy).map((w) => ({ title: f(w.title), text: f(w.text) }));

  const geo = zoneGeo[zoneSlug] || { lat: siteConfig.geo.latitude, lng: siteConfig.geo.longitude };

  // Titres SEO varies par profil + indice (keyword complet + zone — REGLE 12).
  const seo1Titles = [
    "Depannage de rideau metallique a {zone}",
    "Intervention rapide sur rideau metallique a {zone}",
    "Rideau metallique bloque a {zone} : que faire",
  ];
  const seo2Titles = [
    "Tous nos services de rideau metallique a {zone}",
    "Reparation et entretien de rideau metallique a {zone}",
    "Installation et motorisation de rideau metallique a {zone}",
  ];
  const seo3Titles = [
    "Un specialiste du rideau metallique de proximite a {zone}",
    "Pourquoi choisir DRM Paris pour votre rideau metallique a {zone}",
    "Notre savoir-faire rideau metallique a {zone}",
  ];
  const seo4Titles = [
    "Comment se deroule une intervention a {zone}",
    "Notre methode pour votre rideau metallique a {zone}",
    "Le rideau metallique a {zone} en pratique",
  ];

  return {
    zone,
    zoneName,
    zoneSlug,
    profil,
    h1: `Rideau metallique a ${zoneName}`,
    metaTitle: `Rideau metallique ${zoneName} — Depannage 24h/24`,
    metaDescription: f(
      "Depannage et reparation de rideau metallique a {zone} : intervention 24h/24, installation et motorisation, devis gratuit. Appelez le {phone}."
    ),
    intro,
    primer,
    seo1: { title: f(seo1Titles[i % 3]), text: seo1Text },
    seo2: { title: f(seo2Titles[(i + 1) % 3]), text: seo2Text },
    seo3: { title: f(seo3Titles[(i + 2) % 3]), text: seo3Text },
    seo4: { title: f(seo4Titles[i % 3]), text: seo4Text },
    faq,
    whyCards,
    lat: geo.lat,
    lng: geo.lng,
    wordCountHint: 0,
  };
}

// Blurb localise par service pour les cards de la page zone (evite le {shortDescription}
// identique cross-zone). Chaque service tisse 1-2 reperes reels DIFFERENTS de la zone.
const serviceBlurbBank: Record<string, string[]> = {
  depannage: [
    "Rideau bloque a mi-course ou moteur en panne pres de {lm1} : intervention d'urgence 24h/24.",
    "Panne soudaine sur une devanture de {st1} ? Diagnostic et reparation sur place, jour et nuit.",
  ],
  installation: [
    "Pose de fermetures sur-mesure pour les commerces de {st1} et les locaux des abords de {lm1}.",
    "Devanture neuve dans le quartier {qt1} : prise de mesures, fabrication et pose aux normes.",
  ],
  reparation: [
    "Lames voilees, axe grippe ou serrure forcee : remise en etat des rideaux de {st1}.",
    "Reparation durable plutot que remplacement, pour les {cm1} du secteur de {lm1}.",
  ],
  motorisation: [
    "Passage du manuel a l'electrique pres de {lm1} : moteurs Somfy, Simu et ACM.",
    "Automatisation et telecommande pour les enseignes du quartier {qt1}.",
  ],
  deblocage: [
    "Tablier coince ou lame sortie du rail rue {st1} : liberation sans abimer la devanture.",
    "Deblocage d'urgence d'un rideau coince pres de {lm1}, a la main ou au moteur.",
  ],
  entretien: [
    "Contrat d'entretien preventif pour les commerces de {st1} et des abords de {lm1}.",
    "Graissage, controle moteur et reglages reguliers dans le quartier {qt1}.",
  ],
  fabrication: [
    "Rideaux acier, alu ou inox fabriques sur-mesure pour les devantures de {st1}.",
    "Conception d'une fermeture unique pour un local atypique pres de {lm1}.",
  ],
};

export function serviceBlurb(serviceId: string, zoneSlug: string): string {
  const zone = zones.find((z) => z.slug === zoneSlug);
  const zl = getZoneLocal(zoneSlug);
  const pool = serviceBlurbBank[serviceId] || serviceBlurbBank.depannage;
  const seed = hashZone(zoneSlug + ":blurb:" + serviceId);
  const picked = pool[seed % pool.length];
  return fill(picked, zone ? zone.name : zoneSlug, zl, seed);
}

export function getZoneSlugs(): string[] {
  return zones.map((z) => z.slug);
}
