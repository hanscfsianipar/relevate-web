"use client"

import { motion } from "framer-motion"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const ease = [0.25, 0.1, 0.25, 1] as const

type HeroSectionProps = {
  tagline: string
  headline: string
  subheadline: string
  ctaPrimary: string
  ctaSecondary: string
}

export function HeroSection({ tagline, headline, subheadline, ctaPrimary, ctaSecondary }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, oklch(0.18 0.01 60) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 md:py-36 lg:py-44">
        <div className="max-w-3xl">
          {/* Tagline pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-border text-xs font-medium text-muted-foreground uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {tagline}
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-foreground mb-6"
          >
            {headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.22 }}
            className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl mb-10"
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.35 }}
            className="flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="gap-2">
              <Link href="/case-studies">
                {ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">{ctaSecondary}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
