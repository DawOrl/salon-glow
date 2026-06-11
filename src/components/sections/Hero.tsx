import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { Container } from "../ui/Container";
import { Photo } from "../ui/Photo";
import { HeroVideo } from "./HeroVideo";
import { salonRating } from "@/data/reviews";

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden pt-24 pb-16 md:pt-28">
      {/* Ambient — miękkie organiczne plamy */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-16 h-112 w-md rounded-full bg-sage/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-112 w-md rounded-full bg-champagne/25 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Tekst */}
          <div className="order-2 md:order-1">
            <Reveal>
              <Eyebrow>Salon fryzjerski &amp; koloryzacja · Warszawa</Eyebrow>
            </Reveal>

            <h1 className="mt-7 font-display text-hero font-light leading-[0.9] text-ink">
              Cisza,
              <br />
              którą <em className="font-normal text-terracotta">widać</em>.
            </h1>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">
              Autorskie studio strzyżenia, balayage i regeneracji w sercu
              Warszawy. Umów wizytę bezpośrednio u nas — bez pośredników,
              bez prowizji.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/rezerwacja" className="px-8 py-4">
                Umów wizytę
              </Button>
              <Button href="#uslugi" variant="outline" className="px-8 py-4">
                Zobacz cennik
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-muted">
              <span aria-hidden className="text-champagne">
                ★★★★★
              </span>
              <span>
                <span className="font-medium text-ink">
                  {salonRating.average.toLocaleString("pl-PL")}
                </span>{" "}
                / 5 · {salonRating.total} opinii klientów
              </span>
            </div>
          </div>

          {/* Poster — edytorialny kadr w ramce */}
          <Reveal className="order-1 md:order-2">
            <figure className="relative">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-card ring-1 ring-champagne/40">
                <Photo
                  src="/hero/poster.jpg"
                  alt="Wnętrze salonu Glow Studio w naturalnym świetle"
                  priority
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover kenburns"
                />
                <HeroVideo />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-ink/15 to-transparent"
                />
              </div>
              {/* Pływający detal — sygnał premium */}
              <figcaption className="absolute -bottom-5 -left-5 hidden rounded-card glass px-5 py-4 ring-1 ring-line md:block">
                <p className="font-display text-xl italic text-ink">est. 2014</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  Mokotowska · Warszawa
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>

      <span
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-eyebrow uppercase tracking-[0.18em] text-muted lg:block"
      >
        przewiń
      </span>
    </section>
  );
}
