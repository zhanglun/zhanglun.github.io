---
title: 规范之路-Normal Flow
date: 2014-10-02 20:39:00
categories: ['重构']
tags: ["CSS", "笔记"]

---

##Normal Flow

在正常流中的盒子们都是一个格式化上下文（formatting context）中的成员，可以表现成一个block或者inline，但是不能既是block又是inline。block 元素进入块级格式化上下文（block formatting context），inline 元素进入行级格式化上下文（inline formatting context）。

###Block formatting contexts

浮动元素，绝对定位元素，非块级盒子的块级容器（inline-block元素，table-cell元素和table-caption元素）和 overflow 的值不为 visiable的盒子，都会为它们的内容创建一个新的块级格式化上下文（BFC）。

在BFC中，盒子从顶端开始垂直地一个接一个地排列，两个盒子之间的垂直的间隙是由他们的margin 值所决定的。在一个BFC中，两个相邻的块级盒子的垂直外边距会产生折叠。

在BFC中，每一个盒子的左外边缘（margin-left）会触碰到容器的左边缘(padding-left 或者 border-left)（对于从右到左的格式来说，则触碰到右边缘）。

###Inline formatting contexts

在IFC中，盒子从顶端水平地一个接一个地排列。盒子之间的水平的外边距，边框和内边距会起作用。这些可以可以以不同的方式对齐：底部对齐，顶部对齐或者盒子内容中文本的基线对齐。每一行包含的盒子所形成的矩形区域我们称之为“line box”。


通常情况下，一个line box的高度足够容纳它包含的盒子。但是，有可能会比最高的盒子还高。当一个盒子B的高度比包含着它的line box 的高度还要小的时候，盒子B在line box中的垂直对齐由属性 “vertival-align” 决定。当几个行级盒子不能在一个单一的line box中正常地水平排列时，它们会被分配到两个或者多个垂直堆叠（vertical-stacked）的line box中。因此一个段落是line box中一个垂直的堆（vertical stack）。

通常来说，一个line box的左边缘会接触到它的包含块的做边缘，右边缘接触到包含块的右边缘。但是，浮动的盒子可能会出现在line box 的边缘和它的包含块的边缘之间。因此，虽然在同一个IFC中的line box有同样的宽度（取决于包含块的宽度），但是当浮动导致水平方向上可用的空间减少时，它们宽度将不一样。同样的，同一个IFC中的它们的高度也有可能不同，比如有的包含一个图片，有的只包含一行文字。

当一个内联元素的超过了 line box 的宽度，它将分割成若干个盒子，并且这些盒子将会分布在多个line box 上。但是有时候超过宽度的盒子没办法被分割（e.g., 盒子中包含一个单字符；语言特定的断字规则不允许断开；内联盒子受 CSS属性 `white-space` 的值 `nowrap` 或者 `pre` 标签的作用），它将溢出。


当一个内联盒子被截断时，margin，padding和border在截断处都不会有任何的视觉效果。  

---
![inline-box-split-margin](http://ncuey-crispelite.stor.sinaapp.com/inline-box-split-margin.png)

---

![inline-box-split-padding](http://ncuey-crispelite.stor.sinaapp.com/inline-box-split-padding.png)

---

![inline-box-split-border](http://ncuey-crispelite.stor.sinaapp.com/inline-box-split-border.png)

---

Line box 的诞生是为了容纳一个包含着一个行级格式化上下文的行级内容（inline-level content）。当一个 line box 中不包含文本，不存在保留的空白，没有非零外边距，内边距，或者边框的内联元素和其他未脱离文档流的内容，以及不已一个保留的新行作为结尾时，它的高度被看作是0（zero-height）

>这是一个inline box 建立的过程。p元素的内容中包含一段匿名的文本，并穿插着em元素和strong元素：

    <p>
        Several 
        <em>emphasized words</em>
         appear
        <strong>in this</strong>
         sentence, dear.
    </p>


p元素形成了一个块级盒子，包含着五个行内盒子，其中三个是匿名盒子：

* Anonymous: "Several"
* EM: "emphasized words"
* Anonymous: "appear"
* STRONG: "in this"
* Anonymous: "sentence, dear."

为了格式化这个段落，用户代理将五个盒子绘入到 line box 中。在这个例子里面，p元素形成的盒子为inline box 建立了一个 containing block。如果包含块足够宽，所有行内盒子将放入一个单独的一行中：

    Several emphasized words appear in this sentence, dear.
    
如果不是，则行内盒子将被分裂并分布在几个 line box中。前一段可能会被分拆如下：

    Several emphasized words appear
    in this sentence, dear.

或者这样：

    Several emphasized  
    words appear in this 
    sentence, dear.
    



下次就是[Floats](http://www.w3.org/TR/CSS21/visuren.html#floats)

Bye~






