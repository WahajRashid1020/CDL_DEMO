import type { NextConfig } from "next";

// Legacy URL redirects live in src/proxy.ts: next.config redirects match case-insensitively,
// so "/Truckload" → "/truckload" would loop forever.
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "storage.googleapis.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
