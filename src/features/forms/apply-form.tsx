"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig, FileText, Loader2, Send, Upload, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Field, inputClass, NativeSelect } from "@/components/form/fields";
import jobs from "@/content/jobs.json";
import { blogs } from "@/lib/api/services";
import { applySchema, MAX_RESUME_BYTES, type ApplyInput } from "@/lib/validation/forms";
import { useBlogsSubmit } from "./use-submit";

const POSITIONS = jobs.map((j) => j.title);

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export function ApplyForm() {
  const requested = useSearchParams().get("position") ?? "";
  const form = useForm<ApplyInput>({
    resolver: zodResolver(applySchema),
    defaultValues: { first_name: "", last_name: "", email: "", position: POSITIONS.includes(requested) ? requested : "", message: "", resume: "" },
  });
  const { errors } = form.formState;
  const send = useBlogsSubmit((b: ApplyInput) => blogs.applyNow(b));
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function pick(f?: File | null) {
    if (!f) return;
    if (f.type !== "application/pdf") return form.setError("resume", { message: "Please upload a PDF file" });
    if (f.size > MAX_RESUME_BYTES) return form.setError("resume", { message: "Résumé must be 5 MB or smaller" });
    setFile(f);
    form.setValue("resume", await toBase64(f), { shouldValidate: true });
  }

  function clearFile() {
    setFile(null);
    form.setValue("resume", "");
    if (input.current) input.current.value = "";
  }

  if (send.isSuccess) {
    return (
      <div className="grid place-items-center gap-3 rounded-2xl border bg-card p-10 text-center">
        <CircleCheckBig className="size-10 text-emerald-600" />
        <h2 className="text-2xl font-extrabold">Application received</h2>
        <p className="text-muted-foreground">{send.data ?? "Thanks for applying — our team will review your résumé and be in touch."}</p>
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
      <Field label="Position" error={errors.position?.message}>
        {(id) => (
          <NativeSelect id={id} aria-invalid={!!errors.position} {...form.register("position")}>
            <option value="" disabled>
              Choose a role
            </option>
            {POSITIONS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </NativeSelect>
        )}
      </Field>

      <div>
        <p className="mb-1.5 text-sm font-medium">Résumé (PDF, up to 5 MB)</p>
        {file ? (
          <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
            <FileText className="size-5 text-brand" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
            <button type="button" aria-label="Remove file" onClick={clearFile} className="text-muted-foreground hover:text-destructive">
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <label
            onDragOver={(e) => (e.preventDefault(), setDragging(true))}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pick(e.dataTransfer.files[0]);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition-colors",
              dragging ? "border-brand bg-brand-soft" : "hover:border-brand/50",
              errors.resume && "border-destructive",
            )}
          >
            <Upload className="size-6 text-brand" />
            <span className="font-medium">Click or drag your PDF here</span>
            <input ref={input} type="file" accept="application/pdf" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
        )}
        {errors.resume && <p className="mt-1 text-xs text-destructive">{errors.resume.message}</p>}
      </div>

      <Field label="Anything you'd like us to know? (optional)" error={errors.message?.message}>
        {(id) => <textarea id={id} rows={4} className={`${inputClass} h-auto resize-y py-3`} {...form.register("message")} />}
      </Field>

      <Button type="submit" size="lg" disabled={send.isPending} className="h-12 w-full rounded-xl text-base shadow-lg shadow-brand/25">
        {send.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Submit application
      </Button>
    </form>
  );
}
