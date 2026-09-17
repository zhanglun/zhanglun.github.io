---
title: tldraw 源码改造并发布到私有 npm 仓库的完整流程
categories:
  - 解决方案
date: 2025-11-19T17:00:00.000+08:00
tags:
  - JavaScrtipt
  - 笔记
  - TypeScript
  - monorepo
  - tldraw
draft: false
---

最近需要在tldraw的源码上二次开发一些定制的功能了。我在源码基础上将功能开发完成，随后将定制版本发布到了内部的npm仓库。 以下是详细的步骤总结:


## 0. 获取指定版本的代码


起初我clone了项目代码，将代码切换到v3.15.5对应的版本。过程中遇到了下面几个问题

1. 仓库太大了，即使我添加了参数 `depth=1`，在拉取tag的时候也冗余了很多记录
2. 切换到tag之后，出现了很多多余的修改，在现阶段无法掌控

于是从release中下载v3.15.5 [https://github.com/tldraw/tldraw/releases/tag/v3.15.5](https://github.com/tldraw/tldraw/releases/tag/v3.15.5)

1. 依赖的是3.14.3 v4有很多breaking change，短时间内迁移成本较大
2. v4以后tldraw的商业授权许可变更，SDK仅允许在开发环境中使用，除非拥有试用许可、商业许可或爱好者许可。这些许可都附带一个许可密钥。如果没有有效的许可密钥，SDK将无法在生产环境中运行。

## 1. 包名修改


将所有包名从 `@tldraw/*` 改为 `@etsme/tldraw-*`:

- `@tldraw/editor` → `@etsme/tldraw-editor`
- `@tldraw/state-react` → `@etsme/tldraw-state-react`
- 其他包类似修改

## 2. API Extractor 配置问题


**问题**: 修改包名后,`api-extractor` 使用 `<unscopedPackageName>` token 推导路径,导致路径不匹配。


**解决方案**: 使用批量脚本为每个包生成独立的 `api-extractor.json`,硬编码实际目录名:


```bash
#!/bin/bash
for dir in packages/*/; do
  pkg_dir=$(basename "$dir")
  cat > "$dir/api-extractor.json" <<'EOF'
{
  "$schema": "<https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json>",
  "extends": "../../internal/config/api-extractor.json",
  "mainEntryPointFilePath": "<projectFolder>/packages/PKG_DIR/.tsbuild-api/index.d.ts",
  "compiler": {
    "tsconfigFilePath": "<projectFolder>/packages/PKG_DIR/tsconfig.json"
  },
  "dtsRollup": {
    "enabled": true,
    "untrimmedFilePath": "<projectFolder>/packages/PKG_DIR/api/internal.d.ts",
    "publicTrimmedFilePath": "<projectFolder>/packages/PKG_DIR/api/public.d.ts"
  }
}
EOF
  sed -i.bak "s/PKG_DIR/$pkg_dir/g" "$dir/api-extractor.json"
  rm "$dir/api-extractor.json.bak"
done
```


## 3. 缓存清理


**问题**: 修改配置后,lazyrepo 仍使用旧缓存


**解决方案**:


```bash
yarn clean
# 或手动清理
rm -rf packages/*/.tsbuild packages/*/.tsbuild-api packages/*/api
rm -rf packages/*/dist-cjs packages/*/dist-esm
```


## 4. 私有 npm 仓库配置


### 4.1 创建 .yarnrc.yml


```yaml
compressionLevel: mixed
enableGlobalCache: false
enableInlineBuilds: true
enableStrictSsl: false
nodeLinker: node-modules
npmAuthToken: 'my token'

npmRegistryServer: "<http://npm.my-registry.com>"

unsafeHttpWhitelist:
  - npm.my-registry.com
```


## 5. 创建发布脚本


tldraw 有一套完整的发布脚本系统,针对不同场景:


### 1. publish-new - 主要版本发布


用于发布新的 major 或 minor 版本:


```bash
yarn tsx ./internal/scripts/publish-new.ts --bump minor
```

- 必须在 `production` 分支运行
- 需要预先创建 draft release
- 创建新的发布分支(如 `v3.4.x`)
- 支持 prerelease 模式(如 `3.4.0-rc.1`)

### 2. **publish-patch** - 补丁版本发布


用于在发布分支上发布 bug 修复，通过GitHub Action 自动触发,无需手动运行:


特点

- 自动在发布分支上触发
- 跳过初始发布提交(如 `v3.4.0`)
- 检测包内容是否有变化,避免重复发布
- 如果是最新版本,同时更新文档和示例站点

### 3. **publish-prerelease** - 预发布版本


用于发布 canary/next/internal 版本


```bash
yarn tsx ./internal/scripts/publish-prerelease.ts canary
```


特点:

- 生成带 commit hash 的版本号(如 `4.1.2-canary.abc123def456`)
- 支持三种标签: `canary`(main 分支)、`next`(production 分支)、`internal`(PR 分支)
- 自动在 `main` 和 `production` 分支推送时触发 [14](https://www.notion.so/tldraw-npm-2b05326542dd80a7b4c7eb450032f58e#19-13)

### 4. **publish-manual** - 手动重新发布


用于紧急情况下重新发布已存在的版本:


```bash
yarn tsx ./internal/scripts/publish-manual.ts
```


特点:

- 不修改版本号
- 不更新 changelog
- 不创建 GitHub release
- 仅重新发布包到 npm

### 5. **publish-branch** - PR 分支发布


用于在 PR 上测试包发布，通过添加 'publish-packages' 标签触发:


特点:

- 使用 `internal` 标签发布
- 自动在 PR 中评论发布的版本号

### 发布脚本的共同依赖


所有发布脚本都依赖于 `internal/scripts/lib/publishing.ts` 中的核心函数:

1. **`setAllVersions()`**: 更新所有包的版本号
2. **`publish()`**: 执行实际的 npm 发布操作
3. **`uploadStaticAssets()`**: 上传静态资源到 R2
4. **`publishProductionDocsAndExamplesAndBemo()`**: 部署文档和示例站点
5. **`getLatestTldrawVersionFromNpm()`**: 从 npm 获取最新版本号

### 新增独立发布脚本


在我的case中，发布过程没有这么细致，我选择在与tldraw发布操作流程保持一致的情况下，创建一个独立的发布脚本，尽可能减少和现有代码的耦合和依赖的同时又能复用现有的能力。 脚本在`internal/scripts/publish-etsme.ts`:


```typescript
import { parse } from 'semver'
import { exec } from './lib/exec'
import { setAllVersions, publish } from './lib/publishing'
import { nicelog } from './lib/nicelog'

async function getLatestVersionFromPrivateNpm() {
  try {
    const version = await exec('npm', ['view', '@etsme/tldraw@latest', 'version'])
    return parse(version.trim())
  } catch (error) {
    nicelog('Package not found, using default version')
    return null
  }
}

async function main() {
  const currentVersion = await getLatestVersionFromPrivateNpm()

  let nextVersion: string
  if (currentVersion) {
    nextVersion = currentVersion.inc('patch').format()
    nicelog(`Current: ${currentVersion.format()}, Next: ${nextVersion}`)
  } else {
    nextVersion = process.env.INITIAL_VERSION || '1.0.0'
    nicelog(`First publish, using version: ${nextVersion}`)
  }

  await setAllVersions(nextVersion)
  await exec('yarn', ['build'])
  await publish('latest')

  nicelog('✅ Published successfully!')
}

main().catch((err) => {
  console.error('❌ Publish failed:', err)
  process.exit(1)
})
```


## 6. 遇到的主要问题


| 问题                                     | 原因                                 | 解决方案                                                     |
| -------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| `mainEntryPointFilePath` 路径错误          | `<unscopedPackageName>` token 解析错误 | 批量生成配置,硬编码目录名                                            |
| `tsconfigFilePath` 路径错误                | 同上                                 | 在配置中覆盖 `compiler.tsconfigFilePath`                       |
| `publicTrimmedFilePath` 路径错误           | 同上                                 | 在配置中覆盖 `dtsRollup.publicTrimmedFilePath`                 |
| `public.d.ts` 文件缺失                     | `build-api` 未正确运行                  | 清理缓存,按顺序运行 `build-types` → `build-api` → `build-package` |
| `NPM_TOKEN not set`                    | `publish()` 函数需要环境变量               | `export NPM_TOKEN=xxx`                                   |
| `YN0033: No authentication configured` | Yarn 未读取认证配置                       | 配置 `.yarnrc.yml` 的 `npmScopes`                           |
| `YN0001: self-signed certificate`      | 私有仓库使用自签名证书                        | 设置 `enableStrictSsl: false`                              |
| `YN0081: Unsafe http requests`         | 使用 HTTP 协议需要白名单                    | 添加 `unsafeHttpWhitelist`                                 |
| `httpsCaFilePath: null` 解析错误           | YAML 将 `null` 解析为字符串               | 完全移除该配置项                                                 |

