// 场景引擎：WorldScene（小镇室外）与 InteriorScene（建筑室内）。
// 架构对齐 Pixels 客户端的单机简化版：
// - 地面/碰撞用 tilemap + 自制 solid 网格（分轴移动 = 贴墙滑动）
// - 树/房子/NPC/玩家按「脚底 y」做深度排序（伪 2.5D 遮挡）
// - 相机整数倍缩放 + roundPixels 保像素锐利
// - 交互 = 统一查最近交互点，事件总线通知 DOM HUD

import Phaser from "phaser";
import {
  TILE,
  SHEETS,
  buildGroundVariants,
  GROUND,
  CLIFF,
  DECOR,
  FENCE,
  PLAYER48,
  SLIME,
  GEN_IMAGES,
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
  QUEST,
  Ground,
  type BuildingDef,
} from "./world";
import {
  bus,
  EV,
  G,
  loadSave,
  applySave,
  persist,
  addEnergy,
  toast,
  STAGE_MS,
  type CropState,
} from "./state";

const SPEED = 88;
const INTERACT_DIST = 30;

let loadSaveApplied = false;

type Dir = "down" | "side" | "up";

function bindBus(scene: Phaser.Scene, ev: string, fn: (...a: never[]) => void) {
  bus.on(ev, fn);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => bus.off(ev, fn));
}

function registerAnims(scene: Phaser.Scene) {
  if (scene.anims.exists("p-walk-down")) return;
  // 玩家：Mystic player（行 0-2 待机 4 帧、行 3-5 行走 6 帧）
  const dirs: [Dir, number[], number[], number[]][] = [
    ["down", PLAYER48.idle.down, PLAYER48.walk.down, PLAYER48.axe.down],
    ["side", PLAYER48.idle.side, PLAYER48.walk.side, PLAYER48.axe.side],
    ["up", PLAYER48.idle.up, PLAYER48.walk.up, PLAYER48.axe.up],
  ];
  for (const [dir, idle, walk, axe] of dirs) {
    scene.anims.create({
      key: `p-walk-${dir}`,
      frames: walk.map(n => ({ key: "mystic-player", frame: n })),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: `p-idle-${dir}`,
      frames: idle.map(n => ({ key: "mystic-player", frame: n })),
      frameRate: 4,
      repeat: -1,
    });
    scene.anims.create({
      key: `p-axe-${dir}`,
      frames: axe.map(n => ({ key: "mystic-player", frame: n })),
      frameRate: 9,
      repeat: 0,
    });
  }
  // Mystic 史莱姆 NPC/宠物：行 0 = 待机 4 帧
  if (!scene.anims.exists("slime-idle")) {
    scene.anims.create({
      key: "slime-idle",
      frames: scene.anims.generateFrameNumbers("mystic-slime", { frames: SLIME.idle }),
      frameRate: 4,
      repeat: -1,
    });
  }
}

function sheetCols(key: string): number {
  return SHEETS.find(s => s.key === key)?.cols ?? 1;
}

// 把任意 sheet 的连续 w×h 格拼成独立贴图（多格树、床、房子等一次绘制）
function makeTileTexture(
  scene: Phaser.Scene,
  key: string,
  sheetKey: string,
  frame: number,
  wTiles: number,
  hTiles: number
) {
  if (scene.textures.exists(key)) return key;
  const cols = sheetCols(sheetKey);
  const src = scene.textures.get(sheetKey).getSourceImage() as HTMLImageElement;
  const cv = document.createElement("canvas");
  cv.width = TILE * wTiles;
  cv.height = TILE * hTiles;
  const ctx = cv.getContext("2d")!;
  const sc = (frame % cols) * TILE;
  const sr = ((frame / cols) | 0) * TILE;
  ctx.drawImage(src, sc, sr, TILE * wTiles, TILE * hTiles, 0, 0, TILE * wTiles, TILE * hTiles);
  scene.textures.addCanvas(key, cv);
  return key;
}

