import { slugifyStr } from "./slugify";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "../types";

const getUniqueCategories = (posts: MarkdownInstance<Frontmatter>[]) => {
  let categories: string[] = [];
  const filteredPosts = posts.filter(({ frontmatter }) => !frontmatter.draft);
  filteredPosts.forEach((post) => {
    categories = categories.concat(post.frontmatter.categories)
      .map((category) => slugifyStr(category))
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index && value
      );
  });
  
  return categories;
};

export default getUniqueCategories;
