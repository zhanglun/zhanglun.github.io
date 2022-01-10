---
title: CSS元素居中对齐大法  
date: 2014-09-30 20:34:00  
categories: ['前端'] 
tags: ["译文","CSS","笔记"]

---

>原文标题：Centering in CSS: A Complete Guide  
 原文链接：[http://css-tricks.com/centering-css-complete-guide/](http://css-tricks.com/centering-css-complete-guide/)  


> 在CSS-tricks上看到一篇关于CSS居中的文章，综合和大部分的CSS居中的解决方案，暂且称作“CSS元素居中大法”好了。

大家一直在吐槽的很多，其中就有关于CSS元素居中的问题。为什么这个问题看起来这么难以处理。在我看来，并不是这个问题太难，而是有太多不同的解决方案，因此很难知道哪一个是合适自己的。

所以让我们来做一个决策树，希望能够让CSS的元素居中问题变得简单。

##水平方向居中

###inline 和 inline-* 元素的水平方向居中

你可以很轻松的将一个块级元素中的inline或者类inline元素居中：

	.center-children{
    	text-align:center;
    }
   
HTML:

    <header>
  		This text is centered.
    </header>
	<nav role='navigation'>
    	<a href="#0">One</a>
        <a href="#0">Two</a>
        <a href="#0">Three</a>
        <a href="#0">Four</a>
    </nav>

CSS:
    
    header, nav {
        text-align: center;
        background: white;
        margin: 20px 0;
		padding: 10px;
    }
    nav a {
        text-decoration: none;
        background: #333;
        border-radius: 5px;
        color: white;
        padding: 3px 8px;
    }
    
<!--![single-line-inline](http://ncuey-crispelite.stor.sinaapp.com/single-line-inline.png) -->

**注意：** 这个方法对inline, inline-block, inline-table, inline-flex元素都有效

###块级元素的水平方向居中

将一个定宽的块级元素的左外边距和右外边距设为`auto`，就是这么的easy  

HTML:

    <main>
        <div class="center">
        	I'm a block level element and am centered.
        </div>
    </main>

CSS:  

    body {
    	background: #f06d06;
    }
    main {
    	background: white;
        margin: 20px 0;
        padding: 10px;
    }
    .center {
        margin: 0 auto;
        width: 200px;
        background: black;
        padding: 20px;
        color: white;
    }

<!--![single-block](http://ncuey-crispelite.stor.sinaapp.com/single-block-center.png) -->

如果想让多个块级元素在同一行中水平居中时，最好的处理方式就是修改块级元素的 display 的属性值。一种方式是将display的值设置为`inline-block`，另一种是`flexbox`。

HTML：

    <main class="inline-block-center">
        <div>
       		I'm an element that is block-like with my siblings and we're centered in a row.
        </div>
        <div>
            I'm an element that is block-like with my siblings and we're centered in a row. I have more content in me than my siblings do.
        </div>
        <div>
        	I'm an element that is block-like with my siblings and we're centered in a row.
        </div>
    </main>

	<!--flexbox-->
   	<main class="flex-center">
        <div>
            I'm an element that is block-like with my siblings and we're centered in a row.
        </div>
        <div>
            I'm an element that is block-like with my siblings and we're centered in a row. I have more content in me than my siblings do.
        </div>
        <div>
            I'm an element that is block-like with my siblings and we're centered in a row.
        </div>
    </main>
    
CSS:

    body {
        background: #f06d06;
        font-size: 80%;
    }
    main {
        background: white;
        margin: 20px 0;
        padding: 10px;
    }
    main div {
        background: black;
        color: white;
        padding: 15px;
        max-width: 125px;
        margin: 5px;
    }
    .inline-block-center {
        text-align: center;
    }
    .inline-block-center div {
        display: inline-block;
        text-align: left;
    }
    .flex-center {
        display: flex;
        justify-content: center;
    }

<!--![multiple-block](http://ncuey-crispelite.stor.sinaapp.com/mulity-block-center.png) -->

##垂直方向居中

关于垂直方向上的居中，需要用到一下小trickers

###inline 和 inline-* 元素的垂直方向居中
####单行的内联元素垂直居中

最简单的一种，上内边距和下内边距相等：

HTML:

    <main>
        <a href="#0">We're</a>
        <a href="#0">Centered</a>
        <a href="#0">Bits of</a>
        <a href="#0">Text</a>
    </main>

CSS:

    main {
        background: white;
        margin: 20px 0;
        padding: 50px;
    }
    main a {
        background: black;
        color: white;
        padding: 40px 30px;
        text-decoration: none;
    }
    
<!--![v-single-line](http://ncuey-crispelite.stor.sinaapp.com/v-single-line.png) -->

因为某些原因不能使用这种简单粗暴的方法（这种方法也有其局限性），或者你想垂直居中没有元素包裹的文本的时候，利用`line-height`属性。将容器的`line-height`的值设置为与容器高度相同的值，就能很轻松的居中文本。

HTML:
	
    <main>
        <div>
            I'm a centered line.
        </div>
    </main>

CSS:

    main {
        background: white;
        margin: 20px 0;
        padding: 40px;
    }
    main div {
        background: black;
        color: white;
        height: 100px;
        line-height: 100px;
        padding: 20px;
        width: 50%;
        white-space: nowrap;
    }
    
<!--![line-height](http://ncuey-crispelite.stor.sinaapp.com/v-single-lineheight.png) -->

####多行的内联元素垂直居中

上下内边距相等的方法同样可以用在多行的处理上，但是就像前面所说的，这种方法有局限性。当元素是一个表格单元或者通过CSS的设置表现成一个单元格时，这种方法就不奏效了。在这种情况下，使用`vertical-align`属性来解决这个问题

HTML:

    <table>
        <tr>
        	<td>
            	I'm vertically centered multiple lines of text in a real table cell.
            </td>
        </tr>
    </table>
    <div class="center-table">
        <p>I'm vertically centered multiple lines of text in a CSS-created table layout.</p>
    </div>
    
CSS:

    body {
        background: #f06d06;
        font-size: 80%;
    }
    table {
        background: white;
        width: 240px;
        border-collapse: separate;
        margin: 20px;
        height: 250px;
    }
    table td {
        background: black;
        color: white;
        padding: 20px;
        border: 10px solid white;
        /* 单元格自带 vertical-align: middle; */
    }
    .center-table {
        display: table;
        height: 250px;
        background: white;
        width: 240px;
        margin: 20px;
    }
    .center-table p {
        display: table-cell; // 将p表现成一个单元格
        margin: 0;
        background: black;
        color: white;
        padding: 20px;
        border: 10px solid white;
        vertical-align: middle; // 添加单元格默认的属性
    }

<!--![nu-table-cell](http://ncuey-crispelite.stor.sinaapp.com/mu-table-cell.png) -->

如果不能使用“表格大法”，可以试试flexbox。一个flex-child在flex-parent中垂直居中松松的。

    .flex-center-vertically {
        display: flex;
        justify-content: center;
        flex-direction: column;
        height: 400px;
    }

完整的demo

HTML:

    <div class="flex-center">
    	<p>I'm vertically centered multiple lines of text in a flexbox container.</p>
    </div>

CSS:

    body {
        background: #f06d06;
        font-size: 80%;
    }
    div {
        background: white;
        width: 240px;
        margin: 20px;
    }
    .flex-center {
        background: black;
        color: white;
        border: 10px solid white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 200px;
    }
    .flex-center p {
        margin: 0;
        padding: 20px;
    }
   
<!--![mu-flex-center](http://ncuey-crispelite.stor.sinaapp.com/mu-flex-center.png) -->

flex-parent元素必须指定一个固定高度。

还有一种称之为“幽灵元素”的技术，可以在上述方法不适用的情况下使用。其实现原理是：在container容器中放置一个`height:100%`的伪元素，然后文本与这个伪元素垂直对齐。核心代码：

    .ghost-center {
    	position: relative;
    }
    .ghost-center::before {
        content: " ";
        display: inline-block;
        height: 100%;
        width: 1%;
        vertical-align: middle;
    }
    .ghost-center p {
        display: inline-block;
        vertical-align: middle;
    }
   
完整的demo：

HTML:

    <div class="ghost-center">
        <p>I'm vertically centered multiple lines of text in a container. Centered with a ghost pseudo element</p> 
        <p>I'm vertically centered multiple lines of text in a container. Centered with a ghost pseudo elementI'm vertically centered multiple lines of text in a container. Centered with a ghost pseudo elementI'm vertically centered multiple lines of text in a container. Centered with a ghost pseudo element</p>
    </div>

CSS:

    body {
        background: #f06d06;
        font-size: 80%;
    }
    div {
        background: white;
        height: 360px;
        margin: 20px;
        color: white;
        resize: vertical;
        overflow: auto;
        padding: 20px;
    }
    .ghost-center::before {
        content: "";
        display: inline-block;
        height: 100%;
        width: 10px; // 为了效果明显 设置了一个固定的宽度 增加了背景色
        background:red;
        vertical-align: middle;
    }
    .ghost-center p {
        display: inline-block;
        vertical-align: middle;
        width: 190px;
        margin: 0;
        padding: 20px;
        background: black;
    }

<!--![presudo-element-center](http://ncuey-crispelite.stor.sinaapp.com/presudo-element-center.png) -->

你可以试着修改伪元素的高度~~

####单个块级元素的垂直方向居中

在页面的布局中，其高度未知是很正常的，有很多原因。当宽度改变的时候，内容中的文本回流改变高度；变化的文本样式也可能改变高度；变化的文本数量也会改变高度；一些按比例放置的元素，比如图片，当它调整大小的时候，高度也会变化；等等。

如果知道元素的高度。可以使用定位来垂直居中：

    .parent {
		position: relative;
    }
    .child {
        position: absolute;
        top: 50%;
        height: 100px;
        margin-top: -50px; 
        // 这里实际上元素高度的一半，如果没有使用box-sizing:border-box;则需要计算padding和border
    }
    
如果不知道元素的高度，也有办法。先定位再平移

    .parent {
    	position: relative;
    }
    .child {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    
当top:50%时，元素的顶部与其包裹的容器高度一半的位置处对齐。利用transform在Y轴上平移时，默认情况下参考点是元素的正中心，向上平移50%的距离其实就是元素的高度一半。

<!--![](http://ncuey-crispelite.stor.sinaapp.com/2014-10-03_195015.png) -->

当然如果使用flexbox也是很简单，不必大惊小怪

    .parent {
        display: flex;
        flex-direction: column;
		justify-content: center;
    }

##水平方向和垂直方向同时居中

前面分开介绍了水平方向和垂直方向上CSS元素居中的解决方案。我们可以组合上面的方法，提出两个方向上同时居中对齐的解决方案。但是我发现一般来说可以分成三类

###固定大小的元素两个方向上的居中对齐

在两个方向上定位之后，水平方向上添加值为宽度的一半的负margin，在垂直方向上添加值为高度一般的负margin。

这很好理解，无需做过多解释

###大小未知的元素两个方向上的居中对齐

这个可以说其实就是上面介绍的方法的拓展，只不过也是增加了一个水平方向的处理而已，自己想想~~

###第三类：flexbox

第三类就是可以称之上万能的的CSS3中的flexbox

##结论

酱紫，你就可以轻松解决CSS的元素居中问题了。拜拜了，CSS Center。







