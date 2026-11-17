import { api } from "./client";
import type { LoginInput, RegisterInput } from "@/lib/validation/auth";

/**
 * Typed wrappers for every endpoint the old site uses.
 * Response types are intentionally loose (`unknown`-ish) until the test services are
 * reachable and we can pin real shapes with Zod schemas.
 */
type Json = Record<string, unknown>;

export const calculators = {
  equipmentTypes: () => api<Json>("calculators/equipment_type"),
  containers: () => api<Json>("calculators/containers"),
  containerSizes: (containerId: string | number) => api<Json>(`calculators/container_size/${containerId}`),
  chassis: () => api<Json>("calculators/chassis"),
  hazmatClasses: () => api<Json>("calculators/hazmat_classes"),
  verifyPostalCode: (code: string) => api<Json>(`calculators/verify_postal_code/${encodeURIComponent(code)}`),

  truckloadDistance: (body: Json) => api<Json>("calculators/dryvan_distance", { body }),
  truckloadQuote: (body: Json) => api<Json>("calculators/dryvan", { body }),
  drayageQuote: (body: Json) => api<Json>("calculators/drayage", { body }),

  verifyPromo: (body: { id: number | string; promo: string; calc_type: number }) =>
    api<Json>("calculators/verify_promo_code", { body }),
  removePromo: (body: { calculator_id: number | string; calculator_type: number }) =>
    api<Json>("calculators/remove_promo_code", { body }),

  customer: (body: Json) => api<Json>("calculators/customer", { body }),
  requestCall: (body: Json) => api<Json>("calculators/request_a_call", { body }),
  getInTouch: (body: Json) => api<Json>("calculators/get_in_touch", { body }),
  payNow: (body: Json) => api<Json>("calculators/pay_now", { body }),
  payLater: (body: Json) => api<Json>("calculators/pay_later", { body }),
};

export const blogs = {
  list: () => api<Json>("blogs/blogs"),
  get: (id: string) => api<Json>(`blogs/blog/${encodeURIComponent(id)}`),
  recent: () => api<Json>("blogs/recent_blog"),
  contactUs: (body: Json) => api<Json>("blogs/contact-us", { body }),
  applyNow: (body: Json) => api<Json>("blogs/apply-now", { body }),
};

export const auth = {
  login: (body: LoginInput) => api<{ user: Json }>("auth/login", { body }),
  register: (body: RegisterInput) => api<{ message: string }>("auth/register", { body }),
  logout: () => api<null>("auth/logout", { method: "POST" }),
  me: () => api<{ user: Json | null }>("auth/me"),
};

/** calc_type values used by the backend */
export const CalcType = { drayage: 1, truckload: 2 } as const;
