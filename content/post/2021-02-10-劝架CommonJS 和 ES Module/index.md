---
title: "劝架CommonJS和ESModule"
date: 2021-02-10T10:20:30+08:00
draft: false
---


今天在开发过程中遇到一个报错

```bash
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /root/projects/build-tool/node_modules/ora/index.js
require() of ES modules is not supported.
require() of /root/projects/build-tool/node_modules/ora/index.js from /root/projects/build-tool/init.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
Instead rename index.js to end in .cjs, change the requiring code to use import(), or remove "type": "module" from /root/projects/build-tool/node_modules/ora/package.json.
```

糟糕，遇到CommonJS和ESModule两兄弟打架了😢

错误信息简单翻译一下就是: 我项目中使用`require()`加载了一个ES Module，后者不支持`require()`。要么我把自己的 JavaScript 文件后缀改成 `.cjs` ，然后用 `import()` 方法加载 `Ora`。要么我把 Ora 的 package.json 中的 `type: module` 去掉

按照第一种方式修改之后，代码立马就能跑起来。但是这种方法还是有些问题：

1. 项目中其他文件也有可能会引入到ESModule模式的依赖，我需要改更多文件的后缀
2. 文件后缀修改之后，在其被导入的地方需要同步修改
3. 目录中 `.js` 和 `.cjs` 的文件混在一起，都是JavaScript却总是给开发者一种混乱的感觉
4. 在文件内部 `require()` 和 `import()` 并存，也带来了混乱

那么有没有更加优雅的“劝架”方法呢？在回答这个问题前，我们先来认识认识这两兄弟。

### CommonJS

在ESModule诞生之前，CommonJS 作为 NodeJS 的模块系统标准。CommonJ S是 NodeJS 社区孵化出的模块标准，实现了JavaScript在服务端的模块化。在CommonJS中，每一个JavaScript文件都是一个模块，可以使用 `module.exports` 或者 `exports`导出变量，函数和对象。使用`require()`加载模块。默认使用同步的方式加载模块。

```jsx
// foo.js
module.exports = function() { 
  return 'Hello foo!';
}

// index.js
var foo = require('./foo');
console.log(foo()); // Hello foo!
```

