#!/usr/bin/env node
// Top-down pixel town for the projects page.
// Ground: procedural sage-grass + stone roads (4x art). Buildings: assembled
// from the free "Medieval town" tileset by keith karnage (CC-BY 3.0,
// opengameart.org/content/medieval-town-0) at native kit scale — see
// public/ara/shops/ATTRIBUTION.md. Lamp/barrel/props stay site-original 4x.
import { createRequire } from "module";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const out = join(dirname(fileURLToPath(import.meta.url)), "../public/ara/shops");
const KIT = join(dirname(fileURLToPath(import.meta.url)), "../public/ara/shops/kit-medieval-town.png");

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
  brownD: [92, 54, 26],
  stone: [176, 176, 184],
  cream: [240, 196, 148],
  orange: [236, 132, 48],
};
const G = {
  grass: [206, 214, 195],
  grassD: [176, 189, 160],
  grassL: [221, 228, 209],
  path: [201, 200, 196],
  pathD: [170, 170, 168],
  edge: [122, 128, 114],
};
const G2 = {
  water: [148, 176, 204],
  waterD: [108, 136, 162],
  waterL: [196, 216, 232],
  bush: [112, 138, 98],
  bushL: [140, 162, 118],
};

function canvas(w, h) {
  return { w, h, d: Buffer.alloc(w * h * 4) };
}
function set(c, x, y, col, a = 255) {
  if (!col || x < 0 || y < 0 || x >= c.w || y >= c.h) return;
  const i = (y * c.w + x) * 4;
  c.d[i] = col[0];
  c.d[i + 1] = col[1];
  c.d[i + 2] = col[2];
  c.d[i + 3] = a;
}
function fill(c, x, y, w, h, col, a = 255) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(c, x + i, y + j, col, a);
}
function frame(c, x, y, w, h, col, a = 255) {
  fill(c, x, y, w, 1, col, a);
  fill(c, x, y + h - 1, w, 1, col, a);
  fill(c, x, y, 1, h, col, a);
  fill(c, x + w - 1, y, 1, h, col, a);
}
function lcg(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
async function save(c, name, scale) {
  mkdirSync(out, { recursive: true });
  await sharp(c.d, { raw: { width: c.w, height: c.h, channels: 4 } })
    .resize(c.w * scale, c.h * scale, { kernel: "nearest" })
    .png()
    .toFile(join(out, name));
}

// ---------- ground: organic village map, 24 x 10 tiles of 16px ----------
// Roads are stamped as wandering strokes instead of straight rectangles, so
// the network reads like a real village: lanes swing, junctions swell, and
// each door gets its own little apron. Flagstones are 8px (half a tile) with
// per-stone tone jitter.
const GW = 384;
const GH = 160;
const pond = { x: 352, y: 76, r: 18 };
const bed = { x: 144, y: 86, r: 8 };
const road = new Uint8Array(GW * GH);
const water = new Uint8Array(GW * GH);
const roadAt = (x, y) => x >= 0 && y >= 0 && x < GW && y < GH && road[y * GW + x] === 1;
const waterAt = (x, y) => x >= 0 && y >= 0 && x < GW && y < GH && water[y * GW + x] === 1;

function stamp(mask, x, y, r) {
  const x0 = Math.max(0, Math.floor(x - r));
  const x1 = Math.min(GW - 1, Math.ceil(x + r));
  const y0 = Math.max(0, Math.floor(y - r));
  const y1 = Math.min(GH - 1, Math.ceil(y + r));
  for (let j = y0; j <= y1; j++) {
    for (let i = x0; i <= x1; i++) {
      const dx = i - x;
      const dy = j - y;
      if (dx * dx + dy * dy <= r * r) mask[j * GW + i] = 1;
    }
  }
}
// wandering stroke: perpendicular sine wobble fades at both ends
function roadStroke(x0, y0, x1, y1, r, amp, phase) {
  const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0)) * 2;
  const nx = -(y1 - y0);
  const ny = x1 - x0;
  const len = Math.hypot(nx, ny) || 1;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const w = Math.sin(t * Math.PI * 2.2 + phase) * amp * Math.sin(t * Math.PI);
    stamp(road, x0 + (x1 - x0) * t + (nx / len) * w, y0 + (y1 - y0) * t + (ny / len) * w, r);
  }
}

