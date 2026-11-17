import "server-only";
import { services, type ServiceName } from "@/lib/env";

/** Normalises the several error shapes the CDL services return into one message. */
export function extractMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  type Msg = { message?: unknown };
  const b = body as Msg & { detail?: Msg; data?: Msg; error?: unknown };
  const msg = b.detail?.message ?? b.message ?? b.data?.message ?? b.error;
  return typeof msg === "string" ? msg : undefined;
}

export async function callUpstream(
  service: ServiceName,
  path: string,
  init: { method: string; body?: BodyInit | null; search?: string; headers?: HeadersInit },
) {
  const base = services[service]();
  const url = new URL(path.replace(/^\/+/, "") + (init.search ?? ""), base.endsWith("/") ? base : `${base}/`);

  const res = await fetch(url, {
    method: init.method,
    body: init.body,
    headers: { accept: "application/json", "content-type": "application/json", ...init.headers },
    signal: AbortSignal.timeout(30_000),
    cache: "no-store",
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON error pages (e.g. Cloud Run's 503 HTML) carry nothing worth showing users;
    // callers fall back to their own friendly message.
    data = res.ok ? { message: text } : null;
    if (!res.ok) console.warn(`[upstream] ${service} ${path} → ${res.status} (non-JSON body)`);
  }
  return { status: res.status, ok: res.ok, data };
}
