import type { OpeningHour, TimeSlot } from "./types";

export interface DayOption {
  iso: string; // yyyy-mm-dd
  label: string; // np. „9 cze”
  weekday: string; // np. „pon”
  day: number; // numer dnia miesiąca
  month: string; // np. „paź”
}

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** salon.openingHours jest w kolejności Pon..Nd; JS getDay() to 0=Nd..6=Sob. */
function hoursForDate(date: Date, hours: OpeningHour[]): OpeningHour {
  const js = date.getDay();
  const idx = js === 0 ? 6 : js - 1;
  return hours[idx];
}

/** Deterministyczna „dostępność” slotu (bez Math.random, więc bez hydration mismatch). */
function isAvailable(seed: string): boolean {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 10 >= 3; // ok. 70% wolnych
}

/** Najbliższe `count` dni otwarcia (od jutra). */
export function getAvailableDays(
  from: Date,
  count: number,
  hours: OpeningHour[],
): DayOption[] {
  const out: DayOption[] = [];
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  let scanned = 0;
  while (out.length < count && scanned < 40) {
    if (hoursForDate(d, hours).open) {
      out.push({
        iso: toISO(d),
        label: d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" }),
        weekday: d.toLocaleDateString("pl-PL", { weekday: "short" }),
        day: d.getDate(),
        month: d.toLocaleDateString("pl-PL", { month: "short" }),
      });
    }
    d.setDate(d.getDate() + 1);
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
  const date = new Date(`${iso}T00:00:00`);
  const h = hoursForDate(date, hours);
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
