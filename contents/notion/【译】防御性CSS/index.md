---
title: 【译】防御性CSS
categories: 博客译文
status: publish
date: 2021-12-11T12:00:00.000+08:00
tags:
  - CSS
cover: https://www.notion.so/images/page-cover/nasa_fingerprints_of_water_on_the_sand.jpg

---


> 原文：[https://ishadeed.com/article/defensive-css/](https://ishadeed.com/article/defensive-css/)

有时候，我们希望有一种方式来避免遇到某种CSS的问题或者行为。要知道，内容是动态的，网页上的内容会发生变化，从而增加了出现CSS问题或者一些奇怪行为的可能性。

防御性CSS是一个片段的集合，可以帮助你编写受保护的CSS。换句话说，你在未来会遇到更少的问题。如果你按照我的博客，你可能会读到我不久前写的一篇文章，它被称为“以防万一的心态”。这篇文章是在它的基础上写的，并将是一个持续的片段列表。如果你有任何建议，请随时让我知道。

## Flexbox Wrapping

CSS flexbox 是现在最有用的CSS布局特性之一。在一个选择器上添加 `display: flex`，让子项挨着排序，这很诱人。

问题是，当空间不足时，那些子项默认不会插入到一个新的行。我们需要使用 flex-wrap：wrap 来改变这个行为。下面是一个典型的例子。我们有一组需要挨着排序的选项。

```css
.options-list {
    display: flex;
}
```

![](images/02b5e9042e5131ed.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=ee44f1248952ce9d4cb487f12569d985f0ead65200646890a8c6311f457ba1d7&X-Amz-SignedHeaders=host&x-id=GetObject)

当空间较少时，会出现水平滚动条。这应该是预料之中的，实际上并不是一个“问题”。

![](images/6ebbe82d313e37e1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=a752a1d518390d97908b874e76a72d1c7d3d31712c6230f628ef5fc4e62d4c5d&X-Amz-SignedHeaders=host&x-id=GetObject)

注意，子项依然是挨在一起的。要修复这个问题，我们需要允许flex换行。

```css
.options-list {
    display: flex;
    flex-wrap: wrap;
}
```

![](images/dab69a986399c72f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=dd310d5ebbf73bec63d97efb2035a2254fae1276188cf1dc9ae6d08a7d1f588b&X-Amz-SignedHeaders=host&x-id=GetObject)

使用flexbox时，一般的经验法则是允许换行，除非你想要一个滚动条。这是另一回事，但尽量使用flex-wrap 来避免意外的布局行为（在我们的例子中，是水平滚动）。

## Spacing

开发者需要考虑不同内容的长度。这意味着，间距需要添加到组件中，即使它看起来不需要

![](images/fff5f47d962e2a2c.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=59ea7123c34ff70d5a1b5bd674da117e576cf2c3199901d2ed63dff295934894&X-Amz-SignedHeaders=host&x-id=GetObject)

在这个例子中，在右边有一个标题和一个操作按钮。现在看起来很好。但是，让我们来看看当标题更长时会发生什么。

![](images/95b32b4e8cfafc0f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=cc285e1324e1df6d9f26adc833deff3418bc6dca90efc7895cca92b74b9a70a0&X-Amz-SignedHeaders=host&x-id=GetObject)

注意到文字离操作按钮太近了吗？你可能正在考虑换行，但是我将在另外一节中讨论这个问题。现在，让我们把注意力放在间距上。

如果标题有间距和文本截断，我们就不会看到这个问题。

```css
.section__title {
    margin-right: 1rem;
}
```

![](images/6b1d0ed959c291ef.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=b20507f0bc739be2b93727e3fd07987b7242568ac63f509c5ba28a32391eb3fd&X-Amz-SignedHeaders=host&x-id=GetObject)

# Long Content

在构建布局时，考虑到长内容是很重要的。正如你在前面所看到的，当章节的标题太长时，就会被截断了。这是可选的，但是对于一些UI来说，考虑到这一点很重要。

对我来说，这是一种防御性的CSS方法。在“问题”真正发生之前就去解决它，这很好。

这里是一个人名的列表，现在看起来很完美。

![](images/4858354facbbf2bc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=5f321dc2185f92e1a6311f1abf67f1c4ae9ecfff60cdfc745f1092b2042129ff&X-Amz-SignedHeaders=host&x-id=GetObject)

然而，因为这是用户产生的内容，我们需要注意在内容太长的情况下如何布局。请看下图：

![](images/98cff14e907233c1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=02331ffa2d81c7a418dcc4a36135545d333baa849c546f5dec07cee7a83ca5dd&X-Amz-SignedHeaders=host&x-id=GetObject)

在这样的布局中，一致性很重要。为了实现这个一致性，我们可以通过使用`text-overflow`和它的朋友，简单地截断名字。

```css
.username {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

![](images/247fc96ab6e0bc98.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=339c7c93383f29e95772caf41f667cf9a5a03ae00d82c3835232fd3892c1ad8f&X-Amz-SignedHeaders=host&x-id=GetObject)

如果你有兴趣磨练你在CSS中处理长内容的技巧，我写了[一篇关于这个主题的详细文章](https://ishadeed.com/article/css-short-long-content/)。

## 防止图片被拉伸或者被压缩

当我们在网页上无法控制图片的长宽比时，最好能提前考虑，当用户上传的图片没有与长宽比对齐时，提供一个解决方案。

在下面的例子中，我们有一个带有照片的卡片组件。它看起来不错。

![](images/5e2247c4c5fe7fe6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=0c5b600b96b6ab0199bbcc7e8ae7ba318e1cf76881ee58da688f544ae6b5fab8&X-Amz-SignedHeaders=host&x-id=GetObject)

当用户上传了一张不同尺寸的图片是，它会被拉伸。这不是好事。看看图片是如何被拉伸的。

![](images/f31183c559a41be5.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=edb61e3ea050513fb50ac37e15e982ef4bdc68e27479b471f6a1d57d03cfa72b&X-Amz-SignedHeaders=host&x-id=GetObject)

最简单的修复方式是使用 CSS `object-fit` 。

```css
.card__thumb {
    object-fit: cover;
}
```

![](images/631dd14f490c9872.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=7cbeee68b19ccb6aefbb515eeba423d98208b9203ed531542da31b49666a1b0f&X-Amz-SignedHeaders=host&x-id=GetObject)

在项目层面上，我倾向于为所有图像添加对象匹配，以避免出现意外的图像结果。

```css
img {
    object-fit: cover;
}
```

在 Smashing Magazine 的[这篇文章](https://www.smashingmagazine.com/2021/10/object-fit-background-size-css/)中学习更多关于`object-fix`的内容。

## 锁定滚动链（Lock Scroll Chaining)

你是否曾经打开一个模态并开始滚动，然后当你到达终点并继续滚动时，模态下面的内容（主体元素）会滚动？这就是所谓的滚动链(Scroll Chaining)。

在过去的几年里，有几种hack方式可以做到这一点，但是现在，我们可以只使用CSS来做，这里要感谢`overscroll-behavior`这个CSS属性。

在下图中，你可以看到默认的滚动链行为。

![](images/c5a5d59894adf62a.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=7cada219c05e26edb249b666136a9febc15d0b19b7067aa27ed8de313ab35cc5&X-Amz-SignedHeaders=host&x-id=GetObject)

为了提前避免这种情况，我们可以将其添加到任何需要滚动的组件中（例如：聊天组件、移动菜单...等）。这个属性的好处是，在有滚动之前，它不会产生影响。

```css
.modal__content {
    overscroll-behavior-y: contain;
    overflow-y: auto;
}
```

![](images/a864b6f7088a2f78.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=f2728b8d4c9fe4a00d4c30fec4b40ef6f31b46f0da1ec57a6912db0b8cf9ef09&X-Amz-SignedHeaders=host&x-id=GetObject)

如果你想了解更多情况，我写了一篇[详细的文章]([https://ishadeed.com/article/prevent-scroll-chaining-overscroll-behavior/](https://ishadeed.com/article/prevent-scroll-chaining-overscroll-behavior/)

## CSS 变量降级

CSS 变量在网页设计中得到了越来越多的应用。我们可以使用一种方法，在CSS变量的值因某种原因为空的情况下，以一种不破坏体验的方式使用它们。

这在通过 Javascript 输入 CSS 变量的值时特别有用。下面是一个例子。

```css
.message__bubble {
    max-width: calc(100% - var(--actions-width));
}
```

 `--actions-width` 在 `calc()` 方法中被使用，并且它的值来自 JavaScript。假设因为某些原因，JavaScrippt失败了，会发生什么呢？`max-width` 将会被计算为 `none`

我们可以提前避免，在var()中添加一个回退的值。

```css
.message__bubble {
    max-width: calc(100% - var(--actions-width, 70px));
}
```

这样依赖，如果变量没有定义，就会使用降级（70px）值。这种方法可以在变量有可能失效的情况下使用。否则就不需要了。

## 使用固定宽度或者高度

破坏布局的常见情况之一是对一个有不同长度内容的元素使用固定宽度或者高度。

### 固定高度

我经常看到一个 `hero` 章节有一个固定的高度，而内容却大于这个高度，这导致了布局的破坏。不确定这看起来是什么样子的？在这里：

```css
.hero {
    height: 350px;
}
```

![](images/50fcc807e0f3809f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=1c8a161d976d33a7f997d2519366b60020a5091f25d56ec6b074dfeb65a06d4e&X-Amz-SignedHeaders=host&x-id=GetObject)

为了避免内容从`hero`中漏出，我们需要使用`min-height`来代替`height`。

```css
.hero {
    min-height: 350px;
}
```

![](images/bad2205ba0e8301d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=58d04d763fb2f80f6516e7e7dee947e25c983bd80e1c94222e2c536b1ada2dd2&X-Amz-SignedHeaders=host&x-id=GetObject)

这样依赖，如果内容变大了，布局也不会破坏。

### 固定宽度

你有没有见过一个按钮，它的标签离左右边缘太近？这是由于使用了固定宽度。

```css
.button {
    width: 100px;
}
```

如果按钮的标签比100px长，标签会离边缘很近。如果标签太长了，文字就会从里面溢出，这样不好。

![](images/66b65c470850e7e0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=14b6aeb82f0a8454a743104cb96c1c815d7784ff4fd5a1b2e63ecccb556b1b1a&X-Amz-SignedHeaders=host&x-id=GetObject)

要修复这个问题，我们可以简单地使用`min-width`代替`width`。

```css
.button {
    min-width: 100px;
}
```

# 忘记了 `Background-Repeat`

很多时候，当使用一张大的图片作为背景时，我们往往会忘记考虑设计在大屏幕上观看时的情况。那个背景会默认重复。

这在笔记本电脑的屏幕上大多不会看到，但在大屏幕上可以清楚地看到。

![](images/a80ebecda1c1a0a7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=2cfdd0d7c301a7a529f34e9898a715199c3235f6aa29225d8a592fbdf918faef&X-Amz-SignedHeaders=host&x-id=GetObject)

为了提前避免这种行为，请确保重置了 `background-repeat`

```css
.hero {
    background-image: url('..');
    background-repeat: no-repeat;
}
```

## 垂直方向的媒体查询

有时候，我们总是禁不住写一个组件，并且只通过调整浏览器的宽度进行测试。根据浏览器的高度进行测试可以发现一些有趣的问题。

这里有一个我见过很多次的问题。我们有一个带有主要和次要链接的aside组件。次要链接应该被定位在旁白部分的最底部。

考虑一下下面的例子。主导航和次导航看起来还不错。在我看到的这个例子中，开发者给二级导航添加了`position: sticky`，这样它就可以粘在底部了。

![](images/4bfc4584f7d4ed4a.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=aa0e33af972b0cb3cb94a19a85be233df87e16b7bd73e4df81d5f0ec69ad2bd9&X-Amz-SignedHeaders=host&x-id=GetObject)

然而，如果浏览器的高度变小了，布局就会破碎。注意这两个导航是如何重叠的。

![](images/991a1c0716c12cf8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051953Z&X-Amz-Expires=3600&X-Amz-Signature=e4c675d204d7e4c480e5c80aa78b2643ef232fb95329e36231cd9eca8a9d2077&X-Amz-SignedHeaders=host&x-id=GetObject)

通过使用 CSS 垂直媒体查询，我们可以避免这样的问题。

```css
@media (min-height: 600px) {
    .aside__secondary {
        position: sticky;
        bottom: 0;
    }
}
```

这样一来，只有当视图高度大于或者等于600像素时，二级导航才会被粘在底部。好多了，对吧？

可能有更好的方法来实现这一行为（比如使用 margin-auto），但我在这个例子中专注于垂直查询。

## 使用 `Justify-Content: Space-Between`

在一个flex容器中，你可能会使用 `justify-content` 来使子项之间有一定的间隔。如果有一定数量的子项目，布局看起来会很好。然而，当它们增加或减少时，布局会看起来很奇怪。考虑下面的例子。

![](images/f3ca6188f8529a72.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=aa281c5cb1214a7a7657b363db4b860d7a21c2905335fc7e8448159a21e90be8&X-Amz-SignedHeaders=host&x-id=GetObject)

我们有一个flex容器，它有四个子项。子项之间的间距不是`gap`或者`margin`，这是因为容器使有`justify-content: space-between`

```css
.wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
```

当子项的数量小于4个时，将发生以下情况。

![](images/6b66f4b8324762fb.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=748e099624a58247059edbcc3feb8d97413809a6eb4a6ec035f07c1af0830568&X-Amz-SignedHeaders=host&x-id=GetObject)

这样不好，有几种不同的解决方案：

- Margin

- Flexbox gap (谨慎使用)

- Padding (可以应用于每个子元素的父元素)

- 添加空的元素作为间隔

为了简单起见，我将使用`gap`

```css
.wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
```

![](images/adb75d335a5b495b.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=56727f7c0436c57530f3fbe11849c313eb3f6a02cae5c790b40d646197833294&X-Amz-SignedHeaders=host&x-id=GetObject)

## 悬停在图片上的文字

当使用悬停在一个图片附近的文字时，必须考虑到图像无法加载的情况。文本会是什么样子？

这是一个例子：

![](images/aa875b77fff68acc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=558506ec10448c483870f2e0c5e3d28e4a79ec87857e40ad485765a06022798e&X-Amz-SignedHeaders=host&x-id=GetObject)

文字看起来时可阅读的，但是，当图片加载失败的时候，它就会了。

![](images/65c6857bfddcab38.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=8ec6fcf9addbaa8468e5df8e2bb12e118f32ee440bb137ea9013024bbe25cf8f&X-Amz-SignedHeaders=host&x-id=GetObject)

我们可以通过给图片元素添加一个背景颜色来轻松解决。这个背景只有在图片加载失败的时候才会可见。这很酷，不是吗？

```css
.card__img {
    background-color: grey;
}
```

![](images/61871005ae59fea6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051953Z&X-Amz-Expires=3600&X-Amz-Signature=b7513a89692d7b5ba71b6523bab574f4d537ef717d1c83620c266501975558e9&X-Amz-SignedHeaders=host&x-id=GetObject)

## 当心CSS网格中的固定值

假设我们有一个网格，它包含一个aside和main。CSS 看起来是这样：

```css
.wrapper {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 1rem;
}
```

由于缺乏空间，这在小的视口尺寸上会出现问题。为了避免这样的问题，在使用上述CSS网格时，一定要使用媒体查询。

```css
@media (min-width: 600px) {
    .wrapper {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 1rem;
    }
}
```

## 只有在需要的时候显示滚动条

幸运的是，只有在内容较长的情况下，我们才能控制是否显示滚动条。也就是说，我们强烈建议使用`auto`作为`overflow`的值。

请看下面的例子。

![](images/243b61045b3295f1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=c343840ae83a6cf25a8309b8d9904317a9b1be5602e6946220149f6c32ccbc14&X-Amz-SignedHeaders=host&x-id=GetObject)

请注意，即使内容很短，也有一个滚动条可见。这对一个用户界面来说并不是好事。作为一个设计师，在不需要滚动条的情况下看到滚动条是很混乱的。

```css
.element {
    overflow-y: auto;
}
```

使用overflow-y: auto，滚动条只有在内容较长时才可见。否则，它就不会在那。下面是一个更新之后的图

![](images/a154677d8a8b51d8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=a45f77cfdb91c3e87a8ed830241c102f3cf28746d7f468382f32565fbaa00562&X-Amz-SignedHeaders=host&x-id=GetObject)

## 滚动条的槽

另一个和滚动相关的事情就是滚动条的槽。以前面的例子为例，当内容变长时，增加一个滚动条会导致布局转移。发生布局移动的原因是为滚动条预留了一个空间。

考虑如下图：

![](images/5b59edc19f5152b2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=7b0ba10aa37fb1cc55fb0f9d8f9455acb83799f36020ccae1bcca017e0a4fbfa&X-Amz-SignedHeaders=host&x-id=GetObject)

请注意，由于显示了滚动条，当内容变长时，它是如何移位的。我们可以通过使用 `scrollbar-gutter`属性来避免这种行为

```css
.element {
    scrollbar-gutter: stable;
}
```

![](images/5886820926d4eb33.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051953Z&X-Amz-Expires=3600&X-Amz-Signature=1c2cf79f10a48d8457f51906a4d9a39b9647897497e9ad68504834974d1c408e&X-Amz-SignedHeaders=host&x-id=GetObject)

## CSS Flexbox中的最小内容尺寸

If a flex item has a text element or an image that is bigger than is longer than the item itself, the browser won’t shrink them. That is the default behavior for flexbox.

Consider the following example.

如果一个flex项中的文本元素或图像大于或长于该项目本身，浏览器就不会缩小它们。这就是Flexbox的默认行为。

```css
.card {
    display: flex;
}
```

When the title has a very long word, it won’t wrap into a new line.

当标题有一个很长的单词，它不会插入到新的一行。

![](images/057dfa69941d389d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=2483021c6b98a4aa2c2a1291a4c69e46911cbd80d639515dca648b22264439a1&X-Amz-SignedHeaders=host&x-id=GetObject)

即使我们使用 `overflow-break: break-word`,它不管用。

```css
.card__title {
    overflow-wrap: break-word;
}
```

要改变这个默认行为，我们需要设置flex项目的`min-width`为`0`。这是因为`min-width`的默认值是`auto`，所以出现了溢出

```css
**.card__title {
    overflow-wrap: break-word;
    min-width: 0;
}**
```

同样的方法也适用于列flex容器，但是我们使用`min-height： 0`来代替。

![](images/dfdfe0321a47758a.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051953Z&X-Amz-Expires=3600&X-Amz-Signature=51d12be3ec37c0a8ecc068b6c2830c5defaa69b6d0f40abb95c94276fcf99300&X-Amz-SignedHeaders=host&x-id=GetObject)

## CSS 网格中的最小内容尺寸

与flexbox类似，CSS grid对其子项目有一个默认的最小内容尺寸，即`auto`。这意味着，如果有一个元素比网格项大，它将溢出。

![](images/7a5be9ad059a0281.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=2830b51b7aeb52933cc387aa8a4bfc09be2ad52a12e62a7b17101a669893878b&X-Amz-SignedHeaders=host&x-id=GetObject)

在上面的例子中，我们在主部分有一个 carousel。为了说明情况，这里是HTML和CSS。

```css
<div class="wrapper">
    <main>
        <section class="carousel"></section>
    </main>
    <aside></aside>
</div>
```

```css
@media (min-width: 1020px) {
    .wrapper {
        display: grid;
        grid-template-columns: 1fr 248px;
        grid-gap: 40px;
    }
}

.carousel {
    display: flex;
    overflow-x: auto;
}
```

由于carousel是一个灵活的容器，不会换行，它的宽度比主部分大，因此网格项也“尊重”它。结果，出现了水平滚动。

为了解决这个问题，我们有三种不同的解决方案。

- 使用 `minmax()`

- 为网格项设置 `min-width` 

- 为网格项添加 `overflow: hidden` 

作为一种防御性的CSS机制，我会选择第一种，即使用 `minmax()` 函数

```css
@media (min-width: 1020px) {
    .wrapper {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 248px;
        grid-gap: 40px;
    }
}
```

## 自动填充 VS 自动适应

当使用 CSS 网格的 minmax() 方法是，决定使用`auto-fit`还是`auto-fill`的关键字很重要。一旦使用不当，会导致意想不到的结果。

当使用minmax()函数时，auto-fit关键字将扩展网格项目以填补可用空间。而auto-fill将保留可用的空间，而不改变网格项的宽度。

![](images/b0630d83217c055e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051953Z&X-Amz-Expires=3600&X-Amz-Signature=1873d46cbe94e3b24b4a57fafb9c92fac6834ea12c728c1b8d383ef3095e1749&X-Amz-SignedHeaders=host&x-id=GetObject)

也就是说，使用`auto-fit`可能会导致网格项目太宽，特别是当它们小于预期时。考虑一下下面的例子。

```css
.wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 1rem;
}
```

如果只有一个网格项目，并且使用了`auto-fit`，该项目将展开以填充容器宽度。

![](images/12696528163347d6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051956Z&X-Amz-Expires=3600&X-Amz-Signature=a961685a898bc820ce2b46324071fc91918d730fc6d22439cb6163341adbe45c&X-Amz-SignedHeaders=host&x-id=GetObject)

在大部分时间，这样的行为是不需要的。所以在我看来，使用`auto-fill`是更好的。

```css
.wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 1rem;
}
```

![](images/82982ce9af242d32.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051955Z&X-Amz-Expires=3600&X-Amz-Signature=a737388928804bf8856b8af63534758cc4e47c8d3e3c0c7d465b0b5bac6f0f23&X-Amz-SignedHeaders=host&x-id=GetObject)

## 图片最大宽度

作为一般规则，不要忘记给所有的图片设置最大宽度：100%。这可以添加到你使用的 CSS reset 中。

```css
img {
    max-width: 100%;
    object-fit: cover;
}
```

# Position: Sticky Css Grid

你有没有试过对网格容器的一个子项使用 `position: sticky`？网格项目的默认行为是拉伸 stretch 。结果是，下面的例子中的旁置元素等于主部分的高度。

![](images/b052db0af4d45a1c.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051956Z&X-Amz-Expires=3600&X-Amz-Signature=11a2cca70a6305a97e59ef5e7b1e05c7b0e04f428814d094bf11b6771f134f83&X-Amz-SignedHeaders=host&x-id=GetObject)

为了让它能按照预期的那样工作，你需要重置 `align-self` property.

```css
aside {
    align-self: start;
    position: sticky;
    top: 1rem;
}
```

![](images/51a43d9c416c34b6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051956Z&X-Amz-Expires=3600&X-Amz-Signature=aa81bef3472d3eef813f9a840a00952aa1c20f1e4272bf64b1dc554124e81d3a&X-Amz-SignedHeaders=host&x-id=GetObject)

# 选择器分组

我们不建议将那些需要在不同浏览器上使用的选择器分组。例如，为一个输入的占位符设计样式，需要在每个浏览器上使用多个选择器。根据w3c的规定，如果我们把选择器分组，整个规则就会失效

```css
_/* Don't do this, please */_
input::-webkit-input-placeholder**,**input:-moz-placeholder {
    color: #222;
}
```

而是这样做：

```css
input::-webkit-input-placeholder {
    color: #222;
}

input:-moz-placeholder {
    color: #222;
}
```

# 这不是终点

这还不是结束，但我真的很喜欢记录所有这些技术。这是一个正在进行的防御性CSS技术的列表，我个人使用这些技术取决于我正在做的项目。如果你有什么建议，请通过Twitter @shadeed9联系我们
