import type { Metadata } from "next";
import { Anchor, Container } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Checklist, CtaBand, HeroActions, Section, Split, Terminals } from "@/components/marketing/sections";
import { Visual } from "@/components/marketing/visual";

export const metadata: Metadata = {
  title: "Drayage",
  description: "The nation's leading drayage partner — port and rail container moves with private chassis, real-time tracking and instant quotes.",
};

export default function DrayagePage() {
  return (
    <>
      <PageHero
        eyebrow="Drayage"
        title="The most important part of the journey"
        description="We're the nation's leading drayage partner, driving efficiency at every turn. From the right equipment ready to go, to real-time tracking and always-on technology, we're here to get your goods there — without fail."
      >
        <HeroActions primary={{ href: "/quote#drayage", label: "Get a drayage quote" }} secondary={{ href: "/sign-up", label: "Sign up for free" }} />
      </PageHero>

      <Section>
        <Split
          eyebrow="Ports & rail yards"
          title="In and out, without the delays"
          visual={<Visual icon={Anchor} chips={[{ value: "50+", label: "Containers a day" }, { value: "20/40/45 ft", label: "Private chassis" }]} />}
        >
          <p>
            Everything we do is designed around ease, efficiency and driving down costs. We get your containers in and out of ports and rail yards — even at
            their busiest.
          </p>
          <p>
            Our experience, coordination and equipment come together for a seamless process, made smoother by the strong relationships we&apos;ve built with port
            and rail yard operators.
          </p>
          <p>From a single load to any number you send our way, we&apos;ll get your freight where it needs to be, no matter the obstacle.</p>
        </Split>
      </Section>

      <Section className="pt-0" eyebrow="What the service includes" title="Drayage, done properly">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Checklist
            items={[
              "Turnaround demurrage clean-up",
              "Empty clean-up (DC / yard shuttles)",
              "High-volume turnaround — 50+ containers a day",
              "Private chassis equipment: 20, 40 and 45 ft",
              "Loaded lifts in Chicago, Houston and Los Angeles",
              "Real-time tracking from terminal to door",
            ]}
          />
          <div className="space-y-6">
            <Terminals />
            <Visual icon={Container} tone="ink" className="aspect-[16/9]" chips={[{ label: "Import · Export" }]} />
          </div>
        </div>
      </Section>

      <CtaBand primary={{ href: "/quote#drayage", label: "Price a container" }} />
    </>
  );
}
