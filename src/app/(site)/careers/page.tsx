import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  Coffee,
  Ear,
  Eye,
  HeartPulse,
  PiggyBank,
  Plane,
  Rocket,
  ShieldPlus,
  Smile,
  Target,
  Umbrella,
  Wallet,
} from "lucide-react";
import { cn } from "cn";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { FeatureGrid, Section } from "@/components/marketing/sections";
import { Reveal } from "@/components/marketing/reveal";
import jobs from "@/content/jobs.json";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join a team that's paving the way to a smarter future for logistics. See open roles at CDL1000.",
};

const BENEFITS = [
  { icon: Plane, label: "PTO" },
  { icon: PiggyBank, label: "401(k)" },
  { icon: Umbrella, label: "Life insurance" },
  { icon: CalendarCheck, label: "Paid holidays" },
  { icon: HeartPulse, label: "Medical benefits" },
  { icon: Smile, label: "Dental insurance" },
  { icon: Eye, label: "Vision insurance" },
  { icon: Wallet, label: "Competitive compensation" },
  { icon: ShieldPlus, label: "Supplemental cover through Aflac" },
  { icon: Coffee, label: "Snacks and drinks — all the snacks" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join a team paving the way to a smarter future"
        description="We exist to put the right truck on the right load, for the right price, at the right time. We're trusted by Fortune 100 companies — and our people are at the core of that success."
      >
        <a href="#openings" className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full px-6 text-base shadow-xl shadow-brand/25")}>
          View job openings <ArrowRight className="size-4" />
        </a>
      </PageHero>

      <Section eyebrow="How we work" title="What drives us">
        <FeatureGrid
          items={[
            {
              icon: Target,
              title: "Gear up for customer success",
              text: "Customers are at the heart of everything we do. Every decision is geared toward an incredible experience — because their success is our success.",
            },
            {
              icon: Rocket,
              title: "Never stand still",
              text: "Just because something works doesn't mean we take our foot off the gas. Innovation is a continuous process we work at every day.",
            },
            {
              icon: Ear,
              title: "Listen and learn",
              text: "We keep our eyes and ears open, consult with our customers and carriers, and build innovations driven by our people.",
            },
          ]}
        />
      </Section>

      <Section className="pt-0" eyebrow="Benefits" title="What we offer you">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-4 text-sm font-medium">
              <Icon className="size-5 text-brand" />
              {label}
            </li>
          ))}
        </ul>
      </Section>

      <section id="openings" className="scroll-mt-20 border-t bg-muted/40">
        <div className="container-page py-16 sm:py-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand">Open roles</p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{jobs.length} job openings</h2>
            </div>
            <p className="text-sm text-muted-foreground">Chicago and Lyons, IL</p>
          </Reveal>

          <div className="mt-10 space-y-3">
            {jobs.map((job) => (
              <details key={job.title} className="group rounded-2xl border bg-card open:shadow-lg">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-heading font-bold">{job.title}</span>
                  <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="grid gap-6 border-t px-5 py-5 md:grid-cols-2">
                  <JobList title="We'd love to talk with you if…" items={job.lookingFor} />
                  <JobList title="Responsibilities" items={job.responsibilities} />
                  <div className="md:col-span-2">
                    <Link href={`/apply?position=${encodeURIComponent(job.title)}`} className={cn(buttonVariants(), "rounded-full")}>
                      Apply for this role <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function JobList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" /> {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