function ground() {
  const c = canvas(GW, GH);
  const rnd = lcg(67556832);
  fill(c, 0, 0, GW, GH, G.grass);
  for (const p of patches) {
    fill(c, p.x, p.y, p.w, p.h, p.t, 150);
    fill(c, p.x + 6, p.y + p.h - 3, p.w - 14, 3, p.t, 150);
    fill(c, p.x + p.w - 10, p.y + 3, 8, p.h - 8, p.t, 150);
  }
  // ---- road network ----
  roadStroke(6, 40, 378, 40, 12, 4, 0.8); // back lane
  roadStroke(6, 114, 378, 114, 14, 5, 2.1); // main street
  roadStroke(230, 40, 242, 114, 10, 5, 1.4); // connector
  stamp(road, 214, 106, 26); // market square
  stamp(road, 194, 94, 14);
  stamp(road, 236, 94, 14);
  // door aprons for the back-lane shops
  for (const dx of [54, 139, 182, 323]) stamp(road, dx, 34, 7);
  // ---- pond ----
  stamp(water, pond.x, pond.y, pond.r);
  stamp(water, pond.x + 14, pond.y + 8, 12);
  // ---- surface ----
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      if (road[y * GW + x]) fill(c, x, y, 1, 1, G.path);
      else if (water[y * GW + x]) fill(c, x, y, 1, 1, G2.water);
    }
  }
  // 8px flagstones with per-stone tone jitter + pebble specks
  for (let ty = 0; ty < GH; ty += 8) {
    for (let tx = 0; tx < GW; tx += 8) {
      if (!road[ty * GW + tx]) continue;
      const j = Math.floor(rnd() * 3);
      if (j === 0) tintRoad(c, road, tx, ty, 8, 8, K.white, 16);
      else if (j === 2) tintRoad(c, road, tx, ty, 8, 8, K.brownD, 22);
      for (let p = 0; p < 3; p++) {
        const px = tx + Math.floor(rnd() * 8);
        const py = ty + Math.floor(rnd() * 8);
        if (road[py * GW + px]) set(c, px, py, rnd() < 0.5 ? G.pathD : G.path);
      }
    }
  }
  for (let ty = 0; ty < GH; ty += 8) {
    for (let tx = 0; tx < GW; tx += 8) {
      if (!water[ty * GW + tx]) continue;
      tintWater(c, water, tx, ty, 8, 8, [40, 70, 100], 14);
    }
  }
  // grass edging around every road (follows the wander)
  const edge = new Uint8Array(GW * GH);
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      if (road[y * GW + x]) continue;
      if (
        roadAt(x - 1, y) || roadAt(x + 1, y) || roadAt(x, y - 1) || roadAt(x, y + 1)
      )
        edge[y * GW + x] = 1;
    }
  }
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      if (edge[y * GW + x]) fill(c, x, y, 1, 1, G.edge);
    }
  }
  // pond rim + ripples
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      if (water[y * GW + x]) continue;
      if (
        waterAt(x - 1, y) || waterAt(x + 1, y) || waterAt(x, y - 1) || waterAt(x, y + 1)
      ) {
        set(c, x, y, G2.waterD);
      }
    }
  }
  fill(c, pond.x - 8, pond.y + 3, 10, 1, G2.waterL);
  fill(c, pond.x + 20, pond.y + 14, 12, 1, G2.waterL);
  fill(c, pond.x + 6, pond.y + 24, 8, 1, G2.waterL);
  // village-green flower bed (round, dense)
  for (let j = -bed.r; j <= bed.r; j++) {
    for (let i = -bed.r; i <= bed.r; i++) {
      const d2 = i * i + j * j;
      if (d2 <= bed.r * bed.r) {
        const rim = d2 > (bed.r - 1) * (bed.r - 1);
        set(c, bed.x + i, bed.y + j, rim ? G.grassL : G.grassD);
      }
    }
  }
  for (let f = 0; f < 22; f++) {
    const a = rnd() * Math.PI * 2;
    const rr = 1 + rnd() * (bed.r - 2.5);
    set(
      c,
      bed.x + Math.round(Math.cos(a) * rr),
      bed.y + Math.round(Math.sin(a) * rr),
      rnd() < 0.5 ? K.pink : K.yellow
    );
  }
  // grass specks + flowers on open grass only
  for (let i = 0; i < 560; i++) {
    const x = Math.floor(rnd() * (GW - 3));
    const y = Math.floor(rnd() * (GH - 3));
    if (roadAt(x, y) || roadAt(x + 1, y) || waterAt(x, y)) continue;
    if (rnd() < 0.5) {
      fill(c, x, y, 2, 1, G.grassD);
      set(c, x + 2, y + 1, G.grassD);
    } else {
      set(c, x, y, G.grassL);
      set(c, x + 1, y, G.grassD);
    }
  }
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(rnd() * (GW - 3));
    const y = Math.floor(rnd() * (GH - 3));
    if (roadAt(x, y) || waterAt(x, y)) continue;
    set(c, x, y, rnd() < 0.5 ? K.pink : K.yellow);
    set(c, x, y + 1, G.grassD);
  }
  for (const [bx, by] of bushes) bush(c, bx, by);
  return c;
}
function tintRoad(c, road, x, y, w, h, col, a) {
  const A = a / 255;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const px = x + i;
      const py = y + j;
      if (!road[py * GW + px]) continue;
      const idx = (py * GW + px) * 4;
      c.d[idx] = Math.round(col[0] * A + c.d[idx] * (1 - A));
      c.d[idx + 1] = Math.round(col[1] * A + c.d[idx + 1] * (1 - A));
      c.d[idx + 2] = Math.round(col[2] * A + c.d[idx + 2] * (1 - A));
    }
  }
}

