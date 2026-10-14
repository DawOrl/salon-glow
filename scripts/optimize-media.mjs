/**
 * Optymalizacja mediów Glow Studio: surowe PNG -> WebP w public/ + src/lib/imageMeta.ts.
 *
 * Źródła (nie trzymamy ich w repo, są duże):
 * - zdjęcia wygenerowane w fal.ai (nano-banana-2, jedna seria edytorialna;
 *   pary "przed/po" to ta sama osoba: "po" powstało edycją zdjęcia "przed"),
 * - render 3D z Blendera: scripts/blender/grzebien-kosmyk.py.
 *
 * Uruchomienie:
 *   node scripts/optimize-media.mjs <katalog-z-surowymi-png>
 *
 * Oczekiwane nazwy plików w katalogu źródłowym: patrz tablica JOBS.
 * Brakujące źródło = istniejący plik w public/ zostaje, liczymy tylko meta.
 */
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SRC = process.argv[2];
if (!SRC) {
  console.error("Podaj katalog źródłowy: node scripts/optimize-media.mjs <katalog>");
  process.exit(1);
}

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");

/** [plik źródłowy, ścieżka publiczna, maks. szerokość, jakość, alfa?] */
const JOBS = [
  ["hero.png", "/hero/salon.webp", 1856, 82],
  ["detal.png", "/studio/detal.webp", 1200, 80],
  ["myjnia.png", "/studio/myjnia.webp", 1600, 80],
  ["team-maja.png", "/team/maja.webp", 928, 82],
  ["team-kris.png", "/team/kris.webp", 928, 82],
  ["team-natalia.png", "/team/natalia.webp", 928, 82],
  ["team-ola.png", "/team/ola.webp", 928, 82],
  ...[1, 2, 3, 4, 5, 6].flatMap((i) => [
    [`before-${i}.png`, `/portfolio/tr-${i}-before.webp`, 928, 82],
    [`after-${i}.png`, `/portfolio/tr-${i}-after.webp`, 928, 82],
  ]),
  ["grzebien-kosmyk.png", "/art/grzebien-kosmyk.webp", 1600, 86, true],
];

const meta = {};

for (const [src, pub, maxW, quality, alpha] of JOBS) {
  const from = join(SRC, src);
  const to = join(PUBLIC, pub.replace(/^\//, ""));
  mkdirSync(dirname(to), { recursive: true });

  if (existsSync(from)) {
    let img = sharp(from);
    // Render 3D: przycinamy przezroczyste marginesy, zostawiając oddech.
    if (alpha) img = sharp(await img.trim({ threshold: 1 }).toBuffer()).extend({
      top: 24, bottom: 24, left: 24, right: 24,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
    await img
      .resize({ width: maxW, withoutEnlargement: true })
      .webp({ quality, alphaQuality: alpha ? 90 : undefined, effort: 6 })
      .toFile(to);
    console.log("✓", pub);
  } else if (!existsSync(to)) {
    console.warn("! brak źródła i pliku docelowego:", src);
    continue;
  }

  const m = await sharp(to).metadata();
  const blur = await sharp(to)
    .resize(16)
    .flatten({ background: "#faf7f2" })
    .jpeg({ quality: 55 })
    .toBuffer();
  meta[pub] = {
    width: m.width,
    height: m.height,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
}

const out = `// AUTO-GENEROWANE przez scripts/optimize-media.mjs. Nie edytuj ręcznie.
export interface ImageMeta {
  width: number;
  height: number;
  blurDataURL: string;
}

export const imageMeta: Record<string, ImageMeta> = ${JSON.stringify(meta, null, 2)};
`;
writeFileSync(join(ROOT, "src/lib/imageMeta.ts"), out);
console.log("✓ src/lib/imageMeta.ts");
