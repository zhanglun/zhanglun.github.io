// 小镇世界数据：程序化生成地面与碰撞，建筑/装饰/NPC 全部数据驱动。
// 坐标一律为 tile 格；像素坐标在场景里 × TILE。
// 建筑为 Serene Village 成品房屋 sprite（scripts/extract-town-sv.mjs 裁切），
// 散件为 SV 图块，史莱姆与室内为程序化生成。

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
  house: string; // SV 房屋纹理键
  interior: InteriorDef;
}

// ⚠️ 摆放家具时勿占用「门柱列」(w>>1) 的 y=2..4 行——那是出门通道,
// 堵住会导致进屋后无法退出(v5 实际踩坑)。
export type FurnImg =
  | "crate"
  | "barrel"
  | "bookshelf"
  | "workbench"
  | "counter"
  | "stove"
  | "bed"
  | "mailrack"
  | "table";

export interface InteriorDef {
  w: number;
  h: number;
  furniture: { img: FurnImg; x: number; y: number }[];
  motto: string; // 室内墙上格言(进门自动显示于面板副语)
  npc?: { name: string; sheet: string; text: string };
}

export interface PropDef {
  image?: string; // 独立纹理 key（sv-* / gen-*）
  sheet?: string; // 精灵表 key（篝火）
  anim?: string; // 挂载动画（campfire）
  tx: number;
  ty: number;
  cols?: number;
  rows?: number;
  solid?: boolean;
  center?: boolean; // 小件在格内居中
}

export interface NpcDef {
  name: string;
  sheet: string; // 村民精灵表 key（char-<name>）
  tx: number;
  ty: number;
  lines: string[];
}

