import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import About from "@/components/About";
import CoreValues from "@/components/CoreValues";
import Services from "@/components/Services";
import HomepageSEOBlocks from "@/components/HomepageSEOBlocks";
import WhyChooseUs from "@/components/WhyChooseUs";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { siteConfig, services, zones } from "@/config/site";

export default function Home() {
  // Schema @graph (ENFORCEMENT phase-5) : LocalBusiness + WebSite + WebPage + BreadcrumbList
  // lies entre eux par @id. Google comprend ainsi la relation entre les entites.
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteConfig.url}/#business`,
        name: siteConfig.brand,
        description: siteConfig.fullName,
        url: siteConfig.url,
        telephone: siteConfig.telephone,
        email: siteConfig.email,
        taxID: "98942786900015",
        priceRange: "$$",
        image: `${siteConfig.url}/images/${siteConfig.heroBg}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address,
          addressLocality: siteConfig.cityShort,
          postalCode: siteConfig.postalCode,
          addressRegion: siteConfig.region,
          addressCountry: "FR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.geo.latitude,
          longitude: siteConfig.geo.longitude,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: siteConfig.rating,
          reviewCount: siteConfig.ratingCount,
        },
        areaServed: zones.map((z) => ({ "@type": "City", name: z.name })),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.brand,
        publisher: { "@id": `${siteConfig.url}/#business` },
        inLanguage: "fr-FR",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/?s={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/#webpage`,
        url: `${siteConfig.url}/`,
        name: siteConfig.fullName,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#business` },
        inLanguage: "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteConfig.url}/` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <About />
        <CoreValues />
        <Services />
        {/* 4 blocs SEO texte+image (REGLE 4.5) entre Services et la suite */}
        <HomepageSEOBlocks />
        <WhyChooseUs />
        <Projects />
        <Process />
        <Testimonials />
        <Pricing />
        <Blog />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
