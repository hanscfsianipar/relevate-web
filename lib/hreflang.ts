import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

type Href = Parameters<typeof getPathname>[0]["href"];

export function getHreflangAlternates(href: Href, canonicalLocale?: string) {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    const path = getPathname({ locale, href });
    languages[locale] = `${baseUrl}${path}`;
  }

  const defaultPath = getPathname({ locale: routing.defaultLocale, href });
  languages["x-default"] = `${baseUrl}${defaultPath}`;

  const resolvedLocale = canonicalLocale ?? routing.defaultLocale;
  const canonicalPath = getPathname({ locale: resolvedLocale, href });
  const canonical = `${baseUrl}${canonicalPath}`;

  return { alternates: { languages, canonical } };
}
