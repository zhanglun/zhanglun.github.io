#!/usr/bin/env node
// 邮差猫 12×12 侧视精灵（面向左， patrols 时 scaleX 翻转）。
// 与 make-projects.mjs 同一套调色板；原生 36×36（3px/格），
// 页脚 1:1 显示，无缩放畸变。
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const PAL = {
  "#": [26, 26, 26], // ink
  C: [240, 196, 148], // cream
  R: [208, 18, 42], // 邮戳红项圈
};
const S = 3; // px/格

//  ·#…：耳尖在头顶两侧，眼=奶油脸上的 1 墨点，鼻在左缘，
//  红项圈一段在颈，尾巴从背右侧翘起，四腿两两成对
const CAT = [
  "..#...#.....",
  ".#######....",
  ".#C#CC##....",
  "##CCC###....",
  ".#CC#RR#####",
  ".#CCCCCCC##.",
  ".#CCCCCCC###",
  ".#CCCCCCC###",
  ".#CCCCCCC##.",
  "..##...##...",
  "..##...##...",
  "..##...##...",
];

// ASCII 预览
console.log(CAT.map(r => r.replace(/\./g, " ").replace(/C/g, "░")).join("\n"));

const w = 12 * S;
const buf = Buffer.alloc(w * w * 4, 0);
CAT.forEach((row, y) => {
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
  "../public/ara/sprites/cat.png"
);
await sharp(buf, { raw: { width: w, height: w, channels: 4 } }).png().toFile(out);
console.log(`\nsaved ${out} (${w}x${w})`);
