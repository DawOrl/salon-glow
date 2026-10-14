"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Photo } from "../ui/Photo";
import type { Transformation } from "@/lib/types";

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * Suwak "przed/po".
 * - Mysz: kliknięcie lub przeciąganie w dowolnym miejscu kadru.
 * - Dotyk: przeciąganie w poziomie (touch-action: pan-y), więc pionowe
 *   przewijanie strony na telefonie nadal działa, a stuknięcie nic nie psuje.
 * - Klawiatura: uchwyt ma role="slider"; strzałki co 2%, z Shift lub
 *   PageUp/PageDown co 10%, Home/End do krawędzi.
 * - Jednorazowa podpowiedź ruchem po wejściu w kadr (pomijana przy
 *   prefers-reduced-motion i gdy użytkownik już dotknął suwaka).
 */
export function CompareSlider({
  item,
  sizes,
  priority = false,
  hint = false,
}: {
  item: Transformation;
  sizes: string;
  priority?: boolean;
  hint?: boolean;
}) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  // Dotyk: start gestu, żeby odróżnić przeciąganie w poziomie od przewijania.
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!hint || !box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const D = 1600;
        const step = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - start) / D);
          // 50 -> 64 -> 38 -> 50, łagodnie (sinus z wygaszaniem)
          setPos(50 + Math.sin(t * Math.PI * 2) * 14 * (1 - t * 0.35));
          if (t < 1) raf = requestAnimationFrame(step);
          else setPos(50);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(box);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [hint]);

  function fromClientX(x: number) {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(clamp(((x - r.left) / r.width) * 100));
  }

  function startDrag(e: PointerEvent<HTMLDivElement>) {
    touched.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    fromClientX(e.clientX);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") {
      if (e.button === 0) startDrag(e);
      return;
    }
    touchStart.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (dragging) {
      fromClientX(e.clientX);
      return;
    }
    const s0 = touchStart.current;
    if (!s0) return;
    const dx = Math.abs(e.clientX - s0.x);
    const dy = Math.abs(e.clientY - s0.y);
    if (dx > 6 && dx > dy) {
      touchStart.current = null;
      startDrag(e);
    }
  }

  function endDrag() {
    touchStart.current = null;
    setDragging(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const big = e.shiftKey ? 10 : 2;
    const map: Record<string, (p: number) => number> = {
      ArrowLeft: (p) => p - big,
      ArrowDown: (p) => p - big,
      ArrowRight: (p) => p + big,
      ArrowUp: (p) => p + big,
      PageDown: (p) => p - 10,
      PageUp: (p) => p + 10,
      Home: () => 0,
      End: () => 100,
    };
    const fn = map[e.key];
    if (!fn) return;
    e.preventDefault();
    touched.current = true;
    setPos((p) => clamp(fn(p)));
  }

  const rounded = Math.round(pos);

  return (
    <div
      ref={boxRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="group relative aspect-4/5 w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-card bg-sand"
    >
      {/* PO: warstwa spodnia */}
      <Photo src={item.afterImage} alt={item.alt} sizes={sizes} priority={priority} />

      {/* PRZED: warstwa przycinana od prawej */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Photo src={item.beforeImage} alt="" sizes={sizes} priority={priority} />
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute top-4 left-4 rounded-pill bg-ink/70 px-3 py-1 text-xs text-cream backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: pos > 14 ? 1 : 0 }}
      >
        Przed
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute top-4 right-4 rounded-pill bg-cream/90 px-3 py-1 text-xs text-ink transition-opacity duration-200"
        style={{ opacity: pos < 86 ? 1 : 0 }}
      >
        Po
      </span>

      {/* Linia i uchwyt (uchwyt = element suwaka dla klawiatury i czytników) */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-cream shadow-[0_0_0_1px_rgba(26,23,20,0.12)]" />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Porównanie: przesuń, aby zobaczyć efekt przed i po"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          aria-valuetext={`${rounded}% zdjęcia przed, ${100 - rounded}% zdjęcia po`}
          onKeyDown={onKeyDown}
          className={`pointer-events-auto absolute top-1/2 left-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-ink shadow-[0_8px_24px_-10px_rgba(26,23,20,0.5)] ring-1 ring-ink/10 transition-transform duration-200 ease-silk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
            dragging ? "scale-95" : "group-hover:scale-105"
          }`}
        >
          <svg aria-hidden width="22" height="12" viewBox="0 0 22 12" fill="none">
            <path
              d="M6 1 1 6l5 5M16 1l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
