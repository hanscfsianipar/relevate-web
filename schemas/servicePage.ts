import { defineField, defineType } from 'sanity'

export const servicePage = defineType({
  name: 'servicePage',
  title: 'Service Page',
  type: 'document',
  groups: [
    { name: 'id', title: 'Bahasa Indonesia', default: true },
    { name: 'en', title: 'English' },
    { name: 'settings', title: 'Pengaturan' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── Settings ───────────────────────────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: { source: 'id.tagline', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Service Name',
      type: 'string',
      group: 'settings',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      group: 'settings',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'caseStudy',
      title: 'Case Study',
      type: 'object',
      group: 'settings',
      fields: [
        defineField({ name: 'slug', title: 'Slug', type: 'string' }),
        defineField({ name: 'labelId', title: 'Label (ID)', type: 'string' }),
        defineField({ name: 'labelEn', title: 'Label (EN)', type: 'string' }),
        defineField({ name: 'metaId', title: 'Meta (ID)', type: 'string' }),
        defineField({ name: 'metaEn', title: 'Meta (EN)', type: 'string' }),
      ],
    }),

    // ─── Indonesian Content ─────────────────────────────────────────────────
    defineField({
      name: 'id',
      title: 'Konten Indonesia',
      type: 'object',
      group: 'id',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
        defineField({ name: 'description', title: 'Deskripsi (untuk kartu index)', type: 'text', rows: 3 }),
        defineField({
          name: 'outcomes',
          title: 'Outcomes',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({ name: 'subtitle', title: 'Subtitle (untuk halaman detail)', type: 'string' }),
        defineField({ name: 'hero', title: 'Hero (intro paragraph)', type: 'text', rows: 6 }),
        defineField({
          name: 'problem',
          title: 'Problem (daftar situasi)',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'deliverables',
          title: 'Deliverables',
          type: 'array',
          of: [
            defineField({
              name: 'deliverable',
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Judul Fase', type: 'string' }),
                defineField({
                  name: 'items',
                  title: 'Item',
                  type: 'array',
                  of: [{ type: 'string' }],
                }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
        defineField({
          name: 'faqs',
          title: 'FAQs',
          type: 'array',
          of: [
            defineField({
              name: 'faq',
              type: 'object',
              fields: [
                defineField({ name: 'q', title: 'Pertanyaan', type: 'string' }),
                defineField({ name: 'a', title: 'Jawaban', type: 'text', rows: 4 }),
              ],
              preview: { select: { title: 'q' } },
            }),
          ],
        }),
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
        defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
        defineField({ name: 'description', title: 'Description (for index card)', type: 'text', rows: 3 }),
        defineField({
          name: 'outcomes',
          title: 'Outcomes',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({ name: 'subtitle', title: 'Subtitle (for detail page)', type: 'string' }),
        defineField({ name: 'hero', title: 'Hero (intro paragraph)', type: 'text', rows: 6 }),
        defineField({
          name: 'problem',
          title: 'Problem (list of situations)',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'deliverables',
          title: 'Deliverables',
          type: 'array',
          of: [
            defineField({
              name: 'deliverable',
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Phase Title', type: 'string' }),
                defineField({
                  name: 'items',
                  title: 'Items',
                  type: 'array',
                  of: [{ type: 'string' }],
                }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
        defineField({
          name: 'faqs',
          title: 'FAQs',
          type: 'array',
          of: [
            defineField({
              name: 'faq',
              type: 'object',
              fields: [
                defineField({ name: 'q', title: 'Question', type: 'string' }),
                defineField({ name: 'a', title: 'Answer', type: 'text', rows: 4 }),
              ],
              preview: { select: { title: 'q' } },
            }),
          ],
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
    select: { title: 'title', subtitle: 'slug.current' },
    prepare({ title, subtitle }) {
      return { title: title ?? 'Untitled Service', subtitle }
    },
  },
})
