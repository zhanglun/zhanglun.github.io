# /town 像素小镇 — 开发上下文

本文档记录 /town 的定位、技术决策、素材来源、调试经验与已知边界，供后续迭代参考。

## 概述

**定位（2026-10-25 起）：博客的小镇形态**，不是游戏。
镇子即站点地图：四向行走、踩格自动进门、五栋可进建筑
（书屋/工坊/邮局/咖啡馆/小屋，分别串联 /blog、/projects、/about）、
人形村民对话、跟随小史莱姆、日夜循环。
桌面键盘 + 移动端虚拟键双支持。

**已移除**：任务与经济、能量、开垦/播种/浇水、收获、砍树、
localStorage 存档、工具栏与相关 HUD（早期从 pixel.xyz 逆向带来的玩法层，
与「博客的小镇形态」定位不符）。砍树残留树桩、`mystic-objects` 引用等
一并清理；`state.ts` 收敛为纯事件总线。

## 技术栈与架构

- **Phaser 3.90**（唯一运行时依赖，仅 /town 页面加载）
- **素材（2026-10-25 v5 起）**：
  - 世界图块/建筑：**Serene Village revamped**（LimeZu，**CC-BY 4.0**），
    `scripts/extract-town-sv.mjs` 按连通域包围盒从原 tileset 裁切成独立 PNG
  - 村民：**Modern Interiors Free**（LimeZu，免费版仅非商业）人形 idle 动画
  - 史莱姆（玩家/宠物）：本站原创，`scripts/make-slime.mjs` 程序化绘制
  - 室内墙面/木地板：运行时程序化生成（`buildIndoorVariants`）
- **模块**：
  - `game/assets.ts` — 素材清单与索引（含地面/室内程序化纹理生成器）
  - `game/world.ts` — 地图/建筑/装饰/NPC 数据驱动定义（`buildGround`/`buildProps`）
  - `game/state.ts` — 类型化事件总线（场景 ↔ HUD 单向通信）
  - `game/scenes.ts` — WorldScene/InteriorScene（地面 RenderTexture、
    SV 成品房屋 sprite 居中绘制、碰撞网格、日夜、转场、调试边框）
- **渲染要点**：内部分辨率 + 整数倍 zoom、相机跟随取整防抖、
  树冠半透明（玩家被遮挡时树变 55% 透明）、debug 边框（`?debug=1` 或按 D：
  红=碰撞格、绿=树、黄=建筑、白=玩家碰撞盒）
- **路径与门牌（2026-10-28）**：道路为程序化方齿草缘贴片
  （`buildPathTiles`，16 种邻接组合，泥色取自 sv-dirt）；门径 2 格宽，
  与房屋 sprite 底部门阶对齐；每栋建筑门口立程序化门牌
  （`buildNameplate`），走近按 E 出面板（定位介绍 + 前往链接）；
  室内家具差异化（`buildFurniture`：书架/工作台/柜台/炉子/床/信件架），
  进门自动弹屋主格言。

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

- **Serene Village revamped**：CC-BY 4.0，署名 LimeZu 即可自由使用与再分发
  （`public/town/ASSETS.md` 即署名）。取代 Mystic Woods 的主因。
- **Modern Interiors Free（char/）**：免费版 LICENSE 为**仅非商业**。
  本站为个人非商业博客；若站点引入广告等商业行为，需购买完整版或移除该目录。
- **程序化生成纹理**（`public/town/gen/`、室内）：本站原创，无授权限制。

## 已移除的素材（及原因）

| 来源 | 状态 | 原因 |
|---|---|---|
| Mystic Woods 免费版 | 已移除（2026-10-25 v5） | 非商业 + 禁再分发，公开仓库属灰色地带；被 SV(CC-BY)/MI 方案替换 |
| Kenney Tiny 系列（CC0） | 已移除 | 用户要求统一画风；CC0 本身无限制 |
| Tiny 16 Basic（CC-BY） | 已移除 | 同上 |
| Ara 站内素材（原创） | 已移除 | 用户要求去站内素材 |
| Pixels AGPL 角色 | 已移除 | 用户要求统一画风 |
| MI 付费版角色 | 未采用 | 可商用但**禁止再分发**，进不了公开仓库，等于白换 |

## 关键踩坑记录（素材索引）

1. **Kenney Tiny 系列为 12 列**（192px 宽 ÷ 16），不是直觉的 10 列
   ——官方 sampleSheet.tsx 确认，逐格裁切验证。
2. **Mystic objects.png 免费版整个 sheet 叠加水印暗底**：
   物件类（树/石/牌/家具）prop 不可直接裁切使用（黑底块），
   树/花等仅部分格干净（逐格像素扫描 + 目视双重筛选）。
3. **Tiny-16 角色表行序**：行 0=正面(down)、行 1=侧面(素材朝左)、行 3=背面(up)。
   同一 sheet 的 idle 与 walk 行**朝向可能相反**（Mystic player：idle 朝右、
   walk 朝左），flip 逻辑须按动画类型分别设置。
4. **帧索引换算**：`frame = row * cols + cols 列数按图实测`，
   跨 sheet 复用索引时务必重新确认列数。
