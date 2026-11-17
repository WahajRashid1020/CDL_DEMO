"use client";

import type { QuoteMode } from "./types";

/**
 * A per-browser list of recent quotes for the dashboard. The calculators service has no
 * "my quotes" endpoint, so this is a convenience only — it never leaves the device.
 */
export type RecentQuote = {
  id: number;
  mode: QuoteMode;
  from: string;
  to: string;
  distance?: number;
  subtotal: number;
  payNowTotal: number;
  status: "quoted" | "booked" | "paid" | "contact";
  at: string; // ISO date
};

const KEY = "cdl.recentQuotes";
const MAX = 12;

export function readRecent(): RecentQuote[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function write(list: RecentQuote[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    window.dispatchEvent(new Event("cdl:recent"));
  } catch {
    // Storage unavailable (private mode etc.) — the dashboard just shows nothing.
  }
}

export function saveRecent(q: RecentQuote) {
  write([q, ...readRecent().filter((r) => !(r.id === q.id && r.mode === q.mode))]);
}

export function markRecent(id: number, mode: QuoteMode, status: RecentQuote["status"]) {
  write(readRecent().map((r) => (r.id === id && r.mode === mode ? { ...r, status } : r)));
}

export function clearRecent() {
  write([]);
}
