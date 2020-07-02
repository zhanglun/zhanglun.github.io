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

```ts
// ./src/Graph.ts
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

TODO

关于这两个工具的使用本文不再赘述，感兴趣的可以自行搜索。



