// 小镇世界数据：程序化生成地面与碰撞，建筑/装饰/NPC 全部数据驱动。
// 坐标一律为 tile 格；像素坐标在场景里 × TILE。
// 小屋为程序化拼装（Mystic 悬崖/木门 tile），decor 为 Mystic 透明草丛。

import { FENCE, CLIFF } from "./assets";

export const WORLD_W = 64;
export const WORLD_H = 40;

export interface BuildingDef {
  id: string;
  name: string;
  blurb: string;
  link?: { label: string; href: string };
  tx: number; // 左上
  ty: number;
  w: number; // 占格（含屋顶）
  h: number;
  roofTint?: number; // 屋顶草色微调，区分不同建筑
  interior: InteriorDef;
}

export interface InteriorDef {
  w: number;
  h: number;
  furniture: { img: "crate" | "barrel"; x: number; y: number }[];
  sign: { x: number; y: number; text: string };
  npc?: { name: string; text: string };
}

export interface PropDef {
  image?: string; // 程序化生成的独立纹理 key（tree/grass-tuft/rock/sign）
  sheet?: string; // 或 Mystic sheet key
  frame?: number;
  tx: number;
  ty: number;
  cols?: number;
  rows?: number;
  solid?: boolean;
  chop?: boolean; // 可砍伐（得能量）
}

export interface NpcDef {
  name: string;
  tx: number;
  ty: number;
  tint?: number; // 史莱姆着色，区分不同 NPC
  lines: string[];
}

// 稳定伪随机（同一种子每次生成同一张镇子）
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const buildings: BuildingDef[] = [
  {
    id: "blog",
    name: "书屋",
    blurb: "镇上最安静的地方，架子上全是写给以后翻看的文字。",
    link: { label: "去读文章", href: "/blog" },
    tx: 8,
    ty: 7,
    w: 4,
    h: 3,
    interior: {
      w: 13,
      h: 9,
      furniture: [
        { img: "crate", x: 2, y: 2 },
        { img: "barrel", x: 3, y: 2 },
        { img: "crate", x: 9, y: 2 },
        { img: "crate", x: 6, y: 4 },
        { img: "barrel", x: 6, y: 5 },
      ],
      sign: { x: 6, y: 2, text: "「写作是把记忆存进镇子的档案室。」" },
    },
  },
  {
    id: "projects",
    name: "工坊",
    blurb: "锯木声不停的地方，桌上摆着做到一半的各式玩意儿。",
    link: { label: "去看项目", href: "/projects" },
    tx: 47,
    ty: 6,
    w: 4,
    h: 3,
    interior: {
      w: 13,
      h: 9,
      furniture: [
        { img: "crate", x: 3, y: 2 },
        { img: "barrel", x: 4, y: 2 },
        { img: "crate", x: 9, y: 2 },
        { img: "barrel", x: 10, y: 2 },
        { img: "crate", x: 10, y: 4 },
      ],
      sign: { x: 6, y: 2, text: "「慢工出细活，做一件是一件。」" },
    },
  },
  {
    id: "about",
    name: "邮局",
    blurb: "全镇的信都从这里进出，也收寄站长的自我介绍。",
    link: { label: "认识站长", href: "/about" },
    tx: 28,
    ty: 27,
    w: 3,
    h: 3,
    interior: {
      w: 13,
      h: 9,
      furniture: [
        { img: "crate", x: 5, y: 2 },
        { img: "barrel", x: 5, y: 3 },
        { img: "crate", x: 2, y: 2 },
        { img: "barrel", x: 10, y: 2 },
      ],
      sign: { x: 8, y: 2, text: "「每一封信都会到，只是有的走得慢。」" },
    },
  },
  {
    id: "cafe",
    name: "咖啡馆",
    blurb: "铲子和水壶靠在门口，老板收胡萝卜，也收故事。",
    tx: 44,
    ty: 26,
    w: 6,
    h: 4,
    interior: {
      w: 13,
      h: 9,
      furniture: [
        { img: "crate", x: 3, y: 2 },
        { img: "crate", x: 4, y: 2 },
        { img: "crate", x: 5, y: 2 },
        { img: "barrel", x: 9, y: 4 },
        { img: "barrel", x: 9, y: 5 },
        { img: "barrel", x: 10, y: 2 },
      ],
      sign: { x: 6, y: 2, text: "「今日特供：烤胡萝卜浓汤。」" },
      npc: { name: "老板", text: "carrot-quest" },
    },
  },
  {
    id: "home",
    name: "小屋",
    blurb: "站长的小屋。炉子上的水总是温着的。",
    tx: 7,
    ty: 27,
    w: 4,
    h: 3,
    interior: {
      w: 11,
      h: 8,
      furniture: [
        { img: "crate", x: 2, y: 2 },
        { img: "crate", x: 5, y: 3 },
        { img: "barrel", x: 8, y: 2 },
      ],
      sign: { x: 5, y: 2, text: "「欢迎回家。进度都存在这台旧柜子里。」" },
    },
  },
];

