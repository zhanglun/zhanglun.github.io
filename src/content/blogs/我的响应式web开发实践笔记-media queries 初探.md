---
title: 我的响应式web开发实践笔记-Media Queries 初探
date: 2014-10-10 12:30:00
categories: ['技术学习']
tags: 
  - CSS
---

> 很久以前就接触到了响应式Web开发这回事，自己也玩弄过一阵。当时没有整理成笔记，现在在重构自己的在线简历以及hexo主题制作过程中涉及到，就顺手整理成一个系列吧。

响应式web设计并非新的技术，只不过将已有的开发技巧（弹性布局、弹性图片和媒体查询等）整合在了一起，

### 先来说说媒体查询（Media Queries）

早在 HTML4 和 CSS2 的时代，就已经支持采用不同的样式表来适配不同的媒体设备类型。比如，一个文档在屏幕上和打印时可能使用不同的样式表。在 HTML4中，可以这么写：

```html
<link rel="stylesheet" type="text/css" media="screen" href="sans-serif.css">
<link rel="stylesheet" type="text/css" media="print" href="serif.css">
```

在内联的 CSS 样式中，可以像这样指定一部分CSS样式块应用在指定的媒体设备上：

```css
@media screen {
    * { font-family: sans-serif }
}
```

媒体类型就不在此列举了。如果想让多个媒体设备采用同一套样式，只需在media属性中添加媒体类型的名称，用逗号分开就可以了：

```html
<link rel="stylesheet" type="text/css" media="screen, print, resolution > 90dpi" href="serif.css">
<style>
    @media screen {
      * { font-family: sans-serif }
    }
</style>
```

而CSS3 中的媒体查询（Media Queries）就是建立在 HTML4 的媒体查询的语法机制之上，其语法符合 HTML4 中保留的媒体类型语法。HTML4 中的 `media` 属性同样存在于 XHTML 和 一般的 XML 中。但是，媒体查询的解析规则不兼容 HTML4 的解析规则，因此，适用于 CSS 中的媒体查询。

CSS3 中的媒体查询一个媒体类型和零个或者多个检查特定媒体功能的状况的表达式组成。
这些表达式会被解析成真或假。如果媒体查询中的媒体类型与文档要展示的设备相符则查询结果为真，并且媒体查询中的所有表达式为真。媒体类型默认情况是 `all`

```html
<link rel="stylesheet" media="screen and (max-width: 800px)" href="example.css" />

@import url(color.css) screen and (color);

<style>
    @media screen and (max-width: 600px) {
      .facet_sidebar {
        display: none;
      }
    }
</style>
```

当媒体查询为真时，相关的样式表或样式规则就会按照正常的级联规则被应用。即使媒体查询返回假， <\link> 标签上带有媒体查询的样式表 仍将被下载 （只不过不会被应用）。

可以这么理解：媒体查询无非就是检查当前用户代理是何种设备，设备的某些参数：媒体类型（media type） + CSS属性。

### Media Queries支持的属性

属性 | 值 |  MIN/MAX | 描述 
---|---|---|---
color|   整数 | yes | 每种色彩的字节数
color-index | 整数 | yes | 色彩表中的色彩数
device-aspect-ratio | 整数/整数  | yes | 宽高比例
device-height |  length | yes | 设备屏幕的输出高度
device-width |   length | yes | 设备屏幕的输出宽度
height |  length | yes | 渲染界面的高度
width |   length | yes | 渲染界面的宽度
grid |    整数 | no  | 是否是基于格栅的设备
monochrome |  整数 | yes | 单色帧缓冲器中每像素字节
resolution |  分辨率(“dpi/dpcm”)| yes | 分辨率
scan |    Progressive interlaced | no  | tv媒体类型的扫描方式
orientation | Portrait/landscape | no  | 横屏或竖屏

### best breakpoints

