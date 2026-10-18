import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { getServicePageBySlug } from "@/lib/sanity/queries";

export const revalidate = 3600

type ServiceContent = {
  title: string;
  subtitle: string;
  hero: string;
  keywords: string[];
  problem: string[];
  deliverables: { title: string; items: string[] }[];
  faqs: { q: string; a: string }[];
};

type ServiceEntry = {
  id: ServiceContent;
  en: ServiceContent;
  caseStudy?: { slug: string; label: { id: string; en: string }; meta: { id: string; en: string } };
};

const serviceData: Record<string, ServiceEntry> = {
  "seo-consulting": {
    caseStudy: {
      slug: "bareksa-seo-recovery",
      label: { id: "Lihat contoh nyata", en: "See a real example" },
      meta: {
        id: "Bareksa: Membalikkan penurunan traffic di tengah Google Core Update",
        en: "Bareksa: Reversing traffic decline through a Google Core Update",
      },
    },
    id: {
      title: "Jasa SEO Terpercaya - 10+ Tahun Pengalaman di Vidio, ShopBack, Lamudi | Hans",
      subtitle: "Jasa SEO consultant terpercaya & berpengalaman 10+ tahun di Vidio, ShopBack, Lamudi, Ruparupa. Technical SEO audit, recovery Google Core Update, rendering audit.",
      hero: "Traffic turun saat Google Core Update. Halaman tidak terindeks meski sudah dipublish. Kompetitor outrank padahal konten kamu lebih baik. Masalah seperti ini jarang berdiri sendiri. Biasanya ada technical debt yang menumpuk diam-diam: canonical yang konflik, halaman yang di-render di sisi client jadi terlihat kosong oleh Googlebot, atau mobile serving yang berbeda dari desktop. Pekerjaan saya dimulai dari sana.",
      keywords: ["SEO Strategy", "Technical SEO", "Content SEO", "YMYL", "Indexability", "Rendering Audit", "SEO Audit"],
      problem: [
        "Traffic organik turun setelah Google Core Update dan tidak tahu harus mulai dari mana",
        "Halaman sudah dipublish tapi tidak muncul di hasil pencarian",
        "Platform pakai Client-Side Rendering (SPA) yang tidak ramah Googlebot",
        "Situs masuk kategori YMYL tapi belum memenuhi standar teknikal Google",
        "Content strategy tidak nyambung ke funnel bisnis, cuma kejar traffic",
      ],
      deliverables: [
        {
          title: "Fase 1: Fondasi Teknikal",
          items: [
            "Audit canonical: temukan dan perbaiki konflik yang bikin Google bingung",
            "Audit rendering: identifikasi halaman yang terlihat kosong oleh Googlebot karena CSR",
            "User-agent serving: pastikan Googlebot Desktop dan Smartphone dapat konten yang konsisten",
            "HTTPS dan YMYL compliance: krusial untuk platform keuangan, kesehatan, dan hukum",
            "XML sitemap dan meta tags yang terstruktur per kategori konten",
          ],
        },
        {
          title: "Fase 2: Visibilitas & Konten",
          items: [
            "Keyword strategy dari real search intent, bukan cuma volume pencarian",
            "Content architecture sebagai conversion funnel, bukan sekadar sumber traffic",
            "Optimasi halaman produk baru untuk visibility di hasil pencarian",
            "A/B testing elemen konten dengan tracking yang terukur",
          ],
        },
        {
          title: "Fase 3: Stabilisasi & Handover",
          items: [
            "Monitoring posisi dan deteksi regresi teknikal secara proaktif",
            "Dokumentasi standar SEO yang bisa dijalankan tim internal",
            "Reporting yang menjelaskan driver perubahan, bukan cuma metrik",
          ],
        },
      ],
      faqs: [
        {
          q: "Berapa lama untuk melihat hasil?",
          a: "Perbaikan teknikal bisa terasa dalam 4-8 minggu. Pertumbuhan traffic yang signifikan butuh 3-6 bulan. Tapi dari pengalaman saya, fix teknikal yang tepat bisa menghasilkan lonjakan besar di fase awal, terutama kalau ada isu indexing yang selama ini menahan visibility.",
        },
        {
          q: "Apa itu YMYL dan kenapa relevan?",
          a: "YMYL (Your Money, Your Life) adalah kategori konten yang Google anggap berdampak langsung pada keuangan, kesehatan, atau keselamatan pengguna. Google terapkan standar kualitas teknikal dan konten yang jauh lebih ketat untuk situs di kategori ini. Platform fintech, asuransi, medis, dan hukum masuk sini.",
        },
        {
          q: "Situs saya pakai React/Next.js, ada masalah?",
          a: "Tergantung implementasinya. Framework modern bisa sangat SEO-friendly kalau dikonfigurasi dengan Server-Side Rendering (SSR) atau Static Generation. Tapi kalau masih pakai Client-Side Rendering murni, halaman kamu mungkin terlihat kosong oleh Googlebot. Ini salah satu hal pertama yang saya cek.",
        },
        {
          q: "Apa yang beda dari pendekatan kamu?",
          a: "Saya tidak declare victory sebelum ada konfirmasi nyata dari Google. Setiap perubahan teknikal diverifikasi lewat Search Console, bukan cuma dicatat sebagai 'done'. Dan setiap rekomendasi punya alasan yang bisa dijelaskan, bukan sekadar generic best practice.",
        },
      ],
    },
    en: {
      title: "SEO Consultant with 10+ Years Experience - Vidio, ShopBack, Lamudi | Hans",
      subtitle: "Trusted SEO consultant with 10+ years experience at Vidio, ShopBack, Lamudi, Ruparupa. Technical SEO audit, Core Update recovery, rendering audit, content strategy.",
      hero: "Traffic drops during a Google Core Update. Pages don't get indexed despite being published. Competitors outrank you even though your content is better. Problems like these rarely stand alone. There's usually accumulated technical debt quietly catching up: conflicting canonicals, pages rendered on the client side that appear empty to Googlebot, or mobile serving inconsistent with desktop. That's where my work begins.",
      keywords: ["SEO Strategy", "Technical SEO", "Content SEO", "YMYL", "Indexability", "Rendering Audit", "SEO Audit"],
      problem: [
        "Organic traffic dropped after a Google Core Update and you don't know where to start",
        "Pages are published but don't appear in search results",
        "The platform uses Client-Side Rendering (SPA) that isn't Googlebot-friendly",
        "The site falls under YMYL but hasn't met Google's technical standards",
        "Content strategy isn't connected to the business funnel, only chasing traffic",
      ],
      deliverables: [
        {
          title: "Phase 1: Technical Foundation",
          items: [
            "Canonical audit: find and fix conflicts that confuse Google's crawlers",
            "Rendering audit: identify pages appearing empty to Googlebot due to CSR",
            "User-agent serving: ensure Googlebot Desktop and Smartphone receive consistent content",
            "HTTPS and YMYL compliance: critical for finance, health, and legal platforms",
            "Structured XML sitemaps and meta tags organized by content category",
          ],
        },
        {
          title: "Phase 2: Visibility & Content",
          items: [
            "Keyword strategy based on real search intent, not just search volume",
            "Content architecture as a conversion funnel, not just a traffic source",
            "New product page optimization for search visibility",
            "Content element A/B testing with measurable tracking",
          ],
        },
        {
          title: "Phase 3: Stabilization & Handover",
          items: [
            "Proactive position monitoring and technical regression detection",
            "SEO standards documentation your internal team can operate independently",
            "Reporting that explains what drove changes, not just what the metrics are",
          ],
        },
      ],
      faqs: [
        {
          q: "How long does it take to see results?",
          a: "Technical fixes can show movement in 4-8 weeks. Significant traffic growth takes 3-6 months. But in my experience, the right technical fix can produce a large early jump, especially when indexing issues have been silently suppressing visibility.",
        },
        {
          q: "What is YMYL and why does it matter?",
          a: "YMYL (Your Money, Your Life) refers to content that Google considers to have a direct impact on users' finances, health, or safety. Google applies far stricter quality standards to sites in this category. Fintech, insurance, medical, and legal platforms all fall under this.",
        },
        {
          q: "My site uses React/Next.js. Is that a problem?",
          a: "It depends on the implementation. Modern frameworks can be very SEO-friendly when configured with Server-Side Rendering (SSR) or Static Generation. But if you're still using pure Client-Side Rendering, your pages may appear empty to Googlebot. This is one of the first things I check.",
        },
        {
          q: "What differentiates your approach?",
          a: "I don't declare victory before there's real confirmation from Google. Every technical change is verified through Search Console, not just marked as 'done'. And every recommendation has a reason that can be explained, not just a generic best practice.",
        },
      ],
    },
  },
  "marketing-analytics": {
    id: {
      title: "Marketing Analytics",
      subtitle: "Jasa marketing analytics - audit GA4, implementasi & setup, attribution modeling, BigQuery SQL. 10+ tahun pengalaman data-driven di Vidio dan lainnya.",
      hero: "Dashboard kamu penuh angka, tapi ketika diminta jelaskan ROI ke direksi, kamu tidak yakin. GA4 sudah dipasang, tapi tracking-nya kacau. Marketing analytics bukan soal kumpulkan data. Tapi soal ubah data itu jadi keputusan.",
      keywords: ["GA4", "Google Tag Manager", "Looker Studio", "BigQuery", "Attribution"],
      problem: [
        "GA4 baru dipasang tapi data tidak akurat atau incomplete",
        "Tidak bisa jawab pertanyaan 'channel mana yang benar-benar convert?'",
        "Dashboard yang ada tidak berguna untuk pengambilan keputusan",
        "Data tersebar di banyak platform dan tidak bisa dikonsolidasi",
      ],
      deliverables: [
        {
          title: "Analytics Foundation",
          items: [
            "GA4 audit atau full implementation dari awal",
            "GTM setup dengan event tracking yang clean dan terdokumentasi",
            "Conversion tracking yang akurat di semua touchpoints",
            "Data layer implementation untuk data yang lebih kaya",
          ],
        },
        {
          title: "Insights & Reporting",
          items: [
            "Custom Looker Studio dashboard untuk setiap stakeholder",
            "BigQuery integration untuk advanced analysis",
            "Attribution modeling yang sesuai dengan business model kamu",
            "Monthly analytics review dengan narrative yang jelas",
          ],
        },
      ],
      faqs: [
        {
          q: "Apakah saya perlu migrasi dari UA ke GA4?",
          a: "Universal Analytics sudah tidak aktif sejak Juli 2023. Kalau kamu belum fully migrate, sekarang saat yang tepat. Saya bisa bantu pastikan tidak ada data yang hilang dalam prosesnya.",
        },
        {
          q: "Apa bedanya audit GA4 vs. implementation?",
          a: "Audit cocok kalau GA4 sudah ada tapi kamu curiga data tidak akurat. Implementation cocok kalau kamu mulai dari nol atau mau rebuild yang lebih terstruktur.",
        },
        {
          q: "Apakah kamu juga bisa handle BigQuery dan SQL?",
          a: "Ya. Untuk analisis yang lebih dalam atau data warehouse, saya bisa setup BigQuery integration dan buat custom queries yang tidak bisa dilakukan di GA4 standar.",
        },
      ],
    },
    en: {
      title: "Marketing Analytics",
      subtitle: "Marketing analytics audit, GA4 implementation & setup, attribution modeling, BigQuery SQL. 10+ years experience driving data-driven decisions at Vidio and more.",
      hero: "Your dashboard is full of numbers, but when asked to explain ROI to the board, you're not sure. GA4 is installed, but the tracking is a mess. Marketing analytics isn't about collecting data. It's about turning it into decisions.",
      keywords: ["GA4", "Google Tag Manager", "Looker Studio", "BigQuery", "Attribution"],
      problem: [
        "GA4 was recently installed but data is inaccurate or incomplete",
        "You can't answer 'which channel is actually converting?'",
        "The dashboards you have aren't useful for decision-making",
        "Data is spread across many platforms and can't be consolidated",
      ],
      deliverables: [
        {
          title: "Analytics Foundation",
          items: [
            "GA4 audit or full implementation from scratch",
            "GTM setup with clean, documented event tracking",
            "Accurate conversion tracking across all touchpoints",
            "Data layer implementation for richer data",
          ],
        },
        {
          title: "Insights & Reporting",
          items: [
            "Custom Looker Studio dashboards for each stakeholder",
            "BigQuery integration for advanced analysis",
            "Attribution modeling suited to your business model",
            "Monthly analytics review with clear narrative",
          ],
        },
      ],
      faqs: [
        {
          q: "Do I need to migrate from UA to GA4?",
          a: "Universal Analytics has been inactive since July 2023. If you haven't fully migrated, now is the time. I can help ensure no data is lost in the process.",
        },
        {
          q: "What's the difference between a GA4 audit and implementation?",
          a: "An audit is right if GA4 already exists but you suspect the data is inaccurate. Implementation is right if you're starting from scratch or want a more structured rebuild.",
        },
        {
          q: "Can you also handle BigQuery and SQL?",
          a: "Yes. For deeper analysis or data warehousing, I can set up BigQuery integration and create custom queries not possible in standard GA4.",
        },
      ],
    },
  },
};

