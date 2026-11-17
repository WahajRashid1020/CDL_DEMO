import { Suspense } from "react";
import { PageHero } from "@/components/site/page-hero";

export default function BlogPostPage({ params }: PageProps<"/blog/[id]">) {
  return (
    <Suspense fallback={<PageHero eyebrow="Blog" title="Loading…" />}>
      <BlogPost params={params} />
    </Suspense>
  );
}

// Placeholder: will fetch blogs/blog/:id server-side once the blogs test service is reachable.
async function BlogPost({ params }: { params: PageProps<"/blog/[id]">["params"] }) {
  const { id } = await params;
  return <PageHero eyebrow="Blog" title={`Post ${id}`} description="Article content will load from the blogs service." />;
}
