"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Photo } from "../ui/Photo";
import { serviceCategories } from "@/data/services";
import { getServicesByCategory } from "@/lib/queries";
import { formatDuration, formatPrice, pluralUslugi } from "@/lib/format";

/**
 * Karta usług: kategorie jako zakładki (mniej przewijania na telefonie),
 * pozycje jak w drukowanym cenniku: nazwa, linia kropkowa, cena.
 * Zakładki zgodne z wzorcem ARIA (strzałki, Home/End, roving tabindex).
 */
export function Services() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const cat = serviceCategories[active];
  const items = getServicesByCategory(cat.id);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const n = serviceCategories.length;
    const keys: Record<string, number> = {
      ArrowRight: (active + 1) % n,
      ArrowDown: (active + 1) % n,
      ArrowLeft: (active - 1 + n) % n,
      ArrowUp: (active - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key];
    setActive(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <Section id="cennik" className="border-t border-line">
      <Reveal>
        <Eyebrow index="03">Karta usług</Eyebrow>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl font-display text-display font-light text-ink">
            Cennik, w którym wszystko jest jasne
          </h2>
          <p className="max-w-sm text-sm text-muted">
            Ceny „od”: finalna zależy od długości i gęstości włosów. Czas wizyty
            podajemy z góry, żebyś mogła zaplanować dzień.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="min-w-0 lg:col-span-4">
          <div
            role="tablist"
            aria-label="Kategorie usług"
            className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line lg:px-0"
          >
            {serviceCategories.map((c, i) => {
              const on = i === active;
              const count = getServicesByCategory(c.id).length;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  id={`tab-${c.slug}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls={`panel-${c.slug}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKeyDown}
                  className={`press shrink-0 rounded-pill border px-4 py-2.5 text-left text-sm transition-colors duration-300 ease-silk lg:flex lg:items-baseline lg:justify-between lg:gap-4 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-5 ${
                    on
                      ? "border-ink bg-ink text-cream lg:bg-transparent lg:text-ink"
                      : "border-line text-ink-soft hover:border-ink/30 lg:text-muted lg:hover:text-ink"
                  }`}
                >
                  <span className="lg:flex lg:items-baseline lg:gap-3 lg:font-display lg:text-2xl lg:font-light">
                    <span
                      aria-hidden
                      className={`hidden h-px translate-y-[-0.3em] bg-terracotta transition-[width] duration-300 ease-silk lg:block ${
                        on ? "w-6" : "w-0"
                      }`}
                    />
                    {c.name}
                  </span>
                  <span
                    className={`hidden shrink-0 whitespace-nowrap text-sm lg:inline ${on ? "text-terracotta-ink" : "text-muted"}`}
                  >
                    {count} {pluralUslugi(count)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative mt-8 hidden aspect-4/5 w-3/4 overflow-hidden rounded-card bg-sand lg:block">
            <Photo
              src="/studio/detal.webp"
              alt="Ceramiczna miska z farbą, pędzel, grzebień i lniany ręcznik na dębowej konsoli."
              sizes="280px"
            />
          </div>
        </Reveal>

        <div
          id={`panel-${cat.slug}`}
          role="tabpanel"
          aria-labelledby={`tab-${cat.slug}`}
          className="min-w-0 lg:col-span-8"
        >
          <p className="max-w-xl text-ink-soft">{cat.description}</p>
          <ul className="mt-6 border-t border-line">
            {items.map((s) => (
              <li key={s.id} className="border-b border-line">
                <div className="flex items-baseline gap-3 pt-5">
                  <Link
                    href={`/uslugi/${s.slug}`}
                    className="min-w-0 font-medium text-ink underline-offset-4 transition-colors hover:text-terracotta-ink hover:underline"
                    style={{ viewTransitionName: `svc-${s.slug}` }}
                  >
                    {s.name}
                  </Link>
                  <span aria-hidden className="leader hidden sm:block" />
                  <span className="ml-auto shrink-0 whitespace-nowrap font-display text-lg tabular-nums text-ink sm:ml-0">
                    {formatPrice(s)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1 pb-4 text-sm">
                  <span className="text-muted">
                    {formatDuration(s.durationMin)}
                    {s.popular && (
                      <span className="font-display text-terracotta-ink italic">
                        {" "}
                        · często wybierane
                      </span>
                    )}
                  </span>
                  <Link
                    href={`/rezerwacja?usluga=${s.slug}`}
                    className="-my-2 inline-flex min-h-11 shrink-0 items-center text-ink-soft underline decoration-champagne underline-offset-4 transition-colors hover:text-terracotta-ink"
                    aria-label={`Umów: ${s.name}`}
                  >
                    Umów
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/uslugi"
            className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-ink underline decoration-champagne underline-offset-4 transition-colors hover:text-terracotta-ink"
          >
            Pełny cennik z opisami usług
          </Link>
        </div>
      </div>
    </Section>
  );
}
