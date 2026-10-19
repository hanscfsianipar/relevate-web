/**
 * SITE CONFIG
 * -----------
 * Satu-satunya tempat identitas brand disimpan.
 * Ubah nilai di sini, bukan di komponen satu per satu.
 */

export const siteConfig = {
  brand: "Relevate",
  wordmarkSuffix: ".",

  tagline: {
    id: "Agensi SEO dan AI Search",
    en: "SEO and AI Search Agency",
  },

  // Dipakai untuk canonical, sitemap, robots, hreflang.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.relevate.id",

  contactEmail: process.env.CONTACT_EMAIL ?? "hello@relevate.id",

  // Wordmark untuk latar gelap. Asset di Sanity, bukan di public/.
  logoLight:
    "https://cdn.sanity.io/images/pcx1y31m/production/7a4758c169805d30c86a639558c43f109e585f4c-1144x233.png",

  location: {
    id: "Jakarta, Indonesia",
    en: "Jakarta, Indonesia",
  },

  studio: {
    name: "relevate-studio",
    title: "Relevate Studio",
  },

  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/relevate.id/",
      icon: "instagram",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/relevate-seo-agency",
      icon: "linkedin",
    },
    {
      label: "Threads",
      href: "https://www.threads.com/@relevate.id",
      icon: "threads",
    },
  ] as {
    label: string;
    href: string;
    icon: "linkedin" | "instagram" | "x" | "threads";
  }[],
} as const;

export type SocialLink = (typeof siteConfig)["socials"][number];
