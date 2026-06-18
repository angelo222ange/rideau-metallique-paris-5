// Rotation d'images par zone pour eviter la duplication visuelle entre pages zone.
// Rempli/affine en Phase 4. Toutes refs en LOWERCASE strict.
import { realisations, secteurs, interventionScenes } from "@/lib/image-catalog";

const POOL = [...realisations, ...secteurs, ...interventionScenes];

function seed(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

export function zoneImageSet(zoneSlug: string, count = 4): string[] {
  const start = seed(zoneSlug) % POOL.length;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push("/images/gallery/" + POOL[(start + i) % POOL.length]);
  }
  return out;
}

export const zoneImages: Record<string, string[]> = {};
