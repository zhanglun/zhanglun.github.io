import { PAL, rand, snap, type Manager } from "./core";
import { Assets, EFFECT } from "./assets";

const STEP = 8;
const ALPHAS = [1, 0.66, 0.33];

type Square = {
  kind: "square";
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  color: string;
};

type Sprite = {
  kind: "sprite";
  x: number;
  y: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  frames: string[];
  sway: number;
  seed: number;
};

type Particle = Square | Sprite;

export class ExplosionLayer implements Manager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private parts: Particle[] = [];

  constructor(canvas: HTMLCanvasElement, assets: Assets) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.assets = assets;
  }

  burst(
    x: number,
    y: number,
    opts?: { count?: number; colors?: string[]; power?: number }
  ): void {
    const count = opts?.count ?? 22;
    const colors = opts?.colors ?? [PAL.ink, PAL.red, PAL.yellow];
    const power = opts?.power ?? 240;
    for (let i = 0; i < count; i += 1) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(power * 0.3, power);
      this.parts.push({
        kind: "square",
        x: snap(x, STEP),
        y: snap(y, STEP),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - power * 0.4,
        life: 0,
        ttl: rand(0.4, 0.8),
        size: Math.random() < 0.3 ? STEP * 2 : STEP,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  smoke(x: number, y: number): void {
    this.parts.push({
      kind: "square",
      x: snap(x + rand(-14, 14), STEP),
      y: snap(y + rand(-6, 6), STEP),
      vx: rand(-30, 30),
      vy: rand(-70, -20),
      life: 0,
      ttl: rand(0.5, 0.9),
      size: STEP * 2,
      color: PAL.smoke,
    });
  }

  heart(x: number, y: number): void {
    this.parts.push({
      kind: "sprite",
      x: snap(x, STEP),
      y: snap(y, STEP),
      vy: -rand(70, 110),
      life: 0,
      ttl: rand(0.9, 1.2),
      size: Math.random() < 0.5 ? 36 : 44,
      frames: EFFECT.heart,
      sway: rand(6, 14),
      seed: rand(0, Math.PI * 2),
    });
  }

  sparkle(x: number, y: number): void {
    this.parts.push({
      kind: "sprite",
      x: snap(x, STEP),
      y: snap(y, STEP),
      vy: -rand(40, 70),
      life: 0,
      ttl: rand(0.6, 0.9),
      size: 28,
      frames: EFFECT.glitter,
      sway: rand(4, 10),
      seed: rand(0, Math.PI * 2),
    });
  }

  update(dt: number): void {
    for (let i = this.parts.length - 1; i >= 0; i -= 1) {
      const p = this.parts[i];
      p.life += dt;
      if (p.life >= p.ttl) {
        this.parts.splice(i, 1);
        continue;
      }
      if (p.kind === "square") {
        p.vy += 760 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      } else {
        p.y += p.vy * dt;
      }
    }
  }

  clear(): void {
    this.parts = [];
    const c = this.ctx.canvas;
    this.ctx.clearRect(0, 0, c.width, c.height);
  }

  resize(w: number, h: number): void {
    this.canvas.width = Math.max(1, w);
    this.canvas.height = Math.max(1, h);
  }

  draw(): void {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    for (const p of this.parts) {
      const lifeRatio = p.life / p.ttl;
      const alpha = ALPHAS[Math.min(2, Math.floor(lifeRatio * 3))];
      ctx.globalAlpha = alpha;
      if (p.kind === "square") {
        ctx.fillStyle = p.color;
        ctx.fillRect(snap(p.x, STEP), snap(p.y, STEP), p.size, p.size);
      } else {
        const frames = p.frames;
        const idx = Math.min(
          frames.length - 1,
          Math.floor(lifeRatio * frames.length)
        );
        const img = this.assets.get(frames[idx]);
        if (!img) continue;
        const swayX = Math.sin(p.life * 6 + p.seed) * p.sway;
        ctx.drawImage(
          img,
          snap(p.x + swayX - p.size / 2, STEP),
          snap(p.y - p.size, STEP),
          p.size,
          p.size
        );
      }
    }
    ctx.globalAlpha = 1;
  }
}