function tintWater(c, water, x, y, w, h, col, a) {
  const A = a / 255;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const px = x + i;
      const py = y + j;
      if (!water[py * GW + px]) continue;
      const idx = (py * GW + px) * 4;
      c.d[idx] = Math.round(col[0] * A + c.d[idx] * (1 - A));
      c.d[idx + 1] = Math.round(col[1] * A + c.d[idx + 1] * (1 - A));
      c.d[idx + 2] = Math.round(col[2] * A + c.d[idx + 2] * (1 - A));
    }
  }
}

const patches = [
  { x: 16, y: 8, w: 70, h: 26, t: G.grassD },
  { x: 120, y: 14, w: 60, h: 20, t: G.grassL },
  { x: 240, y: 6, w: 60, h: 24, t: G.grassD },
  { x: 330, y: 10, w: 44, h: 22, t: G.grassL },
  { x: 24, y: 86, w: 80, h: 18, t: G.grassL },
  { x: 150, y: 90, w: 40, h: 16, t: G.grassD },
  { x: 292, y: 88, w: 36, h: 16, t: G.grassD },
  { x: 30, y: 148, w: 90, h: 10, t: G.grassL },
  { x: 180, y: 148, w: 80, h: 10, t: G.grassD },
  { x: 300, y: 148, w: 70, h: 10, t: G.grassL },
];
const bushes = [
  [20, 62],
  [172, 62],
  [286, 62],
  [360, 62],
  [140, 88],
  [310, 88],
  [50, 138],
  [196, 140],
  [300, 140],
];
function bush(c, x, y) {
  fill(c, x + 1, y, 3, 1, G2.bush);
  fill(c, x, y + 1, 5, 2, G2.bush);
  set(c, x + 1, y + 1, G2.bushL);
  set(c, x + 3, y + 2, G2.bushL);
}

