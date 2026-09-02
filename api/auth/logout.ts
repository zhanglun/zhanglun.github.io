import { clearSessionCookie } from "../_lib/auth.js";
import { sendResponse, type VercelRequest, type VercelResponse } from "../_lib/vercel.js";

async function handle() {
  return new Response(null, {
    status: 302,
    headers: { Location: "/admin", "Set-Cookie": clearSessionCookie() },
  });
}

export default async function handler(_request: VercelRequest, response: VercelResponse) {
  await sendResponse(await handle(), response);
}