const ui = {
  id: {
    problemHeading: "Situasi ini kedengarannya familiar?",
    deliverablesHeading: "Yang akan kita kerjakan",
    sidebarHeading: "Siap mulai?",
    sidebarNote: "Ceritakan situasi kamu. Saya akan balas dalam 24 jam.",
    ctaBannerHeadline: "Tertarik tapi masih ada pertanyaan?",
    ctaBannerCta: "Mulai Diskusi",
  },
  en: {
    problemHeading: "Does this sound familiar?",
    deliverablesHeading: "What we'll work on",
    sidebarHeading: "Ready to get started?",
    sidebarNote: "Tell me about your situation. I'll respond within 24 hours.",
    ctaBannerHeadline: "Interested but still have questions?",
    ctaBannerCta: "Start a Conversation",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const sanityEntry = await getServicePageBySlug(slug)
  const hardcodedEntry = serviceData[slug];
  if (!sanityEntry && !hardcodedEntry) return {};
  const isEn = locale === 'en';
  const localeContent = sanityEntry
    ? (isEn ? sanityEntry.en : sanityEntry.id)
    : (isEn ? hardcodedEntry.en : hardcodedEntry.id);
  const defaultTitle = sanityEntry?.title ?? (hardcodedEntry ? (isEn ? hardcodedEntry.en.title : hardcodedEntry.id.title) : "");
  const defaultDesc = localeContent.subtitle;
  const title = isEn
    ? (sanityEntry?.seo?.metaTitleEn || defaultTitle)
    : (sanityEntry?.seo?.metaTitleId || defaultTitle);
  const description = isEn
    ? (sanityEntry?.seo?.metaDescEn || defaultDesc)
    : (sanityEntry?.seo?.metaDescId || defaultDesc);
  const ogImageUrl = sanityEntry?.seo?.ogImage?.asset?.url;
  return {
    title,
    description,
    robots: sanityEntry?.seo?.noIndex ? 'noindex' : 'index, follow',
    ...getHreflangAlternates({ pathname: '/services/[slug]', params: { slug } }, locale),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}

export function generateStaticParams() {
  return Object.keys(serviceData).map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const sanityEntry = await getServicePageBySlug(slug);
  const hardcodedEntry = serviceData[slug];

  if (!sanityEntry && !hardcodedEntry) notFound();

  // Merge: prefer Sanity, fallback to hardcoded
  const service = sanityEntry
    ? {
        title: sanityEntry.title ?? (locale === "en" ? hardcodedEntry?.en.title : hardcodedEntry?.id.title) ?? "",
        subtitle: (locale === "en" ? sanityEntry.en.subtitle : sanityEntry.id.subtitle) || (locale === "en" ? hardcodedEntry?.en.subtitle : hardcodedEntry?.id.subtitle) || "",
        hero: (locale === "en" ? sanityEntry.en.hero : sanityEntry.id.hero) || (locale === "en" ? hardcodedEntry?.en.hero : hardcodedEntry?.id.hero) || "",
        keywords: sanityEntry.keywords ?? (locale === "en" ? hardcodedEntry?.en.keywords : hardcodedEntry?.id.keywords) ?? [],
        problem: (locale === "en" ? sanityEntry.en.problem : sanityEntry.id.problem) || (locale === "en" ? hardcodedEntry?.en.problem : hardcodedEntry?.id.problem) || [],
        deliverables: (locale === "en" ? sanityEntry.en.deliverables : sanityEntry.id.deliverables) || (locale === "en" ? hardcodedEntry?.en.deliverables : hardcodedEntry?.id.deliverables) || [],
        faqs: (locale === "en" ? sanityEntry.en.faqs : sanityEntry.id.faqs) || (locale === "en" ? hardcodedEntry?.en.faqs : hardcodedEntry?.id.faqs) || [],
      }
    : (locale === "en" ? hardcodedEntry.en : hardcodedEntry.id);

  const u = locale === "en" ? ui.en : ui.id;
  const t = await getTranslations({ locale, namespace: "services" });

  // Resolve caseStudy from Sanity first, then hardcoded
  const sanityCaseStudy = sanityEntry?.caseStudy
  const caseStudy = sanityCaseStudy
    ? {
        slug: sanityCaseStudy.slug,
        label: { id: sanityCaseStudy.labelId, en: sanityCaseStudy.labelEn },
        meta: { id: sanityCaseStudy.metaId, en: sanityCaseStudy.metaEn },
      }
    : hardcodedEntry?.caseStudy

  return (
    <>
      <article className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("title")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Main */}
            <div className="lg:col-span-7 space-y-12">
              <header>
                <h1 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                  {service.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {service.subtitle}
                </p>
              </header>

              <div className="text-base text-foreground/80 leading-relaxed bg-secondary/50 rounded-xl p-6 border-l-2 border-accent">
                {service.hero}
              </div>

              {/* Problems */}
              <div>
                <h2 className="font-bricolage text-xl font-bold mb-5">
                  {u.problemHeading}
                </h2>
                <ul className="space-y-3">
                  {service.problem.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div>
                <h2 className="font-bricolage text-xl font-bold mb-5">
                  {u.deliverablesHeading}
                </h2>
                <div className="space-y-6">
                  {service.deliverables.map(({ title, items }) => (
                    <div key={title}>
                      <h3 className="font-semibold text-sm mb-3">{title}</h3>
                      <ul className="space-y-2">
                        {items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm">
                            <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                            <span className="text-foreground/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="font-bricolage text-xl font-bold mb-5">
                  {t("faqs")}
                </h2>
                <Accordion className="space-y-1">
                  {service.faqs.map(({ q, a }) => (
                    <AccordionItem key={q} value={q} className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        {q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        <span dangerouslySetInnerHTML={{ __html: a }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-xl border border-border bg-card p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    Keywords & Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.keywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="font-normal">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>

                {caseStudy && (
                  <Link
                    href={`/case-studies/${caseStudy.slug}` as Parameters<typeof Link>[0]["href"]}
                    className="group block rounded-xl border border-border bg-card hover:border-foreground/20 transition-all p-6"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                      {locale === "en" ? caseStudy.label.en : caseStudy.label.id}
                    </p>
                    <p className="text-sm font-medium leading-snug group-hover:text-accent transition-colors">
                      {locale === "en" ? caseStudy.meta.en : caseStudy.meta.id}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      {locale === "en" ? "Read case study" : "Baca studi kasus"}
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                )}

                <div className="rounded-xl border-2 border-foreground bg-card p-6">
                  <p className="font-bricolage text-lg font-bold mb-2">
                    {u.sidebarHeading}
                  </p>
                  <p className="text-sm text-muted-foreground mb-5">
                    {u.sidebarNote}
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/contact">{t("cta")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <CtaBanner
        headline={u.ctaBannerHeadline}
        cta={u.ctaBannerCta}
        href="/contact"
      />
    </>
  );
}
