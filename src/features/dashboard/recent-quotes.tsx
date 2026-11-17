"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Container, FileText, Package, Trash2, Truck, Wallet } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { money } from "@/features/quote/format";
import { clearRecent, type RecentQuote } from "@/features/quote/recent";

const KEY = "cdl.recentQuotes";
const subscribe = (cb: () => void) => {
  window.addEventListener("cdl:recent", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("cdl:recent", cb);
    window.removeEventListener("storage", cb);
  };
};
const snapshot = () => {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

const STATUS: Record<RecentQuote["status"], { label: string; cls: string }> = {
  quoted: { label: "Quoted", cls: "bg-muted text-muted-foreground" },
  contact: { label: "Call requested", cls: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  booked: { label: "Booked · pay later", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  paid: { label: "Paid", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
};

export function RecentQuotes() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const list = useMemo<RecentQuote[]>(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [raw]);

  const booked = list.filter((q) => q.status === "booked" || q.status === "paid");
  const value = booked.reduce((sum, q) => sum + (q.status === "paid" ? q.payNowTotal : q.subtotal), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={FileText} label="Quotes" value={String(list.length)} />
        <Stat icon={Package} label="Booked loads" value={String(booked.length)} />
        <Stat icon={Wallet} label="Booked value" value={money(value)} />
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
          <div>
            <h2 className="font-heading text-lg font-bold">Recent quotes</h2>
            <p className="text-xs text-muted-foreground">Saved on this device.</p>
          </div>
          {list.length > 0 && (
            <button type="button" onClick={clearRecent} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
              <Trash2 className="size-3.5" /> Clear
            </button>
          )}
        </div>

        {list.length === 0 ? (
          <div className="grid place-items-center gap-3 px-5 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
              <Truck className="size-6" />
            </span>
            <p className="font-medium">No quotes yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">Price your first lane — it takes less than a minute.</p>
            <Link href="/quote" className={cn(buttonVariants(), "mt-2 rounded-full")}>
              Get a quote <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y">
            {list.map((q) => {
              const Icon = q.mode === "truckload" ? Truck : Container;
              const s = STATUS[q.status];
              return (
                <li key={`${q.mode}-${q.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted">
                    <Icon className="size-5 text-brand" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {q.from} <span className="text-muted-foreground">→</span> {q.to}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="capitalize">{q.mode}</span> · #{q.id}
                      {q.distance ? ` · ${Math.round(q.distance).toLocaleString()} mi` : ""} ·{" "}
                      {formatDistanceToNow(new Date(q.at), { addSuffix: true })}
                    </p>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", s.cls)}>{s.label}</span>
                  <span className="w-24 text-right font-heading font-bold tabular-nums">
                    {money(q.status === "paid" ? q.payNowTotal : q.subtotal)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Truck; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 text-brand" /> {label}
      </div>
      <p className="mt-2 font-heading text-2xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}
