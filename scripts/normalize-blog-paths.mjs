import fs from "node:fs";
import path from "node:path";
import { slug } from "github-slugger";

const ROOT = "src/content/blogs";
const REPORT = "scripts/migrate-redirects.output.json";
const apply = process.argv.includes("--apply");

const clean = name =>
  name
    .replace(/\.md$/, "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*/g, "-")
    .replace(/ /g, "-");

const entries = fs.readdirSync(ROOT, { withFileTypes: true });
const flats = entries.filter(e => e.isFile() && e.name.endsWith(".md"));
const dirs = entries.filter(e => e.isDirectory());

const planned = [];
for (const file of flats) {
  const from = file.name;
  const to = `${clean(from)}/index.md`;
  planned.push({ kind: "file", from, to, fromId: slug(from.replace(/\.md$/, "")), toId: slug(clean(from)) });
}
for (const dir of dirs) {
  const from = dir.name;
  const to = clean(from);
  if (from === to) continue;
  planned.push({ kind: "dir", from, to, fromId: slug(from), toId: slug(to) });
}

const targets = new Map();
const collisions = [];
for (const item of planned) {
  const key = item.kind === "file" ? item.to.split("/")[0] : item.to;
  const prev = targets.get(key);
  if (prev) collisions.push([prev.from, item.from, key]);
  else targets.set(key, item);
}
for (const item of planned) {
  const key = item.kind === "file" ? item.to.split("/")[0] : item.to;
  const exists = path.join(ROOT, key);
  const taken = fs.existsSync(exists);
  const self = item.kind === "dir" && item.from === key;
  if (taken && !self && !planned.some(p => p.kind === "dir" && p.from === key)) {
    collisions.push([item.from, `(exists) ${key}`, key]);
  }
}

if (collisions.length) {
  console.error("COLLISIONS");
  for (const row of collisions) console.error(" ", row.join(" -> "));
  process.exit(1);
}

const urlChanges = planned.filter(p => p.fromId !== p.toId);
console.log(`moves ${planned.length}  url-changes ${urlChanges.length}  apply ${apply}`);
for (const item of planned) {
  const mark = item.fromId === item.toId ? " " : "*";
  console.log(`${mark} ${item.from} -> ${item.to}`);
  if (item.fromId !== item.toId) console.log(`    ${item.fromId} -> ${item.toId}`);
}

if (!apply) process.exit(0);

for (const item of planned) {
  if (item.kind === "file") {
    const destDir = path.join(ROOT, item.to.split("/")[0]);
    fs.mkdirSync(destDir, { recursive: true });
    fs.renameSync(path.join(ROOT, item.from), path.join(ROOT, item.to));
  } else {
    fs.renameSync(path.join(ROOT, item.from), path.join(ROOT, item.to));
  }
}

const report = JSON.parse(fs.readFileSync(REPORT, "utf8"));
const redirects = report.redirects;
const retarget = (from, to) => {
  for (const [src, dest] of Object.entries(redirects)) {
    if (dest === `/blog/${from}` || dest === `/blogs/${from}`) {
      redirects[src] = `/blog/${to}`;
    }
  }
  redirects[`/blog/${from}`] = `/blog/${to}`;
  redirects[`/blogs/${from}`] = `/blog/${to}`;
};
for (const item of urlChanges) retarget(item.fromId, item.toId);
report.generatedAt = new Date().toISOString();
report.stats.redirectCount = Object.keys(redirects).length;
fs.writeFileSync(REPORT, `${JSON.stringify(report, null, 2)}\n`);
console.log(`redirects now ${report.stats.redirectCount}`);
