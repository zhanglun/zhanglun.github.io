#!/usr/bin/env node
// 小镇素材批处理：白底泛洪去背 → 边缘白边清理 → 裁边/切片 → 缩放 → PNG + 尺寸清单
// 用法: node scripts/build-town-assets.mjs [素材目录] [输出目录]
// 产出: public/ara/town/*.png 与 src/data/town-assets.json（供组件读取精确 w/h）
import { createRequire } from "module";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
const require = createRequire(import.meta.url);
const sharp = require("sharp");

const SRC = process.argv[2] || "/Users/zhanglun/Downloads/素材";
const OUT = process.argv[3] || "public/ara/town";
const MANIFEST = "src/data/town-assets.json";
mkdirSync(OUT, { recursive: true });

// name: { n: 源文件编号, ... }
// size [w,h] = 精确拉伸；size [w] = 定宽等比；height / width = 定边等比
// ground: 全出血地表——先泛洪找到内容框，再向内收 4% 去掉生成时的画框线
// slice: 道路取中段切片（去两端 15%），保证 repeat 平铺无缝
// xFromTop: 只用上部 N 比例的行决定横向包围盒，裁掉贴在楼脚的斜投影
const SPEC = {
  "ground-grass": { n: 17, ground: true, size: [512] },
  "ground-dirt": { n: 18, ground: true, size: [512] },
  "road-h": { n: 19, slice: "x", height: 240 },
  "road-v": { n: 20, slice: "y", width: 240 },
  // 十字路网：四周镜像延展（reflect pad）到 3300x7118，接缝构造上连续；
  // 左 641 / 右 659 让竖臂中心落在画布 x≈1155；上下各 2800 行供竖臂出画。
  // 页面按 0.7 显示（2310x4983）收窄路带。
  cross: { n: 21, edgeTrim: 24, padX: [641, 659], padY: [2800, 2800], width: 3300, webp: true },
  "house-blue": { n: 12, height: 190 },
  "tower-red": { n: 14, height: 238, xFromTop: 0.6 },
  "barn-green": { n: 13, height: 196 },
  "shop-stone": { n: 15, height: 196 },
  market: { n: 16, height: 258 },
  "house-red": { n: 11, height: 190 },
  tree: { n: 28, height: 140 },
  bush: { n: 29, height: 46 },
  rock: { n: 30, height: 38 },
  "grass-tuft": { n: 31, height: 34 },
  lamp: { n: 32, height: 118 },
  "sign-board": { n: 33, height: 118 },
  fence: { n: 34, height: 62 },
  "sign-road": { n: 35, height: 92 },
  barrel: { n: 36, height: 46 },
  crate: { n: 37, height: 48 },
  "person-stand": { n: 39, height: 62 },
  "person-walk-side": { n: 42, height: 58 },
  "person-walk-a": { n: 40, height: 60 },
  "person-walk-front": { n: 41, height: 62 },
  "person-walk-back": { n: 43, height: 62 },
};

const file = n => join(SRC, `生成项目设计稿 (${n}).jpeg`);

// —— 泛洪去背：只清与边缘连通的近白像素（紧容差，防止渗进精灵内部） ——
function floodBg(data, W, H) {
  const bg = new Uint8Array(W * H);
  const bgish = (x, y) => {
    const i = (y * W + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mn > 224 && mx - mn < 28;
  };
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, 0, x, H - 1);
  for (let y = 0; y < H; y++) stack.push(0, y, W - 1, y);
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const p = y * W + x;
    if (bg[p] || !bgish(x, y)) continue;
    bg[p] = 1;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
  // JPEG 白边清理：贴着背景的浅色像素按 4 邻域扩张吃掉两轮
  const loose = (x, y) => {
    const i = (y * W + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mn > 190 && mx - mn < 45;
  };
  for (let pass = 0; pass < 2; pass++) {
    const add = [];
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const p = y * W + x;
        if (bg[p] || !loose(x, y)) continue;
        if (bg[p - 1] + bg[p + 1] + bg[p - W] + bg[p + W] >= 2) add.push(p);
      }
    }
    for (const p of add) bg[p] = 1;
  }
  return bg;
}

// 连通域过滤：只留主体（≥ 最大域 35% 面积），甩掉分离的投影/碎屑
function keepMainComponents(bg, W, H) {
  const comp = new Int32Array(W * H).fill(-1);
  const sizes = [];
  const stack = [];
  for (let s = 0; s < W * H; s++) {
    if (bg[s] || comp[s] >= 0) continue;
    const id = sizes.length;
    let size = 0;
    stack.push(s);
    comp[s] = id;
    while (stack.length) {
      const p = stack.pop();
      size++;
      const x = p % W, y = (p / W) | 0;
      if (x > 0 && !bg[p - 1] && comp[p - 1] < 0) { comp[p - 1] = id; stack.push(p - 1); }
      if (x < W - 1 && !bg[p + 1] && comp[p + 1] < 0) { comp[p + 1] = id; stack.push(p + 1); }
      if (y > 0 && !bg[p - W] && comp[p - W] < 0) { comp[p - W] = id; stack.push(p - W); }
      if (y < H - 1 && !bg[p + W] && comp[p + W] < 0) { comp[p + W] = id; stack.push(p + W); }
    }
    sizes.push(size);
  }
  if (!sizes.length) return;
  const max = Math.max(...sizes);
  for (let s = 0; s < W * H; s++) {
    if (!bg[s] && sizes[comp[s]] < max * 0.35) bg[s] = 1;
  }
}

