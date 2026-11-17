import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { cn } from "cn";
import { formatPostDate, type PostSummary } from "./api";

/**
 * Cover photos come from the CMS; when missing (or the old image bucket is unreachable)
 * the card falls back to a branded gradient. Plain <img> because hosts aren't known ahead of time.
 */
export function PostCard({ post, featured }: { post: PostSummary; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl",
        featured && "md:flex-row",
      )}
    >
      <div className={cn("relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand/25 via-brand-soft to-highlight/20", featured && "md:aspect-auto md:w-1/2")}>
        <Newspaper aria-hidden className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-brand/40" />
        {post.cover_photo && (
          // eslint-disable-next-line @next/next/no-img-element -- CMS host not known ahead of time
          <img src={post.cover_photo} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-5", featured && "md:justify-center md:p-8")}>
        {post.created_at && <p className="text-xs font-medium text-muted-foreground">{formatPostDate(post.created_at)}</p>}
        <h3 className={cn("mt-2 font-heading font-bold", featured ? "text-2xl" : "text-lg")}>{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand">
          Read more <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function BlogUnavailable() {
  return (
    <div className="grid place-items-center gap-2 rounded-2xl border border-dashed p-12 text-center">
      <Newspaper className="size-8 text-brand" />
      <p className="font-medium">Our stories are taking a short break</p>
      <p className="max-w-sm text-sm text-muted-foreground">We couldn&apos;t load the blog just now. Please check back in a few minutes.</p>
    </div>
  );
}
