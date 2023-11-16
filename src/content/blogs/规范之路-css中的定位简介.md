---
title: 规范之路-CSS中的定位简介
date: 2014-09-12 20:30:00
categories: ['重构']
tags: ["CSS", "笔记"]

---

在 CSS2.1 中，一个盒子会根据下面三种定位方案进行排列：

* 标准流（Normal flow）：在 CSS2.1 中包括 块级盒子形成的块级格式化上下文（block formatting context），行级格式化上下文（inline formatting context）和采用了绝对定位（relative positioning）的盒子。
* 浮动（Floats）：在浮动模型中，盒子先按照正常标准流（normal flow）排列，然后从 normal flow 中取出，将它尽可能的移动到左边或者右边
* 绝对定位（Absoulte positioning）：整个盒子都将被从标准流中移出，相对于一个包含块（containing block）指定它自己的位置。将不会对它的兄弟元素有任何的影响。

如果一个元素被浮动或者进行了绝对定位，或者元素本身是文档的根元素（root element）我们就可以说这个元素脱离了文档流（out of flow）。与 `out-of-flow` 相对的是 `in-flow`。元素A的流（the flow of an element A）是一个集合，这个集合包含了A本身和那些以A作为最近的脱离文档流的祖先元素的所有 in-flow 元素。

<!--![look at this](http://ncuey-crispelite.stor.sinaapp.com/QQ20140912-1.png) -->

`position` 和 `float` 采用不同的方式来计算盒子的位置，这篇先简单的讲一下 `position`

###position的值

position可以应用在任何元素上，它 的值有：static | relative | absolute | fixed | inherit|，默认值是 static。

**static**  
	元素按标准流排列，'top', 'right', 'bottom', 和 'left' 对元素没有影响。  
	
**relative**  
	元素的位置按照标准流（中的位置）计算（the position in normal flow），然后盒子相对它标准流中的位置偏移。比如B元素相对原来的位置发生偏移之后，它后面的元素的位置计算不会受到影响，就像B元素一直在原来的位置上呆着一样。对于 table-row-group, table-header-group, table-footer-group, table-row, table-column-group, table-column, table-cell, and table-caption 这些元素，没有定义 `position:relative`。  
	
**absolute**  
	盒子的位置由'top', 'right', 'bottom', 和 'left' 指定。这四个值指定的偏移都是相对于盒子的包含块（containing block）。绝对定位的盒子从标准流中被移除，这一位置它们不会对接下来的相邻元素的布局产生影响。同时绝对定位的元素也有 magin ，不会与任何的 元素发生 margin坍塌现象。  

**fixed**  
	盒子的位置根据 ‘absolute’ model 来计算，除此之外，在不同的设备中，盒子固定的位置不太一样。在手持设备，投影设备，屏幕，电子打字机和电视上（handheld, projection, screen, tty, and tv media types），盒子的位置相对于视口（viewport）固定，当视口滚动的时候，盒子也不会移动；在打印机
上时，盒子在每个page（就是每张纸）上都会被渲染，位置相对page形成的盒子固定，即使页面是通过一个视口看到的（比如 打印预览）。对于其他的媒体类型来说，这种固定的盒子是未定义的。有时候可能想让一个盒子一直保持在屏幕的顶部，但是不想在打印的时候出现在每个页面上。使用媒体查询（@media rule）可以很轻松的做到这一定。

	@media screen { 
		h1#first { position: fixed } 
	}
	@media print { 
		h1#first { position: static }
	}
	
用户代理不能对固定的盒子中的内容做翻页处理，因为用户代理有可能以某种方式将不可见的内容输出（我没有实践过，see [“Content outside the page box”](http://www.w3.org/TR/CSS21/page.html#outside-page-box)）。暂时先搁着，先看完 chapter 9 (￣◇￣;)

###盒子的偏移量（Box offsets）
一个元素的 position 属性的值不是 “static“ 的时候，我们可以说这个元素使用了定位（is positioned）。使用了定位后的元素形成一个 “定位盒子“（positioned boxes），这个定位盒子的位置根据'top', 'right', 'bottom', 和 'left'四个属性来计算，这四个属性决定了盒子的offset。

|   |   |
|---|---|
|Value |  \<length> | \<percentage> | auto | inherit|
|Initial |  	auto|
|Applies to |  	positioned elements|
|Inherited  | 	no|
|Percentages |  	refer to height of containing block|
|Media  | 	visual|
|Computed value |  	if specified as a length, the corresponding absolute length; if specified as a percentage, the specified value; otherwise, 'auto'.|

'top'/'right'/'bottom'/'left'四个属性的作用也很好理解，分别定义绝对定位的盒子的上/右/下/左部的margin边缘到这个盒子的包含块的上/右/下/左部边缘的距离。对于相对定位的盒子，偏移量参照的是盒子自身的上/右/下/左部边缘（包含marign），即相对于盒子处于标准流中的位置。

当它们的值定义为百分比时，偏离量的计算方法是：包含块的宽度的百分比（定义 left 或者 right）或者高度的百分比（定义 top 或者 bottom）。


先记录到这里，回头在看一下 标准中的 [Normal flow](http://www.w3.org/TR/CSS21/visuren.html#normal-flow) 和 [Floats](http://www.w3.org/TR/CSS21/visuren.html#floats) 以及 [absolute-positioning](http://www.w3.org/TR/CSS21/visuren.html#absolute-positioning)


(￣◇￣;)
	
	


	
	
