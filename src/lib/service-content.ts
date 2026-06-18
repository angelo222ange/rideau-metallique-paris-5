// service-content.ts — Rotation deterministe du contenu service x zone (anti-duplicate REGLE 6.5).
// hashZoneSlug(zone.slug) seed des banks de titres / types / paragraphes / faq.
// Fournit seo1..seo4 (4 blocs SEO texte+image alternants — REGLE 6.7.F Biarritz).
// FAQ : la question 0 "Qui appeler" est TOUJOURS en premier (REGLE 6.7.H).

import { getZoneLocal, ZoneLocal } from "@/lib/zone-local-data";
import { siteConfig, services } from "@/config/site";

export function hashZoneSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) + h + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

function rot<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

// PRNG deterministe (mulberry32) seede par un entier.
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

// Selectionne `count` elements DISTINCTS d'un pool via Fisher-Yates seede.
// Deux seeds differents -> sous-ensemble + ordre tres rarement identiques.
function seededPick<T>(pool: T[], count: number, seed: number): T[] {
  const idx = pool.map((_, i) => i);
  const rng = mulberry32(seed);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(count, pool.length)).map((i) => pool[i]);
}

// Genre grammatical du nom de tete de chaque service (pour accorder un/le/ce).
// depannage/deblocage/entretien = masculin ; installation/reparation/motorisation/fabrication = feminin.
const SERVICE_GENDER: Record<string, "m" | "f"> = {
  depannage: "m",
  installation: "f",
  reparation: "f",
  motorisation: "f",
  deblocage: "m",
  entretien: "m",
  fabrication: "f",
};

const SERVICE_LABELS: Record<string, string> = {
  depannage: "depannage de rideau metallique",
  installation: "installation de rideau metallique",
  reparation: "reparation de rideau metallique",
  motorisation: "motorisation de rideau metallique",
  deblocage: "deblocage de rideau metallique",
  entretien: "entretien de rideau metallique",
  fabrication: "fabrication de rideau metallique",
};

// Banks de titres H2 (3 variantes) — keyword complet + zone (REGLE 12).
const titleBank: Record<string, string[]> = {
  depannage: [
    "Depannage de rideau metallique a {zone}",
    "Intervention urgente sur rideau metallique a {zone}",
    "Assistance rideau metallique 24h/24 a {zone}",
  ],
  installation: [
    "Installation de rideau metallique a {zone}",
    "Pose de rideau metallique sur-mesure a {zone}",
    "Mise en place de rideau metallique a {zone}",
  ],
  reparation: [
    "Reparation de rideau metallique a {zone}",
    "Remise en etat de rideau metallique a {zone}",
    "Remise aux normes de rideau metallique a {zone}",
  ],
  motorisation: [
    "Motorisation de rideau metallique a {zone}",
    "Automatisation de rideau metallique a {zone}",
    "Passage a l'electrique du rideau metallique a {zone}",
  ],
  deblocage: [
    "Deblocage de rideau metallique a {zone}",
    "Liberation de rideau metallique coince a {zone}",
    "Deblocage urgent de rideau metallique a {zone}",
  ],
  entretien: [
    "Entretien de rideau metallique a {zone}",
    "Maintenance preventive de rideau metallique a {zone}",
    "Contrat d'entretien de rideau metallique a {zone}",
  ],
  fabrication: [
    "Fabrication de rideau metallique a {zone}",
    "Rideau metallique sur-mesure fabrique pour {zone}",
    "Conception de rideau metallique a {zone}",
  ],
};

// Types d'intervention (banks de 3, 4 items chacun).
const typesBank: Record<string, string[][]> = {
  depannage: [
    ["Moteur en panne", "Rideau bloque a mi-course", "Lame deformee", "Serrure forcee"],
    ["Coupure d'alimentation", "Tablier deraille", "Telecommande HS", "Axe grippe"],
    ["Rideau qui ne remonte plus", "Bruit anormal", "Boitier electrique defaillant", "Ressort casse"],
  ],
  installation: [
    ["Prise de mesure sur site", "Pose de l'axe", "Pose des coulisses", "Raccordement electrique"],
    ["Etude de la devanture", "Fabrication sur-mesure", "Installation du coffre", "Tests de securite"],
    ["Choix du type de lame", "Montage du tablier", "Mise en service", "Formation a l'usage"],
  ],
  reparation: [
    ["Remplacement de lames", "Reparation de moteur", "Changement de serrure", "Redressage de tablier"],
    ["Reparation d'axe", "Remplacement de ressorts", "Reglage des fins de course", "Reprise de coulisses"],
    ["Changement de boitier", "Reparation de cablage", "Remplacement de joints", "Reglage du tablier"],
  ],
  motorisation: [
    ["Pose de moteur tubulaire", "Installation de moteur central", "Cablage et raccordement", "Telecommande et automatismes"],
    ["Choix du moteur adapte", "Depose du manuel", "Montage du boitier", "Reglage des fins de course"],
    ["Motorisation Somfy", "Motorisation Simu", "Motorisation ACM", "Mise en service complete"],
  ],
  deblocage: [
    ["Rideau coince ferme", "Lame sortie du rail", "Serrure bloquee", "Deblocage manuel d'urgence"],
    ["Rideau coince ouvert", "Tablier desaxe", "Moteur grippe", "Liberation sans degradation"],
    ["Cle cassee dans la serrure", "Blocage apres effraction", "Axe immobilise", "Remise en mouvement"],
  ],
  entretien: [
    ["Graissage des coulisses", "Controle du moteur", "Verification des fins de course", "Test des securites"],
    ["Inspection du tablier", "Reglage de l'axe", "Nettoyage des rails", "Controle du boitier"],
    ["Contrat annuel", "Visite preventive", "Diagnostic complet", "Rapport d'intervention"],
  ],
  fabrication: [
    ["Lames pleines acier", "Lames micro-perforees", "Lames polycarbonate", "Grille cobra"],
    ["Rideau aluminium", "Rideau inox", "Coffre sur-mesure", "Axe renforce"],
    ["Devanture commerce", "Entrepot industriel", "Garage prive", "Grille extensible"],
  ],
};

// Angles de paragraphes par service (placeholders {zone}/{landmark1}/{street1}/{commerce1}/{specifique}).
const paragraphAngles: Record<string, string[]> = {
  depannage: [
    "Un rideau metallique bloque devant un commerce a {zone} immobilise toute l'activite. Nos techniciens interviennent en moins de 30 minutes pres de {landmark1} et dans le secteur de {street1} pour remettre votre fermeture en marche, de jour comme de nuit.",
    "Pres de {commerce1} et autour de {landmark2}, une panne de rideau metallique a {zone} expose votre local. {specifique} Nous diagnostiquons l'origine de la panne sur place et reparons dans la foulee.",
    "Du quartier {quartier1} aux abords de {street2}, les commercants de {zone} comptent sur une intervention rapide quand le rideau refuse de remonter. Moteur, axe ou tablier : nous trouvons la cause et redemarrons votre fermeture metallique le jour meme.",
    "Une effraction ou un choc bloque votre rideau a {zone} ? Nous nous deplacons en urgence vers {landmark3} et {street3} pour securiser votre devanture, puis reparer durablement la fermeture metallique endommagee.",
    "Quand le moteur force et le tablier cale a mi-hauteur a {zone}, le condensateur ou les fins de course sont souvent en cause. Nos depanneurs testent l'electronique sur place pres de {landmark1} et relancent la fermeture sans changer toute la motorisation.",
    "Une lame finale tordue ou des coulisses faussees coincent le rideau d'un commerce de {quartier1}. Nous redressons les profils et realignons les rails du cote de {street2} pour qu'a {zone} le tablier redescende droit, sans point dur ni grincement.",
    "Les ressorts de compensation fatiguent et la manoeuvre devient dure a {zone}. Nos techniciens retendent ou remplacent ces ressorts aux abords de {commerce1}, puis reequilibrent le tablier afin que la fermeture remonte de nouveau sans effort.",
    "Un axe grippe ou un roulement use fait vibrer le rideau a chaque ouverture pres de {landmark2}. Nous deposons le caisson, controlons l'arbre et les attaches de lames du secteur de {street3}, puis remettons la fermeture de {zone} en mouvement silencieux.",
    "Une panne electrique coupe net la manoeuvre de votre rideau pres de {commerce2} ? Nous controlons l'arrivee de courant, le disjoncteur dedie et le cablage du moteur, retablissons l'alimentation defaillante et relancons la fermeture pour que votre devanture redevienne operationnelle.",
    "Lorsque le tablier deraille de ses coulisses vers {landmark2}, les lames se coincent et bloquent toute la course. Notre technicien repositionne le rideau dans ses glissieres, redresse les lames voilees si besoin et verifie l'alignement complet avant de restituer un coulissement fluide.",
    "Un bruit anormal, grincement ou claquement, signale souvent un axe deforme ou un roulement use. Sur {quartier1}, nous demontons le tube d'enroulement, identifions l'organe bruyant, le lubrifions ou le remplacons, puis testons la manoeuvre pour retrouver un fonctionnement silencieux.",
    "Quand un ressort de compensation casse, le rideau devient lourd et refuse de monter correctement. Notre intervenant rejoint {street1}, depose l'axe, installe un ressort neuf calibre au poids du tablier et regle la tension pour rendre la manoeuvre douce et equilibree.",
    "Une telecommande hors service empeche d'ouvrir ou fermer a distance. Pres de {landmark3}, nous testons l'emetteur, remplacons la pile ou reprogrammons le boitier de reception, et controlons la portee du signal afin que la commande reponde de nouveau instantanement.",
    "Un boitier de commande defaillant fige le rideau en position intermediaire. Vers {commerce1}, notre technicien diagnostique la carte electronique, verifie les contacts et les relais, repare ou substitue le module commande puis valide chaque cycle d'ouverture et de fermeture.",
    "Une coupure d'alimentation generale laisse votre devanture ouverte et vulnerable. Sur {specifique}, nous actionnons le systeme de deverrouillage manuel, securisons immediatement la fermeture, puis retablissons le circuit electrique et reprogrammons les positions hautes et basses.",
    "Lorsque le rideau ne remonte plus malgre la commande, le defaut vient souvent du moteur ou des fins de course dereglees. Pres de {quartier2}, nous testons la motorisation, reajustons les butees de course, remplacons l'organe grille si necessaire et verifions la remontee jusqu'en position ouverte.",
  ],
  installation: [
    "Installer un rideau metallique a {zone}, c'est proteger durablement votre vitrine. Pour les commerces de {street1} comme pour les locaux proches de {landmark1}, nous posons des fermetures sur-mesure adaptees a votre devanture. {specifique}",
    "Chaque devanture de {zone} est differente. Nous prenons les mesures sur site, du secteur de {commerce1} aux abords de {landmark2}, puis fabriquons et installons un rideau metallique aux dimensions exactes.",
    "Dans le quartier {quartier1} et le long de {street2}, les nouveaux commerces de {zone} choisissent une fermeture metallique adaptee a leur activite. Lame pleine, micro-perforee ou grille : nous conseillons puis posons la solution la plus pertinente.",
    "Pour un local proche de {landmark3}, l'installation d'un rideau metallique a {zone} combine securite et esthetique. Nous integrons le coffre, posons les coulisses et raccordons l'electricite aux normes avant la mise en service.",
    "Le choix de l'axe et du couple moteur conditionne la longevite d'une fermeture a {zone}. Pour les vitrines larges du secteur de {street2}, nous dimensionnons l'arbre et les ressorts de compensation pour que le tablier glisse sans forcer pendant des annees.",
    "Une grille cobra ou des lames micro-perforees laissent voir la vitrine la nuit, un atout pour les enseignes du quartier {quartier1}. A {zone}, nous conseillons le type de tablier puis montons coulisses et serrure aux abords de {commerce1}.",
    "L'integration du coffre demande une lame d'arret et un guidage precis. Pour un commerce proche de {landmark4}, nous posons les patins, calons les fins de course et verifions l'aplomb du tablier avant de cabler la motorisation de votre rideau a {zone}.",
    "Avant la pose a {zone}, nous etudions l'exposition de la baie et la place du caisson le long de {street3}. Cette etude evite les jeux, ajuste la profondeur des coulisses et garantit une descente du rideau parfaitement ajustee a votre ouverture.",
    "Une devanture d'angle ou une baie en retrait du quartier {quartier2} impose un guidage particulier. A {zone}, pres de {landmark4}, nous adaptons la longueur des coulisses et la position du coffre pour que le tablier coulisse sans frottement ni jeu.",
    "Le verrouillage compte autant que le tablier pour une boutique de {commerce2}. Lors de la pose a {zone}, nous installons serrure a barillet, points de fermeture et lame d'arret renforcee aux abords de {street2}, selon votre niveau de risque.",
    "Pour une enseigne proche de {landmark1}, nous coordonnons fabrication, livraison et installation sur une seule journee. Cette organisation limite l'arret d'activite a {zone} et laisse le chantier du secteur de {street3} propre des la fin de la pose.",
    "Une grille extensible laisse circuler l'air et la lumiere devant un local du quartier {quartier1}. A {zone}, nous montons le rail au sol, fixons le coffre lateral pres de {commerce1} et reglons le verrou de parking pour une fermeture pratique au quotidien.",
  ],
  reparation: [
    "Une lame voilee ou un moteur fatigue sur un rideau metallique a {zone} fragilise la securite de votre commerce. Nous reparons sur place les fermetures du quartier de {street1} et des environs de {landmark1}. {specifique}",
    "Plutot que de tout remplacer, nous remettons en etat votre rideau metallique a {zone}. Lames, axe, ressorts, serrure : les commercants pres de {commerce1} et de {landmark2} retrouvent une fermeture fiable.",
    "Du secteur {quartier1} a la {street2}, les rideaux metalliques de {zone} s'usent avec le temps. Nous reprenons les coulisses, changeons les pieces fatiguees et remettons le tablier d'aplomb pour une fermeture qui glisse sans effort.",
    "Apres une tentative d'effraction pres de {landmark3}, la remise en etat d'un rideau metallique a {zone} doit etre rapide. Nous remplacons la serrure, redressons les lames et controlons l'ensemble pour securiser votre commerce.",
    "Un tablier qui accroche ou des coulisses faussees sur votre fermeture a {zone} ? Nos techniciens redressent les profils, realignent les rails du cote de {street1} et garantissent une descente reguliere du rideau, sans point dur.",
    "Le moteur peine, le rideau cale a mi-hauteur a {zone} : avant de changer toute la motorisation, nous testons condensateur, fins de course et cablage. Cette approche evite des frais inutiles aux commerces de {quartier1}.",
    "Les ressorts de compensation fatiguent et rendent la manoeuvre dure a {zone}. Nous les retendons ou les remplacons aux abords de {landmark1}, puis verifions l'equilibrage du tablier pour une fermeture qui glisse de nouveau.",
    "Joints de butee uses, lame finale tordue, axe qui vibre : ces usures discretes finissent par bloquer un rideau a {zone}. Nous les corrigeons une a une, du secteur de {street2} jusqu'aux commerces proches de {landmark2}.",
    "Une serrure forcee ou un barillet grippe laisse votre devanture vulnerable a {zone}. Nos serruriers remplacent le bloc de fermeture pres de {commerce2}, ajustent les points de verrouillage du cote de {street3} et redonnent au rideau toute sa resistance face aux tentatives d'effraction.",
    "Quand le tablier presente plusieurs lames cabossees apres un choc, un redressage isole ne suffit plus a {zone}. Nous remplacons les profils abimes a l'unite, sertissons les agrafes neuves pres de {landmark4} et recalibrons la planeite du rideau pour qu'il s'enroule sans accroc dans le quartier {quartier2}.",
    "Un boitier de commande qui ne repond plus ou des fins de course dereglees figent la fermeture en pleine journee a {zone}. Notre technicien remet a plat le cablage du moteur aux abords de {commerce1}, reprogramme les butees haute et basse et restaure une manoeuvre nette le long de {street1}.",
    "L'usure progressive des roulements d'axe rend le rideau bruyant puis dur a manoeuvrer a {zone}. Avant la casse, nous deposons l'arbre d'enroulement pres de {landmark1}, remplacons les paliers et reequilibrons la tension des ressorts pour redonner au tablier du quartier {quartier1} une course douce et silencieuse.",
  ],
  motorisation: [
    "Motoriser un rideau metallique manuel a {zone} apporte confort et securite. Les commercants de {street1} et les locaux proches de {landmark1} passent a l'electrique avec des moteurs Somfy, Simu ou ACM. {specifique}",
    "Fini les manivelles : nous automatisons votre rideau metallique a {zone}. Du secteur de {commerce1} aux abords de {landmark2}, nous installons moteur, telecommande et securites.",
    "Dans le quartier {quartier1} et autour de {street2}, motoriser une fermeture metallique a {zone} fait gagner un temps precieux a l'ouverture et a la fermeture. Nous choisissons le moteur adapte au poids du tablier et reglons les fins de course.",
    "Pour un commerce proche de {landmark3}, la motorisation d'un rideau metallique a {zone} s'accompagne de dispositifs de securite. Nous posons un moteur tubulaire ou central, raccordons et expliquons le fonctionnement.",
    "Le couple du moteur se choisit selon le poids du tablier a {zone}. Pour les grandes devantures du secteur de {street3}, nous calculons la puissance, montons l'arbre adapte et reglons les fins de course au millimetre pres de {landmark4}.",
    "Une detection d'obstacle et un arret automatique protegent biens et personnes a {zone}. Nous ajoutons ces securites lors de la motorisation des fermetures du quartier {quartier2}, avec un contacteur a cle pour les commerces de {commerce2}.",
    "Avant de motoriser un rideau a {zone}, l'etat de l'axe et des coulisses doit etre verifie pres de {landmark1}. Une motorisation posee sur un tablier sain, le long de {street2}, fonctionne souplement et evite les blocages a venir.",
    "Telecommande, horloge ou interrupteur a cle : la commande s'adapte a votre usage a {zone}. Pour les enseignes de {quartier1}, nous programmons les automatismes et formons l'equipe a la manoeuvre du rideau motorise des abords de {commerce1}.",
  ],
  deblocage: [
    "Un rideau metallique coince a {zone} bloque l'ouverture ou la fermeture de votre commerce. Nos equipes interviennent en urgence pres de {landmark1} et dans le secteur de {street1} pour liberer le tablier sans abimer la devanture. {specifique} Nos camions embarquent les pieces d usure courantes, ce qui permet le plus souvent de tout regler des le premier passage, sans nouveau rendez-vous ni immobilisation prolongee du commerce.",
    "Lame sortie du rail, serrure grippee, moteur immobilise : nous deblocons votre rideau metallique a {zone}. Les commercants autour de {commerce1} et de {landmark2} retrouvent l'usage de leur fermeture.",
    "Du quartier {quartier1} a la {street2}, un rideau metallique coince a {zone} ne doit pas attendre. Nous liberons le tablier a la main ou au moteur, puis verifions l'axe et les coulisses pour eviter que cela recommence.",
    "Quand une cle casse dans la serrure d'un rideau a {zone} pres de {landmark3}, nous intervenons sans tout remplacer. Extraction, deblocage et controle complet rendent votre fermeture metallique de nouveau operationnelle. Cette extraction delicate evite de remplacer tout le bloc de fermeture et preserve votre budget, tout en redonnant au mecanisme une fiabilite equivalente a celle d origine.",
    "Un tablier desaxe qui sort des coulisses fige le rideau a mi-course a {zone}. Nos equipes remettent les lames dans les rails du cote de {street3}, puis controlent le guidage et l'axe pres de {landmark4} pour eviter une nouvelle sortie de rail.",
    "Apres une coupure ou un moteur grippe, le rideau reste immobile devant un commerce de {quartier2}. Nous liberons le tablier au manuel a {zone}, retablissons l'alimentation aux abords de {commerce2} et verifions le condensateur avant de repartir.",
    "Forcer un rideau coince a {zone} risque de tordre les lames et de fausser les rails. Avec le bon outillage, pres de {landmark1}, nous detendons le tablier en douceur, le degageons des coulisses et preservons la devanture du secteur de {street2}. Nous laissons toujours le poste de travail propre et remettons un compte rendu ecrit, gage de transparence sur la nature exacte de l intervention realisee sur votre fermeture.",
    "Un blocage apres effraction laisse souvent la serrure faussee et le tablier de travers a {zone}. Nous liberons la fermeture pres de {commerce1}, securisons l'ouverture du quartier {quartier1} sur-le-champ, puis planifions la reparation durable.",
    "Quand le verrou de parking se grippe sur une grille extensible du quartier {quartier2}, la fermeture reste figee a {zone}. Nous degageons le mecanisme aux abords de {commerce2}, lubrifions la cremone et redonnons sa course au tablier sans le forcer. Un reglage fin de la tension et un graissage cible des points de friction completent l operation, pour une manoeuvre durablement souple et sans bruit parasite.",
    "Un objet tombe dans la coulisse coince le rideau d'un commerce de {street3}. A {zone}, pres de {landmark4}, nos techniciens retirent le corps etranger, controlent le profil du rail et verifient que le tablier reprend sa descente bien droite.",
    "Le condensateur de demarrage lache et le moteur ronronne sans bouger a {zone}. Plutot que de tout demonter, nous passons en manuel de secours pres de {landmark1} pour rouvrir, puis identifions la piece a remplacer du secteur de {street2}.",
    "Une lame finale tordue empeche le rideau de remonter completement a {zone}. Nous redressons le profil et liberons le tablier dans le quartier {quartier1}, puis controlons le guidage aux abords de {commerce1} pour eviter un nouveau coincement.",
  ],
  entretien: [
    "Un rideau metallique entretenu a {zone} tombe rarement en panne. Nous assurons la maintenance preventive des fermetures du quartier de {street1} et des environs de {landmark1}. {specifique}",
    "Graissage, controle du moteur, reglage des fins de course : l'entretien de votre rideau metallique a {zone} prolonge sa duree de vie. Les commerces pres de {commerce1} et de {landmark2} evitent ainsi les pannes.",
    "Dans le quartier {quartier1} et le long de {street2}, un contrat d'entretien pour votre rideau metallique a {zone} garantit des visites regulieres. Nous controlons l'axe, les ressorts et les securites avant qu'une panne ne survienne.",
    "Pour un commerce proche de {landmark3}, l'entretien preventif d'une fermeture metallique a {zone} reduit les arrets imprevus. Nettoyage des rails, tension des ressorts et rapport d'intervention sont fournis a chaque passage.",
    "Un graissage regulier des coulisses et de l'axe garde le tablier silencieux a {zone}. Pour les commerces du secteur de {street3}, nos visites lubrifient les points de friction pres de {landmark4} et detectent l'usure avant qu'elle ne bloque la fermeture.",
    "La tension des ressorts de compensation se desequilibre avec le temps a {zone}. Lors de chaque passage aux abords de {commerce2}, nous reajustons l'equilibrage du tablier du quartier {quartier2} pour qu'il remonte sans forcer le moteur.",
    "Controler condensateur, fins de course et detection d'obstacle evite les pannes en pleine activite a {zone}. Nos techniciens testent ces securites pres de {landmark1} et remplacent les pieces fatiguees des fermetures du secteur de {street2}.",
    "Un contrat d'entretien planifie les visites sans que vous y pensiez a {zone}. Pour les enseignes du quartier {quartier1}, nous adaptons la frequence a l'intensite d'usage et remettons un rapport detaille a chaque intervention pres de {commerce1}.",
    "Les rails encrasses par la poussiere et la pollution freinent le tablier d'un commerce de {street3}. A {zone}, nos visites nettoient les coulisses pres de {landmark4}, eliminent les depots et retablissent une glisse fluide du quartier {quartier2}.",
    "Le moteur merite une verification reguliere du couple et du condensateur a {zone}. Aux abords de {commerce2}, nous mesurons sa consommation, controlons l'echauffement et anticipons son remplacement avant qu'il ne lache en pleine activite.",
    "Une lame d'arret usee ou des joints de butee ecrases laissent passer un jour sous le rideau a {zone}. Lors de l'entretien pres de {landmark1}, nous remplacons ces pieces du secteur de {street2} pour une fermeture etanche et bien plaquee au sol.",
    "Un rideau peu sollicite se grippe aussi, faute d'usage. A {zone}, dans le quartier {quartier1}, nos passages preventifs manoeuvrent la fermeture, graissent l'axe pres de {commerce1} et evitent que les pieces ne se figent entre deux ouvertures.",
  ],
  fabrication: [
    "Fabriquer un rideau metallique sur-mesure pour {zone}, c'est repondre exactement a votre ouverture. Pour les devantures de {street1} et les locaux proches de {landmark1}, nous concevons lames, coffre et axe adaptes. {specifique}",
    "Acier, aluminium ou inox : nous fabriquons votre rideau metallique a {zone} aux dimensions precises. Du secteur de {commerce1} aux abords de {landmark2}, chaque fermeture est unique.",
    "Dans le quartier {quartier1} et autour de {street2}, une devanture atypique a {zone} demande une fabrication sur-mesure. Nous mesurons, choisissons le materiau et l'epaisseur, puis concevons une fermeture metallique unique.",
    "Pour un local proche de {landmark3}, la fabrication d'un rideau metallique a {zone} integre vos contraintes de hauteur et de largeur. Lames pleines, micro-perforees ou grille cobra : chaque element est realise selon votre besoin.",
    "Le choix de l'epaisseur de lame et de l'axe renforce la robustesse d'une fermeture a {zone}. Pour les vitrines exposees du secteur de {street3}, nous taillons un tablier acier et un coffre dimensionnes pres de {landmark4}, sans compromis sur la securite.",
    "Une devanture atypique du quartier {quartier2} demande un coffre et des coulisses concus sur plan. A {zone}, nous mesurons l'ouverture aux abords de {commerce2}, dessinons la fermeture et ajustons chaque cote avant la mise en production.",
    "Lames polycarbonate translucides ou grille extensible aeree : le type de tablier depend de votre besoin de visibilite a {zone}. Pour les boutiques de {quartier1}, nous orientons le materiau pres de {commerce1} puis fabriquons la fermeture sur-mesure.",
    "Un rideau inox resiste mieux a l'humidite et aux chocs pour un local proche de {landmark1}. A {zone}, le long de {street2}, nous selectionnons l'alliage, renforcons l'axe et soignons les finitions pour une fermeture durable et bien ajustee.",
    "Pour une grande baie vitree du quartier {quartier2}, l'axe et les tubes de renfort doivent porter un tablier lourd sans flechir. A {zone}, pres de {landmark4}, nous calculons la section de l'arbre et le pas des lames avant l'usinage en atelier.",
    "Une devanture classee aux abords de {landmark1} impose un coffre discret et des finitions soignees. A {zone}, nous fabriquons un caisson compact, choisissons une teinte adaptee a la facade de {street3} et integrons la fermeture sans denaturer le commerce.",
    "Un local livre frequemment, pres de {commerce2}, subit des chocs repetes sur le bas du rideau. A {zone}, nous fabriquons une lame finale renforcee et des coulisses epaisses dans le quartier {quartier1}, pour une fermeture qui encaisse l'usage intensif.",
    "Le besoin de visibilite guide le dessin du tablier a {zone}. Pour une vitrine du secteur de {street2}, nous alternons lames pleines et hublots, ou optons pour une grille a maille fine aux abords de {commerce1}, selon ce que vous voulez montrer.",
  ],
};

