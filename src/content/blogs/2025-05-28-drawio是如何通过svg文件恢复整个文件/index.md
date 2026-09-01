---
title: drawio是如何通过svg文件恢复整个文件
categories:
  - 技术应用
date: 2025-05-28T13:00:00.000+08:00
tags:
  - drawio
  - svg
draft: false
cover: ./images/cover.jpg
---

在实现笔记接入私有化部署的drawio时，发现一个有意思的现象：使用draw绘图之后，在笔记系统中保存的是一个svg文件，在编辑时drawio能够恢复完整的绘图信息，甚至包括了多页。


于是查找了关于SVG文件导入和解析相关的代码实现以及SVG文件中的XML数据格式和解析的实现，最后发现了其中的奥秘。


之所以drawio能从SVG恢复成完整图形，是因为SVG文件中包含了完整的图形数据。drawio导出的SVG文件实际上是在SVG中嵌入了完整的 mxfile 格式数据


```xml
<mxfile host="..." modified="..." agent="..." version="..." type="device">
  <diagram name="Page-1" id="...">
    <mxGraphModel ...>
      <!-- 完整的图形数据 -->
    </mxGraphModel>
  </diagram>
</mxfile>
```


导出为svg时，将mxfile格式数据转义之后，绑定在svg的content属性中。


```xml
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  style="background: transparent; background-color: transparent; color-scheme: light dark;"
  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="141px" 
  height="142px" 
  viewBox="-0.5 -0.5 141 142" 
  content="&lt;mxfile host=&quot;127.0.0.1&quot; agent=&quot;Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36&quot; version=&quot;26.2.2&quot; pages=&quot;2&quot;&gt;&lt;diagram id=&quot;DSegkkja8PWRIwR6XoIs&quot; name=&quot;Page-1&quot;&gt;vZXBcoMgEIafxrtCNMk1aZoe2ukhh56JbIUpioMYtU9fLBg1phMPTi/O8u8u7n6s6OF9Wh8VydmbpCA85NPaw08eQmGwMs9WaKyw8X0rJIpTKwW9cOLf4MQurOQUilGgllJono/FWGYZxHqkEaVkNQ77lGL81pwkMBFOMRFT9YNTzVwXaN3rL8AT1r05iLbWk5Iu2HVSMEJlNZDwwcN7JaW2VlrvQbTsOi427/kP77UwBZmek4BswoWI0vXm6tJN16xJMFzNYlcxruGUk7j1VOZkjcZ0KswqMCYpcgv7k9dg9t9Ni3H1XUBpqAeSK+4IMgWtGhPSebcOlJsUhN26GnB3Ehsg7zTiTjq57tzDMIbjcZ8NfszGHF/emrmSMRTFY0ZnEn8lSpYZfS+14Bk4fQFUaHWDKpyiCtAdVtECrFZTVofQ22Jvs7lj3GJUTKbncga+JTD5Y0zB+v8mKpw/UXFjpoOCwjNmqh0noK/nR0NW2Is0CBf6NqObgUNTktEyJM2yvxN/fYMfCz78AA==&lt;/diagram&gt;&lt;diagram id=&quot;g9qJdJroN9i7Zbt9pWF9&quot; name=&quot;Page-2&quot;&gt;xZRRT4MwEIB/DY8mg04nj9uc+KDRuAcfTQcnNCscKYfAfr1F2gEji5osMUuW9ruj3H0tddg6rQPF8+QJI5CON4tqh905nnftzvV/C5oO3M5mHYiViDrk9mArDmCgTStFBMUokRAliXwMQ8wyCGnEuFJYjdM+UI7fmvMYJmAbcjmlbyKixHThLXr+ACJO7JvdG7+LpNwmm06KhEdYDRDbOGytEKkbpfUaZOvOeumeuz8TPRamIKPfPPBaXov5XDVqFewLeN9c+Y9PV2aVTy5L03Dw3P5MydRYD7r6vB3mCkMotNRVlQiCbc7DFld68zVLKJV65urhjof7WGGZRc8lSZGB4dOybQ2gCOoBMm0EgCmQanSKjS6MUnOmPGbmVb9DrtWeDHbnxjBuDkV8XLr3pgdG3R80ehONZwWSNgUHbJdb5aCELgDUkL/08CfHH6IG+81cyq1/4vb2v92yidtlSKjOCi5T2SWwVdu20N/yI9+BfMFCkMBMp+yQCNNBwlKKuA0QnhjG7uyuj7fL7DKaj7eC1exPNbPLWNbT/pL5jg1uarb5Ag==&lt;/diagram&gt;&lt;/mxfile&gt;">
	<!-- 完整的svg标签 -->
</svg>
```


其中，图形数据的存储结构：

- mxfile 标签是最外层容器
- diagram 标签定义了每个页面
- mxGraphModel 包含了具体的图形数据，包括：
    - 节点位置和大小
    - 连线信息
    - 样式定义
    - 文本内容
    - 分组关系

另外，drawio在导入svg时的恢复机制如下

- 当打开SVG文件时，drawio会：
    1. 解析SVG文件中的XML内容
    2. 提取其中的 mxfile 数据
    3. 从 mxGraphModel 中还原完整的图形结构
    4. 重建所有页面和图形元素

这就是为什么即使是SVG文件，也能完整恢复成drawio可编辑的图形，包括多页面、图层等高级特性。因为SVG文件中实际保存了两份数据：

- 用于显示的SVG图形数据
- 用于编辑的完整drawio图形数据
