---
title: " 图片缓存失效问题排查"
categories:
  - 解决方案
date: 2025-09-24T12:00:00.000+08:00
tags:
  - JavaScrtipt
  - Node.js
draft: false
---

为什么相同的 URL 请求了两次？——以及“加 crossorigin=anonymous”带来的风险


## 一、问题背景


最近在优化一个内部文档协作平台的图片加载性能时，我发现一个奇怪的现象：

> 同一个图片 URL，在页面中被请求了两次 —— 一次走 no-cors，一次走 cors，且第二次没有命中缓存。

明明 URL 一模一样，参数、路径、文件名都相同 —— 但浏览器就是重新发起了网络请求，浪费了带宽，拖慢了页面渲染。


更诡异的是，Network 面板显示：

- 第一次请求：`200 OK (from disk cache)` ✅
- 第二次请求：`200 OK`，重新下载 ❌

缓存明明生效了，为什么第二次不命中？


---


## 二、问题复现与初步排查


用 `curl` 模拟两次请求（实际来自浏览器）：


```bash
# 请求1：Sec-Fetch-Mode: no-cors
curl '<http://localhost:5173/api/files/xxx/adjusted-image.jpeg?t=1758249152812>' \\
  -H 'Sec-Fetch-Mode: no-cors'

# 请求2：Sec-Fetch-Mode: cors
curl '<http://localhost:5173/api/files/xxx/adjusted-image.jpeg?t=1758249152812>' \\
  -H 'Origin: <http://localhost:5173>' \\
  -H 'Sec-Fetch-Mode: cors'
```


响应头中，服务器已正确返回：


```plain text
Cache-Control: public, max-age=3600
Content-Type: image/jpeg
```


缓存策略是有的，而且是 `public`，按理说可以被任何请求缓存。


排除缓存头缺失的问题。


---


## 三、Sec-Fetch-Mode 导致缓存隔离


对比两个请求的 Request Headers，唯一显著区别是：

> 请求1：Sec-Fetch-Mode: no-cors
>
> **请求2：****`Sec-Fetch-Mode: cors`**
>
>

查了 Chrome 官方文档和规范，恍然大悟：

> 💡 现代浏览器（Chrome 86+）启用了“分区缓存”（Partitioned Cache），缓存键不仅包含 URL，还包含请求的“模式”（mode）、来源（origin）、凭据状态等。

也就是说：

- `no-cors` 和 `cors` 被视为**两个不同的缓存上下文**
- 即使 URL 相同，也不会共享缓存

这是为了防止跨站缓存探测攻击（例如：恶意网站通过缓存状态判断用户是否访问过某私有资源）。


安全第一，性能让步 —— 浏览器的选择可以理解，但对开发者来说，这是个“坑”。


---


## 四、为什么会出现两种模式？


在我们项目中：

- **`no-cors`** **请求**：来自普通的 `<img src="...">` 标签，默认行为。
- **`cors`** **请求**：来自 JS 中的 `fetch()` 或某些图像处理组件（如用于 canvas 绘制、滤镜、OCR 识别等）。

换句话说：

> 浏览器认为：一个“只是显示”的图片，和一个“要拿来用”的图片，是两种不同的资源，不能混用缓存。

---


## 五、解决方案：统一使用 `crossorigin="anonymous"`


既然缓存隔离是因为模式不同，那最直接的办法就是：

> 让所有图片请求都走 cors 模式。

具体做法：


### 给 `<img>` 标签加上 `crossorigin="anonymous"`


```html
<img src="/api/files/xxx/image.jpg" crossorigin="anonymous" />
```


这样，即使是普通图片加载，也会带上 `Origin` 头，以 `cors` 模式请求。


### 服务端必须返回 CORS 头


确保你的图片接口（如 `/api/files/xxx`）返回：


```plain text
Access-Control-Allow-Origin: *
# 或更安全地：
Access-Control-Allow-Origin: <https://yourdomain.com>
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
Access-Control-Allow-Headers: *
Vary: Origin
```


