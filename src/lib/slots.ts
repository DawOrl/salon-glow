import type { OpeningHour, TimeSlot } from "./types";

export interface DayOption {
  iso: string; // yyyy-mm-dd
  label: string; // np. „9 cze”
  weekday: string; // np. „pon”
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

/** Deterministyczna „dostępność” slotu (bez Math.random → brak hydration mismatch). */
function isAvailable(seed: string): boolean {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  return sum % 10 >= 3; // ~70% wolnych
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
      });
    }
    d.setDate(d.getDate() + 1);
    scanned++;
  }
  return out;
}

/** Sloty co 90 minut w godzinach otwarcia danego dnia. */
export function getSlotsForDay(iso: string, hours: OpeningHour[]): TimeSlot[] {
  const date = new Date(`${iso}T00:00:00`);
  const h = hoursForDate(date, hours);
  if (!h.open || !h.close) return [];
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const open = oh * 60 + om;
  const close = ch * 60 + cm;
  const slots: TimeSlot[] = [];
  for (let t = open; t + 60 <= close; t += 90) {
    const time = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
    slots.push({ date: iso, time, available: isAvailable(iso + time) });
  }
  return slots;
}
