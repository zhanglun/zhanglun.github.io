---
title: 浅谈 Design Token
categories: 解决方案
status: publish
date: 2022-07-04T19:00:00.000+08:00
tags:
  - CSS
  - 架构
cover: https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-1.2.1&q=80&cs=tinysrgb&fm=jpg&crop=entropy

---


我认为，在聊 Design Token之前，必须先理解什么设计系统（Design System）和 原子设计理论（Atomic Design)。

## 什么是设计系统

设计系统的定义是一系列文档元素、组件和区域、设计和前端指南的等完整的标准。有了设计系统，公司内各部门可以轻松地在应用程序的多个实例中重复使用样式和组件，快速构建一个或多个产品，从而简化大规模设计。

> A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications  
>                    ——Design better

![](images/b1fadc25b76285ad.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=80b4273db7b2876e4dc6c4d430d54bc80614173fe71ea3bf3b56330910c01ac4&X-Amz-SignedHeaders=host&x-id=GetObject)

简单来说，设计系统就是一套完整的标准，提供可复用的组件和模式来管理和简化设计和开发。

业界已经有很多成功的案例，比如像Google的Material Design，Spotify 的 Encore System 抖音的Semi Design等等。这些公司借助他们的设计系统，成功的改变了他们设计和开发产品的方式，通过一组可重用的组件，以及一套指导这些组件使用的规范，可以快速的完成设计和开发工作。

## 为什么需要设计系统

设计的标准化带来的是更高的效率和更好的质量：

- **可以快速、大规模地创建和复制设计（和开发）工作。**

	设计系统的主要好处是它们能够利用预制的 UI 组件和元素快速复制设计。团队可以继续一遍又一遍地使用相同的元素，极大减少重复开发的工作，同时还能保证输出的一致性。

- **减轻了设计资源的压力，专注于更大、更复杂的问题。**

	由于已经创建了更简单的 UI 元素并且可以重用，因此设计资源可以更少地关注调整视觉外观，而更多地关注更复杂的问题（如信息优先级、工作流优化和数据管理等）。

- **在跨职能团队内部和之间创建了一种统一的语言。**

	统一的语言可以减少因沟通不畅而浪费的设计或开发时间。例如，

	因为在设计系统中明确定义了某组件或者某交互的形式，大家对此形成默契，减少了多余的争议。

- **保证产品的视觉一致性。**

	设计系统提供了组件、模式和样式的单一来源，并统一了脱节的体验，使它们在视觉上具有凝聚力，并且似乎是同一生态系统的一部分。作为额外的奖励，任何主要的视觉品牌重塑或重新设计都可以通过设计系统进行大规模管理。

- **它可以作为初级设计师和内容贡献者的教育工具和参考**

	明确编写的使用指南和样式指南可帮助不熟悉 UI 设计或内容创建的个人贡献者入职，并为其他贡献者提供提醒。

## 什么是原子设计（Atomic Design)

在2013年网页设计师Brad Frost从化学中受到启发提出了原子设计的概念。

![](images/987545f59e00f961.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=d59d276bfe94799dcf29a8722d3d873c51547d5a0573db3f4114828ab0973c5d&X-Amz-SignedHeaders=host&x-id=GetObject)

化学反应由化学方程式表示，化学方程式通常显示原子元素如何结合在一起形成分子。在上面的例子中，我们看到了氢和氧如何结合在一起形成水分子。

**在宇宙中，原子元素结合在一起形成分子。这些分子可以进一步结合形成相对复杂的有机体。反过来宇宙中的所有物质都可以分解为一组有限的原子元素。**

- **原子**是所有物质的基本组成部分。每种化学元素都有不同的特性，它们不能被进一步分解而不会失去意义。

- **分子**是两个或多个原子通过化学键结合在一起的基团。这些原子的组合具有它们自己独特的特性，并且比原子更加有形和可操作。

- **有机体**是作为一个单元一起发挥作用的分子的集合体。这些相对复杂的结构可以从单细胞生物一直到人类等极其复杂的生物。

