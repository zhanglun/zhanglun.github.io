---
title: Storybook 使用手册——组织你的Storybook
categories: 技术研究
status: publish
date: 2022-06-20T21:19:00.000+08:00
tags:
  - Storybook
  - JavaScrtipt
cover: https://images.unsplash.com/photo-1519802772250-a52a9af0eacb?ixlib=rb-1.2.1&q=80&cs=tinysrgb&fm=jpg&crop=entropy

---


在前面的文章中，通过个人博客的案例，展示了如何在现有项目中集成Storybook。但是，实际情况是，随着项目的迭代和组件数量的增加，组织的复杂性也在增加。

![](images/fcfe840255960ddc.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=a68855be92a7ff84fb0d53fd000380ca7a30db04f3950cb36dc02dc0ddae4fdd&X-Amz-SignedHeaders=host&x-id=GetObject)

在日常工作中，针对Storybook的使用，曾思考过类似的问题：

- 这个组件的Story该放哪里？

- 是否需要展示组件的每一个State?

- 除了组件的文档，我该怎么组织页面文档？

- …

希望能够找到组织和维护Story的最佳实践。我试图去体验各种不同的Storybook输出的文档，希望借此来探索出适合自己的管理方式。在Medium上发现了设计师 [**Varun Vachhar**](https://varun.ca/) 的文章，作者在体验了60个个storybook项目之后，整理分享了一些心得：

- 📑 在组件层面组织 Story 的技巧

- 🔍 对组件进行分组和分类的策略

- ✍️使用文档页来展示设计标记和其他使用指南

看下来确实是一个不错的实践。

## 一个Storybook项目中包含了什么？

在深入探讨组织策略之前，让我们先介绍一些基本情况。Storybook主要包含两类：

- **Stories**：用于隔离和捕获组件的用例。 你可以指定重现特定状态所需的输入作为道具或通过模拟上下文和 API 调用。

- **文档页面**：使用MDX格式构建的自由格式页面。

![](images/5645fe118df47431.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=d7130491c38a4fc7be6439af27d78784319a5d537f791c8639a9c6fce2ec993a&X-Amz-SignedHeaders=host&x-id=GetObject)

## 介绍你的Storybook

在顶层，使用文档页面像用户介绍你的Storybook，并向他们展示如何开始。MDX的自由格式可以让我们完全控制内容，可以在JSX组件中写文档，也可以通过 MDX  嵌入各种文件。

让我们来看看每个Storybook需要的不同的顶级的页面。

### 介绍页

使用一个高层级的介绍页来开始你的Storybook。这个页面包含的内容可以有Storybook中包含了什么，谁负责维护以及如何报告问题等等。

![](images/1948fcc9a5f10e74.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=98b411c1d47ce2f4f975be0e4e2d647eec75a237fe95293fd63bbd294846f3ff&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/b37cf5e0da4c0980.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=726b20b2d3f089e575bfda7d100e8c4a75e133a539fccc8ad82fe998bccb5187&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/b166c8b7efa17dfd.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=eb1e3344039ed48d99feb8a1800e979530adbda6760f3110ee8f0d7d285a9b70&X-Amz-SignedHeaders=host&x-id=GetObject)

### 开始页面

入门部分介绍了如何使用Storybook的组件。这可能包括安装、加载CSS或配置主题的说明。奥迪设计系统为开发人员和设计师提供了入门指南。联合国世界粮食计划署有详细的使用指南来介绍架构选择。

![](images/1a9dec050770602a.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=2e3a4716e81cd30e4dbcd7d63afc1bc399e7e6ad1ef8add010a1d9e939c1c9e2&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/42ea86a7d76ee773.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=879893ca331a6aa03615f559c620497951b7f6fab115db3a12587d844f9c8f7c&X-Amz-SignedHeaders=host&x-id=GetObject)

### 贡献页面

记录如何贡献功能或错误修复。 贡献页面包括环境设置、如何提交代码和运行测试的说明。 这对于依赖社区支持的库和设计系统尤其重要。

![](images/51bad19eec1085dd.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=029584b28c539c664dcc1eaa0467352b521b7b5757f66529b64074a88b93818e&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/8f687c10e898ed3a.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=9a2a08f6efb2b486accc192d42de07f5de229f2672405c1411325802129e003c&X-Amz-SignedHeaders=host&x-id=GetObject)

### **Design Tokens**

组件通过design tokens获取视觉样式，例如颜色、排版、大小和图标。 将这些记录在案使开发人员可以方便地查看tokens映射到的值。使用 Storybook 自己的 Doc Blocks 来可视化调色板、排版和图标。 或者通过将自定义组件导入 MDX 文件来创建自己的块。

![](images/b6ebe2923c38c6d6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=317a8ed80dd0008cbb36ec4b846d38d6aca81a1f51fa1eb5bec4a860d2cc0961&X-Amz-SignedHeaders=host&x-id=GetObject)

### **ChangeLog**

健康的UI库和设计系统会不断地更新。你会在组件库中添加或删除组件或改变它们的API。更新日志页面将所有这些更新记录在一个地方。它也是一个分享你的版本策略和项目路线图的绝佳地点。

![Natura的Changlogs](images/0dfd714730b1dce5.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=9286ddc968dfd5db229fb1e20dad48b59b00aabdb69e9987f09e86f0ebfb30d4&X-Amz-SignedHeaders=host&x-id=GetObject)

![Vibe的Changelogs](images/7135bb841c9cd859.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=a6d30720b595ca881faaa80c636af24555bba8b1966e831c8653f4ed62134784&X-Amz-SignedHeaders=host&x-id=GetObject)

## 对组件进行分组和排序

组件的Story会自动组合在一起。 Storybook 还允许将多个组件分组到一个类别中，并在侧边栏中调整它们的顺序。 这使得浏览和发现 UI 元素变得更加容易。

![](images/6cda72aaf2798c33.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=74be35fe72a107284dc791d82f94bcdc83667e816c5934199056ea7aca2c0565&X-Amz-SignedHeaders=host&x-id=GetObject)

你可以通过给标题属性添加一个前缀来创建分组。每个分组级别都由一个`/`隔开。更多信息请参见：[命名组件和层次结构](https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy)。

```javascript
// Checkbox.stories.js
import { Checkbox } from './Checkbox';
 
export default {
 title: 'Design System/Atoms/Checkbox',
 component: Checkbox,
};
```

层次结构的选择取决于团队情况，没有对错之分。下面是几种比较受欢迎的组织技巧

### 原子设计方法论

由 Brad Frost 开创的 Atomic Design 是一种常见的 UI 分层系统。 它将组件分为五个级别：原子、分子、有机体、模板和页面。像 [Codecademy](https://gamut.codecademy.com/) 这样的团队遵循原子层次结构的所有级别。 而其他人，如[卫报](https://5dfcbf3012392c0020e7140b-gmgigeoguh.chromatic.com/?path=/story/layouts-showcase--article-story)和[联合国世界粮食计划署](https://uikit.wfp.org/docs/index.html?path=/story/getting-started-intro--page)，只使用一个子集。 请参阅 Brad 的 [Atomic Design and Storybook](https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology) 文章，了解他如何使用 Storybook。

![](images/b9d623b140b91b73.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=941a0adaa81b9e2e3f5b6df4b9d3737f5b6dde62e00fbedf764087a3abc329ee&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/04c17e8f028d1059.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=6aaf4421026aec05f9d723c7b06de94ac247f547132397b428000c89b47cb32d&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/607d0db9013d6016.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=aab2e1c824c5bf78be392a87039e41d2667b8e0d19327b4c4f0144f8898f8ebf&X-Amz-SignedHeaders=host&x-id=GetObject)

### 按功能分层

另一种受欢迎的实现是按照组件的功能类型或者在应用中的使用规则来分组。比如，表单控制，按钮，布局工具，卡片或者导航元素。

![](images/cfa9fed0af6a92cc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=bf3a53ac8c23f87f35b08d1e1d7f8214e6ce4f2d05e6b6189986e8f72c38260b&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/fa1fe307ea9e2f86.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=7d1b284fa2e40f0c28540acb106ad68a5c54fd1cc26560559f8a8f316a4f196d&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/e99c2ff9d49d9e78.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=67773c086b72250835fc15cc2fd71c5df2c761f9c46f1da24ef901d330c1c9e1&X-Amz-SignedHeaders=host&x-id=GetObject)

### 按组件状态分组

有些团队按照组件状态来分组。组件状态是可使用的、实验性的或者废弃的。这种策略在[IBM Carbon](https://react.carbondesignsystem.com/?path=/story/getting-started--welcome) and [Workday Canvas](https://workday.github.io/canvas-kit/?path=/story/welcome-getting-started--page) 中执行得相当不错。

![](images/604df7b4d93fa1d5.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=6af46cc3016ff1e802ecf24d52886df5c3bebefc1d45bea8556d7e6f7df2d9d5&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/ea7eec0be8739fa6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=456f16d23a4507575e5f42d94ad55d53731bf323a722468dd2615aa5b8a141df&X-Amz-SignedHeaders=host&x-id=GetObject)

## 编写Stories展示组件的功能

Stories 是一种灵活的结构，使你能够以多种方式展示UI。有许多类型的Story。有些Story可以帮助开发人员、设计师和项目管理人员检查用户界面看起来是否正确。而另一些则用于在浏览器中进行原型设计，而不需要触及代码。

每个组件的stories都依赖于组件的使用场景。例如，像Accordion这样的原子组件可能需要一个API细目，而你可能不需要一个连接的组件或页面。

![](images/48a992f5b3f28c41.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=dbd94a92324ae4a66738a77e0ce37d5b823aba88748a5e060cb4a74d558d61ba&X-Amz-SignedHeaders=host&x-id=GetObject)

对于每一种类型的组件，如果story的顺序保持一致，就可以使导航的阅读更加有预测性。Intuit公司的团队甚至写了一篇关于一致性如何改善他们的UI文档体验的[文章](https://medium.com/intuit-engineering/how-intuit-uses-storybook-plugins-d41c1eb6d806)。让我们来看看不同的Story类型。

### Overview story

首先要有一个文档页，解释该组件的作用以及何时使用它。这里也可以包含设计规格、视觉指南、响应性行为和可访问性的注意事项。

![](images/57d6b5dc9a50285f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=b74a0b855b8aeb179949dcc39c5e900c8c75749e7a46a70b3dfdd4180c9580e5&X-Amz-SignedHeaders=host&x-id=GetObject)

### Playground story

接下来是一个 Playground story。在这个 Story 中，组件所有的props都连接到了Storybook controls中。这对演示组件的API和在浏览器中进行原型设计很有效。

![](images/6785bbc1ceebf5a6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=63d5a04e2d3f913864e2e5bfbfe29a0b2a4729872d5c46514391c0f44bd7c736&X-Amz-SignedHeaders=host&x-id=GetObject)

### Feature stories

Feature stories 是一系列包含了组件所有状态和各种变量的story。对于Javascript函数来说，你需要编写测试用例来覆盖它们的使用场景。Feature stories 对 UI 起着相同的作用。

你甚至可以配合测试工具（如Chromatic、Jest或Axe）一起使用。关于这一点，请查看 [UI Testing HandBook](https://storybook.js.org/tutorials/ui-testing-handbook/)。

当你发布你的Storybook时，这些Feature stories 会渲染出可交互的组件来展示组件的功能，

![](images/fd1740ae17f07279.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=2533a72e23d63da24413ab9e31c21bdddf9a48580e43a807997ed1553a46040f&X-Amz-SignedHeaders=host&x-id=GetObject)

### Recipe stories

Recipe stories 展示了如何将一个组件与其他组件结合起来，以满足实际业务需要。与集成测试类似，它们展示了组件如何一起工作。例如，将输入法与标签和按钮组合起来，创建一个表单。或者展示如何使用ProductCard构建不同的布局。

![](images/9a18698441486931.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=bb298ca00cdae375088ea2ebec7e78b639fd724ba19deba9a341e38c90deb27a&X-Amz-SignedHeaders=host&x-id=GetObject)

## 结束语

Storybook 的目录结构对于开发者的生产力有很大的影响。缺少合理的层次结构会让使用者陷入疑惑，降低效率。

Varun 提到的这些层次组织的技巧，在一定程度上可以称之为 Storybook层次组织的最佳实践。

## 参考

- [Structuring your Storybook](https://medium.com/storybookjs/structuring-your-storybook-5148b116b874)
