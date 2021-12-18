---
title: "如何在项目中接入single-spa"
date: 2020-11-28T20:27:18+08:00
draft: false
categories:
  - 技术研究
---

之前的文章[single-spa源码解析-registerApplication和start](../single-spa源码解析-registerapplication和start)中，对single-spa提供的两个关键方法的源码进行了简单分析。今天来讲一讲如何在项目中接入使用。

要创建一个single-spa应用程序，需要做三件事：

## 创建一个 html 文件

这个文件的目的就是加载single-spa的 config 配置，调用 `registerApplication()` 方法。

```html
<html>
<body>
	<script src="single-spa-config.js"></script>
</body>
</html>
```

## 创建一个single-spa-config。

只有先注册应用，single—spa才能知道在什么时机，如何初始化、下载、挂载和卸载对应的应用。通常会在配置文件中将应用注册。通过调用`registerApplication`方法来注册应用。例如：

```js
// single-spa-config.js
import { registerApplication, start } from 'single-spa';
// Simple usage
registerApplication(
  'app2',
  () => import('src/app2/main.js'),
  (location) => location.pathname.startsWith('/app2'),
  { some: 'value' }
);
// Config with more expressive API
registerApplication({
  name: 'app1',
  app: () => import('src/app1/main.js'),
  activeWhen: '/app1',
  customProps: {
    some: 'value',
  }
);
start();
```
### 参数

#### name

`registerApplication`的第一个参数表示应用名称，`name`必须是string类型

#### Loading Function or Application

