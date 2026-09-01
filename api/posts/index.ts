import { requireSession, unauthorized } from "../_lib/auth";
import { listPosts } from "../_lib/posts";
import { sendResponse, toRequest, type VercelRequest, type VercelResponse } from "../_lib/vercel";

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
