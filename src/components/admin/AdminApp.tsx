import { useEffect, useState } from "react";
import { ApiError, isFixtureMode, listPosts } from "./api";
import PostList from "./PostList";
import type { PostSummary } from "./types";
import "./admin.css";

export default function AdminApp() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [error, setError] = useState("");
  const refresh = () => listPosts()
    .then(nextPosts => { setPosts(nextPosts); setError(""); })
    .catch(error => setError(error instanceof ApiError && error.status === 401 ? "请先登录管理账号" : error.message));
  const edit = (path: string) => {
    window.location.href = `/admin/edit?path=${encodeURIComponent(path)}`;
  };
  useEffect(() => { void refresh(); }, []);
  return (
    <>
      <div className="admin-shell">
        <div className="admin-topbar">
          <span className="admin-mark">ZL / ADMIN</span>
          <span>{isFixtureMode ? "本地预览" : "管理服务"}</span>
        </div>
        {error && (
          <div className="admin-main admin-notice">
            <p className="admin-error">{error}</p>
            {!isFixtureMode && <a className="admin-button primary" href="/api/auth/login">GitHub 登录</a>}
          </div>
        )}
        <PostList onCreate={() => edit("new")} onSelect={edit} posts={posts} />
      </div>
    </>
  );
}
