import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Photo } from "../ui/Photo";
import { team } from "@/data/team";
import type { StaffMember } from "@/lib/types";

function Rating({ person }: { person: StaffMember }) {
  if (!person.rating) return null;
  return (
    <span className="text-sm text-muted">
      <span aria-hidden className="text-champagne">
        ★
      </span>{" "}
      <span className="tabular-nums text-ink">
        {person.rating.toLocaleString("pl-PL", { minimumFractionDigits: 1 })}
      </span>
      {person.reviewCount ? ` · ${person.reviewCount} opinii` : ""}
    </span>
  );
}

/** Zespół: założycielka wyróżniona szerokim kadrem, reszta w rzędzie. */
export function Team() {
  const [lead, ...rest] = team;

  return (
    <Section id="zespol" className="border-t border-line">
      <Reveal>
        <Eyebrow index="04">Zespół</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-display font-light text-ink">
          Ludzie, którym powierzysz włosy
        </h2>
      </Reveal>

      <Reveal className="mt-12">
        <article className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
          <div className="relative aspect-4/5 overflow-hidden rounded-card bg-sand md:col-span-5">
            <Photo
              src={lead.photo}
              alt={`${lead.name}, ${lead.role}`}
              sizes="(min-width: 1152px) 440px, (min-width: 768px) 40vw, 100vw"
            />
          </div>
          <div className="md:col-span-7">
            <p className="font-display text-lg italic text-terracotta-ink">
              {lead.role}
            </p>
            <h3 className="mt-2 font-display text-title font-light text-ink">
              {lead.name}
            </h3>
            <p className="mt-6 max-w-xl font-display text-xl leading-relaxed font-light text-ink-soft md:text-2xl">
              {lead.bio}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5">
              <p className="text-sm text-ink-soft">{lead.specialties.join(" · ")}</p>
              <Rating person={lead} />
            </div>
          </div>
        </article>
      </Reveal>

      <ul className="no-scrollbar -mx-6 mt-16 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:px-0">
        {rest.map((person, i) => (
          <li key={person.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <Reveal delay={i * 80}>
              <article>
                <div className="relative aspect-4/5 overflow-hidden rounded-card bg-sand">
                  <Photo
                    src={person.photo}
                    alt={`${person.name}, ${person.role}`}
                    sizes="(min-width: 1152px) 360px, (min-width: 640px) 31vw, 78vw"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl text-ink">{person.name}</h3>
                  <Rating person={{ ...person, reviewCount: undefined }} />
                </div>
                <p className="mt-1 font-display text-sm italic text-terracotta-ink">
                  {person.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{person.bio}</p>
                <p className="mt-4 text-xs text-ink-soft">
                  {person.specialties.join(" · ")}
                </p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
