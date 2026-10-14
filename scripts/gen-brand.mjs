/**
 * Generator zasobów marki Glow Studio: obraz Open Graph + ikony aplikacji.
 * Statyczne pliki (commitowane): Next.js wykrywa src/app/opengraph-image.png,
 * src/app/icon.png i src/app/apple-icon.png automatycznie.
 *
 * Uruchomienie:  node scripts/gen-brand.mjs
 */
import sharp from "sharp";
import { join } from "node:path";

const APP = join(process.cwd(), "src/app");

// Tło + typografia; zdjęcie wnętrza w łuku okna doklejamy w main().
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf7f2"/>
  <text x="80" y="128" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-style="italic" fill="#8f5342">Salon fryzjerski i koloryzacja · Warszawa</text>
  <text x="74" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="128" fill="#1a1714">Glow</text>
  <text x="74" y="430" font-family="Georgia, 'Times New Roman', serif" font-size="128" font-style="italic" fill="#b6755f">Studio</text>
  <line x1="80" y1="492" x2="140" y2="492" stroke="#c9a87c" stroke-width="2"/>
  <text x="80" y="540" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#4a4239">ul. Mokotowska 12 · rezerwacja online bez prowizji</text>
</svg>`;

const ARCH = { x: 760, y: 56, w: 360, h: 518 };
const archMask = `<svg xmlns="http://www.w3.org/2000/svg" width="${ARCH.w}" height="${ARCH.h}">
  <path d="M0,${ARCH.w / 2} A${ARCH.w / 2},${ARCH.w / 2} 0 0 1 ${ARCH.w},${ARCH.w / 2} L${ARCH.w},${ARCH.h - 24} Q${ARCH.w},${ARCH.h} ${ARCH.w - 24},${ARCH.h} L24,${ARCH.h} Q0,${ARCH.h} 0,${ARCH.h - 24} Z" fill="#fff"/>
</svg>`;

async function ogImage() {
  const photo = await sharp(join(process.cwd(), "public/hero/salon.webp"))
    .resize(ARCH.w, ARCH.h, { fit: "cover", position: "centre" })
    .composite([{ input: Buffer.from(archMask), blend: "dest-in" }])
    .png()
    .toBuffer();
  return sharp(Buffer.from(ogSvg))
    .composite([{ input: photo, left: ARCH.x, top: ARCH.y }])
    .png();
}

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
  await (await ogImage()).toFile(join(APP, "opengraph-image.png"));
  console.log("✓ src/app/opengraph-image.png");
  await (await ogImage()).toFile(join(APP, "twitter-image.png"));
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
