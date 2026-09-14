import Fuse from "fuse.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

const icons = [
  "ico-log",
  "ico-news",
  "ico-home",
  "ico-crate",
  "ico-face",
  "ico-search",
  "ico-404",
  "lh",
  "ico-tree",
  "ico-train",
];

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "description", "tags"],
        minMatchCharLength: 2,
        threshold: 0.4,
      }),
    [searchList]
  );

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setInputVal(q);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (inputVal) url.searchParams.set("q", inputVal);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url.pathname + url.search);
  }, [inputVal]);

  const hits =
    inputVal.trim().length > 1
      ? fuse.search(inputVal).map(r => r.item)
      : searchList.slice(0, 8);

  return (
    <>
      <label className="sr" htmlFor="q">
        搜索
      </label>
      <input
        id="q"
        ref={inputRef}
        className="search-box"
        value={inputVal}
        placeholder="搜标题或标签"
        onChange={e => setInputVal(e.currentTarget.value)}
        autoComplete="off"
        autoFocus
      />
      {inputVal.trim().length > 1 && (
        <p className="muted px">
          {hits.length} 条结果 · {inputVal}
        </p>
      )}
      {hits.length === 0 ? (
        <p className="muted">没有命中。</p>
      ) : (
        <div className="item-list">
          {hits.map((post, i) => (
            <a key={post.id} href={`/blog/${post.id}`}>
              <img
                className="px"
                src={`/ara/${icons[i % icons.length]}.png`}
                alt=""
                width={32}
                height={32}
              />
              <time className="px" dateTime={post.date}>
                {formatDotDate(post.date)}
              </time>
              <span>{post.title}</span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
