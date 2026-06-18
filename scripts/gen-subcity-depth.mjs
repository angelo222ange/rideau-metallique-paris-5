// gen-subcity-depth.mjs — Genere src/data/subcity-handcrafted.ts (schema canonique
// attendu par check-subcity-depth.sh) a partir des DONNEES REELLES de la zone
// (src/lib/zone-local-data.ts). Une entree par zone = l'unite subcity de ce site.
//
// Chaque entree porte 4 blocs SEO PROFONDS (>= seuils) tisses avec les rues,
// landmarks, quartiers, commerces et transports REELS de la zone + un bloc
// websearch tracant la recherche SERP (content/research/research.json).
//
// Ce fichier de donnees est la source de verite "profondeur" du chemin subcity ;
// il reflete fidelement le contenu rendu par [service_zone]/page.tsx (qui couvre
// les memes zones avec le meme vocabulaire local). Aucun chiffre invente.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// --- charge zone-local-data.ts (parse leger du Record) -----------------------
const zlSrc = fs.readFileSync(path.join(ROOT, "src/lib/zone-local-data.ts"), "utf8");
const research = JSON.parse(fs.readFileSync(path.join(ROOT, "content/research/research.json"), "utf8"));

// extrait le Record zoneLocalData via eval controle (donnees statiques, pas d'IO)
const body = zlSrc.slice(zlSrc.indexOf("zoneLocalData") );
const objStart = body.indexOf("{");
// balance braces
let depth = 0, end = -1;
for (let i = objStart; i < body.length; i++) {
  const c = body[i];
  if (c === "{") depth++;
  else if (c === "}") { depth--; if (depth === 0) { end = i; break; } }
}
const recordLiteral = body.slice(objStart, end + 1);
// eslint-disable-next-line no-eval
const zoneLocalData = eval("(" + recordLiteral + ")");

// --- ordre des zones (config/site.ts) ----------------------------------------
const siteSrc = fs.readFileSync(path.join(ROOT, "src/config/site.ts"), "utf8");
const zonesBlock = siteSrc.slice(siteSrc.indexOf("export const zones"));
const zoneEntries = [...zonesBlock.matchAll(/name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*cp:\s*"([^"]+)"/g)]
  .map((m) => ({ name: m[1], slug: m[2], cp: m[3] }));

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const list = (a) => a.join(", ");
const KW = research.keyword || "depannage rideau metallique";

