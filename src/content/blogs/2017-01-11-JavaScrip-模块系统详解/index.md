---
title: JavaScrip模块系统详解
date: 2017-01-11 19:45:09
categories: ['技术研究']
tags: ['JavaScript']
---

在这几天的工作中，我需要调用同事编写的兼容jQuery和React的通用组件。他为了兼容jQuery风格的调用和React的组件化，分别export了一个default和几个方法函数。在调用的过程中，出现了一些小插曲：React代码和老的jQuery老代码调用时应该怎么正确的import？虽然是很低级的问题，但是引发了我一些思考：**export 和 import 与 module.exports 和 exports 之间的关系**以及**JavaScript模块系统的发展历程**。

<!--more-->

JavScript这门语言，在设计之初是没有自己的模块系统的。但是在 ES6 正式发布之前，社区已经中已经出现了一些库，实现了简单的模块风格，并且这种风格在 ES6 中也是适用的：

* 每个模块都是一段代码，加载之后只会解析过程只会执行一次；
* 在模块中可以声明变量，函数，类等；
  - 默认情况下，这些声明都是这个模块的局部声明；
  - 可以将一些声明导出，让其他模块引用；
* 一个模块可以通过模块标识符或者文件路径引入其他模块；
* 模块都是单例的，即使多次引用，也只有一个实例;

有一点要注意，避免通过`global`作为来引用自己的模块，因为`global`本身也是一个模块。

### ES5中的模块系统

前面说到的，在 ES6 之前，JavaScript 是没有模块系统这一说的。在社区的模块风格出现之前，编写 JavaScript常常会遇到这种情况：

* 所有的代码写在一个文件里面，按照依赖顺序，被依赖的方法必须写在前面。 简单粗暴，但是问题很多
  - 通用的代码无法重复利用。
  - 单个文件会越来越大，后期的命名也会越来越艰难。
* 按照功能将代码拆分成不同文件，按照依赖顺序加载，被依赖的方法必须先加载。通用代码可以复用，但是问题还是很多
  - 过多全局变量，容易冲突。
  - 过多 JavaScript 脚本加载导致页面阻塞（虽然 HTML5中的 defer和 async可以适当的减轻这个问题）。
  - 过多依赖不方便管理和开发。

随着 JavaScript 的地位慢慢提高，为了满足日常开发的需要，社区中慢慢出现了相对比较同意的模块标准，主要有两种：

* **CommonJS Modules:** 这个标准主要在 Node.js 中实现（Node.js的模块比 CommonJS 好稍微多一些特性）。其特点是：
 - 简单的语法
 - 为同步加载和服务端而设计
* **Asynchronous Module Definition (AMD):** 这个标准最受欢迎的实现实在 RequireJS 中。其特点是：
 - 稍微复杂一点点的语法，使得AMD的运行不需要编译
 - 为异步加载和浏览器而设计