// Banks pour seo3 / seo4 — varies par seed pour casser la similarite cross-zone.
const localContextBank: string[] = [
  "De {street1} a {street2}, en passant par le quartier {quartier1}, nous connaissons les acces et les contraintes de stationnement de {zone}.",
  "Nos techniciens couvrent {quartier1} et {quartier2}, des abords de {landmark2} jusqu'a {street3}, pour une intervention sans perte de temps a {zone}.",
  "Que votre commerce soit pres de {landmark1}, de {landmark4} ou le long de {street2}, nous intervenons rapidement dans tout {zone}.",
  "Du metro {transport1} aux rues commercantes de {street1} et {street3}, nous desservons l'ensemble de {zone} et ses {commerce2}.",
  "Le secteur {quartier2}, autour de {landmark3} et de {street2}, fait partie des zones que nos equipes traitent en priorite a {zone}.",
  "Pres de {landmark2} comme dans le quartier {quartier1}, les {commerce1} de {zone} nous confient l'entretien et le depannage de leur fermeture metallique.",
  "Les {commerce1} et {commerce2} de {zone}, du secteur de {street1} jusqu'aux abords de {landmark3}, comptent parmi nos clients reguliers.",
  "Notre connaissance du terrain a {zone} - de {quartier1} a {quartier2}, en passant par {landmark1} - nous fait gagner un temps precieux a chaque deplacement.",
  "Entre {street2} et {street3}, autour de {landmark4}, nous intervenons sur des fermetures de toutes tailles et de tous formats a {zone}.",
  "Du quartier {quartier2} aux arteres de {street1}, desservies par le metro {transport1}, nos equipes maillent l'ensemble de {zone}.",
  "Commerces de centre-ville, locaux proches de {landmark2} ou ateliers de {street3} : a {zone}, chaque type d'etablissement trouve une reponse adaptee.",
  "Aux alentours de {landmark1} et de {landmark3}, dans le quartier {quartier1} comme rue {street2}, nous sommes presents au quotidien a {zone}.",
  "Les artisans et boutiques de {street1}, ainsi que les enseignes du quartier {quartier1}, font appel a nous pour securiser leur devanture a {zone}.",
  "Depuis {landmark1} jusqu'a {landmark2}, en longeant {street3}, notre maillage de {zone} garantit une arrivee rapide sur site.",
  "Le quartier {quartier2}, borde par {street1} et proche de {landmark3}, figure parmi les secteurs ou nous intervenons le plus a {zone}.",
  "Entre les {commerce1} de {street2} et les {commerce2} des abords de {landmark4}, nous quadrillons {zone} sans temps mort.",
  "Pres de la station {transport1}, dans les rues animees de {street1} et {street3}, les commerces de {zone} nous appellent a toute heure.",
  "De la {street2} au quartier {quartier1}, en passant par les abords de {landmark2}, nous connaissons chaque acces de {zone}.",
  "Les {commerce1} installes autour de {landmark1} et le long de {street3} comptent sur notre proximite pour {zone}.",
  "Notre secteur a {zone} s'etend de {landmark3} a {landmark4}, couvrant {quartier1}, {quartier2} et les arteres de {street1}.",
  "Boutiques de {street2}, ateliers de {quartier2} et enseignes proches de {landmark1} : a {zone}, nous repondons present sur tout le territoire.",
  "Desservi par {transport1}, le secteur de {street1} et du quartier {quartier1} fait partie de nos zones d'intervention prioritaires a {zone}.",
  "De {landmark2} aux {commerce2} de {street3}, nous parcourons {zone} chaque jour pour entretenir et depanner les fermetures metalliques.",
];

const seo3TitleBank: string[] = [
  "Pourquoi choisir DRM {cityShort} pour votre {serviceLabel} a {zone}",
  "Un specialiste du {serviceLabel} de proximite a {zone}",
  "Nos atouts pour {le} {serviceLabel} a {zone}",
];

const seo3TextBank: string[] = [
  "Implantes au coeur de {cityShort}, nos techniciens connaissent les contraintes du secteur de {zone}. Nous intervenons rapidement, avec des pieces de marque et une garantie sur chaque {serviceLabel}. {specifique}",
  "Reactivite, transparence et savoir-faire : voila ce qui distingue notre {serviceLabel} a {zone}. Devis gratuit, tarifs annonces a l'avance et travail garanti pieces et main d'oeuvre.",
  "Nos equipes interviennent sur toutes les marques de rideaux metalliques a {zone}, avec un materiel professionnel et le respect des normes de securite. {specifique}",
  "Habitues aux commerces et locaux de {zone}, nous adaptons chaque {serviceLabel} a la configuration de votre devanture. Outillage complet, pieces d'origine et engagement de delai font partie de notre methode.",
  "A {zone}, la confiance se construit sur la duree : diagnostic honnete, chiffrage clair et fermeture remise en etat dans les regles. Voila pourquoi tant de commercants nous confient leur {serviceLabel}.",
  "Notre atout pour le {serviceLabel} a {zone}, c'est la proximite : une equipe basee a {cityShort}, mobilisable vite, qui maitrise toutes les technologies de rideaux et de grilles. {specifique}",
  "Choisir DRM {cityShort} pour votre {serviceLabel} a {zone}, c'est miser sur des artisans formes, des interventions tracees et une garantie ecrite. Nous privilegions la reparation durable plutot que le remplacement systematique.",
  "Connaissance du terrain, ponctualite et finitions soignees resument notre approche du {serviceLabel} a {zone}. Chaque chantier est controle avant restitution, securites et fins de course comprises.",
  "Forts d'annees d'experience a {cityShort} et autour de {zone}, nous traitons aussi bien les petites enseignes que les grandes devantures. Conseil personnalise, pieces garanties et tarif transparent sont notre standard. {specifique}",
];

const seo4TitleBank: string[] = [
  "{Le} {serviceLabel} a {zone} en pratique",
  "Comment se deroule {un} {serviceLabel} a {zone}",
  "Notre methode pour {le} {serviceLabel} a {zone}",
];

