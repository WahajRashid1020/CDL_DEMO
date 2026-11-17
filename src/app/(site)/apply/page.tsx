import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/site/page-hero";
import { ApplyForm } from "@/features/forms/apply-form";

export const metadata: Metadata = {
  title: "Apply now",
  description: "Apply for a role at CDL1000.",
};

export default function ApplyPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Apply now" description="Tell us a little about yourself and attach your résumé. We read every application." />
      <section className="container-page max-w-3xl py-14">
        {/* ?position= is read on the client, so the form streams in. */}
        <Suspense fallback={<div className="h-[36rem] animate-pulse rounded-2xl bg-muted" />}>
          <ApplyForm />
        </Suspense>
      </section>
    </>
  );
}
