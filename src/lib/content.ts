import { siteConfig, services, zones } from "@/config/site";

interface ReplacementMap {
  [key: string]: string;
}

export function replaceVariables(
  text: string,
  zone?: string,
  zonePostal?: string
): string {
  const replacements: ReplacementMap = {
    "{name}": siteConfig.fullName,
    "{phone}": siteConfig.phone,
    "{phoneLink}": siteConfig.phoneLink,
    "{email}": siteConfig.email,
    "{city}": siteConfig.city,
    "{cityShort}": siteConfig.cityShort,
    "{postalCode}": siteConfig.postalCode,
    "{department}": siteConfig.department,
    "{departmentCode}": siteConfig.departmentCode,
    "{region}": siteConfig.region,
    "{address}": siteConfig.address,
    "{domain}": siteConfig.domain,
    "{url}": siteConfig.url,
    "{experience}": siteConfig.experience,
    "{delai}": siteConfig.delai,
    "{rating}": siteConfig.rating,
    "{interventions}": siteConfig.interventions,
  };

  if (zone) {
    replacements["{zone}"] = zone;
  }
  if (zonePostal) {
    replacements["{zonePostal}"] = zonePostal;
  }

  let result = text;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.split(key).join(value);
  }

  return result;
}

export function getZoneBySlug(slug: string) {
  return zones.find((z) => z.slug === slug);
}

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug || s.id === slug);
}

export function generateSlug(service: string, zone: string): string {
  return `${service}-${zone}`;
}

export function parseSlug(
  slug: string
): { serviceSlug: string; zoneSlug: string } | null {
  for (const service of services) {
    for (const zone of zones) {
      const expected = `${service.slug}-${zone.slug}`;
      if (slug === expected) {
        return { serviceSlug: service.slug, zoneSlug: zone.slug };
      }
    }
  }
  return null;
}
