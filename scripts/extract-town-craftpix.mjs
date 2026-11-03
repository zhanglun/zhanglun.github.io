#!/usr/bin/env node
// 从 CraftPix 免费包裁切 /town 素材(scripts/extract-town-sv.mjs 的姊妹脚本):
// - 野生动物(兔/狐/鹿)与牧场动物(羊/猪/公鸡):32px 帧缩 50% 回 16px 网格,
//   方向行序 下/上/左/右 与 MI 村民表一致(目检 hare-idle/fox-walk 确认);
//   牧场动物单表 = 行 0-3 idle(6f) + 行 4-7 walk(4f),按半表拆成两张。
// - UI 羊皮面板(Main_tiles 大素面面板)裁成九宫格切片,HUD 纸面容器 border-image 用。
// 来源 zip 与授权记录见 public/town/ASSETS.md(CraftPix freebie:可商用、
// 免署名、禁再分发源文件)。暂存目录 /tmp/craftpix-src 由用户下载的 zip 解压而来。
// 重跑幂等。
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdirSync, existsSync } from "fs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const here = dirname(fileURLToPath(import.meta.url));
const STAGE = "/tmp/craftpix-src";
const FARM = join(
  STAGE,
  "craftpix-net-291971-free-top-down-animals-farm-pixel-art-sprites/PNG/Without_shadow"
);
const HUNT = join(
  STAGE,
  "craftpix-net-789196-free-top-down-hunt-animals-pixel-sprite-pack/PNG/Without_shadow"
);
const UI = join(
  STAGE,
  "craftpix-net-255216-free-basic-pixel-art-ui-for-rpg/PNG"
);
const HOME = join(
  STAGE,
  "craftpix-net-654184-main-characters-home-free-top-down-pixel-art-asset/PNG"
);
if (!existsSync(join(FARM, "Sheep_animation_without_shadow.png"))) {
  console.error(`找不到 CraftPix 解包目录: ${STAGE}`);
  console.error("请把下载的 6 个 zip 解压到 /tmp/craftpix-src/(见 ASSETS.md)");
  process.exit(1);
}
const OUT_ANIMAL = join(here, "../public/town/animal");
const OUT_UI = join(here, "../public/town/ui");
const OUT_FURN = join(here, "../public/town/furn");
mkdirSync(OUT_ANIMAL, { recursive: true });
mkdirSync(OUT_UI, { recursive: true });
mkdirSync(OUT_FURN, { recursive: true });

const halfPng = async (src, out) => {
  const meta = await sharp(src).metadata();
  const w = Math.round(meta.width / 2);
  const h = Math.round(meta.height / 2);
  await sharp(src)
    .resize(w, h, { kernel: "nearest" })
    .png()
    .toFile(out);
  console.log(`  ${out.split("/").pop()}: ${meta.width}x${meta.height} → ${w}x${h}`);
};

// ---- 野生动物:每动物 idle/walk 各一张表(行 = 下/上/左/右) ----
// 文件名大小写照源包:Hare/Fox_walk/Deer。
console.log("野生动物(hunt animals):");
for (const [sp, idleFile, walkFile] of [
  ["hare", "Hare/Hare_Idle.png", "Hare/Hare_Walk.png"],
  ["fox", "Fox/Fox_Idle.png", "Fox/Fox_walk.png"],
  ["deer", "Deer/Deer_Idle.png", "Deer/Deer_Walk.png"],
]) {
  await halfPng(join(HUNT, idleFile), join(OUT_ANIMAL, `${sp}-idle.png`));
  await halfPng(join(HUNT, walkFile), join(OUT_ANIMAL, `${sp}-walk.png`));
}

