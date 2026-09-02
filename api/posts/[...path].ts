import { GitHubError } from "../_lib/github";
import { requireSession, unauthorized } from "../_lib/auth";
import { readPost, removePost, writePost } from "../_lib/posts";

type Context = { params: { path?: string | string[] } };
const pathFrom = (params: Context["params"]) => Array.isArray(params.path) ? params.path.join("/") : params.path || "";
const errorResponse = (error: unknown) => {
  const status = error instanceof GitHubError ? error.status : 502;
  return Response.json({ error: error instanceof Error ? error.message : "Request failed" }, { status });
};

export default async function handler(request: Request, context: Context) {
  if (!requireSession(request)) return unauthorized();
  const path = pathFrom(context.params);
  try {
    if (request.method === "GET") return Response.json(await readPost(path));
    if (request.method === "DELETE") { await removePost(path); return new Response(null, { status: 204 }); }
    if (request.method === "PUT") {
      const result = await writePost(path, await request.json());
      if (result.conflict) return Response.json({ error: "文章已被其他修改覆盖，请重新加载" }, { status: 409 });
      return Response.json(result.post);
    }
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, PUT, DELETE" } });
  } catch (error) { return errorResponse(error); }
}
