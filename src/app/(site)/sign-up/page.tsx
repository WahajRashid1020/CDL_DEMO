import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/auth-shell";
import { SignupForm } from "@/features/auth/signup-form";

export const metadata: Metadata = {
  title: "Carrier sign-up",
  description: "Join the CDL1000 carrier network with your MC and US DOT numbers.",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="For carriers"
      title="The power is in your hands."
      subtitle="Pick loads that fit your lanes and get paid fast — without the paperwork chase."
      points={["Free to join — no subscription", "Fast, hassle-free payments", "Loads from shippers across the US"]}
    >
      <SignupForm />
    </AuthShell>
  );
}
