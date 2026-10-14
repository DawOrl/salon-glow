# Glow Studio

> Demo do portfolio: strona usługowa **premium salonu beauty z własnym systemem rezerwacji online**.
> Argument sprzedażowy: niezależność od prowizji platform typu Booksy. Twoja strona, Twoi klienci, Twoje dane.

Autorskie studio fryzjerskie „Glow Studio" (fikcyjne, Warszawa / Mokotowska) z cennikiem,
zespołem, galerią metamorfoz „przed/po", wieloetapową rezerwacją i lokalnym SEO.
Estetyka **Quiet Atelier**, czyli drukowana karta salonu: kremowa baza, kontrastowy serif
Fraunces, numerowane rozdziały N°01-07 kursywą, jeden terakotowy akcent, zdjęcia w łuku
okna kamienicy i spójny „język ruchu" (blur-to-sharp).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (design system w `@theme`)
- **next/font** (Fraunces + Inter, self-hosted), **next/image** (z `blurDataURL`)
- **Server Actions** + **zod** (rezerwacja), **next/og** (obrazy OG)
- Animacje: natywny CSS + IntersectionObserver (z poszanowaniem `prefers-reduced-motion`)

## Funkcje

- **Strona główna**: hero w łuku okna, filozofia z autorskim renderem 3D, **suwak przed/po**
  (mysz, dotyk bez blokady przewijania, klawiatura `role="slider"`, lightbox), **karta usług**
  na zakładkach ARIA, zespół z wyróżnioną założycielką, opinie, rezerwacja, kontakt z mapą.
- **Rezerwacja** (`/rezerwacja`): kreator usługa → stylista → termin → dane na natywnych
  radio; godziny co 30 min tylko tam, gdzie wizyta zmieści się przed zamknięciem; na telefonie
  przyklejony pasek z podsumowaniem i „Dalej"; walidacja po stronie klienta i serwera (zod),
  wysyłka e-mail, ekran potwierdzenia z „Dodaj do kalendarza". Fokus na nagłówku kroku,
  honeypot, walidacja przeszłej daty.
- **Podstrony usług** (`/uslugi/[slug]`): SSG, `generateMetadata`, morph View Transitions,
  zdjęcie efektu, jeśli usługa ma metamorfozę.
- **SEO lokalne**: JSON-LD (`HairSalon` + `Service`/`Offer`), `sitemap.xml`, `robots.txt`,
  obraz OG/Twitter ze zdjęciem wnętrza, ikony.
- **Bezpieczeństwo**: nagłówki (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
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

Rezerwacja działa bez konfiguracji: bez klucza loguje (zamaskowane) zgłoszenie na serwerze.
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
| `node scripts/optimize-media.mjs <katalog>` | Zamienia surowe PNG (zdjęcia i render 3D) na WebP w `public/` i odświeża `src/lib/imageMeta.ts` (wymiary + `blurDataURL`). |
| `blender --background --factory-startup --python-exit-code 1 --python scripts/blender/grzebien-kosmyk.py -- --out <plik.png>` | Proceduralna martwa natura 3D (terakotowy grzebień i mosiężny kosmyk), Cycles, przezroczyste tło. `--preview` renderuje w połowie rozdzielczości. |
| `node scripts/gen-brand.mjs` | Obraz OG/Twitter (zdjęcie wnętrza w łuku) oraz ikony aplikacji (`src/app/*.png`). |

## Struktura

```
src/
  app/                 # trasy: /, /uslugi, /uslugi/[slug], /rezerwacja, sitemap, robots, OG, ikony
    lib/               # Server Action (rezerwacja) + wysyłka e-mail
  components/
    sections/          # Hero, Manifesto, BeforeAfter, Services, Team, Reviews, Contact, ...
    booking/           # kreator rezerwacji (Wizard, kroki, ProgressBar)
    ui/                # Button, Section, Reveal, Photo, Lightbox, ...
    layout/            # Navbar, Footer
  data/                # services, team, portfolio, reviews (źródło treści)
  lib/                 # typy, zapytania, formatowanie, JSON-LD, slots, salon, site
scripts/               # optymalizacja mediów, OG/ikony, scena Blendera
public/                # zoptymalizowane zdjęcia (zespół, portfolio, hero)
```

## Wdrożenie

Najprościej na **Vercel**: zaimportuj repo, ustaw ewentualne zmienne środowiskowe,
a po wdrożeniu zaktualizuj `SITE_URL` w `src/lib/site.ts`.

## Licencje mediów

Zdjęcia (wnętrze, zespół, metamorfozy) są **wygenerowane** jedną serią w fal.ai
(nano-banana-2) na potrzeby demo; w parach „przed/po" zdjęcie „po" powstało edycją
zdjęcia „przed", więc to ta sama osoba, kadr i światło. Render 3D pochodzi ze skryptu
Blendera w repo. Czcionki: Fraunces i Inter (SIL OFL). To projekt demonstracyjny: salon,
zespół i opinie są fikcyjne, co strona mówi w stopce.

---

Projekt demo z portfolio (`dorlowski.dev`).
