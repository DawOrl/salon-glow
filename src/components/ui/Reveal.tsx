"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Sygnaturowy "blur-to-sharp reveal".
 * Zasady (progressive enhancement, nic nie może utknąć niewidoczne):
 * - Bez JS / przy prefers-reduced-motion treść jest po prostu widoczna.
 * - Element już w kadrze przy montażu zostaje widoczny (bez migotania).
 * - Element poniżej foldu jest odsłaniany, gdy jego górna krawędź wejdzie
 *   w dolne ~92% ekranu. Sprawdzamy to wspólnym, dławionym przez rAF
 *   nasłuchem scrolla, a nie IntersectionObserverem: przy szybkim
 *   przewinięciu (pasek, klawisz End) IO potrafi "przeskoczyć" element
 *   i zostawić go ukrytego, a tu wszystko powyżej linii zawsze się odsłania.
 */
const pending = new Set<HTMLElement>();
let ticking = false;

function check() {
  ticking = false;
  const line = window.innerHeight * 0.92;
  for (const el of pending) {
    if (el.getBoundingClientRect().top < line) {
      el.classList.add("reveal--in");
      pending.delete(el);
    }
  }
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(check);
}

function track(el: HTMLElement) {
  if (pending.size === 0) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }
  pending.add(el);
  onScroll();
}

function untrack(el: HTMLElement) {
  pending.delete(el);
  if (pending.size === 0) {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  }
}

export function Reveal({
  children,
  className = "",
  style,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Opóźnienie w ms (krótka kaskada w obrębie sekcji). */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add("reveal--js");
    track(el);
    return () => untrack(el);
  }, []);

  const merged = delay
    ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties)
    : style;

  return (
    <div ref={ref} className={`reveal ${className}`.trim()} style={merged}>
      {children}
    </div>
  );
}
