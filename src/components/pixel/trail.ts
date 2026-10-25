import { fitCanvas, hexToRgb, pointer, snap, type Manager } from "./core";

const STEP = 4;
const FADE_TICK = 0.09;
const LEVELS = [0.5, 0.36, 0.24, 0.14, 0.06];
const MAX_CELLS = 3200;
const KEY_SPAN = 4096;

export class TrailLayer implements Manager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cells = new Map<number, number>();
  private rgb: [number, number, number] = [17, 17, 20];
  private fadeAcc = 0;
  private hasPrev = false;
  private prevX = 0;
  private prevY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  setColor(hex: string): void {
    this.rgb = hexToRgb(hex);
  }

  strokeTo(x: number, y: number): void {
    if (!this.hasPrev || !pointer.active) {
      this.prevX = x;
      this.prevY = y;
      this.hasPrev = true;
      return;
    }
    const x0 = this.prevX;
    const y0 = this.prevY;
    this.prevX = x;
    this.prevY = y;
    const dist = Math.hypot(x - x0, y - y0);
    const steps = Math.max(1, Math.floor(dist / STEP));
    for (let i = 0; i <= steps; i += 1) {
      const px = snap(x0 + ((x - x0) * i) / steps, STEP);
      const py = snap(y0 + ((y - y0) * i) / steps, STEP);
      const key = Math.floor(py / STEP) * KEY_SPAN + Math.floor(px / STEP);
      this.cells.set(key, LEVELS.length);
    }
    while (this.cells.size > MAX_CELLS) {
      const oldest = this.cells.keys().next().value;
      if (oldest === undefined) break;
      this.cells.delete(oldest);
    }
  }

  update(dt: number): void {
    this.fadeAcc += dt;
    while (this.fadeAcc >= FADE_TICK) {
      this.fadeAcc -= FADE_TICK;
      for (const [key, level] of this.cells) {
        if (level <= 1) this.cells.delete(key);
        else this.cells.set(key, level - 1);
      }
    }
  }

  clear(): void {
    this.cells.clear();
    const c = this.ctx.canvas;
    this.ctx.clearRect(0, 0, c.width, c.height);
  }

  resize(w: number, h: number): void {
    fitCanvas(this.canvas, w, h);
    this.cells.clear();
    this.hasPrev = false;
  }

  draw(): void {
    const { canvas, ctx } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.cells.size === 0 || !pointer.fine) return;
    for (const [key, level] of this.cells) {
      const gx = key % KEY_SPAN;
      const gy = Math.floor(key / KEY_SPAN);
      const [r, g, b] = this.rgb;
      ctx.fillStyle = `rgba(${r},${g},${b},${LEVELS[level - 1]})`;
      ctx.fillRect(gx * STEP, gy * STEP, STEP, STEP);
    }
  }
}
