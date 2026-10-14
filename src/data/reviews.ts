import type { Review, SalonRating } from "@/lib/types";

/** Zbiorcza ocena: social proof przy heroku, opiniach i kreatorze rezerwacji. */
export const salonRating: SalonRating = {
  average: 4.9,
  total: 621,
};

export const reviews: Review[] = [
  {
    id: "rv-1",
    author: "Karolina M.",
    rating: 5,
    text: "Najlepszy balayage, jaki miałam. Maja dokładnie wsłuchała się w to, czego chcę, i kolor wygląda naturalnie nawet po dwóch miesiącach.",
    date: "2026-04-18",
    serviceId: "svc-color-balayage",
    staffId: "maja",
    source: "google",
  },
  {
    id: "rv-2",
    author: "Tomasz W.",
    rating: 5,
    text: "Wreszcie barber, który nie spieszy się i pyta zanim zetnie. Krzysztof to mistrz, wychodzę za każdym razem zadowolony.",
    date: "2026-03-30",
    serviceId: "svc-cut-men",
    staffId: "kris",
    source: "google",
  },
  {
    id: "rv-3",
    author: "Aleksandra P.",
    rating: 5,
    text: "Keratyna u Oli odmieniła moje włosy. Zero puszenia, a poranek skrócił się o pół godziny. Polecam całym sercem.",
    date: "2026-04-02",
    serviceId: "svc-care-keratin",
    staffId: "ola",
    source: "google",
  },
  {
    id: "rv-4",
    author: "Magdalena K.",
    rating: 5,
    text: "Robiłam u Natalii upięcie ślubne. Trzymało się do białego rana. Próba przed ślubem dała mi spokój głowy.",
    date: "2026-05-11",
    serviceId: "svc-style-updo",
    staffId: "natalia",
    source: "instagram",
  },
  {
    id: "rv-5",
    author: "Joanna R.",
    rating: 5,
    text: "Klimat studia jest cudowny: spokój, kawa, zero pośpiechu. Czuć, że liczy się klient, a nie kolejka.",
    date: "2026-02-21",
    source: "google",
  },
  {
    id: "rv-6",
    author: "Patrycja L.",
    rating: 4,
    text: "Świetna korekta koloru po nieudanym farbowaniu w innym miejscu. Trochę dłużej niż zakładałam, ale efekt wart każdej minuty.",
    date: "2026-03-07",
    serviceId: "svc-color-correction",
    staffId: "maja",
    source: "google",
  },
];
