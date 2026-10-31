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
  todSet: "town:todSet", // ("auto"|"day"|"night") HUD → 场景:昼夜模式
  todSync: "town:todSync", // (同上) 场景 → HUD:初始同步
} as const;