// 门格：底行中央；玩家踩门前格（自动）或按 E 进入
export function doorOf(b: BuildingDef) {
  return { x: b.tx + Math.floor(b.w / 2), y: b.ty + b.h - 1 };
}

// 建筑实体墙（底部约 40% 高度不可穿）
export function solidRowsOf(b: BuildingDef) {
  return Math.max(1, Math.round(b.h * 0.4));
}

// ---- 地面生成 ----
export const enum Ground {
  GRASS = 0,
  DIRT = 1,
  TILLED = 2,
}

export function buildGround(): Uint8Array {
  const g = new Uint8Array(WORLD_W * WORLD_H);
  const set = (x: number, y: number, v: number) => {
    if (x >= 0 && y >= 0 && x < WORLD_W && y < WORLD_H) g[y * WORLD_W + x] = v;
  };
  // 主路：横街 y 20-21，竖街 x 30-31
  for (let x = 1; x < WORLD_W - 1; x++) {
    set(x, 20, Ground.DIRT);
    set(x, 21, Ground.DIRT);
  }
  for (let y = 2; y < WORLD_H - 2; y++) {
    set(30, y, Ground.DIRT);
    set(31, y, Ground.DIRT);
  }
  // 中央广场
  for (let y = 16; y <= 25; y++)
    for (let x = 25; x <= 37; x++) set(x, y, Ground.DIRT);
  // 建筑门前小径
  for (const b of buildings) {
    const d = doorOf(b);
    for (let y = d.y + 1; y <= (b.ty < 20 ? 19 : d.y + 1); y++) set(d.x, y, Ground.DIRT);
  }
  // 农田区松土底
  for (let y = 31; y <= 36; y++)
    for (let x = 15; x <= 26; x++) if ((x + y) % 7 !== 0) set(x, y, Ground.DIRT);
  return g;
}

