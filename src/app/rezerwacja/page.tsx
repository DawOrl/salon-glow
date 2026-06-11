import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { salonRating } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Rezerwacja wizyty",
  description:
    "Umów wizytę w Glow Studio online — wybierz usługę, termin i stylistę. Bez pośredników i prowizji platform.",
};

export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ usluga?: string }>;
}) {
  const { usluga } = await searchParams;

  return (
    <div className="pt-28 pb-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Rezerwacja</Eyebrow>
          <h1 className="mt-5 font-display text-display font-light text-ink">
            Umów wizytę online
          </h1>
          <p className="mt-5 text-ink-soft">
            Kilka kroków i gotowe — bez aplikacji pośredniczących. Potwierdzimy
            termin telefonicznie lub mailowo.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <span aria-hidden className="text-champagne">
              ★★★★★
            </span>
            {salonRating.average.toLocaleString("pl-PL")} / 5 ·{" "}
            {salonRating.total} opinii · 0% prowizji
          </p>
        </div>

        <div className="mt-12">
          <BookingWizard initialServiceSlug={usluga} />
        </div>
      </Container>
    </div>
  );
}
