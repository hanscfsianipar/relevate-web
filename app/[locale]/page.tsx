import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSnapshot } from "@/components/sections/services-snapshot";
import { ExpertiseSection } from "@/components/sections/expertise-section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { CompanyLogoStrip } from "@/components/sections/company-logo-strip";
import { getHomePage } from "@/lib/sanity/queries";
import { siteConfig } from "@/lib/site-config";

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
  const t = await getTranslations({ locale, namespace: "home" });
  const sanity = await getHomePage();
  const c = sanity ? (locale === 'en' ? sanity.en : sanity.id) : null;
  const isEn = locale === 'en';
  const title = isEn
    ? (sanity?.seo?.metaTitleEn || `${siteConfig.brand} - ${siteConfig.tagline.en}`)
    : (sanity?.seo?.metaTitleId || `${siteConfig.brand} - ${siteConfig.tagline.id}`);
  const description = isEn
    ? (sanity?.seo?.metaDescEn || c?.heroSubheadline || t("heroSubheadline"))
    : (sanity?.seo?.metaDescId || c?.heroSubheadline || t("heroSubheadline"));
  const ogImageUrl = sanity?.seo?.ogImage?.asset?.url;
  return {
    title,
    description,
    robots: sanity?.seo?.noIndex ? 'noindex' : 'index, follow',
    ...getHreflangAlternates("/", locale),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const sanity = await getHomePage();
  const c = sanity ? (locale === 'en' ? sanity.en : sanity.id) : null;

  return (
    <>
      <HeroSection
        tagline={c?.heroTagline ?? t("heroTagline")}
        headline={c?.heroHeadline ?? t("heroHeadline")}
        subheadline={c?.heroSubheadline ?? t("heroSubheadline")}
        ctaPrimary={c?.ctaPrimary ?? t("ctaPrimary")}
        ctaSecondary={c?.ctaSecondary ?? t("ctaSecondary")}
      />
      <CompanyLogoStrip label={c?.previouslyAt ?? t("previouslyAt")} />
      <ServicesSnapshot
        title={c?.servicesTitle ?? t("servicesTitle")}
        services={c?.services ?? null}
        locale={locale}
      />
      <ExpertiseSection title={c?.expertiseTitle ?? t("expertiseTitle")} />
      <CtaBanner
        headline={c?.ctaBannerHeadline ?? t("ctaBannerHeadline")}
        cta={c?.ctaBannerCta ?? t("ctaBannerCta")}
        href="/contact"
      />
    </>
  );
}
