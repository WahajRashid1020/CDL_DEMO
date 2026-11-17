import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

/**
 * Decorative panel used where the old site had photos (its image bucket is no longer public):
 * a large icon on a branded gradient with a few floating "chips".
 */
export function Visual({
  icon: Icon,
  chips = [],
  tone = "brand",
  className,
}: {
  icon: LucideIcon;
  chips?: { label: string; value?: string }[];
  tone?: "brand" | "ink";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate aspect-[4/3] overflow-hidden rounded-3xl border",
        tone === "brand" ? "bg-gradient-to-br from-brand-soft via-card to-card" : "bg-ink text-white dark:bg-card",
        className,
      )}
    >
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div aria-hidden className="absolute -right-16 -top-16 -z-10 size-64 rounded-full bg-brand/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-20 -left-10 -z-10 size-56 rounded-full bg-highlight/25 blur-3xl" />

      <div className="grid size-full place-items-center">
        <span className="grid size-28 place-items-center rounded-[2rem] bg-brand text-brand-foreground shadow-2xl shadow-brand/40 sm:size-36">
          <Icon className="size-14 sm:size-16" strokeWidth={1.5} />
        </span>
      </div>

      {chips.slice(0, 3).map((c, i) => (
        <div
          key={c.label}
          className={cn(
            "absolute rounded-xl border bg-background/85 px-3.5 py-2 text-foreground shadow-lg backdrop-blur",
            i === 0 && "left-4 top-5 sm:left-6 sm:top-8",
            i === 1 && "bottom-5 right-4 sm:bottom-8 sm:right-6",
            i === 2 && "bottom-6 left-6 hidden sm:block",
          )}
        >
          {c.value && <p className="font-heading text-lg font-extrabold leading-none text-brand">{c.value}</p>}
          <p className={cn("text-xs font-medium", c.value && "mt-1 text-muted-foreground")}>{c.label}</p>
        </div>
      ))}
    </div>
  );
}
