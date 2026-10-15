"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { createReservation, type BookingState } from "@/app/lib/actions";
import { serviceCategories, services } from "@/data/services";
import { getServiceById, getStaffForService } from "@/lib/queries";
import { formatDuration, formatPrice, sierotki } from "@/lib/format";
import { salon } from "@/lib/salon";
import { getAvailableDays, getSlotsForDay, type DayOption } from "@/lib/slots";
import { imageMeta } from "@/lib/imageMeta";
import type { StaffMember, TimeSlot } from "@/lib/types";
import { ProgressBar, STEPS } from "./ProgressBar";
import { SubmitButton } from "./SubmitButton";

const inputBase =
  "w-full rounded-xl border bg-cream px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-colors duration-300 ease-silk focus:outline-none focus:ring-1";

function fieldClass(hasError: boolean) {
  return `${inputBase} ${
    hasError
      ? "border-terracotta-deep focus:border-terracotta-deep focus:ring-terracotta-deep"
      : "border-line focus:border-terracotta focus:ring-terracotta"
  }`;
}

/** Wiersz-wybór oparty o natywny radio (strzałki, Tab, czytniki ekranu). */
const optionBase =
  "relative flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 transition-[border-color,background-color] duration-200 ease-silk has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta";
const optionState = (on: boolean) =>
  on ? "border-terracotta bg-sand/60" : "border-line bg-cream hover:border-ink/25";

