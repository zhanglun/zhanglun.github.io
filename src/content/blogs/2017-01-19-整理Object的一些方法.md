---
title: 整理Object的一些方法
date: 2017-01-19 19:32:31
categories: ['技术研究']
tags: ['JavaScript']
---

ES5 和 ES6 中 Object 添加了很多新的方法，现在很多开源代码中有用到了这些，今天来整理一番。

<!--more-->

### Object.assign()

这是ES6新添加的方法，`Object.assign()`用来复制源对象的所有可枚举属性复制到目标对象中，方法返回目标对象。语法如下：

```js
Object.assign(target, ...source);
```

source对象可以有很多个，比如：

```js
let target = {name: 'target'};
let source1 = {age: 23};
let source2 = {email: 'zhanglun1410@gmail.com'};
// ...
// let sourceN ={.....};
traget = Object.assign(target, source1, source2);
```

如果源对象和目标对象的属性的key相同，目标对象的属性将会被源对象中的属性覆盖。对于多个源对象来说，如果有相同的key，右边的属性将覆盖左边的属性。这个方法只能将源对象的可枚举对象和自己的属性复制给目标对象。

> 什么是可枚举对象（）？
> 可枚举属性是指那些内部 “可枚举” 标志设置为true的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为true，对于通过Object.defineProperty等定义的属性，该标识值默认为false。可枚举的属性可以通过 for...in 循环进行遍历（除非该属性名是一个 Symbol）。

对于源对象，Object.assign使用[[Get]]，而在目标对象上使用[[Set]]，也就是说，使用这个方法会源对象的getter和目标对象的setters。所以其本质就是定义或者复制一个新的属性。如果等待合并的源对象包含了getters，那就不太适合用来将源对象合并到原型中。假如复制的属性到原型里，包括它们的可枚举属性，那么应该使用 Object.getOwnPropertyDescriptor() 和 Object.defineProperty() 。String 和 Symbol 属性都是会被复制的。

如果遇到了一个错误，比如目标对象的某个属性是不可修改的，会抛出一个TypeError的错误吗，目标对象保持不变

```js
var foo = {}
Object.defineProperty(foo, 'name', {
  writable: false,
  value: 'zhanglun'
});
Object.assign(foo, {name: 'zhangxiaolun'}); // TypeError: Cannot assign to read only property '1' of object '#<Object>'
```

如果源对象是null或者undefined，Object.assign()不会抛出错误：

```js
var foo = {name: 'zhanglun'};
Object.assign(foo, null, undefined);
console.log(foo); // foo: {name: 'zhanglun'}
```

### Object.create()

通过指定的原型对象和属性，创建一个新的对象。语法如下：

```js
Object.create(proto, [,. propertiesObject]);
```

第一个参数是一个对象，可以是一个普通的对象，比如：`{name: 'zhanglun'}`，也可以是一个新创建的对象的原型（prototype），比如：new Array().prototype。无论是那种，都是 JavaScript 中的 Object，其属性都被添加到返回的对象原型中；第二个参数是可选的，但是不能是`undefined`，该对象自身拥有的可枚举属性会被添加到新创建的对象上，其原型链上的属性是无效的。如果第一个参数不是null或者一个对象值，将会抛出TypeError异常。

Object.create()最直接的作用是基于一个对象创建新的对象，更多时候用在了原型链继承上，先来看看 JavaScript
中创建对象的几种方法：

* 对象字面量

```js
var o = {a: 1};

// o这个对象继承了Object.prototype上面的所有属性
// 所以可以这样使用 o.hasOwnProperty('a').
// hasOwnProperty 是Object.prototype的自身属性。
// Object.prototype的原型为null。
// 原型链如下:
// o ---> Object.prototype ---> null

var a = ["yo", "whadup", "?"];

// 数组都继承于Array.prototype 
// (indexOf, forEach等方法都是从它继承而来).
// 原型链如下:
// a ---> Array.prototype ---> Object.prototype ---> null

function f(){
  return 2;
}

// 函数都继承于Function.prototype
// (call, bind等方法都是从它继承而来):
// f ---> Function.prototype ---> Object.prototype ---> null
```

* 构造函数

在 JavaScript 中，构造器其实就是一个普通的函数。当使用 new 操作符 来作用这个函数时，它就可以被称为构造方法（构造函数）。如果没有 new 关键字而是直接调用的话，相当于是在当前作用域上调用，此时函数中如果有 this 的话，this 指向的是当前作用域。

