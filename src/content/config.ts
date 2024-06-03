import { defineCollection, z } from "astro:content";

const blogs = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    // Transform string to Date object
    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    tags: z.array(z.string()).default(["others"]),
    categories: z.array(z.string()).default(["others"]).nullish().or(z.string()).transform((val) => [].concat(val)),
    draft: z.boolean().optional(),
  })
});

const notion = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    // Transform string to Date object
    date: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    tags: z.array(z.string()).default(["others"]),
    categories: z.array(z.string()).default(["others"]).nullish().or(z.string()).transform((val) => [].concat(val)),
    draft: z.boolean().optional(),
  })
});

export const collections = { blogs, notion };
