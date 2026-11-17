import Link from "next/link";
import { ArrowRight, Check, MapPin, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function Section({
  eyebrow,
  title,
  description,
  children,
  className,
  center,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section className={cn("container-page py-16 sm:py-24", className)}>
      {(eyebrow || title || description) && (
        <Reveal className={cn("max-w-2xl", center && "mx-auto text-center")}>
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>}
          {title && <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>}
          {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
        </Reveal>
      )}
      {children && <div className={cn(title || eyebrow ? "mt-12" : "")}>{children}</div>}
    </section>
  );
}

export type Feature = { icon: LucideIcon; title: string; text: string; href?: string };

export function FeatureGrid({ items, cols = 3 }: { items: Feature[]; cols?: 2 | 3 | 4 }) {
  return (
    <div className={cn("grid gap-5", cols === 2 && "md:grid-cols-2", cols === 3 && "md:grid-cols-3", cols === 4 && "sm:grid-cols-2 lg:grid-cols-4")}>
      {items.map(({ icon: Icon, title, text, href }, i) => {
        const body = (
          <>
            <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand transition-transform group-hover:-rotate-6">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            {href && (
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </>
        );
        const cls = "group block h-full rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5";
        return (
          <Reveal key={title} delay={i * 0.06}>
            {href ? (
              <Link href={href} className={cls}>
                {body}
              </Link>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

export function Checklist({ items, columns = 2 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2")}>
      {items.map((t) => (
        <li key={t} className="flex gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
          <Check className="mt-0.5 size-4 shrink-0 text-brand" /> <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

/** Text on one side, any visual on the other. */
export function Split({
  eyebrow,
  title,
  children,
  visual,
  reverse,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(reverse && "lg:order-2")}>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>}
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">{children}</div>
      </Reveal>
      <Reveal delay={0.1}>{visual}</Reveal>
    </div>
  );
}

const TERMINALS = ["Atlanta", "Chicago", "Savannah", "Indianapolis", "Jacksonville", "Los Angeles", "Lyons, IL"];
const SOON = ["Kansas City", "New York", "New Jersey"];

export function Terminals() {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="font-heading text-lg font-bold">Terminal locations</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {TERMINALS.map((t) => (
          <li key={t} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium">
            <MapPin className="size-3.5 text-brand" /> {t}
          </li>
        ))}
        {SOON.map((t) => (
          <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-sm text-muted-foreground">
            {t} <span className="text-xs">· soon</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroActions({ primary = { href: "/quote", label: "Get a quote" }, secondary }: { primary?: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={primary.href} className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full px-6 text-base shadow-xl shadow-brand/25")}>
        {primary.label} <ArrowRight className="size-4" />
      </Link>
      {secondary && (
        <Link href={secondary.href} className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 rounded-full px-6 text-base")}>
          {secondary.label}
        </Link>
      )}
    </div>
  );
}

export function CtaBand({
  title = "Ready to move your next load?",
  text = "Get a live truckload or drayage price now — no account needed.",
  primary = { href: "/quote", label: "Get an instant quote" },
  secondary = { href: "/sign-up", label: "Sign up for free" },
}: {
  title?: string;
  text?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="container-page pb-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-12 dark:bg-card">
          <div aria-hidden className="absolute -left-20 -top-20 size-72 rounded-full bg-brand/40 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -right-10 size-72 rounded-full bg-highlight/20 blur-3xl" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl">{title}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/70">{text}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href={primary.href} className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full px-6 text-base")}>
              {primary.label}
            </Link>
            <Link href={secondary.href} className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 text-base font-medium hover:bg-white/10">
              {secondary.label}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** Big-number highlight, e.g. "85%" for the agency program. */
export function StatCards({ items }: { items: { value: string; label: string; text?: string }[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {items.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.06}>
          <div className="h-full rounded-2xl border bg-card p-6">
            <p className="font-heading text-4xl font-extrabold text-gradient-brand">{s.value}</p>
            <p className="mt-2 font-semibold">{s.label}</p>
            {s.text && <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
