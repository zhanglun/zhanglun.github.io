---
title: 给Nest应用加上自定义配置
categories:
  - 技术研究
date: 2023-03-16T17:25:00.000+08:00
tags:
  - Node.js
  - JavaScrtipt
draft: false
cover: ./images/cover.jpg
---

在 [**使用飞书机器人串起前端研发流程**](https://zhanglun.github.io/blogs/%E4%BD%BF%E7%94%A8%E9%A3%9E%E4%B9%A6%E6%9C%BA%E5%99%A8%E4%BA%BA%E4%B8%B2%E8%B5%B7%E5%89%8D%E7%AB%AF%E7%A0%94%E5%8F%91%E6%B5%81%E7%A8%8B/) 一文中提高的飞书机器人初版发布上线，目前运行状况良好。文章末尾提到的程序健壮性，今天给它补上。


在目前的实现中，有一些配置项人工维护在代码中，开发和上线需要来回注释一些代码。其实可以通过增加环境变量和配置文件来解决。在 Node.js 应用程序中，通常使用 `.env` 文件，保存键值对，其中每个键代表一个特定值，以表示每个环境。在不同的环境中运行应用程序只需交换正确的 `.env` 文件即可。


过去在使用Koa作为框架开发Node.js 项目时，我习惯在项目中使用不同的yaml文件来设置不同环境的配置，通过`process.env` 判断环境变量，加载基础配置和对应的环境配置，聚合之后提供给Koa的实例。


```shell
|-- apps
|-- configs 
|----| config.base.yml
|----| config.daily.yml
|----| config.pre.yml
|----| config.prod.yml
```


在Nest中可以创建一个 `ConfigModule`，它提供了一个 `ConfigService` 来加载对应的 `.env` 文件。先安装依赖，然后注入。



```shell
npm i --save @nestjs/config
```


```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```


上面的代码将从默认位置（项目根目录）加载和解析 `.env` 文件，将 `.env` 文件中的键/值对与分配给 `process.env` 的环境变量合并，并将结果存储在可以通过 `ConfigService` 访问的私有结构中。 `forRoot()` 方法注册 `ConfigService` Provider，这个Provider读取这些分析/合并的配置变量的 `get()` 方法。 `@nestjs/config` 依赖于[dotenv](https://www.npmjs.com/package/dotenv)，所以在处理冲突时也是按照dotenv的规则来解决。当键作为环境变量存在于运行时环境中（例如，通过 OS shell 导出，如 `export DATABASE_USER=test` ）和 `.env` 文件中时，运行时环境变量优先。示例 `.env` 文件如下所示：


```plain text
DATABASE_USER=test
DATABASE_PASSWORD=test
```


默认情况下，包在应用程序的根目录中查找 `.env` 文件。如果要为 `.env` 文件指定其他路径，请设置传递给 `forRoot()` 的（可选）选项对象的 `envFilePath` 属性，如下所示：


```typescript
ConfigModule.forRoot({
  envFilePath: '.development.env',
});
```


```typescript
ConfigModule.forRoot({
  envFilePath: ['.env.development.local', '.env.development'],
});
```


要注意的是，如果在多个文件中找到变量，则第一个文件优先。通常来说使用`.env` 来管理不同环境的配置足以。对于更复杂的项目和更复杂的配置，使用Nest提供的自定义配置文件的能力来管理会更加合适一些。


自定义配置文件导出返回配置对象的工厂函数。配置对象可以是任意嵌套的纯 JavaScript 对象。 `process.env` 对象将包含完全解析的环境变量键/值对（如上所述解析和合并 `.env` 文件和外部定义的变量）。由于您控制返回的配置对象，因此您可以添加任何所需的逻辑以将值强制转换为适当的类型、设置默认值等。例如`config/configuration.ts` :


```typescript
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
});
```


使用`ConfigModule.forRoot()` 方法的选项对象的 `load` 属性加载此文件：


```typescript
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
})

export class AppModule {}
```


在其他模块中访问Config，需要将ConfigService注入到对应的模块。


```typescript
// webhooks.service.ts
@Module({
  imports: [ConfigModule],
  // ...
})

// webhooks.controller.ts
import { ConfigService } from '@nestjs/config';
...
constructor(private configService: ConfigService) {}
...

// 在其他地方使用
const dbUser = this.configService.get<string>('DATABASE_USER');
const dbHost = this.configService.get<string>('database.host');
const dbHost = this.configService.get<string>('database.host', '设置默认值localhost');
```


我还是更愿意使用yaml来管理我的配置，虽然需要编写一些额外的代码。


```bash
npm i js-yaml
npm i -D @types/js-yaml
```


```typescript
// config/configuration.ts
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const env = process.env.NODE_ENV || 'dev';
const YAML_CONFIG_FILENAME = `config.${env}.yaml`;

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};
```


另外，Nest CLI 在执行编译时，默认不会将非TS类型的文件复制到 dist 目录，所以还需要在`nest-cli.json`中增加`assets`的设置。要注意的是，assets配置是相对当前项目的入口src目录。在我的项目中，config文件夹目录是src目录的子目录，所以配置如下：


```typescript
{
  ...
  "compilerOptions": {
		...
    "assets": [
       "config/*.yaml",
    ],
	  ...
  },
	...
}
```


在 Nest 中，`ConfigModule` 也是Module，如前文提到的若想使用，必先导入。若使用配置的Module太多，一个个导入也挺麻烦的。如果想偷懒，可以使用 `isGlobal:true` 在 `app.module` 中将`ConfigModule`注册为全局。


```typescript
ConfigModule.forRoot({
  isGlobal: true,
	load: [configuration]
});
```

