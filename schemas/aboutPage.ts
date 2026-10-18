import { defineField, defineType } from 'sanity'

const _aboutPageBase = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'id', title: 'Bahasa Indonesia', default: true },
    { name: 'en', title: 'English' },
    { name: 'settings', title: 'Pengaturan' },
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
          name: 'paragraphs',
          title: 'Paragraf',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({ name: 'seeExperience', title: 'Label Link Pengalaman', type: 'string' }),
        defineField({ name: 'coreValuesLabel', title: 'Label Keahlian Utama', type: 'string' }),
        defineField({
          name: 'coreValues',
          title: 'Keahlian Utama',
          type: 'array',
          of: [
            defineField({
              name: 'coreValue',
              type: 'object',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'desc', title: 'Deskripsi', type: 'text', rows: 2 }),
              ],
              preview: { select: { title: 'label' } },
            }),
          ],
        }),
        defineField({ name: 'achievementsTitle', title: 'Judul Pencapaian', type: 'string' }),
        defineField({
          name: 'achievements',
          title: 'Pencapaian',
          type: 'array',
          of: [
            defineField({
              name: 'achievement',
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Judul', type: 'string' }),
                defineField({ name: 'desc', title: 'Deskripsi', type: 'text', rows: 3 }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
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
          name: 'paragraphs',
          title: 'Paragraphs',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({ name: 'seeExperience', title: 'Experience Link Label', type: 'string' }),
        defineField({ name: 'coreValuesLabel', title: 'Core Values Label', type: 'string' }),
        defineField({
          name: 'coreValues',
          title: 'Core Values',
          type: 'array',
          of: [
            defineField({
              name: 'coreValue',
              type: 'object',
              fields: [
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'desc', title: 'Description', type: 'text', rows: 2 }),
              ],
              preview: { select: { title: 'label' } },
            }),
          ],
        }),
        defineField({ name: 'achievementsTitle', title: 'Achievements Title', type: 'string' }),
        defineField({
          name: 'achievements',
          title: 'Achievements',
          type: 'array',
          of: [
            defineField({
              name: 'achievement',
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'desc', title: 'Description', type: 'text', rows: 3 }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
        defineField({ name: 'ctaHeadline', title: 'CTA Headline', type: 'string' }),
        defineField({ name: 'ctaButton', title: 'CTA Button', type: 'string' }),
      ],
    }),

    // ─── Settings ───────────────────────────────────────────────────────────
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      group: 'settings',
      of: [
        defineField({
          name: 'skillCategory',
          type: 'object',
          fields: [
            defineField({ name: 'category', title: 'Category', type: 'string' }),
            defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
            defineField({
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [
                defineField({
                  name: 'tag',
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'highlight', title: 'Highlight', type: 'boolean' }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'highlight' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'category' } },
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
      return { title: 'About Page' }
    },
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const aboutPage: any = { ..._aboutPageBase, __experimental_actions: ['update', 'publish'] }
