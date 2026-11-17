import { addDays, format } from "date-fns";

/** "1,234.56" | 1234.56 | null → number */
export function toNumber(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[$,\s]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const money = (n: number) => usd.format(n);

/** Formats as the backend expects: "(312) 555 1234". */
export function formatPhone(input: string) {
  const d = input.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)} ${d.slice(6)}`;
}
export const PHONE_RE = /^\(\d{3}\) \d{3} \d{4}$/;

export const API_DATETIME = "yyyy-MM-dd HH:mm:ss";

/** Same defaults as the old site: after noon, pickup moves to tomorrow. */
export function defaultDates(now = new Date()) {
  const pickup = now.getHours() >= 12 ? addDays(now, 1) : now;
  return { pickup, dropoff: addDays(pickup, 1) };
}

export const toApiDate = (d: Date) => format(d, API_DATETIME);
export const toInputDate = (d: Date) => format(d, "yyyy-MM-dd");

/** The backend uses "*" as a line break in success messages. */
export const splitMessage = (m?: string) => (m ?? "").split("*").map((s) => s.trim()).filter(Boolean);
