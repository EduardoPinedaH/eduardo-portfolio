// Public Cloudflare R2 bucket serving every video asset on the site.
// Kept in one place so pointing this at a custom domain later (or
// swapping hosts entirely) is a one-line change instead of a find-and-replace.
export const VIDEO_BASE = "https://pub-8dde9ff5e3704b04bee6f7939cc65ce6.r2.dev";
