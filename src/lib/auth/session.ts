import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/env";

const COOKIE = "cdl_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = Record<string, unknown> & {
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
};

function sign(payload: string) {
  return createHmac("sha256", serverEnv().SESSION_SECRET).update(payload).digest("base64url");
}

export async function setSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify({ user, iat: Date.now() })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).user ?? null;
  } catch {
    return null;
  }
}
