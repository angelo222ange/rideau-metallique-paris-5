type Props = {
  lat: number;
  lng: number;
  zoneName: string;
  postal?: string;
};

export default function ServiceZoneMap({ lat, lng, zoneName, postal }: Props) {
  const d = 0.012;
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  // Lien Google Maps (centre sur les coordonnees de la zone) — affiche sous la carte OSM.
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2DCD0" }}>
      <iframe
        title={`Zone d'intervention rideau metallique a ${zoneName}${postal ? " " + postal : ""}`}
        src={src}
        style={{ width: "100%", height: 320, border: 0 }}
        loading="lazy"
      />
      <div style={{ background: "#FFFFFF", padding: "12px 16px", borderTop: "1px solid #E2DCD0" }}>
        <a
          href={gmaps}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 14, fontWeight: 600, color: "#04323F" }}
        >
          Voir notre zone d&apos;intervention a {zoneName}{postal ? " " + postal : ""} sur Google Maps
        </a>
      </div>
    </div>
  );
}
