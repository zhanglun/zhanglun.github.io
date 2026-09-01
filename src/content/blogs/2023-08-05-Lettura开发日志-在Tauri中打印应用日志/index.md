---
title: Lettura开发日志-在Tauri中打印应用日志
categories:
  - 技术研究
date: 2023-08-05T14:00:00.000+08:00
tags:
  - Tauri
  - Rust
draft: false
---

[Lettura](https://github.com/zhanglun/lettura) 是一个开源的RSS阅读器，是我的开源项目。目前还在开发中，但是已经发布了测试版本，欢迎下载[https://github.com/zhanglun/lettura/releases](https://github.com/zhanglun/lettura/releases) 体验。


在开发过程中，为了方便调试，常常需要打印一些日志。在用户使用应用时，如果遇到错误，也需要输出对应的错误日志，以方便帮助开发者排查问题。所以说日志记录是软件的重要组成部分。这篇文章记录了我在Lettura中接入官方Tauri日志插件的过程。


默认情况下，在你开始基于Tauri开发应用时，项目中是没有日志记录相关的能力和配置的。我认为作为一个框架，Tauri应该集成这样的能力。不过这样对开发者来说可以选择自己喜欢的库来实现。


### 使用Tauri Plugin Log记录日志


我选择的是Tauri官方提供的日志插件 [Tauri Plugin Log](https://github.com/tauri-apps/tauri-plugin-log)。其底层依赖了rust中有名的日志库——[log](https://docs.rs/log/latest/log/)。


所以，先添加依赖包。


```toml
[dependencies]
...
log = "^0.4"
tauri-plugin-log = { git = "https://github.com/tauri-apps/plugins-workspace", branch = "dev" }
```


这个包添加了各种宏，您可以使用这些宏从 Rust 生成日志。最常见的是 **`info!`** 、 、 **`warn!`** **`error!`** 和 **`debug!`** 。因此，让我们尝试将其添加到我们的一个命令中：


```rust
#[tauri::command]fn greet(name: &str) -> String {
	info!("The name param is {}", name);
	format!("Hello, {}! You've been greeted from Rust!", name)
}
```


现在只需要在 **`main.rs`** 文件上将插件添加到 Tauri 的初始化中：


```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build()) // <-- this line here
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```


这时候再启动应用时，就可以在终端中看到下面这些日志信息了。


```prolog
[2023-08-04][14:11:11][tao::platform_impl::platform::window_delegate][TRACE] Triggered `windowDidResignKey:`
[2023-08-04][14:11:11][tao::platform_impl::platform::window_delegate][TRACE] Completed `windowDidResignKey:`
[2023-08-04][14:11:12][tao::platform_impl::platform::window_delegate][TRACE] Triggered `windowDidBecomeKey:`
[2023-08-04][14:11:12][tao::platform_impl::platform::window_delegate][TRACE] Completed `windowDidBecomeKey:`
[2023-08-04][14:11:17][hello_tauri][INFO] The name param is Jon
```


Tauri Log 插件附带了一个 JavaScript 库，可以使用它从 JavaScript 进行记录。


```plain text
npm add https://github.com/tauri-apps/tauri-plugin-log
```


然后从库中导入相同的 **`info`** 、 **`warn`** 、**`error`** 和 **`debug`** 函数：


```javascript
import { info } from "tauri-plugin-log-api";

function App() {
  ...
  async function greet() {
    info("Hello world")

    await invoke("greet", { name });
  }
...
```


这些在JS中的日志也会输出到终端中。


```bash
2023-08-22][09:49:24][INFO][log@http://localhost:3000/node_modules/.vite/deps/tauri-plugin-log-api.js:70:20] Hello world
```


默认情况下，Tauri Plugin Log 会将日志输出到两个地方：

1. Stdout。 开发时输出到终端
2. Log 文件。输出到用户的主目录中。

对于不同的操作系统，Log文件的目录也不相同，具体如下表格:


| **Platform** | **Location**                                 | **Example**                                                |
| ------------ | -------------------------------------------- | ---------------------------------------------------------- |
| macOS        | **`$HOME/Library/Logs/{bundleIdentifier}`**  | **`/Users/Bob/Library/Logs/com.domain.appname`**           |
| Windows      | **`%APPDATA%\${bundleIdentifier}\logs`**     | **`C:\Users\Bob\AppData\Roaming\com.domain.appname\logs`** |
| Linux        | **`$HOME/.config/${bundleIdentifier}/logs`** | **`/home/bob/.config/com.domain.appname\logs`**            |


其中**`bundleIdentifier`** 来自`tauri.config.json`中的`tauri.bundle.identifier` 。


```javascript
{
	...,
	"tauri": {
		"bundle": {
			"identifier": "com.lettura.dev",
			...
		}
	},
	...
}
```


### 区分开发和生产


此时，接入日志的工作基本上就算完成了。不过，当你运行的时候，你会发现一个问题：开发时的日志也输出到了用户的日志目录下，虽然没什么大问题，但是原则上开发和生产还是要区分一下的。


使用rust的条件编译可以轻松解决这个问题。


```rust
#[cfg(debug_assertions)]
const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::Webview];

#[cfg(not(debug_assertions))]
const LOG_TARGETS: [LogTarget; 2] = [LogTarget::Stdout, LogTarget::LogDir];

...
.plugin(tauri_plugin_log::Builder::default().targets(LOG_TARGETS).build())
```


### 为日志加上颜色


有些日志肯定比其他日志更重要，所以不管是什么语言和框架，生态中的日志工具都会为不同类型的日志提供不同的颜色以帮助区分。Tauri 日志插件允许您为各种不同的日志级别着色，因此您可以轻松发现重要的日志级别。


首先 **`colored`** 该功能：


```toml
...
log = "^0.4"
tauri-plugin-log = { git = "https://github.com/tauri-apps/plugins-workspace", branch = "dev", features = ["colored"] }
```


然后在插件上启用它：


```rust
use tauri_plugin_log::fern;

...
.plugin(
    tauri_plugin_log::Builder::default().targets([
        LogTarget::Stdout,
        LogTarget::Webview,
    ])
   .with_colors(fern::colors::ColoredLevelConfig::default())
    .build()
)
...
```


### 过滤不需要的日志


由于Tauri的内部日志，终端上有相当多的噪音，我们需要的日志有时候会淹没在这些内置的日志消息中。默认情况下，插件将输出所有日志，但我们可以通过设置最低日志级别来更改它：


```rust
use log::LevelFilter;

.plugin(
    tauri_plugin_log::Builder::default().targets([
        LogTarget::Stdout,
        LogTarget::Webview,
    ])
   .with_colors(ColoredLevelConfig::default())
   .level(LevelFilter::Warn)
   .build()
)
```


上面的代码将仅输出级别为 或 **`warn`** 更高级别的日志，非常适合发布版本。但是如果它过滤太多，我们也可以按模块过滤。该插件允许您指定要过滤的模块列表和相应的日志级别，如果您想过滤掉特定依赖项的日志，这将非常有用：


```rust
.plugin(
    tauri_plugin_log::Builder::default().targets([
        LogTarget::Stdout,
        LogTarget::Webview,
    ])
    .with_colors(ColoredLevelConfig::default())
   .level_for("tauri", LevelFilter::Info)
   .level_for("hyper", LevelFilter::Info)
    .level(LevelFilter::Debug)
    .build(),
)
```


上面的代码将仅输出级别为 和 **`info`** 的日志 **`tauri`** 和 **`hyper`** 级别为或更高的模块，同时保留级别 **`debug`** 为或更高级别的其他模块的日志。


### 参考


* [Complete guide to logging with Tauri](https://aptabase.com/blog/complete-guide-tauri-log)

