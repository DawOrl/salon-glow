# Glow Studio

> Demo do portfolio — strona usługowa **premium salonu beauty z własnym systemem rezerwacji online**.
> Argument sprzedażowy: niezależność od prowizji platform typu Booksy. Twoja strona, Twoi klienci, Twoje dane.

Autorskie studio fryzjerskie „Glow Studio" (fikcyjne, Warszawa / Mokotowska) z cennikiem,
zespołem, galerią metamorfoz „przed/po", wieloetapową rezerwacją i lokalnym SEO.
Estetyka **Quiet Atelier** — quiet luxury / editorial: kremowa baza, kontrastowy serif,
jeden terakotowy akcent i spójny „język ruchu" (blur-to-sharp).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (design system w `@theme`)
- **next/font** (Fraunces + Inter, self-hosted), **next/image** (z `blurDataURL`)
- **Server Actions** + **zod** (rezerwacja), **next/og** (obrazy OG)
- Animacje: natywny CSS + IntersectionObserver (z poszanowaniem `prefers-reduced-motion`)

## Funkcje

- **Strona główna** — hero (poster + Ken Burns), filozofia, **cennik bento** z danych,
  **interaktywny suwak przed/po** (mysz/dotyk/klawiatura) + lightbox, zespół, opinie (ocena Google),
  sekcja anty-Booksy, kontakt z mapą.
- **Rezerwacja** (`/rezerwacja`) — wieloetapowy kreator (usługa → stylista → termin → dane),
  walidacja inline + serwerowa (zod), wysyłka e-mail, ekran potwierdzenia z „Dodaj do kalendarza".
  Dostępność: etykiety, `aria-*`, zarządzanie fokusem, honeypot, walidacja przeszłej daty.
- **Podstrony usług** (`/uslugi/[slug]`) — generowane statycznie (SSG), `generateMetadata`,
  morph View Transitions, lista powiązanych usług.
- **SEO lokalne** — dane strukturalne JSON-LD (`HairSalon` + `Service`/`Offer`), `sitemap.xml`,
  `robots.txt`, obrazy OG/Twitter, ikony.
- **Bezpieczeństwo** — nagłówki (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`), sekrety wyłącznie po stronie serwera.

## Szybki start

```bash
npm install
npm run dev          # http://localhost:3000
```

Build produkcyjny:

```bash
npm run build
npm run start
```

## Zmienne środowiskowe (opcjonalne)

Rezerwacja działa bez konfiguracji — bez klucza loguje (zamaskowane) zgłoszenie na serwerze.
Aby realnie wysyłać e-maile, utwórz `.env.local` (gitignored):

```bash
RESEND_API_KEY=...            # klucz Resend (https://resend.com)
RESERVATION_TO=salon@...       # adres odbioru rezerwacji (domyślnie e-mail z src/lib/salon.ts)
RESERVATION_FROM=Glow Studio <onboarding@resend.dev>
```

Adres produkcyjny (metadata, JSON-LD, sitemap) ustawia się w [`src/lib/site.ts`](src/lib/site.ts) (`SITE_URL`).

## Skrypty mediów

| Skrypt | Opis |
| --- | --- |
| `node scripts/fetch-stock.mjs` | Pobiera realne zdjęcia z publicznego CDN Pexels (licencja darmowa/komercyjna, bez atrybucji), optymalizuje (sharp), liczy `blurDataURL` → `src/lib/imageMeta.ts`. Metamorfozy „przed" są symulowane z tego samego zdjęcia. |
| `node scripts/gen-brand.mjs` | Generuje obraz OG/Twitter oraz ikony aplikacji (`src/app/*.png`). |
| `node scripts/gen-placeholders.mjs` | Generuje zastępcze gradienty (fallback, gdy nie korzystasz ze stocków). |

Aby podmienić zdjęcia na inne: zmień ID w `scripts/fetch-stock.mjs` (z `images.pexels.com`) i uruchom skrypt.

## Wideo-hero (opcjonalnie)

Hero domyślnie pokazuje poster wnętrza + subtelny Ken Burns. Aby dodać wideo-loop:
wrzuć plik do `public/hero/loop.mp4` (najlepiej pionowy ~4:5, < 5 MB) — [`HeroVideo`](src/components/sections/HeroVideo.tsx)
sam je wykryje i odtworzy (z poszanowaniem `prefers-reduced-motion`), w innym wypadku zostaje poster.

## Struktura

```
src/
  app/                 # trasy: /, /uslugi, /uslugi/[slug], /rezerwacja, sitemap, robots, OG, ikony
    lib/               # Server Action (rezerwacja) + wysyłka e-mail
  components/
    sections/          # Hero, Services, BeforeAfter, Team, Reviews, Contact, ...
    booking/           # kreator rezerwacji (Wizard, kroki, ProgressBar)
    ui/                # Button, Section, Reveal, Photo, Lightbox, ...
    layout/            # Navbar, Footer
  data/                # services, team, portfolio, reviews (źródło treści)
  lib/                 # typy, zapytania, formatowanie, JSON-LD, slots, salon, site
scripts/               # generatory mediów
public/                # zoptymalizowane zdjęcia (zespół, portfolio, hero)
```

## Wdrożenie

Najprościej na **Vercel**: zaimportuj repo, ustaw ewentualne zmienne środowiskowe,
a po wdrożeniu zaktualizuj `SITE_URL` w `src/lib/site.ts`.

## Licencje mediów

Zdjęcia pochodzą z **Pexels** (licencja darmowa, komercyjna, bez obowiązku atrybucji).
Czcionki: Fraunces i Inter (SIL OFL). To projekt demonstracyjny — dane salonu są fikcyjne.

---

Projekt demo z portfolio (`dorlowski.dev`).
