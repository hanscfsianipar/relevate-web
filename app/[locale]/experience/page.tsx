import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getAllExperiences } from "@/lib/sanity/queries";
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
  const t = await getTranslations({ locale, namespace: "experience" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    ...getHreflangAlternates("/experience", locale),
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "experience" });
  const experiences = await getAllExperiences();

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

        <StaggerChildren className="space-y-4">
          {experiences.map(({ slug, shortId, company, logo, role, periodStart, periodEnd, industry, id, en, tags, metric }) => {
            const logoUrl = logo ? urlFor(logo).height(56).url() : null;
            const highlight = locale === "en" ? en.highlight : id.highlight;
            const href = shortId ? buildCanonicalSegment(shortId, slug) : slug;

            return (
              <StaggerItem key={slug}>
              <Link
                href={{ pathname: '/experience/[slug]', params: { slug: href } }}
                className="group block"
              >
                <div className="rounded-xl border border-border bg-card hover:border-foreground/20 transition-all p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-bricolage text-lg font-semibold">{company}</h2>
                        <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                          {industry}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {role} · {periodStart} – {periodEnd ?? t("present")}
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {highlight}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {tags?.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {metric && (
                        <div className="mt-5 pt-4 border-t border-border flex items-baseline gap-2">
                          <span className="font-bricolage text-2xl font-bold text-accent">
                            {metric.value}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {locale === "en" ? metric.label.en : metric.label.id}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={company}
                          width={72}
                          height={28}
                          className="h-6 w-auto max-w-[90px] object-contain hidden sm:block grayscale opacity-50 mix-blend-multiply"
                        />
                      ) : null}
                      <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
