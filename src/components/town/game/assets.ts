// 素材规格与索引表 —— /town v5:Serene Village revamped (LimeZu, CC-BY 4.0)
// 世界图块/建筑/物件来自 SV;村民来自 Modern Interiors Free(LimeZu,仅非商业);
// 史莱姆(玩家/宠物)与室内墙面程序化生成,本站原创,无授权限制。
// 出处与许可详见 public/town/ASSETS.md,裁切脚本 scripts/extract-town-sv.mjs。

export const TILE = 16;

// 独立 PNG(public/town/sv/、public/town/gen/),键 = 纹理键
export const IMAGES = [
  "sv-house-blog",
  "sv-house-projects",
  "sv-house-about",
  "sv-house-cafe",
  "sv-house-home",
  "sv-tree-teal",
  "sv-tree-dark",
  "sv-tree-round",
  "sv-rock-small",
  "sv-rock-big",
  "sv-grove",
  "sv-flower-pink",
  "sv-flower-yellow",
  "sv-flower-white",
  "sv-sign-board",
  "sv-sign-arrow",
  "sv-sign-post",
  "sv-grass",
  "sv-dirt",
  "sv-door",
  "gen-crate",
  "gen-barrel",
] as const;

// 精灵表(public/town/):村民 idle 呼吸动画 16x32 × 24 帧 = 6f × [下/上/左/右];
// 史莱姆 16x16 × 4 帧;篝火 16x16 × 4 帧
export interface SheetDef {
  key: string;
  file: string;
  frameWidth: number;
  frameHeight: number;
}

export const SHEETS: SheetDef[] = [
  { key: "gen-slime", file: "gen/slime.png", frameWidth: 16, frameHeight: 16 },
  {
    key: "char-amelia",
    file: "char/amelia_idle.png",
    frameWidth: 16,
    frameHeight: 32,
  },
  {
    key: "char-bob",
    file: "char/bob_idle.png",
    frameWidth: 16,
    frameHeight: 32,
  },
  {
    key: "char-adam",
    file: "char/adam_idle.png",
    frameWidth: 16,
    frameHeight: 32,
  },
  {
    key: "char-alex",
    file: "char/alex_idle.png",
    frameWidth: 16,
    frameHeight: 32,
  },
  {
    key: "sv-campfire",
    file: "sv/campfire.png",
    frameWidth: 16,
    frameHeight: 16,
  },
];

// 村民(室外 NPC 与室内老板共用;待机用朝下前 6 帧)
export const VILLAGERS = ["amelia", "bob", "adam", "alex"] as const;
export type VillagerKey = (typeof VILLAGERS)[number];

export const IDLE_FRAMES = 6; // 每方向帧数
export const CAMPFIRE_FRAMES = 4;

// 史莱姆(gen/slime.png 64x16 = 4 帧静息呼吸,玩家/宠物共用)
export const SLIME_FRAMES = 4;

// ---- 地面纹理变体(运行时程序化生成)----
// baseColor 取自 sv-grass / sv-dirt 的基准色;kind 决定噪点形态
export function buildGroundVariants(
  baseColor: [number, number, number],
  kind: "grass" | "dirt"
): HTMLCanvasElement[] {
  const out: HTMLCanvasElement[] = [];
  const [br, bg, bb] = baseColor;
  for (let v = 0; v < 4; v++) {
    const cv = document.createElement("canvas");
    cv.width = 16;
    cv.height = 16;
    const ctx = cv.getContext("2d")!;
    ctx.fillStyle = `rgb(${br},${bg},${bb})`;
    ctx.fillRect(0, 0, 16, 16);
    const dark =
      kind === "grass"
        ? `rgb(${Math.max(0, br - 24)},${Math.max(0, bg - 28)},${Math.max(0, bb - 18)})`
        : `rgb(${Math.max(0, br - 34)},${Math.max(0, bg - 30)},${Math.max(0, bb - 24)})`;
    const light =
      kind === "grass"
        ? `rgb(${Math.min(255, br + 14)},${Math.min(255, bg + 18)},${Math.min(255, bb + 10)})`
        : `rgb(${Math.min(255, br + 20)},${Math.min(255, bg + 16)},${Math.min(255, bb + 12)})`;
    const count = 5 + v * 2;
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = i % 2 === 0 ? dark : light;
      if (kind === "dirt") {
        ctx.fillRect(
          (v * 11 + i * 5) % 14,
          (v * 19 + i * 7) % 15,
          2 + (i % 2),
          1
        );
      } else {
        ctx.fillRect(
          (v * 37 + i * 13) % 16,
          (v * 23 + i * 7) % 16,
          1,
          i % 3 === 0 ? 2 : 1
        );
      }
    }
    out.push(cv);
  }
  return out;
}