```js
function Graph() {
  this.vertexes = [];
  this.edges = [];
}

Graph.prototype = {
  addVertex: function(v){
    this.vertexes.push(v);
  }
};

var g = new Graph();
// g是生成的对象,他的自身属性有'vertices'和'edges'.
// 在g被实例化时,g.[[Prototype]]指向了Graph.prototype.
Graph();
console.log(window.vertexes); // 在全局作用域中调用，意外地增加了全局变量
```

* 使用 Object.create()

```js
var a = {a: 1}; 
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.a); // 1 (继承而来)

var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null

var d = Object.create(null);
// d ---> null
console.log(d.hasOwnProperty); // undefined, 因为d没有继承Object.prototype
```

* ES6 中的 Class 关键字

ES6 引入了一套新的关键字用来实现 class。这是一个语法糖，其本质还是基于原型的。这些新的关键字包括 class, constructor, static, extends, 和 super。关于 Class的使用，回头再开一篇文章深入学习。

```js
"use strict";

class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

class Square extends Polygon {
  constructor(sideLength) {
    super(sideLength, sideLength);
  }
  get area() {
    return this.height * this.width;
  }
  set sideLength(newLength) {
    this.height = newLength;
    this.width = newLength;
  }
}

var square = new Square(2);
```

#### 使用 Object.create() 实现继承

下面是一个使用 Object.create()实现类的继承的例子。

```js
function Shape() {
  this.x = 0;
  this.y = 0;
}

// 父类的原型方法
Shape.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};

// 子类
function Rectangle() {
  Shape.call(this); // 调用构造函数
}

// 子类继承父类
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

console.log('Is rect an instance of Rectangle?', rect instanceof Rectangle);// true
console.log('Is rect an instance of Shape?', rect instanceof Shape);// true
rect.move(1, 1); // Outputs, 'Shape moved.'
```

#### Object.create VS new

前面说到的，Object.create实际上是将第一个参数（无论是原型对象还是普通对象）的属性添加到新创建对象的原型中，这也就意味着，通过`new Function()`中定义的属性和方法是无法通过 create()方法添加到新创建对象中的。

Object.create创建一个新的对象，这个对象“继承”了第一个参数。构造函数新创建的对象“继承”构造函数的prototype。

```js
let o = new SomeConstructor();  // o 直接继承自`SomeConstructor.prototype`。
```

两者的最明显的不同之处在于：如果 Object.create()的第一个参数是`null`，新创建的对象不会“继承”自任何地方，没有原型，也没有往上追溯的原型；在使用构造函数时，如果将其原型设置为 null，`SomeConstructor.prototype = null;`，新创建的对象将会“继承”自 Object 的 prototype。



### Object.freeze()

字面意思就是将一个 object“冻住”：不能添加新的属性；不能删除现有的属性；不能修改现有属性，包括属性的enumerability, configurability和 writability。这个方法返回一个不可修改的对象，使用语法：

```js
Object.freeze(obj)
```

任何尝试修改该对象的操作都会失败，可能是静默失败，也可能会抛出异常。在严格模式中会抛出异常（本地测试下来严格模式也不会报错）。数据属性的值不可更改，访问器属性（有getter和setter）也同样，但由于是函数调用，给人一种修改了这个属性的错觉。如果一个属性的值是个对象，则这个对象中的属性是可以修改的，除非它也是个冻结对象。

```js
let foo = {
  name: 'zhanglun',
  age: 23,
}

console.log(foo.name); // 'zhanglun'
console.log(foo.age); // 23

foo.name = 'zhanglun1410';
foo.age = 24;

console.log(foo.name); // 'zhanglun1410'
console.log(foo.age); // 24

Object.freeze(foo);

foo.name = 'zzzz'; // 静默失败
console.log(foo.name); // 'zhanglun1410'

'use strict';
foo.name = 'zzzz'; // TypeError 或者 静默失败
console.log(foo.name); // 'zhanglun1410'
```

#### Object.freeze VS const

被冻结的对象是不可改变的。但是它不一定是常量。对常量而言，它的所有引用，无论是直接的还是间接的都是引用的不可改变的对象。string，number，和 boolean 总是不可变的（当你把一个变量从字符串 A 修改到字符串 B时，A 和 B 都是不可变的，A 还是 A，B 也还是 B，只不过变量的之前指向的是 A,修改之后指向了 B）。通常来说，一般不会创建一个对象常量，也不存在freezeAll()这样的方法。

