import Link from "next/link";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Photo } from "../ui/Photo";
import { team } from "@/data/team";

export function Team() {
  return (
    <Section id="zespol" className="border-t border-line">
      <Reveal>
        <Eyebrow>Zespół</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-display font-light text-ink">
          Ludzie, którym powierzysz włosy
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, i) => (
          <Reveal
            key={member.id}
            // Lekka asymetria — co druga karta delikatnie opuszczona.
            className={i % 2 === 1 ? "lg:mt-10" : ""}
          >
            <article className="flex h-full flex-col">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-card bg-sand ring-1 ring-line">
                <Photo
                  src={member.photo}
                  alt={`${member.name} — ${member.role}`}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-silk hover:scale-105"
                />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl text-ink">{member.name}</h3>
                  {member.rating && (
                    <span className="shrink-0 text-xs text-muted">
                      <span className="text-champagne">★</span>{" "}
                      {member.rating.toLocaleString("pl-PL")}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-terracotta">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {member.bio}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink-soft">
                  {member.specialties.join(" · ")}
                </p>
                {member.instagram && (
                  <Link
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-ink-soft underline-offset-4 transition-colors hover:text-terracotta hover:underline"
                  >
                    Instagram
                  </Link>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
