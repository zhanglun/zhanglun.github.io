---
title: TypeScript学习笔记-入门:安装与基础知识
date: 2018-07-08 21:08:03
tags: ['TypeScript']
---

TypeScript 是由微软推出的开源编程语言，官网的定义如下：

> TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open source.

> TypeScript 是 JavaScript 的类型的超集，它可以编译成纯 JavaScript。编译出来的 JavaScript 可以运行在任何浏览器上。TypeScript 编译工具可以运行在任何服务器和任何系统上。TypeScript 是开源的。

<!--more-->


### 安装 TypeScript

使用 npm 安装 typescript。一步到位，可通过 `tsc --help` 查看帮助。

```bash
npm install -g typescript
```

### 简单的例子

前面说到，TypeScript 是 JavaScript 的超集。何谓超集？来回顾一下初中数学：

> 如果一个集合S2中的每一个元素都在集合S1中，且集合S1中可能包含S2中没有的元素，则集合S1就是S2的一个超集，反过来，S2是S1的子集。

而这也体现在TypeScript的语言上，TypeScript 包含 JavaSscript 的所有。也就是说，即使是按照 JavaScript 编写的代码，也能够被视作 TypeScript 来编译执行。举一个简单的例子：

```js
// hello.ts

function sayHello(name) {
  return `Hello, ${name}`;
}

sayHeloo('zhanglun`');
```

上述代码在TypeScript编译器会中会被编译输出如下：

```js
// hello.js
function sayHello(name) {
  return "Hello, " + name;
}
sayHello('zhanglun');
```

### 加入类型检查

上面的例子只是提到了 TypeScript代码 转换为 JavaScript 代码。接下来说一说 TypeScript 区别于 JavaScript 的精髓所在：类型检查。

众所周知，JavaScript 是一门弱类型语言的，在代码执行的过程中，时常会执行一些隐身类型转换，而这往往会产生一些难以预料的问题，同时难以排查出存在问题的代码。而 TypeScript 加入了编译的过程，在编译过程中进行静态类型检查。如果发现有错误，编译的时候就会报错。

> TypeScript 中，使用 : 指定变量的类型，: 的前后有没有空格都可以。

举一个简单的例子：

```js
function sayHello(person: string) {
  return 'Hello, ' + person;
}

let user = [0, 1, 2];

console.log(sayHello(user));
```

这段代码的编译会出错。

```bash
hello.ts:7:22 - error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.

7 console.log(sayHello(user));
```

TypeScript 编译过程即使报错了，还是会生成编译结果，我们仍然可以使用这个编译之后的文件。

如果要在报错的时候终止 JavaScript 文件的生成，可以在 tsconfig.json 中配置 noEmitOnError 即可。更新 config 相关配置请移步[官方手册](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。


### 类型声明

JavaScript 的类型分为两种：原始数据类型（Primitive data types）和对象类型（Object types）。

原始数据类型包括：布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol。

在 TypeScript 中，声明上述各种变量稍有不同。


#### Boolean

```js
let isDone:boolean = false; // 声明一个变量，这个变量是一个boolen
let createdByNewBoolean: boolean = new Boolean(1); // index.ts(1,5): error TS2322: Type 'Boolean' is not assignable to type 'boolean'。 new Boolean() 返回的是一个 Boolean 对象。
let createdByBoolean: boolean = Boolean(1); // 直接调用 Boolean 也可以返回一个 boolean 类型：
```

#### Number

```js
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;

// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;

// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

#### String

```js
let myName: string = 'Tom';
let myAge: number = 25;

// 模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;
```


#### Void

JavaScript 没有空值（Void）的概念，在 TypeScirpt 中，可以用 void 表示没有任何返回值的函数：

```js
function alertName(): void {
    alert('My name is Tom');
}
```

声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null：

```js
let unusable: void = undefined;
```

#### Null 和 Undefined

在 TypeScript 中，可以使用 null 和 undefined 来定义这两个原始数据类型：

```js
let u: undefined = undefined;
let n: null = null;
```

undefined 类型的变量只能被赋值为 undefined，null 类型的变量只能被赋值为 null。

与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 number 类型的变量：

```js
// 这样不会报错
let num: number = undefined;
// 这样也不会报错
let u: undefined;
let num: number = u;
```

而 void 类型的变量不能赋值给 number 类型的变量：

```js
let u: void;
let num: number = u;

// index.ts(2,5): error TS2322: Type 'void' is not assignable to type 'number'.
```
#### 任意值

TypeScript 提供了一个 any 类型，表示允许赋值为任意类。声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值。要注意的是： 变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型。

如果是一个普通类型，在赋值过程中改变类型是不被允许的：

```js
let myFavoriteNumber: string = 'seven';

myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

但如果是 any 类型，则允许被赋值为任意类型。

```js
let myFavoriteNumber: any = 'seven';

myFavoriteNumber = 7;
```


#### 聪明的类型推导

如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

以下代码虽然没有指定类型，但是会在编译的时候报错：

```js
let myFavoriteNumber = 'seven';

myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

事实上，它等价于：

```js
let myFavoriteNumber: string = 'seven';

myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：

```js
let myFavoriteNumber;

myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```
