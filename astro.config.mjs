import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import path from "node:path";
import { camelCase } from "change-case";

const HTML_REGEX = /const\s+html\s+=\s+(".*");/;
const IMG_REGEX = /<img\s.*?(src=('|")(.*?)(\2)).*?>/g;

function processHTMLContent(content, imgImports) {
  const cache = {};
    console.log("%c Line:16 🥛 content", "color:#f5ce50", content);
  const newContent = content.replace(IMG_REGEX, (imgTag, fullSrc, _0, src) => {
    console.log("%c Line:16 🍫 fullSrc", "color:#6ec1c2", fullSrc);

    if (/http(s)*|ftp(s)*/.test(src)) {
      return imgTag;
    }

    if (src.indexOf("./") !== 0) {
      src = "./" + src;
    }

    const variableName = `Image${camelCase(path.basename(src))}`;

    if (!cache[src]) {
      imgImports.push(`import ${variableName} from "${src}";`);
      cache[src] = 1;
    }

    const updatedImg = imgTag.replace(fullSrc, 'src="${' + variableName + '}"');
    console.log("%c Line:32 🍺 updatedImg", "color:#ea7e5c", updatedImg);

    return updatedImg;
  });

  return newContent;
}

// https://astro.build/config
export default defineConfig({
  site: "https://zhanglun.github.io/",
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    sitemap(),
  ],
  image: {
    service: passthroughImageService(),
  },
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
  // vite: {
  //   plugins: {
  //     name: "image-plugin",
  //     enforce: true,
  //     transform(code, id) {
  //       if (id.endsWith(".md")) {
  //         console.log("asdfsadfsadf=====> %s", id);
  //         console.log("%c Line:79 🍓 code", "color:#f5ce50", code);
  //         const imgImports = [];
  //         const result = code.replace(HTML_REGEX, (_0, html) => {
  //           const preprocessedHTML = JSON.parse(html) // to unescape the string
  //             .replace(/\\/g, "\\\\") // escape all the backslashes
  //             .replace(/\$/g, "\\$") // escape all dollar signs
  //             .replace(/`/g, "\\`"); // escape all back-ticks
  //           console.log("%c Line:80 🍻 preprocessedHTML", "color:#93c0a4", preprocessedHTML);
  //           const processedHTML = processHTMLContent(
  //             preprocessedHTML,
  //             imgImports
  //           );

  //             console.log("%c Line:85 🍇 imgImports", "color:#f5ce50", imgImports);
  //           return `const html = \`${processedHTML}\`;`;
  //         });

  //         const finalCode = `${imgImports.join("\n")}\n${result}`;

  //         return {
  //           code: finalCode,
  //         };
  //       }
  //     },
  //   },
  // },
});
