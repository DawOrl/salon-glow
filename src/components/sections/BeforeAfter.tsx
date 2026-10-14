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

const pad = (n: number) => String(n).padStart(2, "0");

export function BeforeAfter() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const item = transformations[active];
  const slug = getServiceById(item.serviceId)?.slug ?? "";

  return (
    <Section id="metamorfozy" className="border-t border-line bg-sand/35">
      <Reveal>
        <Eyebrow index="02">Metamorfozy</Eyebrow>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl font-display text-display font-light text-ink">
            Przeciągnij i zobacz różnicę
          </h2>
          <p className="max-w-sm text-sm text-muted">
            Ta sama osoba, to samo światło, ten sam kadr. Zmieniają się tylko
            włosy. Przy każdej metamorfozie: usługa, stylistka i czas wizyty.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="min-w-0 lg:col-span-6">
          <CompareSlider
            key={item.id}
            item={item}
            hint={active === 0}
            sizes="(min-width: 1152px) 540px, (min-width: 1024px) 46vw, 100vw"
          />
          <p className="mt-3 flex items-center justify-between gap-4 text-sm text-muted">
            <span>Przeciągnij albo użyj strzałek na klawiaturze.</span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="press -my-2 inline-flex min-h-11 items-center gap-2 rounded-pill px-3 text-ink-soft transition-colors hover:text-terracotta-ink"
            >
              <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M8.5 1H13v4.5M5.5 13H1V8.5M13 1 8 6M1 13l5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Powiększ
            </button>
          </p>
        </Reveal>

        <div className="flex min-w-0 flex-col lg:col-span-6">
          <Reveal>
            <p className="font-display text-sm italic text-terracotta-ink tabular-nums">
              {pad(active + 1)} / {pad(transformations.length)}
            </p>
            <h3 className="mt-2 font-display text-title font-light text-ink">
              {item.title}
            </h3>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-line py-5 text-sm">
              <div>
                <dt className="text-muted">Usługa</dt>
                <dd className="mt-1 text-ink">{item.serviceName}</dd>
              </div>
              <div>
                <dt className="text-muted">Stylistka</dt>
                <dd className="mt-1 text-ink">{item.staffName}</dd>
              </div>
              <div>
                <dt className="text-muted">Czas wizyty</dt>
                <dd className="mt-1 tabular-nums text-ink">
                  {formatDuration(item.durationMin)}
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <Button href={`/rezerwacja?usluga=${slug}`} variant="outline" className="px-6 py-3">
                Chcę taki efekt
              </Button>
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <h4 className="text-sm text-muted">Wybierz metamorfozę</h4>
            <ul className="no-scrollbar -mx-6 mt-3 flex snap-x gap-3 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-1 lg:overflow-visible lg:px-0">
              {transformations.map((t, i) => {
                const on = i === active;
                return (
                  <li key={t.id} className="shrink-0 snap-start">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      className={`group flex w-56 items-center gap-3 rounded-2xl p-2 text-left transition-colors duration-300 ease-silk lg:w-full ${
                        on ? "bg-cream ring-1 ring-terracotta/50" : "hover:bg-cream/70"
                      }`}
                    >
                      <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-sand">
                        <Photo src={t.afterImage} alt="" sizes="48px" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-xs italic text-terracotta-ink tabular-nums">
                          {pad(i + 1)}
                        </span>
                        <span className={`block truncate text-sm ${on ? "text-ink" : "text-ink-soft"}`}>
                          {t.title}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>

      {open && (
        <Lightbox label={`Metamorfoza: ${item.title}`} onClose={() => setOpen(false)}>
          <CompareSlider key={`lb-${item.id}`} item={item} sizes="(min-width: 768px) 60vh, 92vw" />
          <p className="mt-4 text-center text-sm text-cream/80">
            {item.title} · {item.serviceName}
          </p>
        </Lightbox>
      )}
    </Section>
  );
}
