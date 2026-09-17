---
title: 如何在 Astro 中使用相对路径的图片
categories:
  - 解决方案
date: 2023-02-15T18:00:00.000+08:00
tags:
  - Vite
  - astro
draft: false
cover: ./images/cover.jpg
---

春节期间开发了一个astro的博客模板 [astro-theme-facile](https://github.com/zhanglun/astro-theme-facile)，遇到了一个当时无法解决的图片问题一直搁置。今天抽空解决了这个问题，顺便将博客的方案迁移到了astro。


在astro提供了几种图片的使用方式。在`.astro`文件中，可以使用`<img />`标签，同时也支持HTML Image的其他属性。


```markdown
---
import rocket from '../images/rocket.svg';
---
<!-- Remote image on another server -->
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro">

<!-- Local image stored at public/assets/stars.png -->
<img src="/assets/stars.png" alt="A starry night sky.">

<!-- Local image stored at src/images/rocket.svg -->
<img src={rocket} alt="A rocketship in space."/>
```


在 markdown 文件中的使用也和平时一样，使用`![]`语法就可以 ，


```markdown
# My Markdown Page

<!-- Local image stored at public/assets/stars.png -->
![A starry night sky.](/assets/stars.png)
<img src="/assets/stars.png" alt="A starry night sky.">

<!-- Remote image on another server -->
![Astro](https://astro.build/assets/logo.png)
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro">
```


图片可以保存在本地，也可以使用远端的链接。如果你想使用本地保存的图片， 有两种选择

1. 将图片保存在`src/` 中。在src/ 目录下的图片，可以用在组件中（`.astro`，`.mdx`，和其他自定义的UI组件），但是不能在markdown文件中使用。
2. 将图片保存在`public/` 中。保存在这个目录下的图片，除了可以在组件中使用外，也可以在markdown文件中使用。

在我的博客中，每个有篇文章都是一个独立的目录，文章中使用到的图片以相对路径的方式保存在这个目录中的`images` 文件夹中。不符合上述两种方式的任何一种，这使得在没有做任何处理的情况下，编译过程不会处理文章使用到的图片，页面上的图片全部都是404。


astro提供的intergration以及社区维护的intergration都没有办法很好的支持这个能力，当时有其他事情在忙，所以这个问题在之前一直搁置着。


今天抽空来解决一下这个问题，具体的思路是：在编译阶段，使用vite插件将markdown语法转换成astro的语法。这样的方式好处在于：

1. 简单直接，我不需要通读 astro intergrations 相关的API，只要会写Vite插件就行；
2. vite 基于 Rollup，基本上可以认为会写Rollup插件的人也会写vite插件，技能是可复用的。

Rollup的插件是一个构造函数，返回一个对象。这个对象包含了很多属性和方法，在官方的定义中，被分成了三类：`Properties`、`Build Hooks`和`Output Generation Hooks`。具体细节就不在此赘述了，更多细节可以去[官网](https://rollupjs.org/plugin-development/#plugins-overview)查看。为了实现 `markdown` 语法到 `astro` 语法的转换，只需要在`build hooks` 中的`transform`上做点文章。下面是一个简单例子。


```javascript
const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null // 如果可行将提供 source map
        }
      }
    },
  }
}
```


astro在执行时，对用户传入的vite配置有一个merge操作，merge顺序如下：

1. 内置的通用vite 配置。
2. 用户提供的vite config，在`AstroConfig`中的`vite` 对象。
3. intergration中通过`config:setep`钩子提供的 vite config。
4. 命令执行时，通过命令行参数传入的配置。

在执行完内置的vite插件后，文本内容已经被处理成`MarkdownInstance`实例，`MarkdownInstance`接口如下：


```javascript
export interface MarkdownInstance<T extends Record<string, any>> {
    frontmatter: T;
    /** Absolute file path (e.g. `/home/user/projects/.../file.md`) */
    file: string;
    /** Browser URL for files under `/src/pages` (e.g. `/en/guides/markdown-content`) */
    url: string | undefined;
    /** Component to render content in `.astro` files. Usage: `<Content />` */
    Content: AstroComponentFactory;
    /** raw Markdown file content, excluding layout HTML and YAML frontmatter */
    rawContent(): string;
    /** Markdown file compiled to HTML, excluding layout HTML */
    compiledContent(): string;
    /** List of headings (h1 -> h6) with associated metadata */
    getHeadings(): MarkdownHeading[];
    default: AstroComponentFactory;
}
```


其中，`compiledContent()`返回了编译之后的HTML文本。


```javascript
const html = "xxx";

export function compiledContent() {
	return html;
}
```


我只需找到HTML中的`<img />`，替换为import导入的Image对象，接下来的事情交给astro就好了。


```javascript
import { camelCase } from "change-case";

const HTML_REGEX = /const\s+html\s+=\s+(".*");/;
const IMG_REGEX = /<img\s.*?(src=('|")(.*?)(\2)).*?>/g;

function processHTMLContent(content, imgImports) {
  const cache = {};
  const newContent = content.replace(IMG_REGEX, (imgTag, fullSrc, _0, src) => {
    if (/http(s)*|ftp(s)*/.test(src)) {
      return imgTag;
    }

    if (src.indexOf("./") !== 0) {
      src = "./" + src;
    }

    const variableName = `Image${camelCase(path.basename(src))}`;

    if (!cache[src]) {
      imgImports.push(`import ${variableName} from "${src}";`);
      cache[src] = 1;
    }

    const updatedImg = imgTag.replace(fullSrc, 'src="${' + variableName + '}"');

    return updatedImg;
  });

  return newContent;
}

export default function transformMDImage() {
  return {
    name: 'transform-md-image',

		transform(code, id) {
      if (id.endsWith(".md")) {
        const imgImports = [];
        const result = code.replace(HTML_REGEX, (_0, html) => {
          const preprocessedHTML = JSON.parse(html)
            .replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/`/g, "\\`");
          const processedHTML = processHTMLContent(
            preprocessedHTML,
            imgImports
          );

          return `const html = \`${processedHTML}\`;`;
        });

        const finalCode = `${imgImports.join("\n")}\n${result}`;

        return {
          code: finalCode,
        };
      }
    },
  }
}
```


这里面有个细节要留意一下：

1. transform 入口判断了文件类型，只有`.md` 文件才需要做这个处理。
2. 从code中解析HTML文本时，执行了一次`JSON.parse(html)`，这是因为astro在返回HTML之前执行一次[JSON.stringify(html)](https://github.com/withastro/astro/blob/78eeb4075d2d41213d10925d1aed3430f00c36ed/packages/astro/src/vite-plugin-markdown/index.ts#L62)。
3. 在`processHTMLContent` 中，使用一个cache对象缓存import过的图片，避免重复加载；import的对象统一添加了`Image`前缀，避免出现数字打头的情况；远端图片不做任何处理；相对路径前面补充`./` ，以保证路径解析正确；

最后在astro.config.mjs中注册写好的组件就行了。


```javascript
import { defineConfig } from "astro/config";
import transformMDImage from './plugins/transform-md-image';

// https://astro.build/config
export default defineConfig({
  ...,
  vite: {
    plugins: [transformMdImage()]
  },
	...
});
```

