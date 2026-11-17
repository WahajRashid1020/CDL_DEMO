import type { ServiceName } from "@/lib/env";

/**
 * Only these upstream endpoints are reachable through /api/[service]/... .
 * Patterns match the path after the service name. Auth endpoints are NOT here:
 * they go through /api/auth/* so the session cookie can be set server-side.
 */
export const allowlist: Record<ServiceName, { method: "GET" | "POST"; pattern: RegExp }[]> = {
  calculators: [
    { method: "GET", pattern: /^equipment_type$/ },
    { method: "GET", pattern: /^containers$/ },
    { method: "GET", pattern: /^container_size\/[\w-]+$/ },
    { method: "GET", pattern: /^chassis$/ },
    { method: "GET", pattern: /^hazmat_classes$/ },
    { method: "GET", pattern: /^verify_postal_code\/[\w -]+$/ },
    { method: "POST", pattern: /^dryvan_distance$/ },
    { method: "POST", pattern: /^dryvan$/ },
    { method: "POST", pattern: /^drayage$/ },
    { method: "POST", pattern: /^verify_promo_code$/ },
    { method: "POST", pattern: /^remove_promo_code$/ },
    { method: "POST", pattern: /^customer$/ },
    { method: "POST", pattern: /^request_a_call$/ },
    { method: "POST", pattern: /^get_in_touch$/ },
    { method: "POST", pattern: /^pay_now$/ },
    { method: "POST", pattern: /^pay_later$/ },
  ],
  blogs: [
    { method: "GET", pattern: /^blogs$/ },
    { method: "GET", pattern: /^blog\/[\w-]+$/ },
    { method: "GET", pattern: /^recent_blog$/ },
    { method: "POST", pattern: /^contact-us$/ },
    { method: "POST", pattern: /^apply-now$/ },
  ],
  users: [],
};

export function isAllowed(service: string, method: string, path: string): service is ServiceName {
  const rules = allowlist[service as ServiceName];
  return !!rules?.some((r) => r.method === method && r.pattern.test(path));
}
