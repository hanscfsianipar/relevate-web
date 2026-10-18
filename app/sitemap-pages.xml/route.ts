import { NextResponse } from "next/server";
import { fetchList } from "@/lib/sanity/client";
import { buildCanonicalSegment } from "@/lib/shortId";
import { siteConfig } from "@/lib/site-config";

const baseUrl = siteConfig.siteUrl;
const locales = ["id", "en"];

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function url(path: string, locale: string) {
  return `${baseUrl}/${locale}${path}`;
}

export async function GET() {
  const entries: string[] = [];

  // ── Static pages ─────────────────────────────────────────────────────────
  const staticPages = [
    "/",
    "/about",
    "/experience",
    "/services",
    "/services/seo-consulting",
    "/services/marketing-analytics",
    "/case-studies",
    "/insights",
    "/contact",
  ];

  const now = fmt(new Date());

  for (const locale of locales) {
    for (const path of staticPages) {
      entries.push(`  <url>\n    <loc>${url(path, locale)}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`);
    }
  }

  // ── Case Studies ──────────────────────────────────────────────────────────
  const caseStudies = await fetchList<
    { slug: string; shortId?: string; _updatedAt?: string }>(
    `*[_type == "caseStudy"] { "slug": slug.current, shortId, _updatedAt }`,
    {},
    { next: { revalidate: 3600 } },
  );

  for (const locale of locales) {
    for (const item of caseStudies) {
      const slug = item.shortId
        ? buildCanonicalSegment(item.shortId, item.slug)
        : item.slug;
      entries.push(
        `  <url>\n    <loc>${url(`/case-studies/${slug}`, locale)}</loc>\n    <lastmod>${item._updatedAt ? fmt(new Date(item._updatedAt)) : now}</lastmod>\n  </url>`,
      );
    }
  }

  // ── Experience Details ────────────────────────────────────────────────────
  const experiences = await fetchList<
    { slug: string; shortId?: string; _updatedAt?: string }>(
    `*[_type == "experience"] { "slug": slug.current, shortId, _updatedAt }`,
    {},
    { next: { revalidate: 3600 } },
  );

  for (const locale of locales) {
    for (const item of experiences) {
      const slug = item.shortId
        ? buildCanonicalSegment(item.shortId, item.slug)
        : item.slug;
      entries.push(
        `  <url>\n    <loc>${url(`/experience/${slug}`, locale)}</loc>\n    <lastmod>${item._updatedAt ? fmt(new Date(item._updatedAt)) : now}</lastmod>\n  </url>`,
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
