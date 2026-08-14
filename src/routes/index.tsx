import { createFileRoute } from "@tanstack/react-router";
import LaBomba from "@/components/labomba/LaBomba";
import { BUSINESS } from "@/components/labomba/data";
import ogImage from "@/assets/gallery/6.jpg.asset.json";

const SITE_URL = "https://fiesta-landing-maker.lovable.app";
const OG_IMAGE = `${SITE_URL}${ogImage.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "La Bomba LLC — Birria, Asada, Pastor & Carnitas · El Paso, TX" },
      {
        name: "description",
        content:
          "La Bomba LLC — former food truck, now brick and mortar in El Paso, TX. Bomb birria, asada, pastor, carnitas, loaded fries, quesatacos & more. 4.8★ on DoorDash.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "La Bomba LLC — El Paso, TX" },
      {
        property: "og:description",
        content:
          "Bomb birria, asada, pastor & carnitas in El Paso, TX. Open 11:00 AM – 9:55 PM. 4.8★ (500+ ratings).",
      },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: BUSINESS.name,
          description: BUSINESS.description,
          url: `${SITE_URL}/`,
          image: OG_IMAGE,
          hasMenu: `${SITE_URL}/menu`,
          servesCuisine: BUSINESS.cuisine,
          priceRange: BUSINESS.priceRange,
          telephone: BUSINESS.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: "1793 N Zaragoza Rd",
            addressLocality: "El Paso",
            addressRegion: "TX",
            postalCode: "79936",
            addressCountry: "US",
          },
          openingHours: "Mo-Su 11:00-21:55",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: BUSINESS.rating,
            ratingCount: 500,
          },
        }),
      },
    ],
  }),

  component: Index,
});

function Index() {
  return <LaBomba />;
}
