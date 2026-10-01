#!/usr/bin/env node
// 巡逻蟹 9×6 精灵（用户提供素材 thing_crab_01.png 的等值复刻，
// 60px 块 → 4px 块，原生 36×24）。正面对称，横行巡逻，翻转无感。
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const PAL = {
  O: [234, 85, 20], // 主橙 ea5514
  o: [255, 129, 74], // 浅橙 ff814a
  "#": [61, 61, 61], // 眼 3d3d3d
};
const S = 4; // px/格

const CRAB = [
  "O..#.#..O",
  "OO.O.O.OO",
  "OOoooooOO",
  "..ooooo..",
  ".OoooooO.",
  ".O.....O.",
];

const w = CRAB[0].length * S;
const h = CRAB.length * S;
const buf = Buffer.alloc(w * h * 4, 0);
CRAB.forEach((row, y) => {
  [...row].forEach((ch, x) => {
    const col = PAL[ch];
    if (!col) return;
    for (let dy = 0; dy < S; dy++) {
      for (let dx = 0; dx < S; dx++) {
        const i = ((y * S + dy) * w + x * S + dx) * 4;
        buf[i] = col[0];
        buf[i + 1] = col[1];
        buf[i + 2] = col[2];
        buf[i + 3] = 255;
      }
    }
  });
});

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/ara/sprites/crab.png"
);
await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).png().toFile(out);
console.log(`saved ${out} (${w}x${h})`);
