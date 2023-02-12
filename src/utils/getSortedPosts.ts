import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "../types";

const getSortedPosts = (posts: MarkdownInstance<Frontmatter>[]) =>
  posts
    .filter(({ frontmatter }) => !frontmatter.draft)
    .map(post => {
      const text = post.compiledContent().replace(/<[^>]+>/gi, "");
      const firstPeriodIdx = text.search(/\.\s|。/gi);
      const description =
        post.frontmatter.description ||
        text.slice(0, Math.min(250, firstPeriodIdx + 1));
      
      post.frontmatter.description = description;

      return post;
    })
    .sort((a, b) => {
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

export default getSortedPosts;
