// /api/weather — Open-Meteo 代理(镇子实况天气用)。
// api.open-meteo.com 对国内访客直连不稳定,经本函数转发(可达性与站点一致);
// 模块级内存缓存按 0.1°(约 11km)网格聚合,10 分钟内同一格只回源一次,
// 粒子/雨声这类装饰性数据完全够用。无鉴权——只读、只转发上游、不落库。
import { sendResponse, toRequest, type VercelRequest, type VercelResponse } from "./_lib/vercel.js";

const CACHE_TTL = 10 * 60 * 1000;
const cache = new Map<string, { at: number; body: string }>();

async function handle(request: Request) {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get("lat"));
  const lon = Number(url.searchParams.get("lon"));
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180
  ) {
    return Response.json({ error: "Invalid lat/lon" }, { status: 400 });
  }
  const gridLat = lat.toFixed(1);
  const gridLon = lon.toFixed(1);
  const key = `${gridLat},${gridLon}`;
  const hit = cache.get(key);
  const now = Date.now();
  const headers = {
    "content-type": "application/json",
    "cache-control": "public, max-age=600",
  };
  if (hit && now - hit.at < CACHE_TTL) {
    return new Response(hit.body, { headers });
  }
  let upstream: Response;
  try {
    upstream = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${gridLat}&longitude=${gridLon}&current_weather=true`,
      { signal: AbortSignal.timeout(8000) }
    );
  } catch {
    return Response.json({ error: "Upstream unreachable" }, { status: 502, headers });
  }
  if (!upstream.ok) {
    return Response.json({ error: "Upstream error" }, { status: 502, headers });
  }
  const body = await upstream.text();
  cache.set(key, { at: now, body });
  // 防膨胀:超限时丢最旧的一格(网格数远小于阈值,基本不会触发)
  if (cache.size > 500) {
    let oldestKey: string | null = null;
    let oldestAt = Infinity;
    for (const [k, v] of cache) {
      if (v.at < oldestAt) {
        oldestAt = v.at;
        oldestKey = k;
      }
    }
    if (oldestKey) cache.delete(oldestKey);
  }
  return new Response(body, { headers });
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  await sendResponse(await handle(toRequest(request)), response);
}
