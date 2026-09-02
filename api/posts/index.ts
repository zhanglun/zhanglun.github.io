import { requireSession, unauthorized } from "../_lib/auth.js";
import { listPosts } from "../_lib/posts.js";
import { sendResponse, toRequest, type VercelRequest, type VercelResponse } from "../_lib/vercel.js";

async function handle(request: Request) {
  if (!requireSession(request)) return unauthorized();
  try {
    return Response.json(await listPosts());
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Failed to list posts" }, { status: 502 });
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await sendResponse(await handle(toRequest(request)), response);
}
