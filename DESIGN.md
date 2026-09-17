---
name: 张小伦的网络日志
description: 白底目录站。像素只做物件，正文可读。
colors:
  stamp: "#d0122a"
  paper: "#ffffff"
  ground: "#f3f3f3"
  street: "#e8e8e8"
  curb: "#c8c8c8"
  ink: "#111111"
  muted: "#444444"
  line: "#dddddd"
typography:
  display:
    fontFamily: "Fusion Pixel, ui-monospace, monospace"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "Fusion Pixel, ui-monospace, monospace"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Noto Serif SC, Songti SC, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(26px, 3vw, 34px)"
    fontWeight: 600
    lineHeight: 1.28
    letterSpacing: "normal"
  body:
    fontFamily: "Noto Serif SC, Songti SC, Iowan Old Style, Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Fusion Pixel, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "28px"
  section: "36px"
  gutter: "40px"
components:
  badge-stamp:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0px"
  nav-link-current:
    backgroundColor: "transparent"
    textColor: "{colors.stamp}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0px"
  search-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 14px"
    width: "36rem"
  news-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "22px 24px 26px"
  project-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0px 0px 14px"
  ink-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
  lot-go:
    backgroundColor: "transparent"
    textColor: "{colors.stamp}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0px 12px"
    height: "44px"
---

# Design System: 张小伦的网络日志

## Overview

**Creative North Star: "目录小镇"**

这是一份中文技术日志的公开阅读面：白纸目录，不是游戏，也不是品牌站。读者先看见小人和站名，再看见一排可点的房子和人，点进去就是真文章。像素只出现在物件、分类图标、点阵标题和首页街景上；一旦开始读正文，世界换成衬线墨水。

密度克制。顶栏一条墨线，街景一条路缘，栏目两条栏。颜色几乎全是纸和灰，邮戳红只用来标「你在哪」和「这是日期」。没有阴影、没有圆角、没有玻璃。Admin 不借用这套皮。

**Key Characteristics:**
- 白底目录 + 全宽街景只留首页
- Fusion Pixel 管站名、导航、日期、分类；正文永远是衬线 18px
- 原创像素房子/人/灯塔当物件，不拿整页当游戏皮
- 邮戳红是稀缺色，不是装饰铺底
- 直角、墨线、无阴影

## Colors

纸地加一枚邮戳。主色不是红，红只是邮戳。真源是 `src/styles/ara.css` 的八个 `--ara-*`。选区、链 hover 反相、街景提示字用字面量白，不另开第九色。

### Primary
- **Postmark Red** (`{colors.stamp}`): 当前导航、分类当前项、日期、正文链接。出现即表示「这里可点或这里是现在」。

### Neutral
- **Catalog White** (`{colors.paper}`): 顶栏、最新一篇卡片、文章页纸面、搜索框。
- **Directory Grey** (`{colors.ground}`): 站点底，内页默认场地。
- **Pavement** (`{colors.street}`): 仅首页街景路面。
- **Curb** (`{colors.curb}`): 街景路缘的那条硬边。
- **Log Ink** (`{colors.ink}`): 正文、标题、2px 顶栏底边、街景底边、引用左侧 1px 线。
- **Pencil Grey** (`{colors.muted}`): 辅助说明、引用正文、页脚。
- **Hairline** (`{colors.line}`): 列表行分割。

### Named Rules
**The Stamp Rule.** 邮戳红只做当前态、日期和正文链。不要拿它铺底、做渐变或画大块面板。

**The Paper/Ground Rule.** 顶栏和文章页是纸 (`{colors.paper}`)；目录、搜索、项目、关于站在灰地 (`{colors.ground}`) 上。不要把整站刷成白，也不要把正文刷成灰。

## Typography

**Display Font:** Fusion Pixel（回退 `ui-monospace`）
**Body Font:** Noto Serif SC（回退 Songti SC / Iowan Old Style / Georgia）
**Label/Mono Font:** Fusion Pixel 做标签；代码用系统等宽（ui-monospace / Menlo），只出现在 `pre` / `code`

**Character:** 点阵字是路牌，衬线是读物。两者不许换岗。

字号写在规则和组件里，没有收进 CSS 变量。12 / 13 / 14 / 16 / 18 / 22 / 24 都是字面量。

### Hierarchy
- **Display** (400, 24px, 1): 站名。内页点阵页题（项目 / 关于 / 404 / 归档占位）共用这一档。
- **Headline** (400, 24px): 左栏「分类 / 目录」、右栏「最新 / 全部文章 / 搜索」等栏目名。工坊分组「还在做 / 以前的铺子」也是这一档。
- **Title** (600, clamp 26–34px, 1.28): 文章标题。衬线，可折行。首页最新一篇标题略小：clamp 22–28px。
- **Body** (400, 18px / 1.7, max 42rem): 正文、最新一篇摘要、关于页、工坊说明。永远衬线。
- **Label** (400, 12px): 导航、日期、副标题、页脚、街景提示、搜索框。分类轨条目是点阵 16px，不另开一档。

正文里还有几处一次性尺寸：TOC 14px / h3 13px，代码块 13px，文章 h2 22px，表 16px。用在原处，不升成系统档。

### Named Rules
**The Object-Only Pixel Rule.** Fusion Pixel 只用于站名、导航、日期、分类短标签、街景提示。正文、文章标题、目录长标题、项目描述一律衬线。禁止整页点阵，禁止长文点阵。

**The Diagram Measure Rule.** 正文 18px 不得漏进 Mermaid。节点 `<p>` 锁 16px / 1.3，与量框一致；`overflow-wrap` 用 normal，不用 anywhere。

