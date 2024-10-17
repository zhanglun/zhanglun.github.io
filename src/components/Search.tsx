import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import Card from "@components/Card";
import slugify from "@utils/slugify";
import type { Frontmatter } from "src/types";
import { Search } from "lucide-react";

type SearchItem = {
  title: string;
  description: string;
  headings: string[];
  frontmatter: Frontmatter;
  compiledContent: string;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = new Fuse(searchList, {
    keys: ["title", "description", "headings"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.5,
  });

  useEffect(() => {
    // if URL has search query,
    // insert that search query in input field
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    // put focus cursor at the end of the string
    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    // Add search result only if
    // input value is more than one character
    let inputResult = inputVal.length > 1 ? fuse.search(inputVal) : [];

    setSearchResults(inputResult);

    // Update search string in URL
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState(null, "", newRelativePathQuery);
    } else {
      history.pushState(null, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <div className="max-w-5xl m-auto">
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
          <Search />
        </span>
        <input
          className="placeholder:italic placeholder:text-opacity-75 py-3 pl-10 pr-3 
        block bg-skin-fill w-full rounded
        border border-skin-fill border-opacity-40 
        focus:outline-none focus:border-skin-accent"
          placeholder="Search for anything..."
          type="text"
          name="search"
          defaultValue={inputVal}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
          ref={inputRef}
        />
      </label>

      {inputVal.length > 1 && (
        <div className="mt-8">
          Found {searchResults?.length}
          {searchResults?.length && searchResults?.length === 1
            ? " result"
            : " results"}{" "}
          for '{inputVal}'
        </div>
      )}

      <ul>
        {searchResults &&
          searchResults.map(({ item, refIndex }) => (
            <Card
              frontmatter={item.frontmatter}
              href={`${import.meta.env.BASE_URL.slice(0, -1)}/blog/${slugify(
                item.frontmatter
              )}`}
              key={`${refIndex}-${slugify(item.frontmatter)}`}
              rawContent={item.compiledContent}
            />
          ))}
      </ul>
    </div>
  );
}
