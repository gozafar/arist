export const siteUrl =
  (process.env.NEXT_PUBLIC_CLIENT_BASE_URL || process.env.NEXT_PUBLIC_SERVER_BASE_URL || "").replace(/\/$/, "") ||
  "https://rakhistudio.in";

export const defaultKeywords = [
  "Rakhi Vashisht",
  "Rakhi Studio",
  "Hong Kong artist",
  "acrylic paintings",
  "abstract art",
  "fine art",
  "original paintings",
  "commission artwork",
  "art gallery"
];

export const defaultDescription =
  "Rakhi Vashisht is a Hong Kong-based artist creating vibrant acrylic works inspired by global travels and cultural stories.";
