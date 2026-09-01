# PR 1 计划：Notion 内容迁移入库 + 全站文件名日期规范化

## 1. 背景与目标

当前 `src/content/notion`（83 篇文章、1777 张本地图片）被 `.gitignore` 忽略，
每次部署由 GitHub Actions 执行 `pnpm download` 从 Notion 拉取。
本 PR 之后：

- 所有文章进入 Git 管理，Notion 不再是内容源
- 全仓库文章目录统一 `YYYY-MM-DD-` 日期前缀
- 旧 URL 通过 Astro redirects 保留跳转
- 含明文 Notion token 的脚本全部删除

## 2. 已确认决策

| # | 决策项 | 结论 |
|---|--------|------|
| 1 | cover 字段 | 迁移时 `cover: <远程URL>` 重命名为 `ogImage`（59 篇），空 cover（24 篇）直接删除该字段 |
| 2 | 迁移数据源 | 先跑一次 `pnpm download` 拉取 Notion 最新内容，再迁移 |
| 3 | 文件名规范 | **全仓库统一**：所有文章目录加 `YYYY-MM-DD-` 前缀（已带前缀的跳过） |
| 4 | 旧链接 | 在 `astro.config.mjs` redirects 生成 旧路径 → 新路径 |
| 5 | Notion token | 在 Notion 后台**撤销**（迁移完成、download 跑完后立即做），不重写 git 历史 |
| 6 | scripts/notion | 本 PR 内直接删除，连带 CI 下载步骤 |

## 3. 前置条件

- [ ] Notion token 仍然有效（先下载、后撤销，顺序不能反）
- [ ] 本地工作区干净，无未提交改动
- [ ] 记录迁移前构建产物路由清单（用于验收比对）：
      `pnpm build && ls dist/blog > /tmp/routes-before.txt`

## 4. 实施步骤

### Step 1：拉取最新内容

```bash
pnpm download   # 最后一次从 Notion 拉取，83 篇
```

### Step 2：编写一次性迁移脚本 `scripts/migrate-notion.mjs`

脚本职责（全部幂等，可重复执行）：

1. **冲突预检**：目标目录已存在且非本次产物 → 中止并列出冲突清单
2. **Notion 文章迁移**（`src/content/notion/<标题>/` → `src/content/blogs/<YYYY-MM-DD>-<标题>/`）：
   - 目录名 = frontmatter `date` 的 `YYYY-MM-DD` + 原标题
   - `index.md` + `images/` 整体移动
   - frontmatter 变换：
     - `status: publish` → `draft: false`（当前 83 篇全部为 publish）
     - `categories: 字符串` → `categories: [字符串]` 数组
     - `cover: http...` → `ogImage: http...`；空 `cover` 删除
     - `status` 字段删除（schema 不识别）
     - `title` / `date` / `tags` 原样保留
3. **blogs 老文章改名**：目录/文件名不带 `^\d{4}-\d{2}-\d{2}-` 前缀的，用 frontmatter `date` 补前缀
   - 平铺 `.md` 文件：改为 `<YYYY-MM-DD>-<原名>.md`
   - 目录型 `dir/index.md`：目录改名
4. **生成重定向清单**（预计 83 + 43 ≈ 126 条）：每个改名的文章输出
   `旧slug -> 新slug`，写入 `scripts/migrate-redirects.output.json`（供 Step 4 人工粘贴/校验）

   slug 计算规则必须与 Astro glob loader 完全一致（已核对 astro@7 源码）：
   - frontmatter 含 `slug` 字段的文章：URL 由 slug 决定，改名**不改变 URL** → 不生成 redirect，
     另输出「frontmatter-slug 文章清单」供人工确认
   - `目录/index.md` → 去掉尾部 `/index`，slug = 目录名
   - 每段路径经 github-slugger：ASCII 转小写、空格→连字符、中文保留
     （如 `Node学习笔记-Serving the content` → `node学习笔记-serving-the-content`）
   - 同时生成 `/blogs/<旧slug> → /blog/<新slug>` 直连条目，避免与现有
     `/blogs/[...slug] → /blog/[...slug]` 规则叠加成两跳
5. **统计输出**：迁移篇数、改名篇数、图片移动数、redirect 条数

已知遗留：正文里还有 6 处远程图片引用（当年下载失败的历史遗留），
本 PR 不处理，保持远程 URL 原样（仍可正常显示）。

### Step 3：执行迁移并入库

```bash
node scripts/migrate-notion.mjs
rm -rf src/content/notion            # 含 .cache
```

