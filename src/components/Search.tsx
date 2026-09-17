import Fuse from "fuse.js";
import React, { useEffect, useMemo, useState } from "react";
import formatDotDate from "@utils/formatDotDate";

type SearchItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  headings: string[];
  tags: string[];
};

interface Props {
  searchList: SearchItem[];
}

function matchingTags(tags: string[], q: string) {
  const n = q.trim().toLowerCase();
  if (n.length < 2) return [];
  return tags.filter(
    t => t.toLowerCase().includes(n) || n.includes(t.toLowerCase())
  );
}

function readQuery(search?: string) {
  const src =
    search ?? (typeof window === "undefined" ? "" : window.location.search);
  return new URLSearchParams(src).get("q") ?? "";
}

export default function SearchBar({ searchList }: Props) {
  const [inputVal, setInputVal] = useState(readQuery);
  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "tags"],
        minMatchCharLength: 2,
        threshold: 0.4,
      }),
    [searchList]
  );

  useEffect(() => {
    const onPop = () => setInputVal(readQuery());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function setQuery(next: string) {
    setInputVal(next);
    const url = new URL(window.location.href);
    const trimmed = next.trim();
    if (trimmed) url.searchParams.set("q", trimmed);
    else url.searchParams.delete("q");
    const href = url.pathname + url.search;
    if (href !== window.location.pathname + window.location.search) {
      history.replaceState(null, "", href);
    }
  }

  const q = inputVal.trim();
  const searching = q.length > 1;
  const tooShort = q.length === 1;
  const hits = searching
    ? fuse.search(inputVal).map(r => r.item)
    : tooShort
      ? []
      : searchList.slice(0, 8);
  const status = searching
    ? `${hits.length} 条结果 · ${inputVal}`
    : tooShort
      ? "再输入一个字"
      : "最近八篇";

  return (
    <>
      <label className="sr" htmlFor="q">
        搜索
      </label>
      <input
        id="q"
        className="search-box"
        value={inputVal}
        placeholder="搜标题或标签"
        onChange={e => setQuery(e.currentTarget.value)}
        autoComplete="off"
        autoFocus
      />
      <p className="muted px">
        {status}
        {q && !(searching && hits.length === 0) ? (
          <>
            {" "}
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery("")}
            >
              清空
            </button>
          </>
        ) : null}
      </p>
      {searching && hits.length === 0 ? (
        <p className="muted">
          没有命中。
          <button
            type="button"
            className="search-clear px"
            onClick={() => setQuery("")}
          >
            清空后看最近文章
          </button>
        </p>
      ) : tooShort ? null : (
        <div className="item-list search-hits">
          {hits.map(post => {
            const tags = searching ? matchingTags(post.tags, q) : [];
            return (
              <a key={post.id} href={`/blog/${post.id}`}>
                <time className="px" dateTime={post.date}>
                  {formatDotDate(post.date)}
                </time>
                <span>
                  {post.title}
                  {tags.length > 0 ? (
                    <small className="px muted"> {tags.join(" ")}</small>
                  ) : null}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
