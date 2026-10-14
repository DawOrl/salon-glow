import Link from "next/link";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { salon } from "@/lib/salon";

export function Contact() {
  return (
    <Section id="kontakt" className="border-t border-line bg-sand/35">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <Eyebrow index="07">Kontakt i dojazd</Eyebrow>
          <h2 className="mt-5 font-display text-display font-light text-ink">
            Zapraszamy do studia
          </h2>
          <address className="mt-8 space-y-6 not-italic">
            <p className="font-display text-2xl leading-snug font-light text-ink">
              {salon.address.street}
              <br />
              {salon.address.postalCode} {salon.address.city}
            </p>
            <p className="flex flex-col items-start gap-1 text-ink-soft">
              <Link
                href={`tel:${salon.phoneHref}`}
                className="inline-flex min-h-11 items-center underline decoration-champagne underline-offset-4 transition-colors hover:text-terracotta-ink"
              >
                {salon.phone}
              </Link>
              <Link
                href={`mailto:${salon.email}`}
                className="inline-flex min-h-11 items-center underline decoration-champagne underline-offset-4 transition-colors hover:text-terracotta-ink"
              >
                {salon.email}
              </Link>
            </p>
          </address>
        </Reveal>

        <Reveal delay={100} className="md:col-span-5 md:col-start-8">
          <h3 className="font-display text-xl italic text-ink">Godziny otwarcia</h3>
          <dl className="mt-4 border-t border-line">
            {salon.openingHours.map((h) => (
              <div
                key={h.day}
                className="flex justify-between border-b border-line py-3 text-sm"
              >
                <dt className="text-ink-soft">{h.day}</dt>
                <dd className={`tabular-nums ${h.open ? "text-ink" : "text-muted"}`}>
                  {h.open ? `${h.open}–${h.close}` : "zamknięte"}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm text-muted">
            W pobliżu parking i przystanki. Szczegóły na mapie poniżej.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <div className="overflow-hidden rounded-card border border-line bg-sand">
          <iframe
            src={salon.mapEmbedUrl}
            title="Mapa dojazdu do Glow Studio"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full [filter:grayscale(0.55)_sepia(0.18)_contrast(0.95)] md:h-96"
          />
        </div>
      </Reveal>
    </Section>
  );
}
