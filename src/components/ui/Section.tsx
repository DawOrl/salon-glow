import type { ReactNode } from "react";
import { Container } from "./Container";

/**
 * Sekcja strony — spójny pionowy rytm. `bleed` pomija Container
 * (sekcje full-bleed jak hero/galeria zarządzają własnym layoutem).
 */
export function Section({
  id,
  children,
  className = "",
  containerClassName = "",
  bleed = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  bleed?: boolean;
}) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
