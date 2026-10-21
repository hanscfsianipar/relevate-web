import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import {
  ApproachSection,
  ClientMarquee,
  CtaBand,
  HomeHero,
  ServicesSection,
  WhySection,
} from "@/components/sections/home-sections";
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

  const cmsHeadline = c?.heroHeadline?.trim();

  const serviceTitles = [
    t("svc1Title"),
    t("svc2Title"),
    t("svc3Title"),
    t("svc4Title"),
  ];

  return (
    <>
      <HomeHero
        kicker={c?.heroTagline ?? t("heroKicker")}
        pre={cmsHeadline ?? t("heroHeadlinePre")}
        accent={cmsHeadline ? "" : t("heroHeadlineAccent")}
        post={cmsHeadline ? "" : t("heroHeadlinePost")}
        body={c?.heroSubheadline ?? t("heroSubheadline")}
        ctaPrimary={c?.ctaPrimary ?? t("ctaPrimary")}
        ctaSecondary={c?.ctaSecondary ?? t("ctaSecondary")}
        indexItems={serviceTitles}
      />

      <ClientMarquee title={t("clientsTitle")} />

      <WhySection
        kicker={t("whyKicker")}
        title={t("whyTitle")}
        lead={t("whyLead")}
        items={[
          { label: t("why1Title"), body: t("why1Body") },
          { label: t("why2Title"), body: t("why2Body") },
          { label: t("why3Title"), body: t("why3Body") },
          { label: t("why4Title"), body: t("why4Body") },
        ]}
      />

      <ServicesSection
        kicker={t("servicesKicker")}
        title={t("servicesTitle")}
        lead={t("servicesLead")}
        items={[
          { label: t("svc1Title"), body: t("svc1Body") },
          { label: t("svc2Title"), body: t("svc2Body") },
          { label: t("svc3Title"), body: t("svc3Body") },
          { label: t("svc4Title"), body: t("svc4Body") },
        ]}
      />

      <ApproachSection
        kicker={t("approachKicker")}
        title={t("approachTitle")}
        lead={t("approachLead")}
        steps={[
          { label: t("step1Title"), body: t("step1Body") },
          { label: t("step2Title"), body: t("step2Body") },
          { label: t("step3Title"), body: t("step3Body") },
          { label: t("step4Title"), body: t("step4Body") },
          { label: t("step5Title"), body: t("step5Body") },
        ]}
        noteTitle={t("approachNoteTitle")}
        noteBody={t("approachNoteBody")}
      />

      <CtaBand
        headline={c?.ctaBannerHeadline ?? t("ctaHeadline")}
        body={t("ctaBody")}
        button={t("ctaButton")}
      />
    </>
  );
}
