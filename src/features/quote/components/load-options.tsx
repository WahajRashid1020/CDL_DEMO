"use client";

import { useState } from "react";
import { parseISO } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toInputDate } from "../format";
import { label, pickDefault, useChassis, useContainers, useContainerSizes, useEquipmentTypes, useHazmatClasses } from "../hooks";
import { useQuote } from "../store";
import { Field, inputClass, NativeSelect } from "@/components/form/fields";

const SPECIAL = ["None", "Overweight", "Hazmat", "Expedited"];

/** Number input that can be cleared while typing; falls back to `min` on blur. */
function NumInput({ id, value, min = 1, onCommit }: { id: string; value: number; min?: number; onCommit: (n: number) => void }) {
  const [raw, setRaw] = useState(String(value));
  return (
    <input
      id={id}
      type="number"
      inputMode="numeric"
      min={min}
      className={inputClass}
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        const n = Number(e.target.value);
        if (e.target.value !== "" && Number.isFinite(n) && n >= min) onCommit(n);
      }}
      onBlur={() => {
        const n = Number(raw);
        if (raw === "" || !Number.isFinite(n) || n < min) {
          setRaw(String(min));
          onCommit(min);
        }
      }}
    />
  );
}

/** Editable load details. Changes are local until "Update price" re-runs the quote. */
export function LoadOptions({ dirty, onChange, onRequote, pending }: { dirty: boolean; onChange: () => void; onRequote: () => void; pending: boolean }) {
  const mode = useQuote((s) => s.mode);
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-base font-bold">Load details</h3>
        <Button type="button" size="sm" variant={dirty ? "default" : "outline"} disabled={!dirty || pending} onClick={onRequote} className="rounded-full">
          <RefreshCw className={pending ? "size-3.5 animate-spin" : "size-3.5"} /> Update price
        </Button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{mode === "truckload" ? <TruckloadFields onChange={onChange} /> : <DrayageFields onChange={onChange} />}</div>
    </div>
  );
}

