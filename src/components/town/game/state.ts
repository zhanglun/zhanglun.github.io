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

// ---- 天气模式:全局单例(桥接方式与 TOD 同款)----
// auto = 实况(实况解析由 HUD 侧完成:IP 定位 → Open-Meteo,失败回退
// 日期哈希);clear/rain/snow = 强制。实况结果存 sessionStorage
// (town-realweather,会话内复用,不重复请求第三方)。
export type WeatherMode = "auto" | "clear" | "rain" | "snow";
export type WeatherKind = "clear" | "rain" | "snow";
export const WEATHER: { mode: WeatherMode } = { mode: "auto" };
try {
  const saved = localStorage.getItem("town-weather");
  if (saved === "clear" || saved === "rain" || saved === "snow")
    WEATHER.mode = saved;
} catch {}

export function setWeatherMode(mode: WeatherMode) {
  WEATHER.mode = mode;
  try {
    localStorage.setItem("town-weather", mode);
  } catch {}
  window?.dispatchEvent(new CustomEvent("town:weather-mode", { detail: mode }));
}

export function setRealWeather(w: WeatherKind) {
  try {
    sessionStorage.setItem("town-realweather", w);
  } catch {}
  window?.dispatchEvent(new CustomEvent("town:realweather", { detail: w }));
}

export function getRealWeather(): WeatherKind | null {
  try {
    const w = sessionStorage.getItem("town-realweather");
    if (w === "clear" || w === "rain" || w === "snow") return w;
  } catch {}
  return null;
}

// ---- 钓鱼鱼种(图鉴与稀有度,场景掷签与 HUD 手册共用)----
export type FishRarity = "junk" | "common" | "uncommon" | "rare" | "legendary";
export interface FishSpecies {
  id: string;
  name: string;
  rarity: FishRarity;
}
export const FISH_SPECIES: FishSpecies[] = [
  { id: "boot", name: "破木靴", rarity: "junk" },
  { id: "crucian", name: "鲫鱼", rarity: "common" },
  { id: "minnow", name: "小白条", rarity: "common" },
  { id: "loach", name: "泥鳅", rarity: "common" },
  { id: "shrimp", name: "湖虾", rarity: "common" },
  { id: "crab", name: "螃蟹", rarity: "uncommon" },
  { id: "sunfish", name: "蓝鳃太阳鱼", rarity: "uncommon" },
  { id: "blue", name: "湖心大青鱼", rarity: "rare" },
  { id: "koi", name: "金色锦鲤", rarity: "legendary" },
];
export const FISH_RARITY_LABEL: Record<FishRarity, string> = {
  junk: "杂物",
  common: "常见",
  uncommon: "少见",
  rare: "稀有",
  legendary: "传说",
};

// ---- 镇长每日心愿(日期哈希四选一,桥接方式与 TOD 同款)----
export type WishKind = "fish" | "treasure" | "firefly" | "chat";
export const WISH_LABEL: Record<WishKind, string> = {
  fish: "钓一条鱼",
  treasure: "挖出今日宝藏",
  firefly: "入夜后捉一只萤火虫",
  chat: "去听听镇上人的近况",
};
export interface WishState {
  date: string;
  kind: WishKind;
  done: boolean;
}
export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
// 读取(或确定性生成)今日心愿:同一天重复调用结果一致
export function ensureWish(): WishState {
  const date = todayKey();
  let h = 0;
  for (const c of date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const kinds: WishKind[] = ["fish", "treasure", "firefly", "chat"];
  const kind = kinds[h % 4];
  try {
    const raw = JSON.parse(localStorage.getItem("town-wish") ?? "null") as
      | (WishState & { kind?: WishKind })
      | null;
    if (raw && raw.date === date && raw.kind === kind)
      return { date, kind, done: !!raw.done };
  } catch {}
  return { date, kind, done: false };
}
// 完成心愿:仅当类型匹配且未完成时生效;返回是否刚刚完成
export function completeWish(kind: WishKind): boolean {
  const w = ensureWish();
  if (w.kind !== kind || w.done) return false;
  const done: WishState = { ...w, done: true };
  try {
    localStorage.setItem("town-wish", JSON.stringify(done));
  } catch {}
  window?.dispatchEvent(new CustomEvent("town:wish", { detail: done }));
  return true;
}
