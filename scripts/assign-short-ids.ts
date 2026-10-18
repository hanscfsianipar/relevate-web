/**
 * Assign shortId ke dokumen yang belum punya.
 * Dipakai untuk URL pendek kanonik: /insight/a001-judul-artikel
 *
 * Idempoten: dokumen yang sudah punya shortId dilewati, jadi aman dijalankan ulang.
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

type DocType = { type: string; prefix: string }
const docTypes: DocType[] = [
  { type: 'insight', prefix: 'a' },
  { type: 'caseStudy', prefix: 'cs' },
  { type: 'experience', prefix: 'ex' },
]

async function nextNumber(prefix: string): Promise<number> {
  const existing = await client.fetch<string[]>(
    `*[_type in $types && defined(shortId)].shortId`,
    { types: docTypes.map((d) => d.type) }
  )
  const used = existing
    .filter((s) => s.startsWith(prefix))
    .map((s) => parseInt(s.slice(prefix.length), 10))
    .filter((n) => !Number.isNaN(n))
  return used.length ? Math.max(...used) + 1 : 1
}

async function run() {
  for (const { type, prefix } of docTypes) {
    const docs = await client.fetch<{ _id: string }[]>(
      `*[_type == $type && !defined(shortId)] | order(_createdAt asc) { _id }`,
      { type }
    )

    if (docs.length === 0) {
      console.log(`${type}: semua dokumen sudah punya shortId`)
      continue
    }

    let n = await nextNumber(prefix)
    for (const { _id } of docs) {
      const shortId = `${prefix}${String(n).padStart(3, '0')}`
      await client.patch(_id).set({ shortId }).commit()
      console.log(`✓ ${_id} → ${shortId}`)
      n += 1
    }
  }

  console.log('\nDone.')
}

run()
