import Image from "next/image";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { imageMeta } from "@/lib/imageMeta";

const ART = "/art/grzebien-kosmyk.webp";

/** Filozofia salonu: typografia jako bohater + autorska martwa natura 3D. */
export function Manifesto() {
  const art = imageMeta[ART];
  return (
    <Section className="overflow-hidden border-t border-line">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-7">
          <Eyebrow index="01">Filozofia</Eyebrow>
          <p className="mt-8 font-display text-[clamp(2.1rem,4.6vw,4.1rem)] leading-[1.1] font-light tracking-[-0.01em] text-ink">
            Wierzymy, że piękno rodzi się ze{" "}
            <em className="text-terracotta">spokoju</em>: bez pośpiechu, bez
            kompromisów, z&nbsp;pełną uwagą poświęconą Tobie.
          </p>
          <p className="mt-8 max-w-lg text-ink-soft">
            Każda wizyta zaczyna się od rozmowy i kawy, a kończy efektem, z którym
            wychodzisz pewna siebie. Bez kolejki, bez presji, bez prowizji
            oddawanej platformom.
          </p>
        </Reveal>

        <Reveal delay={120} className="mx-auto w-full max-w-sm lg:col-span-5 lg:-mr-20 lg:max-w-none">
          <Image
            src={ART}
            alt=""
            aria-hidden
            width={art?.width ?? 1600}
            height={art?.height ?? 1000}
            sizes="(min-width: 1024px) 520px, 90vw"
            className="h-auto w-full"
          />
        </Reveal>
      </div>
    </Section>
  );
}
