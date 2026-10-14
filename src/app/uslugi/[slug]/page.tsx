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
import { transformations } from "@/data/portfolio";

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
    )}. Glow Studio, ${salon.address.city}.`,
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
  const example = transformations.find((t) => t.serviceId === service.id);

  return (
    <article className="pt-28 pb-24 md:pt-32">
      <JsonLd data={serviceJsonLd(service, category)} />
      <Container>
        <Link
          href="/uslugi"
          className="-my-2 inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-terracotta-ink"
        >
          <span aria-hidden>←</span> Pełny cennik
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
              <span className="font-display text-3xl text-terracotta-ink tabular-nums">
                {formatPrice(service)}
              </span>
              <span className="text-sm text-muted">
                Czas wizyty: {formatDuration(service.durationMin)}
              </span>
              {service.popular && (
                <span className="font-display text-sm italic text-terracotta-ink">
                  często wybierane
                </span>
              )}
            </div>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
              {service.description}
            </p>

            {/* Styliści */}
            {stylists.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-lg italic text-ink-soft">
                  Wykonują tę usługę
                </h2>
                <ul className="mt-4 flex flex-wrap gap-5">
                  {stylists.map((person) => (
                    <li key={person.id} className="flex items-center gap-3">
                      <span className="relative h-14 w-12 overflow-hidden rounded-xl bg-sand">
                        <Photo
                          src={person.photo}
                          alt={person.name}
                          sizes="48px"
                          className="object-cover object-top"
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

            {related.length > 0 && (
              <div className="mt-14 max-w-xl">
                <h2 className="font-display text-lg italic text-ink-soft">
                  W tej samej kategorii
                </h2>
                <ul className="mt-4 divide-y divide-line/70">
                  {related.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/uslugi/${s.slug}`}
                        className="flex min-h-11 items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-terracotta-ink"
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
          </div>

          {/* Zdjęcie efektu (metamorfoza tej usługi albo detal studia) */}
          <aside className="lg:pt-10">
            <figure>
              <div className="arch relative aspect-4/5 w-full max-w-sm overflow-hidden bg-sand">
                <Photo
                  src={example?.afterImage ?? "/studio/detal.webp"}
                  alt={
                    example?.alt ??
                    "Ceramiczna miska z farbą, pędzel, grzebień i lniany ręcznik na dębowej konsoli."
                  }
                  sizes="(min-width: 1024px) 384px, 90vw"
                />
              </div>
              {example && (
                <figcaption className="mt-3 text-sm text-muted">
                  Efekt: {example.title}.{" "}
                  <Link
                    href="/#metamorfozy"
                    className="text-ink-soft underline decoration-champagne underline-offset-4 hover:text-terracotta-ink"
                  >
                    Zobacz przed i po
                  </Link>
                </figcaption>
              )}
            </figure>
          </aside>
        </div>
      </Container>
    </article>
  );
}
