// 场景与 DOM HUD 之间的事件总线。
// 桥接模式对齐 Pixels 客户端：Phaser 与 DOM 通过单一类型化事件总线单向通行，
// 但单机版只留一条总线，不需要 Redux 反向通道。

import Phaser from "phaser";

export const bus = new Phaser.Events.EventEmitter();

export const EV = {
  prompt: "town:prompt", // (string|null) 底部交互提示
  dialog: "town:dialog", // ({name,text}|null) 对话框
  panel: "town:panel", // ({title,blurb,link?}|null) 建筑面板
  touchDir: "town:touchDir", // ({dx,dy,pressed}) 虚拟方向键
  touchAct: "town:touchAct", // () 虚拟交互键
  ready: "town:ready", // ()
  ready: "town:ready", // ()
} as const;

// ---- 昼夜模式:全局单例(HUD 与场景共享,不挂场景生命周期)----
// auto = 按访客本地时间定初始相位并走 150s 循环;day/night 强制定格。
export type TodMode = "auto" | "day" | "night";
export const TOD = { mode: "auto" as TodMode };
try {
  const saved = localStorage.getItem("town-daycycle");
  if (saved === "day" || saved === "night") TOD.mode = saved;
} catch {}

export function setTod(mode: TodMode) {
  TOD.mode = mode;
  try {
    localStorage.setItem("town-daycycle", mode);
  } catch {}
  // ⚠️ Astro 会把 HUD 组件脚本与场景动态导入打成不同模块实例,
  // 单例在两边不共享——用 window 事件桥接,场景监听后同步自己的副本。
  window?.dispatchEvent(new CustomEvent("town:tod", { detail: mode }));
}
