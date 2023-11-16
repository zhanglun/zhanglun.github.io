import type { APIRoute } from "astro";
import { getCollection } from 'astro:content';
import generateOgImage from "@utils/generateOgImage";

export const GET: APIRoute = async ({ params }) => ({
  body: await generateOgImage(params.ogTitle),
});


const postImportResult = await getCollection("blogs", ({ data }) => !data.draft);
const posts = Object.values(postImportResult);

export async function getStaticPaths() {
  return posts
    .filter(({ data }: any) => !data.ogImage)
    .map(({ data }: any) => ({
      params: { ogTitle: data.title },
    }));
}
