import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getAllInsights } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/client";
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
  const t = await getTranslations({ locale, namespace: "insights" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    ...getHreflangAlternates("/insights", locale),
  };
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "insights" });
  const posts = await getAllInsights();

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

        <StaggerChildren className="divide-y divide-border/60">
          {posts.map(({ slug, shortId, category, id, en, readTime, date, featureImage }) => {
            const content = locale === "en" ? en : id;
            const href = shortId ? buildCanonicalSegment(shortId, slug) : slug;
            return (
            <StaggerItem key={slug}>
            <Link
              href={{ pathname: '/insights/[slug]', params: { slug: href } }}
              className="group flex flex-col sm:flex-row sm:items-start gap-6 py-8"
            >
              <div className="sm:w-32 shrink-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  {category}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-bricolage text-lg font-bold group-hover:text-accent transition-colors mb-2 leading-snug">
                  {content.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {content.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {new Date(date).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>
                    {readTime} {t("minRead")}
                  </span>
                </div>
              </div>
              {featureImage && (
                <div className="relative w-full sm:w-40 h-28 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={urlFor(featureImage).width(320).height(224).fit("crop").url()}
                    alt={content.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              {!featureImage && (
                <div className="hidden sm:flex items-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0 self-center">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Link>
            </StaggerItem>
          )})}
        </StaggerChildren>
      </div>
    </section>
  );
}
