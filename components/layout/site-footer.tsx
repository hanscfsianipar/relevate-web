"use client";

/* eslint-disable @next/next/no-img-element */
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Instagram, Linkedin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
};

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  const pages = [
    { label: t("nav.services"), href: "/services" },
    { label: t("nav.caseStudies"), href: "/case-studies" },
    { label: t("nav.insights"), href: "/insights" },
    { label: t("nav.about"), href: "/about" },
  ];

  return (
    <footer className="bg-forest text-cream">
      <div className="mx-auto max-w-[1320px] px-6 pt-16 pb-7 lg:px-14">
        <div className="grid gap-10 border-b border-cream/15 pb-11 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img
              src={siteConfig.logoLight}
              alt={siteConfig.brand}
              className="mb-4 h-[26px] w-auto"
            />
            <p className="max-w-[34ch] text-sm leading-relaxed text-cream/65">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <p className="kicker mb-4 text-cream/50">{t("footer.navLabel")}</p>
            <ul className="space-y-2.5">
              {pages.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href as Parameters<typeof Link>[0]["href"]}
                    className="text-[13.5px] text-cream/85 transition-colors hover:text-lime"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="kicker mb-4 text-cream/50">{t("nav.contact")}</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-[13.5px] text-cream/85 transition-colors hover:text-lime"
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
              {siteConfig.socials.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13.5px] text-cream/85 transition-colors hover:text-lime"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="kicker mb-4 text-cream/50">{t("footer.locationLabel")}</p>
            <p className="text-[13.5px] text-cream/85">{locale === "en" ? siteConfig.location.en : siteConfig.location.id}</p>
            <div className="mt-5 flex items-center gap-4">
              {siteConfig.socials.map(({ label, href, icon }) => {
                const Icon = socialIcons[icon as keyof typeof socialIcons];
                if (!Icon) return null;
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-cream/70 transition-colors hover:text-lime"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-5 text-[11px] uppercase tracking-[0.12em] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.brand}
          </p>
          <p>{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
