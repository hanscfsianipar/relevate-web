import { defineField, defineType } from 'sanity'
import { ShortIdInput } from './components/ShortIdInput'

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
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
      description: 'ID permanen untuk URL stabil. Jangan ubah setelah publish. Format: ex001, ex002, ...',
      components: { input: ShortIdInput },
      validation: (r) =>
        r
          .regex(/^ex\d{3,}$/, { name: 'format shortId', invert: false })
          .custom(async (value, ctx) => {
            if (!value) return true
            const client = ctx.getClient({ apiVersion: '2024-01-01' })
            const docId = ctx.document?._id ?? ''
            const baseId = docId.replace(/^drafts\./, '')
            const existing = await client.fetch(
              `*[_type == "experience" && shortId == $value && _id != $docId && _id != $baseId][0]._id`,
              { value, docId, baseId }
            )
            return existing ? 'Short ID sudah dipakai di experience lain' : true
          }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: { source: 'role', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'company', title: 'Company', type: 'string', group: 'settings', validation: (r) => r.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', group: 'settings', options: { hotspot: false } }),
    defineField({ name: 'role', title: 'Role', type: 'string', group: 'settings', validation: (r) => r.required() }),
    defineField({
      name: 'periodStart',
      title: 'Period Start (tahun, contoh: "2024")',
      type: 'string',
      group: 'settings',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'startDate', title: 'Start Date (contoh: "Jun 2024")', type: 'string', group: 'settings' }),
    defineField({ name: 'periodEnd', title: 'Period End (tahun, kosongkan jika masih aktif)', type: 'string', group: 'settings' }),
    defineField({ name: 'endDate', title: 'End Date (contoh: "May 2021", kosongkan jika masih aktif)', type: 'string', group: 'settings' }),
    defineField({ name: 'industry', title: 'Industry', type: 'string', group: 'settings', validation: (r) => r.required() }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'settings',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'metric',
      title: 'Metric (opsional)',
      type: 'object',
      group: 'settings',
      fields: [
        defineField({ name: 'value', title: 'Value (contoh: "370+")', type: 'string' }),
        defineField({
          name: 'label', title: 'Label', type: 'object', fields: [
            defineField({ name: 'id', title: 'Indonesia', type: 'string' }),
            defineField({ name: 'en', title: 'English', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'tools',
      title: 'Tools Used',
      type: 'array',
      group: 'settings',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'appraisal',
      title: 'Manager Appraisal (opsional)',
      type: 'object',
      group: 'settings',
      fields: [
        defineField({ name: 'period', title: 'Period (contoh: "2025")', type: 'string' }),
        defineField({
          name: 'managerQuotes',
          title: 'Manager Quotes',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'id', title: 'Indonesia', type: 'text', rows: 2 }),
                defineField({ name: 'en', title: 'English', type: 'text', rows: 2 }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'id',
      title: 'Konten Indonesia',
      type: 'object',
      group: 'id',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'highlight', title: 'Highlight (tampilan list)', type: 'text', rows: 3, validation: (r) => r.required() }),
        defineField({ name: 'companyContext', title: 'Konteks Perusahaan', type: 'text', rows: 3 }),
        defineField({ name: 'whatIDid', title: 'Apa yang Saya Lakukan', type: 'array', of: [{ type: 'block' }] }),
        defineField({
          name: 'achievements',
          title: 'Pencapaian',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'stat', title: 'Stat', type: 'string' }),
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'context', title: 'Context', type: 'string' }),
              ],
              preview: { select: { title: 'stat', subtitle: 'label' } },
            },
          ],
        }),
        defineField({ name: 'approach', title: 'Pendekatan', type: 'text', rows: 3 }),
        defineField({ name: 'lessons', title: 'Pelajaran', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'en',
      title: 'English Content',
      type: 'object',
      group: 'en',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'highlight', title: 'Highlight (list view)', type: 'text', rows: 3, validation: (r) => r.required() }),
        defineField({ name: 'companyContext', title: 'Company Context', type: 'text', rows: 3 }),
        defineField({ name: 'whatIDid', title: 'What I Did', type: 'array', of: [{ type: 'block' }] }),
        defineField({
          name: 'achievements',
          title: 'Achievements',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'stat', title: 'Stat', type: 'string' }),
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'context', title: 'Context', type: 'string' }),
              ],
              preview: { select: { title: 'stat', subtitle: 'label' } },
            },
          ],
        }),
        defineField({ name: 'approach', title: 'Approach', type: 'text', rows: 3 }),
        defineField({ name: 'lessons', title: 'Lessons Learned', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  orderings: [{ title: 'Period, newest first', name: 'periodDesc', by: [{ field: 'periodStart', direction: 'desc' }] }],
  preview: {
    select: { title: 'company', subtitle: 'role', shortId: 'shortId' },
    prepare({ title, subtitle, shortId }) {
      return { title: `[${shortId ?? '—'}] ${title ?? 'Untitled'}`, subtitle }
    },
  },
})
