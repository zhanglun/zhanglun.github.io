---
title: Electron 开发的 gulp 配置
date: 2016-08-05 16:30:38
categories: [前端]
tags: ['electron']
---

源自 Atom-shell 的 Electron 目前是一个很火的项目。已经有很多开发者基于 Electron 开发出了各种各样的桌面程序。在我看来，对于广大前端开发者来说，最为耳熟能详的应该是 Atom 和 VS Code。在 [Electron 的官网](http://electron.atom.io/apps/)上能够看到更多有意思的项目。

之前提到过，我的计划之一就是玩一下 Electron，打造一个桌面工具。上个星期经过几次摸索和调研确定了这个项目的可行性之后，开始着手打造。近几天慢慢的构建出基础的项目前端结构。

对于前端的技术选型已经没有之前那么纠结了，思考过后决定了：React。原因很简单，之前的一个小项目用的是 Vuejs 的一套体系，这次想换换口味。虽然之前我一直很不喜欢 React 那种模板和逻辑混合在一起的方式，但是很喜欢 Redux 的处理方式，所以忍不住试试看，到底是用 React 爽还是 Vue 爽。

了解过 Electron 的应该都知道它的 main process 和 renderer process。main process 使用 BroswerWindow 实例创建 web page，每个 BroswerWindow 实例在它自己的 renderer process 中运行 web page，每当 BroswerWindow 实例被销毁时，其对应的 renderer process 也会被终止。main process 管理所有的 web  page 及其对应的 renderer process 。

我觉得可以这么简单地理解的：如果将 renderer process 负责管理渲染的 web 页面所做的事情和浏览器类似，那么 main process 则是包裹着这个“浏览器”的外壳，将“浏览器”中的代码与系统底层联系在一起。

在实践过程中，我发现 main process 的文件不能使用 import（应该说是无法使用 ES6 语法），可以使用 babel 将使用 ES6 语法的代码编译成可执行的版本代码。而 renderer process 的代码则通过 webpack 打包 React 代码。

### gulp-babel 编译 main process 代码

通过 gulp 和 babel 可以很轻松地完成

```js
var path = require('path');
var gulp = require('gulp');
var babel = require("gulp-babel");

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');

// main process 的编译
gulp.task('babel:electron-main', function () {
  return gulp.src([APP_PATH + '/main.js', APP_PATH + '/main/**/*.js'], { base: APP_PATH })
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});
```

gulp 与 babel 的配合使用的更多细节可以参考 [babel](https://babeljs.io/docs/setup/) 和 [gulp-babel](https://github.com/babel/gulp-babel)。

React 的 webpack 配置在这里我就不重复了，到处都能找到。

### process 的重启和刷新

我发现在目前市面上Electron 的相关基础教程中，简单的介绍都是如此：

```js
// 安装 
npm install -g electron-prebuilt
// 启动
electron .

//更好一点的是按照官方给出的 quick start
npm start
```

但是这样有一个很直接的问题：每次修改 main process 相关代码之后需要重启，修改了 renderer process 相关代码之后需要手动刷新，这很影响开发体验。

renderer process 的 hot load 很好处理，和前端开发类似，react 和 vue 都有类似的工具，直接将前端开发中使用的配置挪过来就好。而 main process 的自动化则需要另寻办法，当然，也不难。使用 [electron-connect](https://github.com/Quramy/electron-connect) 可以很好的帮助我们解决这个问题，在 gulp 中设置好task 之后然后在 renderer process 和 main process 中的插入一段代码即可。

* gulpfile.js

```js
var gulp = require('gulp');
var gutil = require('gulp-util');
var electron = require('electron-connect').server.create();

gulp.task('watch:electron', function () {
  electron.start();
  gulp.watch(['./app/src/main.js', './app/src/main/**/*.js'], electron.restart);
  gulp.watch(['./app/dist/**/*.{html,js,css}'], electron.reload);
});
```

* RendererProcess

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
</head>
<body>

<!-- All of the Node.js APIs are available in this renderer process. -->
<!--We are using node <script>document.write(process.versions.node)</script>,-->
Chromium <script>document.write(process.versions.chrome)</script>,
and Electron <script>document.write(process.versions.electron)</script>.
and Node <script>document.write(process.version)</script>.
<div id="example"></div>
</body>
<script>
  	//创建 client
    require('electron-connect').client.create();
</script>
</html>
```

* MainProcess

```js
'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var client = require('electron-connect').client;

app.on('ready', function () {
  var mainWindow = new BrowserWindow({
    width: 400,
    height: 300
  });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Connect to server process
  client.create(mainWindow);
});
```

细心的同学可能会发现，在 watch 的 task 中，同时对 main process 和 renderer process 的代码监听，对应的操作是 restart 和 reload。reload 会刷新当前的页面，在这里 React 的 hot load 都可以不需要了。印象中好像 hot load 是不会整个刷新页面的，回头可以试试。

至此，只需要在终端中执行 

```js
gulp watch:electron 
```

就能达到开发过程中 electron 自动 restart 和 reload 的目的了。如果想看详细文档可以前往 [这里](https://github.com/Quramy/electron-connect)。

上述只是简单的例子，更多时候需要根据项目的规划做调整，一下是我的 gulpfile.js 

```js
var path = require('path');
var gulp = require('gulp');
var babel = require("gulp-babel");
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var electron = require('electron-connect').server.create();

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');

// 开发
var webpackConfigDev = Object.create(webpackConfig);
webpackConfigDev.devtool = 'eval-source-map';
webpackConfigDev.debug = true;

var devCompiler = webpack(webpackConfigDev);

// renderer process 的 webpack 编译
gulp.task('webpack:build-dev', function () {
  devCompiler.run(function (err, status) {
    if (err) {
      throw new gutil.PluginError('webpack:build-dev', err);
    }
    gutil.log('[webpack:build-dev]', status.toString({
      colors: true
    }));
  });
});

// main process 的编译
gulp.task('babel:electron-main', function () {
  return gulp.src([APP_PATH + '/main.js', APP_PATH + '/main/**/*.js', APP_PATH + '/constant/*.js'], { base: APP_PATH })
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});


gulp.task('watch', ['babel:electron-main', 'webpack:build-dev'], function () {

  electron.start();

  gulp.watch(['./app/main.js', './app/main/**/*.js'], ['babel:electron-main']);
  gulp.watch([APP_PATH + '/constant/*.js', './app/src/**/*.{html,js,css}'], ['webpack:build-dev']);

  gulp.watch(['./dist/main.js', './dist/main/**/*.js'], electron.restart);
  gulp.watch(['./dist/renderer/*.{html,js,css}', './dist/renderer/**/*.{html,js,css}'], electron.reload);

});

gulp.task('dev', ['watch']);

```

