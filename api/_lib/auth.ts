import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const COOKIE = "admin_session";
const STATE_COOKIE = "admin_oauth_state";
const MAX_AGE = 60 * 60 * 24 * 7;

const secret = () => process.env.SESSION_SECRET || "";
const encode = (value: string) => Buffer.from(value).toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString();
const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");

export interface Session { uid: number; exp: number; }

export function oauthStateCookie() {
  const state = randomBytes(24).toString("base64url");
  return {
    state,
    cookie: `${STATE_COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
  };
}

export function validOAuthState(request: Request, state: string) {
  return request.headers.get("cookie")?.match(new RegExp(`${STATE_COOKIE}=([^;]+)`))?.[1] === state;
}

export function sessionCookie(uid: number) {
  const payload = encode(JSON.stringify({ uid, exp: Math.floor(Date.now() / 1000) + MAX_AGE }));
  return `${COOKIE}=${payload}.${sign(payload)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function readSession(request: Request): Session | null {
  if (!secret()) return null;
  const raw = request.headers.get("cookie")?.match(new RegExp(`${COOKIE}=([^;]+)`))?.[1];
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const value = JSON.parse(decode(payload)) as Session;
    return value.exp > Math.floor(Date.now() / 1000) && Number.isInteger(value.uid) ? value : null;
  } catch { return null; }
}

export function requireSession(request: Request) {
  return readSession(request) || null;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
