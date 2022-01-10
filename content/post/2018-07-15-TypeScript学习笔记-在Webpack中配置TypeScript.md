---
title: TypeScript学习笔记-在Webpack中配置TypeScript
date: 2018-07-15 11:26:49
tags: ['TypeScript']
---

上篇说到TypeScript简单的基本知识，包括什么是TypeScript、TypeScript的安装以及TypeScript中的基本类型。今天来了解一下如何在Webpack中配置TypeScript。

<!--more-->

## tsconfig.json

首先，先来认识一下 TypeScript 中的配置文件`tsconfig.json`。之前提到过，TypeScript 在全局安装之后，便可以通过 `tsc` 命令来执行.ts文件的编译。`tsconfig.json` 可以指定编译时的各种参数。如果一个目录下存在一个 `tsconfig.json` 文件，那么它意味着这个目录是TypeScript项目的根目录。

使用`tsc`命令时，在不带任何输入文件的情况下，编译器会从当前目录开始去查找 `tsconfig.json` 文件，逐级向上搜索父目录。如果带上命令行参数--project（或-p），则指定一个包含 `tsconfig.json`。在命令行上指定的编译选项会覆盖在 `tsconfig.json` 文件里的相应选项。文件的目录。如果命令行指定了配置文件，将会采用指定的文件作为配置输入，即使当前目录中已经存在 `tsconfig.json`。


来看一个简单的`tsconfig.json`配置：

```json
{
   "compilerOptions": {
    "module": "system",  // 指定生成哪个模块系统代码： "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015"。 只有 "AMD"和 "System"能和 --outFile一起使用。 "ES6"和 "ES2015"可使用在目标输出为 "ES5"或更低的情况下。
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outFile": "./dist/",
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}

```

`compilerOptions` 可以为空，此时编译器会使用默认值。这里有完整的[compilerOptions](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。

`files` 指定一个包含相对或绝对文件路径的列表。 `include` 和 `exclude` 属性指定一个文件glob匹配模式列表。 支持的glob通配符有：

* \* 匹配0或多个字符（不包括目录分隔符）
* ? 匹配一个任意字符（不包括目录分隔符）
* **/ 递归匹配任意子目录

如果一个glob模式里的某部分只包含 * 或 .*，那么仅有支持的文件扩展名类型被包含在内（比如默认.ts，.tsx，和.d.ts， 如果 allowJs设置能true还包含.js和.jsx）。

如果 `files` 和 `include` 都没有被指定，**编译器默认包含当前目录和子目录下所有的 TypeScript 文件（.ts, .d.ts 和 .tsx）**，排除在"exclude"里指定的文件。JS文件（.js和.jsx）也被包含进来如果allowJs被设置成true。 如果指定了 "files"或"include"，编译器会将它们结合一并包含进来。 使用 "outDir"指定的目录下的文件永远会被编译器排除，除非你明确地使用"files"将其包含进来（这时就算用exclude指定也没用）。

使用 `include` 引入的文件可以使用 `exclude` 属性过滤。 然而，通过 `files` 属性明确指定的文件却总是会被包含在内，不管 `exclude` 如何设置。 如果没有特殊指定， `exclude` 默认情况下会排除 `node_modules`，`bower_components`，`jspm_packages`和`<outDir>`目录。

任何被 `files` 或 `include` 指定的文件所引用的文件也会被包含进来。 A.ts引用了B.ts，因此B.ts不能被排除，除非引用它的A.ts在 `exclude` 列表中。

需要注意编译器不会去引入那些可能做为输出的文件；比如，假设我们包含了index.ts，那么index.d.ts和index.js会被排除在外。 通常来讲，不推荐只有扩展名的不同来区分同目录下的文件。

`tsconfig.json` 文件可以是个空文件，那么所有默认的文件（如上面所述）都会以默认配置选项编译。

## 与Webpack集成

如果你已经有webpack的使用经验的话，这一步将会非常简单。设置好 `tsconfig.json` 之后，只需要针对 `ts` 文件配置对应的Loader即可。

1、首先需要安装必备的几个package:

```bash
npm install --save-dev typescript ts-loader
```

2、 设置基本的 `tsconfig.json` 配置，来支持 JSX，并将 TypeScript 编译到 ES5……

**tsconfig.json**

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es6",
    "jsx": "react",
    "allowJs": true,
    "sourceMap": true   
  }
}
```

3、在 webpack 配置中处理 TypeScript：

**webpack.config.js**

```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts|.tsx$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
        use: () => {
          return [
            {
              loader: ['ts-loader'],
            },
          ];
        },
      },
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

这会直接将 webpack 的入口起点指定为 ./index.ts，然后通过 ts-loader _加载所有的 .ts 和 .tsx 文件，并且在当前目录输出_一个 bundle.js 文件。

以上，是在webpack中集成TypeScript的一种基本模式，后续根据项目需要修改相关配置。


