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
  { key: "home" as const, href: "/" },
  { key: "services" as const, href: "/services" },
  { key: "clients" as const, href: "/#klien" },
  { key: "portfolio" as const, href: "/case-studies" },
  { key: "news" as const, href: "/insights" },
  { key: "about" as const, href: "/about" },
];

const serviceKeys = ["svc1Title", "svc2Title", "svc3Title", "svc4Title"] as const;

export function SiteNav() {
  const t = useTranslations("nav");
  const th = useTranslations("home");
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href !== "/" && pathname.includes(href.replace("/", ""));

  return (
    <header className="sticky top-0 z-50 w-full bg-forest text-cream">
      <div className="mx-auto flex h-[78px] max-w-[1320px] items-center gap-7 px-6 lg:px-14">
        <Link href="/" aria-label={siteConfig.brand} className="shrink-0">
          <img
            src={siteConfig.logoLight}
            alt={siteConfig.brand}
            className="h-[23px] w-auto"
          />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainLinks.map(({ key, href }) =>
            key === "services" ? (
              <div key={key} className="group relative">
                <Link
                  href="/services"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                    isActive(href) ? "text-cream" : "text-cream/75 hover:text-cream"
                  )}
                >
                  {t(key)}
                  <span className="h-1.5 w-1.5 rotate-45 border-b border-r border-current opacity-60" />
                </Link>
                <ul className="invisible absolute left-0 top-full z-50 min-w-[236px] border border-forest/15 bg-cream p-2 opacity-0 shadow-xl transition-opacity group-hover:visible group-hover:opacity-100">
                  {serviceKeys.map((k) => (
                    <li key={k}>
                      <Link
                        href="/services"
                        className="block px-3 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-forest transition-colors hover:bg-sand"
                      >
                        {th(k)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              key === "clients" ? (
                <a
                  key={key}
                  href={`/${locale}#klien`}
                  className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cream/75 transition-colors hover:text-cream"
                >
                  {t(key)}
                </a>
              ) : (
                <Link
                  key={key}
                  href={href as Parameters<typeof Link>[0]["href"]}
                  className={cn(
                    "px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                    isActive(href) ? "text-cream" : "text-cream/75 hover:text-cream"
                  )}
                >
                  {t(key)}
                </Link>
              )
            )
          )}
        </nav>

        {/* Right */}
        <div className="ml-auto hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="bg-lime px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-forest transition-colors hover:bg-[#8FB335]"
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
                {mainLinks.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href as Parameters<typeof Link>[0]["href"]}
                    onClick={() => setOpen(false)}
                    className="border-b border-forest/10 px-1 py-4 text-xs font-bold uppercase tracking-[0.16em] text-forest"
                  >
                    {t(key)}
                  </Link>
                ))}
                <div className="mt-6 border-t border-forest/10 pt-4">
                  {serviceKeys.map((k) => (
                    <Link
                      key={k}
                      href="/services"
                      onClick={() => setOpen(false)}
                      className="block px-1 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      {th(k)}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-6 bg-lime px-5 py-4 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-forest"
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
