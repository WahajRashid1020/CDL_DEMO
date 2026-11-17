import Link from "next/link";
import { ArrowUpRight, Anchor, Clock, Container, ShieldCheck, Truck, Wallet } from "lucide-react";
import { Hero } from "@/components/home/hero";

const services = [
  { icon: Truck, title: "Truckload", href: "/truckload", text: "Full truckload capacity with instant, transparent pricing." },
  { icon: Container, title: "Drayage", href: "/drayage", text: "Port and rail container moves, chassis and hazmat included." },
  { icon: Anchor, title: "Demurrage as a Service", href: "/daas", text: "We watch your containers so you stop paying avoidable fees." },
];

const perks = [
  { icon: Clock, title: "Book in one click", text: "From quote to booked load in under a minute." },
  { icon: Wallet, title: "Fast payments", text: "Carriers get paid quickly, without the paperwork chase." },
  { icon: ShieldCheck, title: "Vetted network", text: "Every carrier is checked against MC and US DOT records." },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="container-page py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">What we move</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">One platform, every lane</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {services.map(({ icon: Icon, ...s }) => (
            <Link
              key={s.href}
              href={s.href}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/10"
            >
              <Icon className="size-8 text-brand" />
              <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              <ArrowUpRight className="absolute right-5 top-5 size-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-ink text-white dark:bg-card">
        <div className="container-page grid gap-10 py-20 md:grid-cols-3">
          {perks.map(({ icon: Icon, ...p }) => (
            <div key={p.title}>
              <span className="grid size-11 place-items-center rounded-xl bg-white/10">
                <Icon className="size-5 text-highlight" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-white/70">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-24 text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-5xl">
          Ready to move your next load?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Get a live truckload or drayage price now — no account needed.
        </p>
        <Link
          href="/quote"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-brand px-8 font-semibold text-brand-foreground shadow-xl shadow-brand/30 transition-transform hover:scale-[1.03]"
        >
          Get an instant quote
        </Link>
      </section>
    </>
  );
}