否则图片会加载失败（控制台报 CORS 错误）。


---


## 六、全局加 `crossorigin` 的四大坑


方案看似完美，但是全站 `<img>` 标签上注入 `crossorigin="anonymous"`，会有很像


### 坑一：第三方图片全部裂开


```html
<!-- 微信头像 -->
<img src="<https://wx.qlogo.cn/xxx>" crossorigin="anonymous">
```


控制台报错：

> Access to image at '<https://wx.qlogo.cn/>...' from origin '<https://your-app.com>' has been blocked by CORS policy...

微信、QQ、微博、Gravatar、部分 CDN 等服务商**默认不支持 CORS**。不是所有图片都配拥有 `crossorigin`。可以考虑按域名白名单启用


```javascript
// utils/image.js
const CORS_ALLOWED_DOMAINS = [
  window.location.origin,
  '<https://your-cdn.com>',
  '<https://img.your-company.com>'
];

export function shouldUseCORS(src) {
  if (!src) return false;
  try {
    const url = new URL(src.startsWith('/') ? window.location.origin + src : src);
    return CORS_ALLOWED_DOMAINS.some(domain => url.origin === domain);
  } catch {
    return false;
  }
}
```


在组件中使用：


```javascript
// components/Image.jsx
import { shouldUseCORS } from '@/utils/image';

export default function Image({ src, alt, ...props }) {
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      crossOrigin={shouldUseCORS(src) ? 'anonymous' : undefined}
    />
  );
}
```

> 原则：只对自己可控、已确认支持 CORS 的资源启用 crossorigin。

---


### 坑二：Safari 移动端偶发 CORS 失败（最难查）


iOS Safari 在某些网络环境（企业代理、校园网）下，对 CORS 请求更敏感，即使头信息完整，仍可能 block。


在这种场景下个，需要保证下面两点：

1. 确保响应头完整（见上文）
2. 避免携带 Cookie：

```javascript
fetch(url, { credentials: 'omit' })
```


极端情况做 UA 降级：


```javascript
const isSafariMobile = /Safari/.test(navigator.userAgent) && /Mobi|iPad|iPhone/.test(navigator.userAgent);

crossOrigin={!isSafariMobile && shouldUseCORS(src) ? 'anonymous' : undefined}
```


---


### 坑三：老旧 WebView 不支持 `crossorigin`


部分 Android 定制浏览器、企业内嵌 WebView 忽略该属性或报错。这种情况可以通过特性检测来处理。


```javascript
const supportsCrossorigin = 'crossOrigin' in new Image();

crossOrigin={supportsCrossorigin && shouldUseCORS(src) ? 'anonymous' : undefined}
```


---


### 坑四：监控缺失，裂图了没人知道


加了 `crossorigin` 后，图片加载失败不会触发常规错误上报，前端监控系统默认不采集“CORS block”错误。这种情况可以通过监听 `onerror` 并上报


```javascript
function Image({ src, ...props }) {
  const handleError = (e) => {
    reportError('IMAGE_CORS_FAIL', {
      src,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  };

  return (
    <img
      {...props}
      src={src}
      crossOrigin={shouldUseCORS(src) ? 'anonymous' : undefined}
      onError={handleError}
    />
  );
}
```


---


## 八、不适用crossorigin的替代方案


### 方案 1：统一用 JS fetch + createObjectURL


```javascript
async function loadImage(src) {
  const res = await fetch(src, { mode: 'cors', credentials: 'omit' });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
```


缺点：增加 JS 复杂度，SSR/首屏渲染可能受影响。


### 方案 2：服务端代理 + 注入 CORS 头


```javascript
app.get('/api/proxy-image', async (req, res) => {
  const imageBuffer = await axios.get(req.query.url, { responseType: 'arraybuffer' });
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'public, max-age=86400');
  res.type('jpg').send(imageBuffer);
});
```


缺点：增加服务器负载，注意防盗链和带宽成本。

