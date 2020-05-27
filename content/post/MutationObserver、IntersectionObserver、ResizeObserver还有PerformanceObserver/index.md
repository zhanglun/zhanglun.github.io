---
title: "IntersectionObserver、MutationObserver、ResizeObserver还有PerformanceObserver"
date: 2019-07-13T22:31:06+08:00
draft: true
---

在之前的[从getboundingclientrect到intersection-observer](../从getboundingclientrect到intersection-observer/index.md)中提到了`Intersection Observer API`，今天趁热打铁，将现有的其他几个Observer API 一并整理，方便查阅

## IntersectionObserver

字面翻译：交叉的观察者。即观察两个元素之间的交叉情况

Web的传统位置计算机制依赖于显式查询DOM的状态。 其中一些会导致样式重新计算和布局(比如前文提到的`offsetHeight`, `offsetWidth` 和 `getBoundingClientRect()`)，并且经常需要JavaScript脚本需要轮询此信息，因此经常会让浏览器触发多余的重新计算和布局。在实际工作中，追踪或者判断DOM是否出现在客户端视图窗口中是一个很常见的操作。比如图片懒加载，滚动时元素进入的动画等等。一般来说可以通过监听滚动事件，使用`getBoundingClientRect()`来计算元素的位置。但正如前文所言，这存在性能问题。
`Intersection Observer API` 就是为这而[设计](https://github.com/w3c/IntersectionObserver/blob/master/explainer.md)的，显着降低其CPU，GPU和能源消耗。

### 创建一个 IntersectionObserver

IntersectionObserver 的 API 非常简洁

```js
const observer = new IntersectionObserver(changes => {
  for (const change of changes) {
    console.log(change)
  }
}, {});

// 观察目标元素的可见性变化
observer.observe(target);

// 停止对一个元素的观察
observer.unobserve(target);

// 停止对所有目标元素可见性变化的观察
observer.disconnect();
```

####  **Intersection observer options**

传递到IntersectionObserver()构造函数的 options 对象包含以下字段：

* **root**
  - 指定根(root)元素，用于检查目标的可见性。必须是目标元素的父级元素。
  - 如果未指定或者为null，则默认为浏览器视窗。
* **rootMargin**  
  - 根元素的外边距。类似于css中的 margin 属性，比如 "10px 20px 30px 40px" (top, right, bottom, left)。
  - 如果有指定root参数，则rootMargin也可以使用百分比来取值。该属性值是用作root元素和target发生交集时候的计算交集的区域范围，使用该属性可以控制root元素每一边的收缩或者扩张。
  - 默认值为0。
* **threshold**
  - 可以是一个数字也可以是一个数字数组。目标元素和根元素相交程度达到该值的时候IntersectionObserver注册的回调函数将会被执行。
  - 如果你只是想要探测当target元素的在root元素中的可见性超过50%的时候，你可以指定该属性值为0.5。
  - 如果你想要target元素在root元素的可见程度每多25%就执行一次回调，那么你可以指定一个数组[0, 0.25, 0.5, 0.75, 1]。
  - 默认值是0(意味着只要有一个target像素出现在root元素中，回调函数将会被执行)。
  - 该值为1.0含义是当target完全出现在root元素中时候 回调才会被执行。

**注意：**

1. 如果使用默认的`options`，目标元素部分进入视图窗口和完全离开视图窗口时，都会触发一次回调函数
2. 如果你想同时观察多个元素，尽可能地在一个`IntersectionObserver`的实例上调用多次`observer`方法

#### **callback**

回调接收 IntersectionObserverEntry 对象和观察者的列表：

```ts
var callback = function(entries: IntersectionObserverEntry[], observer: IntersectionObserver) { 
  entries.forEach(entry => {
    // Each entry describes an intersection change for one observed
    // target element:
    //   entry.boundingClientRect
    //   entry.intersectionRatio
    //   entry.intersectionRect
    //   entry.isIntersecting
    //   entry.rootBounds
    //   entry.target
    //   entry.time
  });
};
```

`entries`是一个数组，和`threshold`对应。即使`threshold`输入的是一个数字，`entries`也会返回数组。下图是`IntersectionObserverEntry`的结构

![intersection-observer-api.png](./images/intersection-observer-api.png)

下图可以清晰的看出`intersectionRadio`的意义

![intersectratio.png](./images/intersectratio.png)

`IntersectionObservers` 是异步传递数据，回调函数中的代码将在主线程中运行。 规范中提到`IntersectionObserver`实现应使用`requestIdleCallback（）`。 这意味着对回调函数的执行是低优先级的，将在客户端空闲时间进行。 这是有意为之。

### 常用场景

#### 元素的可见性监听

```html
<!-- 网页中嵌入的广告 -->
<iframe id="theAd"></iframe>
<!-- 嵌入的脚本 -->
<script src="//cdn.example.com/ads.js" async></script>
```

```js
// ads.js

// 上报信息
function logImpressionToServer() { /* ... */ }

// 判断是否可见
function isVisible(boundingClientRect, intersectionRect) {
  return ((intersectionRect.width * intersectionRect.height) /
          (boundingClientRect.width * boundingClientRect.height) >= 0.5);
}

function visibleTimerCallback(element, observer) {
  delete element.visibleTimeout;
  // Process any pending observations
  processChanges(observer.takeRecords());
  if ('isVisible' in element) {
    delete element.isVisible;
    logImpressionToServer();
    observer.unobserve(element);
  }
}

// 交叉时的回调函数
function processChanges(changes) {
  changes.forEach(function(changeRecord) {
    var element = changeRecord.target;
    element.isVisible = isVisible(changeRecord.boundingClientRect, changeRecord.intersectionRect);
    if ('isVisible' in element) {
      // 显示
      element.visibleTimeout = setTimeout(visibleTimerCallback, 1000, element, observer);
    } else {
      // 隐藏
      if ('visibleTimeout' in element) {
        clearTimeout(element.visibleTimeout);
        delete element.visibleTimeout;
      }
    }
  });
}

var observer = new IntersectionObserver(
  processChanges,
  { threshold: [0.5] } 
);

var theAd = document.querySelector('#theAd');
observer.observe(theAd);
```

乍看之下好像需要编写更多复杂代码，但是对比传统的方式，这种方式有其优点

1. 无需监听scroll事件
2. 没有频繁的同步计算布局，没有插件依赖，只使用了一个定时器来记录状态

#### 数据滚动

许多系统使用数据绑定列表来管理其视图内内容，通过回收DOM的方式保持内存和布局效率。

## MutationObserver

## ResizeObserver

## PerformanceObserver





## 参考

1. [IntersectionObserver’s Coming into View](https://developers.google.com/web/updates/2016/04/intersectionobserver)
2. 