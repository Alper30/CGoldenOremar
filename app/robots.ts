import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Oturuma bağlı / kişiye özel alanlar dizine girmesin.
      disallow: [
        "/admin",
        "/satici-panel",
        "/hesabim",
        "/dashboard",
        "/odeme",
        "/favoriler",
        "/api/",
        "/auth/",
        "/siparis/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
