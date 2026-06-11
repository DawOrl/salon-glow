import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";

/** Filozofia salonu — moment „typografia jako bohater” z gestem blur-to-sharp. */
export function Manifesto() {
  return (
    <Section className="border-t border-line">
      <Reveal className="mx-auto max-w-4xl text-center">
        <Eyebrow className="justify-center">Filozofia</Eyebrow>
        <p className="mt-8 font-display text-display font-light leading-tight text-ink">
          Wierzymy, że piękno rodzi się ze{" "}
          <em className="text-terracotta">spokoju</em> — bez pośpiechu,
          bez kompromisów, z pełną uwagą poświęconą Tobie.
        </p>
        <p className="mx-auto mt-8 max-w-xl text-ink-soft">
          Każda wizyta zaczyna się od rozmowy i kawy, a kończy efektem, z którym
          wychodzisz pewna siebie. Bez kolejki, bez presji, bez prowizji
          oddawanej platformom.
        </p>
      </Reveal>
    </Section>
  );
}
