"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createReservation, type BookingState } from "@/app/lib/actions";
import { serviceCategories, services } from "@/data/services";
import { getServiceById, getStaffForService } from "@/lib/queries";
import { formatDuration, formatPrice } from "@/lib/format";
import { salon } from "@/lib/salon";
import { getAvailableDays, getSlotsForDay, type DayOption } from "@/lib/slots";
import type { TimeSlot } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { SubmitButton } from "./SubmitButton";

const inputBase =
  "w-full rounded-xl border bg-cream px-4 py-3 text-ink placeholder:text-muted/70 transition-colors duration-300 ease-silk focus:outline-none focus:ring-1";

function fieldClass(hasError: boolean) {
  return `${inputBase} ${
    hasError
      ? "border-terracotta focus:border-terracotta focus:ring-terracotta"
      : "border-line focus:border-terracotta focus:ring-terracotta"
  }`;
}

export function BookingWizard({
  initialServiceSlug,
}: {
  initialServiceSlug?: string;
}) {
  const initialService = initialServiceSlug
    ? services.find((s) => s.slug === initialServiceSlug)
    : undefined;

  const [step, setStep] = useState(initialService ? 2 : 1);
  const [serviceId, setServiceId] = useState<string | null>(
    initialService?.id ?? null,
  );
  const [staffId, setStaffId] = useState<string>("any");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  // Leniwa inicjalizacja — strona /rezerwacja jest dynamiczna (SSR na żądanie),
  // więc dzień po stronie serwera i klienta jest ten sam → brak hydration mismatch.
  const [days] = useState<DayOption[]>(() =>
    getAvailableDays(new Date(), 10, salon.openingHours),
  );

  const slots: TimeSlot[] = useMemo(
    () => (date ? getSlotsForDay(date, salon.openingHours) : []),
    [date],
  );

  const service = serviceId ? getServiceById(serviceId) : undefined;
  const eligibleStaff = service ? getStaffForService(service) : [];

  const [state, formAction] = useActionState<BookingState, FormData>(
    createReservation,
    { ok: false },
  );
  const errors = state.errors ?? {};

  // Po zmianie kroku przenosimy fokus na nagłówek kroku — czytnik ekranu ogłasza
  // nową treść, a użytkownik klawiatury nie traci kontekstu (WCAG 2.4.3 / 4.1.3).
  const contentRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    contentRef.current
      ?.querySelector<HTMLElement>("[data-step-heading]")
      ?.focus();
  }, [step]);

  function next() {
    setStepError(null);
    if (step === 1 && !serviceId) {
      setStepError("Wybierz usługę, aby przejść dalej.");
      return;
    }
    if (step === 3 && (!date || !time)) {
      setStepError("Wybierz dzień i godzinę wizyty.");
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  }
  function back() {
    setStepError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  const selectedDay = days.find((d) => d.iso === date);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
      <div>
        <ProgressBar current={step} />

        <div ref={contentRef} className="mt-10">
          {/* KROK 1 — Usługa */}
          {step === 1 && (
            <fieldset>
              <legend
                tabIndex={-1}
                data-step-heading
                className="font-display text-2xl text-ink outline-none"
              >
                Wybierz usługę
              </legend>
              <div className="mt-6 space-y-8">
                {serviceCategories.map((cat) => (
                  <div key={cat.id}>
                    <h3 className="text-xs uppercase tracking-[0.16em] text-muted">
                      {cat.name}
                    </h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {services
                        .filter((s) => s.categoryId === cat.id)
                        .map((s) => {
                          const selected = s.id === serviceId;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => {
                                setServiceId(s.id);
                                setStaffId("any");
                              }}
                              className={`rounded-card border p-4 text-left transition-colors duration-300 ease-silk ${
                                selected
                                  ? "border-terracotta bg-sand/50"
                                  : "border-line bg-cream hover:border-champagne"
                              }`}
                            >
                              <span className="flex items-center justify-between gap-3">
                                <span className="font-medium text-ink">
                                  {s.name}
                                </span>
                                <span className="shrink-0 text-sm tabular-nums text-terracotta">
                                  {formatPrice(s)}
                                </span>
                              </span>
                              <span className="mt-1 block text-xs text-muted">
                                {formatDuration(s.durationMin)}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {/* KROK 2 — Stylista */}
          {step === 2 && (
            <fieldset>
              <legend
                tabIndex={-1}
                data-step-heading
                className="font-display text-2xl text-ink outline-none"
              >
                Wybierz stylistę
              </legend>
              <p className="mt-2 text-sm text-muted">
                Możesz zostawić wybór nam — przydzielimy pierwszego wolnego.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  aria-pressed={staffId === "any"}
                  onClick={() => setStaffId("any")}
                  className={`rounded-card border p-4 text-left transition-colors duration-300 ease-silk ${
                    staffId === "any"
                      ? "border-terracotta bg-sand/50"
                      : "border-line bg-cream hover:border-champagne"
                  }`}
                >
                  <span className="font-medium text-ink">Pierwszy wolny</span>
                  <span className="mt-1 block text-xs text-muted">
                    Najszybszy dostępny termin
                  </span>
                </button>
                {eligibleStaff.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    aria-pressed={staffId === person.id}
                    onClick={() => setStaffId(person.id)}
                    className={`rounded-card border p-4 text-left transition-colors duration-300 ease-silk ${
                      staffId === person.id
                        ? "border-terracotta bg-sand/50"
                        : "border-line bg-cream hover:border-champagne"
                    }`}
                  >
                    <span className="font-medium text-ink">{person.name}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {person.role}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* KROK 3 — Termin */}
          {step === 3 && (
            <fieldset>
              <legend
                tabIndex={-1}
                data-step-heading
                className="font-display text-2xl text-ink outline-none"
              >
                Wybierz termin
              </legend>
              <p className="mt-2 text-sm text-muted">Dzień</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {days.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    aria-pressed={date === d.iso}
                    onClick={() => {
                      setDate(d.iso);
                      setTime(null);
                    }}
                    className={`rounded-xl border px-4 py-2.5 text-center transition-colors duration-300 ease-silk ${
                      date === d.iso
                        ? "border-terracotta bg-sand/50"
                        : "border-line bg-cream hover:border-champagne"
                    }`}
                  >
                    <span className="block text-xs uppercase text-muted">
                      {d.weekday}
                    </span>
                    <span className="block text-sm text-ink">{d.label}</span>
                  </button>
                ))}
              </div>

              {date && (
                <>
                  <p className="mt-6 text-sm text-muted">Godzina</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        aria-pressed={time === slot.time}
                        onClick={() => setTime(slot.time)}
                        className={`rounded-xl border px-5 py-2.5 text-sm tabular-nums transition-colors duration-300 ease-silk ${
                          !slot.available
                            ? "cursor-not-allowed border-line bg-sand/40 text-muted/50 line-through"
                            : time === slot.time
                              ? "border-terracotta bg-sand/50 text-ink"
                              : "border-line bg-cream text-ink hover:border-champagne"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </fieldset>
          )}

          {/* KROK 4 — Dane + wysyłka */}
          {step === 4 && (
            <form action={formAction} noValidate>
              <h2
                tabIndex={-1}
                data-step-heading
                className="font-display text-2xl text-ink outline-none"
              >
                Twoje dane
              </h2>

              <input type="hidden" name="serviceId" value={serviceId ?? ""} />
              <input type="hidden" name="staffId" value={staffId} />
              <input type="hidden" name="date" value={date ?? ""} />
              <input type="hidden" name="time" value={time ?? ""} />
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Nie wypełniaj
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              {state.message && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-terracotta/40 bg-cream px-4 py-3 text-sm text-terracotta-deep"
                >
                  {state.message}
                </p>
              )}

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-ink-soft">
                    Imię i nazwisko <span className="text-terracotta">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    className={`mt-2 ${fieldClass(Boolean(errors.name))}`}
                  />
                  {errors.name && (
                    <p id="err-name" className="mt-1.5 text-sm text-terracotta-deep">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="block text-sm text-ink-soft">
                      Telefon
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "err-phone" : undefined}
                      className={`mt-2 ${fieldClass(Boolean(errors.phone))}`}
                    />
                    {errors.phone && (
                      <p id="err-phone" className="mt-1.5 text-sm text-terracotta-deep">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-ink-soft">
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      className={`mt-2 ${fieldClass(Boolean(errors.email))}`}
                    />
                    {errors.email && (
                      <p id="err-email" className="mt-1.5 text-sm text-terracotta-deep">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <p className="-mt-2 text-xs text-muted">
                  Podaj telefon lub e-mail — wystarczy jedno, oddzwonimy z
                  potwierdzeniem.
                </p>

                <div>
                  <label htmlFor="notes" className="block text-sm text-ink-soft">
                    Uwagi (opcjonalnie)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    aria-invalid={Boolean(errors.notes)}
                    aria-describedby={errors.notes ? "err-notes" : undefined}
                    className={`mt-2 ${fieldClass(Boolean(errors.notes))}`}
                  />
                  {errors.notes && (
                    <p id="err-notes" className="mt-1.5 text-sm text-terracotta-deep">
                      {errors.notes}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      name="consent"
                      className="mt-1 h-4 w-4 shrink-0 accent-terracotta"
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? "err-consent" : undefined}
                    />
                    <span>
                      Zgadzam się na kontakt w celu potwierdzenia wizyty.{" "}
                      <span className="text-terracotta">*</span>
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="err-consent" className="mt-1.5 text-sm text-terracotta-deep">
                      {errors.consent}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-6 text-xs text-muted">{salon.bookingPolicy}</p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={back}
                  className="text-sm text-muted transition-colors duration-300 ease-silk hover:text-ink"
                >
                  ← Wstecz
                </button>
                <SubmitButton />
              </div>
            </form>
          )}
        </div>

        {/* Nawigacja kroków 1-3 */}
        {step < 4 && (
          <div className="mt-8">
            {stepError && (
              <p role="alert" className="mb-4 text-sm text-terracotta-deep">
                {stepError}
              </p>
            )}
            <div className="flex items-center gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  className="text-sm text-muted transition-colors duration-300 ease-silk hover:text-ink"
                >
                  ← Wstecz
                </button>
              )}
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-terracotta px-8 py-4 text-sm font-medium text-cream shadow-[0_8px_24px_-12px_rgba(156,95,75,0.6)] transition duration-300 ease-silk hover:bg-terracotta-deep hover:-translate-y-0.5"
              >
                Dalej
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Podsumowanie na żywo */}
      <aside className="lg:pt-16">
        <div className="sticky top-28 rounded-card border border-line bg-sand/30 p-6">
          <h2 className="text-xs uppercase tracking-[0.16em] text-muted">
            Twoja wizyta
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Usługa</dt>
              <dd className="text-right text-ink">{service?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Stylista</dt>
              <dd className="text-right text-ink">
                {staffId === "any"
                  ? "Pierwszy wolny"
                  : (eligibleStaff.find((p) => p.id === staffId)?.name ?? "—")}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-muted">Termin</dt>
              <dd className="text-right text-ink">
                {selectedDay && time
                  ? `${selectedDay.weekday}, ${selectedDay.label}, ${time}`
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Cena</dt>
              <dd className="text-right font-medium text-ink">
                {service ? formatPrice(service) : "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-xs text-muted">
            <span className="text-terracotta">✦</span> 0% prowizji — rezerwujesz
            bezpośrednio u nas.
          </p>
        </div>
      </aside>
    </div>
  );
}
