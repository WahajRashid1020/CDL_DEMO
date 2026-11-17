export type QuoteMode = "truckload" | "drayage";
export type QuoteStep = "route" | "price" | "checkout" | "done";

/** A place picked from Google Places, or a verified 5-digit ZIP. */
export type Location = {
  address?: string;
  city?: string;
  state?: string;
  postal?: string;
  lat?: number;
  lng?: number;
};

export type Contact = { email: string; phone: string };

/** Fields of `fk_customer` returned with every quote. */
export type Customer = {
  name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  company_address?: string;
};

/** Money values come back as strings like "1,234.56". */
type Money = string | number | null | undefined;

export type TruckloadCalculation = {
  id: number;
  distance?: number | string;
  polyline?: string;
  price_per_load?: Money;
  fsc?: Money;
  volume?: number;
  weight?: number;
  total_amount?: Money;
  pay_now_discount?: Money;
  after_discount?: Money;
  equipment_type?: number | string;
  load_type?: string;
  commodity?: string;
  special_requirements?: string;
  pickup_datetime?: string;
  dropoff_datetime?: string;
  fk_customer?: Customer;
};

export type DrayageCalculation = {
  id: number;
  distance?: number | string;
  polyline?: string;
  trip_type?: "I" | "E";
  unload_type?: string;
  weight?: number;
  commodities?: string;
  chassis_days?: number;
  total_amount?: Money;
  formatted_dollar_amount?: Money;
  pay_now_discount?: Money;
  after_pay_now_discount?: Money;
  calculation_breakdown?: Record<string, Money>;
  fk_container?: { id: number; title?: string; fk_container?: { id: number; title?: string } };
  fk_chassis?: { id: number; title?: string };
  fk_hazmat_class?: { id: number; title?: string };
  fk_hazmat_sub_class?: { id: number; title?: string };
  fk_customer?: Customer;
};

/** Response of verify_promo_code (and the promo fields echoed on a re-quote). */
export type PromoResult = {
  id?: number;
  discounted?: Money;
  total_discount?: Money;
  total_amount?: Money;
  amount_after_promo_discount?: Money;
  amount_after_complete_discount?: Money;
};

/** One shape for the price screen, whichever calculator produced it. */
export type QuoteView = {
  mode: QuoteMode;
  id: number;
  distance?: number;
  polyline?: string;
  lines: { label: string; value: number; hint?: string }[];
  subtotal: number;
  payNowDiscount: number;
  payNowTotal: number;
  customer?: Customer;
  raw: TruckloadCalculation | DrayageCalculation;
};

export type Option = { id: number; title?: string; name?: string; is_default?: boolean };
export type HazmatClass = Option & { sub_classes?: Option[] };
