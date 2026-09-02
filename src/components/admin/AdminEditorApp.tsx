import PostEditor from "./PostEditor";

interface Props { path: string; }

export default function AdminEditorApp({ path }: Props) {
  return <PostEditor path={path} onBack={() => { window.location.href = "/admin/"; }} onSaved={() => {}} />;
}