function Radio({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
        on ? "border-terracotta-deep" : "border-ink/25"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full bg-terracotta-deep transition-transform duration-200 ease-silk ${
          on ? "scale-100" : "scale-0"
        }`}
      />
    </span>
  );
}

function Avatar({ person, size = 48 }: { person: StaffMember; size?: number }) {
  const meta = imageMeta[person.photo];
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-xl bg-sand"
      style={{ width: size, height: size * 1.15 }}
    >
      <Image
        src={person.photo}
        alt=""
        fill
        sizes={`${size}px`}
        placeholder={meta ? "blur" : "empty"}
        blurDataURL={meta?.blurDataURL}
        className="object-cover object-top"
      />
    </span>
  );
}

const periodOf = (time: string) => {
  const h = Number(time.slice(0, 2));
  if (h < 12) return "Rano";
  if (h < 16) return "Po południu";
  return "Wieczorem";
};

/** Walidacja po stronie klienta (te same reguły co zod na serwerze). */
function validateClient(fd: FormData) {
  const e: Record<string, string> = {};
  const name = String(fd.get("name") ?? "").trim();
  const phone = String(fd.get("phone") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  if (name.length < 2) e.name = "Podaj imię i nazwisko";
  if (!phone && !email) e.phone = "Podaj telefon lub e-mail";
  if (phone && !/^[+0-9 ()\-]{7,}$/.test(phone)) e.phone = "Podaj poprawny numer telefonu";
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Podaj poprawny adres e-mail";
  if (String(fd.get("notes") ?? "").length > 500) e.notes = "Maksymalnie 500 znaków";
  if (!fd.get("consent")) e.consent = "Potrzebujemy Twojej zgody, aby potwierdzić wizytę";
  return e;
}

type Contact = { name: string; phone: string; email: string; notes: string; consent: boolean };
const emptyContact: Contact = { name: "", phone: "", email: "", notes: "", consent: false };

export function BookingWizard({
  initialServiceSlug,
  today,
}: {
  initialServiceSlug?: string;
  /** Dzisiejsza data (rrrr-mm-dd, Europe/Warsaw) policzona na serwerze. */
  today: string;
}) {
  const initialService = initialServiceSlug
    ? services.find((s) => s.slug === initialServiceSlug)
    : undefined;

  const [step, setStep] = useState(initialService ? 2 : 1);
  const [serviceId, setServiceId] = useState<string | null>(
    initialService?.id ?? null,
  );
  const [staffId, setStaffId] = useState<string>("any");

  // "Dziś" przychodzi z serwera (strefa Europe/Warsaw), więc serwer i przeglądarka
  // liczą te same dni niezależnie od strefy czasowej (brak hydration mismatch).
  const [days] = useState<DayOption[]>(() =>
    getAvailableDays(today, 12, salon.openingHours),
  );
  const [date, setDate] = useState<string | null>(days[0]?.iso ?? null);
  const [time, setTime] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  // Dane kontaktowe żyją w stanie kreatora: przetrwają "Wstecz", "zmień"
  // i odpowiedź serwera z błędem (formularz nie jest resetowany przez akcję).
  const [contact, setContact] = useState<Contact>(emptyContact);
  function setField<K extends keyof Contact>(key: K, value: Contact[K]) {
    setContact((c) => ({ ...c, [key]: value }));
    if (clientErrors[key]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  const service = serviceId ? getServiceById(serviceId) : undefined;
  const eligibleStaff = service ? getStaffForService(service) : [];
  const staff = eligibleStaff.find((p) => p.id === staffId);

  const duration = service?.durationMin ?? 60;
  const slots: TimeSlot[] = date
    ? getSlotsForDay(date, salon.openingHours, duration, staffId)
    : [];
  const freeCount = slots.filter((s) => s.available).length;

  const [state, formAction, pending] = useActionState<BookingState, FormData>(
    createReservation,
    { ok: false },
  );
  const errors = { ...(state.errors ?? {}), ...clientErrors };

  // Po zmianie kroku: fokus na nagłówek kroku (czytnik ogłasza nową treść,
  // klawiatura nie gubi kontekstu) i powrót na górę kreatora, jeśli uciekł.
  const topRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    topRef.current
      ?.querySelector<HTMLElement>("[data-step-heading]")
      ?.focus({ preventScroll: true });
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [step]);

  function canLeave(s: number) {
    if (s === 1 && !serviceId) return "Wybierz usługę, aby przejść dalej.";
    if (s === 3 && (!date || !time)) return "Wybierz dzień i godzinę wizyty.";
    return null;
  }

  function goTo(target: number) {
    setStepError(null);
    if (target > step) {
      for (let s = step; s < target; s++) {
        const err = canLeave(s);
        if (err) {
          setStepError(err);
          return;
        }
      }
    }
    setStep(Math.max(1, Math.min(4, target)));
  }

  // Wysyłka bez `action` na <form>: React 19 resetuje formularz po akcji
  // przekazanej w `action`, a tu chcemy zachować wpisane dane przy błędzie.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const found = validateClient(fd);
    setClientErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    startTransition(() => formAction(fd));
  }

  const selectedDay = days.find((d) => d.iso === date);
  const termLabel =
    selectedDay && time ? `${selectedDay.weekday} ${selectedDay.label}, ${time}` : null;

  const summaryRows: { label: string; value: ReactNode; step: number }[] = [
    { label: "Usługa", value: service?.name, step: 1 },
    { label: "Stylista", value: staffId === "any" ? "Pierwszy wolny" : staff?.name, step: 2 },
    { label: "Termin", value: termLabel, step: 3 },
  ];

  const heading = (text: string, sub?: string) => (
    <div className="mb-6">
      <h2
        tabIndex={-1}
        data-step-heading
        className="scroll-mt-28 font-display text-title font-light text-ink outline-none"
      >
        {text}
      </h2>
      {sub && <p className="mt-2 text-sm text-muted">{sierotki(sub)}</p>}
    </div>
  );

  const periods = ["Rano", "Po południu", "Wieczorem"]
    .map((p) => ({ p, list: slots.filter((s) => periodOf(s.time) === p) }))
    .filter((g) => g.list.length > 0);

  return (
    <div ref={topRef} className="scroll-mt-24 grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-8">
        <ProgressBar current={step} onStep={goTo} />

        <div className="mt-10">
          {/* KROK 1: usługa */}
          {step === 1 && (
            <section>
              {heading(
                "Wybierz usługę",
                "Ceny „od”: finalną potwierdzimy po krótkiej konsultacji.",
              )}
              <div className="space-y-9">
                {serviceCategories.map((cat) => (
                  <fieldset key={cat.id}>
                    <legend className="font-display text-lg italic text-ink-soft">
                      {cat.name}
                    </legend>
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                      {services
                        .filter((s) => s.categoryId === cat.id)
                        .map((s) => {
                          const on = s.id === serviceId;
                          return (
                            <label key={s.id} className={`${optionBase} ${optionState(on)}`}>
                              <input
                                type="radio"
                                name="pick-service"
                                value={s.id}
                                checked={on}
                                onChange={() => {
                                  setServiceId(s.id);
                                  setStaffId("any");
                                  setTime(null);
                                  setStepError(null);
                                }}
                                className="sr-only"
                              />
                              <Radio on={on} />
                              <span className="min-w-0 flex-1">
                                <span className="block font-medium text-ink">{s.name}</span>
                                <span className="mt-0.5 block text-sm text-muted">
                                  {formatDuration(s.durationMin)}
                                </span>
                              </span>
                              <span className="shrink-0 font-display tabular-nums text-ink">
                                {formatPrice(s)}
                              </span>
                            </label>
                          );
                        })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>
          )}

          {/* KROK 2: stylista */}
          {step === 2 && (
            <section>
              {heading(
                "Wybierz stylistę",
                "Możesz zostawić wybór nam. Przydzielimy osobę z najbliższym wolnym terminem.",
              )}
              <fieldset>
                <legend className="sr-only">Stylista</legend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <label className={`${optionBase} ${optionState(staffId === "any")}`}>
                    <input
                      type="radio"
                      name="pick-staff"
                      value="any"
                      checked={staffId === "any"}
                      onChange={() => {
                        setStaffId("any");
                        setTime(null);
                      }}
                      className="sr-only"
                    />
                    <Radio on={staffId === "any"} />
                    <span className="flex -space-x-3">
                      {eligibleStaff.slice(0, 3).map((p) => (
                        <span key={p.id} className="rounded-xl ring-2 ring-cream">
                          <Avatar person={p} size={34} />
                        </span>
                      ))}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium text-ink">Pierwszy wolny</span>
                      <span className="mt-0.5 block text-sm text-muted">
                        Najwięcej wolnych godzin
                      </span>
                    </span>
                  </label>
                  {eligibleStaff.map((person) => {
                    const on = staffId === person.id;
                    return (
                      <label key={person.id} className={`${optionBase} ${optionState(on)}`}>
                        <input
                          type="radio"
                          name="pick-staff"
                          value={person.id}
                          checked={on}
                          onChange={() => {
                            setStaffId(person.id);
                            setTime(null);
                          }}
                          className="sr-only"
                        />
                        <Radio on={on} />
                        <Avatar person={person} />
                        <span className="min-w-0">
                          <span className="block font-medium text-ink">{person.name}</span>
                          <span className="mt-0.5 block text-sm text-muted">{person.role}</span>
                          {person.rating && (
                            <span className="mt-0.5 block text-xs text-muted">
                              <span aria-hidden className="text-champagne">★</span>{" "}
                              {person.rating.toLocaleString("pl-PL", { minimumFractionDigits: 1 })}
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </section>
          )}

          {/* KROK 3: termin */}
          {step === 3 && (
            <section>
              {heading(
                "Wybierz termin",
                service
                  ? `Wizyta trwa ok. ${formatDuration(service.durationMin)}. Pokazujemy godziny, w których zmieści się przed zamknięciem.`
                  : undefined,
              )}
              <fieldset>
                <legend className="text-sm text-muted">Dzień</legend>
                <div className="no-scrollbar -mx-6 mt-3 flex snap-x scroll-px-6 gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
                  {days.map((d) => {
                    const on = date === d.iso;
                    return (
                      <label
                        key={d.iso}
                        className={`flex w-16 shrink-0 cursor-pointer snap-start flex-col items-center rounded-2xl border py-3 transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta ${
                          on
                            ? "border-ink bg-ink text-cream"
                            : "border-line bg-cream text-ink hover:border-ink/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pick-day"
                          value={d.iso}
                          checked={on}
                          onChange={() => {
                            setDate(d.iso);
                            setTime(null);
                          }}
                          className="sr-only"
                        />
                        <span className={`text-xs ${on ? "text-cream/75" : "text-muted"}`}>
                          {d.weekday}
                        </span>
                        <span className="font-display text-2xl leading-tight tabular-nums">
                          {d.day}
                        </span>
                        <span className={`text-xs ${on ? "text-cream/75" : "text-muted"}`}>
                          {d.month}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="text-sm text-muted">
                  Godzina
                  {date && (
                    <span className="text-ink-soft">
                      {" "}
                      · {freeCount} {freeCount === 1 ? "wolna" : "wolnych"}
                    </span>
                  )}
                </legend>
                {date && freeCount === 0 && (
                  <p className="mt-3 rounded-2xl border border-line bg-sand/40 px-4 py-4 text-sm text-ink-soft">
                    Tego dnia nie mamy już wolnych godzin dla tej usługi. Wybierz inny
                    dzień albo zadzwoń:{" "}
                    <a className="underline underline-offset-4" href={`tel:${salon.phoneHref}`}>
                      {salon.phone}
                    </a>
                    .
                  </p>
                )}
                {periods.map(({ p, list }) => (
                  <div key={p} className="mt-4">
                    <p className="font-display text-sm italic text-ink-soft">{p}</p>
                    <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {list.map((slot) => {
                        const on = time === slot.time;
                        return (
                          <label
                            key={slot.time}
                            className={`flex min-h-11 items-center justify-center rounded-xl border text-sm tabular-nums transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta ${
                              !slot.available
                                ? "cursor-not-allowed border-transparent bg-sand/40 text-muted line-through decoration-muted/60"
                                : on
                                  ? "cursor-pointer border-terracotta-deep bg-terracotta-deep text-cream"
                                  : "cursor-pointer border-line bg-cream text-ink hover:border-ink/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="pick-time"
                              value={slot.time}
                              checked={on}
                              disabled={!slot.available}
                              onChange={() => {
                                setTime(slot.time);
                                setStepError(null);
                              }}
                              className="sr-only"
                              aria-label={`${slot.time}${slot.available ? "" : ", zajęte"}`}
                            />
                            {slot.time}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </fieldset>
            </section>
          )}

          {/* KROK 4: dane i wysyłka */}
          {step === 4 && (
            <form id="booking-form" onSubmit={onSubmit} noValidate>
              {heading("Twoje dane", "Podaj telefon lub e-mail. Wystarczy jedno, oddzwonimy z potwierdzeniem.")}

              {/* Podsumowanie na telefonie (na desktopie jest w panelu obok) */}
              <div className="mb-8 rounded-2xl border border-line bg-sand/40 p-4 lg:hidden">
                <SummaryList rows={summaryRows} onEdit={goTo} />
              </div>

              <input type="hidden" name="serviceId" value={serviceId ?? ""} />
              <input type="hidden" name="staffId" value={staffId} />
              <input type="hidden" name="date" value={date ?? ""} />
              <input type="hidden" name="time" value={time ?? ""} />
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Nie wypełniaj
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {state.message && Object.keys(clientErrors).length === 0 && (
                <p
                  role="alert"
                  className="mb-6 rounded-xl border border-terracotta-deep/40 bg-cream px-4 py-3 text-sm text-terracotta-ink"
                >
                  {state.message}
                  {state.errors?.date && (
                    <>
                      {" "}
                      <button type="button" onClick={() => goTo(3)} className="underline underline-offset-4">
                        Zmień termin
                      </button>
                    </>
                  )}
                </p>
              )}

              <div className="space-y-5">
                <Field id="name" label="Imię i nazwisko" required error={errors.name}>
                  <input
                    id="name"
                    name="name"
                    value={contact.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    className={fieldClass(Boolean(errors.name))}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="phone" label="Telefon" error={errors.phone}>
                    <input
                      id="phone"
                      name="phone"
                      value={contact.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "err-phone" : undefined}
                      className={fieldClass(Boolean(errors.phone))}
                    />
                  </Field>
                  <Field id="email" label="E-mail" error={errors.email}>
                    <input
                      id="email"
                      name="email"
                      value={contact.email}
                      onChange={(e) => setField("email", e.target.value)}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      className={fieldClass(Boolean(errors.email))}
                    />
                  </Field>
                </div>

                <Field id="notes" label="Uwagi (opcjonalnie)" error={errors.notes}>
                  <textarea
                    id="notes"
                    name="notes"
                    value={contact.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Np. długość włosów, poprzednia koloryzacja"
                    aria-invalid={Boolean(errors.notes)}
                    aria-describedby={errors.notes ? "err-notes" : undefined}
                    className={fieldClass(Boolean(errors.notes))}
                  />
                </Field>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={contact.consent}
                      onChange={(e) => setField("consent", e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-terracotta-deep"
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? "err-consent" : undefined}
                    />
                    <span>
                      Zgadzam się na kontakt w celu potwierdzenia wizyty.{" "}
                      <span className="text-terracotta-ink">*</span>
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="err-consent" className="mt-1.5 text-sm text-terracotta-ink">
                      {errors.consent}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-6 text-sm text-muted">{salon.bookingPolicy}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => goTo(3)}
                  className="press inline-flex min-h-11 items-center rounded-pill px-4 text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  Wstecz
                </button>
                <SubmitButton pending={pending} />
              </div>
            </form>
          )}
        </div>

        {/* Nawigacja kroków 1-3: na desktopie pod treścią */}
        {step < 4 && (
          <div className="mt-10 hidden items-center gap-4 lg:flex">
            {step > 1 && (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="press inline-flex min-h-11 items-center rounded-pill px-4 text-sm text-ink-soft transition-colors hover:text-ink"
              >
                Wstecz
              </button>
            )}
            <button
              type="button"
              onClick={() => goTo(step + 1)}
              className="press inline-flex min-h-12 items-center justify-center rounded-pill bg-terracotta-deep px-9 text-sm font-medium text-cream transition-colors duration-300 hover:bg-[#84503f]"
            >
              Dalej: {STEPS[step]}
            </button>
          </div>
        )}
      </div>

      {/* Podsumowanie na żywo (desktop) */}
      <aside className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-28 rounded-card border border-line bg-sand/40 p-6">
          <h2 className="font-display text-xl italic text-ink">Twoja wizyta</h2>
          <div className="mt-4">
            <SummaryList rows={summaryRows} onEdit={step > 1 ? goTo : undefined} current={step} />
          </div>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-sm text-muted">Cena</span>
            <span className="font-display text-2xl tabular-nums text-ink">
              {service ? formatPrice(service) : "-"}
            </span>
          </div>
          {service && (
            <p className="mt-1 text-right text-sm text-muted">
              {formatDuration(service.durationMin)}
            </p>
          )}
          {step < 4 && (
            <button
              type="button"
              onClick={() => goTo(step + 1)}
              className="press mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-terracotta-deep px-6 text-sm font-medium text-cream transition-colors duration-300 hover:bg-[#84503f]"
            >
              Dalej: {STEPS[step]}
            </button>
          )}
          {stepError && (
            <p role="alert" className="mt-3 text-sm text-terracotta-ink">
              {stepError}
            </p>
          )}
          <p className="mt-5 text-sm text-muted">
            Rezerwujesz bezpośrednio u nas, bez prowizji pośredników.
          </p>
        </div>
      </aside>

      {/* Dolny pasek akcji (telefon i tablet), kroki 1-3 */}
      {step < 4 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          {stepError && (
            <p role="alert" className="mb-2 text-sm text-terracotta-ink">
              {stepError}
            </p>
          )}
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                aria-label="Wstecz"
                className="press flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-ink"
              >
                <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <div className="min-w-0 flex-1 text-sm leading-tight">
              <p className="truncate text-ink">{service?.name ?? "Wybierz usługę"}</p>
              <p className="truncate text-muted">
                {service ? `${formatPrice(service)} · ${formatDuration(service.durationMin)}` : `Krok ${step} z 4`}
                {termLabel && step === 3 ? ` · ${termLabel}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goTo(step + 1)}
              className="press inline-flex min-h-12 shrink-0 items-center justify-center rounded-pill bg-terracotta-deep px-6 text-sm font-medium text-cream"
            >
              Dalej
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-ink-soft">
        {label} {required && <span className="text-terracotta-ink">*</span>}
      </label>
      {children}
      {error && (
        <p id={`err-${id}`} className="mt-1.5 text-sm text-terracotta-ink">
          {error}
        </p>
      )}
    </div>
  );
}

function SummaryList({
  rows,
  onEdit,
  current,
}: {
  rows: { label: string; value: ReactNode; step: number }[];
  onEdit?: (step: number) => void;
  current?: number;
}) {
  return (
    <dl className="space-y-3 text-sm">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-4">
          <dt className="text-muted">{r.label}</dt>
          <dd className="flex min-w-0 items-baseline gap-3 text-right text-ink">
            <span className="min-w-0">{r.value ?? "-"}</span>
            {onEdit && r.value && r.step !== current && (
              <button
                type="button"
                onClick={() => onEdit(r.step)}
                className="-my-3 inline-flex min-h-11 shrink-0 items-center px-1 text-xs text-ink-soft underline decoration-champagne underline-offset-4 hover:text-terracotta-ink"
                aria-label={`Zmień: ${r.label.toLowerCase()}`}
              >
                zmień
              </button>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