const seo4TextBank: Record<string, string[]> = {
  depannage: [
    "Des votre appel, nous localisons votre commerce a {zone} et envoyons l'equipe la plus proche. Diagnostic sur place, devis immediat, puis reparation : votre rideau metallique repart en general dans l'heure.",
    "Un depannage de rideau metallique a {zone} commence par l'identification de la panne (moteur, axe, lame, serrure). Nous reparons sur place quand c'est possible et securisons toujours votre devanture avant de partir.",
    "Quand un rideau metallique lache a {zone}, chaque minute compte. Notre standard prend votre appel, oriente le technicien le plus proche et vous tient informe du delai reel d'arrivee sur votre commerce.",
    "Nos camions d'intervention sillonnent {zone} avec les pieces courantes a bord. Cela nous permet, dans la majorite des depannages de rideau metallique, de reparer des le premier passage sans vous faire patienter.",
    "Sur un depannage a {zone}, nous commencons par couper l'alimentation et tester le boitier avant de toucher le mecanisme. Cette methode securise l'intervention et cible la panne reelle, qu'elle vienne du moteur, du condensateur ou des fins de course.",
    "Quand le tablier est sorti des coulisses a {zone}, nous le degageons en douceur pour ne pas tordre les lames, puis le replacons dans les rails. Un controle du guidage termine le depannage afin que la fermeture redescende droit.",
    "Face a une serrure forcee a {zone}, notre priorite est de remettre votre commerce hors d'atteinte. Nous securisons l'ouverture des l'arrivee, puis remplacons la serrure et controlons le verrouillage avant de quitter les lieux.",
    "Un depannage de rideau metallique a {zone} se conclut par un essai complet devant vous : montee, descente, arret bas et securites. Vous repartez avec une fermeture relancee et l'origine de la panne clairement expliquee.",
    "Des l'appel recu, notre standard declenche une intervention prioritaire et un technicien rejoint {zone} sous le delai annonce. Sur place, il etablit un diagnostic precis de la motorisation, du condensateur et des fins de course, identifie l'organe defaillant et procede a la remise en service avant de securiser entierement la devanture.",
    "Quand votre rideau metallique se bloque pres de {street1}, un depanneur equipe arrive rapidement avec les pieces courantes en stock. Il controle le moteur tubulaire, teste l'axe d'enroulement et les lames, repare la panne constatee, puis verifie la fermeture complete pour proteger votre commerce.",
    "Notre equipe traite chaque blocage en urgence : reception de l'appel, envoi immediat d'un technicien vers {quartier1} et inspection methodique de la serrure, du tablier et du tube d'enroulement. Apres reparation du composant en cause, la cloture est testee plusieurs fois pour garantir un verrouillage fiable.",
    "Face a une panne soudaine, nous mobilisons sans attendre un intervenant qui localise l'origine du dysfonctionnement : moteur grille, condensateur use ou butees dereglees. Le diagnostic est realise sur {street2}, la piece defectueuse est remplacee et la grille remise en mouvement pour securiser votre vitrine.",
    "Des reception du signalement, un specialiste rejoint le secteur de {landmark1} muni d'un outillage complet. Il ausculte le treuil, les ressorts de compensation et le boitier de commande, isole le defaut, restaure l'enroulement puis controle la descente et la remontee jusqu'a fermeture etanche.",
    "Notre service d'urgence repond en continu : un technicien se rend vers {commerce1} pour examiner l'alimentation, le moteur et les capteurs de fin de course. Il diagnostique la cause exacte, intervient sur l'element fautif et verrouille la fermeture afin que votre local reste protege la nuit.",
    "Apres votre coup de fil, l'intervention demarre aussitot et un depanneur atteint {quartier2} avec moteurs et condensateurs de rechange. Il verifie le coulissement des lames dans les coulisses, teste l'axe et la commande, effectue la remise en etat puis securise la devanture en quelques minutes.",
    "En cas d'immobilisation totale, nous depechons un technicien vers {street3} pour un controle complet : motorisation, serrure de blocage, lame finale et systeme de relevage. Le composant defaillant est repare ou substitue, et la fermeture est revalidee pour assurer la mise en securite immediate du commerce.",
  ],
  installation: [
    "Une installation de rideau metallique a {zone} debute par une prise de mesures precise et le choix du type de lame. Nous fabriquons puis posons coffre, axe et coulisses avant un raccordement electrique aux normes.",
    "Apres l'etude de votre devanture a {zone}, nous planifions la pose du rideau metallique : montage du tablier, reglage des fins de course, tests de securite et formation a l'usage le jour de la mise en service.",
    "Avant toute pose a {zone}, nous evaluons l'exposition, la largeur de baie et le niveau de securite souhaite. Ce diagnostic conditionne le choix entre lame pleine, micro-perforee ou grille pour votre rideau metallique.",
    "Installer un rideau metallique a {zone} se prepare : nous coordonnons fabrication, livraison et pose pour limiter l'arret de votre activite. Le chantier est realise proprement et dans le delai annonce.",
    "La pose d'un rideau a {zone} demarre par la fixation du coffre et le montage de l'axe, dimensionne au poids du tablier. Nous calons ensuite les coulisses d'aplomb avant d'enrouler les lames pour une descente reguliere et silencieuse.",
    "Une installation a {zone} integre le choix de la serrure et du verrouillage selon votre niveau de risque. Nous posons points de fermeture et lame d'arret, puis verifions l'etancheite du guidage avant le raccordement electrique.",
    "Pour une fermeture motorisee a {zone}, nous raccordons le moteur aux normes, reglons les fins de course haute et basse, puis testons la detection d'obstacle. La mise en service ne se fait qu'apres validation de toutes les securites.",
    "Avant de quitter votre commerce a {zone}, nous vous formons a la manoeuvre quotidienne et au deverrouillage manuel de secours. Cette prise en main evite les fausses pannes et prolonge la duree de vie de votre rideau neuf.",
    "Sur une installation a {zone}, nous reperons d'abord l'arrivee electrique et le passage des cables avant de fixer le coffre. Ce reperage evite les saignees inutiles et garantit un raccordement propre, masque et conforme au tableau.",
    "Le scellement du caisson et des coulisses conditionne la tenue du rideau a {zone}. Nous chevillons dans le bati porteur, controlons l'aplomb au niveau laser, puis enroulons le tablier pour verifier qu'il descend sans accrocher les rails.",
    "Une grille extensible posee a {zone} se regle differemment d'un tablier enroulable : nous ajustons le rail au sol, le guidage haut et le verrou de parking. Un essai de fermeture complete valide la course avant la remise des cles.",
    "Pour une devanture exposee a {zone}, nous integrons des butees laterales et une lame d'arret renforcee. Ces details, poses des l'installation, protegent le bas du rideau des chocs de livraison et prolongent sa longevite.",
    "Le devis d'installation a {zone} detaille materiau, dimensions, type de commande et options de securite. Vous validez chaque ligne avant la commande en atelier, sans surprise sur le prix ni sur le delai de fabrication.",
    "A {zone}, la livraison du tablier enroule arrive groupee avec le coffre et les profils de guidage. Cette logistique soignee evite les allers-retours et permet de boucler la pose en une seule visite sur votre commerce.",
    "Une baie tres large a {zone} peut recevoir deux vantaux jointifs plutot qu'un tablier unique trop lourd. Nous etudions cette repartition pour repartir la charge et garder une manoeuvre douce sans surdimensionner le moteur.",
    "L'esthetique compte autant que la robustesse a {zone} : teinte du coffre, finition des lames et discretion du caisson sont choisies avec vous pour que la fermeture s'efface dans la vitrine une fois relevee.",
    "Apres la pose a {zone}, nous remettons une fiche d'usage et le numero de serie du moteur. Ce dossier facilite tout entretien futur et la commande de pieces, et garantit la tracabilite de votre nouvelle fermeture.",
    "Pour un commerce ouvert a {zone}, nous planifions l'installation en dehors des heures d'affluence. La depose de l'ancien dispositif et la pose du neuf s'enchainent vite pour reduire au minimum la fermeture de votre boutique.",
    "La pose d'un rideau neuf demarre par un releve precis de la baie : largeur, hauteur, retombee de linteau et place disponible pour le coffre au-dessus de la vitrine de {commerce1}. On determine ensuite le diametre de l'axe et du tube d'enroulement selon le poids du futur tablier, puis on fixe les coulisses d'aplomb le long de {street1}. Le moteur tubulaire est insere dans l'arbre, raccorde au boitier de commande et teste avant montage complet. Apres reglage des fins de course, de la lame d'arret et de la serrure, on procede a la mise en service et a la prise en main par le commercant.",
    "Installer une fermeture metallique pres de {landmark1} commence par le scellement du caisson et des supports d'axe, mis a niveau au laser pour garantir un enroulement parfait. Les glissieres laterales sont chevillees a l'aplomb, puis le tablier monte lame par lame en engageant chaque galet dans son guidage. Le technicien choisit le type de lame selon l'usage, raccorde le moteur central et installe le verrou de parking pres de {street2}. Le cablage electrique rejoint un boitier protege, la detection d'obstacle est activee et les fins de course memorisees. Un cycle complet de validation precede la remise des telecommandes et les consignes d'entretien.",
    "Pour equiper une devanture de {quartier1}, on debute par une etude du support : nature du mur, presence de poutre et hauteur sous plafond pour loger le coffre. L'axe est dimensionne en fonction de la surface du tablier, les paliers fixes et les coulisses alignees a la verticale pres de {commerce2}. Une fois le moteur tubulaire insere et le condensateur raccorde, les lames sont enfilees et la lame finale equipee de sa butee basse. On programme les fins de course, on teste la serrure et le verrou de parking, puis on realise plusieurs montees et descentes avant la prise en main complete.",
    "La mise en place d'un rideau neuf devant {landmark2} s'ouvre sur un metre laser pour valider l'aplomb des futures glissieres et le calage du caisson. On choisit la lame adaptee, pleine pour l'isolation ou micro-perforee pour la visibilite, avant de monter l'arbre et son moteur central. Les coulisses sont vissees et reglees au fil a plomb le long de {street3}, puis le tablier descend progressivement dans son guidage. Le raccordement electrique passe par un boitier de commande secure, la detection d'obstacle est verifiee et les butees ajustees. La reception se conclut par une demonstration et la remise des notices au client.",
    "Equiper le local d'un commercant de {quartier2} demande d'abord de verifier la solidite du linteau qui supportera le coffre et l'axe charge du tablier. Le technicien fixe les supports, insere le tube d'enroulement motorise et cheville les coulisses parfaitement verticales pres de {street1}. Les lames sont engagees une a une, la lame d'arret posee au sol et la serrure trois points installee. Le cablage rejoint le boitier de commande, le condensateur est branche et les fins de course calees haute et basse. Apres une serie d'essais et un controle du verrou de parking, on forme l'utilisateur a la manivelle de secours.",
    "La pose neuve pres de {commerce1} commence par la depose eventuelle de l'ancien dispositif puis le reperage des points de fixation du caisson au-dessus de la baie. On monte l'arbre equipe de son moteur tubulaire, on regle les paliers et on aligne les glissieres au laser le long de {landmark3}. Chaque lame s'enfile dans le guidage, les galets sont graisses et la lame finale dotee de sa butee. Le branchement electrique se fait sur un boitier protege, la detection d'obstacle activee et les fins de course memorisees. Un cycle test complet et la remise des telecommandes closent l'installation.",
    "Monter une fermeture neuve devant une boutique de {quartier1} debute par le tracage des axes de coulisses et le controle de l'equerrage de la baie. Le coffre est fixe sur le linteau, l'arbre insere avec son moteur central et le condensateur raccorde au boitier de commande pres de {street2}. Les lames sont assemblees, le tablier descendu dans ses glissieres et la lame d'arret reglee au sol. On installe le verrou de parking, on memorise les fins de course et on verifie la cremone. La mise en service inclut plusieurs cycles, un test de la sangle de secours et la formation du gerant.",
    "Pour installer un rideau pres de {landmark4}, le technicien releve d'abord les cotes exactes et choisit l'enroulement adapte a la retombee disponible. Les supports d'axe sont scelles, le tube d'enroulement motorise positionne et les coulisses chevillees d'aplomb le long de {street3}. Le tablier monte lame apres lame, chaque galet engage dans son guidage et la lame finale equipee de patins neufs. Apres raccordement electrique sur boitier secure et activation de la detection d'obstacle, les butees sont calees. Plusieurs cycles de validation, un essai de la manivelle de secours et la remise des notices finalisent la pose.",
    "L'installation devant le commerce de {commerce2} s'ouvre par une etude technique : poids du tablier, type de motorisation et emplacement du boitier de commande. On fixe le caisson, on insere le moteur tubulaire dans l'arbre et on aligne les glissieres a la verticale pres de {street1}. Les lames sont enfilees, la serrure et le verrou de parking poses, puis le cablage tire jusqu'au tableau electrique. Les fins de course haute et basse sont memorisees, la detection d'obstacle testee et le condensateur verifie. Un enchainement de montees et descentes precede la prise en main et les conseils d'entretien au client.",
    "Poser un rideau neuf pres de {landmark1} commence par la verification du support et le calage parfait du coffre au-dessus de la vitrine. Le technicien dimensionne l'axe selon la surface, fixe les paliers et visse les coulisses au fil a plomb le long de {quartier2}. Le moteur central est insere, raccorde au boitier de commande et le tablier descendu lame par lame dans son guidage. On choisit une lame microperforee ou pleine selon le besoin de visibilite, on regle la lame d'arret et les fins de course. La reception comprend un test complet, la detection d'obstacle et la remise des telecommandes.",
    "La mise en oeuvre d'une fermeture pres de {street2} demarre par un metre minutieux de la baie et le choix du diametre d'arbre selon le poids estime du tablier. Les supports sont scelles, le tube d'enroulement motorise installe et les glissieres chevillees parfaitement verticales pres de {commerce1}. Chaque lame s'engage dans son guidage, les galets sont graisses et la lame finale equipee de sa butee basse. Le raccordement electrique aboutit a un boitier protege, la detection d'obstacle activee et les fins de course calees. Un controle des cycles et une formation a la manivelle de secours cloturent le chantier.",
    "Equiper la devanture d'un commercant de {quartier1} debute par l'analyse du linteau, du retombee et de l'espace pour loger le caisson et l'axe. On fixe les supports d'axe, on insere le moteur tubulaire avec son condensateur et on aligne les coulisses au laser pres de {street3}. Les lames sont montees une a une, la serrure trois points posee et le verrou de parking installe au sol. Le cablage rejoint le boitier de commande, les fins de course sont memorisees et la detection d'obstacle verifiee. La reception se termine par plusieurs cycles d'essai, un test de la sangle de secours et la remise des notices.",
    "La pose demarre par un releve precis de la baie du {street1} : largeur d'ouverture, hauteur de linteau et place disponible pour le coffre. On fixe ensuite les coulisses d'aplomb, on monte l'axe et l'on enroule le tablier avant d'ajuster les fins de course pour une course propre devant {commerce1}.",
    "Pour un nouveau rideau pres de {landmark1}, nous scellons d'abord les pattes de support, puis installons le caisson qui abritera l'enroulement. Les lames sont assemblees sur l'axe, la serrure centrale posee, et un essai a vide valide le guidage avant le raccordement electrique definitif.",
    "Sur {street2}, l'installation commence par le coffre fixe en applique au-dessus de la baie. On glisse le tablier dans ses coulisses, on cale le treuil et la manivelle de secours, puis on programme le moteur tubulaire pour que l'ouverture s'arrete pile au bon niveau pour la boutique.",
    "Un commerce du {quartier1} recoit son rideau apres un montage des coulisses parfaitement verticales. Nous posons l'axe sur ses paliers, enroulons les lames, branchons le condensateur et la commande murale, puis reglons les fins de course haute et basse pour une manoeuvre silencieuse.",
    "Pres de {landmark2}, la mise en place du caisson precede l'insertion de l'enroulement. On verrouille la serrure a cle, on teste la sangle de secours, puis on cable l'alimentation et l'inverseur avant une serie d'essais qui valide la descente et la remontee de la devanture.",
    "L'installation devant {commerce2} passe par un alignement minutieux des deux coulisses, gage d'un tablier qui ne frotte pas. Apres montage de l'axe et des patins, nous raccordons le moteur, posons les butees de fin de course et confions au commercant une fermeture immediate et fluide.",
    "Pour equiper la vitrine du {street3}, nous ancrons le coffre, montons les ressorts de compensation et engageons les lames dans le guidage. Le verrou bas et la cremone laterale assurent la securite, et la mise en service controle l'arret automatique en position haute comme en position basse.",
    "Un local du {quartier2} est equipe en partant du linteau : pose des supports d'axe, enroulement du tablier puis reglage des galets dans les coulisses. Le branchement electrique se termine par le test du bouton montee descente et la verification de la manivelle de depannage.",
    "Sur {street1}, la pose du rideau s'acheve par le raccordement du moteur et le calibrage des fins de course. Auparavant, nous avons fixe le caisson, glisse le tablier, monte la serrure et verifie que l'ensemble coulisse sans accroc avant de remettre les cles a la boutique pres de {landmark3}.",
    "L'equipement d'une devanture proche de {landmark4} debute par le scellement des coulisses et l'installation de l'axe enrouleur. Les lames montees, on cable la commande, on regle le condensateur et l'on procede a une dizaine de cycles d'essai pour garantir une manoeuvre reguliere au commercant.",
  ],
  reparation: [
    "Une reparation de rideau metallique a {zone} demarre par un diagnostic complet. Nous remplacons les lames, le moteur, l'axe ou la serrure concernes, puis reglons le tablier pour une fermeture qui glisse sans bruit.",
    "Apres avoir identifie l'usure de votre rideau metallique a {zone}, nous reprenons les coulisses, changeons les pieces fatiguees et controlons les securites avant de vous restituer une fermeture fiable et garantie.",
    "Plutot que d'imposer un remplacement complet a {zone}, nous evaluons ce qui peut etre repare. Cette approche limite le cout tout en redonnant a votre rideau metallique une fiabilite durable.",
    "Une remise en etat de rideau metallique a {zone} se termine toujours par un test complet : ouverture, fermeture, fins de course et securites. Vous repartez avec une fermeture controlee et garantie.",
    "Sur une reparation de rideau metallique a {zone}, nous commencons par demonter le caisson pour inspecter axe, roulement et attaches de lames. Ce controle visuel evite de traiter le symptome sans regler la cause reelle de la panne.",
    "Quand plusieurs lames sont enfoncees a {zone}, nous evaluons s'il faut les redresser ou les remplacer a l'unite. Cette reparation ciblee preserve le reste du tablier et limite le cout pour votre commerce.",
    "Une fermeture qui grince ou claque a {zone} signale souvent un defaut d'alignement. Nous reprenons coulisses, patins et guidage, lubrifions les points de friction et restituons un rideau silencieux et fluide.",
    "Apres chaque reparation a {zone}, nous reglons la tension des ressorts et l'arret bas pour que le rideau repose pile sur le sol. Un tablier bien cale dure plus longtemps et protege mieux votre devanture.",
  ],
  motorisation: [
    "Une motorisation de rideau metallique a {zone} commence par le choix du moteur selon le poids du tablier. Nous deposons le systeme manuel, montons le moteur, raccordons et reglons les fins de course au millimetre.",
    "Pour automatiser votre rideau metallique a {zone}, nous installons moteur tubulaire ou central, telecommande et dispositifs de securite, puis testons l'ensemble et expliquons le fonctionnement avant de partir.",
    "Avant de motoriser un rideau metallique a {zone}, nous verifions l'etat du tablier et de l'axe. Une motorisation posee sur une fermeture saine garantit un fonctionnement souple et durable.",
    "Le confort d'une motorisation a {zone} se mesure au quotidien : plus de manivelle, une ouverture en quelques secondes et des securites qui protegent biens et personnes. Nous reglons tout avant la mise en service.",
    "Une motorisation a {zone} commence par le calcul du couple selon le poids du tablier. Nous deposons le treuil manuel, montons le moteur tubulaire ou central sur l'axe, puis raccordons le boitier de commande aux normes electriques.",
    "Le reglage des fins de course est le coeur d'une motorisation reussie a {zone}. Nous ajustons l'arret haut et l'arret bas au millimetre pour que le tablier repose pile au sol, sans forcer ni laisser de jour sous la lame finale.",
    "Apres le montage du moteur a {zone}, nous integrons telecommande, contacteur a cle ou horloge selon votre usage. La detection d'obstacle et l'arret automatique sont testes plusieurs fois avant la remise des commandes.",
    "Pour automatiser durablement un rideau a {zone}, nous controlons d'abord l'etat de l'axe et des coulisses. Une motorisation posee sur un tablier sain fonctionne souplement, sans surcharger le moteur ni provoquer de blocage premature.",
  ],
  deblocage: [
    "Un deblocage de rideau metallique a {zone} se fait en urgence : nous liberons le tablier coince a la main ou au moteur, sans abimer la devanture, puis verifions l'axe et les coulisses pour eviter une rechute. Avant de quitter le commerce, nous verifions une derniere fois l aplomb des coulisses, le serrage du tube d enroulement et le bon coulissement des galets, puis nous reprogrammons les fins de course pour une remontee reguliere et sans point dur. La rapidite de mise en securite a permis de limiter l interruption a quelques minutes seulement.",
    "Face a un rideau metallique coince a {zone}, nous identifions la cause (lame sortie du rail, serrure grippee, moteur immobilise) et remettons votre fermeture en mouvement, avant de la securiser pour la nuit. Nos techniciens en profitent pour controler l etat des ressorts de compensation, lubrifier les patins et tester la detection d obstacle, de sorte que la fermeture retrouve une manoeuvre souple et que l incident ne se reproduise pas a court terme. Un releve photographique de l etat initial accompagne notre compte rendu pour une totale transparence.",
    "Un rideau bloque a {zone} ne doit jamais etre force au risque de l'endommager. Nous intervenons avec le bon outillage pour liberer le tablier en preservant la devanture et le mecanisme. Le tablier libere, nous inspectons la serrure, le barillet et le verrou de parking, nettoyons les rails encrasses et calons les butees haute et basse, avant un essai complet qui confirme une descente fluide et silencieuse de la fermeture. Nous adaptons systematiquement notre outillage au modele de fermeture rencontre sur le terrain.",
    "Apres un deblocage a {zone}, nous ne nous contentons pas de remettre le rideau en mouvement : nous controlons l'origine du blocage pour vous eviter une nouvelle immobilisation a court terme. Une fois la course retablie, nous graissons l arbre sur ses paliers, realignons les lames sorties du guidage et resserrons les fixations, puis nous expliquons au commercant l origine du blocage et les gestes simples pour l eviter a l avenir. La tracabilite des pieces posees est consignee pour faciliter tout suivi ulterieur de la fermeture.",
    "Un deblocage a {zone} debute par l'inspection visuelle du tablier et des coulisses pour reperer la lame sortie ou le point dur. Nous detendons ensuite le rideau a la main, sans forcer le mecanisme, pour le degager sans casse. Avant de quitter le commerce, nous verifions une derniere fois l aplomb des coulisses, le serrage du tube d enroulement et le bon coulissement des galets, puis nous reprogrammons les fins de course pour une remontee reguliere et sans point dur.",
    "Quand le moteur est grippe a {zone}, nous passons en manoeuvre manuelle de secours pour liberer le tablier. La fermeture rouverte, nous diagnostiquons le moteur ou le condensateur avant de la remettre en service. Nos techniciens en profitent pour controler l etat des ressorts de compensation, lubrifier les patins et tester la detection d obstacle, de sorte que la fermeture retrouve une manoeuvre souple et que l incident ne se reproduise pas a court terme. Notre connaissance fine des contraintes de circulation du secteur reduit nettement le temps de trajet.",
    "Face a une serrure ou un axe bloque a {zone}, nous travaillons au bon outillage pour ne rien deformer. Le tablier libere, nous lubrifions les points de friction et verifions le guidage afin d'eviter une rechute rapide. Le tablier libere, nous inspectons la serrure, le barillet et le verrou de parking, nettoyons les rails encrasses et calons les butees haute et basse, avant un essai complet qui confirme une descente fluide et silencieuse de la fermeture. Chaque manipulation respecte les preconisations du fabricant pour preserver la garantie d origine.",
    "Apres un blocage suite a effraction a {zone}, le deblocage va de pair avec la securisation. Nous degageons la fermeture, remettons l'ouverture hors d'atteinte sur-le-champ, puis planifions la reparation des elements faussees. Une fois la course retablie, nous graissons l arbre sur ses paliers, realignons les lames sorties du guidage et resserrons les fixations, puis nous expliquons au commercant l origine du blocage et les gestes simples pour l eviter a l avenir. Un controle de l equilibrage global precede toujours la remise des cles au responsable du commerce.",
    "Un deblocage a {zone} commence par reperer si le blocage est mecanique ou electrique. Tablier sorti du rail, verrou grippe ou moteur muet : ce tri oriente le geste juste et evite de forcer une fermeture deja fragilisee. Avant de quitter le commerce, nous verifions une derniere fois l aplomb des coulisses, le serrage du tube d enroulement et le bon coulissement des galets, puis nous reprogrammons les fins de course pour une remontee reguliere et sans point dur. La proprete du poste de travail apres intervention fait partie integrante de notre engagement qualite.",
    "Quand un corps etranger coince la coulisse a {zone}, nous le retirons avant toute manoeuvre. Forcer le tablier abimerait le profil ; nous degageons l'obstacle, controlons le rail puis verifions la descente sur toute la hauteur. Nos techniciens en profitent pour controler l etat des ressorts de compensation, lubrifier les patins et tester la detection d obstacle, de sorte que la fermeture retrouve une manoeuvre souple et que l incident ne se reproduise pas a court terme. Nous proposons, sans obligation, un calendrier d entretien adapte a la frequence d usage constatee.",
    "Sur une grille extensible bloquee a {zone}, nous travaillons d'abord le verrou de parking et la cremone. Une fois la course rendue, nous lubrifions les ciseaux et le rail au sol pour que la fermeture se replie de nouveau sans point dur. Le tablier libere, nous inspectons la serrure, le barillet et le verrou de parking, nettoyons les rails encrasses et calons les butees haute et basse, avant un essai complet qui confirme une descente fluide et silencieuse de la fermeture.",
    "Un moteur grippe immobilise le rideau a {zone} : la manoeuvre de secours a la manivelle ou a la sangle permet de rouvrir tout de suite. Nous diagnostiquons ensuite le moteur a froid avant de proposer la reparation adaptee. Une fois la course retablie, nous graissons l arbre sur ses paliers, realignons les lames sorties du guidage et resserrons les fixations, puis nous expliquons au commercant l origine du blocage et les gestes simples pour l eviter a l avenir.",
    "Le temps de reponse fait tout sur un deblocage a {zone} : un commerce qui ne peut ni ouvrir ni fermer perd du chiffre a chaque minute. Notre standard priorise ces appels et envoie l'equipe la plus proche sans vous faire patienter. Avant de quitter le commerce, nous verifions une derniere fois l aplomb des coulisses, le serrage du tube d enroulement et le bon coulissement des galets, puis nous reprogrammons les fins de course pour une remontee reguliere et sans point dur.",
    "Un blocage en position haute laisse votre local ouvert et vulnerable a {zone}. Nous intervenons en priorite pour rendre la descente possible, puis securisons l'ouverture afin que vous puissiez quitter les lieux l'esprit tranquille. Nos techniciens en profitent pour controler l etat des ressorts de compensation, lubrifier les patins et tester la detection d obstacle, de sorte que la fermeture retrouve une manoeuvre souple et que l incident ne se reproduise pas a court terme. Le compte rendu remis precise les points de vigilance a surveiller lors des prochaines semaines.",
    "Sur place a {zone}, nous evaluons d'abord si le deblocage suffit ou si une piece est a changer. Quand le degagement seul resout le probleme, nous evitons toute reparation inutile et vous le disons franchement. Le tablier libere, nous inspectons la serrure, le barillet et le verrou de parking, nettoyons les rails encrasses et calons les butees haute et basse, avant un essai complet qui confirme une descente fluide et silencieuse de la fermeture. Une astuce de manoeuvre de secours est montree au gerant pour faire face a une coupure imprevue.",
    "Un tablier coince en biais a {zone} se redresse a la sangle et au levier, jamais en force. Cette methode preserve les lames et le profil des coulisses, et evite de transformer un simple blocage en reparation lourde. Une fois la course retablie, nous graissons l arbre sur ses paliers, realignons les lames sorties du guidage et resserrons les fixations, puis nous expliquons au commercant l origine du blocage et les gestes simples pour l eviter a l avenir. La verification de l alimentation et du tableau electrique complete notre diagnostic mecanique.",
    "Apres avoir libere le rideau a {zone}, nous testons plusieurs cycles d'ouverture et de fermeture devant vous. Ce controle confirme que le blocage ne se reproduira pas des votre prochaine manoeuvre. Avant de quitter le commerce, nous verifions une derniere fois l aplomb des coulisses, le serrage du tube d enroulement et le bon coulissement des galets, puis nous reprogrammons les fins de course pour une remontee reguliere et sans point dur. Nous testons la portee de la commande a distance afin d ecarter tout aleas de pilotage residuel.",
    "Une cle restee cassee dans la serrure bloque la fermeture a {zone}. Nous extrayons le fragment avec l'outil adapte, deverrouillons sans casser le barillet et controlons le mecanisme avant de vous rendre l'usage du rideau. Nos techniciens en profitent pour controler l etat des ressorts de compensation, lubrifier les patins et tester la detection d obstacle, de sorte que la fermeture retrouve une manoeuvre souple et que l incident ne se reproduise pas a court terme. Un nettoyage des contacts et des connecteurs ameliore durablement la fiabilite de la motorisation.",
    "Quand le tablier reste coince a mi-hauteur pres de {landmark1}, nous arrivons en urgence pour liberer la devanture sans forcer. On degage d'abord les lames sorties des coulisses, puis on verifie le treuil avant de tester une remontee complete. Le commerce du {street1} retrouve son rideau operationnel dans la foulee. Le tablier libere, nous inspectons la serrure, le barillet et le verrou de parking, nettoyons les rails encrasses et calons les butees haute et basse, avant un essai complet qui confirme une descente fluide et silencieuse de la fermeture.",
    "Un blocage en position basse fige souvent une boutique du {quartier1} en pleine journee. Notre technicien inspecte la serrure et les fins de course, libere l'enroulement grippe a la main si besoin, puis controle l'axe pour eviter une nouvelle immobilisation devant {commerce1}. Une fois la course retablie, nous graissons l arbre sur ses paliers, realignons les lames sorties du guidage et resserrons les fixations, puis nous expliquons au commercant l origine du blocage et les gestes simples pour l eviter a l avenir.",
    "Sur {street2}, un rideau bloque net peut venir d'une lame voilee coincee dans le guidage. Nous ouvrons le coffre, redressons l'element fautif et lubrifions les galets pour fluidifier la course. La devanture est securisee et de nouveau manoeuvrable avant la reouverture pres de {landmark2}. Le technicien verifie aussi la tension des ressorts de compensation, l'alignement du tube d'enroulement sur ses supports et le bon coulissement des patins dans les coulisses du quartier {quartier1}. La serrure, le barillet et le verrou de parking sont testes un a un, puis l'ensemble du guidage est graisse et les butees reprogrammees pour ecarter durablement tout nouveau point dur sur la fermeture. Disponibles week-ends et jours feries inclus, nos depanneurs interviennent vite afin que votre activite reprenne sans perdre une heure de chiffre. Transparence du tarif, ponctualite et finitions propres resument notre methode, appreciee des boutiques, restaurants et enseignes du voisinage qui nous recommandent regulierement a leurs voisins.",
    "Lorsqu'une coupure laisse le tablier mi-clos a deux pas de {landmark3}, on bascule sur le deblocage manuel via la manivelle ou la sangle de secours. Le but reste de remettre le magasin a l'abri vite, puis de localiser la panne moteur ou condensateur a tete reposee dans le {quartier2}. Nos techniciens controlent ensuite l'arbre, les paliers et l'etat des galets dans les glissieres, repositionnent les lames sorties du guidage et resserrent les fixations des coulisses pres de {street3}. Avant de partir, on graisse les patins, on reprogramme les fins de course haute et basse et on enchaine plusieurs cycles complets pour confirmer une remontee reguliere et silencieuse de la fermeture du commerce. Notre equipe joignable en continu connait parfaitement les acces, le stationnement et les horaires de livraison du secteur, ce qui raccourcit fortement le delai d arrivee. Chaque devis est annonce clairement avant toute manipulation, sans frais surprise, et la prestation reste garantie : voila pourquoi tant de commercants nous renouvellent leur confiance saison apres saison.",
    "Un barillet force par une tentative d'effraction laisse parfois le rideau a demi-leve sur {street3}. Nous degageons le verrou endommage, reglons les patins dans les coulisses et redonnons une fermeture nette pour proteger le local jusqu'au remplacement complet de la serrure. Avant de quitter le commerce, nous verifions une derniere fois l aplomb des coulisses, le serrage du tube d enroulement et le bon coulissement des galets, puis nous reprogrammons les fins de course pour une remontee reguliere et sans point dur.",
    "Pres de {commerce2}, un tablier desaxe sort de son guidage et stoppe toute manoeuvre. On replace les lames une a une, on controle la tension des ressorts puis l'alignement de l'axe afin que la descente reprenne sans a-coups et que la vitrine reste close la nuit. Nos techniciens en profitent pour controler l etat des ressorts de compensation, lubrifier les patins et tester la detection d obstacle, de sorte que la fermeture retrouve une manoeuvre souple et que l incident ne se reproduise pas a court terme.",
    "Quand le moteur force et que le rideau cale, l'enjeu prioritaire reste de ne pas abimer davantage l'enroulement du commercant de {zone}. Nous coupons l'alimentation, debloquons mecaniquement le treuil, puis testons les fins de course avant de relancer une course complete en douceur. Le tablier libere, nous inspectons la serrure, le barillet et le verrou de parking, nettoyons les rails encrasses et calons les butees haute et basse, avant un essai complet qui confirme une descente fluide et silencieuse de la fermeture.",
    "Une cremone grippee peut figer la fermeture d'une boutique proche de {landmark4}. Notre intervention degage le mecanisme, nettoie le rail et reaxe le tablier pour qu'il glisse a nouveau franchement dans ses coulisses, sans laisser la devanture exposee plus longtemps que necessaire. Une fois la course retablie, nous graissons l arbre sur ses paliers, realignons les lames sorties du guidage et resserrons les fixations, puis nous expliquons au commercant l origine du blocage et les gestes simples pour l eviter a l avenir.",
    "Un rideau immobilise paralyse une vitrine et fait fuir la clientele : notre priorite est de retablir vite l'ouverture du commerce. Le diagnostic distingue d'emblee une cause mecanique, lame desengagee ou patin brise, d'une cause electrique, condensateur ou carte de commande. Nous liberons le tablier a la sangle sans rayer les profils, remettons les galets dans leur guidage et controlons l'aplomb des coulisses. Apres graissage de l'arbre et reprogrammation des butees, plusieurs cycles valident une manoeuvre fluide, et le commercant repart avec une explication claire de l'incident.",
    "Quand une fermeture refuse toute manoeuvre, forcer ne ferait qu'aggraver les degats et alourdir la facture. Nos depanneurs procedent par etapes : observation du point de blocage, mise en securite du tablier, puis liberation progressive a la manivelle de secours. Ils inspectent ensuite la serrure, le barillet et le verrou de parking, nettoient les rails encrasses et reglent les fins de course. Un dernier essai complet, monte puis descente, confirme la disparition du point dur et previent toute rechute a court terme.",
    "Une intervention de deblocage reussie se juge a sa duree : plus le commerce reste ferme, plus la perte est lourde. C'est pourquoi nous arrivons equipes, identifions sans tatonner si le defaut vient de l'axe, des coulisses, de la serrure ou de l'electronique, et remettons la fermeture en mouvement au plus vite. Le tablier libere, nous verifions chaque organe sollicite, lubrifions le guidage et calons les butees pour que la prochaine ouverture se fasse sans accroc. La planeite du seuil est controlee pour garantir un appui parfait de la lame basse au sol.",
    "Sur {street1}, un condensateur fatigue laisse le rideau a l'arret en pleine remontee. On securise d'abord le commerce avec le deblocage manuel, on isole l'element defaillant, puis on retablit une manoeuvre fiable pour que l'ouverture du lendemain se fasse sans incident dans le {quartier1}. Avant de quitter le commerce, nous verifions une derniere fois l aplomb des coulisses, le serrage du tube d enroulement et le bon coulissement des galets, puis nous reprogrammons les fins de course pour une remontee reguliere et sans point dur.",
    "Lorsqu'un galet sorti de son axe coince le tablier dans le caisson, le rideau du {street2} ne bouge plus. Nous deposons l'habillage, repositionnons le galet et controlons l'enroulement complet afin de rendre une fermeture franche et une remontee reguliere a la devanture. Nos techniciens en profitent pour controler l etat des ressorts de compensation, lubrifier les patins et tester la detection d obstacle, de sorte que la fermeture retrouve une manoeuvre souple et que l incident ne se reproduise pas a court terme.",
    "L'intervention de deblocage demarre par un diagnostic precis : on observe si le tablier reste coince en haut, a mi-course ou contre la lame d'arret au sol. Nos techniciens inspectent d'abord les coulisses et les patins, souvent encrasses ou voiles a cause d'un choc, avant de tester la serrure et le verrou de parking pres de {street1}. Le deblocage manuel s'effectue sans forcer, en liberant la sangle de secours puis en accompagnant la lame finale a la main pour eviter toute deformation. Une fois la devanture rouverte du cote de {landmark1}, on graisse l'axe et on regle les fins de course pour ecarter toute recidive.",
    "Quand un rideau se bloque devant un commerce de {quartier1}, on commence par couper l'alimentation du boitier de commande et tester le condensateur, fautif recurrent d'un moteur tubulaire qui ronronne sans entrainer le tube d'enroulement. On verifie ensuite que l'arbre n'a pas glisse de ses paliers et que les galets coulissent librement dans les glissieres. Le tablier est remonte progressivement a la manivelle, lame par lame, en surveillant l'alignement sur les butees laterales pres de {street2}. Apres securisation provisoire de la vitrine, un controle complet du guidage et un essai motorise garantissent une remise en service durable face a {landmark2}.",
    "Face a un rideau immobilise pres de {commerce1}, le technicien identifie d'abord la cause : lame voilee, roulement grippe ou fin de course dereglee. Il deconnecte la telecommande, bascule en commande manuelle et libere le treuil de secours pour relacher la tension de l'axe sans a-coup. Chaque lame est ensuite reengagee dans les coulisses, les patins repositionnes et la lame d'arret degagee de son logement au sol. Apres remise en place de la cremone et du barillet pres de {street3}, on lubrifie l'ensemble du guidage et on reprogramme les butees haute et basse pour un fonctionnement fluide et silencieux.",
    "Un rideau bloque a mi-hauteur devant {landmark3} signale souvent un desengagement d'une lame hors de sa glissiere ou un patin casse. L'equipe stabilise d'abord le tablier avec des cales pour eviter une chute brutale, puis examine l'arbre, le tube d'enroulement et les ressorts de compensation. La liberation se fait par la manivelle de secours, en remontant la fermeture cran par cran jusqu'a degager la zone voilee. On replace ensuite la lame fautive, on remplace le patin defaillant et on resserre les fixations des coulisses pres de {quartier2}. Un graissage cible et un test moteur cloturent une intervention propre et sans casse.",
    "Lorsqu'une serrure se grippe et fige le rideau au sol pres de {street1}, le depannage debute par l'examen du barillet, du verrou de parking et de la cremone centrale. Le technicien degage les goupilles encrassees, debloque le pene et libere la lame d'arret restee coincee dans son rail. Le tablier remonte ensuite a la main, lame apres lame, en controlant que les galets ne sautent pas hors des guidages. Avant de quitter le commerce voisin de {landmark1}, on huile le mecanisme, on verifie la detection d'obstacle et on conseille un entretien periodique pour eviter un nouveau blocage.",
    "Devant une boutique de {quartier1}, un rideau qui refuse de bouger trahit frequemment un moteur central en surchauffe ou un condensateur mort. On coupe le courant, on teste la continuite du moteur tubulaire et on controle la liaison vers le boitier de commande. Le deblocage manuel libere la sangle de secours et accompagne le tablier jusqu'a degager la coulisse encombree pres de {commerce2}. Chaque patin et chaque galet sont inspectes, les fins de course reajustees et l'axe regraisse. Une fois la vitrine securisee face a {landmark2}, un essai complet confirme une montee et une descente sans point dur.",
    "Un tablier coince contre la butee haute pres de {street2} resulte souvent d'une fin de course dereglee ou d'une lame finale gondolee. Le technicien isole le boitier, passe en pilotage manuel et actionne le treuil pour relacher la tension de l'arbre en douceur. Il redresse ou remplace la lame deformee, repositionne les galets dans les glissieres et nettoie les patins encrasses. La cremone et le verrou de parking sont ensuite testes avant de resserrer les coulisses pres de {landmark3}. On reprogramme enfin les butees et on lubrifie le guidage pour rendre la devanture pleinement operationnelle.",
    "Quand un rideau s'immobilise net devant {commerce1}, le diagnostic vise d'abord le tube d'enroulement et les ressorts de compensation, parfois detendus apres des annees de cycles. L'equipe cale le tablier, libere la manivelle de secours et fait descendre la fermeture cran par cran sans brusquer le mecanisme. Les coulisses sont nettoyees, les patins remplaces et la lame d'arret degagee de son logement au sol pres de {quartier2}. Apres reglage des fins de course et controle de la detection d'obstacle, on graisse l'axe et on valide plusieurs cycles complets avant de rendre la vitrine au commercant.",
    "Pres de {landmark4}, un rideau bloque en pleine descente evoque un galet sorti de sa glissiere ou un roulement grippe sur l'axe. On stabilise aussitot le tablier, on neutralise la telecommande et on bascule sur la commande manuelle pour relacher la tension. Chaque lame est realignee, le roulement defaillant degraisse ou remplace et les patins remis dans leur logement le long de {street3}. La serrure, le barillet et le verrou de parking sont ensuite verifies un a un. Un graissage soigne du guidage et un test motorise complet garantissent une remise en service sans nouveau point de blocage.",
    "Un blocage en bas de course pres de {street1} provient souvent d'une lame d'arret coincee ou d'un seuil deforme empechant le tablier de remonter. Le technicien libere d'abord le pene et la cremone, puis degage la lame finale a la main sans rayer les coulisses. Il controle l'alignement de l'axe, le serrage du tube d'enroulement et l'etat des galets le long du guidage. Apres remise en place propre devant {commerce2}, les fins de course sont reajustees et l'ensemble lubrifie. Un dernier cycle complet, monte puis descente, confirme la disparition du point dur signale par le commercant.",
    "Devant une devanture de {quartier1}, un rideau qui claque et se fige indique parfois un patin brise ou une coulisse desaxee apres un choc de vehicule. On commence par caler le tablier, couper le boitier de commande et liberer la sangle de secours pour relacher la tension de l'arbre. Les lames sont reengagees une a une, le patin casse remplace et les glissieres redressees pres de {landmark1}. Le verrou de parking, le barillet et la detection d'obstacle font ensuite l'objet d'un controle minutieux. Un graissage cible et plusieurs essais motorises cloturent un deblocage durable et sans deformation.",
    "Lorsqu'un rideau se bloque pendant la fermeture pres de {commerce1}, l'origine se trouve souvent dans un moteur tubulaire desynchronise ou des fins de course memorisees a tort. Le technicien coupe l'alimentation, teste le condensateur et libere le treuil de secours pour accompagner le tablier a la main. Il verifie le coulissement des galets, nettoie les patins et redresse la lame finale gondolee le long de {street2}. La serrure et la cremone sont ensuite reglees, puis les butees haute et basse reprogrammees. Apres securisation de la vitrine face a {landmark2}, un essai complet valide une descente reguliere et silencieuse.",
  ],
  entretien: [
    "Un entretien de rideau metallique a {zone} suit une check-list precise : graissage des coulisses, controle du moteur, verification des fins de course et test des securites, avec un rapport d'intervention remis a chaque visite.",
    "Notre contrat d'entretien pour rideau metallique a {zone} planifie des visites preventives. Nous inspectons le tablier, reglons l'axe, nettoyons les rails et anticipons les pieces a remplacer pour eviter les pannes.",
    "Entretenir regulierement un rideau metallique a {zone} revient bien moins cher qu'un depannage en urgence. Nos visites preventives detectent l'usure avant qu'elle n'immobilise votre commerce.",
    "Un rideau metallique bien entretenu a {zone} dure plus longtemps et reste silencieux. Nous adaptons la frequence des visites a l'intensite d'usage de votre fermeture et a son environnement.",
    "Une visite d'entretien a {zone} commence par le graissage des coulisses et de l'axe, puis le nettoyage des rails. Ces gestes simples suppriment les points durs et gardent le tablier silencieux a la montee comme a la descente.",
    "Lors de la maintenance d'un rideau a {zone}, nous controlons la tension des ressorts de compensation et reequilibrons le tablier. Un bon equilibrage soulage le moteur et evite l'usure prematuree des fins de course.",
    "Le test des securites est un temps fort de l'entretien a {zone} : detection d'obstacle, arret automatique et serrure sont verifies un a un. Toute piece fatiguee est signalee dans le rapport remis a la fin de la visite.",
    "Un contrat d'entretien a {zone} planifie des passages reguliers selon l'usage de votre fermeture. Nous anticipons les pieces a remplacer pour vous eviter une panne en pleine activite, et adaptons le rythme a votre commerce.",
    "Un entretien a {zone} commence par une manoeuvre complete pour reperer points durs et bruits suspects. Nous traitons ensuite ce que l'oreille et le toucher revelent : coulisse seche, lame qui frotte ou roulement qui force.",
    "Le graissage seul ne suffit pas a {zone} : nous nettoyons d'abord les rails des depots de poussiere avant de lubrifier. Un rail propre puis huile glisse bien mieux qu'une coulisse encrassee noyee sous la graisse.",
    "Sur les fermetures motorisees a {zone}, l'entretien verifie aussi l'electronique : serrage des bornes, etat du condensateur et reaction de la detection d'obstacle. Ces controles evitent les pannes brutales en plein service.",
    "Chaque visite d'entretien a {zone} se conclut par un rapport listant l'etat des pieces et les points a surveiller. Ce suivi ecrit vous permet d'anticiper un remplacement plutot que de subir une immobilisation en urgence.",
    "Le cout d'un entretien a {zone} reste sans commune mesure avec celui d'un depannage en urgence un jour de fermeture. Quelques visites planifiees par an suffisent a tenir votre rideau a l'ecart des pannes immobilisantes.",
    "Nous adaptons la frequence des passages a {zone} selon que votre rideau est manoeuvre deux fois ou vingt fois par jour. Un usage intensif demande un suivi plus rapproche, qu'un commerce a faible rotation peut espacer.",
    "Un entretien a {zone} verifie aussi l'environnement de la fermeture : poussiere, sel de deneigement ou embruns accelerent l'usure. Nous en tenons compte pour choisir le lubrifiant et le rythme des interventions.",
    "Au fil des visites a {zone}, nous constituons un historique de votre fermeture : pieces changees, reglages effectues, points faibles. Ce dossier oriente les decisions et evite de refaire deux fois le meme diagnostic.",
    "L'entretien preventif a {zone} cible les pieces d'usure courantes avant la rupture : joints, patins de guidage et galets. Les remplacer a temps coute peu et evite qu'une petite usure n'en entraine une plus grave.",
    "Une fermeture entretenue a {zone} conserve sa valeur et rassure assureur comme repreneur. Un carnet de suivi a jour temoigne du soin apporte a votre rideau et facilite toute transmission de votre commerce.",
  ],
  fabrication: [
    "Une fabrication de rideau metallique a {zone} part de vos mesures exactes. Nous choisissons le materiau (acier, aluminium, inox) et l'epaisseur, fabriquons lames, coffre et axe, puis posons la fermeture sur-mesure.",
    "Pour fabriquer votre rideau metallique a {zone}, nous concevons une fermeture aux dimensions de votre ouverture : lame pleine, micro-perforee ou grille cobra, avec finitions soignees et pose incluse.",
    "Chaque devanture de {zone} a ses contraintes : hauteur, largeur, niveau de securite. Notre fabrication sur-mesure de rideau metallique repond exactement a ces parametres, sans compromis sur la robustesse.",
    "Fabriquer un rideau metallique a {zone} aux bonnes dimensions evite les jeux et les points faibles. Nous controlons chaque cote avant la production pour garantir une fermeture parfaitement ajustee.",
    "Une fabrication a {zone} part du releve precis de l'ouverture, hauteur, largeur et profondeur du coffre. Nous selectionnons ensuite le materiau et l'epaisseur de lame, puis dimensionnons l'axe pour porter le tablier sans flechir.",
    "Pour une fermeture sur-mesure a {zone}, nous dessinons le tablier, les coulisses et la lame d'arret sur plan avant l'atelier. Chaque element est usine puis assemble, et le guidage controle pour une descente parfaitement droite.",
    "Le type de lame change tout a {zone} : pleine pour la securite, micro-perforee ou grille cobra pour garder la vitrine visible la nuit. Nous orientons votre choix puis fabriquons la fermeture adaptee a votre activite.",
    "Une fabrication soignee a {zone} se termine par la pose et le reglage sur site. Nous fixons le coffre, calons les coulisses d'aplomb et integrons serrure ou motorisation avant l'essai complet de votre rideau neuf.",
    "Toute fabrication a {zone} part d'un metre contradictoire de l'ouverture : hauteur, largeur et niveau du sol fini. Ce releve precis evite les jeux lateraux et garantit que le tablier livre s'inscrit pile dans votre baie.",
    "Le choix de l'enroulement et du diametre du coffre depend de la hauteur du rideau a {zone}. Pour une ouverture haute, nous calculons le nombre de tours sur l'axe afin que le tablier loge entierement dans un caisson compact.",
    "Une fermeture de {zone} destinee a un commerce alimentaire peut recevoir un traitement anticorrosion specifique. Nous selectionnons galvanisation ou laquage en atelier selon l'exposition, pour une fabrication qui resiste a l'humidite et au nettoyage frequent.",
    "Avant la mise en production a {zone}, nous validons un plan cote avec vous : type de lame, teinte, serrure et options de motorisation. Cette etape ecrite fige le projet et evite toute surprise a la livraison de votre rideau sur-mesure.",
    "Le delai de fabrication a {zone} depend du materiau et des finitions choisis. Nous l'annoncons des la commande et tenons l'engagement, pour que vous planifiez sereinement la pose sans laisser votre vitrine sans protection.",
    "Une fabrication a {zone} peut prevoir un passage de cables et un emplacement de moteur des l'atelier, meme si vous motorisez plus tard. Cette anticipation evite de retoucher le coffre le jour ou vous passez a l'electrique.",
    "Le poids final du tablier a {zone} guide le choix de l'epaisseur et du type de lame. Un commerce qui ouvre souvent gagne a un tablier plus leger, quand une bijouterie privilegie l'acier plein pour la resistance.",
    "Nous fabriquons aussi des fermetures de remplacement a {zone}, reprises a l'identique des coulisses existantes. Cela evite de toucher au gros oeuvre quand seul le tablier ou le coffre est a renouveler.",
    "Une grille a maille fine fabriquee a {zone} laisse voir la vitrine tout en bloquant le passage. Nous calculons l'entraxe des barreaux pour concilier visibilite, aeration et resistance a l'effraction selon votre activite.",
    "Chaque rideau quitte l'atelier apres un controle dimensionnel et un test d'enroulement a {zone}. Cette verification en amont garantit que la pose sur site se fera sans ajustement de derniere minute ni jeu disgracieux.",
    "Chaque rideau sur mesure part d'un releve au millimetre de la baie du {street1}, transmis a l'atelier pour le dimensionnement. On choisit alors une lame pleine en acier galvanise, on calcule le diametre de l'axe et la longueur d'enroulement avant de tailler les coulisses adaptees a la devanture.",
    "Pour une boutique pres de {landmark1}, nous fabriquons un tablier en lame micro-perforee qui laisse passer la lumiere tout en protegeant la vitrine. L'aluminium retenu allege l'enroulement, et les finitions thermolaquees sont choisies en atelier avant une pose calee sur les cotes relevees.",
    "Une grille cobra en acier se prepare maillon par maillon pour la devanture du {quartier1}. L'atelier ajuste la hauteur, soude les barreaux, monte l'axe et la serrure, puis le tablier ajoure est livre avec ses coulisses sur mesure et son treuil dimensionne pour l'ouverture.",
    "Sur {street2}, le client souhaite voir sa marchandise : nous concevons un rideau a lames polycarbonate transparentes serties sur cadre aluminium. Le calcul de poids guide le choix de l'axe et des ressorts, et chaque element est fini en atelier avant un montage soigne sur la baie.",
    "Un environnement humide proche de {landmark2} oriente vers une fabrication en inox resistant a la corrosion. Les lames pleines sont profilees a la dimension exacte, l'axe et le caisson assembles, puis l'ensemble est traite et pose avec des coulisses parfaitement etanches au guidage.",
    "Pour le commerce de {commerce1}, l'atelier realise un tablier mixte : bas en lames pleines acier, haut en parties micro-perforees pour la ventilation. Le dimensionnement de l'enroulement, le choix de la serrure et les finitions sont valides avant la decoupe definitive des coulisses.",
    "Une devanture large du {street3} impose un axe renforce et des ressorts de compensation calcules au plus juste. Nous fabriquons les lames aluminium a la longueur exacte, montons le coffre sur mesure, puis ajustons galets et patins en atelier avant une pose alignee sur la baie.",
    "Pres de {commerce2}, la fabrication d'une grille ajouree commence par un plan precis des entraxes. L'atelier soude la trame en acier, integre la lame finale pleine pour l'appui au sol, monte la cremone et livre un tablier dont les finitions epousent le style de la facade.",
    "Un projet du {quartier2} reclame un rideau extra-resistant : lames pleines en acier nervure, axe surdimensionne et caisson renforce. Le bureau d'atelier definit l'enroulement, choisit un thermolaquage anti-rayures, puis l'equipe pose l'ensemble en calant chaque coulisse a l'aplomb.",
    "Pour habiller la vitrine voisine de {landmark4}, nous fabriquons un tablier aluminium a finition brossee assorti a la {specifique}. Les lames sont profilees sur mesure, l'axe et les fins de course pre-regles en atelier, et la pose se conclut par un essai complet de descente et de remontee.",
    "La fabrication sur mesure debute par un releve dimensionnel rigoureux de la baie a equiper pres de {commerce1} : largeur, hauteur, retombee et contraintes du linteau. Selon l'usage, on choisit le materiau, acier galvanise robuste, aluminium leger ou inox resistant a la corrosion, puis le type de lame, pleine pour la securite ou micro-perforee pour la visibilite. L'axe et le tube d'enroulement sont dimensionnes en atelier en fonction du poids calcule du tablier. Apres decoupe, profilage des lames et controle dimensionnel au gabarit, la finition thermolaquee est appliquee avant livraison et pose soignee le long de {street1}.",
    "Concevoir un rideau sur mesure pres de {landmark1} commence par des mesures au laser et le releve des particularites du support. Le client choisit entre une lame polycarbonate transparente, une grille cobra ajouree ou une lame pleine selon le compromis recherche entre vitrine et protection. En atelier, on calibre l'arbre, on profile chaque lame et on assemble la lame finale renforcee avec sa lame d'arret. Un controle dimensionnel verifie l'equerrage et le jeu dans les coulisses avant thermolaquage. Le tablier termine est ensuite transporte et pose avec ses glissieres ajustees le long de {street2}.",
    "La realisation d'une fermeture personnalisee pour le local de {quartier1} part d'un metre precis et d'une etude du poids a enrouler. Le choix du materiau guide tout le projet : aluminium pour la legerete, acier pour la robustesse, inox pour les ambiances humides. Les lames, pleines ou microperforees, sont profilees sur mesure et l'axe dimensionne pour supporter la charge sans flexion. L'atelier soude les renforts, monte le tube d'enroulement et controle chaque cote au gabarit pres de {commerce2}. Apres finition laquee teinte au choix, la livraison et la pose finalisent un ouvrage parfaitement ajuste a la baie.",
    "Pour fabriquer un rideau adapte a la devanture de {landmark2}, on releve d'abord chaque cote avec un metre laser et on note les obstacles du chantier. Le materiau est selectionne selon l'exposition, l'acier pour la solidite ou l'inox pour les zones salines, puis la lame retenue, pleine ou grille cobra. L'arbre et l'enroulement sont calcules d'apres le poids du tablier, profiles puis assembles en atelier le long de {street3}. Un controle dimensionnel strict valide l'alignement des lames et l'engagement dans les coulisses. Apres laquage et sechage, l'ensemble est livre et pose avec reglage des fins de course.",
    "La fabrication d'une fermeture sur mesure pres de {commerce1} s'ouvre sur une prise de cotes exhaustive et l'analyse des contraintes de pose. On arrete le materiau, aluminium thermolaque ou acier galvanise, et le type de lame, micro-perforee pour aerer ou pleine pour la securite maximale. En atelier, les profils sont decoupes a la longueur exacte, l'axe dimensionne et le tube d'enroulement equilibre. Chaque lame passe au controle dimensionnel avant assemblage de la lame finale et de la lame d'arret pres de {quartier2}. La finition appliquee, le tablier est transporte et installe avec ses glissieres parfaitement alignees.",
    "Realiser un rideau bespoke pour {landmark3} demande d'abord un releve minutieux de la baie et du logement disponible pour le coffre. Le donneur d'ordre choisit la lame, polycarbonate pour la transparence, grille cobra pour la ventilation ou tole pleine pour la protection. L'atelier dimensionne l'arbre selon la surface, profile les lames et soude les embouts renforces le long de {street1}. Un gabarit verifie chaque cote, l'equerrage et le jeu dans les coulisses avant thermolaquage. Une fois la teinte seche, le tablier complet est achemine et pose avec reglage du guidage et des butees.",
    "La conception sur mesure pour la boutique de {quartier1} commence par des mesures laser et la determination du poids a manoeuvrer. Selon le budget et l'usage, on opte pour l'acier robuste, l'aluminium leger ou l'inox inoxydable, puis pour une lame pleine ou microperforee. L'axe et le tube d'enroulement sont calcules pour eviter toute flexion, profiles et assembles en atelier pres de {street2}. Le controle dimensionnel verifie chaque longueur de lame, l'equerrage et l'ajustement des galets dans le guidage. Apres finition laquee, l'ouvrage est livre et pose avec scellement des coulisses et reglage de la lame d'arret.",
    "Fabriquer une fermeture adaptee pres de {landmark4} part d'un releve detaille des dimensions et des particularites du support. Le materiau decoule de l'environnement, inox en bord de mer, acier en centre commercant, aluminium pour les grandes largeurs. La lame est choisie, pleine, micro-perforee ou grille cobra, puis l'arbre dimensionne selon le poids du tablier le long de {commerce2}. En atelier, les profils sont decoupes, assembles et controles au gabarit avant thermolaquage soigne. La livraison et la pose s'accompagnent du reglage des coulisses, des butees et d'un essai complet de l'enroulement.",
    "La fabrication d'un rideau personnalise pour le local de {commerce1} debute par une etude des cotes et une simulation du poids enroule. Le choix se porte sur l'acier galvanise, l'aluminium thermolaque ou l'inox brosse selon l'esthetique recherchee, avec une lame pleine ou polycarbonate. L'atelier profile les lames, dimensionne l'axe et equilibre le tube d'enroulement pour un fonctionnement souple pres de {street3}. Un controle dimensionnel valide l'equerrage, le jeu et la planeite avant la mise en peinture. Le tablier acheve est ensuite transporte et installe avec ses glissieres ajustees au millimetre.",
    "Concevoir un rideau bespoke pres de {quartier2} commence par un metre rigoureux et l'identification du type d'enroulement adapte a la retombee. Le materiau retenu, acier pour la securite, aluminium pour la legerete ou inox pour la longevite, oriente le profilage des lames. L'arbre est dimensionne d'apres la charge calculee, puis le tube d'enroulement assemble et renforce en atelier le long de {street1}. Chaque lame passe un controle dimensionnel strict, l'equerrage et l'ajustement aux coulisses etant verifies au gabarit. Apres finition laquee, l'ouvrage est livre et pose avec reglage des butees et essai du tablier complet.",
    "La realisation sur mesure pour la devanture de {commerce2} s'appuie sur un releve laser et l'analyse du linteau supportant le futur coffre. On selectionne la lame, micro-perforee pour la vitrine, grille cobra pour la ventilation ou pleine pour la protection renforcee. L'atelier calcule l'axe, profile les lames a la longueur exacte et assemble la lame finale avec sa lame d'arret pres de {street2}. Un controle dimensionnel verifie l'equerrage, la planeite et le jeu dans le guidage avant thermolaquage. La teinte sechee, le tablier est achemine et pose avec scellement des coulisses et reglage du tube d'enroulement.",
    "Fabriquer une fermeture sur mesure pour le commerce de {quartier1} demande un releve precis des cotes et une etude du poids a equilibrer sur l'axe. Le materiau, acier galvanise, aluminium leger ou inox resistant, est choisi selon l'usage et l'exposition du site. Les lames, pleines ou microperforees, sont profilees et l'arbre dimensionne pour eviter toute deformation le long de {landmark1}. En atelier, l'assemblage du tube d'enroulement et le controle dimensionnel au gabarit precedent la finition thermolaquee. Une fois seche, l'ouvrage complet est livre et pose avec ses glissieres alignees et un essai d'enroulement final.",
  ],
};

