import type { Metadata } from "next";
import { QuoteWizard } from "@/features/quote/components/quote-wizard";

export const metadata: Metadata = {
  title: "Instant freight quote",
  description: "Live truckload and drayage pricing in under a minute. Pay now and save, or book and pay later.",
};

export default function QuotePage() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute -top-40 left-1/2 -z-10 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
      <div className="container-page py-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">Instant quote</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-5xl">Get a price in under a minute</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Pick your lane, see live pricing on the map, then pay now and save — or book and pay later.
        </p>
        <div className="mt-10">
          <QuoteWizard />
        </div>
      </div>
    </section>
  );
}
