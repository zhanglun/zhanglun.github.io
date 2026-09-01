import { useMemo, useState } from "react";
import type { PostSummary } from "./types";

interface Props {
  posts: PostSummary[];
  onCreate: () => void;
  onSelect: (path: string) => void;
}

type Filter = "all" | "draft" | "published";

export default function PostList({ posts, onCreate, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = useMemo(() => posts
    .filter(post => post.title.toLowerCase().includes(query.toLowerCase()))
    .filter(post => filter === "all" || (filter === "draft" ? post.draft : !post.draft))
    .sort((a, b) => b.date.localeCompare(a.date)), [filter, posts, query]);

  return (
    <main className="admin-main">
      <header className="admin-toolbar">
        <div>
          <p className="admin-eyebrow">CONTENT DESK</p>
          <h1>文章管理</h1>
          <p className="admin-muted">{posts.length} 篇文章</p>
        </div>
        <button className="admin-button primary" onClick={onCreate} type="button">
          新建文章
        </button>
      </header>
      <div className="admin-list-tools">
        <input
          aria-label="搜索文章"
          onChange={event => setQuery(event.target.value)}
          placeholder="搜索标题…"
          type="search"
          value={query}
        />
        <div aria-label="文章状态" className="admin-tabs" role="tablist">
          {(["all", "draft", "published"] as Filter[]).map(value => (
            <button
              aria-selected={filter === value}
              className={filter === value ? "active" : ""}
              key={value}
              onClick={() => setFilter(value)}
              role="tab"
              type="button"
            >
              {value === "all" ? "全部" : value === "draft" ? "草稿" : "已发布"}
            </button>
          ))}
        </div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>标题</th><th>日期</th><th>状态</th><th>路径</th></tr></thead>
          <tbody>
            {filtered.map(post => (
              <tr className="admin-row" key={post.path} onClick={() => onSelect(post.path)}>
                <td><strong>{post.title}</strong><small>{post.categories.join(" · ")}</small></td>
                <td>{post.date}</td>
                <td><span className={`admin-status ${post.draft ? "draft" : "published"}`}>{post.draft ? "草稿" : "已发布"}</span></td>
                <td><code>{post.path}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p className="admin-empty">没有匹配的文章。</p>}
      </div>
    </main>
  );
}
