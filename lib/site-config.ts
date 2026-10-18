/**
 * SITE CONFIG
 * -----------
 * Satu-satunya tempat identitas brand disimpan.
 * Ubah nilai di sini, bukan di komponen satu per satu.
 *
 * CATATAN: field yang ditandai GANTI masih placeholder dan wajib dicek
 * sebelum situs dipakai publik.
 */
export const siteConfig = {
  brand: "Relevate",
  // GANTI kalau mau wordmark tanpa suffix titik.
  wordmarkSuffix: ".",

  // GANTI: positioning singkat, dipakai di halaman pemilih bahasa.
  tagline: {
    id: "Marketing Analytics & SEO",
    en: "Marketing Analytics & SEO",
  },

  // Dipakai untuk canonical, sitemap, robots, hreflang.
  // Di produksi diisi lewat env NEXT_PUBLIC_SITE_URL.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.relevate.id",

  // Fallback kalau env CONTACT_EMAIL kosong.
  contactEmail: process.env.CONTACT_EMAIL ?? "hello@relevate.id",

  // Identitas Sanity Studio (bukan project id, itu tetap via env).
  studio: {
    name: "relevate-studio",
    title: "Relevate Studio",
  },

  // GANTI: isi akun sosial resmi. Array kosong = blok sosial tidak muncul.
  socials: [] as {
    label: string;
    href: string;
    icon: "linkedin" | "instagram" | "x";
  }[],
} as const;

export type SocialLink = (typeof siteConfig)["socials"][number];
