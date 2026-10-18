import { defineField, defineType } from 'sanity'
import { ShortIdInput } from './components/ShortIdInput'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  groups: [
    { name: 'id', title: 'Bahasa Indonesia', default: true },
    { name: 'en', title: 'English' },
    { name: 'settings', title: 'Pengaturan' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'shortId',
      title: 'Short ID',
      type: 'string',
      group: 'settings',
      description: 'ID permanen untuk URL stabil. Jangan ubah setelah publish. Format: cs001, cs002, ...',
      components: { input: ShortIdInput },
      validation: (r) =>
        r
          .regex(/^cs\d{3,}$/, { name: 'format shortId', invert: false })
          .custom(async (value, ctx) => {
            if (!value) return true
            const client = ctx.getClient({ apiVersion: '2024-01-01' })
            const docId = ctx.document?._id ?? ''
            const baseId = docId.replace(/^drafts\./, '')
            const existing = await client.fetch(
              `*[_type == "caseStudy" && shortId == $value && _id != $docId && _id != $baseId][0]._id`,
              { value, docId, baseId }
            )
            return existing ? 'Short ID sudah dipakai di case study lain' : true
          }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: { source: 'id.title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'industry', title: 'Industry', type: 'string', group: 'settings', validation: (r) => r.required() }),
    defineField({ name: 'service', title: 'Service', type: 'string', group: 'settings', validation: (r) => r.required() }),
    defineField({
      name: 'heroMetric',
      title: 'Hero Metric (contoh: "13x")',
      type: 'string',
      group: 'settings',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics (sidebar)',
      type: 'array',
      group: 'settings',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'stat', title: 'Stat', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'context', title: 'Context', type: 'string' }),
          ],
          preview: { select: { title: 'stat', subtitle: 'label' } },
        },
      ],
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial (opsional)',
      type: 'object',
      group: 'settings',
      fields: [
        defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
        defineField({ name: 'author', title: 'Author', type: 'string' }),
        defineField({ name: 'authorTitle', title: 'Author Title', type: 'string' }),
      ],
    }),
    defineField({
      name: 'id',
      title: 'Konten Indonesia',
      type: 'object',
      group: 'id',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'title', title: 'Judul', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'metricLabel', title: 'Label Metrik (contoh: "Peningkatan impressi organik")', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'timeframe', title: 'Rentang Waktu', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'summary', title: 'Ringkasan (tampilan list)', type: 'text', rows: 3 }),
        defineField({ name: 'challenge', title: 'Tantangan', type: 'text', rows: 6 }),
        defineField({ name: 'approach', title: 'Pendekatan', type: 'text', rows: 6 }),
        defineField({ name: 'results', title: 'Hasil', type: 'text', rows: 6 }),
      ],
    }),
    defineField({
      name: 'en',
      title: 'English Content',
      type: 'object',
      group: 'en',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'metricLabel', title: 'Metric Label (e.g. "Organic impression increase")', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'timeframe', title: 'Timeframe', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'summary', title: 'Summary (list view)', type: 'text', rows: 3 }),
        defineField({ name: 'challenge', title: 'Challenge', type: 'text', rows: 6 }),
        defineField({ name: 'approach', title: 'Approach', type: 'text', rows: 6 }),
        defineField({ name: 'results', title: 'Results', type: 'text', rows: 6 }),
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
    select: { title: 'id.title', subtitle: 'industry', shortId: 'shortId' },
    prepare({ title, subtitle, shortId }) {
      return { title: `[${shortId ?? '—'}] ${title ?? 'Untitled'}`, subtitle }
    },
  },
})
