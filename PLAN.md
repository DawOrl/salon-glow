# Glow Studio — plan rozbudowy

> Projekt demo do portfolio (`dorlowski.dev`, slug: `salon-glow`).
> Cel: pokazać kompetencje w **stronach usługowych z rezerwacją online** —
> argument sprzedażowy: niezależność od prowizji platform typu Booksy.

## Kontekst (z case study)

- **Problem:** salony beauty / barber / fryzjerskie są uzależnione od platform
  rezerwacyjnych, które pobierają prowizje i „pożyczają” im klientów.
- **Rozwiązanie:** własna strona z cennikiem usług, prezentacją zespołu,
  portfolio realizacji i **własnym systemem rezerwacji** (usługa → termin → pracownik).
- **Efekt:** salon ma własny kanał rezerwacji, przestaje oddawać prowizję,
  a baza klientów należy do niego.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion.
Rezerwacje: na start formularz + e-mail; docelowo lekka baza (np. Supabase).

## Struktura sekcji

1. **Hero** — klimat salonu, hasło, CTA „Umów wizytę”.
2. **Usługi + cennik** — kategorie (strzyżenie / koloryzacja / pielęgnacja…),
   pozycje z ceną i czasem trwania; dane w `src/data/services.ts`.
3. **Zespół** — karty stylistów (zdjęcie, specjalizacja).
4. **Portfolio / metamorfozy** — galeria „przed/po”, lightbox.
5. **Rezerwacja** — kreator: wybór usługi → terminu → (opcjonalnie) pracownika
   → dane kontaktowe → potwierdzenie.
6. **Opinie** — cytaty klientów.
7. **Kontakt / dojazd / godziny + stopka.**

## Etapy realizacji

- [x] **Etap 1 — fundament:** estetyka premium/beauty (Quiet Atelier), layout,
      komponenty UI, dane usług i zespołu w osobnych plikach.
- [x] **Etap 2 — treść:** hero, cennik usług (z danych), zespół, galeria przed/po,
      podstrony usług `/uslugi/[slug]`. (lightbox modal i wideo-hero → Etap 5)
- [x] **Etap 3 — rezerwacja (MVP):** wieloetapowy kreator; walidacja (zod) +
      Server Action; wysyłka e-mail do salonu (Resend lub log fallback);
      ekran potwierdzenia + „Dodaj do kalendarza”. Terminy mockowane.
- [x] **Etap 4 — SEO/lokalne:** dane strukturalne `HairSalon`, godziny, mapa,
      metadane + OG/twitter image, sitemap, robots, ikony, strona `/uslugi`.
- [x] **Etap 5 — polish:** lightbox (focus trap), Ken Burns hero, spójne
      mikrointerakcje, `prefers-reduced-motion`, RWD, nagłówki bezpieczeństwa,
      2× adwersaryjny przegląd a11y/poprawność/security. (wdrożenie na Vercel → poniżej)

## Pomysły rozszerzeń

- Realna dostępność terminów (kalendarz) + zapis do bazy (Supabase/Postgres).
- Panel salonu: podgląd rezerwacji, zarządzanie usługami i grafikiem.
- Powiadomienia SMS/e-mail (przypomnienie o wizycie).
- Program lojalnościowy / kody rabatowe.

## Po wdrożeniu (powrót do portfolio)

1. Wrzuć na Vercel → zapisz URL.
2. W `dorlowski.dev`: dodaj wpis do `scripts/shots.config.json`
   (`slug: "salon-glow"`, `url`), uruchom `npm run shots salon-glow`.
3. Uzupełnij `liveUrl`/`githubUrl` w `cv-data.ts` i usuń `draft: true`.
