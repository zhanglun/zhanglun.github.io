import { rand, pick, type Manager } from "./core";
import { Assets, KIDS, kidWalk } from "./assets";

const ART = 36;

type Walker = {
  walk: [string, string];
  x: number;
  y: number;
  dir: 1 | -1;
  speed: number;
  h: number;
  frame: number;
  frameT: number;
};

export class WalkerLayer implements Manager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private walkers: Walker[] = [];
  private nextSpawn = 1.2;
  enabled = true;

  constructor(canvas: HTMLCanvasElement, assets: Assets) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.assets = assets;
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (!on) {
      this.walkers = [];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private spawn(w: number, h: number): void {
    const id = pick(KIDS);
    const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
    const size = ART * 2;
    this.walkers.push({
      walk: kidWalk(id),
      x: dir === 1 ? -size * 2 : w + size * 2,
      y: h - rand(40, 150) - size,
      dir,
      speed: rand(46, 82),
      h: size,
      frame: 0,
      frameT: 0,
    });
  }

  update(dt: number): void {
    if (!this.enabled) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w < 2) return;
    this.nextSpawn -= dt;
    if (this.nextSpawn <= 0 && this.walkers.length < 3) {
      this.nextSpawn = rand(5, 10);
      this.spawn(w, h);
    }
    for (let i = this.walkers.length - 1; i >= 0; i -= 1) {
      const wk = this.walkers[i];
      wk.x += wk.dir * wk.speed * dt;
      wk.frameT += dt;
      if (wk.frameT > 0.16) {
        wk.frameT = 0;
        wk.frame = 1 - wk.frame;
      }
      if (wk.dir === 1 && wk.x > w + wk.h * 2) this.walkers.splice(i, 1);
      if (wk.dir === -1 && wk.x < -wk.h * 3) this.walkers.splice(i, 1);
    }
  }

  resize(w: number, h: number): void {
    this.canvas.width = Math.max(1, w);
    this.canvas.height = Math.max(1, h);
  }

  draw(): void {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!this.enabled) return;
    ctx.imageSmoothingEnabled = false;
    for (const wk of this.walkers) {
      const img = this.assets.get(wk.walk[wk.frame]);
      if (!img) continue;
      const w = wk.h;
      if (wk.dir === 1) {
        ctx.drawImage(img, Math.round(wk.x), Math.round(wk.y), w, w);
      } else {
        ctx.save();
        ctx.translate(Math.round(wk.x + w), Math.round(wk.y));
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, 0, w, w);
        ctx.restore();
      }
    }
  }
}
