import { z } from "zod";
import type { ServiceName } from "@/lib/env";
import { applySchema, contactSchema, MAX_RESUME_BYTES } from "@/lib/validation/forms";

type Rule = { method: "GET" | "POST"; pattern: RegExp; schema?: z.ZodType };

/** base64 is ~4/3 the size of the file it encodes. */
const applyWithLimit = applySchema.refine((v) => v.resume.length <= Math.ceil((MAX_RESUME_BYTES * 4) / 3) + 4, {
  message: "Résumé must be 5 MB or smaller",
  path: ["resume"],
});

/**
 * Only these upstream endpoints are reachable through /api/[service]/... .
 * Patterns match the path after the service name. Rules with a `schema` have their JSON
 * body validated (and stripped of unknown fields) before it is forwarded.
 * Auth endpoints are NOT here: they go through /api/auth/* so the session cookie can be set server-side.
 */
export const allowlist: Record<ServiceName, Rule[]> = {
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
    { method: "POST", pattern: /^contact-us$/, schema: contactSchema },
    { method: "POST", pattern: /^apply-now$/, schema: applyWithLimit },
  ],
  users: [],
};

export function findRule(service: string, method: string, path: string): (Rule & { service: ServiceName }) | null {
  const rule = allowlist[service as ServiceName]?.find((r) => r.method === method && r.pattern.test(path));
  return rule ? { ...rule, service: service as ServiceName } : null;
}
