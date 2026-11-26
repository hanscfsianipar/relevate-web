import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getServicePageBySlug } from "@/lib/sanity/queries";

export const revalidate = 3600

type ServiceContent = {
  name: string;
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
      slug: "seo-recovery",
      label: { id: "Lihat contoh nyata", en: "See a real example" },
      meta: {
        id: "Contoh: membalikkan penurunan traffic di tengah Google Core Update",
        en: "Example: reversing traffic decline through a Google Core Update",
      },
    },
    id: {
      name: "Audit & Optimasi Teknikal",
      title: "Jasa SEO - Audit Teknis, Recovery Core Update, Content Strategy | Relevate",
      subtitle: "Audit teknis, recovery Google Core Update, rendering audit, dan strategi konten.",
      hero: "Traffic turun saat Google Core Update. Halaman tidak terindeks meski sudah dipublish. Kompetitor outrank padahal konten Anda lebih baik. Masalah seperti ini jarang berdiri sendiri. Biasanya ada technical debt yang menumpuk diam-diam: canonical yang konflik, halaman yang di-render di sisi client jadi terlihat kosong oleh Googlebot, atau mobile serving yang berbeda dari desktop. Pekerjaan kami dimulai dari sana.",
      keywords: ["SEO Strategy", "Technical SEO", "Content SEO", "YMYL", "Indexability", "Rendering Audit", "SEO Audit"],
      problem: [
        "Traffic organik turun setelah Google Core Update dan Anda tidak tahu harus mulai dari mana",
        "Halaman sudah dipublish tapi tidak muncul di hasil pencarian",
        "Platform memakai Client-Side Rendering (SPA) yang tidak ramah Googlebot",
        "Situs masuk kategori YMYL tapi belum memenuhi standar teknikal Google",
        "Strategi konten tidak tersambung ke funnel bisnis, hanya mengejar traffic",
      ],
      deliverables: [
        {
          title: "Fase 1: Fondasi Teknikal",
          items: [
            "Audit canonical: temukan dan perbaiki konflik yang membuat Google bingung",
            "Audit rendering: identifikasi halaman yang terlihat kosong oleh Googlebot karena CSR",
            "User-agent serving: pastikan Googlebot Desktop dan Smartphone menerima konten yang konsisten",
            "HTTPS dan YMYL compliance: krusial untuk platform keuangan, kesehatan, dan hukum",
            "XML sitemap dan meta tags yang terstruktur per kategori konten",
          ],
        },
        {
          title: "Fase 2: Visibilitas & Konten",
          items: [
            "Strategi kata kunci dari real search intent, bukan hanya volume pencarian",
            "Arsitektur konten sebagai funnel konversi, bukan sekadar sumber traffic",
            "Optimasi halaman produk baru untuk visibilitas di hasil pencarian",
            "A/B testing elemen konten dengan pengukuran yang jelas",
          ],
        },
        {
          title: "Fase 3: Stabilisasi & Serah Terima",
          items: [
            "Pemantauan posisi dan deteksi regresi teknikal secara proaktif",
            "Dokumentasi standar SEO yang bisa dijalankan tim internal",
            "Laporan yang menjelaskan pemicu perubahan, bukan hanya angka",
          ],
        },
      ],
      faqs: [
        {
          q: "Berapa lama untuk melihat hasil?",
          a: "Perbaikan teknikal bisa terasa dalam 4-8 minggu. Pertumbuhan traffic yang signifikan butuh 3-6 bulan. Dari pengalaman kami, perbaikan teknikal yang tepat bisa menghasilkan lonjakan besar di fase awal, terutama kalau ada isu indexing yang selama ini menahan visibilitas.",
        },
        {
          q: "Apa itu YMYL dan kenapa relevan?",
          a: "YMYL (Your Money, Your Life) adalah kategori konten yang Google anggap berdampak langsung pada keuangan, kesehatan, atau keselamatan pengguna. Google menerapkan standar kualitas teknikal dan konten yang jauh lebih ketat untuk situs di kategori ini. Platform fintech, asuransi, medis, dan hukum masuk sini.",
        },
        {
          q: "Situs saya memakai React atau Next.js, ada masalah?",
          a: "Tergantung implementasinya. Framework modern bisa sangat SEO-friendly kalau dikonfigurasi dengan Server-Side Rendering atau Static Generation. Tapi kalau masih memakai Client-Side Rendering murni, halaman Anda mungkin terlihat kosong oleh Googlebot. Ini salah satu hal pertama yang kami periksa.",
        },
        {
          q: "Apa yang membedakan pendekatan kami?",
          a: "Kami tidak menyatakan berhasil sebelum ada konfirmasi nyata dari Google. Setiap perubahan teknikal diverifikasi lewat Search Console, bukan sekadar dicatat sebagai selesai. Dan setiap rekomendasi punya alasan yang bisa dijelaskan, bukan sekadar praktik umum.",
        },
      ],
    },
    en: {
      name: "Technical Audit & Optimization",
      title: "SEO Consultant - Technical Audit, Core Update Recovery, Content Strategy | Relevate",
      subtitle: "Technical audits, Google Core Update recovery, rendering audits, and content strategy.",
      hero: "Traffic drops during a Google Core Update. Pages do not get indexed despite being published. Competitors outrank you even though your content is better. Problems like these rarely stand alone. There is usually accumulated technical debt quietly catching up: conflicting canonicals, pages rendered on the client side that appear empty to Googlebot, or mobile serving inconsistent with desktop. That is where our work begins.",
      keywords: ["SEO Strategy", "Technical SEO", "Content SEO", "YMYL", "Indexability", "Rendering Audit", "SEO Audit"],
      problem: [
        "Organic traffic dropped after a Google Core Update and you do not know where to start",
        "Pages are published but do not appear in search results",
        "The platform uses Client-Side Rendering (SPA) that is not Googlebot-friendly",
        "The site falls under YMYL but has not met Google technical standards",
        "Content strategy is not connected to the business funnel, only chasing traffic",
      ],
      deliverables: [
        {
          title: "Phase 1: Technical Foundation",
          items: [
            "Canonical audit: find and fix conflicts that confuse Google",
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
            "Content element A/B testing with clear measurement",
          ],
        },
        {
          title: "Phase 3: Stabilization & Handover",
          items: [
            "Proactive position monitoring and technical regression detection",
            "SEO standards documentation your internal team can run independently",
            "Reporting that explains what drove change, not just the numbers",
          ],
        },
      ],
      faqs: [
        {
          q: "How long does it take to see results?",
          a: "Technical fixes can show movement in 4-8 weeks. Significant traffic growth takes 3-6 months. In our experience, the right technical fix can produce a large early jump, especially when indexing issues have been silently suppressing visibility.",
        },
        {
          q: "What is YMYL and why does it matter?",
          a: "YMYL (Your Money, Your Life) refers to content that Google considers to have a direct impact on users' finances, health, or safety. Google applies far stricter quality standards to sites in this category. Fintech, insurance, medical, and legal platforms all fall under this.",
        },
        {
          q: "My site uses React or Next.js. Is that a problem?",
          a: "It depends on the implementation. Modern frameworks can be very SEO-friendly when configured with Server-Side Rendering or Static Generation. But if you are still using pure Client-Side Rendering, your pages may appear empty to Googlebot. This is one of the first things we check.",
        },
        {
          q: "What makes our approach different?",
          a: "We do not declare success before there is real confirmation from Google. Every technical change is verified through Search Console, not just marked as done. And every recommendation has a reason that can be explained, not just a common practice.",
        },
      ],
    },
  },
  "marketing-analytics": {
    id: {
      name: "Marketing Analytics",
      title: "Marketing Analytics | Relevate",
      subtitle: "Audit GA4, implementasi dan setup, attribution modeling, BigQuery SQL.",
      hero: "Dashboard Anda penuh angka, tapi ketika diminta menjelaskan ROI ke direksi, Anda belum yakin. GA4 sudah dipasang, tapi tracking-nya kacau. Marketing analytics bukan soal mengumpulkan data, tapi soal mengubah data itu jadi keputusan.",
      keywords: ["GA4", "Google Tag Manager", "Looker Studio", "BigQuery", "Attribution"],
      problem: [
        "GA4 baru dipasang tapi data tidak akurat atau tidak lengkap",
        "Belum bisa menjawab pertanyaan channel mana yang benar-benar convert",
        "Dashboard yang ada tidak berguna untuk pengambilan keputusan",
        "Data tersebar di banyak platform dan tidak bisa dikonsolidasi",
      ],
      deliverables: [
        {
          title: "Fondasi Analitik",
          items: [
            "Audit GA4 atau implementasi penuh dari awal",
            "Setup GTM dengan event tracking yang bersih dan terdokumentasi",
            "Conversion tracking yang akurat di semua touchpoint",
            "Implementasi data layer untuk data yang lebih kaya",
          ],
        },
        {
          title: "Wawasan & Pelaporan",
          items: [
            "Dashboard Looker Studio khusus untuk setiap pemangku kepentingan",
            "Integrasi BigQuery untuk analisis lanjutan",
            "Attribution modeling yang sesuai dengan model bisnis Anda",
            "Review analitik bulanan dengan kesimpulan yang jelas",
          ],
        },
      ],
      faqs: [
        {
          q: "Apakah saya perlu migrasi dari UA ke GA4?",
          a: "Universal Analytics sudah tidak aktif sejak Juli 2023. Kalau Anda belum sepenuhnya migrasi, sekarang waktu yang tepat. Kami bisa bantu memastikan tidak ada data yang hilang dalam prosesnya.",
        },
        {
          q: "Apa bedanya audit GA4 dan implementasi?",
          a: "Audit cocok kalau GA4 sudah ada tapi Anda mencurigai datanya tidak akurat. Implementasi cocok kalau Anda mulai dari nol atau ingin membangun ulang dengan struktur yang lebih rapi.",
        },
        {
          q: "Apakah bisa menangani BigQuery dan SQL?",
          a: "Ya. Untuk analisis yang lebih dalam atau data warehouse, kami bisa menyiapkan integrasi BigQuery dan menyusun query khusus yang tidak bisa dilakukan di GA4 standar.",
        },
      ],
    },
    en: {
      name: "Marketing Analytics",
      title: "Marketing Analytics | Relevate",
      subtitle: "Marketing analytics audit, GA4 implementation and setup, attribution modeling, BigQuery SQL.",
      hero: "Your dashboard is full of numbers, but when asked to explain ROI to the board, you are not sure. GA4 is installed, but the tracking is a mess. Marketing analytics is not about collecting data, it is about turning that data into decisions.",
      keywords: ["GA4", "Google Tag Manager", "Looker Studio", "BigQuery", "Attribution"],
      problem: [
        "GA4 was recently installed but data is inaccurate or incomplete",
        "You cannot yet answer which channel actually converts",
        "The dashboards you have are not useful for decision-making",
        "Data is spread across many platforms and cannot be consolidated",
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
            "Monthly analytics review with clear conclusions",
          ],
        },
      ],
      faqs: [
        {
          q: "Do I need to migrate from UA to GA4?",
          a: "Universal Analytics has been inactive since July 2023. If you have not fully migrated, now is the time. We can help ensure no data is lost in the process.",
        },
        {
          q: "What is the difference between a GA4 audit and implementation?",
          a: "An audit is right if GA4 already exists but you suspect the data is inaccurate. Implementation is right if you are starting from scratch or want a rebuild with a tidier structure.",
        },
        {
          q: "Can you handle BigQuery and SQL?",
          a: "Yes. For deeper analysis or data warehousing, we can set up BigQuery integration and write custom queries that standard GA4 cannot run.",
        },
      ],
    },
  },
};

