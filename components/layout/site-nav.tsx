"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "about" as const, href: "/about" },
  { key: "experience" as const, href: "/experience" },
  { key: "services" as const, href: "/services" },
  { key: "caseStudies" as const, href: "/case-studies" },
  { key: "insights" as const, href: "/insights" },
  { key: "speaking" as const, href: "/speaking" },
];

export function SiteNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname.includes(href.replace("/", ""));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Name */}
          <Link
            href="/"
            className="font-bricolage text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            Hans
            <span className="text-accent">.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href as Parameters<typeof Link>[0]["href"]}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  isActive(href)
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild size="sm">
              <Link href="/contact">{t("contact")}</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" aria-label={t("menu")} />}>
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-1 mt-8">
                  {navLinks.map(({ key, href }) => (
                    <Link
                      key={key}
                      href={href as Parameters<typeof Link>[0]["href"]}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-3 py-2 rounded-md text-base font-medium transition-colors",
                        isActive(href)
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {t(key)}
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button asChild className="w-full">
                      <Link href="/contact" onClick={() => setOpen(false)}>
                        {t("contact")}
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
