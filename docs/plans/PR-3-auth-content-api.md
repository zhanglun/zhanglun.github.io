# PR 3 计划：GitHub OAuth 认证 + 文章读写 API（Vercel）

## 1. 目标

在仓库根新增 `api/` 目录（Vercel Functions），实现：

- GitHub OAuth 登录，仅允许本人 GitHub 账号
- HttpOnly 签名 Cookie 会话
- 文章列表 / 读取 / 保存（草稿）/ 发布 / 取消发布 / 删除，全部通过
  GitHub API 操作 `master` 分支 `src/content/blogs/`
- 接通 PR 2 的 admin UI（替换 fixture）

## 2. 已确认决策

| # | 决策项 | 结论 |
|---|--------|------|
| 1 | 会话 | HMAC-SHA256 签名 Cookie（`SESSION_SECRET` 签名），无外部存储 |
| 2 | OAuth | Classic OAuth App（scope 为空，仅取公开用户信息） |
| 3 | 权限 | 校验数字 `id`（`ADMIN_GITHUB_USER_ID`），不比对用户名 |
| 4 | 写操作授权 | Fine-grained PAT（仅本仓库，Contents: Read & write），存 Vercel 环境变量 |
| 5 | commit message | 英文 conventional 风格：`content: create/publish/unpublish/update/delete <slug>` |
| 6 | 列表数据源 | GitHub **GraphQL** 一次请求取全部 markdown（见 §4.2） |
| 7 | 写入方式 | 统一走 Git Data API，一个动作 = 一个 commit |

## 3. 目录结构

```text
api/
├── _lib/
│   ├── auth.ts        # OAuth 流程、签名 cookie 生成/校验、白名单判断
│   ├── github.ts      # REST/GraphQL 封装：tree 查询、blob 读写、commit 创建
│   └── posts.ts       # frontmatter 解析/序列化、draft 切换、slug 生成
├── auth/
│   ├── login.ts       # GET  → 302 跳 GitHub authorize
│   ├── callback.ts    # GET  → 换 token → GET /user → 校验 id → 发 cookie → 302 /admin
│   └── logout.ts      # GET  → 清 cookie → 302 /admin
└── posts/
    ├── index.ts             # GET    列表
    └── [...path].ts         # GET 读 / PUT 保存或新建 / DELETE 删除
        （publish/unpublish 以 PUT body 中 draft 字段表达，不单设路由）
```

依赖新增：`pinyin-pro`（服务端生成拼音 slug）、`gray-matter`（frontmatter 解析）。
两者只进 `api/_lib`，不进前端包。

## 4. 关键实现

### 4.1 认证流程

```text
/admin 未登录
  → GET /api/auth/login
  → 302 github.com/login/oauth/authorize?client_id=...&scope=（空）
  → 用户授权
  → GET /api/auth/callback?code=...
  → POST https://github.com/login/oauth/access_token 换 token
  → GET https://api.github.com/user 取 id
  → id !== ADMIN_GITHUB_USER_ID → 403 页面（无权限，cookie 不发）
  → 相等 → 签发 cookie
```

Cookie 规格：

```text
name:     admin_session
value:    base64url({uid, exp}) + "." + HMAC-SHA256(签名)
flags:    HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=7d
```

- 所有 `/api/posts*` 入口统一 `requireSession()`：验签 + 过期检查，失败返回 401
- CSRF：SameSite=Lax 阻止跨站携带 cookie 的写请求，第一版不做额外 token
- 获取数字 user id：`https://api.github.com/users/zhanglun` 的 `id` 字段，配进环境变量

### 4.2 列表接口（GET /api/posts）

仓库结构固定为两层（`文章.md` 或 `目录/index.md`，图片在第三层），
用 GraphQL 一次请求取全部 markdown 文本，不碰图片：

```graphql
query {
  repository(owner: "zhanglun", name: "zhanglun.github.io") {
    object(expression: "master:src/content/blogs") {
      ... on Tree {
        entries {                       # L1: 平铺 .md 或 文章目录
          name
          object {
            ... on Blob { text }        # 平铺文章正文
            ... on Tree {
              entries {                 # L2: index.md（images 在 L3，天然不取）
                name
                object { ... on Blob { text } }
              }
            }
          }
        }
      }
    }
  }
}
```

服务端解析 frontmatter → 返回 `PostSummary[]`（PR 2 定义的类型）。
单次请求、无遍历、无分页，248 篇毫秒级。

