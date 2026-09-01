import { useEffect, useState } from "react";
import { ApiError, isFixtureMode, listPosts } from "./api";
import PostEditor from "./PostEditor";
import PostList from "./PostList";
import type { PostSummary } from "./types";
import "./admin.css";

export default function AdminApp() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [error, setError] = useState("");
  const refresh = () => listPosts().then(setPosts).catch(error => setError(error instanceof ApiError && error.status === 401 ? "请先登录管理账号" : error.message));
  useEffect(() => { void refresh(); }, []);
  if (selectedPath) return <PostEditor path={selectedPath} onBack={() => setSelectedPath(null)} onSaved={() => void refresh()} />;
  return <><div className="admin-shell"><div className="admin-topbar"><span className="admin-mark">ZL / ADMIN</span><span>{isFixtureMode ? "本地预览" : "管理服务"}</span></div>{error && <div className="admin-main admin-notice"><p className="admin-error">{error}</p>{!isFixtureMode && <a className="admin-button primary" href="/api/auth/login">GitHub 登录</a>}</div>}<PostList onCreate={() => setSelectedPath("new")} onSelect={setSelectedPath} posts={posts} /></div></>;
}
