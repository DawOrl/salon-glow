import { Fraunces, Inter } from "next/font/google";

/**
 * Typografia Quiet Atelier.
 * - Fraunces: wysokokontrastowy variable serif: bohater nagłówków + kinetyka na scroll.
 *   axes: opsz (optical size), SOFT, WONK: sterowane przez font-variation-settings.
 *   style normal+italic → italikowy "typografia-jako-hero" moment.
 * - Inter: variable sans: body, eyebrow, liczby (tabular-nums w cenniku).
 * subsets latin + latin-ext → poprawne polskie znaki (ą, ę, ś, ż, ź, ó, ł, ń, ć).
 */
export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});
