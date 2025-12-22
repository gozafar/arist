import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { dbConnect } from "@/lib/db";
import Painting from "@/models/Painting";

// Dynamic sitemap including key static pages and published paintings from MongoDB.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/about",
    "/paintings",
    "/services",
    "/contact"
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  await dbConnect();
  const paintings = await Painting.find({}, { _id: 1, updatedAt: 1 }).lean();

  const paintingEntries =
    Array.isArray(paintings) && paintings.length
      ? paintings.map((p) => {
          const id = typeof p._id === "string" ? p._id : p._id?.toString?.();
          return {
            url: `${siteUrl}/paintings/${id}`,
            lastModified: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : new Date().toISOString(),
            changeFrequency: "weekly" as const,
            priority: 0.7
          };
        })
      : [];

  return [...staticPages, ...paintingEntries];
}
