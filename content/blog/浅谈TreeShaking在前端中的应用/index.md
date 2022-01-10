---
title: "浅谈TreeShaking在前端中的应用 - Rollup VS Webpack"
date: 2019-11-14T21:50:12+08:00
draft: false
---

## 前言

`Tree Shaking`是一种死码清除(dead code elimination)技术，通常用于在ECMAScript方言比如Dart，JavaScript或者TypeScript打包成一个文件时，移除未使用的代码以此来优化代码。

在动态语言中实现 `Dead code elimination` 要比在静态语言中实现难的多。`treeshaker` 这个概念最早在起源于1990年，来自LISP语言。这个技术主要核心点是，将程序中所有可能执行到的流用一个树形结构的函数调用来表示，这样那些从来不会调用的函数就可以清理

在2012年的时候，Google 的 Bob Nystrom 开发的 closure compiler 就实现了这个算法，并应用在 Dart 的 dart2js compiler中。在Dart代码编译成JavaScript的过程中，编译器会做`tree shaking`。在JavaScript中，有时候就算你只使用了库中的一个函数，你也不得不将整个库引入到项目中，最后输出的文件会包含很多用不上的代码，体积大很多。而`tree shaking`技术就可以让输出的代码只包含你需要的函数。

2015年的时候 Rollup推出了 `Tree Shaking` 功能，将这个概念真正带到了前端圈子中，随后 Webpack2 跟进也实现了 `Tree Shaking`，并在Webpack4中升级改进了方案


## TreeShaking 的基本原理

在编译器原理中，死码消除（Dead code elimination）是一种编译最佳化（Optimizing compiler）技术，它的用途是移除对程序执行结果没有任何影响的代码。移除这类代码可以减少程序的大小，避免执行过程中出现程序出现不相关的运算行为。无法执行的代码(unreachable code)， 执行结果不会被使用的代码和只会影响死变量（只写不读）的代码都属于 `Dead code`。

对于JavaScript这种动态语言来说，TreeShaking的实现原本是一件相对较困难的事情。为何从Rollup开始能把这种技术带去前端圈子呢？因为ES6的模块特性。较早提出的CommonJS, AMD等规范都是动态的，模块的导入导出可以在运行时动态的变化。同时对于模块来说都是一个个对象，无论他们导出什么，都可以通过属性的方式来访问，比如:

```js
const a = require(`./${file}.js/`) // 可以动态加载模块
const { stat, exists, readFile } = require('fs') // 解构导出的对象
var my_lib;
if (Math.random()) {
    my_lib = require('foo');
} else {
    my_lib = require('bar');
}

if (Math.random()) {
    exports.baz = ···;
}
```

而ES6中的模块特性不同，它实现静态模块结构。在编译时就要确定导入和导出的内容，不允许在运行时发生变化。而正是这静态类型的特性，与 `Treeshaking` 无比契合。传统编译型的语言中，都是由编译器将 `Dead Code` 从 AST（抽象语法树）中删除。而在JavaScript中使用 `Rollup` 和 `Webpack` 都可以完成了这个任务。

## Rollup

在 Rollup 中默认是启用treeshaking的。配置项中的 `treeshake` 默认为 `true`。包含其他一些选项，可按需配置。

```ts
// src/rollup/typed.d.ts
export interface NormalizedInputOptions {
  acorn: Object;
  acornInjectPlugins: Function[];
  cache: false | undefined | RollupCache;
  context: string;
  experimentalCacheExpiry: number;
  external: IsExternal;
  /** @deprecated Use the "inlineDynamicImports" output option instead. */
  inlineDynamicImports: boolean | undefined;
  input: string[] | { [entryAlias: string]: string };
  /** @deprecated Use the "manualChunks" output option instead. */
  manualChunks: ManualChunksOption | undefined;
  moduleContext: (id: string) => string;
  onwarn: WarningHandler;
  perf: boolean;
  plugins: Plugin[];
  preserveEntrySignatures: PreserveEntrySignaturesOption;
  /** @deprecated Use the "preserveModules" output option instead. */
  preserveModules: boolean | undefined;
  preserveSymlinks: boolean;
  shimMissingExports: boolean;
  strictDeprecations: boolean;
  treeshake: false | NormalizedTreeshakingOptions;
}

export interface NormalizedTreeshakingOptions {
  annotations: boolean;
  moduleSideEffects: HasModuleSideEffects;
  propertyReadSideEffects: boolean;
  tryCatchDeoptimization: boolean;
  unknownGlobalSideEffects: boolean;
}
```