function alphaBBox(bg, W, H, xFromTop = 1) {
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!bg[y * W + x]) {
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (y1 < 0) throw new Error("去背后没有内容");
  // 横向范围只看内容上部（xFromTop 比例）的行，避开楼脚投影
  const yCut = y0 + Math.round((y1 - y0 + 1) * xFromTop);
  for (let y = y0; y < yCut; y++) {
    for (let x = 0; x < W; x++) {
      if (!bg[y * W + x]) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
      }
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

// 统一入口：EXIF 转正解码成 RGBA raw，后续全部手工裁剪
async function decode(n) {
  const { data, info } = await sharp(file(n))
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const rgba = info.channels === 4 ? data : (() => {
    const out = Buffer.alloc(W * H * 4);
    for (let p = 0; p < W * H; p++) {
      out[p * 4] = data[p * 3];
      out[p * 4 + 1] = data[p * 3 + 1];
      out[p * 4 + 2] = data[p * 3 + 2];
      out[p * 4 + 3] = 255;
    }
    return out;
  })();
  return { rgba, W, H };
}

function cropRaw(rgba, W, H, box) {
  const out = Buffer.alloc(box.width * box.height * 4);
  for (let y = 0; y < box.height; y++) {
    rgba.copy(
      out,
      y * box.width * 4,
      ((box.top + y) * W + box.left) * 4,
      ((box.top + y) * W + box.left + box.width) * 4
    );
  }
  return out;
}

const manifest = {};
for (const [name, spec] of Object.entries(SPEC)) {
  try {
    let { rgba, W, H } = await decode(spec.n);
    let buf = rgba, bw = W, bh = H;

    const bg = floodBg(buf, bw, bh);
    if (spec.ground) {
      // 全出血地表：内容框向内收 4%，去掉画框线；保持不透明
      const box = alphaBBox(bg, bw, bh);
      const ix = Math.round(box.width * 0.04), iy = Math.round(box.height * 0.04);
      box.left += ix; box.top += iy; box.width -= ix * 2; box.height -= iy * 2;
      buf = cropRaw(buf, bw, bh, box);
      bw = box.width; bh = box.height;
    } else {
      // 精灵：去背 → 甩掉分离投影 → 裁到内容包围盒
      keepMainComponents(bg, bw, bh);
      const box = alphaBBox(bg, bw, bh, spec.xFromTop);
      if (spec.edgeTrim) {
        // 内缩几像素甩掉原图裁切边的 JPEG 暗边，避免镜像延展时被对称放大
        const e = spec.edgeTrim;
        box.left += e; box.top += e; box.width -= e * 2; box.height -= e * 2;
      }
      for (let p = 0; p < bw * bh; p++) {
        if (bg[p]) buf[p * 4 + 3] = 0;
      }
      if (spec.slice) {
        // 道路平铺切片：包围盒再去掉 15% 端头，留匀质中段
        const cut = v => Math.round(v * 0.15);
        if (spec.slice === "x") {
          const cx = cut(box.width);
          box.left += cx; box.width -= cx * 2;
        } else {
          const cy = cut(box.height);
          box.top += cy; box.height -= cy * 2;
        }
      }
      buf = cropRaw(buf, bw, bh, box);
      bw = box.width; bh = box.height;
    }

    if (spec.padX || spec.padY) {
      // 四周镜像延展（reflect101）：接缝处行/列序列对称，构造上无缝
      const [plx, prx] = spec.padX || [0, 0];
      const [pty, pby] = spec.padY || [0, 0];
      const ow = bw + plx + prx;
      const oh = bh + pty + pby;
      const period = n => 2 * n - 2;
      const ref = (i, n) => {
        const m = i % period(n);
        return m < n ? m : period(n) - m;
      };
      const out = Buffer.alloc(ow * oh * 4);
      const rowBytes = bw * 4;
      const orowBytes = ow * 4;
      for (let y = 0; y < oh; y++) {
        const sy = y < pty ? ref(pty - y, bh) : y < pty + bh ? y - pty : bh - 1 - ref(y - pty - bh + 1, bh);
        const src = sy * rowBytes;
        const dst = y * orowBytes;
        for (let x = 0; x < ow; x++) {
          const sx = x < plx ? ref(plx - x, bw) : x < plx + bw ? x - plx : bw - 1 - ref(x - plx - bw + 1, bw);
          const di = dst + x * 4;
          const si = src + sx * 4;
          out[di] = buf[si];
          out[di + 1] = buf[si + 1];
          out[di + 2] = buf[si + 2];
          out[di + 3] = buf[si + 3];
        }
      }
      buf = out;
      bw = ow;
      bh = oh;
    }

    let resize;
    if (spec.size) {
      resize = spec.size.length === 2
        ? { width: spec.size[0], height: spec.size[1], fit: "fill" }
        : { width: spec.size[0] };
    } else if (spec.width) {
      resize = { width: spec.width };
    } else {
      resize = { height: spec.height };
    }
    // 大幅面路网用 webp（带 alpha、体积小一个量级），其余仍为 png
    const ext = spec.webp ? "webp" : "png";
    const pipeline = sharp(buf, { raw: { width: bw, height: bh, channels: 4 } }).resize({
      ...resize,
      kernel: "lanczos3",
    });
    const out = await (spec.webp
      ? pipeline.webp({ quality: 90, effort: 5 })
      : pipeline.png({ compressionLevel: 9, palette: true, quality: 90 })
    ).toFile(join(OUT, `${name}.${ext}`));
    manifest[name] = [out.width, out.height];
    manifest[name + "_file"] = `${name}.${ext}`;
    console.log(
      `${name}.${ext}  src ${W}x${H} box ${bw}x${bh} → ${out.width}x${out.height}  ${(out.size / 1024).toFixed(0)}KB`
    );
  } catch (e) {
    console.error(`${name} 失败: ${e.message}`);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n清单 → ${MANIFEST}`);
