import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  localePrefix: "always",
  localeCookie: false,
  pathnames: {
    "/": "/",
    "/about": { id: "/tentang", en: "/about" },
    "/experience": { id: "/pengalaman", en: "/experience" },
    "/experience/[slug]": { id: "/pengalaman/[slug]", en: "/experience/[slug]" },
    "/services": { id: "/layanan", en: "/services" },
    "/services/[slug]": { id: "/layanan/[slug]", en: "/services/[slug]" },
    "/case-studies": { id: "/studi-kasus", en: "/case-studies" },
    "/case-studies/[slug]": { id: "/studi-kasus/[slug]", en: "/case-studies/[slug]" },
    "/insights": { id: "/insight", en: "/insights" },
    "/insights/[slug]": { id: "/insight/[slug]", en: "/insights/[slug]" },
    "/contact": { id: "/kontak", en: "/contact" },
    "/speaking": { id: "/berbicara", en: "/speaking" },
  },
});

export type Locale = (typeof routing.locales)[number];
