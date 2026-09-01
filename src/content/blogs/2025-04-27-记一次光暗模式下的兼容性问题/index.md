---
title: 记一次光暗模式下的兼容性问题
categories:
  - 解决方案
date: 2025-04-27T14:00:00.000+08:00
tags:
  - CSS
  - JavaScrtipt
draft: false
cover: ./images/cover.jpg
---

react-drawio 在保存时，导出的svg文件在低版本浏览器中默认图形被填充为黑色。在svg文件的代码发现，其使用了CSS的`light-dark()`函数以动态支持浅色模式与暗色模式的切换。


```typescript
<ellipse cx="145" cy="40" rx="40" ry="40" fill="#ff8000" stroke="#000000" pointer-events="all" style="fill: light-dark(rgb(255, 128, 0), rgb(206, 97, 0)); stroke: light-dark(rgb(0, 0, 0), rgb(255, 255, 255));"/>
```


`light-dark()` 是 2024 年新增的一种 CSS 函数，允许根据用户的系统颜色方案（浅色或深色模式）自动选择合适的颜色值，简化了创建响应用户偏好主题的应用程序和网站的过程，无需使用媒体查询或其他复杂逻辑。但是低版本浏览器中不支持，比如ios上的低版本safair。当light-dark()不支持时，默认创建的图形填充为黑色，因为`light-dark(#ffffff, var(--ge-dark-color, #121212))`。又因为是通过 Img 标签引入的 SVG，由于跨域安全限制，无法直接修改其内部元素的样式。


所以现在的方案是：在图片生成时，使用正则表达式匹配每个`light-dark()`函数中的两个颜色值，根据当前系统颜色方案（浅色或深色），将`fill`或者`stroke`的颜色动态硬编码为对应的颜色值。


这种方式有两个问题：

1. 无法响应系统主题动态切换
2. 不同主题用户协作时可能出现颜色覆盖。

考虑到客户端没有暗色模式，且未来画图需要实现实时同步，展示的内容不会使用svg图片的方式，实现方案会有大的调整。所以暂时先用这种解决。


```typescript
// apps/client/src/lib/utils.tsx
export function convertSvgLightDark(svgContent: string, mode: 'light' | 'dark' = 'light'): string {
  // 首先匹配整个style属性
  const styleRegex = /style="([^"]*)"/g;

  return svgContent.replace(styleRegex, (fullMatch, styleContent) => {
    // 然后在style内容中匹配所有的light-dark函数
    const lightDarkRegex = /(fill|stroke):\s*light-dark\(\s*((?:[^(),]+|\([^()]*\)|var\([^()]*\))*)\s*,\s*((?:[^(),]+|\([^()]*\)|var\([^()]*\))*)\s*\)/g;

    // 替换style内容中的所有light-dark函数
    const newStyleContent = styleContent.replace(lightDarkRegex, (match, property, lightValue, darkValue) => {
      const selectedColor = mode === 'light' ? lightValue.trim() : darkValue.trim();
      return `${property}: ${selectedColor}`;
    });
    
    return `style="${newStyleContent}"`;
  });
}
```


顺带说一下`light-dark()`


**全文摘要**
本文主要介绍了CSS中的`light-dark()`函数，它可以根据用户的颜色模式自动在浅色和深色模式之间切换颜色值。文章详细讲解了其语法、使用方法以及，同时探讨了其在无障碍性方面的局限性和未来改进方向，最后指出该函数在所有主流浏览器中都能正常工作。


**关键段落**

- **功能介绍**`light-dark()`函数接受两个颜色值，分别用于“浅色”模式和“深色”模式，会根据当前激活的模式自动切换。它遵循用户的颜色方案值，无需使用`prefers-color-scheme`媒体查询来切换模式。
- **语法和使用**
语法为`light-dark(<color>, <color>)`，其中第一个颜色值用于浅色模式，第二个用于深色模式。例如，可以设置文本颜色和背景颜色：
还可以使用变量以便在其他地方重用颜色值。

    ```css
    :root {
      color-scheme: light dark;
    }
    html {
      color: light-dark(#000, #fff);
      background-color: light-dark(#efedea, #223a2c);
    }
    ```


## **与** prefers-color-scheme **的区别**


默认情况下，大多数浏览器和作系统都选择浅色模式。如果要使用 `prefers-color-scheme` media 功能构建浅色和深色模式，则应首先在 `:root` pseudo-class 中构建浅色模式，然后使用 `prefers-color-schemes` feature 考虑深色模式。


```css
/* Light default mode */:root {
  --background-color: white;
  --text-color: black;
  --form-bg: #f0f0f0;
  --form-border: #ccc;
  --button-bg: #e0e0e0;
  --button-text: black;
}


/* Dark Mode */@media (prefers-color-scheme: dark) {
  :root {
    --background-color: black;
    --text-color: white;
    --form-color: white;
    --form-bg: #1e1e1e;
    --form-border: #555;
    --button-bg: #333;
    --button-text: white;
  }
}
```


这样，颜色变量和值的范围限定在最高级别，从而使其易于在其他选择器中管理和覆盖。在常见的具体的实现中，我们需要使用多个类/属性和 JavaScript 切换在明暗模式之间切换，根据每个元素分配的颜色变量更改每个元素的颜色。相比之下使用 `light-dark()` 则更简单一下：


```css
:root {
  --background-color: light-dark(white, black);
  --text-color: light-dark(black, white);
  --form-bg: light-dark(#f0f0f0, #1e1e1e);
  --form-color: light-dark(black, white);
  --form-border: light-dark(#ccc, #555);
  --button-bg: light-dark(#e0e0e0, #333);
  --button-text: light-dark(black, white);
}

[data-theme="light"] {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}
```


只用一行代码在浅色和深色配色方案之间进行更改的。


但是不要认为light-dark()是用来代替`perfers-color-scheme`的。`light-dark()`允许根据操作系统或浏览器的偏好自动选择颜色模式，而`prefers-color-scheme`提供了更多控制，允许开发者或用户通过CSS和JavaScript自动在颜色模式之间切换，包括但不限于light和dark，或者保持操作系统的选择。它们各自有不同的用途，不是替代关系。

