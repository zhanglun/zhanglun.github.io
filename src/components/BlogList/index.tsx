import React, { useState } from "react";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "@types";
import { ArticleItemLine } from "./ArticleItemLine";
import slugify from "@utils/slugify";

export interface Props {
  allPosts: MarkdownInstance<Frontmatter>[];
}

export const BlogList = (props: Props) => {
  const { allPosts } = props;
  const prefix = import.meta.env.BASE_URL.slice(0, -1);

  return (
    <div className="m-auto">
      <ul className="w-full">
        {allPosts.map(({ frontmatter, id }: any) => {
          const href = id ?
            `${prefix}/blogs/${id}` :
            `${prefix}/blogs/${slugify(frontmatter)}`
          return (
            <ArticleItemLine
              key={frontmatter.title}
              href={href}
              frontmatter={frontmatter}
            />
          );
        })}
      </ul>
    </div>
  );
};
