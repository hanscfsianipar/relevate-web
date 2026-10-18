import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const baseUrl = siteConfig.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