// ---- 路径贴片(运行时程序化生成,SV 式不规则方齿草缘)----
// 16x16 共 16 张,索引位:N=1 E=2 S=4 W=8,置位 = 该侧邻接草地。
// 画法:泥底(带噪点)→ 对每处草侧盖 4px 深的方齿草缘(2px 步进,
// 齿深 3/4 交替)→ 齿根压 1px 深绿阴影线;对角草(仅斜角相邻)在角上
// 补 5x5 草色缺角。与 SV 源贴片的波浪方齿缘同构。
export function buildPathTiles(
  grass: [number, number, number],
  dirt: [number, number, number]
): HTMLCanvasElement[] {
  const [gr, gg, gb] = grass;
  const [dr, dg, db] = dirt;
  const grassCss = `rgb(${gr},${gg},${gb})`;
  const grassDark = `rgb(${Math.max(0, gr - 30)},${Math.max(0, gg - 34)},${Math.max(0, gb - 22)})`;
  const dirtCss = `rgb(${dr},${dg},${db})`;
  const dirtLight = `rgb(${Math.min(255, dr + 20)},${Math.min(255, dg + 16)},${Math.min(255, db + 12)})`;

  const tiles: HTMLCanvasElement[] = [];
  for (let mask = 0; mask < 16; mask++) {
    const cv = document.createElement("canvas");
    cv.width = 16;
    cv.height = 16;
    const ctx = cv.getContext("2d")!;
    // 泥底 + 噪点
    ctx.fillStyle = dirtCss;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = dirtLight;
    for (let i = 0; i < 6; i++)
      ctx.fillRect((mask * 7 + i * 5) % 14, (mask * 13 + i * 7) % 15, 2, 1);
    const has = (bit: number) => (mask & bit) !== 0;
    // 方齿草缘:沿边 2px 步进,齿深 3/4 交替,齿根 1px 深绿
    const fringe = (side: "n" | "s" | "w" | "e") => {
      for (let i = 0; i < 8; i++) {
        const depth = i % 2 === 0 ? 4 : 3;
        ctx.fillStyle = grassCss;
        if (side === "n") ctx.fillRect(i * 2, 0, 2, depth);
        if (side === "s") ctx.fillRect(i * 2, 16 - depth, 2, depth);
        if (side === "w") ctx.fillRect(0, i * 2, depth, 2);
        if (side === "e") ctx.fillRect(16 - depth, i * 2, depth, 2);
        ctx.fillStyle = grassDark;
        if (side === "n") ctx.fillRect(i * 2, depth, 2, 1);
        if (side === "s") ctx.fillRect(i * 2, 15 - depth, 2, 1);
        if (side === "w") ctx.fillRect(depth, i * 2, 1, 2);
        if (side === "e") ctx.fillRect(15 - depth, i * 2, 1, 2);
      }
    };
    if (has(1)) fringe("n");
    if (has(4)) fringe("s");
    if (has(8)) fringe("w");
    if (has(2)) fringe("e");
    // 对角草缺角(两侧都是泥、仅斜角是草):角上 5x5 草块
    const diag = (cx: 0 | 15, cy: 0 | 15) => {
      ctx.fillStyle = grassCss;
      ctx.fillRect(cx === 0 ? 0 : 11, cy === 0 ? 0 : 11, 5, 5);
      ctx.fillStyle = grassDark;
      ctx.fillRect(cx === 0 ? 0 : 11, cy === 0 ? 5 : 10, 5, 1);
      ctx.fillRect(cx === 0 ? 5 : 10, cy === 0 ? 0 : 11, 1, 5);
    };
    if (!has(1) && !has(8) && mask & 16) diag(0, 0);
    tiles.push(cv);
  }
  return tiles;
}

// ---- 门口门牌(程序化,SV 木色)----
// 12x15:木柱 + 挂牌,牌面两道刻痕示意文字。
export function buildNameplate(): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = 12;
  cv.height = 15;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#5f4126"; // 柱
  ctx.fillRect(5, 4, 2, 11);
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(5, 4, 1, 11);
  ctx.fillStyle = "#b98a56"; // 牌
  ctx.fillRect(1, 1, 10, 7);
  ctx.fillStyle = "#5f4126";
  ctx.fillRect(1, 1, 10, 1);
  ctx.fillRect(1, 7, 10, 1);
  ctx.fillRect(1, 1, 1, 7);
  ctx.fillRect(10, 1, 1, 7);
  ctx.fillStyle = "#7a5533"; // 刻痕文字
  ctx.fillRect(3, 3, 6, 1);
  ctx.fillRect(3, 5, 4, 1);
  return cv;
}

