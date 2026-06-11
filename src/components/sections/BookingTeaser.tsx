import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { salon } from "@/lib/salon";

const advantages = [
  "0% prowizji od wizyty — w przeciwieństwie do platform typu Booksy",
  "Twoi klienci i ich dane zostają u Ciebie",
  "Stały, przewidywalny koszt zamiast procentu od obrotu",
  "Pełna kontrola nad wyglądem i komunikacją marki",
];

export function BookingTeaser() {
  return (
    <Section id="rezerwacja" className="border-t border-line">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <Eyebrow>Rezerwacja</Eyebrow>
          <h2 className="mt-5 font-display text-display font-light text-ink">
            Umów się bezpośrednio u&nbsp;nas
          </h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Wybierzesz usługę, termin i stylistę w kilku krokach — bez aplikacji
            pośredniczących. {salon.bookingPolicy}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/rezerwacja" className="px-8 py-4">
              Umów wizytę online
            </Button>
            <Button
              href={`tel:${salon.phoneHref}`}
              variant="outline"
              className="px-8 py-4"
            >
              Zadzwoń: {salon.phone}
            </Button>
          </div>
        </Reveal>

        <Reveal>
          <ul className="space-y-4 rounded-card border border-line bg-sand/30 p-8">
            {advantages.map((point) => (
              <li key={point} className="flex gap-3 text-sm text-ink-soft">
                <span aria-hidden className="mt-1 text-terracotta">
                  ✦
                </span>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
