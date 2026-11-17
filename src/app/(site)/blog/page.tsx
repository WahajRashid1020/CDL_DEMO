import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { PageHero } from "@/components/site/page-hero";
import { getPosts } from "@/features/blog/api";
import { BlogUnavailable, PostCard } from "@/features/blog/post-card";

export const metadata: Metadata = {
  title: "Blog",
  description: "What's happening at CDL1000 — and our take on the challenges and opportunities in logistics today.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Ideas by the truckload"
        description="Discover what's happening at CDL1000 and our thoughts on the issues, challenges and opportunities within the industry today."
      />
      <section className="container-page py-14">
        <Suspense fallback={<GridSkeleton />}>
          <Posts />
        </Suspense>
      </section>
    </>
  );
}

async function Posts() {
  await connection(); // fetch at request time; failures aren't cached
  let posts;
  try {
    posts = await getPosts();
  } catch {
    return <BlogUnavailable />;
  }
  if (!posts.length) return <BlogUnavailable />;

  const [first, ...rest] = posts;
  return (
    <div className="space-y-6">
      <PostCard post={first} featured />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
