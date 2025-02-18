import { slugifyStr } from "./slugify";
import type { CollectionEntry } from "astro:content";

const getUniqueTags = (posts: CollectionEntry<"blogs" | "notion">[]): [string, number][] => {
  let tags: string[] = [];
  const filteredPosts = posts.filter(({ data }) => !data.draft);

  filteredPosts.forEach(post => {
    tags = [...tags, ...(post.data.tags || [])].map(tag =>
      // slugifyStr(tag)
      tag
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

  console.log(map)

  return Object.entries(map);
};

export default getUniqueTags;
