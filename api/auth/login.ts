import { oauthStateCookie } from "../_lib/auth";
import { sendResponse, type VercelRequest, type VercelResponse } from "../_lib/vercel";

async function handle() {
  if (!process.env.GITHUB_CLIENT_ID) {
    return Response.json({ error: "GitHub OAuth is not configured" }, { status: 503 });
  }
  const { state, cookie } = oauthStateCookie();
  const origin = process.env.PUBLIC_ADMIN_ORIGIN || "";
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
  url.searchParams.set("redirect_uri", `${origin}/api/auth/callback`);
  url.searchParams.set("state", state);
  return new Response(null, { status: 302, headers: { Location: url.href, "Set-Cookie": cookie } });
}

export default async function handler(_request: VercelRequest, response: VercelResponse) {
  await sendResponse(await handle(), response);
}
