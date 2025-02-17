import { slugifyStr } from "./slugify";
import type { CollectionEntry } from "astro:content";

const getUniqueCategories = (posts: CollectionEntry<"blogs" | "notion">[]) => {
  let categories: string[] = [];
  const filteredPosts = posts.filter(({ data }) => !data.draft);
  filteredPosts.forEach(post => {
    categories = categories
      .concat(post.data.categories)
      .map(category => slugifyStr(category))
      // .filter(
      //   (value: string, index: number, self: string[]) =>
      //     self.indexOf(value) === index && value
      // );
  });

  // return categories;
  let map = categories.reduce((acu: { [key: string]: number }, cur) => {
    if (!acu[cur]) {
      acu[cur] = 1;
    } else {
      acu[cur] += 1;
    }

    return acu;
  }, {});

  return Object.entries(map);
};

export default getUniqueCategories;
