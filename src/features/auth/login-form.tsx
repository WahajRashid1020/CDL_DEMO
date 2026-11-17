"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/form/fields";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { safeNext, useLogin } from "./use-session";

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const login = useLogin();
  const [show, setShow] = useState(false);
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: () => {
        router.replace(next);
        router.refresh();
      },
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Log in to see your quotes and shipments.</p>
      </div>

      {login.error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {login.error.message}
        </p>
      )}

      <Field label="Email" error={errors.email?.message}>
        {(id) => (
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input id={id} type="email" autoComplete="email" aria-invalid={!!errors.email} className={`${inputClass} h-12 pl-9`} placeholder="you@company.com" {...form.register("email")} />
          </div>
        )}
      </Field>

      <Field label="Password" error={errors.password?.message}>
        {(id) => (
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id={id}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              className={`${inputClass} h-12 px-9`}
              placeholder="Your password"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        )}
      </Field>

      <Button type="submit" size="lg" disabled={login.isPending} className="h-12 w-full rounded-xl text-base shadow-lg shadow-brand/25">
        {login.isPending && <Loader2 className="size-4 animate-spin" />} Log in
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New carrier?{" "}
        <Link href="/sign-up" className="font-semibold text-brand hover:underline">
          Join the network
        </Link>
        {" · "}
        <Link href="/quote" className="font-semibold text-brand hover:underline">
          Get a quote without an account
        </Link>
      </p>
    </form>
  );
}
