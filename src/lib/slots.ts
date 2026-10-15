import type { OpeningHour, TimeSlot } from "./types";

export interface DayOption {
  iso: string; // yyyy-mm-dd
  label: string; // np. „9 cze”
  weekday: string; // np. „pon”
  day: number; // numer dnia miesiąca
  month: string; // np. „paź”
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Daty kalendarzowe trzymamy jako południe UTC danego dnia
 * i czytamy getterami UTC. Dzięki temu serwer (UTC) i przeglądarka (dowolna strefa)
 * liczą te same dni, bez hydration mismatch.
 */
const toISO = (d: Date) =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const fromISO = (iso: string) => new Date(`${iso}T12:00:00Z`);

/** Dzisiejsza data kalendarzowa w strefie salonu (Europe/Warsaw). */
export function todayInWarsaw(now: Date = new Date()): string {
  // en-CA formatuje jako rrrr-mm-dd
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** salon.openingHours jest w kolejności Pon..Nd; getUTCDay() to 0=Nd..6=Sob. */
function hoursForDate(date: Date, hours: OpeningHour[]): OpeningHour {
  const js = date.getUTCDay();
  const idx = js === 0 ? 6 : js - 1;
  return hours[idx];
}

const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  d.toLocaleDateString("pl-PL", { ...opts, timeZone: "UTC" });

/** Deterministyczna „dostępność” slotu (bez Math.random, więc bez hydration mismatch). */
function isAvailable(seed: string): boolean {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 10 >= 3; // ok. 70% wolnych
}

/** Najbliższe `count` dni otwarcia (od jutra), licząc „dziś” w Warszawie. */
export function getAvailableDays(
  todayISO: string,
  count: number,
  hours: OpeningHour[],
): DayOption[] {
  const out: DayOption[] = [];
  const d = fromISO(todayISO);
  d.setUTCDate(d.getUTCDate() + 1);
  let scanned = 0;
  while (out.length < count && scanned < 40) {
    if (hoursForDate(d, hours).open) {
      out.push({
        iso: toISO(d),
        label: fmt(d, { day: "numeric", month: "short" }),
        weekday: fmt(d, { weekday: "short" }),
        day: d.getUTCDate(),
        month: fmt(d, { month: "short" }),
      });
    }
    d.setUTCDate(d.getUTCDate() + 1);
    scanned++;
  }
  return out;
}

/**
 * Sloty co 30 minut w godzinach otwarcia danego dnia. Pokazujemy tylko
 * godziny, po których wizyta o danym czasie trwania skończy się przed
 * zamknięciem. Dostępność zależy też od stylisty (inny grafik).
 */
export function getSlotsForDay(
  iso: string,
  hours: OpeningHour[],
  durationMin = 60,
  staffId = "any",
): TimeSlot[] {
  const h = hoursForDate(fromISO(iso), hours);
  if (!h.open || !h.close) return [];
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const open = oh * 60 + om;
  const close = ch * 60 + cm;
  const slots: TimeSlot[] = [];
  for (let t = open; t + durationMin <= close; t += 30) {
    const time = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
    slots.push({ date: iso, time, available: isAvailable(`${iso}|${time}|${staffId}`) });
  }
  return slots;
}
