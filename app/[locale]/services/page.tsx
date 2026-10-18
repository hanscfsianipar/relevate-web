import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Search, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { getAllServicePages, getServicesPage } from "@/lib/sanity/queries";

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
  const t = await getTranslations({ locale, namespace: "services" });
  const sanityData = await getServicesPage();
  const isEn = locale === 'en';
  const title = isEn
    ? (sanityData?.seo?.metaTitleEn || t("title"))
    : (sanityData?.seo?.metaTitleId || t("title"));
  const description = isEn
    ? (sanityData?.seo?.metaDescEn || t("metaDescription"))
    : (sanityData?.seo?.metaDescId || t("metaDescription"));
  const ogImageUrl = sanityData?.seo?.ogImage?.asset?.url;
  return {
    title,
    description,
    robots: sanityData?.seo?.noIndex ? 'noindex' : 'index, follow',
    ...getHreflangAlternates("/services", locale),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}

// Icon map: slug -> icon component (hardcoded since icons aren't in CMS)
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "seo-consulting": Search,
  "marketing-analytics": BarChart3,
}

const copy = {
  id: {
    services: [
      {
        slug: "seo-consulting",
        title: "SEO Consulting",
        tagline: "Bukan soal traffic semata. Tapi traffic yang punya intent.",
        description:
          "Sebelum ada solusi, harus ada diagnosis. Saya cari root cause-nya dulu, bukan langsung loncat ke taktik.",
        outcomes: [
          "Technical audit: canonical conflict, rendering issue, indexability",
          "YMYL compliance untuk fintech, health, dan legal platform",
          "Keyword strategy dari real search intent, bukan sekadar volume",
          "Content yang kerja sebagai conversion funnel, bukan cuma traffic",
        ],
      },
      {
        slug: "marketing-analytics",
        title: "Marketing Analytics",
        tagline: "Banyak metrik yang kamu pantau tidak menjawab pertanyaan bisnis yang sesungguhnya.",
        description:
          "Saya bantu kamu bedakan mana real signal, mana noise. Dari tracking setup yang akurat sampai attribution model yang jujur, supaya keputusan besar tidak lagi berbasis tebakan.",
        outcomes: [
          "GA4 implementation & audit: pastikan data yang masuk bisa dipercaya",
          "Google Tag Manager setup & governance",
          "Custom dashboard di Looker Studio yang menjawab pertanyaan bisnis nyata",
          "Attribution modeling: channel mana yang benar-benar convert",
          "BigQuery integration untuk analisis yang lebih dalam",
        ],
      },
    ],
    process: [
      { step: "01", title: "Discovery", desc: "Kita mulai dengan pertanyaan yang tepat, bukan langsung ke solusi. Saya perlu paham konteks bisnis, bukan cuma gejalanya." },
      { step: "02", title: "Audit & Diagnosis", desc: "Saya cari root cause-nya, bukan cuma surface problem. Apa yang benar-benar terjadi vs. apa yang terlihat terjadi." },
      { step: "03", title: "Strategy & Model", desc: "Rencana yang bisa dijelaskan logikanya: variabel apa yang diubah, hipotesisnya apa, dan bagaimana cara ukur hasilnya." },
      { step: "04", title: "Execute & Learn", desc: "Eksekusi dengan tracking ketat. Setiap aksi adalah eksperimen. Hasilnya yang menentukan langkah berikutnya." },
    ],
    processHeading: "Bagaimana Kita Bekerja Sama",
    learnMore: "Pelajari lebih lanjut",
    ctaBannerHeadline: "Ada proyek yang ingin kamu diskusikan?",
  },
  en: {
    services: [
      {
        slug: "seo-consulting",
        title: "SEO Consulting",
        tagline: "Not just traffic. Traffic that actually converts.",
        description:
          "Before any solution, there has to be a diagnosis. I find the root cause first, not just jump straight to tactics.",
        outcomes: [
          "Technical audit: canonical conflicts, rendering issues, indexability",
          "YMYL compliance for fintech, health, and legal platforms",
          "Keyword strategy from real search intent, not just volume",
          "Content that works as a conversion funnel, not just a traffic driver",
        ],
      },
      {
        slug: "marketing-analytics",
        title: "Marketing Analytics",
        tagline: "Many metrics you track may be misleading",
        description:
          "I help you identify what's real signal and what's noise. From accurate tracking setup to honest attribution modeling, so big decisions aren't based on guesswork.",
        outcomes: [
          "GA4 implementation & audit: ensure incoming data is trustworthy",
          "Google Tag Manager setup & governance",
          "Custom Looker Studio dashboards that answer business questions",
          "Attribution modeling: which channels actually convert",
          "BigQuery integration for deeper analysis",
        ],
      },
    ],
    process: [
      { step: "01", title: "Discovery", desc: "We start with the right questions, not solutions. I need to understand the business context, not just the symptoms." },
      { step: "02", title: "Audit & Diagnosis", desc: "I look for the root cause, not just the surface problem. What's actually happening vs. what appears to be happening." },
      { step: "03", title: "Strategy & Model", desc: "A plan whose logic can be explained: which variables to change, with what hypothesis, and how to measure results." },
      { step: "04", title: "Execute & Learn", desc: "Execute with tight tracking. Every action is an experiment. The results tell us what to do next." },
    ],
    processHeading: "How We Work Together",
    learnMore: "Learn more",
    ctaBannerHeadline: "Have a project you'd like to discuss?",
  },
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  const [sanityServices, sanityPageContent] = await Promise.all([
    getAllServicePages(),
    getServicesPage(),
  ]);

  const hardcoded = locale === "en" ? copy.en : copy.id;

  // Build services array: prefer Sanity data, fall back to hardcoded
  const services = sanityServices.length > 0
    ? sanityServices.map((s) => {
        const loc = locale === "en" ? s.en : s.id
        return {
          slug: s.slug,
          title: s.title,
          tagline: loc.tagline,
          description: loc.description,
          outcomes: loc.outcomes,
        }
      })
    : hardcoded.services

  // Build page-level content: prefer Sanity, fall back to hardcoded
  const pageLoc = sanityPageContent
    ? (locale === "en" ? sanityPageContent.en : sanityPageContent.id)
    : hardcoded

  const processHeading = pageLoc.processHeading ?? hardcoded.processHeading
  const process = pageLoc.process ?? hardcoded.process
  const learnMore = pageLoc.learnMore ?? hardcoded.learnMore
  const ctaBannerHeadline = pageLoc.ctaBannerHeadline ?? hardcoded.ctaBannerHeadline

  return (
    <>
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {t("title")}
            </p>
            <h1 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {t("description")}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(({ slug, title, tagline, description, outcomes }) => {
              const Icon = iconMap[slug] ?? Search
              return (
                <Card key={slug} className="flex flex-col">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{tagline}</p>
                    <h2 className="font-bricolage text-xl font-bold">{title}</h2>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {description}
                    </p>
                    <ul className="space-y-2 mb-8 flex-1">
                      {outcomes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          <span className="text-foreground/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="w-full gap-2">
                      <Link href={`/services/${slug}` as Parameters<typeof Link>[0]["href"]}>
                        {learnMore}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 border-t border-border/40 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-bricolage text-2xl font-bold tracking-tight mb-10">
            {processHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map(({ step, title, desc }) => (
              <div key={step}>
                <p className="font-bricolage text-3xl font-bold text-accent/30 mb-2">
                  {step}
                </p>
                <p className="font-semibold mb-1">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        headline={ctaBannerHeadline}
        cta={t("cta")}
        href="/contact"
      />
    </>
  );
}
