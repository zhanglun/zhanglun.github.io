import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";

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
    const file = files[path];
    return file ? Response.json({ type: "file", path, sha: file.sha, content: file.content }) : Response.json({ message: "Not Found" }, { status: 404 });
  }
  if (String(url).includes("/git/ref/heads/")) return Response.json({ object: { sha: "head-sha" } });
  if (String(url).includes("/git/commits/head-sha")) return Response.json({ tree: { sha: "tree-sha" } });
  if (String(url).endsWith("/git/trees")) return Response.json({ sha: "tree-created" });
  if (String(url).includes("/git/trees/")) return Response.json({
    tree: Object.keys(files).map(path => ({ path, mode: "100644", type: "blob", sha: files[path].sha })),
  });
  if (String(url).endsWith("/git/blobs")) return Response.json({ sha: "blob-created" });
  if (String(url).endsWith("/git/commits")) return Response.json({ sha: "commit-created" });
  if (String(url).includes("/git/refs/heads/")) return Response.json({});
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
const blobCall = fetchCalls.find(call => call.url.endsWith("/git/blobs"));
const serialized = Buffer.from(JSON.parse(blobCall.init.body).content, "base64").toString();
assert.match(serialized, /title: "33"/);
assert.match(serialized, /- "33"/);

res = response();
await list(request("/api/posts?path=2026-09-02-local%2Findex.md", "PUT", {
  frontmatter: { title: "Updated", date: "2026-09-02", tags: [], categories: [], draft: false },
  body: "Updated body",
  sha: "blob-local",
}), res);
assert.equal(res.statusCode, 200);
assert.equal(json(res).frontmatter.title, "Updated");

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

console.log("admin API local self-check ok");
