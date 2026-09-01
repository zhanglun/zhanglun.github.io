import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import generateOgImage from "@utils/generateOgImage";

export const GET: APIRoute = async ({ params }) => {
  const svg = await generateOgImage(params.ogTitle);

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
};

const posts = await getCollection(
  "blogs",
  ({ data }) => !data.draft
);

export async function getStaticPaths() {
  return posts
    .filter(({ data }: any) => !data.ogImage && !data.cover)
    .map(({ data }: any) => ({
      params: { ogTitle: data.title },
    }));
}
