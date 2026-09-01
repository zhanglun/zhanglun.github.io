import assert from "node:assert/strict";

process.env.SESSION_SECRET = "test-secret";
const { readSession, sessionCookie } = await import("../api/_lib/auth.ts");
const cookie = sessionCookie(123).split(";", 1)[0];
const request = new Request("https://example.test", { headers: { cookie } });
assert.equal(readSession(request)?.uid, 123);
assert.equal(readSession(new Request("https://example.test")), null);
const [, value] = cookie.split("=");
const [payload, signature] = value.split(".");
const tampered = new Request("https://example.test", {
  headers: { cookie: `admin_session=${payload}.${signature.slice(1)}x` },
});
assert.equal(readSession(tampered), null);
console.log("admin auth self-check ok");
