import { Engine, PAL, pointer } from "./core";
import { ALL_ASSET_URLS, Assets, FACES, type FaceFrames } from "./assets";
import { CursorLayer } from "./cursor";
import { TrailLayer } from "./trail";
import { ExplosionLayer } from "./explosion";
import { StageLayer } from "./stage";
import { WalkerLayer } from "./walkers";
import { IdleLayer } from "./idle";

export type PixelKitLayers = {
  stage?: string | null;
  walkers?: boolean;
  idle?: boolean;
  trail?: boolean;
  cursor?: boolean;
  explosion?: boolean;
  gaze?: boolean;
};

export type PixelKitOptions = {
  layers?: PixelKitLayers;
  /** 光标 / 拖尾只在容器内生效（如首页 banner 与正文共存时） */
  scope?: string | null;
  loadingSelector?: string | null;
  motionKey?: string;
};

export type PixelKit = {
  engine: Engine;
  cursor: CursorLayer | null;
  trail: TrailLayer | null;
  explosion: ExplosionLayer | null;
  walkers: WalkerLayer | null;
  stage: StageLayer | null;
  idle: IdleLayer | null;
  pointer: typeof pointer;
};

type FaceEl = {
  el: HTMLImageElement;
  frames: FaceFrames;
  facingLeft: boolean;
  current: string;
  mirrored: boolean;
};

const $ = <T extends Element = HTMLElement>(sel: string): T | null =>
  document.querySelector(sel);

const canvasEl = (sel: string): HTMLCanvasElement | null =>
  document.querySelector<HTMLCanvasElement>(sel);

