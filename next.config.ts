import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The whole site is static (no server rendering, no API routes), so
  // exporting to plain HTML/CSS/JS lets it deploy as static assets on
  // Cloudflare Workers/Pages instead of needing a Node/Workers runtime.
  output: "export",
  // Static export can't use Next's server-side Image Optimization API —
  // images are served as-is instead (still cached/compressed by
  // Cloudflare's CDN in front).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
