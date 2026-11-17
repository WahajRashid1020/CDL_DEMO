import type { Metadata } from "next";
import { Bot, Container, LineChart, PackageCheck, Radar, Truck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand, FeatureGrid, HeroActions, Section, Split } from "@/components/marketing/sections";
import { Visual } from "@/components/marketing/visual";

export const metadata: Metadata = {
  title: "For shippers",
  description: "Book, manage and track loads with CDL1000 — instant pricing, real-time tracking and a 24/7 customer success team.",
};

export default function ShippersPage() {
  return (
    <>
      <PageHero
        eyebrow="For shippers"
        title="Let's make your life easy"
        description="Many of our regular shippers go way back, including some of the world's biggest brands. Whatever the size of the business or the load, we build partnerships on trust — and our 24/7 customer success team is on hand to keep everyone happy."
      >
        <HeroActions secondary={{ href: "/sign-up", label: "Sign up for free" }} />
      </PageHero>

      <Section eyebrow="Services" title="Everything your freight needs">
        <FeatureGrid
          items={[
            {
              icon: Container,
              title: "Drayage — your go-to for moving goods",
              text: "Don't put up with port delays or peak-season railyard problems. Our experience and always-on technology mean no freight gets left behind.",
              href: "/drayage",
            },
            {
              icon: Truck,
              title: "Truckload — loads more efficient with AI",
              text: "AI predicts capacity and puts the right load on the most efficient truck, lifting loaded ratios from 50% to over 80%.",
              href: "/truckload",
            },
            {
              icon: Bot,
              title: "Technology at the heart of every shipment",
              text: "Meet RUBY, your AI assistant, and Batch — our digital platform for efficiency and visibility, coming soon.",
              href: "/technology",
            },
          ]}
        />
      </Section>

      <Section className="pt-0">
        <Split
          eyebrow="End-to-end"
          title="Let us do the heavy lifting"
          visual={<Visual icon={PackageCheck} chips={[{ label: "Unpacking & assembly" }, { label: "Installation" }, { label: "Beyond the drop-off" }]} />}
        >
          <p>Our end-to-end services don&apos;t stop at the drop-off, and you don&apos;t need another job on your to-do list.</p>
          <p>Take the hassle out of unpacking, assembly and installation and let us take care of it. Don&apos;t worry — we&apos;ve got this.</p>
        </Split>
      </Section>

      <Section className="pt-0">
        <Split
          reverse
          eyebrow="Visibility"
          title="Real-time tracking, real results"
          visual={<Visual icon={Radar} tone="ink" chips={[{ value: "24/7", label: "Live tracking" }, { value: "1 click", label: "Booking" }]} />}
        >
          <p>From the right equipment ready to go, to real-time tracking and always-on technology, we&apos;re here to get your goods there — without fail.</p>
          <p>
            <strong className="text-foreground">Your load, your way.</strong> Select the date and price that works for your business, and manage your load from
            booking to delivery without picking up the phone.
          </p>
        </Split>
      </Section>

      <Section className="pt-0" eyebrow="Why shippers stay" title="Built on trust, run on data" center>
        <FeatureGrid
          items={[
            { icon: LineChart, title: "Transparent pricing", text: "Instant, up-front quotes with a pay-now discount — no back-and-forth." },
            { icon: Radar, title: "Always-on visibility", text: "Track every load from pickup to delivery in real time." },
            { icon: Bot, title: "24/7 customer success", text: "A dedicated team that answers when you call — day or night." },
          ]}
        />
      </Section>

      <CtaBand />
    </>
  );
}