export async function createPixelKit(
  opts: PixelKitOptions = {}
): Promise<PixelKit | null> {
  const layers = opts.layers ?? {};
  const motionKey = opts.motionKey ?? "pixel-demo-motion";
  const scopeEl = opts.scope ? $(opts.scope) : null;

  pointer.fine = window.matchMedia("(pointer: fine)").matches;

  const assets = new Assets();
  const engine = new Engine();

  const cursorCanvas = canvasEl("#cursor-canvas");
  const trailCanvas = canvasEl("#trail-canvas");
  const explosionCanvas = canvasEl("#explosion-canvas");
  const walkerCanvas = canvasEl("#walker-canvas");
  const idleCanvas = canvasEl("#idle-canvas");

  const cursor =
    layers.cursor && cursorCanvas
      ? new CursorLayer(cursorCanvas, assets, scopeEl)
      : null;
  const trail =
    layers.trail && trailCanvas ? new TrailLayer(trailCanvas) : null;
  const explosion =
    layers.explosion && explosionCanvas
      ? new ExplosionLayer(explosionCanvas, assets)
      : null;
  const walkers =
    layers.walkers && walkerCanvas
      ? new WalkerLayer(walkerCanvas, assets)
      : null;
  const stageCanvas = layers.stage ? canvasEl(layers.stage) : null;
  const stage = stageCanvas ? new StageLayer(stageCanvas, assets) : null;
  const idle =
    layers.idle && idleCanvas && explosion
      ? new IdleLayer(idleCanvas, assets, {
          smoke: (x, y) => explosion.smoke(x, y),
          hearts: (x, y) =>
            explosion.burst(x, y, {
              count: 26,
              colors: [PAL.red, PAL.yellow, PAL.cyan],
            }),
        })
      : null;

  if (cursor && trail) {
    cursor.onChangeColor = color => trail.setColor(color);
  }
  if (cursor && explosion) {
    cursor.onModeBurst = (x, y) =>
      explosion.burst(x, y, { count: 10, power: 150 });
  }

  if (walkers) engine.add(walkers);
  if (stage) engine.add(stage);
  if (idle) engine.add(idle);
  if (explosion) engine.add(explosion);
  if (trail) engine.add(trail);
  if (cursor) engine.add(cursor);

  const applySize = (): void => {
    engine.resize(window.innerWidth, window.innerHeight);
    if (stage && stageCanvas) {
      const rect = stageCanvas.getBoundingClientRect();
      stage.resize(Math.floor(rect.width), Math.floor(rect.height));
    }
  };
  applySize();

  const motionOn =
    !document.documentElement.classList.contains("motion-off") &&
    (() => {
      try {
        return localStorage.getItem(motionKey) !== "off";
      } catch {
        return true;
      }
    })();
  engine.setMotion(motionOn);
  if (motionOn && trail) trail.setColor(PAL.ink);

  // ---- gaze: [data-gaze] 脸的视线跟随 ----
  if (layers.gaze) {
    const faces: FaceEl[] = [];
    document.querySelectorAll<HTMLImageElement>("[data-gaze]").forEach(el => {
      const id = el.getAttribute("data-face-id") || "";
      const frames = FACES[id];
      if (frames) {
        faces.push({
          el,
          frames,
          facingLeft: el.getAttribute("data-facing") !== "right",
          current: "",
          mirrored: false,
        });
      }
    });
    if (faces.length) {
      const gazeTick = () => {
        for (const face of faces) {
          const rect = face.el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = pointer.x - cx;
          const dy = pointer.y - cy;
          const dist = Math.hypot(dx, dy);
          const range = Math.max(260, rect.width);
          let next = face.frames.def;
          let mirrored = false;
          if (pointer.active && dist < range) {
            const level = Math.min(2, Math.floor((1 - dist / range) * 3));
            if (Math.abs(dx) > Math.abs(dy) * 1.3) {
              next = face.frames.side[level];
              mirrored = face.facingLeft ? dx > 0 : dx < 0;
            } else if (dy < 0) {
              next = face.frames.up[level];
            } else {
              next = face.frames.down[level];
            }
          }
          if (next !== face.current) {
            face.current = next;
            face.el.src = next;
          }
          if (mirrored !== face.mirrored) {
            face.mirrored = mirrored;
            face.el.style.transform = mirrored ? "scaleX(-1)" : "";
          }
        }
      };
      let gazeTimer = 0;
      engine.add({
        update: dt => {
          gazeTimer += dt;
          if (gazeTimer > 0.12) {
            gazeTimer = 0;
            gazeTick();
          }
        },
      });
    }
  }

  const insideScope = (x: number, y: number): boolean => {
    if (!scopeEl) return true;
    const r = scopeEl.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  if (scopeEl) {
    scopeEl.addEventListener("pointerenter", () => {
      document.documentElement.classList.add("pixel-live");
    });
    scopeEl.addEventListener("pointerleave", () => {
      document.documentElement.classList.remove("pixel-live");
    });
  }

  window.addEventListener(
    "pointermove",
    e => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      if (trail && insideScope(e.clientX, e.clientY)) {
        trail.strokeTo(e.clientX, e.clientY);
      }
      idle?.markActive();
    },
    { passive: true }
  );
  window.addEventListener(
    "pointerdown",
    e => {
      pointer.down = true;
      idle?.markActive();
      if (
        engine.motion &&
        pointer.active &&
        explosion &&
        insideScope(e.clientX, e.clientY)
      ) {
        explosion.burst(e.clientX, e.clientY, { count: 16, power: 200 });
      }
    },
    { passive: true }
  );
  window.addEventListener("pointerup", () => {
    pointer.down = false;
  });
  document.documentElement.addEventListener("mouseleave", () => {
    pointer.active = false;
  });
  document.addEventListener("pointerover", e => {
    const el = (e.target as Element | null)?.closest?.("[data-cursor]");
    cursor?.setMode(
      el ? (el.getAttribute("data-cursor") as never) : null,
      engine.now
    );
  });
  window.addEventListener("keydown", () => idle?.markActive());
  window.addEventListener("wheel", () => idle?.markActive(), { passive: true });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(applySize, 120);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) engine.stop();
    else engine.start();
  });

  // ---- CTA 通用：data-pixel-cta 的按钮挂红心 + 舞台兴奋 ----
  document.querySelectorAll<HTMLElement>("[data-pixel-cta]").forEach(cta => {
    let heartTimer = 0;
    const stop = (): void => {
      window.clearInterval(heartTimer);
      heartTimer = 0;
      stage?.setExcited(false);
    };
    cta.addEventListener("pointerenter", () => {
      if (!engine.motion || heartTimer) return;
      stage?.setExcited(true);
      heartTimer = window.setInterval(() => {
        if (!explosion) return;
        const r = cta.getBoundingClientRect();
        explosion.heart(r.left + Math.random() * r.width, r.top + 8);
      }, 170);
    });
    cta.addEventListener("pointerleave", stop);
    cta.addEventListener("click", e => {
      if (!explosion) return;
      explosion.burst(e.clientX, e.clientY, {
        count: 34,
        power: 320,
        colors: [PAL.red, PAL.yellow, PAL.ink, PAL.cyan],
      });
    });
  });

  // ---- MOTION / KIDS 开关 ----
  const motionBtn = $<HTMLButtonElement>("#motion-toggle");
  const kidsBtn = $<HTMLButtonElement>("#kids-toggle");
  const syncButtons = (): void => {
    if (motionBtn) {
      motionBtn.textContent = engine.motion ? "MOTION ON" : "MOTION OFF";
      motionBtn.dataset.on = String(engine.motion);
    }
    if (kidsBtn && walkers) {
      kidsBtn.textContent = walkers.enabled ? "KIDS ON" : "KIDS OFF";
      kidsBtn.dataset.on = String(walkers.enabled);
    }
  };
  motionBtn?.addEventListener("click", () => {
    const on = !engine.motion;
    engine.setMotion(on);
    document.documentElement.classList.toggle("motion-off", !on);
    try {
      localStorage.setItem(motionKey, on ? "on" : "off");
    } catch {}
    if (!on) {
      trail?.clear();
      explosion?.clear();
      cursor?.clear();
      idle?.reset();
    }
    syncButtons();
  });
  kidsBtn?.addEventListener("click", () => {
    if (!walkers || !idle) return;
    walkers.setEnabled(!walkers.enabled);
    idle.enabled = walkers.enabled;
    if (!walkers.enabled) idle.reset();
    try {
      localStorage.setItem("pixel-demo-kids", walkers.enabled ? "on" : "off");
    } catch {}
    syncButtons();
  });
  try {
    if (localStorage.getItem("pixel-demo-kids") === "off") {
      walkers?.setEnabled(false);
      idle?.reset();
    }
  } catch {}
  syncButtons();

  await assets.load(ALL_ASSET_URLS);
  const loading = opts.loadingSelector ? $(opts.loadingSelector) : null;
  if (loading) {
    loading.classList.add("is-done");
    window.setTimeout(() => loading.remove(), 240);
  }
  if (engine.motion) engine.start();

  (window as unknown as Record<string, unknown>).__pixel = {
    engine,
    cursor,
    trail,
    explosion,
    walkers,
    stage,
    idle,
    pointer,
  };

  return {
    engine,
    cursor,
    trail,
    explosion,
    walkers,
    stage,
    idle,
    pointer,
  };
}
