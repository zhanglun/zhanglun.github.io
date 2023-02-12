---
title: '使用 React-Router 创建单页应用'
date: 2016-10-30 10:55:34
categories: ['前端']
tags: ['React', 'JavaScript']
---

最近业余时间在学习 React，配合 Redux 和 React-Router 正在不紧不慢地开发一个小工具[moviemaster](https://github.com/zhanglun/moviemaster)，用于管理硬盘中的电影剧集。在单页应用开发中，redux 并不是必须的，所以今天只讲讲 前端的路由系统以及 React-Router的简单使用。

<!--more-->

### 什么是路由

以下来自维基百科：：
>路由（routing）就是通过互联的网络把信息从源地址传输到目的地址的活动。路由发生在OSI网络参考模型中的第三层即网路层。
路由引导分组转送，经过一些中间的节点后，到它们最后的目的地。

这是网络工程中的术语，对大家而言，最熟悉的应该就是家里的路由器。路由是指路由器从一个接口上收到数据包，根据数据包的目的地址进行定向并转发到另一个接口的过程。放在 Web 上来说，url 就像是路由器中的路由表，每个 url 对应不同的页面或者内容，就像路由表中的的 IP 对应不同的网络一样。

先来看一下熟悉的套路：

<!-- ![image_1b0a1gh7ge4u1g9l14mm7v41me9a.png](http://7xnrrd.com1.z0.glb.clouddn.com/e4199599d78057a8efacb848ab9b5927.png) -->

在传统的网页应用架构中，客户端只是一个展示层，通过 url 访问服务端，服务端则根据自己的“路由表”将对应的页面分发给客户端。但是在这种模式下，ajax 异步加载的内容是无法通过url 记录的。无论你在页面上操作了多少，异步请求了多少数据，在每次重新访问同一个 url 时，服务端返回给客户端的内容都是一模一样。

<!--![image_1b0a24tg94le1p03qa76br1apfg.png](http://7xnrrd.com1.z0.glb.clouddn.com/6ed2cf502e487c30c3640a2026071f87.png) -->

如果前端有自己专属的“路由表”来分发页面上不同的状态，那不就行了？

### Hash 和 pushState

据我所知，目前有两种方式可以构建出前端的路由系统：url 中的#和 HTML5中的 history API。其原理如下：

1. 阻止标签的默认跳转动作。
2. ajax或者 Fetch 请求内容。
3. 将返回的内容添加到页面中。
4. 使用 hash 或者 pushState 修改 url。

#### 经典的 Hash 

\#代表网页中的一个位置。后面接着的字符，就是该位置的标识符。比如，

```bash
https://zhanglun.github.io/index.html#body
```

就代表网页 index.html 的 body 位置。浏览器读取这个 URL 后，会自动将body位置滚动至可视区域。标识符的指定有两个方法。

1. 使用锚点

```
<a name="body"></a>
```

2. 使用id属性

```
<div id="body" >
```

\#是用来指向文档的内容，属于浏览器的行为，与服务端无关，在 HTTP请求中也不会携带 \#及其后面的内容，对于服务端而言 [http://www.baidu.com](http://www.baidu.com) 和 [http://www.baidu.com#action=fuckbaidu](http://www.baidu.com#action=fuckbaidu) 返回给客户端的都是前者所分发的内容，但是在浏览器中可以通过 Window 对象上的 `location.hash` 进行操作。因此，在浏览器中可以通过 hash 来记录页面的状态，构建“路由表”。当页面状态发生变化时，hash 相应变化，重新加载时又可以通过 url 中携带的 hash 直接将页面设置到对应的状态。

比如：

```
http://www.example.com/
http://www.examplt.com/#edit
http://www.examplt.com/#settings
```

1. 访问`/`时，呈现主页。
2. 点击页面上的`Edit`按钮，页面呈现编辑对应的内容。通过 url 直接访问时，检查 hash 是否和 `edit` 匹配，如果匹配执行加载编辑内容的代码
3. 点击页面上的`Settings`按钮，页面呈现设置对应的内容。通过 url 直接访问时，检查 hash 是否和 `settings` 匹配，如果匹配执行加载编辑内容的代码。

以下是伪代码：

```js
  function hashHandler () {
    let key = location.hash.slice(1);
    switch(key) {
      case 'edit':
        renderEditPanel();
        break;
      case 'settings':
        renderSettings();
        break;
       default:
        break;
    }
  }
  window.onload = () => {
    hashHandler();
  }
  window.onhashchange = () => {
    hashHandler();
  }
```

#### HTML5 中的 pushState

pushState是 History API中的一个方法，其文档可以看这里 [MDN History](https://developer.mozilla.org/zh-CN/docs/DOM/Manipulating_the_browser_history)。它的功能简单的说就是：修改 url，添加历史记录。比如`/blogs`和`settings`对应的是两个页面，如果只是在页面上点击标签切换，需要做的操作只有：发送请求修改页面内容和调用 pushState 方法修改 url。问题来了，对于前端而言需要将其视为同一个页面，但实际上这两个 url 对于服务端来说是两个不同的请求，所以这里需要服务端的配合。

我的做法是：对应的url 返回的都是同一个页面，然后浏览器接受之后检查前端定义路由系统，执行响应的代码。这个方法可能会造成页面平白添加一个短暂的延迟，不过影响不是很大。

### React-Router的使用

目前来说，任何一个路由系统库或者框架，虽说是写法不一，但是都是在上述两种方式的基础上实现的。让我觉得耳目一新的是：使用路由嵌套的概念来定义 view 的嵌套集合，当一个给定的 URL 被调用时，整个集合中（命中的部分）都会被渲染。

```js
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './containers/App';
import MovieContainer from './containers/Movies';
import Detail from './containers/Detail';


let rootElement = document.getElementById('app');
render(
  <Router>
    <Route path="/" component={App}>
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="messages/:id" component={Message} />
      </Route>
    </Route>
  </Router>,
rootElement);
```

在入口文件中，引入 React-Router，以组件的形式在 render 中使用，上述代码配置结果如下：

| URL |	组件 |
|---|---|
|/ |App|
|/about|	App -> About|
|/inbox|	App -> Inbox|
|/inbox/messages/:id|	App -> Inbox -> Message|

在路由中，组件对应设置的子组件可以通过 `this.props.children` 渲染在父组件中

```js
class App extend Component {
  constructor(props) {
    super(props)
  }
  render() {
    <div id="app">
      <h1>Hello, world!</h1>
      {this.props.children}
    </div>
  }
}
```

当 URL 为 / 时， App 中并没有渲染任何的组件，render 中的 this.props.children 还是 undefined。此时可以使用 `IndexRoute` 来设置一个默认页面。

```js
render(
  <Router>
    <Route path="/" component={App}>
      {/* 当 url 为/时渲染 Welcome */}
      <IndexRoute component={Welcome} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="messages/:id" component={Message} />
      </Route>
    </Route>
  </Router>,
rootElement);
```

| URL |	组件 |
|---|---|
|/ |App -> Welcome|
|/about|	App -> About|
|/inbox|	App -> Inbox|
|/inbox/messages/:id|	App -> Inbox -> Message|

看一下这一段代码

```js
<Route path="posts" component={Post}>
  <Route path="users/:userid" component={User}>
    <Route path="messages/:messageid" component={Message} />
  </Route>
</Route>
```
此时匹配的路由分别是：`/posts`，`/posts/usres/:userid` 和`/posts/users/:userid/messages/:messageid`，可以看出，嵌套的`<Route>`所匹配的 url是包裹着它的 `<Route>`的 path “之和”。但是问题又来了，嵌套的好处在于路由之间结构清晰直观，但是也会导致 url 的不美观，试想`/posts/users/:userid/messages/:messageid`这么长的路由也是着实让人心累。React-Router 的配置提供了一个选择：将 Route 的 path 设置成绝对路径。同时可以使用`<Redirect/>` 将修改为绝对路径的路由重定向到之前的设置 

```js
<Route path="posts" component={Inbox}>
  <Route path="/users/:userid" component={Message}>
    <Route path="/messages/:messageid" component={Message} />
  </Route>
</Route>
```
| URL |	组件 |
|---|---|
|/posts|	App -> Post|
|/user/:userid|	App -> Post -> User|
|/messages/:messageid|	App -> Post -> User ->Message|


基础的配置完成之后，通过 `<Link>`自动或者通过`browserHistory`和`hashHistory`手动执行路由的跳转。
