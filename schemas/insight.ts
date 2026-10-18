import { defineField, defineType } from 'sanity'
import { ShortIdInput } from './components/ShortIdInput'

export const insight = defineType({
  name: 'insight',
  title: 'Insight',
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
      description: 'ID permanen untuk URL stabil. Jangan ubah setelah publish. Format: a001, a002, ...',
      components: { input: ShortIdInput },
      validation: (r) =>
        r
          .regex(/^a\d{3,}$/, { name: 'format shortId', invert: false })
          .custom(async (value, ctx) => {
            if (!value) return true
            const client = ctx.getClient({ apiVersion: '2024-01-01' })
            const docId = ctx.document?._id ?? ''
            const baseId = docId.replace(/^drafts\./, '')
            const existing = await client.fetch(
              `*[_type == "insight" && shortId == $value && _id != $docId && _id != $baseId][0]._id`,
              { value, docId, baseId }
            )
            return existing ? 'Short ID sudah dipakai di insight lain' : true
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
    defineField({
      name: 'category',
      title: 'Kategori / Category',
      type: 'string',
      group: 'settings',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Tanggal / Date',
      type: 'date',
      group: 'settings',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featureImage',
      title: 'Gambar Utama / Feature Image',
      type: 'image',
      group: 'settings',
      options: { hotspot: true },
    }),
    defineField({
      name: 'readTime',
      title: 'Waktu Baca / Read Time (menit)',
      type: 'number',
      group: 'settings',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'id',
      title: 'Konten Indonesia',
      type: 'object',
      group: 'id',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'title', title: 'Judul', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'excerpt', title: 'Ringkasan', type: 'text', rows: 3, validation: (r) => r.required() }),
        defineField({ name: 'body', title: 'Isi Artikel', type: 'array', of: [{ type: 'block' }, { type: 'table' }] }),
        defineField({ name: 'authorBio', title: 'Bio Penulis', type: 'string' }),
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
        defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, validation: (r) => r.required() }),
        defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }, { type: 'table' }] }),
        defineField({ name: 'authorBio', title: 'Author Bio', type: 'string' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  orderings: [{ title: 'Date, new first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'id.title', subtitle: 'category', shortId: 'shortId' },
    prepare({ title, subtitle, shortId }) {
      return { title: `[${shortId ?? '—'}] ${title ?? 'Untitled'}`, subtitle }
    },
  },
})
