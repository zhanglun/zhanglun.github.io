// 场景引擎：WorldScene（小镇室外）与 InteriorScene（建筑室内）。
// 定位：博客的小镇形态 —— 只逛、进屋、对话、跳转；无任务/经济/农作玩法。
// 玩家与宠物为本站原创史莱姆（gen/slime），村民为 Modern Interiors 人形。
// 架构对齐 Pixels 客户端的单机简化版：
// - 地面/碰撞用 tilemap + 自制 solid 网格（分轴移动 = 贴墙滑动）
// - 树/房子/NPC/玩家按「脚底 y」做深度排序（伪 2.5D 遮挡）
// - 相机整数倍缩放 + roundPixels 保像素锐利
// - 交互 = 统一查最近交互点，事件总线通知 DOM HUD

import Phaser from "phaser";
import {
  TILE,
  SHEETS,
  IMAGES,
  IDLE_FRAMES,
  WALK_FRAMES,
  DIR_FRAME,
  SLIME_FRAMES,
  CAMPFIRE_FRAMES,
  buildGroundVariants,
  buildPathTiles,
  buildIndoorVariants,
  buildNameplate,
  buildFurniture,
  buildLamp,
  buildGlow,
  buildDiary,
  buildOrb,
  buildTotem,
  buildHintBubble,
  buildNewsBubble,
  buildRainDrop,
  buildSnowFlake,
  buildWell,
  buildSpark,
  buildCloud,
  buildBirdFrame,
  buildFishShadow,
  buildTreasure,
  FURN_KINDS,
  CRITTER_FRAMES,
  type CritterSp,
} from "./assets";
import {
  WORLD_W,
  WORLD_H,
  buildGround,
  buildProps,
  buildings,
  doorOf,
  solidRowsOf,
  npcDefs,
  critterDefs,
  TOTEM_SPOTS,
  ORB_SPOT,
  BOARD_SPOT,
  WELL_SPOT,
  FIREFLY_SPOTS,
  LAKE_FISH_SPOT,
  TREASURE_SPOTS,
  Ground,
  FURN_LOOKS,
  type BuildingDef,
  type FurnAct,
} from "./world";
import {
  bus,
  EV,
  TOD,
  WEATHER,
  getRealWeather,
  type ListRequest,
  type WeatherKind,
} from "./state";
import { townData } from "./towndata";
import { TownAudio } from "./audio";

const SPEED = 88;
const INTERACT_DIST = 30;

// 室内家具联动动作的提示词(与 world.ts FurnAct 对应)
const ACT_LABEL: Record<FurnAct, string> = {
  archive: "翻翻书架",
  projects: "看看项目",
  annual: "读年报信",
  about: "看看床头照片",
  guestbook: "翻留言簿",
};

function bindBus(scene: Phaser.Scene, ev: string, fn: (...a: never[]) => void) {
  bus.on(ev, fn);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => bus.off(ev, fn));
}

// 关闭全部 HUD 浮层(门牌面板/列表面板/搜索)。E 键关弹窗时必须三类都发——
// 只发 panel null 会让 list/search 留在屏上,暗遮罩盖住画布像卡死(实际踩坑:
// 书屋进门按 E 误触书架弹出归档列表,按 E 关不掉,角色看起来不能动)。
function closeOverlays() {
  bus.emit(EV.panel, null);
  bus.emit(EV.list, null);
  bus.emit(EV.search, false);
}

