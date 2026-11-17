"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChassis, useContainers, useContainerSizes, pickDefault } from "../hooks";
import { hasPlace, useQuote } from "../store";
import { LaneNotServedError, useRunQuote } from "../use-run-quote";
import { ContactFields, contactSchema, type ContactValues } from "./contact-fields";
import { Segmented } from "@/components/form/fields";
import { LocationInput } from "./location-input";
import { RequestCallDialog } from "./request-call-dialog";

export function RouteStep() {
  const s = useQuote();
  const run = useRunQuote();
  const [touched, setTouched] = useState(false);
  const [laneIssue, setLaneIssue] = useState<string | null>(null);

  // Drayage needs the default container size and chassis before the first quote.
  const isDrayage = s.mode === "drayage";
  const containers = useContainers(isDrayage);
  const defaultContainer = pickDefault(containers.data);
  const sizes = useContainerSizes(isDrayage ? (s.drayage.containerId ?? defaultContainer?.id) : undefined);
  const chassis = useChassis(isDrayage);

  const form = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: s.contact });
  const { errors } = form.formState;

  const [a, b] = s.mode === "truckload" ? [s.origin, s.destination] : [s.port, s.warehouse];
  const placesOk = hasPlace(a) && hasPlace(b);
  const sameSpot = placesOk && (a.address ?? a.postal) === (b.address ?? b.postal);

  const onSubmit = form.handleSubmit((contact) => {
    setTouched(true);
    if (!placesOk || sameSpot) return;

    const patch: Parameters<typeof s.set>[0] = { contact, quote: null, promo: null, promoCode: null, payNow: true };
    if (s.mode === "drayage") {
      const ch = pickDefault(chassis.data);
      s.setDrayage({
        containerId: s.drayage.containerId ?? defaultContainer?.id,
        containerSizeId: s.drayage.containerSizeId ?? pickDefault(sizes.data)?.id,
        chassisId: s.drayage.chassisId ?? ch?.id,
        chassisDays: ch ? (ch.title === "Self Owned" ? 0 : 2) : s.drayage.chassisDays,
      });
    }
    s.set(patch);
    run.mutate(
      { checkLane: true },
      { onError: (e) => e instanceof LaneNotServedError && setLaneIssue(e.message) },
    );
  });

  const loadingOptions = isDrayage && (containers.isLoading || sizes.isLoading || chassis.isLoading);

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {s.mode === "drayage" && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">Trip type</p>
          <Segmented
            value={s.tripType}
            onChange={(tripType) => s.set({ tripType })}
            options={[
              { value: "I", label: "Import" },
              { value: "E", label: "Export" },
            ]}
          />
        </div>
      )}

      <div className="space-y-4">
        {s.mode === "truckload" ? (
          <>
            <LocationInput label="Pickup" hint="City, state or ZIP" citiesOnly value={s.origin} onChange={(origin) => s.set({ origin })} invalid={touched && !hasPlace(s.origin)} />
            <LocationInput label="Drop-off" hint="City, state or ZIP" citiesOnly value={s.destination} onChange={(destination) => s.set({ destination })} invalid={touched && !hasPlace(s.destination)} />
          </>
        ) : (
          <>
            <LocationInput
              label={s.tripType === "I" ? "Container pickup — port / railyard" : "Container return — port / railyard"}
              placeholder="Search a port or railyard"
              value={s.port}
              onChange={(port) => s.set({ port })}
              invalid={touched && !hasPlace(s.port)}
            />
            <LocationInput
              label={s.tripType === "I" ? "Unloading — warehouse" : "Loading — warehouse"}
              placeholder="Warehouse address"
              value={s.warehouse}
              onChange={(warehouse) => s.set({ warehouse })}
              invalid={touched && !hasPlace(s.warehouse)}
            />
          </>
        )}
        {touched && !placesOk && <p className="text-xs text-destructive">Pick both locations from the list.</p>}
        {sameSpot && <p className="text-xs text-destructive">The two locations can&apos;t be the same.</p>}
      </div>

      <ContactFields control={form.control} errors={errors} setValue={form.setValue} />

      <Button type="submit" size="lg" disabled={run.isPending || loadingOptions} className="h-12 w-full rounded-xl text-base shadow-lg shadow-brand/25">
        {run.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Pricing your lane…
          </>
        ) : (
          <>
            See my price <ArrowRight className="size-4" />
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">No account needed. We&apos;ll only use your contact details for this quote.</p>

      <RequestCallDialog open={!!laneIssue} onOpenChange={(o) => !o && setLaneIssue(null)} reason={laneIssue ?? undefined} />
    </form>
  );
}