// ---------- shared sprite helpers ----------
function contactShadow(c, x, y, w, h, a = 62) {
  const sx = x + 3;
  const sy = y + 3;
  fill(c, sx, sy, w - 2, h - 2, [36, 52, 36], a);
  for (let i = sx - 1; i <= sx + w - 1; i++) {
    if ((i + sy) % 2 === 0) set(c, i, sy - 1, [36, 52, 36], 38);
    if ((i + sy + h) % 2 === 0) set(c, i, sy + h, [36, 52, 36], 38);
  }
  for (let j = sy; j <= sy + h - 1; j++) {
    if ((j + sx) % 2 === 0) set(c, sx - 1, j, [36, 52, 36], 38);
    if ((j + sx + w) % 2 === 0) set(c, sx + w, j, [36, 52, 36], 38);
  }
}
function blit(dst, src, x, y) {
  for (let j = 0; j < src.h; j++) {
    for (let i = 0; i < src.w; i++) {
      const si = (j * src.w + i) * 4;
      const a = src.d[si + 3];
      if (a) set(dst, x + i, y + j, [src.d[si], src.d[si + 1], src.d[si + 2]], a);
    }
  }
}
function autoOutline(c) {
  const solid = (x, y) =>
    x >= 0 && y >= 0 && x < c.w && y < c.h && c.d[(y * c.w + x) * 4 + 3] > 128;
  const marks = [];
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      if (c.d[(y * c.w + x) * 4 + 3] !== 0) continue;
      if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))
        marks.push([x, y]);
    }
  }
  for (const [x, y] of marks) set(c, x, y, K.ink);
}

// ---------- kit houses ("Medieval town" by keith karnage, CC-BY 3.0) ----------
let kitRaw = null;
async function kitPiece(x, y, w, h, hue = 0, sat = 1, bright = 1) {
  if (!kitRaw) {
    const { data, info } = await sharp(KIT).raw().toBuffer({ resolveWithObject: true });
    kitRaw = { data, info };
  }
  const buf = Buffer.alloc(w * h * 4);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const si = ((y + j) * kitRaw.info.width + (x + i)) * 4;
      const di = (j * w + i) * 4;
      buf[di] = kitRaw.data[si];
      buf[di + 1] = kitRaw.data[si + 1];
      buf[di + 2] = kitRaw.data[si + 2];
      buf[di + 3] = kitRaw.data[si + 3];
    }
  }
  if (hue || sat !== 1 || bright !== 1)
    return await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
      .modulate({ hue, saturation: sat, brightness: bright })
      .raw()
      .toBuffer();
  return buf;
}
function rawBlit(c, buf, w, x, y) {
  const h = buf.length / (w * 4);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const si = (j * w + i) * 4;
      if (buf[si + 3] === 0) continue;
      set(c, x + i, y + j, [buf[si], buf[si + 1], buf[si + 2]], buf[si + 3]);
    }
  }
}
function rawTile(c, buf, w, x, y, clipW) {
  const h = buf.length / (w * 4);
  for (let j = 0; j < h; j++) {
    for (let rep = 0; ; rep++) {
      for (let i = 0; i < w; i++) {
        const dx = x + rep * w + i;
        if (dx >= x + clipW) break;
        const si = (j * w + i) * 4;
        if (buf[si + 3] === 0) continue;
        set(c, dx, y + j, [buf[si], buf[si + 1], buf[si + 2]], buf[si + 3]);
      }
      if ((rep + 1) * w >= clipW) break;
    }
  }
}

// house canvas 176x148, ground line at y124 (facade top pins base to the road)
const HOUSE_W = 176;
const HOUSE_H = 148;

