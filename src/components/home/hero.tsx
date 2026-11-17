"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Truck } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  return (
    <section className="relative isolate -mt-16 overflow-hidden pt-16">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div aria-hidden className="absolute -top-32 right-[-10%] -z-10 size-[36rem] rounded-full bg-brand/25 blur-3xl" />
      <div aria-hidden className="absolute bottom-[-20%] left-[-10%] -z-10 size-[28rem] rounded-full bg-highlight/20 blur-3xl" />

      <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_1fr] lg:py-32">
        <div>
          <motion.p {...fade(0)} className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="size-1.5 animate-pulse rounded-full bg-brand" /> Digital freight marketplace
          </motion.p>
          <motion.h1 {...fade(0.1)} className="mt-6 text-5xl font-extrabold leading-[1.05] sm:text-7xl">
            Logistics, <span className="text-gradient-brand">unlimited.</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="mt-6 max-w-xl text-lg text-muted-foreground">
            Quote, book and pay for truckload and drayage in one click. CDL1000 connects shippers, agents and
            owner operators on a single platform.
          </motion.p>
          <motion.div {...fade(0.3)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/quote" className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full px-6 text-base shadow-xl shadow-brand/30")}>
              Get an instant quote <ArrowRight className="size-4" />
            </Link>
            <Link href="/carriers" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 rounded-full px-6 text-base")}>
              I&apos;m a carrier
            </Link>
          </motion.div>
        </div>

        <motion.div {...fade(0.35)} className="relative">
          <QuotePreview />
        </motion.div>
      </div>
    </section>
  );
}

/** Decorative preview of the quote experience — the real one lives at /quote. */
function QuotePreview() {
  return (
    <div className="relative rounded-3xl border bg-card/80 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Truckload quote</p>
        <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">Live</span>
      </div>

      <div className="mt-5 space-y-3">
        {[
          { label: "Pickup", value: "Chicago, IL 60607" },
          { label: "Drop-off", value: "Dallas, TX 75201" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border bg-background/60 px-4 py-3">
            <MapPin className="size-4 text-brand" />
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-medium">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <svg viewBox="0 0 300 90" className="mt-5 h-24 w-full" aria-hidden>
        <motion.path
          d="M10 70 C 80 10, 160 90, 290 20"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1 0"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
        />
        <circle cx="10" cy="70" r="5" fill="var(--brand)" />
        <circle cx="290" cy="20" r="5" fill="var(--highlight)" stroke="var(--ink)" strokeWidth="1" />
      </svg>

      <div className="mt-4 flex items-end justify-between border-t pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Dry van · 53&apos; · 925 mi</p>
          <p className="mt-1 font-heading text-3xl font-extrabold">Instant price</p>
        </div>
        <span className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground">
          <Truck className="size-5" />
        </span>
      </div>
    </div>
  );
}
