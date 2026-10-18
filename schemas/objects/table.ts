import { defineArrayMember, defineField, defineType } from 'sanity'

export const tableType = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'tableRow',
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { rows: 'rows' },
    prepare({ rows }) {
      const rowCount = rows?.length ?? 0
      const colCount = rows?.[0]?.cells?.length ?? 0
      return { title: `Table ${colCount}x${rowCount}` }
    },
  },
})