我现在需要解决的问题是：针对不同屏幕大小的设备的的代码块的媒体查询判断条件该如何书写，在 stackoverflow 上看到的[回答](http://stackoverflow.com/questions/6370690/media-queries-how-to-target-desktop-tablet-and-mobile)，the best breakpoints:

```html
<style>
    @media (min-width:320px) { /* smartphones, iPhone, portrait 480x320 phones */ }
    @media (min-width:481px) { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */ }
    @media (min-width:641px) { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */ }
    @media (min-width:961px) { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
    @media (min-width:1025px) { /* big landscape tablets, laptops, and desktops */ }
    @media (min-width:1281px) { /* hi-res laptops and desktops */ }
</style>
```

### 如何在 sass 中使用编写媒体查询模块

可以参考这篇文章：[Responsive Web Design in Sass: Using media queries in Sass 3.2](http://thesassway.com/intermediate/responsive-web-design-in-sass-using-media-queries-in-sass-32)
首先，最简单的是使用 CSS 的语法：

```sass
// set a variable for the font size
$h1-size: 36px

h1 {
  font-size: $h1-size;
}

// this will only affect wide screens
@media screen and (min-width: 1024px) {
  h1 {
    font-size: $h1-size * 1.5;
  }
}
```
```css
// 编译后：
h1 {
  font-size: 36px;
}
@media screen and (min-width: 1024px) {
  h1 {
    font-size: 54px;
  }
}
```

同时，sass 为 CSS 的书写提供了是一个相当杀手级功能：当你在其它选择器中嵌套 `@media` 时，如果在嵌套的 @media 中添加的属性，sass 会向上一层层查找选择器，将@media中添加的属属性应用在查找到的选择器上，并将其插入到 @media 的代码块中：

```sass
.profile-pic {
    float: left;
    width: 250px;
    a {
        color: black;
        @media screen and (max-width: 320px) {
            width: 100px;
            color: red;
        }
        @media screen and (min-width: 1200px) {
            float: none;
            color: blue;
        }
    }
}
```
```css
// 编译后：
.profile-pic {
    float: left;
    width: 250px
}
.profile-pic a {
    color: black
}
@media screen and (max-width: 320px) {
    .profile-pic a {
        width: 100px;
        color: red
    }
}
@media screen and (min-width: 1200px) {
    .profile-pic a {
        float: none;
        color: blue
    }
}
```

其实这个东西也是很好理解的，就不过多解释了，省得啰嗦。但是要记住：还有很多种变化的写法，比如在query中使用变量，在代码块中使用 `@extend`.etc。多用用就好了


### 关于 min-width/min-height 和 max-width/max-height 的补充：2014/10/18 

min-width(height): 最小宽度(高度)；在媒体查询中作为检查条件时，指的是渲染界面的最小宽度（高度）。也就是说当宽度（高度）大于给定的数值时才使用这一块代码块（没有使用的 Media Queries 代码块也会加载）；相反地，max-width(height) 意思就是：当宽度（高度）小于给定的数值时才使用这一块代码块。指定的数值是一个临界值。

有意思的东西来了！

看下面的代码：

```css
.container{
    background:white;
}
@media screen and (min-width:320px) { 
    .container{
        background:red;
    }
}
@media screen and (min-width:481px) { 
    .container{
        background:blue;
    }
}
```

根据CSS的解析规则，过程如下：

1. container的背景色为white；
2. 当宽度大于320px时，container的背景色为red；
3. 当宽度大于481px时，container的背景色为blue；

这可能是你想要的顺序，但是如果 你这样：

```css
.container{
    background:white;
}
@media screen and (max-width:320px) { 
    .container{
        background:red;
    }
}
@media screen and (max-width:481px) { 
    .container{
        background:blue;
    }
}
```

根据CSS的解析规则，过程如下：

1. container的背景色为white；
2. 当宽度小于320px时，container的背景色为red；
3. 当宽度小于481px时，container的背景色为blue；

好问题来了，小于320 不就是 小于 481 了嘛？后面样式直接覆盖了前面的啊！所以在小于481px的渲染宽度中，颜色都是blue。

同样的问题：

```css
.container{
    background:white;
}
@media screen and (min-width:481px) { 
    .container{
        background:blue;
    }
}


@media screen and (min-width:321px) { 
    .container{
        background:red;
    }
}
```

根据CSS的解析规则，过程如下：

1. container的背景色为white；
2. 当宽度大于481px时，container的背景色为blue；
3. 当宽度大于321px时，container的背景色为red；

其结果显而易见，后面的样式（当宽度大于321px时）直接覆盖了前面的（当宽度大于481px时），所以在大于321px的渲染宽度中，颜色都是red。这也是我们不想看到的结果。

为了避免出现上面这混乱的结果，我个人认为可以酱紫：

    max大的。min小的。  
    
    使用max时，值从大到小，依次是，`小于1024px`, `小于961px`, `小于641px`.etc。这是一种桌面端优先的方式，先考虑渲染宽度大的设备。

    使用min时，值从小到大，依次是，`大于320px`, `大于481px`, `小于641px`.etc。这是一种移动端优先的方式，先考虑渲染宽度小的设备。

    如果这样理解的话，我感觉自己不会混乱了~~



参考：

css3-mediaqueries[http://www.w3.org/TR/css3-mediaqueries/](http://www.w3.org/TR/css3-mediaqueries/)  
前端观察[http://www.qianduan.net/media-type-and-media-query.html](http://www.qianduan.net/media-type-and-media-query.html)  
W3cPlus[http://www.w3cplus.com/content/css3-media-queries](http://www.w3cplus.com/content/css3-media-queries)  
