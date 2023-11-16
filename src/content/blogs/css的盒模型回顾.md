---
title: CSS的盒模型-过去和将来  
date: 2014-10-05 14:30:00  
categories: ['前端'] 
tags: ["CSS", "笔记"]  

---

>CSS 诞生已经二十年了，我接触 CSS 才两年。不说多么的精通，但是自信对基本的常用的 CSS 很熟悉。然而，一直往前赶却忽略了事情的本质。昨天有人问我盒模型，我顿时傻了，但是强作镇定稍微解释了一下，然后甩了几个链接要他自己看。我那个心虚啊……实战起来没有问题，但是却没办法说出个所以然，这其实就是知识的漏洞。这些漏洞往往致命啊，如果面试的时候答不出来，就over了。


## W3C规范

一般来说，页面中的每一个元素都会形成一个矩形盒子，渲染引擎根据给定的样式确定这个盒子的呈现。通俗的来说，页面的布局就是一个个盒子的排列和摆放。掌握了盒子呈现的本质，布局也就轻而易举。

在 W3C 规范中定义了标准的盒模型：

> Each box has a content area (e.g., text, an image, etc.) and optional surrounding padding, border, and margin areas; the size of each area is specified by properties defined below. The following diagram shows how these areas relate and the terminology used to refer to pieces of margin, border, and padding
    
每一个盒子都有一个内容区域（比如：文本，图片.etc）和可选的环绕着内容的内边距（padding），边框（border），外边距（margin）。盒子的大小有这些属性定义。下面这张图很直观的说明了这一点