const ui = {
  id: {
    back: "Semua layanan",
    problemKicker: "Situasi",
    problemHeading: "Terdengar familiar?",
    problemLead: "Kalau dua atau tiga baris di bawah ini terasa akrab, berarti masalahnya sudah terlihat dari luar.",
    deliverablesKicker: "Pekerjaan",
    deliverablesHeading: "Yang akan kita kerjakan",
    deliverablesLead: "Berurutan, karena setiap fase bergantung pada fase sebelumnya.",
    keywordsLabel: "Cakupan",
    faqKicker: "Pertanyaan",
    faqHeading: "Yang biasanya ditanyakan lebih dulu",
    caseLabel: "Studi kasus terkait",
    ctaHeadline: "Mari lihat kondisi situs Anda.",
    ctaBody: "Satu percakapan singkat sudah cukup untuk tahu mana yang mendesak.",
    ctaButton: "Jadwalkan diskusi gratis",
    contents: ["Situasi", "Pekerjaan", "Pertanyaan"],
  },
  en: {
    back: "All services",
    problemKicker: "Situation",
    problemHeading: "Does this sound familiar?",
    problemLead: "If two or three lines below feel close to home, the problem is already visible from the outside.",
    deliverablesKicker: "The work",
    deliverablesHeading: "What we will work on",
    deliverablesLead: "In order, because each phase depends on the one before it.",
    keywordsLabel: "Scope",
    faqKicker: "Questions",
    faqHeading: "What usually gets asked first",
    caseLabel: "Related case study",
    ctaHeadline: "Let us look at the state of your site.",
    ctaBody: "One short conversation is enough to know what is urgent.",
    ctaButton: "Book a free consultation",
    contents: ["Situation", "The work", "Questions"],
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

  const isEn = locale === "en";
  const base = isEn ? hardcodedEntry?.en : hardcodedEntry?.id;
  const service: ServiceContent = sanityEntry
    ? {
        name: base?.name ?? sanityEntry.title ?? "",
        title: sanityEntry.title ?? base?.title ?? "",
        subtitle: (isEn ? sanityEntry.en.subtitle : sanityEntry.id.subtitle) || base?.subtitle || "",
        hero: (isEn ? sanityEntry.en.hero : sanityEntry.id.hero) || base?.hero || "",
        keywords: sanityEntry.keywords ?? base?.keywords ?? [],
        problem: (isEn ? sanityEntry.en.problem : sanityEntry.id.problem) || base?.problem || [],
        deliverables: (isEn ? sanityEntry.en.deliverables : sanityEntry.id.deliverables) || base?.deliverables || [],
        faqs: (isEn ? sanityEntry.en.faqs : sanityEntry.id.faqs) || base?.faqs || [],
      }
    : (base as ServiceContent);

  const u = isEn ? ui.en : ui.id;
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
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-[1320px] px-6 pt-10 pb-12 lg:px-14 lg:pt-14 lg:pb-14">
          <Link
            href="/services"
            className="inline-block text-[11px] font-bold uppercase tracking-[0.16em] text-cream/60 transition-colors hover:text-cream"
          >
            ← {u.back}
          </Link>
          <h1 className="font-display mt-8 max-w-[18ch] text-[clamp(32px,5.2vw,76px)]">
            {service.name}
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15.5px] leading-relaxed text-cream/80">
            {service.subtitle}
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-cream/20 pt-5">
            {u.contents.map((label, i) => (
              <a key={label} href={`#${i === 1 ? "pekerjaan" : i === 2 ? "pertanyaan" : "situasi"}`}>
                <span className="block text-[11px] font-bold tracking-[0.16em] text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1.5 block text-[12.5px] font-bold uppercase tracking-[0.14em] text-cream/90">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="situasi" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <span className="kicker text-sage">{u.problemKicker}</span>
              <h2 className="font-display mt-4 max-w-[16ch] text-[clamp(26px,3.6vw,48px)] text-forest">
                {u.problemHeading}
              </h2>
              <p className="mt-5 max-w-[40ch] text-[14.5px] text-sage">{u.problemLead}</p>
            </div>
            <div>
              <p className="border-l-2 border-lime pl-5 text-[15.5px] leading-relaxed text-forest/85">
                {service.hero}
              </p>
              <ul className="mt-8">
                {service.problem.map((p, i) => (
                  <li
                    key={p}
                    className="grid grid-cols-[44px_1fr] gap-4 border-t border-forest/15 py-5 last:border-b"
                  >
                    <span className="text-[12px] font-bold tracking-[0.14em] text-lime">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] leading-snug text-forest">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="pekerjaan" className="bg-forest py-16 text-cream lg:py-24">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
          <span className="kicker text-lime">{u.deliverablesKicker}</span>
          <h2 className="font-display mt-4 max-w-[20ch] text-[clamp(26px,3.9vw,56px)]">
            {u.deliverablesHeading}
          </h2>
          <p className="mt-4 max-w-[46ch] text-[14.5px] text-cream/70">{u.deliverablesLead}</p>

          <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
            {service.deliverables.map((block, i) => (
              <div key={block.title} className="border-t border-cream/25 pt-6">
                <span className="text-[12px] font-bold tracking-[0.14em] text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[20px] font-bold leading-snug">{block.title}</h3>
                <ul className="mt-4 space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[13.5px] leading-snug text-cream/75">
                      <span className="text-lime">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-cream/20 pt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/50">
              {u.keywordsLabel}
            </p>
            <p className="mt-3 text-[14px] text-cream/80">{service.keywords.join(" · ")}</p>
          </div>

          {caseStudy && (
            <Link
              href={`/case-studies/${caseStudy.slug}` as Parameters<typeof Link>[0]["href"]}
              className="mt-10 block border border-cream/25 p-6 transition-colors hover:bg-cream/[0.04] lg:max-w-[60%]"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-lime">
                {u.caseLabel}
              </p>
              <p className="mt-3 text-[16px] font-semibold leading-snug text-cream">
                {isEn ? caseStudy.meta.en : caseStudy.meta.id}
              </p>
              <span className="mt-4 inline-block text-[11px] font-bold uppercase tracking-[0.16em] text-cream/70">
                {isEn ? caseStudy.label.en : caseStudy.label.id} →
              </span>
            </Link>
          )}
        </div>
      </section>

      <section id="pertanyaan" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <span className="kicker text-sage">{u.faqKicker}</span>
              <h2 className="font-display mt-4 max-w-[14ch] text-[clamp(24px,3.2vw,44px)] text-forest">
                {u.faqHeading}
              </h2>
            </div>
            <Accordion className="border-t border-forest/20">
              {service.faqs.map(({ q, a }) => (
                <AccordionItem key={q} value={q} className="border-b border-forest/20">
                  <AccordionTrigger className="py-5 text-left text-[16px] font-semibold text-forest hover:no-underline">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[14.5px] leading-relaxed text-sage">
                    <span>{a}</span>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="bg-lime text-forest">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-14 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <h2 className="font-display max-w-[18ch] text-[clamp(28px,4.2vw,60px)]">{u.ctaHeadline}</h2>
              <p className="mt-5 max-w-[42ch] text-[15px]">{u.ctaBody}</p>
            </div>
            <div className="lg:justify-self-end">
              <Link
                href="/contact"
                className="inline-block bg-forest px-7 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-forest/90"
              >
                {u.ctaButton}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
