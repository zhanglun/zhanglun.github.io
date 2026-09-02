const token = () => process.env.GITHUB_CONTENT_TOKEN || "";
const repo = () => process.env.GITHUB_REPO || "zhanglun/zhanglun.github.io";
const [owner, name] = repo().split("/");
const branch = () => process.env.GITHUB_BRANCH || "master";
const headers = () => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token()}`,
  "X-GitHub-Api-Version": "2022-11-28",
});
const api = (path: string) => `https://api.github.com${path}`;

export class GitHubError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function github<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(api(path), {
    ...init,
    headers: { ...headers(), ...init?.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new GitHubError(response.status, data?.message || response.statusText);
  }
  return data as T;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function graphql<T>(query: string, variables: Record<string, string>) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json() as GraphQLResponse<T>;
  if (!response.ok || result.errors?.length || !result.data) {
    throw new GitHubError(response.status, result.errors?.[0]?.message || "GraphQL request failed");
  }
  return result.data;
}

export interface ContentFile {
  type: string;
  path: string;
  sha: string;
  content?: string;
}

export interface TreeEntry {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
}

export async function getContent(path: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return github<ContentFile>(
    `/repos/${repo()}/contents/${encodedPath}?ref=${encodeURIComponent(branch())}`
  );
}

interface BlogTree {
  repository: {
    object: {
      entries: Array<{
        name: string;
        object:
          | { oid: string; text: string }
          | {
              entries: Array<{
                name: string;
                object: { oid: string; text: string } | null;
              }>;
            }
          | null;
      }>;
    } | null;
  };
}

export async function getBlogFiles() {
  const result = await graphql<BlogTree>(
    `query($expression: String!) {
      repository(owner: "${owner}", name: "${name}") {
        object(expression: $expression) {
          ... on Tree {
            entries {
              name
              object {
                ... on Blob { oid text }
                ... on Tree {
                  entries {
                    name
                    object { ... on Blob { oid text } }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    { expression: `${branch()}:src/content/blogs` }
  );
  const entries = result.repository.object?.entries || [];
  const files: ContentFile[] = [];
  for (const entry of entries) {
    const object = entry.object;
    if (entry.name.endsWith(".md") && object && "text" in object) {
      files.push({
        type: "blob",
        path: `src/content/blogs/${entry.name}`,
        sha: object.oid,
        content: Buffer.from(object.text).toString("base64"),
      });
      continue;
    }
    if (!entry.object || !("entries" in entry.object)) continue;
    for (const child of entry.object.entries) {
      if (!child.name.endsWith(".md") || !child.object || !("text" in child.object)) continue;
      files.push({
        type: "blob",
        path: `src/content/blogs/${entry.name}/${child.name}`,
        sha: child.object.oid,
        content: Buffer.from(child.object.text).toString("base64"),
      });
    }
  }
  return files;
}

export async function getBlogTree() {
  const ref = await github<{ object: { sha: string } }>(
    `/repos/${repo()}/git/ref/heads/${encodeURIComponent(branch())}`
  );
  const result = await github<{ tree: Array<TreeEntry> }>(
    `/repos/${repo()}/git/trees/${ref.object.sha}?recursive=1`
  );
  return result.tree.filter(item => item.path.startsWith("src/content/blogs/"));
}

export async function createCommit(
  message: string,
  changes: Array<{ path: string; content?: string; delete?: boolean }>
) {
  const ref = await github<{ object: { sha: string } }>(
    `/repos/${repo()}/git/ref/heads/${encodeURIComponent(branch())}`
  );
  const headCommit = await github<{ tree: { sha: string } }>(
    `/repos/${repo()}/git/commits/${ref.object.sha}`
  );
  const base = await github<{ tree: TreeEntry[] }>(
    `/repos/${repo()}/git/trees/${headCommit.tree.sha}?recursive=1`
  );
  const blobs = await Promise.all(
    changes.filter(change => !change.delete).map(async change => {
      const blob = await github<{ sha: string }>(`/repos/${repo()}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({
          content: Buffer.from(change.content || "").toString("base64"),
          encoding: "base64",
        }),
      });
      return { path: change.path, mode: "100644", type: "blob" as const, sha: blob.sha };
    })
  );
  const deleted = new Set(changes.filter(change => change.delete).map(change => change.path));
  const changed = new Set(changes.map(change => change.path));
  const tree = [
    ...base.tree.filter(item => !deleted.has(item.path) && !changed.has(item.path)),
    ...blobs,
  ];
  const nextTree = await github<{ sha: string }>(`/repos/${repo()}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }),
  });
  const newCommit = await github<{ sha: string }>(`/repos/${repo()}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: nextTree.sha, parents: [ref.object.sha] }),
  });
  await github(`/repos/${repo()}/git/refs/heads/${encodeURIComponent(branch())}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha, force: false }),
  });
  return blobs[0]?.sha || newCommit.sha;
}

export async function getUser(code: string) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await response.json() as { access_token?: string; error?: string };
  if (!data.access_token) throw new Error(data.error || "OAuth token exchange failed");
  const user = await fetch("https://api.github.com/user", {
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${data.access_token}` },
  });
  if (!user.ok) throw new Error("GitHub user request failed");
  return user.json() as Promise<{ id: number }>;
}
