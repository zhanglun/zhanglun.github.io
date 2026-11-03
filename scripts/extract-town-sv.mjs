#!/usr/bin/env node
// 从 Serene Village revamped (LimeZu, CC-BY 4.0) 与 Modern Interiors Free (LimeZu)
// 裁切 /town 所需素材到 public/town/。
// 来源 zip 与出处记录见 public/town/ASSETS.md。重跑幂等。
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdirSync, copyFileSync, existsSync } from "fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const here = dirname(fileURLToPath(import.meta.url));
// 源目录:优先 /tmp 暂存,回退到 ~/Downloads 的解包目录
const SV =
  ["/tmp/townpacks/stage/sv/SERENE_VILLAGE_REVAMPED", "/Users/zhanglun/Downloads/SERENE_VILLAGE_REVAMPED"].find(d =>
    existsSync(join(d, "Serene_Village_16x16.png"))
  ) ?? "/Users/zhanglun/Downloads/SERENE_VILLAGE_REVAMPED";
const MI = ["/tmp/townpacks/stage/mi/Modern tiles_Free", "/Users/zhanglun/Downloads/Modern tiles_Free"].find(d =>
  existsSync(join(d, "Characters_free/Amelia_idle_anim_16x16.png"))
) ?? "/Users/zhanglun/Downloads/Modern tiles_Free";
// XP 版(树为独立对象、2x 像素密度)直接取用户下载的包
const XP = join(SV, "RPG_MAKER_XP/Serene_Village_XP.png");
if (!existsSync(join(SV, "Serene_Village_16x16.png"))) {
  console.error(`找不到 Serene Village 解包目录: ${SV}`);
  console.error("请解包两个素材包 zip 到 /tmp/townpacks/stage/ 或 ~/Downloads/(见 ASSETS.md)");
  process.exit(1);
}
const OUT_SV = join(here, "../public/town/sv");
const OUT_CHAR = join(here, "../public/town/char");
mkdirSync(OUT_SV, { recursive: true });
mkdirSync(OUT_CHAR, { recursive: true });

const SHEET = join(SV, "Serene_Village_16x16.png");

// 连通域扫描得出的精确包围盒(见 town README 踩坑记录)
const CROPS = [
  // 五栋建筑(形状/屋顶色各自不同)
  ["house-blog", 99, 336, 56, 59], // 红顶宽身
  ["house-projects", 7, 533, 67, 54], // 绿顶宽身
  ["house-about", 2, 600, 43, 51], // 蓝顶窄身
  ["house-cafe", 166, 464, 69, 59], // 宽身高个(最大)
  ["house-home", 165, 528, 38, 60], // 绿顶窄身带烟囱
  // 树木。⚠️ 16x16 sheet 的树行是树冠融合的连绵树篱(树冠 38-76px 宽互相
  // 压叠),任何 32px 硬切都会切坏——「树被截断」的真正根因(v5 踩坑)。
  // 树全部改从 **RPG_MAKER_XP 版** y916 行取:该行 4 棵树按 64px 间距独立
  // 排布,每棵 64x76 完整;XP 像素密度 2x,缩 50% 回 16px → 32x38。
  // (三个变体全部来自 XP 版;16x16 sheet 的树行均为融合树篱,不可用。)
  { name: "tree-teal", file: XP, x: 64, y: 916, w: 64, h: 76, half: true }, // 绿单树
  { name: "tree-dark", file: XP, x: 192, y: 916, w: 64, h: 76, half: true }, // 暗青单树
  { name: "tree-round", file: XP, x: 196, y: 1000, w: 52, h: 56, half: true }, // 小圆树
  // 树丛:XP 版 y1290 起的三组融合树排是设计好的整体装饰(四棵连体),
  // 整组取用即完整;160x86 缩 50% → 80x43。
  { name: "grove", file: XP, x: 0, y: 1290, w: 160, h: 86, half: true },
  // 岩石(独立小件,均经目检;rock-pair 是石圈 autotile 的一角,已弃用)
  ["rock-small", 2, 242, 13, 12],
  ["rock-big", 3, 298, 24, 22],
  ["sign-arrow", 128, 225, 16, 15], // 小箭头路牌
  ["flower-pink", 33, 194, 14, 13],
  ["flower-yellow", 65, 194, 14, 13],
  ["flower-white", 97, 194, 14, 13],
  ["sign-board", 4, 212, 24, 28], // 木牌 + 石堆
  ["sign-post", 84, 208, 24, 15], // 一段矮木栅栏
  // 地面基准格(程序化变体的取色源)。路径草边为程序化生成
  // (buildPathTiles:SV 式不规则方齿草缘,见 assets.ts),不从 sheet 裁。
  ["grass", 64, 48, 16, 16],
  ["dirt", 96, 48, 16, 16], // 纯泥(带浅色斑点)
];

