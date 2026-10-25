import { snap, type Manager } from "./core";
import { Assets, BIG_KID } from "./assets";

const IDLE_AFTER = 9;
const RUSH_SECONDS = 2.6;

export class IdleLayer implements Manager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private smoke: (x: number, y: number) => void;
  private hearts: (x: number, y: number) => void;
  private idleFor = 0;
  private rushing = false;
  private rushT = 0;
  private dir: 1 | -1 = 1;
  private smokeAcc = 0;
  private hearted = false;
  enabled = true;

  constructor(
    canvas: HTMLCanvasElement,
    assets: Assets,
    fx: {
      smoke: (x: number, y: number) => void;
      hearts: (x: number, y: number) => void;
    }
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.assets = assets;
    this.smoke = fx.smoke;
    this.hearts = fx.hearts;
  }

  markActive(): void {
    this.idleFor = 0;
  }

  reset(): void {
    this.idleFor = 0;
    this.rushing = false;
    this.rushT = 0;
    this.hearted = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(dt: number): void {
    if (!this.enabled) return;
    this.idleFor += dt;
    if (!this.rushing && this.idleFor >= IDLE_AFTER) {
      this.rushing = true;
      this.rushT = 0;
      this.hearted = false;
      this.dir = Math.random() < 0.5 ? 1 : -1;
    }
    if (this.rushing) {
      this.rushT += dt;
      this.smokeAcc += dt;
      if (this.smokeAcc > 0.06) {
        this.smokeAcc = 0;
        const pos = this.actorPos();
        this.smoke(pos.x, pos.y);
      }
      if (this.rushT >= RUSH_SECONDS) {
        this.rushing = false;
        this.idleFor = 0;
        const pos = this.actorPos();
        this.hearts(pos.x, pos.y);
      }
    }
  }

  private actorPos(): { x: number; y: number } {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const size = Math.floor(Math.min(h * 0.5, 430) / 36) * 36;
    const p = Math.min(1, this.rushT / RUSH_SECONDS);
    const ease = p * p * (3 - 2 * p);
    const x =
      this.dir === 1
        ? -size + (w + size * 2) * ease
        : w + size - (w + size * 2) * ease;
    return { x: x + size / 2, y: h - size * 0.16 };
  }

  resize(w: number, h: number): void {
    this.canvas.width = Math.max(1, w);
    this.canvas.height = Math.max(1, h);
  }

  draw(): void {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!this.enabled || !this.rushing) return;
    ctx.imageSmoothingEnabled = false;
    const pos = this.actorPos();
    const size = Math.floor(Math.min(canvas.height * 0.5, 430) / 36) * 36;
    const frameIdx = Math.floor(this.rushT / 0.14) % 2;
    const src =
      this.rushT < 0.3 || this.rushT > RUSH_SECONDS - 0.5
        ? BIG_KID.def
        : BIG_KID.walk[frameIdx];
    const img = this.assets.get(src);
    if (!img) return;
    const shakeX = snap(Math.sin(this.rushT * 40) * 2, 2);
    const bobY = snap(Math.abs(Math.sin(this.rushT * 9)) * -8, 2);
    const x = Math.round(pos.x - size / 2 + shakeX);
    const y = Math.round(canvas.height - size + bobY - size * 0.08);
    ctx.drawImage(img, x, y, size, size);
  }
}