// roof tones matched to the reference sheet palette
const TONES = {
  red: { base: [178, 60, 50], dark: [140, 44, 36], light: [204, 92, 76] },
  slate: { base: [96, 116, 148], dark: [70, 88, 118], light: [128, 148, 178] },
  brown: { base: [128, 92, 56], dark: [96, 66, 38], light: [156, 118, 80] },
  green: { base: [70, 100, 74], dark: [52, 78, 56], light: [92, 126, 96] },
  navy: { base: [72, 84, 116], dark: [54, 62, 90], light: [96, 110, 144] },
  orange: { base: [178, 96, 48], dark: [140, 68, 32], light: [206, 128, 76] },
};

function shingleTri(c, cx, baseY, halfW, depth, t) {
  for (let y = baseY - depth; y <= baseY; y++) {
    const ins = Math.round((halfW * (y - (baseY - depth))) / depth);
    fill(c, cx - ins, y, ins * 2 + 1, 1, t.base);
  }
  let ci = 0;
  for (let y = baseY - depth; y <= baseY; y += 3, ci++) {
    const ins = Math.round((halfW * (y - (baseY - depth))) / depth);
    fill(c, cx - ins, y, ins * 2 + 1, 1, ci === 0 ? t.light : t.base);
    fill(c, cx - ins, Math.min(y + 2, baseY), ins * 2 + 1, 1, t.dark);
    const off = ci % 2 ? 2 : 0;
    for (let tx = cx - ins + off; tx <= cx + ins - off; tx += 5)
      fill(c, tx, y, 1, 2, t.dark);
  }
}

function chimneyPiece(c, x, y, smoke) {
  fill(c, x, y, 12, 20, [150, 84, 60]);
  fill(c, x, y + 4, 12, 2, [118, 62, 44]);
  fill(c, x, y + 12, 12, 2, [118, 62, 44]);
  frame(c, x, y, 12, 20, K.ink);
  fill(c, x - 1, y - 2, 14, 3, [92, 52, 38]);
  fill(c, x + 1, y - 4, 10, 2, K.ink);
  if (smoke) {
    set(c, x + 5, y - 7, K.white, 150);
    set(c, x + 7, y - 11, K.white, 110);
    set(c, x + 4, y - 15, K.white, 80);
  }
}

function balconyRail(c, y) {
  fill(c, 12, y, 152, 3, K.wood);
  frame(c, 12, y, 152, 3, K.brown);
  for (let x = 18; x < 158; x += 14) fill(c, x, y + 3, 2, 9, K.wood);
  for (let x = 20; x < 156; x += 12) {
    fill(c, x, y + 3, 8, 4, K.wood);
    set(c, x + 1, y + 3, K.pink);
    set(c, x + 3, y + 3, K.yellow);
    set(c, x + 5, y + 3, K.pink);
  }
}

function fence(c, x, y, w) {
  for (let px = x; px <= x + w; px += 11) {
    fill(c, px, y, 2, 14, K.wood);
    set(c, px, y, K.brown);
  }
  fill(c, x, y + 3, w + 2, 2, K.wood);
  fill(c, x, y + 8, w + 2, 2, K.wood);
  for (let px = x + 3; px < x + w; px += 11) set(c, px, y + 3, K.brown);
}

function pine(w, h) {
  const c = canvas(w, h);
  const cx = Math.floor(w / 2);
  const dk = [58, 100, 66];
  const lt = [84, 132, 88];
  const tier = (y, halfW, hgt) => {
    for (let j = 0; j < hgt; j++) {
      const ins = Math.round(halfW * (1 - j / hgt));
      fill(c, cx - ins, y + j, ins * 2 + 1, 1, dk);
      fill(c, cx - ins, y + j, Math.max(1, Math.floor(ins / 2)), 1, lt);
    }
  };
  contactShadow(c, Math.floor(cx - 5), h - 6, 10, 4, 55);
  fill(c, cx - 3, h - 14, 6, 12, [110, 76, 48]);
  autoOutline(c);
  const t1 = Math.floor(h * 0.04);
  const t2 = Math.floor(h * 0.22);
  const t3 = Math.floor(h * 0.44);
  tier(cx, t1, Math.floor(w * 0.32));
  tier(cx - Math.floor(w * 0.06), t2, Math.floor(w * 0.42));
  tier(cx - Math.floor(w * 0.12), t3, Math.floor(w * 0.5) + 2);
  autoOutline(c);
  return c;
}

