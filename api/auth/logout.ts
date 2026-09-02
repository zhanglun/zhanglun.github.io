import { clearSessionCookie } from "../_lib/auth";

export default function handler() {
  return new Response(null, {
    status: 302,
    headers: { Location: "/admin", "Set-Cookie": clearSessionCookie() },
  });
}
