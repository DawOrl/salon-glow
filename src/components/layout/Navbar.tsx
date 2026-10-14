"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

// Pełne ścieżki "/#...", żeby linki działały także z podstron.
const links = [
  { href: "/#metamorfozy", label: "Metamorfozy" },
  { href: "/#cennik", label: "Cennik" },
  { href: "/#zespol", label: "Zespół" },
  { href: "/#opinie", label: "Opinie" },
  { href: "/#kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Cień/szkło dopiero po odjechaniu od góry.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Blokada scrolla i Esc przy otwartym menu mobilnym.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-silk ${
        scrolled || open
          ? "border-b border-line/70 bg-cream/92 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Główna nawigacja"
        className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 md:px-8"
      >
        <Link
          href="/"
          className="inline-block py-2 font-display text-2xl italic tracking-tight text-ink"
          aria-label="Glow Studio, strona główna"
        >
          Glow <span className="not-italic font-normal">Studio</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="relative text-sm text-ink-soft transition-colors duration-300 ease-silk hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-champagne after:transition-transform after:duration-300 after:ease-silk hover:after:scale-x-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/rezerwacja" className="px-6 py-3">
            Umów wizytę
          </Button>
        </div>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-px w-6 bg-ink transition-all duration-300 ease-silk ${
                open ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-px w-6 -translate-y-1/2 bg-ink transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-6 bg-ink transition-all duration-300 ease-silk ${
                open ? "top-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Przyciemnienie pod panelem: kliknięcie zamyka menu */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-x-0 top-20 bottom-0 -z-10 bg-ink/25 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel mobilny (inert, gdy zamknięty: linki poza kolejnością Tab) */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`overflow-hidden border-t border-line/60 bg-cream lg:hidden ${
          open ? "max-h-[80vh]" : "max-h-0 border-transparent"
        } transition-[max-height] duration-500 ease-silk`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center font-display text-2xl font-light text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-3 pb-2">
            <Button
              href="/rezerwacja"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Umów wizytę
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
