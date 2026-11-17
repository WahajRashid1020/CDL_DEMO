"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { calculators } from "@/lib/api/services";
import { CALC_TYPE } from "../body";
import { money } from "../format";
import { totals } from "../normalize";
import { markRecent } from "../recent";
import { useQuote } from "../store";
import type { QuoteView } from "../types";
import { Field, inputClass, Segmented } from "@/components/form/fields";

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = key ? loadStripe(key) : null;

export default function Checkout({ quote }: { quote: QuoteView }) {
  if (!stripePromise) {
    return <p className="rounded-2xl border p-5 text-sm text-destructive">Payments aren&apos;t configured (missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).</p>;
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm quote={quote} />
    </Elements>
  );
}

/**
 * The calculators service's pay_now expects a Stripe card token (legacy Charges flow),
 * so this uses CardElement + createToken rather than PaymentIntents.
 */
function CheckoutForm({ quote }: { quote: QuoteView }) {
  const stripe = useStripe();
  const elements = useElements();
  const { resolvedTheme } = useTheme();
  const { promo, setStep, finish } = useQuote();
  const total = totals(quote, true, promo).total;
  const c = quote.customer;

  const [name, setName] = useState(c?.name ?? "");
  const [companyName, setCompanyName] = useState(c?.company_name ?? "");
  const [companyAddress, setCompanyAddress] = useState(c?.company_address ?? "");
  const [pref, setPref] = useState<"1" | "2">("1");
  const [cardDone, setCardDone] = useState(false);

  const cardOptions = useMemo(
    () => ({
      hidePostalCode: true,
      style: {
        base: {
          fontSize: "15px",
          color: resolvedTheme === "dark" ? "#f5f3f1" : "#2b2522",
          "::placeholder": { color: "#9a918b" },
          iconColor: "#fa4515",
        },
        invalid: { color: "#e5484d", iconColor: "#e5484d" },
      },
    }),
    [resolvedTheme],
  );

  const pay = useMutation({
    mutationFn: async () => {
      const card = elements?.getElement(CardElement);
      if (!stripe || !card) throw new Error("Payment form isn't ready yet.");
      const { token, error } = await stripe.createToken(card, { name });
      if (error || !token) throw new Error(error?.message ?? "Your card couldn't be verified.");
      return calculators.payNow({
        name,
        company_address: companyAddress,
        company_name: companyName,
        stripe_token: token.id,
        total_amount: total,
        calculator_type: CALC_TYPE[quote.mode],
        id: quote.id,
        pref: Number(pref),
      });
    },
    onSuccess: (r) => {
      markRecent(quote.id, quote.mode, "paid");
      finish((r as { message?: string }).message ?? "Payment received — your load is booked.");
    },
    onError: (e) => toast.error(e.message),
  });

  const ready = name.trim() && companyName.trim() && companyAddress.trim() && cardDone;

  return (
    <form
      className="rounded-2xl border bg-card p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) pay.mutate();
      }}
    >
      <button type="button" onClick={() => setStep("price")} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to price
      </button>
      <h3 className="mt-3 font-heading text-xl font-bold">Payment</h3>
      <p className="text-sm text-muted-foreground">
        You&apos;ll be charged <span className="font-semibold text-foreground">{money(total)}</span>.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Full name">{(id) => <input id={id} className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}</Field>
        <Field label="Company name">{(id) => <input id={id} className={inputClass} value={companyName} onChange={(e) => setCompanyName(e.target.value)} autoComplete="organization" />}</Field>
        <Field label="Company address" className="sm:col-span-2">
          {(id) => <input id={id} className={inputClass} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} autoComplete="street-address" />}
        </Field>
        <div className="sm:col-span-2">
          <p className="mb-1.5 text-sm font-medium">Card</p>
          <div className="rounded-xl border bg-background px-3 py-3.5 focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/20">
            <CardElement options={cardOptions} onChange={(e) => setCardDone(e.complete)} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
          <span className="text-sm font-medium">Send updates by</span>
          <Segmented value={pref} onChange={setPref} options={[{ value: "1", label: "Email" }, { value: "2", label: "Phone" }]} />
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 h-12 w-full rounded-xl text-base shadow-lg shadow-brand/25" disabled={!ready || pay.isPending || !stripe}>
        {pay.isPending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />} Pay {money(total)}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Secured by Stripe.{key?.startsWith("pk_test_") && " Test mode — use card 4242 4242 4242 4242, any future date and CVC."}
      </p>
    </form>
  );
}
