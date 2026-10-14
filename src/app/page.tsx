import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Team } from "@/components/sections/Team";
import { Reviews } from "@/components/sections/Reviews";
import { BookingTeaser } from "@/components/sections/BookingTeaser";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/seo/JsonLd";
import { salonJsonLd } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <JsonLd data={salonJsonLd()} />
      <Hero />
      <Manifesto />
      <BeforeAfter />
      <Services />
      <Team />
      <Reviews />
      <BookingTeaser />
      <Contact />
    </>
  );
}
