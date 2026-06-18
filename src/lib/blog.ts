export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  content: string[];
  // H2 keyword-bearing inseres AVANT le paragraphe d'index donne (cle = index dans content).
  headings?: Record<number, string>;
};

export const posts: Post[] = [
  {
    slug: "entretien-rideau-metallique-paris-5",
    title: "Entretien de rideau metallique : nos conseils Paris 5e",
    excerpt:
      "Pourquoi et comment entretenir votre rideau metallique pour eviter les pannes dans le Quartier Latin et tout le 5e arrondissement de Paris.",
    image: "/images/gallery/entretien-rideau-metallique-drm-france.webp",
    date: "2026-06-18",
    content: [
      "Un rideau metallique bien entretenu tombe rarement en panne. Dans le 5e arrondissement de Paris, ou les commerces de la Rue Mouffetard, de la Rue Monge et du Boulevard Saint-Germain ouvrent et ferment leur devanture chaque jour, la fermeture metallique encaisse des centaines de cycles par mois. Un graissage regulier des coulisses, un controle du moteur et une verification des securites prolongent considerablement la duree de vie de l'installation. A l'inverse, un rideau neglige finit toujours par se bloquer, souvent au pire moment : un samedi matin de forte affluence ou tard le soir, au moment de fermer.",
      "Pourquoi l'entretien est-il aussi important pour un rideau metallique de commerce ? Parce que cet equipement combine de la mecanique (axe, ressorts, lames, coulisses), de l'electricite (moteur tubulaire, boitier de commande, fins de course) et des elements de securite (serrure, verrous, parachute). Chacun de ces composants s'use a son rythme. Une lame legerement deboitee, un ressort detendu ou un palier grippe ne se voient pas a l'oeil nu, mais ils fragilisent l'ensemble du tablier. Un controle preventif permet de detecter ces signes avant qu'ils ne provoquent une panne immobilisante.",
      "Quels sont les gestes d'entretien a realiser regulierement ? Le premier est le nettoyage et le graissage des coulisses laterales, dans lesquelles le tablier coulisse a chaque manoeuvre. La poussiere, les depots et les microcorps etrangers creent des points durs qui forcent le moteur. Le deuxieme geste consiste a controler l'equilibrage de l'axe et la tension des ressorts : un rideau correctement equilibre ne tire ni ne force lors de la remontee. Le troisieme concerne les fins de course du moteur, qui doivent etre reglees au millimetre pour que le tablier s'arrete exactement au bon endroit, en haut comme en bas.",
      "Il ne faut pas oublier la partie securite. La serrure et les verrous d'un rideau metallique sont des cibles privilegiees lors des tentatives d'effraction. Un controle annuel permet de verifier que le mecanisme fonctionne sans point dur, que le cylindre n'est pas force et que le coffre acier protege correctement l'axe. Sur les installations recentes, le dispositif parachute (qui bloque la chute du tablier en cas de rupture) doit egalement etre teste. Ce sont des elements que seul un technicien specialise peut controler en toute securite, car ils mettent en jeu des pieces sous tension.",
      "A quelle frequence faire entretenir son rideau metallique ? Nous recommandons une visite d'entretien preventive au moins une fois par an pour un commerce a usage courant, et deux fois par an pour les fermetures sollicitees intensement (restauration, alimentation, locaux ouverts tard). Cette visite comprend le graissage complet, le controle des fins de course, la verification des securites, le reglage du tablier et un essai de plusieurs cycles d'ouverture et de fermeture. Le technicien remplace au passage les petites pieces d'usure (joints, patins, sangles) avant qu'elles ne lachent.",
      "Quels signes doivent vous alerter entre deux entretiens ? Un bruit anormal (grincement, claquement, frottement) au moment de la manoeuvre, un tablier qui descend de travers, un moteur qui peine ou qui chauffe, un point dur a mi-course, ou une telecommande qui repond mal. Ces symptomes traduisent presque toujours un debut d'usure que l'on peut corriger rapidement. Plus on attend, plus la reparation devient lourde : une simple lame deboitee reparee a temps coute bien moins cher qu'un tablier complet a remplacer apres un grippage.",
      "Faut-il un contrat d'entretien ? Pour un commerce qui depend de l'ouverture quotidienne de sa devanture, un contrat d'entretien presente un vrai interet : il garantit des visites planifiees, une priorite d'intervention en cas d'urgence et un suivi de l'etat de l'installation dans le temps. Nous proposons des formules adaptees aux commerces du 5e arrondissement, que vous soyez une petite boutique du Quartier Latin ou un local plus vaste pres du Jardin des Plantes. Le contrat n'est jamais une obligation : un entretien ponctuel reste possible et toujours precede d'un devis gratuit.",
      "En resume, entretenir son rideau metallique, c'est investir quelques dizaines de minutes par an pour eviter des heures de fermeture forcee et des reparations couteuses. Nos techniciens se deplacent dans tout le 5e arrondissement de Paris et les arrondissements voisins pour realiser ces controles. Un devis gratuit vous est remis avant toute intervention, et la majorite des reglages sont effectues sur place, sans immobiliser votre commerce. N'attendez pas la premiere panne : un rideau metallique entretenu, c'est une devanture qui s'ouvre et se ferme sans surprise, tous les jours de l'annee.",
    ],
    headings: {
      1: "Pourquoi l'entretien d'un rideau metallique est essentiel a Paris 5e",
      3: "Les gestes d'entretien d'un rideau metallique de commerce",
      5: "A quelle frequence entretenir son rideau metallique a Paris 5e",
    },
  },
  {
    slug: "motorisation-rideau-metallique-commerce",
    title: "Motoriser son rideau metallique de commerce a Paris 5e",
    excerpt:
      "Confort, securite et gain de temps : tous les avantages de la motorisation d'un rideau metallique pour un commerce parisien du 5e arrondissement.",
    image: "/images/gallery/raccordement-rideau-metallique-drm.webp",
    date: "2026-06-18",
    content: [
      "Manoeuvrer un rideau metallique a la main, plusieurs fois par jour, est fatigant et expose la fermeture a une usure prematuree. Dans le 5e arrondissement de Paris, beaucoup de commerces fonctionnent encore avec un rideau a sangle ou a manivelle, herite de l'amenagement d'origine du local. La motorisation apporte un confort immediat, securise l'ouverture comme la fermeture, et evite au commercant de forcer chaque matin et chaque soir. C'est l'une des interventions les plus demandees par les boutiques de la Rue Monge, de la Rue Mouffetard et des abords de la Sorbonne.",
      "Pourquoi motoriser un rideau metallique manuel ? D'abord pour le confort : une simple pression sur une telecommande ou un boitier a cle suffit a ouvrir ou fermer la devanture, sans effort physique. Ensuite pour la securite : un rideau motorise se ferme rapidement et integralement, sans laisser un interstice par lequel un intrus pourrait s'introduire. Enfin pour la durabilite : une manoeuvre motorisee est reguliere et controlee, alors qu'une manoeuvre manuelle a sangle provoque des a-coups qui deboitent les lames et fatiguent l'axe au fil du temps.",
      "Quels types de moteurs existe-t-il pour un rideau metallique de commerce ? Le plus courant est le moteur tubulaire, qui s'installe a l'interieur de l'axe d'enroulement et reste totalement invisible. Pour les tabliers lourds ou de grande dimension, on opte pour un moteur central ou lateral, plus puissant. Le choix depend du poids du tablier, de sa largeur, de la hauteur de la baie et de la frequence d'utilisation. Un rideau de pharmacie ou d'alimentation, manoeuvre de nombreuses fois par jour, n'a pas les memes besoins qu'une boutique ouverte six jours sur sept.",
      "Quelles marques de motorisation privilegier ? Nous travaillons avec des references reconnues du marche comme Somfy, Simu, ACM, Came et Nice. Ces marques offrent des moteurs fiables, des pieces detachees disponibles dans la duree et une compatibilite avec les automatismes modernes. Choisir une motorisation eprouvee, c'est s'assurer de pouvoir entretenir et reparer son installation pendant des annees, sans se retrouver bloque avec un materiel exotique introuvable. Nous conseillons toujours la marque la mieux adaptee a la configuration reelle du local, jamais la plus chere par principe.",
      "Comment se deroule l'installation d'une motorisation ? Notre technicien commence par etudier le rideau metallique sur place : etat du tablier, type d'axe, dimensions, alimentation electrique disponible. Il verifie que la mecanique existante est saine, car il est inutile de motoriser un tablier deja fatigue. Vient ensuite la pose du moteur a l'interieur de l'axe, le raccordement electrique, l'installation du boitier de commande et le reglage precis des butees haute et basse. L'intervention se termine par un test de cycle complet pour valider que l'ouverture et la fermeture sont silencieuses et sans point dur.",
      "Que se passe-t-il en cas de coupure de courant ? C'est une question essentielle pour un commerce : il faut toujours pouvoir ouvrir ou fermer, meme sans electricite. Toute motorisation que nous posons est equipee d'un dispositif de secours manuel, generalement une manivelle ou un treuil, qui permet de manoeuvrer le rideau metallique en cas de panne de courant. Le commercant n'est donc jamais piege, ni a l'interieur, ni avec une devanture ouverte. C'est un point que nous expliquons et testons systematiquement lors de la mise en service.",
      "Quels equipements complementaires peut-on ajouter ? Une motorisation peut etre completee par une telecommande multicanal, un boitier a cle exterieur, un detecteur d'obstacle qui stoppe la descente en cas de presence, ou encore un systeme de fermeture programmee. Pour les commercants qui souhaitent piloter leur rideau a distance, certaines motorisations acceptent des modules connectes. Tous ces equipements sont optionnels : l'essentiel reste une motorisation fiable, bien dimensionnee et correctement reglee, qui repond aux besoins reels du commerce sans le surcharger d'options inutiles.",
      "Combien de temps dure une installation et quel entretien prevoir ? La pose d'une motorisation sur un rideau metallique existant prend generalement une demi-journee, parfois moins si l'axe est facilement accessible. Une fois motorise, le rideau demande un entretien leger mais regulier : graissage des coulisses, controle des fins de course et verification du secours manuel une fois par an. Nos techniciens etudient gratuitement votre rideau metallique dans le 5e arrondissement de Paris et vous remettent un devis clair avant toute intervention. Motoriser sa devanture, c'est gagner en confort, en securite et en serenite, chaque jour de l'annee.",
    ],
    headings: {
      1: "Pourquoi motoriser un rideau metallique de commerce a Paris 5e",
      3: "Quelles marques de motorisation de rideau metallique choisir",
      5: "Motorisation de rideau metallique et coupure de courant",
    },
  },
  {
    slug: "rideau-metallique-bloque-que-faire",
    title: "Rideau metallique bloque : que faire en urgence ?",
    excerpt:
      "Les bons reflexes quand votre rideau metallique reste coince, ouvert ou ferme, dans le 5e arrondissement de Paris.",
    image: "/images/gallery/rideau-metallique-bloque-depannage-rideau-metallique.webp",
    date: "2026-06-18",
    content: [
      "Un rideau metallique coince ouvert laisse votre commerce sans protection ; coince ferme, il vous empeche d'ouvrir et de travailler. Dans les deux cas, la situation est urgente et stressante, surtout dans un arrondissement aussi anime que le 5e, ou les commerces de la Rue Mouffetard, de la Rue des Ecoles et du Boulevard Saint-Germain ne peuvent pas se permettre de rester fermes. Le premier reflexe a adopter est simple mais essentiel : ne pas forcer. Insister sur un tablier bloque aggrave presque toujours le probleme et peut transformer une reparation simple en remplacement complet.",
      "Pourquoi ne faut-il jamais forcer un rideau metallique bloque ? Parce que la cause du blocage est souvent mecanique : une lame est sortie de son rail, un palier a grippe, un ressort a lache ou la serrure coince le tablier. Si vous tirez ou poussez de toutes vos forces, vous risquez de tordre davantage les lames, de fausser les coulisses ou de casser des pieces encore intactes. Un rideau qui pouvait etre debloque en vingt minutes par un technicien se retrouve alors avec un tablier voile a remplacer. La regle d'or : arreter la manoeuvre des le premier point dur anormal.",
      "Quelles sont les causes les plus frequentes d'un rideau metallique bloque ? La premiere est la lame deboitee : a force de manoeuvres, une lame sort de la coulisse laterale et coince tout le tablier. La deuxieme est le moteur grippe ou en panne, qui ne parvient plus a entrainer l'axe. La troisieme est la serrure bloquee, souvent apres une tentative d'effraction qui a force le verrou dans la gache. La quatrieme est une simple coupure d'alimentation electrique. Enfin, sur les installations anciennes, un ressort detendu ou casse desequilibre l'axe et rend la manoeuvre impossible.",
      "Comment reagir si le rideau est bloque a l'ouverture, en position fermee ? C'est la situation la plus penalisante : impossible d'ouvrir le commerce. Verifiez d'abord que ce n'est pas une simple coupure de courant en testant l'eclairage du local. Si le rideau est motorise, cherchez le dispositif de secours manuel (manivelle ou treuil) qui permet parfois de degager le tablier. Si rien ne bouge, n'insistez pas : appelez un depanneur. Un technicien specialise dispose des outils pour liberer le tablier sans abimer la devanture, meme lorsque la serrure a ete forcee.",
      "Et si le rideau est bloque a la fermeture, en position ouverte ? Le danger est alors la securite : votre commerce reste expose, surtout en fin de journee ou la nuit. Ne quittez jamais le local en laissant le rideau ouvert si vous pouvez l'eviter. Tentez de localiser l'origine du blocage (lame coincee, obstacle dans la coulisse, moteur qui ne repond pas) sans forcer. Un depannage d'urgence permet generalement de fermer la devanture rapidement et de securiser le local en attendant une reparation definitive si necessaire. La priorite est de retrouver une fermeture fonctionnelle.",
      "Comment se deroule un depannage de rideau metallique bloque ? Le technicien commence par un diagnostic precis : il identifie la cause exacte du blocage avant toute manipulation. Selon le cas, il replace la lame deboitee, libere la serrure forcee, debloque le moteur ou remplace la piece defaillante. L'objectif est toujours de liberer le tablier sans degradation de la devanture. Une fois le rideau debloque, il controle l'ensemble de l'installation (coulisses, axe, fins de course, securites) pour s'assurer que le probleme ne se reproduira pas immediatement, puis il teste plusieurs cycles complets.",
      "Peut-on prevenir les blocages d'un rideau metallique ? En grande partie, oui. La plupart des blocages sont la consequence d'une usure non traitee : une coulisse encrassee, un ressort fatigue ou une serrure jamais entretenue finissent toujours par lacher. Un entretien preventif annuel, comprenant le graissage des rails, le controle des fins de course et la verification des securites, reduit fortement le risque de blocage. C'est particulierement vrai pour les commerces du 5e arrondissement, ou les devantures sont manoeuvrees intensement et exposees a la poussiere de la rue.",
      "Que faire concretement face a un rideau metallique bloque dans le 5e ? Gardez votre calme, ne forcez pas, securisez le local si le rideau est reste ouvert, et faites appel a un depanneur specialise. Nos equipes interviennent 24h/24 et 7j/7 dans le 5e arrondissement de Paris et les arrondissements voisins pour debloquer votre rideau metallique en urgence. Nous arrivons rapidement, diagnostiquons la panne sur place et reparons dans la grande majorite des cas en une seule intervention. Un devis vous est presente avant tout depannage, pour que vous sachiez exactement ce que vous payez avant que nous commencions.",
    ],
    headings: {
      1: "Pourquoi ne jamais forcer un rideau metallique bloque",
      3: "Rideau metallique bloque a l'ouverture dans le 5e : que faire",
      5: "Comment se deroule un depannage de rideau metallique bloque",
    },
  },
];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
