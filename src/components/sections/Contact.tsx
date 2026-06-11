import Link from "next/link";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { salon } from "@/lib/salon";

export function Contact() {
  return (
    <Section id="kontakt" className="border-t border-line bg-sand/30">
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <Eyebrow>Kontakt &amp; dojazd</Eyebrow>
          <h2 className="mt-5 font-display text-display font-light text-ink">
            Zapraszamy do studia
          </h2>
          <address className="mt-6 space-y-4 text-ink-soft not-italic">
            <p className="text-lg">
              {salon.address.street}
              <br />
              {salon.address.postalCode} {salon.address.city}
            </p>
            <p>
              <Link
                href={`tel:${salon.phoneHref}`}
                className="transition-colors hover:text-terracotta"
              >
                {salon.phone}
              </Link>
              <br />
              <Link
                href={`mailto:${salon.email}`}
                className="transition-colors hover:text-terracotta"
              >
                {salon.email}
              </Link>
            </p>
          </address>
        </Reveal>

        <Reveal>
          <div className="rounded-card border border-line bg-cream p-7">
            <h3 className="text-xs uppercase tracking-[0.16em] text-muted">
              Godziny otwarcia
            </h3>
            <dl className="mt-4 divide-y divide-line/70">
              {salon.openingHours.map((h) => (
                <div key={h.day} className="flex justify-between py-2.5 text-sm">
                  <dt className="text-ink-soft">{h.day}</dt>
                  <dd className="tabular-nums text-ink">
                    {h.open ? `${h.open}–${h.close}` : "zamknięte"}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs text-muted">
              W pobliżu parking oraz przystanki — szczegóły na mapie poniżej.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-10">
        <div className="overflow-hidden rounded-card border border-line">
          <iframe
            src={salon.mapEmbedUrl}
            title="Mapa dojazdu do Glow Studio"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-90 w-full"
          />
        </div>
      </Reveal>
    </Section>
  );
}