`tresshake`这个参数主要影响两个地方：

1. 编译启动阶段`Graph`执行`build`方法时，过滤掉相应的Module，为剩余的Module创建AST的上下文
2. 编译过程会将`Module`中`getDependenciesToBeIncluded`方法返回的模块用作后续的chunk

在Rollup的源码：`src/Graph.ts`中有一个`includeStatements`方法。

**src/Graph.ts**

```ts
export default class Graph {
  ...
  async build(): Promise<void> {
    timeStart('generate module graph', 2);
    await this.generateModuleGraph();
    timeEnd('generate module graph', 2);

    timeStart('sort modules', 2);
    this.phase = BuildPhase.ANALYSE;
    this.sortModules();
    timeEnd('sort modules', 2);

    timeStart('mark included statements', 2);
    this.includeStatements();
    timeEnd('mark included statements', 2);

    this.phase = BuildPhase.GENERATE;
  }
  ...
  private includeStatements() {
    for (const module of [...this.entryModules, ...this.implicitEntryModules]) {
      if (module.preserveSignature !== false) {
        module.includeAllExports();
      } else {
        markModuleAndImpureDependenciesAsExecuted(module);
      }
    }
    if (this.options.treeshake) {
      let treeshakingPass = 1;
      do {
        timeStart(`treeshaking pass ${treeshakingPass}`, 3);
        this.needsTreeshakingPass = false;
        for (const module of this.modules) {
          if (module.isExecuted) module.include();
        }
        timeEnd(`treeshaking pass ${treeshakingPass++}`, 3);
      } while (this.needsTreeshakingPass);
    } else {
      for (const module of this.modules) module.includeAllInBundle();
    }
    for (const externalModule of this.externalModules) externalModule.warnUnusedImports();
    for (const module of this.implicitEntryModules) {
      for (const dependant of module.implicitlyLoadedAfter) {
        if (!(dependant.isEntryPoint || dependant.isIncluded())) {
          error(errImplicitDependantIsNotIncluded(dependant));
        }
      }
    }
  }
  ...
}
```

在 `if` 代码块中的 `module.include()` 和 `module.includeAllInBundle()` 做的事情很简单，就是

```ts
export default class Module {
  ...
  includeAllInBundle() {
  this.ast.include(createInclusionContext(), true);
  }
  ...
  include(): void {
  const context = createInclusionContext();
  if (this.ast.shouldBeIncluded(context)) this.ast.include(context, false);
  }
}
```

在Rollup的源码：`src/Module.ts`中有一个`getDependenciesToBeIncluded`方法，这个方法返回最后code split 时需要使用的 module。


**src/Module.ts**

```ts
export default class Module {
  ...
  getDependenciesToBeIncluded(): Set<Module | ExternalModule> {
    if (this.relevantDependencies) return this.relevantDependencies;
    const relevantDependencies = new Set<Module | ExternalModule>();
    const additionalSideEffectModules = new Set<Module>();
    const possibleDependencies = new Set(this.dependencies);
    let dependencyVariables = this.imports;
    if (this.isEntryPoint || this.includedDynamicImporters.length > 0 || this.namespace.included) {
      dependencyVariables = new Set(dependencyVariables);
      for (const exportName of [...this.getReexports(), ...this.getExports()]) {
        dependencyVariables.add(this.getVariableForExportName(exportName));
      }
    }
    for (let variable of dependencyVariables) {
      if (variable instanceof SyntheticNamedExportVariable) {
        variable = variable.getBaseVariable();
      } else if (variable instanceof ExportDefaultVariable) {
        const { modules, original } = variable.getOriginalVariableAndDeclarationModules();
        variable = original;
        for (const module of modules) {
          additionalSideEffectModules.add(module);
          possibleDependencies.add(module);
        }
      }
      relevantDependencies.add(variable.module!);
    }
    if (this.options.treeshake) {
      for (const dependency of possibleDependencies) {
        if (
          !(
            dependency.moduleSideEffects || additionalSideEffectModules.has(dependency as Module)
          ) ||
          relevantDependencies.has(dependency)
        ) {
          continue;
        }
        if (dependency instanceof ExternalModule || dependency.hasEffects()) {
          relevantDependencies.add(dependency);
        } else {
          for (const transitiveDependency of dependency.dependencies) {
            possibleDependencies.add(transitiveDependency);
          }
        }
      }
    } else {
      for (const dependency of this.dependencies) {
        relevantDependencies.add(dependency);
      }
    }
    return (this.relevantDependencies = relevantDependencies);
  }
}
```

