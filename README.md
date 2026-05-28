# zhanglun.github.io

张小伦的网络日志。项目基于 Astro 构建，主要用于发布博客、项目页和个人介绍内容。

## 技术栈

- [Astro](https://astro.build/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Fuse.js](https://www.fusejs.io/)
- [Mermaid](https://mermaid.js.org/)
- [Notion API](https://developers.notion.com/) 内容同步

## 本地开发

项目使用 pnpm 管理依赖。

```bash
pnpm install
pnpm dev
```

开发服务默认运行在 `http://localhost:3000`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务 |
| `pnpm start` | `pnpm dev` 的别名 |
| `pnpm build` | 构建生产版本到 `dist/` |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm format:check` | 检查 Prettier 格式 |
| `pnpm format` | 格式化代码 |
| `pnpm download` | 从 Notion 同步文章内容 |
| `pnpm storybook` | 启动 Storybook |
| `pnpm cz` | 使用 Commitizen 提交 |

## 项目结构

```text
.
├── public/              # 静态资源、字体、站点图片
├── scripts/             # Notion 内容同步脚本
├── src/
│   ├── assets/          # 资源引用
│   ├── components/      # Astro 和 React 组件
│   ├── content/         # Markdown 内容
│   │   ├── about/       # 个人介绍内容
│   │   ├── blogs/       # 本地博客文章
│   │   ├── labs/        # 实验内容
│   │   └── notion/      # Notion 同步文章
│   ├── data/            # 静态数据
│   ├── layouts/         # 页面布局
│   ├── pages/           # Astro 路由页面
│   ├── styles/          # 全局样式
│   ├── utils/           # 工具函数
│   ├── config.ts        # 站点配置
│   └── content.config.ts # Astro 内容集合配置
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
└── package.json
```

## 内容管理

博客内容由 Astro Content Collections 管理，集合定义在
`src/content.config.ts`。

- `blogs`: 读取 `src/content/blogs/**/*.md`
- `notion`: 读取 `src/content/notion/**/index.md`

文章 frontmatter 常用字段：

```yaml
title: 文章标题
date: 2026-01-01
description: 文章描述
tags:
  - frontend
categories:
  - notes
draft: false
```

生产构建会过滤 `draft: true` 的文章。

## Notion 同步

运行以下命令从 Notion 拉取内容：

```bash
pnpm download
```

同步脚本位于 `scripts/notion/`，生成的文章会进入
`src/content/notion/`。

## 环境变量

可在项目根目录创建 `.env`：

```bash
PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

`PUBLIC_` 前缀的变量会暴露给客户端代码。

## 构建与部署

```bash
pnpm build
```

构建产物输出到 `dist/`。部署前可以运行：

```bash
pnpm preview
```

## 许可

`package.json` 声明为 `0BSD`。
