"use client";

import { Controller, type Control, type UseFormSetValue, type FieldErrors } from "react-hook-form";
import { Mail, Phone } from "lucide-react";
import { z } from "zod";
import { calculators } from "@/lib/api/services";
import { formatPhone, PHONE_RE } from "../format";
import { Field, inputClass } from "@/components/form/fields";

export const contactSchema = z.object({
  email: z.email("Enter a valid email"),
  phone: z.string().regex(PHONE_RE, "Enter a 10-digit phone number"),
});
export type ContactValues = z.infer<typeof contactSchema>;

/** Email + phone. Known customers get their phone filled in from `customer` on blur. */
export function ContactFields({
  control,
  errors,
  setValue,
}: {
  control: Control<ContactValues>;
  errors: FieldErrors<ContactValues>;
  setValue: UseFormSetValue<ContactValues>;
}) {
  async function lookup(email: string) {
    if (!contactSchema.shape.email.safeParse(email).success) return;
    try {
      const res = (await calculators.customer({ email })) as { data?: { phone?: string } };
      if (res.data?.phone) setValue("phone", formatPhone(res.data.phone), { shouldValidate: true });
    } catch {
      // Unknown customer — nothing to prefill.
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Email" error={errors.email?.message}>
        {(id) => (
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  {...field}
                  id={id}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  className={`${inputClass} pl-9`}
                  onBlur={(e) => (field.onBlur(), lookup(e.target.value))}
                />
              </div>
            )}
          />
        )}
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        {(id) => (
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  {...field}
                  id={id}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(312) 555 0123"
                  aria-invalid={!!errors.phone}
                  className={`${inputClass} pl-9`}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                />
              </div>
            )}
          />
        )}
      </Field>
    </div>
  );
}
