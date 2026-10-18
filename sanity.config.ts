import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { RevalidateAction } from './schemas/actions/RevalidateAction'
import { siteConfig } from './lib/site-config'

export default defineConfig({
  name: siteConfig.studio.name,
  title: siteConfig.studio.title,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
  basePath: '/studio',
  document: {
    actions: (prev) => [...prev, RevalidateAction],
  },
})
