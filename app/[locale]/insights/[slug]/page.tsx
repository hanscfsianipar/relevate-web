import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { notFound, redirect } from "next/navigation";
import { Link, getPathname } from "@/i18n/navigation";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { getInsightBySlug, getInsightByShortId, getAllInsightSlugs } from "@/lib/sanity/queries";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { urlFor } from "@/lib/sanity/client";
import { extractShortId, buildCanonicalSegment } from "@/lib/shortId";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllInsightSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

async function resolveInsight(slug: string) {
  const shortId = extractShortId(slug)
  if (shortId) {
    const ref = await getInsightByShortId(shortId)
    if (!ref) return null
    const post = await getInsightBySlug(ref.slug)
    if (!post) return null
    return { post, canonicalSlug: buildCanonicalSegment(ref.shortId, ref.slug) }
  }
  const post = await getInsightBySlug(slug)
  if (!post) return null
  const canonicalSlug = post.shortId ? buildCanonicalSegment(post.shortId, post.slug) : post.slug
  return { post, canonicalSlug }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const resolved = await resolveInsight(slug)
  if (!resolved) return {};
  const { post, canonicalSlug } = resolved
  const isEn = locale === 'en';
  const content = isEn ? post.en : post.id;
  const title = isEn
    ? (post.seo?.metaTitleEn || content.title)
    : (post.seo?.metaTitleId || content.title);
  const description = isEn
    ? (post.seo?.metaDescEn || content.excerpt)
    : (post.seo?.metaDescId || content.excerpt);
  const ogImageUrl = post.seo?.ogImage?.asset?.url;
  return {
    title,
    description,
    robots: post.seo?.noIndex ? 'noindex' : 'index, follow',
    ...getHreflangAlternates({ pathname: '/insights/[slug]', params: { slug: canonicalSlug } }, locale),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const resolved = await resolveInsight(slug)
  if (!resolved) notFound()
  const { post, canonicalSlug } = resolved
  if (slug !== canonicalSlug) {
    const path = getPathname({ locale, href: { pathname: '/insights/[slug]', params: { slug: canonicalSlug } } })
    redirect(path)
  }

  const content = locale === "en" ? post.en : post.id;
  const title = content.title;
  const excerpt = content.excerpt;
  const body = content.body;
  const authorBio = content.authorBio;
  const t = await getTranslations({ locale, namespace: "insights" });

  const ctaBanner = {
    id: { headline: "Butuh bantuan menerapkan ini untuk bisnis Anda?", cta: "Hubungi Saya" },
    en: { headline: "Need help applying this to your business?", cta: "Get in Touch" },
  };
  const banner = locale === "en" ? ctaBanner.en : ctaBanner.id;

  return (
    <>
      <ReadingProgress />
      <article className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("title")}
            </Link>

            <header className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                {post.category}
              </p>
              <h1 className="font-bricolage text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
                {title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Hans</span>
                <span>·</span>
                <span>
                  {new Date(post.date).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>·</span>
                <span>{post.readTime} {t("minRead")}</span>
              </div>
            </header>

            {post.featureImage && (
              <div className="mb-10 rounded-xl overflow-hidden aspect-video relative">
                <Image
                  src={urlFor(post.featureImage).width(1200).height(675).fit("crop").url()}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {body && (
              <div className="text-base leading-relaxed space-y-5 text-foreground/80">
                <PortableText
                  value={body as Parameters<typeof PortableText>[0]["value"]}
                  components={{
                    block: {
                      normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
                      h2: ({ children }) => <h2 className="font-bricolage text-xl font-bold tracking-tight text-foreground mt-12 mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="font-bricolage text-lg font-bold tracking-tight text-foreground mt-10 mb-2">{children}</h3>,
                      h4: ({ children }) => <h4 className="font-bricolage text-base font-bold tracking-tight text-foreground mt-8 mb-2">{children}</h4>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-accent pl-4 italic text-foreground/60 my-6">{children}</blockquote>,
                    },
                    marks: {
                      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                      em: ({ children }) => <em>{children}</em>,
                      link: ({ value, children }) => (
                        <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:opacity-80">
                          {children}
                        </a>
                      ),
                    },
                    list: {
                      bullet: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                      number: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
                    },
                    listItem: {
                      bullet: ({ children }) => <li>{children}</li>,
                      number: ({ children }) => <li>{children}</li>,
                    },
                    types: {
                      image: ({ value }: { value: { asset?: { _ref?: string }; alt?: string } }) =>
                        value?.asset?._ref ? (
                          <figure className="my-8 mx-auto max-w-3xl">
                            <div className="relative w-full overflow-hidden rounded-lg aspect-video">
                              <Image
                                src={urlFor(value).width(800).auto("format").url()}
                                alt={value.alt || ""}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 800px"
                              />
                            </div>
                            {value.alt && (
                              <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                                {value.alt}
                              </figcaption>
                            )}
                          </figure>
                        ) : null,
                      table: ({ value }: { value: { rows: { cells: string[] }[] } }) => (
                        <div className="overflow-x-auto my-6">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr>
                                {value.rows[0]?.cells.map((cell: string, i: number) => (
                                  <th key={i} className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground">
                                    {cell}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {value.rows.slice(1).map((row: { cells: string[] }, i: number) => (
                                <tr key={i} className="even:bg-muted/40">
                                  {row.cells.map((cell: string, j: number) => (
                                    <td key={j} className="border border-border px-4 py-2 text-foreground/80">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ),
                    },
                  }}
                />
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-border/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-accent">H</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Hans</p>
                  {authorBio && (
                    <p className="text-sm text-muted-foreground mt-1">{authorBio}</p>
                  )}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline mt-2"
                  >
                    {locale === "en" ? "Work together" : "Bekerja sama"}
                    <span>&#8594;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <CtaBanner
        headline={banner.headline}
        cta={banner.cta}
        href="/contact"
      />
    </>
  );
}
