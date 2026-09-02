import { markdown } from "@codemirror/lang-markdown";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { ApiError, deletePost, getPost, savePost } from "./api";
import ConfirmDialog from "./ConfirmDialog";
import type { PostContent, PostFrontmatter } from "./types";

interface Props { path: string; onBack: () => void; onSaved: () => void; }
const empty: PostFrontmatter = { title: "", date: new Date().toISOString().slice(0, 10), tags: [], categories: [], draft: true };
const split = (value: string) => value.split(",").map(item => item.trim()).filter(Boolean);

export default function PostEditor({ path, onBack, onSaved }: Props) {
  const isNew = path === "new";
  const [currentPath, setCurrentPath] = useState(path);
  const [post, setPost] = useState<PostContent>({ path, sha: "", frontmatter: empty, body: "" });
  const [dirty, setDirty] = useState(isNew);
  const [busy, setBusy] = useState(!isNew);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { if (!isNew) getPost(path).then(value => { setPost(value); setBusy(false); }).catch(error => { setError(error instanceof Error ? error.message : "加载失败"); setBusy(false); }); }, [isNew, path]);
  const update = (frontmatter: Partial<PostFrontmatter>, body = post.body) => { setPost(current => ({ ...current, frontmatter: { ...current.frontmatter, ...frontmatter }, body })); setDirty(true); };
  const persist = async (draft = post.frontmatter.draft) => { setBusy(true); setError(""); setSavedMessage(""); try { const saved = await savePost(currentPath, { frontmatter: { ...post.frontmatter, draft }, body: post.body, sha: post.sha }); setPost(saved); setCurrentPath(saved.path); setDirty(false); setSavedMessage(draft ? "草稿已保存" : "文章已发布"); onSaved(); onBack(); } catch (error) { setError(error instanceof ApiError && error.status === 409 ? "文章已被其他修改，请重新加载后再保存" : error instanceof Error ? error.message : "保存失败"); } finally { setBusy(false); } };
  const remove = async () => { setBusy(true); try { await deletePost(currentPath); onBack(); } catch (error) { setError(error instanceof Error ? error.message : "删除失败"); setBusy(false); } };

  useEffect(() => { const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === "s") { event.preventDefault(); void persist(); } }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); });
  if (busy && !post.body && !isNew) return <main className="admin-main"><p>{error || "正在加载…"}</p></main>;
  return <main className="admin-main admin-editor">
    <header className="admin-editor-header"><button className="admin-link" onClick={onBack} type="button">← 返回列表</button><div className="admin-actions"><button className="admin-button secondary" disabled={busy} onClick={() => void persist(true)} type="button">保存草稿</button><button className="admin-button primary" disabled={busy} onClick={() => void persist(false)} type="button">{post.frontmatter.draft ? "发布" : "保存修改"}</button>{!isNew && !post.frontmatter.draft && <button className="admin-button secondary" disabled={busy} onClick={() => void persist(true)} type="button">取消发布</button>}{!isNew && <button className="admin-button danger" disabled={busy} onClick={() => setConfirmDelete(true)} type="button">删除</button>}</div></header>
    <div className="admin-editor-meta"><input aria-label="文章标题" className="admin-title-input" onChange={event => update({ title: event.target.value })} placeholder="文章标题" value={post.frontmatter.title} /><div className="admin-fields"><label>日期<input onChange={event => update({ date: event.target.value })} type="date" value={post.frontmatter.date.slice(0, 10)} /></label><label>分类<input onChange={event => update({ categories: split(event.target.value) })} value={post.frontmatter.categories.join(", ")} /></label><label>标签<input onChange={event => update({ tags: split(event.target.value) })} value={post.frontmatter.tags.join(", ")} /></label><label className="admin-checkbox"><input checked={post.frontmatter.draft} onChange={event => update({ draft: event.target.checked })} type="checkbox" /> 草稿</label></div></div>
    <div className="admin-workspace"><div className="admin-code"><CodeMirror extensions={[markdown()]} height="520px" onChange={value => update({}, value)} theme="dark" value={post.body} /></div><aside className="admin-preview"><p className="admin-eyebrow">PREVIEW</p><h2>预览将在 PR4 接入</h2><p>当前编辑器已支持 Markdown 编写；实时渲染和图片上传将在后续 PR 实现。</p></aside></div>
    <footer className="admin-statusbar"><code>{currentPath}</code><span>{post.sha || "新文章"}</span><span>{dirty ? "未保存" : "已保存"}</span>{savedMessage && <strong>{savedMessage}</strong>}{error && <strong className="admin-error">{error}</strong>}</footer>
    {confirmDelete && <ConfirmDialog title="删除文章？" onCancel={() => setConfirmDelete(false)} onConfirm={() => void remove()}>删除后无法从后台恢复，请确认继续。</ConfirmDialog>}
  </main>;
}
