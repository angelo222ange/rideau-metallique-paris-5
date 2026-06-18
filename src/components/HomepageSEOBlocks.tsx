import { siteConfig } from "@/config/site";

type Block = {
  tag: string;
  title: string;
  paragraphs: string[];
  image: string;
  alt: string;
  cta: { label: string; href: string };
  reversed: boolean;
  bg: string;
};

const blocks: Block[] = [
  {
    tag: "Notre expertise",
    title: "Specialiste du rideau metallique a Paris 5e arrondissement",
    paragraphs: [
      "Au coeur du <strong>Quartier Latin</strong>, entre la Sorbonne, le Pantheon et le Jardin des Plantes, le 5e arrondissement de Paris concentre des centaines de commerces, librairies, restaurants et boutiques dont la securite repose sur un <strong>rideau metallique</strong> fiable. Nos techniciens connaissent les contraintes de ces devantures anciennes et exigeantes.",
      "Forts d'une <strong>longue experience</strong> du terrain, nous assurons le <strong>depannage de rideau metallique</strong> 24h/24 et 7j/7. Une lame voilee, un moteur silencieux ou une serrure forcee : nous diagnostiquons la panne sur place et intervenons dans la foulee, sans immobiliser votre activite plus que necessaire.",
      "Chaque intervention est menee avec des pieces de marque et garantie. Que votre commerce se trouve rue Mouffetard, boulevard Saint-Michel ou pres de la place Maubert, notre equipe se deplace en moins de 30 minutes pour remettre votre fermeture en marche.",
    ],
    image: "/images/gallery/depannage-rideau-metallique-rm-drm-france.webp",
    alt: "Technicien DRM en depannage de rideau metallique a Paris 5e",
    cta: { label: "Appeler maintenant", href: "tel:+33184163181" },
    reversed: false,
    bg: "#FFFFFF",
  },
  {
    tag: "7 services",
    title: "Une chaine de valeur complete pour votre rideau metallique",
    paragraphs: [
      "De la <strong>fabrication sur-mesure</strong> a l'<strong>entretien preventif</strong>, nous couvrons l'ensemble du cycle de vie d'un rideau metallique. <strong>Depannage</strong>, <strong>installation</strong>, <strong>reparation</strong>, <strong>motorisation</strong>, <strong>deblocage</strong>, entretien et fabrication : sept metiers maitrises par une seule equipe a Paris 5e.",
      "Cette polyvalence vous evite de multiplier les prestataires. Le technicien qui depanne votre rideau peut aussi le motoriser, remplacer ses lames ou programmer un contrat d'entretien annuel. Vous gagnez du temps et vous beneficiez d'un interlocuteur unique qui connait votre installation.",
      "Pour les commerces du 5e comme pour les locaux des arrondissements voisins, nous adaptons la prestation a votre fermeture : lames pleines, micro-perforees, polycarbonate transparent ou grille extensible. Chaque solution repond a un besoin precis de securite et de visibilite.",
    ],
    image: "/images/gallery/realisation-rideau-metallique-lame-pleine-industriel-france.webp",
    alt: "Installation de rideau metallique sur-mesure a Paris 5e",
    cta: { label: "Voir nos zones", href: "/zones/" },
    reversed: true,
    bg: "#F5F3EC",
  },
  {
    tag: "Marques partenaires",
    title: "Des pieces de qualite : Somfy, Simu, ACM, Came",
    paragraphs: [
      "Nous intervenons sur toutes les grandes marques de motorisation et de fermeture : <strong>Somfy</strong>, <strong>Simu</strong>, <strong>ACM</strong>, <strong>Came</strong>, <strong>Nice</strong>, FAAC, BFT et Sommer. Cette compatibilite garantit que votre rideau metallique a Paris 5e est repare avec des composants d'origine, durables et conformes.",
      "Un moteur central ACM, un moteur tubulaire Simu ou une automatisation Somfy n'ont pas les memes contraintes de pose et de reglage. Nos techniciens maitrisent chaque technologie et choisissent la piece adaptee a votre tablier, qu'il pese 80 ou 300 kilos.",
      "La qualite des pieces conditionne la longevite de la reparation. Plutot que des composants generiques, nous privilegions des references eprouvees qui assurent un fonctionnement silencieux et sans a-coup pendant des annees, meme en usage intensif quotidien.",
    ],
    image: "/images/gallery/raccordement-rideau-metallique-drm.webp",
    alt: "Motorisation de rideau metallique avec pieces de marque a Paris 5e",
    cta: { label: "Demander un devis", href: "/contact/" },
    reversed: false,
    bg: "#FFFFFF",
  },
  {
    tag: "Notre engagement",
    title: "Transparence, garantie et disponibilite 24h/24",
    paragraphs: [
      "La confiance se construit sur la clarte. Avant chaque intervention sur votre rideau metallique a Paris 5e, nous etablissons un <strong>devis gratuit</strong> et sans engagement. Aucune surprise sur la facture : vous savez ce que vous payez et pourquoi.",
      "Chaque reparation et chaque installation sont <strong>garanties</strong>, pieces et main d'oeuvre. Si un probleme survient apres notre passage, nous revenons. Cette garantie reflete la confiance que nous accordons a notre propre travail et au materiel que nous posons.",
      "Enfin, une panne de rideau metallique ne previent jamais. C'est pourquoi nous restons joignables <strong>24h/24 et 7j/7</strong>, week-ends et jours feries compris. Un seul numero, une equipe locale, et l'assurance de retrouver une devanture securisee au plus vite.",
    ],
    image: "/images/gallery/realisation-rideau-metallique-lame-pleine-boulangerie-france.webp",
    alt: "Rideau metallique securise sur commerce a Paris 5e",
    cta: { label: "Appeler 24h/24", href: "tel:+33184163181" },
    reversed: true,
    bg: "#F5F3EC",
  },
];

export default function HomepageSEOBlocks() {
  return (
    <div>
      {blocks.map((b, i) => (
        <section key={i} style={{ background: b.bg, padding: "80px 30px" }} className="section">
          <div
            className="seo-row"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "center",
              direction: b.reversed ? "rtl" : "ltr",
            }}
          >
            <div style={{ direction: "ltr" }}>
              <span style={{ display: "inline-block", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9A24B", marginBottom: 14 }}>
                {b.tag}
              </span>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 34, fontWeight: 600, color: "#102228", marginBottom: 20, lineHeight: 1.2 }}>
                {b.title}
              </h2>
              {b.paragraphs.map((p, j) => (
                <p
                  key={j}
                  style={{ fontSize: 16, lineHeight: 1.7, color: "#4A5A60", marginBottom: 14 }}
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
              <a href={b.cta.href} className="btn-primary" style={{ marginTop: 10 }}>
                {b.cta.label}
              </a>
            </div>
            <div style={{ direction: "ltr" }}>
              <img
                src={b.image}
                alt={b.alt}
                title={b.alt}
                loading="eager"
                decoding="async"
                style={{ width: "100%", height: 520, objectFit: "cover", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
