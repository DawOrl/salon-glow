import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { salonRating } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Rezerwacja wizyty",
  description:
    "Umów wizytę w Glow Studio online: wybierz usługę, stylistę i termin. Bez pośredników i prowizji platform.",
};

export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ usluga?: string }>;
}) {
  const { usluga } = await searchParams;

  return (
    <div className="pt-28 pb-36 md:pt-32 lg:pb-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Rezerwacja online</Eyebrow>
            <h1 className="mt-5 font-display text-display font-light text-ink">
              Umów wizytę
            </h1>
            <p className="mt-5 max-w-lg text-ink-soft">
              Cztery krótkie kroki, bez aplikacji pośredniczących. Termin
              potwierdzimy telefonicznie lub mailowo.
            </p>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted md:pb-2">
            <span aria-hidden className="tracking-[0.12em] text-champagne">
              ★★★★★
            </span>
            {salonRating.average.toLocaleString("pl-PL")} / 5 · {salonRating.total}{" "}
            opinii
          </p>
        </div>

        <div className="mt-12 border-t border-line pt-10">
          <BookingWizard initialServiceSlug={usluga} />
        </div>
      </Container>
    </div>
  );
}
