import { defineField, defineType } from 'sanity'

const _speakingPageBase = defineType({
  name: 'speakingPage',
  title: 'Speaking Page',
  type: 'document',
  groups: [
    { name: 'id', title: 'Bahasa Indonesia', default: true },
    { name: 'en', title: 'English' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── Indonesian Content ─────────────────────────────────────────────────
    defineField({
      name: 'id',
      title: 'Konten Indonesia',
      type: 'object',
      group: 'id',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'headingLine1', title: 'Heading Baris 1', type: 'string' }),
        defineField({ name: 'headingLine2', title: 'Heading Baris 2', type: 'string' }),
        defineField({
          name: 'intro',
          title: 'Teks Pembuka',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({ name: 'ctaHeadline', title: 'CTA Headline', type: 'string' }),
        defineField({ name: 'ctaButton', title: 'CTA Button', type: 'string' }),
      ],
    }),

    // ─── English Content ────────────────────────────────────────────────────
    defineField({
      name: 'en',
      title: 'English Content',
      type: 'object',
      group: 'en',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'headingLine1', title: 'Heading Line 1', type: 'string' }),
        defineField({ name: 'headingLine2', title: 'Heading Line 2', type: 'string' }),
        defineField({
          name: 'intro',
          title: 'Intro Text',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({ name: 'ctaHeadline', title: 'CTA Headline', type: 'string' }),
        defineField({ name: 'ctaButton', title: 'CTA Button', type: 'string' }),
      ],
    }),

    // ─── Speaking Events ────────────────────────────────────────────────────
    defineField({
      name: 'events',
      title: 'Speaking Events',
      type: 'array',
      group: 'id',
      of: [
        defineField({
          name: 'event',
          type: 'object',
          fields: [
            defineField({ name: 'eventName', title: 'Event Name', type: 'string' }),
            defineField({ name: 'date', title: 'Date', type: 'string' }),
            defineField({ name: 'location', title: 'Location', type: 'string' }),
            defineField({ name: 'topicId', title: 'Topic (ID)', type: 'string' }),
            defineField({ name: 'topicEn', title: 'Topic (EN)', type: 'string' }),
            defineField({ name: 'descriptionId', title: 'Description (ID)', type: 'text', rows: 3 }),
            defineField({ name: 'descriptionEn', title: 'Description (EN)', type: 'text', rows: 3 }),
            defineField({ name: 'eventUrl', title: 'Event URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'eventName', subtitle: 'date' },
          },
        }),
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
      return { title: 'Speaking Page' }
    },
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const speakingPage: any = { ..._speakingPageBase, __experimental_actions: ['update', 'publish'] }
