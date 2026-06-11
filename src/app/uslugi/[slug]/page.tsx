import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { services } from "@/data/services";
import {
  getCategoryById,
  getServiceBySlug,
  getServicesByCategory,
  getStaffForService,
} from "@/lib/queries";
import { formatDuration, formatPrice } from "@/lib/format";
import { salon } from "@/lib/salon";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceJsonLd } from "@/lib/jsonld";

// Wszystkie usługi prerenderowane statycznie; nieznany slug → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: `${service.description} ${formatPrice(service)}, czas ${formatDuration(
      service.durationMin,
    )} — Glow Studio, ${salon.address.city}.`,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const category = getCategoryById(service.categoryId);
  const stylists = getStaffForService(service);
  const related = getServicesByCategory(service.categoryId).filter(
    (s) => s.id !== service.id,
  );

  return (
    <article className="pt-28 pb-24">
      <JsonLd data={serviceJsonLd(service, category)} />
      <Container>
        <Link
          href="/#uslugi"
          className="text-sm text-muted transition-colors hover:text-terracotta"
        >
          ← Wszystkie usługi
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Treść */}
          <div>
            {category && <Eyebrow>{category.name}</Eyebrow>}
            <h1
              className="mt-5 font-display text-display font-light text-ink"
              style={{ viewTransitionName: `svc-${service.slug}` }}
            >
              {service.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
              <span className="font-display text-3xl text-terracotta tabular-nums">
                {formatPrice(service)}
              </span>
              <span className="text-sm text-muted">
                Czas wizyty: {formatDuration(service.durationMin)}
              </span>
              {service.popular && (
                <span className="rounded-pill bg-champagne/20 px-3 py-1 text-xs uppercase tracking-wide text-terracotta-deep">
                  popularne
                </span>
              )}
            </div>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
              {service.description}
            </p>

            {/* Styliści */}
            {stylists.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xs uppercase tracking-[0.16em] text-muted">
                  Wykonują tę usługę
                </h2>
                <ul className="mt-4 flex flex-wrap gap-5">
                  {stylists.map((person) => (
                    <li key={person.id} className="flex items-center gap-3">
                      <span className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-line">
                        <Photo
                          src={person.photo}
                          alt={person.name}
                          sizes="48px"
                        />
                      </span>
                      <span className="text-sm">
                        <span className="block font-medium text-ink">
                          {person.name}
                        </span>
                        <span className="block text-muted">{person.role}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={`/rezerwacja?usluga=${service.slug}`} className="px-8 py-4">
                Umów wizytę
              </Button>
              <Button
                href={`tel:${salon.phoneHref}`}
                variant="outline"
                className="px-8 py-4"
              >
                Zadzwoń
              </Button>
            </div>
          </div>

          {/* Karta podsumowania + powiązane */}
          <aside className="lg:pt-10">
            <div className="rounded-card border border-line bg-sand/30 p-7">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-line pb-3">
                  <dt className="text-muted">Cena</dt>
                  <dd className="font-medium text-ink">{formatPrice(service)}</dd>
                </div>
                <div className="flex justify-between border-b border-line pb-3">
                  <dt className="text-muted">Czas</dt>
                  <dd className="text-ink">
                    {formatDuration(service.durationMin)}
                  </dd>
                </div>
                {category && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Kategoria</dt>
                    <dd className="text-ink">{category.name}</dd>
                  </div>
                )}
              </dl>
            </div>

            {related.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xs uppercase tracking-[0.16em] text-muted">
                  W tej samej kategorii
                </h2>
                <ul className="mt-4 divide-y divide-line/70">
                  {related.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/uslugi/${s.slug}`}
                        className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-terracotta"
                      >
                        <span className="text-ink">{s.name}</span>
                        <span className="shrink-0 tabular-nums text-muted">
                          {formatPrice(s)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </article>
  );
}
