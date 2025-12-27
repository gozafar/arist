import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Robots rules allowing public pages and blocking admin/auth-only paths.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/paintings", "/paintings/*", "/services", "/contact", "/blog"],
      disallow: ["/admin", "/admin/*", "/api", "/api/*", "/checkout", "/payment"]
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
