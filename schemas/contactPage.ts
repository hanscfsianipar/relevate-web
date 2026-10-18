import { defineField, defineType } from 'sanity'

const _contactPageBase = defineType({
  name: 'contactPage',
  title: 'Contact Page',
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
        defineField({ name: 'discussionHeading', title: 'Judul Diskusi', type: 'string' }),
        defineField({
          name: 'items',
          title: 'Item Diskusi',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({ name: 'responseNote', title: 'Catatan Respons', type: 'string' }),
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
        defineField({ name: 'discussionHeading', title: 'Discussion Heading', type: 'string' }),
        defineField({
          name: 'items',
          title: 'Discussion Items',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({ name: 'responseNote', title: 'Response Note', type: 'string' }),
      ],
    }),

    // ─── Settings ───────────────────────────────────────────────────────────
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      group: 'settings',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'string',
      group: 'settings',
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
      return { title: 'Contact Page' }
    },
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const contactPage: any = { ..._contactPageBase, __experimental_actions: ['update', 'publish'] }
