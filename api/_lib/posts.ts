import matter from "gray-matter";
import { pinyin } from "pinyin-pro";
import type {
  PostContent,
  PostFrontmatter,
  PostSummary,
} from "../../src/components/admin/types.js";
import { createCommit, getBlogFiles, getBlogTree, getContent } from "./github.js";

const root = "src/content/blogs/";

const parse = (path: string, text: string, sha: string): PostContent => {
  const parsed = matter(text);
  const data = parsed.data as Record<string, unknown>;
  const list = (value: unknown) => {
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "string") return value.split(",").map(item => item.trim()).filter(Boolean);
    return [];
  };
  const frontmatter: PostFrontmatter = {
    title: String(data.title || ""),
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date || "").slice(0, 10),
    tags: list(data.tags),
    categories: list(data.categories),
    draft: data.draft === true || data.draft === "true",
    description: data.description ? String(data.description) : undefined,
    ogImage: data.ogImage ? String(data.ogImage) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
  };
  return { path, sha, frontmatter, body: parsed.content };
};

const yamlString = (value: string) => JSON.stringify(value);
const serialize = (frontmatter: PostFrontmatter, body: string) => {
  const lines = [
    `title: ${yamlString(frontmatter.title)}`,
    `date: ${yamlString(frontmatter.date)}`,
    "tags:",
    ...frontmatter.tags.map(item => `  - ${yamlString(item)}`),
    "categories:",
    ...frontmatter.categories.map(item => `  - ${yamlString(item)}`),
    `draft: ${frontmatter.draft}`,
  ];
  if (frontmatter.description) lines.push(`description: ${yamlString(frontmatter.description)}`);
  if (frontmatter.cover) lines.push(`cover: ${yamlString(frontmatter.cover)}`);
  if (frontmatter.ogImage) lines.push(`ogImage: ${yamlString(frontmatter.ogImage)}`);
  return `---\n${lines.join("\n")}\n---\n${body.startsWith("\n") ? body : `\n${body}`}`;
};

const decode = (content: string) => Buffer.from(content, "base64").toString("utf8");

export async function listPosts(): Promise<PostSummary[]> {
  const files = await getBlogFiles();
  const posts = files.map(file => parse(
    file.path.slice(root.length),
    decode(file.content || ""),
    file.sha
  ));
  return posts.map(post => ({ ...post.frontmatter, path: post.path }));
}

export async function readPost(path: string) {
  const file = await getContent(root + path);
  return parse(path, decode(file.content || ""), file.sha);
}

const safePath = (value: string) => value.match(
  /^(?:\d{4}-\d{2}-\d{2}-)?[\w\u0080-\uffff .+，。！？：、（）《》【】—–_\-]+(?:\/index\.md|\.md)$/u
) ? value : null;

export async function writePost(
  path: string,
  input: { frontmatter: PostFrontmatter; body: string; sha?: string }
) {
  const slug = slugifyTitle(input.frontmatter.title) || "untitled";
  const target = path === "new"
    ? `${input.frontmatter.date}-${slug}/index.md`
    : safePath(path);
  if (!target) throw new Error("Invalid post path");
  if (path !== "new") {
    const current = await getContent(root + target);
    if (input.sha && current.sha !== input.sha) return { conflict: true } as const;
  }
  const next = serialize(input.frontmatter, input.body);
  const previous = path === "new" ? null : await readPost(target);
  const action = path === "new"
    ? "create"
    : previous?.frontmatter.draft && !input.frontmatter.draft
      ? "publish"
      : !previous?.frontmatter.draft && input.frontmatter.draft
        ? "unpublish"
        : "update";
  const sha = await createCommit(
    `content: ${action} ${target.replace(/\/index\.md$/, "")}`,
    [{ path: root + target, content: next }]
  );
  return {
    conflict: false,
    post: { path: target, sha, frontmatter: input.frontmatter, body: input.body },
  } as const;
}

export async function removePost(path: string) {
  const safe = safePath(path);
  if (!safe) throw new Error("Invalid post path");
  const directory = root + safe.replace(/\/index\.md$/, "");
  const files = (await getBlogTree()).filter(file => (
    file.path === root + safe || file.path.startsWith(directory + "/")
  ));
  if (!files.length) throw new Error("Post not found");
  await createCommit(
    `content: delete ${safe.replace(/\/index\.md$/, "")}`,
    files.map(file => ({ path: file.path, delete: true }))
  );
}

export const slugifyTitle = (title: string) => pinyin(title, {
  toneType: "none",
  type: "array",
}).join("-").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
