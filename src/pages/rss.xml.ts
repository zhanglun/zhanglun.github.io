import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "src/config";

export const GET = async () => {
  const posts = [
    ...(await getCollection("blogs", ({ data }) => !data.draft)),
    ...(await getCollection("notion", ({ data }) => !data.draft)),
  ];

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.website,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map(({ data, id }) => ({
        link: `/blog/${id}/`,
        title: data.title,
        description: data.description ?? data.title,
        pubDate: data.date,
      })),
  });
};
