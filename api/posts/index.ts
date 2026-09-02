import { requireSession, unauthorized } from "../_lib/auth.js";
import { listPosts, readPost, removePost, writePost } from "../_lib/posts.js";
import { sendResponse, toRequest, type VercelRequest, type VercelResponse } from "../_lib/vercel.js";

async function handle(request: Request) {
  if (!requireSession(request)) return unauthorized();
  const path = new URL(request.url).searchParams.get("path");
  try {
    if (request.method === "GET") {
      return Response.json(path ? await readPost(path) : await listPosts());
    }
    if (request.method === "POST") {
      const result = await writePost("new", await request.json());
      return Response.json(result.post);
    }
    if (request.method === "PUT" && path) {
      const result = await writePost(path, await request.json());
      if (result.conflict) return Response.json({ error: "文章已被其他修改覆盖，请重新加载" }, { status: 409 });
      return Response.json(result.post);
    }
    if (request.method === "DELETE" && path) {
      await removePost(path);
      return new Response(null, { status: 204 });
    }
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, POST, PUT, DELETE" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 502 });
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await sendResponse(await handle(toRequest(request)), response);
}
