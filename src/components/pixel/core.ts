export const PAL = {
  ink: "#111114",
  white: "#ffffff",
  red: "#ff4130",
  yellow: "#eeff5a",
  cyan: "#63ddff",
  green: "#00b995",
  gray: "#858890",
  smoke: "#b6b9c1",
};

export type Manager = {
  update?: (dt: number, t: number) => void;
  draw?: () => void;
  resize?: (w: number, h: number) => void;
};

export const pointer = {
  x: -999,
  y: -999,
  down: false,
  active: false,
  fine: true,
};

export const snap = (v: number, step: number): number =>
  Math.round(v / step) * step;

export const rand = (min: number, max: number): number =>
  min + Math.random() * (max - min);

export const pick = <T>(list: readonly T[]): T =>
  list[Math.floor(Math.random() * list.length)];

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function fitCanvas(
  canvas: HTMLCanvasElement,
  w: number,
  h: number
): boolean {
  if (canvas.width === w && canvas.height === h) return false;
  canvas.width = Math.max(1, w);
  canvas.height = Math.max(1, h);
  return true;
}

export class Engine {
  private managers: Manager[] = [];
  private raf = 0;
  private last = 0;
  private time = 0;
  motion = true;
  width = 0;
  height = 0;

  add(manager: Manager): void {
    this.managers.push(manager);
    manager.resize?.(this.width, this.height);
  }

  start(): void {
    if (this.raf || !this.motion) return;
    this.last = performance.now();
    const tick = (now: number): void => {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.time += dt;
      for (const m of this.managers) m.update?.(dt, this.time);
      for (const m of this.managers) m.draw?.();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  frameOnce(dt = 0.016): void {
    this.last = performance.now();
    this.time += dt;
    for (const m of this.managers) m.update?.(dt, this.time);
    for (const m of this.managers) m.draw?.();
  }

  stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  setMotion(on: boolean): void {
    this.motion = on;
    if (on) this.start();
    else this.stop();
  }

  get now(): number {
    return this.time;
  }

  resize(w: number, h: number): void {
    this.width = w;
    this.height = h;
    for (const m of this.managers) m.resize?.(w, h);
  }
}
