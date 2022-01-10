
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/zhanglun/Documents/mine/zhanglun.github.io/.cache/dev-404-page.js")),
  "component---src-templates-blog-list-js": preferDefault(require("/Users/zhanglun/Documents/mine/zhanglun.github.io/src/templates/blog-list.js")),
  "component---src-templates-blog-post-js": preferDefault(require("/Users/zhanglun/Documents/mine/zhanglun.github.io/src/templates/blog-post.js")),
  "component---src-templates-categories-js": preferDefault(require("/Users/zhanglun/Documents/mine/zhanglun.github.io/src/templates/categories.js"))
}