// 程序化 Mystic 石屋（木屋顶 + 石墙 + 木门 + 店招，wTiles x hTiles）
function makeMysticHouse(
  scene: Phaser.Scene,
  id: string,
  wTiles: number,
  hTiles: number,
  name: string
) {
  const key = `gen-house-${id}`;
  if (scene.textures.exists(key)) return key;
  const walls = scene.textures.get("mystic-walls").getSourceImage() as HTMLImageElement;
  const wooden = scene.textures.get("mystic-wooden").getSourceImage() as HTMLImageElement;
  const door = scene.textures.get("mystic-door").getSourceImage() as HTMLImageElement;
  const cv = document.createElement("canvas");
  cv.width = TILE * wTiles;
  cv.height = TILE * hTiles;
  const ctx = cv.getContext("2d")!;
  const cell = (sheet: HTMLImageElement, col: number, row: number, dx: number, dy: number) => {
    ctx.drawImage(sheet, col * TILE, row * TILE, TILE, TILE, dx * TILE, dy * TILE, TILE, TILE);
  };
  // row0：木地板横排做屋顶
  for (let x = 0; x < wTiles; x++) cell(wooden, 1 + (x % 4), 0, x, 0);
  // row1：墙顶冠 + 石墙
  cell(walls, 0, 0, 0, 1);
  for (let x = 1; x < wTiles; x++) cell(walls, 1, 0, x, 1);
  // row2+：石墙
  for (let y = 2; y < hTiles; y++)
    for (let x = 0; x < wTiles; x++) cell(walls, 1, 0, x, y);
  // 木门（底行中央）
  const doorX = Math.floor(wTiles / 2);
  ctx.drawImage(door, 0, 0, TILE, TILE, doorX * TILE, (hTiles - 1) * TILE, TILE, TILE);
  // 店招（门旁）
  ctx.fillStyle = "#5f4126";
  ctx.fillRect(2, cv.height - 22, 22, 15);
  ctx.fillStyle = "#b98a56";
  ctx.fillRect(3, cv.height - 21, 20, 13);
  ctx.fillStyle = "#fffdf5";
  ctx.font = "9px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name, 13, cv.height - 14);
  scene.textures.addCanvas(key, cv);
  return key;
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
  private groundData!: Uint8Array;
  private groundRt!: Phaser.GameObjects.RenderTexture;
  private player!: Phaser.GameObjects.Sprite;
  private facing: Dir = "down";
  private tool = 0;
  private lastPrompt = "";
  private npcs: { spr: Phaser.GameObjects.Sprite; def: (typeof npcDefs)[number]; li: number }[] = [];
  private chicken!: Phaser.GameObjects.Sprite;
  private night!: Phaser.GameObjects.Rectangle;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private cropSprites = new Map<string, Phaser.GameObjects.Image>();
  private chopTargets = new Map<string, { sheet: string; frame: number; tx: number; ty: number; w: number; h: number; img: Phaser.GameObjects.Image }>();
  private treeSprites: Phaser.GameObjects.Image[] = [];
  private actionUntil = 0;
  private saveTimer!: Phaser.Time.TimerEvent;
  private doorPads!: Map<string, BuildingDef>;
  private transitioning = false;
  private wasOnPad = true; // 边沿触发：出生/出门站在门前格时不立即吸回

  constructor() {
    super("world");
  }

  preload() {
    this.load.setPath("/town/");
    for (const s of SHEETS) {
      this.load.spritesheet(s.key, s.file, {
        frameWidth: s.frameWidth,
        frameHeight: s.frameHeight,
      });
    }
    for (const img of GEN_IMAGES) {
      this.load.image(img, `gen/${img.replace("gen-", "")}.png`);
    }
  }

  create(data: { spawnAt?: string } = {}) {
    try {
    registerAnims(this);
    modalOpen = false;
    this.transitioning = false;
    // 场景重启是同一实例：重置提示去重，强制第一帧刷新 HUD
    this.lastPrompt = "\u0000reset";

    // 存档（首次进入恢复，之后仅读内存态）
    if (!loadSaveApplied) {
      const s = loadSave();
      if (s) applySave(s);
      loadSaveApplied = true;
    }

    // ---- 地面（RenderTexture 一次绘制：草/泥/耕地三态）----
    this.groundData = buildGround();
    this.groundRt = this.add
      .renderTexture(0, 0, WORLD_W * TILE, WORLD_H * TILE)
      .setOrigin(0);
    // 草地/泥地变体：程序化生成（草色采样自 grass.png，泥色采样自 plains 中心格）
    const grassSrc = this.textures.get("mystic-grass").getSourceImage() as HTMLImageElement;
    const grassCanvas = document.createElement("canvas");
    grassCanvas.width = 16;
    grassCanvas.height = 16;
    grassCanvas.getContext("2d")!.drawImage(grassSrc, 0, 0, 16, 16);
    const grassColor = grassCanvas.getContext("2d")!.getImageData(8, 8, 1, 1).data;
    const plainsSrc = this.textures.get("mystic-plains").getSourceImage() as HTMLImageElement;
    const plainsCanvas = document.createElement("canvas");
    plainsCanvas.width = 16;
    plainsCanvas.height = 16;
    // plains frame 14 = (col2,row2) 大泥补丁中心
    plainsCanvas.getContext("2d")!.drawImage(plainsSrc, 32, 32, 16, 16, 0, 0, 16, 16);
    const dirtColor = plainsCanvas.getContext("2d")!.getImageData(8, 8, 1, 1).data;
    buildGroundVariants([grassColor[0], grassColor[1], grassColor[2]], "grass").forEach(
      (cv, i) => this.textures.addCanvas(`mystic-grass-v${i}`, cv)
    );
    buildGroundVariants([dirtColor[0], dirtColor[1], dirtColor[2]], "dirt").forEach(
      (cv, i) => this.textures.addCanvas(`gen-dirt-v${i}`, cv)
    );
    for (let y = 0; y < WORLD_H; y++) {
      for (let x = 0; x < WORLD_W; x++) {
        const v = this.groundData[y * WORLD_W + x];
        if (v === Ground.DIRT) {
          // 泥路：程序化泥地变体（含泥点纹理）
          this.groundRt.draw(`gen-dirt-v${(x * 11 + y * 7) % 4}`, x * TILE, y * TILE);
        } else if (v === Ground.TILLED) {
          // 耕地：程序化泥底 + 犁纹
          this.groundRt.draw(`gen-dirt-v${(x * 11 + y * 7) % 4}`, x * TILE, y * TILE);
          
        } else {
          this.groundRt.draw(`mystic-grass-v${(x * 7 + y * 13) % 4}`, x * TILE, y * TILE);
        }
      }
    }

    // 程序化 Mystic 石屋（木屋顶 + 石墙 + 木门 + 店招）
    for (const b of buildings) makeMysticHouse(this, b.id, b.w, b.h, b.name);

    // ---- 碰撞网格与装饰物 ----
    this.solid = new Uint8Array(WORLD_W * WORLD_H);
    const mark = (x: number, y: number) => {
      if (x >= 0 && y >= 0 && x < WORLD_W && y < WORLD_H) this.solid[y * WORLD_W + x] = 1;
    };
    for (const p of buildProps()) {
      const w = p.cols ?? 1;
      const h = p.rows ?? 1;
      let img: Phaser.GameObjects.Image;
      if (p.image) {
        // 程序化生成的独立纹理
        img = this.add.image(p.tx * TILE, (p.ty + h) * TILE, p.image).setOrigin(0, 1);
      } else {
        const key = makeTileTexture(this, `prop-${p.sheet}-${p.frame}-${w}x${h}`, p.sheet, p.frame, w, h);
        img = this.add.image(p.tx * TILE, (p.ty + h) * TILE, key).setOrigin(0, 1);
      }
      img.setDepth((p.ty + h) * TILE);
      if (p.chop) {
        // 可砍树：底行中央格作为交互锚点；玩家经过树冠时树冠半透明
        this.chopTargets.set(`${p.tx},${p.ty + h - 1}`, {
          sheet: p.sheet, frame: p.frame, tx: p.tx, ty: p.ty, w, h, img,
        });
        this.treeSprites.push(img);
      }
      if (p.solid) {
        const solidRows = h >= 3 ? 1 : h;
        for (let j = 0; j < solidRows; j++)
          for (let i = 0; i < w; i++) mark(p.tx + i, p.ty + h - 1 - j);
      }
    }
    for (const b of buildings) {
      const img = this.add
        .image(b.tx * TILE, (b.ty + b.h) * TILE, `gen-house-${b.id}`)
        .setOrigin(0, 1);
      img.setDepth((b.ty + b.h) * TILE);
      const rows = solidRowsOf(b);
      for (let y = b.ty + b.h - rows; y < b.ty + b.h; y++) {
        for (let x = b.tx; x < b.tx + b.w; x++) mark(x, y);
      }
    }


    // ---- 玩家 ----
    const saved = loadSave();
    let sx = 32 * TILE;
    let sy = 23 * TILE;
    if (data.spawnAt) {
      const b = buildings.find(x => x.id === data.spawnAt)!;
      const d = doorOf(b);
      sx = (d.x + 0.5) * TILE;
      sy = (d.y + 1.6) * TILE;
    } else if (saved?.x && saved?.y) {
      sx = saved.x;
      sy = saved.y;
    }
    this.player = this.add
      .sprite(sx, sy, "mystic-player", PLAYER48.idle.down[0])
      .setOrigin(0.5, 0.92);
    // 存档位置若陷进墙体（改版/异常存档），退回默认出生点防卡死
    if (this.blocked(sx, sy)) {
      this.player.x = 32 * TILE;
      this.player.y = 23 * TILE;
    }
    this.player.setDepth(this.player.y);

    // 门前格注册：踩上即自动进门（与室内「走到底自动出门」对称）
    this.doorPads = new Map(
      buildings.map(b => {
        const d = doorOf(b);
        return [`${d.x},${d.y + 1}`, b] as const;
      })
    );

    // ---- NPC 与鸡 ----
    for (const def of npcDefs) {
      // Mystic 史莱姆村民：tint 区分个体
      const spr = this.add
        .sprite((def.tx + 0.5) * TILE, (def.ty + 1) * TILE, "mystic-slime", 0)
        .setOrigin(0.5, 1);
      if (def.tint) spr.setTint(def.tint);
      spr.play("slime-idle");
      spr.setDepth(spr.y);
      this.npcs.push({ spr, def, li: 0 });
    }
    // 跟随宠物：小史莱姆
    this.chicken = this.add
      .sprite(46 * TILE, 30 * TILE, "mystic-slime", 0)
      .setOrigin(0.5, 1)
      .setScale(0.7);
    this.chicken.play("slime-idle");
    this.chicken.setDepth(this.chicken.y);

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
    this.scale.on(Phaser.Scale.Events.RESIZE, this.applyZoom, this);

    // ---- 输入 ----
    const kb = this.input.keyboard!;
    this.keys = kb.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,J,ONE,TWO,THREE") as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;
    kb.on("keydown-E", () => this.interact());
    kb.on("keydown-SPACE", () => this.interact());
    kb.on("keydown-J", () => this.useTool());
    kb.on("keydown-ONE", () => this.selectTool(0));
    kb.on("keydown-TWO", () => this.selectTool(1));
    kb.on("keydown-THREE", () => this.selectTool(2));
    bindBus(this, EV.touchAct, () => this.interact());
    bindBus(this, EV.touchUse, () => this.useTool());
    bindBus(this, EV.touchDir, (t: { dx: number; dy: number; pressed: boolean }) => {
      touch.dx = t.dx;
      touch.dy = t.dy;
      touch.pressed = t.pressed;
    });
    bindBus(this, EV.tool, (i: number) => (this.tool = i));

    // ---- 恢复耕地与作物 ----
    for (const [key, cs] of G.crops) {
      const [x, y] = key.split(",").map(Number);
      this.groundRt.draw(`gen-dirt-v${(x * 11 + y * 7) % 4}`, x * TILE, y * TILE);
      this.groundData[y * WORLD_W + x] = Ground.TILLED;
      this.spawnCropSprite(key, cs);
    }

    bus.emit(EV.energy, G.energy);
    bus.emit(EV.quest, { delivered: G.quest, need: QUEST.need, done: G.questDone });

    if (this.debugOn) {
      this.debugGfx = this.add.graphics().setDepth(99998);
      kb.on("keydown-D", () => {
        this.debugOn = !this.debugOn;
        this.debugGfx.setVisible(this.debugOn);
      });
    }

    this.saveTimer = this.time.addEvent({
      delay: 8000,
      loop: true,
      callback: () => persist(this.player.x, this.player.y),
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.applyZoom, this);
      persist(this.player.x, this.player.y);
    });
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
        : Phaser.Math.Clamp(Math.round(Math.min(width / (24 * TILE), height / (15 * TILE))), 2, 5);
    this.cameras.main.setZoom(zoom);
    this.night.setSize(width, height);
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.movePlayer(dt);
    this.updateChicken(dt);
    this.growCrops();
    this.updateNight(_time);
    // 树冠半透明：玩家位于树后（被遮挡）时降低树透明度，避免看不清
    for (const t of this.chopTargets.values()) {
      const topY = t.ty * TILE;
      const bottomY = (t.ty + t.h) * TILE;
      const overlap =
        this.player.y < bottomY &&
        this.player.y > topY + 6 &&
        Math.abs(this.player.x - (t.tx + t.w / 2) * TILE) < (t.w * TILE) / 2 + 6;
      t.img.setAlpha(overlap ? 0.55 : 1);
    }
    this.updatePrompt();

    // 调试边框：solid 格红、prop 绿、建筑黄、玩家碰撞盒白（?debug=1 或按 D 切换）
    if (this.debugOn && this.debugGfx) {
      const g = this.debugGfx;
      g.clear();
      g.lineStyle(1, 0xff4444, 0.9);
      for (let y = 0; y < WORLD_H; y++)
        for (let x = 0; x < WORLD_W; x++)
          if (this.solid[y * WORLD_W + x]) g.strokeRect(x * TILE, y * TILE, TILE, TILE);
      g.lineStyle(1, 0x44ff44, 0.9);
      for (const t of this.chopTargets.values())
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
      const pad = onPad && !this.wasOnPad ? this.doorPads.get(padKey) : undefined;
      if (pad) this.enterBuilding(pad);
      this.wasOnPad = onPad;
    }
  }

  private movePlayer(dt: number) {
    const k = this.keys;
    if (!k) return; // create 未完成时不更新
    let dx = 0;
    let dy = 0;
    // 动作（挥斧）播放期间锁定移动
    if (this.time.now < this.actionUntil) {
      if (this.player.anims.currentAnim?.key !== `p-axe-${this.facing}`)
        this.player.play(`p-axe-${this.facing}`, true);
      this.player.setDepth(this.player.y);
      return;
    }
    if (!modalOpen) {
      if (k.A.isDown || k.LEFT.isDown) dx -= 1;
      if (k.D.isDown || k.RIGHT.isDown) dx += 1;
      if (k.W.isDown || k.UP.isDown) dy -= 1;
      if (k.S.isDown || k.DOWN.isDown) dy += 1;
      if (touch.pressed) {
        dx += touch.dx;
        dy += touch.dy;
      }
    }
    const len = Math.hypot(dx, dy) || 1;
    const vx = (dx / len) * SPEED * dt;
    const vy = (dy / len) * SPEED * dt;

    if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) >= Math.abs(dy)) {
        this.facing = "side";
        this.player.setFlipX(dx < 0); // Mystic 侧面素材朝右：向左移动才镜像
      } else {
        this.facing = dy < 0 ? "up" : "down";
        this.player.setFlipX(false); // 纵向行走重置镜像，防止残留翻转
      }
    }
    // 分轴移动 = 贴墙滑动
    if (dx !== 0 && !this.blocked(this.player.x + vx, this.player.y)) this.player.x += vx;
    if (dy !== 0 && !this.blocked(this.player.x, this.player.y + vy)) this.player.y += vy;

    const moving = dx !== 0 || dy !== 0;
    {
      const key = moving ? `p-walk-${this.facing}` : `p-idle-${this.facing}`;
      if (this.player.anims.currentAnim?.key !== key) this.player.play(key, true);
    }
    this.moving = moving;
    this.player.setDepth(this.player.y);
  }
  private moving = false;

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

  private updateChicken(dt: number) {
    const c = this.chicken;
    const d = Phaser.Math.Distance.Between(c.x, c.y, this.player.x, this.player.y - 4);
    if (d > 26 && !modalOpen) {
      const a = Phaser.Math.Angle.Between(c.x, c.y, this.player.x, this.player.y - 4);
      c.x += Math.cos(a) * 60 * dt;
      c.y += Math.sin(a) * 60 * dt;
      // 素材朝左：向右移动时翻转
      c.setFlipX(Math.cos(a) > 0);
    }
    const bob = Math.sin(this.time.now / 140) * 1.2;
    c.setOrigin(0.5, 1 + bob * 0.06);
    c.setDepth(c.y);
  }

  private growCrops() {
    const now = this.time.now;
    for (const [key, cs] of G.crops) {
      if (cs.s >= 2) continue;
      const span = cs.watered ? STAGE_MS / 2 : STAGE_MS;
      if (now - cs.t >= span) {
        cs.s += 1;
        cs.t = now;
        cs.watered = false;
        const spr = this.cropSprites.get(key);
        if (spr) spr.setTexture(`gen-crop-${cs.s}`, 0);
        if (cs.s === 2) toast(`${CROP_KEYS[cs.c] === "carrot" ? "胡萝卜" : "作物"}熟了！`);
        persist();
      }
    }
  }

  private updateNight(time: number) {
    const t = (time / 150_000) % 1;
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
    const mix = (i: number) => Math.round(a[1][i] + (b[1][i] - a[1][i]) * u);
    this.night.setFillStyle(
      Phaser.Display.Color.GetColor(mix(0), mix(1), mix(2)),
      mix(3) / 255
    );
    this.night.setPosition(this.cameras.main.scrollX, this.cameras.main.scrollY);
  }

  // ---- 交互 ----
  private facingTile(): [number, number] {
    const tx = Math.floor(this.player.x / TILE);
    const ty = Math.floor((this.player.y - 2) / TILE);
    const off = this.facing === "down" ? [0, 1] : this.facing === "up" ? [0, -1] : this.player.flipX ? [-1, 0] : [1, 0];
    return [tx + off[0], ty + off[1]];
  }

  private nearestInteract(): { label: string; act: () => void } | null {
    const px = this.player.x;
    const py = this.player.y - 4;
    // 1) 成熟作物（面前或脚下）
    for (const [fx, fy] of [this.facingTile(), [Math.floor(px / TILE), Math.floor(py / TILE)]]) {
      const cs = G.crops.get(`${fx},${fy}`);
      if (cs && cs.s === 2) {
        return {
          label: "收获",
          act: () => this.harvest(`${fx},${fy}`, cs),
        };
      }
    }
    // 2) 门 / NPC / 鸡
    let best: { label: string; act: () => void; d: number } | null = null;
    const consider = (x: number, y: number, label: string, act: () => void) => {
      const d = Phaser.Math.Distance.Between(px, py, x, y);
      if (d < INTERACT_DIST && (!best || d < best.d)) best = { label, act, d };
    };
    for (const b of buildings) {
      const d = doorOf(b);
      consider((d.x + 0.5) * TILE, (d.y + 1) * TILE, `进入${b.name}`, () => this.enterBuilding(b));
    }
    for (const n of this.npcs) {
      consider(n.spr.x, n.spr.y, `和${n.def.name}说话`, () => {
        bus.emit(EV.dialog, { name: n.def.name, text: n.def.lines[n.li++ % n.def.lines.length] });
      });
    }
    // 可砍树
    for (const [tk, t] of this.chopTargets) {
      const [tx, ty] = tk.split(",").map(Number);
      consider((tx + 0.5) * TILE, (ty + 1.6) * TILE, "砍树", () => this.chopTree(tk, t));
    }
    return best ? { label: best.label, act: best.act } : null;
  }

  private updatePrompt() {
    const it = modalOpen ? null : this.nearestInteract();
    const label = it ? it.label : "";
    if (label !== this.lastPrompt) {
      this.lastPrompt = label;
      bus.emit(EV.prompt, label || null);
    }
    this.current = it;
  }
  private current: { label: string; act: () => void } | null = null;

  private interact() {
    if (modalOpen) return;
    this.current = this.nearestInteract();
    if (this.current) this.current.act();
  }

  private selectTool(i: number) {
    this.tool = i;
    bus.emit(EV.tool, i);
  }

  private useTool() {
    if (modalOpen) return;
    this.playAction();
    const [fx, fy] = this.facingTile();
    const key = `${fx},${fy}`;
    const groundIdx = this.groundData[fy * WORLD_W + fx] ?? Ground.GRASS;
    const isTillable = groundIdx === Ground.GRASS || groundIdx === Ground.DIRT;
    if (this.tool === 0) {
      // 锄：开垦草地或农田松土
      if (isTillable) {
        this.groundData[fy * WORLD_W + fx] = Ground.TILLED;
        this.groundRt.drawFrame("mystic-plains", 8, fx * TILE, fy * TILE);
        this.groundRt.drawFrame("gen-dirt-v0", 0, fx * TILE, fy * TILE);
        this.puff((fx + 0.5) * TILE, (fy + 1) * TILE);
      }
    } else if (this.tool === 1) {
      // 种子：耕地上播种（胡萝卜，任务作物）
      if (groundIdx === Ground.TILLED && !G.crops.has(key)) {
        const cs: CropState = { c: 0, s: 0, t: this.time.now, watered: false };
        G.crops.set(key, cs);
        this.spawnCropSprite(key, cs);
        this.puff((fx + 0.5) * TILE, (fy + 1) * TILE);
      }
    } else {
      // 水壶：给作物浇水，当前阶段提速一半
      const cs = G.crops.get(key);
      if (cs && !cs.watered) {
        cs.watered = true;
        cs.t = this.time.now - STAGE_MS / 4;
        const spr = this.cropSprites.get(key);
        if (spr) {
          spr.setTint(0x9fd8ff);
          this.time.delayedCall(450, () => spr.clearTint());
        }
        toast("浇水了，长快一半");
      }
    }
    persist();
  }

  // 播放当前朝向的挥斧动作，短暂锁移动（Pixels 式的工具动作感）
  private playAction() {
    this.actionUntil = this.time.now + 380;
    this.player.play(`p-axe-${this.facing}`, true);
  }

  private spawnCropSprite(key: string, cs: CropState) {
    const [x, y] = key.split(",").map(Number);
    const spr = this.add
      .image(x * TILE + TILE / 2, (y + 1) * TILE, `gen-crop-${cs.s}`, 0)
      .setOrigin(0.5, 1);
    spr.setDepth((y + 1) * TILE - 0.1);
    this.cropSprites.set(key, spr);
  }

  private harvest(key: string, cs: CropState) {
    this.playAction();
    G.crops.delete(key);
    this.cropSprites.get(key)?.destroy();
    this.cropSprites.delete(key);
    this.starBurst(this.player.x, this.player.y - 18);
    addEnergy(1);
    if (cs.c === 0 && !G.questDone) {
      G.quest += 1;
      bus.emit(EV.quest, { delivered: G.quest, need: QUEST.need, done: G.questDone });
      if (G.quest >= QUEST.need) toast(`胡萝卜够 ${QUEST.need} 根了，送去咖啡馆！`);
    }
    toast("收获！能量 +1");
  }

  // 收获的星星迸散（fx 素材来自 Pixels AGPL 仓库）
  private starBurst(x: number, y: number) {
    for (let i = 0; i < 5; i++) {
      const star = this.add
        .image(x, y, "gen-star", 0)
        .setDepth(9999)
        .setScale(0.5 + Math.random() * 0.5);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const dist = 14 + Math.random() * 14;
      this.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        angle: Phaser.Math.Between(-90, 90),
        duration: 420 + Math.random() * 180,
        ease: "Cubic.easeOut",
        onComplete: () => star.destroy(),
      });
    }
  }

  private chopTree(key: string, t: { sheet: string; frame: number; tx: number; ty: number; w: number; h: number; img: Phaser.GameObjects.Image }) {
    if (this.time.now < this.actionUntil) return;
    this.playAction();
    this.time.delayedCall(320, () => {
      t.img.destroy();
      this.chopTargets.delete(key);
      const stump = this.add
        .image((t.tx + t.w / 2) * TILE, (t.ty + 1.6) * TILE, "mystic-objects", 151)
        .setOrigin(0.5, 1);
      stump.setDepth(stump.y);
      this.starBurst(t.tx * TILE + TILE / 2, (t.ty + 0.8) * TILE);
      addEnergy(1);
      toast("砍到木材！能量 +1");
      persist();
    });
  }

  private puff(x: number, y: number) {
    const dust = this.add.image(x, y - 4, "mystic-dust", 0).setAlpha(0.9).setDepth(9999);
    this.tweens.add({
      targets: dust,
      y: y - 12,
      alpha: 0,
      scale: 1.6,
      duration: 320,
      onComplete: () => dust.destroy(),
    });
  }

  private enterBuilding(b: BuildingDef) {
    if (this.transitioning) return;
    this.transitioning = true;
    persist(this.player.x, this.player.y);
    this.cameras.main.fadeOut(260, 10, 12, 20);
    this.time.delayedCall(280, () => this.scene.start("interior", { b }));
  }
}

