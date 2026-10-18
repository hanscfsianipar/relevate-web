import { defineField, defineType } from 'sanity'

const _servicesPageBase = defineType({
  name: 'servicesPage',
  title: 'Services Page',
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
        defineField({ name: 'processHeading', title: 'Judul Proses', type: 'string' }),
        defineField({
          name: 'process',
          title: 'Langkah Proses',
          type: 'array',
          of: [
            defineField({
              name: 'step',
              type: 'object',
              fields: [
                defineField({ name: 'step', title: 'Nomor Langkah', type: 'string' }),
                defineField({ name: 'title', title: 'Judul', type: 'string' }),
                defineField({ name: 'desc', title: 'Deskripsi', type: 'text', rows: 3 }),
              ],
              preview: { select: { title: 'title', subtitle: 'step' } },
            }),
          ],
        }),
        defineField({ name: 'learnMore', title: 'Label Tombol Pelajari Lebih Lanjut', type: 'string' }),
        defineField({ name: 'ctaBannerHeadline', title: 'CTA Banner Headline', type: 'string' }),
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
        defineField({ name: 'processHeading', title: 'Process Heading', type: 'string' }),
        defineField({
          name: 'process',
          title: 'Process Steps',
          type: 'array',
          of: [
            defineField({
              name: 'step',
              type: 'object',
              fields: [
                defineField({ name: 'step', title: 'Step Number', type: 'string' }),
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'desc', title: 'Description', type: 'text', rows: 3 }),
              ],
              preview: { select: { title: 'title', subtitle: 'step' } },
            }),
          ],
        }),
        defineField({ name: 'learnMore', title: 'Learn More Button Label', type: 'string' }),
        defineField({ name: 'ctaBannerHeadline', title: 'CTA Banner Headline', type: 'string' }),
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
      return { title: 'Services Page' }
    },
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const servicesPage: any = { ..._servicesPageBase, __experimental_actions: ['update', 'publish'] }
