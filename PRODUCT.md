# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary users, on two surfaces:

- **读者**：来读技术文章、翻档案、看项目和个人介绍。任务是读懂、找到、离开时对作者有印象。
- **作者（zhanglun）**：唯一管理员。任务是写草稿、预览、插图、发布或撤回。在浏览器里完成，不必先在本地改 Markdown 再 push。

后续设计按表面选用户：前台为读者，`/admin` 为作者。不要把后台入口混进前台。

## Product Purpose

这是「张小伦的网络日志」：一份用 Markdown + Git 维护的中文技术笔记，对外是静态博客，对内是私有写作台。

成功对读者意味着能读到已发布的文章、项目和关于页；对作者意味着能从 `/admin` 列出、搜索、筛选、新建、保存草稿、发布、取消发布、删除，并把改动写回 Git。

## Positioning

Git 是内容真源，不是外挂 CMS。文章和图住在 `src/content/blogs/`。私有 Admin 经 GitHub Contents API 写回本仓库：草稿提交带 `[skip ci]`，发布才触发 Vercel 部署。别人的个人博客可以长得像博客，但不能声称「这份日志的源就是这个 Git 仓库，写作台只是仓库的浏览器入口」。

## Operating Context

- 读者走公开站：首页、博客列表与详情、搜索、项目、关于、RSS。生产构建过滤 `draft: true`。
- 作者靠书签打开 `https://<生产域名>/admin/`。GitHub OAuth，仅 `ADMIN_GITHUB_USER_ID` 可进。前台不放后台链接。
- 写作：Markdown 正文 + frontmatter（title、date、tags、categories、draft；可选 description / cover / ogImage）。图片进该文 `images/`，相对路径引用；上传 ≤4MB，仅 PNG/JPEG/WebP。
- 部署：Vercel，`master` push 自动部署。本地 `pnpm dev` 默认 `http://localhost:3000`。无 `PUBLIC_ADMIN_ORIGIN` 时 Admin 走 fixture，不打生产 API。
- 改 `api/` 后必跑：`node tests/admin-api-local.mjs && pnpm build`。

## Capabilities and Constraints

Confirmed:

- 公开站：文章列表/详情、标签与分类、全文搜索（Fuse.js）、项目页、关于页、RSS、OG 图。
- Admin：列表、标题搜索、草稿/已发布筛选、新建、CodeMirror Markdown 编辑、预览（含 Mermaid）、保存草稿、发布、取消发布、删除、粘贴/拖拽/选择上传图片。
- API：`/api/auth/*`、`/api/posts`（path 用 query，不用 catch-all）、`/api/preview`、`/api/images/upload`。GitHub 写入只用 Contents API（Git Data API 会超 Vercel 10s）。
- 导航不含归档。`/archive` 只留占位页给旧链接，不做按年按月目录。

Constraints:

- 不要把 Admin 做成多人 CMS、评论系统或营销站。
- 不要编造读者数、评测、客户名、竞品对比。
- 中文第一人称技术笔记；不要改成品牌站或英文营销口吻。

Undecided: 无障碍标准。

## Brand Commitments

- 站名：**张小伦的网络日志**
- 作者：**zhanglun**
- 站点：`https://zhanglun.github.io`
- 自我介绍（`src/config.ts`）：「Halo! 我是 zhanglun 👋🏼 一位软件开发工程师。」
- 声音：中文、第一人称、技术笔记。绑定约束，不是视觉方向。

## Evidence on Hand

Real, in-repo:

- 已发布与草稿文章：`src/content/blogs/`
- 关于页文稿：`src/content/about/`
- 项目列表：`src/data/projects.ts`（含 amber、Lettura 等真实仓库）
- 站点图：`public/`（含 `site-image.png`、favicon、项目图标）

Must not fabricate: 读者数、订阅数、奖项、客户 logo、虚构推荐语、未上线的产品能力。

## Product Principles

1. **Git 是真源。** 界面可以写仓库，不能另起一套内容库。
2. **两个用户，两套表面。** 读者的阅读任务和作者的发布任务分开；后台不出现在前台导航。
3. **草稿安静，发布才出声。** 未完成的文字不进生产构建，也不触发无谓部署。
4. **只陈述手里有的。** 没有的社交证明、数据、客户故事，不写进任何表面。
5. **像一份日志，不像一个品牌。** 中文、第一人称、技术内容优先。
