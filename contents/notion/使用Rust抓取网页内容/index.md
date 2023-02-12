---
title: 使用Rust抓取网页内容
categories: 技术研究
status: publish
date: 2022-10-14T00:00:00.000+08:00
tags:
  - Rust
cover: ""

---


在[Lettura](https://github.com/zhanglun/lettura)中已经基本实现了RSS阅读器的能力。日常的基本使用已经没有太大问题。 但是有很多RSS的源返回的主体内容只会有一些很简单的摘要信息，如果想查看更多内容，只能点击外链前往浏览器阅读。当遇到一些“标题党”文章时，前往浏览器阅读又会带来一些来自于这个额外操作的挫败感。所以一直想在Lettura中加上直接阅读全文的能力，让使用体验能够更加舒服一些。

在一些桌面阅读器中，也支持访问Web页面的能力。部分原生桌面程序比如Reeder、Readkit等通过WebView访问页面，有一些软件则通过工具提取页面的内容，再自定义展示。

可能有同学会想到，在Web中可以通过iframe标签代替WebView实现页面的加载。但是实际上iframe有诸多的限制，站点可以通过设置响应头`X-Frame-Options`或者`Content-Security-Policy`禁止自己的站点被iframe嵌入。

```toml
"X-Frame-Options": deny|saneorigin|allow-from [url]
"Content-Security-Policy": "frame-ancestors 'self'"
```

也可以通过JavaScrpit判断当前的页面的顶级窗口`window.top`和自身窗口`window.self`是否相等，如果不相等，则是因为嵌入了iframe。

```javascript
if (window.top != window.self) {
  window.top.location = window.self.location; // 替换顶级窗口的地址
}
```

iframe并不能完成解决当前的问题。在Tauri生态中，也有关于相关的[讨论](https://github.com/tauri-apps/tauri/issues/2975)，截止到本文发布时间，还没有实现相关特性。

页面内容提取在不同编程语言中都有相对较为热门的工具，比如Python中的[mercy-reader](https://pypi.org/project/mercy-reader/)，Node.js中的 [@postlight/mercury-parser](https://www.npmjs.com/package/@postlight/mercury-parser)。万变不离其宗，其核心的思路都可以简化为以下几个步骤：

- 发起HTTP请求访问url

- 解析返回的HTML内容，构建返回的数据格式

既然如此，用Rust来实现内容的提取吧。参考自 [https://www.scrapingbee.com/blog/web-scraping-rust/](https://www.scrapingbee.com/blog/web-scraping-rust/) 的文章，使用 reqwest 发起网络请求，使用 scraper 解析页面内容，抓取页面案例也依然使用IMDB。

## 创建项目，添加依赖

为了更好的演示，创建一个全新的项目。

```bash
cargo new web_scraper
```

在Cargo.toml中添加依赖。

```toml
[dependencies]
reqwest = {version = "0.11", features = ["blocking"]}
scraper = "0.12.0"
```

## 获取网页的HTML

reqwest是Rust生态中使用相当广泛的HTTP请求库，它提供的功能非常全面，基本上能满足大部分浏览器的能力。[reqwest::Client](https://docs.rs/reqwest/latest/reqwest/struct.Client.html) 默认是异步的，少量请求时，使用同步的[reqwest::blocking](https://docs.rs/reqwest/latest/reqwest/blocking/index.html)会更加方便一些。

```rust
fn main() {

    let response = reqwest::blocking::get(
        "https://www.imdb.com/search/title/?groups=top_100&sort=user_rating,desc&count=100",
    )
    .unwrap()
    .text()
    .unwrap();

}
```

## **从 HTML 中提取信息**

Web 抓取中最难的部分通常是从 HTML 文档中获取需要的特定信息。在Python中有pyquery，Node.js中有cherrio，JavaScript中有jQuery，Rust 中常用的工具是 scraper 库。它将 HTML 文档解析为树状结构来工作，可以使用 CSS 选择器来查询元素。在核心用法上这几个工具基本上大同小异。

首先将返回的数据解析成为scraper定义的数据结构。

```rust
let document = scraper::Html::parse_document(&response);
```

然后通过选择器找到自己想要的内容。比如，在这个例子中，我要找到IMDB中Top100的电影标题。首先通过浏览器的审查元素找到页面的结构，

```rust
<h3 class="lister-item-header">
    <span class="lister-item-index unbold text-primary">1.</span>
    <a href="/title/tt0111161/?ref_=adv_li_tt">The Shawshank Redemption</a>
    <span class="lister-item-year text-muted unbold">(1994)</span>
</h3>
```

构造出能够命中元素的CSS选择器，获取到元素内容

```rust
let title_selector = scraper::Selector::parse("h3.lister-item-header>a").unwrap();
let titles = document.select(&title_selector).map(|x| x.inner_html());
```

`titles` 是一个包含了100个元素的迭代器，可以遍历输出

```rust
titles.zip(1..101).for_each(|(item, number)| println!("{}. {}", number, item));
```

完整的代码如下：

```rust
fn main() {
    let response = reqwest::blocking::get(
        "https://www.imdb.com/search/title/?groups=top_100&sort=user_rating,desc&count=100",
    )
    .unwrap()
    .text()
    .unwrap();

    let document = scraper::Html::parse_document(&response);

    let title_selector = scraper::Selector::parse("h3.lister-item-header>a").unwrap();

    let titles = document.select(&title_selector).map(|x| x.inner_html());

    titles
        .zip(1..101)
        .for_each(|(item, number)| println!("{}. {}", number, item));
}
```

接下来执行`cargo run`，如果编译通过，你应该可以看到以下的输出：

```rust
1. The Shawshank Redemption
2. The Godfather
3. The Dark Knight
4. The Lord of the Rings: The Return of the King
5. Schindler's List
6. The Godfather: Part II
7. 12 Angry Men
8. Pulp Fiction
9. Inception
10. The Lord of the Rings: The Two Towers
...
```
