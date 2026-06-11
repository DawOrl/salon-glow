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
    text: `${title} — Glow Studio`,
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
    <div className="pt-28 pb-24">
      <Container className="max-w-2xl">
        <div className="rounded-card border border-line bg-sand/30 p-8 text-center md:p-12">
          <span
            aria-hidden
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-2xl text-cream"
          >
            ✓
          </span>
          <h1 className="mt-6 font-display text-display font-light text-ink">
            Dziękujemy!
          </h1>
          <p className="mt-4 text-ink-soft">
            Otrzymaliśmy Twoją prośbę o rezerwację. Wkrótce potwierdzimy termin
            telefonicznie lub mailowo.
          </p>

          {service && data && godzina && (
            <dl className="mx-auto mt-8 max-w-sm space-y-3 text-left text-sm">
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-muted">Usługa</dt>
                <dd className="text-ink">{service.name}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-muted">Termin</dt>
                <dd className="text-ink">
                  {dateLabel}, {godzina}
                </dd>
              </div>
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-muted">Stylista</dt>
                <dd className="text-ink">{staff?.name ?? "Pierwszy wolny"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Czas wizyty</dt>
                <dd className="text-ink">
                  {formatDuration(service.durationMin)}
                </dd>
              </div>
            </dl>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
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

          <p className="mt-8 text-xs text-muted">{salon.bookingPolicy}</p>
        </div>
      </Container>
    </div>
  );
}