// 纹理取一个像素的颜色（地面变体取色用）
function pixelOf(
  scene: Phaser.Scene,
  key: string,
  x = 8,
  y = 8
): [number, number, number] {
  const src = scene.textures.get(key).getSourceImage() as HTMLImageElement;
  const cv = document.createElement("canvas");
  cv.width = 1;
  cv.height = 1;
  const ctx = cv.getContext("2d")!;
  ctx.drawImage(src, x, y, 1, 1, 0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

function registerAnims(scene: Phaser.Scene) {
  if (scene.anims.exists("slime-idle")) return;
  // 史莱姆呼吸（玩家/宠物）
  scene.anims.create({
    key: "slime-idle",
    frames: scene.anims.generateFrameNumbers("gen-slime", {
      frames: [...Array(SLIME_FRAMES).keys()],
    }),
    frameRate: 5,
    repeat: -1,
  });
  // 村民待机（朝下 6 帧）+ 行走（4 向各 6 帧）
  for (const v of ["amelia", "bob", "adam", "alex"]) {
    scene.anims.create({
      key: `v-idle-${v}`,
      frames: scene.anims.generateFrameNumbers(`char-${v}`, {
        frames: [...Array(IDLE_FRAMES).keys()],
      }),
      frameRate: 5,
      repeat: -1,
    });
    for (const [dir, off] of Object.entries(DIR_FRAME)) {
      scene.anims.create({
        key: `v-walk-${v}-${dir}`,
        frames: scene.anims.generateFrameNumbers(`char-${v}-walk`, {
          frames: [...Array(WALK_FRAMES).keys()].map(
            n => off * WALK_FRAMES + n
          ),
        }),
        frameRate: 7,
        repeat: -1,
      });
    }
  }
  // 篝火
  scene.anims.create({
    key: "campfire",
    frames: scene.anims.generateFrameNumbers("sv-campfire", {
      frames: [...Array(CAMPFIRE_FRAMES).keys()],
    }),
    frameRate: 8,
    repeat: -1,
  });
  // 动物(CraftPix):idle/walk 各 4 向,行序 = DIR_FRAME
  for (const [sp, fr] of Object.entries(CRITTER_FRAMES)) {
    for (const [dir, off] of Object.entries(DIR_FRAME)) {
      scene.anims.create({
        key: `an-idle-${sp}-${dir}`,
        frames: scene.anims.generateFrameNumbers(`an-${sp}-idle`, {
          frames: [...Array(fr.idle).keys()].map(n => off * fr.idle + n),
        }),
        frameRate: 4,
        repeat: -1,
      });
      scene.anims.create({
        key: `an-walk-${sp}-${dir}`,
        frames: scene.anims.generateFrameNumbers(`an-${sp}-walk`, {
          frames: [...Array(fr.walk).keys()].map(n => off * fr.walk + n),
        }),
        frameRate: 6,
        repeat: -1,
      });
    }
  }
}

interface TouchState {
  dx: number;
  dy: number;
  pressed: boolean;
}

const touch: TouchState = { dx: 0, dy: 0, pressed: false };
let modalOpen = false; // HUD 面板打开时锁场景输入

// ---------------------------------------------------------------- 小镇室外

export class WorldScene extends Phaser.Scene {
  private solid!: Uint8Array;
  private groundRt!: Phaser.GameObjects.RenderTexture;
  private player!: Phaser.GameObjects.Sprite;
  private lastPrompt = "";
  private npcs: {
    spr: Phaser.GameObjects.Sprite;
    def: (typeof npcDefs)[number];
    li: number;
    home: { x: number; y: number };
    mode: "idle" | "walk" | "toHome" | "gone";
    timer: number;
    dir: "down" | "up" | "left" | "right";
  }[] = [];
  private pet!: Phaser.GameObjects.Sprite;
  private critters: {
    spr: Phaser.GameObjects.Sprite;
    sp: CritterSp;
    home: { x: number; y: number };
    mode: "idle" | "walk";
    timer: number;
    dir: "down" | "up" | "left" | "right";
    radius: number;
  }[] = [];
  private night!: Phaser.GameObjects.Rectangle;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private trees: {
    tx: number;
    ty: number;
    w: number;
    h: number;
    img: Phaser.GameObjects.Image;
  }[] = [];
  private plates: { b: BuildingDef; x: number; y: number }[] = [];
  private lamps: { glow: Phaser.GameObjects.Image; cx: number; cy: number }[] =
    [];
  private doorPads!: Map<string, BuildingDef>;
  private transitioning = false;
  private wasOnPad = true; // 边沿触发：出生/出门站在门前格时不立即吸回
  private lastTileX = -1; // 玩家 tile 上报去重(小地图标记)
  private lastTileY = -1;
  private hint!: Phaser.GameObjects.Image; // 交互提示气泡(最近交互点上方)
  private padAWasDown = false; // 手柄 A 键边沿触发
  // 昼夜系统:模式在 state.TOD(全局单例);时钟与相位在此实例内
  private dayClock = 0; // 自动循环累计秒
  private dayBase = 0.12; // 初始相位(白天 0.12 / 夜晚 0.55,由本地时间决定)
  private isNight = false;
  // 天气:?weather= > HUD 手动选择 > 实况(IP 定位+Open-Meteo,HUD 解析)
  // > 日期哈希,四级优先级见 resolveWeather()
  private weather: WeatherKind = "clear";
  private weatherFx?: Phaser.GameObjects.Particles.ParticleEmitter;
  private fireflies: {
    id: string;
    glow: Phaser.GameObjects.Image;
    dot: Phaser.GameObjects.Image;
    hx: number; // 巢(出生点),游走以巢为圆心
    hy: number;
    angle: number;
    speed: number;
    turnTimer: number;
    phase: number;
  }[] = [];
  private fireflyNight = 0; // 夜显系数 0-1(入夜淡入,天亮淡出)
  private fishShadow!: Phaser.GameObjects.Image;
  private fishShadowHome = { x: 0, y: 0 };
  // 天空元素:流云(整图缓慢漂移)与飞鸟(白天成群掠过,夜晚不出)
  private clouds: { img: Phaser.GameObjects.Image; speed: number }[] = [];
  private birds: {
    spr: Phaser.GameObjects.Image;
    vx: number;
    ft: number;
    t: number;
    y0: number;
  }[] = [];
  private birdTimer = 6;
  // 钓鱼进行中:记录甩竿位置,走远即脱竿;timer 到点收鱼
  private fishing: {
    sx: number;
    sy: number;
    timer: Phaser.Time.TimerEvent;
  } | null = null;
  // 每日宝藏:每天日期哈希选一处,当天挖开有惊喜
  private treasure: { spr: Phaser.GameObjects.Image } | null = null;
  private treasureCollected = false;
  private caughtFireflies = new Set<string>();
  private insidePrev = false; // 村民作息触发器:夜/雨 = 回屋
  private debugOn =
    typeof location !== "undefined" &&
    new URLSearchParams(location.search).has("debug");
  private debugGfx?: Phaser.GameObjects.Graphics;
  // 音效引擎与节奏状态(引擎默认静音,HUD 🔊 开启)
  readonly audio = new TownAudio();
  private stepAcc = 0;
  private moving = false;
  private fireLit = true;

  constructor() {
    super("world");
  }

  preload() {
    this.load.setPath("/town/");
    // 加载进度 → HUD 开场屏的像素进度条(window 事件,跨模块实例)
    this.load.on("progress", (v: number) => {
      window.dispatchEvent(new CustomEvent("town:loadprogress", { detail: v }));
    });
    // 版本参数破缓存:素材文件曾在 dev 服务器运行中被重新生成,
    // 浏览器可能缓存了写入中途的残缺 PNG(PNG 头声明 38px、数据被截断,
    // 观感是树干/树基缺失)。素材内容变更时递增 ASSET_VERSION。
    const v = "20261103b";
    for (const img of IMAGES) {
      const file = img.startsWith("sv-")
        ? `sv/${img.slice(3)}.png`
        : img.startsWith("furn-")
          ? `furn/${img.slice(5)}.png`
          : `gen/${img.slice(4)}.png`;
      this.load.image(img, `${file}?v=${v}`);
    }
    for (const s of SHEETS) {
      this.load.spritesheet(s.key, `${s.file}?v=${v}`, {
        frameWidth: s.frameWidth,
        frameHeight: s.frameHeight,
      });
    }
  }

  create(data: { spawnAt?: string } = {}) {
    try {
      registerAnims(this);
      modalOpen = false;
      this.transitioning = false;
      // 场景重启是同一实例：重置提示去重，强制第一帧刷新 HUD
      this.lastPrompt = "\u0000reset";
      // 重置实例数组:场景重启会销毁旧精灵,不清空的话数组会累积
      // 已销毁对象,游走/遮挡/交互逻辑调用它们即崩(v5 实际踩坑)
      this.npcs = [];
      this.critters = [];
      this.trees = [];
      this.plates = [];
      this.lamps = [];

      // ---- 地面（RenderTexture 一次绘制：草/泥两态 + 程序化变体）----
      const ground = buildGround();
      this.groundRt = this.add
        .renderTexture(0, 0, WORLD_W * TILE, WORLD_H * TILE)
        .setOrigin(0);
      const grassColor = pixelOf(this, "sv-grass");
      const dirtColor = pixelOf(this, "sv-dirt");
      buildGroundVariants(grassColor, "grass").forEach((cv, i) =>
        this.textures.addCanvas(`town-grass-v${i}`, cv)
      );
      buildGroundVariants(dirtColor, "dirt").forEach((cv, i) =>
        this.textures.addCanvas(`town-dirt-v${i}`, cv)
      );
      // 路径贴片:16 种邻接组合(位 N=1 E=2 S=4 W=8,置位 = 该侧是草)
      const pathTiles = buildPathTiles(grassColor, dirtColor);
      pathTiles.forEach((cv, i) =>
        this.textures.addCanvas(`town-path-${i}`, cv)
      );
      const pathTex = (x: number, y: number): string => {
        const dirtAt = (xx: number, yy: number) =>
          xx >= 0 &&
          yy >= 0 &&
          xx < WORLD_W &&
          yy < WORLD_H &&
          ground[yy * WORLD_W + xx] === Ground.DIRT;
        let m = 0;
        if (!dirtAt(x, y - 1)) m |= 1;
        if (!dirtAt(x + 1, y)) m |= 2;
        if (!dirtAt(x, y + 1)) m |= 4;
        if (!dirtAt(x - 1, y)) m |= 8;
        return `town-path-${m}`;
      };
      // 树接触阴影（硬边像素椭圆，无模糊）
      const shadow = document.createElement("canvas");
      shadow.width = 28;
      shadow.height = 8;
      const sctx = shadow.getContext("2d")!;
      sctx.fillStyle = "rgba(23, 42, 30, 0.45)";
      [12, 20, 24, 26, 26, 24, 20, 12].forEach((w, r) =>
        sctx.fillRect(14 - w / 2, r, w, 1)
      );
      this.textures.addCanvas("town-shadow", shadow);
      this.textures.addCanvas("gen-lamp", buildLamp());
      this.textures.addCanvas("gen-glow", buildGlow());
      this.textures.addCanvas("gen-orb", buildOrb());
      this.textures.addCanvas("gen-totem", buildTotem());
      this.textures.addCanvas("gen-hint", buildHintBubble());
      this.textures.addCanvas("gen-news", buildNewsBubble());
      this.textures.addCanvas("gen-rain", buildRainDrop());
      this.textures.addCanvas("gen-snow", buildSnowFlake());
      this.textures.addCanvas("gen-well", buildWell());
      this.textures.addCanvas("gen-spark", buildSpark());
      this.textures.addCanvas("gen-cloud0", buildCloud(0));
      this.textures.addCanvas("gen-cloud1", buildCloud(1));
      this.textures.addCanvas("gen-bird0", buildBirdFrame(true));
      this.textures.addCanvas("gen-bird1", buildBirdFrame(false));
      this.textures.addCanvas("gen-fish-shadow", buildFishShadow());
      this.textures.addCanvas("gen-treasure", buildTreasure());
      for (let y = 0; y < WORLD_H; y++) {
        for (let x = 0; x < WORLD_W; x++) {
          const v = ground[y * WORLD_W + x];
          if (v === Ground.DIRT) {
            // 先草后路:路径贴片自带草缘方齿,直接覆盖
            this.groundRt.draw(
              `town-grass-v${(x * 7 + y * 13) % 4}`,
              x * TILE,
              y * TILE
            );
            this.groundRt.draw(pathTex(x, y), x * TILE, y * TILE);
          } else {
            this.groundRt.draw(
              `town-grass-v${(x * 7 + y * 13) % 4}`,
              x * TILE,
              y * TILE
            );
          }
        }
      }

      // ---- 碰撞网格与装饰物 ----
      this.solid = new Uint8Array(WORLD_W * WORLD_H);
      const mark = (x: number, y: number) => {
        if (x >= 0 && y >= 0 && x < WORLD_W && y < WORLD_H)
          this.solid[y * WORLD_W + x] = 1;
      };
      for (const p of buildProps()) {
        const w = p.cols ?? 1;
        const h = p.rows ?? 1;
        let img: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
        if (p.sheet) {
          img = this.add
            .sprite(p.tx * TILE + TILE / 2, (p.ty + h) * TILE, p.sheet, 0)
            .setOrigin(0.5, 1);
          if (p.anim) (img as Phaser.GameObjects.Sprite).play(p.anim);
        } else if (p.center) {
          img = this.add
            .image((p.tx + 0.5) * TILE, (p.ty + h) * TILE, p.image!)
            .setOrigin(0.5, 1);
        } else {
          img = this.add
            .image(p.tx * TILE, (p.ty + h) * TILE, p.image!)
            .setOrigin(0, 1);
        }
        img.setDepth((p.ty + h) * TILE);
        if (p.solidAuto) {
          // 平铺地形(湖面):贴地渲染,深度压到地面层,实体画在其上
          img.setDepth(p.ty * TILE - 1);
        }
        if (p.image === "gen-lamp") {
          // 光晕挂在灯头(顶部 4px),夜间点亮;白天 alpha 0
          const cx = (p.tx + 0.5) * TILE;
          const cy = (p.ty + h) * TILE - 24;
          const glow = this.add
            .image(cx, cy, "gen-glow")
            .setOrigin(0.5, 0.5)
            .setDepth(10_001)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setAlpha(0);
          this.lamps.push({ glow, cx, cy });
        }
        if (p.image?.startsWith("sv-tree")) {
          // 接触阴影：SV 树的浅绿草基贴在同色系草地上会隐形，树冠像被截断；
          // 脚下画一枚硬边像素阴影把树「落」在地上（同 ARA 项目页做法）
          this.add
            .image((p.tx + w / 2) * TILE, (p.ty + h) * TILE - 2, "town-shadow")
            .setOrigin(0.5, 1)
            .setDepth((p.ty + h) * TILE - 1);
          this.trees.push({
            tx: p.tx,
            ty: p.ty,
            w,
            h,
            img: img as Phaser.GameObjects.Image,
          });
        }
        if (p.solidAuto) {
          // 逐格读纹理:蓝色占比过半的格标碰撞(湖面),岸/桥/岛可走
          const src = this.textures
            .get(p.image!)
            .getSourceImage() as HTMLImageElement;
          const cv = document.createElement("canvas");
          cv.width = src.width;
          cv.height = src.height;
          const c2 = cv.getContext("2d")!;
          c2.drawImage(src, 0, 0);
          const dd = c2.getImageData(0, 0, src.width, src.height).data;
          for (let r = 0; r < h; r++) {
            for (let i = 0; i < w; i++) {
              let blue = 0;
              for (let y = 0; y < TILE; y++) {
                for (let x = 0; x < TILE; x++) {
                  const k =
                    ((r * TILE + y) * src.width + i * TILE + x) * 4;
                  if (
                    dd[k + 3] > 100 &&
                    dd[k + 2] > 130 &&
                    dd[k + 2] > dd[k] + 30
                  )
                    blue++;
                }
              }
              if (blue > (TILE * TILE) / 2) mark(p.tx + i, p.ty + r);
            }
          }
        } else if (p.solid) {
          // 树只挡底行（树冠可从后面走过），小件整格
          const solidRows = h >= 3 ? 1 : h;
          for (let j = 0; j < solidRows; j++)
            for (let i = 0; i < w; i++) mark(p.tx + i, p.ty + h - 1 - j);
        }
      }
      // 建筑：SV 成品房屋 sprite，水平居中于占格；门口立门牌
      this.textures.addCanvas("gen-nameplate", buildNameplate());
      for (const b of buildings) {
        const img = this.add
          .image((b.tx + b.w / 2) * TILE, (b.ty + b.h) * TILE, b.house)
          .setOrigin(0.5, 1);
        img.setDepth((b.ty + b.h) * TILE);
        const rows = solidRowsOf(b);
        for (let y = b.ty + b.h - rows; y < b.ty + b.h; y++) {
          for (let x = b.tx; x < b.tx + b.w; x++) mark(x, y);
        }
        // 门牌:立在小径旁(视觉门中心右侧一格),不挡路
        const colB = Math.floor(b.tx + b.w / 2 - 0.5) + 1;
        const plate = this.add
          .image(
            (colB + 1) * TILE - 3,
            (b.ty + b.h + 1) * TILE,
            "gen-nameplate"
          )
          .setOrigin(0.5, 1);
        plate.setDepth((b.ty + b.h + 1) * TILE);
        this.plates.push({ b, x: plate.x, y: plate.y });
      }

      // ---- 玩家（原创史莱姆）----
      // 深链:/town?go=<建筑 id> 直接出生在该建筑门口(仅首次启动生效,
      // 出屋走 data.spawnAt,不受残留 URL 影响)
      const goParam = new URLSearchParams(location.search).get("go");
      const spawnId =
        data.spawnAt ??
        (goParam && buildings.some(b => b.id === goParam)
          ? goParam
          : undefined);
      let sx = 32 * TILE;
      let sy = 23 * TILE;
      if (spawnId) {
        const b = buildings.find(x => x.id === spawnId)!;
        const d = doorOf(b);
        sx = (d.x + 0.5) * TILE;
        sy = (d.y + 1.6) * TILE;
      }
      this.player = this.add.sprite(sx, sy, "gen-slime", 0).setOrigin(0.5, 0.9);
      this.player.play("slime-idle");
      // 出生点若陷进墙体（世界改版等），退回镇中心防卡死
      if (this.blocked(this.player.x, this.player.y)) {
        this.player.x = 32 * TILE;
        this.player.y = 23 * TILE;
      }
      this.player.setDepth(this.player.y);
      // 交互提示气泡:挂在最近交互点上方,随 updatePrompt 移动
      this.hint = this.add
        .image(0, 0, "gen-hint")
        .setOrigin(0.5, 1)
        .setDepth(20_000)
        .setVisible(false);

      // 门前格注册：踩上即自动进门（与室内「走到底自动出门」对称）
      this.doorPads = new Map(
        buildings.map(b => {
          const d = doorOf(b);
          return [`${d.x},${d.y + 1}`, b] as const;
        })
      );

      // 「有新篇」气泡:最新文章 7 天内发布,挂在书屋门头轻轻浮动
      if (townData().latest?.fresh) {
        const blog = buildings.find(x => x.id === "blog")!;
        const bubble = this.add
          .image(
            (doorOf(blog).x + 0.5) * TILE,
            (blog.ty + blog.h) * TILE - 30,
            "gen-news"
          )
          .setOrigin(0.5, 1)
          .setDepth(20_000);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          this.tweens.add({
            targets: bubble,
            y: "-=3",
            duration: 820,
            yoyo: true,
            repeat: -1,
            ease: "sine.inout",
          });
        }
      }

      // 萤火虫收集彩蛋:镇上藏 6 只,捉满触发烟花。
      // localStorage 只存「捉没捉过」的 id 集合——化妆品,不是资产。
      try {
        (localStorage.getItem("town-fireflies") ?? "")
          .split(",")
          .filter(Boolean)
          .forEach(id => this.caughtFireflies.add(id));
      } catch {}
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      // 萤火虫:夜间出没(入夜淡入/天亮淡出),随机游走+呼吸闪烁
      FIREFLY_SPOTS.forEach(([tx, ty], i) => {
        const id = String(i);
        if (this.caughtFireflies.has(id)) return;
        const fx = (tx + 0.5) * TILE;
        const fy = (ty + 0.8) * TILE;
        const glow = this.add
          .image(fx, fy, "gen-glow")
          .setOrigin(0.5)
          .setDepth(9_999)
          .setBlendMode(Phaser.BlendModes.ADD)
          .setScale(0.55)
          .setAlpha(0);
        const dot = this.add
          .image(fx, fy, "gen-spark")
          .setOrigin(0.5)
          .setDepth(10_001)
          .setTint(0xf4e042)
          .setAlpha(0);
        this.fireflies.push({
          id,
          glow,
          dot,
          hx: fx,
          hy: fy,
          angle: Math.random() * Math.PI * 2,
          speed: 8 + Math.random() * 7,
          turnTimer: Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
        });
      });

      // ---- 天空元素:流云(缓慢漂移,绕世界循环)----
      this.clouds = [];
      for (const [cx, cy, v, sp] of [
        [6, 5, 0, 4.2],
        [28, 34, 1, 3.2],
        [46, 8, 0, 3.8],
        [12, 22, 1, 4.6],
      ] as Array<[number, number, 0 | 1, number]>) {
        const img = this.add
          .image(cx * TILE, cy * TILE, `gen-cloud${v}`)
          .setOrigin(0.5)
          .setDepth(9_990);
        this.clouds.push({ img, speed: sp });
      }
      this.birds = [];
      this.birdTimer = 6;

      // ---- 每日宝藏:日期哈希选一处,当天挖开收集(化妆品计数)----
      {
        const now0 = new Date();
        const today = `${now0.getFullYear()}-${now0.getMonth() + 1}-${now0.getDate()}`;
        let h = 0;
        for (const c of today) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        const [ttx, tty] = TREASURE_SPOTS[h % TREASURE_SPOTS.length];
        let collected = false;
        try {
          const raw = JSON.parse(
            localStorage.getItem("town-daily") ?? "null"
          ) as { date?: string } | null;
          collected = raw?.date === today;
        } catch {}
        if (!collected) {
          const spr = this.add
            .image((ttx + 0.5) * TILE, (tty + 1) * TILE, "gen-treasure")
            .setOrigin(0.5, 1)
            .setDepth((tty + 1) * TILE);
          if (!reducedMotion) {
            this.tweens.add({
              targets: spr,
              y: "-=2",
              duration: 700,
              yoyo: true,
              repeat: -1,
              ease: "sine.inout",
            });
          }
          this.treasure = { spr };
        }
        this.treasureCollected = collected;
      }
      // 钓鱼目标鱼影:在湖心水域游动(视觉目标,钓鱼点在东岸栈桥)
      this.fishShadow = this.add
        .image(9 * TILE, 34.5 * TILE, "gen-fish-shadow")
        .setOrigin(0.5)
        .setDepth(593);
      this.fishShadowHome = { x: this.fishShadow.x, y: this.fishShadow.y };

      // 烟花触发:新年头三天,或 ?fireworks=1 调试
      const now = new Date();
      if (
        new URLSearchParams(location.search).has("fireworks") ||
        (now.getMonth() === 0 && now.getDate() <= 3)
      ) {
        this.time.delayedCall(1800, () => this.celebrate(8));
      }

      // ---- 村民与宠物 ----
      for (const def of npcDefs) {
        const spr = this.add
          .sprite(
            (def.tx + 0.5) * TILE,
            (def.ty + 1) * TILE,
            `char-${def.sheet}`,
            0
          )
          .setOrigin(0.5, 1);
        spr.play(`v-idle-${def.sheet}`);
        spr.setDepth(spr.y);
        this.npcs.push({
          spr,
          def,
          li: 0,
          home: { x: spr.x, y: spr.y },
          mode: "idle",
          timer: 2 + Math.random() * 4,
          dir: "down",
        });
      }
      // 跟随宠物：小史莱姆
      this.pet = this.add
        .sprite(46 * TILE, 30 * TILE, "gen-slime", 0)
        .setOrigin(0.5, 1)
        .setScale(0.7);
      this.pet.play("slime-idle");
      this.pet.setDepth(this.pet.y);

      // ---- 动物(野生动物 + 东南草场):NPC 式随机游走,纯氛围 ----
      for (const c of critterDefs) {
        const spr = this.add
          .sprite((c.tx + 0.5) * TILE, (c.ty + 1) * TILE, `an-${c.sp}-idle`, 0)
          .setOrigin(0.5, 1);
        spr.play(`an-idle-${c.sp}-down`);
        spr.setDepth(spr.y);
        this.critters.push({
          spr,
          sp: c.sp,
          home: { x: spr.x, y: spr.y },
          mode: "idle",
          timer: 1 + Math.random() * 3,
          dir: "down",
          radius: c.radius ?? 40,
        });
      }

      // ---- 日夜 ----
      this.night = this.add
        .rectangle(0, 0, WORLD_W * TILE, WORLD_H * TILE, 0x0b1030, 0)
        .setOrigin(0)
        .setDepth(10_000);

      // ---- 相机 ----
      const cam = this.cameras.main;
      cam.setBounds(0, 0, WORLD_W * TILE, WORLD_H * TILE);
      cam.startFollow(this.player, true, 0.09, 0.09);
      cam.setRoundPixels(true);
      this.applyZoom();
      // 立即对准出生点:场景重启时相机被重置,若依赖 follow 的 0.09 插值,
      // 每次出屋都会看到相机从重置位一路平移到房子(v5 反馈)。
      cam.centerOn(this.player.x, this.player.y);
      cam.fadeIn(200, 10, 12, 20);
      this.scale.on(Phaser.Scale.Events.RESIZE, this.applyZoom, this);

      // ---- 输入 ----
      const kb = this.input.keyboard!;
      this.keys = kb.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE") as Record<
        string,
        Phaser.Input.Keyboard.Key
      >;
      kb.on("keydown-E", () => this.interact());
      kb.on("keydown-SPACE", () => this.interact());
      bindBus(this, EV.touchAct, () => this.interact());
      bindBus(
        this,
        EV.touchDir,
        (t: { dx: number; dy: number; pressed: boolean }) => {
          touch.dx = t.dx;
          touch.dy = t.dy;
          touch.pressed = t.pressed;
        }
      );
      // HUD 侧浮层(列表面板/搜索)关闭 = 解锁场景输入
      bindBus(this, EV.list, (p: ListRequest | null) => {
        if (!p) modalOpen = false;
      });
      bindBus(this, EV.search, (open: boolean) => {
        if (!open) modalOpen = false;
      });
      bindBus(this, EV.travel, (id: string) => this.travelTo(id));

      // ---- 调试边框（?debug=1 进入或按 D 切换）----
      this.debugGfx = this.add
        .graphics()
        .setDepth(99998)
        .setVisible(this.debugOn);
      kb.on("keydown-D", () => {
        this.debugOn = !this.debugOn;
        this.debugGfx!.setVisible(this.debugOn);
      });

      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.scale.off(Phaser.Scale.Events.RESIZE, this.applyZoom, this);
      });
      // 自动模式初始相位按访客本地时间(19:00-7:00 为夜)
      const hour = new Date().getHours();
      this.dayBase =
        TOD.mode === "auto" ? (hour >= 19 || hour < 7 ? 0.55 : 0.12) : 0.12;
      this.dayClock = 0;
      // 天气:按真实日期确定性决定(冬多雪,其余季节约 1/4 天数有雨);
      // ?weather=rain|snow|clear 可强制,供调试与实机验收。
      // 相机段已设好 zoom,粒子以屏幕坐标系(scrollFactor 0)铺满视口
      const wParam = new URLSearchParams(location.search).get("weather");
      this.weather = this.resolveWeather(wParam);
      this.weatherFx = this.buildWeatherFx();
      // 首帧 updateNight 会按当前昼夜/天气把村民作息收敛到位
      this.insidePrev = false;
      // HUD 切换走 window 事件(跨模块实例);收到即同步本实例副本
      const onTod = (e: Event) => {
        TOD.mode = (e as CustomEvent).detail;
      };
      window.addEventListener("town:tod", onTod);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>
        window.removeEventListener("town:tod", onTod)
      );
      // 天气同理:HUD 手动切换 / 实况解析落地都会广播,重建雨雪粒子;
      // 环境音与村民作息由下一帧 updateNight 按 this.weather 自动收敛
      const onWx = () => this.syncWeatherFromBridge();
      window.addEventListener("town:weather-mode", onWx);
      window.addEventListener("town:realweather", onWx);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        window.removeEventListener("town:weather-mode", onWx);
        window.removeEventListener("town:realweather", onWx);
      });
      if (this.audio.restore()) {
        // 开启状态:无需额外操作,ensureCtx 已在 restore 中建好
      }
      (window as unknown as { __townAudio: unknown }).__townAudio = this.audio;
      bus.emit(EV.ready);
    } catch (e) {
      (window as unknown as { __townErr: string }).__townErr = String(e);
      console.error("WorldScene.create failed:", e);
    }
  }

  private applyZoom() {
    const { width, height } = this.scale.gameSize;
    const short = Math.min(width, height);
    const zoom =
      short < 560
        ? 2
        : Phaser.Math.Clamp(
            Math.round(Math.min(width / (24 * TILE), height / (15 * TILE))),
            2,
            5
          );
    this.cameras.main.setZoom(zoom);
    this.night.setSize(width, height);
  }

  // 当天天气:日期字符串哈希 → 确定性结果(同一天全站一致,无运行时开销)。
  // 冬季(12/1/2 月)45% 下雪,其余月份 22% 下雨,其余晴。
  // 作为实况解析失败时的兜底——两个来源都不依赖网络。
  static weatherOf(d = new Date()): WorldScene["weather"] {
    const m = d.getMonth() + 1;
    const key = `${d.getFullYear()}-${m}-${d.getDate()}`;
    let h = 0;
    for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const r = (h % 100) / 100;
    if (m === 12 || m <= 2) return r < 0.45 ? "snow" : "clear";
    return r < 0.22 ? "rain" : "clear";
  }

  // ---- 天气来源四级优先:?weather= > HUD 手动(WEATHER.mode) >
  // 实况(sessionStorage,HUD 侧 IP 定位 + Open-Meteo 解析) > 日期哈希 ----
  private resolveWeather(urlParam: string | null): WeatherKind {
    if (urlParam === "rain" || urlParam === "snow" || urlParam === "clear")
      return urlParam;
    if (WEATHER.mode !== "auto") return WEATHER.mode;
    return getRealWeather() ?? WorldScene.weatherOf();
  }

  // HUD 切换天气按钮 / 实况解析落地时同步:换源重建雨雪粒子。
  // 环境音(雨声)与村民作息由下一帧 updateNight 按 this.weather 自动收敛,
  // 这里不用管。
  private syncWeatherFromBridge() {
    const next = this.resolveWeather(
      new URLSearchParams(location.search).get("weather")
    );
    if (next === this.weather) return;
    this.weather = next;
    this.weatherFx?.destroy();
    this.weatherFx = this.buildWeatherFx();
  }

  // 天气粒子:铺满相机可视区。scrollFactor 0 的坐标围绕屏幕中心缩放,
  // 可视区中心 = (W/2, H/2),半宽高 = 屏幕像素 / zoom / 2;雨快雪慢。
  private buildWeatherFx():
    | Phaser.GameObjects.Particles.ParticleEmitter
    | undefined {
    if (this.weather === "clear") return undefined;
    const zoom = this.cameras.main.zoom || 2;
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;
    const hw = this.scale.width / zoom / 2;
    const hh = this.scale.height / zoom / 2;
    if (this.weather === "rain") {
      const fx = this.add.particles(0, 0, "gen-rain", {
        x: { min: cx - hw - 80, max: cx + hw + 80 },
        y: cy - hh - 12,
        lifespan: ((hh * 2 + 24) / 380) * 1000 + 150,
        speedY: { min: 330, max: 430 },
        speedX: { min: -95, max: -60 },
        quantity: 2,
        frequency: 25,
      });
      fx.setScrollFactor(0);
      fx.setDepth(10_002);
      return fx;
    }
    const fx = this.add.particles(0, 0, "gen-snow", {
      x: { min: cx - hw - 20, max: cx + hw + 20 },
      y: cy - hh - 6,
      lifespan: ((hh * 2 + 12) / 55) * 1000 + 400,
      speedY: { min: 38, max: 72 },
      speedX: { min: -20, max: 20 },
      quantity: 1,
      frequency: 90,
      scale: { min: 0.8, max: 1.3 },
    });
    fx.setScrollFactor(0);
    fx.setDepth(10_002);
    return fx;
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.movePlayer(dt);
    // 玩家 tile 变化才上报(HUD 小地图标记用)
    const ptx = Math.floor(this.player.x / TILE);
    const pty = Math.floor(this.player.y / TILE);
    if (ptx !== this.lastTileX || pty !== this.lastTileY) {
      this.lastTileX = ptx;
      this.lastTileY = pty;
      bus.emit(EV.playerTile, { x: ptx, y: pty });
    }
    this.stepAcc = (this.stepAcc ?? 0) + (this.moving ? dt : 0);
    if (this.moving && this.stepAcc > 0.28) {
      this.stepAcc = 0;
      this.audio.footstep();
    }
    this.updateNpcs(dt);
    this.updateCritters(dt);
    this.updatePet(dt);
    this.updateClouds(dt);
    this.updateBirds(dt);
    this.updateFireflies(dt);
    this.updateFishShadow(dt);
    this.updateNight(dt);
    this.audio.tick(
      dt,
      Math.hypot(this.player.x - 34.5 * TILE, this.player.y - 23.5 * TILE),
      this.fireLit
    );
    // 树冠半透明：玩家位于树后（被遮挡）时降低树透明度，避免看不清
    for (const t of this.trees) {
      const topY = t.ty * TILE;
      const bottomY = (t.ty + t.h) * TILE;
      const overlap =
        this.player.y < bottomY &&
        this.player.y > topY + 6 &&
        Math.abs(this.player.x - (t.tx + t.w / 2) * TILE) <
          (t.w * TILE) / 2 + 6;
      t.img.setAlpha(overlap ? 0.55 : 1);
    }
    this.updatePrompt();

    // 调试边框：solid 格红、树绿、建筑黄、玩家碰撞盒白
    if (this.debugOn && this.debugGfx) {
      const g = this.debugGfx;
      g.clear();
      g.lineStyle(1, 0xff4444, 0.9);
      for (let y = 0; y < WORLD_H; y++)
        for (let x = 0; x < WORLD_W; x++)
          if (this.solid[y * WORLD_W + x])
            g.strokeRect(x * TILE, y * TILE, TILE, TILE);
      g.lineStyle(1, 0x44ff44, 0.9);
      for (const t of this.trees)
        g.strokeRect(t.tx * TILE, t.ty * TILE, t.w * TILE, t.h * TILE);
      g.lineStyle(1, 0xffff44, 0.9);
      for (const b of buildings)
        g.strokeRect(b.tx * TILE, b.ty * TILE, b.w * TILE, b.h * TILE);
      g.lineStyle(1, 0xffffff, 1);
      g.strokeRect(this.player.x - 5, this.player.y - 6, 10, 6);
    }

    // 踩上门前格自动进门（边沿触发：先离开再踩上才生效，防止出门即被吸回）
    if (!modalOpen && !this.transitioning) {
      const padKey = `${Math.floor(this.player.x / TILE)},${Math.floor(
        (this.player.y - 2) / TILE
      )}`;
      const onPad = this.doorPads.has(padKey);
      const pad =
        onPad && !this.wasOnPad ? this.doorPads.get(padKey) : undefined;
      if (pad) this.enterBuilding(pad);
      this.wasOnPad = onPad;
    }
  }

  private movePlayer(dt: number) {
    const k = this.keys;
    if (!k) return; // create 未完成时不更新
    let dx = 0;
    let dy = 0;
    if (!modalOpen) {
      if (k.A.isDown || k.LEFT.isDown) dx -= 1;
      if (k.D.isDown || k.RIGHT.isDown) dx += 1;
      if (k.W.isDown || k.UP.isDown) dy -= 1;
      if (k.S.isDown || k.DOWN.isDown) dy += 1;
      if (touch.pressed) {
        dx += touch.dx;
        dy += touch.dy;
      }
      // 手柄:左摇杆 + 十字键,A 键边沿触发交互
      const pad = this.input.gamepad?.pad1;
      if (pad) {
        const ax = pad.axes.length ? pad.axes[0].getValue() : 0;
        const ay = pad.axes.length ? pad.axes[1].getValue() : 0;
        if (Math.abs(ax) > 0.25) dx += Math.sign(ax);
        if (Math.abs(ay) > 0.25) dy += Math.sign(ay);
        if (pad.left) dx -= 1;
        if (pad.right) dx += 1;
        if (pad.up) dy -= 1;
        if (pad.down) dy += 1;
        const aDown = pad.A;
        if (aDown && !this.padAWasDown) this.interact();
        this.padAWasDown = aDown;
      }
    }
    dx = Phaser.Math.Clamp(dx, -1, 1);
    dy = Phaser.Math.Clamp(dy, -1, 1);
    const len = Math.hypot(dx, dy) || 1;
    const vx = (dx / len) * SPEED * dt;
    const vy = (dy / len) * SPEED * dt;

    // 史莱姆无朝向帧：移动时按水平方向镜像，呼吸动画常开
    if (dx !== 0) this.player.setFlipX(dx < 0);
    // 分轴移动 = 贴墙滑动
    if (dx !== 0 && !this.blocked(this.player.x + vx, this.player.y))
      this.player.x += vx;
    if (dy !== 0 && !this.blocked(this.player.x, this.player.y + vy))
      this.player.y += vy;
    this.moving = dx !== 0 || dy !== 0;
    // 甩竿后走远即脱竿(结果延迟回调里也会做距离校验)
    if (this.fishing && this.moving) this.cancelFishing();
    this.player.setDepth(this.player.y);
  }

  private blocked(px: number, py: number): boolean {
    const hw = 5;
    const hh = 3;
    const pts: [number, number][] = [
      [-hw, -hh],
      [hw, -hh],
      [-hw, hh],
      [hw, hh],
    ];
    for (const [ox, oy] of pts) {
      const tx = Math.floor((px + ox) / TILE);
      const ty = Math.floor((py + oy) / TILE);
      if (tx < 0 || ty < 0 || tx >= WORLD_W || ty >= WORLD_H) return true;
      if (this.solid[ty * WORLD_W + tx]) return true;
    }
    return false;
  }

  private updateNpcs(dt: number) {
    const SPEED = 26;
    const RADIUS = 56;
    for (const n of this.npcs) {
      if (n.mode === "gone") continue;
      n.timer -= dt;
      if (n.mode === "toHome") {
        // 作息:径直走回出生点(视为家门),到门口淡出进屋
        const dxh = n.home.x - n.spr.x;
        const dyh = n.home.y - n.spr.y;
        const dist = Math.hypot(dxh, dyh);
        if (dist < 3) {
          n.mode = "gone";
          this.tweens.add({
            targets: n.spr,
            alpha: 0,
            duration: 380,
            onComplete: () => n.spr.setVisible(false),
          });
        } else {
          const dir =
            Math.abs(dxh) > Math.abs(dyh)
              ? dxh > 0
                ? "right"
                : "left"
              : dyh > 0
                ? "down"
                : "up";
          if (dir !== n.dir) {
            n.dir = dir as typeof n.dir;
            n.spr.play(`v-walk-${n.def.sheet}-${n.dir}`);
          }
          const vx = (dxh / dist) * SPEED * dt;
          const vy = (dyh / dist) * SPEED * dt;
          n.spr.x += vx;
          n.spr.y += vy;
        }
      } else if (n.mode === "idle") {
        if (n.timer <= 0) {
          // 从 4 向里挑一个,走 0.6-1.4s
          const dirs: Array<[string, number, number]> = [
            ["down", 0, 1],
            ["up", 0, -1],
            ["left", -1, 0],
            ["right", 1, 0],
          ];
          const [dir, dx, dy] = dirs[(Math.random() * 4) | 0];
          // 用一格(16px)探测目标是否越界——用整步 RADIUS 探测时,
          // 从 home 出发的第一步恰好落在边界上,四向全被拒,村民会冻死
          const nx = n.spr.x + dx * 16;
          const ny = n.spr.y + dy * 16;
          if (
            Math.abs(nx - n.home.x) <= RADIUS &&
            Math.abs(ny - n.home.y) <= RADIUS * 0.8
          ) {
            n.dir = dir as "down" | "up" | "left" | "right";
            n.mode = "walk";
            n.timer = 0.6 + Math.random() * 0.9;
            // MI walk 表四向帧各自朝向正确(下/上/左/右),无需镜像;
            // 此前的 left 翻转会让村民走左边朝右(v5 反馈)
            n.spr.setFlipX(false);
            n.spr.play(`v-walk-${n.def.sheet}-${dir}`);
          } else {
            n.timer = 1 + Math.random() * 2;
          }
        }
      } else if (n.mode === "walk") {
        const v = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[
          n.dir
        ];
        n.spr.x += v[0] * SPEED * dt;
        n.spr.y += v[1] * SPEED * dt;
        if (n.timer <= 0) {
          n.mode = "idle";
          n.timer = 2 + Math.random() * 4;
          n.spr.play(`v-idle-${n.def.sheet}`);
        }
      }
      n.spr.setDepth(n.spr.y);
    }
  }

  // ---- 动物游走:与村民同款状态机,更慢更宅;idle 保持原朝向(低头吃草感) ----
  private updateCritters(dt: number) {
    const SPEED = 15;
    for (const c of this.critters) {
      c.timer -= dt;
      if (c.mode === "idle") {
        if (c.timer <= 0) {
          // 单格(16px)探测防冻死:整步半径探测会在边界全向被拒(村民 v5 踩坑)
          const dirs: Array<[("down" | "up" | "left" | "right"), number, number]> =
            [
              ["down", 0, 1],
              ["up", 0, -1],
              ["left", -1, 0],
              ["right", 1, 0],
            ];
          const [dir, dx, dy] = dirs[(Math.random() * 4) | 0];
          const nx = c.spr.x + dx * 16;
          const ny = c.spr.y + dy * 16;
          if (
            Math.abs(nx - c.home.x) <= c.radius &&
            Math.abs(ny - c.home.y) <= c.radius * 0.8
          ) {
            c.dir = dir;
            c.mode = "walk";
            c.timer = 0.6 + Math.random() * 1.2;
            c.spr.play(`an-walk-${c.sp}-${dir}`);
          } else {
            c.timer = 1 + Math.random() * 2;
          }
        }
      } else {
        const v = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[
          c.dir
        ];
        c.spr.x += v[0] * SPEED * dt;
        c.spr.y += v[1] * SPEED * dt;
        if (c.timer <= 0) {
          c.mode = "idle";
          c.timer = 2 + Math.random() * 5;
          c.spr.play(`an-idle-${c.sp}-${c.dir}`);
        }
      }
      c.spr.setDepth(c.spr.y);
    }
  }

  // ---- 天空元素:流云整图漂移(出右界回左界),飞鸟白天成群掠过 ----
  private updateClouds(dt: number) {
    for (const c of this.clouds) {
      c.img.x += c.speed * dt;
      if (c.img.x - 80 > WORLD_W * TILE) c.img.x = -80;
    }
  }

  private updateBirds(dt: number) {
    this.birdTimer -= dt;
    // 白天每 12-30s 从左右边缘飞进一只(夜里鸟归巢,不出来)
    if (this.birdTimer <= 0 && !this.isNight && this.birds.length < 3) {
      this.birdTimer = 12 + Math.random() * 18;
      const fromLeft = Math.random() < 0.5;
      const y0 = (4 + Math.random() * 30) * TILE;
      const spr = this.add
        .image(fromLeft ? -20 : WORLD_W * TILE + 20, y0, "gen-bird0")
        .setOrigin(0.5)
        .setDepth(9_991);
      this.birds.push({
        spr,
        vx: (fromLeft ? 1 : -1) * (26 + Math.random() * 12),
        ft: 0,
        t: 0,
        y0,
      });
    }
    for (let i = this.birds.length - 1; i >= 0; i--) {
      const b = this.birds[i];
      b.t += dt;
      b.ft += dt;
      if (b.ft > 0.13) {
        b.ft = 0;
        b.spr.setTexture(
          b.spr.texture.key === "gen-bird0" ? "gen-bird1" : "gen-bird0"
        );
      }
      b.spr.x += b.vx * dt;
      b.spr.y = b.y0 + Math.sin(b.t * 3) * 4;
      if (b.spr.x < -30 || b.spr.x > WORLD_W * TILE + 30) {
        b.spr.destroy();
        this.birds.splice(i, 1);
      }
    }
  }

  // ---- 萤火虫:夜间出没(入夜淡入/天亮淡出),绕巢随机游走+呼吸闪烁 ----
  private updateFireflies(dt: number) {
    const want = this.isNight && this.weather !== "rain" ? 1 : 0;
    this.fireflyNight = Phaser.Math.Linear(
      this.fireflyNight,
      want,
      Math.min(1, dt * 2)
    );
    const vis = this.fireflyNight > 0.02;
    const t = this.time.now / 1000;
    for (const f of this.fireflies) {
      if (!vis) {
        f.glow.setAlpha(0);
        f.dot.setAlpha(0);
        continue;
      }
      f.turnTimer -= dt;
      if (f.turnTimer <= 0) {
        f.angle += (Math.random() - 0.5) * 2.4;
        f.turnTimer = 0.4 + Math.random() * 1.2;
      }
      const vx = Math.cos(f.angle) * f.speed * dt;
      const vy = Math.sin(f.angle) * f.speed * dt;
      f.glow.x += vx;
      f.glow.y += vy;
      f.dot.setPosition(f.glow.x, f.glow.y - 2);
      // 出圈回巢
      const dx = f.glow.x - f.hx;
      const dy = f.glow.y - f.hy;
      if (Math.hypot(dx, dy) > 26)
        f.angle = Math.atan2(f.hy - f.glow.y, f.hx - f.glow.x);
      const blink = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.6 + f.phase));
      f.glow.setAlpha(this.fireflyNight * 0.55 * blink);
      f.dot.setAlpha(this.fireflyNight * blink);
    }
  }

  // ---- 湖面鱼影:绕湖心缓慢游动(钓鱼的视觉目标)----
  private fishShadowT = 0;
  private updateFishShadow(dt: number) {
    if (!this.fishShadow) return;
    this.fishShadowT += dt;
    const t = this.fishShadowT;
    const home = this.fishShadowHome;
    this.fishShadow.x = home.x + Math.sin(t * 0.6) * 26 + Math.sin(t * 1.7) * 6;
    this.fishShadow.y = home.y + Math.cos(t * 0.8) * 10;
    this.fishShadow.setFlipX(Math.cos(t * 0.6) < 0);
  }

  // ---- 钓鱼:栈桥按 E 甩竿,1.5s 后收鱼;走远即脱竿 ----
  private startFishing() {
    if (this.fishing) return;
    const sx = this.player.x;
    const sy = this.player.y;
    this.fishing = {
      sx,
      sy,
      timer: this.time.delayedCall(1500, () => this.fishResult(sx, sy)),
    };
    bus.emit(EV.dialog, {
      name: "湖畔",
      text: "甩竿——浮漂立在水面上，等鱼来…（走开会脱竿）",
    });
  }

  private cancelFishing() {
    if (!this.fishing) return;
    this.fishing.timer.remove(false);
    this.fishing = null;
    bus.emit(EV.dialog, null);
  }

  private fishResult(sx: number, sy: number) {
    this.fishing = null;
    if (Math.hypot(this.player.x - sx, this.player.y - sy) > 40) {
      bus.emit(EV.dialog, { name: "湖畔", text: "走远了，竿脱了手…" });
      return;
    }
    const big = Math.random() < 0.08;
    const fish = big
      ? "湖心大青鱼"
      : (["鲫鱼", "泥鳅", "小白条", "湖虾"] as const)[(Math.random() * 4) | 0];
    let count = 1;
    try {
      count =
        (parseInt(localStorage.getItem("town-fish") ?? "0", 10) || 0) + 1;
      localStorage.setItem("town-fish", String(count));
    } catch {}
    bus.emit(EV.dialog, {
      name: big ? "大鱼上钩！" : "钓到了",
      text: big
        ? `拉竿差点脱手——一条「${fish}」！这是第 ${count} 条。`
        : `一条「${fish}」，放进桶里。这是第 ${count} 条。`,
    });
  }

  // ---- 每日宝藏:按 E 挖开,当天一次;计数持久化(化妆品,不是资产)----
  private collectTreasure() {
    if (!this.treasure || this.treasureCollected) return;
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    let count = 1;
    try {
      const raw = JSON.parse(
        localStorage.getItem("town-daily") ?? "null"
      ) as { date?: string; count?: number } | null;
      count = (raw?.date === today ? raw.count ?? 0 : 0) + 1;
      localStorage.setItem("town-daily", JSON.stringify({ date: today, count }));
    } catch {}
    this.treasureCollected = true;
    this.treasure.spr.destroy();
    this.treasure = null;
    bus.emit(EV.dialog, {
      name: "小发现",
      text: `挖到今日宝藏！口袋里已经攒了 ${count} 个小玩意，明天镇上别处还会再冒出一个。`,
    });
  }

  // ---- 村民作息:入夜/下雨回屋(镇长留守望夜),天亮雨停复出 ----
  private setVillagersInside(inside: boolean) {
    this.npcs.forEach((n, i) => {
      const mustGo = inside && !(i === 0 && this.weather !== "rain");
      if (mustGo && (n.mode === "idle" || n.mode === "walk")) {
        n.mode = "toHome";
        n.spr.setFlipX(false);
        n.spr.play(`v-walk-${n.def.sheet}-down`);
      } else if (!inside && n.mode === "gone") {
        n.mode = "idle";
        n.timer = 2 + Math.random() * 4;
        n.spr.setPosition(n.home.x, n.home.y);
        n.spr.setAlpha(0).setVisible(true);
        n.spr.play(`v-idle-${n.def.sheet}`);
        this.tweens.add({ targets: n.spr, alpha: 1, duration: 380 });
      } else if (!inside && n.mode === "toHome") {
        // 条件在半路翻转(雨停/天亮):就地取消回屋,否则会走到家门口
        // 淡出成 gone,在大白天失踪一整个白天
        n.mode = "idle";
        n.timer = 1 + Math.random() * 2;
        n.spr.play(`v-idle-${n.def.sheet}`);
      }
    });
  }

  private updatePet(dt: number) {
    const c = this.pet;
    const d = Phaser.Math.Distance.Between(
      c.x,
      c.y,
      this.player.x,
      this.player.y - 4
    );
    if (d > 26 && !modalOpen) {
      const a = Phaser.Math.Angle.Between(
        c.x,
        c.y,
        this.player.x,
        this.player.y - 4
      );
      c.x += Math.cos(a) * 60 * dt;
      c.y += Math.sin(a) * 60 * dt;
      c.setFlipX(Math.cos(a) < 0);
    }
    c.setDepth(c.y);
  }

  private updateNight(dt: number) {
    // 相位:day/night 强制定格(全局单例,开场屏切换也生效);
    // real 跟随真实时钟(19:00-7:00 为夜);
    // auto 走 150s 循环(初始相位按访客本地时间)
    let t: number;
    if (TOD.mode === "day") {
      this.isNight = false;
      t = 0.12;
    } else if (TOD.mode === "night") {
      this.isNight = true;
      t = 0.55;
    } else if (TOD.mode === "real") {
      const h = new Date().getHours();
      this.isNight = h >= 19 || h < 7;
      t = this.isNight ? 0.55 : 0.12;
    } else {
      this.dayClock += dt;
      t = (this.dayBase + this.dayClock / 150) % 1;
      this.isNight = t > 0.42 && t < 0.78;
    }
    // 关键帧：正午白 → 黄昏橙 → 夜蓝 → 黎明 → 正午
    const stops: [number, [number, number, number, number]][] = [
      [0.0, [255, 244, 214, 0]],
      [0.35, [255, 176, 102, 0.22]],
      [0.5, [22, 32, 84, 0.45]],
      [0.72, [22, 32, 84, 0.45]],
      [0.86, [255, 196, 130, 0.18]],
      [1.0, [255, 244, 214, 0]],
    ];
    let a = stops[0];
    let b = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (t >= stops[i][0] && t <= stops[i + 1][0]) {
        a = stops[i];
        b = stops[i + 1];
        break;
      }
    }
    const u = (t - a[0]) / Math.max(0.0001, b[0] - a[0]);
    // alpha 是 0-1 分数,stops 第 4 位直接就是 alpha——
    // 旧代码误除 255,夜幕从上线起就几乎不可见(v5 修复)
    const mix = (i: number) => a[1][i] + (b[1][i] - a[1][i]) * u;
    const darkness = mix(3);
    this.night.setFillStyle(
      Phaser.Display.Color.GetColor(
        Math.round(mix(0)),
        Math.round(mix(1)),
        Math.round(mix(2))
      ),
      darkness
    );
    this.night.setPosition(
      this.cameras.main.scrollX,
      this.cameras.main.scrollY
    );
    // 路灯光晕:夜色越深越亮,带轻微呼吸
    for (let i = 0; i < this.lamps.length; i++) {
      const flicker = 0.92 + 0.08 * Math.sin(this.dayClock * 8 + i * 2.1);
      this.lamps[i].glow.setAlpha(Math.min(1, darkness * 2.2) * flicker);
    }
    // 环境音随昼夜与天气:白昼晴鸟鸣 / 夜晚晴虫鸣 / 雨天只留雨声
    this.audio.setAmbient(
      this.weather === "rain" ? null : this.isNight ? "crickets" : "birds"
    );
    this.audio.setRain(this.weather === "rain");
    // 村民作息:入夜或下雨回屋(镇长留守望夜),天亮雨停复出
    const wantInside = this.isNight || this.weather === "rain";
    if (wantInside !== this.insidePrev) {
      this.insidePrev = wantInside;
      this.setVillagersInside(wantInside);
    }
  }

  // ---- 交互 ----
  private nearestInteract(): {
    label: string;
    act: () => void;
    x: number;
    y: number;
  } | null {
    const px = this.player.x;
    const py = this.player.y - 4;
    // 候选收集后取最近(TS 不追踪闭包内对 let 的赋值,
    // 直接在闭包里改 best 会让收窄把 best 判成 never)
    const cands: {
      label: string;
      act: () => void;
      d: number;
      x: number;
      y: number;
    }[] = [];
    const consider = (x: number, y: number, label: string, act: () => void) => {
      const d = Phaser.Math.Distance.Between(px, py, x, y);
      if (d < INTERACT_DIST) cands.push({ label, act, d, x, y });
    };
    for (const b of buildings) {
      const d = doorOf(b);
      consider((d.x + 0.5) * TILE, (d.y + 1) * TILE, `进入${b.name}`, () =>
        this.enterBuilding(b)
      );
    }
    const nightNow = this.isNight;
    for (const n of this.npcs) {
      if (n.mode === "gone") continue; // 回屋的村民不在街上
      consider(n.spr.x, n.spr.y, `和${n.def.name}说话`, () => {
        bus.emit(EV.dialog, {
          name: n.def.name,
          text: this.villagerLine(n, nightNow),
        });
      });
    }
    for (const p of this.plates) {
      consider(p.x, p.y - 6, `看${p.b.name}的门牌`, () => {
        modalOpen = true;
        bus.emit(EV.panel, {
          title: p.b.name,
          blurb: p.b.blurb,
          link: p.b.link,
        });
      });
    }
    // 搜索水晶球与标签图腾(内容按构建期 tags 数据,没排到的图腾无字)
    consider(
      (ORB_SPOT.tx + 0.5) * TILE,
      (ORB_SPOT.ty + 1) * TILE,
      "搜一搜文章",
      () => {
        modalOpen = true;
        bus.emit(EV.search, true);
      }
    );
    const tags = townData().tags;
    TOTEM_SPOTS.forEach(([tx, ty], i) => {
      const tag = tags[i];
      consider(
        (tx + 0.5) * TILE,
        (ty + 1) * TILE,
        tag ? `看 #${tag.name} 图腾` : "看无字图腾",
        () => {
          if (!tag) {
            bus.emit(EV.dialog, {
              name: "无字图腾",
              text: "这根图腾还没刻上字，等下一篇热门文章吧。",
            });
            return;
          }
          modalOpen = true;
          bus.emit(EV.list, { kind: "tag", index: i });
        }
      );
    });
    // 镇口黑板:每日一句(构建期按日期从文章确定性抽取,同一天全站一致)
    const quote = townData().quote;
    consider(
      (BOARD_SPOT.tx + 0.5) * TILE,
      (BOARD_SPOT.ty + 1) * TILE,
      "看看今日一句",
      () => {
        bus.emit(EV.dialog, {
          name: "镇口黑板",
          text: quote
            ? `${quote.text} ——《${quote.from}》`
            : "今天黑板还没写字，站长偷懒了。",
        });
      }
    );
    // 许愿井:按 E 许愿,井里回荡一篇旧文的书名(随机,每次不同)
    const wellPosts = townData().posts;
    consider(
      (WELL_SPOT.tx + 0.5) * TILE,
      (WELL_SPOT.ty + 1) * TILE,
      "许个愿",
      () => {
        const p = wellPosts.length
          ? wellPosts[(Math.random() * wellPosts.length) | 0]
          : null;
        bus.emit(EV.dialog, {
          name: "许愿井",
          text: p
            ? `你朝井口许了个愿，井里回荡起一串书名：《${p.t}》。`
            : "井水静静的，还没听过后来的故事。",
        });
      }
    );
    // 萤火虫(未捉到的;只在夜里可见时才作为交互点,白天隐形不提示)
    if (this.fireflyNight > 0.3) {
      for (const ff of this.fireflies) {
        consider(ff.glow.x, ff.glow.y + 8, "捉萤火虫", () =>
          this.catchFirefly(ff)
        );
      }
    }
    // 湖心岛栈桥钓鱼
    consider(
      LAKE_FISH_SPOT.x,
      LAKE_FISH_SPOT.y,
      "在栈桥上钓鱼",
      () => this.startFishing()
    );
    // 每日宝藏(当天已挖则无标记无交互)
    if (this.treasure && !this.treasureCollected) {
      const t = this.treasure;
      consider(t.spr.x, t.spr.y - 4, "挖开看看", () => this.collectTreasure());
    }
    return cands.length ? cands.reduce((a, b) => (b.d < a.d ? b : a)) : null;
  }

  // 捉到萤火虫:持久化、放彩蛋文案、报 HUD 计数;捉满放烟花
  private catchFirefly(ff: (typeof this.fireflies)[number]) {
    this.fireflies = this.fireflies.filter(f => f !== ff);
    ff.glow.destroy();
    ff.dot.destroy();
    this.caughtFireflies.add(ff.id);
    try {
      localStorage.setItem(
        "town-fireflies",
        [...this.caughtFireflies].join(",")
      );
    } catch {}
    this.audio.pop();
    bus.emit(EV.collect, {
      caught: this.caughtFireflies.size,
      total: FIREFLY_SPOTS.length,
    });
    bus.emit(EV.dialog, { name: "萤火虫", text: this.fireflyEgg(ff.id) });
    if (this.caughtFireflies.size === FIREFLY_SPOTS.length) {
      this.time.delayedCall(1400, () => this.celebrate());
    }
  }

  // 每只萤火虫对应一枚彩蛋:站点的旧文、功能与秘密
  private fireflyEgg(id: string): string {
    const posts = townData().posts;
    const oldest = posts[posts.length - 1];
    const eggs: Record<string, string> = {
      "0": oldest
        ? `这只萤火虫绕着老树转——镇子最老的一篇文字写于 ${oldest.d}：《${oldest.t}》。`
        : "这只萤火虫绕着老树转，像在数镇子的年轮。",
      "1": "它落在水晶球上——搜索不必进书屋，广场上这颗球随查随用。",
      "2": "它飞向路灯——按 M 打开地图，点建筑就能瞬间飞过去。",
      "3": "它钻进了小屋——床头的照片里藏着站长的社交出口，去过吗？",
      "4": "它停在图腾顶上——按 P 可以给小镇拍一张像素纪念照。",
      "5": "最后一只钻进邮局——镇子的素材与出处都写在 /town/ASSETS.md。",
    };
    return eggs[id] ?? "它在你手心亮了一下，飞走了。";
  }

  // 节令烟花:广场上空一串彩色爆点(捉满萤火虫 / 新年头三天 / ?fireworks=1)
  private celebrate(bursts = 6) {
    const cam = this.cameras.main;
    for (let i = 0; i < bursts; i++) {
      this.time.delayedCall(i * 460, () => {
        const x = cam.midPoint.x + Phaser.Math.Between(-110, 110);
        const y = cam.midPoint.y - Phaser.Math.Between(40, 100);
        const tint = Phaser.Display.Color.HSVToRGB(
          ((i * 55) % 360) / 360,
          0.85,
          1
        ).color;
        const em = this.add.particles(x, y, "gen-spark", {
          speed: { min: 28, max: 92 },
          lifespan: 850,
          gravityY: 55,
          quantity: 26,
          frequency: -1,
          tint,
          blendMode: "ADD",
        });
        em.setDepth(10_003);
        em.explode(26);
        this.audio.pop();
        this.time.delayedCall(1000, () => em.destroy());
      });
    }
  }

  // 村民台词:三成概率聊最新文章(构建期 latest 数据),让镇子「知道」博客更新了
  private villagerLine(
    n: { def: (typeof npcDefs)[number]; li: number },
    nightNow: boolean
  ): string {
    const latest = townData().latest;
    if (latest && Math.random() < 0.3) {
      const gossips = [
        `听说了吗？书屋新来了本《${latest.title}》。`,
        `邮差刚送来的新书，《${latest.title}》，说是站长亲笔。`,
        `最近镇上都在聊《${latest.title}》，你看过没？`,
      ];
      return gossips[(Math.random() * gossips.length) | 0];
    }
    const pool = nightNow && n.def.nightLines ? n.def.nightLines : n.def.lines;
    return pool[n.li++ % pool.length];
  }

  private updatePrompt() {
    const it = modalOpen ? null : this.nearestInteract();
    const label = it ? it.label : "";
    if (label !== this.lastPrompt) {
      this.lastPrompt = label;
      bus.emit(EV.prompt, label || null);
    }
    this.current = it;
    // 交互提示气泡跟随最近交互点(比纯底部文字更显眼)
    if (it) this.hint.setVisible(true).setPosition(it.x, it.y - 20);
    else this.hint.setVisible(false);
  }
  private current: { label: string; act: () => void } | null = null;

  private interact() {
    if (modalOpen) {
      closeOverlays();
      modalOpen = false;
      return;
    }
    this.current = this.nearestInteract();
    if (this.current) this.current.act();
  }

  private enterBuilding(b: BuildingDef) {
    if (this.transitioning) return;
    this.transitioning = true;
    this.audio.door(true);
    this.cameras.main.fadeOut(260, 10, 12, 20);
    this.time.delayedCall(280, () => this.scene.start("interior", { b }));
  }

  // 小地图点图传送:瞬移到目标建筑门口(室内场景由 InteriorScene 出屋处理)
  private travelTo(id: string) {
    const b = buildings.find(x => x.id === id);
    if (!b || this.transitioning) return;
    const d = doorOf(b);
    this.player.x = (d.x + 0.5) * TILE;
    this.player.y = (d.y + 1.6) * TILE;
    this.player.setDepth(this.player.y);
    this.wasOnPad = true; // 落点与出生点同规则,不触发门前格
    this.cameras.main.centerOn(this.player.x, this.player.y);
    this.cameras.main.flash(140, 10, 12, 20);
    this.audio.door(false);
  }
}

