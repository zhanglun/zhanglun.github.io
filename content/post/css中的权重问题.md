---
title: CSS 中的权重问题  
date: 2014-09-26 12:23:00  
categories: ['前端'] 
tags: ["CSS","笔记"]  

---

> 自己对以后的方向很明确，但是却一直做不到。接连的 rejected 多少对自己有影响。不是自己不去争取，而是真的已经疲了，或者说自己也怂了。面试的时候已经不知道该怎么办，即使自己的知道的问题也只会模棱两可地回答。滚回学校慢慢学吧

如果你现在问我CSS的权重，我也只能说个大概。于是开始整理有关的资料。

## CSS Specificity

有时候你会发现自己辛辛苦苦写的CSS样式不起作用，文件引入了，浏览器也加载了，但就是不按照你想要的方式显示，这个时候你就需要考虑 CSS权重的问题。如果你对权重的工作方式有所了解，将会大大减少调试bug的时间。

如果想解释权重的工作方式，最好的办法就是针对问题来分析。下面就是一个 CSS 样式没有按照期待的方式显示的例子。

一个简单的无序列表

    <ul id="summer-drinks">
       <li class="favorite">Whiskey and Ginger Ale</li>
       <li>Wheat Beer</li>
       <li>Mint Julip</li>
    </ul>
    
而在CSS中，是酱紫的：

    ul#summer-drinks li {
       font-weight: normal;
       font-size: 12px;
       color: black;
    }
    .favorite {
      color: red;
      font-weight: bold;
    }
    
但是你会发现，拥有class为favorite的li元素中的内容并没有像你期待的那样加粗变红。这就是权重引发的“血案“！别急别急，我们可以好好的捋一捋。

#### 什么是CSS的权重

我的理解就是：CSS规则的优先顺序，权重高的优先。权利大的才有发言权。

每个选择器都有自己的权重。你的每条css规则，都包含一个权重级别。权重决定了哪一条规则会被浏览器应用在元素上，如果两个选择器作用在同一元素上，则权重高者生效。

那上面的例子来说，两个CSS选择器 `ul#summer-drinks` 和 `.favorite` 有自己的权重，而前者的权重高于后者。所以采用的样式由前者决定而非后者。

#### 如何计算权重

规范中给出的定义在[这里](http://www.w3.org/TR/CSS2/cascade.html#specificity)，分成四种不同等级的基础权重值，选择器最终的权重（优先级）由四个值共同决定。这四个等级分别是：
1. 行内样式，html文档中定义的style，不包含选择器，直接对元素起作用。
2. ID选择器
3. 类（class），属性选择器（attribute selector）和伪类选择器（pseudo-class-selector）
4. 元素和伪元素（pseudo-elements）

搞明白了这几个等级，权重的计算也是很简单了，为了方便计算和描述，分别将这四个等级标记为a, b, c, d。

* 如果样式声明来自行内样式（style），将不包含选择器，直接作用在元素上，权重的基础值记为`1`, a = 1;
* 计算选择器中ID选择器的个数x，b = x;
* 计算选择器中class选择器，属性选择器和伪类选择器的个数y，c = y;
* 计算元素选择器和伪元素的个数z，d = z;

就象这样：  
![http://ncuey-crispelite.stor.sinaapp.com/specificity-calculationbase.png](http://ncuey-crispelite.stor.sinaapp.com/specificity-calculationbase.png)  

最后的到的权重就是 `0(1), x, y, z`，把它看作一个4位数的数字，数字越大权重越高。可以这么记：从0开始，一个行内样式+1000，一个id+100，一个属性选择器/class或者伪类+10，一个元素名，或者伪元素+1.比如：

     *             {}  /* a=0 b=0 c=0 d=0 -> specificity = 0,0,0,0 */
     li            {}  /* a=0 b=0 c=0 d=1 -> specificity = 0,0,0,1 */
     li:first-line {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
     ul li         {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
     ul ol+li      {}  /* a=0 b=0 c=0 d=3 -> specificity = 0,0,0,3 */
     h1 + *[rel=up]{}  /* a=0 b=0 c=1 d=1 -> specificity = 0,0,1,1 */
     ul ol li.red  {}  /* a=0 b=0 c=1 d=3 -> specificity = 0,0,1,3 */
     li.red.level  {}  /* a=0 b=0 c=2 d=1 -> specificity = 0,0,2,1 */
     #x34y         {}  /* a=0 b=1 c=0 d=0 -> specificity = 0,1,0,0 */
     style=""          /* a=1 b=0 c=0 d=0 -> specificity = 1,0,0,0 */
    <head>
    <style type="text/css">
      #x97z { color: red }
    </style>
    </head>
    <body>
    <P id="x97z" style="color: green">
    </body>
   
P标签的颜色将会是绿色，因为权重的关系，行内样式会覆盖其他定义的样式。

借鉴一下老外的图：

![1](http://ncuey-crispelite.stor.sinaapp.com/cssspecificity-calc-1.png)  
或者  
![2](http://ncuey-crispelite.stor.sinaapp.com/cssspecificity-calc-2.png)  
然后   
![4](http://ncuey-crispelite.stor.sinaapp.com/cssspecificity-calc-4.png) 
还有  
![5](http://ncuey-crispelite.stor.sinaapp.com/cssspecificity-calc-5.png)  



**要注意的是**：

* 通配符选择器 `*` 不具有特殊性，其权重为(0, 0, 0, 0)
* 伪元素(0, 0, 0, 1)和伪类选择器(0, 0, 1, 0)不是同一个东西，他们的权重值也不一样
* 伪类选择器 :not()不具有特殊性，它的权重由括号内的内容决定 

###特殊的 !important
!important 用于单独指定某条样式中的单个属性。对于被指定的属性，有 !important 指定的权重值大于所有未用 !important 指定的规则。

例如：
	
    #header nav ul li.current {
    	color: red; font-weight: bold;
    }
    // 权重值为 0, 1, 1, 3
    
	li:hover {
    	color: blue !important;
        font-weight: normal;
	}
    
    // 权重值仅为0, 0, 0, 2

所以应用于相同元素时，前者生效。但是对于color这个属性，由于在后者中用 !important 做了指定，因此color将应用后者的规则。而font-weight则按照规定用前者的规则。

如果多条规则中都对同一个属性指定了 !important ，这时 !important 的作用相互抵销，依然按abcd四组计算比较。



参考自：

[WCR specified-value](http://www.w3.org/TR/CSS2/cascade.html#specified-value)  
[specifics on css specificity](http://css-tricks.com/specifics-on-css-specificity/)  
[WCR specificity](http://www.w3.org/TR/CSS2/cascade.html#specificity)  


