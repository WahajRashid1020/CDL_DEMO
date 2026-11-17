import type { NextRequest } from "next/server";
import { findRule } from "@/lib/api/allowlist";
import { callUpstream, extractMessage } from "@/lib/api/upstream";

type Ctx = RouteContext<"/api/[service]/[...path]">;

async function forward(req: NextRequest, ctx: Ctx) {
  const { service, path: segments } = await ctx.params;
  const path = segments.map(decodeURIComponent).join("/");

  const rule = findRule(service, req.method, path);
  if (!rule) return Response.json({ message: "Not found" }, { status: 404 });

  let body: string | undefined;
  if (req.method !== "GET") {
    body = await req.text();
    if (rule.schema) {
      let json: unknown;
      try {
        json = JSON.parse(body);
      } catch {
        return Response.json({ message: "Invalid request body." }, { status: 400 });
      }
      const parsed = rule.schema.safeParse(json);
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        return Response.json({ message: first?.message ?? "Please check the form.", issues: parsed.error.issues }, { status: 400 });
      }
      body = JSON.stringify(parsed.data);
    }
  }

  try {
    const { status, ok, data } = await callUpstream(rule.service, path, { method: req.method, body, search: req.nextUrl.search });
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
