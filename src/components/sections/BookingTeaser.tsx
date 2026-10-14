import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { Photo } from "../ui/Photo";
import { salon } from "@/lib/salon";

const steps = [
  { label: "Usługa", note: "z ceną i czasem" },
  { label: "Stylista", note: "lub pierwszy wolny" },
  { label: "Termin", note: "dzień i godzina" },
  { label: "Dane", note: "telefon lub e-mail" },
];

const promises = [
  "Rezerwacja jest bezpłatna.",
  "Zmiana lub odwołanie do 24 godzin przed wizytą.",
  "Termin potwierdzamy telefonicznie lub mailowo.",
];

export function BookingTeaser() {
  return (
    <Section id="rezerwacja" className="border-t border-line" space="loose">
      <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10 lg:gap-16">
        <Reveal className="md:col-span-5">
          <div className="arch relative mx-auto aspect-2/3 w-4/5 overflow-hidden bg-sand md:w-full">
            <Photo
              src="/studio/myjnia.webp"
              alt="Kącik do mycia włosów: lniane zasłony, wysokie okno, dębowa półka z ręcznikami i dzbanem z oliwną gałązką."
              sizes="(min-width: 1152px) 420px, (min-width: 768px) 38vw, 80vw"
            />
          </div>
        </Reveal>

        <Reveal delay={100} className="md:col-span-7">
          <Eyebrow index="06">Rezerwacja</Eyebrow>
          <h2 className="mt-5 font-display text-display font-light text-ink">
            Umów się bezpośrednio u&nbsp;nas
          </h2>
          <p className="mt-5 max-w-lg text-ink-soft">
            Cztery krótkie kroki, bez aplikacji i bez pośredników. Wybierasz
            usługę, stylistę i godzinę, a my potwierdzamy termin.
          </p>

          <ol className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 sm:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.label}>
                <span className="font-display text-sm italic text-terracotta-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block font-display text-xl text-ink">{s.label}</span>
                <span className="mt-0.5 block text-sm text-muted">{s.note}</span>
              </li>
            ))}
          </ol>

          <ul className="mt-8 space-y-2 text-sm text-ink-soft">
            {promises.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-terracotta" />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Button href="/rezerwacja" className="px-8 py-4">
              Umów wizytę online
            </Button>
            <Button href={`tel:${salon.phoneHref}`} variant="outline" className="px-8 py-4">
              Zadzwoń: {salon.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
