import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getAllCaseStudies } from "@/lib/sanity/queries";
import { buildCanonicalSegment } from "@/lib/shortId";
import { StaggerChildren, StaggerItem } from "@/components/ui/animate";

export const revalidate = 3600

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "caseStudies" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    ...getHreflangAlternates("/case-studies", locale),
  };
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "caseStudies" });
  const caseStudies = await getAllCaseStudies();

  const ctaLabel = locale === "en" ? "Read case study" : "Baca studi kasus";

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            {t("title")}
          </p>
          <h1 className="font-bricolage text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {t("description")}
          </h1>
        </div>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map(({ slug, shortId, industry, service, heroMetric, id, en }) => {
            const content = locale === "en" ? en : id;
            const href = shortId ? buildCanonicalSegment(shortId, slug) : slug;
            return (
            <StaggerItem key={slug} className="h-full">
            <Link
              href={{ pathname: '/case-studies/[slug]', params: { slug: href } }}
              className="group block h-full"
            >
              <div className="h-full rounded-xl border border-border bg-card hover:border-foreground/20 transition-colors p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs border border-border rounded-full px-2.5 py-1 text-muted-foreground">
                    {industry}
                  </span>
                  <span className="text-xs border border-border rounded-full px-2.5 py-1 text-muted-foreground">
                    {service}
                  </span>
                </div>

                <div className="mb-6">
                  <span className="font-bricolage text-5xl font-bold text-accent">
                    {heroMetric}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {content.metricLabel}{" "}
                    {content.timeframe}
                  </p>
                </div>

                <h2 className="font-bricolage text-lg font-bold mb-3 leading-snug flex-1">
                  {content.title}
                </h2>

                {content.summary && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {content.summary}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
            </StaggerItem>
          )})}
        </StaggerChildren>
      </div>
    </section>
  );
}
