import "server-only";
import { z } from "zod";

const schema = z.object({
  CALCULATORS_API_URL: z.url(),
  BLOGS_API_URL: z.url(),
  USERS_API_URL: z.url(),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
});

let cached: z.infer<typeof schema> | undefined;

/** Server-only env. Validated lazily so `next build` works without secrets. */
export function serverEnv() {
  cached ??= schema.parse(process.env);
  return cached;
}

export const services = {
  calculators: () => serverEnv().CALCULATORS_API_URL,
  blogs: () => serverEnv().BLOGS_API_URL,
  users: () => serverEnv().USERS_API_URL,
} as const;

export type ServiceName = keyof typeof services;
