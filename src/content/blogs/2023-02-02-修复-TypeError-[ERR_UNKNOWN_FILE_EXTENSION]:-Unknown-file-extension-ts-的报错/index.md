---
title: "修复 TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ts 的报错"
categories:
  - 杂七杂八
date: 2023-02-02T19:30:00.000+08:00
tags:
  - Node.js
  - TypeScript
  - 笔记
draft: false
---

今天用 TypeScript 写了一小段适配器模式的代码，本想着使用 `ts-node` 直接在terminal中跑一下。


```bash
npx ts-node ./adapter.ts
```


结果返回了下面这个错误。


```bash
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /Users/zhanglun/Documents/mine/vite-project/src/adapter.ts
    at new NodeError (node:internal/errors:393:5)
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:79:11)
    at defaultGetFormat (node:internal/modules/esm/get_format:121:38)
    at defaultLoad (node:internal/modules/esm/load:81:20)
    at nextLoad (node:internal/modules/esm/loader:163:28)
    at ESMLoader.load (node:internal/modules/esm/loader:605:26)
    at ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:22)
    at new ModuleJob (node:internal/modules/esm/module_job:63:26)
    at ESMLoader.#createModuleJob (node:internal/modules/esm/loader:480:17)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:434:34) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
```


很震惊，因为以前一直这么用。查阅一些资料之后发现，原来是因为ES Module。


过去我可能是随便创建了一个文件夹，写了一段TypeScript代码，使用ts-node跑一下。这没有什么问题。但是这次我是在一个包含了package.json的目录中运行 ts-node，而 package.json 中的`type`设置为`module`。移除掉 type 的设置就可以像以前那样运行我的代码了。


但是，ES Module是未来趋势呀。如何在保留`type:module` 的同时解决掉这个报错呢？下面提供三种方式来处理这个错误。


第一种方式是在执行 `ts-node` 时，添加参数 `—-esm` ：


```bash
npx ts-node --esm ./adapter.ts
```


第二种方式是使用 `node` 命令，执行时增加带上`—loader`：


```bash
npm install ts-node # 安装一下依赖
node --loader ts-node/esm ./adapter.ts
```


第三种方式是修改`ts-config.json`：


```json
{
  // 其他设置
  "ts-node": {
    "esm": true
    "experimentalSpecifierResolution": "node"
  }
}
```


可能你还需要注意`compilerOption`中是否包含这些配置，都是必须的。


```json
{
	// ...
	"compilerOpitons": {
		"esModuleInterop": true,
		"module": "ESNext",
		"moduleResolution": "node"
  }
	// ...
}
```

