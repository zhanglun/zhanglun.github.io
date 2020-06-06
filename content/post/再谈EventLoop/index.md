---
title: "再谈EventLoop"
date: 2019-08-20T16:56:04+08:00
draft: false
---

首先明确一点，事件循环这个概念并非JavaScript语言中的。在计算机科学中，事件循环作为编程结构或者设计模式，在程序中等待和发送消息或者事件。

EventLoop 也不属于 ECMAscript 规范中的一部分。ECMAscript只规定了JavaScript这门语言的特性。
就JavaScript语言本身而言，众所周知的单线程语言。但是其宿主环境可以是多线程的。在浏览器中除了JavaScript引擎线程之外，还有GUI渲染线程，事件触发线程等，在 Node.js 中有 `Libuv`提供线程池来模拟不同操作系统的异步调用。我们常说的 Javascript 的 EventLoop 依赖 JavaScript 依赖宿主环境的实现。

## 浏览器中的EventLoop

在[HTML规范](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)中有这么一段话：

> To coordinate events, user interaction, scripts, rendering, networking, and so forth, user agents must use event loops as described in this section. There are two kinds of event loops: those for browsing contexts, and those for workers.

为了协调事件、用户交互、脚本、UI 渲染和网络处理等行为，用户代理(浏览器)必须使用 `event loops`。而Event Loop 又可以通过[Agent](https://tc39.es/ecma262/#sec-agents)的类别分为三类。

所谓`Agent`，是一个包含执行上下文(exection contexts)，一个执行上下文栈(exection context stack)，一个运行时上下文(running execution context)，一个代理记录(Agent Record)和一个**执行线程(executing thread)**

浏览器中目前有包含三类：

1. similar-origin window agent：对应用户代理(浏览器)的主线程，执行上下文是全局执行上下文，其对应的事件循环称之为 `window event loop`。
2. dedicated worker agent, shared worker agent 和 service worker agent：这三个worker agent对应各自的执行线程和执行上下文，对应的事件循环称之为 `worker event loop`。
3. worklet agent：类似，事件循环称之为 `worklet event loop`。

每个事件循环会有一个或者多个`任务队列(task queues)`。任务队列是一系列`任务(task)`的`集合(sets)`。注意这里说的`任务队列(task queues)`是[ Sets](https://infra.spec.whatwg.org/#sets) 不是  [Queues](https://infra.spec.whatwg.org/#queues)。每一个事件循环都有一个 `当前执行中的任务(currently running task)`，这个任务可以为null，事件循环初始化时这个任务就是null。这个任务是可以重新载入。每一个事件循环都有一个 `微任务队列(microtask queue)`，微任务队列是一个 `Queue`。

### 处理模型(Processing model)

