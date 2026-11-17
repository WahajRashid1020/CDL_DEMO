"use client";

import { useMutation } from "@tanstack/react-query";

/**
 * The blogs service answers 200 with `{ status: "pass" | ..., message }`.
 * Treat anything other than "pass" as a failure so the UI never shows a false success.
 */
export function useBlogsSubmit<T>(fn: (body: T) => Promise<Record<string, unknown>>) {
  return useMutation({
    mutationFn: async (body: T) => {
      const res = await fn(body);
      const message = typeof res.message === "string" ? res.message : undefined;
      if (res.status !== undefined && res.status !== "pass") throw new Error(message ?? "We couldn't send that. Please try again.");
      return message;
    },
  });
}
