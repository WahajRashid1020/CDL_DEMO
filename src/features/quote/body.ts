/**
 * Request bodies for the calculators service. Field names, defaults and quirks are copied
 * from the current cdl1000.com calculators so the backend sees exactly what it expects.
 */
import { defaultDates, toApiDate } from "./format";
import type { Contact, Customer, Location } from "./types";

const zip = (l: Location) => (l.postal ? Number(l.postal) : undefined);

export type TruckloadOptions = {
  volume: number;
  weight: number;
  equipmentType: number;
  loadType: string;
  commodity: string;
  specialRequirements: string;
  pickup: Date;
  dropoff: Date;
};

export function defaultTruckloadOptions(): TruckloadOptions {
  const { pickup, dropoff } = defaultDates();
  return {
    volume: 10, // old site's first quote always used 10 loads
    weight: 45000,
    equipmentType: 1,
    loadType: "Dry Van",
    commodity: "FAK",
    specialRequirements: "None",
    pickup,
    dropoff,
  };
}

export function truckloadDistanceBody(origin: Location, destination: Location) {
  return {
    from_address_lat: origin.lat,
    from_address_long: origin.lng,
    to_address_lat: destination.lat,
    to_address_long: destination.lng,
    origin_zip: zip(origin),
    destination_zip: zip(destination),
  };
}

export function truckloadBody(args: {
  origin: Location;
  destination: Location;
  contact: Contact;
  customer?: Customer;
  options: TruckloadOptions;
  promoId?: number | null;
}) {
  const { origin, destination, contact, customer, options: o } = args;
  return {
    fk_promo_code_id: args.promoId ?? null,
    from_address: origin.address,
    from_state_code: origin.state,
    from_city_name: origin.city,
    from_address_lat: origin.lat,
    from_address_long: origin.lng,
    origin_zip: zip(origin),
    to_address: destination.address,
    to_address_lat: destination.lat,
    to_address_long: destination.lng,
    to_city_name: destination.city,
    to_state_code: destination.state,
    destination_zip: zip(destination),
    volume: o.volume,
    name: customer?.name,
    billing_address: "billing address",
    address: customer?.company_address,
    company_name: customer?.company_name,
    email: customer?.email ?? contact.email,
    phone: customer?.phone ?? contact.phone,
    weight: o.weight,
    pickup_datetime: toApiDate(o.pickup),
    dropoff_datetime: toApiDate(o.dropoff),
    load_type: o.loadType,
    equipment_type: o.equipmentType,
    commodity: o.commodity,
    special_requirements: o.specialRequirements === "None" ? "" : o.specialRequirements,
  };
}

export type DrayageOptions = {
  unloadType: "Live" | "Drop and Hook";
  weight: number;
  containerId?: number;
  containerSizeId?: number;
  chassisId?: number;
  chassisDays: number;
  commodities: string;
  hazmat: boolean;
  hazmatClass?: number;
  hazmatSubClass?: number;
};

export function defaultDrayageOptions(): DrayageOptions {
  return { unloadType: "Live", weight: 45000, chassisDays: 2, commodities: "FAK", hazmat: false };
}

/**
 * Import: pick up at the port, deliver to the warehouse, return the empty to the port.
 * Export: pick up the empty at the port, load at the warehouse, return to the port.
 * Either way the old site sends from = port, to = warehouse, return = port.
 */
export function drayageBody(args: {
  tripType: "I" | "E";
  port: Location;
  warehouse: Location;
  contact: Contact;
  customer?: Customer;
  options: DrayageOptions;
  promoId?: number | null;
}) {
  const { port, warehouse, contact, customer, options: o } = args;
  return {
    fk_promo_code_id: args.promoId ?? null,
    from_address_lat: port.lat,
    from_address_long: port.lng,
    from_state_code: port.state,
    from_address: port.address,
    to_address_lat: warehouse.lat,
    to_address_long: warehouse.lng,
    to_state_code: warehouse.state,
    to_address: warehouse.address,
    return_address_lat: port.lat,
    return_address_long: port.lng,
    return_state_code: port.state,
    return_address: port.address,
    trip_type: args.tripType,
    unload_type: o.unloadType,
    container_size: o.containerSizeId,
    chassis_id: o.chassisId,
    chassis_tag: "RC",
    chassis_days: o.chassisDays,
    company_name: customer?.company_name ?? "",
    weight: o.weight,
    name: customer?.name ?? "",
    address: customer?.company_address ?? "",
    email: customer?.email ?? contact.email,
    phone: customer?.phone ?? contact.phone,
    commodities: o.commodities,
    hazmat: o.hazmat,
    hazmat_class: o.hazmat ? o.hazmatClass : null,
    hazmat_sub_class: o.hazmat ? o.hazmatSubClass : null,
  };
}

/** calc_type / calculator_type values used by the backend. */
export const CALC_TYPE = { drayage: 1, truckload: 2 } as const;
