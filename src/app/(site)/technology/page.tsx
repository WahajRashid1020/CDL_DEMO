import type { Metadata } from "next";
import { Bot, Boxes, CheckCircle2, Mic, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand, HeroActions, Section, Split } from "@/components/marketing/sections";
import { Visual } from "@/components/marketing/visual";

export const metadata: Metadata = {
  title: "Technology",
  description: "Restless innovators: AI-driven pricing, RUBY — the voice assistant for booking trucks — and Batch, the shipment marketplace.",
};

function Soon() {
  return <span className="ml-2 rounded-full bg-highlight/30 px-2 py-0.5 align-middle text-xs font-semibold text-ink dark:text-highlight">Coming soon</span>;
}

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title="Restless innovators"
        description="Our industry never stands still, so neither do we. Our solutions harness artificial and augmented intelligence to drive an affordable, simple and efficient service."
      >
        <HeroActions primary={{ href: "/quote", label: "Try instant pricing" }} />
      </PageHero>

      <Section>
        <Split
          eyebrow="RUBY"
          title="Lighten the load with RUBY"
          visual={<Visual icon={Bot} tone="ink" chips={[{ label: "“Book a truck from Chicago to Dallas”" }, { value: "Voice", label: "AI assistant" }]} />}
        >
          <p>
            Move over Alexa — meet RUBY, your desktop digital assistant. Voice-controlled and powered by AI. To book a truck, all you have to do is ask.
            <Soon />
          </p>
          <ol className="space-y-3 text-base">
            {["Tell RUBY your requirement", "Ask for and confirm your price", "Forget about your freight — RUBY keeps you updated every step of the way"].map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-brand-foreground">{i + 1}</span>
                <span className="text-foreground">{s}</span>
              </li>
            ))}
          </ol>
        </Split>
      </Section>

      <Section className="pt-0">
        <Split reverse eyebrow="Batch" title="It's better with Batch" visual={<Visual icon={Boxes} chips={[{ label: "List or bid on batches" }, { label: "Anytime, anywhere" }]} />}>
          <p>
            Batch is the digital marketplace to list or bid on batches of shipments — easing capacity issues, reducing waste and increasing visibility.
            <Soon />
          </p>
          <ul className="space-y-2 text-base">
            {["Forget the old, piecemeal way of working", "An intuitive interface that's accessible anywhere", "Total control of large-scale projects in a few clicks"].map((s) => (
              <li key={s} className="flex gap-2 text-foreground">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" /> {s}
              </li>
            ))}
          </ul>
        </Split>
      </Section>

      <Section className="pt-0" center eyebrow="Ideas by the truckload" title="The right truck, the right load, the right price, the right time">
        <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3 text-sm">
          {[
            { icon: Sparkles, t: "AI rate forecasting" },
            { icon: Mic, t: "Voice booking" },
            { icon: Boxes, t: "Batch marketplace" },
          ].map(({ icon: Icon, t }) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 font-medium">
              <Icon className="size-4 text-brand" /> {t}
            </span>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
