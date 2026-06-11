/**
 * Pobiera realne materiały BEZ klucza API:
 * - Zdjęcia: publiczne CDN Pexels (images.pexels.com) — licencja darmowa/komercyjna,
 *   bez obowiązku atrybucji. URL-e wyselekcjonowane ręcznie (wnętrze, portrety, fryzury).
 * - Wideo: wyłuskane z HTML strony wyszukiwania Pexels (videos.pexels.com/...mp4).
 * Optymalizuje (sharp), liczy blurDataURL i nadpisuje src/lib/imageMeta.ts.
 * Metamorfozy „przed/po” są SYMULOWANE z jednego zdjęcia (po = naturalne,
 * przed = przygaszone/chłodniejsze). Sloty, które się nie pobiorą, zachowują
 * istniejący plik i mają policzone meta z dysku.
 *
 * Uruchomienie:  node scripts/fetch-stock.mjs   (wymaga dostępu do internetu)
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");
const meta = {};
const PW = 1000, PH = 1250, HW = 1200, HH = 1500;

// Wyselekcjonowane ID zdjęć Pexels (kolejność = priorytet, z zapasem na 404).
const INTERIOR = [7195805, 7195799, 7195803, 7195812, 7195807, 7195796];
// Cztery różne osoby z różnych sesji — Kris (barber) to mężczyzna.
const MAN = [8552627, 20302333, 19225142, 7919442, 7697386];
const WOMAN_A = [5368632, 8467964, 8834017, 3992873];
const WOMAN_B = [30609905, 27086761, 13801472, 10040258];
const WOMAN_C = [27086761, 13018457, 8479114, 5824215];
const HAIR = [7752412, 6391646, 20046793, 18189268, 27604284, 12831452, 4981476, 7388907, 6270123, 3101477, 16207701, 1850585, 6100174, 27679949];

const imgUrl = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;
const absPath = (p) => join(PUBLIC, p.replace(/^\//, ""));
const cover = (buf, w, h) =>
  sharp(buf).resize(w, h, { fit: "cover", position: sharp.strategy.attention });

async function dlImage(ids, startIdx) {
  for (let i = startIdx; i < ids.length; i++) {
    try {
      const r = await fetch(imgUrl(ids[i]));
      if (!r.ok) continue;
      if (!(r.headers.get("content-type") || "").startsWith("image/")) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 2000) continue;
      return { buf, nextIdx: i + 1 };
    } catch {}
  }
  return { buf: null, nextIdx: ids.length };
}

async function writeJpg(p, pipeline, w, h) {
  const jpg = await pipeline.jpeg({ quality: 82 }).toBuffer();
  writeFileSync(absPath(p), jpg);
  const blur = await sharp(jpg).resize(14).jpeg({ quality: 55 }).toBuffer();
  meta[p] = {
    width: w,
    height: h,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
  console.log("✓", p);
}

async function ensureMeta(p, w, h) {
  if (meta[p]) return;
  const a = absPath(p);
  if (!existsSync(a)) return;
  const blur = await sharp(readFileSync(a)).resize(14).jpeg({ quality: 55 }).toBuffer();
  meta[p] = {
    width: w,
    height: h,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
  console.log("· meta z dysku:", p);
}

async function fetchVideo() {
  try {
    const r = await fetch("https://www.pexels.com/search/videos/hair%20salon/", {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
    });
    if (!r.ok) throw new Error(`search ${r.status}`);
    const html = await r.text();
    const urls = [...new Set(
      [...html.matchAll(/https:\/\/videos\.pexels\.com\/video-files\/[A-Za-z0-9_/-]+\.mp4/g)].map((m) => m[0]),
    )];
    const cand = urls.map((u) => {
      const m = u.match(/_(\d+)_(\d+)_(\d+)\.mp4$/);
      return { u, w: m ? +m[1] : 0, h: m ? +m[2] : 0 };
    });
    cand.sort((a, b) => a.w * a.h - b.w * b.h);
    const ordered = [
      ...cand.filter((c) => c.h >= c.w && c.w >= 480 && c.w <= 1080),
      ...cand.filter((c) => c.w >= 480 && c.w <= 1280),
      ...cand,
    ];
    for (const c of ordered) {
      try {
        const vr = await fetch(c.u);
        if (!vr.ok) continue;
        const buf = Buffer.from(await vr.arrayBuffer());
        if (buf.length > 0 && buf.length <= 5 * 1024 * 1024) {
          writeFileSync(join(PUBLIC, "hero/loop.mp4"), buf);
          console.log(`✓ /hero/loop.mp4 (${(buf.length / 1048576).toFixed(1)} MB, ${c.w}x${c.h})`);
          return;
        }
      } catch {}
    }
    console.warn("  ! nie znaleziono wideo <=5MB — hero zostaje na posterze");
  } catch (e) {
    console.warn("  ! wideo pominięte:", e.message);
  }
}

async function main() {
  mkdirSync(join(PUBLIC, "team"), { recursive: true });
  mkdirSync(join(PUBLIC, "portfolio"), { recursive: true });
  mkdirSync(join(PUBLIC, "hero"), { recursive: true });

  // Hero poster
  {
    const { buf } = await dlImage(INTERIOR, 0);
    if (buf) await writeJpg("/hero/poster.jpg", cover(buf, HW, HH), HW, HH);
  }

  // Zespół — osobne pule, by uzyskać 4 RÓŻNE osoby z różnych sesji
  const teamFiles = ["/team/maja.jpg", "/team/kris.jpg", "/team/natalia.jpg", "/team/ola.jpg"];
  const teamPools = [WOMAN_A, MAN, WOMAN_B, WOMAN_C];
  for (let t = 0; t < teamFiles.length; t++) {
    const { buf } = await dlImage(teamPools[t], 0);
    if (buf) await writeJpg(teamFiles[t], cover(buf, PW, PH), PW, PH);
  }

  // Metamorfozy — przed/po z jednego zdjęcia
  let hi = 0;
  for (let i = 1; i <= 6; i++) {
    const { buf, nextIdx } = await dlImage(HAIR, hi);
    hi = nextIdx;
    if (!buf) continue;
    await writeJpg(`/portfolio/tr-${i}-after.jpg`, cover(buf, PW, PH), PW, PH);
    await writeJpg(
      `/portfolio/tr-${i}-before.jpg`,
      cover(buf, PW, PH).modulate({ saturation: 0.5, brightness: 0.94 }).linear(0.92, 8),
      PW,
      PH,
    );
  }

  await fetchVideo();

  // Uzupełnij meta dla slotów bez świeżego pobrania (z istniejących plików)
  const all = [["/hero/poster.jpg", HW, HH], ...teamFiles.map((f) => [f, PW, PH])];
  for (let i = 1; i <= 6; i++) {
    all.push([`/portfolio/tr-${i}-before.jpg`, PW, PH], [`/portfolio/tr-${i}-after.jpg`, PW, PH]);
  }
  for (const [p, w, h] of all) await ensureMeta(p, w, h);

  const body = `// AUTO-GENEROWANE przez scripts/fetch-stock.mjs — nie edytuj ręcznie.
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
