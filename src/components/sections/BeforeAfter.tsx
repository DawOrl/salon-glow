"use client";

import { useState } from "react";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { Photo } from "../ui/Photo";
import { Lightbox } from "../ui/Lightbox";
import { CompareSlider } from "./CompareSlider";
import { transformations } from "@/data/portfolio";
import { getServiceById } from "@/lib/queries";
import { formatDuration } from "@/lib/format";

export function BeforeAfter() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const item = transformations[active];

  return (
    <Section id="metamorfozy" className="border-t border-line bg-sand/30">
      <Reveal>
        <Eyebrow>Metamorfozy</Eyebrow>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl font-display text-display font-light text-ink">
            Przeciągnij i zobacz różnicę
          </h2>
          <p className="max-w-sm text-sm text-muted">
            {transformations.length} realnych metamorfoz. Każda opisana usługą,
            stylistą i czasem trwania wizyty.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Suwak przed/po */}
        <Reveal>
          <CompareSlider
            key={item.id}
            item={item}
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 text-sm text-muted transition-colors duration-300 ease-silk hover:text-terracotta"
          >
            ⤢ Powiększ porównanie
          </button>
        </Reveal>

        {/* Podpis + przełącznik metamorfoz */}
        <div className="flex flex-col">
          <Reveal>
            <h3 className="font-display text-2xl text-ink">{item.title}</h3>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-muted">Usługa</dt>
                <dd className="text-ink">{item.serviceName}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-muted">Stylista</dt>
                <dd className="text-ink">{item.staffName}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-muted">Czas wizyty</dt>
                <dd className="tabular-nums text-ink">
                  {formatDuration(item.durationMin)}
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <Button
                href={`/rezerwacja?usluga=${getServiceById(item.serviceId)?.slug ?? ""}`}
                variant="outline"
                className="px-6 py-3"
              >
                Chcę taki efekt
              </Button>
            </div>
          </Reveal>

          {/* Miniatury */}
          <div className="mt-8">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">
              Wybierz metamorfozę
            </p>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3">
              {transformations.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    aria-label={`Pokaż metamorfozę: ${t.title}`}
                    className={`relative block aspect-square w-full overflow-hidden rounded-xl ring-1 transition-all duration-300 ease-silk ${
                      i === active
                        ? "ring-2 ring-terracotta"
                        : "ring-line hover:ring-champagne"
                    }`}
                  >
                    <Photo
                      src={t.afterImage}
                      alt=""
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {open && (
        <Lightbox label={`Metamorfoza: ${item.title}`} onClose={() => setOpen(false)}>
          <CompareSlider key={`lb-${item.id}`} item={item} sizes="90vw" />
          <p className="mt-4 text-center text-sm text-cream/80">
            {item.title} · {item.serviceName}
          </p>
        </Lightbox>
      )}
    </Section>
  );
}
