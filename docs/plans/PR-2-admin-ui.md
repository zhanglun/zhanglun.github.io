# PR 2 计划：管理后台 UI（/admin）

## 1. 目标

在现有 Astro 项目内新增 `/admin` 静态路由，实现博客管理后台界面：

- 文章列表（搜索 + 草稿/已发布筛选 + 日期倒序）
- 文章编辑页（frontmatter 表单 + CodeMirror Markdown 编辑器 + 预览占位）
- 新建 / 删除（二次确认）/ 保存草稿 / 发布 / 取消发布 的完整 UI

本 PR **只做 UI 和 API 客户端契约**，数据先用本地 fixture 兜底；
真实 OAuth 与 GitHub API 在 PR 3 接入，实时预览与图片上传在 PR 4 接入。

## 2. 已确认决策

| # | 决策项 | 结论 |
|---|--------|------|
| 1 | Vercel 构建范围 | 整站一起构建，`/admin` 随站产出，零额外构建配置 |
| 2 | 编辑器 | CodeMirror（`@uiw/react-codemirror` + `@codemirror/lang-markdown`） |
| 3 | 列表功能 | 标题搜索 + 状态筛选 + 日期倒序，三个能力 |
| 4 | UI 风格 | 独立极简风格，不复用博客视觉体系 |

## 3. 页面与组件结构

```text
src/pages/admin/index.astro          # 独立壳页面：极简 HTML，noindex，不套博客 Layout/NavMenu
src/components/admin/
├── AdminApp.tsx                     # 顶层组件：列表视图 ↔ 编辑视图 切换（无路由库）
├── PostList.tsx                     # 列表：搜索框 / 状态 Tab(全部·草稿·已发布) / 日期倒序表格
├── PostEditor.tsx                   # 编辑器：frontmatter 表单 + CodeMirror + 预览区
├── ConfirmDialog.tsx                # 删除等二次确认弹窗
├── api.ts                           # API 客户端；PR 2 阶段 fixture 兜底
└── types.ts                         # PostSummary / PostContent 等共享类型
```

### API 契约（本 PR 定型，PR 3 实现服务端）

```ts
// GET /api/posts → PostSummary[]
interface PostSummary {
  path: string;        // 相对 src/content/blogs 的路径，如 "2023-01-23-xxx/index.md"
  title: string;
  date: string;
  draft: boolean;
  tags: string[];
  categories: string[];
}

// GET /api/posts/:path → PostContent
interface PostContent {
  path: string;
  sha: string;         // GitHub blob sha，保存时带回，防覆盖
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    categories: string[];
    draft: boolean;
    ogImage?: string;
    description?: string;
  };
  body: string;        // markdown 正文（不含 frontmatter）
}

// PUT  /api/posts/:path   { frontmatter, body, sha? }  → 保存；frontmatter.draft 即发布状态
//                                                          （true=保存草稿，false=发布/取消发布，无独立端点）
// DEL  /api/posts/:path                                  → 删除正文+images
```

fixture 模式：`api.ts` 内部判断 `import.meta.env.PUBLIC_ADMIN_ORIGIN` 是否配置，
未配置时返回内置样例数据（含 2 篇已发布 + 1 篇草稿），保证 `pnpm dev` 即可完整操作 UI。
新建文章在 fixture 模式下用前端临时假 slug 占位（真实拼音 slug 由 PR 3 服务端生成）。

## 4. 编辑器页面布局

```text
┌────────────────────────────────────────────────────┐
│ ← 返回列表    标题输入框             [保存草稿] [发布] [删除] │
│ 日期 | 分类(逗号分隔) | 标签(逗号分隔) | 草稿开关          │
├────────────────────────┬───────────────────────────┤
│                        │                           │
│  CodeMirror 编辑区      │  预览区                     │
│  (markdown, 行号, 暗色)  │  PR2: 占位提示              │
│                        │  PR4: 接入 /api/preview     │
│                        │                           │
├────────────────────────┴───────────────────────────┤
│ 状态栏：路径 · sha · 未保存标记 · Ctrl/Cmd+S 保存         │
└────────────────────────────────────────────────────┘
```

- 快捷键：`Ctrl/Cmd+S` 保存
- 已发布文章的按钮组变为 `[保存修改] [取消发布] [删除]`
- 标题变更**不改变**已有文章的 path（沿用现有路径，PR 1 已定的规则）
- 新建文章：输入标题 → slug 由 API 生成（拼音方案，见 PR 3）→ UI 只展示只读 slug

## 5. 细节约定

- `/admin` 页面加 `<meta name="robots" content="noindex">`，并在 sitemap 中过滤
- admin 视觉：白/暗双主题跟随 `prefers-color-scheme`，黑白灰 + 一个强调色，不引入组件库
- CodeMirror 主题用自带暗色主题，不额外定制
- 列表全量渲染（无分页），当前约 160 篇文章，前端搜索过滤足够快
- 博客前台**不加入口链接**，admin 入口 = 直接访问 Vercel 域名 `/admin`
- GH Pages 上也会存在 `/admin` 页面（同一份构建产物），API 未配置时显示"请在管理域名访问"提示，无害

## 6. 变更文件清单

```
新增  src/pages/admin/index.astro
新增  src/components/admin/{AdminApp,PostList,PostEditor,ConfirmDialog}.tsx
新增  src/components/admin/{api,types}.ts
修改  package.json            # + @uiw/react-codemirror @codemirror/lang-markdown
修改  astro.config.mjs        # sitemap filter 排除 /admin
```

## 7. 明确不做

- 不做登录界面（PR 3 的 OAuth 跳转承担，未登录时 API 401 → UI 显示"去登录"）
- 不做真实预览与图片上传（PR 4）
- 不做分页/虚拟滚动（当前文章数量不需要）
- 不做富文本/所见即所得
- 不做多语言、不做移动端专门优化（桌面优先，可用即可）

## 8. 验收清单

- [ ] `pnpm build` 通过；`dist/admin/index.html` 产出
- [ ] `pnpm dev` 下 fixture 模式：列表三态筛选、搜索、进入编辑、表单编辑、删除确认弹窗全部可用
- [ ] sitemap 中无 `/admin`
- [ ] admin 页面无博客导航/页脚，noindex 生效
- [ ] Ctrl/Cmd+S 触发保存（fixture 模式下为 console 打印）
- [ ] 暗色/亮色主题切换正常

## 9. 风险与回滚

| 风险 | 缓解 |
|------|------|
| CodeMirror 依赖体积 | 仅在 admin 路由按需加载（admin 页面单独入口，不影响博客首屏） |
| fixture 与真实 API 行为不一致 | 契约类型在 PR 2 定型，PR 3 按同一类型实现 |
| 回滚 | revert 单个 PR 即可，不影响博客前台任何页面 |
