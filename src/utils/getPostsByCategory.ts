import { slufigyAll } from "./slugify";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "../types";

const getPostsByCategory = (
  posts: MarkdownInstance<Frontmatter>[],
  category: string
) =>
  posts.filter(post =>
    slufigyAll(
      [].concat(post?.frontmatter?.categories as []).filter(_ => _)
    ).includes(category)
  ).sort((a, b) => {
    console.log("🚀 ~ file: getPostsByCategory.ts:14 ~ ).sort ~ a", a)
    const l = new Date(a.frontmatter.date);
    const r = new Date(b.frontmatter.date); 

    if (l > r) {
      return -1
    } else if (l < r) {
      return 1
    } else {
      return 0
    }
  });

export default getPostsByCategory;
