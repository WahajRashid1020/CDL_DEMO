import type { Metadata } from "next";
import { LegalDoc, type Block } from "@/features/legal/legal-doc";
import ethics from "@/content/legal/ethics.json";

export const metadata: Metadata = {
  title: "Code of Ethics",
  description: "The standards CDL1000 holds itself to — equality, respect, transparency, integrity and more.",
};

const blocks = ethics as Block[];
const headings = new Set(blocks.filter((b) => b.t === "h2").map((b) => b.parts.map((p) => p.text).join("")));
// The old page opened with a numbered list of the section titles; the table of contents replaces it.
const body = blocks.filter((b, i) => i > 0 && !(b.t === "p" && headings.has(b.parts.map((p) => p.text).join(""))));

export default function EthicsPage() {
  return <LegalDoc title="Code of Ethics" description="The standards we hold ourselves to, every day." blocks={body} />;
}
