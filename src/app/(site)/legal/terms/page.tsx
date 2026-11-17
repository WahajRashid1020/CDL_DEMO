import type { Metadata } from "next";
import { LegalDoc, type Block } from "@/features/legal/legal-doc";
import terms from "@/content/legal/terms.json";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of the CDL1000 apps and services.",
};

export default function TermsPage() {
  return <LegalDoc title="Terms of Service" description="The terms that govern use of the CDL1000 apps and services." blocks={terms as Block[]} />;
}
