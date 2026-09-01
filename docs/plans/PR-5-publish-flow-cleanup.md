# PR 5 计划：发布流程收尾 + 全链路清理验收

## 1. 目标

- 落实「草稿写操作跳过 CI，发布动作触发部署」的 commit 规则（对 PR 3 方案的修订）
- 全链路端到端验收：登录 → 写草稿 → 传图 → 预览 → 发布 → 上线 → 取消发布 → 删除
- 清理所有 Notion 残留引用，更新项目文档

## 2. 已确认决策

| # | 决策项 | 结论 |
|---|--------|------|
| 1 | 草稿与 CI | 草稿相关 commit 带 `[skip ci]`，不触发部署；发布/取消发布/删除正常触发 |
| 2 | 前台入口 | 博客前台不加任何后台链接，admin 靠书签直达 Vercel 域名 |
| 3 | 合并策略 | PR 1–5 依次直合 master，合并即部署，出问题 revert 对应 PR |

## 3. `[skip ci]` 规则（修订 PR 3 §4.4–4.6）

GitHub Actions 原生支持 commit message 含 `[skip ci]` 时跳过 workflow。
按「该操作是否影响线上产物」划分：

| 操作 | 目标文章状态 | commit message | 触发部署 |
|------|--------------|----------------|----------|
| 新建 | 必为 draft | `content: create <slug> [skip ci]` | 否 |
| 保存 | draft:true | `content: update <slug> [skip ci]` | 否 |
| 保存 | draft:false | `content: update <slug>` | 是 |
| 上传图片 | draft:true | `content: image add <file> → <slug>/ [skip ci]` | 否 |
| 上传图片 | draft:false | `content: image add <file> → <slug>/` | 是 |
| 发布 | — | `content: publish <slug>` | 是 |
| 取消发布 | — | `content: unpublish <slug>` | 是 |
| 删除 | — | `content: delete <slug>` | 是 |

实现：`api/_lib/github.ts` 的 commit 构造函数加 `skipCi` 参数，
posts/images 处理器按文章当前 `draft` 状态传入。

## 4. 收尾清理清单

```bash
# 期望全部无输出（content 文章正文除外）
grep -ri "notion" src/ --include="*.ts" --include="*.tsx" --include="*.astro" --include="*.mjs"
grep -ri "notion" scripts/ .github/ package.json
grep -ri "secret_\|token_v2" src/ scripts/ api/ .github/
```

- [ ] Notion token 已在后台撤销（PR 1 Step 7 执行过，此处复核）
- [ ] `package.json` 无 notion 系依赖；`pnpm install && pnpm build` 干净通过
- [ ] OAuth App redirect URL 与生产 Vercel 域名完全一致
- [ ] `.gitignore` 无 `src/content/notion` 残留
- [ ] GitHub Actions 仅由非 `[skip ci]` 的 master push 触发

## 5. 文档更新

- `AGENTS.md`：项目概述中移除 Notion 相关段落（`pnpm download`、Notion sync），
  增补：内容全部在 `src/content/blogs`、admin 后台（Vercel 域名 `/admin`）、
  `api/` 目录与所需环境变量、图片规则（4MB/PNG·JPEG·WebP/相对路径）
- `README.md`（如提及 Notion 同步）同步更新
- 本 `docs/plans/` 五份计划文档保留，作为架构决策记录

## 6. 端到端验收（全链路走一遍）

```text
1. 访问 <vercel>/admin → 跳转 GitHub 登录 → 本人账号进入
2. 列表 248 篇，搜索/筛选正常
3. 新建文章（中文标题）→ 目录 YYYY-MM-DD-拼音slug，draft:true
   → commit 带 [skip ci]，GitHub Actions 未触发
4. 编辑正文，粘贴一张截图 → image commit [skip ci]，光标处插入引用
5. 停止输入 → 预览更新，mermaid/代码高亮正常
6. 点击发布 → draft:false commit → Actions 构建部署
7. 线上 /blog/YYYY-MM-DD-slug/ 可访问，图片、RSS、sitemap 均含新文
8. 取消发布 → 文章从首页/RSS/sitemap 消失
9. 删除 → index.md 与 images 同 commit 消失，Actions 触发
10. 抽查 PR 1 的旧链接 redirect 仍正常
```

## 7. 变更文件清单

```
修改  api/_lib/github.ts        # commit 构造支持 skipCi
修改  api/posts/[...path].ts    # 按目标文章 draft 状态传 skipCi
修改  api/images/upload.ts      # 同上
修改  AGENTS.md / README.md
（本 PR 以验收为主，代码改动很小）
```

## 8. 明确不做

- 不做定时发布、不做多环境（dev/prod 双后台）
- 不做后台使用统计、不做操作日志页（git 历史即日志）
- 不迁移到自定义 admin 域名（保持 vercel.app，将来需要时再加 DNS 即可）

## 9. 风险与对策

| 风险 | 对策 |
|------|------|
| `[skip ci]` 该触发时没触发（状态判断错误） | 规则仅依赖文章当前 draft 字段，单一事实源；验收第 3/6 步覆盖两种路径 |
| 老 URL redirect 被误删 | redirect 表在 PR 1 固化进 astro.config.mjs，PR 5 验收第 10 步兜底 |
| 回滚 | 每个 PR 独立可 revert；内容数据在 git 历史中永不丢失 |
