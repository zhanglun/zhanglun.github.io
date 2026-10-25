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