具体的标准可以参考 [NodeJS Modules]([https://nodejs.org/dist/latest-v16.x/docs/api/modules.html](https://nodejs.org/dist/latest-v16.x/docs/api/modules.html))

CommonJS是面向服务端的模块系统，浏览器端无法使用。早期使用AMD模块规范在浏览器端实现JavaScript的模块化开发和加载。Webpack等构建工具，按照NodeJS中的CommonJS标准，实现了一套解析逻辑，在打包阶段注入对CommonJS模块的解析逻辑，使得能够像NodeJS一样加载和导出CommonJS。这使得在前端开发阶段就能用上相对比较“标准化”的模块化开发。

### ESModule

在 ES6 提出了 ESModule 作为语言标准以后，JavaScript这门语言终于有了自己的模块化方案了，具体的标准可参考[ECMAScript Modules]([https://tc39.es/ecma262/#sec-modules](https://tc39.es/ecma262/#sec-modules))。

自 Node v8.5以来，开发人员已经能够使用参数`--experimental-modules` 开启对ES模块规范的支持。从Node v12.4开始，模块可以在.mjs文件（或在某些情况下的.js文件）中定义，或者在Package.json中增加`type: modules`来表示启用ESModule。而自Node v15.3开始，可以不用 experimental flag 使用ESModule。

与CommonJS相比对最为直观的差别是，ESModule 使用 import 导出模块，使用 import 加载模块。比如说：

```jsx
// foo.mjs
export function foo() { 
  return 'Hello foo!'; 
}

// index.mjs
import { foo } from './foo.mjs';
console.log(foo()); // Hello foo!
```

当然二者的差别不止如此。而二者之间的差异也间接引发了文章开篇所提到的那个问题。

### 简单谈谈二者的差异

在CommonJS中，require() 是同步的。它不会返回Promise，也支持Callback。加载到模块之后会立刻执行，返回模块返回的对象。

在ESM中，模块的查找模块加载器。查找阶段，解析JavaScript文件找到import和export的调用，但不会执行import的文件。在解析阶段，ESM加载器可以立即检测到命名导入中的错误，并抛出一个异常，而不需要实际运行依赖的代码。解析通过之后，加载器开始异步下载和解析你导入的JavaScript，构造出依赖的module graph，最后代码开始执行。ES模块加载器保证了，在ES Module 构建的依赖图中，所有的脚本都是并行下载，但是顺序执行。

可以看到，二者在模块加载和解析的过程已经有很大的差别了。这也使得两种方案下的模块无法很好的互相导入和导出。

CommonJS不能 `require()` ESModule的最简单的原因是，后者允许顶层的await ，但是前者不行。

在ESModule中，你可以这么写：

```jsx
export const foo = await fetch('./data.json');
```

但是在CommonJS中你得这么写：

```jsx
(async () => {
	const { foo } = await fetch('./foo.mjs');
});
```

CommonJS可以导入 ESMoudle，但是不太好用。必须使用异步的动态导入

```jsx
(async () => {
    const {foo} = await import('./foo.mjs');
})();
```

虽然能用，但是在导出的时候你得导出Promise，这可能会让使用的人感到困惑。

ESModule 不能在导入阶段直接导入CommonJS具名导出的对象，你可以这么写：

```jsx
import _ form './lodahs.cjs';
```

但是不能在导入的同时进行解构，因为解构出来的对象是**具名导出的对象**，下面的操作会报错

```jsx
import { shuffle } from './lodash.cjs'
// SyntaxError: The requested module './lodash.cjs' does not provide an export named 'shuffle'
```

因为CommonJS只有在执行的时候才能计算出**具名导出的对象**，而ESModule的模块计算发生在解析阶段。所以你只能在导入之后再解构。

```jsx
import _ from './lodash.cjs';
const {shuffle} = _;
```

对导出对象的处理上也有差异，在CommonJS中，导出的对象所指向的值是可以修改的

```jsx
// b.js
exports.name = 'b';

// a.js
let { name } = require('b');
name = 123;
```

而使用ESModule规范的导入被当成常量处理，不允许修改：

```jsx
// a.js
export let num = 1
export const addNumber = ()=>{
    num++
}

// b.js
import {  num , addNumber } from './a'
num = 2

// 报错
num = 2
    ^
TypeError: Assignment to constant variable.
```

二者有如此多的差异，最好还是不要混用。但是在ESModule出现之前，所有的NPM包都是CommonJS规范标准下开发的。在实际开发过程中难免会遇到二者混合出现的场景，也就是文章开头遇到的错误。

但是再想想，在日常的前端开发中，似乎经常遇到两种写法混用的情况，而且还没有遇到任何上述提到的问题。为什么呢？

那是因为现在前端开发基本使用bundler工具打包过，其中使用了babel，将ES6的语法进行了转换，bundler工具最后以CommonJS的模式输出。在产出物中可以找到`__esModule`属性，将导入的模块标记为ESModule，方便后续的处理。

```jsx
// a.js
export default 1;

// main.js
import a from './a';

console.log(a);
```

转换之后

```jsx
// a.js
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = 1;

// main.js
'use strict';

var _a = require('./a');

var _a2 = _interopRequireDefault(_a);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_a2.default);
```

所以回到最初的问题，有没有更优雅一些当时来解决我的问题呢？有，加上babel配置进行一次编译。

### 加上一次编译

@babel/preset-env 是babel的一个核心插件，用来转换代码，让开发者能用上新的特性。其中的modules属性允许我们将ES Module 转换成另一个模块类型。默认是auto， 设置为目标模块类型为CommonJS即可。

参考：

1. [Node Modules at War: Why CommonJS and ES Modules Can’t Get Along](https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1)
