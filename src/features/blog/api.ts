import "server-only";
import { cacheLife } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { callUpstream } from "@/lib/api/upstream";

export type PostSummary = {
  title: string;
  slug: string;
  excerpt?: string;
  cover_photo?: string;
  created_at?: string;
};
export type Post = PostSummary & { body?: string; author?: string; category?: string };

/** The blogs service wraps payloads as `{ status: "pass", data }`. Throws so failures are never cached. */
async function get<T>(path: string): Promise<T> {
  const { ok, data } = await callUpstream("blogs", path, { method: "GET" });
  const body = data as { status?: string; data?: T } | null;
  if (!ok || !body || (body.status !== undefined && body.status !== "pass")) throw new Error(`blogs/${path} unavailable`);
  return body.data as T;
}

export async function getPosts(): Promise<PostSummary[]> {
  "use cache";
  cacheLife("minutes");
  return (await get<PostSummary[]>("blogs")) ?? [];
}

export async function getRecentPosts(): Promise<PostSummary[]> {
  "use cache";
  cacheLife("minutes");
  return (await get<PostSummary[]>("recent_blog")) ?? [];
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("minutes");
  const post = await get<Post | null>(`blog/${encodeURIComponent(slug)}`);
  return post ? { ...post, body: post.body ? clean(post.body) : undefined } : null;
}

/** CMS HTML is rendered with dangerouslySetInnerHTML, so strip scripts, handlers and unknown tags first. */
function clean(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "figure", "figcaption", "h1", "h2", "iframe"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "loading"],
      iframe: ["src", "width", "height", "allowfullscreen", "title"],
      a: ["href", "name", "target", "rel"],
    },
    allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com", "fast.wistia.net"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });
}

export const formatPostDate = (d?: string) => {
  if (!d) return "";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};
