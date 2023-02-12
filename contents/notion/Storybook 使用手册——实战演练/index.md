---
title: Storybook 使用手册——实战演练
categories: 技术研究
status: publish
date: 2022-06-04T15:00:00.000+08:00
tags:
  - Storybook
  - JavaScrtipt
cover: /images/page-cover/nasa_multi-axis_gimble_rig.jpg

---


在Storybook使用手册系列文章中，介绍了Storybook的基本概念和文档编写方式。在这篇文章中，将在一个现有项目中实操 Storybook 的接入过程。

> 选用我的[个人博客](https://github.com/zhanglun/zhanglun.github.io) 作为演示项目，处于以下几点考虑：  
>博客是典型的Web应用，可以提供较为全面的实操演练；博客中组件数量不会太多，工作量不大；方便博客后续的开发维护

[https://storybook.js.org/showcase/](https://storybook.js.org/showcase/) 有不少优秀的案例，感兴趣的同学也可以参考。

## 初始化

进入项目中，执行Storybook提供的初始化命令，在项目中快速初始化对应的配置。

```javascript
npx storybook init
```

Storybook会创建两个目录：`.storybook` 和`stories` 。前者是Storybook的配置目录，后者是Storybook的文档目录，可以在配置中自定义修改。

![](images/c4ea9ec9ce157fed.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=d752248c1cd7e3d4573d9c78b46496af10bd3d8d2795ec5288e95c2d4c0e8d8d&X-Amz-SignedHeaders=host&x-id=GetObject)

 同时，对`package.json`也有修改，除了增加Storybook需要的依赖之外，还增加了两个script命令，用于启动开发服务器和打包文档

![](images/95663a3d4cc5c9ee.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=b17eb67c2d016f88871a4bfbb76692c072c46c63ebfb1ce1e53ff03455a0d5ec&X-Amz-SignedHeaders=host&x-id=GetObject)

其实到这一步，Storybook的初始化就已经完成了，非常简单。不得不说，Storybook提供的工具链对与开发者来说确实非常友好。

> 社区有很多优秀的开发工具，提供了非常好的开发体验。应该多多学习这种从产品的角度考虑用户体验的创作思路。  
>  
>Storybook 默认创建`stories`目录，提供了一些demo。本人倾向于将组件的Story的配置于组件代码放在一起维护。

## 编写组件文档

项目中有一个圆形箭头，用于链接的装饰。

![](images/edfbfdad82dcef45.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=f5743401de6c6e724beb706e07007df7afe9e162901d6319a13288102e3512ea&X-Amz-SignedHeaders=host&x-id=GetObject)

![](images/86c46aa234825a7c.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=9b13847318be9ff4306dd82be6ef03e8c4c65a413eead94b5ec9a87527eb0530&X-Amz-SignedHeaders=host&x-id=GetObject)

我已经将其封装为CircleArrow组件，现在来为它增加一个漂亮的文档。在组件所在目录中创建一个`CircleArrow.stories.tsx` 文件。

```javascript
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CircleArrow } from './index';

export default {
  title: 'Component/CircleArrow',
  component: CircleArrow,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CircleArrow>;

const Template: ComponentStory<typeof CircleArrow> = (args) => <CircleArrow {...args} />;

export const Default = Template.bind({});

Default.args = {
  size: 24,
  rotate: 0,
  theme: 'dark',
};

export const Theme = Template.bind({
});

Theme.args = {
  theme: 'dark',
};

export const Rotate = Template.bind({
});

Rotate.args = {
  rotate: 0,
  size: 24,
};
```

![](images/fee8deac5d2ea760.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=2899a17a5d5681e32ed4e157927b84ce32d96c6854d78d868e7d7c9546a141a3&X-Amz-SignedHeaders=host&x-id=GetObject)

CircleArrow组件启用了CSS Module，样式中使用了全局的CSS变量。默认情况下Storybook无法找到对应的样式，我们需要增加一些额外的配置。

- 在`.storybook/preview.js`中导入全局的样式，将作用在所有的Storybook页面

```javascript
import '../src/index.css';

// ... rest of the settings

```

- 在 `.storybook/main.js` 中增加自定义 webpack 配置

```javascript
module.exports = {
  webpackFinal: async (config) => {
    // Prevent webpack from using Storybook CSS rules to process CSS modules
    config.module.rules.find(
      (rule) => rule.test.toString() === "/\\.css$/"
    ).exclude = /\.module\.css$/;

    // Tell webpack what to do with CSS modules
    config.module.rules.push({
      test: /\.module\.css$/,
      include: path.resolve(__dirname, "../src"),
      use: [
        {
          loader: "style-loader",
          options: {
            modules: {
              namedExport: true,
            },
          },
        },
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: {
              namedExport: true,
            },
          },
        },
      ],
    });
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];
    // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
    config.module.rules[0].use[0].options.plugins.push(
      require.resolve("babel-plugin-remove-graphql-queries")
    );
    return config;
  },
}
```

> 这里增加了两个关于Gatsby的配置，顺手解决了另外一个问题。，参考自：[https://stackoverflow.com/questions/68136827/issue-loading-css-module-classes-in-storybook-v6-4/68499636#68499636](https://stackoverflow.com/questions/68136827/issue-loading-css-module-classes-in-storybook-v6-4/68499636#68499636)

从初始化配置到编写组件文档，好像特别简单？

## 打包输出

运行`npm run build-storybook`后，默认会将storybook的内容输出到`storybook-static` 目录中。因为博客是基于Github Page的静态站点，所以为了使得博客内容和Storybook的组件文档同时被托管在同一个项目中，我将`Storybook`输出的目录放在了`Gatsby`默认输出的`public`目录下的`storybook`目录吗。

```bash
# 指定output目录
build-storybook -o ./public/storybook
```

## 自动部署

在Github Action的workflow配置中，增加构建 Storybook 的步骤，下面是完整的workflow配置。

```yaml
name: Deploy GitHub Pages

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches:
      - source
      - master

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: BeforeScript
        run: |
          git config --global user.name "zhanglun"
          git config --global user.email "zhanglun1410@gmail.com"
      - name: Checkout
        uses: actions/checkout@v2
      - name: Set Node Enviroment
        uses: actions/setup-node@v3
        with:
          node-version: '17'

      - name: Install Dependenices
        run: |
          yarn install
          yarn run download
          npx gatsby clean
          npm cache clean --force

      - name: Build
        run: |
          echo "Starting building..."
          yarn run build
          yarn run build-storybook
          cp ./CNAME ./public/CNAME
          cp ./ads.txt ./public/ads.txt

      # 部署到 GitHub Pages
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@releases/v3
        with:
          ACCESS_TOKEN: ${{ secrets.gatsbyDeploy }}
          BRANCH: gh-pages
          FOLDER: public
```

可以访问 [https://zhanglun.xyz/storybook/](https://zhanglun.xyz/storybook/) 体验一下实际效果。

如果遇到了`ReferenceError: __BASE_PATH__ is not defined`，在`.storybook/preview.js`中增加变量定义即可

```javascript
...
global.__BASE_PATH__ = "/" 
...
```

## 结束语

以上就是如何在项目中接入Storybook的全部过程，好像挺简单？难的部分应该是如何写文档吧，hah。
