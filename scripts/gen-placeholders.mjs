/**
 * Generator placeholderów Glow Studio.
 * Tworzy eleganckie, palette-matched obrazy JPG (zespół, metamorfozy przed/po,
 * hero poster) + moduł src/lib/imageMeta.ts z wymiarami i blurDataURL.
 *
 * Placeholdery są celowo abstrakcyjne (gradient + miękkie pasma światła) —
 * docelowo podmieniane na realną sesję zdjęciową. Wersje „przed” są chłodne
 * i matowe, „po” ciepłe i lśniące, dzięki czemu suwak przed/po niesie sens.
 *
 * Uruchomienie:  node scripts/gen-placeholders.mjs
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");

/** Paleta moodów (góra → dół gradientu) + barwy pasm i moc światła. */
const MOODS = {
  before: { stops: ["#cdc8be", "#a9a298", "#8f877c"], strand: "#7d756a", glow: 0.12 },
  after: { stops: ["#f0e8db", "#d8c4a3", "#c1a079"], strand: "#b6755f", glow: 0.32 },
  hero: { stops: ["#faf7f2", "#efe7da", "#e0d2bd"], strand: "#c9a87c", glow: 0.4 },
  team0: { stops: ["#efe7da", "#d8c4a3", "#c9a87c"], strand: "#b6755f", glow: 0.28 },
  team1: { stops: ["#e9ede4", "#bcc7b0", "#8a9a82"], strand: "#6f7d66", glow: 0.24 },
  team2: { stops: ["#f1e7de", "#ddb79a", "#b6755f"], strand: "#9c5f4b", glow: 0.3 },
  team3: { stops: ["#efe9df", "#cfc3b0", "#a99a86"], strand: "#8a7d6b", glow: 0.22 },
};

/** Kilka miękkich, pionowych „pasm” (włosy/światło) — deterministycznie wg seed. */
function strands(w, h, color, seed) {
  let out = "";
  const n = 5;
  for (let i = 0; i < n; i++) {
    const t = (i + 1) / (n + 1);
    const x = w * t + Math.sin(seed + i) * w * 0.06;
    const sway = w * 0.07 * (i % 2 === 0 ? 1 : -1);
    const op = 0.05 + ((seed + i) % 3) * 0.02;
    out += `<path d="M ${x.toFixed(0)} ${-h * 0.05} C ${(x + sway).toFixed(0)} ${(h * 0.3).toFixed(0)}, ${(x - sway).toFixed(0)} ${(h * 0.65).toFixed(0)}, ${(x + sway * 0.5).toFixed(0)} ${(h * 1.05).toFixed(0)}" stroke="${color}" stroke-width="${(w * 0.012).toFixed(1)}" fill="none" opacity="${op.toFixed(2)}" stroke-linecap="round"/>`;
  }
  return out;
}

function svg({ w, h, mood, seed = 1, figure = true }) {
  const m = MOODS[mood];
  const [c0, c1, c2] = m.stops;
  const fig = figure
    ? `<ellipse cx="${w * 0.5}" cy="${h * 1.02}" rx="${w * 0.42}" ry="${h * 0.62}" fill="${c2}" opacity="0.45"/>
       <ellipse cx="${w * 0.5}" cy="${h * 0.4}" rx="${w * 0.17}" ry="${h * 0.17}" fill="${c2}" opacity="0.4"/>`
    : "";
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c0}"/>
      <stop offset="0.55" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.32" cy="0.22" r="0.8">
      <stop offset="0" stop-color="#ffffff" stop-opacity="${m.glow}"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.45" r="0.75">
      <stop offset="0.6" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#1a1714" stop-opacity="0.22"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${fig}
  ${strands(w, h, m.strand, seed)}
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`);
}

const meta = {};

async function emit(publicPath, buf, w, h) {
  const abs = join(PUBLIC, publicPath.replace(/^\//, ""));
  await sharp(buf).jpeg({ quality: 82 }).toFile(abs);
  const blur = await sharp(buf).resize(14).jpeg({ quality: 55 }).toBuffer();
  meta[publicPath] = {
    width: w,
    height: h,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
  console.log("✓", publicPath);
}

async function main() {
  mkdirSync(join(PUBLIC, "team"), { recursive: true });
  mkdirSync(join(PUBLIC, "portfolio"), { recursive: true });
  mkdirSync(join(PUBLIC, "hero"), { recursive: true });

  const PW = 1000;
  const PH = 1250; // 4:5

  // Zespół
  const teamFiles = ["maja", "kris", "natalia", "ola"];
  for (let i = 0; i < teamFiles.length; i++) {
    await emit(`/team/${teamFiles[i]}.jpg`, svg({ w: PW, h: PH, mood: `team${i}`, seed: i + 2 }), PW, PH);
  }

  // Metamorfozy — pary przed/po
  for (let i = 1; i <= 6; i++) {
    await emit(`/portfolio/tr-${i}-before.jpg`, svg({ w: PW, h: PH, mood: "before", seed: i }), PW, PH);
    await emit(`/portfolio/tr-${i}-after.jpg`, svg({ w: PW, h: PH, mood: "after", seed: i + 1 }), PW, PH);
  }

  // Hero poster (editorial, 4:5 — kadr pionowy do asymetrycznego heroku)
  await emit(`/hero/poster.jpg`, svg({ w: 1200, h: 1500, mood: "hero", seed: 3 }), 1200, 1500);

  const body = `// AUTO-GENEROWANE przez scripts/gen-placeholders.mjs — nie edytuj ręcznie.
export interface ImageMeta {
  width: number;
  height: number;
  blurDataURL: string;
}

export const imageMeta: Record<string, ImageMeta> = ${JSON.stringify(meta, null, 2)};
`;
  writeFileSync(join(ROOT, "src/lib/imageMeta.ts"), body);
  console.log("✓ src/lib/imageMeta.ts");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
