import { loginSchema } from "@/lib/validation/auth";
import { callUpstream, extractMessage } from "@/lib/api/upstream";
import { setSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ message: "Enter a valid email and password." }, { status: 400 });
  }

  try {
    const { ok, status, data } = await callUpstream("users", "login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    if (!ok) {
      return Response.json(
        {
          message:
            extractMessage(data) ??
            (status >= 500
              ? "We can't reach the login service right now. Please try again shortly."
              : "That email and password don't match."),
        },
        { status: status >= 500 ? 502 : status },
      );
    }
    const user = (data as { data?: Record<string, unknown> })?.data ?? { email: parsed.data.email };
    await setSession(user);
    return Response.json({ user });
  } catch {
    return Response.json({ message: "The login service is unavailable right now." }, { status: 503 });
  }
}
