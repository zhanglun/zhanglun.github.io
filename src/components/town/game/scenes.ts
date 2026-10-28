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
  SLIME_FRAMES,
  CAMPFIRE_FRAMES,
  buildGroundVariants,
  buildPathTiles,
  buildIndoorVariants,
  buildNameplate,
  buildFurniture,
  FURN_KINDS,
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
  Ground,
  type BuildingDef,
} from "./world";
import { bus, EV } from "./state";

const SPEED = 88;
const INTERACT_DIST = 30;

function bindBus(scene: Phaser.Scene, ev: string, fn: (...a: never[]) => void) {
  bus.on(ev, fn);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => bus.off(ev, fn));
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
  // 村民待机（朝下 6 帧）
  for (const v of ["amelia", "bob", "adam", "alex"]) {
    scene.anims.create({
      key: `v-idle-${v}`,
      frames: scene.anims.generateFrameNumbers(`char-${v}`, {
        frames: [...Array(IDLE_FRAMES).keys()],
      }),
      frameRate: 5,
      repeat: -1,
    });
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
  }[] = [];
  private pet!: Phaser.GameObjects.Sprite;
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
  private doorPads!: Map<string, BuildingDef>;
  private transitioning = false;
  private wasOnPad = true; // 边沿触发：出生/出门站在门前格时不立即吸回
  private debugOn =
    typeof location !== "undefined" &&
    new URLSearchParams(location.search).has("debug");
  private debugGfx?: Phaser.GameObjects.Graphics;

  constructor() {
    super("world");
  }

  preload() {
    this.load.setPath("/town/");
    // 版本参数破缓存:素材文件曾在 dev 服务器运行中被重新生成,
    // 浏览器可能缓存了写入中途的残缺 PNG(PNG 头声明 38px、数据被截断,
    // 观感是树干/树基缺失)。素材内容变更时递增 ASSET_VERSION。
    const v = "20261025g";
    for (const img of IMAGES) {
      const file = img.startsWith("sv-")
        ? `sv/${img.slice(3)}.png`
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
        if (p.solid) {
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
      let sx = 32 * TILE;
      let sy = 23 * TILE;
      if (data.spawnAt) {
        const b = buildings.find(x => x.id === data.spawnAt)!;
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

      // 门前格注册：踩上即自动进门（与室内「走到底自动出门」对称）
      this.doorPads = new Map(
        buildings.map(b => {
          const d = doorOf(b);
          return [`${d.x},${d.y + 1}`, b] as const;
        })
      );

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
        this.npcs.push({ spr, def, li: 0 });
      }
      // 跟随宠物：小史莱姆
      this.pet = this.add
        .sprite(46 * TILE, 30 * TILE, "gen-slime", 0)
        .setOrigin(0.5, 1)
        .setScale(0.7);
      this.pet.play("slime-idle");
      this.pet.setDepth(this.pet.y);

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

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.movePlayer(dt);
    this.updatePet(dt);
    this.updateNight(_time);
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
    }
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
    this.night.setPosition(
      this.cameras.main.scrollX,
      this.cameras.main.scrollY
    );
  }

  // ---- 交互 ----
  private nearestInteract(): { label: string; act: () => void } | null {
    const px = this.player.x;
    const py = this.player.y - 4;
    let best: { label: string; act: () => void; d: number } | null = null;
    const consider = (x: number, y: number, label: string, act: () => void) => {
      const d = Phaser.Math.Distance.Between(px, py, x, y);
      if (d < INTERACT_DIST && (!best || d < best.d)) best = { label, act, d };
    };
    for (const b of buildings) {
      const d = doorOf(b);
      consider((d.x + 0.5) * TILE, (d.y + 1) * TILE, `进入${b.name}`, () =>
        this.enterBuilding(b)
      );
    }
    for (const n of this.npcs) {
      consider(n.spr.x, n.spr.y, `和${n.def.name}说话`, () => {
        bus.emit(EV.dialog, {
          name: n.def.name,
          text: n.def.lines[n.li++ % n.def.lines.length],
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

  private enterBuilding(b: BuildingDef) {
    if (this.transitioning) return;
    this.transitioning = true;
    this.cameras.main.fadeOut(260, 10, 12, 20);
    this.time.delayedCall(280, () => this.scene.start("interior", { b }));
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
      // crate/barrel 用 extract 生成的独立文件,其余走程序化家具纹理
      const tex =
        f.img === "crate"
          ? "gen-crate"
          : f.img === "barrel"
            ? "gen-barrel"
            : `gen-furn-${f.img}`;
      const img = this.add
        .image(f.x * TILE + TILE / 2, (f.y + 1) * TILE, tex)
        .setOrigin(0.5, 1);
      img.setDepth((f.y + 1) * TILE);
    }

    this.player = this.add
      .sprite(this.exitX, 3.6 * TILE, "gen-slime", 0)
      .setOrigin(0.5, 0.9);
    this.player.play("slime-idle");
    this.player.setDepth(this.player.y);

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

    // 提示与交互（出门走到底自动触发，不占交互键）
    let it: { label: string; act: () => void } | null = null;
    const npc = this.b.interior.npc;
    const npcPx = 4.5 * TILE;
    const npcPy = 2.6 * TILE;
    if (
      npc &&
      Phaser.Math.Distance.Between(this.player.x, this.player.y, npcPx, npcPy) <
        26
    ) {
      it = {
        label: `和${npc.name}说话`,
        act: () => {
          bus.emit(EV.dialog, { name: npc.name, text: npc.text });
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
    // 面板打开时按 E/空格/ESC = 关闭面板（等价点「回到小镇」）
    if (modalOpen) {
      modalOpen = false;
      bus.emit(EV.panel, null);
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
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: parent.clientWidth,
      height: parent.clientHeight,
    },
    scene: [WorldScene, InteriorScene],
  });
}
