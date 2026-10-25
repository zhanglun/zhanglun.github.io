// 游戏状态、事件总线与存档。
// 桥接模式对齐 Pixels 客户端：Phaser 与 DOM 通过单一类型化事件总线双向通行，
// 但单机版只留一条总线，不需要 Redux 反向通道。

import Phaser from "phaser";

export const bus = new Phaser.Events.EventEmitter();

export const EV = {
  prompt: "town:prompt", // (string|null) 底部交互提示
  dialog: "town:dialog", // ({name,text}|null) 对话框
  panel: "town:panel", // ({title,blurb,link?}|null) 建筑面板
  energy: "town:energy", // (number)
  quest: "town:quest", // ({delivered,need,done})
  tool: "town:tool", // (number) 当前工具
  toast: "town:toast", // (string) 浮现提示
  touchDir: "town:touchDir", // ({dx,dy,pressed})
  touchAct: "town:touchAct", // ()
  touchUse: "town:touchUse", // ()
  ready: "town:ready",
} as const;

export interface CropState {
  c: number; // 作物类型索引（CROP_KEYS 顺序）
  s: number; // 阶段 0..2
  t: number; // 进入当前阶段的时间戳
  watered: boolean;
}

export interface TownSave {
  energy: number;
  quest: number;
  questDone: boolean;
  crops: Record<string, CropState>;
  x?: number;
  y?: number;
}

const SAVE_KEY = "town-save-v1";

export const G = {
  energy: 0,
  quest: 0,
  questDone: false,
  crops: new Map<string, CropState>(),
  spawn: { x: 0, y: 0 },
  dirty: false,
};

export function loadSave(): TownSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as TownSave) : null;
  } catch {
    return null;
  }
}

export function applySave(s: TownSave) {
  G.energy = s.energy ?? 0;
  G.quest = s.quest ?? 0;
  G.questDone = !!s.questDone;
  G.crops = new Map(Object.entries(s.crops ?? {}));
}

export function persist(x?: number, y?: number) {
  try {
    const prev = loadSave();
    const data: TownSave = {
      energy: G.energy,
      quest: G.quest,
      questDone: G.questDone,
      crops: Object.fromEntries(G.crops),
      x: x ?? prev?.x,
      y: y ?? prev?.y,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // 隐私模式等场景存不了就算了，游戏照玩
  }
}

export function addEnergy(n: number) {
  G.energy += n;
  bus.emit(EV.energy, G.energy);
  persist();
}

export function toast(text: string) {
  bus.emit(EV.toast, text);
}

// 作物生长：每阶段基础 12s，浇水后该阶段缩短一半（进入阶段时已浇水则生效）
export const STAGE_MS = 12_000;
export const CROP_KEYS = ["carrot", "corn", "tomato", "cabbage"] as const;