// ---------------------------------------------------------------- 室内

export class InteriorScene extends Phaser.Scene {
  private b!: BuildingDef;
  private player!: Phaser.GameObjects.Sprite;
  private facing: Dir = "down";
  private moving = false;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private lastPrompt = "";
  private current: { label: string; act: () => void } | null = null;
  private exitX = 0;

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

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const wallRow = y <= 1;
        if (wallRow) {
          cv.drawFrame("mystic-walls", x % 6 === 3 ? INDOOR.wallBrick : INDOOR.wall, x * TILE, y * TILE);
        } else {
          cv.drawFrame("mystic-wooden", INDOOR.floor, x * TILE, y * TILE);
        }
      }
    }
    this.exitX = (w >> 1) * TILE + TILE / 2;
    cv.drawFrame("mystic-door", INDOOR.door, (w >> 1) * TILE, TILE);

    for (const f of this.b.interior.furniture) {
      const img = this.add
        .image(f.x * TILE + TILE / 2, (f.y + 1) * TILE, `gen-${f.img}`)
        .setOrigin(0.5, 1);
      img.setDepth((f.y + 1) * TILE);
    }

    this.player = this.add
      .sprite(this.exitX, 3.4 * TILE, "mystic-player", PLAYER48.idle.down[0])
      .setOrigin(0.5, 0.92);
    this.player.setDepth(this.player.y);

    if (this.b.interior.npc) {
      // 咖啡馆老板娘：Pixels 的 Margareth（AGPL 素材，侧面朝左），站柜台后露上半身
      const boss = this.add
        .sprite(4.5 * TILE, 3.2 * TILE, "mystic-slime", 0)
        .setOrigin(0.5, 1)
        .setTint(0xf4d03f);
      boss.play("slime-idle");
      boss.setDepth(boss.y);
    }

    const cam = this.cameras.main;
    cam.setBackgroundColor("#120d0a");
    cam.setRoundPixels(true);
    this.applyZoom();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.applyZoom, this);
    cam.fadeIn(260, 10, 12, 20);

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
    bindBus(this, EV.touchDir, (t: { dx: number; dy: number; pressed: boolean }) => {
      touch.dx = t.dx;
      touch.dy = t.dy;
      touch.pressed = t.pressed;
    });
    bindBus(this, EV.panel, (p: unknown) => {
      if (!p) modalOpen = false;
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
    const z = Phaser.Math.Clamp(Math.floor(Math.min(width / W, height / H)), 1, 4);
    this.cameras.main.setZoom(z);
    this.cameras.main.centerOn(W / 2, H / 2);
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
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
    }
    const len = Math.hypot(dx, dy) || 1;
    // 室内碰撞：一圈墙 + 家具格
    const solid = (px: number, py: number) => {
      const tx = Math.floor(px / TILE);
      const ty = Math.floor(py / TILE);
      const { w, h } = this.b.interior;
      if (tx < 0 || ty < 2 || tx >= w || ty >= h) return true;
      return this.b.interior.furniture.some(f => f.x === tx && f.y === ty);
    };
    const vx = (dx / len) * SPEED * dt;
    const vy = (dy / len) * SPEED * dt;
    if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) >= Math.abs(dy)) {
        this.facing = "side";
        this.player.setFlipX(dx < 0); // Mystic 侧面素材朝右：向左移动才镜像
      } else {
        this.facing = dy < 0 ? "up" : "down";
        this.player.setFlipX(false); // 纵向行走重置镜像，防止残留翻转
      }
    }
    if (dx !== 0 && !solid(this.player.x + vx, this.player.y - 4)) this.player.x += vx;
    if (dy !== 0 && !solid(this.player.x, this.player.y + vy - 4)) this.player.y += vy;
    const moving = dx !== 0 || dy !== 0;
    if (moving !== this.moving) {
      this.player.play(moving ? `p-walk-${this.facing}` : `p-idle-${this.facing}`, true);
    }
    this.moving = moving;
    this.player.setDepth(this.player.y);

    // 出口：走到门口格自动出门
    if (!modalOpen && this.player.y < 2.4 * TILE && Math.abs(this.player.x - this.exitX) < 10) {
      this.leave();
      return;
    }

    // 提示与交互（出门走到底部自动触发，不占交互键）
    let it: { label: string; act: () => void } | null = null;
    const sign = this.b.interior.sign;
    const signPx = (sign.x + 0.5) * TILE;
    const signPy = (sign.y + 1) * TILE;
    const dSign = Phaser.Math.Distance.Between(this.player.x, this.player.y, signPx, signPy);
    const npc = this.b.interior.npc;
    const npcPx = 4.5 * TILE;
    const npcPy = 2.5 * TILE;
    if (npc && Phaser.Math.Distance.Between(this.player.x, this.player.y, npcPx, npcPy) < 26) {
      it = {
        label: "和老板说话",
        act: () => this.talkBoss(),
      };
    } else if (dSign < 26) {
      it = {
        label: "看牌子",
        act: () => {
          modalOpen = true;
          bus.emit(EV.panel, {
            title: this.b.name,
            blurb: sign.text,
            link: this.b.link,
          });
        },
      };
    }
    const label = it ? it.label : "";
    if (label !== this.lastPrompt) {
      this.lastPrompt = label;
      bus.emit(EV.prompt, label || null);
    }
    this.current = it;
  }

  private interact() {
    // 面板打开时按 E/空格/A = 关闭面板（等价点「回到小镇」）
    if (modalOpen) {
      modalOpen = false;
      bus.emit(EV.panel, null);
      return;
    }
    if (this.current) this.current.act();
  }

  private talkBoss() {
    if (G.questDone) {
      bus.emit(EV.dialog, { name: "咖啡馆老板", text: "浓汤常做，常来呀。" });
      return;
    }
    if (G.quest >= QUEST.need) {
      G.quest -= QUEST.need;
      G.questDone = true;
      addEnergy(QUEST.reward);
      bus.emit(EV.quest, { delivered: G.quest, need: QUEST.need, done: true });
      bus.emit(EV.dialog, {
        name: "咖啡馆老板",
        text: `三根胡萝卜，一棵都不蔫！这是 ${QUEST.reward} 点能量，收好了。`,
      });
      toast(`任务完成！能量 +${QUEST.reward}`);
    } else {
      bus.emit(EV.dialog, {
        name: "咖啡馆老板",
        text: `镇南的田能种胡萝卜。收够 ${QUEST.need} 根带来，我拿能量跟你换。`,
      });
    }
  }

  private leave() {
    persist();
    this.cameras.main.fadeOut(240, 10, 12, 20);
    this.time.delayedCall(260, () => this.scene.start("world", { spawnAt: this.b.id }));
  }
}

// ---------------------------------------------------------------- 启动

export function startTown(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: "#3a6b3f",
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: parent.clientWidth,
      height: parent.clientHeight,
    },
    scene: [WorldScene, InteriorScene],
  });
}
