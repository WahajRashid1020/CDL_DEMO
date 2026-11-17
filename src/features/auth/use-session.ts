"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/api/services";
import type { LoginInput } from "@/lib/validation/auth";

export type SessionUser = Record<string, unknown> & {
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
};

const KEY = ["auth", "me"];

export function useSession() {
  const q = useQuery({
    queryKey: KEY,
    queryFn: async () => ((await auth.me()).user as SessionUser | null) ?? null,
    staleTime: 5 * 60_000,
  });
  return { user: q.data ?? null, loading: q.isLoading };
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => auth.login(input),
    onSuccess: (res) => qc.setQueryData(KEY, res.user as SessionUser),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => auth.logout(),
    onSettled: () => qc.setQueryData(KEY, null),
  });
}

/** The users service's field names aren't confirmed yet, so try the likely ones. */
export function displayName(u: SessionUser | null) {
  if (!u) return "";
  const full = [u.first_name, u.last_name].filter(Boolean).join(" ");
  return full || u.name || u.email || "Your account";
}

export function initials(u: SessionUser | null) {
  const n = displayName(u);
  const parts = n.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "U";
}

/** Only allow same-site relative redirects after login. */
export function safeNext(next: string | null | undefined, fallback = "/dashboard") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
