import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { Badge } from "@/components/ui/badge";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { getAboutPage } from "@/lib/sanity/queries";

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
  const t = await getTranslations({ locale, namespace: "about" });
  const sanityData = await getAboutPage();
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
    ...getHreflangAlternates("/about", locale),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}

const skills = [
  {
    category: "SEO",
    tagline: "Intent & visibility control: beyond keyword ranking",
    tags: [
      { label: "Search Intent Modeling", highlight: true },
      { label: "SERP Positioning", highlight: true },
      { label: "Entity-Based SEO", highlight: true },
      { label: "AI / LLM Visibility Optimization", highlight: true },
      { label: "Intent Ownership Strategy", highlight: false },
      { label: "Organic Attribution Modeling", highlight: false },
      { label: "SEO Measurement Framework", highlight: false },
      { label: "Content-Search Alignment", highlight: false },
      { label: "Technical SEO", highlight: false },
      { label: "Core Web Vitals", highlight: false },
    ],
  },
  {
    category: "Analytics & Data",
    tagline: "Finding real drivers, not just reading what happened",
    tags: [
      { label: "Causal Analysis", highlight: true },
      { label: "Metric Engineering", highlight: true },
      { label: "Hypothesis-Driven Analysis", highlight: true },
      { label: "Signal vs Noise Analysis", highlight: true },
      { label: "Attribution Modeling", highlight: false },
      { label: "Decision-Oriented Analytics", highlight: false },
      { label: "Data Consistency Framework", highlight: false },
      { label: "Growth Driver Identification", highlight: false },
      { label: "Google Analytics 4", highlight: false },
      { label: "BigQuery", highlight: false },
      { label: "Looker Studio", highlight: false },
    ],
  },
  {
    category: "Systems & Automation",
    tagline: "Turning simple tools into scalable systems",
    tags: [
      { label: "Scalable Spreadsheet Systems", highlight: true },
      { label: "Workflow Automation", highlight: true },
      { label: "AI-Assisted Analysis", highlight: true },
      { label: "Custom Data Pipelines", highlight: false },
      { label: "Lightweight Data Engineering", highlight: false },
      { label: "Google Sheets (Advanced)", highlight: false },
      { label: "Apps Script", highlight: false },
      { label: "Google Search Console", highlight: false },
      { label: "Ahrefs", highlight: false },
    ],
  },
];

