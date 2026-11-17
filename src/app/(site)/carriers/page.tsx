import type { Metadata } from "next";
import { Banknote, Bitcoin, CalendarClock, HandCoins, Smartphone, Wallet } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand, FeatureGrid, HeroActions, Section, Split } from "@/components/marketing/sections";
import { Visual } from "@/components/marketing/visual";

export const metadata: Metadata = {
  title: "For carriers",
  description: "Clear, up-front pricing, the highest paying loads and fast payments — join the CDL1000 carrier network for free.",
};

export default function CarriersPage() {
  return (
    <>
      <PageHero
        eyebrow="For carriers"
        title="The power is in your hands"
        description="With clear, up-front pricing and visibility on the highest paying loads on the market, success is in the palm of your hands. One stop, every payment option, in record time."
      >
        <HeroActions primary={{ href: "/sign-up", label: "Sign up now" }} secondary={{ href: "/login", label: "Log in" }} />
      </PageHero>

      <Section>
        <Split
          eyebrow="Hassle-free"
          title="Book the loads you want. Get paid."
          visual={<Visual icon={Smartphone} chips={[{ value: "Free", label: "To sign up" }, { value: "24–72h", label: "Payment after delivery" }]} />}
        >
          <p>With CDL1000 you have total control. Sign up for free, book the loads you want and get paid. It&apos;s that easy.</p>
        </Split>
      </Section>

      <Section
        className="pt-0"
        eyebrow="Fast payment processing"
        title="Get paid your way"
        description="Guaranteed payments via direct deposit and wire transfer — with cryptocurrency on the way."
      >
        <FeatureGrid
          items={[
            { icon: Banknote, title: "Direct deposit", text: "Money straight into your account, without the paperwork chase." },
            { icon: HandCoins, title: "Wire transfer", text: "Fast transfers for larger settlements." },
            { icon: Bitcoin, title: "Crypto payments — coming soon", text: "Get paid in cryptocurrency, alongside the options you already use." },
            { icon: CalendarClock, title: "Within 24–72 hours", text: "Opt for payment within 24–72 hours of delivery." },
            { icon: Wallet, title: "Or automated weekly", text: "Prefer a rhythm? Choose automated weekly payments instead." },
          ]}
        />
      </Section>

      <CtaBand
        title="Fill your schedule today"
        text="Sign up to become a carrier, schedule your load and get paid — it couldn't be easier."
        primary={{ href: "/sign-up", label: "Join as a carrier" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
    </>
  );
}