## Webpack 

如果在Webpack想要对代码进行 tree-shaking，需要满足以下几项：

1. 你必须处于生产模式。Webpack 只有在压缩代码的时候会 tree-shaking
2. 必须将优化选项 `usedExports` 设置为 `true`。告诉 Webpack 识别出它认为没有被使用的代码，并在最初的打包步骤中给它做标记。
3. 最后使用一个支持删除死代码的压缩器。这种压缩器将识别出 Webpack 是如何标记它认为没有被使用的代码，并将其剥离。`TerserPlugin` 支持这个功能

下面是 Webpack 开启  tree-shaking 的基本配置：

```js
// Base Webpack Config for Tree Shaking
const config = {
  mode: 'production',
  optimization: {
    usedExports: true,
    minimizer: [
      new TerserPlugin({...})
    ]
  }
};
```

以webpack官网文档中的demo为例，当开始生产环境模式时，打包输出的内容会包含`unused harmony export`，以此来标记没有被使用的代码

**src/index.js**

```js
import _ from 'lodash';
import { cube } from './math.js';

function component() {
  const element = document.createElement('div');
  const element = document.createElement('pre');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.innerHTML = [
    'Hello webpack!',
    '5 cubed is equal to ' + cube(5)
  ].join('\n\n');

  return element;
}

document.body.appendChild(component());
```

**dist/bundle.js**

```js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
  'use strict';
  /* unused harmony export square */
  /* harmony export (immutable) */ __webpack_exports__['a'] = cube;
  function square(x) {
    return x * x;
  }

  function cube(x) {
    return x * x * x;
  }
});
```

然后再通过 `Terser-Webpack-Plugin` 压缩代码，将标记为未使用的代码删除。接下来我们看看这两个过程具体的代码实现。

在源码的 `lib/optimize.js`中，会先定义一个Set，保存所有暴露出来的未使用的exports

```js
// Set with all root exposed unused exports
/** @type {Set<string>} */
const unusedExports = new Set();
```

接下来遍历保存在`rootModule`中的所有`HarmonyExportSpecifierDependency`依赖，将没有使用的依赖名称保存到 `unusedExports`

```js
for (const dep of this.rootModule.dependencies) {
  if (dep instanceof HarmonyExportSpecifierDependency) {
    const used = /** @type {string | false } */ (this.rootModule.getUsedName(
      moduleGraph,
      dep.name
    ));
    if (used) {
      const info = moduleToInfoMap.get(this.rootModule);
      if (!exportsMap.has(used)) {
        exportsMap.set(
          used,
          () => `/* binding */ ${info.internalNames.get(dep.id)}`
        );
      }
    } else {
      unusedExports.add(dep.name || "namespace");
    }
  } else if (dep instanceof HarmonyExportExpressionDependency) {
    const used = /** @type {string | false } */ (this.rootModule.getUsedName(
      moduleGraph,
      "default"
    ));
    if (used) {
      const info = moduleToInfoMap.get(this.rootModule);
      if (!exportsMap.has(used)) {
        exportsMap.set(
          used,
          () =>
            `/* default */ ${info.internalNames.get(
              typeof dep.declarationId === "string"
                ? dep.declarationId
                : "__WEBPACK_MODULE_DEFAULT_EXPORT__"
            )}`
        );
      }
    } else {
      unusedExports.add("default");
    }
  } else if (dep instanceof HarmonyExportImportedSpecifierDependency) {
    const exportDefs = getHarmonyExportImportedSpecifierDependencyExports(
      dep,
      moduleGraph
    );
    for (const def of exportDefs) {
      const importedModule = moduleGraph.getModule(dep);
      const info = moduleToInfoMap.get(importedModule);
      const used = /** @type {string | false } */ (this.rootModule.getUsedName(
        moduleGraph,
        def.name
      ));
      if (used) {
        if (!exportsMap.has(used)) {
          exportsMap.set(used, requestShortener => {
            const finalName = getFinalName(
              moduleGraph,
              info,
              def.ids,
              moduleToInfoMap,
              requestShortener,
              runtimeTemplate,
              false,
              false,
              this.rootModule.buildMeta.strictHarmonyModule,
              true
            );
            return `/* reexport */ ${finalName}`;
          });
        }
      } else {
        unusedExports.add(def.name);
      }
    }
  }
}
```