![W3CR](http://www.w3.org/TR/CSS2/images/boxdim.png)  

使用 firebug 或者 Chrome 的开发者工具，可以酱紫：

<!--![firefox](http://ncuey-crispelite.stor.sinaapp.com/2014-10-12_0946.png) -->

<!--![Chrome](http://ncuey-crispelite.stor.sinaapp.com/2014-10-12_0948.png) -->

在CSS中定义的宽和高，其实都是内容区域的宽和高，padding，border 和 margin 被排除在盒子尺寸之外。

所以对于一个定义了宽度的盒子来说，其尺寸的计算方式：

    实际宽度 = margin(left+right) + border(left+right) + padding(left+right) + width(定义的值)
    
    实际高度 = margin(top+bottom) + border(top+bottom) + padding(top+bottom) + height(定义的值)
    
可以利用margin调整两个元素之间的距离，用padding调整内容与元素边框之间的距离（留白）。这是标准的盒模型

## IE6 中的盒模型

那么问题来了，当元素定义了一个固定的宽度（高度）值后，如果修改padding，元素在页面上所占的宽度（高度）也会随着padding的值的变化而变化。同理，当你想调整内容与边框之间的距离而修改了padding后，为了保持元素在页面上所占的宽度（高度）固定，还需要修改定义的内容的宽度。如此的麻烦。

再举个例子，日常生活中的盒子，当我们定义它的大小时，绝对不会使用盒子中存放的物品的尺寸来定义盒子的大小。对于这个盒子来说，外围的挡板可以看成border，防止物品破损的填充物可以看成padding，在现实中，当我们说一个盒子有多大时，指的就是它的实际大小，也就是 `“border+padding+contentWidth”`。这种设定似乎是更贴合实际也更容易理解和接受。

在IE的quirks模式下，其盒模型的解释正是如此。

## box-sizing
不过在新的 CSS3 中，推出了一个新的属性 `box-sizing` 。有两个可选值，一个是默认的 content-box 一个是 border-box，选用后者，盒子模型将按 IE6 的方式进行处理

##margin的重叠

> 就参照标准的文档，结合自己的理解稍微翻译了一下，有些名词还是用英文描述比较合适。文档地址：[点这里](http://www.w3.org/TR/CSS21/box.html#margin-properties)



在CSS中，两个或者更多的盒子的毗邻的外边距会重叠在一起，形成一个单一的外边距。外边距的这种组合方式我们称之为“坍塌”，最后形成的外边距我们称之为“坍塌的外边距（collapse margin）”。

垂直方向上的外边距的坍塌，除了：

1. 根元素的盒子（the root elements's box）的外边距永远不会坍塌。当你为 `html` 标签加上 `margin` 时，无论有无毗邻的外边距，这个margin的都不会坍塌，是多少就多少。
2. 如果一个拥有了“空隙”（[clearance](http://www.w3.org/TR/CSS21/visuren.html#clearance)）的元素上下外边距毗邻，它的外边距将会与后面的兄弟元素的相邻外边距发生坍塌，但是发生坍塌后形成的外边距不会与父盒子的底外边


水平方向的外边距永远不会坍塌。

什么情况下两个外边距才算是毗邻（adjoining）呢？有且只有在下面的情况中：

1. 同一个块级格式化上下文（block formatting context）中未脱离正常流（in-flow）中的块级盒子的外边距；
2. 两个外边距之间不存在 line box（不包括高度确定无疑为零的 line box），没有 [clearance](http://www.w3.org/TR/CSS21/visuren.html#clearance)，外边距和边框；
3. 垂直相邻的的盒子之间的外边距，可以下面的任一种情况：
     元素的 `margin-top` 与其第一个正常流（in-flow）的子元素的 `margin-top` ；
     元素的 `margin-top` 与其第一个正常流的子元素的 `margin-top` ;
     height为auto的元素的 `margin-bottom` 与其最后一个正常流的子元素的 `margin-bottom` ;
     高度为0并且最小高度也为0，不包含正常流的子元素，并且自身没有建立新的BFC的元素的 `margin-top` 和 `margin-bottom` ;


形成坍塌的外边距的元素可以使非相邻元素或者祖先元素。

上面说到的也就意味着：

* 一个浮动的盒子与其他的盒子不会发生外边距坍塌，即使是浮动盒子和它内部的正常流中的孩子们；
* 自身建立了新的BFC的元素的外边距不会与它的处于正常流的孩子们的外边距重叠；
* inline-block 盒子的外边距不会坍塌，即使是它内部的正常流中的孩子们；
* 一个正常流元素的 `margin-bottom` 与它下一个正常流的兄弟元素的 `margin-top` 会产生折叠，除非它们之间存在间隙（clearance）。
* 一个正常流元素的 `margin-top` 与其第一个正常流的子元素的 `margin-top` 产生折叠，条件为父元素不包含 `padding` 和 `border` ，子元素不包含 clearance。
* 一个 'height' 为 'auto' 并且 'min-height' 为 '0'的正常流元素的 `margin-bottom` 会与其最后一个正常流子元素的 `margin-bottom` 折叠，条件为父元素不包含 `padding` 和 `border` ，子元素的 `margin-bottom` 不与包含 clearance 的 `margin-top` 折叠。
* 一个不包含 `border-top`、`border-bottom`、`padding-top`、`padding-bottom`的正常流元素，并且其 'height' 为 0 或 'auto'， 'min-height' 为 '0'，其里面也不包含行盒(line box)，其自身的 `margin-top` 和 `margin-bottom` 会折叠。

在 W3CPlus 的[这篇文章](http://www.w3cplus.com/css/understanding-bfc-and-margin-collapse.html)中，有详细的分析，不懂的话可以看[这里](http://www.w3cplus.com/css/understanding-bfc-and-margin-collapse.html)

参考：  
[box model (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/box_model)  
[The CSS Box Model](http://css-tricks.com/the-css-box-model/)  
[IE盒模型缺陷](http://zh.wikipedia.org/wiki/IE%E7%9B%92%E6%A8%A1%E5%9E%8B%E7%BC%BA%E9%99%B7)  
[box model](http://www.w3.org/TR/CSS2/box.html#box-dimensions)
[W3CPlus](http://www.w3cplus.com/css/understanding-bfc-and-margin-collapse.html)  
[margin-prototypies](http://www.w3.org/TR/CSS21/box.html#margin-properties)  

