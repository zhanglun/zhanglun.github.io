import { useEffect, useRef, useState } from "react";
import "./admin.css";

interface Props {
  body: string;
  postDir: string | null;
}

// ponytail: 图片预览走 raw.githubusercontent 直链（仓库 public）；需要换仓库时改这里
const imageBase = import.meta.env.PUBLIC_IMAGE_BASE
  || "https://raw.githubusercontent.com/zhanglun/zhanglun.github.io/master/src/content/blogs";

export default function PreviewPane({ body, postDir }: Props) {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setError("");
      try {
        const response = await fetch("/api/preview", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error((await response.json()).error || "预览失败");
        setHtml((await response.json()).html);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setError(e instanceof Error ? e.message : "预览失败");
        }
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [body]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = html;
    // 相对图片路径 → raw 直链（新建未保存文章无图片，postDir 为 null 时跳过）
    if (postDir) {
      for (const img of container.querySelectorAll<HTMLImageElement>('img[src^="./images/"]')) {
        img.src = `${imageBase}/${postDir}/${img.getAttribute("src")!.slice(2)}`;
      }
    }
    // mermaid 代码块客户端渲染
    const blocks = [...container.querySelectorAll<HTMLElement>("code.language-mermaid")];
    if (blocks.length) {
      void (async () => {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "forest" });
        for (const block of blocks) {
          const { svg } = await mermaid.render(`mmd-${Math.random().toString(36).slice(2)}`, block.textContent || "");
          const wrap = document.createElement("div");
          wrap.className = "admin-mermaid";
          wrap.innerHTML = svg;
          block.parentElement!.replaceWith(wrap);
        }
      })();
    }
  }, [html, postDir]);

  return (
    <aside className="admin-preview">
      <p className="admin-eyebrow">PREVIEW</p>
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-preview-body" ref={containerRef} />
    </aside>
  );
}
