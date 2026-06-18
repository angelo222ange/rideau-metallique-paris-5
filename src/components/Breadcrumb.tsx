import Link from "next/link";

export type Crumb = { name: string; href?: string };

/**
 * Fil d'Ariane VISIBLE (UX + coherence avec le schema BreadcrumbList JSON-LD).
 * Rendu sur chaque page interne, juste avant le H1. Le dernier item est la page
 * courante (sans lien). `dark` adapte la couleur pour les hero sombres.
 */
export default function Breadcrumb({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  const color = dark ? "rgba(255,255,255,0.85)" : "#4A5A60";
  return (
    <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color, marginBottom: 14 }}>
      {items.map((c, i) => (
        <span key={i}>
          {c.href ? (
            <Link href={c.href} style={{ color }}>
              {c.name}
            </Link>
          ) : (
            <span>{c.name}</span>
          )}
          {i < items.length - 1 ? " / " : ""}
        </span>
      ))}
    </nav>
  );
}
