"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { AnimatePresence, motion } from "motion/react";
import { Check, CircleCheckBig, Container, MapPin, Route, Truck } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { splitMessage } from "../format";
import { useQuote } from "../store";
import type { Location, QuoteStep } from "../types";
import { useRunQuote } from "../use-run-quote";
import { Segmented } from "@/components/form/fields";
import { LoadOptions } from "./load-options";
import { PriceSummary } from "./price-summary";
import { RouteMap } from "./route-map";
import { RouteStep } from "./route-step";

// Stripe is only loaded once someone reaches checkout.
const Checkout = dynamic(() => import("./checkout"), { ssr: false, loading: () => <div className="h-96 animate-pulse rounded-2xl bg-muted" /> });

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const STEPS: { id: QuoteStep; label: string }[] = [
  { id: "route", label: "Route" },
  { id: "price", label: "Price" },
  { id: "checkout", label: "Book" },
];

export function QuoteWizard() {
  return (
    <APIProvider apiKey={MAPS_KEY} libraries={["places", "geometry"]}>
      <Wizard />
    </APIProvider>
  );
}

function Wizard() {
  const s = useQuote();
  const points: Location[] = s.mode === "truckload" ? [s.origin, s.destination] : [s.port, s.warehouse];

  // /quote#drayage or #truckload opens that tab (a hash keeps the page static).
  useEffect(() => {
    const mode = window.location.hash.slice(1);
    if ((mode === "drayage" || mode === "truckload") && mode !== useQuote.getState().mode) useQuote.getState().setMode(mode);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Segmented
          size="lg"
          value={s.mode}
          onChange={s.setMode}
          options={[
            { value: "truckload", label: "Truckload", icon: <Truck className="size-4" /> },
            { value: "drayage", label: "Drayage", icon: <Container className="size-4" /> },
          ]}
        />
        <Stepper step={s.step} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${s.mode}-${s.step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <StepBody />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative h-72 overflow-hidden rounded-2xl border bg-muted sm:h-96 lg:h-[34rem]">
            {MAPS_KEY ? (
              <RouteMap points={points} polyline={s.step === "route" ? undefined : s.quote?.polyline} />
            ) : (
              <div className="grid size-full place-items-center p-6 text-center text-sm text-muted-foreground">
                Map unavailable — set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
              </div>
            )}
            {s.quote && s.step !== "route" && <RouteBadge distance={s.quote.distance} points={points} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepBody() {
  const s = useQuote();
  const run = useRunQuote();
  const [dirty, setDirty] = useState(false);

  if (s.step === "route" || !s.quote) {
    return (
      <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <RouteStep />
      </div>
    );
  }
  if (s.step === "done") return <Done message={s.doneMessage} onAgain={s.reset} />;
  if (s.step === "checkout") return <Checkout quote={s.quote} />;

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => s.setStep("route")} className="text-sm text-muted-foreground hover:text-foreground">
        ← Change route
      </button>
      <PriceSummary quote={s.quote} />
      <LoadOptions
        dirty={dirty}
        pending={run.isPending}
        onChange={() => setDirty(true)}
        onRequote={() => run.mutate({ checkLane: false }, { onSuccess: () => setDirty(false) })}
      />
    </div>
  );
}

function Stepper({ step }: { step: QuoteStep }) {
  const idx = step === "done" ? STEPS.length : STEPS.findIndex((x) => x.id === step);
  return (
    <ol className="flex items-center gap-2 text-xs font-medium">
      {STEPS.map((x, i) => (
        <li key={x.id} className="flex items-center gap-2">
          <span
            className={cn(
              "grid size-6 place-items-center rounded-full border transition-colors",
              i < idx && "border-brand bg-brand text-brand-foreground",
              i === idx && "border-brand text-brand",
            )}
          >
            {i < idx ? <Check className="size-3.5" /> : i + 1}
          </span>
          <span className={i === idx ? "text-foreground" : "text-muted-foreground"}>{x.label}</span>
          {i < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
        </li>
      ))}
    </ol>
  );
}

function RouteBadge({ distance, points }: { distance?: number; points: Location[] }) {
  const name = (l: Location) => (l.city && l.state ? `${l.city}, ${l.state}` : (l.address ?? l.postal ?? "—"));
  return (
    <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border bg-background/85 px-4 py-3 text-sm shadow-lg backdrop-blur">
      <MapPin className="size-4 text-brand" />
      <span className="font-medium">{name(points[0])}</span>
      <Route className="size-4 text-muted-foreground" />
      <span className="font-medium">{name(points[1])}</span>
      {distance ? <span className="ml-auto rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">{Math.round(distance).toLocaleString()} mi</span> : null}
    </div>
  );
}

function Done({ message, onAgain }: { message: string | null; onAgain: () => void }) {
  const lines = splitMessage(message ?? undefined);
  return (
    <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600"
      >
        <CircleCheckBig className="size-8" />
      </motion.span>
      <h3 className="mt-5 font-heading text-2xl font-extrabold">{lines[0] ?? "All set!"}</h3>
      {lines.slice(1).map((l) => (
        <p key={l} className="mt-2 text-sm text-muted-foreground">
          {l}
        </p>
      ))}
      <Button type="button" variant="outline" className="mt-6 rounded-full" onClick={onAgain}>
        Get another quote
      </Button>
    </div>
  );
}
