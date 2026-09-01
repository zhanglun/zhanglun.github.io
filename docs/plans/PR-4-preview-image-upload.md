# PR 4 计划：Markdown 实时预览 + 图片上传

## 1. 目标

- 新增 `POST /api/preview`：用博客同一套 Markdown 管线在 Vercel 渲染未保存内容
- admin 编辑器接入实时预览（500ms 防抖），mermaid 图表在预览区客户端渲染
- 图片选中/粘贴/拖拽即上传 GitHub 文章目录，光标处插入相对引用

## 2. 已确认决策

| # | 决策项 | 结论 |
|---|--------|------|
| 1 | 预览渲染 | Vercel 临时渲染（复用博客 remark/shiki 配置） |
| 2 | Mermaid | admin 预览区加载 mermaid.js 客户端渲染图表（`mermaid` 已是项目依赖，动态 import，不进博客包） |
| 3 | 上传时机 | 选中/粘贴/拖拽后立即上传，成功后在光标处插入引用 |
| 4 | 文件名 | 服务端生成 `img-YYYYMMDD-<6位哈希>.<ext>` |
| 5 | 限制 | 单张 ≤ 4MB；仅 PNG/JPEG/WebP；双端校验 |

## 3. 预览 API（api/preview.ts）

```http
POST /api/preview
{ "body": "# markdown 正文（不含 frontmatter）" }
→ { "html": "<渲染结果>" }
```

渲染管线与 `astro.config.mjs` 保持一致（复用已有依赖，零新增）：

```ts
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { remarkReadingTime } from "../../remark-reading-time.mjs";

const processor = await createMarkdownProcessor({
  remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }], remarkReadingTime],
  shikiConfig: { theme: "one-dark-pro", wrap: true },
});
```

- 模块级单例，函数冷启动只初始化一次
- 需登录会话（防止被白嫖当免费渲染 API）
- 渲染自家内容，不做 HTML sanitize（信任边界：仅本人可调用）

## 4. 预览区（PreviewPane.tsx）

- 输入停止 500ms 后请求；用 `AbortController` 取消未完成的旧请求
- **注入前重写图片路径**：预览 HTML 中的 `./images/x.webp` 按 `/admin` 页面 URL 解析必然 404，
  PreviewPane 需把 `./images/...` 重写为
  `https://raw.githubusercontent.com/zhanglun/zhanglun.github.io/master/src/content/blogs/<文章目录>/images/...`
  （仓库为 public，raw 直链可用；新建未保存文章尚无图片，不受影响）
- 预览容器排版用 `prose` 类 —— 注意 `@tailwindcss/typography` 在 devDeps 中但**全局未启用**，
  需在 admin 页面自己的样式里加 `@plugin "@tailwindcss/typography"`（Tailwind v4 语法），
  不影响博客前台
- 注入后扫描 `code.language-mermaid` 节点，`import("mermaid")` 后逐个 `mermaid.render`
- mermaid 仅在 admin 动态加载，博客前台包体积不受影响
- 与正式页面的已知差异（可接受，记录在案）：astro-mermaid 在正式页对 mermaid 有自己的包裹结构，预览版以客户端渲染等价呈现

## 5. 图片上传 API（api/images/upload.ts）

```http
POST /api/images/upload?post=<文章目录名>
Content-Type: image/png | image/jpeg | image/webp
Body: 原始二进制（不走 base64 JSON，避开 Vercel 4.5MB 请求体限制）
→ { "markdown": "![image](./images/img-20260324-a1b2c3.webp)" }
```

服务端校验链（信任边界，全部必做）：

1. 会话校验（401）
2. `post` 参数必须是 `src/content/blogs/` 下真实存在的文章目录（防路径穿越）
3. `Content-Type` 白名单
4. 魔数校验：PNG `89 50 4E 47` / JPEG `FF D8 FF` / WebP `RIFF....WEBP`
5. 大小 ≤ 4MB

写入：Git Data API 单图单 commit：

```text
content: image add img-20260324-a1b2c3.webp → 2023-01-23-xxx/
```

哈希取文件内容 sha256 前 6 位 —— 同图重传自然同名，GitHub blob 去重，
重复上传不会膨胀仓库（同内容同 blob）。

## 6. 编辑器集成（MarkdownEditor.tsx）

- CodeMirror 事件：`paste`（剪贴板含图片时拦截）、`drop`（图片文件）、「插入图片」按钮
- 流程：校验类型/大小（前端第一道）→ 上传 → 成功后 `![image](./images/xxx)` 插入光标处
- 上传中在光标处先插入占位文本 `![uploading...]()`，成功替换、失败还原并提示
- **新建未保存的文章**：文章目录尚不存在，上传按钮/粘贴置灰，提示「先保存草稿后再插入图片」（新建即 PUT 保存，目录就位）

## 7. 变更文件清单

```
新增  api/preview.ts
新增  api/images/upload.ts
新增  src/components/admin/PreviewPane.tsx
修改  src/components/admin/MarkdownEditor.tsx（或 PostEditor.tsx 内联拆出）
修改  api/_lib/github.ts（blob 创建/去重辅助）
零新增 npm 依赖（markdown-remark、mermaid 已在 dependencies；
@tailwindcss/typography 已在 devDependencies，本 PR 在 admin 样式中启用）
修改  src/pages/admin/index.astro（样式：启用 typography 插件 + 预览排版）
```

## 8. 明确不做

- 不做图片压缩/格式转换（原图入库）
- 不做批量并发上传队列（逐张即可，个人使用）
- 不做图片管理/删除孤儿图片界面（文章删除时连带清理，PR 3 已覆盖）
- 不做预览结果缓存（防抖已足够省）

## 9. 验收清单

- [ ] 停止输入 ~500ms 预览更新，连续快速输入不发多余请求
- [ ] 代码块高亮主题与博客一致（one-dark-pro）
- [ ] mermaid 代码块在预览中渲染为图表
- [ ] 已上传图片在预览区正常显示（raw.githubusercontent 路径重写生效）
- [ ] 预览区 prose 排版生效（标题/列表/引用样式正常）
- [ ] 粘贴截图 → 上传 → 光标处出现 `./images/...` 引用，GitHub 出现 image commit
- [ ] 同一张图重复粘贴 → 文件名相同，仓库不新增 blob
- [ ] 5MB 图片、GIF、SVG → 前端拦截；绕过前端直打 API → 服务端 4xx
- [ ] 新建未保存文章时上传入口置灰并提示
- [ ] 发布后博客正式页图片正常显示（相对路径解析）

## 10. 风险与对策

| 风险 | 对策 |
|------|------|
| Vercel 请求体上限 4.5MB | 用原始二进制 + 4MB 上限，留 0.5MB 余量；文档记录阈值来源 |
| 预览与正式渲染细微差异 | 同一处理器同一配置；差异仅限 astro-mermaid 包裹结构 |
| mermaid 客户端包较大 | 动态 import，仅预览时加载 |
| shiki 高亮冷启动慢 | 处理器模块级单例，函数实例复用后毫秒级 |
