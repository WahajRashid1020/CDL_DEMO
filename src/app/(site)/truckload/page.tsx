import type { Metadata } from "next";
import { BrainCircuit, Truck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Checklist, CtaBand, HeroActions, Section, Split, Terminals } from "@/components/marketing/sections";
import { Visual } from "@/components/marketing/visual";

export const metadata: Metadata = {
  title: "Truckload",
  description: "Dry van, flatbed, temperature-controlled and LTL — truckload capacity with AI-driven pricing and instant quotes.",
};

export default function TruckloadPage() {
  return (
    <>
      <PageHero
        eyebrow="Truckload"
        title="No truck off limits"
        description="Get access to freight not available through other third-party logistics companies. Dry van. Flatbed. Temperature-controlled. Less-than-truckload. You name it, we can offer it."
      >
        <HeroActions primary={{ href: "/quote#truckload", label: "Get a truckload quote" }} secondary={{ href: "/sign-up", label: "Sign up for free" }} />
      </PageHero>

      <Section>
        <Split
          eyebrow="Truckload marketplace"
          title="Capacity, predicted"
          visual={<Visual icon={BrainCircuit} tone="ink" chips={[{ value: "80%+", label: "Loaded ratio with AI" }, { value: "50%", label: "Industry baseline" }]} />}
        >
          <p>
            Using augmented and artificial intelligence to predict capacity and forecast rates, we make a meaningful difference for our customers with reliable
            solutions.
          </p>
          <p>The right load goes on the most efficient truck — a more accessible and affordable option for volume export customers.</p>
        </Split>
      </Section>

      <Section className="pt-0" eyebrow="What the service includes" title="Built for every lane">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Checklist
            items={[
              "53' dry and reefer available to pair containers for final delivery",
              "Medium and large fleets",
              "Creative solutions for hard-to-move freight",
              "Located near every major port and ramp",
              "Full shipment visibility",
              "Tracking and tracing",
              "Coast to coast",
              "Dump trucks",
              "Tri-axles and roll-off equipment",
              "Port to port",
            ]}
          />
          <div className="space-y-6">
            <Terminals />
            <Visual icon={Truck} className="aspect-[16/9]" chips={[{ label: "Dry van · Reefer · Flatbed" }]} />
          </div>
        </div>
      </Section>

      <CtaBand primary={{ href: "/quote#truckload", label: "Get an instant quote" }} />
    </>
  );
}