function winX0(doorSide) {
  return doorSide === "l" ? 114 : 28;
}
function winX1(doorSide) {
  return doorSide === "l" ? 142 : 60;
}

async function kitHouse(spec) {
  const {
    hue = 0,
    sat = 1,
    bright = 1,
    roof = "slope",
    tone = null,
    dormer = false,
    chimney = false,
    smoke = false,
    balcony = false,
    doorSide = "l",
  } = spec;
  const c = canvas(HOUSE_W, HOUSE_H);
  contactShadow(c, 10, 116, 156, 26);
  const P = (x, y, w, h) => kitPiece(x, y, w, h, hue, sat, bright);
  const T = tone ? TONES[tone] : TONES.orange;

  // ---- tower: self-contained narrow keep (BookWise 图书馆塔) ----
  if (roof === "tower") {
    const bx = 64;
    const bw = 48;
    shingleTri(c, 88, 36, 30, 34, T);
    rawBlit(c, await P(484, 192, 10, 60, hue, sat), bx, 36);
    const panel = await P(230, 113, 28, 60, hue, sat);
    rawBlit(c, panel, 28, bx + 10, 36);
    rawBlit(c, await P(484, 192, 10, 24, hue, sat), bx + 38, 72);
    rawBlit(c, await P(4, 161, 20, 16, hue, sat), bx + 14, 46);
    rawBlit(c, await P(36, 160, 20, 16, hue, sat), bx + 14, 68);
    fill(c, bx, 96, bw, 26, K.stone);
    frame(c, bx, 96, bw, 26, K.ink);
    fill(c, bx + 4, 96, 2, 26, G.pathD, 120);
    fill(c, bx + 34, 96, 2, 26, G.pathD, 120);
    rawBlit(c, await P(256, 215, 32, 26), 32, bx + 8, 94);
    fill(c, 87, 0, 2, 8, K.ink);
    fill(c, 89, 0, 12, 7, K.red);
    fill(c, 89, 0, 2, 7, K.ink);
    autoOutline(c);
    return c;
  }

  // ---- standard body: wall band y58-98 + stone base y98-122 ----
  rawBlit(c, await P(484, 192, 10, 42), 10, 8, 58);
  rawBlit(c, await P(230, 113, 68, 42, hue, sat), 68, 20, 58);
  rawBlit(c, await P(230, 113, 68, 42, hue, sat), 68, 92, 58);
  rawBlit(c, await P(484, 192, 10, 42), 10, 160, 58);
  const doorX = doorSide === "l" ? 30 : 116;
  rawBlit(c, await P(256, 205, 32, 38), 32, doorX, 58);
  if (balcony) {
    balconyRail(c, 64);
    rawBlit(c, await P(4, 161, 26, 20, hue, sat), 26, winX0(doorSide), 76);
    rawBlit(c, await P(36, 160, 26, 20, hue, sat), 26, winX1(doorSide), 76);
  } else {
    rawBlit(c, await P(4, 161, 26, 20, hue, sat), 26, winX0(doorSide), 66);
    rawBlit(c, await P(36, 160, 26, 20, hue, sat), 26, winX1(doorSide), 66);
  }
  rawTile(c, await P(292, 222, 132, 24, hue, sat), 132, 8, 98, 160);

  // ---- roofs ----
  if (roof === "slope") {
    rawTile(c, await P(146, 132, 68, 52, hue, sat, bright), 68, 4, 8, 168);
    fill(c, 4, 6, 168, 3, T.dark, 255);
    fill(c, 8, 62, 160, 5, [30, 22, 16], 140);
    if (dormer) rawBlit(c, await kitPiece(66, 160, 60, 62, hue, sat, bright), 58, 8);
  } else if (roof === "gable") {
    shingleTri(c, 88, 56, 82, 48, T);
    fill(c, 2, 54, 172, 3, T.dark);
    fill(c, 4, 57, 168, 1, [30, 22, 16], 130);
  } else if (roof === "cross") {
    rawTile(c, await P(146, 132, 68, 44, hue, sat, bright), 68, 14, 14, 168);
    fill(c, 4, 14, 168, 3, T.dark);
    shingleTri(c, 88, 58, 30, 20, T);
    fill(c, 8, 56, 160, 4, [30, 22, 16], 140);
  }
  if (chimney) chimneyPiece(c, 138, 18, smoke);
  autoOutline(c);
  return c;
}

