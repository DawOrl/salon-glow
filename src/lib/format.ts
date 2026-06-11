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
