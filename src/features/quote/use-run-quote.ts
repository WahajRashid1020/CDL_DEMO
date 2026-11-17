"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { calculators } from "@/lib/api/services";
import { CALC_TYPE, drayageBody, truckloadBody, truckloadDistanceBody } from "./body";
import { fromDrayage, fromTruckload, promoFromRequote } from "./normalize";
import { useQuote } from "./store";
import { saveRecent } from "./recent";
import type { DrayageCalculation, Location, PromoResult, TruckloadCalculation } from "./types";

export const placeName = (l: Location) =>
  l.city && l.state ? `${l.city}, ${l.state}` : (l.address?.split(",").slice(0, 2).join(",") ?? l.postal ?? "—");

const BLOCKED_STATES = ["AK", "HI"];

/**
 * Keeps an applied promo valid for the new quote. The backend normally echoes the promo
 * amounts on a re-quote; if it doesn't, re-verify the code against the new quote id.
 */
async function refreshPromo(res: Record<string, unknown>, quoteId: number): Promise<PromoResult | null> {
  const s = useQuote.getState();
  if (!s.promoCode || !s.promo) return null;
  if (res.amount_after_promo_discount != null) return promoFromRequote(res, s.promo.id);
  try {
    return (await calculators.verifyPromo({ id: quoteId, promo: s.promoCode, calc_type: CALC_TYPE[s.mode] })) as PromoResult;
  } catch {
    toast.info("Your promo code no longer applies to this quote.");
    return null;
  }
}

/** Thrown when a lane can't be priced online; the UI offers a call-back instead. */
export class LaneNotServedError extends Error {}

/**
 * Runs (or re-runs) the quote for the current mode using everything in the store.
 * `checkLane` is true for the first quote: truckload lanes are pre-checked with dryvan_distance.
 */
export function useRunQuote() {
  return useMutation({
    mutationFn: async ({ checkLane }: { checkLane: boolean }) => {
      const s = useQuote.getState();
      const customer = s.quote?.customer;
      const promoId = s.promo?.id ?? null;

      if (s.mode === "truckload") {
        if (BLOCKED_STATES.includes(s.origin.state ?? "") || BLOCKED_STATES.includes(s.destination.state ?? "")) {
          throw new LaneNotServedError("We don't quote Alaska or Hawaii online yet.");
        }
        if (checkLane) {
          try {
            await calculators.truckloadDistance(truckloadDistanceBody(s.origin, s.destination));
          } catch (e) {
            if (e instanceof ApiError && e.status === 502) throw new LaneNotServedError(e.message);
            throw e;
          }
        }
        const res = await calculators.truckloadQuote(
          truckloadBody({ origin: s.origin, destination: s.destination, contact: s.contact, customer, options: s.truckload, promoId }),
        );
        const view = fromTruckload(res.calculations as TruckloadCalculation);
        return { view, promo: await refreshPromo(res, view.id) };
      }

      const res = await calculators.drayageQuote(
        drayageBody({ tripType: s.tripType, port: s.port, warehouse: s.warehouse, contact: s.contact, customer, options: s.drayage, promoId }),
      );
      const view = fromDrayage(res.data as DrayageCalculation);
      return { view, promo: await refreshPromo(res, view.id) };
    },
    onSuccess: ({ view, promo }) => {
      const s = useQuote.getState();
      s.setPromo(promo ? s.promoCode : null, promo);
      s.setQuote(view);
      const [a, b] = s.mode === "truckload" ? [s.origin, s.destination] : [s.port, s.warehouse];
      saveRecent({
        id: view.id,
        mode: view.mode,
        from: placeName(a),
        to: placeName(b),
        distance: view.distance,
        subtotal: view.subtotal,
        payNowTotal: view.payNowTotal,
        status: "quoted",
        at: new Date().toISOString(),
      });
    },
    onError: (e) => {
      if (!(e instanceof LaneNotServedError)) toast.error(e.message);
    },
  });
}
