import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  title,
  children,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="admin-dialog-backdrop" role="presentation">
      <section
        aria-labelledby="dialog-title"
        aria-modal="true"
        className="admin-dialog"
        role="dialog"
      >
        <h2 id="dialog-title">{title}</h2>
        <p>{children}</p>
        <div className="admin-actions">
          <button className="admin-button secondary" onClick={onCancel} type="button">
            取消
          </button>
          <button className="admin-button danger" onClick={onConfirm} type="button">
            删除
          </button>
        </div>
      </section>
    </div>
  );
}
