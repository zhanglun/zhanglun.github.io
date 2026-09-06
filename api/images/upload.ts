import { createHash } from "node:crypto";
import matter from "gray-matter";
import { putContent, getContent } from "../_lib/github.js";
import { requireSession, unauthorized } from "../_lib/auth.js";
import { sendResponse, toRequest, type VercelRequest, type VercelResponse } from "../_lib/vercel.js";

const MAX_SIZE = 4 * 1024 * 1024;
const TYPES: Record<string, { ext: string; magic: number[] }> = {
  "image/png": { ext: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  "image/jpeg": { ext: "jpg", magic: [0xff, 0xd8, 0xff] },
  "image/webp": { ext: "webp", magic: [0x52, 0x49, 0x46, 0x46] },
};
const root = "src/content/blogs/";

// Vercel 可能预解析 body，也可能留原始流；两者都兼容
async function readBody(request: VercelRequest): Promise<Buffer> {
  if (typeof request.on === "function") {
    const buffered = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      request.on("data", (chunk: Buffer) => chunks.push(chunk));
      request.on("end", () => resolve(Buffer.concat(chunks)));
      request.on("error", reject);
    });
    if (buffered.length) return buffered;
  }
  if (request.body) return Buffer.isBuffer(request.body) ? request.body : Buffer.from(request.body as string, "binary");
  return Buffer.alloc(0);
}

async function handle(request: Request, raw: VercelRequest) {
  if (!requireSession(request)) return unauthorized();
  const post = new URL(request.url).searchParams.get("post") || "";
  if (!/^(?:\d{4}-\d{2}-\d{2}-)?[\w\u0080-\uffff .+，。！？：、（）《》【】—–_\-]+$/.test(post)) {
    return Response.json({ error: "Invalid post" }, { status: 400 });
  }
  const type = TYPES[request.headers.get("content-type") || ""];
  if (!type) return Response.json({ error: "Only PNG/JPEG/WebP allowed" }, { status: 415 });
  const body = await readBody(raw);
  if (!body.length || body.length > MAX_SIZE) {
    return Response.json({ error: "Image must be ≤ 4MB" }, { status: 413 });
  }
  if (!type.magic.every((byte, index) => body[index] === byte)) {
    return Response.json({ error: "Content does not match image type" }, { status: 415 });
  }
  let postIsDraft = false;
  try {
    // index.md 必须真实存在（防路径穿越 + 防孤儿图片），顺便取 draft 状态定 [skip ci]
    const index = await getContent(`${root}${post}/index.md`);
    const { data } = matter(Buffer.from(index.content || "", "base64").toString("utf8"));
    postIsDraft = data.draft === true || data.draft === "true";
  } catch {
    return Response.json({ error: "Post directory not found" }, { status: 404 });
  }
  const hash = createHash("sha256").update(body).digest("hex").slice(0, 6);
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const filename = `img-${date}-${hash}.${type.ext}`;
  const path = `${root}${post}/images/${filename}`;
  await putContent(path, `content: image add ${filename} → ${post}/`, body, undefined, postIsDraft);
  return Response.json({ markdown: `![image](./images/${filename})` });
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await sendResponse(await handle(toRequest(request), request), response);
}
