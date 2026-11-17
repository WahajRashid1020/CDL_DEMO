import type { Metadata } from "next";
import { Handshake } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand, HeroActions, Section, Split, StatCards } from "@/components/marketing/sections";
import { Visual } from "@/components/marketing/visual";

export const metadata: Metadata = {
  title: "Agency program",
  description: "Run your own freight agency with CDL1000 — 85% of gross revenue, weekly pay and Fortune 500 customers.",
};

export default function AgencyPage() {
  return (
    <>
      <PageHero
        eyebrow="Agency program"
        title="Why be an agent of CDL1000?"
        description="Take your agency farther than you can imagine. Reach beyond your earning goals while working with Fortune 500 customers. Running your own business is hard work — operate the way you want."
      >
        <HeroActions primary={{ href: "/sign-up", label: "Sign up for free" }} secondary={{ href: "/contact", label: "Ask a question" }} />
      </PageHero>

      <Section
        eyebrow="The value we bring"
        title="We're in this together"
        description="CDL1000 gives you consistency while always looking for new ways to drive productivity. Your success is our top priority."
      >
        <StatCards
          items={[
            { value: "85%", label: "Program", text: "We provide 85% of the gross revenue." },
            { value: "Weekly", label: "Support", text: "Get paid weekly — no more chargebacks." },
            { value: "All in", label: "Perks", text: "Be an agent with all the perks." },
          ]}
        />
      </Section>

      <Section className="pt-0">
        <Split
          eyebrow="Business owners, not employees"
          title="Your experience, our platform"
          visual={<Visual icon={Handshake} chips={[{ label: "Fortune 500 customers" }, { label: "Decades of experience" }]} />}
        >
          <p>
            Our agents are business owners who operate with us. Customers get a small business owner with — in most cases — decades of experience, who cares about
            their business.
          </p>
          <p>
            That gives customers a constant, direct point of contact who has seen the industry&apos;s ups and downs and finds creative ways to make sure every load
            arrives on time.
          </p>
        </Split>
      </Section>

      <CtaBand
        title="Grow your agency with us"
        text="Join the program and start working with CDL1000 customers."
        primary={{ href: "/sign-up", label: "Become an agent" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
    </>
  );
}