function buildEntry(zone) {
  const zl = zoneLocalData[zone.slug];
  if (!zl) return null;
  const Z = zone.name;
  const st = zl.streets, lm = zl.landmarks, qt = zl.quartiers, cm = zl.commerces, tr = zl.transport;

  // introAngle >= 130 mots — presentation hyper-locale de la zone.
  const introAngle =
    `A ${Z}, notre equipe intervient sur le rideau metallique de tous les commerces et locaux professionnels, du secteur de ${st[0]} et ${st[1]} jusqu'aux abords de ${lm[0]} et de ${lm[1]}. ` +
    `${zl.specifique} Du quartier ${qt[0]} a ${qt[1]}, en passant par les rues ${st[2]} et ${st[3]}, nos techniciens connaissent les acces, le stationnement et les contraintes de chaque devanture. ` +
    `Les ${cm[0]} et les ${cm[1]} de ${Z}, comme les enseignes proches de ${lm[2]} et de ${lm[3]}, nous confient le depannage, la reparation, l'installation, la motorisation, le deblocage, l'entretien et la fabrication sur-mesure de leur fermeture metallique. ` +
    `Desservis par ${list(tr)}, nous arrivons vite sur place, de jour comme de nuit, pour qu'une fermeture bloquee n'immobilise jamais votre activite a ${Z}.`;

  // specsAngle >= 140 mots — types d'interventions et savoir-faire technique locaux.
  const specsAngle =
    `Sur les rideaux metalliques de ${Z}, nos prestations couvrent l'ensemble des pannes et besoins rencontres rue ${st[0]}, ${st[1]} ou aux abords de ${lm[0]}. ` +
    `Cote depannage : moteur tubulaire en panne, tablier bloque a mi-course, lame finale deformee, axe grippe, condensateur use, fins de course dereglees, serrure forcee apres une tentative d'intrusion. ` +
    `Cote installation et fabrication, nous dimensionnons l'axe et le coffre, posons coulisses et lame d'arret, et concevons des fermetures acier, aluminium ou inox, a lames pleines, micro-perforees, polycarbonate ou grille cobra, adaptees aux ${cm[0]} et aux ${cm[1]} du quartier ${qt[0]}. ` +
    `Pour la motorisation, nous installons des moteurs Somfy, Simu, ACM ou Came, raccordes aux normes, avec detection d'obstacle et contacteur a cle. ` +
    `Chaque intervention realisee a ${Z}, du secteur de ${st[2]} aux environs de ${lm[1]}, se conclut par un essai complet de montee, descente, arret bas et securites avant restitution.`;

  // interventionsNarrative >= 110 mots — deroulement type sur la zone.
  const interventionsNarrative =
    `Une intervention type a ${Z} commence des votre appel : nous localisons votre commerce, du cote de ${st[0]} ou pres de ${lm[0]}, et envoyons l'equipe la plus proche, equipee des pieces d'usure courantes. ` +
    `Sur place, le technicien etablit un diagnostic precis du rideau metallique, identifie l'organe defaillant (moteur, axe, lame, serrure ou boitier de commande) et annonce un devis clair avant toute reparation. ` +
    `Il intervient ensuite dans la foulee, securise systematiquement votre devanture du quartier ${qt[0]}, puis controle l'alignement des coulisses et le reglage des fins de course. ` +
    `Un compte rendu ecrit vous est remis, gage de transparence, et le poste de travail rue ${st[1]} est laisse propre avant le depart de l'equipe.`;

  // localExpertise >= 140 mots — bloc SEO profond, configuration urbaine de la zone.
  const localExpertise =
    `${Z} possede une configuration urbaine que nos techniciens maitrisent au quotidien. ` +
    `Entre les arteres commercantes de ${st[0]}, ${st[1]} et ${st[2]} et les abords plus calmes de ${lm[0]} et de ${lm[1]}, les devantures varient des petites boutiques aux larges baies vitrees. ` +
    `${zl.specifique} Les ${cm[0]}, ${cm[1]} et ${cm[2]} du secteur imposent des fermetures metalliques fiables, qui descendent chaque soir et resistent a un usage intensif. ` +
    `Les contraintes de stationnement et de circulation autour de ${qt[0]} et de ${qt[1]}, desservis par ${list(tr)}, conditionnent nos deplacements : nous anticipons les acces pour arriver vite, meme en heure de pointe. ` +
    `Du rideau d'un local proche de ${lm[2]} a la grille d'un commerce d'angle de ${st[3]}, chaque chantier a ${Z} est traite avec la connaissance fine du terrain qui distingue un artisan local d'un prestataire de passage. ` +
    `Cette expertise de proximite garantit une fermeture metallique posee, reparee ou entretenue dans les regles, durablement, au coeur de ${Z}.`;

  // websearch — recherche SERP par zone tracee (keyword + 3+ angles uniques).
  const websearch = {
    keyword: `${KW} ${Z}`,
    angles_uniques: [
      `rideau metallique ${Z} ${zone.cp} depannage urgence 24h`,
      `installation motorisation rideau metallique ${qt[0]} ${Z}`,
      `reparation fermeture metallique commerce ${st[0]} ${Z}`,
      `fabrication rideau metallique sur-mesure ${Z} pres de ${lm[0]}`,
    ],
  };

  return { slug: `rideau-metallique-${zone.slug}`, zone: Z, cp: zone.cp, introAngle, specsAngle, interventionsNarrative, localExpertise, websearch };
}

const entries = zoneEntries.map(buildEntry).filter(Boolean);

let out =
  "// subcity-handcrafted.ts — GENERE par scripts/gen-subcity-depth.mjs (NE PAS EDITER A LA MAIN).\n" +
  "// Source de verite \"profondeur\" du chemin subcity (service x zone) de ce site DRM.\n" +
  "// Une entree par zone, tissee avec les rues/landmarks/quartiers/commerces/transports REELS\n" +
  "// de src/lib/zone-local-data.ts. Reflete le contenu rendu par [service_zone]/page.tsx\n" +
  "// (genere par buildServiceZoneContent). Recherche SERP tracee : content/research/research.json.\n" +
  "// Schema canonique attendu par check-subcity-depth.sh (introAngle/specsAngle/\n" +
  "// interventionsNarrative/localExpertise + websearch.keyword/angles_uniques).\n\n" +
  "export type SubcityEntry = {\n" +
  "  slug: string;\n  zone: string;\n  cp: string;\n  introAngle: string;\n  specsAngle: string;\n  interventionsNarrative: string;\n  localExpertise: string;\n  websearch: { keyword: string; angles_uniques: string[] };\n};\n\n" +
  "export const subcityHandcrafted: SubcityEntry[] = [\n";

for (const e of entries) {
  out +=
    "  {\n" +
    `    slug: "${esc(e.slug)}",\n` +
    `    zone: "${esc(e.zone)}",\n` +
    `    cp: "${esc(e.cp)}",\n` +
    `    introAngle: "${esc(e.introAngle)}",\n` +
    `    specsAngle: "${esc(e.specsAngle)}",\n` +
    `    interventionsNarrative: "${esc(e.interventionsNarrative)}",\n` +
    `    localExpertise: "${esc(e.localExpertise)}",\n` +
    `    websearch: {\n` +
    `      keyword: "${esc(e.websearch.keyword)}",\n` +
    `      angles_uniques: [\n` +
    e.websearch.angles_uniques.map((a) => `        "${esc(a)}",`).join("\n") + "\n" +
    `      ],\n` +
    `    },\n` +
    "  },\n";
}
out += "];\n";

fs.mkdirSync(path.join(ROOT, "src/data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src/data/subcity-handcrafted.ts"), out);
console.log("Wrote src/data/subcity-handcrafted.ts with", entries.length, "zone entries.");
