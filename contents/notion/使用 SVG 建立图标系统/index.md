---
title: 使用 SVG 建立图标系统
categories: 技术应用
status: publish
date: 2022-07-29T16:50:00.000+08:00
tags:
  - JavaScrtipt
  - CSS
  - Node.js
cover: https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-1.2.1&q=80&cs=tinysrgb&fm=jpg&crop=entropy

---


## 背景

前段时间Iconfont关闭了服务，影响到了项目的正常开发和迭代。Iconfont服务恢复之后，对上传的图标增加了审核流程。每次新增图标都需要等待流程通过才能使用。这对设计和开发之间的协作产生了一些影响，需要替代方案。

## 寻找解决方案

为了解决这个问题，我尝试找寻可替代的解决方案。首先想到的是自建一个”Iconfont“，可以保留之前的工作流程，除去搭建成本之外，对于使用者来说可以说是无缝迁移。

调研了一圈之后，发现了去哪儿团队开源的[YIcon项目](http://ued.qunar.com/yicon/)。YIcon 是一个集图标上传、展示、使用于一身的字体图标管理平台。目的为采用 Iconfont 字体图标替换项目中图片图标的使用，以达到缩减体积、风格统一、提高开发效率等目的。它拥有严格的审核流程、可控的项目版本和完善的权限管理。总之看起来是一个可完美替代Iconfont的工具。

![](images/6b9a8861acff2517.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=28c1aeba6667c9ebad2d7389626d2f37d22be1c2f2bf373404b82d2e3bf78f51&X-Amz-SignedHeaders=host&x-id=GetObject)

在仔细阅读了部署文档和使用说明后，内心不由得再问自己：”就为了一个icon，值得搞这么麻烦吗？“。当我注意到项目的最后更新时间是4年前时，我的内心再次动摇。

再看团队实际情况，公司整个研发团队规模人数不多，所有的产品都是用统一的图标系统，在图标这件事情上，没有跨业务线推广复用的场景，也不需要严格的审核流程和权限管理。接入YIcon着实有点”大材小用“。所以YIcon不是我们想要的方案。

在过往使用Iconfont的经历，我们也感觉到了一些不痛快的地方。每次更新之后需要替换文件或者引入的url，而文件和url没有是无语义的，无法追踪变更。特别是在处理本地化版本时，是不是需要将文件同步到项目中，徒增了心智负担。

再者，字体文件加载需要时间，在文件加载完成前，图标是无法显示的，内容就很容易发生闪烁。在某些浏览器下，处于私有使用区的图标在默认字体下甚至会显示为一个方块字符。

我想类似的问题社区都多少有一些体会，不然也不会出现使用 SVG 来代替 Web font icon 的方案。2022年，现代浏览器对[SVG的支持](https://caniuse.com/?search=svg)也是推动力之一。

![](images/6dc4f9f741def3bc.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=edd387e9fed387642cb695946a107fedc302a91521b193c76686d80bb89013b4&X-Amz-SignedHeaders=host&x-id=GetObject)

SVG本身也有一些不错的优势，简单列举了几点，更多的优势和细节就不在此赘述了。

- 天生的可伸缩性，适合做图标

- 文本文件，设计工具和文本编辑器都可以编辑

- 纯粹的 XML，嵌入页面不需要编码

既然如此，那就用SVG来搭建自己的图标系统吧!

## SVG 图标

SVG可以被当作图片使用，所以你可以通过HTML标签内联使用，也可以通过CSS作为背景图片使用。甚至还有和CSS sprite 类似的SVG sprite。其核心的思路还是将SVG当做图片来对待，这无法体现SVG的优势。

早在2014年，社区就提出了 [**SVG Symbol 方案**](https://css-tricks.com/svg-symbol-good-choice-icons/)，随着浏览器对SVG的支持。该方案的核心点在于使用SVG的`symbol` 标签定义图标，使用`use` 标签引用。

`symbol`元素用来定义一个图形模板对象，它可以用一个[`<use>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/use)元素实例化。`symbol`
元素可以在页面中多次使用，还能添加结构和语义从而提升了无障碍。注意，一个`symbol`
元素本身是不呈现的。只有`symbol`元素的实例（亦即，一个引用了`symbol`的 `<use>`元素）才能呈现。

`use`元素在 SVG 文档内取得目标节点，并在别的地方复制它们。它的效果等同于这些节点被深克隆到一个不可见的 DOM 中，然后将其粘贴到`use`元素的位置，很像 HTML5 中的克隆 [template](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/template)。

```html
<svg>
	<!-- 定义 symbol，不会被渲染  -->
	<symbol id="sym01" viewBox="0 0 150 110">
	  <circle cx="50" cy="50" r="40" stroke-width="8" stroke="red" fill="red"/>
	  <circle cx="90" cy="60" r="40" stroke-width="8" stroke="green" fill="white"/>
	</symbol>
</svg>

<svg>
	<!-- 获取定义的symbol，会渲染 -->
	<use xlink:href="#sym01"
	     x="0" y="0" width="100" height="50"/>
	<use xlink:href="#sym01"
	     x="0" y="50" width="75" height="38"/>
	<use xlink:href="#sym01"
	     x="0" y="100" width="50" height="25"/>
</svg>
```

在实际开发中，需要将定义好的symbol提前插入到HTML中再通过封装好的组件使用。通常我们是配合 Webpack 的 [svg-sprite-loader](https://www.npmjs.com/package/svg-sprite-loader) 来实现。

![](images/a2fc6f00cfeec171.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=2af1ff6cf05c500275aacc2539349afc8fcd88638019ef1165f8222857777188&X-Amz-SignedHeaders=host&x-id=GetObject)

用起来倒是挺方便的，但是 symbol 的注入无形之中增加了HTML的体积，同时依赖 Webpack，接入项目需要修改配置。小范围使用的效果很不错，距离打造图标系统还是差点意思。

## SVG Component

既然当图片使用不合适，用 Symbol 又不太行。那干脆利用SVG是XML的特点做组件好了。例如，下面是一个React组件。

```javascript
import React from 'react'

const IconAdjustLine = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      focusable={false}
      aria-hidden={true}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.7319 6.375C18.3337 7.64285 17.1493 8.5625 15.75 8.5625C14.3507 8.5625 13.1663 7.64285 12.7681 6.375H3.5625C3.04473 6.375 2.625 5.95527 2.625 5.4375C2.625 4.91973 3.04473 4.5 3.5625 4.5H12.7681C13.1663 3.23215 14.3507 2.3125 15.75 2.3125C17.1493 2.3125 18.3337 3.23215 18.7319 4.5H20.4375C20.9553 4.5 21.375 4.91973 21.375 5.4375C21.375 5.95527 20.9553 6.375 20.4375 6.375H18.7319ZM17 5.4375C17 4.74714 16.4404 4.1875 15.75 4.1875C15.0596 4.1875 14.5 4.74714 14.5 5.4375C14.5 6.12786 15.0596 6.6875 15.75 6.6875C16.4404 6.6875 17 6.12786 17 5.4375Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.7319 19.5C18.3337 20.7678 17.1493 21.6875 15.75 21.6875C14.3507 21.6875 13.1663 20.7678 12.7681 19.5H3.5625C3.04473 19.5 2.625 19.0803 2.625 18.5625C2.625 18.0447 3.04473 17.625 3.5625 17.625H12.7681C13.1663 16.3572 14.3507 15.4375 15.75 15.4375C17.1493 15.4375 18.3337 16.3572 18.7319 17.625H20.4375C20.9553 17.625 21.375 18.0447 21.375 18.5625C21.375 19.0803 20.9553 19.5 20.4375 19.5H18.7319ZM17 18.5625C17 17.8721 16.4404 17.3125 15.75 17.3125C15.0596 17.3125 14.5 17.8721 14.5 18.5625C14.5 19.2529 15.0596 19.8125 15.75 19.8125C16.4404 19.8125 17 19.2529 17 18.5625Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2319 12.9375C10.8337 14.2053 9.64926 15.125 8.25 15.125C6.85074 15.125 5.66627 14.2053 5.26806 12.9375H3.5625C3.04473 12.9375 2.625 12.5178 2.625 12C2.625 11.4822 3.04473 11.0625 3.5625 11.0625H5.26806C5.66627 9.79465 6.85074 8.875 8.25 8.875C9.64926 8.875 10.8337 9.79465 11.2319 11.0625H20.4375C20.9553 11.0625 21.375 11.4822 21.375 12C21.375 12.5178 20.9553 12.9375 20.4375 12.9375H11.2319ZM9.5 12C9.5 11.3096 8.94036 10.75 8.25 10.75C7.55964 10.75 7 11.3096 7 12C7 12.6904 7.55964 13.25 8.25 13.25C8.94036 13.25 9.5 12.6904 9.5 12Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default IconAdjustLine
```

![](images/a0d5db817a564597.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=f0b3a644da445d6a89f3b8675e00313b8f97b3626dbb75434e392f83f7d31333&X-Amz-SignedHeaders=host&x-id=GetObject)

如果能够把SVG都转换成对应的组件，然后维护起来，弄个像模像样的页面，咱们的图标系统是不是就算是搭建起来了？按照这个思路，先来捋一捋流程。

![](images/7b3b1e83c0aba0b2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=73ae15f595a3d405ff161729c005ac1372a9bc81cbeead237454b6982f544de0&X-Amz-SignedHeaders=host&x-id=GetObject)

## 创建 Icon 组件

借助 [SVGR](https://react-svgr.com/docs/what-is-svgr/) 可以帮助我们快速将SVG转换成React组件。比如下面的SVG

```html
<?xml version="1.0" encoding="UTF-8"?>
<svg
  width="48px"
  height="1px"
  viewBox="0 0 48 1"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
  <title>Rectangle 5</title>
  <desc>Created with Sketch.</desc>
  <defs></defs>
  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g
      id="19-Separator"
      transform="translate(-129.000000, -156.000000)"
      fill="#063855"
    >
      <g id="Controls/Settings" transform="translate(80.000000, 0.000000)">
        <g id="Content" transform="translate(0.000000, 64.000000)">
          <g id="Group" transform="translate(24.000000, 56.000000)">
            <g id="Group-2">
              <rect id="Rectangle-5" x="25" y="36" width="48" height="1"></rect>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>
```

使用 SVGR 转换可以得到组件。

```javascript
import * as React from 'react'

const SvgComponent = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 48 1" {...props}>
    <path d="M0 0h48v1H0z" fill="currentColor" fillRule="evenodd" />
  </svg>
)

export default SvgComponent
```

如此一来，配合Node.js脚本，可以将SVG批量输出为React组件。首先引入依赖的包，

```javascript
const svgr = require('@svgr/core')
const { optimize } = require('svgo')
const fs = require('fs')
const { resolve, basename, extname } = require('path')
const camelCase = require('camelcase')
const prettier = require('prettier')

/* 自定义目录 */
const entryDir = resolve(__dirname, './svg')
const outDir = resolve(__dirname, './icons')
const mapOutDir = resolve(__dirname, '../Icon')
```

使用fs遍历SVG文件所在的目录，经过压缩、转换和格式化之后，在输出目录中写入文件。

```javascript
const svgoPlugins = [
   {
     name: 'convertColors',
     params: { currentColor: /^(?!url|none)./ },
   },
   {
     name: 'cleanupListOfValues',
     active: true,
   },
   {
     name: 'removeStyleElement',
     active: true,
   },
   {
     name: 'removeViewBox',
     active: false,
   },
   {
     name: 'removeDimensions',
     active: true,
   },
 ];
const files = fs.readdirSync(entryDir, 'utf-8');
const indexFileName = 'index.js';
const mapFileName = 'map.js';
let mapFileContentEnum = ``;

const batches = files.filter(f => extname(f) === '.svg')
	.map(async file => {
		 try {
		   const svgFileName = basename(file, '.svg');
		   const componentName = `${prefix}${camelCase(svgFileName, { pascalCase: true })}${suffix}`;
		   const reactFileName = `${componentName}.jsx`;
		   const svgContent = fs.readFileSync(resolve(entryDir, file), 'utf-8');
		   const svgProps = {
		     focusable: '{false}',
		     'aria-hidden': true
		   };
		   const result = optimize(svgContent, {
		     plugins: svgoPlugins,
		   });
		
		   const jsxCode = await svgr.transform(result.data, {
		     plugins: ['@svgr/plugin-jsx'],
		     svgProps,
		     iconType: svgFileName,
		     ...svgrOptions,
		   }, {
		     componentName
		   });
		   const formattedCode = prettier.format(jsxCode, {
		     "semi": false,
		     "singleQuote": true,
		     "printWidth": 80
		   });

		   fs.writeFileSync(resolve(outDir, reactFileName), formattedCode, 'utf-8');
		   mapFileContentEnum+= (mapFileContentEnum ? `\n` : '') + `  ${componentName}: '${componentName}',`
		   return { fileName: reactFileName, componentName };
		 } catch (error) {
		   console.error(error);
		   throw error;
		 }
	});

const arr = await Promise.all(batches);
const indexFileContent = arr.map(a => `export { default as ${a.componentName} } from './${a.componentName}';`).join('\n');

fs.writeFileSync(resolve(outDir, indexFileName), indexFileContent, 'utf-8');
fs.writeFileSync(resolve(mapOutDir, mapFileName), `export default {\n${mapFileContentEnum}\n}`, 'utf-8');
```

## 交付自动化

在验证了核心功能的可行性后，我们将核心能力包装成标准的工具，集成在前端工具中。为了优化与设计师协作的流程，约定将SVG文件放在仓库中集中管理。通过持续集成，将转换的过程自动化。每当变更发生时，调用前端工具集成的`build-icon`命令创建组件，最后自动发布到npm上。开发者只需更新依赖包就能使用上最新的图标。

除此之外，在构建阶段，也会输出图标的信息文件，生成文档，部署到内部的文档站点中，实际效果如下图所示。

![](images/97fd55236b734fe0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=150d2f0a2047ece832042f34733eb72867eaacae21d33e33f38cd18ec854cbba&X-Amz-SignedHeaders=host&x-id=GetObject)

## 结束语

## 参考

- [https://juejin.cn/post/6871864493358628872#heading-12](https://juejin.cn/post/6871864493358628872#heading-12)

- [https://css-tricks.com/icon-fonts-vs-svg/](https://css-tricks.com/icon-fonts-vs-svg/) 

- [https://css-tricks.com/svg-symbol-good-choice-icons/](https://css-tricks.com/svg-symbol-good-choice-icons/)