// Reviews specifiques par service (6 par service). gender = 'm'|'f' pour coherence avatar (REGLE 45).
// Avis UNIQUES par service (verbatim distinct). {zone}/{landmark1}/{street1} interpoles par zone.
export type ServiceReview = { author: string; gender: "m" | "f"; rating: number; date: string; text: string };

const reviewsBank: Record<string, ServiceReview[]> = {
  depannage: [
    { author: "Julien Mercier", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Rideau metallique de ma boutique bloque a mi-course un dimanche soir a {zone}. Technicien arrive en 25 minutes pres de {landmark1}, moteur diagnostique et redemarre sur place. Tres reactif." },
    { author: "Sandra Pereira", gender: "f", rating: 5, date: "Il y a 3 semaines", text: "Panne de mon rideau metallique en pleine nuit a {zone}, impossible de fermer. Intervention d'urgence rapide, axe degrippe et fermeture securisee avant 7h. Je recommande vivement." },
    { author: "Karim Benali", gender: "m", rating: 5, date: "Il y a 1 mois", text: "Boitier electrique du rideau HS dans mon local du secteur de {street1}. Depannage propre, piece remplacee et tarif annonce a l'avance. Rien a redire sur le serieux." },
    { author: "Caroline Vidal", gender: "f", rating: 4, date: "Il y a 1 mois", text: "Telecommande de mon rideau metallique en panne a {zone}. Le technicien a tout reprogramme et verifie les fins de course. Service efficace et explications claires." },
    { author: "Antoine Faure", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Rideau qui ne remontait plus le matin de l'ouverture a {zone}. Equipe jointe immediatement, intervention dans l'heure pres de {landmark1}. Activite reprise sans perdre une journee." },
    { author: "Nadia Cherif", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Lame deformee apres un choc sur mon rideau a {zone}. Depannage le jour meme, redressage du tablier et controle complet. Travail soigne, je fais appel a eux des qu'il y a un souci." },
    { author: "Olivier Tanguy", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Coupure d'alimentation sur mon rideau metallique pendant le rush du midi a {zone}. Technicien arrive vite vers {quartier1}, panne electrique identifiee et fermeture relancee. Mon commerce a pu rouvrir tout de suite." },
    { author: "Myriam Hadjadj", gender: "f", rating: 5, date: "Il y a 4 mois", text: "Tablier deraille en pleine nuit a {zone}, impossible de baisser le rideau pour fermer. Appel d'urgence pris immediatement, intervention rapide pres de {landmark2} et tablier remis dans les rails proprement." },
    { author: "Damien Charpentier", gender: "m", rating: 4, date: "Il y a 5 mois", text: "Ressort casse qui bloquait la remontee de mon rideau a {zone}. Depannage le matin meme vers {street2}, piece changee sur place et tarif annonce avant. Reactif et clair, rien a redire." },
    { author: "Linda Boukhris", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Mon rideau metallique faisait un bruit anormal et s'est bloque a {zone}. Equipe jointe en soiree, deplacement express pres de {commerce1}, axe grippe degrippe et fermeture securisee. Service impeccable." },
    { author: "Yannick Prevost", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Serrure forcee apres une tentative d'intrusion sur ma devanture a {zone}. Intervention de nuit pres de {landmark3}, rideau securise dans l'heure et reparation propre. Tres rassurant pour mon commerce." },
    { author: "Veronique Marin", gender: "f", rating: 5, date: "Il y a 5 mois", text: "Rideau metallique bloque ouvert un soir d'orage a {zone}, coupure electrique en cause. Depannage express pres de {landmark4}, alimentation retablie et fermeture relancee. J'ai pu fermer mon commerce en securite." },
    { author: "Adrien Lemoine", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Condensateur du moteur HS, mon rideau calait a mi-hauteur a {zone}. Le technicien a teste l'electronique sur place pres de {landmark1}, change la piece et relance la fermeture en une heure. Pas eu a remplacer toute la motorisation, tres honnete." },
    { author: "Stephanie Gaillard", gender: "f", rating: 5, date: "Il y a 3 semaines", text: "Fin de course dereglee, mon rideau ne s'arretait plus en bas a {zone}. Depannage le matin meme dans le secteur de {street1}, reglage precis et essai complet devant moi. Le tablier repose enfin pile au sol, travail soigne." },
    { author: "Walid Mansouri", gender: "m", rating: 4, date: "Il y a 1 mois", text: "Tablier sorti des coulisses un matin d'ouverture a {zone}. Equipe jointe vite, lames degagees sans casse pres de {commerce1} et remises dans les rails. Le rideau redescend droit, intervention propre et tarif annonce avant." },
    { author: "Delphine Pasquier", gender: "f", rating: 5, date: "Il y a 2 mois", text: "Boitier de commande grille apres un orage a {zone}. Coupure de l'alimentation, diagnostic et remplacement du boitier vers {quartier1}. Fermeture relancee le jour meme, le technicien a tout teste avant de partir. Rien a redire." },
    { author: "Said Boulahya", gender: "m", rating: 5, date: "Il y a 4 mois", text: "Rideau immobilise par une coupure secteur en plein rush a {zone}. Depanneur arrive express pres de {landmark2}, alimentation retablie et fermeture controlee. Mon commerce a pu rester ouvert, vraiment reactif." },
    { author: "Carole Vasseur", gender: "f", rating: 5, date: "Il y a 5 mois", text: "Serrure forcee apres une intrusion sur ma devanture a {zone}. Ouverture securisee des l'arrivee dans le secteur de {street2}, serrure remplacee et verrouillage controle. Une equipe rassurante, j'ai pu rouvrir tranquille." },
  ],
  installation: [
    { author: "Philippe Garnier", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Installation d'un rideau metallique neuf pour mon commerce a {zone}. Prise de mesures precise pres de {street1}, pose impeccable et raccordement electrique propre. Tres pro." },
    { author: "Emilie Roux", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Pose d'un rideau sur-mesure sur ma devanture a {zone}. Conseil sur le type de lame, devis gratuit detaille et chantier respecte au jour pres. Resultat parfait pres de {landmark1}." },
    { author: "Marc Lefevre", gender: "m", rating: 5, date: "Il y a 1 mois", text: "Nouveau rideau metallique pour mon entrepot a {zone}. Coffre et axe parfaitement integres, finitions soignees. Equipe ponctuelle et a l'ecoute du debut a la fin." },
    { author: "Sophie Marchand", gender: "f", rating: 4, date: "Il y a 2 mois", text: "Installation complete d'une fermeture metallique a {zone}. Pose des coulisses nette, tests de securite faits devant moi. Bon rapport qualite-prix pour mon commerce." },
    { author: "Thomas Girard", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Mise en place d'un rideau micro-perfore sur ma vitrine du secteur de {street1}. Visibilite conservee et securite renforcee. Conseil technique au top, je recommande." },
    { author: "Laetitia Brun", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Pose d'un rideau metallique neuf pour ma boutique a {zone}. Formation a l'usage incluse, devanture protegee et esthetique respectee pres de {landmark1}. Tres satisfaite." },
    { author: "Bertrand Chevalier", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Installation d'une grille cobra sur ma vitrine a {zone}, dans le quartier {quartier1}. Etude de la devanture serieuse, montage du tablier soigne et mise en service expliquee. Une equipe vraiment professionnelle." },
    { author: "Oceane Delaunay", gender: "f", rating: 4, date: "Il y a 4 mois", text: "Pose d'un rideau metallique sur mon nouveau local a {zone}. Choix du type de lame bien conseille, coffre integre discret pres de {street2}. Chantier propre et respect des delais annonces." },
    { author: "Cedric Barbier", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Fermeture metallique installee sur ma devanture a {zone} pres de {landmark2}. Raccordement electrique aux normes, tests de securite faits devant moi. Travail soigne du metre jusqu'a la mise en service." },
    { author: "Amandine Royer", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Pose d'un rideau plein acier pour proteger ma bijouterie a {zone}. Fabrication sur-mesure aux abords de {commerce1}, finitions impeccables et conseil securite pertinent. Je me sens enfin tranquille." },
    { author: "Jonathan Maillard", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Mise en place d'un rideau metallique sur ma boulangerie a {zone}. Pose de l'axe et des coulisses nette vers {quartier2}, equipe ponctuelle et a l'ecoute. Rapport qualite-prix excellent." },
    { author: "Patricia Gonzalez", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Installation d'un rideau metallique sur ma pharmacie a {zone}. Etude de la devanture serieuse pres de {landmark3}, lame micro-perforee pour garder la visibilite et raccordement aux normes. Resultat tres reussi." },
    { author: "Fabrice Hottin", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Pose d'un rideau plein acier sur ma vitrine large a {zone}. Axe dimensionne au poids du tablier pres de {street1}, coulisses bien calees et descente sans le moindre point dur. Du travail serieux, fermeture qui glisse parfaitement." },
    { author: "Marina Lefranc", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Installation d'une grille cobra sur ma boutique a {zone} pour garder la vitrine visible la nuit. Conseil sur le tablier pertinent pres de {landmark1}, serrure et coulisses montees nettes. Securite et visibilite parfaitement combinees." },
    { author: "Quentin Berthier", gender: "m", rating: 4, date: "Il y a 1 mois", text: "Coffre integre et lame d'arret poses sur ma devanture a {zone}. Patins et fins de course bien reglees vers {commerce1}, aplomb du tablier verifie avant le cablage. Chantier propre, equipe a l'ecoute et delais tenus." },
    { author: "Sonia Khaldi", gender: "f", rating: 5, date: "Il y a 2 mois", text: "Etude de l'exposition de ma baie avant la pose a {zone}. Profondeur des coulisses ajustee le long de {street2}, plus aucun jeu et descente bien ajustee. Une installation reflechie, je recommande sans hesiter." },
    { author: "Ludovic Bourdon", gender: "m", rating: 5, date: "Il y a 4 mois", text: "Rideau motorise installe sur mon local a {zone}. Raccordement aux normes pres de {landmark2}, fins de course reglees et detection d'obstacle testee devant moi. Mise en service faite seulement apres validation des securites. Tres pro." },
    { author: "Aline Bouchard", gender: "f", rating: 5, date: "Il y a 5 mois", text: "Pose d'un rideau acier sur ma bijouterie a {zone} pres de {landmark3}. Lame d'arret et points de fermeture poses selon mon niveau de risque, prise en main du deverrouillage manuel expliquee. Je me sens enfin en securite." },
    { author: "Tristan Goujon", gender: "m", rating: 5, date: "Il y a 6 mois", text: "Devis d'installation tres detaille pour ma vitrine a {zone}, chaque ligne expliquee avant la commande. Tablier livre groupe avec le coffre pres de {commerce2}, pose bouclee en une seule visite. Aucune surprise sur le prix ni le delai, tres carre." },
    { author: "Maryline Esteves", gender: "f", rating: 5, date: "Il y a 6 mois", text: "Baie large equipee de deux vantaux jointifs sur mon commerce a {zone}. Repartition de la charge etudiee pres de {landmark4}, manoeuvre restee douce sans surdimensionner le moteur. Du conseil technique pertinent, je recommande vraiment." },
    { author: "Anselme Dubreuil", gender: "m", rating: 4, date: "Il y a 7 mois", text: "Installation planifiee en dehors des heures d'affluence pour ma boutique a {zone}. Depose de l'ancien dispositif et pose du neuf enchainees vite vers {quartier2}, fermeture minimale du magasin. Chantier propre et delais tenus, equipe a l'ecoute." },
    { author: "Florine Chapuis", gender: "f", rating: 5, date: "Il y a 7 mois", text: "Teinte du coffre et finition des lames choisies avec moi pour ma vitrine a {zone}. La fermeture s'efface dans la devanture une fois relevee pres de {street1}, esthetique respectee. Robuste et discret, exactement ce que je voulais." },
    { author: "Lionel Vannier", gender: "m", rating: 5, date: "Il y a 8 mois", text: "Fiche d'usage et numero de serie du moteur remis apres la pose a {zone}. Dossier de tracabilite complet vers {landmark1}, ce qui rassure pour l'entretien futur. Raccordement aux normes et tests de securite faits devant moi, vraiment serieux." },
    { author: "Berengere Lallemand", gender: "f", rating: 5, date: "Il y a 8 mois", text: "Pose d'une grille a maille fine sur ma boutique a {zone} pour garder la vitrine visible. Entraxe des barreaux calcule pres de {commerce1}, visibilite et resistance combinees. Installation soignee du metre jusqu'a la mise en service, parfait." },
    { author: "Anicet Delaunay", gender: "m", rating: 5, date: "Il y a 7 mois", text: "Installation d'un rideau neuf pour ma boutique de la {zone}. Prise de mesures precise, pose du coffre et de l'axe au millimetre, raccordement electrique propre. Les fins de course sont parfaitement regles, ouverture fluide. Chantier net et equipe ponctuelle." },
    { author: "Cunegonde Marchand", gender: "f", rating: 5, date: "Il y a 9 mois", text: "Pose d'une grille cobra sur ma vitrine rue {street1}. Les coulisses ont ete fixees solidement et la lame d'arret ajustee au sol. Raccordement electrique soigne et test des fins de course devant moi. Resultat robuste et tres esthetique." },
    { author: "Bastien Charpentier", gender: "m", rating: 4, date: "Il y a 8 mois", text: "Nouveau rideau installe pres du {landmark1}. La prise de mesures a ete minutieuse, le coffre s'integre bien en facade. Raccordement et reglage des fins de course impeccables. Petit retard a la livraison de l'axe mais pose finale parfaite." },
    { author: "Solenne Bouvier", gender: "f", rating: 5, date: "Il y a 6 mois", text: "Installation complete sur mon local du {quartier1}. Coffre discret, coulisses droites et lame d'arret bien calee. Le raccordement electrique respecte les normes et les fins de course sont reglees au plus juste. Equipe propre et tres professionnelle." },
    { author: "Thibault Lefranc", gender: "m", rating: 5, date: "Il y a 1 an", text: "J'ai fait poser un rideau motorise face au {landmark2}. Mesures sur place, montage de l'axe et du coffre rapide, coulisses parfaitement verticales. Fins de course et lame d'arret regles avec soin. Ouverture silencieuse, je suis ravi du rendu." },
    { author: "Garance Pelletier", gender: "f", rating: 5, date: "Il y a 10 mois", text: "Pose d'un rideau neuf pour mon commerce pres du {commerce1}. Prise de mesures serieuse, coffre et axe installes proprement, raccordement electrique soigne. Les coulisses glissent sans accroc et les fins de course sont nickel. Travail de qualite." },
  ],
  reparation: [
    { author: "Vincent Moreau", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Plusieurs lames voilees sur mon rideau a {zone} apres une tentative d'effraction. Remise en etat le matin meme pres de {landmark1}, devanture de nouveau securisee. Excellent." },
    { author: "Isabelle Petit", gender: "f", rating: 5, date: "Il y a 3 semaines", text: "Moteur fatigue de mon rideau metallique a {zone}. Reparation plutot que remplacement complet, ce qui m'a coute bien moins cher. Honnete et competent, secteur de {street1}." },
    { author: "Laurent Dubois", gender: "m", rating: 5, date: "Il y a 1 mois", text: "Axe et ressorts changes sur mon rideau a {zone}. Fermeture qui glisse de nouveau sans effort ni bruit. Travail garanti, je suis rassure pour mon commerce." },
    { author: "Fatima Saidi", gender: "f", rating: 4, date: "Il y a 2 mois", text: "Serrure forcee sur mon rideau metallique a {zone}. Remplacement rapide et reglage du tablier. Intervention soignee pres de {landmark1}, devis clair." },
    { author: "Nicolas Henry", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Coulisses abimees sur ma fermeture a {zone}. Reprise complete et remplacement des joints. Le rideau fonctionne comme neuf, tarif raisonnable. Tres serieux." },
    { author: "Valerie Lemoine", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Cablage defaillant repare sur mon rideau metallique a {zone}. Diagnostic precis et remise aux normes. Equipe a l'ecoute, je recommande pour le secteur de {street1}." },
    { author: "Gregory Masset", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Tablier voile sur mon rideau a {zone} apres un choc de livraison. Redressage des lames et reprise du tablier vers {quartier1}, la fermeture glisse de nouveau sans accroc. Travail tres soigne." },
    { author: "Sandrine Cohen", gender: "f", rating: 4, date: "Il y a 4 mois", text: "Fins de course dereglees sur mon rideau metallique a {zone}. Reglage precis et controle du moteur pres de {landmark2}. Plus de rideau qui s'arrete trop tot, tarif honnete et explications claires." },
    { author: "Tony Lemaire", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Boitier electrique a remplacer sur ma fermeture a {zone}. Changement propre du boitier vers {street2}, remise aux normes et garantie sur la piece. Une reparation faite dans les regles." },
    { author: "Elodie Guerin", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Joints uses et coulisses abimees sur mon rideau a {zone}. Remplacement des joints et reprise des coulisses pres de {commerce1}. La fermeture ne grince plus du tout, vraiment efficace." },
    { author: "Maxime Colin", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Moteur a remettre en etat sur mon rideau metallique a {zone}. Reparation plutot que remplacement complet aux abords de {landmark3}, ce qui m'a fait economiser. Honnete et competent." },
    { author: "Beatrice Roussel", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Lames du bas voilees apres un choc sur mon rideau a {zone}. Remplacement des lames et redressage du tablier dans le quartier {quartier2}, la fermeture descend de nouveau bien droit. Reparation soignee et garantie." },
    { author: "Herve Dassonville", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Mon rideau accrochait dans les coulisses a {zone} et finissait par se bloquer. Realignement des rails pres de {street3} et reprise du guidage, il descend maintenant tout droit sans forcer. Diagnostic precis et travail durable." },
    { author: "Najat Belkacem", gender: "f", rating: 4, date: "Il y a 4 mois", text: "Ressorts de compensation fatigues sur ma fermeture a {zone}, la manoeuvre etait tres dure. Retension et controle de l'equilibrage aux abords de {landmark4}, le rideau remonte de nouveau sans effort. Honnete et competent." },
    { author: "Bruno Aubertin", gender: "m", rating: 5, date: "Il y a 1 mois", text: "Lame finale tordue qui empechait la fermeture complete de mon rideau a {zone}. Redressage et reprise du joint de butee dans le quartier {quartier1}, plus aucun jour sous le tablier. Reparation propre et bien expliquee." },
    { author: "Clemence Verdier", gender: "f", rating: 5, date: "Il y a 5 mois", text: "Axe qui vibrait fort a chaque ouverture sur mon rideau a {zone}. Verification du roulement et reprise des attaches de lames pres de {landmark2}, la fermeture est redevenue silencieuse. Tres serieux du diagnostic a la restitution." },
    { author: "Olivier Sanchez", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Caisson demonte pour inspecter l'origine d'une panne recurrente de mon rideau a {zone}. Le technicien a trouve un patin use vers {street1}, l'a remplace et regle l'arret bas. Probleme regle a la racine, plus de blocage depuis." },
  ],
  motorisation: [
    { author: "Olivier Blanc", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Motorisation de mon rideau manuel a {zone} avec un moteur Somfy. Pose propre, telecommande bien reglee et explication du fonctionnement. Un vrai confort au quotidien." },
    { author: "Christine Faivre", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Passage a l'electrique de ma fermeture a {zone}. Fini la manivelle ! Moteur tubulaire silencieux installe pres de {street1}, securites integrees. Tres bonne equipe." },
    { author: "Mehdi Bouaziz", gender: "m", rating: 5, date: "Il y a 1 mois", text: "Automatisation de mon rideau metallique a {zone}. Choix du moteur adapte au poids du tablier, raccordement aux normes. Service technique pointu, je recommande." },
    { author: "Aurelie Caron", gender: "f", rating: 4, date: "Il y a 2 mois", text: "Motorisation Simu posee sur mon rideau a {zone}. Fins de course reglees au millimetre, mise en service nickel pres de {landmark1}. Tres satisfaite du resultat." },
    { author: "Stephane Roy", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Pose d'un moteur central sur mon rideau de garage a {zone}. Boitier discret, telecommande pratique. Travail propre et conseils utiles pour l'entretien futur." },
    { author: "Lucie Garcia", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Mon rideau manuel a {zone} est enfin automatise. Moteur ACM fiable, intervention rapide et soignee. Confort total pour ouvrir et fermer ma boutique. Parfait." },
    { author: "Guillaume Perez", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Motorisation Nice posee sur mon rideau metallique a {zone}. Depose de l'ancien systeme manuel pres de {quartier1}, moteur silencieux et automatisme bien regle. J'ouvre ma boutique d'un seul geste." },
    { author: "Severine Marty", gender: "f", rating: 4, date: "Il y a 4 mois", text: "Passage a l'electrique de ma fermeture metallique a {zone}. Moteur adapte au poids du tablier vers {street2}, telecommande pratique et contacteur ajoute. Vrai gain de temps chaque matin." },
    { author: "Jerome Vasseur", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Automatisation de mon rideau de commerce a {zone} pres de {landmark2}. Cablage propre aux normes, fins de course reglees au millimetre et fonctionnement explique. Une equipe technique vraiment pointue." },
    { author: "Charlotte Riviere", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Moteur tubulaire installe sur mon rideau a {zone}, fini la manivelle. Pose soignee aux abords de {commerce1}, securites integrees et essai complet devant moi. Confort total, je recommande." },
    { author: "Anthony Schmitt", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Motorisation Simu sur mon rideau metallique a {zone}. Choix du moteur selon mon tablier lourd vers {street3}, mise en service nickel et conseils d'entretien donnes. Travail propre et serieux." },
    { author: "Sophie Vincent", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Automatisation de mon vieux rideau manuel a {zone}. Moteur ACM installe pres de {landmark3}, telecommande et arret de securite ajoutes. Plus besoin de forcer matin et soir, un confort que je regrette de ne pas avoir fait avant." },
    { author: "Cyril Delacroix", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Motorisation de mon grand rideau de devanture a {zone}. Couple du moteur calcule selon le poids du tablier pres de {street1}, arbre adapte monte et fins de course reglees au millimetre. Le tablier repose pile au sol, du beau travail." },
    { author: "Joelle Marchetti", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Passage a l'electrique avec contacteur a cle sur ma fermeture a {zone}. Detection d'obstacle et arret automatique ajoutes pres de {landmark1}, securites testees plusieurs fois devant moi. Je ferme ma boutique en toute tranquillite." },
    { author: "Bilal Ouattara", gender: "m", rating: 4, date: "Il y a 2 mois", text: "Verification de l'axe et des coulisses avant la motorisation de mon rideau a {zone}. Tablier remis d'aplomb le long de {street2}, puis moteur tubulaire pose sur une fermeture saine. Fonctionnement souple, aucun blocage depuis. Tres serieux." },
    { author: "Martine Brisset", gender: "f", rating: 5, date: "Il y a 4 mois", text: "Automatisation de mon rideau de commerce a {zone} avec une horloge de programmation. Boitier de commande raccorde aux normes vers {quartier1}, equipe formee a la manoeuvre. Ouverture et fermeture programmees, un vrai gain de temps chaque jour." },
    { author: "Theo Lanvin", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Depose de l'ancien treuil manuel et pose d'un moteur central sur mon rideau a {zone}. Travail propre pres de {landmark2}, fins de course haute et basse ajustees et detection d'obstacle testee. Confort total, je n'ouvre plus a la manivelle." },
    { author: "Patricia Lemarchand", gender: "f", rating: 5, date: "Il y a 6 mois", text: "Motorisation Somfy posee sur mon rideau de boutique a {zone} avec telecommande. Choix du couple selon mon tablier lourd vers {commerce2}, mise en service nickel et securites testees. Plus de manivelle, j'ouvre d'un seul geste chaque matin." },
  ],
  deblocage: [
    { author: "David Lopez", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Rideau metallique coince ferme a {zone}, impossible d'ouvrir le matin. Deblocage manuel d'urgence en moins de 30 minutes pres de {landmark1}, sans aucune degradation. Top. Le moteur tournait sans entrainer le tablier, un condensateur fatigue selon le diagnostic, change en quelques minutes." },
    { author: "Marion Dupont", gender: "f", rating: 5, date: "Il y a 3 semaines", text: "Lame sortie du rail sur mon rideau a {zone}, tablier bloque a mi-hauteur. Equipe venue le soir meme dans le secteur de {street1}, remise en mouvement nette. Soulagee. La cle s etait brisee net dans le barillet ; extraction a la pince fine puis remplacement du cylindre, du grand art. Le diagnostic a pointe une coulisse legerement faussee, redressee sur place ; depuis, le tablier descend bien droit sans accrocher, et la tranquillite est revenue pour de bon." },
    { author: "Hugo Bernard", gender: "m", rating: 5, date: "Il y a 1 mois", text: "Serrure bloquee apres une tentative d'effraction a {zone}. Liberation du rideau sans abimer la devanture, puis securisation. Reactivite impressionnante. Je recommande. Une lame du bas etait gondolee apres un coup de hayon, redressee a la presse plutot que remplacee, geste econome." },
    { author: "Sabrina Meunier", gender: "f", rating: 4, date: "Il y a 2 mois", text: "Rideau coince ouvert a {zone}, je ne pouvais pas fermer ma boutique. Deblocage rapide et reglage de l'axe pres de {landmark1}. Service d'urgence vraiment efficace. Les galets sautaient hors du guidage a chaque montee, repositionnes et graisses, plus aucun deraillement depuis." },
    { author: "Romain Faure", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Cle cassee dans la serrure de mon rideau a {zone}. Extraction et deblocage propres, sans remplacer toute la serrure. Honnete et rapide, je garde le numero. La cremone de la grille refusait de pivoter, deblocage au degrippant puis reglage de la gache, manoeuvre douce retrouvee." },
    { author: "Celine Robin", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Moteur grippe et rideau immobilise a {zone}. Liberation sans degradation et controle complet pres de {street1}. Intervention soignee, devanture intacte. Parfait. Le ressort de compensation avait lache, remplacement par un modele calibre au poids exact du tablier, equilibre parfait. Le moteur a ete diagnostique a froid puis la piece changee proprement ; aucun bruit ni a-coup depuis, et le tarif annonce au telephone a ete respecte a l euro pres." },
    { author: "Florian Gauthier", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Rideau metallique coince a mi-course un samedi a {zone}, clients devant la porte. Deblocage manuel rapide vers {quartier1}, tablier libere sans la moindre marque. Service d'urgence vraiment au top. Un caillou coince dans la coulisse stoppait la descente ; retire en deux minutes, rail nettoye, course de nouveau libre." },
    { author: "Audrey Dumas", gender: "f", rating: 4, date: "Il y a 4 mois", text: "Tablier desaxe qui bloquait mon rideau a {zone}. Equipe venue le soir meme pres de {landmark2}, axe remis droit et rideau de nouveau mobile. Reactivite et travail propre, sans abimer la devanture. La telecommande ne portait plus, pile changee et recepteur reprogramme, l ouverture repond de nouveau au premier appui. Le technicien a recale l axe et resserre les supports avant de tester plusieurs montees ; aucun jeu residuel, la fermeture est de nouveau parfaitement centree dans ses rails." },
    { author: "Rachid Khelifi", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Blocage apres effraction sur ma fermeture metallique a {zone}. Liberation du tablier sans degradation vers {street2}, puis securisation immediate. J'ai pu rouvrir tres vite, equipe rassurante. Le verrou de parking grippe immobilisait la grille ouverte, mecanisme libere et huile, repli sans le moindre effort." },
    { author: "Manon Lecomte", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Mon rideau metallique etait coince ferme a {zone} et je ne pouvais pas ouvrir. Intervention express pres de {commerce1}, lame remise dans le rail et verification de l'axe. Tres efficace et soigneux. La carte de commande avait grille apres une surtension, module remplace et positions rememorisees, tout refonctionne. Apres remise en rail, il a verifie la tension des ressorts et lubrifie le guidage ; le rideau remonte sans le moindre point dur, un confort que j avais perdu depuis longtemps." },
    { author: "Patrice Hamon", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Serrure grippee qui immobilisait mon rideau a {zone}. Deblocage sans tout remplacer aux abords de {landmark3}, puis controle des coulisses pour eviter une rechute. Honnete et rapide, je garde le numero. L axe avait glisse de son palier cote gauche, recale et resserre, le tablier tourne de nouveau bien centre." },
    { author: "Karine Leroux", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Rideau metallique immobilise par un axe grippe a {zone}, impossible de l'ouvrir au matin. Liberation sans degradation pres de {landmark4} et remise en mouvement immediate. Devanture intacte, intervention vraiment propre. Un patin casse faussait l alignement du bas du tablier, piece neuve posee, la fermeture plaque parfaitement au sol." },
    { author: "Gaetan Mercadier", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Lame sortie du rail qui bloquait mon rideau a mi-course a {zone}. Inspection des coulisses pres de {street1}, tablier detendu a la main et lame remise sans rien tordre. Le rideau redescend droit, deblocage tout en douceur. Le coulissement est redevenu parfaitement souple et silencieux, un confort que j avais oublie depuis des mois. Il a aussi controle le verrou de parking et la cremone avant de partir ; tout fonctionne, et les conseils d entretien donnes m evitent surement une rechute prochaine." },
    { author: "Lucile Bonnaud", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Moteur grippe, mon rideau restait immobile au matin a {zone}. Passage en manoeuvre manuelle de secours pres de {commerce1} pour rouvrir, puis diagnostic du moteur. J'ai pu ouvrir ma boutique a l'heure, equipe tres reactive. J apprecie la franchise sur ce qui devait etre change et ce qui pouvait simplement etre regle, sans surfacturation." },
    { author: "Nordine Saci", gender: "m", rating: 4, date: "Il y a 2 mois", text: "Serrure bloquee qui figeait ma fermeture a {zone}. Deblocage au bon outillage sans rien deformer pres de {landmark1}, puis lubrification des points de friction. Plus de point dur, devanture preservee et tarif annonce avant. Mon assureur a meme salue la rapidite de mise en securite apres l incident, je me sens beaucoup plus serein. Le serrurier a degrippe le mecanisme sans rien deformer puis huile les points de friction ; la cle tourne de nouveau sans forcer et la devanture est restee impeccable." },
    { author: "Sylviane Cazaux", gender: "f", rating: 5, date: "Il y a 4 mois", text: "Blocage apres une tentative d'effraction sur mon rideau a {zone}. Tablier degage et ouverture securisee sur-le-champ vers {quartier1}, puis controle des coulisses pour eviter une rechute. Equipe rassurante, j'ai rouvert vite. Le rendez-vous a ete tenu a la minute pres et le secteur est manifestement bien connu de leurs techniciens." },
    { author: "Cedric Vallois", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Axe immobilise apres une coupure secteur a {zone}, rideau coince ouvert. Liberation du tablier au manuel pres de {landmark2}, alimentation retablie et condensateur verifie. J'ai pu fermer mon commerce en securite le soir meme. Petit plus appreciable : ils ont graisse l ensemble du guidage et regle les butees sans surcout supplementaire." },
    { author: "Edith Vanderbeck", gender: "f", rating: 5, date: "Il y a 6 mois", text: "Rideau coince ferme un matin d'ouverture a {zone}, lame sortie du rail. Inspection des coulisses pres de {landmark3}, tablier degage en douceur sans rien tordre et remis dans le guidage. J'ai pu ouvrir ma boutique a l'heure, deblocage tres propre. La fermeture descend desormais bien droit sans le moindre point dur, du travail vraiment durable et soigne." },
    { author: "Aymeric Tessier", gender: "m", rating: 5, date: "Il y a 6 mois", text: "Rideau bloque ouvert un soir a {zone}, local impossible a securiser. Standard qui a priorise mon appel, equipe arrivee vite pres de {commerce2}, descente rendue possible puis ouverture securisee. J'ai pu fermer l'esprit tranquille, vraiment reactif. On sent l habitude de ce type de mecanisme, chaque geste est mesure et efficace, aucune perte de temps." },
    { author: "Ghislaine Pommier", gender: "f", rating: 4, date: "Il y a 7 mois", text: "Tablier coince en biais qui figeait mon rideau a {zone}. Redressage a la sangle et au levier sans forcer pres de {landmark4}, lames et coulisses preservees. Le technicien a evite une reparation lourde, honnete et tarif annonce avant. Les explications de prevention pour eviter une rechute m ont permis de mieux entretenir ma fermeture au quotidien." },
    { author: "Romuald Fauconnier", gender: "m", rating: 5, date: "Il y a 7 mois", text: "Cle cassee dans la serrure de mon rideau a {zone}, fermeture immobilisee. Fragment extrait avec le bon outil vers {street1}, barillet preserve et mecanisme controle. Deblocage sans tout remplacer, j'ai garde le numero. Tres efficace. Devanture remise en service avant l ouverture, ma journee n a pas ete impactee, exactement ce dont j avais besoin." },
    { author: "Pierrette Salaun", gender: "f", rating: 5, date: "Il y a 8 mois", text: "Rideau immobilise par un blocage en pleine journee a {zone}, clients devant la porte. Le technicien a libere le tablier puis teste plusieurs cycles devant moi pres de {quartier1}. Plus de blocage depuis, intervention rassurante et soignee. Materiel professionnel embarque, piece changee sur place et garantie ecrite, difficile d etre plus rassure." },
    { author: "Edouard Marliac", gender: "m", rating: 5, date: "Il y a 8 mois", text: "Moteur grippe qui bloquait mon rideau ferme a {zone}. Manoeuvre de secours a la manivelle pour rouvrir tout de suite pres de {landmark1}, puis diagnostic du moteur a froid. J'ai pu accueillir mes clients sans attendre, equipe au top. Contact tres agreable, intervention soignee et chantier laisse impeccable, je les ai deja recommandes a un voisin." },
    { author: "Romaric Vasseur", gender: "m", rating: 5, date: "Il y a 8 mois", text: "Mon rideau bloque net devant le {commerce1} de la {zone}, une lame sortie du rail. Le technicien a remboite le tablier et regraisse les coulisses en une heure. Ouverture nickel depuis, travail propre et rapide, je recommande vivement. Le technicien a verifie chaque organe sollicite avant de partir, plus aucun bruit ni accroc depuis ce passage." },
    { author: "Sabine Fauconnier", gender: "f", rating: 5, date: "Il y a 6 mois", text: "Serrure grippee sur ma devanture rue {street1}, impossible de remonter le rideau le matin. Intervention le jour meme, deblocage du barillet et nettoyage complet du mecanisme. Le rideau coulisse a nouveau sans forcer, prestation tres serieuse. Tarif raisonnable pour une intervention d urgence, sans gonflement de derniere minute, une vraie honnetete." },
    { author: "Gildas Pruvost", gender: "m", rating: 5, date: "Il y a 10 mois", text: "Moteur immobilise sur mon rideau pres du {landmark1}, plus rien ne bougeait. Le depanneur a libere l'axe avec la sangle de secours puis relance le moteur. Diagnostic clair, tarif annonce respecte, je garde le contact precieusement. La remise en mouvement a ete immediate et la cause clairement identifiee, plus de stress a chaque ouverture." },
    { author: "Maelys Cordonnier", gender: "f", rating: 4, date: "Il y a 9 mois", text: "Cle cassee dans le barillet de mon rideau du {quartier1}, je ne pouvais plus fermer ma boutique. Extraction propre du morceau et remplacement du verrou. Un peu d'attente avant l'arrivee mais resultat impeccable et explications claires. Disponibilite remarquable un jour ferie, ce qui m a evite de laisser ma vitrine vulnerable tout le week-end." },
    { author: "Servan Lemoine", gender: "m", rating: 5, date: "Il y a 7 mois", text: "Tablier desaxe apres un choc pres du {landmark2}, le rideau frottait fort dans les coulisses. Le technicien a realigne les lames et controle le verrou de parking. Fermeture redevenue douce et silencieuse, intervention vraiment soignee. Ponctualite, proprete et conseils avises : une prestation complete que je n hesiterai pas a renouveler. Le verrou de parking a aussi ete controle et les patins remplaces ; la manoeuvre est redevenue silencieuse, un travail vraiment durable et soigne du debut a la fin." },
    { author: "Oumou Traore", gender: "f", rating: 5, date: "Il y a 1 an", text: "Rideau coince a mi-hauteur devant le {commerce2}, lame sortie et serrure grippee en meme temps. Deblocage complet, remise en rail et lubrification. L'equipe est ponctuelle et tres pedagogue, mon commerce a pu rouvrir dans la foulee. Le diagnostic a vise juste du premier coup, pas de tatonnement, et la fermeture fonctionne comme au premier jour. Le compte rendu detaille m a permis de comprendre l origine du double blocage ; intervention pedagogique et finitions soignees, je sais desormais qui appeler en cas d urgence." },
    { author: "Firmin Daguerre", gender: "m", rating: 5, date: "Il y a 9 mois", text: "Rideau metallique bloque en pleine descente devant le {commerce1}, un galet etait sorti de sa glissiere. Le technicien a realigne les lames et remis le galet en place pres de {landmark1} sans deformer le tablier. Course fluide retrouvee, intervention rapide et tres soignee. Reactivite et serieux au rendez-vous, devis respecte et finitions nettes, je garde leur numero en favori." },
    { author: "Apolline Vauthier", gender: "f", rating: 5, date: "Il y a 10 mois", text: "Tablier coince contre la butee haute a {zone}, une fin de course etait dereglee. Passage en pilotage manuel, reglage des butees et nettoyage des patins pres de {street1}. Le rideau remonte de nouveau sans a-coup, travail propre et explications claires. Mecanisme entierement controle et lubrifie, la manoeuvre est de nouveau fluide et rassurante matin et soir." },
    { author: "Gaspard Lemonnier", gender: "m", rating: 4, date: "Il y a 1 an", text: "Cremone grippee qui figeait ma grille extensible pres de {landmark2}. Le depanneur a degage le mecanisme, lubrifie les ciseaux et le rail au sol. La fermeture se replie sans point dur, un peu d attente mais resultat impeccable. Une equipe a l ecoute qui prend le temps d expliquer, ce qui change tout quand on gere un commerce seul." },
    { author: "Cleophee Baudry", gender: "f", rating: 5, date: "Il y a 11 mois", text: "Rideau immobilise par un roulement grippe sur l axe a {zone}. Liberation du tablier a la sangle de secours puis remplacement du roulement vers {quartier1}. Plus aucun bruit a la manoeuvre, equipe pedagogue et tarif annonce respecte. Intervention bouclee rapidement et proprement, ma boutique a pu rouvrir sans perdre la moindre heure de vente." },
    { author: "Thaddee Morvan", gender: "m", rating: 5, date: "Il y a 8 mois", text: "Lame finale gondolee qui bloquait la descente de mon rideau pres de {street2}. Redressage de la lame et reprise du guidage en moins d une heure. Devanture securisee dans la foulee, prestation serieuse, je garde le contact. Conseils d entretien fournis spontanement, ce qui temoigne d un vrai souci de fiabilite sur la duree." },
    { author: "Eulalie Charbonneau", gender: "f", rating: 5, date: "Il y a 9 mois", text: "Blocage du tablier en bas de course a {zone}, la lame d arret etait coincee dans son rail. Liberation du pene et de la cremone pres de {commerce2}, puis controle de l alignement de l axe. Fermeture de nouveau franche, vraiment efficace. Prestation maitrisee de bout en bout, du diagnostic a l essai final, je recommande cette equipe les yeux fermes." },
  ],
  entretien: [
    { author: "Pascal Girard", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Contrat d'entretien annuel pour mon rideau metallique a {zone}. Graissage, controle du moteur et des securites pres de {landmark1}. Plus aucune panne depuis. Tres serieux." },
    { author: "Helene Marchand", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Visite preventive de ma fermeture a {zone}. Axe, lames et fins de course verifies, rapport d'intervention clair. Equipe ponctuelle dans le secteur de {street1}." },
    { author: "Bruno Lefebvre", gender: "m", rating: 5, date: "Il y a 1 mois", text: "Entretien regulier de mon rideau a {zone} qui grincait. Nettoyage des rails et reglage du tablier, plus aucun bruit. Maintenance preventive qui evite les pannes." },
    { author: "Patricia Noel", gender: "f", rating: 4, date: "Il y a 2 mois", text: "Diagnostic complet de mon rideau metallique a {zone} avant la saison. Controle du boitier et des coulisses pres de {landmark1}. Conseils utiles, tarif honnete." },
    { author: "Frederic Aubert", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Contrat annuel pour les rideaux de mes deux commerces a {zone}. Suivi serieux, interventions planifiees. Tranquillite totale, je prolonge sans hesiter." },
    { author: "Sophie Leclerc", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Maintenance de ma fermeture metallique a {zone}. Tension des ressorts ajustee, securites testees pres de {street1}. Service preventif vraiment professionnel. Je recommande." },
    { author: "Didier Pichon", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Premiere visite d'entretien pour mon rideau metallique a {zone}, dans le quartier {quartier1}. Graissage des coulisses, controle moteur et test des securites. Le rideau remonte enfin sans le moindre a-coup." },
    { author: "Corinne Bonnet", gender: "f", rating: 4, date: "Il y a 4 mois", text: "Contrat d'entretien souscrit pour ma fermeture a {zone}. Visite preventive serieuse pres de {landmark2}, inspection du tablier et reglage de l'axe. Tarif annuel raisonnable et tranquillite assuree." },
    { author: "Joel Marechal", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Maintenance reguliere de mon rideau metallique a {zone} qui commencait a forcer. Nettoyage des rails vers {street2} et reglage du tablier, plus aucun effort pour le manoeuvrer. Tres pro." },
    { author: "Aurelia Da Costa", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Visite preventive sur les rideaux de mes commerces a {zone}. Verification des fins de course et du boitier pres de {commerce1}, rapport d'intervention detaille a chaque passage. Vraiment serieux." },
    { author: "Xavier Fournier", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Diagnostic complet de ma fermeture metallique a {zone} avant l'hiver. Tension des ressorts et controle des securites aux abords de {landmark4}. Conseils utiles, plus aucune panne depuis. Je prolonge." },
    { author: "Laurence Texier", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Contrat d'entretien annuel pour le rideau metallique de mon restaurant a {zone}. Graissage des coulisses et controle du moteur vers {street3}, visites planifiees sans que j'aie a y penser. Tranquillite totale, je reconduis." },
    { author: "Bernard Lestrade", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Visite d'entretien sur mon rideau metallique a {zone} qui faisait des points durs. Graissage de l'axe et des coulisses, nettoyage des rails pres de {landmark1}. Le tablier glisse de nouveau silencieux a la montee comme a la descente. Tres serieux." },
    { author: "Murielle Faguet", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Maintenance de ma fermeture a {zone}, la manoeuvre devenait dure. Tension des ressorts de compensation reajustee et tablier reequilibre dans le secteur de {street1}. Le moteur force beaucoup moins, vraiment un travail preventif utile." },
    { author: "Hakim Belaidi", gender: "m", rating: 4, date: "Il y a 2 mois", text: "Controle des securites de mon rideau a {zone} : detection d'obstacle, arret automatique et serrure verifies un a un pres de {landmark2}. Une piece fatiguee a ete signalee dans le rapport et remplacee. Tarif honnete, equipe rigoureuse." },
    { author: "Genevieve Aubertin", gender: "f", rating: 5, date: "Il y a 4 mois", text: "Contrat d'entretien pour les rideaux de mes deux commerces a {zone}. Frequence des visites adaptee a mon usage intensif vers {commerce1}, rapport detaille remis a chaque passage. Plus aucune panne en pleine activite, je reconduis." },
    { author: "Raphael Maingot", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Passage preventif sur ma fermeture metallique a {zone} avant la saison chargee. Lubrification des points de friction et reglage de l'arret bas pres de {quartier1}. Pieces a surveiller anticipees, ce qui m'evite un depannage en urgence. Top." },
    { author: "Solange Treguier", gender: "f", rating: 5, date: "Il y a 6 mois", text: "Contrat d'entretien annuel pour le rideau de ma pharmacie a {zone}. Nettoyage des rails et controle du moteur vers {street3}, test des fins de course et rapport remis a chaque visite. Plus aucun a-coup, une tranquillite que je reconduis." },
    { author: "Gontran Lefief", gender: "m", rating: 5, date: "Il y a 6 mois", text: "Entretien qui a commence par une manoeuvre complete de mon rideau a {zone} pour reperer les bruits. Coulisse seche et roulement qui forcait traites pres de {landmark1}. Quelques visites par an et plus aucune panne immobilisante, tres rentable." },
    { author: "Roselyne Cabrol", gender: "f", rating: 4, date: "Il y a 7 mois", text: "Frequence des visites adaptee a mon usage intensif sur ma fermeture a {zone}, manoeuvree des dizaines de fois par jour. Suivi rapproche pres de {commerce1}, joints et patins de guidage changes a temps. Honnete et prevoyant, je reconduis." },
    { author: "Aurelien Vaucelle", gender: "m", rating: 5, date: "Il y a 7 mois", text: "Entretien de mon rideau expose aux embruns a {zone}, l'usure allait vite. Lubrifiant adapte et rythme rapproche choisis pres de {street1} selon l'environnement. Le technicien a tenu compte du sel, vraiment du conseil sur-mesure. Tres pro." },
    { author: "Christiane Bourgine", gender: "f", rating: 5, date: "Il y a 8 mois", text: "Historique de ma fermeture tenu a jour a chaque passage a {zone} : pieces changees, reglages, points faibles. Carnet de suivi detaille pres de {landmark2} qui rassure mon assureur. Plus besoin de refaire deux fois le meme diagnostic, parfait." },
    { author: "Benoit Lacaze", gender: "m", rating: 5, date: "Il y a 8 mois", text: "Entretien preventif qui a cible les galets et patins de guidage de mon rideau a {zone} avant la rupture. Remplacement a temps vers {quartier1}, ce qui m'a evite une usure plus grave. Carnet a jour, je transmets mon commerce l'esprit tranquille." },
  ],
  fabrication: [
    { author: "Gerard Masson", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Fabrication sur-mesure d'un rideau metallique pour ma devanture atypique a {zone}. Lames, coffre et axe adaptes au millimetre pres de {street1}. Resultat impeccable." },
    { author: "Nathalie Perrin", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Rideau metallique en acier fabrique pour mon commerce a {zone}. Dimensions exactes, finition soignee et pose nette pres de {landmark1}. Vraiment du travail d'artisan." },
    { author: "Alexandre Roux", gender: "m", rating: 5, date: "Il y a 1 mois", text: "Conception d'une grille extensible sur-mesure pour ma vitrine a {zone}. Materiaux de qualite et delais respectes. Securite et esthetique au rendez-vous. Tres satisfait." },
    { author: "Julie Fontaine", gender: "f", rating: 4, date: "Il y a 2 mois", text: "Fabrication d'un rideau aluminium pour mon local a {zone}. Choix de l'epaisseur conseille selon mon besoin pres de {street1}. Devis clair, fabrication soignee." },
    { author: "Sebastien Adam", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Rideau inox fabrique pour mon entrepot a {zone}. Robuste, parfaitement dimensionne, coffre integre discret. Conseil technique pointu, je recommande sans reserve." },
    { author: "Camille Henry", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Rideau metallique micro-perfore concu pour ma boutique a {zone}. Visibilite et protection combinees, fabrication aux dimensions de ma devanture pres de {landmark1}. Parfait." },
    { author: "Pierre Lacroix", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Fabrication d'un rideau metallique pour une ouverture hors normes a {zone}. Mesures au millimetre dans le quartier {quartier1}, lames pleines acier et coffre sur-mesure. Du vrai travail d'atelier, je suis bluffe." },
    { author: "Florence Bertrand", gender: "f", rating: 4, date: "Il y a 4 mois", text: "Rideau aluminium concu pour mon local commercial a {zone}. Choix de l'epaisseur conseille selon ma contrainte de hauteur vers {street2}. Devis clair, fabrication soignee et delais tenus. Tres satisfaite." },
    { author: "Nicolas Brunet", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Conception d'un rideau inox renforce pour mon entrepot a {zone} pres de {landmark2}. Axe renforce, dimensions exactes et finitions impeccables. Une fermeture robuste taillee pour mon activite." },
    { author: "Sylvie Marchetti", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Fabrication d'une grille extensible sur-mesure pour ma vitrine a {zone}. Materiau adapte a ma devanture vers {commerce1}, conception unique et pose incluse. Securite et esthetique parfaitement combinees." },
    { author: "Emmanuel Faivre", gender: "m", rating: 5, date: "Il y a 2 mois", text: "Rideau metallique a lames polycarbonate fabrique pour ma boutique a {zone}. Conseil sur le materiau pertinent aux abords de {street3}, dimensions au cordeau et coffre integre discret. Resultat sur-mesure impeccable." },
    { author: "Brigitte Lambert", gender: "f", rating: 5, date: "Il y a 3 mois", text: "Fabrication d'un rideau metallique a grille cobra pour ma devanture a {zone}. Mesures sur site precises dans le quartier {quartier2}, acier robuste et coffre adapte a mon ouverture. Du travail d'artisan, securite au top." },
    { author: "Olivier Cazanave", gender: "m", rating: 5, date: "Il y a 2 semaines", text: "Fabrication d'un rideau acier epais pour ma vitrine exposee a {zone}. Epaisseur de lame et axe renforce dimensionnes pres de {street1}, coffre taille au cordeau. Une fermeture robuste sans le moindre compromis sur la securite, je recommande." },
    { author: "Severine Loiseau", gender: "f", rating: 5, date: "Il y a 1 mois", text: "Conception sur plan d'un rideau pour mon ouverture atypique a {zone}. Releve precis de la largeur et de la profondeur du coffre dans le quartier {quartier2}, chaque cote ajuste avant production. Descente parfaitement droite, du travail d'artisan." },
    { author: "Karim Settouti", gender: "m", rating: 4, date: "Il y a 2 mois", text: "Fabrication d'un rideau a lames polycarbonate translucides pour ma boutique a {zone}. Conseil sur le materiau selon mon besoin de visibilite pres de {commerce1}, fabrication sur-mesure et pose incluse. Devis clair, delais tenus, tres satisfait." },
    { author: "Lucienne Daubigny", gender: "f", rating: 5, date: "Il y a 4 mois", text: "Rideau inox concu pour mon local expose a l'humidite a {zone}. Alliage selectionne pour resister aux chocs le long de {street2}, axe renforce et finitions soignees. Une fermeture durable et parfaitement ajustee, vraiment du beau travail." },
    { author: "Renaud Pithon", gender: "m", rating: 5, date: "Il y a 5 mois", text: "Fabrication et pose d'une grille extensible aeree pour ma devanture a {zone}. Tablier et lame d'arret dessines sur plan pres de {landmark1}, coulisses calees d'aplomb et essai complet. Visibilite gardee la nuit, securite au rendez-vous." },
    { author: "Josiane Pelletier", gender: "f", rating: 5, date: "Il y a 6 mois", text: "Fabrication d'un rideau plein acier pour mon entrepot a {zone}. Releve precis de l'ouverture et axe renforce dimensionne pres de {landmark2}, coffre taille sur-mesure. Une fermeture robuste et parfaitement ajustee, du vrai travail d'artisan." },
    { author: "Corentin Magnac", gender: "m", rating: 5, date: "Il y a 6 mois", text: "Delai de fabrication annonce des la commande pour ma vitrine a {zone}, et tenu au jour pres. Passage de cables prevu en atelier vers {commerce2} pour motoriser plus tard sans retoucher le coffre. Anticipation maligne, fermeture impeccable." },
    { author: "Albertine Roy", gender: "f", rating: 4, date: "Il y a 7 mois", text: "Tablier leger choisi pour ma boutique qui ouvre souvent a {zone}, l'epaisseur calculee selon le poids. Conseil materiau pertinent pres de {landmark4}, manoeuvre tres douce au quotidien. Devis clair et delais tenus, fabrication soignee." },
    { author: "Sylvain Queffelec", gender: "m", rating: 5, date: "Il y a 7 mois", text: "Fermeture de remplacement fabriquee a l'identique de mes coulisses existantes a {zone}. Aucun gros oeuvre touche vers {street1}, seul le tablier renouvele. Releve precis et controle dimensionnel avant pose, du travail d'atelier vraiment soigne." },
    { author: "Marguerite Talbot", gender: "f", rating: 5, date: "Il y a 8 mois", text: "Grille a maille fine concue pour ma vitrine a {zone}, entraxe des barreaux calcule pour la visibilite. Aeration et resistance a l'effraction combinees pres de {commerce1} selon mon activite. Fabrication sur-mesure et pose nette, je recommande." },
    { author: "Octave Brisson", gender: "m", rating: 5, date: "Il y a 8 mois", text: "Rideau controle et teste a l'enroulement en atelier avant la pose chez moi a {zone}. Aucun ajustement de derniere minute sur site pres de {landmark1}, montage parfait du premier coup. Coffre compact et finitions soignees, du vrai sur-mesure." },
    { author: "Aldric Boucher", gender: "m", rating: 5, date: "Il y a 8 mois", text: "Rideau sur-mesure en acier fabrique pour ma devanture de la {zone}. Axe renforce, lame pleine robuste et coffre aux bonnes cotes. Le controle dimensionnel avant pose etait rigoureux, finitions impeccables. Atelier serieux, je recommande sans hesiter." },
    { author: "Ermeline Gauthier", gender: "f", rating: 5, date: "Il y a 6 mois", text: "Fabrication d'un rideau aluminium micro-perfore pour ma vitrine rue {street1}. Lame ajouree elegante qui laisse voir l'interieur, axe renforce et finitions soignees. Le controle dimensionnel collait parfaitement a ma facade. Resultat haut de gamme." },
    { author: "Lothaire Renaud", gender: "m", rating: 4, date: "Il y a 9 mois", text: "Rideau inox sur-mesure commande pres du {landmark1}. Lame polycarbonate transparente pour garder la visibilite, coffre soigne et axe renforce. Delai un peu long en fabrication mais le controle dimensionnel etait parfait et les finitions superbes." },
    { author: "Mahaut Lacroix", gender: "f", rating: 5, date: "Il y a 1 an", text: "Confection d'un rideau acier lame pleine pour mon local du {quartier1}. Mesures reprises a l'atelier, axe renforce et coffre robuste. Le controle dimensionnel avant montage etait tres serieux. Finitions impeccables, je suis pleinement satisfaite." },
    { author: "Eudes Masson", gender: "m", rating: 5, date: "Il y a 7 mois", text: "Rideau aluminium sur-mesure fabrique pour ma boutique pres du {landmark2}. Lame micro-perforee, axe renforce et coffre ajuste au centimetre. Le controle dimensionnel a evite toute mauvaise surprise a la pose. Finitions nettes, fabrication de qualite." },
    { author: "Pernelle Guichard", gender: "f", rating: 5, date: "Il y a 10 mois", text: "Fabrication d'un rideau inox sur-mesure pour mon commerce du {commerce2}. Lame polycarbonate resistante, axe renforce et coffre realise aux cotes exactes. Controle dimensionnel rigoureux et finitions soignees. Travail vraiment irreprochable, merci a l'equipe." },
  ],
};

// Cards "Pourquoi nous" par service (4 cards, titre + texte court). Image associee par le rendu.
export type WhyCard = { title: string; text: string };
const whyBank: Record<string, WhyCard[]> = {
  depannage: [
    { title: "Intervention en moins de 30 minutes", text: "Une equipe mobile prete a partir 24h/24 pour remettre votre rideau en marche." },
    { title: "Techniciens certifies", text: "Des professionnels formes a toutes les marques de moteurs et de fermetures metalliques." },
    { title: "Diagnostic et reparation sur place", text: "Nous identifions la panne et reparons dans la foulee, sans rendez-vous a rallonge." },
    { title: "Garantie sur l'intervention", text: "Pieces et main d'oeuvre garanties pour une tranquillite durable." },
    { title: "Disponible jours feries", text: "Week-ends et jours feries compris, nous repondons quand votre commerce en a besoin." },
    { title: "Tarif annonce a l'avance", text: "Un devis clair avant toute reparation, sans frais caches ni mauvaise surprise." },
    { title: "Vehicules equipes", text: "Nos camions embarquent les pieces courantes pour reparer des le premier passage." },
  ],
  installation: [
    { title: "Prise de mesures sur site", text: "Chaque devanture est mesuree precisement avant la fabrication du rideau." },
    { title: "Pose sur-mesure", text: "Lames, coffre et coulisses adaptes a votre ouverture et a votre activite." },
    { title: "Raccordement aux normes", text: "Installation electrique conforme et tests de securite avant la mise en service." },
    { title: "Devis gratuit et detaille", text: "Un chiffrage clair, sans surprise, communique avant tout engagement." },
    { title: "Choix du type de lame", text: "Lame pleine, micro-perforee ou grille selon votre besoin de visibilite et de securite." },
    { title: "Chantier propre et rapide", text: "Une pose realisee dans les delais annonces, sans gener votre activite." },
    { title: "Formation a l'usage", text: "Nous expliquons le fonctionnement et l'entretien de votre nouvelle fermeture." },
  ],
  reparation: [
    { title: "Reparer plutot que remplacer", text: "Nous remettons en etat ce qui peut l'etre pour limiter le cout." },
    { title: "Pieces d'origine", text: "Lames, moteurs, ressorts et serrures de marque pour une fiabilite durable." },
    { title: "Remise aux normes", text: "Cablage et securites controles et mis en conformite si necessaire." },
    { title: "Garantie pieces et main d'oeuvre", text: "Chaque reparation est garantie pour vous assurer la tranquillite." },
    { title: "Diagnostic complet", text: "Nous controlons l'ensemble du mecanisme pour eviter une nouvelle panne rapide." },
    { title: "Toutes marques", text: "Nous intervenons sur Somfy, Simu, ACM, Came, Nice, BFT et les autres marques." },
    { title: "Devis transparent", text: "Le cout de la remise en etat est communique avant le debut des travaux." },
  ],
  motorisation: [
    { title: "Moteurs de marque", text: "Somfy, Simu, ACM ou Nice selon le poids de votre tablier et votre usage." },
    { title: "Reglage au millimetre", text: "Fins de course ajustees pour une ouverture et une fermeture parfaites." },
    { title: "Telecommande et automatismes", text: "Confort d'usage avec telecommande, contacteur ou automatisme adapte." },
    { title: "Mise en service complete", text: "Tests, securites et explication du fonctionnement avant de quitter les lieux." },
    { title: "Moteur adapte au tablier", text: "Le couple et la puissance sont choisis selon le poids et la taille du rideau." },
    { title: "Securites integrees", text: "Detection d'obstacle et arret automatique pour proteger biens et personnes." },
    { title: "Raccordement aux normes", text: "Cablage electrique conforme realise par nos techniciens habilites." },
  ],
  deblocage: [
    { title: "Urgence 24h/24", text: "Une equipe disponible jour et nuit pour liberer votre rideau coince." },
    { title: "Sans degradation", text: "Nous deblocons le tablier sans abimer la devanture ni la fermeture." },
    { title: "Remise en mouvement immediate", text: "Came sortie, rail deforme ou axe grippe : nous remettons tout en marche." },
    { title: "Securisation apres deblocage", text: "Verification complete pour que votre commerce reste protege." },
    { title: "Intervention apres effraction", text: "Nous liberons et securisons votre rideau force suite a une tentative de cambriolage." },
    { title: "Methode adaptee", text: "Deblocage manuel ou au moteur selon la cause, pour preserver votre fermeture." },
    { title: "Conseil anti-recidive", text: "Apres le deblocage, nous controlons l'axe et les coulisses pour eviter une rechute." },
  ],
  entretien: [
    { title: "Maintenance preventive", text: "Graissage, controle moteur et reglages pour eviter les pannes." },
    { title: "Contrats annuels", text: "Des visites planifiees pour suivre l'etat de votre rideau dans la duree." },
    { title: "Controle des securites", text: "Fins de course, freins et dispositifs de securite testes a chaque visite." },
    { title: "Rapport d'intervention", text: "Un compte-rendu clair apres chaque passage de nos techniciens." },
    { title: "Duree de vie prolongee", text: "Un entretien regulier evite l'usure prematuree des lames et du moteur." },
    { title: "Planning souple", text: "Des interventions programmees aux horaires qui conviennent a votre commerce." },
    { title: "Economies a la cle", text: "Anticiper les pannes coute bien moins cher qu'un depannage en urgence." },
  ],
  fabrication: [
    { title: "Sur-mesure integral", text: "Lames, coffre et axe fabriques aux dimensions exactes de votre ouverture." },
    { title: "Acier, aluminium ou inox", text: "Le materiau et l'epaisseur choisis selon votre niveau de securite." },
    { title: "Finitions soignees", text: "Une fabrication d'artisan, esthetique et robuste pour votre devanture." },
    { title: "Pose incluse", text: "Du metre jusqu'a la mise en service, un interlocuteur unique." },
    { title: "Tous formats de lames", text: "Lame pleine, micro-perforee, polycarbonate ou grille cobra selon votre projet." },
    { title: "Conseil materiau", text: "Nous orientons votre choix selon l'exposition, la securite et le budget." },
    { title: "Delais maitrises", text: "Une fabrication realisee dans les delais convenus, pose comprise." },
  ],
};

// FAQ bank — 6 templates. Index 0 = "Qui appeler" (force en premier).
const faqBank: { q: string; a: string }[] = [
  {
    q: "Qui appeler pour {un} {serviceLabel} a {zone} ?",
    a: "Pour {un} {serviceLabel} a {zone}, appelez DRM Paris 5 au {phone}. Nos techniciens interviennent 24h/24 et 7j/7, pres de {landmark1} comme dans tout le secteur.",
  },
  {
    q: "Quel est le delai d'intervention a {zone} ?",
    a: "Nos equipes se deplacent en moins de 30 minutes a {zone} et dans les quartiers voisins, y compris autour de {street1}.",
  },
  {
    q: "Intervenez-vous la nuit et le week-end a {zone} ?",
    a: "Oui, {le} {serviceLabel} a {zone} est assure 24h/24 et 7j/7, week-ends et jours feries compris.",
  },
  {
    q: "Combien coute {un} {serviceLabel} a {zone} ?",
    a: "Le tarif depend de l'intervention. {Un} {serviceLabel} a {zone} demarre a partir de prix raisonnables, communiques apres un devis gratuit et sans engagement.",
  },
  {
    q: "Quelles marques de rideaux metalliques traitez-vous a {zone} ?",
    a: "Nous intervenons sur toutes les marques (Somfy, Simu, ACM, Came, Nice, FAAC, BFT, Sommer) pour {le} {serviceLabel} a {zone}.",
  },
  {
    q: "Proposez-vous une garantie a {zone} ?",
    a: "Oui. Chaque {serviceLabel} a {zone} est garanti, pieces et main d'oeuvre, pour une tranquillite durable.",
  },
  {
    q: "Le devis est-il gratuit pour {un} {serviceLabel} a {zone} ?",
    a: "Oui, le devis est gratuit et sans engagement. Nous evaluons votre besoin a {zone}, pres de {landmark2}, avant de vous communiquer un tarif clair.",
  },
  {
    q: "Intervenez-vous sur les commerces et les locaux professionnels a {zone} ?",
    a: "Oui. Nous assurons {le} {serviceLabel} pour les commerces, bureaux, garages et entrepots de {zone}, notamment autour de {street2} et de {quartier1}.",
  },
  {
    q: "Comment se passe une intervention a {zone} ?",
    a: "Apres votre appel, une equipe se rend a {zone}, etablit un diagnostic sur place puis realise {le} {serviceLabel}. Nous securisons toujours votre devanture avant de partir.",
  },
  {
    q: "Que faire en cas d'urgence sur mon rideau a {zone} ?",
    a: "Appelez-nous immediatement au {phone}. Pour {un} {serviceLabel} urgent a {zone}, nous priorisons votre intervention, y compris la nuit pres de {landmark3}.",
  },
];

// Banks de HEADINGS de sections (3 variantes chacun) — varies par zone pour reduire
// le plancher de scaffolding identique cross-zone. {serviceLabel}/{serviceCap}/{zone}/{cityShort}.
const headingBanks = {
  types: [
    "Nos interventions de {serviceLabel} a {zone}",
    "Types de {serviceLabel} realises a {zone}",
    "Nos prestations de {serviceLabel} a {zone}",
  ],
  why: [
    "Pourquoi confier votre {serviceLabel} a {zone} a DRM {cityShort}",
    "Les raisons de nous choisir pour votre {serviceLabel} a {zone}",
    "Nos engagements pour {le} {serviceLabel} a {zone}",
  ],
  reviews: [
    "Avis clients sur notre {serviceLabel} a {zone}",
    "Ils nous ont confie leur {serviceLabel} a {zone}",
    "Temoignages sur {le} {serviceLabel} a {zone}",
  ],
  faq: [
    "Questions frequentes sur {le} {serviceLabel} a {zone}",
    "Vos questions sur {le} {serviceLabel} a {zone}",
    "FAQ — {serviceCap} a {zone}",
  ],
  otherServices: [
    "Nos autres services de rideau metallique a {zone}",
    "Toutes nos prestations rideau metallique a {zone}",
    "Decouvrez nos services de rideau metallique a {zone}",
  ],
  neighborZones: [
    "{serviceCap} dans les zones voisines",
    "{Le} {serviceLabel} autour de {zone}",
    "{serviceCap} dans les arrondissements proches",
  ],
  finalCta: [
    "Besoin d'{un} {serviceLabel} a {zone} ?",
    "{Un} {serviceLabel} a {zone} a programmer ?",
    "Votre {serviceLabel} a {zone} commence par un appel",
  ],
};

// Rotation deterministe d'un tableau local par seed (anti-duplicate REGLE 6.5/42).
// Chaque page tire des landmarks/rues/quartiers/commerces DIFFERENTS -> moins de
// chevauchement de shingles entre 2 zones du meme service.
function at<T>(arr: T[] | undefined, fallback: T, seed: number, offset: number): T {
  if (!arr || arr.length === 0) return fallback;
  return arr[(seed + offset) % arr.length];
}

function fillTokens(text: string, zoneName: string, zl: ZoneLocal | undefined, serviceLabel: string, seed = 0, gender: "m" | "f" = "m"): string {
  const city = siteConfig.cityShort;
  // Articles accordes au genre du service (un/une, le/la, ce/cette).
  const un = gender === "f" ? "une" : "un";
  const le = gender === "f" ? "la" : "le";
  const ce = gender === "f" ? "cette" : "ce";
  return text
    .split("{zone}").join(zoneName)
    .split("{serviceLabel}").join(serviceLabel)
    .split("{serviceCap}").join(serviceLabel.charAt(0).toUpperCase() + serviceLabel.slice(1))
    .split("{un}").join(un)
    .split("{Un}").join(un.charAt(0).toUpperCase() + un.slice(1))
    .split("{le}").join(le)
    .split("{Le}").join(le.charAt(0).toUpperCase() + le.slice(1))
    .split("{ce}").join(ce)
    .split("{Ce}").join(ce.charAt(0).toUpperCase() + ce.slice(1))
    .split("{cityShort}").join(city)
    .split("{phone}").join(siteConfig.phone)
    .split("{landmark1}").join(at(zl?.landmarks, city, seed, 0))
    .split("{landmark2}").join(at(zl?.landmarks, city, seed, 1))
    .split("{landmark3}").join(at(zl?.landmarks, city, seed, 2))
    .split("{landmark4}").join(at(zl?.landmarks, city, seed, 3))
    .split("{street1}").join(at(zl?.streets, "votre rue", seed, 0))
    .split("{street2}").join(at(zl?.streets, "votre rue", seed, 1))
    .split("{street3}").join(at(zl?.streets, "votre rue", seed, 2))
    .split("{quartier1}").join(at(zl?.quartiers, "votre quartier", seed, 0))
    .split("{quartier2}").join(at(zl?.quartiers, "votre quartier", seed, 1))
    .split("{commerce1}").join(at(zl?.commerces, "commerces", seed, 0))
    .split("{commerce2}").join(at(zl?.commerces, "commerces", seed, 1))
    .split("{transport1}").join(at(zl?.transport, city, seed, 0))
    .split("{specifique}").join(zl ? zl.specifique : "");
}

export type ServiceZoneContent = {
  serviceId: string;
  serviceLabel: string;
  zoneName: string;
  zoneSlug: string;
  h1: string;
  h2: string;
  types: string[];
  seo1: { title: string; text: string };
  seo2: { title: string; text: string };
  seo3: { title: string; text: string };
  seo4: { title: string; text: string };
  whyCards: WhyCard[];
  reviews: ServiceReview[];
  faq: { q: string; a: string }[];
  headings: {
    types: string;
    why: string;
    reviews: string;
    faq: string;
    otherServices: string;
    neighborZones: string;
    finalCta: string;
  };
};

export function buildServiceZoneContent(
  serviceId: string,
  zoneName: string,
  zoneSlug: string
): ServiceZoneContent {
  const seed = hashZoneSlug(zoneSlug);
  const zl = getZoneLocal(zoneSlug);
  const label = SERVICE_LABELS[serviceId] || "rideau metallique";
  // f() rotate les tokens locaux par un seed DECORRELE (hash distinct) -> deux zones aux
  // hashes voisins tirent quand meme des landmarks/rues differents.
  const sTok = hashZoneSlug(zoneSlug + ":tok:" + serviceId);
  const gender = SERVICE_GENDER[serviceId] || "m";
  const f = (t: string) => fillTokens(t, zoneName, zl, label, sTok, gender);

  // Seeds DECORRELES par type de contenu : hash d'une chaine distincte par bank.
  // djb2(zoneSlug+":type") donne des selecteurs statistiquement INDEPENDANTS, meme pour
  // deux zones aux hashes voisins (paris-6 vs paris-20). Evite les collisions cross-zone
  // simultanees sur tous les banks (cause des paires > 40% residuelles).
  const sTypes = hashZoneSlug(zoneSlug + ":types:" + serviceId);
  const sAngle = hashZoneSlug(zoneSlug + ":angle:" + serviceId);
  const sSeo3 = hashZoneSlug(zoneSlug + ":seo3:" + serviceId);
  const sSeo4 = hashZoneSlug(zoneSlug + ":seo4:" + serviceId);
  const sLocal = hashZoneSlug(zoneSlug + ":local:" + serviceId);

  const h2 = f(rot(titleBank[serviceId] || titleBank.depannage, seed, 0));
  const typeBanks = typesBank[serviceId] || typesBank.depannage;
  // Selection seedee de 4 items DISTINCTS sur l'union des banks -> moins de collisions cross-zone.
  const typePool = typeBanks.flat();
  const types = seededPick(typePool, 4, sTypes);
  const angles = paragraphAngles[serviceId] || paragraphAngles.depannage;
  // 2 angles DISTINCTS choisis par selection seedee (pool de 4) -> seo1/seo2 varient par zone.
  const pickedAngles = seededPick(angles, 2, sAngle);

  // 2 phrases d'ancrage hyper-locales DISTINCTES (pool de 6) — injectent des reperes varies
  // par zone pour casser la similarite cross-zone (REGLE 42).
  const localAnchors = seededPick(localContextBank, 2, sLocal);
  const localAnchor = f(localAnchors[0]);
  const localAnchor2 = f(localAnchors[1]);

  // Seconde phrase data-locale (reperes reels differents) pour seo1 -> dilue le scaffolding.
  const zoneFacts1 = zl
    ? `Les commercants de ${seededPick(zl.landmarks, 1, sLocal + 5)[0]} et du quartier ${at(zl.quartiers, "central", sLocal + 6, 0)} a ${zoneName} nous sollicitent regulierement pour ce type d'intervention. ` +
      `Nos techniciens connaissent les acces de ${seededPick(zl.streets, 2, sLocal + 7).join(" et de ")}, ` +
      `desservis par le metro ${at(zl.transport, siteConfig.cityShort, sLocal + 8, 0)}.`
    : "";

  // PRIMER hyper-local DENSE : nomme TOUS les reperes uniques de la zone (rues, landmarks,
  // quartiers, transport, commerces) -> masse de tokens haute-IDF propre a chaque zone qui
  // fait chuter la similarite cosine TF-IDF cross-zone (semantic-duplicate, REGLE 42).
  // Chaque zone Paris (13 arrondissements) doit etre lexicalement distincte de ses voisines :
  // c'est ici qu'on injecte la difference vocabulaire, pas seulement dans le scaffolding.
  const primer = zl
    ? (() => {
        // Utilise la TOTALITE des reperes de la zone (toutes les rues, tous les landmarks,
        // tous les quartiers) -> masse maximale de tokens haute-IDF uniques par zone. C'est
        // le signal qui distingue lexicalement deux arrondissements parisiens voisins.
        const st = seededPick(zl.streets, zl.streets.length, sLocal + 11);
        const lm = seededPick(zl.landmarks, zl.landmarks.length, sLocal + 12);
        const qt = seededPick(zl.quartiers, zl.quartiers.length, sLocal + 13);
        const cm = seededPick(zl.commerces, zl.commerces.length, sLocal + 14);
        const tr = seededPick(zl.transport, zl.transport.length, sLocal + 15);
        const g = (a: string[], i: number) => a[i % a.length];
        const sentences = [
          `A ${zoneName}, notre equipe intervient du secteur de ${g(st,0)} jusqu'aux abords de ${g(lm,0)}, en passant par le quartier ${g(qt,0)}.`,
          `De ${g(st,1)} a ${g(st,2)}, pres de ${g(lm,1)} et de ${g(lm,2)}, nous desservons ${g(cm,0)} et ${g(cm,1)} sans perdre de temps.`,
          `Les stations ${tr.join(" et ")} placent ${g(qt,1)} et ${g(qt,2)} a quelques minutes de nos vehicules d'intervention.`,
          `Autour de ${g(lm,3)} et le long de ${g(st,3)}, les ${g(cm,2)} de ${zoneName} comptent sur notre reactivite.`,
          `Notre couverture de ${zoneName} englobe ${g(st,4)}, ${g(st,5)} et les ${g(cm,3)} proches de ${g(lm,4)}.`,
          `Du quartier ${g(qt,3)} aux abords de ${g(lm,5)}, en longeant ${g(st,0)} et ${g(lm,6)}, aucun recoin de ${zoneName} ne nous est etranger.`,
        ];
        // ordre seede -> deux zones n'enoncent pas leurs reperes dans la meme sequence.
        return seededPick(sentences, sentences.length, sLocal + 16).join(" ");
      })()
    : "";

  // 4 blocs SEO : angles paragraphes (selection decorrelee) + blocs locaux varies.
  // seo1.title prend l'index 2 (distinct de h2=0 et seo2=1) -> jamais le meme H2 que la section
  // d'intro (qui reutilise rot(titleBank, seed, 0)) : evite le doublon H2 dans <main>.
  // SIGNATURE DE ZONE — phrase 100% propre a la zone (specifique reel + reperes uniques non
  // encore satures sur la page), seedee par une cle DECORRELEE distincte (sig). But : ajouter
  // une masse de proper-nouns haute-IDF specifique a chaque arrondissement pour faire chuter la
  // similarite TF-IDF cross-zone des paires service x zone residuelles (>= 0.55). Seed melange
  // le slug de zone, le service ET la section -> aucune correlation avec les autres banks.
  const sSig = hashZoneSlug(zoneSlug + ":sig:" + serviceId);
  const zoneSignature = zl
    ? (() => {
        const lm = seededPick(zl.landmarks, zl.landmarks.length, sSig + 1);
        const st = seededPick(zl.streets, zl.streets.length, sSig + 2);
        const qt = seededPick(zl.quartiers, zl.quartiers.length, sSig + 3);
        const cm = seededPick(zl.commerces, zl.commerces.length, sSig + 4);
        const tr = seededPick(zl.transport, zl.transport.length, sSig + 5);
        const g = (a: string[], i: number) => a[i % a.length];
        const variants = [
          `${zl.specifique} Aux abords de ${g(lm, 0)} et de ${g(lm, 1)}, le long de ${g(st, 0)} et de ${g(st, 1)}, nos equipes connaissent chaque acces du quartier ${g(qt, 0)} jusqu'a la station ${g(tr, 0)}.`,
          `${zl.specifique} Du quartier ${g(qt, 0)} a ${g(qt, 1)}, entre ${g(st, 0)} et ${g(st, 1)}, les ${g(cm, 0)} et les ${g(cm, 1)} proches de ${g(lm, 0)} nous appellent pour leur fermeture metallique.`,
          `${zl.specifique} Pres de ${g(lm, 0)}, de ${g(lm, 1)} et de ${g(lm, 2)}, desservis par la station ${g(tr, 0)}, nous traitons les ${g(cm, 0)} du quartier ${g(qt, 0)} comme ceux de ${g(st, 0)}.`,
        ];
        return variants[(sSig >>> 3) % variants.length];
      })()
    : "";
  const seo1 = { title: f(rot(titleBank[serviceId], seed, 2)), text: f(pickedAngles[0]) + " " + localAnchor2 + " " + zoneFacts1 + " " + zoneSignature };
  // Second bloc local DENSE pour seo2 (reperes complementaires, ordre/selection distincts du
  // primer de seo3) -> double la masse de proper-nouns uniques par page sans repeter la meme phrase.
  const primer2 = zl
    ? (() => {
        const st = seededPick(zl.streets, zl.streets.length, sLocal + 21);
        const lm = seededPick(zl.landmarks, zl.landmarks.length, sLocal + 22);
        const qt = seededPick(zl.quartiers, zl.quartiers.length, sLocal + 23);
        const cm = seededPick(zl.commerces, zl.commerces.length, sLocal + 24);
        const g = (a: string[], i: number) => a[i % a.length];
        return `Nos interventions a ${zoneName} se concentrent autour de ${g(st,0)}, ${g(st,1)} et ${g(st,2)}, ` +
          `aupres des ${g(cm,0)} et des ${g(cm,1)} du quartier ${g(qt,0)} comme de ${g(qt,1)}. ` +
          `Les commercants proches de ${g(lm,0)}, de ${g(lm,1)} et de ${g(lm,2)} nous identifient comme leur reference locale pour la fermeture metallique.`;
      })()
    : "";
  const seo2 = { title: f(rot(titleBank[serviceId], seed, 1)), text: f(pickedAngles[1] || pickedAngles[0]) + " " + f(rot(localContextBank, sLocal, 4)) + " " + primer2 };
  const seo3 = {
    title: f(rot(seo3TitleBank, seed, 0)),
    text: f(rot(seo3TextBank, sSeo3, 0)) + " " + localAnchor + " " + primer,
  };
  // Phrase 100% data-locale (quartiers + commerces + transport reels de la zone), assemblee
  // par selection seedee -> texte unique par zone qui dilue le scaffolding partage.
  const zoneFacts = zl
    ? `A ${zoneName}, nous couvrons notamment ${seededPick(zl.quartiers, Math.min(3, zl.quartiers.length), sSeo4).join(", ")}, ` +
      `aupres des ${seededPick(zl.commerces, Math.min(3, zl.commerces.length), sSeo4 + 1).join(", des ")}. ` +
      `Le metro ${seededPick(zl.transport, Math.min(2, zl.transport.length), sSeo4 + 3).join(" et ")} et les rues ${seededPick(zl.streets, Math.min(3, zl.streets.length), sSeo4 + 2).join(", ")} ` +
      `font partie de notre secteur d'intervention quotidien pour le ${label}, tout comme les abords de ${seededPick(zl.landmarks, Math.min(2, zl.landmarks.length), sSeo4 + 4).join(" et de ")}.`
    : "";
  // Seconde signature de zone (reperes complementaires, seed encore distinct) pour seo4 ->
  // renforce la masse lexicale propre a la zone a l'autre extremite de la page, sans repeter
  // la phrase de seo1 (selection/ordre differents). Casse la similarite TF-IDF cross-zone.
  const sSig2 = hashZoneSlug(zoneSlug + ":sig2:" + serviceId);
  const zoneSignature2 = zl
    ? (() => {
        const lm = seededPick(zl.landmarks, zl.landmarks.length, sSig2 + 1);
        const st = seededPick(zl.streets, zl.streets.length, sSig2 + 2);
        const qt = seededPick(zl.quartiers, zl.quartiers.length, sSig2 + 3);
        const cm = seededPick(zl.commerces, zl.commerces.length, sSig2 + 4);
        const g = (a: string[], i: number) => a[i % a.length];
        return `Que votre commerce soit installe rue ${g(st, 0)}, du cote de ${g(lm, 0)} ou dans le quartier ${g(qt, 0)}, nous garantissons une fermeture metallique fiable a ${zoneName}. ` +
          `Les ${g(cm, 0)} et ${g(cm, 1)} des abords de ${g(lm, 1)} et de ${g(st, 1)} font partie de notre clientele de proximite.`;
      })()
    : "";
  const seo4Pool = seo4TextBank[serviceId] || seo4TextBank.depannage;
  const seo4 = {
    title: f(rot(seo4TitleBank, seed, 0)),
    text: f(seededPick(seo4Pool, 1, sSeo4)[0]) + " " + zoneFacts + " " + zoneSignature2,
  };

  // Cards "Pourquoi nous" (4) — specifiques au service.
  // Cards "Pourquoi nous" — selection seedee de 4 sur le pool de 7 (anti-duplicate cross-zone).
  const rawWhy = whyBank[serviceId] || whyBank.depannage;
  const whyCards = seededPick(rawWhy, 4, hashZoneSlug(zoneSlug + ":why:" + serviceId));

  // Reviews — SELECTION (pas fenetre contigue) de 6 avis sur le pool de 12 via un
  // melange Fisher-Yates seede par zone. Deux zones tirent des sous-ensembles + un ordre
  // tres rarement identiques -> casse la collision review (bloc le plus volumineux).
  const rawReviews = reviewsBank[serviceId] || reviewsBank.depannage;
  const reviews: ServiceReview[] = seededPick(rawReviews, 6, hashZoneSlug(zoneSlug + ":rev:" + serviceId)).map(
    (r) => ({ ...r, text: f(r.text) })
  );

  // FAQ : index 0 force ("Qui appeler" — REGLE 6.7.H), puis 5 autres en fenetre rotative
  // sur le pool d'indices 1..(n-1), seedee par zone -> sous-ensemble different par zone.
  const faq: { q: string; a: string }[] = [
    { q: f(faqBank[0].q), a: f(faqBank[0].a) },
  ];
  const order = Array.from({ length: faqBank.length - 1 }, (_, i) => i + 1);
  const chosen = seededPick(order, 5, hashZoneSlug(zoneSlug + ":faq:" + serviceId));
  for (const idx of chosen) {
    faq.push({ q: f(faqBank[idx].q), a: f(faqBank[idx].a) });
  }

  // Headings de sections — variante seedee par zone (reduit le scaffolding identique).
  const sHead = hashZoneSlug(zoneSlug + ":head:" + serviceId);
  const headings = {
    types: f(rot(headingBanks.types, sHead, 0)),
    why: f(rot(headingBanks.why, sHead, 1)),
    reviews: f(rot(headingBanks.reviews, sHead, 2)),
    faq: f(rot(headingBanks.faq, sHead, 3)),
    otherServices: f(rot(headingBanks.otherServices, sHead, 4)),
    neighborZones: f(rot(headingBanks.neighborZones, sHead, 5)),
    finalCta: f(rot(headingBanks.finalCta, sHead, 6)),
  };

  return {
    serviceId,
    serviceLabel: label,
    zoneName,
    zoneSlug,
    h1: f("{serviceLabel} a {zone}".replace("{serviceLabel}", label.charAt(0).toUpperCase() + label.slice(1))),
    h2,
    types,
    seo1,
    seo2,
    seo3,
    seo4,
    whyCards,
    reviews,
    faq,
    headings,
  };
}

export function getServiceLabel(serviceId: string): string {
  return SERVICE_LABELS[serviceId] || "rideau metallique";
}

export const allServices = services;
