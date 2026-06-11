import type { ReactNode } from "react";

/** Mała etykieta nad nagłówkiem — uppercase + hairline w kolorze szampana. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-3 font-sans text-eyebrow font-medium uppercase text-muted ${className}`}
    >
      <span aria-hidden className="h-px w-7 bg-champagne" />
      {children}
    </span>
  );
}
