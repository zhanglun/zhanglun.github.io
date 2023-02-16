import { slugifyStr } from "./slugify";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "../types";

const getUniqueYears = (posts: MarkdownInstance<Frontmatter>[]) => {
  const wMap = new Map();
  const filteredPosts = posts
    .filter(({ frontmatter }) => !frontmatter.draft)
    .sort((a, b) => {
      const l = new Date(a.frontmatter.date);
      const r = new Date(b.frontmatter.date);

      if (l > r) {
        return -1;
      } else if (l < r) {
        return 1;
      } else {
        return 0;
      }
    });

  filteredPosts.forEach((cur: MarkdownInstance<Frontmatter>) => {
    const { date } = cur.frontmatter;
    let year = parseInt(Date.parse(date) ? new Date(date).getFullYear() + "" : "1999");

    if (!wMap.get(year)) {
      wMap.set(year, []);
    }

    wMap.set(year, [...wMap.get(year), cur]);
  });

  return new Map([...wMap.entries()].sort((l, r) => {
    if (l[0] > r[0]) {
      return -1;
    } else if (l[0] < r[0]) {
      return 1;
    } else {
      return 0;
    }
  }));
};

export default getUniqueYears;
