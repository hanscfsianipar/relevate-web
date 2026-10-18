import { NextResponse } from "next/server";
import { fetchList } from "@/lib/sanity/client";
import { buildCanonicalSegment } from "@/lib/shortId";
import { siteConfig } from "@/lib/site-config";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const baseUrl = siteConfig.siteUrl;

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const insights = await fetchList<
    { slug: string; shortId?: string; date?: string }>(
    `*[_type == "insight"] { "slug": slug.current, shortId, date }`,
    {},
    { next: { revalidate: 3600 } },
  );

  const entries: string[] = [];

  for (const locale of routing.locales) {
    for (const item of insights) {
      const slug = item.shortId
        ? buildCanonicalSegment(item.shortId, item.slug)
        : item.slug;
      const loc = `${baseUrl}${getPathname({
        locale,
        href: { pathname: "/insights/[slug]", params: { slug } },
      })}`;
      entries.push(
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${item.date ? fmt(new Date(item.date)) : fmt(new Date())}</lastmod>\n  </url>`,
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
