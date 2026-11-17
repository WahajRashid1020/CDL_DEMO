import { CheckCircle2 } from "lucide-react";

/** Split layout for login / sign-up: brand panel on the left, form on the right. */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  points,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  points: string[];
  children: React.ReactNode;
}) {
  return (
    <section className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-20">
      <div className="relative hidden overflow-hidden rounded-3xl bg-ink p-10 text-white lg:block dark:bg-card">
        <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-brand/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -left-16 size-64 rounded-full bg-highlight/20 blur-3xl" />
        <div aria-hidden className="bg-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-widest text-highlight">{eyebrow}</p>
          <p className="mt-4 font-heading text-4xl font-extrabold leading-tight">{title}</p>
          <p className="mt-4 text-white/70">{subtitle}</p>
          <ul className="mt-10 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-white/85">
                <CheckCircle2 className="size-5 shrink-0 text-brand" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto w-full max-w-lg">{children}</div>
    </section>
  );
}
