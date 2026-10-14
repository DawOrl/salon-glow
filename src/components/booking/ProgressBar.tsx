export const STEPS = ["Usługa", "Stylista", "Termin", "Dane"];

/**
 * Pasek postępu kreatora (1-indeksowany `current`). Ukończone kroki są
 * przyciskami powrotu; na telefonie widać nazwę bieżącego kroku.
 */
export function ProgressBar({
  current,
  onStep,
}: {
  current: number;
  onStep?: (step: number) => void;
}) {
  return (
    <nav aria-label="Postęp rezerwacji">
      <p className="mb-4 text-sm text-muted sm:hidden">
        Krok {current} z {STEPS.length}:{" "}
        <span className="font-display italic text-ink">{STEPS[current - 1]}</span>
      </p>
      <ol className="flex items-center gap-2">
        {STEPS.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          const dot = (
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm transition-colors duration-300 ${
                done
                  ? "bg-terracotta-deep text-cream"
                  : active
                    ? "bg-ink text-cream"
                    : "border border-line text-muted"
              }`}
            >
              {done ? (
                <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="m2 6.5 2.5 2.5L10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                step
              )}
            </span>
          );
          const text = (
            <span className={`hidden text-sm sm:block ${active ? "text-ink" : "text-muted"}`}>
              {label}
            </span>
          );
          return (
            <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
              {done && onStep ? (
                <button
                  type="button"
                  onClick={() => onStep(step)}
                  className="press -m-1.5 flex min-h-11 items-center gap-2 rounded-pill p-1.5 hover:text-ink"
                  aria-label={`Wróć do kroku ${step}: ${label}`}
                >
                  {dot}
                  {text}
                </button>
              ) : (
                <span
                  className="flex items-center gap-2"
                  aria-current={active ? "step" : undefined}
                >
                  {dot}
                  {text}
                  <span className="sr-only">
                    {active ? " (bieżący krok)" : " (do zrobienia)"}
                  </span>
                </span>
              )}
              {step < STEPS.length && (
                <span
                  aria-hidden
                  className={`h-px min-w-3 flex-1 ${done ? "bg-terracotta-deep" : "bg-line"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
