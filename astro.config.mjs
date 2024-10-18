import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { remarkReadingTime } from "./remark-reading-time.mjs";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://zhanglun.github.io/",
  redirects: {
    "/blogs/[...slug]": "/blog/[...slug]",
  },
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    sitemap(),
    svelte(),
  ],
  // image: {
  //   service: squooshImageService(),
  // },
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
      remarkReadingTime,
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
});
