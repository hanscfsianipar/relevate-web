import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { notFound, redirect } from "next/navigation";
import { Link, getPathname } from "@/i18n/navigation";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { getCaseStudyBySlug, getCaseStudyByShortId, getAllCaseStudySlugs } from "@/lib/sanity/queries";
import { extractShortId, buildCanonicalSegment } from "@/lib/shortId";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

async function resolveCaseStudy(slug: string) {
  const shortId = extractShortId(slug)
  if (shortId) {
    const ref = await getCaseStudyByShortId(shortId)
    if (!ref) return null
    const entry = await getCaseStudyBySlug(ref.slug)
    if (!entry) return null
    return { entry, canonicalSlug: buildCanonicalSegment(ref.shortId, ref.slug) }
  }
  const entry = await getCaseStudyBySlug(slug)
  if (!entry) return null
  const canonicalSlug = entry.shortId ? buildCanonicalSegment(entry.shortId, entry.slug) : entry.slug
  return { entry, canonicalSlug }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const resolved = await resolveCaseStudy(slug)
  if (!resolved) return {};
  const { entry, canonicalSlug } = resolved
  const isEn = locale === 'en';
  const content = isEn ? entry.en : entry.id;
  const defaultTitle = content.title;
  const defaultDesc = `${entry.heroMetric} ${content.metricLabel}: ${content.title}`;
  const title = isEn
    ? (entry.seo?.metaTitleEn || defaultTitle)
    : (entry.seo?.metaTitleId || defaultTitle);
  const description = isEn
    ? (entry.seo?.metaDescEn || defaultDesc)
    : (entry.seo?.metaDescId || defaultDesc);
  const ogImageUrl = entry.seo?.ogImage?.asset?.url;
  return {
    title,
    description,
    robots: entry.seo?.noIndex ? 'noindex' : 'index, follow',
    ...getHreflangAlternates({ pathname: '/case-studies/[slug]', params: { slug: canonicalSlug } }, locale),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const resolved = await resolveCaseStudy(slug)
  if (!resolved) notFound()
  const { entry, canonicalSlug } = resolved
  if (slug !== canonicalSlug) {
    const path = getPathname({ locale, href: { pathname: '/case-studies/[slug]', params: { slug: canonicalSlug } } })
    redirect(path)
  }

  const t = await getTranslations({ locale, namespace: "caseStudies" });

  const content = locale === "en" ? entry.en : entry.id;
  const cs = {
    title: content.title,
    heroMetric: entry.heroMetric,
    metricLabel: content.metricLabel,
    timeframe: content.timeframe,
    metrics: entry.metrics,
    challenge: content.challenge,
    approach: content.approach,
    results: content.results,
    testimonial: entry.testimonial,
  };

  const ctaBanner = {
    id: { headline: "Ingin hasil serupa untuk bisnis Anda?", cta: "Diskusikan Proyek Anda" },
    en: { headline: "Want similar results for your business?", cta: "Discuss Your Project" },
  };
  const banner = locale === "en" ? ctaBanner.en : ctaBanner.id;

  return (
    <>
      <article className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("title")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-12">
              <header>
                <div className="flex items-center gap-2 mb-4">
                  {[entry.industry, entry.service].map((tag) => (
                    <span key={tag} className="text-xs border border-border rounded-full px-2.5 py-1 text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mb-4">
                  <span className="font-bricolage text-6xl font-bold text-accent">
                    {cs.heroMetric}
                  </span>
                  <p className="text-base text-muted-foreground mt-1">
                    {cs.metricLabel} {cs.timeframe}
                  </p>
                </div>
                <h1 className="font-bricolage text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                  {cs.title}
                </h1>
              </header>

              <Separator />

              {cs.challenge && (
                <div>
                  <h2 className="font-bricolage text-xl font-bold mb-4">{t("challenge")}</h2>
                  <div className="text-base text-foreground/80 leading-relaxed space-y-4 whitespace-pre-line">
                    {cs.challenge}
                  </div>
                </div>
              )}

              {cs.approach && (
                <div>
                  <h2 className="font-bricolage text-xl font-bold mb-4">{t("approach")}</h2>
                  <div className="text-base text-foreground/80 leading-relaxed space-y-4 whitespace-pre-line">
                    {cs.approach}
                  </div>
                </div>
              )}

              {cs.results && (
                <div>
                  <h2 className="font-bricolage text-xl font-bold mb-4">{t("results")}</h2>
                  <div className="text-base text-foreground/80 leading-relaxed space-y-4 whitespace-pre-line">
                    {cs.results}
                  </div>
                </div>
              )}

              {cs.testimonial && (
                <blockquote className="border-l-2 border-accent pl-6 space-y-2">
                  <p className="text-lg font-medium text-foreground/90 leading-relaxed italic">
                    &ldquo;{cs.testimonial.quote}&rdquo;
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    {cs.testimonial.author}, {cs.testimonial.authorTitle}
                  </footer>
                </blockquote>
              )}
            </div>

            {/* Sidebar metrics */}
            {cs.metrics && cs.metrics.length > 0 && (
              <div className="lg:col-span-5">
                <div className="sticky top-24 space-y-4">
                  {cs.metrics.map(({ stat, label, context }) => (
                    <div key={stat} className="rounded-xl border border-border bg-card p-5">
                      <p className="font-bricolage text-3xl font-bold text-accent">{stat}</p>
                      <p className="text-sm font-semibold mt-1">{label}</p>
                      {context && <p className="text-xs text-muted-foreground mt-1">{context}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
