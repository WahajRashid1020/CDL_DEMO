"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/form/fields";
import { blogs } from "@/lib/api/services";
import { contactSchema, type ContactInput } from "@/lib/validation/forms";
import { useBlogsSubmit } from "./use-submit";

export function ContactForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { first_name: "", last_name: "", email: "", message: "" },
  });
  const { errors } = form.formState;
  const send = useBlogsSubmit((b: ContactInput) => blogs.contactUs(b));

  if (send.isSuccess) {
    return (
      <div className="grid place-items-center gap-3 rounded-2xl border bg-card p-10 text-center">
        <CircleCheckBig className="size-10 text-emerald-600" />
        <h2 className="text-2xl font-extrabold">Message sent</h2>
        <p className="text-muted-foreground">{send.data ?? "Thanks for reaching out — we'll get back to you shortly."}</p>
        <Button variant="outline" className="mt-2 rounded-full" onClick={() => (form.reset(), send.reset())}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((v) => send.mutate(v))} noValidate className="space-y-4 rounded-2xl border bg-card p-6 sm:p-8">
      {send.error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {send.error.message}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" error={errors.first_name?.message}>
          {(id) => <input id={id} autoComplete="given-name" aria-invalid={!!errors.first_name} className={inputClass} {...form.register("first_name")} />}
        </Field>
        <Field label="Last name" error={errors.last_name?.message}>
          {(id) => <input id={id} autoComplete="family-name" aria-invalid={!!errors.last_name} className={inputClass} {...form.register("last_name")} />}
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        {(id) => <input id={id} type="email" autoComplete="email" aria-invalid={!!errors.email} className={inputClass} {...form.register("email")} />}
      </Field>
      <Field label="How can we help?" error={errors.message?.message}>
        {(id) => (
          <textarea
            id={id}
            rows={5}
            aria-invalid={!!errors.message}
            className={`${inputClass} h-auto resize-y py-3`}
            placeholder="Tell us about your lanes, volumes or question…"
            {...form.register("message")}
          />
        )}
      </Field>
      <Button type="submit" size="lg" disabled={send.isPending} className="h-12 w-full rounded-xl text-base shadow-lg shadow-brand/25">
        {send.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Send message
      </Button>
    </form>
  );
}
