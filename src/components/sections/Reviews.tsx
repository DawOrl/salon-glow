import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { reviews, salonRating } from "@/data/reviews";

const sourceLabel: Record<string, string> = {
  google: "Google",
  instagram: "Instagram",
  internal: "Klient",
};

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`Ocena ${rating} na 5`} className="text-champagne">
      {"★".repeat(rating)}
      <span className="text-muted">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export function Reviews() {
  return (
    <Section id="opinie" className="border-t border-line bg-sand/30">
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Opinie</Eyebrow>
            <h2 className="mt-5 max-w-xl font-display text-display font-light text-ink">
              Zaufały nam setki klientek
            </h2>
          </div>
          <div className="flex items-center gap-4 rounded-card border border-line bg-cream px-6 py-4">
            <span className="font-display text-4xl text-ink">
              {salonRating.average.toLocaleString("pl-PL")}
            </span>
            <span className="text-sm text-muted">
              <Stars rating={5} />
              <br />
              {salonRating.total} opinii w Google
            </span>
          </div>
        </div>
      </Reveal>

      <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 *:mb-6">
        {reviews.map((r) => (
          <Reveal key={r.id} className="break-inside-avoid">
            <figure className="rounded-card border border-line bg-cream p-7">
              <Stars rating={r.rating} />
              <blockquote className="mt-4 text-ink-soft">„{r.text}”</blockquote>
              <figcaption className="mt-5 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{r.author}</span>
                <span className="text-muted">{sourceLabel[r.source]}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
