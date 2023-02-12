---
title: "  基于PNPM的项目改造"
categories: 技术应用
status: publish
date: 2022-08-24T00:00:00.000+08:00
tags:
  - 笔记
  - 架构
cover: https://res.cloudinary.com/practicaldev/image/fetch/s--5LB7xZGh--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o8e2at4huuuv08y24jvg.png

---


## 背景

因为历史原因，前端项目的代码按照业务模块，分散在不同的代码仓库中。可以复用的业务代码以npm package的形式共享。每个业务模块都是基于Nuxt.js的SSG，部署方式是将各模块构建产出物上传至服务器上，使用Nginx代理接口和托管HTML等静态资源。

看起来好像是一个很常规的操作。但实际上在各方面都存在一些让人非常不痛快的点，且不说：

- npm包的日常开发调试流程繁琐。

- 共享代码的更新迫使依赖的业务模块必须更新。

- 各项目冗余了构建相关的配置。

当这套流程在技术水平普遍不高的团队中应用时，还会有更多挑战：

- 代码组织没有可参考的标准。什么样的代码必须提升至共享，什么样的代码属于强业务？

- 历史原因和开发人员技术能力问题导致的代码腐败。

- 业务模块使用的Webpack、Vue等基础依赖及其生态版本，没有强的一致性约束，导致版本参差不齐。

- 引入Nuxt.js的SSG想做微前端。效果没达成，反而增加了项目维护的难度。

- 项目间形成了孤岛，无法全局观，限制了开发人员的想象力，一定程度上促进了项目代码的腐败。

其他更多挑战就不一一列举了，总而言之就是很“痛”。

当遇到本地化项目的时候，痛苦更上一层楼。我需要同时维护所有项目的代码版本。在众多项目和它们的分支中来回切换，逐渐迷失了自己。

在针对这些场景和痛点进行了一番技术调研之后，我决定尝试基于PNPM对现有项目进行Monorepo的改造。

## Monorepo VS Polyrepo

