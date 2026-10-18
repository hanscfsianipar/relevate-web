"use client"

import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, TrendingUp, BarChart3, Search } from "lucide-react";
import type { ComponentProps } from "react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animate";

type LinkHref = ComponentProps<typeof Link>["href"];

const services: {
  key: string;
  icon: React.ElementType;
  href: LinkHref;
  slug: string;
  title: string;
  desc: { id: string; en: string };
  cta: { id: string; en: string };
}[] = [
  {
    key: "seo",
    icon: Search,
    href: { pathname: "/services/[slug]", params: { slug: "seo-consulting" } },
    slug: "seo-consulting",
    title: "SEO Consulting",
    desc: {
      id: "Saya tidak hanya lapor traffic naik. Saya cari driver yang sesungguhnya dan jelaskan apa yang harus diubah.",
      en: "I don't just report traffic going up. I find the real drivers and explain what needs to change.",
    },
    cta: { id: "Pelajari lebih lanjut", en: "Learn more" },
  },
  {
    key: "analytics",
    icon: BarChart3,
    href: { pathname: "/services/[slug]", params: { slug: "marketing-analytics" } },
    slug: "marketing-analytics",
    title: "Marketing Analytics",
    desc: {
      id: "Saya bantu tim menemukan mana yang real signal dan mana yang noise, supaya keputusan tidak lagi berbasis tebakan.",
      en: "I help teams separate real signal from noise, so decisions aren't based on guesswork.",
    },
    cta: { id: "Pelajari lebih lanjut", en: "Learn more" },
  },
  {
    key: "growth",
    icon: TrendingUp,
    href: "/services",
    slug: "services",
    title: "Growth Strategy",
    desc: {
      id: "Menggabungkan causal thinking, sistem data, dan strategi untuk menciptakan pertumbuhan yang bisa dijelaskan logikanya.",
      en: "Combining causal thinking, data systems, and strategy to build growth that can be logically explained.",
    },
    cta: { id: "Lihat semua layanan", en: "View all services" },
  },
];

function getIcon(slug: string): React.ElementType {
  if (slug === 'seo-consulting') return Search
  if (slug === 'marketing-analytics') return BarChart3
  return TrendingUp
}

function getHref(slug: string): LinkHref {
  if (slug === 'seo-consulting') return { pathname: "/services/[slug]", params: { slug: "seo-consulting" } }
  if (slug === 'marketing-analytics') return { pathname: "/services/[slug]", params: { slug: "marketing-analytics" } }
  return "/services"
}

type ServicesSnapshotProps = {
  title: string
  services: { slug: string; title: string; desc: string; ctaLabel: string }[] | null
  locale: string
}

export function ServicesSnapshot({ title, services: sanityServices, locale }: ServicesSnapshotProps) {
  return (
    <section className="py-20 md:py-28 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12">
          <h2 className="font-bricolage text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </h2>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sanityServices
            ? sanityServices.map((s) => {
                const Icon = getIcon(s.slug)
                const href = getHref(s.slug)
                return (
                  <StaggerItem key={s.slug}>
                  <Link href={href} className="block h-full">
                    <Card className="h-full group hover:border-foreground/20 transition-colors cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="font-bricolage text-lg font-semibold tracking-tight">
                          {s.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {s.desc}
                        </p>
                        <div className="flex items-center gap-1 mt-4 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {s.ctaLabel}
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  </StaggerItem>
                )
              })
            : services.map(({ key, icon: Icon, href, title: svcTitle, desc, cta }) => (
                <StaggerItem key={key}>
                <Link href={href} className="block h-full">
                  <Card className="h-full group hover:border-foreground/20 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-bricolage text-lg font-semibold tracking-tight">
                        {svcTitle}
                      </h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {locale === "en" ? desc.en : desc.id}
                      </p>
                      <div className="flex items-center gap-1 mt-4 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {locale === "en" ? cta.en : cta.id}
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                </StaggerItem>
              ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
