import assert from "node:assert/strict";

const apiUrl = path => path ? `/api/posts/${encodeURIComponent(path)}` : "/api/posts";

assert.equal(apiUrl(""), "/api/posts");
assert.equal(
  apiUrl("2026-09-02-3-3/index.md"),
  "/api/posts/2026-09-02-3-3%2Findex.md"
);
console.log("admin API URL self-check ok");
