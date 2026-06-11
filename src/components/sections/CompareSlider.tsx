"use client";

import { useState } from "react";
import { Photo } from "../ui/Photo";
import type { Transformation } from "@/lib/types";

/** Suwak „przed/po” — dostępny <input range> + rysowany ręcznie uchwyt i przycięcie. */
export function CompareSlider({
  item,
  sizes,
}: {
  item: Transformation;
  sizes: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-4/5 w-full select-none overflow-hidden rounded-card ring-1 ring-line">
      {/* PO — warstwa spodnia */}
      <Photo src={item.afterImage} alt={`${item.alt} (po)`} sizes={sizes} />

      {/* PRZED — warstwa przycinana do lewej */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Photo src={item.beforeImage} alt={`${item.alt} (przed)`} sizes={sizes} />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-pill bg-ink/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cream">
        przed
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-pill bg-champagne px-3 py-1 text-xs uppercase tracking-[0.16em] text-ink">
        po
      </span>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-cream/90 shadow-[0_0_0_1px_rgba(26,23,20,0.15)]" />
        <div className="absolute top-1/2 left-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-ink shadow-lg ring-1 ring-line">
          <span aria-hidden className="text-sm tracking-tighter">
            ‹ ›
          </span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Przeciągnij, aby porównać efekt przed i po"
        className="ba-range absolute inset-0 h-full w-full"
      />
    </div>
  );
}
