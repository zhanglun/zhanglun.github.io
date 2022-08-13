---
title: 规范之路-重新认识了Float
date: 2014-10-15 14:50:00
categories: ['重构']
tags: ['CSS', '笔记']

---
> 总是喜欢在阴雨绵绵的时候收拾自己的小窝，无论是在家还是在学校。也不知道这个癖好是怎么形成的，还是不错的。这几天一直在搞一个新的hexo的主题，暂时没什么进展了，想到之前坚持撸标准的事情已经搁置了好久，今天收拾完就重新开始吧。

今天看的是 [Floats](http://www.w3.org/TR/CSS21/visuren.html#floats)
<!--more-->

## 什么是浮动

当一个元素的CSS属性中添加了`float:left;`或者`float:right;`的时候，我们就可以把这个元素称之为“浮动元素”。当一个元素浮动之后，它会脱离文档流，也就是“out of flow”，然后尽可能地移动到当前行的左边或者右边。浮动最有意思的特性就是：内容沿着浮动元素的的边界流动。说直白一点就是，内容沿着向左浮动的元素的右边往下排（flows down），沿着向右浮动的元素的左边往下排。就像下面这样

```css
img{
	float:left;
}
```

```html
<div class="container">
	<img src="http://placekitten.com/g/50/50" alt="" style="float:left">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum maxime tempore perferendis ullam, voluptatem repellat vero nihil sint. Quisquam repellat, minus distinctio quae sit, ea provident sed aliquid voluptate vitae.
  	</p>
</div>
```

<!--![](http://ncuey-crispelite.stor.sinaapp.com/W3CR-Floats/2014-10-31_155325.png) -->

利用这个特性可以制作文字环绕图片的效果，据说float最初的作用就是这，直到有人发现可以用来“布局”。当然可以使用`clear`属性来禁止这个效果。

## 元素浮动之后如何表现

一个浮动的盒子会移动到左边或者右边，直到它的外边缘碰到包含块的边缘或者另一个浮动元素的外边缘。如果存在一个行盒子（以前记录过的关于line box的介绍 [link](/2014/10/02/%E8%A7%84%E8%8C%83%E4%B9%8B%E8%B7%AF-normal%20flow/#Inline_formatting_contexts)），通常情况下，浮动元素的顶部会和当前行盒子的顶部对齐。

```css
.container{
    border:1px solid #343434;
}
.left{
    float:left;
    width:300px;
    background:#4de6e8;
}
.color3{
    background:#985ede;
}
```

```html
<div class="container">
    <div class="content">我是一个乖乖的div，我形成了一个BFC</div>
    <span>我是一个span标签，我形成了IFC，同时还有一个 line box</span>
    <div class="left">我是一个向左浮动的盒子，我的左边碰到了父元素形成的containing block的左边缘</div>
    <div class="left color3">我也是一个向左浮动的盒子，我的左边碰到了前面的浮动元素的右边缘</div>
</div>
```

<!--![](http://ncuey-crispelite.stor.sinaapp.com/W3CR-Floats/2014-10-31_175651.png) -->

如果没有足够的横向空间，浮动元素会向下移动，可以理解成另起一行，直到能够容纳它的宽度或者不存在更多的浮动元素。

因为浮动后的元素不在正常的流中，所以在浮动元素前后创建的非定位块级盒子（non-position block boxes）在垂直方向上表现得就好像浮动元素不存在一样。这意味着浮动元素在正常的流中将不会占据高度，如果一个容器没有固定高度，且里面只包含浮动元素，那么这个容器的高度将为0。但是在浮动元素之后（html结构上的先后）创建的行盒子在适当的时候会自动缩短以腾出空间放置浮动元素。如果缩短的盒子太小不能容纳任何内容，这个line box会向下移动（它的宽度重新计算）直到某些内容能够适应宽度或者没有更多的浮动元素。

<!--![](http://ncuey-crispelite.stor.sinaapp.com/W3CR-Floats/2014-10-31_193922.png) -->

在当前行中，任何在浮动元素之前的的内容都会在同一行中reflow到浮动元素的另一边。

如果表格的边框盒子，块级可替换元素或者在正常流中的元素创建出一个BFC，那么，它们绝对不会和处在相同BFC中的浮动元素的外填充盒子（包含margin 的盒子）重叠。乍看之下好像元素浮动之后在页面上新叠了一层，但其实不是，只有定位元素才是真正意义上是的新层（new stack）。

```css
.ovh{
    overflow:hidden;
}
.red{
    background:red;
	height:40px;
}
```

```html
<div class="container">
    <div class="left">我是一个浮动的元素</div>
    <div class="">
		<div class="red">我没有创建了一个BFC，所以有一部分与浮动元素重叠了</div>
		</div>
</div>
  <br>
<div class="container">
    <div class="left">我是一个浮动的元素</div>
    <div class="ovh">
		<div class="red">我创建了一个BFC，不在重叠了！</div>
	</div>
</div>
```

<!--![](http://ncuey-crispelite.stor.sinaapp.com/W3CR-Floats/2014-10-31_193115.png) -->

来看看下面的代码：
```css
img{
	float:left;
}
p,img{
	margin:10px;
}
```
```html
<p>
	<img src="http://placekitten.com/g/50/50" alt="">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, corporis nulla quis aliquid distinctio labore commodi fugiat eum architecto sunt sed vel animi illo aspernatur quae nam ducimus enim explicabo!
</p>
```
<!--![](http://ncuey-crispelite.stor.sinaapp.com/W3CR-Floats/2014-10-31_202013.png) -->

可以看到，图片向左浮动，在同一行上，紧跟着图片的内容的问题移到了右边。由于图片的原因，右侧的line box 被缩短了。但是在在图片之后的line box 恢复了它的宽度。

再来看下面这个例子：

```css
p{
    border:1px solid red;
    margin:10px;
    padding:10px;
}
img{
    margin:10px;
    float:left;
}
```
```html
<p><img src="http://placekitten.com/g/200/400" alt="">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, iusto, eos, recusandae qui impedit blanditiis libero in accusamus necessitatibus repellendus porro quae inventore unde non voluptate iste nesciunt aut quis.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, iusto, eos, recusandae qui impedit blanditiis libero in accusamus necessitatibus repellendus porro quae inventore unde non voluptate iste nesciunt aut quis.</p>
```
效果图如下：

<!--![](http://ncuey-crispelite.stor.sinaapp.com/W3CR-Floats/2014-10-31_204351.png) -->

图片浮动之后，在页面上不再占据高度，此时，没有设置高度的P元素的高度只能靠内容撑开。另一P元素就像图片不存在一样，紧接其后。可以使用`clear`属性阻止第二个P元素的内容流向（围绕）到浮动的图片。添加新的属性

```css
p{
	clear:left;
}
```
<!--![](http://ncuey-crispelite.stor.sinaapp.com/W3CR-Floats/2014-11-01_095746.png) -->

当p元素添加了 "clear:left" 之后，导致第二个段落被“推”到浮动图片的下方。有一个叫做“clearence”的东西添加到第二个段落的上外边距，就是这个“clearence”完成了调整的工作。后面会说到“clearence”

## float:left|right|none|inherit;

>额好吧上面说了这么多感觉乱乱的。

可以为任何元素添加float属性，如果元素形成的盒子具有绝对定位属性（absolutely position：position的属性值是absolute或者fixed），浮动将不起作用。

元素浮动之后，会形成 一个块级盒子。也就是说，通常情况下形成行级盒子的span元素，浮动之后也便会形成一个块级盒子。

在[这里](http://www.w3.org/TR/CSS21/visuren.html#floats)官方给出了关于浮动更精确的规则，挑了几条比较个人感觉重要的

* 向左浮动的元素的左外填充边缘（outer edge）不一定是 containing block 的左边缘。向右的元素同理。
* 假设当前的盒子是向左浮动的，在它的DOM树之前也存在向左浮动的盒子。那么对于这个盒子来说，要么它的左外填充边缘与前面的盒子的右外填充边缘接触，要么它的顶外填充边缘与前面的盒子的底外填充边缘接触。向右浮动的元素同理。
* 一个浮动元素的上外填充可能不会比它的包含块高。当浮动在两个重叠的margin之间发生，这个浮动就好像它有一个处于正常流中的空的匿名块的父元素一样
* 一个浮动元素的上外填充通常不会比DOM结构比其优先的元素形成的块盒子或者浮动和的上外填充高
* 一个浮动元素的上外填充通常不会比DOM结构比其优先的元素形成的line box（这个盒子要包含另一盒子）上外填充高


## 我要控制浮动！

CSS中提供了一个叫做`clear`的属性方便我们控制浮动之后的流。应用在块级元素上，可以使用的值有：none|left|right|both|inherit。这个属性决定元素形成的盒子的哪一边（左边或者右边）不与前面的浮动元素相邻。同时，不会作用于应用该属性的元素内部的浮动和其他的BFC中的浮动。

### 'clear'的属性值

可以是将下面四个值应用在没有浮动的块级盒子上

<dl>
    <dt>
    	**left**
    </dt>
    <dd>
        命令使用`clear:left`的盒子的上外边界要低于任何DOM结构中比自己优先的左浮动元素框的下外边界。（只关心html结构上在自己之前的浮动元素）
    </dd>
    <dt>
    	**right**
    </dt>
    <dd>
        命令使用`clear:right`的盒子的上外边界要低于任何DOM结构中比自己优先的左浮动元素框的下外边界。（只关心html结构上在自己之前的浮动元素）
    </dd>
    <dt>
    **both**
    </dt>
    <dd>
        命令使用`clear:both`的盒子的上外边界要低于任何DOM结构中比自己优先的左浮动或者右浮动元素框的下外边界。（只关心html结构上在自己之前的浮动元素）
    </dd>
</dl>

> 根据官方的定义，可以推断出，所谓“使用clear来清除浮动”这种说法是错误的。clear所起的作用不是针对浮动，它决定的是作用的元素与其前面的浮动元素的位置关系。假如A元素使用左浮动，B元素使用左清除浮动，其作用的结果是B元素的上外边界是紧跟随在A元素的下外边界，浮动依旧浮动，B元素只不过是让其本身左侧出现在A的下方（不是底下）。

看下面的例子：

```html
<div class="container">
    <p>
    	<img src="http://placekitten.com/200/200?image=5" alt="">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, iusto, eos, recusandae qui impedit blanditiis libero in accusamus necessitatibus repellendus porro quae inventore unde non voluptate iste nesciunt aut quis.</p>
	<p></p>
</div>
```
<!--![](http://ncuey-crispelite.stor.sinaapp.com/W3CR-Floats/2014-11-02_152036.png) -->

当clear的值不是none时，潜在地引入了一个叫做“clearence”的东西，clearence禁止margin的重叠，表现得好像元素margin-top上的空白间隔。用来将元素从浮动元素身边挤下去（push past）。

在第一次确定元素上边框边缘的位置的时候，元素的“clearence”的计算已经完成。如果clear设置为none，那么这个位置就是元素真正的上边框边缘的位置，也就是没有“clearence”。


### 例子说明如何计算这个clearence

假设，有三个盒子，顺序是：B1，margin-botom:M1，没有padding，border和子元素；浮动的F，高度为H；B2，margin-top:M2，同样没有padding，border和子元素,B2设置`clear:both`;

如果暂时忽略B2的clear属性，我们会有下面的图片中的结果，B1和B2的margin重叠了，两者之间的间隔取大值也就是Max(M1, M2)。取B1的最底部在Y轴坐标为0，那么F的顶部的位置为y=M1，B2的顶部为y=Max(M1, M2)，F的底部为y=M1 + H。

<!--![](http://ncuey-crispelite.stor.sinaapp.com/W3CR-Floats/2014-11-02_162630.png) -->

考虑到B2的clear属性的作用，我们需要计算clearence，C1和C2，取Max(C1, C2)。

1. B2的顶部会被挤到F的底部，坐标为y=M1 + H;这意味着它们自己空隙计算方式是：
```
	bottom of F = top border edge of B2
    ⇔
    M1 + H = M1 + C1 + M2
    ⇔
    C1 = M1 + H - M1 - M2 = H - M2
```
2. 保持B2的顶部在原来的位置，坐标为y=Max(M1, M2);计算方式：
```	
    Max(M1, M2) = M1 + C2 + M2
    ⇔
	C2 = Max(M1, M2) - M1 - M2
    
	假设 Max(M1, M2) < M1 + H，那么：
    
    C2 = Max(M1,M2) - M1 - M2< M1 + H - M1 - M2 = H - M2
    ⇒
	C2 < H - M2
``` 
3. 所以
```
C1 = H - M2  >C2  ⇒ Max(C1, C2);
```

#### 再来说明一下“负clearence的情况”

```html
<p style="margin-bottom: 4em">
  First paragraph.
</p>
<p style="float: left; height: 2em; margin: 0">
  Floating paragraph.
</p>
<p style="clear: left; margin-top: 3em">
  Last paragraph.
</p>
```
如果没有为最后一个段落添加clear属性，第一个和最后一个段落的margin会重叠，最后一个元素的顶部会与浮动元素的的顶部齐平。加上clear之后第三个段落会排列在第二个段落的下方比原来的位置低2em（浮动元素的高度），同时，margin也不在重叠。所以

	clearence + margin-top = 2em ;
    ⇒
    clearence = 2em -3em = -1em;

完了，Bye~





