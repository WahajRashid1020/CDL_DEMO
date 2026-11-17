"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Check, Loader2, MapPin, X } from "lucide-react";
import { cn } from "cn";
import { ApiError } from "@/lib/api/client";
import { calculators } from "@/lib/api/services";
import type { Location } from "../types";

type Suggestion = { id: string; main: string; secondary?: string; zip?: string; prediction?: google.maps.places.PlacePrediction };

const NYC_BOROUGHS = ["Brooklyn", "Manhattan", "The Bronx", "Bronx", "Queens", "Staten Island"];

/** Places API (New) → our Location shape. */
function toLocation(place: google.maps.places.Place): Location {
  const loc: Location = { address: place.formattedAddress ?? undefined };
  for (const c of place.addressComponents ?? []) {
    const t = c.types[0];
    if (t === "administrative_area_level_1") loc.state = c.shortText ?? undefined;
    else if (t === "locality") loc.city = c.shortText ?? undefined;
    else if (t === "sublocality_level_1" && !loc.city && NYC_BOROUGHS.includes(c.longText ?? "")) loc.city = "New York";
    else if (t === "postal_code") loc.postal = c.shortText ?? undefined;
  }
  loc.lat = place.location?.lat();
  loc.lng = place.location?.lng();
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
  const session = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const [text, setText] = useState(value.address ?? value.postal ?? "");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [searchedFor, setSearchedFor] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = value.lat != null || (!!value.postal && !value.address);
  const query = text.trim();
  const visible = open && !selected && query.length >= 2 ? items : [];
  // Search finished for exactly this text and found nothing.
  const noMatches = open && !selected && query.length >= 3 && searchedFor === query && items.length === 0;

  useEffect(() => {
    if (!open || selected || query.length < 2) return;
    const q = query;
    let cancelled = false;

    const handle = setTimeout(async () => {
      const zipItem: Suggestion[] = /^\d{5}$/.test(q) ? [{ id: `zip:${q}`, main: `ZIP ${q}`, secondary: "Use this ZIP code", zip: q }] : [];
      if (!places || /^\d+$/.test(q)) {
        if (!cancelled) {
          setItems(zipItem);
          setSearchedFor(q);
        }
        return;
      }
      try {
        session.current ??= new places.AutocompleteSessionToken();
        const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: q,
          includedRegionCodes: ["us"], // CDL only prices US lanes
          includedPrimaryTypes: citiesOnly ? ["(cities)"] : undefined,
          sessionToken: session.current,
        });
        if (cancelled) return;
        setItems([
          ...zipItem,
          ...suggestions
            .map((s) => s.placePrediction)
            .filter((p): p is google.maps.places.PlacePrediction => !!p)
            .map((p) => ({ id: p.placeId, main: p.mainText?.text ?? p.text.text, secondary: p.secondaryText?.text, prediction: p })),
        ]);
      } catch (e) {
        console.warn("Places autocomplete failed:", e instanceof Error ? e.message : e);
        if (!cancelled) setItems(zipItem);
      } finally {
        if (!cancelled) setSearchedFor(q);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, open, selected, places, citiesOnly]);

  async function choose(s: Suggestion) {
    setOpen(false);
    setError(null);
    setBusy(true);
    try {
      if (s.zip) {
        await calculators.verifyPostalCode(s.zip);
        setText(s.zip);
        onChange({ postal: s.zip });
      } else if (s.prediction) {
        // The session token from the suggestions request is passed along automatically.
        const { place } = await s.prediction.toPlace().fetchFields({ fields: ["addressComponents", "formattedAddress", "location"] });
        session.current = null;
        const loc = toLocation(place);
        setText(loc.address ?? s.main);
        onChange(loc);
      }
    } catch (e) {
      if (s.zip) {
        setError(e instanceof ApiError && e.status >= 500 ? "We couldn't check that ZIP right now. Try again shortly." : "We don't serve that ZIP code yet.");
      } else {
        setError("Couldn't load that place. Try another.");
        console.warn("Places details failed:", e instanceof Error ? e.message : e);
      }
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setText("");
    setItems([]);
    setSearchedFor("");
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
      {!error && noMatches && (
        <p className="mt-1 text-xs text-muted-foreground">No US matches — we only quote US locations. Try a US city or a 5-digit ZIP.</p>
      )}

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