[Nrwl 团队](https://nrwl.io/)创建了[https://monorepo.tools/](https://monorepo.tools/)向大家解释Monorepo相关的概念和工具。

Monorepo是一个包含了多个独立项目，且项目间有明确的关联关系的仓库。可以看到两个重点：多个独立项目，项目间有明确关系。如果只是将项目放在同一个仓库，彼此之间没有明确关系，那这个不能称之为Monorepo架构；如果仓库只包含多个项目，没有拆分出来的封装和复用的代码，那只是一个大库，只能算是MonoLith架构。

与Monorepo相反的方案可以称之为“Polyrepo”，也是当下标准的开发模式：每个仓库都应一个模块、应用或者项目。彼此通过其他的仓库来共享可复用的代码，每个项目都有自己的构建流程和部署流程。这也是当前团队的开发模式。

![](images/b47a4b0392b140a9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=484145591c2ae87c5106a10bf32aaaccad464f4be09e677d73f708816b53edb3&X-Amz-SignedHeaders=host&x-id=GetObject)

Polyrepo模式存在代码共享难，重复代码多，依赖更新烦，配置升级乱等问题。Monorepo模式下只会有一个项目仓库，在文件夹之间共享代码十分简单；项目可以保持同一个版本，减少升级的心智负担；复用同一套配置，升级和维护都很方便。

文章中提到了 Monorepo的[工具对比](https://monorepo.tools/#monorepo-tools)，相对比较全面，感兴趣的朋友可以看看。我选择的是PNPM的方案，因为这是当下改造成本最低的方案。未来可能会再研究 [TurboRepo](https://github.com/vercel/turborepo) 和 [Rush](https://github.com/microsoft/rushstack)。

## 基于 PNPM 的 Monorepo

PNPM项目的初衷是**节约磁盘空间并提升安装速度**。PNPM将所有文件都存储在同一个位置，当软件包被被安装时，包里的文件会硬链接到这一位置，而不会占用额外的磁盘空间，可以跨项目地共享同一版本的依赖。

![](images/9a0c9b12a7f5ad7e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=f03d3e774409b08c10e380aabecf62811a98037ec7a112e3ce5a1fe321310f3b&X-Amz-SignedHeaders=host&x-id=GetObject)

PNPM 内置的 Workspace 能力提供了对 Monorepo 的支持。Workspace 的创建非常简单，包含[`pnpm-workspace.yaml`](https://pnpm.io/zh/pnpm-workspace_yaml) 文件的目录就是一个PNPM的Workspace。它定义了Workspace的根目录，可以从workspace中包含或者排除你选择的目录。

```yaml
packages:
  # all packages in direct subdirs of packages/
  - 'packages/*'
  # all packages in subdirs of components/
  - 'components/**'
  # exclude packages that are inside test directories
  - '!**/test/**'
```

## 保留历史记录，渐进迁移

团队的各个项目都在进行正常的开发迭代，技术改造不能对需求上线造成影响，需要有一个方案可以让技术改造和业务迭代并行。

当下的难点在于：

- Monorepo的改造，必然是要有一个新仓库的，原有项目仓库中的代码和新仓库之间的代码如何时刻保持同步

- 如何统一项目的依赖。

- 如何打造一套全新的构建流程。

针对难点1我想到的方案是：Git Submodule。Git Submodule 允许你将一个 Git 仓库作为另一个 Git 仓库的子目录。 它能让你将另一个仓库克隆到自己的项目中，同时还保持提交的独立。完美解决了代码同步的问题。

在改造阶段，对每个项目的修改主要包含：

- 依赖升级之后的可能存在的兼容性改动

- 编译打包相关的配置改动

这些工作可以单独拉去分支进行改造，通过验证之后合并回主干分支。当所有项目改造完成后，整体的升级也算是顺利完成了。

## 依赖升级

理想很美好，但是现实很残忍。当 PNPM 和 Git Submodule 配置之后，第一步的依赖升级就挡住前进的道路。各项目依赖的Vue和Webpack版本五花八门。Vue的版本有v2.6.12和v2.7.10，Webpack的版本有v3.x、v4.x和v5.x。

### Webpack

安装完依赖之后，第一次执行 `nuxt dev`便遇到了警告

![](images/a985eaa27bcd20f6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=443888ad5d65cb4b7ca94cbcc47cda27a5d50c6837e299178fe16889c4f552b6&X-Amz-SignedHeaders=host&x-id=GetObject)

显然，需要将Webpack生态相关的依赖升级到统一的版本。可以使用`pnpm why -r`快速检查指定包的依赖关系，所有项目的依赖扫了一遍，一个个升级实在过于繁琐。`pnpm update`根据指定的范围更新软件包的最新版本，配置项**`--recursive`**同允许我们同时在所有子目录中使用运行更新，就像刚才使用`pnpm why`时一样。

```bash
pnpm --recursive update
# 更新子目录深度为 100 以内的所有包
pnpm --recursive update --depth 100
# 将每个包中的 typescript 更新为最新版本
pnpm --recursive update typescript@latest
```

在指定更新某些包时，一定要记得带上版本，只有包名是不会更新的。


```bash
pnpm update --recursive webpack@^4 css-loader@^3 sass-loader@^10 webpack-merge@^5
```

### Vue 和 Nuxt

更新了Webpack版本后，又遇到了预料之中的`Vue packages version mismatch` 。检查发现，实际项目中使用的Vue版本都是v2.6.12，v2.7.10的版本来自一些第三方库的依赖。考虑到升级Vue可能带来的影响，决定先保留Vue的版本为v2.6.12。

再次执行 `nuxt dev`时，得到了新的错误。

```bash
✖ Nuxt Fatal Error                                                                       
                                                                                        
Error:                                                                                   
                                                                                        
Vue packages version mismatch:                                                           
                                                                                        
- vue@2.6.12                                                                             
- vue-server-renderer@2.7.10                                                             
                                                                                        
This may cause things to work incorrectly. Make sure to use the same version for both.
```

使用 `pnpm why` 查看 vue-server-renderer ，会发现最终的顶级依赖是 `nuxt`，我试图将其版本锁定在项目使用的 v2.11.0，但是依旧是相同的错误。将原先的 yarn.lock文件和 pnpm-lock.yml 进行比对后发现，后者的版本更新到了v2.7.10。从 node_module s中一层层从 nuxt 到 vue-server-renderer 的引用关系如下

```bash
nuxt@2.11.0 
	-> @nuxt/core@2.11.0 
		-> @nuxt/vue-renderer@2.11.0 
			->vue-server-renderer@^2.6.11
```

因为^的关系，vue-server-renderer 会安装到最新的v2.7.10。

> 为什么老项目本身能够运行？  
>项目中的 yarn.lock 文件创建的时间很早，锁定的vue-server-renderer是v2.6.12，与vue版本一致，所有可以运行。

看起来需要将Vue的版本锁定为v2.7.10。社区中有不少关于将Vue升级到2.7的踩坑文章，似乎没有太多问题。接下来结合项目当前对Vue的使用情况，梳理出一个可行的改造方案。在此之前，先将解决开发模式启动的问题。

```bash
pnpm update -r vue@2.7.10 nuxt@2.15.8
```

### Babel

同样的，使用 `update -r` 批量更新vue@2.7.10、nuxt@2.15.8，游戏进入到下一关。

```bash
/.nuxt/client.js: Unknown option: base.configFile. Check out http://babeljs.io/docs/usage/options/ for more information about options.

A common cause of this error is the presence of a configuration options object without the corresponding preset name. Example:

Invalid:
  `{ presets: [{option: value}] }`
Valid:
  `{ presets: [['presetName', {option: value}]] }`

For more detailed information on preset configuration, please see http://babeljs.io/docs/plugins/#pluginpresets-options.
```

这是babel-core和将babel升级到v7.x，bable-loader升级到v8.x 就能解决这个问题。我直接将它们升级到latest版本。

```bash
pnpm update --recursive babel-loader@latest @babel/core@latest @babel/preset-env@latest
```

因为项目中用到了jsx，对应的还需要升级相关的插件，具体细节可以查看[这里](https://github.com/vuejs/jsx-vue2)。

```bash
pnpm add -D -r @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
```

现在 `nuxt dev`可以顺利运行，但是页面上出现了下图中的错误。

![](images/9f00de739e51124a.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=6ff0094572833f572eefc95202e0bafa1455f20b49a5d7a76066df6d7e06e6f8&X-Amz-SignedHeaders=host&x-id=GetObject)

考虑到本次升级将nuxt从v2.11.0升级到了v2.15.8，猜测可能是nuxt导致的问题。

### Nuxt

通过打断点发现，在加载Layout目录中的组件时，出现了一个 undefined。检查发现是Layout目录中包含了一个`microEvent.js`，文件内容是导出了几个工具函数，没有默认导出对象（export default)。

```javascript
/*
* 定义一个事件系统，用于让微应用和主应用通讯
*/

const microEvents = {}

export const addMicroAppEventListener = (appName, ev, cb) => {
  if (!microEvents[appName]) {
    microEvents[appName] = {}
  }
  if (!microEvents[appName][ev]) {
    microEvents[appName][ev] = []
  }
  microEvents[appName][ev].push(cb)
}
export const removeMicroAppEventListener = (appName, ev, cb) => {
  if (microEvents[appName] && microEvents[appName][ev]) {
    microEvents[appName][ev] = microEvents[appName][ev].filter(it => it !== cb)
  }
}
export const dispatchMicroAppEvent = appName => (ev, ...args) => {
  if (microEvents[appName] && microEvents[appName][ev]) {
    microEvents[appName][ev].forEach(fn => fn.apply(null, args))
  }
}
```

对比了v2.10.1和v2.15.8的产物后发现，两个版本中，microEvent.js都被解析为 undefined，在2.10.1版本下，nuxt在解析了layouts目录中的文件后，直接构建了一个`layouts`对象。

![](images/f591b997c392d816.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=b3d97759895b8cf64cf466debe2a95a465a221254c0f1f314b67f217f0137f41&X-Amz-SignedHeaders=host&x-id=GetObject)

而在2.15.8版本中，则调用了`sanitizeComponent` 方法。

![](images/99826cd730e888df.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=7252be5d9cec8e1449476e6396152ce5287a98c5c0392925877ecb75320aa09e&X-Amz-SignedHeaders=host&x-id=GetObject)

在`sanitizeComponent(Component)` 中没有对入参为 undefined 时做兼容处理，导致出现报错。

```javascript
export function sanitizeComponent (Component) {
  // If Component already sanitized
  if (Component.options && Component._Ctor === Component) {
    return Component
  }
  if (!Component.options) {
    Component = Vue.extend(Component) // fix issue #6
    Component._Ctor = Component
  } else {
    Component._Ctor = Component
    Component.extendOptions = Component.options
  }
  // If no component name defined, set file path as name, (also fixes #5703)
  if (!Component.options.name && Component.options.__file) {
    Component.options.name = Component.options.__file
  }
  return Component
}
```

在 nuxtjs 的 [releases](https://nuxtjs.org/releases) 记录中找到了对应改动的版本在v2.13.0，[这里](https://github.com/nuxt/nuxt.js/pull/7139/commits/530d3d76f863b5094b0e6d057ea78038dbd7a8bf)是提交记录。

## 结束语

pnpm的改造成本不算太高，主要的成本体现在项目依赖的升级这件事情上。不过好在版本的跨度没有太大，整个过程较为平滑。但是这么多项目，如果一次性批量升级依赖，风险还是太大了。接下来要做的事情是，在每个项目的迭代中逐步升级依赖，减少升级带来的风险。与依赖升级可以同时进行的事情是，将项目的构建部署和工具包的发布等工程化相关的流程梳理清楚，收敛为一套标准的流程。所有的工作串起来后，完整的 Monorepo 方案就能顺利落地。
