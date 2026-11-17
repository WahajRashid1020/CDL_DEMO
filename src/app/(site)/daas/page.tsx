import type { Metadata } from "next";
import { Clock3, Landmark, Zap } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Checklist, CtaBand, FeatureGrid, HeroActions, Section, StatCards, Terminals } from "@/components/marketing/sections";

export const metadata: Metadata = {
  title: "Demurrage as a Service",
  description: "Clear storage and demurrage fast — outsource payments through CDL1000 with admin fees as low as 3%.",
};

export default function DaasPage() {
  return (
    <>
      <PageHero
        eyebrow="DaaS"
        title="Demurrage as a service"
        description="We're the nation's leading DaaS partner. Clear storage and demurrage at rails and ports faster — without waiting on approvals or your freight forwarder."
      >
        <HeroActions primary={{ href: "/contact", label: "Talk to us" }} secondary={{ href: "/sign-up", label: "Sign up for free" }} />
      </PageHero>

      <Section eyebrow="The numbers" title="Clear more, pay less">
        <StatCards
          items={[
            { value: "3%", label: "Admin fee", text: "As low as 3% on 14-day payment terms." },
            { value: "5%", label: "Admin fee", text: "As low as 5% on 30-day payment terms." },
            { value: "$50M", label: "Clearable in a week", text: "Up to 50 million cleared weekly." },
          ]}
        />
      </Section>

      <Section className="pt-0" eyebrow="How it helps" title="Containers moving, not waiting">
        <FeatureGrid
          items={[
            { icon: Zap, title: "Faster turnaround", text: "Fully outsource your payments through CDL1000 for faster container turnaround at rails and ports." },
            { icon: Clock3, title: "No waiting on approvals", text: "No need to wait for approvals or your freight forwarder." },
            { icon: Landmark, title: "Independent service", text: "DaaS is fully independent from CDL1000 transportation — you don't have to use us as your carrier." },
          ]}
        />
      </Section>

      <Section className="pt-0" eyebrow="What the service includes" title="Set up to clear storage and demurrage">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Checklist
            items={[
              "Clearing storage and demurrage for our customers",
              "Outsourced payments for faster turnaround",
              "Located near every major port and ramp",
              "No dependency on freight forwarder approvals",
              "Usable without CDL1000 transportation",
              "Flexible 14- or 30-day payment terms",
            ]}
          />
          <Terminals />
        </div>
      </Section>

      <CtaBand
        title="Stop paying avoidable port fees"
        text="Tell us about your containers and we'll take it from there."
        primary={{ href: "/contact", label: "Contact our DaaS team" }}
      />
    </>
  );
}
