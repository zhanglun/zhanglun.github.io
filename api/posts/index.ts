import { requireSession, unauthorized } from "../_lib/auth.js";
import { listPosts, writePost } from "../_lib/posts.js";
import { sendResponse, toRequest, type VercelRequest, type VercelResponse } from "../_lib/vercel.js";

async function handle(request: Request) {
  if (!requireSession(request)) return unauthorized();
  try {
    if (request.method === "POST") {
      const result = await writePost("new", await request.json());
      return Response.json(result.post);
    }
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, POST" } });
    }
    return Response.json(await listPosts());
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Failed to list posts" }, { status: 502 });
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await sendResponse(await handle(toRequest(request)), response);
}