### 4.3 读取（GET /api/posts/:path）

Contents API 取单个文件 → `{ path, sha, frontmatter, body }`。

### 4.4 保存 / 新建（PUT /api/posts/:path）

- 请求带 `sha`（已有文章）：服务端先取当前 blob sha，不一致返回 **409**（防覆盖并发改动）
- 新建：`path = "new"`，由服务端生成 `YYYY-MM-DD-<拼音slug>` 目录，
  frontmatter 默认 `draft: true`、date 取当天
- 写入统一走 Git Data API（base_tree + 新 blob → commit → update ref）：

```text
content: create 2026-03-24-rust-tiao-jian-bian-yi
content: update 2023-01-23-xxx
```

### 4.5 发布 / 取消发布（PUT，draft 字段）

读取 → 仅改 frontmatter `draft` → 同一 commit 流程：

```text
content: publish 2026-03-24-xxx      # draft: false → 触发博客部署
content: unpublish 2023-01-23-xxx    # draft: true
```

### 4.6 删除（DELETE /api/posts/:path）

Git Data API 一个 commit 内删除 `index.md` + 同目录 `images/` 全部文件：

```text
content: delete 2023-01-23-xxx
```

## 5. 环境变量（Vercel Project Settings）

```env
GITHUB_CLIENT_ID=            # OAuth App
GITHUB_CLIENT_SECRET=
SESSION_SECRET=              # ≥32 字节随机串
ADMIN_GITHUB_USER_ID=        # 数字 id
GITHUB_REPO=zhanglun/zhanglun.github.io
GITHUB_BRANCH=master
GITHUB_CONTENT_TOKEN=        # Fine-grained PAT: Contents RW, 仅本仓库
PUBLIC_ADMIN_ORIGIN=         # https://<project>.vercel.app（OAuth redirect 与 UI 提示用）
```

## 6. 部署与本地开发

- Vercel 导入同一 GitHub 仓库，自动识别 Astro（静态）+ `api/` Functions，零配置
- **禁止安装 @astrojs/vercel adapter**：静态输出 + 原生 `api/` 函数即可；
  装 adapter 会与原生 `api/` 函数产生路由冲突（社区已有多起 404 / 返回 HTML 替代 JSON 的案例）
- `vercel dev` 本地跑完整登录与 API 联调
- GH Pages 上的 `/admin` 副本跨域调 API 不可用 → UI 按 PR 2 约定显示"请在管理域名访问"

## 7. 明确不做

- 不做 CORS（admin 与 API 同域，GH Pages 副本只提示不兼容）
- 不做会话存储/主动踢下线（签名 cookie 到期自然失效）
- 不做操作审计页（git commit 历史即审计）
- 不做分支/PR 流程（直推 master，git 历史可回滚）

## 8. 验收清单

- [ ] 前置：master 未开启 branch protection（否则 PAT 直推 403，需先放行或关闭）
- [ ] 未登录 `curl /api/posts` → 401
- [ ] 登录流程走通；非白名单账号（他人 GitHub）登录 → 403 无 cookie
- [ ] admin 列表显示 248 篇真实文章，搜索/筛选可用
- [ ] 编辑保存 → GitHub 上出现 `content: update ...` 单文件 commit
- [ ] 新建（中文标题）→ 目录 `YYYY-MM-DD-拼音slug`、`draft: true`
- [ ] 发布 → `draft: false`，master push 触发 GitHub Actions 部署
- [ ] 删除 → index.md 与 images 同 commit 消失
- [ ] 并发覆盖：两个标签页编辑同一篇，后保存者收到 409 提示
- [ ] token 全部在 Vercel 环境变量，前端 bundle 无任何 secret

## 9. 风险与对策

| 风险 | 对策 |
|------|------|
| OAuth redirect URL 配错 | callback 域名必须与 Vercel 域名完全一致，验收项覆盖 |
| Fine-grained PAT 权限不足 | 只授 Contents RW；写操作 403 时先查 PAT 仓库范围 |
| GraphQL 嵌套层级假设失效 | 若未来出现三层目录结构，列表查询需加深一层（文档记录） |
| 函数超时（10s 默认） | 所有操作均为单次 GitHub API 调用，余量充足 |
| SESSION_SECRET 泄露 | 仅存 Vercel；轮换密钥即让全部会话失效 |
