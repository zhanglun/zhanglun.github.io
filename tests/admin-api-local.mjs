import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname;
const pnpmDir = `${root}/node_modules/.pnpm`;
const esbuild = readdirSync(pnpmDir)
  .filter(name => name.startsWith("esbuild@"))
  .map(name => `${pnpmDir}/${name}/node_modules/esbuild/bin/esbuild`)
  .find(existsSync);
assert.ok(esbuild, "esbuild is installed");

const bundle = (source, name) => {
  const output = `/tmp/${name}-${process.pid}.cjs`;
  execFileSync(esbuild, [source, "--bundle", "--platform=node", "--format=cjs", `--outfile=${output}`]);
  return output;
};

process.env.SESSION_SECRET = "local-test-secret";
process.env.GITHUB_CONTENT_TOKEN = "local-token";
process.env.GITHUB_REPO = "zhanglun/zhanglun.github.io";
process.env.GITHUB_BRANCH = "master";

const payload = Buffer.from(JSON.stringify({ uid: 123, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
const signature = createHmac("sha256", process.env.SESSION_SECRET).update(payload).digest("base64url");
const cookie = `admin_session=${payload}.${signature}`;

const files = {
  "src/content/blogs/2026-09-02-local/index.md": {
    sha: "blob-local",
    content: Buffer.from('---\ntitle: "Local"\ndate: "2026-09-02"\ndraft: true\n---\n\nBody').toString("base64"),
  },
  "src/content/blogs/2026-09-02-3-3/index.md": {
    sha: "blob-33",
    content: Buffer.from('---\ntitle: "33"\ndate: "2026-09-02"\ntags:\n  - "33"\ncategories:\n  - "33"\ndraft: true\n---\n\n33333').toString("base64"),
  },
};

const fetchCalls = [];
globalThis.fetch = async (url, init = {}) => {
  fetchCalls.push({ url: String(url), init });
  const body = init.body ? JSON.parse(init.body) : null;
  if (String(url).endsWith("/graphql")) {
    return Response.json({ data: { repository: { object: { entries: Object.entries(files).map(([path, file]) => ({
      name: path.split("/").at(-2),
      object: { entries: [{ name: "index.md", object: { oid: file.sha, text: Buffer.from(file.content, "base64").toString() } }] },
    })) } } } });
  }
  if (String(url).includes("/contents/")) {
    const path = decodeURIComponent(String(url).split("/contents/")[1].split("?")[0]);
    if (init.method === "PUT") return Response.json({ content: { sha: "blob-updated" }, commit: { sha: "commit-created" } });
    if (init.method === "DELETE") {
      for (const key of Object.keys(files)) if (key === path || key.startsWith(path + "/")) delete files[key];
      return Response.json({});
    }
    const file = files[path];
    if (file) return Response.json({ type: "file", path, sha: file.sha, content: file.content });
    const listing = Object.entries(files)
      .filter(([key]) => key.startsWith(path + "/"))
      .map(([key, value]) => ({ type: "file", path: key, name: key.split("/").pop(), sha: value.sha }));
    return listing.length ? Response.json(listing) : Response.json({ message: "Not Found" }, { status: 404 });
  }
  throw new Error(`unexpected fetch: ${url} ${JSON.stringify(body)}`);
};

const request = (url, method = "GET", body) => ({
  method,
  url,
  headers: { host: "localhost", cookie },
  body,
  query: Object.fromEntries(new URL(`http://localhost${url}`).searchParams),
});
const response = () => {
  const headers = {};
  return {
    headers,
    statusCode: 200,
    setHeader(key, value) { headers[key.toLowerCase()] = value; },
    end(value = "") { this.body = value; },
  };
};
const json = res => res.body ? JSON.parse(res.body) : undefined;

const require = createRequire(import.meta.url);
const list = require(bundle(`${root}/api/posts/index.ts`, "posts-index")).default;

let res = response();
await list(request("/api/posts"), res);
assert.equal(res.statusCode, 200);
assert.equal(json(res)[0].path, "2026-09-02-local/index.md");

res = response();
await list(request("/api/posts?path=2026-09-02-local%2Findex.md"), res);
assert.equal(res.statusCode, 200);
assert.equal(json(res).frontmatter.title, "Local");

res = response();
await list(request("/api/posts", "POST", {
  frontmatter: { title: "33", date: "2026-09-02", tags: ["33"], categories: ["33"], draft: true },
  body: "Body",
} ), res);
assert.equal(res.statusCode, 200);
assert.equal(json(res).path, "2026-09-02-3-3/index.md");
const createCall = fetchCalls.filter(call => call.init.method === "PUT").at(-1);
assert.match(JSON.parse(createCall.init.body).message, /create [\w\-.]+ \[skip ci\]$/);
const blobCall = fetchCalls.find(call => call.url.includes("/contents/") && call.init.method === "PUT");
const serialized = Buffer.from(JSON.parse(blobCall.init.body).content, "base64").toString();
assert.match(serialized, /title: "33"/);
assert.match(serialized, /- "33"/);

res = response();
await list(request("/api/posts?path=2026-09-02-3-3%2Findex.md", "PUT", {
  frontmatter: { title: "33", date: "2026-09-02", tags: ["33"], categories: ["33"], draft: false },
  body: "33333",
  sha: "blob-33",
}), res);
assert.equal(res.statusCode, 200);
assert.equal(json(res).frontmatter.draft, false);
assert.match(JSON.parse(fetchCalls.filter(call => call.init.method === "PUT").at(-1).init.body).message, /publish [\w\-.]+$/);

res = response();
await list(request("/api/posts?path=2026-09-02-local%2Findex.md", "PUT", {
  frontmatter: { title: "Updated", date: "2026-09-02", tags: [], categories: [], draft: true },
  body: "Updated body",
  sha: "blob-local",
}), res);
assert.equal(res.statusCode, 200);
assert.match(JSON.parse(fetchCalls.filter(call => call.init.method === "PUT").at(-1).init.body).message, /update [\w\-.]+ \[skip ci\]$/);

res = response();
await list(request("/api/posts?path=2026-09-02-local%2Findex.md", "PUT", {
  frontmatter: { title: "Conflict", date: "2026-09-02", tags: [], categories: [], draft: false },
  body: "Conflict body",
  sha: "stale-sha",
}), res);
assert.equal(res.statusCode, 409);

res = response();
await list(request("/api/posts?path=2026-09-02-local%2Findex.md", "DELETE"), res);
assert.equal(res.statusCode, 204);

const bundleEsm = (source, name) => {
  const output = `/tmp/${name}-${process.pid}.mjs`;
  execFileSync(esbuild, [source, "--bundle", "--platform=node", "--format=esm", "--banner:js=import { createRequire as __nodeCreateRequire } from 'node:module'; const require = __nodeCreateRequire(import.meta.url);", `--outfile=${output}`]);
  return output;
};

const preview = (await import(pathToFileURL(bundleEsm(`${root}/api/preview.ts`, "preview")).href)).default;
res = response();
await preview(request("/api/preview", "POST", { body: "# hi\n\n*em*" }), res);
assert.equal(res.statusCode, 200);
assert.match(json(res).html, /<h1/);
assert.match(json(res).html, /<em>em<\/em>/);
res = response();
await preview(request("/api/preview", "POST", { body: "```mermaid\nflowchart TD\n  A-->B\n```" }), res);
assert.equal(res.statusCode, 200);
// 客户端选择器依赖此结构（pre[data-language=mermaid]）；改动输出形状会静默破坏 mermaid 预览
assert.match(json(res).html, /data-language="mermaid"/);
res = response();
await preview(request("/api/preview"), res);
assert.equal(res.statusCode, 400);

const upload = require(bundle(`${root}/api/images/upload.ts`, "upload")).default;
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
res = response();
await upload({ ...request("/api/images/upload?post=2026-09-02-3-3", "POST", png), headers: { host: "localhost", cookie, "content-type": "image/png" } }, res);
assert.equal(res.statusCode, 200);
assert.match(json(res).markdown, /\.\/images\/img-\d{8}-[0-9a-f]{6}\.png/);
const putCalls = fetchCalls.filter(call => call.init.method === "PUT");
assert.ok(putCalls.some(call => call.url.includes("/contents/src/content/blogs/2026-09-02-3-3/images/")));
const imageCall = putCalls.find(call => call.url.includes("/images/"));
assert.match(JSON.parse(imageCall.init.body).message, /image add [\w\-.]+ → [\w\-.]+\/ \[skip ci\]$/);

res = response();
await upload({ ...request("/api/images/upload?post=2026-09-02-3-3", "POST", png), headers: { host: "localhost", cookie, "content-type": "image/gif" } }, res);
assert.equal(res.statusCode, 415);

res = response();
await upload({ ...request("/api/images/upload?post=2026-09-02-3-3", "POST", Buffer.from([0xff, 0xd8, 0xff, 0xe0])), headers: { host: "localhost", cookie, "content-type": "image/png" } }, res);
assert.equal(res.statusCode, 415);

res = response();
await upload({ ...request("/api/images/upload?post=..%2F..%2Fetc", "POST", png), headers: { host: "localhost", cookie, "content-type": "image/png" } }, res);
assert.ok([400, 404].includes(res.statusCode));

console.log("admin API local self-check ok");
