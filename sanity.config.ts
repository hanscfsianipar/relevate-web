import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { RevalidateAction } from './schemas/actions/RevalidateAction'

export default defineConfig({
  name: 'hanscfs-studio',
  title: 'Hans CFS Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
  basePath: '/studio',
  document: {
    actions: (prev) => [...prev, RevalidateAction],
  },
})
