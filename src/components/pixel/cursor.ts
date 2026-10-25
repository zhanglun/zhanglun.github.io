import { PAL, pointer, snap, type Manager } from "./core";
import { Assets, CURSORS, type CursorKey } from "./assets";

const STEP = 4;

// X = ink border, O = white fill
const ARROW = [
  "X........",
  "XX.......",
  "XOX......",
  "XOOX.....",
  "XOOOX....",
  "XOOOOX...",
  "XOOOOOX..",
  "XOOOOOOX.",
  "XOOOOOOOX",
  "XOOOOXXXX",
  "XOOXOX...",
  "XOX.XOX..",
  "XX..XOX..",
  ".....X...",
];

const ICON_SIZE = 52;
const MORPH_STEPS = [0.4, 0.7, 1];

export class CursorLayer implements Manager {
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private scopeEl: HTMLElement | null;
  private mode: { src: string; color: string } | null = null;
  private morphAt = -10;
  private time = 0;
  onChangeColor?: (color: string) => void;
  onModeBurst?: (x: number, y: number) => void;

  constructor(
    canvas: HTMLCanvasElement,
    assets: Assets,
    scopeEl: HTMLElement | null = null
  ) {
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.assets = assets;
    this.scopeEl = scopeEl;
  }

  get trailColor(): string {
    return this.mode ? this.mode.color : PAL.ink;
  }

  setMode(key: CursorKey | null, t: number): void {
    const next = key ? CURSORS[key] : null;
    const same =
      (this.mode && next && this.mode.src === next.src) ||
      (!this.mode && !next);
    if (same) return;
    this.mode = next;
    this.morphAt = t;
    this.onChangeColor?.(this.trailColor);
    if (next && pointer.active) this.onModeBurst?.(pointer.x, pointer.y);
  }

  update(_dt: number, t: number): void {
    this.time = t;
  }

  clear(): void {
    const c = this.ctx.canvas;
    this.ctx.clearRect(0, 0, c.width, c.height);
  }

  resize(w: number, h: number): void {
    const c = this.ctx.canvas;
    c.width = Math.max(1, w);
    c.height = Math.max(1, h);
  }

  draw(): void {
    const ctx = this.ctx;
    const c = ctx.canvas;
    ctx.clearRect(0, 0, c.width, c.height);
    if (!pointer.active || !pointer.fine) return;
    if (this.scopeEl) {
      const r = this.scopeEl.getBoundingClientRect();
      const inside =
        pointer.x >= r.left &&
        pointer.x <= r.right &&
        pointer.y >= r.top &&
        pointer.y <= r.bottom;
      if (!inside) return;
    }
    ctx.imageSmoothingEnabled = false;
    const x = snap(pointer.x, STEP);
    const y = snap(pointer.y, STEP);
    if (this.mode) {
      this.drawIcon(x, y);
    } else {
      this.drawArrow(x, y + (pointer.down ? STEP : 0));
    }
  }

  private drawIcon(x: number, y: number): void {
    const src = this.mode ? this.mode.src : "";
    const img = this.assets.get(src);
    if (!img) return;
    const p = Math.min(1, (this.time - this.morphAt) / 0.15);
    const s = MORPH_STEPS[Math.min(2, Math.floor(p * 3))];
    const size = snap(ICON_SIZE * s, STEP);
    this.ctx.drawImage(img, x - size / 2, y - size + 12, size, size);
  }

  private drawArrow(px: number, py: number): void {
    const { ctx } = this;
    for (let row = 0; row < ARROW.length; row += 1) {
      const line = ARROW[row];
      for (let col = 0; col < line.length; col += 1) {
        const ch = line[col];
        if (ch === ".") continue;
        ctx.fillStyle = ch === "X" ? PAL.ink : PAL.white;
        ctx.fillRect(px + col * STEP, py + row * STEP, STEP, STEP);
      }
    }
  }
}
