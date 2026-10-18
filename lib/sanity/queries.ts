import { fetchList, fetchOne } from './client'

// ─── SEO ──────────────────────────────────────────────────────────────────────

export type SeoData = {
  metaTitleId?: string
  metaTitleEn?: string
  metaDescId?: string
  metaDescEn?: string
  ogImage?: { asset: { url: string } }
  noIndex?: boolean
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export type HomePageLocale = {
  rootTagline: string
  heroTagline: string
  heroHeadline: string
  heroSubheadline: string
  ctaPrimary: string
  ctaSecondary: string
  servicesTitle: string
  services: { slug: string; title: string; desc: string; ctaLabel: string }[]
  expertiseTitle: string
  ctaBannerHeadline: string
  ctaBannerCta: string
  previouslyAt: string
}

export type HomePageData = {
  id: HomePageLocale
  en: HomePageLocale
  seo?: SeoData
}

export async function getHomePage(): Promise<HomePageData | null> {
  return fetchOne(
    `*[_type == "homePage"][0] { id, en, seo { metaTitleId, metaTitleEn, metaDescId, metaDescEn, ogImage { asset->{ url } }, noIndex } }`,
    {},
    { next: { revalidate: 60 } }
  )
}

// ─── Insights ───────────────────────────────────────────────────────────────

export type InsightContent = {
  title: string
  excerpt: string
  body?: unknown[]
  authorBio?: string
}

export type InsightListItem = {
  slug: string
  shortId?: string
  category: string
  id: InsightContent
  en: InsightContent
  readTime: number
  date: string
  featureImage?: { asset: { _ref: string } }
}

export type InsightDetail = InsightListItem & { seo?: SeoData }

export async function getAllInsights(): Promise<InsightListItem[]> {
  return fetchList(
    `*[_type == "insight"] | order(date desc) {
      "slug": slug.current,
      shortId,
      category,
      id { title, excerpt },
      en { title, excerpt },
      readTime,
      date,
      featureImage
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getInsightBySlug(slug: string): Promise<InsightDetail | null> {
  return fetchOne(
    `*[_type == "insight" && slug.current == $slug][0] {
      "slug": slug.current,
      shortId,
      category,
      readTime,
      date,
      featureImage,
      id,
      en,
      seo { metaTitleId, metaTitleEn, metaDescId, metaDescEn, ogImage { asset->{ url } }, noIndex }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getAllInsightSlugs(): Promise<string[]> {
  const results = await fetchList<{ slug: string; shortId?: string }>(
    `*[_type == "insight"] { "slug": slug.current, shortId }`,
    {},
    { next: { revalidate: 3600 } }
  )
  return results.map((r) => (r.shortId ? `${r.shortId}-${r.slug}` : r.slug))
}

export async function getInsightByShortId(shortId: string): Promise<{ shortId: string; slug: string } | null> {
  return fetchOne(
    `*[_type == "insight" && shortId == $shortId][0] { shortId, "slug": slug.current }`,
    { shortId },
    { next: { revalidate: 60 } }
  )
}

// ─── Case Studies ────────────────────────────────────────────────────────────

export type CaseStudyContent = {
  title: string
  metricLabel: string
  timeframe: string
  summary?: string
  challenge?: string
  approach?: string
  results?: string
}

export type CaseStudyMetric = { stat: string; label: string; context: string }

export type CaseStudyListItem = {
  slug: string
  shortId?: string
  industry: string
  service: string
  heroMetric: string
  id: CaseStudyContent
  en: CaseStudyContent
}

export type CaseStudyDetail = CaseStudyListItem & {
  metrics: CaseStudyMetric[]
  testimonial?: { quote: string; author: string; authorTitle: string }
  seo?: SeoData
}

export async function getAllCaseStudies(): Promise<CaseStudyListItem[]> {
  return fetchList(
    `*[_type == "caseStudy"] | order(_createdAt desc) {
      "slug": slug.current,
      shortId,
      industry,
      service,
      heroMetric,
      id { title, metricLabel, timeframe, summary },
      en { title, metricLabel, timeframe, summary }
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyDetail | null> {
  return fetchOne(
    `*[_type == "caseStudy" && slug.current == $slug][0] {
      "slug": slug.current,
      shortId,
      industry,
      service,
      heroMetric,
      metrics,
      testimonial,
      id,
      en,
      seo { metaTitleId, metaTitleEn, metaDescId, metaDescEn, ogImage { asset->{ url } }, noIndex }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getAllCaseStudySlugs(): Promise<string[]> {
  const results = await fetchList<{ slug: string; shortId?: string }>(
    `*[_type == "caseStudy"] { "slug": slug.current, shortId }`,
    {},
    { next: { revalidate: 3600 } }
  )
  return results.map((r) => (r.shortId ? `${r.shortId}-${r.slug}` : r.slug))
}

export async function getCaseStudyByShortId(shortId: string): Promise<{ shortId: string; slug: string } | null> {
  return fetchOne(
    `*[_type == "caseStudy" && shortId == $shortId][0] { shortId, "slug": slug.current }`,
    { shortId },
    { next: { revalidate: 60 } }
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────

export type ExperienceContent = {
  highlight: string
  companyContext?: string
  whatIDid?: unknown[]
  achievements?: { stat: string; label: string; context: string }[]
  approach?: string
  lessons?: string
}

export type ExperienceListItem = {
  slug: string
  shortId?: string
  company: string
  logo: unknown
  role: string
  periodStart: string
  periodEnd: string | null
  industry: string
  id: ExperienceContent
  en: ExperienceContent
  tags: string[]
  metric?: { value: string; label: { id: string; en: string } }
}

export type ExperienceDetail = ExperienceListItem & {
  startDate: string
  endDate: string | null
  tools: string[]
  appraisal?: {
    period: string
    managerQuotes: { id: string; en: string }[]
  }
  seo?: SeoData
}

export async function getAllExperiences(): Promise<ExperienceListItem[]> {
  return fetchList(
    `*[_type == "experience"] | order(periodStart desc) {
      "slug": slug.current,
      shortId,
      company,
      logo,
      role,
      periodStart,
      periodEnd,
      industry,
      id { highlight },
      en { highlight },
      tags,
      metric
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getExperienceBySlug(slug: string): Promise<ExperienceDetail | null> {
  return fetchOne(
    `*[_type == "experience" && slug.current == $slug][0] {
      "slug": slug.current,
      shortId,
      company,
      logo,
      role,
      periodStart,
      periodEnd,
      startDate,
      endDate,
      industry,
      tags,
      metric,
      tools,
      appraisal,
      id,
      en,
      seo { metaTitleId, metaTitleEn, metaDescId, metaDescEn, ogImage { asset->{ url } }, noIndex }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getAllExperienceSlugs(): Promise<string[]> {
  const results = await fetchList<{ slug: string; shortId?: string }>(
    `*[_type == "experience"] { "slug": slug.current, shortId }`,
    {},
    { next: { revalidate: 3600 } }
  )
  return results.map((r) => (r.shortId ? `${r.shortId}-${r.slug}` : r.slug))
}

export async function getExperienceByShortId(shortId: string): Promise<{ shortId: string; slug: string } | null> {
  return fetchOne(
    `*[_type == "experience" && shortId == $shortId][0] { shortId, "slug": slug.current }`,
    { shortId },
    { next: { revalidate: 60 } }
  )
}

// ─── About Page ───────────────────────────────────────────────────────────────

export type AboutCoreValue = { label: string; desc: string }
export type AboutAchievement = { title: string; desc: string }
export type AboutLocale = {
  headingLine1: string
  headingLine2: string
  paragraphs?: unknown[]
  seeExperience: string
  coreValuesLabel: string
  coreValues: AboutCoreValue[]
  achievementsTitle: string
  achievements: AboutAchievement[]
  ctaHeadline: string
  ctaButton: string
}
export type SkillTag = { label: string; highlight: boolean }
export type SkillCategory = { category: string; tagline: string; tags: SkillTag[] }
export type AboutPageData = { id: AboutLocale; en: AboutLocale; skills: SkillCategory[]; seo?: SeoData }

export async function getAboutPage(): Promise<AboutPageData | null> {
  return fetchOne(
    `*[_type == "aboutPage"][0] { id, en, skills, seo { metaTitleId, metaTitleEn, metaDescId, metaDescEn, ogImage { asset->{ url } }, noIndex } }`,
    {},
    { next: { revalidate: 60 } }
  )
}

// ─── Services Page (singleton) ────────────────────────────────────────────────

export type ServicesProcessStep = { step: string; title: string; desc: string }
export type ServicesLocale = {
  processHeading: string
  process: ServicesProcessStep[]
  learnMore: string
  ctaBannerHeadline: string
}
export type ServicesPageData = { id: ServicesLocale; en: ServicesLocale; seo?: SeoData }

export async function getServicesPage(): Promise<ServicesPageData | null> {
  return fetchOne(
    `*[_type == "servicesPage"][0] { id, en, seo { metaTitleId, metaTitleEn, metaDescId, metaDescEn, ogImage { asset->{ url } }, noIndex } }`,
    {},
    { next: { revalidate: 60 } }
  )
}

// ─── Service Detail ───────────────────────────────────────────────────────────

export type ServiceFaq = { q: string; a: string }
export type ServiceDeliverable = { title: string; items: string[] }
export type ServiceLocale = {
  tagline: string
  description: string
  outcomes: string[]
  subtitle: string
  hero: string
  problem: string[]
  deliverables: ServiceDeliverable[]
  faqs: ServiceFaq[]
}
export type ServiceCaseStudy = {
  slug: string
  labelId: string
  labelEn: string
  metaId: string
  metaEn: string
}
export type ServicePageData = {
  slug: string
  title: string
  keywords: string[]
  caseStudy?: ServiceCaseStudy
  id: ServiceLocale
  en: ServiceLocale
  seo?: SeoData
}

export async function getServicePageBySlug(slug: string): Promise<ServicePageData | null> {
  return fetchOne(
    `*[_type == "servicePage" && slug.current == $slug][0] {
      "slug": slug.current,
      title,
      keywords,
      caseStudy,
      id,
      en,
      seo { metaTitleId, metaTitleEn, metaDescId, metaDescEn, ogImage { asset->{ url } }, noIndex }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

// ─── Speaking Page ────────────────────────────────────────────────────────────

export type SpeakingEvent = {
  eventName: string
  date: string
  location: string
  topicId: string
  topicEn: string
  descriptionId: string
  descriptionEn: string
  eventUrl: string
}

export type SpeakingLocale = {
  headingLine1: string
  headingLine2: string
  intro?: unknown[]
  ctaHeadline: string
  ctaButton: string
}

export type SpeakingPageData = {
  id: SpeakingLocale
  en: SpeakingLocale
  events: SpeakingEvent[]
  seo?: SeoData
}

export async function getSpeakingPage(): Promise<SpeakingPageData | null> {
  return fetchOne(
    `*[_type == "speakingPage"][0] { id, en, events, seo { metaTitleId, metaTitleEn, metaDescId, metaDescEn, ogImage { asset->{ url } }, noIndex } }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getAllServicePages(): Promise<ServicePageData[]> {
  return fetchList(
    `*[_type == "servicePage"] | order(_createdAt asc) {
      "slug": slug.current,
      title,
      keywords,
      caseStudy,
      id { tagline, description, outcomes },
      en { tagline, description, outcomes }
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

export type ContactLocale = {
  discussionHeading: string
  items: string[]
  responseNote: string
}
export type ContactPageData = {
  id: ContactLocale
  en: ContactLocale
  email: string
  linkedinUrl: string
  seo?: SeoData
}

export async function getContactPage(): Promise<ContactPageData | null> {
  return fetchOne(
    `*[_type == "contactPage"][0] { id, en, email, linkedinUrl, seo { metaTitleId, metaTitleEn, metaDescId, metaDescEn, ogImage { asset->{ url } }, noIndex } }`,
    {},
    { next: { revalidate: 60 } }
  )
}
