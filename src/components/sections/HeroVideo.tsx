"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wideo-loop nakładane na zoptymalizowany poster (next/image pod spodem).
 * - Odtwarzane tylko gdy plik /hero/loop.mp4 istnieje i da się odtworzyć
 *   (zdarzenie canplay) ORAZ użytkownik nie prosił o ograniczenie ruchu.
 * - W innym wypadku pozostaje przezroczyste → widać poster. Brak migotania.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onCanPlay = () => {
      setShow(true);
      v.play().catch(() => {});
    };
    v.addEventListener("canplay", onCanPlay);
    // Spróbuj wczytać (jeśli pliku brak, zdarzenie nie nadejdzie → poster zostaje).
    v.load();
    return () => v.removeEventListener("canplay", onCanPlay);
  }, []);

  return (
    <video
      ref={ref}
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-silk ${
        show ? "opacity-100" : "opacity-0"
      }`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/hero/loop.mp4" type="video/mp4" />
    </video>
  );
}
