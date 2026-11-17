import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { CtaBand } from "@/components/marketing/sections";
import { formatPostDate, getPost, type Post } from "@/features/blog/api";
import { BlogUnavailable } from "@/features/blog/post-card";

export async function generateMetadata({ params }: PageProps<"/blog/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPost(id);
    if (post) return { title: post.title, description: post.excerpt, openGraph: post.cover_photo ? { images: [post.cover_photo] } : undefined };
  } catch {
    // Fall through to a generic title when the service is down.
  }
  return { title: "Blog" };
}

export default function BlogPostPage({ params }: PageProps<"/blog/[id]">) {
  return (
    <article className="container-page max-w-3xl py-12 sm:py-16">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All posts
      </Link>
      <Suspense fallback={<PostSkeleton />}>
        <PostBody params={params} />
      </Suspense>
    </article>
  );
}

async function PostBody({ params }: { params: PageProps<"/blog/[id]">["params"] }) {
  await connection();
  const { id } = await params;
  let post: Post | null;
  try {
    post = await getPost(id);
  } catch {
    return (
      <div className="mt-8">
        <BlogUnavailable />
      </div>
    );
  }
  if (!post) notFound();

  return (
    <>
      <header className="mt-6">
        {post.category && <p className="text-sm font-semibold uppercase tracking-widest text-brand">{post.category}</p>}
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {[post.author, formatPostDate(post.created_at)].filter(Boolean).join(" · ")}
        </p>
      </header>
      {post.cover_photo && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS host not known ahead of time
        <img src={post.cover_photo} alt="" className="mt-8 aspect-[16/9] w-full rounded-2xl border object-cover" />
      )}
      {/* Sanitised on the server in getPost() */}
      <div className="prose-cdl mt-10" dangerouslySetInnerHTML={{ __html: post.body ?? "" }} />
      <div className="mt-16 -mx-4 sm:-mx-6 lg:-mx-8">
        <CtaBand />
      </div>
    </>
  );
}

function PostSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      <div className="h-12 w-3/4 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-8 aspect-[16/9] animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
