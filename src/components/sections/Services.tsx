import Link from "next/link";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { serviceCategories } from "@/data/services";
import { getServicesByCategory } from "@/lib/queries";
import { formatDuration, formatPrice } from "@/lib/format";

export function Services() {
  return (
    <Section id="uslugi" className="border-t border-line">
      <Reveal>
        <Eyebrow>Usługi i cennik</Eyebrow>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl font-display text-display font-light text-ink">
            Cennik, w którym wszystko jest jasne
          </h2>
          <p className="max-w-sm text-sm text-muted">
            Ceny „od” — finalna zależy od długości i gęstości włosów. Czas wizyty
            podajemy z góry, żebyś mogła zaplanować dzień.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {serviceCategories.map((cat) => {
          const items = getServicesByCategory(cat.id);
          return (
            <Reveal key={cat.id}>
              <article className="flex h-full flex-col rounded-card border border-line bg-cream p-7 transition-colors duration-300 hover:border-champagne/50 md:p-9">
                <header className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
                  <h3 className="font-display text-2xl text-ink">{cat.name}</h3>
                  <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-muted">
                    {items.length} usług
                  </span>
                </header>

                <ul className="mt-3 divide-y divide-line/70">
                  {items.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/uslugi/${s.slug}`}
                        className="group flex items-center justify-between gap-4 py-4 transition-colors duration-300 ease-silk hover:text-terracotta"
                      >
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span
                              className="truncate font-medium text-ink group-hover:text-terracotta"
                              style={{ viewTransitionName: `svc-${s.slug}` }}
                            >
                              {s.name}
                            </span>
                            {s.popular && (
                              <span className="shrink-0 rounded-pill bg-champagne/20 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-terracotta-deep">
                                popularne
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {formatDuration(s.durationMin)}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block whitespace-nowrap font-medium tabular-nums text-ink">
                            {formatPrice(s)}
                          </span>
                          <span
                            aria-hidden
                            className="text-xs text-muted opacity-0 transition-opacity duration-300 ease-silk group-hover:opacity-100"
                          >
                            szczegóły →
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
