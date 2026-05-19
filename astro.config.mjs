import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import mermaid from "astro-mermaid";
import { remarkReadingTime } from "./remark-reading-time.mjs";

import tailwindcss from "@tailwindcss/vite";

// Vite 7 bug: @vite/env virtual module resolution fails in some environments.
// Providing it as an explicit no-op plugin fixes the import-analysis error.
const viteEnvPlugin = {
  name: "vite-env-virtual",
  enforce: "pre",
  resolveId(id) {
    if (id === "@vite/env") return id;
  },
  load(id) {
    if (id === "@vite/env") return "";
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://zhanglun.github.io/",

  redirects: {
    "/blogs/[...slug]": "/blog/[...slug]",
  },

  integrations: [
    react(),
    sitemap(),
    mermaid({
      theme: "forest",
      autoTheme: true,
    }),
  ],

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

  vite: {
    plugins: [tailwindcss(), viteEnvPlugin],
  },
});