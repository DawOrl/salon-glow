import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Integracja Next.js z React View Transitions API — używana do morphu
    // miniatura galerii → hero szczegółu usługi (Etap 2). Liczba pojedyncza.
    viewTransition: true,
  },
  images: {
    // Docelowo: zdjęcia z CMS-a. Na razie zasoby lokalne z /public.
    remotePatterns: [],
  },
  // UWAGA: cacheComponents ('use cache' + PPR) włączymy dopiero po Etapie 2 —
  // wymaga opakowania danych runtime w <Suspense>, więc dokładamy je świadomie.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Ogranicza wyciek parametrów (np. URL podziękowania) w nagłówku Referer.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
