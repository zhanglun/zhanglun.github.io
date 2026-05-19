import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blogs" }),
  schema: z.object({
    title: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform(val => new Date(val)),
    description: z.string().optional(),
    author: z.string().optional(),
    ogImage: z.string().optional(),
    slug: z.string().optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    categories: z
      .array(z.string())
      .default(["others"])
      .nullish()
      .or(z.string())
      .transform(val => [].concat(val)),
    draft: z.boolean().optional(),
  }),
});

const notion = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/notion" }),
  schema: z.object({
    title: z.string(),
    date: z
      .string()
      .or(z.date())
      .transform(val => new Date(val)),
    description: z.string().optional(),
    author: z.string().optional(),
    ogImage: z.string().optional(),
    slug: z.string().optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    categories: z
      .array(z.string())
      .default(["others"])
      .nullish()
      .or(z.string())
      .transform(val => [].concat(val)),
    draft: z.boolean().optional(),
  }),
});

export const collections = { blogs, notion };
