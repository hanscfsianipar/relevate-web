import { defineField, defineType } from 'sanity'

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitleId',
      title: 'Meta Title (ID)',
      type: 'string',
      description: 'Maks 60 karakter. Kosongkan untuk pakai judul default.',
      validation: Rule => Rule.max(60),
    }),
    defineField({
      name: 'metaTitleEn',
      title: 'Meta Title (EN)',
      type: 'string',
      description: 'Max 60 characters. Leave blank to use default title.',
      validation: Rule => Rule.max(60),
    }),
    defineField({
      name: 'metaDescId',
      title: 'Meta Description (ID)',
      type: 'text',
      rows: 3,
      description: 'Maks 160 karakter.',
      validation: Rule => Rule.max(160),
    }),
    defineField({
      name: 'metaDescEn',
      title: 'Meta Description (EN)',
      type: 'text',
      rows: 3,
      description: 'Max 160 characters.',
      validation: Rule => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      description: 'Recommended: 1200x630px. Used for both ID and EN.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Prevent search engines from indexing this page.',
      initialValue: false,
    }),
  ],
})
