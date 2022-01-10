---
title: 如何将页面的footer保持在页面的底部一
date: 2014-08-25 22:25:00
tags: ['CSS', '兼容性']
---

我敢说这一定是很常见的问题，因为到处都是页面不够长而上吊的footer，而。比如这里：

<!--![image](http://ncuey-crispelite.stor.sinaapp.com/QQ20140825-1.png) -->

或者这里(￣◇￣;)：

<!--![image](http://ncuey-crispelite.stor.sinaapp.com/QQ20140826-1.png) -->

这是随手找到，没别的意思。只是想说明一下这个问题的普遍程度。以前自己也曾遇到过，查阅一番之后解决了，但是日子长了记忆早已模糊。最近在重构项目页面时，重新遇到了这个问题，遂决定好好理一理。在网上查阅一番之后发现，解决方案还是挺多的。一个个慢慢来。

第一次方法来自[《How to keep footers at the bottom of the page》]http://matthewjamestaylor.com/blog/keeping-footers-at-the-bottom-of-the-page)，作者是 [Matthew James Taylor的](http://matthewjamestaylor.com/about)。他的博客很有意思，几乎每一篇文章都有一个很有趣的banner，文章中还加着丰富的插图用以解释。

这个方法不算复杂，只需要 HTML 和 CSS 就能实现。
    
    HTML：
    
    <div id="wrapper">
       <div id="header"></div>
       <div id="container"></div>
       <div id="footer"></div>
    </div>
    
    CSS:
    
    html,body {
		margin:0;
   		padding:0;
   		height:100%;
    }
    #wrapper {
     	min-height:100%;
     	position:relative;
    }
    #header {
     	background:#ff0;
     	padding:10px;
    }
    #container {
     	padding:10px;
     	padding-bottom:60px;   /* Height of the footer */
    }
    #footer {
     	position:absolute;
     	bottom:0;
     	width:100%;
     	height:60px;   /* Height of the footer */
     	background:#6cf;
    }

<a class="jsbin-embed" href="http://jsbin.com/ziqim/15/embed?html,css,output">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

在原文中，作者为了兼容 IE6 和 IE5.5（原文发布的时间是2007年），为 #wrapper 添加了 `height:100%` ，在这里我就不加上去了。

上面的两串代码就能很好的将footer保持在页面的底部，页面的高度小于屏幕高度时，footer 会保持在屏幕的底部。原文demo请戳[这里](http://matthewjamestaylor.com/blog/bottom-footer-demo.htm)
稍微分析一下：为 html 和 body 定义 height 为1 00%，目的是为了在页面内容高度不够的时候，将页面撑开。CSS中 height 使用百分比定义时，参考的是父元素的高度，如果父元素没有定义高度，哪怕你设置个1 000%，高度也依旧是由内容决定。为 html 标签定义百分比高度时，它的参考值是浏览器窗口的高度，所以设置成100%时，html元素会铺满整个屏幕，不过没关系。只有在为 body 的父元素设置了高度之后，才能够为 body 设置百分比的高度。好的，这一步结束之后，设置wrapper的min-height为100%，这样即使wrapper中的内容高度不及浏览器的窗口高度或者说body的高度，wrapper的高度也会是100%，同时wrapper的高度也能随着内容的高度而变化，从body中溢出。因此，才能够做footer始终居于底部。

这种方法简单明了，今天就先说这一种方法吧，好晚了该睡觉了⊙﹏⊙b汗。