类比Web开发，任何一个网页都是由许许多多相同和不同的[HTML元素](https://madebymike.github.io/html5-periodic-table/)组成。

![](images/6e37db2c727858be.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=8491f344a26fc12c86df233b24ab8880b31ba0d602d0146b88fd3b4087bcff19&X-Amz-SignedHeaders=host&x-id=GetObject)

同理的，原子设计应运而生。原子设计是一种方法论，由原子、分子、组织、模板和页面共同协作以创造出更有效的用户界面系统的一种设计方法。

![](images/e756aad0002d491f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=6439d2862a6c834d714b10657392c46ba8a69c655dd3543d4ee8a87f8d80cf97&X-Amz-SignedHeaders=host&x-id=GetObject)

就像在化学中一样，原子是我们系统中最小的组成部分。而不是像氧或氢这样的原子，在设计中我们有按钮、输入、标签和其他在我们的设计中使用的小元素。

![](images/5271c0e707d05021.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=ca48e94f00079131f3de79334c75dfb6b9f58f02ed8e0cc262b8a3c9219fe5a8&X-Amz-SignedHeaders=host&x-id=GetObject)

## 什么是 Design Token 

而今天介绍的Design Token 则属于比原子还小的力度，是设计师可以创建的最小样式值。token映射的是构建和维护设计系统所需的所有值——间距、颜色、排版、对象样式、动画等。用于代替硬编码值，直接集成到我们的组件库和 UI 工具包，以确保所有产品体验的灵活性和统一性。

![](images/eb6ecc9024c46304.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=c64b3c80eeb0bf8604712f15c6fe83e4a4c5c2aa050917d7739252293174563f&X-Amz-SignedHeaders=host&x-id=GetObject)

Design Token 这个概念最初由[Salesforce](https://medium.com/salesforce-ux/living-design-system-3ab1f2280ef7)设计系统团队创建。他们发现，如果在现有设计元素之上建立一个新的数据层并从一个地方管理它们，可以**使用一个系统将其一致地扩展到所有平台**。Salesforce 将 Design Token 运用在公司的 [Lightning Design System](https://www.lightningdesignsystem.com/) 中，甚至开发了[Theo](https://github.com/salesforce-ux/theo)来帮助他们更快捷地使用Design Token。Salesforce 定义的 Design Tokens 包含：

- spacing

- sizing

- rounded corners

- font (字体) weights

- line heights

- font (字体) families

- border colors

- background colors

- text color

- shadows

- animation durations等

![](images/f57a270ca114e94d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=8c46e938d6fb525c7acaa9f48b52d4d42b3ba068dd327bfa5cebaff0369ddbb0&X-Amz-SignedHeaders=host&x-id=GetObject)

从前端开发的角度来看，Design Token 就是一个变量。

它是可存储的，可组织的，集中式的，可传播的。

- **可存储的**。在开发人员将Design Token 转换为对应的CSS之前，可以通过JSON或者YAML的文件形式将Token保存在文件中。

- **可组织的**。通过合理的方式管理Token， 定义一些规则和优秀的模式。比如将 #2b7de8 保存在名为 `blue-base` 的token中，我们可以将token与实际组件或者业务加上关联，让token更加语义化。使比如 header-color、primary-color等等。

![](images/9eb3baa44fae3ee0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=c3d8c2a592a0e6f99b05c14adc72d1cdfb0d72d900865a67284d681170f5d0c8&X-Amz-SignedHeaders=host&x-id=GetObject)

- **集中式的**。Design Token 是设计系统中的基础一环，可以在规范和流程中集中管理。对所有人来说都能很方便的使用。

- **可传播的**。Design Token 是设计和开发过程中的一部分。在这个过程中，可以用各种格式进行转换，例如CSS变量，Less变量，亦或者Andriod 或者IOS的变量。这样一来，可以被不同的产品、应用程序和技术使用，并保证可维护性和一致性。

![](images/bb178ff782e7a850.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=7e8b24dfee1bbb8fdfe4b1ee094f619d491b3b91187e5251c92b57ce5b0569e7&X-Amz-SignedHeaders=host&x-id=GetObject)

自Design Token 这个概念诞生出来，很多团队都在研究并实践。不同团队的 Design Token 的设计和分类，以及使用的各类工具都是不尽相同。例如常见的设计工具包括 Photoshop，Sketch，Figma等。Token翻译工具也有很多，Theo，Style Dictionary，Dize，Specify 等。

在2019年七月，W3C社区发起了 [Design Tokens Community Group](https://www.w3.org/community/design-tokens/2019/07/31/call-for-participation-in-design-tokens-community-group/) 。目标是提供一套标准，让产品和设计工具可以按照这个标准共享设计系统的设计风格。

在W3C的现阶段的标准中，将 Design Token 定义为一种方法论：

> Design tokens are a methodology  for expressing design decisions in a platform-agnostic way so that they can be shared across different disciplines, tools, and technologies. They help establish a common vocabulary across organisations.  
>  
>设计令牌是一种方法论，用于以与平台无关的方式表达设计决策，以便它们可以在不同的学科、工具和技术之间共享。它们有助于建立跨组织的通用词汇。

因为尚处于草案阶段 [https://design-tokens.github.io/community-group/format/](https://design-tokens.github.io/community-group/format/) ，就不在此赘述太多文档上的内容，有兴趣的朋友可自行阅读。

说了这么多，相信大家对 Design Token 应该有自己的理解了。已经知道“是什么“，接下来看看”该怎么做“。

## 创建和交付 Design Token

这里主要推荐的工具是 Figma Tokens 插件，它是一款基于 Figma 的插件，相对于 Figma 右侧面板原生自带的样式外，能够实现多层级的 Token 管理，同时插件内容能够与 Figma 设计文件实现实时联动。

![](images/cc93ec132dd87268.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=2f2b7bf4c82b4793b0164173270d7f5bec02a2a8c646c2f2d4aa4f462ec85588&X-Amz-SignedHeaders=host&x-id=GetObject)

使用插件后，设计师可以导出Token的JSON文件，文件内容大致如下：

```json
{
  "colors": {
    "tokenset": "global",
    "accent": {
      "base": {
        "type": "color",
        "value": "#F8C307"
      },
      "bright": {
        "type": "color",
        "value": "#FFD63B"
      },
      "lower": {
        "type": "color",
        "value": "#A48105"
      },
      "lowest": {
        "type": "color",
        "value": "#776002"
      }
    },
    "bg": {
      "base": {
        "type": "color",
        "value": "#F9FAFB"
      },
      "highlight": {
        "type": "color",
        "value": "#353535"
      }
    },
    "text": {
      "base": {
        "type": "color",
        "value": "#EDEDED"
      },
      "dark": {
        "type": "color",
        "value": "#000000"
      },
      "lower": {
        "type": "color",
        "value": "#AAAAAA"
      }
    }
  }
}
```

随后将JSON文件交付给开发人员，开发人员将JSON转换成需要的文件格式，比如Web端可以转换成Scss文件、Less文件或者CSS自定义属性的文件。

## 结束语

Design Token 在提升团队协作效率的同时，还能保证产出的质量，快速落地设计规范。如果产品研发过程中，需要设计师重度参与，非常推荐在日常工作流中引入 Design Token，即使业务上没有多终端或多产品的需求。团队在尝试和设计师合作，一起落地公司级别的设计系统，Design Token作为系统的基座部分，正是当前研究的一个小点。

在对Design Token有一定的了解之后，接下来将介绍如何使用工具将Token翻译成开发人员可以使用的资源，以及如何优雅地将整套过程接入到日常开发流程中。

## 参考

- [https://medium.com/salesforce-ux/living-design-system-3ab1f2280ef7](https://medium.com/salesforce-ux/living-design-system-3ab1f2280ef7)

- [https://www.uisdc.com/design-token-2](https://www.uisdc.com/design-token-2)

- [https://www.lightningdesignsystem.com/design-tokens/](https://www.lightningdesignsystem.com/design-tokens/)

- [https://atomicdesign.bradfrost.com/chapter-2/](https://atomicdesign.bradfrost.com/chapter-2/)

- [https://github.com/sturobson/Awesome-Design-Tokens](https://github.com/sturobson/Awesome-Design-Tokens)

- [https://thibault.mahe.io/talks/design-tokens/#1](https://thibault.mahe.io/talks/design-tokens/#1)
