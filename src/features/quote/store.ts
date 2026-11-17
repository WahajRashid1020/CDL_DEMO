"use client";

import { create } from "zustand";
import {
  defaultDrayageOptions,
  defaultTruckloadOptions,
  type DrayageOptions,
  type TruckloadOptions,
} from "./body";
import type { Contact, Location, PromoResult, QuoteMode, QuoteStep, QuoteView } from "./types";

type State = {
  mode: QuoteMode;
  step: QuoteStep;
  contact: Contact;

  origin: Location;
  destination: Location;
  truckload: TruckloadOptions;

  tripType: "I" | "E";
  port: Location;
  warehouse: Location;
  drayage: DrayageOptions;

  quote: QuoteView | null;
  payNow: boolean;
  promoCode: string | null;
  promo: PromoResult | null;
  doneMessage: string | null;
};

type Actions = {
  setMode: (mode: QuoteMode) => void;
  setStep: (step: QuoteStep) => void;
  set: (patch: Partial<State>) => void;
  setTruckload: (patch: Partial<TruckloadOptions>) => void;
  setDrayage: (patch: Partial<DrayageOptions>) => void;
  setQuote: (quote: QuoteView) => void;
  setPromo: (code: string | null, promo: PromoResult | null) => void;
  finish: (message: string) => void;
  reset: () => void;
};

const initial = (): State => ({
  mode: "truckload",
  step: "route",
  contact: { email: "", phone: "" },
  origin: {},
  destination: {},
  truckload: defaultTruckloadOptions(),
  tripType: "I",
  port: {},
  warehouse: {},
  drayage: defaultDrayageOptions(),
  quote: null,
  payNow: true,
  promoCode: null,
  promo: null,
  doneMessage: null,
});

export const useQuote = create<State & Actions>()((set) => ({
  ...initial(),
  setMode: (mode) => set({ mode, step: "route", quote: null, promo: null, promoCode: null }),
  setStep: (step) => set({ step }),
  set: (patch) => set(patch),
  setTruckload: (patch) => set((s) => ({ truckload: { ...s.truckload, ...patch } })),
  setDrayage: (patch) => set((s) => ({ drayage: { ...s.drayage, ...patch } })),
  setQuote: (quote) => set({ quote, step: "price" }),
  setPromo: (promoCode, promo) => set({ promoCode, promo }),
  finish: (doneMessage) => set({ doneMessage, step: "done" }),
  reset: () => set((s) => ({ ...initial(), mode: s.mode, contact: s.contact })),
}));

export const hasPlace = (l: Location) =>
  (l.lat != null && l.lng != null) || (!!l.postal && l.postal.length === 5);
