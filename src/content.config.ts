import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blogs" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform(val => new Date(val)),
    description: z.string().optional(),
    author: z.string().optional(),
    cover: image().optional(),
    ogImage: z.string().optional(),
    slug: z.string().optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    categories: z
      .array(z.string())
      .default(["others"])
      .nullish()
      .or(z.string())
      .transform(val => (val ? (Array.isArray(val) ? val : [val]) : [])),
    draft: z.boolean().optional(),
  }),
});

export const collections = { blogs };