const 用于声明常量，将变量绑定到一个不可修改的对象，常量最终指向的是一个不可修改的对象，比如一个被冻结的对象，而 Object.freeze 作用在对象的值上，将一个对象变成不可修改的对象。

#### 深度冻结对象

前面提到的，Object.freeze作用在对象的属性上，使对象的属性不可修改。而如果属性值也是一个对象的话，依然能够修改，除非这个对象也被冻结了。因此，可以把 Object.freeze 理解成是“浅冻结”。可以编写额外的代码来实现“深冻结”：

```js
obj1 = {
  internal: {}
};

Object.freeze(obj1);
obj1.internal.a = 'aValue';

obj1.internal.a // 'aValue'

// 深度冻结
function deepFreeze(obj) {

  // 获取到对象的属性的名字
  var propNames = Object.getOwnPropertyNames(obj);

  // 先冻结内部的对象
  propNames.forEach(function(name) {
    var prop = obj[name];

    // Freeze prop if it is an object
    if (typeof prop == 'object' && prop !== null)
      deepFreeze(prop);
  });

  // 冻结 obj
  return Object.freeze(obj);
}

obj2 = {
  internal: {}
};

deepFreeze(obj2);
obj2.internal.a = 'anotherValue';
obj2.internal.a; // undefined
```

#### Object.freeze 的注意事项

在 ES5 中，如果参数不是一个对象，是一个原始数据类型，会抛出 TypeError。在 ES6 中，不是对象的参数的会被当做是一个已经被冻结的普通对象，只是返回这个参数。

### Object.defineProperty()

Object.defineProperty是ES5新增的一个方法，可以给对象的属性增加更多的控制。语法如下：

```js
Object.defineProperty(obj, prop, descriptor)
```

前面两个参数很简单，修改的对象和修改或者新增的属性，着重介绍一下第三个参数：属性描述符。

ES5 中定义了一个名叫“属性描述符”的对象，用于描述了的各种特征，它本身是一个 Object。属性描述符对象有4个属性：

* configurable：可配置性，控制着其描述的属性的修改，表示能否修改属性的特性，能否把属性修改为访问器属性，或者能否通过delete删除属性从而重新定义属性。默认值为true。
* enumerable：可枚举性，表示能否通过for-in遍历得到属性。默认值为true。
* writable：可写性，表示能否修改属性的值。默认值为true。
* value：数据属性，表示属性的值。默认值为undefined。

和两个存取器属性，分别是get和set，可以代替value和writable。

* get：在读取属性时调用的函数。只指定get则表示属性为只读属性。默认值为undefined。
* set：在写入属性时调用的函数。只指定set则表示属性为只写属性。默认值为undefined。

属性描述符只能在`Object.defineProperty`或`Object.defineProperties`中使用。

```js
var o = {}; // Creates a new object

// Example of an object property added with defineProperty with a data property descriptor
// 添加属性 a,值为37，并设置属性描述符
Object.defineProperty(o, 'a', {
  value: 37,
  writable: true,
  enumerable: true,
  configurable: true
});


var bValue = 38;
Object.defineProperty(o, 'b', {
  get: function() { return bValue; },
  set: function(newValue) { bValue = newValue; },
  enumerable: true,
  configurable: true
});
o.b; // 38
// o 对象中存在属性 b，他的值为38；
// 只要 o.b没有重新定义，它的值永远都是38

// 访问器不能和 value或者 writable混在一起用
Object.defineProperty(o, 'conflict', {
  value: 0x9f91102,
  get: function() { return 0xdeadbeef; }
});
// 抛出一个错误 Uncaught TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
```


### Object.defineProperties()

相比 Object.defineProperty， Object.defineProperties可以说是前者的升级版，可以一次同时定义多个属性，语法略有不同：

```js
let obj = {};
Object.defineProperties(obj, {
  "property1": {
    value: true,
    writable: true
  },
  "property2": {
    value: "Hello",
    writable: false
  },
  "property3": {
    get: function() {
      return 'Hello, Object.defineProperties';
    },
    set:function() {
      this.property2 = 'xxxxxx';
    }
  }
  // etc. etc.
});
```

参考资料：

1. [https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
2. [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
3. [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)
4. [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
5. [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
6. [http://stackoverflow.com/a/17952160](http://stackoverflow.com/a/17952160)