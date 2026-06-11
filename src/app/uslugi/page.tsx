import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { serviceCategories } from "@/data/services";
import { getServicesByCategory } from "@/lib/queries";
import { formatDuration, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Usługi i cennik",
  description:
    "Pełny cennik Glow Studio — strzyżenie, koloryzacja, pielęgnacja i stylizacje okazjonalne. Ceny i czas trwania każdej usługi.",
};

export default function ServicesIndex() {
  return (
    <div className="pt-28 pb-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Usługi i cennik</Eyebrow>
            <h1 className="mt-5 font-display text-display font-light text-ink">
              Pełny cennik
            </h1>
            <p className="mt-5 text-ink-soft">
              Ceny „od” — ostateczna zależy od długości i gęstości włosów oraz
              zakresu pracy. Każdą usługę możesz od razu zarezerwować.
            </p>
          </div>
          <Button href="/rezerwacja" className="shrink-0 px-7 py-3.5">
            Umów wizytę
          </Button>
        </div>

        <div className="mt-14 space-y-14">
          {serviceCategories.map((cat) => (
            <section key={cat.id}>
              <div className="border-b border-line pb-4">
                <h2 className="font-display text-title text-ink">{cat.name}</h2>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  {cat.description}
                </p>
              </div>
              <ul className="divide-y divide-line/70">
                {getServicesByCategory(cat.id).map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/uslugi/${s.slug}`}
                      className="group flex items-center justify-between gap-4 py-5 transition-colors duration-300 ease-silk hover:text-terracotta"
                    >
                      <span className="min-w-0">
                        <span className="block font-medium text-ink group-hover:text-terracotta">
                          {s.name}
                        </span>
                        <span className="mt-1 block text-sm text-muted">
                          {s.description}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block whitespace-nowrap font-medium tabular-nums text-ink">
                          {formatPrice(s)}
                        </span>
                        <span className="block text-xs text-muted">
                          {formatDuration(s.durationMin)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
