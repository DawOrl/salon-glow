import type { Service, ServiceCategory } from "@/lib/types";
import { sierotki } from "@/lib/format";

/**
 * Cennik Glow Studio: realne widełki dla salonu premium w Warszawie.
 * Ceny w PLN; „od” bo finalna cena koloryzacji zależy od długości i gęstości włosów.
 * Czasy trwania zasilają kreator rezerwacji i siatkę slotów.
 */

const categoriesRaw: ServiceCategory[] = [
  {
    id: "cat-cut",
    slug: "strzyzenie",
    name: "Strzyżenie i modelowanie",
    description:
      "Strzyżenie autorskie dopasowane do struktury włosa, twarzy i stylu życia.",
    order: 1,
  },
  {
    id: "cat-color",
    slug: "koloryzacja",
    name: "Koloryzacja",
    description:
      "Balayage, sombre i koloryzacje na miarę: od naturalnego rozświetlenia po pełną metamorfozę.",
    order: 2,
  },
  {
    id: "cat-care",
    slug: "pielegnacja",
    name: "Pielęgnacja i regeneracja",
    description:
      "Keratyna, nanoplastia i zabiegi odbudowujące. Zdrowie i blask włosa na dłużej.",
    order: 3,
  },
  {
    id: "cat-style",
    slug: "stylizacja",
    name: "Stylizacja i okazje",
    description:
      "Upięcia, fale i makijaż na wyjątkowe chwile, z próbą przed dniem ślubu.",
    order: 4,
  },
];

