import type { Metadata } from "next";
import { LegalDoc, type Block } from "@/features/legal/legal-doc";
import privacy from "@/content/legal/privacy.json";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CDL1000 collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return <LegalDoc title="Privacy Policy" description="How CDL1000 collects, uses and protects your information." blocks={privacy as Block[]} />;
}