上述只是 ES5 模块系统的简单介绍，如果有兴趣可以去看看[Writing Modular JavaScript With AMD, CommonJS & ES Harmony](https://addyosmani.com/writing-modular-js/)。

#### CommonJS Modules 在 Node.js 中的实现

根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象的属性，或者将属性暴露出来。在 Nodejs就是如此。

比如：

```js
const circle = require('./circle.js'); // 使用 require 加载模块 circle
console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);
```

在 circle.js 中:

```js
const PI = Math.PI;
exports.area = (r) => PI * r * r;
exports.circumference = (r) => 2 * PI * r;
```

circle.js 模块导出了 area()和 circumffference()两个方法，变量 PI是这个模块的私有变量。如果想为自定义的模块添加属性或者方法，将它们添加到 exports 这个特殊的对象上就可以达到目的。
如果希望模块提供的接口是一个构造函数，或者输出的是一个完整的对象而不是一个属性，那么可以使用 module.exports 代替 exports。但是注意，exports 是 module.exports 的一个引用，只是为了用起来方便，只要没有重写 module.exports对象，那么`module.exports.xxx`就等价于`exports.xxx`。

```js
const square = require('./square.js');
var mySquare = square(2);
console.log(`The area of my square is ${mySquare.area()}`);
```

square.js:

```js
module.exports = (width) => {
  return {
    area: () => width * width
  };
}
```

#### AMD规范

AMD是“Asynchronous Module Definition”的缩写。通过异步方式加载模块，模块的加载不影响后续语句的执行，所有依赖加载中的模块的语句，都会放在一个回调函数中，等到该模块加载完成后，这个回调函数才运行。注意，在 AMD 中模块名是全局作用域，可以在全局引用。

AMD规范的API非常简单：

```bash
define(id?, dependencies?, factory);
```

规范定义了一个define函数，它用来定义一个模块。它包含三个参数，前两个参数都是可选的。

* id：是一个string字符串，它表示模块的标识。通常用来定义这个模块的名字，一般不用
* dependencies：是一个数组，依赖的模块的标识。也是可选的参数，每个依赖的模块的输出将作为参数一次传入 factory 中。如果没有指定 dependencies，那么它的默认值是 ["require", "exports", "module"]。
* factory：一个函数或者对象。如果是函数，在依赖的模块加载成功后，会执行这个回调函数，它的返回值就是模块的输出接口或值。它的参数是所有依赖模块的引用。

定义一个名为 myModule 的模块，它依赖 jQuery 模块：

```js
define('myModule', ['jquery'], function($) {
    // $ 是 jquery 模块的输出
    $('body').text('hello world');
});
// 使用
define(['myModule'], function(myModule) {});
```

### ES6中的模块系统

ES6 模块系统的目标就是创建一个统一的模块格式，让 CommonJS 和 AMD的使用者都满意：

* 和CommonJS类似，但是更加简洁的语法，循环引用的支持更好。
* 和AMD类似，直接支持异步加载和可配置的模块加载。

模块标准主要有两部分：

1. 声明语法：import 和 export
2. 可编程的加载 API：配置模块如何以及有条件地加载模块

#### ES6模块的基础

在 ES6的模块系统中，有两种 export：命名的 export 和默认的 export。在一个文件中，命名的 export 可以有多个，而默认的 default export 只能有一个。可以同时使用，但最好还是分开使用。

##### 命名的export

也可以在声明表达式前面加上 export 关键字可以直接导出将声明的对象导出：

```js
//------ lib.js ------
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}

//------ main.js ------
import { square, diag } from 'lib';
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5
```
如果要导出一个已经存在的变量，需要加上`{}`:

```js
const random = Math.random;
export random;  // SyntaxError: Unexpected token, expected {
export { random };
```

使用 CommonJS 语法实现相同目的：

```js
//------ lib.js ------
var sqrt = Math.sqrt;
function square(x) {
    return x * x;
}
function diag(x, y) {
    return sqrt(square(x) + square(y));
}
module.exports = {
    sqrt: sqrt,
    square: square,
    diag: diag,
};

//------ main.js ------
var square = require('lib').square;
var diag = require('lib').diag;
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5
```

下面是来自 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 的更加完整的export 语法：

```js
export { name1, name2, …, nameN };
export { variable1 as name1, variable2 as name2, …, nameN };
export let name1, name2, …, nameN; // also var
export let name1 = …, name2 = …, …, nameN; // also var, const

export expression;
export default expression;
export default function (…) { … } // also class, function*
export default function name1(…) { … } // also class, function*
export { name1 as default, … };

export * from …;
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
```

##### 默认导出

每个模块只有一个默认导出的值， default export 可以是一个函数，一个类，一个对象或者其他任意值。有两种形式的 default export:

1. 被标记的声明。导出一个函数或者类
2. 直接导出值。导出表达式的运行结果

导出一个函数：

```js
//------ myFunc.js ------
export default function () {} // 没有分号 函数名可有可无

//------ main1.js ------
import myFunc from 'myFunc';
myFunc();
```

导出一个类：

```js
//------ MyClass.js ------
export default class {} // 没有分号 类名可有可无

//------ main2.js ------
import MyClass from 'MyClass';
const inst = new MyClass();
```

导出表达式运行结果：

```js
export default 'abc';
export default foo();
export default /^xyz$/;
export default 5 * 7;
export default { no: false, yes: true };
```

前面说的到的导出匿名函数和类，可以将其视为导出表达式的运行结果：

```js
export default (function () {});
export default (class {});
```

每一个 default export 都是这种结构：

```js
export default <<expression>>
```

相当于：

```js
const __default__  = <<expression>>;
export { __default__ as default }; // (A)
```

export后面是不能接变量声明的，因为一个变量声明表达式中可以一次生命多个变量。考虑下面这种情况：

```js
export default const foo = 1, bar = 2, baz = 3; // not legal JavaScript!
```

应该导出 foo，bar，还是 baz 呢？

##### 必须在模块的最顶层使用import和export

```js
if (Math.random()) {
    import 'foo'; // SyntaxError
}

// You can’t even nest `import` and `export`
// inside a simple block:
{
    import 'foo'; // SyntaxError
}
```

##### import 会被提升到当前作用域的顶部

模块的 import 会被提升到当前作用域的顶部。所以下面这种情况是可行的：

```js
foo();

import { foo } from 'my_module';
```

##### import 的一些细节

import的基本语法：

```js
import defaultMember from "module-name";
import * as name from "module-name";
import { member } from "module-name";
import { member as alias } from "module-name";
import { member1 , member2 } from "module-name";
import { member1 , member2 as alias2 , [...] } from "module-name";
import defaultMember, { member [ , [...] ] } from "module-name";
import defaultMember, * as name from "module-name";
import "module-name";
```


### 对循环引用的支持

什么是循环引用？模块A 引用了模块 B，模块 B 又引用了模块 A。如果可能的话，应该避免这种情况出现，这会使得模块之间过度的耦合。但是这种有时候又是无法避免的。

#### CommonJS 中的循环引用

a.js 中的内容：

```js
console.log('模块 a 开始了！');
exports.done = false;
var b = require('./b.js');
console.log('在 a 中, b.done = %j', b.done);
exports.done = true;
console.log('模块 a 结束了！');
```

b.js 中的内容：

```js
console.log('模块 b 开始了！');
exports.done = false;
var a = require('./a.js');
console.log('在 b 中, a.done = %j', a.done);
exports.done = true;
console.log('模块 b 结束了！');
```

main.js 中的内容：

```js
console.log('main 开始了！');
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main 中, a.done=%j, b.done=%j', a.done, b.done);
```

当 main.js 加载 a.js 时，a.js 又加载 b.js。这个时候，b.js 又会尝试去加载 a.js 。为了防止出现无限循环的加载，a.js 中的 exports 对象会返回一个 unfinished copy 给 b.js 模块。然后模块 b 完成加载，同时将提供模块 a 的接口。当 main.js 加载完 a，b 两个模块之后，输出如下：

```bash
main 开始了！
模块 a 开始了！
模块 b 开始了！
在 b 中, a.done = false
模块 b 结束了！
在 a 中, b.done = true
模块 a 结束了！
在 main 中, a.done=true, b.done=true
```

这种方式有其局限性：

* Nodejs风格的单个值的导出无法工作。当a使用 module.exports 导出一个值时，那么 b 模块中引用的变量 a 在声明之后就不会再更新

  ```js 
    module.exports = function(){};
  ```
  
  
* 无法直接命名你的引用
  
  ```js
  var foo = require('a').foo; // foo  is undefined
  ```

#### ES6中的循环引用

ES6中，imports 是 exprts 的只读视图，直白一点就是，imports 都指向 exports 原本的数据，比如：

```js
//------ lib.js ------
export let counter = 3;
export function incCounter() {
    counter++;
}

//------ main.js ------
import { counter, incCounter } from './lib';

// The imported value `counter` is live
console.log(counter); // 3
incCounter();
console.log(counter); // 4
// The imported value can’t be changed
counter++; // TypeError
```

因此在 ES6中处理循环引用特别简单，看下面这段代码：

```js
//------ a.js ------
import {bar} from 'b'; // (i)
export function foo() {
  bar(); // (ii)
}

//------ b.js ------
import {foo} from 'a'; // (iii)
export function bar() {
  if (Math.random()) {
    foo(); // (iv)
  }
}
```

假设先加载模块 a，在模块 a 加载完成之后，bar 间接性地指向的是模块 b 中的 bar。无论是加载命令的 imports 还是未完成的 imports，imports 和 exports 之间都有一个间接的联系，所以总是可以正常工作。

### ES6 模块加载器 API

除了声明式加载模块，ES6还提供了一个可编程的 API：

* 以编程的方式使用模块
* 配置模块的加载

要注意，这个 API 并不是ES6标准中的一部分，在“JavaScript Loader Standrad”中，并且具体的标准还在制定中，所以下面讲到的内容都是试验性的。

#### Loaders 的简单使用

Loader 用于处理模块标识符和加载模块等。它的 construct 是`Reflect.Loader`。每个平台在全局作用域中都有一个全局变量`System`的实例来实现 loader 的一些特性。

你可以通过 API 提供的 Promise，以编码的方式 import 一个模块：

```js
System.import('some_module')
.then(some_module => {
    // Use some_module
})
.catch(error => {
    ···
});
```
System.import() 可以：

* 可以在 script 标签中使用模块 
* 有条件地加载模块


System.import() 返回一个模块, 可以用 Promise.all() 来导入多个模块:

```js
Promise.all(
    ['module1', 'module2', 'module3']
    .map(x => System.import(x)))
.then(([module1, module2, module3]) => {
    // Use module1, module2, module3
});
```

##### Loader的其他方法
Loader 还有一些其他方法，最重要的三个是：

* System.module(source, [options])
  将 source 中的 JavaScript 代码当做一个模块执行，返回一个 Promise
* System.set(name, modules)
  注册一个模块，比如用 System.module 创建的模块
* System.define(name, source, [options])
  执行 source 中的代码，将返回的结果注册为一个模块

目前 Loader API 还处于试验阶段，更多的细节不想在深入。有兴趣的话可以去看看


### 模块导入的细节

在 CommonJS 和 ES6中，两种模块导入方式有一些不同：

* 在 CommonJS 中，导入的内容是模块导出的内容的拷贝。
* 在 ES6 中，导出值得实时只读视图，类似于引用。

在 CommonJS 中，如果你将一个导入的值保存到一个变量中，这个值会被复制两次：第一次是这个值所属模块导出时（行 A），第二次是这个值被引用时（行 B）。

```js
//------ lib.js ------
var counter = 3;
function incCounter() {
    counter++;
}
module.exports = {
    counter: counter, // (A)
    incCounter: incCounter,
};

//------ main1.js ------
var counter = require('./lib').counter; // (B)
var incCounter = require('./lib').incCounter;

// The imported value is a (disconnected) copy of a copy
console.log(counter); // 3
incCounter();
console.log(counter); // 3

// The imported value can be changed
counter++;
console.log(counter); // 4
```

如果通过 exports对象来访问这个值，这个值还是会再复制一次：

```js
//------ main2.js ------
var lib = require('./lib');

// The imported value is a (disconnected) copy
console.log(lib.counter); // 3
lib.incCounter();
console.log(lib.counter); // 3

// The imported value can be changed
lib.counter++;
console.log(lib.counter); // 4
```

和 CommonJS 不同的是，在 ES6中，所有的导入的数据都是导出值的视图，每一个导入的数据都和原始的数据有一个实时连接（并不是 JS 中Object引用的那种概念，因为导出的值可以是一个原始类型，primitive type，而且导入的数据是只读的）。

* 无条件的引入 (import x from 'foo') 就是用 const 声明的变量
* 模块的属性foo (import * as foo from 'foo') 则是创建一个 frozen object.

```js
//------ lib.js ------
export let counter = 3;
export function incCounter() {
    counter++;
}

//------ main1.js ------
import { counter, incCounter } from './lib';

// The imported value `counter` is live
console.log(counter); // 3
incCounter();
console.log(counter); // 4

// The imported value can’t be changed
counter++; // TypeError
```

如果使用*引入模块，会得到相同的结果：

```js
//------ main2.js ------
import * as lib from './lib';

// 导入的值 counter 是活动的
console.log(lib.counter); // 3
lib.incCounter();
console.log(lib.counter); // 4

// 导入的值是只读的不能被修改
lib.counter++; // TypeError
```

虽然不能修改导入的值，但是可以修改对象指向的内容，这个 const 常量的处理是一致的。例如：

```js
//------ lib.js ------
export let obj = {};

//------ main.js ------
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
```

### 结束

关于更多 ES6 模块相关的内容，有兴趣的朋友可以去下面这些地方看看：

* [http://exploringjs.com/es6/ch_modules.html](http://exploringjs.com/es6/ch_modules.html)
* [http://www.ecma-international.org/ecma-262/6.0/#sec-modules](http://www.ecma-international.org/ecma-262/6.0/#sec-modules)


参考资料：

1. [http://stackoverflow.com/a/40295288](http://stackoverflow.com/a/40295288)
2. [http://exploringjs.com/es6/ch_modules.html](http://exploringjs.com/es6/ch_modules.html)
3. [http://zhaoda.net/webpack-handbook/amd.html](http://zhaoda.net/webpack-handbook/amd.html)
4. [https://nodejs.org/api/modules.html])(https://nodejs.org/api/modules.html)
5. [http://speakingjs.com/es5/ch17.html#freezing_objects](http://speakingjs.com/es5/ch17.html#freezing_objects)
