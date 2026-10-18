import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { notFound, redirect } from "next/navigation";
import { Link, getPathname } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PortableText } from "@portabletext/react";
import {
  getExperienceBySlug,
  getExperienceByShortId,
  getAllExperiences,
  getAllExperienceSlugs,
} from "@/lib/sanity/queries";
import { extractShortId, buildCanonicalSegment } from "@/lib/shortId";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllExperienceSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

async function resolveExperience(slug: string) {
  const shortId = extractShortId(slug)
  if (shortId) {
    const ref = await getExperienceByShortId(shortId)
    if (!ref) return null
    const data = await getExperienceBySlug(ref.slug)
    if (!data) return null
    return { data, canonicalSlug: buildCanonicalSegment(ref.shortId, ref.slug) }
  }
  const data = await getExperienceBySlug(slug)
  if (!data) return null
  const canonicalSlug = data.shortId ? buildCanonicalSegment(data.shortId, data.slug) : data.slug
  return { data, canonicalSlug }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "experience" });
  const resolved = await resolveExperience(slug)
  const data = resolved?.data ?? null
  const canonicalSlug = resolved?.canonicalSlug ?? slug
  const isEn = locale === 'en';
  const defaultTitle = data ? `${data.company} - ${data.role} - ${t("title")}` : t("title");
  const title = isEn
    ? (data?.seo?.metaTitleEn || defaultTitle)
    : (data?.seo?.metaTitleId || defaultTitle);
  const defaultDesc = data ? `${data.role} at ${data.company}` : '';
  const description = isEn
    ? (data?.seo?.metaDescEn || defaultDesc)
    : (data?.seo?.metaDescId || defaultDesc);
  const ogImageUrl = data?.seo?.ogImage?.asset?.url;
  return {
    title,
    description,
    robots: data?.seo?.noIndex ? 'noindex' : 'index, follow',
    ...getHreflangAlternates({ pathname: '/experience/[slug]', params: { slug: canonicalSlug } }, locale),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "experience" });

  const [resolved, allExperiences] = await Promise.all([
    resolveExperience(slug),
    getAllExperiences(),
  ]);
  if (!resolved) notFound()
  const { data, canonicalSlug } = resolved
  if (slug !== canonicalSlug) {
    const path = getPathname({ locale, href: { pathname: '/experience/[slug]', params: { slug: canonicalSlug } } })
    redirect(path)
  }

  const content = locale === "en" ? data.en : data.id;
  const whatIDid = content?.whatIDid;
  const achievements = content?.achievements ?? [];

  const currentIndex = allExperiences.findIndex((e) => e.slug === data.slug);
  const prevExp = currentIndex > 0 ? allExperiences[currentIndex - 1] : null;
  const nextExp = currentIndex < allExperiences.length - 1 ? allExperiences[currentIndex + 1] : null;

  return (
    <article className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/experience"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main content */}
          <div className="lg:col-span-7 space-y-12">
            {/* Header */}
            <header>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2.5 py-1">
                  {data.industry}
                </span>
              </div>
              <h1 className="font-bricolage text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                {data.company}
              </h1>
              <p className="text-lg text-muted-foreground">
                {data.role} · {data.startDate ?? data.periodStart} – {data.endDate ?? data.periodEnd ?? t("present")}
              </p>
              {content?.companyContext && (
                <p className="mt-4 text-base text-foreground/70 leading-relaxed">
                  {content.companyContext}
                </p>
              )}
            </header>

            <Separator />

            {/* What I did */}
            {whatIDid && whatIDid.length > 0 && (
              <div>
                <h2 className="font-bricolage text-xl font-bold mb-4">
                  {t("whatIDid")}
                </h2>
                <div className="text-base text-foreground/80 leading-relaxed space-y-4 prose prose-neutral max-w-none">
                  <PortableText value={whatIDid as Parameters<typeof PortableText>[0]["value"]} />
                </div>
              </div>
            )}

            {/* Tools & Approach */}
            {(data.tools?.length > 0 || content?.approach) && (
              <div>
                <h2 className="font-bricolage text-xl font-bold mb-4">
                  {t("tools")}
                </h2>
                {content?.approach && (
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    &ldquo;{content.approach}&rdquo;
                  </p>
                )}
                {data.tools?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="font-normal">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Lessons learned */}
            {content?.lessons && (
              <div>
                <h2 className="font-bricolage text-xl font-bold mb-4">
                  {t("lessons")}
                </h2>
                <p className="text-base text-foreground/80 leading-relaxed border-l-2 border-accent pl-4">
                  {content.lessons}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: Achievements + Appraisal */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-10">
              {/* Achievements */}
              {achievements.length > 0 && (
                <div>
                  <h2 className="font-bricolage text-xl font-bold mb-6">
                    {t("achievements")}
                  </h2>
                  <div className="space-y-4">
                    {achievements.map(({ stat, label, context }) => (
                      <div
                        key={stat}
                        className="rounded-xl border border-border bg-card p-5"
                      >
                        <p className="font-bricolage text-3xl font-bold text-accent">
                          {stat}
                        </p>
                        <p className="text-sm font-semibold mt-1">{label}</p>
                        {context && <p className="text-xs text-muted-foreground mt-1">{context}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manager feedback */}
              {data.appraisal?.managerQuotes && data.appraisal.managerQuotes.length > 0 && (
                <div>
                  <h2 className="font-bricolage text-xl font-bold mb-1">
                    {locale === "en" ? "Manager Feedback" : "Feedback dari Manager"}
                  </h2>
                  <p className="text-xs text-muted-foreground mb-5">{data.appraisal.period}</p>
                  <div className="space-y-3">
                    {data.appraisal.managerQuotes.map((quote, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border bg-card p-5 border-l-[3px] border-l-accent"
                      >
                        <p className="text-sm text-foreground/80 italic leading-relaxed">
                          {locale === "en" ? quote.en : quote.id}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {locale === "en"
                            ? `Direct manager, ${data.appraisal?.period}`
                            : `Manager langsung, ${data.appraisal?.period}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prevExp || nextExp) && (
          <div className="mt-16 pt-8 border-t border-border grid grid-cols-2 gap-4">
            {prevExp ? (
              <Link
                href={{ pathname: '/experience/[slug]', params: { slug: prevExp.shortId ? buildCanonicalSegment(prevExp.shortId, prevExp.slug) : prevExp.slug } }}
                className="group flex flex-col gap-1 rounded-xl border border-border bg-card hover:border-foreground/20 transition-all p-5"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3 w-3" />
                  {locale === "en" ? "Previous" : "Sebelumnya"}
                </span>
                <span className="font-bricolage font-semibold text-sm mt-1 leading-snug">
                  {prevExp.company}
                </span>
                <span className="text-xs text-muted-foreground leading-snug">
                  {prevExp.role}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextExp ? (
              <Link
                href={{ pathname: '/experience/[slug]', params: { slug: nextExp.shortId ? buildCanonicalSegment(nextExp.shortId, nextExp.slug) : nextExp.slug } }}
                className="group flex flex-col gap-1 rounded-xl border border-border bg-card hover:border-foreground/20 transition-all p-5 items-end text-right"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {locale === "en" ? "Next" : "Berikutnya"}
                  <ArrowRight className="h-3 w-3" />
                </span>
                <span className="font-bricolage font-semibold text-sm mt-1 leading-snug">
                  {nextExp.company}
                </span>
                <span className="text-xs text-muted-foreground leading-snug">
                  {nextExp.role}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </article>
  );
}