// ---- 室内家具(程序化,SV 木色;16 宽,原点底部居中)----
export type FurnKind =
  | "bookshelf"
  | "workbench"
  | "counter"
  | "stove"
  | "bed"
  | "mailrack"
  | "table";

export const FURN_KINDS: FurnKind[] = [
  "bookshelf",
  "workbench",
  "counter",
  "stove",
  "bed",
  "mailrack",
  "table",
];

export function buildFurniture(kind: FurnKind): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  const ctx = cv.getContext("2d")!;
  const WOOD = "#9c6b3f";
  const DARK = "#5f4126";
  const LIGHT = "#b98a56";
  const CLOTH = "#d8d3c0";
  if (kind === "bookshelf") {
    cv.width = 16;
    cv.height = 24;
    ctx.fillStyle = DARK;
    ctx.fillRect(0, 0, 16, 24);
    ctx.fillStyle = WOOD;
    ctx.fillRect(1, 1, 14, 22);
    ctx.fillStyle = DARK;
    ctx.fillRect(1, 10, 14, 2);
    ctx.fillRect(1, 20, 14, 2);
    const books = ["#c94f42", "#e0b23e", "#5fa8c9", "#6da34f"];
    for (let s = 0; s < 2; s++)
      for (let b = 0; b < 4; b++) {
        ctx.fillStyle = books[(b + s) % 4];
        ctx.fillRect(2 + b * 3, s === 0 ? 3 : 13, 2, 7);
      }
  } else if (kind === "workbench") {
    cv.width = 16;
    cv.height = 14;
    ctx.fillStyle = LIGHT;
    ctx.fillRect(0, 2, 16, 4);
    ctx.fillStyle = DARK;
    ctx.fillRect(0, 5, 16, 1);
    ctx.fillStyle = WOOD;
    ctx.fillRect(1, 6, 2, 8);
    ctx.fillRect(13, 6, 2, 8);
    ctx.fillStyle = "#7d8a94"; // 台钳
    ctx.fillRect(11, 0, 3, 3);
  } else if (kind === "counter") {
    cv.width = 16;
    cv.height = 12;
    ctx.fillStyle = LIGHT;
    ctx.fillRect(0, 0, 16, 3);
    ctx.fillStyle = WOOD;
    ctx.fillRect(0, 3, 16, 9);
    ctx.fillStyle = DARK;
    ctx.fillRect(0, 3, 16, 1);
    ctx.fillRect(7, 4, 2, 8);
  } else if (kind === "stove") {
    cv.width = 16;
    cv.height = 16;
    ctx.fillStyle = "#8d8d84"; // 石身
    ctx.fillRect(1, 2, 14, 14);
    ctx.fillStyle = "#6f6f66";
    ctx.fillRect(1, 2, 14, 2);
    ctx.fillStyle = DARK; // 炉口
    ctx.fillRect(4, 8, 8, 7);
    ctx.fillStyle = "#e8862e"; // 火
    ctx.fillRect(5, 11, 6, 4);
    ctx.fillStyle = "#f4c542";
    ctx.fillRect(6, 12, 4, 3);
  } else if (kind === "bed") {
    cv.width = 16;
    cv.height = 26;
    ctx.fillStyle = DARK;
    ctx.fillRect(0, 0, 16, 26);
    ctx.fillStyle = WOOD;
    ctx.fillRect(1, 1, 14, 24);
    ctx.fillStyle = CLOTH; // 褥
    ctx.fillRect(2, 6, 12, 18);
    ctx.fillStyle = "#f4f1e4"; // 枕
    ctx.fillRect(3, 2, 10, 4);
    ctx.fillStyle = "#a45548"; // 被
    ctx.fillRect(2, 13, 12, 11);
    ctx.fillStyle = "#c9756a";
    ctx.fillRect(2, 13, 12, 2);
  } else if (kind === "mailrack") {
    cv.width = 16;
    cv.height = 24;
    ctx.fillStyle = DARK;
    ctx.fillRect(0, 0, 16, 24);
    ctx.fillStyle = WOOD;
    ctx.fillRect(1, 1, 14, 22);
    for (let r = 0; r < 3; r++) {
      ctx.fillStyle = DARK;
      ctx.fillRect(2, 2 + r * 7, 12, 6);
      ctx.fillStyle = CLOTH; // 信
      ctx.fillRect(3, 3 + r * 7, 4, 4);
      ctx.fillRect(9, 4 + r * 7, 4, 4);
    }
  } else {
    // table
    cv.width = 16;
    cv.height = 12;
    ctx.fillStyle = LIGHT;
    ctx.fillRect(0, 1, 16, 4);
    ctx.fillStyle = DARK;
    ctx.fillRect(0, 4, 16, 1);
    ctx.fillStyle = WOOD;
    ctx.fillRect(2, 5, 2, 7);
    ctx.fillRect(12, 5, 2, 7);
  }
  return cv;
}