// ---- 装饰与碰撞 ----
export function buildProps(): PropDef[] {
  const props: PropDef[] = [];
  const rnd = mulberry32(67556832);
  const taken = new Set<string>();
  const occupy = (x: number, y: number, w: number, h: number) => {
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) taken.add(`${x + i},${y + j}`);
  };
  for (const b of buildings) occupy(b.tx, b.ty, b.w, b.h);
  for (let x = 0; x < WORLD_W; x++) {
    taken.add(`${x},20`);
    taken.add(`${x},21`);
  }
  for (let y = 0; y < WORLD_H; y++) {
    taken.add(`30,${y}`);
    taken.add(`31,${y}`);
  }
  for (let y = 16; y <= 25; y++)
    for (let x = 25; x <= 37; x++) taken.add(`${x},${y}`);
  for (let y = 31; y <= 36; y++)
    for (let x = 15; x <= 26; x++) taken.add(`${x},${y}`);
  // 通路缓冲带
  for (let y = 19; y <= 22; y++)
    for (let x = 1; x < WORLD_W - 1; x++) taken.add(`${x},${y}`);
  for (let x = 29; x <= 32; x++)
    for (let y = 2; y <= WORLD_H - 3; y++) taken.add(`${x},${y}`);
  for (let y = 16; y <= 25; y++)
    for (let x = 25; x <= 37; x++) taken.add(`${x},${y}`);
  for (const b of buildings) {
    const d = doorOf(b);
    for (let y = d.y + 1; y <= d.y + 5; y++)
      for (let x = d.x - 1; x <= d.x + 1; x++) taken.add(`${x},${y}`);
  }

  const free = (x: number, y: number) =>
    x >= 1 && y >= 1 && x < WORLD_W - 1 && y < WORLD_H - 1 && !taken.has(`${x},${y}`);

  // 边界树（程序化树 2x3，碰撞底行）
  for (let x = 0; x < WORLD_W; x += 2) {
    for (const y of [0, WORLD_H - 3]) {
      if (rnd() < 0.8)
        props.push({ image: "gen-tree", tx: x, ty: y, cols: 2, rows: 3, solid: true });
    }
  }
  for (let y = 1; y < WORLD_H - 3; y += 2) {
    for (const x of [0, WORLD_W - 2]) {
      if (rnd() < 0.8)
        props.push({ image: "gen-tree", tx: x, ty: y, cols: 2, rows: 3, solid: true });
    }
  }
  // 内部散树/灌木/草丛
  for (let i = 0; i < 150; i++) {
    const x = 1 + ((rnd() * (WORLD_W - 2)) | 0);
    const y = 1 + ((rnd() * (WORLD_H - 4)) | 0);
    if (!free(x, y) || !free(x, y + 1) || !free(x, y + 2)) continue;
    const r = rnd();
    if (r < 0.5) {
      props.push({ image: "gen-tree", tx: x, ty: y, cols: 2, rows: 3, solid: true, chop: true });
      occupy(x, y, 2, 3);
    } else if (r < 0.75) {
      props.push({ image: "gen-grass-tuft", tx: x, ty: y, cols: 2, rows: 1, chop: true });
      occupy(x, y, 2, 1);
    } else {
      props.push({ image: "gen-rock", tx: x, ty: y, cols: 1, rows: 1, solid: true });
      occupy(x, y, 1, 1);
    }
  }
  // 农田栅栏（北面开口）
  for (let x = 14; x <= 27; x++) {
    if (x === 20 || x === 21) continue;
    props.push({ sheet: "mystic-fences", frame: FENCE.rail, tx: x, ty: 30, solid: true });
    taken.add(`${x},30`);
  }
  for (const y of [31, 32, 33, 34, 35, 36]) {
    props.push({ sheet: "mystic-fences", frame: FENCE.post, tx: 14, ty: y, solid: true });
    props.push({ sheet: "mystic-fences", frame: FENCE.post, tx: 27, ty: y, solid: true });
    taken.add(`14,${y}`);
    taken.add(`27,${y}`);
  }
  // 广场告示牌 + 点缀
  props.push({ image: "gen-sign-board", tx: 33, ty: 17, solid: true });
  props.push({ image: "gen-rock", tx: 27, ty: 23, solid: true });
  props.push({ image: "gen-grass-tuft", tx: 35, ty: 23 });
  // 广场路标
  props.push({ image: "gen-sign-board", tx: 25, ty: 22, solid: true });
  // 岩石点缀
  props.push({ image: "gen-rock", tx: 22, ty: 17, solid: true });
  props.push({ image: "gen-rock", tx: 40, ty: 22, solid: true });
  props.push({ image: "gen-rock", tx: 17, ty: 24, solid: true });
  // 草丛点缀
  for (let i = 0; i < 60; i++) {
    const x = 1 + ((rnd() * (WORLD_W - 2)) | 0);
    const y = 1 + ((rnd() * (WORLD_H - 2)) | 0);
    if (!free(x, y)) continue;
    props.push({ image: "gen-grass-tuft", tx: x, ty: y });
  }
  return props;
}

export const npcDefs: NpcDef[] = [
  {
    name: "镇长史莱姆",
    tx: 33,
    ty: 22,
    tint: 0x7ec8e3,
    lines: [
      "欢迎来到小圆镇！靠南边的田可以随便种。",
      "锄头开地，种子下地，等一等就有收成。",
      "收获的胡萝卜…咖啡馆老板可稀罕了。",
    ],
  },
  {
    name: "花姨史莱姆",
    tx: 13,
    ty: 15,
    tint: 0xc39bd3,
    lines: ["书屋今早刚开张，架子还热乎着。", "晚上镇子会点灯，别玩太晚呀。"],
  },
  {
    name: "邮差史莱姆",
    tx: 44,
    ty: 13,
    tint: 0x82e0aa,
    lines: ["工坊那小子又熬了个通宵。", "邮局的信，风里雨里都会送到。"],
  },
];

// 咖啡馆任务：交付 3 根胡萝卜
export const QUEST = { id: "carrot", need: 3, reward: 10 };
