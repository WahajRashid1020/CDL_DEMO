import { cn } from "cn";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b", className)}>
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden className="absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
      <div className="container-page relative py-20 sm:py-28">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
