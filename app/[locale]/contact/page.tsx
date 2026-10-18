import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getHreflangAlternates } from "@/lib/hreflang";
import { ContactForm } from "@/components/sections/contact-form";
import { getContactPage } from "@/lib/sanity/queries";

export const revalidate = 3600

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }]
}

const copy = {
  id: {
    discussionHeading: "Yang bisa kita diskusikan",
    items: [
      "Audit SEO atau strategy baru",
      "Setup atau audit GA4 & GTM",
      "Dashboard analytics & reporting",
      "Konsultasi 1-on-1",
      "Proyek custom lainnya",
    ],
    responseNote: "Kami biasanya merespons dalam 24 jam.",
  },
  en: {
    discussionHeading: "What we can discuss",
    items: [
      "SEO audit or new strategy",
      "GA4 & GTM setup or audit",
      "Analytics dashboards & reporting",
      "1-on-1 consultation",
      "Custom projects",
    ],
    responseNote: "I usually respond within 24 hours.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const sanityData = await getContactPage();
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
    ...getHreflangAlternates("/contact", locale),
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const sanityData = await getContactPage();

  const c = sanityData
    ? (locale === "en" ? sanityData.en : sanityData.id)
    : (locale === "en" ? copy.en : copy.id);

  const linkedinUrl = sanityData?.linkedinUrl ?? "";

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {t("title")}
            </p>
            <h1 className="font-bricolage text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              {t("description")}
            </p>

            <div className="space-y-6">
              <div className="rounded-xl border border-border p-5 bg-card">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  {c.discussionHeading}
                </p>
                <ul className="space-y-2">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="font-medium text-foreground">LinkedIn:</span>{" "}
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    {linkedinUrl.replace(/^https?:\/\//, "")}
                  </a>
                </p>
                <p className="text-xs pt-2">{c.responseNote}</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
