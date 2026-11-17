"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { CreditCard, Headset, Loader2, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { calculators } from "@/lib/api/services";
import { CALC_TYPE } from "../body";
import { money } from "../format";
import { totals } from "../normalize";
import { markRecent } from "../recent";
import { useQuote } from "../store";
import type { PromoResult, QuoteView, TruckloadCalculation } from "../types";
import { AnimatedAmount } from "./animated-amount";
import { inputClass, Segmented } from "@/components/form/fields";

export function PriceSummary({ quote }: { quote: QuoteView }) {
  const { payNow, promo, promoCode, set, finish, setStep } = useQuote();
  const { discount, total } = totals(quote, payNow, promo);
  const calcType = CALC_TYPE[quote.mode];
  const volume = quote.mode === "truckload" ? (quote.raw as TruckloadCalculation).volume : undefined;

  const getInTouch = useMutation({
    mutationFn: () => calculators.getInTouch({ calculator_id: quote.id, calculator_type: calcType }),
    onSuccess: (r) => {
      markRecent(quote.id, quote.mode, "contact");
      finish((r as { message?: string }).message ?? "Thanks — our team will reach out shortly.");
    },
    onError: (e) => toast.error(e.message),
  });
  const payLater = useMutation({
    mutationFn: () => calculators.payLater({ id: quote.id, calculator_type: calcType }),
    onSuccess: (r) => {
      markRecent(quote.id, quote.mode, "booked");
      finish((r as { message?: string }).message ?? "Your load is booked. We'll send the invoice by email.");
    },
    onError: (e) => toast.error(e.message),
  });
  const busy = getInTouch.isPending || payLater.isPending;

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-base font-bold">Your price</h3>
        <Segmented
          value={payNow ? "now" : "later"}
          onChange={(v) => set({ payNow: v === "now" })}
          options={[
            { value: "now", label: "Pay now" },
            { value: "later", label: "Pay later" },
          ]}
        />
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        {quote.lines.map((l) => (
          <Row key={l.label} label={l.label} value={money(l.value)} />
        ))}
        {volume != null && <Row label="Number of loads" value={`× ${volume}`} />}
        <div className="border-t pt-2.5">
          <Row label="Subtotal" value={money(quote.subtotal)} strong />
        </div>
        <AnimatePresence initial={false}>
          {discount > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Row
                label={payNow ? (promo ? "Pay-now + promo discount" : "Pay-now discount") : "Promo discount"}
                value={`− ${money(discount)}`}
                accent
              />
            </motion.div>
          )}
        </AnimatePresence>
      </dl>

      <div className="mt-5 flex items-end justify-between rounded-xl bg-brand-soft px-4 py-3">
        <span className="text-sm font-medium">Total</span>
        <AnimatedAmount value={total} className="font-heading text-3xl font-extrabold text-brand tabular-nums" />
      </div>
      {payNow && quote.payNowDiscount > 0 && !promo && (
        <p className="mt-2 text-xs text-muted-foreground">You save {money(quote.payNowDiscount)} by paying now.</p>
      )}

      <PromoInput quoteId={quote.id} calcType={calcType} code={promoCode} applied={promo} onChange={(c, p) => set({ promoCode: c, promo: p })} />

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="outline" size="lg" className="h-11 rounded-xl" disabled={busy} onClick={() => getInTouch.mutate()}>
          {getInTouch.isPending ? <Loader2 className="size-4 animate-spin" /> : <Headset className="size-4" />} Talk to us
        </Button>
        {payNow ? (
          <Button type="button" size="lg" className="h-11 rounded-xl shadow-lg shadow-brand/25" disabled={busy} onClick={() => setStep("checkout")}>
            <CreditCard className="size-4" /> Continue to payment
          </Button>
        ) : (
          <Button type="button" size="lg" className="h-11 rounded-xl shadow-lg shadow-brand/25" disabled={busy} onClick={() => payLater.mutate()}>
            {payLater.isPending && <Loader2 className="size-4 animate-spin" />} Book &amp; pay later
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={strong ? "font-semibold" : "text-muted-foreground"}>{label}</dt>
      <dd className={`tabular-nums ${strong ? "font-semibold" : ""} ${accent ? "font-medium text-emerald-600 dark:text-emerald-400" : ""}`}>{value}</dd>
    </div>
  );
}

function PromoInput({
  quoteId,
  calcType,
  code,
  applied,
  onChange,
}: {
  quoteId: number;
  calcType: number;
  code: string | null;
  applied: PromoResult | null;
  onChange: (code: string | null, promo: PromoResult | null) => void;
}) {
  const [value, setValue] = useState(code ?? "");
  const apply = useMutation({
    mutationFn: () => calculators.verifyPromo({ id: quoteId, promo: value.trim(), calc_type: calcType }),
    onSuccess: (r) => (onChange(value.trim(), r as PromoResult), toast.success("Promo code applied")),
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: () => calculators.removePromo({ calculator_id: quoteId, calculator_type: calcType }),
    onSuccess: () => (onChange(null, null), setValue("")),
    onError: (e) => toast.error(e.message),
  });

  if (applied) {
    return (
      <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-emerald-500/50 px-3 py-2 text-sm">
        <span className="inline-flex items-center gap-2 font-medium">
          <Tag className="size-4 text-emerald-600" /> {code} applied
        </span>
        <button type="button" onClick={() => remove.mutate()} disabled={remove.isPending} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
          <X className="size-3.5" /> Remove
        </button>
      </div>
    );
  }

  return (
    <form
      className="mt-4 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) apply.mutate();
      }}
    >
      <div className="relative flex-1">
        <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input aria-label="Promo code" className={`${inputClass} pl-9 uppercase`} placeholder="Promo code" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <Button type="submit" variant="secondary" className="h-11 rounded-xl px-4" disabled={!value.trim() || apply.isPending}>
        {apply.isPending ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
      </Button>
    </form>
  );
}
