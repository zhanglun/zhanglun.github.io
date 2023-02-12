---
title: 劝架CommonJS和ESModule
categories: 技术研究
status: publish
date: 2021-02-10T17:29:00.000+08:00
tags:
  - JavaScrtipt
  - Node.js
cover: ""

---


今天在开发过程中遇到一个报错

```bash
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /root/projects/build-tool/node_modules/ora/index.js
require() of ES modules is not supported.
require() of /root/projects/build-tool/node_modules/ora/index.js from /root/projects/build-tool/init.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
Instead rename index.js to end in .cjs, change the requiring code to use import(), or remove "type": "module" from /root/projects/build-tool/node_modules/ora/package.json.
```

糟糕，遇到CommonJS和ESModule两兄弟打架了😢

错误信息简单翻译一下就是: 我项目中使用`require()`加载了一个ES Module，后者不支持`require()`。要么我把自己的 JavaScript 文件后缀改成 `.cjs` ，然后用 `import()` 方法加载`Ora`。要么我把Ora的package.json 中的 `type: module` 去掉

按照第一种方式修改之后，代码立马就能跑起来。但是这种方法还是有些问题：

- 项目中其他文件也有可能会引入到ESModule模式的依赖，我需要改更多文件的后缀

- 文件后缀修改之后，在其被导入的地方需要同步修改

- 目录中`.js`和`.cjs`的文件混在一起，都是JavaScript却总是给开发者一种混乱的感觉

- 在文件内部 `require()` 和 `import()` 并存，也带来了混乱

那么有没有更加优雅的“劝架”方法呢？在回答这个问题前，我们先来认识认识这两兄弟。

### CommonJS 

在ESModule诞生之前，CommonJS作为NodeJS的模块系统标准。CommonJS是NodeJS社区孵化出的模块标准，实现了JavaScript在服务端的模块化。在CommonJS中，每一个JavaScript文件都是一个模块，可以使用`module.exports` 或者 `exports`导出变量，函数和对象。使用`require()`加载模块。默认使用同步的方式加载模块。

```javascript
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

```javascript
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

```javascript
export const foo = await fetch('./data.json');
```

但是在CommonJS中你得这么写：

```javascript
(async () => {
	const { foo } = await fetch('./foo.mjs');
});
```

CommonJS可以导入 ESMoudle，但是不太好用。必须使用异步的动态导入

```javascript
(async () => {
    const {foo} = await import('./foo.mjs');
})();
```

虽然能用，但是在导出的时候你得导出Promise，这可能会让使用的人感到困惑。

ESModule 不能在导入阶段直接导入CommonJS具名导出的对象，你可以这么写：

```javascript
import _ form './lodahs.cjs';
```

但是不能在导入的同时进行解构，因为解构出来的对象是**具名导出的对象**，下面的操作会报错

```javascript
import { shuffle } from './lodash.cjs'
// SyntaxError: The requested module './lodash.cjs' does not provide an export named 'shuffle'
```

因为CommonJS只有在执行的时候才能计算出**具名导出的对象**，而ESModule的模块计算发生在解析阶段。所以你只能在导入之后再解构。

```javascript
import _ from './lodash.cjs';
const {shuffle} = _;
```

对导出对象的处理上也有差异，在CommonJS中，导出的对象所指向的值是可以修改的

```javascript
// b.js
exports.name = 'b';

// a.js
let { name } = require('b');
name = 123;
```

而使用ESModule规范的导入被当成常量处理，不允许修改：

```javascript
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

```javascript
// a.js
export default 1;

// main.js
import a from './a';

console.log(a);
```

转换之后

```javascript
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

- [Node Modules at War: Why CommonJS and ES Modules Can’t Get Along](https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1)

### CommonJS的执行过程

在CommonJS中，使用require()加载模块，使用module.exports 导出模块。咱们先来看看require()，考虑一下代码：

```javascript
// main.js
const fs = require('fs');
const a = require('./a';
const b = require('../b/index.js');

module.exports = {
	a,
  b
}
```

在main.js 真正执行之前，Node会用一个Module Wrapper 将代码包裹

```javascript
(function (exports, require, module, __filename, __dirname) {
	// main.js
	const fs = require('fs');
	const a = require('./a';
	const b = require('../b/index.js');
	
	module.exports = {
		a,
	  b
	}
});
```

通过这种方式实现了：

- 将模块顶部的变量作用域（比如： var, const或者let)限制在模块中，而不是全局对象global

- 提供了一些指向当前模块的，看起来像是全局的变量

	- module 和 exports ，可以导出模块中的值

	- __filename是模块的绝对路径，__dirname是模块文件所在的文件夹路径

