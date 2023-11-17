import React, { useState } from "react";
import { ArticleItemLine } from "./ArticleItemLine";
import type { CollectionEntry } from "astro:content";

export interface Props {
  allPosts: CollectionEntry<"blogs" | "notion">[];
}

export const BlogList = (props: Props) => {
  const { allPosts } = props;
  const prefix = import.meta.env.BASE_URL.slice(0, -1);

  return (
    <div className="m-auto">
      <ul className="w-full">
        {allPosts.map(({ data, slug }: any) => {
          const href = `${prefix}/blogs/${slug}`
          return (
            <ArticleItemLine
              key={data.title}
              href={href}
              frontmatter={data}
            />
          );
        })}
      </ul>
    </div>
  );
};
