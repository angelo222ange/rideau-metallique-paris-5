import { getZoneLocal } from "@/lib/zone-local-data";

type Props = {
  serviceLabel: string;
  zoneName: string;
  zoneSlug: string;
  image?: string;
};

export default function ServiceZoneSpecific({ serviceLabel, zoneName, zoneSlug, image }: Props) {
  const zl = getZoneLocal(zoneSlug);
  if (!zl) return null;

  return (
    <section style={{ background: "#F5F3EC", padding: "72px 30px" }} className="section">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <span style={{ display: "inline-block", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9A24B", marginBottom: 12 }}>
          Intervention locale
        </span>
        <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 30, fontWeight: 600, color: "#102228", marginBottom: 24 }}>
          {serviceLabel.charAt(0).toUpperCase() + serviceLabel.slice(1)} a {zoneName} : un service de proximite
        </h2>
        <div className="seo-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4A5A60" }}>
            {zl.specifique} Nos techniciens connaissent chaque rue et chaque type de commerce du
            secteur de {zoneName}, ce qui leur permet d&apos;intervenir vite et juste pour le {serviceLabel}.
          </p>
          {image && (
            <img
              src={image}
              alt={`${serviceLabel} a ${zoneName}`}
              title={`Intervention locale a ${zoneName}`}
              loading="lazy"
              decoding="async"
              width={560}
              height={340}
              style={{ width: "100%", height: 340, objectFit: "cover", borderRadius: 12 }}
            />
          )}
        </div>

        <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#102228", marginBottom: 14 }}>
              Rues commercantes desservies a {zoneName}
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {zl.streets.map((s) => (
                <li key={s} style={{ fontSize: 15, color: "#4A5A60", display: "flex", gap: 8 }}>
                  <span style={{ color: "#C9A24B" }}>—</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#102228", marginBottom: 14 }}>
              Points de repere a proximite
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {zl.landmarks.map((l) => (
                <li key={l} style={{ fontSize: 15, color: "#4A5A60", display: "flex", gap: 8 }}>
                  <span style={{ color: "#C9A24B" }}>—</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#102228", marginBottom: 14 }}>
            Quartiers et commerces couverts
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[...zl.quartiers, ...zl.commerces].map((q) => (
              <span
                key={q}
                style={{
                  fontSize: 14,
                  color: "#04323F",
                  background: "#FFFFFF",
                  border: "1px solid #E2DCD0",
                  borderRadius: 1000,
                  padding: "8px 16px",
                }}
              >
                {q}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {zl.transport.map((t) => (
            <span key={t} style={{ fontSize: 13, color: "#4A5A60" }}>
              Metro/Gare : {t}
              {"  "}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
