---
title: CSS 布局的未来：网格布局
date: 2015-11-22 14:39
categories: ['技术学习']
tags: ['CSS']
---

原文链接： [The future of layout with CSS: Grid Layouts](https://medium.com/@patrickbrosset/css-grid-layout-6c9cba6e8a5a#.cz5qhhi87)

<!--more-->

# The future of layout with CSS: Grid Layouts

在这片文章中，我们一起来探索 CSS 网格布局的美妙世界。网格布局是 W3C 规范中相对较新的部分，已经在浏览器中开始绽放属于自己的光芒。

在我们深入研究这项新鲜的 CSS 技术之前，让我们先快速的复习 grid 原理的相关知识。

## 网格布局的简短介绍

> 原作者的几句废话被我忽略了

本质上说，网格是一系列看不见的水平的和垂直的线，web 页面、杂志或者报纸上的各种设计片段和内容片段的都定位在这之上。

网格的目标就是充当各种内容块在页面上放置的基础来确保这些内容对齐，间隔均匀。网格即使看不见，也能形象化地为开发者提供一种驾驭内容的方式。

## So what has CSS got to do with it? 和 CSS 有什么关系？
CSS 有一系列新的属性，结合这些新的属性可以为你的 web 内容定义网格。这些属性在[CSS网格布局规范][2]中定义。

CSS 并非它那驾驭复杂布局的奇特能力而出名。虽然这在 CSS诞生之初已经不是问题了，但是现在它已经逐渐变得相当普通，各种各样的复杂布局已经无法轻松实施。

但是劳动人民的智慧是无穷的，创造性地使用浮动或者定位以及一系列各式各样的框架开支持缺少的特性。

所以，该到了CSS 拥有它特有的布局解决方案来支持现今的使用需求的时间了。

## Can I use it? 我能使用吗

Yes you can start using it today, but only Chrome has implemented the specification far enough to play with grids, and you need to turn the experimental Web Platform features flag on.
当然，现在就可以使用了。但是现在只有 Chrome 足够支持这一特性。需要开始试验性功能

IE has an early implementation (dating back to IE10) too but the spec has evolved since it was added and so it’s not entirely compatible with it anymore.
IE 之前有实现过这个功能，但是这个特性在后来修改过，导致在 IE 上不在兼容。

Firefox has started implementing it too so it shouldn’t be too long before you can use it in this browser.

Firefox 也开始实现支持这个特性，相信在不久的将来也能够在 Firefox 上使用网格布局。

Finally, a polyfill exists, so you have no excuses not to start experimenting (and I strongly encourage you do)!
另外，有一些第三方的补丁存在，可以很方便的支持这个特性。

## So what's a CSS Grid Layout? 那么什么是 CSS 网格布局？

它的本质你可以理解成，一系列的水平线和垂直线相互交叉，形成了一个个的小方格，页面上的内容按照这下方格井井有条的排列。乍看之下有点像透明的表格。

![][image-1]

上面的图中展现了一个网格中的块
* 行（lines）：在这个例子中，有四条垂直的线，三条水平的线。线条数从1开始计算。垂直的线从左往右排列，但是这一来内容文字书写的方向（writing direction，可以通过 CSS 改变默认的书写的方向）。线条可以指定对应的名称，以便帮助我们在 CSS 中准确的映射它们，这个在后面会讲到。
* 轨道（tracks）：轨道值得是两条平行线之间的空间。所以在上面的例子中，有三条垂直的轨道，两条水平的轨道。行的作用在于告诉内容的排列摆放从何处开始，到何处停止，而轨道的作用则是在根本上决定内容的位置。
* 单元格（cells）：单元格是两条相互垂直的轨道交叉的地方。在上面的例子中，只有一个cell 被高亮标注，其实在上面的网格中有6个 cell。
* 区域（areas）：区域指的是跨越任意数量 cell 的矩形区域。就像行一样，区域也是可以有名字的。在上面的网格中，我们可以示范性的定义三个区域：A，B和C，就像下面的图片中展现的一样:
  

![][image-2]

现在我们已经明白了一些基本的定义，接下来让我们看看究竟是什么使得网格系统如此的流弊。

**对于 CSS 网格布局来说，一个最重要的优点就是能够真正地将布局与标签分离。**

事实上，网格本身就是完全在 CSS 中定义的，也就是说除去应用网格系统的父标签以外，不需要使用任何其他的元素来定义行，列，单元格或者区域。

这的确是一个很有趣的属性。一方面，元素在视觉上的排列顺序与元素在标签上的顺序是不挂钩的。这一点很重要，它可以让你集中精力去优化你的标签提高可访问性而不用为了处理视觉上的结果而妥协。另一方面，标签将变得更加轻量也更容易理解，因此也更容易维护。

但是，更重要的是，它提供了一个非常有用的工具，用来将内容从布局中分离。在某种程度上有效的将它们解耦，使得在修改某一处的时候不会影响到其他的地方。
作为设计师，只需要修改一点点 CSS 就可以很轻松地试验这样新的布局。只要你的新布局能够提供内容预期需要使用的行和区域就行。
作为开发者，你仅仅只需要在网格中使用编号过的或者命名过的行和区域来定位你的内容。

想象一下如下图所示的网格布局：

![][image-3]

在这个布局中，命名的区域已经定义，允许内容根据区域的名字来定位。这意味只要我们维护好命名的区域，在未来就能相对轻松地调整布局，同时媒体查询也能够动态地调整布局。记住，整个布局都是在 CSS 中定义的，所以媒体查询也能够很好地工作。

例如，使用媒体查询，前面提到的布局可以在小屏幕中变成这个样子：

![media query][image-4]

原理讲的差不多了，让我们看看如果使用 CSS 定义网格布局。

## Creating gird with CSS

定义一个网格只需要一个 HTML 元素来制指定也就是包含网格的容器 - **gird container** 。网格布局将作用于这个元素。该元素下的子元素都是网格单元（gird item）。将一个元素设置为网格容器就像下面一样简单：

```css
.container{
  display: grid;
}
```

仅如此还是不够的，我们还需要定义网格的规格，行数和列数及其大小。使用下面给出的`grid-template`的例子，就可以轻松做到这些。

```css
.container{
  display: grid;
  grid-template-rows: 200px 100px;
  grid-template-columns: repeat(4, 100px);
}
```

在上面的例子中，我们明确的定义了一个两行四列的网格。使用repeat()方法是为了避免重复书写轨道（track）的代码。
网格也可以含蓄的定义行数。

```css
.container{
  display: grid;
  grid-template-row: auto;
  grid-template-columns: repeat(4, 100px);
}
```

这样一来，浏览器能够自动增加行数来适应内容。

现在回到我们之前的例子，我们明确定义了一个两行四列的网格，现在来添加一点内容。正如我们之前所说的，我们只需要两种元素：容器和内容

```html
<div class="container">
  <div class="item1">item 1</div>
  <div class="item2">item 2</div>
  <div class="item3">item 3</div>
  <div class="item4">item 4</div>
  <div class="item5">item 5</div>
</div>
```

没有特殊的CSS代码来定位这些内容，就能够得到下面的布局

![][image-5]

我们并没有定义这些内容摆放的位置，浏览器自动把它们一个个放置的单元格中，一行满了就从下一行开始。该规范定义了一个算法，自动放置在网格上的items，如果他们没有得到一个位置的时候，比如，你有很多 items 或者items 的数目是动态的，有时候你不想或者无法全部逐个定义它们的位置。

让我们看看 item 如何在网格中定位：

```js
.item1 {
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: 3;
}
.item2 {
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 3;
  grid-column-end: 5;
}
```

在这里我们提前定义了前两个 item 的位置，这意味着其他的将会被浏览器自动定位，就像下面这样：

![][image-6]

上面的例子使用了 **基于行的放置（line-based placement）**，使用列的数组索引来放置 itmes。
item1和 item2被放置在水平的line1 和 line2中，垂直的line1，line3和 line3，line5中。

如果我们持续增加 item 的数量，会发生什么呢？但是我们并没有定义多余的网格来容纳它们。

![][image-7]

网格不断根据需要添加的行和列。需要注意的是，这些新的轨道的大小依赖于内容的大小。到目前为止这一切都很好，但是在涉及到 CSS 网格的时候，真正有用的是我们之前看到的网格区域。接下来让我们看看如何在CSS中使用网格区域。

首先你需要定义网格的容器，轨道和面积。

```css
.container {
  display: grid;
  grid-template-rows: 100px auto 100px;
  grid-template-columns: 100px auto;
  grid-template-areas:
    "header  header"
    "sidebar content"
    "footer  footer";
}
```

我们定义了三行两列，顶部和底部的每一行高度设置为100px，中间部分高度自适应它的内容。左边一列的宽度设置为100px，第二列的宽度自适应它的内容。

> 真的是翻不下去了，这个歪果仁好多废话。。。

用ascii来表示：

```bash
+---+---+
| . | . |
+---+---+
| . | . |
+---+---+
| . | . |
+---+---+
```

每一个点代表一个单元格，这些单元格可以定义区域。让我们针对一个典型的网站布局来定义网格区域。

```bash
+--------+--------+
| header | header |
+--------+--------+
| sidebar| content|
+--------+--------+
| footer | footer |
+--------+--------+
```

我们想让 header 和 footer 横跨占据整个宽度，所以在两列中重复定义了它们。现在，如果我们将多余的 ascii风格的边框去掉，用双引号把每一行包起来，可以得到下面这样的：

```bash
"header  header"
"sidebar content"
"footer  footer"
```

这就是如何在 CSS中使用grid-template-areas定义网格区域。你可以使用`.`来表示特定单元格不被包含在区域中。

```bash
.container {
  display: grid;
  grid-template-rows: repeat(5, 100px);
  grid-template-columns: repeat(5, 100px);
  grid-template-areas:
    ". . . . ."
    ". . . . ."
    ". . a . ."
    ". . . . ."
    ". . . . .";
}
```

在这个例子中，一共有25个单元格和一个只占据了最中间单元格的区域。

现在回到之前的 header，sidebar，content，footer 的例子，让我们来增加一些标签：

```html
<div class="container">
  <div class="header">header</div>
  <div class="sidebar">sidebar</div>
  <div class="footer">footer</div>
  <div class="content">
    <p>Lorem ipsum dolor sit amet...</p>
 </div>
</div>
```

最后需要做的事情就是将每个网格项目定位到正确地命名的区域中（为了方便，我们使用了和区域名相同的 CSS类名）；

```css
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }
.content { grid-area: content; }
```

这会形成像下面这样的布局：

![][image-8]

如果我们想修改布局或者让布局自适应屏幕的尺寸，我们只需要修改网格的申明，比如这样：

```css
.container {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 100%;
  grid-template-areas:
    "header"
    "sidebar"
    "content"
    "footer";
}
```

没有修改其他任何的 CSS和标签，就能够得到下面这样的布局：

![][image-9]


> 后续的内容将的是 dribbble 对这个属性的实际应用，大家可以移步原文链接阅读




[1]:	https://medium.com/@patrickbrosset/css-grid-layout-6c9cba6e8a5a#.cz5qhhi87 "CSS"
[2]:	http://dev.w3.org/csswg/css-grid-1/

[image-1]:	./images/1_zcOcwuBtMoBaUfHHAJPNyg.png
[image-2]:	./images/1_LyY-gAwN4xdr8FmReEdMMw.png
[image-3]:	./images/1_oB_sweiQByIMdVPXGZrw4Q.png
[image-4]:	./images/1_xr308r1kDYPKpkzVdYDglQ.png
[image-5]:  ./images/1_jKRGeZkE48QTInEV5Tkg5g.png
[image-6]:  ./images/1_T9K3kTj703RsKij1Aa4d-Q.png
[image-7]:  ./images/1_iqlMwj0VrgJQtZfGf8boaA.png
[image-8]:  ./images/1_3mqdeWGgegfStF9MZ9w0Bw.png
[image-9]:  ./images/1_9L3FlV6ttO-5ZLM3cZNp1A.png