// ---- 室内墙面/木地板(程序化生成,本站原创)----
// wall: 米色灰泥 + 顶部檐口线;floor: 暖木色横板缝。各 2 变体。
export function buildIndoorVariants(): {
  wall: HTMLCanvasElement[];
  floor: HTMLCanvasElement[];
} {
  const wall = (v: number): HTMLCanvasElement => {
    const cv = document.createElement("canvas");
    cv.width = 16;
    cv.height = 16;
    const ctx = cv.getContext("2d")!;
    ctx.fillStyle = "#e8c795";
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = "#c69a63"; // 顶部檐口
    ctx.fillRect(0, 0, 16, 3);
    ctx.fillStyle = "#d4ab74"; // 石膏噪点
    for (let i = 0; i < 6 + v * 2; i++)
      ctx.fillRect((v * 7 + i * 5) % 15, 4 + ((v * 3 + i * 7) % 11), 2, 1);
    ctx.fillStyle = "#a87d4e"; // 底部阴影线
    ctx.fillRect(0, 15, 16, 1);
    return cv;
  };
  const floor = (v: number): HTMLCanvasElement => {
    const cv = document.createElement("canvas");
    cv.width = 16;
    cv.height = 16;
    const ctx = cv.getContext("2d")!;
    ctx.fillStyle = "#b98a58";
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = "#9c7145"; // 横板缝
    ctx.fillRect(0, 7, 16, 1);
    ctx.fillRect(0, 15, 16, 1);
    ctx.fillStyle = "#a87d4e"; // 竖板端
    ctx.fillRect((v * 5 + 3) % 14, 0, 1, 7);
    ctx.fillRect((v * 11 + 8) % 14, 8, 1, 7);
    return cv;
  };
  return { wall: [wall(0), wall(1)], floor: [floor(0), floor(1)] };
}

// ---- 路灯(程序化,SV 木色 + 暖光灯头;16x30,原点底部居中)----
export function buildLamp(): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = 16;
  cv.height = 30;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#4a3a28"; // 灯柱
  ctx.fillRect(7, 8, 2, 22);
  ctx.fillStyle = "#6d5636";
  ctx.fillRect(7, 8, 1, 22);
  ctx.fillStyle = "#4a3a28"; // 底座
  ctx.fillRect(5, 28, 6, 2);
  ctx.fillStyle = "#5f4126"; // 灯帽
  ctx.fillRect(4, 2, 8, 2);
  ctx.fillStyle = "#3a3126"; // 灯框
  ctx.fillRect(4, 4, 8, 7);
  ctx.fillStyle = "#f4c542"; // 灯芯
  ctx.fillRect(5, 5, 6, 5);
  ctx.fillStyle = "#fff3c4";
  ctx.fillRect(6, 6, 4, 3);
  return cv;
}

// ---- 夜间光晕(硬边像素同心方,暖色;48x48)----
export function buildGlow(): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = 48;
  cv.height = 48;
  const ctx = cv.getContext("2d")!;
  // 中心在灯头(24,18):三层暖色同心方块,alpha 叠出渐层
  const rings: [number, number, number, string][] = [
    [22, 7, 0.5, 26], // [半宽, 半高, 步进, alpha]
    [16, 5, 0.5, 42],
    [10, 4, 0.5, 70],
  ];
  for (const [hw, hh, , alpha] of rings) {
    ctx.fillStyle = `rgba(244, 197, 66, ${alpha / 255})`;
    ctx.fillRect(24 - hw, 18 - hh, hw * 2, hh * 2);
  }
  ctx.fillStyle = "rgba(255, 243, 196, 0.35)";
  ctx.fillRect(24 - 5, 18 - 3, 10, 6);
  return cv;
}
