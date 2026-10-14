import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getServiceBySlug, getStaffById } from "@/lib/queries";
import { formatDuration } from "@/lib/format";
import { salon } from "@/lib/salon";

export const metadata: Metadata = {
  title: "Dziękujemy za rezerwację",
  robots: { index: false, follow: false },
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Link „Dodaj do Google Kalendarza” (czas lokalny, bez strefy). */
function gcalUrl(
  title: string,
  dateISO: string,
  time: string,
  durationMin: number,
) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const start = new Date(y, m - 1, d, hh, mm);
  const end = new Date(start.getTime() + durationMin * 60000);
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${title} · Glow Studio`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: "Rezerwacja w Glow Studio",
    location: `${salon.address.street}, ${salon.address.postalCode} ${salon.address.city}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{
    usluga?: string;
    data?: string;
    godzina?: string;
    stylista?: string;
  }>;
}) {
  const { usluga, data, godzina, stylista } = await searchParams;
  const service = usluga ? getServiceBySlug(usluga) : undefined;
  const staff =
    stylista && stylista !== "any" ? getStaffById(stylista) : undefined;

  const dateLabel =
    data &&
    new Date(`${data}T00:00:00`).toLocaleDateString("pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  return (
    <div className="pt-28 pb-24 md:pt-32">
      <Container className="max-w-3xl">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-12">
          <span
            aria-hidden
            className="arch flex h-28 w-20 items-end justify-center bg-terracotta-deep pb-5 text-cream"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="m4 11.5 4.5 4.5L18 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <h1 className="font-display text-display font-light text-ink">
              Dziękujemy, mamy Twoją prośbę
            </h1>
            <p className="mt-5 max-w-lg text-ink-soft">
              Wkrótce potwierdzimy termin telefonicznie lub mailowo. Do tego czasu
              rezerwacja jest wstępna.
            </p>

            {service && data && godzina && (
              <dl className="mt-10 border-t border-line text-sm">
                {[
                  ["Usługa", service.name],
                  ["Termin", `${dateLabel}, ${godzina}`],
                  ["Stylista", staff?.name ?? "Pierwszy wolny"],
                  ["Czas wizyty", formatDuration(service.durationMin)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-b border-line py-3.5">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
              {service && data && godzina && (
                <Button
                  href={gcalUrl(service.name, data, godzina, service.durationMin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  Dodaj do kalendarza
                </Button>
              )}
              <Button href="/">Wróć na stronę główną</Button>
            </div>

            <p className="mt-10 text-sm text-muted">{salon.bookingPolicy}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
