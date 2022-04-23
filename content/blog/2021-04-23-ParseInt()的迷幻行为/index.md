---
title: "ParseInt()的迷幻行为"
date: 2021-04-23T14:20:51+08:00
categories:
  - 技术研究
tags:
  - Javascript
---

最近看到一片文章 [Solving a Mystery Behavior of parseInt() in JavaScript]([https://dmitripavlutin.com/parseint-mystery-javascript/](https://dmitripavlutin.com/parseint-mystery-javascript/))，讲的是JavaScript中的`parseInt()`的一个奇怪现象。

`parseInt()`是JavaScript内置的一个方法，能将数字型的字符串转换成整数。例如， 将 `'100'`转换成`100`

```js
const number = parseInt('100');
console.log(number); // 100
```

`parseInt(numbericalString, radix)`也可以接受第二个参数，解析一个字符串并返回指定基数的十进制整数， `radix` 是2-36之间的整数，表示被解析字符串的基数，常用的是2，8，10和16。例如

```js
const number = parseInt('100', 2);
console.log(number); // 4

const number = parseInt('100', 8);
console.log(number); // 64
```

以上是`parseInt()`的基本用法。

## parseInt()的一个奇怪行为

` praseInt(numbericalString)` 会将其第一个参数转换为一个字符串，对该字符串进行解析，然后返回一个整数或 NaN，所以我们可以用 `parseInt()` 方法来获取浮点数的整数。

```js
parseInt(0.5);      // => 0
parseInt(0.05);     // => 0
parseInt(0.005);    // => 0
parseInt(0.0005);   // => 0
parseInt(0.00005);  // => 0
parseInt(0.000005); // => 0
```

获取0.5，0.05这样的浮点数的整数返回`0`，这看起来没有任何问题。但是 `parseInt()` 会讲`0.0000005` 转换成5。

```js
parseInt(0.0000005); // 5
```

这到底是为什么呢？

## 解开谜团

前面提到 `parseInt` 执行时，会先将第一个参数转换成字符串([ECMASCript ParseInt()](https://262.ecma-international.org/5.1/#sec-15.1.2.2))。其具体步骤如下，

1. 声明`inputString` = String(string)。
2. 声明 `S`, 保存去掉 `inputString` 开头的空格之后的字符串，如果 `inputString` 是空字符串则返回空字符串。
3. 声明标记位 `sign` = 1。
4. 如果`S`不为空且第一个字符是减号`-`，`sign`设置为`-1`。
5. 如果`S`不为空且第一个字符是加号`+`或者减号`-`，移除第一个字符串。
6. 声明`R=ToInt32(radix)`。
7. 声明`stripPrefix = true`。
8. 如果 R !== 0，则
  - a. 如果R < 2 或者 R > 36，返回NaN。
  - b. 如果 R !== 16，设置`stripPrefix = false`。
9. 如果 R == 0
  - a. 设置 R = 10
10. 如果 stripPrefix === true
  - a. 如果S的长度大于2且前两个字符是`0x`或者`0X`，移除前两个字符，同时设置R = 16
11. 如果S包含了当前R进制不相关的字符（假定第一个这样的字符是Q)，设置Z为S的一个子字符串，这个子字符串是Q之前的所有字符。否则设置Z=S
12. 如果 `Z` 为空，返回 `NaN`
13. 声明 `mathInt` 为Z在当前R进制下的整数
14. 声明 `number` 为 `mathInt`
15. 返回 `sign x number`

那我们先用 `String()` 来测试

```js
String(0.5);      // => '0.5'
String(0.05);     // => '0.05'
String(0.005);    // => '0.05'
String(0.0005);   // => '0.005' 
String(0.00005);  // => '0.00005'
String(0.000005); // => '0.000005'

String(0.0000005); // => '5e-7'
```

可以看到`String(0.0000005)`返回了科学计数法的格式`5e-7`，那么按照上面提到的 `parseInt()` 的实际处理过程，确实是返回`5`。由于某些数字在其字符串表示形式中使用e字符（例如 6.022×23 表示 6.022e23 ），因此当对非常大或非常小的数字使用数字时，使用 `parseInt` 截断数字将产生意外结果。 

将浮点数转换成整数的另一个更加安全的是 `Math.floor()`

```js
Math.floor(0.5);      // => 0
Math.floor(0.05);     // => 0
Math.floor(0.005);    // => 0
Math.floor(0.0005);   // => 0
Math.floor(0.00005);  // => 0
Math.floor(0.000005); // => 0

Math.floor(0.0000005); // => 0
```

那 parseInt(999999999999999999999) 返回多少呢？


## 参考文章

1. [Solving a Mystery Behavior of parseInt() in JavaScript](https://dmitripavlutin.com/parseint-mystery-javascript/)
2. [MDN ParseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
3. [ECMASCript ParseInt()](https://262.ecma-international.org/5.1/#sec-15.1.2.2)