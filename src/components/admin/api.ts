import type {
  PostContent,
  PostSummary,
  SavePostInput,
} from "./types";

const fixturePosts: PostContent[] = [
  {
    path: "2025-01-15-astro-content/index.md",
    sha: "fixture-astro",
    frontmatter: {
      title: "Astro Content Collections 实践",
      date: "2025-01-15",
      tags: ["Astro", "TypeScript"],
      categories: ["前端"],
      draft: false,
      description: "用 Astro 管理博客内容。",
    },
    body: "# Astro Content Collections\n\n这是一篇 fixture 文章。",
  },
  {
    path: "2025-02-20-git-workflow/index.md",
    sha: "fixture-git",
    frontmatter: {
      title: "Git 工作流笔记",
      date: "2025-02-20",
      tags: ["Git"],
      categories: ["工具"],
      draft: false,
    },
    body: "# Git 工作流\n\n记录常用的 Git 操作。",
  },
  {
    path: "2025-03-01-draft/index.md",
    sha: "fixture-draft",
    frontmatter: {
      title: "一篇未完成的文章",
      date: "2025-03-01",
      tags: [],
      categories: ["草稿"],
      draft: true,
    },
    body: "先写到这里。",
  },
];

const useFixture = !import.meta.env.PUBLIC_ADMIN_ORIGIN;
const apiUrl = (path: string) => path ? `/api/posts?path=${encodeURIComponent(path)}` : "/api/posts";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(response.status, message || response.statusText);
  }
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
};

const summary = ({ frontmatter, path }: PostContent): PostSummary => ({
  path,
  title: frontmatter.title,
  date: frontmatter.date,
  draft: frontmatter.draft,
  tags: frontmatter.tags,
  categories: frontmatter.categories,
});

export const isFixtureMode = useFixture;

export async function listPosts(): Promise<PostSummary[]> {
  if (useFixture) return fixturePosts.map(summary);
  return request<PostSummary[]>(apiUrl(""));
}

export async function getPost(path: string): Promise<PostContent> {
  if (useFixture) {
    const post = fixturePosts.find(item => item.path === path);
    if (!post) throw new Error("文章不存在");
    return structuredClone(post);
  }
  return request<PostContent>(apiUrl(path));
}

export async function savePost(
  path: string,
  input: SavePostInput
): Promise<PostContent> {
  if (useFixture) {
    const existing = fixturePosts.find(item => item.path === path);
    if (existing) {
      Object.assign(existing, input, { path, sha: `${existing.sha}-saved` });
      return structuredClone(existing);
    }
    const created: PostContent = {
      path: `${input.frontmatter.date}-new-post/index.md`,
      sha: "fixture-new",
      frontmatter: input.frontmatter,
      body: input.body,
    };
    fixturePosts.unshift(created);
    return structuredClone(created);
  }
  return request<PostContent>(path === "new" ? apiUrl("") : apiUrl(path), {
    method: path === "new" ? "POST" : "PUT",
    body: JSON.stringify(input),
  });
}

export async function deletePost(path: string): Promise<void> {
  if (useFixture) {
    const index = fixturePosts.findIndex(item => item.path === path);
    if (index >= 0) fixturePosts.splice(index, 1);
    return;
  }
  await request(apiUrl(path), { method: "DELETE" });
}
