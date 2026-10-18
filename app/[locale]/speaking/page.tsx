import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Mic } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { getSpeakingPage, type SpeakingEvent } from "@/lib/sanity/queries";

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
  const t = await getTranslations({ locale, namespace: "speaking" });
  const sanityData = await getSpeakingPage();
  const isEn = locale === 'en';
  const title = isEn
    ? (sanityData?.seo?.metaTitleEn || t("title"))
    : (sanityData?.seo?.metaTitleId || t("title"));
  const description = isEn
    ? (sanityData?.seo?.metaDescEn || t("description"))
    : (sanityData?.seo?.metaDescId || t("description"));
  const ogImageUrl = sanityData?.seo?.ogImage?.asset?.url;
  return {
    title,
    description,
    robots: sanityData?.seo?.noIndex ? 'noindex' : 'index, follow',
    ...getHreflangAlternates("/speaking", locale),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}

// ─── Hardcoded events (fallback + source) ──────────────────────────────────

const events: SpeakingEvent[] = [
  {
    eventName: "Google Search Central Live",
    date: "2024-07-25",
    location: "Jakarta",
    topicId: "Jangan Kejar Traffic!",
    topicEn: "Beyond Traffic: Rethinking SEO Success Metrics",
    descriptionId:
      "Lightning Talk di Google Search Central Live Jakarta 2024 — pertama kalinya Google mengadakan sesi community lightning talk di Indonesia. Saya membawakan materi tentang mengapa metrik traffic sering kali menyesatkan, dan bagaimana SEO practitioner seharusnya mengukur dampak nyata terhadap bisnis.",
    descriptionEn:
      "Lightning Talk at Google Search Central Live Jakarta 2024 — the first time Google hosted community lightning talks in Indonesia. I spoke about why traffic metrics are often misleading, and how SEO practitioners should measure real business impact instead.",
    eventUrl: "https://developers.google.com/search/blog/2024/10/scl-2024-jkt-bkk",
  },
  {
    eventName: "SEO Conference",
    date: "2019-03-13",
    location: "Balai Kartini, Jakarta",
    topicId: "SEO untuk Platform Skala Besar",
    topicEn: "SEO at Scale: Lessons from Large Platforms",
    descriptionId:
      "Pembicara di SEO Conference 2019 — konferensi SEO pertama di Indonesia. Berbagi pengalaman menangani SEO untuk platform e-commerce dan media berskala besar, termasuk strategi crawling, indexability, dan content architecture untuk jutaan halaman.",
    descriptionEn:
      "Speaker at SEO Conference 2019 — Indonesia's first SEO conference. Shared experience managing SEO for large-scale e-commerce and media platforms, covering crawling strategy, indexability, and content architecture for millions of pages.",
    eventUrl: "https://toffeedev.com/blog/digital-marketing/seo-conference-2019-pertama-di-indonesia-sukses-dilaksanakan/",
  },
];

const copy = {
  id: {
    headingLine1: "Lebih dari satu dekade,",
    headingLine2: "berbagi di panggung yang sama dengan Google.",
    intro: [
      "Dari konferensi SEO pertama di Indonesia hingga panggung Google Search Central, saya percaya bahwa knowledge sharing adalah bagian dari tanggung jawab profesional. Setiap kali saya berbicara, tujuannya bukan untuk mengajar, tapi untuk memulai percakapan yang tidak bisa terjadi lewat artikel atau dashboard.",
    ],
    ctaHeadline: "Punya topik yang ingin didiskusikan di event Anda?",
    ctaButton: "Undang Saya",
  },
  en: {
    headingLine1: "Over a decade,",
    headingLine2: "sharing the stage alongside Google.",
    intro: [
      "From Indonesia's first SEO conference to the Google Search Central stage, I believe that knowledge sharing is part of professional responsibility. Every time I speak, the goal is not to lecture, but to start conversations that can't happen through articles or dashboards alone.",
    ],
    ctaHeadline: "Have a topic you'd like me to speak about at your event?",
    ctaButton: "Invite Me",
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SpeakingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "speaking" });

  const sanityData = await getSpeakingPage();

  const c = sanityData
    ? (locale === "en" ? sanityData.en : sanityData.id)
    : (locale === "en" ? copy.en : copy.id);

  const hasSanityIntro =
    sanityData && Array.isArray(c.intro) && (c.intro as unknown[]).length > 0;

  const eventsData = sanityData?.events?.length ? sanityData.events : events;

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {t("title")}
            </p>
            <h1 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
              {c.headingLine1}
              <br />
              <span className="text-muted-foreground">{c.headingLine2}</span>
            </h1>
            <div className="prose prose-neutral max-w-none text-base text-foreground/80 leading-relaxed">
              {hasSanityIntro ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <PortableText value={c.intro as any} />
              ) : (
                (copy[locale === "en" ? "en" : "id"].intro as React.ReactNode[]).map((p, i) => (
                  <p key={i}>{p}</p>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 border-t border-border/40 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {eventsData.map((event, idx) => {
              const topic = locale === "en" ? event.topicEn : event.topicId;
              const description =
                locale === "en" ? event.descriptionEn : event.descriptionId;
              const dateFormatted = formatDate(event.date, locale);

              return (
                <div key={idx} className="relative pl-8 border-l-2 border-accent/20 pb-8 last:pb-0">
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-accent/20 border-2 border-accent ring-4 ring-background" />

                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Mic className="h-4 w-4 text-accent" />
                          <span className="text-xs font-medium text-accent uppercase tracking-wide">
                            {dateFormatted}
                          </span>
                        </div>
                        <h2 className="font-bricolage text-xl font-bold">
                          {event.eventName}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.location}
                        </p>
                      </div>
                      {event.eventUrl && (
                        <a
                          href={event.eventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline shrink-0"
                        >
                          Event page
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                      )}
                    </div>

                    <div className="mb-4">
                      <Badge
                        variant="secondary"
                        className="font-semibold text-sm px-3 py-1 bg-accent/10 text-accent border-accent/20"
                      >
                        {topic}
                      </Badge>
                    </div>

                    <p className="text-sm text-foreground/75 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        headline={c.ctaHeadline}
        cta={c.ctaButton}
        href="/contact"
      />
    </>
  );
}
