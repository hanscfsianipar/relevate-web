import { defineField, defineType } from 'sanity'

const serviceCardFields = [
  defineField({ name: 'slug', title: 'Slug', type: 'string' }),
  defineField({ name: 'title', title: 'Title', type: 'string' }),
  defineField({ name: 'desc', title: 'Description', type: 'text', rows: 2 }),
  defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
]

const _homePageBase = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'id', title: 'Bahasa Indonesia', default: true },
    { name: 'en', title: 'English' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── Indonesian Content ──────────────────────────────────────────────────
    defineField({
      name: 'id',
      title: 'Konten Indonesia',
      type: 'object',
      group: 'id',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'rootTagline', title: 'Tagline di halaman pemilih bahasa (/)', type: 'string' }),
        defineField({ name: 'heroTagline', title: 'Tagline pill di hero', type: 'string' }),
        defineField({ name: 'heroHeadline', title: 'Headline utama hero', type: 'string' }),
        defineField({ name: 'heroSubheadline', title: 'Subheadline hero', type: 'text', rows: 3 }),
        defineField({ name: 'ctaPrimary', title: 'Teks tombol CTA utama', type: 'string' }),
        defineField({ name: 'ctaSecondary', title: 'Teks tombol CTA sekunder', type: 'string' }),
        defineField({ name: 'servicesTitle', title: 'Judul seksi layanan', type: 'string' }),
        defineField({
          name: 'services',
          title: '3 service cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: serviceCardFields,
              preview: { select: { title: 'title' } },
            },
          ],
        }),
        defineField({ name: 'expertiseTitle', title: 'Judul seksi keahlian', type: 'string' }),
        defineField({ name: 'ctaBannerHeadline', title: 'CTA banner headline', type: 'string' }),
        defineField({ name: 'ctaBannerCta', title: 'CTA banner tombol', type: 'string' }),
        defineField({ name: 'previouslyAt', title: 'Label strip logo perusahaan', type: 'string' }),
      ],
    }),

    // ─── English Content ─────────────────────────────────────────────────────
    defineField({
      name: 'en',
      title: 'English Content',
      type: 'object',
      group: 'en',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'rootTagline', title: 'Tagline on language selector page (/)', type: 'string' }),
        defineField({ name: 'heroTagline', title: 'Hero tagline pill', type: 'string' }),
        defineField({ name: 'heroHeadline', title: 'Main hero headline', type: 'string' }),
        defineField({ name: 'heroSubheadline', title: 'Hero subheadline', type: 'text', rows: 3 }),
        defineField({ name: 'ctaPrimary', title: 'Primary CTA button text', type: 'string' }),
        defineField({ name: 'ctaSecondary', title: 'Secondary CTA button text', type: 'string' }),
        defineField({ name: 'servicesTitle', title: 'Services section title', type: 'string' }),
        defineField({
          name: 'services',
          title: '3 service cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: serviceCardFields,
              preview: { select: { title: 'title' } },
            },
          ],
        }),
        defineField({ name: 'expertiseTitle', title: 'Expertise section title', type: 'string' }),
        defineField({ name: 'ctaBannerHeadline', title: 'CTA banner headline', type: 'string' }),
        defineField({ name: 'ctaBannerCta', title: 'CTA banner button', type: 'string' }),
        defineField({ name: 'previouslyAt', title: 'Company logo strip label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const homePage: any = { ..._homePageBase, __experimental_actions: ['update', 'publish'] }
