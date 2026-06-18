import { siteConfig } from "@/config/site";

interface Props {
  pageName: string;
  pageUrl: string;
  breadcrumb?: { name: string; url: string }[];
}

export default function StaticPageJsonLd({ pageName, pageUrl, breadcrumb }: Props) {
  const items =
    breadcrumb && breadcrumb.length > 0
      ? breadcrumb
      : [
          { name: "Accueil", url: `${siteConfig.url}/` },
          { name: pageName, url: pageUrl },
        ];
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: pageName,
    url: pageUrl,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.brand,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brand,
      telephone: siteConfig.telephone,
      email: siteConfig.email,
    },
  };
  const bc = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
    </>
  );
}
