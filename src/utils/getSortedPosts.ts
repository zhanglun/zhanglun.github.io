import type { CollectionEntry } from "astro:content";

const getSortedPosts = (posts: CollectionEntry<"blogs" | "notion">[]) =>
  posts
    .filter(({ data }) => !data.draft)
    .map(post => {
      const text = post.body.replace(/<[^>]+>/gi, "");
      const firstPeriodIdx = text.search(/\.\s|。/gi);
      const description =
        post.data.description ||
        text.slice(0, Math.min(250, firstPeriodIdx + 1));
      
      post.data.description = description;

      return post;
    })
    .sort((a, b) => {
      const l = new Date(a.data.date);
      const r = new Date(b.data.date); 

      if (l > r) {
        return -1
      } else if (l < r) {
        return 1
      } else {
        return 0
      }
    });

export default getSortedPosts;
