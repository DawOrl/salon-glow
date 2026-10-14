/**
 * Wspólne typy domenowe Glow Studio.
 * Obrazy trzymamy jako ścieżki do /public (string). Przy realnej sesji
 * zdjęciowej można przejść na statyczny import (StaticImageData): wtedy
 * next/image dostaje automatyczny blurDataURL i wymiary bez CLS.
 */

export type Currency = "PLN";

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  /** Krótki opis kategorii: eyebrow/lead w sekcji cennika. */
  description: string;
  order: number;
}

export interface Service {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  description: string;
  /** Cena „od” w PLN (ceny premium zależą od długości/gęstości włosów). */
  priceFrom: number;
  /** Górna granica widełek (opcjonalna). */
  priceTo?: number;
  currency: Currency;
  /** Czas trwania w minutach: do kreatora rezerwacji i cennika. */
  durationMin: number;
  popular?: boolean;
  /** Którzy styliści wykonują usługę: filtr w kreatorze. */
  staffIds: string[];
}

export interface StaffMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  specialties: string[];
  bio: string;
  /** Ścieżka do /public (docelowo statyczny import). */
  photo: string;
  rating?: number;
  reviewCount?: number;
  instagram?: string;
  /** Kategorie usług, które obsługuje. */
  categoryIds: string[];
  order: number;
}

export interface Transformation {
  id: string;
  title: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  durationMin: number;
  beforeImage: string;
  afterImage: string;
  /** Opis alternatywny: wspólny dla pary przed/po. */
  alt: string;
  tags: string[];
  featured?: boolean;
}

export type ReviewSource = "google" | "instagram" | "internal";

export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** ISO yyyy-mm-dd. */
  date: string;
  serviceId?: string;
  staffId?: string;
  source: ReviewSource;
}

export interface SalonRating {
  average: number;
  total: number;
}

/** Slot terminu: w MVP dane mockowane; docelowo z bazy/kalendarza. */
export interface TimeSlot {
  /** ISO yyyy-mm-dd. */
  date: string;
  /** HH:mm. */
  time: string;
  available: boolean;
  staffId?: string;
}

export interface OpeningHour {
  /** Dzień skrócony: „Pon”, „Wt”… */
  day: string;
  /** „HH:mm” lub null gdy zamknięte. */
  open: string | null;
  close: string | null;
}

export interface SalonInfo {
  name: string;
  legalName?: string;
  tagline: string;
  description: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: "PL";
  };
  phone: string;
  /** Wersja do href="tel:" (bez spacji). */
  phoneHref: string;
  email: string;
  geo: { lat: number; lng: number };
  openingHours: OpeningHour[];
  /** Sygnał cenowy do JSON-LD: $$ / $$$. */
  priceRange: string;
  socials: { instagram?: string; facebook?: string; tiktok?: string };
  mapEmbedUrl: string;
  /** Polityka odwołań: wyświetlana przy rezerwacji. */
  bookingPolicy: string;
}
