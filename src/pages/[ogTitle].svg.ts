import type { APIRoute } from "astro";
import { getCollection } from 'astro:content';
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

const postImportResult = await getCollection("blogs", ({ data }) => !data.draft);
const postImportResult2 = await getCollection("notion", ({ data }) => !data.draft);
const posts = Object.values(postImportResult);
const posts2 = Object.values(postImportResult2);

export async function getStaticPaths() {
  return [...posts, ...posts2]
    .filter(({ data }: any) => !data.ogImage)
    .map(({ data }: any) => ({
      params: { ogTitle: data.title },
    }));
}
