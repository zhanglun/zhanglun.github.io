---
title: 小吐槽一下Node.js
categories:
  - 技术研究
date: 2024-03-02T10:40:00.000+08:00
tags:
  - Node.js
  - JavaScrtipt
draft: false
cover: ./images/cover.jpg
---

之前一直在Mac系统上开发Bookwise，一直没有遇到开发环境的问题。今天在家里的 Window8 上开发时，安装依赖包变遇到了node-gyp编译的问题。项目中依赖的 sqlite3 需要使用node-gyp，而背后又依赖Python环境。看到那填满了整个屏幕的红红绿绿的日志，不禁让我头疼。


前两天看到Node.js发的公告，v18的版本不再更新，推荐用户使用v20。截止到今天（2024-03-02）官方推荐的版本已经是v20.11.1。虽即使到了2024年，我还是能遇node-gyp的编译问题。


我可以安装Python来解决这个编译问题，但是在我看来，如果node-gyp的编译不依赖Python而是使用Node实现“自举”，会不会更好？


Node.js 跑得很快，社区也在不断涌现新鲜事物。在这看似繁荣发展的背后，技术迭代带来的债务不知是否有人关注。

