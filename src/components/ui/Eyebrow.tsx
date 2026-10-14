import type { ReactNode } from "react";

/**
 * Etykieta sekcji w stylu drukowanej karty salonu: numer "N°" kursywą
 * Fraunces, cienka linia w kolorze szampana i nazwa zwykłym krojem.
 * Zastępuje rozstrzelone wersaliki (mniej krzyku, więcej charakteru).
 */
export function Eyebrow({
  children,
  index,
  className = "",
}: {
  children: ReactNode;
  /** Numer rozdziału, np. "01". */
  index?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-3 text-sm text-muted ${className}`}
    >
      {index && (
        <span className="font-display text-base italic text-terracotta-ink">
          N°{index}
        </span>
      )}
      <span aria-hidden className="h-px w-8 translate-y-[-0.3em] bg-champagne" />
      <span className="font-display italic tracking-[0.01em]">{children}</span>
    </span>
  );
}
