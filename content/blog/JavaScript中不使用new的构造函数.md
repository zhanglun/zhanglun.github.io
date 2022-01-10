---
title: JavaScript 中不使用 new 的构造函数（以及由此引发的联想）
date: 2015-01-28 21:09:00
category: ['JavaScript']
tags: ['笔记']
---

在JavaScript 中，调用构造函数的方法很简单。

```js
function Point(x, y){
  this.x = x;
  this.y = y;
}

// 调用Point构造函数
// 使用new 关键字
var p1 = new Point(20, 30);
// 不使用new 关键字
var p2 = Point(20, 30);
```

但是，要知道: new关键词的使用与否，产生的效果是不一样的。输出p1和p2可以很清楚的看到，
p1指向的是一个对象，这个对象的构造函数是Point()，而p2返回的是`undefined`。仔细一想其实也很好理解。不带new关键字的调用，实质上与调用普通的方法函数无异，关键之处在于调用时，所处的作用域为全局作用域，this指向了window，也就是说，这次调用发生之后，平白无故的为window对象增添了两个属性x和y。

为了解决这种问题，可以在构造函数中检查当前作用域，也就是this指向何处。

```js
function Point(x,y) {
  if (this instanceof Point) {
    this.x = x;
    this.y = y
  } else {
    return new Point(x,y);
  }
}
```

这样一来，即使在不使用new的情况下，构造函数也会自动使用new关键字。

说到这，让我有了探究new 操作符和this相关的知识点！！！

### JavaScript中的new

new操作符用来创建对象类型的一个实例，无论是用户自定义的对象类型还是内建对象类型，前提是得要有对象的构造函数。

基本语法如下：

```js
new constructor[([arguments])]  //可以看到调用时，构造函数后面的括号和参数都可选的
```
使用new创建一个用户自定义对象的实例是有以下两个步骤：

1. 编写构造函数，定义对象类型
2. 使用new操作符创建该对象的一个实例

在自定义对象类型的时候，需要创建一个函数，指明对象的名字（也就是函数名）以及属性。要知道，一个对象的属性可以来自另外的一个对象。来看看下面的例子。

当语句`new foo(...)`在执行的时候，会发生下面的事情：

1. 创建一个新的对象，继承自`foo.prototype`。
2. foo的constructor被调用，如果有指定的参数就传入参数；同时`this`与新创建的对象绑定在一起。在没有指定参数的情况下，`new foo` 和`new foo()`是相等的。在Backbone的教程中经常看到不带括号的调用。
3. 新的对象通过contructor函数，作为整个表达式的结果返回。如果contructor函数没有明确指出返回特定的对象，那么返回在第一步中创建的对象。一般来说，constructor没有返回一个值，但是可以指定返回的值来覆盖原本的对象。

###JavaScript中的this

关于this，水平有限，只是稍微了解一点js中的this。在大多数情况，this的值由函数的地阿英方式决定。this在执行期间不能被复制，每次函数调用的时候this的值也有可能会不同。它可以是全局的，当前对象或者任意对象，完全取决函数的调用方式。

#### 全局上下文
在全局上下文中，this指代的是全局对象。

```js
console.log(this.doucment === document);   //true
console.log(this === window);   // true
this.name = 'window name'
console.log(window.name);  // window name 
```

#### 函数上下文

在函数内部，this的值取决于函数是如何调用的。

```js
function fun(){
  return this;
}
fun() === window; // 全局对象
```

fun()调用时并不能决定this的值，因为代码不在严格模式下，this的值总是一个对象且默认为全局对象。而在严格模式下，this 的值根据运行时的上下文决定，如果没有定义this将是undefined。

我们常看到类似这样的代码，声明一个全局的对象作为命名空间将一些属性方法什么的都绑定到这个对象上，借此来减少全局变量。

```js
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  }
};

console.log(o.f()); // logs 37
```
当函数以对象中的方法的当时调用时，它们的this由调用该函数的对象进行设置。所以在上面的代码中，当f以对象o的方法调用时，this指向的便是o对象。在何处或者如何定义函数完全不会影响到this的行为。因为this的值去决定于调用函数的对象，这意味下面这么做this的行为也是一致的：

```js
var o = {prop: 37};
function independent(){
  return this.prop;
}

o.f = independent;

console.log(o.f()); // 输出37
```
类似的，this的绑定只受最靠近的成员引用的影响。在下面的这个例子中，我们以对象o中的b对象中的g方法来调用independent方法。在这次执行期间，函数中的this将指向o.b。事实上，这与对象本身的成员没有多大关系，最靠近的引用才是最重要的。

```js
o.b = {g: independent, prop: 42};
console.log(o.b.g()); // logs 42
```

相同的概念在定义在原型链中的方法也是一致的。如果该方法存在于一个对象的原型链上，那么this指向的是调用这个方法的对象，表现得好像是这个方法就存在于这个对象上一样。

```js
var o = {f:function(){ return this.a + this.b; }};
var p = Object.create(o);
p.a = 1;
p.b = 4;

console.log(p.f()); // 5
```

在这个例子中，对象p没有属于它自己的f属性，它的f属性继承自它的原型。但是这对于最终在o中找到f属性的查找过程来说没有关系；查找过程首先从p.f的引用开始，所以函数中的this指向p。也就是说，因为f是作为p的方法调用的，所以它的this指向了p。这是JavaScript的原型继承中的一个有趣的特性。

#### 构造函数中的this

当一个函数被作为一个构造函数来使用（使用new关键字），它的this与即将被创建的新对象绑定。

注意：当构造器返回的默认值是一个this引用的对象时，可以手动设置返回其他的对象，如果返回值不是一个对象，返回this。

```js
function A(){
  this.name = 'zhanglun';
}
var a = new A();

console.log(a);  // A {name: 'zhanglun'}

// 手动设置返回一个1
function B(){
  this.name = 'zhanglun';
  return 1
}
var b = new B();

console.log(b);  // B {name: 'zhanglun'}

function C(){
  this.name = 'zhanglun';
  return {}
}
var c = C();

console.log(c); // Object {}

```

#### call and apply

当一个函数的函数体中使用了this关键字时，通过所有函数都从Function对象的原型中继承的call()方法和apply()方法调用时，它的值可以绑定到一个指定的对象上。

```js
function add(c, d){
  return this.a + this.b + c + d;
}

var o = {a:1, b:3};

add.call(o, 5, 7); // 1 + 3 + 5 + 7 = 16

add.apply(o, [10, 20]); // 1 + 3 + 10 + 20 = 34
```




