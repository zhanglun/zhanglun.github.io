import { useMemo } from "react";
import PostEditor from "./PostEditor";
import "./admin.css";

export default function AdminEditorApp() {
  const path = useMemo(() => (
    new URLSearchParams(window.location.search).get("path") || "new"
  ), []);
  return <PostEditor path={path} onBack={() => { window.location.href = "/admin/"; }} onSaved={() => {}} />;
}