const HOUSE_SPECS = [
  { roof: "slope", tone: "red", chimney: true, smoke: true, balcony: true, doorSide: "l" }, // Amber 客栈
  { roof: "gable", tone: "slate", chimney: true, smoke: true, doorSide: "r" }, // Lettura
  { roof: "stall", doorSide: "r" }, // Pavo 市场摊位
  { roof: "tower", tone: "navy", doorSide: "r" }, // BookWise 图书馆塔
  { roof: "gable", tone: "brown", doorSide: "l" }, // Facile
  { roof: "slope", hue: 130, sat: 0.45, dormer: true, doorSide: "r" }, // Notify 深绿
  { roof: "slope", hue: 215, sat: 0.5, dormer: true, doorSide: "l" }, // Tinny 钢蓝
  { roof: "slope", hue: 355, sat: 0.6, doorSide: "r" }, // BlueRobin 红
];
const HOUSE_FILES = [
  "awning.png",
  "chimney.png",
  "stall.png",
  "flat.png",
  "shutter.png",
  "shutter-b.png",
  "well.png",
  "sack.png",
];

// ---------- props ----------
function barrel() {
  const c = canvas(10, 12);
  contactShadow(c, 0, 0, 8, 9, 55);
  fill(c, 2, 1, 6, 9, K.wood);
  fill(c, 1, 2, 8, 1, K.wood);
  fill(c, 1, 8, 8, 1, K.wood);
  fill(c, 2, 4, 6, 1, K.brownD);
  fill(c, 2, 7, 6, 1, K.brownD);
  fill(c, 4, 1, 1, 9, R_brown_light());
  autoOutline(c);
  return c;
}
function R_brown_light() {
  return [178, 122, 76];
}

// ---------- street lamp ----------
const LW = 12;
const LH = 24;
function lamp() {
  const c = canvas(LW, LH);
  contactShadow(c, 2, 19, 8, 3, 60);
  fill(c, 5, 8, 2, 13, [70, 72, 80]);
  fill(c, 5, 8, 1, 13, [98, 100, 108]);
  fill(c, 3, 20, 6, 2, [70, 72, 80]);
  fill(c, 2, 22, 8, 1, [50, 52, 60]);
  frame(c, 2, 21, 8, 2, K.ink);
  fill(c, 3, 2, 6, 5, K.yellow);
  set(c, 4, 3, K.white);
  frame(c, 2, 1, 8, 7, K.ink);
  fill(c, 4, 0, 4, 1, K.ink);
  set(c, 5, 8, K.ink);
  set(c, 6, 8, K.ink);
  return c;
}

await save(ground(), "ground.png", 4);
for (let i = 0; i < HOUSE_FILES.length; i++) {
  const c = await kitHouse(HOUSE_SPECS[i]);
  await save(c, HOUSE_FILES[i], 1);
}
await save(lamp(), "lamp.png", 4);
await save(barrel(), "barrel.png", 4);
console.log("wrote", out);
