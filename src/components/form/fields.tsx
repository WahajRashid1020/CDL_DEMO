"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";

export function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: (id: string) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children(id)}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-brand focus:ring-3 focus:ring-brand/20 aria-invalid:border-destructive disabled:opacity-60";

export function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={cn(inputClass, "appearance-none pr-9", className)}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

/** Two-option pill switch with a sliding thumb. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  size?: "md" | "lg";
}) {
  return (
    <div role="radiogroup" className="relative inline-grid auto-cols-fr grid-flow-col rounded-full border bg-muted/60 p-1">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors",
              size === "lg" ? "h-11 px-6 text-sm" : "h-8 px-4 text-xs",
              on ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
