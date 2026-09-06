import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import { remarkReadingTime } from "../remark-reading-time.mjs";
import { requireSession, unauthorized } from "./_lib/auth.js";
import { sendResponse, toRequest, type VercelRequest, type VercelResponse } from "./_lib/vercel.js";

// 模块级单例：冷启动初始化一次，后续调用毫秒级
let processorPromise: ReturnType<typeof createMarkdownProcessor> | null = null;
const getProcessor = () => {
  processorPromise ??= createMarkdownProcessor({
    remarkPlugins: [
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
      remarkReadingTime,
    ],
    shikiConfig: { theme: "one-dark-pro", wrap: true },
  });
  return processorPromise;
};

async function handle(request: Request) {
  if (!requireSession(request)) return unauthorized();
  let input: { body?: unknown };
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const body = typeof input.body === "string" ? input.body : "";
  if (Buffer.byteLength(body, "utf8") > 500_000) {
    return Response.json({ error: "Body too large" }, { status: 413 });
  }
  try {
    const { code } = await (await getProcessor()).render(body);
    return Response.json({ html: code });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Render failed" }, { status: 500 });
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await sendResponse(await handle(toRequest(request)), response);
}
