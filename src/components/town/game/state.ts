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
  diary: "town:diary", // () 打开小镇日记
  list: "town:list", // ({kind,index?}|null) 列表面板(归档/项目/标签/友链/年报…,HUD 解析 town-data 渲染)
  search: "town:search", // (boolean) 打开(true)/关闭(false)搜索浮层
  playerTile: "town:playerTile", // ({x,y}) 玩家所在 tile(小地图标记,WorldScene 发)
  travel: "town:travel", // (id) 点小地图建筑传送(WorldScene/InteriorScene 收)
  collect: "town:collect", // ({caught,total}) 捉到萤火虫,HUD 出计数角标
} as const;

// EV.list 载荷:场景只报「哪类联动」,内容由 HUD 从 town-data 解析
export interface ListRequest {
  kind: "archive" | "projects" | "annual" | "about" | "guestbook" | "tag";
  index?: number; // archive = 第几排书架;tag = 第几根图腾
}

// ---- 昼夜模式:全局单例(HUD 与场景共享,不挂场景生命周期)----
// auto = 按访客本地时间定初始相位并走 150s 循环;real = 跟随真实时钟
// (19:00-7:00 为夜);day/night 强制定格。
export type TodMode = "auto" | "real" | "day" | "night";
export const TOD = { mode: "auto" as TodMode };
try {
  const saved = localStorage.getItem("town-daycycle");
  if (saved === "real" || saved === "day" || saved === "night")
    TOD.mode = saved;
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
