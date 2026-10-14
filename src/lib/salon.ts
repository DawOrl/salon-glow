import type { SalonInfo } from "./types";

/**
 * Dane kontaktowe / NAP salonu: jedno źródło prawdy dla stopki, sekcji
 * kontakt oraz danych strukturalnych JSON-LD (Etap 4).
 * Lokalizacja: ul. Mokotowska, warszawska ulica mody i beauty (premium).
 */
export const salon: SalonInfo = {
  name: "Glow Studio",
  legalName: "Glow Studio sp. z o.o.",
  tagline: "Cisza, którą widać.",
  description:
    "Autorskie studio fryzjerskie i koloryzacji w sercu Warszawy. Strzyżenie, balayage, regeneracja i stylizacje okazjonalne, z dbałością o detal i Twój czas.",
  address: {
    street: "ul. Mokotowska 12",
    city: "Warszawa",
    postalCode: "00-561",
    country: "PL",
  },
  phone: "+48 22 116 24 80",
  phoneHref: "+48221162480",
  email: "rezerwacje@glowstudio.pl",
  geo: { lat: 52.2231, lng: 21.0186 },
  openingHours: [
    { day: "Pon", open: "10:00", close: "20:00" },
    { day: "Wt", open: "10:00", close: "20:00" },
    { day: "Śr", open: "10:00", close: "20:00" },
    { day: "Czw", open: "10:00", close: "20:00" },
    { day: "Pt", open: "10:00", close: "20:00" },
    { day: "Sob", open: "09:00", close: "16:00" },
    { day: "Nd", open: null, close: null },
  ],
  priceRange: "$$$",
  socials: {
    instagram: "https://instagram.com/glowstudio.waw",
    facebook: "https://facebook.com/glowstudio.waw",
    tiktok: "https://tiktok.com/@glowstudio.waw",
  },
  // Embed mapy bez klucza API (Google Maps "place" embed po nazwie/adresie).
  mapEmbedUrl:
    "https://www.google.com/maps?q=Mokotowska%2012%20Warszawa&output=embed",
  bookingPolicy:
    "Rezerwacja jest bezpłatna. Odwołanie lub zmianę terminu przyjmujemy do 24 godzin przed wizytą.",
};
