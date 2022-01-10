---
title: Node学习笔记-Wrangling the File System
date: 2014-11-07 17:29:00
categories: ['Node.js']
tags: [笔记,Node.js]
---

在开发过程中，有时候会需要访问一些本地的文件，对文件进行一些操作。现在来对这方面的问题展开学习。下面是几个简单的例子，包括监听文件的变化和读取命令行中的参数

## 监听文件的变化

不急着动手，先想想如果做。首先，Node需要访问本地的文件，访问到文件后才有办法监听。Node自带`fs`模块可以帮助访问本地文件，更巧的是，fs模块本身就提供了[watch()](http://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener)这个方法。

```js
var fs = require('fs');

fs.watch('target.txt', function() {
    console.log("File 'target.txt' just changed!");
});

console.log("Now watching target.txt for changes...");
```

很简单的例子，自己的笔记就没有必要再解释了。无非就是，在引入fs模块之后，调用fs提供的watch方法对文件进行监听，监听时，每发生了修改就调用watch方法中的回调函数，打印出“File 'target.txt' just changed!”

## 现在来说说如何在Node中读取命令行中的参数

在上面的例子上稍微修改。需要用到新的东西：Node中的一个全局对象[`process`](http://nodejs.org/api/process.html#process_process)。

```js
var fs = require("fs"),
    filename = process.argv[2];

console.log(process.argv);

if(!filename){
    console.log("A file to watch  must be specified");
}

fs.watch(filename, function() {
    console.log("File " + filename + " just changed!");
});
console.log("Now watching " + filename + " for changes...");
```

保存文件之后，可以像这样启动它：

```bash
node watcher-argv.js target.txt
```
效果看起来和上面一个例子简直是一模一样的，但是后者的代码更加灵活，因为监控的文件是以参数的形式传递给函数，而不是写死在源代码中。

这个`process`全局对象可以在Node的任何地方使用，它是 EventEmitter的一个实例。[process.argv](http://nodejs.org/api/process.html#process_process_argv)是一个数组，它包含了命令行中的参数。第一个元素一定是"node"，或者`node.exe`的路径，第二个元素是当前执行的js文件的路径，第三个之后，包括第三个的元素都来自命令行参数。如果输出`process.aegv`的话，在我的window下，如果是CMD中，第一个元素是一个字符串“node”，在powershell中第一个元素是`node.exe`的路径。

## Spawning a Child Process

现在利用Node中的[`child-process`](http://nodejs.org/api/child_process.html)的模块，来增强我们的程序。

```js
var fs = require('fs'),
    spawn = require('child_process').spawn,
    filename = process.argv[2];
if (!filename) {
    throw Error("A file to watch must be specified!");
}
fs.watch(filename, function() {
    var ls = spawn('ls', ['-lh', filename]);
    ls.stdout.pipe(process.stdout);
});
console.log("Now watching " + filename + " for changes...");
```

修改文件之后，你会发现在终端中会这样显示：

```bash
-rw-r--r-- 1 CrispElite Admin 0B Dec 19 22:45 target.txt
```
关于`spawn`的使用，官方给出的[文档](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)很详细。
`spawn()`的调用实质上运行给的命令指定的进程，数组中的元素是这条命令的参数。参数默认情况下是一个空数组。这个方法返回一个`ChildProcess`对象，它的`stdin`,`stdout`,`stderr` 都是可以访问的数据流。而`pipe`的作用就是将子进程的数据直接发送到标准输出流中。


## Capturing Data from an EventEmitter






==！（未完……）


参考： **Nodejs the right way**

