import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { Anchor, ArrowRight, ArrowUpRight, Clock, Container, Headset, Quote, Truck, Wallet } from "lucide-react";
import { cn } from "cn";
import { Hero } from "@/components/home/hero";
import { CtaBand, Section } from "@/components/marketing/sections";
import { Reveal } from "@/components/marketing/reveal";
import { buttonVariants } from "@/components/ui/button";
import { getRecentPosts } from "@/features/blog/api";
import { PostCard } from "@/features/blog/post-card";

const services = [
  { icon: Truck, title: "Truckload", href: "/truckload", text: "Dry van, flatbed, temperature-controlled and LTL — no truck off limits." },
  { icon: Container, title: "Drayage", href: "/drayage", text: "The nation's leading drayage partner, from port and rail yard to your door." },
  { icon: Anchor, title: "Demurrage as a Service", href: "/daas", text: "Clear storage and demurrage fast, with admin fees as low as 3%." },
];

const perks = [
  { icon: Clock, title: "Book your truck in one click", text: "Calculate your price, list your load and reserve freight in seconds." },
  { icon: Wallet, title: "Fast payment processing", text: "Carriers get paid within 24–72 hours of delivery, or weekly." },
  { icon: Headset, title: "24/7 customer success", text: "A dedicated team on hand around the clock to keep everyone happy." },
];

const FEATURED = ["USA TODAY", "FOX NEWS", "NBC", "Forbes", "CBS"];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section aria-label="Featured in" className="border-y bg-ink text-white dark:bg-card">
        <div className="container-page flex flex-col items-center gap-6 py-8 md:flex-row md:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Featured in</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {FEATURED.map((n) => (
              <li key={n} className="font-heading text-lg font-extrabold tracking-tight text-white/80">
                {n}
              </li>
            ))}
            <li>
              <Image src="/brand/inc5000.webp" alt="Inc. 5000" width={96} height={40} className="h-8 w-auto opacity-90" />
            </li>
          </ul>
        </div>
      </section>

      <Section eyebrow="Logistics unlimited" title="One platform, every lane" description="From a single load to something far more complex, we solve your big supply chain challenges — whatever the size of your business.">
        <div className="grid gap-5 md:grid-cols-3">
          {services.map(({ icon: Icon, ...s }, i) => (
            <Reveal key={s.href} delay={i * 0.06}>
              <Link
                href={s.href}
                className="group relative block h-full overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/10"
              >
                <Icon className="size-8 text-brand" />
                <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                <ArrowUpRight className="absolute right-5 top-5 size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="container-page grid gap-5 pb-8 md:grid-cols-2">
        {[
          { eyebrow: "For shippers", title: "Simplified solutions that keep your business moving", text: "Book, manage and track shipments live.", href: "/shippers", tone: "brand" },
          { eyebrow: "For carriers", title: "Schedule your load and get paid", text: "Sign up, fill your schedule — it couldn't be easier.", href: "/carriers", tone: "ink" },
        ].map((c, i) => (
          <Reveal key={c.href} delay={i * 0.08}>
            <Link
              href={c.href}
              className={cn(
                "group relative flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-3xl p-8 transition-transform hover:-translate-y-1",
                c.tone === "brand" ? "bg-brand text-brand-foreground" : "bg-ink text-white dark:bg-card",
              )}
            >
              <div aria-hidden className="bg-grid absolute inset-0 opacity-20" />
              <div aria-hidden className={cn("absolute -right-16 -top-16 size-64 rounded-full blur-3xl", c.tone === "brand" ? "bg-highlight/40" : "bg-brand/40")} />
              <p className="relative text-sm font-semibold uppercase tracking-widest opacity-80">{c.eyebrow}</p>
              <h3 className="relative mt-2 max-w-sm text-2xl font-extrabold">{c.title}</h3>
              <p className="relative mt-2 opacity-80">{c.text}</p>
              <span className="relative mt-6 inline-flex items-center gap-2 font-semibold">
                Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </section>

      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          {perks.map(({ icon: Icon, ...p }, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="container-page pb-16">
        <Reveal>
          <figure className="relative mx-auto max-w-3xl rounded-3xl border bg-card px-8 py-12 text-center sm:px-14">
            <Quote aria-hidden className="mx-auto size-10 text-brand" />
            <blockquote className="mt-6 font-heading text-xl font-bold leading-snug sm:text-2xl">
              “For as long as I&apos;m in this position, we will continue to use CDL as our primary carrier from NY to TX for drayage. You make our job easier.”
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground">ExxonMobil</figcaption>
          </figure>
        </Reveal>
      </section>

      <Suspense fallback={null}>
        <LatestPosts />
      </Suspense>

      <CtaBand />
    </>
  );
}

/** "CDL in the news" — hidden entirely if the blogs service is unavailable. */
async function LatestPosts() {
  await connection();
  let posts;
  try {
    posts = (await getRecentPosts()).slice(0, 3);
  } catch {
    return null;
  }
  if (!posts.length) return null;
  return (
    <Section eyebrow="From the blog" title="CDL in the news" className="pt-0">
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/blog" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
          All posts <ArrowRight className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
