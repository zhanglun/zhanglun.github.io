---
title: 「译」衡量Web性能，多快才算快？
categories: 博客译文
status: publish
date: 2022-05-08T10:21:00.000+08:00
tags:
  - Performance
cover: https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb

---


> 原作者:  [**Medhat Dawoud**](https://medhatdawoud.net/)  
>原文链接：[**https://medhatdawoud.net/blog/measuring-web-performance**](https://medhatdawoud.net/blog/measuring-web-performance)

在生活中，任何难题都必须是有目标性的，以便于定性，或者能够被证明是可定性的。在软件性能方面，我们可以通过一些指标来很衡量具体的事物，以证明是否存在性能问题，并且确保这个问题以后能被修复。在这篇文章中，我们将继续我们的性能系列，回答一些问题，比如<u>多快才算快？如何衡量web性能？有哪些测量工具？</u>

## 用户可能没有注意到

正如我们在第一篇文章中谈到的认真对待性能背后的动机，我们需要使网络对使用低端设备和慢速连接的人来说是快速的，但我们什么时候可以说 "好吧，这已经是足够的性能优化了”？这是一个好问题，要回答这个问题，我们需要问另外一个问题：性能仅仅和快有关系吗？简短的答案：No。

如果要展开讲，性能需要视情况而定。我们有多个指标来说明我们的应用是否有足够的性能。想象一下，你正在为一些iPhone用户开发一个应用程序，而JS包的大小是~2MB，我们也将假设他们连接到了快速的互联网上，你认为在这种情况下将包的大小优化为~1.5MB值得吗？ iPhone用户会注意到吗？我不这么认为，在我看来，在这种情况下，你是在浪费时间，而用户不会感觉到性能的不同。

从这里你可以知道，这取决于最终用户的设备和网络连接，也许并不总是需要深入优化的。

## 多快才算快？

换句话说，什么时候停决定停止做性能优化，你需要先掌握以下信息：

- 你的网站的大多数访问者所使用的常见设备

- 访客的常见连接条件是什么

- 他们所使用的设备尺寸是多少

![](images/22cf0a2bb2bfb6f7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=bd453599563b2c47bfe2928687e18a83b413fcae23277a3fc774f208579b94a4&X-Amz-SignedHeaders=host&x-id=GetObject)

因为这一切都与用户体验有关，在你了解了上述内容后，你将能够设定你的优化界限，要收集所有这些信息，你有几种方法，使用分析工具，例如上面截图中的谷歌分析，这些信息非常重要，只有在你真正需要的时候才会进行优化，而不是浪费时间去优化一些用户无法注意的东西。

## 如何测量性能？

在你了解你的用户之后，你可以开始测试你的应用程序，模拟你的用户的最坏情况，并继续测量，直到你发现你的用户群体中最少的设备部分和最少的网络连接条件下的良好性能的应用程序。

如果你想确保你的优化后的结果是符合标准的，你可以使用一些基于长期用户研究的指标，如Core Web Vitals，这只是谷歌的一个倡议，以提高网络的整体用户体验。

### Core Web Vitals

![](images/69a2504e3aa6452e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=19dcd83a4f80a485bf43d2361e7e5198b742237ed4fedee72e4ce24ac1f3b41b&X-Amz-SignedHeaders=host&x-id=GetObject)

2020年 Google 发起了这个倡议，开始时只有3个新指标。

- LCP（Largest Contentful Paint）用于衡量首次加载的体验，应该在上图的阈值内，低于2.5s为佳，不超过4s为差，需要采取行动

- FID（首次输入延迟）用于页面的交互性，它衡量你的网站响应用户输入的时间，可以是点击、滚动、输入......等，你需要把它保持在100ms以下。

- CLS（Cumulative Layout Shift）用于衡量布局的稳定性，如果页面中的某些元素在页面加载后突然出现，并将所有元素向下移动，这就是不稳定的布局，可以用这个指标来衡量，最好是尽可能地接近零。

如果你能成功地使你的网站通过这些指标，并使他们的网站至少有75%的页面保持在所述的阈值之内，你可以说这是足够快和性能的。

这些新指标的酷之处在于，它们是为了用户的利益。如果网站创建者不注意加强它们，他们就会失去SEO排名，这意味着失去在线业务，因为这些指标现在对 SEO 排名有贡献，而这是 Google 强推 Core Web Vitals 的聪明之处（他们的游戏他们的规则）。

## 测量工具

现在，在我们了解了我们需要测量的东西之后，是时候学习如何测量它了，有2种类型的测量工具。

### 1. 实验室测试（又称同情性测试）

在你非常了解你的用户之后，如前面所解释的，你可以使用一些工具来模拟用户的情况，例如，通过节流CPU来尽可能地接近用户设备的CPU，在开发模式下使用这个方法是非常好的，可以在启动之前为性能状态设定一个基线。

你可以测量LCP和CLS，但不能测量FID，因为它需要真实的用户交互，但你可以依赖另一个指标，它也可以反映用户的输入延迟，这就是TBT（总阻塞时间）。

⚙️**工具**

- [Light House](https://developers.google.com/web/tools/lighthouse) ：最常见的实验室性能测试，因为它是在你的chrome devtools中进行的，非常快，并给你一些审计，以便你可以提高你的页面速度。

	![](images/a77a0efae9015c80.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=51cac7a2e84894285ee9d4de5204b37bb5d6ef263859a6badcf57c6f792e8d14&X-Amz-SignedHeaders=host&x-id=GetObject)

- [**PageSpeed insights**](https://pagespeed.web.dev/) ：一个由 Chrome 团队提供的工具，它支持测量桌面和移动端的Core Web Vitals。

- [**GTmetrix**](https://gtmetrix.com/) ：另一个令人惊叹的网站，在世界某个地方的随机真实机器上测量Core Web Vitals，并给你提供实验室结果。

还有一些可以使用的工具，但这些是我经常使用的，而且是免费的。

> 注意：所有这些实验室测试工具和其他工具都会给你一些建议，并对perf、SEO、A11y等进行审计，如果你遵循这些建议，你就可以大幅增强你的应用程序。

### 2. RUM 测试

另一种测量性能的方法，RUM是 Real User Monitoring 的缩写，这意味着你使用的是基于真实用户体验的真实监测数据，当然这更准确，它测量的是真实用户如何体验你的网络应用的延迟、错误、布局转变，没有模拟，也没有假设。

你在这里得到了关于用户体验页面性能的详细信息，包括LCP、CLS和FID。

当你在做优化决定之前需要一些依据时，强烈推荐你使用这个方法，它比实验室测试更好，因为实验室测试有时可能会产生误导。

⚙️**工具**

- [**CrUX**](https://web.dev/chrome-ux-report-data-studio-dashboard/) ：数据工作室的Chrome用户体验报告，它非常好，而且随着时间的推移也会给出很好的报告，包括桌面和手机。

- [**CoreWebVitals lib**](https://github.com/GoogleChrome/web-vitals)：由Chrome团队创建的一个库，非常容易使用，只需决定你自己的记录方式，无论是本地还是在线日志服务。顺便说提一句，这个库在 Create React App 中开箱即用。

	```javascript
	import { getCLS, getFID, getLCP } from "web-vitals"
	getCLS(console.log)
	getFID(console.log)
	getLCP(console.log)
	```

- [**Vercel Analytics**](https://vercel.com/analytics)：真的是很好的工具，我最近改用 Vercel来 托管这个博客，对业余项目计划启用分析是免费的，但对团队和企业是高级的。

	![](images/62074f9ca728aa98.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051953Z&X-Amz-Expires=3600&X-Amz-Signature=38019cae075aab195ea1a47e805c7feae76dd3b18078e3db73fd04306eb77ee1&X-Amz-SignedHeaders=host&x-id=GetObject)

- [**Calibre**](https://calibreapp.com/)：这确实是一个很好的工具，有一个很好的用户界面，它是一个高级工具，有免费的试用版，但是他们也有一个免费的实验室测试页面，这里是我的网站的核心网络生命力报告。

- [**mPulse**](https://www.akamai.com/products/mpulse-real-user-monitoring)：这是一个来自著名的安全 Akamai Tools 的工具，根据一些朋友的评论，他们非常喜欢它，它也有一些分析，如 Google Analytics 和Core Web Vitals，这使得它更全面，它是高级的，有免费试用。

## 结束语

在这篇文章中，我们已经了解了测量网络性能的方法，应该测量什么，如何测量，以及你应该在多大程度上优化性能，最后还有一些你今天可以采用的工具。

性能是一个持续的过程，你增加的功能越多，对性能的挑战也就越大，通过不断的测量，你可以看到影响性能的因素，并及早消除它。
