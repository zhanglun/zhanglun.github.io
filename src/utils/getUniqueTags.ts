import { slugifyStr } from "./slugify";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "../types";

const getUniqueTags = (posts: MarkdownInstance<Frontmatter>[]): [string, number][] => {
  let tags: string[] = [];
  const filteredPosts = posts.filter(({ frontmatter }) => !frontmatter.draft);

  filteredPosts.forEach(post => {
    tags = [...tags, ...(post.frontmatter.tags || [])].map(tag =>
      slugifyStr(tag)
    );
  });

  let map = tags.reduce((acu: { [key: string]: number }, cur) => {
    if (!acu[cur]) {
      acu[cur] = 1;
    } else {
      acu[cur] += 1;
    }

    return acu;
  }, {});

  return Object.entries(map);
};

export default getUniqueTags;
