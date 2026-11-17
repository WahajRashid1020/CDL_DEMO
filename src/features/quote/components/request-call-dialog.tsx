"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { calculators } from "@/lib/api/services";
import { CALC_TYPE } from "../body";
import { formatPhone, PHONE_RE, splitMessage } from "../format";
import { useQuote } from "../store";
import { Field, inputClass } from "@/components/form/fields";

/** Shown when a lane can't be priced online — collects a call-back request. */
export function RequestCallDialog({
  open,
  onOpenChange,
  reason,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: string;
}) {
  const { contact, mode } = useQuote();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);

  const send = useMutation({
    mutationFn: () => calculators.requestCall({ name, email, phone, calculator_type: CALC_TYPE[mode] }),
    onSuccess: (res) => {
      const lines = splitMessage((res as { message?: string }).message);
      toast.success(lines[0] ?? "Thanks! We'll call you shortly.", { description: lines.slice(1).join(" ") });
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const valid = name.trim() && /\S+@\S+\.\S+/.test(email) && PHONE_RE.test(phone);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <span className="mb-2 grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
            <PhoneCall className="size-5" />
          </span>
          <DialogTitle>Let&apos;s price this one together</DialogTitle>
          <DialogDescription>
            {reason || "We can't price this lane online yet."} Leave your details and a freight specialist will call you.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) send.mutate();
          }}
        >
          <Field label="Name">{(id) => <input id={id} className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}</Field>
          <Field label="Email">{(id) => <input id={id} type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />}</Field>
          <Field label="Phone">
            {(id) => <input id={id} type="tel" className={inputClass} value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="(312) 555 0123" />}
          </Field>
          <Button type="submit" size="lg" className="h-11 w-full rounded-xl" disabled={!valid || send.isPending}>
            {send.isPending ? "Sending…" : "Request a call"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
