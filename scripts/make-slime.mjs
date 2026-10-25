#!/usr/bin/env node
// 小镇原创史莱姆 16×16 × 4 帧(64×16 横条):本站原创绘制,无授权限制。
// 玩家与宠物共用;NPC 为 Modern Interiors 人形村民,见 ASSETS.md。
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, "../public/town/gen"), { recursive: true });

const PAL = {
  body: [134, 219, 168], // 薄荷绿主体
  dark: [47, 107, 79], // 描边
  hi: [217, 246, 227], // 高光
  eye: [34, 66, 58], // 眼睛
};

// [半宽, 高]:静息 → 压扁 → 拉伸 → 回弹
const FRAMES = [
  [6, 9],
  [7, 7],
  [5, 12],
  [6, 8],
];
const W = 16;
const H = 16;
const OUT = 64;

const buf = Buffer.alloc(OUT * H * 4, 0);
FRAMES.forEach(([halfW, tall], fi) => {
  const ox = fi * W;
  const baseY = H - 1; // 底边贴地
  const cx = W / 2;
  // 半椭圆穹顶遮罩:先算布尔网格,再按轮廓描边(避免横条纹)
  const mask = Array.from({ length: H }, () => new Array(W).fill(false));
  for (let r = 0; r < tall; r++) {
    const t = (r + 1) / tall; // 0..1,顶部小底部满
    const hw = Math.max(1, Math.round(halfW * Math.sqrt(t)));
    const y = baseY - tall + 1 + r;
    for (let x = Math.ceil(cx - hw); x <= Math.floor(cx + hw); x++) mask[y][x] = true;
  }
  const at = (x, y) => x >= 0 && y >= 0 && x < W && y < H && mask[y][x];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!mask[y][x]) continue;
      const onEdge = !at(x - 1, y) || !at(x + 1, y) || !at(x, y - 1) || !at(x, y + 1);
      const isHi = x < cx - 1 && y < baseY - tall * 0.55 && at(x - 1, y) && at(x, y - 1);
      const col = onEdge ? PAL.dark : isHi ? PAL.hi : PAL.body;
      const i = (y * OUT + ox + x) * 4;
      buf[i] = col[0];
      buf[i + 1] = col[1];
      buf[i + 2] = col[2];
      buf[i + 3] = 255;
    }
  }
  // 眼睛:两粒 1×2 竖点,约 55% 高度
  const top = baseY - tall + 1;
  const eyeY = top + Math.round(tall * 0.55);
  const eyeDX = Math.max(2, Math.round(halfW * 0.45));
  for (const ex of [Math.round(cx - eyeDX), Math.round(cx + eyeDX)]) {
    for (const dy of [0, 1]) {
      const i = ((eyeY + dy) * OUT + ox + ex) * 4;
      buf[i] = PAL.eye[0];
      buf[i + 1] = PAL.eye[1];
      buf[i + 2] = PAL.eye[2];
      buf[i + 3] = 255;
    }
  }
});

await sharp(buf, { raw: { width: OUT, height: H, channels: 4 } })
  .png()
  .toFile(join(here, "../public/town/gen/slime.png"));
console.log("gen/slime.png 64x16 (4 帧) ✓");
