import Link from "next/link";
import { Container } from "../ui/Container";
import { salon } from "@/lib/salon";

const navLinks = [
  { href: "/#metamorfozy", label: "Metamorfozy" },
  { href: "/#cennik", label: "Cennik" },
  { href: "/uslugi", label: "Wszystkie usługi" },
  { href: "/#zespol", label: "Zespół" },
  { href: "/rezerwacja", label: "Rezerwacja online" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-sand/40">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          {/* Marka */}
          <div>
            <p className="font-display text-3xl italic text-ink">
              Glow <span className="not-italic">Studio</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {salon.description}
            </p>
            <div className="mt-4 flex gap-5 text-sm">
              {salon.socials.instagram && (
                <Link
                  href={salon.socials.instagram}
                  className="inline-flex min-h-11 items-center text-ink-soft transition-colors hover:text-terracotta-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </Link>
              )}
              {salon.socials.facebook && (
                <Link
                  href={salon.socials.facebook}
                  className="inline-flex min-h-11 items-center text-ink-soft transition-colors hover:text-terracotta-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </Link>
              )}
              {salon.socials.tiktok && (
                <Link
                  href={salon.socials.tiktok}
                  className="inline-flex min-h-11 items-center text-ink-soft transition-colors hover:text-terracotta-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </Link>
              )}
            </div>
          </div>

          {/* Nawigacja */}
          <nav aria-label="Stopka">
            <h2 className="font-display text-base italic text-ink">
              Nawigacja
            </h2>
            <ul className="mt-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-11 items-center text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontakt + godziny */}
          <div>
            <h2 className="font-display text-base italic text-ink">
              Kontakt
            </h2>
            <address className="mt-4 space-y-1 text-sm not-italic text-ink-soft">
              <p>
                {salon.address.street}
                <br />
                {salon.address.postalCode} {salon.address.city}
              </p>
              <p>
                <Link
                  href={`tel:${salon.phoneHref}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-terracotta-ink"
                >
                  {salon.phone}
                </Link>
              </p>
              <p>
                <Link
                  href={`mailto:${salon.email}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-terracotta-ink"
                >
                  {salon.email}
                </Link>
              </p>
            </address>
            <dl className="mt-5 space-y-1 text-sm text-muted">
              {salon.openingHours.map((h) => (
                <div key={h.day} className="flex justify-between gap-6">
                  <dt>{h.day}</dt>
                  <dd className="tabular-nums">
                    {h.open ? `${h.open}–${h.close}` : "zamknięte"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {salon.legalName ?? salon.name}. Wszelkie prawa zastrzeżone.
          </p>
          <p className="max-w-md md:text-right">
            Projekt demonstracyjny: salon, zespół, opinie i zdjęcia są fikcyjne
            (zdjęcia wygenerowane na potrzeby prezentacji).
          </p>
        </div>
      </Container>
    </footer>
  );
}