## Layout

每页顶栏前一条 skip「跳到主要内容」，链到 `main#main-content`。白纸、2px 墨框、点阵 12px；未聚焦时裁掉。

首页：顶栏全宽 → 街景全宽 → 主体 `1080px` 居中，两栏 `240px | 1fr`，槽 `40px`，内边 `36px 28px 72px`。街景只在首页出现。

内页同一顶栏，无街景。文章页纸面加宽到 `1120px`，左栏改 TOC `220px`，栏槽 `48px`。其余内页左栏仍是分类。

`860px` 以下：顶栏改单列，导航左齐；两栏叠成一列，内边 `24px 16px 56px`；TOC 收成可展开的「目录」；文章头图缩到 56px 并允许折行；列表日期叠到标题上方。页面 `overflow-x: clip`，标题 `overflow-wrap: anywhere`。街景在窄屏上可横向滑，不撑开文档。

### Named Rules
**The Street-Only-Home Rule.** 街景水平占满且只留首页。内页用两栏读字，不要把房子排进文章页。

## Elevation & Depth

没有阴影。深度靠分层：白纸压在灰地上；街景用路面色加 4px 墨色路缘；顶栏 2px 墨线把「牌子」和「镇子」切开。精灵 hover 上移 6px，是唯一的位移，不是投影。

### Named Rules
**The Flat Ink Rule.** 表面是平的。边用墨线，不用阴影、不用 0-blur 色块描边、不用玻璃。

## Shapes

直角。徽章、搜索框、卡片、代码块全部 `0`。像素图 `image-rendering: pixelated`。引用左侧 1px 墨线，不超过 1px，不用邮戳红做侧条。滚动条 12px 直角墨块，灰槽；代码块反色。

## Components

### Buttons
没有独立按钮。动作是衬线或点阵文字链。正文链默认邮戳红底边，hover 反相成红底白字。工坊外链是唯一带框的动作：2px 邮戳红框、点阵 12px、最小点击面 44×44。

### Cards / Containers
- **News card:** 白纸，内边 `22px 24px 26px`，无描边无圆角。日期点阵红，标题衬线 clamp 22–28px，摘要 18px。
- **Project lots:** 桌面两列，分组「还在做 / 以前的铺子」。每个项目一块白纸院子：和街景同一套原创点阵物件站在路缘上，短名当门牌，技术栈当墨签。物件各不相同，不轮换房子。院子 88px 高，64px 物件。
- **Code block:** 墨底灰字，13px 等宽，横向滚动，`max-width: 100%`。
- **Mermaid:** 正文栏内流程图，节点 16px / 1.3，不继承正文 18px。Admin 预览走自己的 `mermaid.initialize`，不套这套皮。

### Chips
- **Ink chip:** 1px 墨框、白底、点阵 12px、内边 `2px 6px`。只出现在工坊地块技术栈，最多两枚。

### Inputs / Fields
- **Search:** 白底、3px 墨框、点阵 12px、内边 `10px 14px`，最宽 `36rem`。Focus：2px 邮戳红 outline，offset 2px。占位「搜标题或标签」。输入框不加 `type="search"`。只搜 title 和 tags；trim 后超过 1 个字才查。无 JS 只保证 idle 壳（`#search-ssr` / `#q-ssr`）和最近八篇，不假装 SSR `?q=`。

### Navigation
- **Masthead:** 小人 48px + 点阵站名 + 副标题「写给以后翻看」；右侧点阵导航（首页 / 文章 / 搜索 / 项目 / 关于）。当前项与 hover 为邮戳红。无归档入口。
- **Category rail:** 32px 像素图标 + 点阵短标签 16px，桌面 sticky。五项与顶栏同岗：最新 / 全部文章 / 搜索 / 项目 / 关于。当前项邮戳红。无归档入口。
- **Post TOC:** 桌面 sticky，`max-height: calc(100dvh - 9rem)` 内滚动（扣掉顶栏后的剩余视口），条目衬线 14px，无像素图标；手机收折成「目录」。
- **Back to top:** 仅文章页。右下角固定，像素向上箭头 +「顶部」，链到 `#top`。白纸 2px 墨框，不是 HUD。

### Street
首页签名。15 个原创精灵沿路缘站成一排：可点的房子/人带红点、hover 提示和文章名 `alt`，树/猫/蜂及未映射的灯塔/绿衣人为 deco。街上不铺可见标题。提示停在精灵上方，路面上留空不裁切。点击进最新几篇真文章。`prefers-reduced-motion` 时取消上移。

## Do's and Don'ts

### Do:
- **Do** 把像素留在物件、分类图标、点阵标题和首页街景。
- **Do** 正文用 Noto Serif SC 18px / 1.7，栏宽不超过 42rem。
- **Do** 导航不放归档。旧 `/archive` 链接落到诚实占位页，指向文章列表。
- **Do** 街景、顶栏小人、分类图标、项目物件都用同一套点阵：街景来自 `make-worlds.mjs`，项目物件来自 `scripts/make-projects.mjs`。

### Don't:
- **Don't** 把整页做成游戏 HUD、生命条、背包或长文点阵。
- **Don't** 使用 DOTOWN、官方星露谷、pixels.xyz、Sprout Lands、Kenney。姿势可参考，原图不进仓库。
- **Don't** 在前台放 Admin 入口，也不要让 Admin 套这套 Layout。
- **Don't** 编读者数、奖项、客户或未上线能力。
- **Don't** 给卡片或引用加超过 1px 的彩色侧条，或给这个世界加圆角和阴影。
