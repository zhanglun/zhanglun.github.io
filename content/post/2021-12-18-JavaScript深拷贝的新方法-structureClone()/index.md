---
title: "JavaScript 深拷贝的新方法 structureClone()"
date: 2021-12-18T14:04:47+08:00
draft: false
categories:
  - 技术研究
---

对象拷贝这个话题算是老生常谈了，从浅拷贝到深拷贝，从最简单的JSON.stringfy()到递归遍历赋值，作为面试八股文的常客，字节的朋友甚至写出了[惊艳面试官的深拷贝](https://juejin.cn/post/6844903929705136141)，不得不佩服。

通常在项目开发中，遇到深拷贝的场景，一般有多种处理方式：

1. 使用其他第三方库
2. 使用有前人“沉淀”的类库
3. 自己再“实现”一次

现在可以使用一个内置的方法来解决深拷贝的问题，它就是今天的主角：structuredClone()。在本文发布时，各浏览器的nightly版本中已经实现了这个API，在Firefox 94的版本中甚至已经是稳定状态了。Node 在v17的版本中[实现了这个API](https://github.com/nodejs/node/pull/39759)，可以直接使用了。让我们对它进行一些些简单的探索。

在讨论JavaScript中的对象的拷贝问题时，通常是从浅拷贝和深拷贝两个角度来讨论。

## 浅拷贝

对于基本类型来说，拷贝就是复制对应的值，在内存中新开辟一块地址保存这个值。而引用类型的浅拷贝则是复制其内存地址。如果被拷贝对象的属性中有其他引用类型，当拷贝后的对象对内部的引用类型发生变化之后，原始对象也会受到影响。我们使用解构来举个简单的例子：

```tsx
const myOriginal = {
  someProp: "with a string value",
  anotherProp: {
    withAnotherProp: 1,
    andAnotherProp: true
  }
};

const myShallowCopy = {...myOriginal};
```

修改或者添加拷贝结果的属性时，原对象不受影响。

```tsx
myShallowCopy.aNewProp = "a new value";
console.log(myOriginal.aNewProp)
// ^  `undefined`
```

但是，添加或者修改内部嵌套的属性时，两个对象会同步修改。

```tsx
myShallowCopy.anotherProp.aNewProp = "a new value";
console.log(myOriginal.anotherProp.aNewProp) 
// ^ logs `a new value`
```

## 深拷贝

深拷贝的逻辑是将一个对象的属性逐一复制，当属性的值是一个对象时，创建一个新的对象，重复复制的过程，直到属性值为基本类型。需要所有的对象最终都的内存地址都是全新的。

在不使用类库的情况下，使用 JSON API 可以快速实现深拷贝：

```tsx
const myDeepCopy = JSON.parse(JSON.stringify(myOriginal));
```

这个方法简单易用，而且V8针对 JSON.parse()做过优化，尽可能提高JSON.parse()的执行效率。但是它也有一些局限性：

1. **无法处理循环引用**：当对象存在循环引用时，JSON.stringify()会抛出错误
2. **不支持一些内置的类型**：如果属性中包含一些内置的对象类型，JSON.stringify()执行时，会去掉一些属性值，最后输出的是"{}"字符串，比如： Map, Set, Date, RegExp 等
3. **丢弃函数:** 如果属性值是一个函数，JSON.stringify 会直接抛弃这个属性

在 structuredClone 出现之前，JSON API 似乎是唯一一个解决深拷贝问题的API, 虽然不太完美。

## StructuredClone

在HTML Sepc 中通过了[StructuredClone()](https://html.spec.whatwg.org/multipage/structured-data.html#dom-structuredclone)的提案，帮助我们在一些场景中方便的复制结构化对象。用法非常简单，很轻松地就能解决深拷贝的问题。在内部实现中，通过维护一个记录引用访问状态的Map来实现对循环引用的支持。

```tsx
const myDeepCopy = structuredClone(myOriginal);
```

还支持第二个参数： transfter，这个参数是可选的，可以将被复制对象中的ArrayBuffer等可转换的对象转移到新的对象中，而不是复制一份，比如：

```tsx
var uInt8Array = new Uint8Array(1024 * 1024 * 16); // 16MB
for (var i = 0; i < uInt8Array.length; ++i) {
  uInt8Array[i] = i;
}

const transferred = structuredClone(uInt8Array, { transfer: [uInt8Array.buffer] });

console.log(uInt8Array.byteLength);  // 0
console.log(transferred.byteLength); // 16MB
```

在复制时，将 uInt8Array 的 buffer 对象转移到 transferred 中。

除了我们显示的调用这个API之外，它也经常在内部被其他的API调用。比如使用IndexedDB存储数据时，通过postMessage在Worker之间传递消息或者执行其他一些涉及到复制对象相关的API。

相比JSON API，在深拷贝这件事情上，structuredClone有一些优势，比如支持循环引用，对数据类型的支持能力更加健壮，甚至执行效率上又有一些优势。但是structuredClone本身亦有一些限制：

1. 函数不能复制，抛出`DataCloneError`的错误类型
2. DOM 节点不能复制，抛出`DataCloneError`的错误类型
3. 其他明确不会保留的属性：
    1. RegExp中的lastIndex不会被保留
    2. 属性描述符，setter, getter 等其他类似的特性不会复制。如果一个对象通过属性描述符标记为只读，复制之后将会变成可读可写，因为可读可写是默认值
    3. 原型链不会被遍历，也不会被复制

如果这些限制不影响你的使用，structuredClone将会是一个不错的选择。反之你也可以继续使用第三方库来解决深拷贝的问题。

## 参考

1. [https://web.dev/structured-clone/](https://web.dev/structured-clone/)
2. [https://developer.mozilla.org/en-US/docs/Web/API/structuredClone#browser_compatibility](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone#browser_compatibility)
3. [https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#see_also](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#see_also)