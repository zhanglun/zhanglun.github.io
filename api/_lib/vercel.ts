import type { IncomingMessage, ServerResponse } from "node:http";

export interface VercelRequest extends IncomingMessage {
  body?: unknown;
  query: Record<string, string | string[] | undefined>;
}

export interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(value: unknown): VercelResponse;
  send(value: string): VercelResponse;
}

export function toRequest(request: VercelRequest) {
  const protocol = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers.host || "localhost";
  const url = `${protocol}://${host}${request.url || "/"}`;
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
  return new Request(url, { method: request.method, headers, body });
}

export async function sendResponse(
  response: Response,
  target: VercelResponse
) {
  target.statusCode = response.status;
  response.headers.forEach((value, key) => target.setHeader(key, value));
  const body = await response.text();
  if (body) target.end(body);
  else target.end();
}
