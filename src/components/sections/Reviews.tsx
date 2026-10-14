import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { reviews, salonRating } from "@/data/reviews";

const sourceLabel: Record<string, string> = {
  google: "Google",
  instagram: "Instagram",
  internal: "Klientka",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`Ocena ${rating} na 5`} className="tracking-[0.12em]">
      <span className="text-champagne">{"★".repeat(rating)}</span>
      <span className="text-line">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

/** Opinie: jedna wyróżniona, reszta jako spokojna lista bez kart. */
export function Reviews() {
  const [featured, ...rest] = reviews;

  return (
    <Section id="opinie" className="border-t border-line bg-sand/35">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Eyebrow index="05">Opinie</Eyebrow>
          <h2 className="mt-5 font-display text-display font-light text-ink">
            Zaufały nam setki klientek
          </h2>
          <div className="mt-10 flex items-end gap-5">
            <span className="font-display text-7xl leading-none font-light text-ink tabular-nums md:text-8xl">
              {salonRating.average.toLocaleString("pl-PL")}
            </span>
            <span className="pb-2 text-sm text-muted">
              <Stars rating={5} />
              <br />
              {salonRating.total} opinii w Google
            </span>
          </div>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-7 lg:pt-16">
          <figure>
            <blockquote className="font-display text-2xl leading-snug font-light text-ink md:text-[2rem]">
              <span aria-hidden className="text-terracotta">
                „
              </span>
              {featured.text}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4 text-sm">
              <span className="font-medium text-ink">{featured.author}</span>
              <span aria-hidden className="h-px w-6 bg-champagne" />
              <span className="text-muted">{sourceLabel[featured.source]}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-x-10 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((r, i) => (
          <li key={r.id}>
            <Reveal delay={(i % 3) * 80}>
              <figure>
                <Stars rating={r.rating} />
                <blockquote className="mt-3 text-ink-soft">„{r.text}”</blockquote>
                <figcaption className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{r.author}</span>
                  <span className="text-muted">{sourceLabel[r.source]}</span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
