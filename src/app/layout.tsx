import type { Metadata } from "next";
import "./globals.css";
import { fraunces, inter } from "./fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { salon } from "@/lib/salon";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Glow Studio · fryzjer i koloryzacja w Warszawie",
    template: "%s | Glow Studio",
  },
  description: salon.description,
  keywords: [
    "salon fryzjerski Warszawa",
    "balayage Warszawa",
    "koloryzacja włosów",
    "strzyżenie damskie",
    "keratynowe prostowanie",
    "fryzjer Mokotowska",
  ],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Glow Studio",
    title: "Glow Studio · fryzjer i koloryzacja w Warszawie",
    description: salon.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Glow Studio · fryzjer i koloryzacja w Warszawie",
    description: salon.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-pill focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-cream"
        >
          Przejdź do treści
        </a>
        <div className="grain" aria-hidden="true" />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
