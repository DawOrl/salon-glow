import type { Service } from "./types";

/** Cena usługi: „190–250 zł” dla widełek, „od 480 zł” dla ceny minimalnej. */
export function formatPrice(service: Pick<Service, "priceFrom" | "priceTo">) {
  if (service.priceTo) {
    return `${service.priceFrom}–${service.priceTo} zł`;
  }
  return `od ${service.priceFrom} zł`;
}

/** Czas trwania: „1 h 15 min”, „2 h”, „45 min”. */
export function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h} h ${m} min`;
  if (h) return `${h} h`;
  return `${m} min`;
}

/** Odmiana: 1 usługa, 2-4 usługi, 5+ usług (z wyjątkiem 12-14). */
export function pluralUslugi(n: number) {
  if (n === 1) return "usługa";
  const d = n % 10;
  const t = n % 100;
  if (d >= 2 && d <= 4 && (t < 12 || t > 14)) return "usługi";
  return "usług";
}

/**
 * Polska typografia: jednoliterowe spójniki i przyimki (a, i, o, u, w, z)
 * nie mogą zostać na końcu wiersza, więc wiążemy je twardą spacją z kolejnym słowem.
 */
export function sierotki(text: string) {
  return text.replace(/(^|\s)([aiouwzAIOUWZ])\s+/g, "$1$2 ");
}
