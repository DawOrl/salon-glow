/**
 * Generator zasobów marki Glow Studio: obraz Open Graph + ikony aplikacji.
 * Statyczne pliki (commitowane) — Next.js wykrywa src/app/opengraph-image.png,
 * src/app/icon.png i src/app/apple-icon.png automatycznie.
 *
 * Uruchomienie:  node scripts/gen-brand.mjs
 */
import sharp from "sharp";
import { join } from "node:path";

const APP = join(process.cwd(), "src/app");

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#faf7f2"/>
      <stop offset="1" stop-color="#e8dfd3"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.75" cy="0.2" r="0.7">
      <stop offset="0" stop-color="#c9a87c" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#c9a87c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="48" y="48" width="1104" height="534" rx="28" fill="none" stroke="#c9a87c" stroke-opacity="0.5" stroke-width="2"/>
  <text x="96" y="150" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="6" fill="#6f665b">SALON FRYZJERSKI &amp; KOLORYZACJA</text>
  <text x="92" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="150" fill="#1a1714">Glow</text>
  <text x="92" y="470" font-family="Georgia, 'Times New Roman', serif" font-size="150" font-style="italic" fill="#b6755f">Studio</text>
  <text x="96" y="545" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#4a4239">Mokotowska 12 · Warszawa  ·  rezerwacja bez prowizji</text>
</svg>`;

function iconSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c9a87c"/>
      <stop offset="1" stop-color="#b6755f"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Georgia, 'Times New Roman', serif" font-size="${size * 0.62}" font-style="italic" fill="#faf7f2">G</text>
</svg>`;
}

async function main() {
  await sharp(Buffer.from(ogSvg)).png().toFile(join(APP, "opengraph-image.png"));
  console.log("✓ src/app/opengraph-image.png");
  await sharp(Buffer.from(ogSvg)).png().toFile(join(APP, "twitter-image.png"));
  console.log("✓ src/app/twitter-image.png");
  await sharp(Buffer.from(iconSvg(512))).png().toFile(join(APP, "icon.png"));
  console.log("✓ src/app/icon.png");
  await sharp(Buffer.from(iconSvg(180))).png().toFile(join(APP, "apple-icon.png"));
  console.log("✓ src/app/apple-icon.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
