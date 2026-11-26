"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

const mainLinks = [
  { key: "home" as const, href: "/", segments: [] as string[] },
  { key: "services" as const, href: "/services", segments: ["layanan", "services"] },
  { key: "clients" as const, href: "/#klien", segments: [] as string[] },
  { key: "portfolio" as const, href: "/case-studies", segments: ["studi-kasus", "case-studies"] },
  { key: "blog" as const, href: "/insights", segments: ["insight", "insights"] },
  { key: "about" as const, href: "/about", segments: ["tentang", "about"] },
];

/** Segmen pertama setelah locale, misal /id/layanan/seo-consulting -> "layanan". */
function firstSegment(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  return parts.length <= 1 ? "" : parts[1];
}

function isKeyActive(pathname: string, segments: readonly string[], isHome: boolean): boolean {
  const first = firstSegment(pathname);
  if (isHome) return first === "";
  return segments.includes(first);
}

export function SiteNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const activeKey =
    mainLinks.find(({ key, segments }) =>
      isKeyActive(pathname, segments, key === "home")
    )?.key ?? null;

  const isContact = firstSegment(pathname) === "kontak" || firstSegment(pathname) === "contact";

  return (
    <header className="sticky top-0 z-50 w-full bg-forest text-cream">
      <div className="mx-auto flex h-[78px] max-w-[1320px] items-center gap-7 px-6 lg:px-14">
        <Link href="/" aria-label={siteConfig.brand} className="shrink-0">
          <img
            src={siteConfig.logoLight}
            alt={siteConfig.brand}
            width={1144}
            height={233}
            className="h-[23px] w-auto"
          />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainLinks.map(({ key, href, segments }) => {
            const active = activeKey === key;

            if (key === "blog") {
              return (
                <div key={key} className="group relative">
                  <Link
                    href="/insights"
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                      active ? "text-cream" : "text-cream/75 hover:text-cream"
                    )}
                  >
                    {t(key)}
                    <span className="h-1.5 w-1.5 rotate-45 border-b border-r border-current opacity-60" />
                    <span
                      className={cn(
                        "absolute inset-x-3 bottom-0 h-[2px] bg-lime transition-opacity",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </Link>
                  <ul className="invisible absolute left-0 top-full z-50 min-w-[200px] border border-forest/15 bg-cream p-2 opacity-0 shadow-xl transition-opacity group-hover:visible group-hover:opacity-100">
                    {(["blogArticles", "blogNews"] as const).map((k) => (
                      <li key={k}>
                        <Link
                          href="/insights"
                          className="block px-3 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-forest transition-colors hover:bg-sand"
                        >
                          {t(k)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            if (key === "clients") {
              return (
                <a
                  key={key}
                  href={`/${locale}#klien`}
                  className="relative px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cream/75 transition-colors hover:text-cream"
                >
                  {t(key)}
                </a>
              );
            }

            return (
              <Link
                key={key}
                href={href as Parameters<typeof Link>[0]["href"]}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                  active ? "text-cream" : "text-cream/75 hover:text-cream"
                )}
              >
                {t(key)}
                <span
                  className={cn(
                    "absolute inset-x-3 bottom-0 h-[2px] bg-lime transition-opacity",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="ml-auto hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/contact"
            aria-current={isContact ? "page" : undefined}
            className={cn(
              "px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
              isContact
                ? "bg-[#8FB335] text-forest"
                : "bg-lime text-forest hover:bg-[#8FB335]"
            )}
          >
            {t("contact")}
          </Link>
        </div>

        {/* Mobile */}
        <div className="ml-auto flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" aria-label={t("menu")} className="text-cream hover:bg-cream/10 hover:text-cream" />}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-cream">
              <nav className="mt-10 flex flex-col">
                {mainLinks.map(({ key, href }) => {
                  const active = activeKey === key;
                  return (
                    <Link
                      key={key}
                      href={href as Parameters<typeof Link>[0]["href"]}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 border-b border-forest/10 px-1 py-4 text-xs font-bold uppercase tracking-[0.16em]",
                        active ? "text-forest" : "text-forest/70"
                      )}
                    >
                      <span
                        className={cn(
                          "h-3 w-[3px]",
                          active ? "bg-lime" : "bg-transparent"
                        )}
                      />
                      {t(key)}
                    </Link>
                  );
                })}

                <div className="mt-6 border-t border-forest/10 pt-4">
                  {(["blogArticles", "blogNews"] as const).map((k) => (
                    <Link
                      key={k}
                      href="/insights"
                      onClick={() => setOpen(false)}
                      className="block px-1 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      {t(k)}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "mt-6 px-5 py-4 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-forest",
                    isContact ? "bg-[#8FB335]" : "bg-lime"
                  )}
                >
                  {t("contact")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
