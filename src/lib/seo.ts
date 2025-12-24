export const siteUrl =
  (process.env.NEXT_PUBLIC_CLIENT_BASE_URL || process.env.NEXT_PUBLIC_SERVER_BASE_URL || "").replace(/\/$/, "") ||
  "https://artistry-gallery.com";

export const defaultKeywords = [
  "Artistry gallery",
  "online painting gallery",
  "buy original art",
  "modern art shop",
  "abstract paintings",
  "fine art",
  "wall art",
  "canvas art online",
  "luxury art"
];

export const defaultDescription =
  "Artistry is a modern online painting gallery featuring curated originals, luminous abstracts, and statement pieces for refined spaces.";