解决了模块作用域的问题之后，再来看看require()的事情。使用require可以导入NodeJS模块，JSON和本地文件。假设我们在目录Y中使用require(x)导入X，具体的执行过程如下：

```plain text
1. 如果 X 是核心模块（比如： fs, path, http)
   a. 返回核心模块
   b. 停止
2. 如果 X 以 '/' 开头
   a. 将 Y 设置为系统根目录
3. 如果 X 以 './' or '/' 或者 '../'开头，按照下面的步骤顺序执行
   a. 执行 LOAD_AS_FILE(Y + X)
   b. 执行 LOAD_AS_DIRECTORY(Y + X)
   c. 抛错 "not found"
4. 如果 X 以 '#' 开头
   a. 执行 LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. 执行 LOAD_PACKAGE_SELF(X, dirname(Y))
6. 执行 LOAD_NODE_MODULES(X, dirname(Y))
7. 抛错 "not found"

LOAD_AS_FILE(X)
1. 如果 X 是一个文件, 以该文件的格式加载。停止
2. 如果 X.js 是一个文件, 以 JavaScript 文本的形式加载该文件。停止
3. 如果 X.json 是一个文件, 将它解析为一个 JavaScript 对象。 停止
4. 如果 X.node 是一个文件, 以二进制插件的形式加载该文件。 停止

LOAD_INDEX(X)
1. 如果 X/index.js 是一个文件, 以 JavaScript 文本的形式加载该文件。 停止
2. 如果 X/index.json 是一个文件, 将它解析为一个 JavaScript 对象。停止
3. 如果 X/index.node 是一个文件, 以二进制插件的形式加载该文件。停止

LOAD_AS_DIRECTORY(X)
1. 如果 X/package.json 是一个文件,
   a. 解析这个文件，查找 main 字段
   b. 如果 main 是可为 false 的值，前往第二步
   c. 否则 创建一个新的路径 M = X + (json main field)
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. 抛错 "not found"
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. 从当前目录开始，向上遍历找到所有的“node_modules” let DIRS = NODE_MODULES_PATHS(START)
2. 遍历每一个目录，依次执行下面的步骤，直到最后抛出 "not found"
   a. LOAD_PACKAGE_EXPORTS(X, DIR)
   b. LOAD_AS_FILE(DIR/X)
   c. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = [GLOBAL_FOLDERS]
4. while I >= 0,
   a. if PARTS[I] = "node_modules" CONTINUE
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS

LOAD_PACKAGE_IMPORTS(X, DIR)
1. 找到离DIR最近的作用域SCOPE
2. 如果没有找到SCOPE，返回
3. 如果 SCOPE/package.json "imports" 是 null 或者 undefined, 返回
4. 4. 如果 SCOPE/package.json 的 "imports" 不为空，则检查 X 和 SCOPE 对应的文件的路径 let MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE), ["node", "require"]) 。
5. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(X, DIR)
1. Try to interpret X as a combination of NAME and SUBPATH where the name
   may have a @scope/ prefix and the subpath begins with a slash (`/`).
2. 如果 X does not match this pattern or DIR/NAME/package.json is not a file,
   return.
3. Parse DIR/NAME/package.json, and look for "exports" field.
4. If "exports" is null or undefined, return.
5. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   `package.json` "exports", ["node", "require"])defined in the ESM resolver.
6. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. Find the closest package scope SCOPE to DIR.
2. If no scope was found, return.
3. If the SCOPE/package.json "exports" is null or undefined, return.
4. If the SCOPE/package.json "name" is not the first segment of X, return.
5. let MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
defined in the ESM resolver.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. let { RESOLVED, EXACT } = MATCH
2. let RESOLVED_PATH = fileURLToPath(RESOLVED)
3. If EXACT is true,
   a. If the file at RESOLVED_PATH exists, load RESOLVED_PATH as its extension
      format. 停止
4. Otherwise, if EXACT is false,
   a. LOAD_AS_FILE(RESOLVED_PATH)
   b. LOAD_AS_DIRECTORY(RESOLVED_PATH)
5. THROW "not found"
```

> `PACKAGE_IMPORTS_RESOLVE` 的定义在 [esm_resolver_algorithm](https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_resolver_algorithm)，里面还执行了其他的算法逻辑，感兴趣的同学可以自行阅读。在模块查找的过程中，如果找到了的package.json中有import字段，便会执行 `PACKAGE_IMPORTS_RESOLVE` ，返回的是一个对象：

	```javascript
	resolvedMatch {
		resolved: String; // 模块对应的路径
		exact: Boolean; // 精确查找 or 模糊查找
	}
	```
