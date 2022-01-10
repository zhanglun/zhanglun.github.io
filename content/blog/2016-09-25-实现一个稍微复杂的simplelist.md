---
title: 实现一个稍微复杂的simplelist
date: 2016-09-25 18:40:45
categories: ['JavaScript']
tags: [前端]
---

使用过一些清单类的应用程序，像 WunderList, Google Keep等，用来记录一些计划和安排，也试着将自己的计划安排同笔记一起整理在 Evernote 中，但是无论哪种方式用起来总觉得少了点什么，如果两者的一些功能能够结合起来，就很完美了。
<!--more-->

“todo”和“note”之间的关系本来就很微妙，一个“todo”写得详细点不就成了“note”吗？于是自己写了一个稍微复杂一点的清单程序，今天将项目总结整理在此。

我试着将 todo和 note 结合，可以像 WunderList 一样记录计划，又可以 Evernote 一样管理笔记。在开发过程中，反复调整和修改，最终发现：其实我只是做了一个支持 markdown 的 简易版WunderList :(。不管怎么样，能坚持下来就是值得鼓励的。整个工程前后端分离，后端实现不在此介绍

[前端代码地址](https://github.com/zhanglun/bluerobin)，
[后端代码地址](https://github.com/zhanglun/dockersite)，
[在线预览](http://zhanglun.github.io/bluerobin/)。

接下来，我简单介绍一下 simplelist 的前端实现过程。**注意，下面介绍的一些过程不是一蹴而就，是反复修改和整理得出的，比如技术选择和组件的划分。**

### 编写代码的前期准备工作

有三点

1. 确定需要实现的功能
2. 确定界面
3. 确定技术实现的方案

功能和界面先放一边，介绍一下采用的技术方案。其实也没啥可介绍的，前端老司机花样多，但是主流的套路也就那么几种，我选择“套路のVue”。Vue+ Vuex+ Vue-Router，其他配件像 Less，Webpack等大家也应该都清楚。用户登陆注册及接口的实现不在本文章的讨论中，下次再讲。

### 组件划分很关键

在 React 的组件化的划分方式中，将组件分成两种：Container Components和Presentational Components，容器组件和 UI组件。**容器组件负责数据和业务逻辑的处理，携带相关的内部状态，与数据有频繁的交互， UI组件只负责 UI 的呈现，没有任何的数据和逻辑的处理，组件的数据从容器组件传递进来（在 React中数据由 this.props 提供）**。如果一个组件既有 UI 又有业务逻辑，可以试着将它拆分成两个：一个容器组件，包着一个UI 组件。前者负责与外部的通信，将数据传给后者，由后者渲染出视图。

个人比较喜欢这种方式，组件变得纯粹。不过似乎在 Vue 生态圈中没有设计这方面的介绍，在后面我打算尝试使用这种方式，不过现在还是使用相对粗暴一点的方式来划分。


<!--![clipboard.png](http://7xnrrd.com1.z0.glb.clouddn.com/69e6d8817e6736eca54a1c4de7605c6a.png) -->

这是 WunderList 的界面，简单的分析之后，可以将其划分成如下形式，再详细一点的话可以看下图，如果坚持容器组件和 UI组件的形式开发的话，相对较复杂一点，而我选择先从简单的入手。想必你应该看过[TodoMVC](http://todomvc.com/)，而这样也是simplelist 的最简单也是最核心的功能。所以在实际操作过程中，我先将输入框和单个任务这两个组件实现。

<!--![clipboard.png](http://7xnrrd.com1.z0.glb.clouddn.com/523fa36927e62c3405235fec5e256b2b.png) -->

### Vuex

Vuex 是一个专门为 Vue.js 应用所设计的集中式状态管理架构。它借鉴了 Flux 和 Redux 的设计思想，但简化了概念，并且采用了一种为能更好发挥 Vue.js 数据响应机制而专门设计的实现。

在单独使用 Vue.js 的时候，通常会把状态储存在组件的内部。整个应用的数据和状态都是散落在各个组件。这样并没有有什么问题，组件的数据组建自己管理。有时候状态的一部分需要共享给其他的组件，此时使用事件系统，让一个组件把一些状态“发送”到其他组件，但是当项目一步步扩大时，事件流将变得繁杂，不利于调试和维护。此时 Vuex 可以帮助我们实现状态的管理。

Vuex 的四个核心概念分别是：

1. The state tree：Vuex 使用单一状态树，用一个对象就包含了全部的应用层级状态，作为一个『唯一数据源(SSOT)』而存在。每个应用将仅仅包含一个 store 实例。单状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。数据流都是单向的。
2. Getters：用来从 store 获取 Vue 组件数据。
3. Mutators：事件处理器用来驱动状态的变化，只有 mutation 可以改变状态。
4. Actions：可以给组件使用的函数，用来派发 Mutation。

Vuex 规定，属于应用层级的状态只能通过 Mutation 中的方法来修改，而派发 Mutation 中的事件只能通过 action。从组件出发，组件中调用 action，在 action 这一层级我们可以和后台数据交互，比如获取初始化的数据源，或者中间数据的过滤等。然后在 action 中去派发 Mutation。Mutation 去触发状态的改变，状态的改变，将触发视图的更新。

<!--![clipboard.png](http://7xnrrd.com1.z0.glb.clouddn.com/6c8f34ec28ec5c0492af7c23fafe7b58.png) -->

配合 Vuex 这样的数据管理架构，我只需要关心组件的状态变化，数据的变化和流通全部交给 Vuex。我需要维护一个数组，数组中每一个元素代表一个任务，输入框和任务上的编辑删除等操作，本质上都是对一个数组的操作。

### 给任务加上分类

我已经说过了，我要做的是复杂的 simplelist。所以，在完成了最简单的增删改的功能之后，要加上任务的自己的归属了。每个任务都归属于一个清单，有唯一的清单 id（list_id）。就像 WunderList 一样，左侧清单列表，右侧任务列表。这时候需要用到单页引用中必不可少的路由装置了。

从简单的开始，除了登录和注册（目前整合在应用中，更好的做法应该是登录注册作为两个单独的页面，这里只是个人 demo，暂不考虑），暂且只有一种路由状态，用来指向对应的清单，例如：`/lists/:id`。**下面是伪代码**

```html
<div id="app">
  <router-view></router-view>
</div>
```

```js
const ListItem =  {
  template: `<div class="item">{{item.title}}</div>`,
	props: ['item'],
}
const ListContainer = {
  template: `<div class="list">
      <h2>List {{ $route.params.id }}</h2>
		<div class="item-list">
			<list-item v-for="item in list" :item='item'></list-item> 
		</div>
    </div>`,
	components: {
		'list-item': ListItem,
	},
}

const router = new VueRouter({
  routes: [
    { path: '/lists/:id', component: ListContainer }
  ]
})
```

然后绑定好 `<router-link>`，路由切换就算完成了。但是光这样还不行，最关键的清单数据管理还没有加上。其实清单的数据状态管理与任务的管理大同小异，就不在此复述，你可以试着捋一捋。

### 弹层组件的管理

在创建和编辑清单的时候，需要弹出一个 modal 来方便操作（参照 WunderList）。这个时候就涉及到一个问题：这种定位不是很清晰的模块，该怎么来管理？

在我看来，这种类型模块大致有两类，一类是全局共享，可能在很多不同的组件中都需要调用，这种全局的我认为可以单独拿出来放在同一个地方供应用调用。另一类是只属于某一个组件，只会在固定的组件中被调用，这类模块推荐直接写在组件中，方便管理，最好是写在顶级组件中，避免一些全七八糟的样式冲突（目前我遇到的主要还是层叠顺序的问题）。

思路清晰之后，可以很顺利的完成清单的创建和编辑功能。


说到这，一个复杂的 simplelist 的基本结构和功能已经出现了。那么问题来了，你学到了吗？