function TruckloadFields({ onChange }: { onChange: () => void }) {
  const o = useQuote((s) => s.truckload);
  const setT = useQuote((s) => s.setTruckload);
  const equipment = useEquipmentTypes();
  const set = (p: Parameters<typeof setT>[0]) => (setT(p), onChange());
  const today = toInputDate(new Date());

  return (
    <>
      <Field label="Equipment">
        {(id) => (
          <NativeSelect
            id={id}
            value={o.equipmentType}
            disabled={equipment.isLoading}
            onChange={(e) => {
              const item = equipment.data?.find((x) => x.id === Number(e.target.value));
              set({ equipmentType: Number(e.target.value), loadType: item ? label(item) : o.loadType });
            }}
          >
            {(equipment.data?.length ? equipment.data : [{ id: o.equipmentType, name: o.loadType }]).map((x) => (
              <option key={x.id} value={x.id}>
                {label(x)}
              </option>
            ))}
          </NativeSelect>
        )}
      </Field>
      <Field label="Special requirements">
        {(id) => (
          <NativeSelect id={id} value={o.specialRequirements} onChange={(e) => set({ specialRequirements: e.target.value })}>
            {SPECIAL.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </NativeSelect>
        )}
      </Field>
      <Field label="Weight (lbs)">{(id) => <NumInput id={id} value={o.weight} onCommit={(weight) => set({ weight })} />}</Field>
      <Field label="Number of loads">{(id) => <NumInput id={id} value={o.volume} onCommit={(volume) => set({ volume })} />}</Field>
      <Field label="Pickup date">
        {(id) => <input id={id} type="date" min={today} className={inputClass} value={toInputDate(o.pickup)} onChange={(e) => e.target.value && set({ pickup: parseISO(e.target.value) })} />}
      </Field>
      <Field label="Delivery date">
        {(id) => <input id={id} type="date" min={toInputDate(o.pickup)} className={inputClass} value={toInputDate(o.dropoff)} onChange={(e) => e.target.value && set({ dropoff: parseISO(e.target.value) })} />}
      </Field>
      <Field label="Commodities" className="sm:col-span-2">
        {(id) => <input id={id} className={inputClass} value={o.commodity} placeholder="e.g. FAK, paper goods" onChange={(e) => set({ commodity: e.target.value })} />}
      </Field>
    </>
  );
}

function DrayageFields({ onChange }: { onChange: () => void }) {
  const o = useQuote((s) => s.drayage);
  const setD = useQuote((s) => s.setDrayage);
  const set = (p: Parameters<typeof setD>[0]) => (setD(p), onChange());
  const containers = useContainers();
  const sizes = useContainerSizes(o.containerId);
  const chassis = useChassis();
  const hazmat = useHazmatClasses(o.hazmat);
  const subClasses = hazmat.data?.find((c) => c.id === o.hazmatClass)?.sub_classes;

  return (
    <>
      <Field label="Container">
        {(id) => (
          <NativeSelect id={id} value={o.containerId ?? ""} onChange={(e) => set({ containerId: Number(e.target.value), containerSizeId: undefined })}>
            {containers.data?.map((x) => <option key={x.id} value={x.id}>{label(x)}</option>)}
          </NativeSelect>
        )}
      </Field>
      <Field label="Container size">
        {(id) => (
          <NativeSelect id={id} value={o.containerSizeId ?? pickDefault(sizes.data)?.id ?? ""} disabled={sizes.isLoading} onChange={(e) => set({ containerSizeId: Number(e.target.value) })}>
            {sizes.data?.map((x) => <option key={x.id} value={x.id}>{label(x)}</option>)}
          </NativeSelect>
        )}
      </Field>
      <Field label="Unloading">
        {(id) => (
          <NativeSelect id={id} value={o.unloadType} onChange={(e) => set({ unloadType: e.target.value as typeof o.unloadType })}>
            <option>Live</option>
            <option>Drop and Hook</option>
          </NativeSelect>
        )}
      </Field>
      <Field label="Weight (lbs)">{(id) => <NumInput id={id} value={o.weight} onCommit={(weight) => set({ weight })} />}</Field>
      <Field label="Chassis">
        {(id) => (
          <NativeSelect
            id={id}
            value={o.chassisId ?? ""}
            onChange={(e) => {
              const item = chassis.data?.find((x) => x.id === Number(e.target.value));
              set({ chassisId: Number(e.target.value), chassisDays: item?.title === "Self Owned" ? 0 : Math.max(o.chassisDays, 1) });
            }}
          >
            {chassis.data?.map((x) => <option key={x.id} value={x.id}>{label(x)}</option>)}
          </NativeSelect>
        )}
      </Field>
      <Field label="Chassis days">
        {(id) => <NumInput key={o.chassisId} id={id} min={0} value={o.chassisDays} onCommit={(chassisDays) => set({ chassisDays })} />}
      </Field>
      <Field label="Commodities" className="sm:col-span-2">
        {(id) => <input id={id} className={inputClass} value={o.commodities} onChange={(e) => set({ commodities: e.target.value })} />}
      </Field>
      <label className="flex items-center gap-3 text-sm font-medium sm:col-span-2">
        <input type="checkbox" className="size-4 accent-[var(--brand)]" checked={o.hazmat} onChange={(e) => set({ hazmat: e.target.checked })} />
        Hazardous materials
      </label>
      {o.hazmat && (
        <>
          <Field label="Hazmat class">
            {(id) => (
              <NativeSelect id={id} value={o.hazmatClass ?? ""} disabled={hazmat.isLoading} onChange={(e) => set({ hazmatClass: Number(e.target.value), hazmatSubClass: undefined })}>
                <option value="" disabled>Select a class</option>
                {hazmat.data?.map((x) => <option key={x.id} value={x.id}>{label(x)}</option>)}
              </NativeSelect>
            )}
          </Field>
          {!!subClasses?.length && (
            <Field label="Sub-class">
              {(id) => (
                <NativeSelect id={id} value={o.hazmatSubClass ?? ""} onChange={(e) => set({ hazmatSubClass: Number(e.target.value) })}>
                  <option value="" disabled>Select a sub-class</option>
                  {subClasses.map((x) => <option key={x.id} value={x.id}>{label(x)}</option>)}
                </NativeSelect>
              )}
            </Field>
          )}
        </>
      )}
    </>
  );
}