// 稳定伪随机（同一种子每次生成同一张镇子）
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (seed >>> 14)) >>> 0) / 4294967296;
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
    house: "sv-house-blog",
    interior: {
      w: 13,
      h: 9,
      motto: "写作是把记忆存进镇子的档案室。",
      furniture: [
        { img: "bookshelf", x: 2, y: 2 },
        { img: "bookshelf", x: 3, y: 2 },
        { img: "bookshelf", x: 9, y: 2 },
        { img: "bookshelf", x: 10, y: 2 },
        { img: "table", x: 4, y: 4 },
        { img: "crate", x: 11, y: 6 },
      ],
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
    house: "sv-house-projects",
    interior: {
      w: 13,
      h: 9,
      motto: "慢工出细活，做一件是一件。",
      furniture: [
        { img: "workbench", x: 2, y: 2 },
        { img: "workbench", x: 4, y: 2 },
        { img: "crate", x: 9, y: 2 },
        { img: "crate", x: 10, y: 2 },
        { img: "barrel", x: 10, y: 4 },
        { img: "table", x: 8, y: 4 },
      ],
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
    house: "sv-house-about",
    interior: {
      w: 13,
      h: 9,
      motto: "每一封信都会到，只是有的走得慢。",
      furniture: [
        { img: "mailrack", x: 2, y: 2 },
        { img: "mailrack", x: 3, y: 2 },
        { img: "counter", x: 8, y: 2 },
        { img: "counter", x: 9, y: 2 },
        { img: "barrel", x: 11, y: 3 },
      ],
    },
  },
  {
    id: "cafe",
    name: "咖啡馆",
    blurb: "铲子和水壶靠在门口，老板守着炉子，也收故事。",
    tx: 44,
    ty: 26,
    w: 6,
    h: 4,
    house: "sv-house-cafe",
    interior: {
      w: 13,
      h: 9,
      motto: "今日特供：烤胡萝卜浓汤。",
      furniture: [
        { img: "stove", x: 2, y: 2 },
        { img: "counter", x: 3, y: 2 },
        { img: "counter", x: 4, y: 2 },
        { img: "counter", x: 5, y: 2 },
        { img: "table", x: 8, y: 4 },
        { img: "table", x: 10, y: 5 },
        { img: "barrel", x: 11, y: 2 },
      ],
      npc: {
        name: "老板阿历克斯",
        sheet: "alex",
        text: "炉上煨着汤，坐一会儿再走。",
      },
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
    house: "sv-house-home",
    interior: {
      w: 11,
      h: 8,
      motto: "欢迎回家。炉上有热水，床随你躺。",
      furniture: [
        { img: "bed", x: 2, y: 2 },
        { img: "stove", x: 8, y: 2 },
        { img: "table", x: 7, y: 4 },
        { img: "crate", x: 8, y: 5 },
      ],
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
  // 建筑门前小径:2 格宽(与房屋 sprite 底部门阶同宽),北屋一路铺到横街,
  // 南屋铺两行门阶垫
  for (const b of buildings) {
    const colA = Math.floor(b.tx + b.w / 2 - 0.5);
    const top = b.ty + b.h;
    if (top < 20) {
      for (let y = top; y <= 19; y++) {
        set(colA, y, Ground.DIRT);
        set(colA + 1, y, Ground.DIRT);
      }
    } else {
      set(colA, top, Ground.DIRT);
      set(colA + 1, top, Ground.DIRT);
      set(colA, top + 1, Ground.DIRT);
      set(colA + 1, top + 1, Ground.DIRT);
    }
  }
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
  // 通路缓冲带
  for (let y = 19; y <= 22; y++)
    for (let x = 1; x < WORLD_W - 1; x++) taken.add(`${x},${y}`);
  for (let x = 29; x <= 32; x++)
    for (let y = 2; y <= WORLD_H - 3; y++) taken.add(`${x},${y}`);
  for (const b of buildings) {
    const d = doorOf(b);
    for (let y = d.y + 1; y <= d.y + 5; y++)
      for (let x = d.x - 1; x <= d.x + 1; x++) taken.add(`${x},${y}`);
  }

  const free = (x: number, y: number) =>
    x >= 1 &&
    y >= 1 &&
    x < WORLD_W - 1 &&
    y < WORLD_H - 1 &&
    !taken.has(`${x},${y}`);

  // 三种树轮换(各自占格不同,见 assets/world 定义)
  const TREES = [
    { image: "sv-tree-teal", cols: 2, rows: 3 },
    { image: "sv-tree-dark", cols: 2, rows: 3 },
    { image: "sv-tree-round", cols: 2, rows: 2 },
  ];
  const tree = (x: number, y: number) => {
    const t = TREES[(rnd() * TREES.length) | 0];
    props.push({
      image: t.image,
      tx: x,
      ty: y,
      cols: t.cols,
      rows: t.rows,
      solid: true,
    });
    occupy(x, y, t.cols, t.rows);
  };

  // 边界树（碰撞底行）。树 sprite 高 38px、占 3 行：侧列行距必须 ≥3 行，
  // 且与顶/底行（y=0 / WORLD_H-3）同列错开，否则上下树的树冠会盖住上行树干，
  // 看起来像被截断（v5 踩坑，见 town README）。
  for (let x = 0; x < WORLD_W; x += 2) {
    for (const y of [0, WORLD_H - 3]) {
      if (rnd() < 0.8) tree(x, y);
    }
  }
  for (let y = 3; y <= WORLD_H - 6; y += 3) {
    for (const x of [0, WORLD_W - 2]) {
      if (rnd() < 0.8) tree(x, y);
    }
  }
  // 树丛(SV 设计好的四棵连体整体装饰)
  props.push({
    image: "sv-grove",
    tx: 3,
    ty: 11,
    cols: 5,
    rows: 3,
    solid: true,
  });
  props.push({
    image: "sv-grove",
    tx: 52,
    ty: 31,
    cols: 5,
    rows: 3,
    solid: true,
  });
  // 内部散树/花/石（树占 2×3 格，检查须覆盖全部占格，否则同排树会水平重叠）
  const FLOWERS = ["sv-flower-pink", "sv-flower-yellow", "sv-flower-white"];
  const ROCKS = ["sv-rock-small", "sv-rock-big"];
  const fits2x3 = (x: number, y: number) =>
    free(x, y) &&
    free(x + 1, y) &&
    free(x, y + 1) &&
    free(x + 1, y + 1) &&
    free(x, y + 2) &&
    free(x + 1, y + 2);
  for (let i = 0; i < 150; i++) {
    const x = 1 + ((rnd() * (WORLD_W - 3)) | 0);
    const y = 1 + ((rnd() * (WORLD_H - 4)) | 0);
    if (!fits2x3(x, y)) continue;
    const r = rnd();
    if (r < 0.45) {
      tree(x, y);
    } else if (r < 0.75) {
      props.push({
        image: FLOWERS[(rnd() * 3) | 0],
        tx: x,
        ty: y,
        center: true,
      });
      occupy(x, y, 1, 1);
    } else {
      const key = ROCKS[(rnd() * 3) | 0];
      const big = key !== "sv-rock-small";
      props.push({ image: key, tx: x, ty: y, solid: true, center: true });
      occupy(x, y, big ? 2 : 1, big ? 2 : 1);
    }
  }
  // 广场告示牌（木牌+石堆）、路标、篝火与围栏点缀
  props.push({
    image: "sv-sign-board",
    tx: 33,
    ty: 17,
    solid: true,
    center: true,
  });
  props.push({
    sheet: "sv-campfire",
    anim: "campfire",
    tx: 34,
    ty: 23,
    solid: true,
  });
  props.push({
    image: "sv-sign-arrow",
    tx: 27,
    ty: 23,
    solid: true,
    center: true,
  });
  props.push({
    image: "sv-sign-post",
    tx: 36,
    ty: 17,
    solid: true,
    center: true,
  });
  // 广场路标
  props.push({
    image: "sv-sign-board",
    tx: 25,
    ty: 22,
    solid: true,
    center: true,
  });
  // 岩石点缀
  props.push({
    image: "sv-rock-big",
    tx: 22,
    ty: 17,
    solid: true,
    center: true,
  });
  props.push({
    image: "sv-rock-big",
    tx: 40,
    ty: 22,
    solid: true,
    center: true,
  });
  props.push({
    image: "sv-rock-small",
    tx: 17,
    ty: 24,
    solid: true,
    center: true,
  });
  // 花草点缀
  for (let i = 0; i < 60; i++) {
    const x = 1 + ((rnd() * (WORLD_W - 2)) | 0);
    const y = 1 + ((rnd() * (WORLD_H - 2)) | 0);
    if (!free(x, y)) continue;
    props.push({
      image: FLOWERS[(rnd() * 3) | 0],
      tx: x,
      ty: y,
      center: true,
    });
  }
  return props;
}

export const npcDefs: NpcDef[] = [
  {
    name: "镇长艾米莉",
    sheet: "amelia",
    tx: 33,
    ty: 22,
    lines: [
      "欢迎来到小圆镇！这镇子就是站长的博客。",
      "书屋在东北，工坊在西北，邮局在路口。",
      "晚上广场会点起篝火，别玩太晚呀。",
    ],
  },
  {
    name: "花匠波波",
    sheet: "bob",
    tx: 13,
    ty: 15,
    lines: ["书屋今早刚开张，架子还热乎着。", "路口的野花开得正好，随便看。"],
  },
  {
    name: "邮差亚当",
    sheet: "adam",
    tx: 44,
    ty: 13,
    lines: ["工坊那小子又熬了个通宵。", "邮局的信，风里雨里都会送到。"],
  },
];
