import { getSession } from "@/lib/auth/session";

export async function GET() {
  return Response.json({ user: await getSession() });
}
