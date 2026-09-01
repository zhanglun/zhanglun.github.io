---
title: Lettura开发日志-设置Accpet提高对源的命中🎯
categories:
  - 技术研究
date: 2024-11-13T13:00:00.000+08:00
tags:
  - Rust
  - 笔记
draft: false
cover: ./images/cover.png
---

过一段时间的忙碌，我终于有时间来继续改进我的开源项目——Lettura，这是一个免费的RSS阅读器。虽然还在开发阶段，但我已经发布了一些测试版本，欢迎大家来体验。你可以在这里下载最新的版本：[Lettura Releases](https://github.com/zhanglun/lettura/releases)。


最近，遇到了一个有趣的问题。有用户反馈说，他无法在Lettura中订阅一个特定的RSS源。这个源的地址是[https://www.treasurydirect.gov/TA_WS/securities/announced/rss](https://www.treasurydirect.gov/TA_WS/securities/announced/rss)。刚看到这个问题的时候，我以为可能是这个RSS源的数据格式存在问题，导致Lettura无法解析。但经过检查，我发现数据格式其实是正确的。


查看日志发现，请求响应的状态码是 `406 Not Acceptable`。这意味着目标服务器无法提供我们请求的特定类型的数据。原因可能有：

1. **请求头与响应头不匹配**：客户端请求的媒体类型（如`application/json`）与服务器实际返回的媒体类型（如`text/html`）不一致。
2. **服务器配置问题**：服务器可能没有正确配置来处理特定媒体类型的请求。
3. **客户端请求错误**：客户端可能请求了服务器不支持的媒体类型。
4. 

那么首先排除第二点和第三点，因为通过浏览器是可以正常访问，对方服务器可以返回XML数据。那么不出意外的话，这个问题的原因就是请求头和响应头不匹配的问题。


经过一番排查，我发现问题出在了请求头上。打开Chrome的开发者工具看了一下，发现浏览器请求时`Accept`字段的值是一系列的数据类型，比如`text/html`、`application/xhtml+xml`等。而服务器返回的数据类型是`application/rss+xml`，正好在浏览器请求的类型列表中。


于是，我尝试用`curl`直接访问这个RSS源，结果返回了错误信息，用户遇到的问题一样。这说明问题确实出在了请求头上。


```json
{
  "timestamp": "2024-11-13T07:33:25.535+00:00",
  "status": 406,
  "error": "Not Acceptable",
  "path": "/TA_WS/securities/announced/rss"
}
```


curl 默认不会发送`Accept`请求头，而在使用Rust的`reqwest`库时，默认情况下，也是没有设置`Accept`请求头的默认值。于是我试着增加`Accept` 请求头，值为`text/html,application/xhtml+xml,application/xml;q=0.9,application/atom+xml;q=0.8,*/*;q=0.8`


```rust
client
    .get(url)
    .header(
      "accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,application/atom+xml;q=0.8,*/*;q=0.8",
    )
    .send()
    .await;
```


这样一改，问题就解决了，Lettura 能够成功接收到预期的XML数据结构，用户也可以正常订阅这个RSS源了。

