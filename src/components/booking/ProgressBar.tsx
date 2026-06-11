const STEPS = ["Usługa", "Stylista", "Termin", "Dane"];

/** Pasek postępu kreatora (1-indeksowany `current`). */
export function ProgressBar({ current }: { current: number }) {
  return (
    <ol
      className="flex items-center gap-2"
      aria-label={`Postęp rezerwacji: krok ${current} z ${STEPS.length}`}
    >
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              aria-current={active ? "step" : undefined}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-300 ${
                done
                  ? "bg-terracotta text-cream"
                  : active
                    ? "bg-ink text-cream"
                    : "bg-sand text-muted"
              }`}
            >
              {done ? "✓" : step}
            </span>
            <span
              className={`hidden text-xs sm:block ${active ? "text-ink" : "text-muted"}`}
            >
              {label}
            </span>
            {step < STEPS.length && (
              <span
                aria-hidden
                className={`h-px flex-1 ${done ? "bg-terracotta" : "bg-line"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
