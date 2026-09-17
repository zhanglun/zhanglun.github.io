---
title: Storybook 使用手册——组织你的Storybook
categories:
  - 技术研究
date: 2022-06-20T21:19:00.000+08:00
tags:
  - Storybook
  - JavaScrtipt
draft: false
---

在前面的文章中，通过个人博客的案例，展示了如何在现有项目中集成Storybook。但是，实际情况是，随着项目的迭代和组件数量的增加，组织的复杂性也在增加。


![1_OaeyZyGCrTMY0veInWxekg.gif](./images/2f8971fd846e2a56.gif)


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

![Untitled.png](./images/1b4df23cc8552dbc.png)


## 介绍你的Storybook


在顶层，使用文档页面像用户介绍你的Storybook，并向他们展示如何开始。MDX的自由格式可以让我们完全控制内容，可以在JSX组件中写文档，也可以通过 MDX  嵌入各种文件。


让我们来看看每个Storybook需要的不同的顶级的页面。


### 介绍页


使用一个高层级的介绍页来开始你的Storybook。这个页面包含的内容可以有Storybook中包含了什么，谁负责维护以及如何报告问题等等。


![Untitled.png](./images/9edd87fcf317940c.png)


![Untitled.png](./images/808a933657061ec1.png)


![Untitled.png](./images/57c51b3dac9c0d7e.png)


### 开始页面


入门部分介绍了如何使用Storybook的组件。这可能包括安装、加载CSS或配置主题的说明。奥迪设计系统为开发人员和设计师提供了入门指南。联合国世界粮食计划署有详细的使用指南来介绍架构选择。


![Untitled.png](./images/38f1d8663584bc27.png)


![Untitled.png](./images/bb283e3da2a3bd79.png)


### 贡献页面


记录如何贡献功能或错误修复。 贡献页面包括环境设置、如何提交代码和运行测试的说明。 这对于依赖社区支持的库和设计系统尤其重要。


![Untitled.png](./images/84162b31a7591eed.png)


![Untitled.png](./images/7c14f5e33ff9b31b.png)


### **Design Tokens**


组件通过design tokens获取视觉样式，例如颜色、排版、大小和图标。 将这些记录在案使开发人员可以方便地查看tokens映射到的值。使用 Storybook 自己的 Doc Blocks 来可视化调色板、排版和图标。 或者通过将自定义组件导入 MDX 文件来创建自己的块。


![Untitled.png](./images/5f81bbb2848899e6.png)


### **ChangeLog**


健康的UI库和设计系统会不断地更新。你会在组件库中添加或删除组件或改变它们的API。更新日志页面将所有这些更新记录在一个地方。它也是一个分享你的版本策略和项目路线图的绝佳地点。


![Natura的Changlogs](./images/3e2a33a8de83e7b5.png)


![Vibe的Changelogs](./images/2f0f7e11a42e9dd7.png)


## 对组件进行分组和排序


组件的Story会自动组合在一起。 Storybook 还允许将多个组件分组到一个类别中，并在侧边栏中调整它们的顺序。 这使得浏览和发现 UI 元素变得更加容易。


![Untitled.png](./images/627ca593ff0699b0.png)


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


由 Brad Frost 开创的 Atomic Design 是一种常见的 UI 分层系统。 它将组件分为五个级别：原子、分子、有机体、模板和页面。像 [Codecademy](https://gamut.codecademy.com/) 这样的团队遵循原子层次结构的所有级别。 而其他人，如[卫报](https://5dfcbf3012392c0020e7140b-gmgigeoguh.chromatic.com/?path=%2Fstory%2Flayouts-showcase--article-story)和[联合国世界粮食计划署](https://uikit.wfp.org/docs/index.html?path=%2Fstory%2Fgetting-started-intro--page)，只使用一个子集。 请参阅 Brad 的 [Atomic Design and Storybook](https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology) 文章，了解他如何使用 Storybook。


![Untitled.png](./images/092ebc266d39e070.png)


![Untitled.png](./images/986ee73b66ca9be8.png)


![Untitled.png](./images/d53df5d06ae9c203.png)


### 按功能分层


另一种受欢迎的实现是按照组件的功能类型或者在应用中的使用规则来分组。比如，表单控制，按钮，布局工具，卡片或者导航元素。


![Untitled.png](./images/38073fbd1b603208.png)


![Untitled.png](./images/a9a67a04d971677f.png)


![Untitled.png](./images/171cc2ea01b2e4e1.png)


### 按组件状态分组


有些团队按照组件状态来分组。组件状态是可使用的、实验性的或者废弃的。这种策略在[IBM Carbon](https://react.carbondesignsystem.com/?path=%2Fstory%2Fgetting-started--welcome) and [Workday Canvas](https://workday.github.io/canvas-kit/?path=%2Fstory%2Fwelcome-getting-started--page) 中执行得相当不错。


![Untitled.png](./images/d97ea446e2e34ff2.png)


![Untitled.png](./images/6f62b7243cf2b38c.png)


## 编写Stories展示组件的功能


Stories 是一种灵活的结构，使你能够以多种方式展示UI。有许多类型的Story。有些Story可以帮助开发人员、设计师和项目管理人员检查用户界面看起来是否正确。而另一些则用于在浏览器中进行原型设计，而不需要触及代码。


每个组件的stories都依赖于组件的使用场景。例如，像Accordion这样的原子组件可能需要一个API细目，而你可能不需要一个连接的组件或页面。


![Untitled.png](./images/46fdd249d00aed94.png)


对于每一种类型的组件，如果story的顺序保持一致，就可以使导航的阅读更加有预测性。Intuit公司的团队甚至写了一篇关于一致性如何改善他们的UI文档体验的[文章](https://medium.com/intuit-engineering/how-intuit-uses-storybook-plugins-d41c1eb6d806)。让我们来看看不同的Story类型。


### Overview story


首先要有一个文档页，解释该组件的作用以及何时使用它。这里也可以包含设计规格、视觉指南、响应性行为和可访问性的注意事项。


![Untitled.png](./images/6977f1586b55728d.png)


### Playground story


接下来是一个 Playground story。在这个 Story 中，组件所有的props都连接到了Storybook controls中。这对演示组件的API和在浏览器中进行原型设计很有效。


![Untitled.png](./images/6044bc04adaad2fc.png)


### Feature stories


Feature stories 是一系列包含了组件所有状态和各种变量的story。对于Javascript函数来说，你需要编写测试用例来覆盖它们的使用场景。Feature stories 对 UI 起着相同的作用。


你甚至可以配合测试工具（如Chromatic、Jest或Axe）一起使用。关于这一点，请查看 [UI Testing HandBook](https://storybook.js.org/tutorials/ui-testing-handbook/)。


当你发布你的Storybook时，这些Feature stories 会渲染出可交互的组件来展示组件的功能，


![Untitled.png](./images/a480c5f242623aed.png)


### Recipe stories


Recipe stories 展示了如何将一个组件与其他组件结合起来，以满足实际业务需要。与集成测试类似，它们展示了组件如何一起工作。例如，将输入法与标签和按钮组合起来，创建一个表单。或者展示如何使用ProductCard构建不同的布局。


![Untitled.png](./images/4501bd2b9890be63.png)


## 结束语


Storybook 的目录结构对于开发者的生产力有很大的影响。缺少合理的层次结构会让使用者陷入疑惑，降低效率。


Varun 提到的这些层次组织的技巧，在一定程度上可以称之为 Storybook层次组织的最佳实践。


## 参考

- [Structuring your Storybook](https://medium.com/storybookjs/structuring-your-storybook-5148b116b874)
