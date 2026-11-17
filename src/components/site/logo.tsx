import Link from "next/link";
import { cn } from "cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="CDL1000 home"
      className={cn("group inline-flex items-center gap-2 font-heading text-lg font-extrabold", className)}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-brand text-sm text-brand-foreground shadow-lg shadow-brand/30 transition-transform group-hover:-rotate-6">
        C
      </span>
      <span>
        CDL<span className="text-brand">1000</span>
      </span>
    </Link>
  );
}
