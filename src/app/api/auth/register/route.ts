import { registerSchema } from "@/lib/validation/auth";
import { callUpstream, extractMessage } from "@/lib/api/upstream";

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { message: "Please check the highlighted fields.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { ok, status, data } = await callUpstream("users", "register", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return Response.json(
      {
        message:
          extractMessage(data) ??
          (ok
            ? "Thanks! We'll be in touch."
            : status >= 500
              ? "We can't reach the sign-up service right now. Please try again shortly."
              : "We couldn't create your account. Please check your details."),
      },
      { status: ok ? 200 : status >= 500 ? 502 : status },
    );
  } catch {
    return Response.json({ message: "The sign-up service is unavailable right now." }, { status: 503 });
  }
}
