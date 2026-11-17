import type { Metadata } from "next";
import { Construction } from "lucide-react";
import { pages, type PageSlug } from "@/content/pages";
import { PageHero } from "./page-hero";

export function stubMetadata(slug: PageSlug): Metadata {
  const p = pages[slug];
  return { title: p.title, description: p.description };
}

/** Temporary page body until the real section is built. */
export function StubPage({ slug }: { slug: PageSlug }) {
  const p = pages[slug];
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} description={p.description} />
      <section className="container-page py-16">
        <div className="rounded-2xl border border-dashed p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Construction className="size-4 text-brand" /> Coming in the next build step
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {p.next.map((item) => (
              <li key={item} className="rounded-xl bg-muted/60 px-4 py-3 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
