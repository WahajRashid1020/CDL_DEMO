import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/auth-shell";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to CDL1000 to manage your quotes and shipments.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="CDL1000"
      title="Freight that moves at the speed of a click."
      subtitle="Your quotes, bookings and payments — all in one place."
      points={["Instant truckload & drayage pricing", "Save on every load when you pay now", "Real people on call when you need them"]}
    >
      {/* useSearchParams (for ?next=) is request-time data, so it streams in. */}
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
