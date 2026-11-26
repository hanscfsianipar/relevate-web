import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { Link } from "@/i18n/navigation";
import { getServicesPage } from "@/lib/sanity/queries";

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

type Service = {
  num: string;
  name: string;
  claim: string;
  body: string;
  points: string[];
  href?: string;
  action: string;
};

const copy = {
  id: {
    kicker: "Layanan",
    titlePre: "Empat cara kami",
    titleAccent: "menumbuhkan",
    titlePost: "bisnis Anda.",
    intro:
      "Setiap layanan berdiri di atas pekerjaan yang sama: memahami dulu, baru mengeksekusi. Tidak ada paket yang dipaksakan ke bisnis yang belum kami pahami.",
    ctaPrimary: "Jadwalkan diskusi gratis",
    ctaSecondary: "Lihat cara kerja",
    index: [
      "Audit & Optimasi Teknikal",
      "Konten E-E-A-T",
      "GEO & AEO",
      "Strategi SEO Jangka Panjang",
    ],
    rowsKicker: "Yang kami kerjakan",
    rowsTitle: "Bukan daftar panjang. Empat yang benar-benar dijalankan.",
    rowsLead: "Setiap baris punya ukuran keberhasilan yang bisa Anda periksa sendiri.",
    extraLabel: "Butuh pengukuran dan analitik?",
    extraLink: "Lihat Marketing Analytics",
    processKicker: "Cara kerja",
    processTitle: "Empat langkah, urutannya tidak boleh dibalik.",
    processLead: "Diagnosis dulu, keputusan kemudian, eksekusi terakhir.",
    process: [
      { title: "Pahami", body: "Model bisnis, hambatan, dan peluang yang sudah terlihat." },
      { title: "Diagnosis", body: "Akar masalah, bukan gejala yang paling mudah dilihat." },
      { title: "Eksekusi", body: "Perbaikan teknikal dan konten sesuai prioritas dampak." },
      { title: "Ukur", body: "Perubahan dibandingkan dengan kondisi awal, bukan dengan perasaan." },
    ],
    ctaHeadline: "Belum yakin mulai dari layanan mana?",
    ctaBody: "Ceritakan kondisi situs Anda. Kami tunjukkan mana yang paling mendesak dan mana yang bisa menunggu.",
    ctaButton: "Mulai dari konsultasi gratis",
    services: [
      {
        num: "01",
        name: "Audit & Optimasi Teknikal",
        claim: "Fondasi yang tidak terlihat, tapi menentukan semuanya.",
        body: "Technical debt menumpuk diam-diam: canonical yang saling bertabrakan, halaman yang terlihat kosong oleh Googlebot, mobile yang menyajikan hal berbeda dari desktop.",
        points: ["Audit canonical dan indexability", "Rendering audit untuk situs React atau SPA", "Schema dan Core Web Vitals"],
        href: "/services/seo-consulting",
        action: "Selengkapnya",
      },
      {
        num: "02",
        name: "Konten E-E-A-T",
        claim: "Dinilai dari siapa yang menulis dan apa yang bisa dibuktikan.",
        body: "Konten yang tumbuh bukan yang paling panjang, tapi yang jelas penulisnya, jelas sumbernya, dan menjawab pertanyaan pembaca tanpa berputar.",
        points: ["Struktur topik dan klaster", "Brief penulisan yang bisa dieksekusi", "Pemeriksaan klaim dan sumber"],
        action: "Diskusikan",
      },
      {
        num: "03",
        name: "GEO & AEO",
        claim: "Muncul di jawaban AI, bukan hanya di halaman hasil pencarian.",
        body: "Mesin jawaban menyusun ulang informasi. Kami menyiapkan struktur, entitas, dan bukti yang membuat bisnis Anda layak disebut di dalam jawaban itu.",
        points: ["Kesiapan entitas dan kutipan", "Struktur jawaban yang mudah diambil", "Pemantauan sebutan merek di AI"],
        action: "Diskusikan",
      },
      {
        num: "04",
        name: "Strategi SEO Jangka Panjang",
        claim: "Prioritas yang dipilih karena dampak, bukan karena tren.",
        body: "Rencana enam sampai dua belas bulan dengan urutan kerja yang jelas, sehingga Anda tahu apa yang dikerjakan bulan ini dan mengapa bukan yang lain.",
        points: ["Peta jalan per kuartal", "Prioritas berdasarkan dampak dan usaha", "Review bulanan dengan kesimpulan"],
        action: "Diskusikan",
      },
    ] as Service[],
  },
  en: {
    kicker: "Services",
    titlePre: "Four ways we",
    titleAccent: "grow",
    titlePost: "your business.",
    intro:
      "Every service rests on the same work: understand first, execute second. No package forced onto a business we have not understood yet.",
    ctaPrimary: "Book a free consultation",
    ctaSecondary: "See how we work",
    index: [
      "Technical Audit & Optimization",
      "E-E-A-T Content",
      "GEO & AEO",
      "Long Term SEO Strategy",
    ],
    rowsKicker: "What we do",
    rowsTitle: "Not a long list. Four we actually run.",
    rowsLead: "Every row has a measure of success you can check yourself.",
    extraLabel: "Need measurement and analytics?",
    extraLink: "See Marketing Analytics",
    processKicker: "How we work",
    processTitle: "Four steps, in an order that cannot be reversed.",
    processLead: "Diagnosis first, decisions next, execution last.",
    process: [
      { title: "Understand", body: "Business model, constraints, and opportunity already visible." },
      { title: "Diagnose", body: "The root cause, not the symptom easiest to spot." },
      { title: "Execute", body: "Technical and content fixes ordered by impact." },
      { title: "Measure", body: "Movement compared to the starting point, not to a feeling." },
    ],
    ctaHeadline: "Not sure which service to start with?",
    ctaBody: "Tell us the state of your site. We will show you what is urgent and what can wait.",
    ctaButton: "Start with a free consultation",
    services: [
      {
        num: "01",
        name: "Technical Audit & Optimization",
        claim: "The foundation nobody sees, that decides everything.",
        body: "Technical debt quietly accumulates: conflicting canonicals, pages that look empty to Googlebot, mobile serving something different from desktop.",
        points: ["Canonical and indexability audit", "Rendering audit for React or SPA sites", "Schema and Core Web Vitals"],
        href: "/services/seo-consulting",
        action: "Read more",
      },
      {
        num: "02",
        name: "E-E-A-T Content",
        claim: "Judged by who wrote it and what can be proven.",
        body: "Content that grows is not the longest one, it is the one with a clear author, clear sources, and answers that do not circle around the question.",
        points: ["Topic structure and clusters", "Writing briefs that can be executed", "Claim and source review"],
        action: "Talk to us",
      },
      {
        num: "03",
        name: "GEO & AEO",
        claim: "Visible in AI answers, not only in search results.",
        body: "Answer engines reassemble information. We prepare the structure, entities, and evidence that make your business worth mentioning inside that answer.",
        points: ["Entity and citation readiness", "Answer structure that is easy to lift", "Brand mention monitoring in AI"],
        action: "Talk to us",
      },
      {
        num: "04",
        name: "Long Term SEO Strategy",
        claim: "Priorities chosen for impact, not for trend.",
        body: "A six to twelve month plan with a clear working order, so you know what happens this month and why not something else.",
        points: ["Quarterly roadmap", "Priority by impact and effort", "Monthly review with conclusions"],
        action: "Talk to us",
      },
    ] as Service[],
  },
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = locale === "en" ? copy.en : copy.id;

  return (
    <>
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-[1320px] px-6 pt-16 pb-12 lg:px-14 lg:pt-28 lg:pb-14">
          <span className="kicker text-cream/60">{c.kicker}</span>
          <h1 className="font-display mt-6 max-w-[24ch] text-[clamp(32px,4.9vw,70px)]">
            {c.titlePre} <span className="text-lime">{c.titleAccent}</span> {c.titlePost}
          </h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-[46ch] text-[15.5px] leading-relaxed text-cream/80">{c.intro}</p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/contact"
                className="bg-lime px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-forest transition-colors hover:bg-[#8FB335]"
              >
                {c.ctaPrimary}
              </Link>
              <a
                href="#cara-kerja"
                className="border border-cream/25 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream/10"
              >
                {c.ctaSecondary}
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cream/20 pt-5 md:grid-cols-4">
            {c.index.map((label, i) => (
              <div key={label}>
                <span className="block text-[11px] font-bold tracking-[0.16em] text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1.5 block text-[12.5px] font-bold uppercase tracking-[0.14em] text-cream/90">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest pb-16 text-cream lg:pb-24">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
          <div className="mb-10 border-t border-cream/20 pt-8 lg:mb-14">
            <span className="kicker text-lime">{c.rowsKicker}</span>
            <h2 className="font-display mt-4 max-w-[22ch] text-[clamp(24px,3.2vw,42px)]">
              {c.rowsTitle}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[14.5px] text-cream/70">{c.rowsLead}</p>
          </div>

          <div className="border-t border-cream/20">
            {c.services.map((s) => {
              const inner = (
                <>
                  <span className="pt-2 text-[12px] font-bold tracking-[0.14em] text-lime">{s.num}</span>
                  <div>
                    <h3 className="font-display text-[clamp(22px,2.6vw,34px)]">{s.name}</h3>
                    <p className="mt-3 max-w-[42ch] text-[14.5px] text-cream/75">{s.body}</p>
                    <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.14em] text-cream/50">
                      {s.claim}
                    </p>
                  </div>
                  <ul className="space-y-2.5 pt-1">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 border-b border-cream/10 pb-2.5 text-[13.5px] text-cream/70 last:border-0"
                      >
                        <span className="text-lime">+</span>
                        {p}
                      </li>
                    ))}
                    <li className="pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cream">
                      {s.action} →
                    </li>
                  </ul>
                </>
              );

              return s.href ? (
                <Link
                  key={s.num}
                  href={s.href as Parameters<typeof Link>[0]["href"]}
                  className="grid gap-4 border-b border-cream/20 py-8 transition-colors hover:bg-cream/[0.03] md:grid-cols-[60px_1fr_0.9fr] md:gap-8 lg:py-10"
                >
                  {inner}
                </Link>
              ) : (
                <Link
                  key={s.num}
                  href="/contact"
                  className="grid gap-4 border-b border-cream/20 py-8 transition-colors hover:bg-cream/[0.03] md:grid-cols-[60px_1fr_0.9fr] md:gap-8 lg:py-10"
                >
                  {inner}
                </Link>
              );
            })}
          </div>

          <p className="mt-8 text-[14px] text-cream/60">
            {c.extraLabel}{" "}
            <Link
              href={"/services/marketing-analytics" as Parameters<typeof Link>[0]["href"]}
              className="border-b border-lime pb-0.5 font-semibold text-lime transition-opacity hover:opacity-80"
            >
              {c.extraLink}
            </Link>
          </p>
        </div>
      </section>

      <section id="cara-kerja" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-14">
          <span className="kicker text-sage">{c.processKicker}</span>
          <h2 className="font-display mt-4 max-w-[24ch] text-[clamp(26px,3.9vw,56px)] text-forest">
            {c.processTitle}
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15px] text-sage">{c.processLead}</p>

          <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {c.process.map((step, i) => (
              <div key={step.title} className="border-t border-forest/15 pt-5">
                <span className="text-[13px] font-bold tracking-[0.14em] text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[19px] font-bold leading-snug text-forest">{step.title}</h3>
                <p className="mt-2 max-w-[34ch] text-[14.5px] text-sage">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lime text-forest">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-14 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <h2 className="font-display max-w-[20ch] text-[clamp(28px,4.2vw,60px)]">{c.ctaHeadline}</h2>
              <p className="mt-5 max-w-[44ch] text-[15px] text-forest">{c.ctaBody}</p>
            </div>
            <div className="lg:justify-self-end">
              <Link
                href="/contact"
                className="inline-block bg-forest px-7 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-forest/90"
              >
                {c.ctaButton}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
