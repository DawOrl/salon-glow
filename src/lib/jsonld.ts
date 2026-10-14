import { salon } from "./salon";
import { SITE_URL } from "./site";
import { salonRating } from "@/data/reviews";
import type { Service, ServiceCategory } from "./types";

const dayMap: Record<string, string> = {
  Pon: "Monday",
  Wt: "Tuesday",
  Śr: "Wednesday",
  Czw: "Thursday",
  Pt: "Friday",
  Sob: "Saturday",
  Nd: "Sunday",
};

function openingHoursSpec() {
  return salon.openingHours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayMap[h.day],
      opens: h.open,
      closes: h.close,
    }));
}

/** Dane strukturalne salonu (lokalne SEO): @type HairSalon. */
export function salonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${SITE_URL}/#salon`,
    name: salon.name,
    image: `${SITE_URL}/opengraph-image.png`,
    url: SITE_URL,
    telephone: salon.phone,
    email: salon.email,
    priceRange: salon.priceRange,
    currenciesAccepted: "PLN",
    address: {
      "@type": "PostalAddress",
      streetAddress: salon.address.street,
      addressLocality: salon.address.city,
      postalCode: salon.address.postalCode,
      addressCountry: salon.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: salon.geo.lat,
      longitude: salon.geo.lng,
    },
    openingHoursSpecification: openingHoursSpec(),
    sameAs: Object.values(salon.socials).filter(Boolean),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: salonRating.average,
      reviewCount: salonRating.total,
    },
  };
}

/** Dane strukturalne usługi: @type Service + Offer. */
export function serviceJsonLd(service: Service, category?: ServiceCategory) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    serviceType: category?.name,
    url: `${SITE_URL}/uslugi/${service.slug}`,
    provider: { "@type": "HairSalon", name: salon.name, url: SITE_URL },
    areaServed: { "@type": "City", name: salon.address.city },
    offers: {
      "@type": "Offer",
      price: service.priceFrom,
      priceCurrency: "PLN",
      url: `${SITE_URL}/uslugi/${service.slug}`,
      availability: "https://schema.org/InStock",
    },
  };
}
