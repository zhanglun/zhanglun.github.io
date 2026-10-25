import { PAL, rand, snap, type Manager } from "./core";
import { Assets, ROBOT } from "./assets";

const STEP = 2;
const ART = 36;
const ROBOT_SIZE = ART * 2;

export class StageLayer implements Manager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private assets: Assets;
  private excited = false;
  private nextGlitter = 3;
  private steamAt = 0;

  constructor(canvas: HTMLCanvasElement, assets: Assets) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.assets = assets;
  }

  setExcited(on: boolean): void {
    this.excited = on;
  }

  robotViewportPos(): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const floorY = snap(rect.height * 0.76, STEP);
    const deskX = snap(w * 0.28, STEP);
    return {
      x: rect.left + deskX,
      y: rect.top + floorY - 40 - ROBOT_SIZE,
    };
  }

  resize(w: number, h: number): void {
    this.canvas.width = Math.max(1, w);
    this.canvas.height = Math.max(1, h);
  }

  update(_dt: number, t: number): void {
    if (t > this.nextGlitter) {
      this.nextGlitter = t + rand(4, 8);
      this.steamAt = t;
    }
  }

  draw(): void {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (w < 2 || h < 2) return;
    ctx.imageSmoothingEnabled = false;

    const floorY = snap(h * 0.76, STEP);
    this.drawFloor(w, floorY);

    const deskX = snap(w * 0.28, STEP);
    this.drawDesk(deskX, floorY);
    this.drawRobot(deskX, floorY);
    this.drawMug(deskX + 64, floorY);
    this.drawPlant(snap(w * 0.76, STEP), floorY);
  }

  private drawFloor(w: number, floorY: number): void {
    const { ctx } = this;
    ctx.fillStyle = PAL.ink;
    ctx.fillRect(0, floorY, w, STEP);
    ctx.fillStyle = PAL.gray;
    for (let x = 8; x < w; x += 32) {
      ctx.fillRect(x, floorY + 8, 12, STEP);
    }
  }

  private drawDesk(x: number, floorY: number): void {
    const { ctx } = this;
    ctx.fillStyle = PAL.ink;
    ctx.fillRect(x - 72, floorY - 40, 144, 4);
    ctx.fillRect(x - 68, floorY - 36, 4, 36);
    ctx.fillRect(x + 64, floorY - 36, 4, 36);
  }

  private drawRobot(x: number, floorY: number): void {
    const { ctx } = this;
    const frameSrc =
      this.excited || Math.floor(Date.now() / 520) % 8 === 0
        ? ROBOT.open
        : ROBOT.closed;
    const img = this.assets.get(frameSrc);
    if (!img) return;
    const jump = this.excited
      ? snap(Math.abs(Math.sin(Date.now() / 90)) * -8, STEP)
      : 0;
    ctx.drawImage(
      img,
      x - ROBOT_SIZE / 2,
      floorY - 40 - ROBOT_SIZE + jump,
      ROBOT_SIZE,
      ROBOT_SIZE
    );
  }

  private drawMug(x: number, floorY: number): void {
    const { ctx } = this;
    ctx.fillStyle = PAL.ink;
    ctx.fillRect(x, floorY - 54, 12, 14);
    ctx.fillRect(x + 12, floorY - 50, 4, 2);
    ctx.fillRect(x + 12, floorY - 46, 4, 2);
    const phase = Math.floor(Date.now() / 300) % 3;
    ctx.fillStyle = PAL.smoke;
    ctx.fillRect(x + 4, floorY - 62 - phase * 4, 3, 3);
    ctx.fillRect(x + 8, floorY - 58 - ((phase + 1) % 3) * 4, 3, 3);
  }

  private drawPlant(x: number, floorY: number): void {
    const { ctx } = this;
    ctx.fillStyle = PAL.ink;
    ctx.fillRect(x - 10, floorY - 26, 20, 26);
    ctx.fillRect(x - 14, floorY - 30, 28, 4);
    ctx.fillStyle = PAL.green;
    ctx.fillRect(x - 2, floorY - 52, 4, 22);
    ctx.fillRect(x - 10, floorY - 46, 6, 4);
    ctx.fillRect(x + 4, floorY - 44, 6, 4);
    ctx.fillRect(x - 8, floorY - 40, 4, 4);
    ctx.fillRect(x + 6, floorY - 38, 4, 4);
  }
}
