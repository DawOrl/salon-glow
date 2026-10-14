import type { ReactNode } from "react";
import { Container } from "./Container";

const spacing = {
  default: "py-20 md:py-28",
  loose: "py-24 md:py-36",
  tight: "py-14 md:py-20",
} as const;

/**
 * Sekcja strony: wspólny pionowy rytm z trzema stopniami oddechu.
 * `bleed` pomija Container (sekcje full-bleed zarządzają własnym układem).
 */
export function Section({
  id,
  children,
  className = "",
  containerClassName = "",
  bleed = false,
  space = "default",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  bleed?: boolean;
  space?: keyof typeof spacing;
}) {
  return (
    <section id={id} className={`${spacing[space]} ${className}`}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