`registerApplication`可以是一个Promise类型的 [加载函数](configuration#loading-function)，也可以是一个已经被解析的应用。

##### Application as second argument

你可以选择将一个已经被解析过的应用作为`registerApplication`的第二个参数，这个应用其实是一个包含各个生命周期函数的对象。我们既可以从另外一个文件中引入该对象，也可以在single-spa的配置文件中定义这个对象。

```js
const application = {
  bootstrap: () => Promise.resolve(), //bootstrap function
  mount: () => Promise.resolve(), //mount function
  unmount: () => Promise.resolve(), //unmount function
}
registerApplication('applicationName', application, activityFunction)
```

##### 加载函数

`registerApplication`的第二个参数必须是返回promise的函数(或["async function"](https://ponyfoo.com/articles/understanding-javascript-async-await)方法)。这个函数没有入参，会在应用第一次被下载时调用。返回的Promise resolve之后的结果必须是一个可以被解析的应用。常见的实现方法是使用import加载：`() => import('/path/to/application.js')`

#### 激活函数

`registerApplication`的第三个参数需要是一个纯函数，`window.location`会作为第一个参数被调用，当函数返回的值为真(truthy)值时，应用会被激活。通常情况下，Activity function会根据`window.location`/后面的path来决定该应用是否需要被激活。
另外一种场景是single-spa根据顶级路由查找应用，而每个应用会处理自身的子路由。 在以下场景，single-spa会调用应用的activity function

在以下情况下，single-spa将调用每个应用的活动函数：
- `hashchange` or `popstate`事件触发时
- `pushState` or `replaceState`被调用时
- 在single-spa上手动调用[`triggerAppChange`] 方法
- `checkActivityFunctions`方法被调用时

#### 自定义属性

`registerApplication`函数可选的第四个参数是 [custom props](/docs/building-applications/#custom-props)。这个参数会传递给 single-spa 的 `lifecycle` 函数。自定义属性可以是一个对象，也可以是一个返回Object的函数。如果自定属性是一个函数，函数的参数是应用的名字（application name)和当前`window.location`。

### 使用对象参数

```js
singleSpa.registerApplication({
  name: 'myApp',
  app: () => import('src/myApp/main.js'),
  activeWhen: ['/myApp', (location) => location.pathname.startsWith('/some/other/path')],
  customProps: {
    some: 'value',
  },
});

singleSpa.registerApplication({
  name: 'myApp',
  app: () => import('src/myApp/main.js'),
  activeWhen: ['/myApp', (location) => location.pathname.startsWith('/some/other/path')],
  customProps: (name, location) => ({
    some: 'value',
  }),
});
```

#### config.name
必须是字符串。

#### config.app
应用的定义，它可以是一个单spa生命周期的对象，加载函数或者与第二个参数相同。

#### config.activeWhen

可以是激活函数，比如参数API、路径前缀或两者的数组。因为最常见的用例是使用`window.location` 将其URL前缀进行匹配，所以我们帮你实现了这个方法。

#### Path prefix

路径前缀会匹配url，允许以下每一种前缀：

<dl>
  <dt>'/app1'</dt>
  <dd>✅ https://app.com/app1</dd>
  <dd>✅ https://app.com/app1/anything/everything</dd>
  <dd>🚫 https://app.com/app2</dd>
  <dt>'/users/:userId/profile'</dt>
  <dd>✅ https://app.com/users/123/profile</dd>
  <dd>✅ https://app.com/users/123/profile/sub-profile/</dd>
  <dd>🚫 https://app.com/users//profile/sub-profile/</dd>
  <dd>🚫 https://app.com/users/profile/sub-profile/</dd>
  <dt>'/pathname/#/hash'</dt>
  <dd>✅ https://app.com/pathname/#/hash</dd>
  <dd>✅ https://app.com/pathname/#/hash/route/nested</dd>
  <dd>🚫 https://app.com/pathname#/hash/route/nested</dd>
  <dd>🚫 https://app.com/pathname#/another-hash</dd>
  <dt>['/pathname/#/hash', '/app1']</dt>
  <dd>✅ https://app.com/pathname/#/hash/route/nested</dd>
  <dd>✅ https://app.com/app1/anything/everything</dd>
  <dd>🚫 https://app.com/pathname/app1</dd>
  <dd>🚫 https://app.com/app2</dd>
</dl>

#### 自定义属性

`registerApplication`函数可选的第四个参数是 [custom props](/docs/building-applications/#custom-props)。这个参数会传递给 single-spa 的 `lifecycle` 函数。自定义属性可以是一个对象，也可以是一个返回Object的函数。如果自定属性是一个函数，函数的参数是应用的名字（application name)和当前`window.location`

## 调用 singleSpa.start()

[`start()方法`](api.md#start) **必须**被single-spa配置文件的js调用，这时应用才会被真正挂载。在`start`被调用之前，应用先被下载，但不会初始化/挂载/卸载。`start`方法可以协助我们更好提升应用的性能。举个例子，我们可能会马上注册一个应用(为了立刻下载代码)，但不能马上就在DOM节点上挂载该应用，而是需要等一个AJAX请求(可能会获取用户的登录信息)完成后，再根据结果进行挂载。这种情况下，最佳实践是先调用`registerApplication`，等AJAX请求完成后再调用`start`。

```js
//single-spa-config.js
import { start } from 'single-spa';

/*在注册应用之前调用start意味着single-spa可以立即安装应用，无需等待单页应用的任何初始设置。*/
start();
// 注册应用。。。。
```

## 创建一个应用程序。

single-spa 应用与普通的单页面是一样的，只不过它没有HTML页面。在一个single-spa中，可以包含许多被注册的应用，而各个应用可以使用不同的框架。被注册的这些应用维护自己的客户端路由，使用自己需要的框架或者类库。应用只要通过挂载，便可渲染自己的html页面，并自由实现功能。“挂载”(mounted)的概念指的是被注册的应用内容是否已展示在DOM上。我们可通过应用的[activity function](#激活函数)来判断其是否已被挂载。应用在未挂载之前，会一直保持休眠状态。

在一个 single-spa 页面，注册的应用会经过下载(loaded)、初始化(initialized)、被挂载(mounted)、卸载(unmounted)和unloaded（被移除）等过程。single-spa会通过“生命周期”为这些过程提供钩子函数。
生命周期函数是 single-spa 在注册的应用上调用的一系列函数，single-spa 会在各应用的主文件中，查找对应的函数名并进行调用。所以注册的应用必须保证在其入口文件实现下面提到的各个生命周期函数。


- `bootstrap`, `mount`, and `unmount`的实现是必须的，`unload`则是可选的
- 生命周期函数必须有返回值，可以是Promise或者```async```函数
- 如果导出的是函数数组而不是单个函数，这些函数会被依次调用，对于promise函数，会等到resolve之后再调用下一个函数
- 如果 single-spa [未启动](api.md#start)，各个应用会被下载，但不会被初始化、挂载或卸载。
> **注**
>
> 在[single-spa 生态](ecosystem.md)中有各个主流框架对于生命周期函数的实现，这些文档有助于理解这些helper执行的操作，也有助于你自己实现生命周期函数。 

### 生命周期参数

生命周期函数使用"props" 传参，这个对象包含single-spa相关信息和其他的自定义属性。

```js
function bootstrap(props) {
  const {
    name,        // 应用名称
    singleSpa,   // singleSpa实例
    mountParcel, // 手动挂载的函数
    customProps  // 自定义属性
  } = props;     // Props 会传给每个生命周期函数
  return Promise.resolve();
}
```

#### 内置参数

每个生命周期函数的入参都会保证有如下参数：

- `name`: 注册到 single-spa 的应用名称
- `singleSpa`: 对singleSpa 实例的引用, 方便各应用和类库调用singleSpa提供的API时不再导入它。 可以解决有多个webpack配置文件构建时无法保证只引用一个singleSpa实例的问题。
- `mountParcel`: [mountParcel 函数](/docs/parcels-api.html#mountparcel).

#### 自定义参数

除single-spa提供的内置参数外，还可以指定自定义参数，在调用各个生命周期函数时传入。指定方法是在调用`registerApplication`时，传入第4个参数。

```js
// root.application.js
singleSpa.registerApplication({
  name: 'app1',
  activeWhen,
  app,
  customProps: { authToken: "d83jD63UdZ6RS6f70D0" }
});
singleSpa.registerApplication({
  name: 'app1',
  activeWhen,
  app,
  customProps: (name, location) => {
    return { authToken: "d83jD63UdZ6RS6f70D0" };
  }
});
```

```js
// app1.js
export function mount(props) {
  console.log(props.authToken); // 可以在 app1 中获取到authToken参数
  return reactLifecycles.mount(props);
}
```

可能使用到的场景：
- 各个应用共享一个公共的 access token
- 下发初始化信息，如渲染目标
- 传递对事件总线（event bus）的引用，方便各应用之间进行通信
注意如果没有提供自定义参数，则`props.customProps`默认会返回一个空对象。

### 下载(load)

注册的应用会被懒加载，这指的是该应用的代码会从服务器端下载并执行。注册的应用在[activity function](#激活函数) 第一次返回真值(truthy value)时，下载动作会发生。在下载过程中，建议尽可能执行少的操作，可以在```bootstrap```生命周期之后再执行各项操作。若确实有在下载时需要执行的操作，可将代码放入子应用入口文件中，但要放在各导出函数的外部。例如：

```js
console.log("The registered application has been loaded!");
export async function bootstrap(props) {...}
export async function mount(props) {...}
export async function unmount(props) {...}
```

### 初始化

这个生命周期函数会在应用**第一次**挂载前**执行一次**。

```js
export function bootstrap(props) {
  return Promise
    .resolve()
    .then(() => {
      // One-time initialization code goes here
      console.log('bootstrapped!')
    });
}
```
### 挂载

每当应用的[activity function](#激活函数)返回真值，但该应用处于未挂载状态时，挂载的生命周期函数就会被调用。调用时，函数会根据URL来确定当前被激活的路由，创建DOM元素、监听DOM事件等以向用户呈现渲染的内容。任何子路由的改变（如```hashchange```或```popstate```等）不会再次触发```mount```，需要各应用自行处理。
```js

export function mount(props) {
  return Promise
    .resolve()
    .then(() => {
      // Do framework UI rendering here
      console.log('mounted!')
    });
}
```

### 卸载

每当应用的[activity function](#激活函数)返回假值，但该应用已挂载时，卸载的生命周期函数就会被调用。卸载函数被调用时，会清理在挂载应用时被创建的DOM元素、事件监听、内存、全局变量和消息订阅等。
```js
export function unmount(props) {
  return Promise
    .resolve()
    .then(() => {
      // Do framework UI unrendering here
      console.log('unmounted!');
    });
}
```

### 移除

“移除”生命周期函数的实现是可选的，它只有在[unloadApplication](api.md#unloadapplication)被调用时才会触发。如果一个已注册的应用没有实现这个生命周期函数，则假设这个应用无需被移除。
移除的目的是各应用在移除之前执行部分逻辑，一旦应用被移除，它的状态将会变成NOT_LOADED，下次激活时会被重新初始化。
移除函数的设计动机是对所有注册的应用实现“热下载”，不过在其他场景中也非常有用，比如想要重新初始化一个应用，且在重新初始化之前执行一些逻辑操作时。

```js
export function unload(props) {
  return Promise
    .resolve()
    .then(() => {
      // Hot-reloading implementation goes here
      console.log('unloaded!');
    });
}
```

### 超时

默认情况下，所有注册的应用遵循[全局超时配置](/docs/api#setbootstrapmaxtime)，但对于每个应用，也可以通过在主入口文件导出一个`timeouts`对象来重新定义超时时间。如：

```js
// app-1.main-entry.js
export function bootstrap(props) {...}
export function mount(props) {...}
export function unmount(props) {...}
export const timeouts = {
  bootstrap: {
    millis: 5000,
    dieOnTimeout: true,
    warningMillis: 2500,
  },
  mount: {
    millis: 5000,
    dieOnTimeout: false,
    warningMillis: 2500,
  },
  unmount: {
    millis: 5000,
    dieOnTimeout: true,
    warningMillis: 2500,
  },
  unload: {
    millis: 5000,
    dieOnTimeout: true,
    warningMillis: 2500,
  },
};
```

> 注意`millis`指的是最终控制台输出警告的毫秒数，```warningMillis```指的是将警告打印到控制台(间隔)的毫秒数。

## 使用single-spa生态快速接入

single-spa官方团队针对不同流行框架创建了一些项目，帮助开发者使用自己选择的框架来创建single-spa应用。这里以React为例。

官方提供了[single-spa-react](https://github.com/single-spa/single-spa-react)，为React应用提供了生命周期钩子。

来看一下案例，singleSpaReact最后返回的包含各生命周期函数的对象：

```js
import React from 'react';
import ReactDOM from 'react-dom';
import rootComponent from './path-to-root-component.js';
// Note that SingleSpaContext is a react@16.3 (if available) context that provides the singleSpa props
import singleSpaReact, {SingleSpaContext} from 'single-spa-react';

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent,
  errorBoundary(err, info, props) {
    // https://reactjs.org/docs/error-boundaries.html
    return (
      <div>This renders when a catastrophic error occurs</div>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;
```

single-spa-react的源码不难，主要包括参数处理，和针对React框架的一些特点和语法实现了DOM的创建和插入，这里就不做过多分析，有兴趣的朋友可以自行阅读。

## 参考

1. [single-spa building-applications](https://single-spa.js.org/docs/building-applications)
2. [COnfiguring single-spa](https://single-spa.js.org/docs/configuration)
