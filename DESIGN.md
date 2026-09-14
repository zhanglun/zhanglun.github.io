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
    padding: "14px 16px"
---

# Design System: 张小伦的网络日志

## Overview

**Creative North Star: "目录小镇"**

这是一份中文技术日志的公开阅读面：白纸目录，不是游戏，也不是品牌站。读者先看见灯塔和站名，再看见一排可点的房子和人，点进去就是真文章。像素只出现在物件、分类图标、点阵标题和首页街景上；一旦开始读正文，世界换成衬线墨水。

密度克制。顶栏一条墨线，街景一条路缘，栏目两条栏。颜色几乎全是纸和灰，邮戳红只用来标「你在哪」和「这是日期」。没有阴影、没有圆角、没有玻璃。Admin 不借用这套皮。

**Key Characteristics:**
- 白底目录 + 全宽街景只留首页
- Fusion Pixel 管站名、导航、日期、分类；正文永远是衬线 18px
- 原创像素房子/人/灯塔当物件，不拿整页当游戏皮
- 邮戳红是稀缺色，不是装饰铺底
- 直角、墨线、无阴影

## Colors

纸地加一枚邮戳。主色不是红，红只是邮戳。

### Primary
- **Postmark Red** (`{colors.stamp}`): 当前导航、分类当前项、「中文日志」徽章、日期、正文链接。出现即表示「这里可点或这里是现在」。

### Neutral
- **Catalog White** (`{colors.paper}`): 顶栏、最新一篇卡片、文章页纸面、搜索框。
- **Directory Grey** (`{colors.ground}`): 站点底，内页默认场地。
- **Pavement** (`{colors.street}`): 仅首页街景路面。
- **Curb** (`{colors.curb}`): 街景路缘的那条硬边。
- **Log Ink** (`{colors.ink}`): 正文、标题、2px 顶栏底边、街景底边、引用左侧 1px 线。
- **Pencil Grey** (`{colors.muted}`): 辅助说明、引用正文、页脚、未建的归档项。
- **Hairline** (`{colors.line}`): 列表行分割。

### Named Rules
**The Stamp Rule.** 邮戳红只做当前态、日期和正文链。不要拿它铺底、做渐变或画大块面板。

**The Paper/Ground Rule.** 顶栏和文章页是纸 (`{colors.paper}`)；目录、搜索、项目、关于站在灰地 (`{colors.ground}`) 上。不要把整站刷成白，也不要把正文刷成灰。

## Typography

**Display Font:** Fusion Pixel（回退 `ui-monospace`）
**Body Font:** Noto Serif SC（回退 Songti SC / Iowan Old Style / Georgia）
**Label/Mono Font:** Fusion Pixel 做标签；代码用系统等宽（ui-monospace / Menlo），只出现在 `pre` / `code`

**Character:** 点阵字是路牌，衬线是读物。两者不许换岗。

### Hierarchy
- **Display** (400, 24px, 1): 站名。只此一次。
- **Headline** (400, 24px): 左栏「分类 / 目录」、右栏「最新 / 全部文章 / 搜索」等栏目名。
- **Title** (600, clamp 26–34px, 1.28): 文章标题、页面 h1。衬线，可折行。
- **Body** (400, 18px / 1.7, max 42rem): 正文、最新一篇摘要、关于页。永远衬线。
- **Label** (400, 12px): 导航、日期、徽章、页脚、街景提示、搜索框。

### Named Rules
**The Object-Only Pixel Rule.** Fusion Pixel 只用于站名、导航、日期、分类短标签、街景提示。正文、文章标题、目录长标题、项目描述一律衬线。禁止整页点阵，禁止长文点阵。

## Layout

首页：顶栏全宽 → 街景全宽 → 主体 `1080px` 居中，两栏 `240px | 1fr`，槽 `40px`，内边 `36px 28px 72px`。街景只在首页出现。

内页同一顶栏，无街景。文章页纸面加宽到 `1120px`，左栏改 TOC `220px`。其余内页左栏仍是分类。

`860px` 以下：顶栏改单列，导航左齐；两栏叠成一列，内边 `24px 16px 56px`；TOC 收成可展开的「目录」；文章头图缩到 56px 并允许折行；列表日期叠到标题上方。页面 `overflow-x: clip`，标题 `overflow-wrap: anywhere`。街景在窄屏上可横向滑，不撑开文档。

### Named Rules
**The Street-Only-Home Rule.** 街景水平占满且只留首页。内页用两栏读字，不要把房子排进文章页。

## Elevation & Depth

没有阴影。深度靠分层：白纸压在灰地上；街景用路面色加 4px 墨色路缘；顶栏 2px 墨线把「牌子」和「镇子」切开。精灵 hover 上移 6px，是唯一的位移，不是投影。

### Named Rules
**The Flat Ink Rule.** 表面是平的。边用墨线，不用阴影、不用 0-blur 色块描边、不用玻璃。

## Shapes

直角。徽章、搜索框、卡片、代码块全部 `0`。像素图 `image-rendering: pixelated`。引用左侧 1px 墨线，不超过 1px，不用邮戳红做侧条。

## Components

### Buttons
没有独立按钮。动作是衬线或点阵文字链。正文链默认邮戳红底边，hover 反相成红底白字。

### Cards / Containers
- **News card:** 白纸，内边 `22px 24px 26px`，无描边无圆角。日期点阵红，标题衬线，摘要 18px。
- **Project card:** 白纸，`48px` 像素房子 + 名称/说明/「源码 / 站点」。
- **Code block:** 墨底灰字，13px 等宽，横向滚动，`max-width: 100%`。

### Inputs / Fields
- **Search:** 白底、3px 墨框、点阵 12px、内边 `10px 14px`。Focus：2px 邮戳红 outline，offset 2px。占位「搜标题或标签」。

### Navigation
- **Masthead:** 灯塔 48px + 点阵站名 + 红徽章「中文日志」；右侧点阵导航。当前项与 hover 为邮戳红。归档是幽灵项，用 Pencil Grey，链到诚实的「未建」页。
- **Category rail:** 24px 像素图标 + 点阵短标签。当前项邮戳红。
- **Post TOC:** 桌面 sticky，`max-height: calc(100dvh - 9rem)` 内滚动（扣掉顶栏后的剩余视口），条目衬线无像素图标；手机收折成「目录」。

### Street
首页签名。15 个原创精灵沿路缘站成一排：可点的房子/人带红点和 hover 提示，树/猫/蜂及未映射的灯塔/绿衣人为 deco。点击进最新几篇真文章。`prefers-reduced-motion` 时取消上移。

## Do's and Don'ts

### Do:
- **Do** 把像素留在物件、分类图标、点阵标题和首页街景。
- **Do** 正文用 Noto Serif SC 18px / 1.7，栏宽不超过 42rem。
- **Do** 归档在菜单里可见，并做成诚实的幽灵页，不要假装已有栏目。
- **Do** 精灵只用 `public/ara/` 里由 `make-worlds.mjs` 画出的图。

### Don't:
- **Don't** 把整页做成游戏 HUD、生命条、背包或长文点阵。
- **Don't** 使用 DOTOWN、官方星露谷、pixels.xyz、Sprout Lands、Kenney 的素材。
- **Don't** 在前台放 Admin 入口，也不要让 Admin 套这套 Layout。
- **Don't** 编读者数、奖项、客户或未上线能力。
- **Don't** 给卡片或引用加超过 1px 的彩色侧条，或给这个世界加圆角和阴影。
