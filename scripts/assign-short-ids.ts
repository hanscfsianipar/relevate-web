/**
 * Assign shortIds to all existing content (insights, case studies, experience)
 * ordered from oldest to newest.
 * Run: npx tsx scripts/assign-short-ids.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const assignments: { id: string; shortId: string }[] = [
  // ─── Insights (ordered by date asc) ─────────────────────────────────────────
  { id: 'insight-lebih-banyak-tidak-selalu-lebih-baik-diminishing-return', shortId: 'a001' },
  { id: 'insight-seo-mempengaruhi-branding-vs-branding-mempengaruhi-seo',  shortId: 'a002' },
  { id: 'insight-pentingnya-ke-bumi-untuk-menganalisa-data-marketing',      shortId: 'a003' },
  { id: 'insight-menulis-dengan-ejaan-dan-tanda-baca-yang-tepat',           shortId: 'a004' },
  { id: 'insight-mengulang-strategi-yang-terbukti-kunci-sukses-efisiensi-tanpa-ribet', shortId: 'a005' },
  { id: 'insight-menggunakan-agile-process-untuk-meningkatkan-seo',         shortId: 'a006' },
  { id: 'insight-apakah-menulis-artikel-memakai-ai-itu-aman-secara-seo',    shortId: 'a007' },
  { id: 'insight-dark-triad-sisi-gelap-yang-bisa-membuat-sukses-benarkah',  shortId: 'a008' },
  { id: 'insight-dari-seo-staf-hingga-panggung-google-perjalanan-yang-tak-terbayangkan', shortId: 'a009' },
  { id: 'insight-netflix-ui-baru-empati-dalam-desain',                      shortId: 'a010' },
  { id: '09d3a76a-b424-4aa9-a2b9-dae460b613bb',                             shortId: 'a011' },
  { id: 'dc53a85c-33a5-487c-bc8c-6d2ff34215d7',                             shortId: 'a012' },

  // ─── Case Studies (ordered by _createdAt asc) ───────────────────────────────
  { id: 'caseStudy-bareksa-seo-recovery',     shortId: 'cs001' },
  { id: 'oHVzxOde3Ie3J7Avq7aJSj',             shortId: 'cs002' },
  { id: 'oHVzxOde3Ie3J7AvqB4GDx',             shortId: 'cs003' },

  // ─── Experience (ordered by periodStart asc) ────────────────────────────────
  { id: 'experience-wadezig',                   shortId: 'ex001' },
  { id: 'experience-pinnacle',                  shortId: 'ex002' },
  { id: 'experience-ruparupacom',               shortId: 'ex003' },
  { id: 'experience-lamudi',                    shortId: 'ex004' },
  { id: 'experience-shopback',                  shortId: 'ex005' },
  { id: 'experience-vidio-gm-seo',              shortId: 'ex006' },
  { id: 'experience-vidio-gm-marketing-analyst', shortId: 'ex007' },
]

async function run() {
  console.log(`Assigning shortIds to ${assignments.length} documents...\n`)

  for (const { id, shortId } of assignments) {
    try {
      await client.patch(id).set({ shortId }).commit()
      console.log(`✓ ${id} → ${shortId}`)
    } catch (err) {
      console.error(`✗ ${id}: ${(err as Error).message}`)
    }
  }

  console.log('\nDone.')
}

run()