for (const crop of CROPS) {
  // 数组形式 = 从 16x16 sheet 裁切;对象形式 = 从其他文件裁切(half = 缩 50% 回 16px 密度)
  if (Array.isArray(crop)) {
    const [name, x, y, w = 16, h = 16] = crop;
    await sharp(SHEET)
      .extract({ left: x, top: y, width: w, height: h })
      .png()
      .toFile(join(OUT_SV, `${name}.png`));
  } else {
    const { name, file, x, y, w, h, half } = crop;
    let p = sharp(file).extract({ left: x, top: y, width: w, height: h });
    if (half)
      p = p.resize(Math.round(w / 2), Math.round(h / 2), { kernel: "nearest" });
    await p.png().toFile(join(OUT_SV, `${name}.png`));
  }
}
console.log(`SV: ${CROPS.length} 个裁切 → public/town/sv/`);

// 湖心岛+栈桥:主表 (40,50) 起的湖泊(青蓝水面+沙滩岸+中央草岛),
// 东侧自带一座木栈桥——一并包入(16x5 tile / 256x80),垫草底合成,
// 四缘草底与镇子草地同源同色。黑色背景键出为透明;水域碰撞由场景
// 读纹理自动标记(蓝色格),栈桥木板可走(钓鱼点)。
{
  const grass = await sharp(SHEET)
    .extract({ left: 64, top: 48, width: 16, height: 16 })
    .toBuffer();
  const grassTiles = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 14; c++)
      grassTiles.push({ input: grass, left: c * 16, top: r * 16 });
  const lakeRaw = await sharp(SHEET)
    .extract({ left: 36, top: 46, width: 224, height: 80 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const d = lakeRaw.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] + d[i + 1] + d[i + 2] < 24) d[i + 3] = 0; // 键出黑背景
  }
  const lake = await sharp(d, {
    raw: { width: 224, height: 80, channels: 4 },
  })
    .png()
    .toBuffer();
  // 左右切边草岸封盖:水带横贯整张表,任何裁宽都会切水——在左右两条
  // 切边上画「方齿草缘 + 深水线」(与 buildPathTiles 草缘同风格),
  // 湖体自然收边成独立池塘。
  const caps = [];
  const grassSample = await sharp(SHEET)
    .extract({ left: 64, top: 48, width: 1, height: 1 })
    .raw()
    .toBuffer();
  const GRASS = `rgb(${grassSample[0]},${grassSample[1]},${grassSample[2]})`;
  const GRASS_DARK = `rgb(${Math.max(0, grassSample[0] - 30)},${Math.max(0, grassSample[1] - 34)},${Math.max(0, grassSample[2] - 22)})`;
  const WATER_DARK = "rgba(20,60,110,0.55)";
  const waterAt = (x, y) => {
    const i = (y * 224 + x) * 4;
    return d[i + 3] > 8 && d[i + 2] > 140 && d[i + 2] > d[i] + 30;
  };
  for (const side of ["left", "right"]) {
    const ex = side === "left" ? 0 : 223;
    for (let row = 0; row < 5; row++) {
      let waterRows = 0;
      for (let y = row * 16; y < row * 16 + 16; y++)
        if (waterAt(ex, y)) waterRows++;
      if (waterRows < 6) continue; // 该 tile 行边缘不是水,不封
      const top = row * 16;
      // 草体:左缘铺 9px / 右缘铺 9px
      const body = Buffer.from(
        `<svg width="9" height="16"><rect x="0" y="0" width="9" height="16" fill="${GRASS}"/></svg>`
      );
      caps.push({ input: body, left: side === "left" ? 0 : 215, top });
      // 方齿草缘(齿深 3/5 交替,2px 步进)伸入水面
      for (let i = 0; i < 8; i++) {
        const depth = i % 2 === 0 ? 3 : 5;
        const y0 = top + i * 2;
        const teeth = Buffer.from(
          `<svg width="6" height="2"><rect x="0" y="0" width="6" height="2" fill="${GRASS}"/></svg>`
        );
        caps.push({
          input: teeth,
          left: side === "left" ? 9 : 224 - 9 - 6,
          top: y0,
        });
        const dark = Buffer.from(
          `<svg width="2" height="2"><rect x="0" y="0" width="2" height="2" fill="${GRASS_DARK}"/></svg>`
        );
        caps.push({
          input: dark,
          left: side === "left" ? 9 + depth : 224 - 9 - depth - 2,
          top: y0,
        });
      }
      // 深水阴影线压在齿根
      const shadow = Buffer.from(
        `<svg width="2" height="16"><rect x="0" y="0" width="2" height="16" fill="${WATER_DARK}"/></svg>`
      );
      caps.push({ input: shadow, left: side === "left" ? 9 : 224 - 11, top });
    }
  }
  await sharp({ create: { width: 224, height: 80, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([...grassTiles, { input: lake, left: 0, top: 0 }, ...caps])
    .png()
    .toFile(join(OUT_SV, "lake.png"));
  console.log("SV: lake.png 湖心岛+栈桥+草岸封盖 224x80(14x5 tile,水面自动碰撞)");
}

// 动态水面:Animated stuff 的 14 帧水波(湖面点缀/未来水景用)
copyFileSync(
  join(SV, "Animated stuff/water_waves_16x16.png"),
  join(OUT_SV, "water-waves.png")
);
console.log("SV: water-waves.png 动态水面 14 帧");

// 门(关着的第一帧)与篝火(4 帧动画)来自 Animated stuff
await sharp(join(SV, "Animated stuff/door_16x16.png"))
  .extract({ left: 0, top: 0, width: 16, height: 16 })
  .png()
  .toFile(join(OUT_SV, "door.png"));
copyFileSync(
  join(SV, "Animated stuff/campfire_16x16.png"),
  join(OUT_SV, "campfire.png")
);
console.log("SV: door.png + campfire.png");

// 村民:Modern Interiors Free 的 idle 呼吸 + walk 行走表
// (均为 16x32 帧;walk sheet 384x224,row1 = 24 帧 = 6f × 下/上/左/右)
for (const who of ["Amelia", "Bob", "Adam", "Alex"]) {
  copyFileSync(
    join(MI, `Characters_free/${who}_idle_anim_16x16.png`),
    join(OUT_CHAR, `${who.toLowerCase()}_idle.png`)
  );
  // walk:从 384x224 的 walk sheet 抠 row1(24 帧)成 384x32
  await sharp(join(MI, `Characters_free/${who}_16x16.png`))
    .extract({ left: 0, top: 32, width: 384, height: 32 })
    .png()
    .toFile(join(OUT_CHAR, `${who.toLowerCase()}_walk.png`));
}
console.log("MI: 4 个村民 idle + walk 动画 → public/town/char/");
