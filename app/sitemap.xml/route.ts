import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

const baseUrl = siteConfig.siteUrl;

export async function GET() {
  const pages = [
    { url: `${baseUrl}/sitemap-pages.xml`, lastmod: new Date().toISOString() },
    { url: `${baseUrl}/sitemap-posts.xml`, lastmod: new Date().toISOString() },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <sitemap>\n    <loc>${p.url}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
