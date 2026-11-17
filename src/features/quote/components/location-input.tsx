"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Check, Loader2, MapPin, X } from "lucide-react";
import { cn } from "cn";
import { calculators } from "@/lib/api/services";
import type { Location } from "../types";

type Suggestion = { id: string; main: string; secondary?: string; zip?: string };

const NYC_BOROUGHS = ["Brooklyn", "Manhattan", "The Bronx", "Bronx", "Queens", "Staten Island"];

function toLocation(place: google.maps.places.PlaceResult): Location {
  const loc: Location = { address: place.formatted_address };
  for (const c of place.address_components ?? []) {
    const t = c.types[0];
    if (t === "administrative_area_level_1") loc.state = c.short_name;
    else if (t === "locality") loc.city = c.short_name;
    else if (t === "sublocality_level_1" && !loc.city && NYC_BOROUGHS.includes(c.long_name)) loc.city = "New York";
    else if (t === "postal_code") loc.postal = c.short_name;
  }
  loc.lat = place.geometry?.location?.lat();
  loc.lng = place.geometry?.location?.lng();
  return loc;
}

export function LocationInput({
  label,
  hint,
  value,
  onChange,
  placeholder = "City, address or ZIP",
  citiesOnly,
  invalid,
}: {
  label: string;
  hint?: string;
  value: Location;
  onChange: (l: Location) => void;
  placeholder?: string;
  citiesOnly?: boolean;
  invalid?: boolean;
}) {
  const id = useId();
  const places = useMapsLibrary("places");
  const autocomplete = useMemo(() => (places ? new places.AutocompleteService() : null), [places]);
  const details = useMemo(
    () => (places ? new places.PlacesService(document.createElement("div")) : null),
    [places],
  );
  const session = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const [text, setText] = useState(value.address ?? value.postal ?? "");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = value.lat != null || (!!value.postal && !value.address);
  const query = text.trim();
  const visible = open && !selected && query.length >= 2 ? items : [];

  useEffect(() => {
    if (!open || selected || query.length < 2) return;
    const q = query;

    const handle = setTimeout(() => {
      const zipItem: Suggestion[] = /^\d{5}$/.test(q) ? [{ id: `zip:${q}`, main: `ZIP ${q}`, secondary: "Use this ZIP code", zip: q }] : [];
      if (!autocomplete || /^\d+$/.test(q)) return setItems(zipItem);

      session.current ??= new google.maps.places.AutocompleteSessionToken();
      autocomplete.getPlacePredictions(
        {
          input: q,
          componentRestrictions: { country: "us" },
          types: citiesOnly ? ["(cities)"] : undefined,
          sessionToken: session.current,
        },
        (preds) =>
          setItems([
            ...zipItem,
            ...(preds ?? []).map((p) => ({
              id: p.place_id,
              main: p.structured_formatting.main_text,
              secondary: p.structured_formatting.secondary_text,
            })),
          ]),
      );
    }, 250);
    return () => clearTimeout(handle);
  }, [query, open, selected, autocomplete, citiesOnly]);

  async function choose(s: Suggestion) {
    setOpen(false);
    setError(null);
    setBusy(true);
    try {
      if (s.zip) {
        await calculators.verifyPostalCode(s.zip);
        setText(s.zip);
        onChange({ postal: s.zip });
      } else if (details) {
        const place = await new Promise<google.maps.places.PlaceResult>((resolve, reject) =>
          details.getDetails(
            { placeId: s.id, fields: ["address_components", "formatted_address", "geometry"], sessionToken: session.current ?? undefined },
            (res, status) => (res && status === "OK" ? resolve(res) : reject(new Error(status))),
          ),
        );
        session.current = null;
        const loc = toLocation(place);
        setText(loc.address ?? s.main);
        onChange(loc);
      }
    } catch (e) {
      setError(s.zip ? "We don't serve that ZIP code yet." : "Couldn't load that place. Try another.");
      if (e instanceof Error && !s.zip) console.warn("Places details failed:", e.message);
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setText("");
    setItems([]);
    setError(null);
    onChange({});
  }

  const listId = `${id}-list`;
  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </label>
      <div
        className={cn(
          "flex h-12 items-center gap-2 rounded-xl border bg-background px-3 transition-shadow focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/20",
          (invalid || error) && "border-destructive",
        )}
      >
        <MapPin className={cn("size-4 shrink-0", selected ? "text-brand" : "text-muted-foreground")} />
        <input
          id={id}
          role="combobox"
          aria-expanded={visible.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder={placeholder}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setActive(0);
            setOpen(true);
            if (selected || value.postal) onChange({});
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            const n = visible.length;
            if (!n) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => (a + 1) % n);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => (a - 1 + n) % n);
            } else if (e.key === "Enter") {
              e.preventDefault();
              choose(visible[Math.min(active, n - 1)]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        {busy ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : selected ? (
          <Check className="size-4 text-brand" />
        ) : null}
        {text && (
          <button type="button" aria-label={`Clear ${label}`} onClick={clear} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {visible.length > 0 && (
        <ul id={listId} role="listbox" className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-xl border bg-popover p-1 shadow-xl">
          {visible.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn("cursor-pointer rounded-lg px-3 py-2 text-sm", i === active && "bg-accent")}
            >
              <span className="font-medium">{s.main}</span>
              {s.secondary && <span className="ml-1.5 text-muted-foreground">{s.secondary}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
