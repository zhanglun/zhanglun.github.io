import type { IncomingMessage, ServerResponse } from "node:http";

export interface VercelRequest extends IncomingMessage {
  body?: unknown;
  query: Record<string, string | string[] | undefined>;
}

export type VercelResponse = ServerResponse;

export function toRequest(request: VercelRequest) {
  const protocol = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers.host || "localhost";
  const headers = new Headers();
  for (const [key, value] of Object.entries(request.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  const body = request.method === "GET" || request.method === "HEAD"
    ? undefined
    : typeof request.body === "string"
      ? request.body
      : request.body === undefined
        ? undefined
        : JSON.stringify(request.body);
  return new Request(`${protocol}://${host}${request.url || "/"}`, {
    method: request.method,
    headers,
    body,
  });
}

export async function sendResponse(
  response: Response,
  target: VercelResponse
) {
  target.statusCode = response.status;
  response.headers.forEach((value, key) => target.setHeader(key, value));
  target.end(await response.text());
}
