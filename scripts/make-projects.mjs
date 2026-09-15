#!/usr/bin/env node
// Original 16×16 project-lot stamps. Same palette as street sprites.
// Silhouettes from DOTOWN (filebox, bloom, book, bag, flag, stall, vending).
// Not DOTOWN assets — do not copy their PNGs into the repo.
import { createRequire } from "module";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/ara/projects"
);

const K = {
  ink: [26, 26, 26],
  white: [255, 255, 255],
  red: [208, 18, 42],
  yellow: [255, 214, 64],
  wood: [140, 86, 48],
  blue: [64, 140, 220],
  grass: [72, 140, 64],
  pink: [236, 120, 160],
  brown: [120, 72, 40],
  stone: [176, 176, 184],
  cream: [240, 196, 148],
  orange: [236, 132, 48],
};
const P = {
  k: K.ink,
  w: K.white,
  r: K.red,
  y: K.yellow,
  o: K.wood,
  b: K.blue,
  a: K.grass,
  p: K.pink,
  n: K.brown,
  s: K.stone,
  c: K.cream,
  t: K.orange,
};

function canvas(w, h) {
  return { w, h, d: Buffer.alloc(w * h * 4) };
}
function set(c, x, y, col) {
  if (!col || x < 0 || y < 0 || x >= c.w || y >= c.h) return;
  const i = (y * c.w + x) * 4;
  c.d[i] = col[0];
  c.d[i + 1] = col[1];
  c.d[i + 2] = col[2];
  c.d[i + 3] = 255;
}
function stamp(rows) {
  const c = canvas(16, 16);
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === "." || ch === " ") continue;
      set(c, x, y, P[ch]);
    }
  }
  return c;
}
async function save(c, name) {
  mkdirSync(out, { recursive: true });
  await sharp(c.d, { raw: { width: c.w, height: c.h, channels: 4 } })
    .resize(64, 64, { kernel: "nearest" })
    .png()
    .toFile(join(out, name));
}

const stamps = {
  // Amber ← filebox
  "chest.png": [
    "nnnnnnnnnnnnnnnn",
    "nnnnnnnnnnnnnnnn",
    "nnnnnnnnnnnnnnnn",
    "oooooooooooooooo",
    "oooooooooooooooo",
    "oooooooooooooooo",
    "oooooonnnnnooooo",
    "oooooonnnnnooooo",
    "oooooooooooooooo",
    "oooooooooooooooo",
    "oooooooooooooooo",
    "oooooooooooooooo",
    "oooooooooooooooo",
    "oooooooooooooooo",
    "oooooooooooooooo",
    "oooooooooooooooo",
  ],
  // Lettura ← stall, blue panels, no sail lettering
  "crate.png": [
    "................",
    "................",
    "................",
    "................",
    "wwyyyyyyyyyyyyww",
    "wwyyyyyyyyyyyyww",
    "ooyyyyyyyyyyyooo",
    "oooooooooooooooo",
    "oobbbobbbbbobbbo",
    "oobbbobbbbbobbbo",
    "oobbbobbbbbobbbo",
    "oooooooooooooooo",
    "ossssow..wosssso",
    "ossssow..wosssso",
    "oooooooooooooooo",
    "oooooooooooooooo",
  ],
  // Pavo ← three blooms
  "flower.png": [
    "......pp........",
    "......pp........",
    "....ppyypp......",
    "....ppyypp......",
    "......pp........",
    "......pp........",
    "......aa....pp..",
    "......aa....pp..",
    "..pp......ppyypp",
    "..pp......ppyypp",
    "ppyypp......pp..",
    "ppyypp......pp..",
    "..pp........aa..",
    "..pp........aa..",
    "..aa............",
    "..aa............",
  ],
  // BookWise ← closed book, white band
  "shelf.png": [
    "....wwttttttt...",
    "....wwttttttt...",
    "..ttwwwwwwwww...",
    "..ttttttttttt...",
    "..ttttttttttt...",
    "..ttaaaaaaatt...",
    "..ttaaaaaaatt...",
    "..ttttttttttt...",
    "..ttttttttttt...",
    "..ttttttttttt...",
    "..ttttttttttt...",
    "..ttttttttttt...",
    "..ttttttttttt...",
    "..ttttttttttt...",
    "..ttttttttttt...",
    "..ttttttttttt...",
  ],
  // Facile ← open book, ink outline on white pages
  "book.png": [
    "................",
    "................",
    "................",
    "................",
    ".kkkkkkkkkkkkkk.",
    "kwwwwwwkkwwwwwwk",
    "kwwkwwwkkwwwkwwk",
    "kwwwwwwkkwwwwwwk",
    "kwwkwwwkkwwwkwwk",
    "kwwwwwwkkwwwwwwk",
    "kwwkwwwkkwwwkwwk",
    "kwwwwwwkkwwwwwwk",
    "kwwkwwwkkwwwkwwk",
    "kwwwwwwkkwwwwwwk",
    ".kkkkkkkkkkkkkk.",
    "................",
  ],
  // Notify ← flag, ink pole and outline
  "sign.png": [
    "kkrrrrrrrrrrkk..",
    "kkrrrrrrrrrrkk..",
    "kkrrrrrrrrrrkk..",
    "kkrrrrrrrrrrkk..",
    "kkrrrrrrrrrrkk..",
    "kkrrrrrrrrrrkk..",
    "kkrrrrrrrrrrkk..",
    "kkkkkkkkkkkkkk..",
    "kk..............",
    "kk..............",
    "kk..............",
    "kk..............",
    "kk..............",
    "kk..............",
    "kk..............",
    "kk..............",
  ],
  // Tinny ← vending, ink outline
  "well.png": [
    "kkkkkkkkkkkkkkkk",
    "krrrrrrrrrrrrrrk",
    "krrwwwwwwwwwwrrk",
    "krrwwrrwwrrwwrrk",
    "krrwwrrwwrrwwrrk",
    "krrwwwwwwwwwwrrk",
    "krrwwbbwwbbwwrrk",
    "krrwwbbwwbbwwrrk",
    "krrrrrrrrrrrrrrk",
    "krrrrrrrrrssrrrk",
    "krrrrrrrrrrrrrrk",
    "krrrrrrrrrrrrrrk",
    "krrnnnnnnnnnnrrk",
    "krrnnnnnnnnnnrrk",
    "krrrrrrrrrrrrrrk",
    "kkkkkkkkkkkkkkkk",
  ],
  // BlueRobin ← money bag, ink outline
  "sack.png": [
    ".....kkkkkk.....",
    "....kooooook....",
    ".....kooook.....",
    "......aaa.......",
    "......aaa.......",
    "....kooooook....",
    "....kooooook....",
    "..kooooooooook..",
    ".kooooooooooook.",
    ".kooooooooooook.",
    ".kooooooooooook.",
    ".kooooooooooook.",
    ".kooooooooooook.",
    ".kooooooooooook.",
    "..kooooooooook..",
    "...kkkkkkkkkk...",
  ],
};

for (const [name, rows] of Object.entries(stamps)) {
  if (rows.length !== 16 || rows.some(r => r.length !== 16)) {
    throw new Error(`${name} must be 16x16`);
  }
  for (const row of rows) {
    for (const ch of row) {
      if (ch !== "." && !P[ch]) throw new Error(`${name}: unknown '${ch}'`);
    }
  }
  await save(stamp(rows), name);
}
console.log("wrote", out);