// ---------------------------------------------------------------- 室内

export class InteriorScene extends Phaser.Scene {
  private b!: BuildingDef;
  private player!: Phaser.GameObjects.Sprite;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private lastPrompt = "";
  private current: { label: string; act: () => void } | null = null;
  private exitX = 0;
  // 进门宽限期:格言展示期间(约 3.5s)按 E 只关格言不触发家具交互
  private entryGrace = 0;
  private hint!: Phaser.GameObjects.Image;
  private padAWasDown = false;

  constructor() {
    super("interior");
  }

  init(data: { b: BuildingDef }) {
    this.b = data.b;
  }

  create() {
    registerAnims(this);
    modalOpen = false;
    this.lastPrompt = "\u0000reset";
    const { w, h } = this.b.interior;
    const W = w * TILE;
    const H = h * TILE;
    const cv = this.add.renderTexture(0, 0, W, H).setOrigin(0);

    // 程序化室内：石泥墙两行 + 木地板 + 家具（本站原创纹理）
    const { wall, floor } = buildIndoorVariants();
    wall.forEach((c, i) => this.textures.addCanvas(`town-wall-v${i}`, c));
    floor.forEach((c, i) => this.textures.addCanvas(`town-floor-v${i}`, c));
    FURN_KINDS.forEach(k =>
      this.textures.addCanvas(`gen-furn-${k}`, buildFurniture(k))
    );
    this.textures.addCanvas("gen-diary", buildDiary());
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y <= 1) {
          cv.draw(`town-wall-v${(x + y) % 2}`, x * TILE, y * TILE);
        } else {
          cv.draw(`town-floor-v${(x * 3 + y * 5) % 2}`, x * TILE, y * TILE);
        }
      }
    }
    this.exitX = (w >> 1) * TILE + TILE / 2;
    cv.draw("sv-door", (w >> 1) * TILE, TILE);

    for (const f of this.b.interior.furniture) {
      // furn-* 用 MC Home 裁切件,crate/barrel 用 extract 生成的独立文件,
      // 其余走程序化家具纹理;多格家具锚定整段中底,flat 地毯压在地板层
      const span = f.w ?? 1;
      const tex = f.img.startsWith("furn-")
        ? f.img
        : f.img === "crate"
          ? "gen-crate"
          : f.img === "barrel"
            ? "gen-barrel"
            : `gen-furn-${f.img}`;
      const img = this.add
        .image((f.x + span / 2) * TILE, (f.y + 1) * TILE, tex)
        .setOrigin(0.5, 1);
      img.setDepth(f.flat ? 1 : (f.y + 1) * TILE);
    }

    // 日记本(书屋内):小件道具,可翻
    if (this.b.interior.diary) {
      const d = this.b.interior.diary;
      const book = this.add
        .image(d.x * TILE + TILE / 2, (d.y + 1) * TILE, "gen-diary")
        .setOrigin(0.5, 1);
      book.setDepth((d.y + 1) * TILE);
    }

    this.player = this.add
      .sprite(this.exitX, 3.6 * TILE, "gen-slime", 0)
      .setOrigin(0.5, 0.9);
    this.player.play("slime-idle");
    this.player.setDepth(this.player.y);
    this.hint = this.add
      .image(0, 0, "gen-hint")
      .setOrigin(0.5, 1)
      .setDepth(20_000)
      .setVisible(false);

    if (this.b.interior.npc) {
      // 人形老板：站柜台位，呼吸待机
      const npc = this.b.interior.npc;
      const boss = this.add
        .sprite(4.5 * TILE, 3.6 * TILE, `char-${npc.sheet}`, 0)
        .setOrigin(0.5, 1);
      boss.play(`v-idle-${npc.sheet}`);
      boss.setDepth(boss.y);
    }

    const cam = this.cameras.main;
    cam.setBackgroundColor("#171310");
    cam.setRoundPixels(true);
    this.applyZoom();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.applyZoom, this);
    cam.fadeIn(260, 10, 12, 20);
    // 进门先看屋名牌:格言以主人语气打招呼(随淡入一起出现)
    this.entryGrace = 3.5;
    bus.emit(EV.dialog, { name: this.b.name, text: this.b.interior.motto });

    const kb = this.input.keyboard!;
    this.keys = kb.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE") as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;
    kb.on("keydown-E", () => this.interact());
    kb.on("keydown-SPACE", () => this.interact());
    kb.on("keydown-ESC", () => {
      if (modalOpen) {
        modalOpen = false;
        bus.emit(EV.panel, null);
      }
    });
    bindBus(this, EV.touchAct, () => this.interact());
    bindBus(
      this,
      EV.touchDir,
      (t: { dx: number; dy: number; pressed: boolean }) => {
        touch.dx = t.dx;
        touch.dy = t.dy;
        touch.pressed = t.pressed;
      }
    );
    bindBus(this, EV.panel, (p: unknown) => {
      if (!p) modalOpen = false;
    });
    // 日记浮层合上 = 解锁输入
    bindBus(this, EV.diary, () => {
      modalOpen = true;
    });
    // HUD 侧浮层(列表面板/搜索)关闭 = 解锁输入
    bindBus(this, EV.list, (p: ListRequest | null) => {
      if (!p) modalOpen = false;
    });
    bindBus(this, EV.search, (open: boolean) => {
      if (!open) modalOpen = false;
    });
    // 小地图传送:从室内直接出屋到目标建筑门口
    bindBus(this, EV.travel, (id: string) => {
      this.cameras.main.fadeOut(240, 10, 12, 20);
      this.time.delayedCall(260, () =>
        this.scene.start("world", { spawnAt: id })
      );
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.applyZoom, this);
      cv.destroy();
    });
  }

  private applyZoom() {
    const { width, height } = this.scale.gameSize;
    const W = this.b.interior.w * TILE;
    const H = this.b.interior.h * TILE;
    // 室内整体居中：整数倍放大封顶 4x，放不下则缩到 1x
    const z = Phaser.Math.Clamp(
      Math.floor(Math.min(width / W, height / H)),
      1,
      4
    );
    this.cameras.main.setZoom(z);
    this.cameras.main.centerOn(W / 2, H / 2);
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.entryGrace = Math.max(0, this.entryGrace - dt);
    const k = this.keys;
    let dx = 0;
    let dy = 0;
    if (!modalOpen) {
      if (k.A.isDown || k.LEFT.isDown) dx -= 1;
      if (k.D.isDown || k.RIGHT.isDown) dx += 1;
      if (k.W.isDown || k.UP.isDown) dy -= 1;
      if (k.S.isDown || k.DOWN.isDown) dy += 1;
      if (touch.pressed) {
        dx += touch.dx;
        dy += touch.dy;
      }
      // 手柄:左摇杆 + 十字键,A 键边沿触发交互
      const pad = this.input.gamepad?.pad1;
      if (pad) {
        const ax = pad.axes.length ? pad.axes[0].getValue() : 0;
        const ay = pad.axes.length ? pad.axes[1].getValue() : 0;
        if (Math.abs(ax) > 0.25) dx += Math.sign(ax);
        if (Math.abs(ay) > 0.25) dy += Math.sign(ay);
        if (pad.left) dx -= 1;
        if (pad.right) dx += 1;
        if (pad.up) dy -= 1;
        if (pad.down) dy += 1;
        const aDown = pad.A;
        if (aDown && !this.padAWasDown) this.interact();
        this.padAWasDown = aDown;
      }
    }
    dx = Phaser.Math.Clamp(dx, -1, 1);
    dy = Phaser.Math.Clamp(dy, -1, 1);
    const len = Math.hypot(dx, dy) || 1;
    // 室内碰撞：一圈墙 + 家具格(flat 地毯可踩,多格家具整段挡)
    const solid = (px: number, py: number) => {
      const tx = Math.floor(px / TILE);
      const ty = Math.floor(py / TILE);
      const { w, h } = this.b.interior;
      if (tx < 0 || ty < 2 || tx >= w || ty >= h) return true;
      return this.b.interior.furniture.some(
        f =>
          !f.flat &&
          ty === f.y &&
          tx >= f.x &&
          tx < f.x + (f.w ?? 1)
      );
    };
    const vx = (dx / len) * SPEED * dt;
    const vy = (dy / len) * SPEED * dt;
    if (dx !== 0) this.player.setFlipX(dx < 0);
    if (dx !== 0 && !solid(this.player.x + vx, this.player.y - 4))
      this.player.x += vx;
    if (dy !== 0 && !solid(this.player.x, this.player.y + vy - 4))
      this.player.y += vy;
    this.player.setDepth(this.player.y);

    // 出口：走到门口格自动出门
    if (
      !modalOpen &&
      this.player.y < 2.6 * TILE &&
      Math.abs(this.player.x - this.exitX) < 10
    ) {
      this.leave();
      return;
    }

    // 交互候选统一裁决(与室外 nearestInteract 同构):
    // 老板 / 日记 / 友链村民 / 家具(带 act 的联动家具优先弹列表面板)
    const cands: {
      label: string;
      act: () => void;
      d: number;
      x: number;
      y: number;
    }[] = [];
    const add = (x: number, y: number, label: string, act: () => void) => {
      const d = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        x,
        y
      );
      if (d < 26) cands.push({ label, act, d, x, y });
    };
    const npc = this.b.interior.npc;
    if (npc) {
      add(4.5 * TILE, 2.6 * TILE, `和${npc.name}说话`, () => {
        bus.emit(EV.dialog, { name: npc.name, text: npc.text });
      });
    }
    if (this.b.interior.diary) {
      const d = this.b.interior.diary;
      add(d.x * TILE + TILE / 2, (d.y + 1) * TILE, "翻翻日记", () => {
        modalOpen = true;
        bus.emit(EV.diary);
      });
    }
    let archiveN = 0;
    for (const f of this.b.interior.furniture) {
      if (f.flat) continue; // 地毯类纯装饰,不进交互候选
      const fw = f.w ?? 1;
      const fx = (f.x + fw / 2) * TILE;
      const fy = (f.y + 1) * TILE;
      if (f.act) {
        const kind = f.act;
        const idx = f.act === "archive" ? archiveN++ : undefined;
        add(fx, fy, ACT_LABEL[f.act], () => {
          modalOpen = true;
          bus.emit(EV.list, { kind, index: idx });
        });
      } else {
        // 无联动的家具:走近读一句屋内文案
        add(fx, fy, "看看这个", () => {
          bus.emit(EV.dialog, {
            name: this.b.name,
            text: FURN_LOOKS[f.img] ?? "……",
          });
        });
      }
    }
    const it: { label: string; act: () => void; x: number; y: number } | null =
      cands.length ? cands.reduce((a, b) => (b.d < a.d ? b : a)) : null;
    const label = it ? it.label : "";
    if (label !== this.lastPrompt) {
      this.lastPrompt = label;
      bus.emit(EV.prompt, label || null);
    }
    this.current = it;
    if (it) this.hint.setVisible(true).setPosition(it.x, it.y - 20);
    else this.hint.setVisible(false);
  }

  private interact() {
    // 面板/列表/搜索开着时按 E/空格 = 全部关掉(等价点「合上/回到小镇」)
    if (modalOpen) {
      closeOverlays();
      modalOpen = false;
      return;
    }
    // 进门格言还在展示期时,E 只负责关格言——出生点往往就在门口家具的
    // 交互半径内(书屋出生点够到书架),此时按 E 会误触弹出归档列表
    if (this.entryGrace > 0) {
      this.entryGrace = 0;
      bus.emit(EV.dialog, null);
      return;
    }
    if (this.current) this.current.act();
  }

  private leave() {
    this.cameras.main.fadeOut(240, 10, 12, 20);
    this.time.delayedCall(260, () =>
      this.scene.start("world", { spawnAt: this.b.id })
    );
  }
}

// ---------------------------------------------------------------- 启动

export function startTown(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: "#4d8a55",
    input: { gamepad: true },
    scale: {
      mode: Phaser.Scale.RESIZE,
      // 容器塌成 0(面板折叠/最小化/布局未就绪)时,RESIZE 会把画布与
      // 渲染目标缩到 0x0——WebGL 建 0 尺寸帧缓冲抛
      // "Framebuffer status: Incomplete Attachment" 且游戏黑屏,
      // 故钳制最小尺寸(实际踩坑)
      width: Math.max(320, parent.clientWidth),
      height: Math.max(240, parent.clientHeight),
      min: {
        width: 320,
        height: 240,
      },
    },
    scene: [WorldScene, InteriorScene],
  });
}
