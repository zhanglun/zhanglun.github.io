---
title: 规范之路-visual formatting model 概述
categories: ['重构']
date: 2014-08-21 20:39:00
tags: [CSS, 笔记]
---

## [视觉格式化模型](http://www.w3.org/TR/CSS21/visuren.html)

CSS 视觉格式化模型（visual formatting model）是一种用来处理文档，将其呈现在可视化媒体中的算法。这是 CSS 中的一个最基本的概念。可视化格式模型会转化文档中的每一个元素，并且形成零个，一个或者多个符合CSS盒模型规范的盒子（boxes）。每个盒子的布局由下面的内容来控制：

* 盒子的尺寸：精确定义，或者被限制，或者都没有；
* 盒子的类型：inline，inline-level，atomic inline-level，block box；
* 定位方式：普通文档流，浮动或者绝对定位；
* DOM树中的其他元素：它的子元素和相邻元素；
* 视口的大小和位置；
* 包含的图像的固定尺寸（因为盒子包裹着图片，图片有大小，从而影响了盒子的大小）；
* 其他的外部信息（？？？）

总的来说，VFM 决定了用户代理（浏览器）在视觉媒体（visual media）如何处理 DOM 树。

### containing block

在 CSS2.1 中定义了 “containing block”。一些盒子的大小和位置是相对于一个矩形盒子计算的，这个矩形的盒子，就是 `containing block` 。

一个盒子相对于它的包含块(containing block) 的边界来渲染。一般来说，生成的盒子会表现得像一个 `containing block` （就像它爹一样），它内部的盒子相对于它的边界来渲染。这就是所谓的：盒子为它的后代元素建立包含块。而我们说的”一个盒子的包含块“指的是这个盒子赖以生存的包含块，而不是盒子生成的包含块。注意盒子并不受它的包含块的限制，当它的布局跑到包含块的外面时称为溢出(overflow)。

关于 containing block 具体的细节 [link](http://www.w3.org/TR/CSS21/visudet.html#containing-block-details)，暂时先放一边，稍后在整理。现在只是按照 W3C 的文档顺序集合其他资料做一个整理。

### 盒子的生成（Box generation）

CSS 视觉格式化模型的一部分工作就是从文档（document）生成盒子。一个盒子的类型在一定程度上会影响它在 VFM 中的表现。一般元素都有一个默认的盒子类型，可以通过 CSS 的 display 属性修改。

#### 块级元素和块级盒子（block-level element and block boxes）

块级元素（block-level element）就是那些在 document 中在视觉上被渲染成块的元素，比如<\p>。当元素的 CSS 属性  display 为 block, list-item 或 table 时，它是块级元素(block-level)，被块级化。

每一个块级元素（block-level element）生成一个主块级盒子（principal block-level box）。主块级盒子包含后代元素生成的盒子以及生成的内容，它可以采用任意一种[定位方案（positioning schemes）](#positioning-schemes)。有的块级元素会生成除了主块级盒子之外额外的盒子：比如 "list-item" 元素，会生成额外的盒子来放置项目符号

<!-- ![li](http://ncuey-crispelite.stor.sinaapp.com/QQ20140816.png) -->

不过多数元素只生成一个主要块级盒。 每个块级盒子都会涉及到一个 [块级格式化上下文（block formatting context）](#block-formatting-context)。

除了表格盒子（table box，表格元素形成的盒子）和被替换的元素，一个块级盒子同时也是一个块容器盒子（block container box），一个块容器盒子只能包含块级盒子或者生成一个行内格式化上下文（inline formatting context），这个时候块容器盒子只能包含行级盒子（inline-level block）。

总是感觉上面的话很绕，说直白一点其实就是这么回事：

>一个用来装酒的瓶子，我们自然只会用它来装酒，但是如果在这个瓶子里面装了水，你还会把酒装进去嘛？

并不是所有的块容器盒子都是块级盒子：非替换的行内块和非替换的表格单元是块容器（可以理解成它们可以作为一个容纳新的块级盒子的容器），但是它们本身不是块级盒子。而块盒子（block boxes ）则是是块级盒子（block-level boxes）和块容器(block container)的交集。


#### 还有一个叫”匿名块盒“(Anonymous block boxes)的东西

有一种盒子叫”匿名块盒子“，比如说下面的代码中：

```html
<div>
    hello,
    <p>world!</p>
</div>
```

div 中同时出现了行内内容和块级内容，为了更加方便的定义格式，我们假定在文本 “hello,”外部包裹着一个匿名的块级盒子（anonymous block）。 换句话说，如果一个块级容器盒子（就是一个用来容纳块级盒子的大盒子）中只要包含任何一个块级盒子，我们就认为它只包含块级盒子。
对于匿名盒子还要注意的是，和 <\p> 元素不同, 开发者不能控制这个匿名盒子。对于可继承属性， 它们将取 <\div> 的属性值, 比如 color。对于非继承属性，值为初始值 ，比如没有指定 background-color, 值为初始值即 transparent，于是 <\div> 背景可见。而 <\p> 可以指定 background-color 。类似的，这个匿名盒文本是一样的颜色。

另外一种创建匿名块盒子的情况是：当一个行内盒包含了一个或几个块盒时，包含块盒的盒将拆分为两个行内盒放置于块盒前后，然后分别由两个匿名块盒包含。这样块盒就与两个包含行内元素的匿名块盒形成了兄弟关系。如果行内盒包含多个块盒，并且这些块盒之间没有夹杂内容，将在这些块盒前后创建匿名块盒。

```css
.two p {
  display: inline；
}
.two span {
  display: block；
}
```

```html
<h2>块盒包含行内盒子</h2>
<div class="one">
    <P>This is anonymous text before the SPAN.
        <span>This is the content of SPAN.</span>This is anonymous text after the SPAN.
    </P>
</div>
<h2>一个行内盒包含了一个或几个块盒</h2>
<div class="two">
    <P>This is anonymous text before the SPAN.
    <span>This is the content of SPAN.</span>This is anonymous text after the SPAN.
    </P>
</div>
```

<!-- ![image](http://ncuey.sinaapp.com/blog_files/images/2014-08-21_230945.png) -->

前面说到的，匿名盒子无法被选中，但是会继承离他最近的非匿名盒子的样式。在触发匿名盒子形成的元素上添加的属性也会应用在元素的盒子和内容中，比如上面的例子，p元素师导致匿名盒子形成的元素，如果给它加上border，border也会应用的它形成的匿名盒子上

<!-- ![image](http://ncuey.sinaapp.com/blog_files/images/2014-08-21_232806.png) -->


撸的好累，这一篇小小文章都搞了几天，现在已经快十二点了，要睡觉了。之后还需要把定位和浮动好好复习一下。


