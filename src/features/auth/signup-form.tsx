"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { CircleCheckBig, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, inputClass, NativeSelect } from "@/components/form/fields";
import { US_STATES } from "@/config/us-states";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";
import { auth } from "@/lib/api/services";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";
import { formatPhone } from "@/features/quote/format";
import { splitMessage } from "@/features/quote/format";

type Key = keyof RegisterInput;
const FIELDS: { name: Key; label: string; placeholder?: string; autoComplete?: string; span?: boolean }[] = [
  { name: "first_name", label: "First name", autoComplete: "given-name" },
  { name: "last_name", label: "Last name", autoComplete: "family-name" },
  { name: "email", label: "Email", placeholder: "you@company.com", autoComplete: "email" },
  { name: "phone_number", label: "Phone", placeholder: "(312) 555 0123", autoComplete: "tel-national" },
  { name: "company_name", label: "Company name", autoComplete: "organization", span: true },
  { name: "address", label: "Street address", autoComplete: "street-address", span: true },
];

export function SignupForm() {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: Object.fromEntries(registerSchema.keyof().options.map((k) => [k, ""])) as RegisterInput,
  });
  const { errors } = form.formState;

  const register = useMutation({
    mutationFn: (v: RegisterInput) => auth.register(v),
    onError: (e) => {
      // Surface server-side field errors from /api/auth/register.
      const issues = e instanceof ApiError ? (e.data as { issues?: Partial<Record<Key, string[]>> })?.issues : undefined;
      for (const [k, msgs] of Object.entries(issues ?? {})) form.setError(k as Key, { message: msgs?.[0] });
    },
  });

  if (register.isSuccess) {
    const lines = splitMessage(register.data.message);
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600"
        >
          <CircleCheckBig className="size-8" />
        </motion.span>
        <h1 className="mt-5 text-2xl font-extrabold">{lines[0] ?? "Thanks for signing up!"}</h1>
        <p className="mt-2 text-muted-foreground">{lines.slice(1).join(" ") || "Our carrier team will review your details and get in touch."}</p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-brand hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((v) => register.mutate(v))} noValidate className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold">Join as a carrier</h1>
        <p className="mt-2 text-muted-foreground">Sign up for free, book the loads you want and get paid. Tell us about your company to get started.</p>
      </div>

      {register.error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {register.error.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <Field key={f.name} label={f.label} error={errors[f.name]?.message} className={f.span ? "sm:col-span-2" : undefined}>
            {(id) =>
              f.name === "phone_number" ? (
                <input
                  id={id}
                  type="tel"
                  inputMode="tel"
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  aria-invalid={!!errors[f.name]}
                  className={inputClass}
                  {...form.register(f.name, { onChange: (e) => form.setValue(f.name, formatPhone(e.target.value)) })}
                />
              ) : (
                <input
                  id={id}
                  type={f.name === "email" ? "email" : "text"}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  aria-invalid={!!errors[f.name]}
                  className={inputClass}
                  {...form.register(f.name)}
                />
              )
            }
          </Field>
        ))}

        <Field label="City" error={errors.city?.message}>
          {(id) => <input id={id} autoComplete="address-level2" aria-invalid={!!errors.city} className={inputClass} {...form.register("city")} />}
        </Field>
        <div className="grid grid-cols-[1fr_7rem] gap-3">
          <Field label="State" error={errors.state?.message}>
            {(id) => (
              <NativeSelect id={id} aria-invalid={!!errors.state} {...form.register("state")}>
                <option value="" disabled>
                  Select
                </option>
                {US_STATES.map(([code, name]) => (
                  <option key={code} value={name}>
                    {name}
                  </option>
                ))}
              </NativeSelect>
            )}
          </Field>
          <Field label="ZIP" error={errors.zip?.message}>
            {(id) => <input id={id} inputMode="numeric" autoComplete="postal-code" aria-invalid={!!errors.zip} className={inputClass} {...form.register("zip")} />}
          </Field>
        </div>

        <Field label="MC number" error={errors.mc_Number?.message}>
          {(id) => <input id={id} placeholder="MC-123456" aria-invalid={!!errors.mc_Number} className={inputClass} {...form.register("mc_Number")} />}
        </Field>
        <Field label="US DOT number" error={errors.us_Dot_No?.message}>
          {(id) => <input id={id} inputMode="numeric" placeholder="1234567" aria-invalid={!!errors.us_Dot_No} className={inputClass} {...form.register("us_Dot_No")} />}
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={register.isPending} className="h-12 w-full rounded-xl text-base shadow-lg shadow-brand/25">
        {register.isPending && <Loader2 className="size-4 animate-spin" />} Create carrier account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already with us?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