### Step 4：代码清理

| 文件 | 改动 |
|------|------|
| `src/content.config.ts` | 删除 `notion` collection |
| `src/pages/index.astro` | 删除 `getCollection("notion")` 及合并逻辑 |
| `src/pages/blog/index.astro` | 同上 |
| `src/pages/blog/[...slug].astro` | 同上（getStaticPaths 只读 blogs） |
| `src/pages/search.astro` | 同上 |
| `src/pages/rss.xml.ts` | 同上 |
| `src/pages/[ogTitle].svg.ts` | 同上 |
| `src/utils/notionHelper.ts` | 整个删除（含明文 token、token_v2） |
| `scripts/notion/` | 整个删除（index.mjs、x.mjs 均含明文 token） |
| `astro.config.mjs` | redirects 增加 ≈126 条 旧→新 映射（83 Notion + 43 老文章，来自 Step 2 输出） |
| `.github/workflows/deploy.yml` | 删除 `Sync content from Notion` 步骤 |
| `.gitignore` | 删除 `src/content/notion` 行 |
| `package.json` | 删除 `download` script；删除依赖 `@notionhq/client`、`notion-to-md`、`notion-client`、`notion-utils`、`react-notion-x`；`yaml` 若无其他引用一并删除 |

依赖删除依据：全仓库仅 `src/utils/notionHelper.ts` 和 `scripts/notion/` 引用这些包。

### Step 5：验证

```bash
pnpm install        # 刷新 lockfile
pnpm format
pnpm build
```

### Step 6：提交

```bash
git add -A
git commit -m "feat: migrate notion posts into git with unified date prefix"
```

### Step 7：撤销 token（commit 之后立即做）

Notion 后台 → Settings → Connections/Integrations → 撤销该 internal integration。
源码明文 token 已随本 PR 删除；历史中的 token 撤销后即失效，无残留风险。

## 5. 变更文件清单

```
新增   scripts/migrate-notion.mjs
新增   scripts/migrate-redirects.output.json（迁移产物记录）
新增   src/content/blogs/**（83 篇 Notion 文章 + 1777 张图片）
改名   src/content/blogs/**（无日期前缀的老文章）
删除   src/content/notion/**
删除   src/utils/notionHelper.ts
删除   scripts/notion/**
修改   src/content.config.ts
修改   src/pages/{index.astro,blog/index.astro,blog/[...slug].astro,search.astro,rss.xml.ts,[ogTitle].svg.ts}
修改   astro.config.mjs（redirects）
修改   .github/workflows/deploy.yml
修改   .gitignore
修改   package.json / pnpm-lock.yaml
```

## 6. 明确不做

- 不重写 git 历史
- 不修复 6 处历史遗留的远程图片
- 不改动文章正文内容（错别字、格式等留给后台上线后处理）
- 不做拼音化 slug（保持中文目录名，仅加日期前缀）
- 不删 `status`/`cover` 以外的 frontmatter 字段

## 7. 验收清单

- [ ] `pnpm build` 通过
- [ ] 构建路由 diff：`ls dist/blog` 与迁移前比对，所有消失的旧路由都有对应 redirect 页面
- [ ] redirect 映射用 slug 化后的路径（抽 2 例含空格/大写的文件名验证）；frontmatter-slug 文章清单已人工核对
- [ ] 抽查 3 篇 Notion 文章：目录带日期前缀、`draft: false`、`ogImage` 生效、正文图片路径有效
- [ ] 抽查 2 篇改名老文章：内容未变、URL redirect 生效
- [ ] `grep -r "secret_" src/ scripts/` 无结果（token 清零）
- [ ] CI yml 中无 Notion 步骤；`pnpm download` 命令不存在
- [ ] 线上部署成功，老链接（外部引用）跳转正常
- [ ] Notion token 已在后台撤销

## 8. 风险与回滚

| 风险 | 缓解 |
|------|------|
| 下载最新内容失败（token 失效/网络） | 迁移前先跑 download 验证；失败则先解决再迁移 |
| 重定向条目多（~100+），手写出错 | 由脚本生成 JSON，人工粘贴时逐条核对数量 |
| 大提交（约 1800+ 文件） | 一次性提交，GitHub 可承受；此后仓库即内容备份 |
| 目录名冲突 | 脚本预检中止，人工裁决后重跑（幂等） |
| 回滚方式 | 单个 commit revert 即可回到迁移前（notion 内容仍在 Notion 上） |
