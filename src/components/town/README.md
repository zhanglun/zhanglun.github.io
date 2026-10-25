# /town 像素小镇 — 开发上下文

本文档记录 /town 的技术决策、素材来源、调试经验与已知边界，供后续迭代参考。

## 概述

Astro 博客内的 Phaser 3 像素小镇页面（`/town`）：四向行走、踩格自动进门、
五栋可进建筑（书屋/工坊/邮局/咖啡馆/小屋，分别串联 /blog、/projects、/about）、
种植循环（锄→种→浇→收）、砍树、史莱姆村民对话与胡萝卜任务、跟随小史莱姆、
日夜循环、localStorage 自动存档。桌面键盘 + 移动端虚拟键双支持。

## 技术栈与架构

- **Phaser 3.90**（唯一运行时依赖，仅 /town 页面加载）
- **素材**：Mystic Woods 免费版（itch.io，Game Endeavor）为唯一外部素材来源；
  缺失内容（房子/作物/道具/特效/树）由**构建期程序化生成**补齐
  （`public/town/gen/`，生成脚本逻辑见 game/assets.ts 注释，色调与 Mystic 对齐）
- **模块**：
  - `game/assets.ts` — 素材清单与索引（含程序化纹理生成器 `buildGroundVariants`）
  - `game/world.ts` — 地图/建筑/装饰/NPC 数据驱动定义（`buildGround`/`buildProps`）
  - `game/state.ts` — 事件总线（bus/EV）+ 存档（localStorage，8s 心跳 + 关键动作）
  - `game/scenes.ts` — WorldScene/InteriorScene（地面 RenderTexture、
    程序化石屋拼装 makeMysticHouse、碰撞网格、日夜、转场、调试边框）
- **渲染要点**：内部分辨率 + 整数倍 zoom、相机跟随取整防抖、
  树冠半透明（玩家被遮挡时树变 55% 透明）、debug 边框（`?debug=1` 或按 D：
  红=碰撞格、绿=可砍树、黄=建筑、白=玩家碰撞盒）

## 架构模式（受 Pixels 开源客户端启发）

参考 Mystic Woods 同类游戏 Pixels 的开源客户端
（gitlab.com/pixels-online-oss，AGPL），借鉴其**架构模式**（未复制代码）：

- 数据驱动的实体定义（props/buildings/NPC 均为声明式数据）
- 自定义地面格式 + 程序化生成（无 Tiled 依赖）
- 统一交互管线（nearestInteract 集中裁决，场景只发事件）
- 类型化事件总线（场景 ↔ HUD 单向通信）
- 单机化裁剪：无服务器/多人/权威状态（Pixels 的 Colyseus/权限层不适用）

## 素材来源与许可

详见 `public/town/ASSETS.md`。要点：

- **Mystic Woods 免费版**：非商业许可、禁止再分发。公开仓库属灰色地带
  （三个合规选项见 ASSETS.md）。免费版 objects.png **整体叠有水印暗底**，
  物件类 prop 不可直接使用（历史教训，见下）。
- **程序化生成纹理**（`public/town/gen/`）：本站原创，无授权限制。

## 已移除的素材（及原因）

| 来源 | 状态 | 原因 |
|---|---|---|
| Kenney Tiny 系列（CC0） | 已移除 | 用户要求统一 Mystic 风格；CC0 本身无限制 |
| Tiny 16 Basic（CC-BY） | 已移除 | 同上 |
| Ara 站内素材（原创） | 已移除 | 用户要求去站内素材 |
| Pixels AGPL 角色 | 已移除 | 用户要求统一 Mystic |

## 关键踩坑记录（素材索引）

1. **Kenney Tiny 系列为 12 列**（192px 宽 ÷ 16），不是直觉的 10 列
   ——官方 sampleSheet.tsx 确认，逐格裁切验证。
2. **Mystic objects.png 免费版整个 sheet 叠加水印暗底**：
   物件类（树/石/牌/家具）prop 不可直接裁切使用（黑底块），
   树/花等仅部分格干净（逐格像素扫描 + 目视双重筛选）。
3. **Tiny-16 角色表行序**：行 0=正面(down)、行 1=侧面(素材朝左)、行 3=背面(up)。
   同一 sheet 的 idle 与 walk 行**朝向可能相反**（Mystic player：idle 朝右、
   walk 朝左），flip 逻辑须按动画类型分别设置。
4. **帧索引换算**：`frame = row * cols + col`，cols = 图宽 ÷ 帧宽。
   跨 sheet 复用索引时务必重新确认列数（at() 帮助函数防手滑）。

## 关键踩坑记录（运行时）

1. **canvas 纹理不能用 drawFrame(key, 0)**——canvas 纹理只有 `__BASE` 帧，
   传数字帧会渲染 missing（黑块+对角线）。用 `rt.draw(key, x, y)`。
2. **RenderTexture/数据字段须挂在 this 上**——create 内局部变量
   与字段脱节会导致后续 update/useTool 引用 undefined。
3. **事件处理器中的动态 import 失败是 unhandledrejection**——
   errbar 须同时监听 `window.error` 与 `unhandledrejection`。
4. **自动进门用边沿触发**（先离开门前格再踩上才触发），
   电平触发会导致「出门即被吸回」。
5. **场景重启是同一实例**——create 里须重置提示去重标记等实例状态。

## 已知边界与后续方向

- 作物目前仅胡萝卜一种（程序化三阶段）；可扩展玉米/番茄等（改 CROP 数据）。
- 砍树后不重生；可加定时重生或随机分布。
- 路灯夜光、NPC 任务扩充、室内装饰丰富度可继续迭代。
- Mystic Woods 免费版的完整房子/更多角色在 $3.99 付费版；
  如需商用请购买作者授权。
