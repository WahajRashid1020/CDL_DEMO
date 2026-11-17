import { toNumber } from "./format";
import type { DrayageCalculation, PromoResult, QuoteView, TruckloadCalculation } from "./types";

export function fromTruckload(c: TruckloadCalculation): QuoteView {
  const volume = c.volume ?? 1;
  return {
    mode: "truckload",
    id: c.id,
    distance: toNumber(c.distance) || undefined,
    polyline: c.polyline,
    lines: [
      { label: "Price per load", value: toNumber(c.price_per_load) },
      { label: "Fuel surcharge per load", value: toNumber(c.fsc), hint: "FSC" },
    ],
    subtotal: toNumber(c.total_amount),
    payNowDiscount: toNumber(c.pay_now_discount),
    payNowTotal: toNumber(c.after_discount),
    customer: c.fk_customer,
    raw: { ...c, volume },
  };
}

const DRAYAGE_LINES: [key: string, label: string][] = [
  ["Base Price", "Base price"],
  ["FSC", "Fuel surcharge"],
  ["Chassis Price", "Chassis"],
  ["Overweight Price", "Overweight"],
  ["Reefer Price", "Reefer"],
  ["Hazmat Price", "Hazmat"],
];

export function fromDrayage(c: DrayageCalculation): QuoteView {
  const b = c.calculation_breakdown ?? {};
  return {
    mode: "drayage",
    id: c.id,
    distance: toNumber(c.distance) || undefined,
    polyline: c.polyline,
    lines: DRAYAGE_LINES.map(([key, label]) => ({ label, value: toNumber(b[key]) })).filter(
      (l, i) => i < 2 || l.value > 0,
    ),
    subtotal: toNumber(c.total_amount ?? c.formatted_dollar_amount),
    payNowDiscount: toNumber(c.pay_now_discount),
    payNowTotal: toNumber(c.after_pay_now_discount),
    customer: c.fk_customer,
    raw: c,
  };
}

/** Same rules as the old price panel. */
export function totals(q: QuoteView, payNow: boolean, promo: PromoResult | null) {
  if (payNow) {
    return promo
      ? { discount: toNumber(promo.total_discount), total: toNumber(promo.amount_after_complete_discount) }
      : { discount: q.payNowDiscount, total: q.payNowTotal };
  }
  return promo
    ? { discount: toNumber(promo.discounted), total: toNumber(promo.amount_after_promo_discount) }
    : { discount: 0, total: q.subtotal };
}

/** Promo fields echoed back on a re-quote that carried fk_promo_code_id. */
export function promoFromRequote(data: Record<string, unknown>, fallbackId?: number): PromoResult {
  return {
    id: (data.id as number) ?? fallbackId,
    discounted: data.discounted as string,
    total_discount: data.total_discount as string,
    total_amount: data.total_amount as string,
    amount_after_promo_discount: data.amount_after_promo_discount as string,
    amount_after_complete_discount: data.amount_after_complete_discount as string,
  };
}