在 `lib/dependencies/HarmonyExportInitFragment.js` 和 `lib/dependencies/HarmonyExportExpressionDependency.js` 都有打标记的操作

**lib/dependencies/HarmonyExportInitFragment.js**

```js
/**
 * @param {GenerateContext} generateContext context for generate
 * @returns {string|Source} the source code that will be included as initialization code
 */
getContent({ runtimeTemplate, runtimeRequirements }) {
  runtimeRequirements.add(RuntimeGlobals.exports);
  runtimeRequirements.add(RuntimeGlobals.definePropertyGetters);

  const unusedPart =
    this.unusedExports.size > 1
      ? `/* unused harmony exports ${joinIterableWithComma(
        this.unusedExports
      )} */\n`
      : this.unusedExports.size > 0
        ? `/* unused harmony export ${
        this.unusedExports.values().next().value
        } */\n`
        : "";
  const definitions = [];
  for (const [key, value] of this.exportMap) {
    definitions.push(
      `\n/* harmony export */   ${JSON.stringify(
        key
      )}: ${runtimeTemplate.returningFunction(value)}`
    );
  }
  const definePart =
    this.exportMap.size > 0
      ? `/* harmony export */ ${RuntimeGlobals.definePropertyGetters}(${
      this.exportsArgument
      }, {${definitions.join(",")}\n/* harmony export */ });\n`
      : "";
  return `${definePart}${unusedPart}`;
}
```

**lib/dependencies/HarmonyExportExpressionDependency.js**

```js

HarmonyExportExpressionDependency.Template = class HarmonyExportDependencyTemplate extends NullDependency.Template {
  /**
   * @param {Dependency} dependency the dependency for which the template should be applied
   * @param {ReplaceSource} source the current replace source which can be modified
   * @param {DependencyTemplateContext} templateContext the context object
   * @returns {void}
   */
  apply(
    dependency,
    source,
    { module, moduleGraph, runtimeTemplate, runtimeRequirements, initFragments }
  ) {
    const dep = /** @type {HarmonyExportExpressionDependency} */ (dependency);
    const used = module.getUsedName(moduleGraph, "default");
    const { declarationId } = dep;
    const exportsName = module.exportsArgument;
    if (declarationId) {
      let name;
      if (typeof declarationId === "string") {
        name = declarationId;
      } else {
        name = "__WEBPACK_DEFAULT_EXPORT__";
        source.replace(
          declarationId.range[0],
          declarationId.range[1] - 1,
          `${declarationId.prefix}${name}${declarationId.suffix}`
        );
      }

      if (used) {
        const map = new Map();
        map.set(used, `/* export default binding */ ${name}`);
        initFragments.push(new HarmonyExportInitFragment(exportsName, map));
      }

      source.replace(
        dep.rangeStatement[0],
        dep.range[0] - 1,
        `/* harmony default export */ ${dep.prefix}`
      );
    } else {
      let content;
      if (used) {
        runtimeRequirements.add(RuntimeGlobals.exports);
        if (runtimeTemplate.supportsConst()) {
          const name = "__WEBPACK_DEFAULT_EXPORT__";
          content = `/* harmony default export */ const ${name} = `;
          const map = new Map();
          map.set(used, name);
          initFragments.push(new HarmonyExportInitFragment(exportsName, map));
        } else {
          // This is a little bit incorrect as TDZ is not correct, but we can't use const.
          content = `/* harmony default export */ ${exportsName}[${JSON.stringify(
            used
          )}] = `;
        }
      } else {
        content =
          "/* unused harmony default export */ var _unused_webpack_default_export = ";
      }

      if (dep.range) {
        source.replace(
          dep.rangeStatement[0],
          dep.range[0] - 1,
          content + "(" + dep.prefix
        );
        source.replace(dep.range[1], dep.rangeStatement[1] - 0.5, ");");
        return;
      }

      source.replace(dep.rangeStatement[0], dep.rangeStatement[1] - 1, content);
    }
  }
};
```

`Terser-Webpack-plugin` 和 `Terser` 还未找到相关剔除代码的标记

## 总结 

虽然还没有完全理清楚Webpack中treeshaking在代码层面的具体逻辑，但是对比可以看到。Rollup采用的是先分析，然后找到需要的代码，最后再打包。而webpack则是先打标记，最后再剔除，比较符合标准的DCE的操作