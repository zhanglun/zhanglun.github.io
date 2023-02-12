---
title: 「译」为什么性能很重要
categories: 博客译文
status: publish
date: 2022-04-20T14:00:00.000+08:00
tags:
  - Performance
cover: https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb

---


> 原作者:  [**Medhat Dawoud**](https://medhatdawoud.net/)  
>原文链接：[**https://medhatdawoud.net/blog/why-performance-matters**](https://medhatdawoud.net/blog/why-performance-matters)

现如今，性能优化是所有web开发者的基本技能了，不再是可有可无的，也不是可以吹嘘的花哨东西，在这篇文章中，我将解释为什么性能如此重要，为什么有些人仍然回避它。让我们开始吧🚀。

性能不仅是指速度，一般来说，它在本质上为了用户体验。所以如果用户对你的网站感知足够好，那么你的性能其实并不差。加强性能的优化会有助于使Web更容易被他人使用，但主要因素是用户以及他们对你的Web应用的感受。

## 页面大小的中位数在增长

![](images/6ca75c98f812c32f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=e9561ef45c46e838d8de54c4884e747e765339a4a895724734cd103f54b71ec9&X-Amz-SignedHeaders=host&x-id=GetObject)

在过去十年，页面大小的中位数已经变成了6倍。对于移动网页来说，2012年3月约为300KB，而现在2022年三月约为2000KB了。这是一个巨大的增长，但是对于所有现代化的网站建设方式来说，这是正常的。

另一方面，硬件和设备也得到了增强，以应对新的软件需求，但是价格确实更高了。并非所有人都能负担得起。大多数互联网用户正在使用中端或低端设备，如果忽略了他们，你将忽略很大一部分市场，并且可能会失去潜在客户。

## 糟糕的连接(3G | 2G)仍然是个问题

![](images/5b9f11c17d44c334.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=a773cbade0727a39e736abfcca5e52a083cfa7e67e08e2c30d3e2ba2e0e1670c&X-Amz-SignedHeaders=host&x-id=GetObject)

这不仅和设备有关，在全世界范围内，网络并非都是最好的。根据2021年的网络年鉴，很大一部分网络用户，大约25%仍然在使用 3G 或低于 3G 的网络，这使得他们的web可用性成为开发者的一个挑战。

这不仅仅和网络糟糕的国家或者地区有关，即使你生活在一个能够提供良好网络 链接的国家，你也可能处于4G或5G不太稳定的地方，比如在室内咖啡馆或者机场。

## Web用户是没有耐心的

![](images/1950166725a44828.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=a65993aed1e2eb7b93f429f9a1cdd0eb1aee384fa3d6ae9585d159e9280d124e&X-Amz-SignedHeaders=host&x-id=GetObject)

另一个原因是Web用户是没有耐心的。Web是非常开放的，任何一种服务都有很多选择，如果你让用户等待你的网站加载太长时间，他可以直接去寻找你的服务的替代品。

研究表明，如果你让用户等待3秒，跳出（离开登陆页面）的概率就会增加32%，而5秒就会增加到90%，更多的等待时间会导致更多的客户不满，而你将永远失去这些访客。

## Core Web Vitals 影响 SEO

2021 年，Google 推出了一项名为 Web Vitals 的计划，旨在让网络更加用户友好和易于访问，并强制网络创建者遵循他们添加的新指标来衡量它们并使他们为谷歌 SEO 排名做出贡献。是什么让每个人都开始质疑他们的网站，我网站的用户体验会影响我的 SEO 排名吗？ 很可能是的，这当然是为了Web用户的利益。

![](images/e8d825301ea5a5b6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=04079caec4950693ca99fcba6675666574b70e0b057091882fb00c8ac99b4f98&X-Amz-SignedHeaders=host&x-id=GetObject)

Web Vitals开始时只有3个新指标。LCP（Largest Contentful Paint）、FID（First Input Delay）和CLS（Cumulative Layout Shift），他们把它们称为Core Web Vitals，这个名单还在不断扩大，它们现在对你的网站的搜索排名贡献很大，至少75%的网站页面应该遵循一些阈值，我将在后面的文章中解释。

## 那为什么开发者们忽略？

如果性能如此重要，你可能会想，为什么开发人员不怎么关注它，实际上有一些很好的理由。

- **诊断问题可能是非常棘手的，并且需要工具**：它甚至可能需要几天的时间才能从页面加载时间中节省几毫秒，因为延迟的原因可能有很多，学习诊断问题所需的工具也使它有点乏味，但完全值得。

- **很难获得的真正的胜利**：研究表明，用户不会觉得一个网站更快，除非你最近的竞争对手或你的最新版本有至少20%的提升，让用户注意到它就是所谓的“真正的胜利”。这可能有点打击积极性，但让性能成为一个持续的任务应该会有帮助。

- **需要对网络/浏览器的工作原理有深刻的了解**：可能需要一些网络知识，以确保你所要求的就是你所得到的，同时以最好的方式消耗你的资源，另一方面，你需要了解客户端时如何处理你的网站，了解主线程以及如何不使其繁忙是至关重要的，不了解这些可能会阻止你做出一个好的优化。

- **因为也许YAGNI**：这是一个编程原则的缩写，意思是 "你不会需要它"，在一个应用程序的某些早期阶段，你可能不需要快速的网站，核心的MVP功能可能在项目阶段得到更多的优先权，推迟性能增强是可以的，直到你确定这些功能会在生产中出现。

> YANGI原则  
>英文全称是：You Ain’t Gonna Need It。直译就是：你不会需要它。意思非常简单：仅在您真正需要它们时才去做，而不是在您认为或预见将来可能需要它们时就提前做了！实际上，这条原则的核心思想就是：不要做过度设计。

以上所有的原因并不是忽视性能问题的借口，它可能是你性能优化之旅的一个动力和开始方式。

## 结束语

性能对用户体验和业务都很重要，它不是可有可无的。因为如果你忽视了 Core Web Vitals，你将失去你的排名。学习所需的工具，学习网络和浏览器的工作原理，确保以一种对所有 Web 用户（包括使用低端设备和连接速度较慢的人）都可以访问的方式构建应用程序。
