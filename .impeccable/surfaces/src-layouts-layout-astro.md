---
version: 1
slug: "src-layouts-layout-astro"
primary_target: "src/layouts/Layout.astro"
related_targets: ["src/pages/index.astro","src/pages/blog/index.astro","src/pages/blog/[...slug].astro","src/pages/search.astro","src/pages/projects.astro","src/pages/about.astro","src/pages/404.astro"]
---

# Public site · Ara Town

## Scope and mode

Read. 公开站：首页、文章列表与详情、搜索、项目、关于、404。Admin 不在范围内。

## Audience and job

读者来读中文技术笔记、翻档案、看项目和关于。任务是读懂、找到、离开时记得这是 zhanglun 的日志。

## Action

首页点街景进最新几篇；导航和左栏进文章/搜索/项目/关于；文章页用 TOC 跳小节。

## Proof and content

真文章、真项目、关于页简历、Git 真源。不编读者数、奖项、客户。导航不含归档；`/archive` 只留占位页给旧链接。

## Constraints

- 像素只作物件、分类图标、点阵标题、首页街景。正文衬线可读，禁止整页点阵 / 游戏 HUD。
- 街景水平占满且只留首页。内页两栏：文章左 TOC，其余左分类。
- 导航与标签中文。搜索在导航和 Search 页。
- 精灵原创（`public/ara/`），禁止 DOTOWN / 官方星露谷 / pixels.xyz / Sprout Lands 资源。
- 前台不放 Admin 入口。

## Direction

Ara Town（用户锁定；seed `67556832`）。白底目录站 + 全宽可点街景仅首页。

## Memorable moment

第一屏：顶栏小人+站名，下面一排房子和人，点进去就是最新几篇。
