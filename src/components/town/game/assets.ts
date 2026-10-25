// 素材规格与索引表 —— 小镇统一使用 Mystic Woods 免费版（itch.io，Game Endeavor）
// 许可：非商业项目可用、可修改、禁止再分发（非商业学习用途，声明见 public/town/ASSETS.md）
// 缺失的内容（房子/作物/道具/特效）由运行时程序化生成补齐，色调与 Mystic 对齐。

export const TILE = 16;

export interface SheetDef {
  key: string;
  file: string;
  frameWidth: number;
  frameHeight: number;
}

export const SHEETS: SheetDef[] = [
  { key: "mystic-grass", file: "mystic/grass.png", frameWidth: 16, frameHeight: 16 },
  { key: "mystic-plains", file: "mystic/plains.png", frameWidth: 16, frameHeight: 16 },
  { key: "mystic-decor", file: "mystic/decor.png", frameWidth: 16, frameHeight: 16 },
  { key: "mystic-fences", file: "mystic/fences.png", frameWidth: 16, frameHeight: 16 },
  { key: "mystic-wooden", file: "mystic/wooden_floor.png", frameWidth: 16, frameHeight: 16 },
  { key: "mystic-walls", file: "mystic/walls.png", frameWidth: 16, frameHeight: 16 },
  { key: "mystic-door", file: "mystic/door.png", frameWidth: 16, frameHeight: 16 },
  { key: "mystic-player", file: "mystic/player.png", frameWidth: 48, frameHeight: 48 },
  { key: "mystic-slime", file: "mystic/slime.png", frameWidth: 16, frameHeight: 16 },
  { key: "mystic-dust", file: "mystic/dust.png", frameWidth: 16, frameHeight: 12 },
];

// plains.png 6 列。悬崖区（row5-8）用于程序化拼装小屋，泥补丁中心（row2 col2）为纯泥。
export const GROUND = {
  grassFrame: 0, // mystic-grass 单格（程序化变体叠加）
  dirtFrame: 14, // plains (col2,row2) 大泥补丁中心纯泥
} as const;

// 悬崖格（plains）：拼装 Mystic 风格小屋的墙体/屋顶
export const CLIFF = {
  topRun: [31, 32, 33, 34], // row5 col1-4：草顶
  wallRun: [37, 38, 39, 40], // row6 col1-4：土壁
} as const;

// Mystic decor row4 = 透明小草丛（4 变体）
export const DECOR = [24, 25, 26, 27] as const;

// Mystic fences（4 列）
export const FENCE = {
  post: 1, // (col0,row1) 竖向栅栏
  rail: 5, // (col1,row1) 横排栅栏
} as const;

// ---- Mystic player.png（6 列 48px 单元）----
// 行 0-2 = 三向待机（4 帧），行 3-5 = 三向行走（6 帧），行 6-8 = 三向挥斧（4 帧）
export const PLAYER48 = {
  sheet: "mystic-player",
  idle: {
    down: [0, 1, 2, 3],
    side: [6, 7, 8, 9],
    up: [12, 13, 14, 15],
  },
  walk: {
    down: [18, 19, 20, 21, 22, 23],
    side: [24, 25, 26, 27, 28, 29],
    up: [30, 31, 32, 33, 34, 35],
  },
  axe: {
    down: [36, 37, 38, 39],
    side: [42, 43, 44, 45],
    up: [48, 49, 50, 51],
  },
} as const;

// ---- Mystic slime.png（14 列 16px），行 0 = 待机 4 帧 ----
export const SLIME = {
  sheet: "mystic-slime",
  idle: [0, 1, 2, 3],
} as const;

// ---- 地面纹理变体（运行时程序化生成）----
// baseColor 取自 grass/plains 的基准色；kind 决定噪点形态（草叶/犁纹）
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
        ctx.fillRect((v * 11 + i * 5) % 14, (v * 19 + i * 7) % 15, 2 + (i % 2), 1);
      } else {
        ctx.fillRect((v * 37 + i * 13) % 16, (v * 23 + i * 7) % 16, 1, i % 3 === 0 ? 2 : 1);
      }
    }
    out.push(cv);
  }
  return out;
}

// ---- 程序化纹理（构建期生成静态 PNG，见 scripts 内 gen 注释）----
export const GEN_IMAGES = [
  "gen-tree",
  "gen-grass-tuft",
  "gen-rock",
  "gen-sign-board",
  "gen-house-blog",
  "gen-house-projects",
  "gen-house-about",
  "gen-house-cafe",
  "gen-house-home",
  "gen-crate",
  "gen-barrel",
  "gen-crop-0",
  "gen-crop-1",
  "gen-crop-2",
  "gen-tilled",
  "gen-star",
] as const;

// ---- 作物（程序化生成，Mystic 色板）----
export const CROP_STAGES = 3;
export const CROP_KEYS = ["carrot"] as const;
