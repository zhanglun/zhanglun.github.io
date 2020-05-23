---
title: 踩坑日记-IE中的 hasLayout 属性
date: 2014-08-12 13:26:00
tags: [CSS, 笔记, 兼容性, 填坑日记]

---

原文链接：[http://www.sitepoint.com/web-foundations/internet-explorer-haslayout-property/](http://www.sitepoint.com/web-foundations/internet-explorer-haslayout-property/)

在理想的世界中中，我们真的不需要了解任何关于 `hasLayout` 的事情，就像在理想社会中不用担心自己没钱一样。因为 `hasLayout` 是IE 渲染引擎的提供的内部组建或者说是 IE 的一个私有的属性，看不见也摸不着。

##hasLayout 是何方神圣

###为什么会出现一个叫 `hasLayout` 的家伙？

> 来源：[http://haslayout.net/haslayout](http://haslayout.net/haslayout)
> 
>MSIE has quite dated rendering engine (not surprising, as IE is based on Mosaic). In old tabular times, almost any element (except inline content) was a box. There was no way for content to leak from containing table cell, or for table cell to leak out of table..

>  微软的老旧IE（应该指的是IE8以下的版本，在IE8的标准模式中已经将 hasLayout 移除了）使用的是过时的渲染引擎。在使用表格进行布局的旧社会，除了inline元素，几乎所有的元素都是像一个个盒子一样呈现。内容无法从表格的单元格中泄漏出去，单元格也不会溢出到表格外面。

>  Many years have passed, and Microsoft began adapting archaic Trident engine to make use of CSS. However, CSS changes the fundamental assumption that old engine was based on - the one that "anything significant" is a rectangle that contains all its content. CSS allows content to overflow out of container. This may happen when content is floated, or if content is too tall/wide to fit inside constrained box.
> 
> 时光飞逝啊，很多年过去了。微软开始改造古老的 Trident 引擎让浏览器能够使用 CSS。但是，出大事了！CSS 修改了老旧引擎作为基础的基本假设-“一个矩形包含了它的所有内容”。而新的 CSS 允许内容溢出容器。当内容浮动之后，或者内容太高/宽以至于不能适应被约束（定高/宽）的盒子中时，内容边会从容器中溢出。

所以啊，为了”追上潮流“，IE开发人员用了一种相当诡异的方式来修补他们古老的引擎，这就是 `hasLayout` 诞生的原因！但是，`hasLayout` 的作用远超过预期，对元素的呈现和其行为有重要的影响，它会影响到一个元素如何限定它的内容和于邻近的元素之间的相互作用。

在IE中，一个元素要么自己有能力计算调整和排列自身的内容，要么依赖父元素。为了兼顾这两种不同的概念，渲染引擎便使用这个叫做 `hasLayout` 的属性，属性值可以为 true 或 false 。当一个元素的 hasLayout 属性值为 true 时，我们就说这个元素拥有了一个布局（having a Layout）。

### “having a Layout” 意味着什么？

[微软MSDN 上的相关文档](http://msdn.microsoft.com/en-us/library/bb250481%28VS.85%29.aspx)上说了：

>In short, having a layout means that an element is responsible for sizing and positioning itself and possibly any child elements. (If a child element has its own layout, it sizes itself and its descendents, but the original layout positions the child.)
>
>简而言之，元素拥有布局意味着它自己计算调整和组织自身的内容包括没有出发 Layout 的子元素，
>
Some elements have a "fixed" size or otherwise have special sizing constraints. They always have layout—for example, buttons, images, inputs, selects, and marquee elements have always a native size even if width and height are not specified.

>有些元素有固定的大小或者有特殊的大小限制，它们总是默认 ”having a Layout“，比如：button，images，inputs等总是有一个与生俱来的大小，即使没有设置高和宽。

>Sometimes elements that do not normally require layout information, like a div or a span, may have properties specified that force a layout to be applied in order to support the property—for example, the element must have a layout in order to get scrollbars.
>
>有时候，元素无法正常的获得Layout，就像 div，span，它们应用一些特殊的属性可以触发元素的 hasLayout 借此来支持一些其他的属性。比如，元素必须触发 hasLayout 才能获得滚动条（scrollBars ）。

>Once a layout is applied the "hasLayout" flag is set. This property returns true if queried.
>
>hasLayout 一旦触发，它的值就是 ”true“。（而且是不可逆转的）


当一个元素拥有布局（having a Layout）之后，它就可以自己计算调整和组织自身的内容，同时元素的内容也能够溢出到容器之外，比如浮动的元素或者一个“很长很长的单词”（注意是英文单词）。相反地，如果没有布局，那只能依靠父元素来调整内容（只要是祖先元素就行，不一定非得是直接父元素）。


###为什么要关心这个东东

    A: 有个 Layout 很叼吗？
    B: 不，一点都不叼，而且土的掉渣。
    A: 那为什么我还要了解？
    B: 因为很多 IE 的 bug 都是因为它。你搞定了它，解决 bug 就更 easy！
    
大部分的 IE 显示错误，都可以通过出发元素的 haslayout 属性来修正。可以通过设置 css 尺寸属性(width/height)等来激发元素的 haslayout，使其“拥有布局”。

* display: inline-block
* height: (任何值除了auto)
* float: (left 或 right)
* position: absolute
* width: (任何值除了auto)
* writing-mode: tb-rl
* zoom: (除 normal 外任意值)

Internet Explorer 7 还有一些额外的属性(不完全列表):

* min-height: (任意值)
* max-height: (除 none 外任意值)
* min-width: (任意值)
* max-width: (除 none 外任意值)
* overflow: (除 visible 外任意值)
* overflow-x: (除 visible 外任意值)
* overflow-y: (除 visible 外任意值)
* position: fixed

声明上述任何CSS属性都会导致元素触发Layout，有些值对于一些元素来说是除了出发Layout不会有其他的作用，比如即使对一个inline元素设置了 `height:100px;` ，它的高度不会因此变成100px，它原本有多高它就是多高，但是在IE下却让它拥有了布局（having a Layout）。

触发所有元素的 Layout，是一个不好的主意，因为有些时候，意外的拥有布局会导致意外的bug。比如正常情况下，绝对定位和浮动的元素，他的大小会根据自身的内容大小收缩，like this：

![image](http://img3.tuchuang.org/uploads/2014/08/IC118706.gif)

但是如果在IE中，绝对定位和浮动的子元素触发了 Layout，将导致父元素大小不会收缩，就像这样：

![image](http://img1.picbed.org/uploads/2014/08/IC47393.gif)

更多例子可以看[这里](http://msdn.microsoft.com/en-us/library/bb250481.aspx)

###遇到 Layout 不用怕！

当网页在 IE 中有异常表现时，可以尝试触发相应元素的 Layout 来看看是不是问题所在。常用的方法是给该元素的 CSS 设定 zoom:1 。使用 zoom:1 是因为大多数情况下，它能在不影响现有环境的条件下激发元素的 Layout。而如果 bug 消失，那基本上就可以判断是 hasLayout 的原因。然后就可以通过设定相应的 css 属性来对这个问题进行修正了。

一般来说，首先要考虑的是设定元素的 width/height 属性，其次再考虑其他属性。

对 IE6 及更早版本来说，常用的方法被称为霍莉破解(Holly hack)，即设定这个元素的高度为 1% (height:1%;)。需要注意的是，当这个元素的 overflow 属性被设置为 visible 时，这个方法就失效了。或者使用 IE 的条件注释。一个元素拥有 Layout 之后，会确定一个新的 BFC（block formatting context），而 BFC 的形成条件是：

>[W3C:block-formatting](http://www.w3.org/TR/CSS2/visuren.html#block-formatting)
>Floats, absolutely positioned elements, block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes, and block boxes with 'overflow' other than 'visible' (except when that value has been propagated to the viewport) establish new block formatting contexts for their contents.
>
>浮动元素和绝对定位元素，非块级盒子的块级容器（例如 inline-blocks, table-cells, 和 table-captions），以及overflow值不为“visiable”的块级盒子，都会为他们的内容创建新的BFC（块级格式上下文）
>

所以当设定了 `overflow:visible;` 时，将导致元素无法创建一个 BFC，个人认为这里此处可能有所联系。

再来说一下IE7，对 IE7 来说，最好的方法时设置元素的最小高度为 0 (min-height:0;)。


关于 BFC，我觉得有必要好好看看，踩踩坑。日后在做一个笔记



参考资料：

* [The Internet Explorer hasLayout Property](http://www.sitepoint.com/web-foundations/internet-explorer-haslayout-property/)
* ["HasLayout" Overview](http://msdn.microsoft.com/en-us/library/bb250481.aspx)
* [haslayout综合](http://www.qianduan.net/comprehensive-haslayout.html)
