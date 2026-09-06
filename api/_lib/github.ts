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
    throw new GitHubError(response.status, `${data?.message || response.statusText} [${init?.method || "GET"} ${path}]`);
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


export async function getContent(path: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return github<ContentFile>(
    `/repos/${repo()}/contents/${encodedPath}?ref=${encodeURIComponent(branch())}`
  );
}

export async function putContent(
  path: string,
  message: string,
  content: string,
  sha?: string
) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const result = await github<{ content: { sha: string }; commit: { sha: string } }>(
    `/repos/${repo()}/contents/${encodedPath}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        branch: branch(),
        ...(sha ? { sha } : {}),
      }),
    }
  );
  return result.content.sha;
}

export async function listContents(path: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const result = await github<ContentFile | ContentFile[]>(
    `/repos/${repo()}/contents/${encodedPath}?ref=${encodeURIComponent(branch())}`
  );
  return Array.isArray(result) ? result : [result];
}

export async function deleteContent(path: string, message: string, sha: string) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  await github(`/repos/${repo()}/contents/${encodedPath}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch: branch() }),
  });
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
