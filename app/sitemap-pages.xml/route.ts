import { NextResponse } from "next/server";
import { fetchList } from "@/lib/sanity/client";
import { buildCanonicalSegment } from "@/lib/shortId";
import { siteConfig } from "@/lib/site-config";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const baseUrl = siteConfig.siteUrl;

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Bangun URL sitemap lewat i18n routing, supaya locale non-default
 * memakai path yang benar (/id/tentang, bukan /id/about yang redirect).
 */
function pageUrl(href: Href, locale: Locale) {
  return `${baseUrl}${getPathname({ locale, href })}`;
}

export async function GET() {
  const entries: string[] = [];

  // ── Static pages ─────────────────────────────────────────────────────────
  const staticPages: Href[] = [
    "/",
    "/about",
    "/experience",
    "/services",
    { pathname: "/services/[slug]", params: { slug: "seo-consulting" } },
    { pathname: "/services/[slug]", params: { slug: "marketing-analytics" } },
    "/case-studies",
    "/insights",
    "/contact",
    "/speaking",
  ];

  const now = fmt(new Date());

  for (const locale of routing.locales) {
    for (const href of staticPages) {
      entries.push(`  <url>\n    <loc>${pageUrl(href, locale)}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`);
    }
  }

  // ── Case Studies ──────────────────────────────────────────────────────────
  const caseStudies = await fetchList<
    { slug: string; shortId?: string; _updatedAt?: string }>(
    `*[_type == "caseStudy"] { "slug": slug.current, shortId, _updatedAt }`,
    {},
    { next: { revalidate: 3600 } },
  );

  for (const locale of routing.locales) {
    for (const item of caseStudies) {
      const slug = item.shortId
        ? buildCanonicalSegment(item.shortId, item.slug)
        : item.slug;
      entries.push(
        `  <url>\n    <loc>${pageUrl({ pathname: "/case-studies/[slug]", params: { slug } }, locale)}</loc>\n    <lastmod>${item._updatedAt ? fmt(new Date(item._updatedAt)) : now}</lastmod>\n  </url>`,
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

  for (const locale of routing.locales) {
    for (const item of experiences) {
      const slug = item.shortId
        ? buildCanonicalSegment(item.shortId, item.slug)
        : item.slug;
      entries.push(
        `  <url>\n    <loc>${pageUrl({ pathname: "/experience/[slug]", params: { slug } }, locale)}</loc>\n    <lastmod>${item._updatedAt ? fmt(new Date(item._updatedAt)) : now}</lastmod>\n  </url>`,
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
