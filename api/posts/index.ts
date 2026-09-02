import { requireSession, unauthorized } from "../_lib/auth";
import { listPosts } from "../_lib/posts";

export default async function handler(request: Request) {
  if (!requireSession(request)) return unauthorized();
  try {
    return Response.json(await listPosts());
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Failed to list posts" }, { status: 502 });
  }
}