const servicesRaw: Service[] = [
  // Strzyżenie i modelowanie
  {
    id: "svc-cut-women",
    slug: "strzyzenie-damskie",
    categoryId: "cat-cut",
    name: "Strzyżenie damskie z modelowaniem",
    description:
      "Konsultacja, mycie pielęgnacyjne, strzyżenie i modelowanie z poradą stylizacyjną.",
    priceFrom: 190,
    priceTo: 250,
    currency: "PLN",
    durationMin: 75,
    popular: true,
    staffIds: ["maja", "natalia", "kris"],
  },
  {
    id: "svc-cut-men",
    slug: "strzyzenie-meskie",
    categoryId: "cat-cut",
    name: "Strzyżenie męskie",
    description: "Strzyżenie, modelowanie i wykończenie brzytwą.",
    priceFrom: 110,
    currency: "PLN",
    durationMin: 45,
    staffIds: ["kris"],
  },
  {
    id: "svc-cut-styling",
    slug: "modelowanie",
    categoryId: "cat-cut",
    name: "Modelowanie / fryzura",
    description: "Mycie i modelowanie: prosto, w fale lub objętościowo.",
    priceFrom: 90,
    priceTo: 140,
    currency: "PLN",
    durationMin: 45,
    staffIds: ["maja", "natalia", "kris"],
  },
  {
    id: "svc-cut-ends",
    slug: "podciecie-koncowek",
    categoryId: "cat-cut",
    name: "Podcięcie końcówek",
    description: "Odświeżenie linii cięcia bez zmiany długości.",
    priceFrom: 90,
    currency: "PLN",
    durationMin: 40,
    staffIds: ["natalia", "kris"],
  },

  // Koloryzacja
  {
    id: "svc-color-balayage",
    slug: "balayage-sombre",
    categoryId: "cat-color",
    name: "Balayage / sombre",
    description:
      "Ręcznie malowane pasma dające naturalne, wtopione przejście koloru. Z tonowaniem i pielęgnacją.",
    priceFrom: 480,
    priceTo: 720,
    currency: "PLN",
    durationMin: 195,
    popular: true,
    staffIds: ["maja", "natalia"],
  },
  {
    id: "svc-color-full",
    slug: "koloryzacja-pelna",
    categoryId: "cat-color",
    name: "Koloryzacja pełna",
    description: "Równomierny kolor na całej długości z doborem odcienia.",
    priceFrom: 290,
    priceTo: 400,
    currency: "PLN",
    durationMin: 135,
    staffIds: ["maja", "natalia"],
  },
  {
    id: "svc-color-roots",
    slug: "retusz-odrostu",
    categoryId: "cat-color",
    name: "Retusz odrostu",
    description: "Koloryzacja odrostu z dopasowaniem do bazy.",
    priceFrom: 220,
    priceTo: 280,
    currency: "PLN",
    durationMin: 90,
    staffIds: ["maja", "natalia"],
  },
  {
    id: "svc-color-toning",
    slug: "tonowanie",
    categoryId: "cat-color",
    name: "Tonowanie / odświeżenie koloru",
    description: "Wyrównanie i ożywienie odcienia, neutralizacja niechcianych tonów.",
    priceFrom: 160,
    priceTo: 220,
    currency: "PLN",
    durationMin: 60,
    staffIds: ["maja", "natalia"],
  },
  {
    id: "svc-color-correction",
    slug: "korekta-koloru",
    categoryId: "cat-color",
    name: "Rozjaśnianie / korekta koloru",
    description:
      "Zaawansowana zmiana koloru z dbałością o kondycję włosa. Wycena po konsultacji.",
    priceFrom: 600,
    currency: "PLN",
    durationMin: 240,
    staffIds: ["maja"],
  },

  // Pielęgnacja i regeneracja
  {
    id: "svc-care-keratin",
    slug: "keratynowe-prostowanie",
    categoryId: "cat-care",
    name: "Keratynowe prostowanie",
    description: "Wygładzenie, dyscyplina i blask na tygodnie. Cena zależna od długości.",
    priceFrom: 550,
    priceTo: 850,
    currency: "PLN",
    durationMin: 165,
    popular: true,
    staffIds: ["ola"],
  },
  {
    id: "svc-care-nanoplastia",
    slug: "nanoplastia",
    categoryId: "cat-care",
    name: "Nanoplastia",
    description: "Bezformaldehydowa regeneracja i wygładzenie struktury włosa.",
    priceFrom: 480,
    priceTo: 720,
    currency: "PLN",
    durationMin: 150,
    staffIds: ["ola"],
  },
  {
    id: "svc-care-repair",
    slug: "zabieg-regenerujacy",
    categoryId: "cat-care",
    name: "Zabieg regenerujący K18 / Olaplex",
    description: "Odbudowa wiązań włosa po koloryzacji i zniszczeniach.",
    priceFrom: 130,
    priceTo: 190,
    currency: "PLN",
    durationMin: 45,
    staffIds: ["ola", "natalia"],
  },
  {
    id: "svc-care-scalp",
    slug: "rytual-skory-glowy",
    categoryId: "cat-care",
    name: "Rytuał pielęgnacyjny skóry głowy",
    description: "Peeling, masaż i odżywienie skóry głowy. Reset i relaks.",
    priceFrom: 160,
    currency: "PLN",
    durationMin: 50,
    staffIds: ["ola"],
  },

  // Stylizacja i okazje
  {
    id: "svc-style-updo",
    slug: "upiecie-okazjonalne",
    categoryId: "cat-style",
    name: "Upięcie okazjonalne / ślubne",
    description: "Eleganckie upięcie dopasowane do stylizacji i okazji.",
    priceFrom: 260,
    priceTo: 360,
    currency: "PLN",
    durationMin: 90,
    staffIds: ["natalia", "maja"],
  },
  {
    id: "svc-style-waves",
    slug: "fale-loki",
    categoryId: "cat-style",
    name: "Fale / loki na okazję",
    description: "Miękkie fale lub sprężyste loki z utrwaleniem.",
    priceFrom: 170,
    currency: "PLN",
    durationMin: 60,
    staffIds: ["natalia"],
  },
  {
    id: "svc-style-makeup",
    slug: "makijaz-okazjonalny",
    categoryId: "cat-style",
    name: "Makijaż okazjonalny",
    description: "Makijaż dzienny lub wieczorowy dobrany do typu urody.",
    priceFrom: 240,
    currency: "PLN",
    durationMin: 60,
    staffIds: ["natalia"],
  },
  {
    id: "svc-style-bride",
    slug: "pakiet-panny-mlodej",
    categoryId: "cat-style",
    name: "Pakiet Panny Młodej",
    description: "Makijaż i fryzura próbna oraz stylizacja w dniu ślubu.",
    priceFrom: 690,
    currency: "PLN",
    durationMin: 180,
    popular: true,
    staffIds: ["maja", "natalia"],
  },
];

/** Nazwy i opisy z twardymi spacjami po jednoliterowych słowach (bez sierotek). */
export const serviceCategories: ServiceCategory[] = categoriesRaw.map((c) => ({
  ...c,
  name: sierotki(c.name),
  description: sierotki(c.description),
}));

export const services: Service[] = servicesRaw.map((s) => ({
  ...s,
  name: sierotki(s.name),
  description: sierotki(s.description),
}));
