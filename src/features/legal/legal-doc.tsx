import { Fragment } from "react";
import { PageHero } from "@/components/site/page-hero";

/** Blocks generated from the old site's legal pages (see src/content/legal/README.md). */
export type Block = { t: "h2" | "h3" | "p" | "li"; parts: { text: string; bold?: boolean }[] };

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const text = (b: Block) => b.parts.map((p) => p.text).join("");

function Inline({ parts }: { parts: Block["parts"] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.bold ? <strong key={i}>{p.text}</strong> : <Fragment key={i}>{p.text}</Fragment>,
      )}
    </>
  );
}

/** Groups consecutive list items so they render as one <ul>. */
function group(blocks: Block[]) {
  const out: (Block | { t: "ul"; items: Block[] })[] = [];
  for (const b of blocks) {
    const last = out.at(-1);
    if (b.t === "li") {
      if (last && last.t === "ul") last.items.push(b);
      else out.push({ t: "ul", items: [b] });
    } else out.push(b);
  }
  return out;
}

export function LegalDoc({ title, description, blocks, updated }: { title: string; description: string; blocks: Block[]; updated?: string }) {
  // The first block repeats the page title on the old site.
  const body = text(blocks[0]) === title ? blocks.slice(1) : blocks;
  const toc = body.filter((b) => b.t === "h2").map((b) => ({ id: slug(text(b)), label: text(b) }));

  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={description} />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {toc.length > 2 && (
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
              <ol className="mt-3 space-y-1.5 border-l text-sm">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="-ml-px block border-l border-transparent pl-3 text-muted-foreground hover:border-brand hover:text-foreground">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}
        <div className="prose-cdl max-w-3xl">
          {updated && <p className="text-sm text-muted-foreground">Last updated: {updated}</p>}
          {group(body).map((b, i) => {
            if (b.t === "ul")
              return (
                <ul key={i}>
                  {b.items.map((li, j) => (
                    <li key={j}>
                      <Inline parts={li.parts} />
                    </li>
                  ))}
                </ul>
              );
            if (b.t === "h2")
              return (
                <h2 key={i} id={slug(text(b))} className="scroll-mt-24">
                  <Inline parts={b.parts} />
                </h2>
              );
            if (b.t === "h3")
              return (
                <h3 key={i}>
                  <Inline parts={b.parts} />
                </h3>
              );
            return (
              <p key={i}>
                <Inline parts={b.parts} />
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}
