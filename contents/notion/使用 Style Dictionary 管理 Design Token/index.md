---
title: 使用 Style Dictionary 管理 Design Token
categories: 解决方案
status: publish
date: 2022-07-15T20:34:00.000+08:00
tags:
  - CSS
  - JavaScrtipt
  - 架构
cover: https://www.notion.so/images/page-cover/rijksmuseum_avercamp_1608.jpg

---


在之前的文章中，我介绍了Design Token 相关的基本概念。本文将介绍如何使用现有的工具来管理 Design Token。

## 什么是Style Dictionary

社区上处理和解析Design Token的工具很多，这有一个[可参考的目录](https://github.com/sturobson/Awesome-Design-Tokens#tools)。比较受欢迎的有 [Style Dictionary](https://github.com/amzn/style-dictionary)、[Theo](https://github.com/salesforce-ux/theo) 等。我选择 Style Dictionary，因为社区受关注度更高，更新也比较及时，最近正在[计划做4.0版本](https://github.com/amzn/style-dictionary/issues/643)。

![](images/6df5a35a51e08dd7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=92af3f8df785566fd2ed64778daf2919cd1dfb5da416fc1014919bb561da164b&X-Amz-SignedHeaders=host&x-id=GetObject)

Style Dictionary 是一个**构建系统**。使用它可以让你一次性定义风格，供任何平台或语言使用。在一个地方可以创建和编辑你的样式，通过一个命令就可以把这些规则导出到你需要的所有地方，iOS、Android、CSS、JS、HTML、Sketch 文件、样式文档，或者任何你能想得到的地方。它可以通过npm作为CLI使用，也可以像普通的Node.js模块一样使用。

![](images/c2866a2e5a48303b.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=53e41cf8138e750390f4a109b2e9425abd555c1175203b7b87c419dd35dd95c0&X-Amz-SignedHeaders=host&x-id=GetObject)

## 简单案例，快速上手

为了帮助开发者快速上手，官方很贴心地提供了[一些实例](https://github.com/amzn/style-dictionary/tree/main/examples/)。让我们来看一下简单的实例，从中了解Style Dictionary 到底做了什么事情。随便找个目录，执行以下命令。

```bash
$ mkdir MyStyleD
$ cd MyStyleD
$ style-dictionary init basic
```

这个命令先将仓库中的[实例文件](https://github.com/amzn/style-dictionary/tree/main/examples/basic)复制到本地目录，然后执行 `style-dictionary build`
，生成构建的产出物。不出意外的话，你会在你的控制台中看到这些输出：

```bash
Copying starter files...

Source style dictionary starter files created!

Running `style-dictionary build` for the first time to generate build artifacts.


scss
✔︎ build/scss/_variables.scss

android
✔︎ build/android/font_dimens.xml
✔︎ build/android/colors.xml

compose
✔︎ build/compose/StyleDictionaryColor.kt
✔︎ build/compose/StyleDictionarySize.kt

ios
✔︎ build/ios/StyleDictionaryColor.h
✔︎ build/ios/StyleDictionaryColor.m
✔︎ build/ios/StyleDictionarySize.h
✔︎ build/ios/StyleDictionarySize.m

ios-swift
✔︎ build/ios-swift/StyleDictionary+Class.swift
✔︎ build/ios-swift/StyleDictionary+Enum.swift
✔︎ build/ios-swift/StyleDictionary+Struct.swift
```

这意味着你已经成功运行了这个实际的例子。回头看看当前你操作的文件目录，它应该长这样：

```bash
├── README.md
├── config.json
├── tokens/
│   ├── color/
│       ├── base.json
│       ├── font.json
│   ├── size/
│       ├── font.json
├── build/
│   ├── android/
│      ├── font_dimens.xml
│      ├── colors.xml
│   ├── compose/
│      ├── StyleDictionaryColor.kt
│      ├── StyleDictionarySize.kt
│   ├── scss/
│      ├── _variables.scss
│   ├── ios/
│      ├── StyleDictionaryColor.h
│      ├── StyleDictionaryColor.m
│      ├── StyleDictionarySize.h
│      ├── StyleDictionarySize.m
│   ├── ios-swift/
│      ├── StyleDictionary.swift
│      ├── StyleDictionaryColor.swift
│      ├── StyleDictionarySize.swift
```

Style Dictionary 由配置驱动，必须包含一份config.json和配置中引用的design token对应的文件。

- **config.json**：style dictionary 依赖的配置。告诉 style dictionary去哪里找design tokens，以及如何转换和格式化输出文件。

	```json
	{
	  "source": ["tokens/**/*.json"],
	  "platforms": {
	    "scss": {
	      "transformGroup": "scss",
	      "prefix": "sd",
	      "buildPath": "build/scss/",
	      "files": [{
	        "destination": "_variables.scss",
	        "format": "scss/variables"
	      }],
	      "actions": ["copy_assets"]
	    },
	    "android": {
	      "transforms": [
					"attribute/cti", 
					"name/cti/snake", 
					"color/hex", 
					"size/remToSp", 
					"size/remToDp"
				],
	      "buildPath": "build/android/src/main/res/values/",
	      "files": [{
	        "destination": "style_dictionary_colors.xml",
	        "format": "android/colors"
	      }]
	    }
	  }
	}
	```

- **design tokens**： 定义了 design token的一系列JSON或者JavaScript Module文件。会在config.json 中的source属性中使用。

	```json
	{
	  "size": {
	    "font": {
	      "small": {
	        "value": "10px"
	      },
	      "medium": {
	        "value": "16px"
	      },
	      "large": {
	        "value": "24px"
	      },
	      "xl": {
	        "value": "34px"
	      },
	      "xxl": {
	        "value": "46px"
	      },
	      "base": {
	        "value": "{size.font.medium.value}",
	        "attributes": {
	          "comment": "All about that base"
	        }
	      },
	      "heading": {
	        "1": {
	          "value": "{size.font.xxl.value}"
	        },
	        "2": {
	          "value": "{size.font.xl.value}"
	        }
	      }
	    }
	  }
	}
	```

## Style Dictionary 的架构

为了更好地理解style dictionary的能力和工作原理，让我们来看看它的架构设计。下面是官方给到的架构图。

![](images/9220f79327689e5b.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=edaebde8fea19116a74fbdba827ccd7ed6b4d11d3b7ea497cc956c5a4862427e&X-Amz-SignedHeaders=host&x-id=GetObject)

一图胜千言，这张图已经很直观地展示其工作原理。

- 第一步：解析配置文件。

- 第二步：找到所有 token 文件。config中的 `include` 和 `source` 组合决定了搜索查找的范围。

- 第三步：将所有的token文件进行一个深度合并。相同的结构将会覆盖。

- 第四步：遍历config中定义所有platform，执行一下操作：

	- 执行 token转换，提取token中的value。这会深度遍历每一个对象，直到找到`value`这个key。

	- 解析别名和引用。找到`value`之后，如果其值是别名或者引用，比如`"{size.font.base.value}”` ，就用转换后的值替换之。

	- 根据每一个platform配置中的format格式，输出不同的文件。

	- 在输出文件之后，还可以执行自定义的Actions。

当上述四个步骤都成功执行并结束后，你就能得到你想要的输出产物了。

## 与设计师协作

在[浅谈Design Token](https://zhanglun.xyz/blogs/%E6%B5%85%E8%B0%88%20Design%20Token/#%E5%88%9B%E5%BB%BA%E5%92%8C%E4%BA%A4%E4%BB%98-Design-Token)中我曾经提到过，设计师可以通过 Figma 等设计工具，以文件的形式将 design token 提供给开发人员。现在，身为开发人员的我们，可以使用 Style Dictionary 对token进行处理，输出我们想要的文件。

![](images/2e013a51a0ba79d7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=6d2330b23ca04161b4531cff7708c8cc082c18197b7aa405517cb90c04b75fc4&X-Amz-SignedHeaders=host&x-id=GetObject)

我们将所有的tokens文件托管到内部的gitlab仓库中。设计师定义好token之后，将文件上传到仓库，然后告知到对应的工程师。工程师使用基于Node.js开发的脚本，实现token的下载和转换输出。

![](images/259287b2332e8261.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051952Z&X-Amz-Expires=3600&X-Amz-Signature=6e9d4e2c54b3769608a5bbf6b97e33addafc49b337716d37ccd6db3b30787710&X-Amz-SignedHeaders=host&x-id=GetObject)

## 使用 Node API 增强定制能力

style dictionary 提供了比较强大的 Node API，你可以使用这些API实现一些更复杂的能力，满足更多的需求场景，这里是[API的文档](https://amzn.github.io/style-dictionary/#/api)，感兴趣的朋友可以仔细阅读。接下来我会结合实际案例，向大家演示如何使用Node API。

先从一个简单的例子开始，新建一个JavaScript文件。引入依赖之后，调用`extend` 传入配置。然后调用返回实例的`buildAllPlatforms` 方法。

```javascript
// build.js
const StyleDictionary = require('style-dictionary').extend('config.json');

StyleDictionary.buildAllPlatforms();
```

extend方法的参数可以是一个文件路径，也可以是个对象。

```javascript
// build.js
const StyleDictionary = require('style-dictionary').extend({
  source: ['properties/**/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [{
        destination: 'variables.scss',
        format: 'scss/variables'
      }]
    }
    // ...
  }
});

StyleDictionary.buildAllPlatforms();
```

你可以多次调用extend和buildAllPlatforms方法，可以用在输出嵌套主题或者多品牌主题等类似的场景。

```javascript
// build.js
const StyleDictionary = require('style-dictionary');

const brands = [`brand-1`, `brand-2`, `brand-3`];
brands.forEach(brand => {
  StyleDictionary.extend({
    include: [`tokens/default/**/*.json`],
    source: [`tokens/${brand}/**/*.json`],
    // ...
  }).buildAllPlatforms();
});
```

假设下面是我们的 token.json。

```json
// token.json
{
  "sizing": {
    "10": {
      "value": "10",
      "type": "sizing"
    },
    "12": {
      "value": "12",
      "type": "sizing"
    },
    "14": {
      "value": "14",
      "type": "sizing"
    },
    "16": {
      "value": "16",
      "type": "sizing"
    },
    "18": {
      "value": "18",
      "type": "sizing"
    },
    "20": {
      "value": "20",
      "type": "sizing"
    },
    "22": {
      "value": "22",
      "type": "sizing"
    },
    "24": {
      "value": "24",
      "type": "sizing"
    },
    "28": {
      "value": "28",
      "type": "sizing"
    },
    "32": {
      "value": "32",
      "type": "sizing"
    },
    "36": {
      "value": "36",
      "type": "sizing"
    },
    "40": {
      "value": "40",
      "type": "sizing"
    },
    "48": {
      "value": "48",
      "type": "sizing"
    }
  }
}
```

先创建Style Dictionary 需要的 config.json。

```json
// config.json
{
  "source": ["./token.json"],
  "platforms": {
    "scss": {
      "transformGroup": "scss",
      "buildPath": "build/scss/",
      "files": [
        {
        "destination": "sizing.scss",
        "format": "scss/variables"
        }
      ]
    }
  }
}
```

然后试着执行 `node build.js` 。不出意外的话，执行结束之后，会在当前目录中创建 `build/sizing.scss` 。

```scss
// Do not edit directly
// Generated on Thu, 04 Aug 2022 07:08:59 GMT

$sizing-10: 10;
$sizing-12: 12;
$sizing-14: 14;
$sizing-16: 16;
$sizing-18: 18;
$sizing-20: 20;
$sizing-22: 22;
$sizing-24: 24;
$sizing-28: 28;
$sizing-32: 32;
$sizing-36: 36;
$sizing-40: 40;
$sizing-48: 48;
```

虽然输出了我们想要的文件，但是文件的内容好像和预期不符，每一个 Scss 变量应该带上单位。要想定制这个输出结果，我们需要使用自定义的Transform。

### Transform 和 TransformGroup

Style Dictionary 中的Transform是用来修改token的函数。使用 Transform可以对token的name、value 或者 attribute 进行转换，从而实现适配输出不同平台的能力。比如，将pixel转换成point。可以使用[内置的Transforms](https://amzn.github.io/style-dictionary/#/transforms?id=pre-defined-transforms)，也可以使用`registerTransform`方法注册自定义Transform。

```javascript
StyleDictionary.registerTransform({
  name: 'time/seconds',
  type: 'value',
  matcher: function(token) {
    return token.attributes.category === 'time';
  },
  transformer: function(token) {
    // Note the use of prop.original.value,
    // before any transforms are performed, the build system
    // clones the original token to the 'original' attribute.
    return (parseInt(token.original.value) / 1000).toString() + 's';
  }
});
```

TransformGroup就是一组Transform。有开箱即用的[内置的TransformGroup](https://amzn.github.io/style-dictionary/#/transform_groups)，也可以通过`registerTransformGroup`方法注册自定义TransformGroup。

```javascript
StyleDictionary.registerTransformGroup({
  name: 'Swift',
  transforms: [
    'attribute/cti',
    'size/pt',
    'name/cti'
  ]
});
```

为了给sizing加上单位pixel，我们先注册一个自定义 Transform 和 TransformGroup。

```javascript
StyleDictionary.registerTransform({
  name: 'size/px', //定义transform的名称，作为引用标记
  type: 'value', // transform 转换的对象，我们需要转换token对应的值
  matcher: token => { // token 匹配函数，返回boolean。
    return token.type === 'sizing' && token.value !== 0
  },
  transformer: token => { // transform函数，接受token，返回想要的内容
    return `${token.value}px`
  }
})

StyleDictionary.registerTransformGroup({
  name: 'custom/scss', 
  transforms: StyleDictionary.transformGroup['scss'].concat([
    'size/px',
    'size/percent'
  ])
})
```

接着在config.json中使用叫做`custom/scss` 的 TransformGroup。

```json
{
  "source": ["./token.json"],
  "platforms": {
    "scss": {
      "transformGroup": "custom/scss",
      "buildPath": "build/scss/",
      "files": [
        {
        "destination": "sizing.scss",
        "format": "scss/variables"
        }
      ]
    }
  }
}
```

最后检查输出内容。

```scss
// Do not edit directly
// Generated on Thu, 04 Aug 2022 07:08:59 GMT

$sizing-10: 10px;
$sizing-12: 12px;
$sizing-14: 14px;
$sizing-16: 16px;
$sizing-18: 18px;
$sizing-20: 20px;
$sizing-22: 22px;
$sizing-24: 24px;
$sizing-28: 28px;
$sizing-32: 32px;
$sizing-36: 36px;
$sizing-40: 40px;
$sizing-48: 48px;
```

掌握工具的使用，配合自动化脚本，可以让token2css的过程变得非常丝滑流畅。

## 结束语

style dictionary 是一个功能丰富，易于定制和拓展的优秀开源工具。多平台输出的能力，能够帮助我们实现样式的一次定义，多处使用。通过自定义的Transform，你还可以将Design Token导出为ESM，你可以在JavaScript代码中使用。如果你的项目使用了 CSS-in-JavaScript 的技术方案时，这非常有用。团队当前正在和设计团队一起验证基于 Design Token 的协作流程，style dictionary 是必不可少的一环。 
