import type { NextRequest } from "next/server";
import { isAllowed } from "@/lib/api/allowlist";
import { callUpstream, extractMessage } from "@/lib/api/upstream";

type Ctx = RouteContext<"/api/[service]/[...path]">;

async function forward(req: NextRequest, ctx: Ctx) {
  const { service, path: segments } = await ctx.params;
  const path = segments.map(decodeURIComponent).join("/");

  if (!isAllowed(service, req.method, path)) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const { status, ok, data } = await callUpstream(service, path, {
      method: req.method,
      body: req.method === "GET" ? undefined : await req.text(),
      search: req.nextUrl.search,
    });
    if (ok) return Response.json(data, { status });
    return Response.json(
      { message: extractMessage(data) ?? "Something went wrong on our side. Please try again.", data },
      { status: status >= 500 ? 502 : status },
    );
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return Response.json(
      { message: timedOut ? "The service took too long to respond." : "The service is unavailable right now." },
      { status: timedOut ? 504 : 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
