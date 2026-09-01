import { sessionCookie, validOAuthState } from "../_lib/auth";
import { getUser } from "../_lib/github";
import { sendResponse, toRequest, type VercelRequest, type VercelResponse } from "../_lib/vercel";

async function handle(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || !validOAuthState(request, state)) {
    return Response.json({ error: "Invalid OAuth callback" }, { status: 400 });
  }
  try {
    const user = await getUser(code);
    if (String(user.id) !== process.env.ADMIN_GITHUB_USER_ID) {
      return Response.json({ error: "GitHub account is not allowed" }, { status: 403 });
    }
    return new Response(null, { status: 302, headers: { Location: process.env.PUBLIC_ADMIN_ORIGIN || "/admin", "Set-Cookie": sessionCookie(user.id) } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "OAuth failed" }, { status: 502 });
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await sendResponse(await handle(toRequest(request)), response);
}
