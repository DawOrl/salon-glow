"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Sygnaturowy "blur-to-sharp reveal" — solidny, oparty o IntersectionObserver.
 * Zasady (progressive enhancement, nic nie może utknąć niewidoczne):
 * - Bez JS / przy prefers-reduced-motion → treść po prostu widoczna.
 * - Element już w kadrze przy montażu → zostaje widoczny (bez animacji, bez migotania).
 * - Element poniżej foldu → chowany i odsłaniany dopiero, gdy wejdzie w widok.
 */
export function Reveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Już widoczne? Nie chowamy — unikamy migotania treści nad foldem.
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return;

    el.classList.add("reveal--js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
