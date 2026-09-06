import { markdown } from "@codemirror/lang-markdown";
import CodeMirror from "@uiw/react-codemirror";
import type { EditorView } from "@codemirror/view";
import { useEffect, useRef, useState } from "react";
import { ApiError, deletePost, getPost, savePost } from "./api";
import ConfirmDialog from "./ConfirmDialog";
import PreviewPane from "./PreviewPane";
import type { PostContent, PostFrontmatter } from "./types";
import "./admin.css";

interface Props { path: string; onBack: () => void; onSaved: () => void; }
const empty: PostFrontmatter = { title: "", date: new Date().toISOString().slice(0, 10), tags: [], categories: [], draft: true };
const split = (value: string) => value.split(",").map(item => item.trim()).filter(Boolean);
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export default function PostEditor({ path, onBack, onSaved }: Props) {
  const isNew = path === "new";
  const [currentPath, setCurrentPath] = useState(path);
  const [post, setPost] = useState<PostContent>({ path, sha: "", frontmatter: empty, body: "" });
  const [dirty, setDirty] = useState(isNew);
  const [busy, setBusy] = useState(!isNew);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [uploading, setUploading] = useState(false);
  const viewRef = useRef<EditorView | null>(null);

  const postDir = currentPath === "new" ? null : currentPath.replace(/\/index\.md$/, "");

  useEffect(() => { if (!isNew) getPost(path).then(value => { setPost(value); setBusy(false); }).catch(error => { setError(error instanceof Error ? error.message : "加载失败"); setBusy(false); }); }, [isNew, path]);
  const update = (frontmatter: Partial<PostFrontmatter>, body = post.body) => { setPost(current => ({ ...current, frontmatter: { ...current.frontmatter, ...frontmatter }, body })); setDirty(true); };
  const persist = async (draft = post.frontmatter.draft) => { setBusy(true); setError(""); setSavedMessage(""); try { const saved = await savePost(currentPath, { frontmatter: { ...post.frontmatter, draft }, body: post.body, sha: post.sha }); setPost(saved); setCurrentPath(saved.path); setDirty(false); setSavedMessage(draft ? "草稿已保存" : "文章已发布"); onSaved(); onBack(); } catch (error) { setError(error instanceof ApiError && error.status === 409 ? "文章已被其他修改，请重新加载后再保存" : error instanceof Error ? error.message : "保存失败"); } finally { setBusy(false); } };
  const remove = async () => { setBusy(true); try { await deletePost(currentPath); onBack(); } catch (error) { setError(error instanceof Error ? error.message : "删除失败"); setBusy(false); } };

  const insertAtCursor = (text: string) => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({ changes: { from: view.state.selection.main.from, insert: text } });
  };

  const uploadImage = async (file: File) => {
    if (!postDir) { setError("请先保存草稿后再插入图片"); return; }
    if (!IMAGE_TYPES.has(file.type)) { setError("仅支持 PNG / JPEG / WebP 图片"); return; }
    if (file.size > 4 * 1024 * 1024) { setError("图片不能超过 4MB"); return; }
    setError("");
    setUploading(true);
    const placeholder = "![uploading…]()";
    insertAtCursor(placeholder);
    try {
      const response = await fetch(`/api/images/upload?post=${encodeURIComponent(postDir)}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "上传失败");
      setPost(current => ({ ...current, body: current.body.replace(placeholder, data.markdown) }));
      setDirty(true);
    } catch (e) {
      setPost(current => ({ ...current, body: current.body.replace(placeholder, "") }));
      setError(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const imageFromEvent = (event: React.ClipboardEvent | React.DragEvent): File | null => {
    const files = "clipboardData" in event ? event.clipboardData?.files : (event as React.DragEvent).dataTransfer?.files;
    return files?.[0] && IMAGE_TYPES.has(files[0].type) ? files[0] : null;
  };

  useEffect(() => { const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === "s") { event.preventDefault(); void persist(); } }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); });
  if (busy && !post.body && !isNew) return <main className="admin-main"><p>{error || "正在加载…"}</p></main>;
  return <main className="admin-main admin-editor">
    <header className="admin-editor-header"><button className="admin-link" onClick={onBack} type="button">← 返回列表</button><div className="admin-actions"><label className={postDir ? "admin-button secondary" : "admin-button secondary disabled"} title={postDir ? "插入图片" : "先保存草稿后可插入图片"}>{uploading ? "上传中…" : "插入图片"}<input accept="image/png,image/jpeg,image/webp" hidden onChange={event => { const file = event.target.files?.[0]; if (file) void uploadImage(file); event.target.value = ""; }} type="file" /></label><button className="admin-button secondary" disabled={busy} onClick={() => void persist(true)} type="button">保存草稿</button><button className="admin-button primary" disabled={busy} onClick={() => void persist(false)} type="button">{post.frontmatter.draft ? "发布" : "保存修改"}</button>{!isNew && !post.frontmatter.draft && <button className="admin-button secondary" disabled={busy} onClick={() => void persist(true)} type="button">取消发布</button>}{!isNew && <button className="admin-button danger" disabled={busy} onClick={() => setConfirmDelete(true)} type="button">删除</button>}</div></header>
    <div className="admin-editor-meta"><input aria-label="文章标题" className="admin-title-input" onChange={event => update({ title: event.target.value })} placeholder="文章标题" value={post.frontmatter.title} /><div className="admin-fields"><label>日期<input onChange={event => update({ date: event.target.value })} type="date" value={post.frontmatter.date.slice(0, 10)} /></label><label>分类<input onChange={event => update({ categories: split(event.target.value) })} value={post.frontmatter.categories.join(", ")} /></label><label>标签<input onChange={event => update({ tags: split(event.target.value) })} value={post.frontmatter.tags.join(", ")} /></label><label className="admin-checkbox"><input checked={post.frontmatter.draft} onChange={event => update({ draft: event.target.checked })} type="checkbox" /> 草稿</label></div></div>
    <div className="admin-workspace"><div className="admin-code" onDragOver={event => event.preventDefault()} onDrop={event => { const file = imageFromEvent(event); if (file) { event.preventDefault(); void uploadImage(file); } }} onPaste={event => { const file = imageFromEvent(event); if (file) { event.preventDefault(); void uploadImage(file); } }}><CodeMirror extensions={[markdown()]} height="520px" onCreateEditor={view => { viewRef.current = view; }} onChange={value => update({}, value)} theme="dark" value={post.body} /></div><PreviewPane body={post.body} postDir={postDir} /></div>
    <footer className="admin-statusbar"><code>{currentPath}</code><span>{post.sha || "新文章"}</span><span>{dirty ? "未保存" : "已保存"}</span>{savedMessage && <strong>{savedMessage}</strong>}{error && <strong className="admin-error">{error}</strong>}</footer>
    {confirmDelete && <ConfirmDialog title="删除文章？" onCancel={() => setConfirmDelete(false)} onConfirm={() => void remove()}>删除后无法从后台恢复，请确认继续。</ConfirmDialog>}
  </main>;
}