const copy = {
  id: {
    headingLine1: "Saya tidak percaya angka",
    headingLine2: "yang tidak bisa saya pertanyakan.",
    paragraphs: [
      <>Perjalanan saya dimulai dari SEO, bukan karena teknikal-nya, tapi karena pertanyaannya: <em>mengapa</em> konten ini ditemukan dan yang lain tidak? Dari sana, saya masuk ke analytics, lalu ke sesuatu yang lebih dalam: <strong>bagaimana variabel satu memengaruhi yang lain</strong>.</>,
      <>Kebanyakan marketer berhenti di metrik permukaan. Saya tidak. Saya cari driver yang sesungguhnya: variabel mana yang benar-benar menggerakkan pertumbuhan, bukan yang hanya berkorelasi dengannya. Perbedaan ini kecil secara tampilan, tapi besar dalam keputusan.</>,
      <>Saya berpikir dalam bentuk sistem dan model. Setiap engagement biasanya berakhir dengan sesuatu yang bisa dipakai ulang: framework, scoring logic, atau pipeline yang menjawab pertanyaan yang sama di masa depan tanpa harus memulai dari nol.</>,
      <>Saya bekerja paling baik dengan tim yang ingin tahu <strong>mengapa</strong>. Yang tidak puas dengan "traffic naik" tanpa bisa menjelaskan kenapa, dan tidak nyaman dengan keputusan besar berbasis intuisi saja.</>,
    ],
    seeExperience: "Lihat pengalaman kerja saya",
    coreValuesLabel: "Keahlian Utama",
    coreValues: [
      { label: "Logic", desc: "Causality over correlation. Saya cari sebab, bukan sekadar pola." },
      { label: "Branding", desc: "Identitas yang konsisten adalah sistem, bukan estetika semata." },
      { label: "Storytelling", desc: "Data tanpa narasi tidak bergerak. Narasi tanpa data tidak dipercaya." },
      { label: "Empathy", desc: "Insight terbaik lahir dari memahami manusia di balik angka." },
    ],
    achievementsTitle: "Apa yang Pernah Saya Bangun",
    achievements: [
      { title: "SEO Visibility & Intent Ownership", desc: "Memenangkan SERP pada keyword kompetitif dan menggeser dominasi intent pencarian. Dari tidak muncul sama sekali, menjadi entitas utama di ekosistem search." },
      { title: "Engagement Score (Custom Metric System)", desc: "Mendesain metrik komposit dengan variable weighting untuk evaluasi performa konten. Menggantikan raw metric yang misleading dengan decision tool yang actionable." },
      { title: "Data Consistency & Tracking Framework", desc: "Membangun sistem yang menghubungkan aktivitas marketing dengan outcome secara terstruktur: framework, logic, dan dokumentasi yang bisa dipakai tim lintas fungsi." },
      { title: "Regression Analysis dalam Marketing", desc: "Mengaplikasikan causal modeling untuk mengidentifikasi driver utama metric bisnis. Memisahkan signal dari noise sebelum keputusan diambil." },
      { title: "Data Pipeline & Automation Skala Besar", desc: "Mengelola dan mengotomasi analisis ratusan ribu baris data menggunakan Google Sheets dan Apps Script, melampaui batas analisis manual." },
      { title: "AI Workflow & AI-Driven Visibility", desc: "Menginisiasi integrasi AI dalam workflow marketing dan eksplorasi AI-driven discovery. Memposisikan kerja di gelombang berikutnya sebelum menjadi standar." },
      { title: "Product & CMS Thinking", desc: "Berkontribusi dalam desain struktur CMS dan subscription model untuk platform berbasis konten. Bergerak dari marketer menuju product-oriented growth thinker." },
    ],
    ctaHeadline: "Punya pertanyaan yang belum bisa dijawab oleh data yang ada?",
    ctaButton: "Mari Diskusi",
  },
  en: {
    headingLine1: "I don't trust numbers",
    headingLine2: "I can't question.",
    paragraphs: [
      <>My journey started with SEO, not because of the technical side, but because of the question: <em>why</em> does this content get found while others don't? From there I moved into analytics, then into something deeper: <strong>how one variable actually influences another</strong>.</>,
      <>Most marketers stop at surface metrics. I don't. I look for the real drivers: which variables actually move growth, not just the ones that correlate with it. The difference looks small, but it is large when decisions are on the line.</>,
      <>I think in systems and models. Every engagement usually ends with something reusable: a framework, scoring logic, or a pipeline that can answer the same question in the future without starting from scratch.</>,
      <>I work best with teams who want to know <strong>why</strong>. Who aren't satisfied with "traffic went up" without being able to explain it, and who aren't comfortable making big decisions on intuition alone.</>,
    ],
    seeExperience: "View my work history",
    coreValuesLabel: "Core Principles",
    coreValues: [
      { label: "Logic", desc: "Causality over correlation. I look for causes, not just patterns." },
      { label: "Branding", desc: "Consistent identity is a system, not just aesthetics." },
      { label: "Storytelling", desc: "Data without narrative doesn't move. Narrative without data isn't trusted." },
      { label: "Empathy", desc: "The best insights come from understanding the humans behind the numbers." },
    ],
    achievementsTitle: "What I've Built",
    achievements: [
      { title: "SEO Visibility & Intent Ownership", desc: "Won SERP on competitive keywords and shifted search intent dominance. From no presence at all to becoming the primary entity in the search ecosystem." },
      { title: "Engagement Score (Custom Metric System)", desc: "Designed a composite metric with variable weighting for content performance evaluation. Replaced misleading raw metrics with an actionable decision tool." },
      { title: "Data Consistency & Tracking Framework", desc: "Built a system connecting marketing activities to outcomes in a structured way: framework, logic, and documentation usable across team functions." },
      { title: "Regression Analysis in Marketing", desc: "Applied causal modeling to identify the primary drivers of business metrics. Separated signal from noise before decisions are made." },
      { title: "Data Pipeline & Large-Scale Automation", desc: "Managed and automated analysis of hundreds of thousands of rows using Google Sheets and Apps Script, exceeding manual analysis limits." },
      { title: "AI Workflow & AI-Driven Visibility", desc: "Initiated AI integration in marketing workflows and explored AI-driven discovery. Positioned the work ahead of the next wave before it became standard." },
      { title: "Product & CMS Thinking", desc: "Contributed to CMS structure design and subscription model for a content-based platform. Moving from marketer toward product-oriented growth thinker." },
    ],
    ctaHeadline: "Have a question your current data can't answer?",
    ctaButton: "Let's Talk",
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const sanityData = await getAboutPage();

  const c = sanityData
    ? (locale === "en" ? sanityData.en : sanityData.id)
    : (locale === "en" ? copy.en : copy.id);

  const skillsData = sanityData?.skills ?? skills;

  const hasSanityParagraphs =
    sanityData && Array.isArray(c.paragraphs) && (c.paragraphs as unknown[]).length > 0;

  return (
    <>
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Story */}
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                {t("title")}
              </p>
              <h1 className="font-bricolage text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8">
                {c.headingLine1}
                <br />
                <span className="text-muted-foreground">{c.headingLine2}</span>
              </h1>

              <div className="prose prose-neutral max-w-none space-y-5 text-base text-foreground/80 leading-relaxed">
                {hasSanityParagraphs ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <PortableText value={c.paragraphs as any} />
                ) : (
                  (copy[locale === "en" ? "en" : "id"].paragraphs as React.ReactNode[]).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))
                )}
              </div>

              <div className="mt-8">
                <Link
                  href="/experience"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  {c.seeExperience}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right: Core principles */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-8">
                <div className="rounded-xl border border-border p-6 bg-card">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    {c.coreValuesLabel}
                  </p>
                  <div className="space-y-4">
                    {c.coreValues.map(({ label, desc }) => (
                      <div key={label} className="flex gap-3">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements section */}
      <section className="py-16 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-bricolage text-2xl font-bold tracking-tight mb-10">
            {c.achievementsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {c.achievements.map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-border p-5 bg-card">
                <p className="text-sm font-semibold mb-1.5">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills section */}
      <section className="py-16 border-t border-border/40 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-bricolage text-2xl font-bold tracking-tight mb-10">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillsData.map(({ category, tagline, tags }) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  {category}
                </p>
                <p className="text-xs text-muted-foreground/70 italic mb-4">{tagline}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(({ label, highlight }) => (
                    <Badge
                      key={label}
                      variant={highlight ? "default" : "secondary"}
                      className={highlight ? "font-normal bg-accent/15 text-accent border-accent/20 hover:bg-accent/20" : "font-normal"}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
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
