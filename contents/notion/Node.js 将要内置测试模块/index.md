---
title: Node.js 将要内置测试模块
categories: 技术研究
status: publish
date: 2022-03-30T20:10:00.000+08:00
tags:
  - Node.js
cover: https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb

---


前两天上网冲浪时，在Node的Github仓库中，有这么一个Pull Request [test: add initial test module #42325](https://github.com/nodejs/node/pull/42325) ，顺着这个PR，可以找到一个[提案：Proposal: Adding a built-in test runner](https://github.com/nodejs/node/issues/40954) 。

原来关于Node.js内置测试模块的提案，而网友也提交了相关的实现。Node社区正在向Node核心添加一个内置的测试模块。它将以新的node:test模块的形式出现，暴露了一个用于创建和执行JavaScript测试的API。测试执行的结果将使用标准的 [TAP 格式](https://testanything.org/) 输出。

## 为什么要内置测试模块呢？

测试在软件开发过程中，从来都是最关键的一环。JavaScript作为一门动态语言，在测试阶段更加需要保证所有代码都被覆盖。

目前，在JavaScript生态中，还没有一个开箱即用的测试工具。正因为如此，想Mocha、Jest等第三方测试框架才有机会流行。但是使用这些三方框架，会让你的项目配置和工作流程变得复杂，也增加了维护成本。

还有一个JavaScript生态的通病就是，某一类问题的解决方案总是会有多种选择。你要是想弄清楚不同工具的使用，时常会让自己头疼。不同团队的选型会不一样，即使是相同的框架，最后在实践过程中也五花八门。原因在于缺乏强大的社区力量来帮忙解决这些问题。

所以，如果官方社区能够站出来，提供一个标准化的、通用性强的方案就至关重要。通过添加内置的测试模块，以轻量级的方式实现绝大多数测试框架提供的功能子集。这样以来，用户可以从一开就快速入门，社区也将出现标准化的测试方案。

## 它是如何工作的？

按照PR上给到的信息可以看出，将会增加一个叫做 `node:test` 的核心模块。目前的版本中还只是支持执行单个测试文件，但最后预期的效果是可以通过 `—test` 标志来自动执行配置中定义的所有测试。

```javascript
const test = require('node:test');
const assert = require('assert');

test('synchronous passing test', (t) => {
  assert.strictEqual(1, 1);
});
```

实际使用的方法相当简单，`test([name][, options][, fn])`。测试完成后返回一个Pormise。在目前的实现中，有一些突出的设计考虑：

- 当使用 —test 标志启动时，Node将执行所有包含测试模块的文件。

- 测试文件将在隔离状态下运行

- 一个文件的测试可以是同步的，也可以是异步的

	- 同步测试如果没有抛出异常，将被视为通过

	- 异步测试将返回一个Promise，如果返回的Promise没有拒绝，将被视为通过

- 测试上下文的test()方法允许创建子测试，每个子测试的执行情况与顶级测试功能完全相同

- 通过想测试传递跳过选项或调用测试上下文的skip()方法可以跳过单个测试。

比如，你可以跳过测试：

```javascript
test('skip option with message', { skip: 'this is skipped' }, (t) => {
  // 这里的代码将不会执行
});
```

你也可以创建子测试：

```javascript
test('top level test', async (t) => {
  await t.test('subtest 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('subtest 2', (t) => {
    assert.strictEqual(2, 2);
  });

});
```

对于一个函数来说，测试模块提供的test方法相当简单易懂，下面列出了不同参数的信息：

- name - 输出到报告的名称

- options - 该测试的配置参数，目前支持三个

	- concurrency { number } - 定义多少个测试并行运行

	- skip { boolean | string } - 如果为真则跳过测试。如果是string类型，跳过之后会在输出报告中打印对应的字符串

	- todo{ boolean | string } - 如果为真，将测试标记为todo。如果是string类型，跳过之后会在输出报告中打印对应的字符串

	- fn - 实际的测试函数本身，它将接受一个 TestContext 对象作为参数。传递给 fn 参数的 TestContext 对象可用于执行一些操作，如跳过测试，添加额外的 TAP 诊断信息，或创建子测试。

## 什么时候可以使用

目前还处于早期开发阶段，未来可能有变化，感兴趣的话可以关注上面提到的PR。如果想抢先体验，可以现在后续的[**nightly build**](https://nodejs.org/download/nightly/v18.0.0-nightly20220324094b2ae9ba/) 版本中使用。

## 结束语

Node在今年2月份正式添加了Fetch模块。在此之前，[request module](https://www.npmjs.com/package/request) 是Node中进行HTTP请求的最流行方法。但是，整个JavaScript生态系统迅速发展，新引入的模式使request过时了：一个重要例子是async/await。request API中没有这方面的规定，而且由于这些限制，该项目后来被废弃了。虽然后来有 Axios等优秀新生代出现，但谁知道会不会出现第二个request模块呢？

社区将 Fetch 纳入内置模块是不是也是一种标准化的体现呢？而现在又开始支持内置的测试模块，进一步将生态推向标准化。Node的未来应该会越来越好吧?
