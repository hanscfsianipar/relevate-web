import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-bricolage text-xl font-semibold tracking-tight"
            >
              Hans<span className="text-accent">.</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Pages */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Pages
            </p>
            <nav className="flex flex-col gap-2">
              {[
                { label: t("nav.about"), href: "/about" },
                { label: t("nav.experience"), href: "/experience" },
                { label: t("nav.services"), href: "/services" },
                { label: t("nav.caseStudies"), href: "/case-studies" },
                { label: t("nav.insights"), href: "/insights" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href as Parameters<typeof Link>[0]["href"]}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Connect
            </p>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.contact")}
            </Link>
            <div className="flex items-center gap-3 mt-4">
              {[
                { href: "https://www.linkedin.com/in/hanscfs/", icon: Linkedin, label: "LinkedIn" },
                { href: "https://www.instagram.com/hanscfs/", icon: Instagram, label: "Instagram" },
                { href: "https://x.com/hanscfs", icon: Twitter, label: "X" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>© {year} Hans. {t("footer.rights")}</p>
          <p>Built with Next.js & Sanity</p>
        </div>
      </div>
    </footer>
  );
}
