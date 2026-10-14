import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { Photo } from "../ui/Photo";
import { salonRating } from "@/data/reviews";
import { salon } from "@/lib/salon";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-32 md:pb-24">
      <Container>
        <div className="grid items-end gap-12 md:grid-cols-12 md:gap-8 lg:gap-12">
          {/* Tekst: na telefonie pierwszy, żeby nagłówek był nad zgięciem */}
          <div className="md:col-span-7 md:pb-6">
            <p className="flex items-baseline gap-3 text-sm text-muted">
              <span className="font-display italic text-terracotta-ink">
                Warszawa
              </span>
              <span aria-hidden className="h-px w-8 translate-y-[-0.3em] bg-champagne" />
              <span>Salon fryzjerski i koloryzacja</span>
            </p>

            <h1 className="mt-7 font-display text-hero font-light text-ink">
              Cisza,
              <br />
              którą{" "}
              <em className="font-normal text-terracotta">widać</em>.
            </h1>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
              Autorskie studio strzyżenia, balayage i regeneracji w sercu
              Warszawy. Umów wizytę bezpośrednio u nas, bez pośredników
              i bez prowizji.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button href="/rezerwacja" className="px-8 py-4">
                Umów wizytę
              </Button>
              <Button href="/#cennik" variant="outline" className="px-8 py-4">
                Zobacz cennik
              </Button>
            </div>

            <p className="mt-9 flex items-center gap-3 text-sm text-muted">
              <span aria-hidden className="tracking-[0.12em] text-champagne">
                ★★★★★
              </span>
              <span>
                <span className="font-medium text-ink">
                  {salonRating.average.toLocaleString("pl-PL")}
                </span>{" "}
                / 5 · {salonRating.total} opinii klientów
              </span>
            </p>
          </div>

          {/* Zdjęcie w łuku okna kamienicy */}
          <figure className="md:col-span-5">
            <div className="arch relative aspect-4/5 w-full overflow-hidden bg-sand">
              <Photo
                src="/hero/salon.webp"
                alt="Stanowisko w Glow Studio: skórzany fotel przed okrągłym lustrem w mosiężnej ramie, dębowa konsola, lniane zasłony i jodełka w jasnym wnętrzu kamienicy."
                priority
                sizes="(min-width: 1152px) 470px, (min-width: 768px) 40vw, 100vw"
                className="settle object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-sm text-muted">
              <span className="font-display italic text-ink-soft">est. 2014</span>
              <span>
                {salon.address.street}, {salon.address.city}
              </span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
