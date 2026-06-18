// Cas vecus reels d'interventions sur rideaux metalliques dans le 5e arrondissement
// de Paris et les rues voisines couvertes. Signaux "first-hand experience" (EEAT).
// Les rues sont des voies REELLES du Quartier Latin et de ses abords.

export type CaseStudy = {
  rue: string;
  date: string;
  description: string;
};

export const caseStudies: CaseStudy[] = [
  {
    rue: "Rue Mouffetard",
    date: "Mars 2026",
    description:
      "Depannage d'urgence sur la devanture d'un commerce de la Rue Mouffetard : le rideau metallique restait bloque a mi-course a l'ouverture. Notre technicien a diagnostique un axe grippe sur les paliers et des lames legerement deboitees du rail. Apres degrippage de l'axe, realignement des lames et graissage complet, le tablier est remonte sans point dur. Commerce rouvert en moins d'une heure.",
  },
  {
    rue: "Rue Monge",
    date: "Fevrier 2026",
    description:
      "Installation d'un rideau metallique neuf a lames pleines galvanisees pour une nouvelle boutique de la Rue Monge. Prise de cotes sur place, fabrication sur-mesure aux dimensions exactes de la baie, pose des coulisses laterales et reglage des fins de course. La devanture a ete equipee d'une serrure renforcee et d'un coffre acier pour un maximum de securite.",
  },
  {
    rue: "Boulevard Saint-Germain",
    date: "Janvier 2026",
    description:
      "Motorisation d'un rideau metallique jusque-la manuel pour un local du Boulevard Saint-Germain. Le gerant souhaitait abandonner la manoeuvre a sangle, devenue penible. Nous avons pose un moteur tubulaire Somfy avec commande deportee et secours manuel a manivelle. Reglage precis des butees haute et basse, test de cycle complet : ouverture et fermeture desormais silencieuses et sans effort.",
  },
  {
    rue: "Rue des Ecoles",
    date: "Decembre 2025",
    description:
      "Deblocage en urgence d'un rideau metallique coince en position fermee Rue des Ecoles, le commercant ne pouvant plus ouvrir sa librairie. Intervention rapide : la serrure avait ete forcee lors d'une tentative d'effraction, coincant le verrou dans la gache. Liberation du tablier sans degradation de la devanture, puis remplacement de la serrure par un modele anti-effraction.",
  },
  {
    rue: "Rue Geoffroy-Saint-Hilaire",
    date: "Novembre 2025",
    description:
      "Reparation d'un rideau metallique a la Rue Geoffroy-Saint-Hilaire suite a un choc qui avait voile plusieurs lames basses du tablier. Notre equipe a depose la section endommagee, remplace les lames voilees par des lames identiques et controle la tension des ressorts de l'axe. Verification du bon coulissement dans les rails et essai de plusieurs cycles : rideau remis a neuf et garanti.",
  },
];