// ---- 牧场动物:单表 = idle(行0-3) + walk(行4-7),拆两半 ----
// 羊/猪/火鸡/公鸡 192x256(32px 帧);牛 384x512(64px 帧,缩半回 32px,
// 游戏里是 2 格宽的大型牲畜)。
console.log("牧场动物(farm animals):");
for (const [sp, size] of [
  ["Sheep", 32],
  ["Piglet", 32],
  ["Rooster", 32],
  ["Turkey", 32],
  ["Bull", 64],
]) {
  const src = join(FARM, `${sp}_animation_without_shadow.png`);
  const meta = await sharp(src).metadata();
  const cols = meta.width / size; // 每向帧数(idle 6 列)
  const rowsH = size * 4; // 4 个方向行的高度
  if (meta.height !== rowsH * 2)
    throw new Error(`${sp} 表尺寸 ${meta.width}x${meta.height} 与 ${size}px 帧不符`);
  const name = sp.toLowerCase();
  const outW = Math.round(meta.width / 2);
  const outH = Math.round(rowsH / 2);
  await sharp(src)
    .extract({ left: 0, top: 0, width: meta.width, height: rowsH })
    .resize(outW, outH, { kernel: "nearest" })
    .png()
    .toFile(join(OUT_ANIMAL, `${name}-idle.png`));
  await sharp(src)
    .extract({ left: 0, top: rowsH, width: meta.width, height: rowsH })
    .resize(outW, outH, { kernel: "nearest" })
    .png()
    .toFile(join(OUT_ANIMAL, `${name}-walk.png`));
  console.log(
    `  ${name}-idle/-walk.png: ${meta.width}x${meta.height} 拆半 → ${outW}x${outH}(${size / 2}px 帧,每向 ${cols} 列)`
  );
}

// ---- 狩猎动物补种:野猪 / 黑松鸡(与兔/狐/鹿同构) ----
console.log("狩猎动物补种:");
for (const [sp, idleFile, walkFile] of [
  ["boar", "Boar/Boar_Idle.png", "Boar/Boar_Walk.png"],
  ["grouse", "Black_grouse/Black_grouse_Idle.png", "Black_grouse/Black_grouse_Walk.png"],
]) {
  await halfPng(join(HUNT, idleFile), join(OUT_ANIMAL, `${sp}-idle.png`));
  await halfPng(join(HUNT, walkFile), join(OUT_ANIMAL, `${sp}-walk.png`));
}

// ---- UI 羊皮面板:大素面面板(Main_tiles 中部)硬切 48x40 作九宫格源 ----
// 坐标由 8x 放大目测 + alpha 直方定界;勿用 trim:面板自带烘焙阴影,
// 与右侧邻件在 alpha 上粘连,trim 收不干净。
console.log("UI:");
{
  const src = join(UI, "Main_tiles.png");
  await sharp(src)
    .extract({ left: 208, top: 197, width: 48, height: 40 })
    .png()
    .toFile(join(OUT_UI, "panel.png"));
  console.log("  ui/panel.png: 48x40(九宫格切片源,CSS slice 5)");
}

// ---- 室内家具(Main tiles 的 Interior.png,16px 原生无需缩放)----
// 坐标来自连通域扫描 + 2x 放大目检(furn-menu.png);大件与邻件粘连处
// 已核对边界,勿凭直觉改。
console.log("室内家具:");
{
  const crops = [
    // [文件名, x, y, w, h]
    ["bookcase", 163, 81, 26, 44], // 窄书架(带彩色书脊)×6 = 书屋归档墙
    ["kitchen", 6, 85, 51, 55], // 厨房置物架(蒜辫+汤锅)= 咖啡馆柜台
    ["cabinet", 2, 9, 43, 59], // 高抽屉柜 = 邮局信件分类柜
    ["bed", 51, 0, 23, 39], // 单人床(木框白枕蓝毯)= 小屋;(91,149)是挂毛巾架,勿混
    ["desk", 146, 136, 34, 32], // 台钳工作台 = 工坊/邮局柜台
    ["round", 21, 146, 39, 55], // 圆桌+椅子 = 各屋餐位
    ["alchemy", 117, 176, 39, 35], // 炼金/杂物台
    ["shelf", 84, 36, 26, 38], // 洗漱角(瓶罐+挂巾)= 小屋墙边
    ["rug", 126, 297, 52, 62], // 红地毯(平铺装饰,不挡路)
  ];
  for (const [name, x, y, w, h] of crops) {
    await sharp(join(HOME, "Interior.png"))
      .extract({ left: x, top: y, width: w, height: h })
      .png()
      .toFile(join(OUT_FURN, `${name}.png`));
    console.log(`  furn/${name}.png: ${w}x${h}`);
  }
}
console.log("完成 → public/town/animal/ + public/town/ui/ + public/town/furn/");
