import { Engine, PAL, pointer } from "./core";
import { ALL_ASSET_URLS, Assets, FACES } from "./assets";
import { CursorLayer } from "./cursor";
import { TrailLayer } from "./trail";
import { ExplosionLayer } from "./explosion";
import { StageLayer } from "./stage";
import { WalkerLayer } from "./walkers";
import { IdleLayer } from "./idle";

type FaceSpec = {
  sel: string;
  id: keyof typeof FACES;
  facingLeft: boolean;
};

const FACE_SPECS: FaceSpec[] = [
  { sel: ".face--a", id: "teacher-01", facingLeft: true },
  { sel: ".face--b", id: "teacher-02", facingLeft: true },
  { sel: ".face--c", id: "teacher-03", facingLeft: true },
];

const $ = <T extends Element = HTMLElement>(sel: string): T => {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`pixel demo: missing element ${sel}`);
  return el as T;
};

const canvasEl = (sel: string): HTMLCanvasElement => $<HTMLCanvasElement>(sel);

const boot = async (): Promise<void> => {
  pointer.fine = window.matchMedia("(pointer: fine)").matches;
  const assets = new Assets();
  const engine = new Engine();

  const cursor = new CursorLayer(canvasEl("#cursor-canvas"), assets);
  const trail = new TrailLayer(canvasEl("#trail-canvas"));
  const explosion = new ExplosionLayer(canvasEl("#explosion-canvas"), assets);
  const walkers = new WalkerLayer(canvasEl("#walker-canvas"), assets);
  const stage = new StageLayer(canvasEl("#stage-canvas"), assets);
  const idle = new IdleLayer(canvasEl("#idle-canvas"), assets, {
    smoke: (x, y) => explosion.smoke(x, y),
    hearts: (x, y) =>
      explosion.burst(x, y, {
        count: 26,
        colors: [PAL.red, PAL.yellow, PAL.cyan],
      }),
  });

  cursor.onChangeColor = color => trail.setColor(color);
  cursor.onModeBurst = (x, y) =>
    explosion.burst(x, y, { count: 10, power: 150 });

  engine.add(walkers);
  engine.add(stage);
  engine.add(idle);
  engine.add(explosion);
  engine.add(trail);
  engine.add(cursor);

  const applySize = (): void => {
    engine.resize(window.innerWidth, window.innerHeight);
    const section = document.querySelector(".first-view");
    if (section) {
      const rect = section.getBoundingClientRect();
      stage.resize(Math.floor(rect.width), Math.floor(rect.height));
    }
  };
  applySize();

  const motionOn = !document.documentElement.classList.contains("motion-off");
  engine.setMotion(motionOn);
  if (motionOn) trail.setColor(PAL.ink);

  // ---- gaze: floating faces follow the pointer ----
  const faces = FACE_SPECS.map(spec => ({
    el: $<HTMLImageElement>(spec.sel),
    frames: FACES[spec.id],
    facingLeft: spec.facingLeft,
    current: "",
    mirrored: false,
  }));

  const updateGaze = (): void => {
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
        updateGaze();
      }
    },
  });

  // ---- pointer wiring ----
  window.addEventListener(
    "pointermove",
    e => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      trail.strokeTo(e.clientX, e.clientY);
      idle.markActive();
    },
    { passive: true }
  );
  window.addEventListener("pointerdown", e => {
    pointer.down = true;
    idle.markActive();
    if (engine.motion && pointer.active) {
      explosion.burst(e.clientX, e.clientY, { count: 16, power: 200 });
    }
  });
  window.addEventListener("pointerup", () => {
    pointer.down = false;
  });
  document.documentElement.addEventListener("mouseleave", () => {
    pointer.active = false;
  });
  document.addEventListener("pointerover", e => {
    const el = (e.target as Element | null)?.closest?.("[data-cursor]");
    cursor.setMode(
      el ? (el.getAttribute("data-cursor") as never) : null,
      engine.now
    );
  });
  window.addEventListener("keydown", () => idle.markActive());
  window.addEventListener("wheel", () => idle.markActive(), { passive: true });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(applySize, 120);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) engine.stop();
    else engine.start();
  });

  // ---- CTA: rising hearts + robot excites ----
  const cta = $("#cta");
  let heartTimer = 0;
  const stopHearts = (): void => {
    window.clearInterval(heartTimer);
    heartTimer = 0;
    stage.setExcited(false);
  };
  cta.addEventListener("pointerenter", () => {
    if (!engine.motion || heartTimer) return;
    stage.setExcited(true);
    heartTimer = window.setInterval(() => {
      const r = cta.getBoundingClientRect();
      explosion.heart(r.left + Math.random() * r.width, r.top + 8);
    }, 170);
  });
  cta.addEventListener("pointerleave", stopHearts);
  cta.addEventListener("click", e => {
    explosion.burst(e.clientX, e.clientY, {
      count: 34,
      power: 320,
      colors: [PAL.red, PAL.yellow, PAL.ink, PAL.cyan],
    });
  });

  // ---- toggles ----
  const motionBtn = $<HTMLButtonElement>("#motion-toggle");
  const kidsBtn = $<HTMLButtonElement>("#kids-toggle");
  const syncButtons = (): void => {
    motionBtn.textContent = engine.motion ? "MOTION ON" : "MOTION OFF";
    motionBtn.dataset.on = String(engine.motion);
    kidsBtn.textContent = walkers.enabled ? "KIDS ON" : "KIDS OFF";
    kidsBtn.dataset.on = String(walkers.enabled);
  };
  motionBtn.addEventListener("click", () => {
    const on = !engine.motion;
    engine.setMotion(on);
    document.documentElement.classList.toggle("motion-off", !on);
    try {
      localStorage.setItem("pixel-demo-motion", on ? "on" : "off");
    } catch {}
    if (!on) {
      trail.clear();
      explosion.clear();
      cursor.clear();
      idle.reset();
    }
    syncButtons();
  });
  kidsBtn.addEventListener("click", () => {
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
      walkers.setEnabled(false);
      idle.enabled = false;
    }
  } catch {}
  syncButtons();

  // ---- boot ----
  await assets.load(ALL_ASSET_URLS);
  const loading = $("#loading");
  loading.classList.add("is-done");
  window.setTimeout(() => loading.remove(), 240);
  if (engine.motion) engine.start();

  (window as unknown as Record<string, unknown>).__pixel = {
    engine,
    cursor,
    trail,
    explosion,
    stage,
    walkers,
    idle,
    pointer,
  };
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void boot());
} else {
  void boot();
}