5. **esbuild 不做类型检查**：未定义标识符（如曾发生的 `INDOOR`、`CROP_KEYS`
   未导入）构建全绿、运行时才 ReferenceError。改完 scenes 必须实际打开
   页面走一遍进门/对话，或给 town 加 astro check。
6. **SV 16x16 sheet 的树行是「树冠融合的连绵树篱」，不能用 32px 硬切**
   （v5 最大踩坑，「树被整齐截断」的真正根因）。树冠实际宽 38-76px 且
   相互压叠，连通域扫描整行报成一个块；任何 32px 硬切都会得到
   「树冠碎片 + 邻树树干残段」的拼接怪——单张裁切图看起来"像一棵树"，
   放进游戏才暴露。先后误诊为渲染 bug、色彩融合、浏览器缓存（缓存问题
   真实存在但只是次生，见第 9 条），最终由用户指出「少了左边和右边」
   才定位。**正确手法：树从 RPG_MAKER_XP 版取**（`Serene_Village_XP.png`，
   树按 64px 间距独立排布、像素密度 2x，裁后缩 50% 回 16px）；
   若必须从 16x16 sheet 裁，先扫树行底部橙色树干簇、以树干为中心取
   窗口，并确认该行树冠不融合。`extract-town-sv.mjs` 内坐标均由此法
   得出，勿凭直觉改。另：素材文件在 dev 服务器运行中重新生成时，浏览器
   可能缓存写入到一半的残缺 PNG（头完好、数据截断），素材 URL 需带
   `?v=ASSET_VERSION` 破缓存，内容变更时递增。
7. **LimeZu 角色表布局**：`*_idle_anim_16x16.png` 为 384x32 = 24 帧
   （16x32/帧），6 帧 × [下/上/左/右]，待机取朝下前 6 帧；walk 表
   （Adam_16x16.png 384x224）同序但分 7 行服装变体。方向顺序
   **不是**常见的 down/right/up/left，是 down/up/left/right（目检确认）。
8. **树要画接触阴影**：SV 树 sprite 高 38-43px、按 3 行占格，边界树行距
   必须 ≥3 行且与顶/底行同列错开，否则上下树冠互相遮挡；散树占位检查
   须覆盖全部 2×3 占格，只查单列会同排水平重叠。另外 SV 树的草基是
   浅绿色，贴在同色系草地上对比度低——每棵树脚下画硬边像素接触阴影
   （`town-shadow`，无模糊），与 ARA 项目页「硬边像素接触阴影」规则一致。
   （注：排查「树被截断」时先后误诊过渲染 bug 与色彩融合，真正根因是
   第 6 条的树篱拼接怪裁切 + 浏览器缓存了写入中途的残缺 PNG，见第 9 条。）

## 关键踩坑记录（运行时）

1. **canvas 纹理不能用 drawFrame(key, 0)**——canvas 纹理只有 `__BASE` 帧，
   传数字帧会渲染 missing（黑块+对角线）。用 `rt.draw(key, x, y)`。
2. **RenderTexture/数据字段须挂在 this 上**——create 内局部变量
   与字段脱节会导致后续 update 引用 undefined。
3. **事件处理器中的动态 import 失败是 unhandledrejection**——
   errbar 须同时监听 `window.error` 与 `unhandledrejection`。
4. **自动进门用边沿触发**（先离开门前格再踩上才触发），
   电平触发会导致「出门即被吸回」。
5. **场景重启是同一实例**——create 里须重置提示去重标记等实例状态。
   相机同理：场景重启时相机被重置到初始位，而 `startFollow` 是 0.09 插值
   平滑追踪——不手动对准的话，每次出屋都能看到相机从重置位一路平移到
   门口（v5 用户反馈）。create 里 `centerOn(玩家)` + `fadeIn(200)` 即可。
6. **`load.image` 的纹理不能 `generateFrameNumbers`**——动画帧需要
   spritesheet（SHEETS 注册），独立 PNG 一律走 IMAGES。
7. **后台标签页 rAF 暂停**——自动化测试时 `delayedCall` 转场不会推进，
   需 `game.loop.tick(performance.now())` 配合真实 sleep 手动步进。
8. **浏览器缓存残缺 PNG（v5 实际踩坑，症状极像渲染 bug）**——素材文件在
   dev 服务器与浏览器都开着时被重新生成，浏览器恰好在写入中途请求
   tree-*.png，缓存了「PNG 头声明 38px、图像数据只有 30 行」的残缺文件。
   症状：树干/树基缺一截，但文件、帧、变换、渲染顺序、遮挡排查全部正常；
   `getSourceImage()` 尺寸也对（头是好的），唯有 GPU 纹理残缺。
   定位手法：同一位置换 fresh fetch（cache: no-store）解码的纹理，
   完整→缓存问题实锤。解法：素材 URL 加 `?v=ASSET_VERSION`，
   素材内容变更时递增。

## 已知边界与后续方向

- 换 SV 素材后房间门只有一格宽、建筑 sprite 与占格并非整格对齐
  （居中绘制），若调整建筑尺寸需同步检查门前小径与碰撞。
- 路灯夜光、NPC 对话扩充、室内装饰丰富度可继续迭代。
- MI 免费版村民仅限非商业用途（见 ASSETS.md），商业化前需替换。
