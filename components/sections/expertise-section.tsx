"use client"

import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animate";

const skills = [
  {
    category: "SEO",
    tagline: "Intent & visibility control: beyond keyword ranking",
    tags: [
      { label: "Search Intent Modeling", highlight: true },
      { label: "SERP Positioning", highlight: true },
      { label: "Entity-Based SEO", highlight: true },
      { label: "AI / LLM Visibility Optimization", highlight: true },
      { label: "Intent Ownership Strategy", highlight: false },
      { label: "Organic Attribution Modeling", highlight: false },
      { label: "SEO Measurement Framework", highlight: false },
      { label: "Technical SEO", highlight: false },
      { label: "Core Web Vitals", highlight: false },
    ],
  },
  {
    category: "Analytics & Data",
    tagline: "Finding real drivers, not just reading what happened",
    tags: [
      { label: "Causal Analysis", highlight: true },
      { label: "Metric Engineering", highlight: true },
      { label: "Hypothesis-Driven Analysis", highlight: true },
      { label: "Signal vs Noise Analysis", highlight: true },
      { label: "Attribution Modeling", highlight: false },
      { label: "Decision-Oriented Analytics", highlight: false },
      { label: "Google Analytics 4", highlight: false },
      { label: "BigQuery", highlight: false },
      { label: "Looker Studio", highlight: false },
    ],
  },
  {
    category: "Systems & Automation",
    tagline: "Turning simple tools into scalable systems",
    tags: [
      { label: "Scalable Spreadsheet Systems", highlight: true },
      { label: "Workflow Automation", highlight: true },
      { label: "AI-Assisted Analysis", highlight: true },
      { label: "Custom Data Pipelines", highlight: false },
      { label: "Google Sheets (Advanced)", highlight: false },
      { label: "Apps Script", highlight: false },
      { label: "Google Search Console", highlight: false },
      { label: "Ahrefs", highlight: false },
    ],
  },
];

export function ExpertiseSection({ title }: { title: string }) {
  return (
    <section className="py-20 md:py-28 border-t border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-12">
          <h2 className="font-bricolage text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </h2>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map(({ category, tagline, tags }) => (
            <StaggerItem key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                {category}
              </p>
              <p className="text-xs text-muted-foreground/70 italic mb-4">{tagline}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(({ label, highlight }) => (
                  <Badge
                    key={label}
                    variant={highlight ? "default" : "secondary"}
                    className={highlight ? "font-normal bg-accent/15 text-accent border-accent/20 hover:bg-accent/20" : "font-normal"}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
