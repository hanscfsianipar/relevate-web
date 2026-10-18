/**
 * Seed 2 dokumen contoh sebagai template penulisan:
 *   1. caseStudy  (cs001)
 *   2. insight    (a001)
 *
 * Semua angka dan nama sengaja ditulis sebagai placeholder [ISI: ...].
 * Tugas tim: ganti isi placeholder, atau hapus dokumen contoh ini setelah
 * punya dokumen asli.
 *
 * Idempoten: kalau _id sudah ada, dokumen dilewati.
 * Run: npx tsx scripts/seed-examples.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function block(text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
  }
}

const caseStudyDoc = {
  _id: 'caseStudy-contoh',
  _type: 'caseStudy',
  shortId: 'cs001',
  slug: { _type: 'slug', current: 'contoh-studi-kasus' },
  industry: '[ISI: industri klien]',
  service: '[ISI: layanan yang dipakai]',
  heroMetric: '[ISI: angka utama]',
  metrics: [
    { _key: 'm1', stat: '[ISI]', label: '[ISI: metrik]', context: '[ISI: periode dan pembanding]' },
    { _key: 'm2', stat: '[ISI]', label: '[ISI: metrik]', context: '[ISI: periode dan pembanding]' },
  ],
  id: {
    title: 'Contoh: [ISI: hasil spesifik dalam satu kalimat]',
    metricLabel: '[ISI: label metrik]',
    timeframe: '[ISI: rentang waktu]',
    summary: '[ISI: 2-3 kalimat ringkas untuk tampilan daftar. Sebutkan masalah, apa yang dikerjakan, dan hasilnya.]',
    challenge: '[ISI: kondisi awal, angka baseline, dan kenapa itu masalah buat bisnis klien.]',
    approach: '[ISI: langkah yang dikerjakan, urutannya, dan alasan tiap langkah.]',
    results: '[ISI: hasil dengan angka dan periode pembanding, plus hal yang belum berhasil.]',
  },
  en: {
    title: 'Example: [FILL: specific outcome in one sentence]',
    metricLabel: '[FILL: metric label]',
    timeframe: '[FILL: timeframe]',
    summary: '[FILL: 2-3 sentences for list view. State the problem, the work, and the result.]',
    challenge: '[FILL: starting condition, baseline numbers, and why it mattered to the business.]',
    approach: '[FILL: what was done, in order, and why each step mattered.]',
    results: '[FILL: results with numbers and comparison period, including what did not work.]',
  },
  seo: {
    metaTitleId: 'Contoh studi kasus | Relevate',
    metaTitleEn: 'Example case study | Relevate',
    metaDescId: '[ISI: meta description Bahasa Indonesia, maksimal 155 karakter.]',
    metaDescEn: '[FILL: English meta description, max 155 characters.]',
  },
}

const insightDoc = {
  _id: 'insight-contoh',
  _type: 'insight',
  shortId: 'a001',
  slug: { _type: 'slug', current: 'contoh-artikel-insight' },
  category: '[ISI: kategori]',
  date: new Date().toISOString().slice(0, 10),
  readTime: 5,
  id: {
    title: 'Contoh: [ISI: judul yang menjanjikan satu jawaban spesifik]',
    excerpt: '[ISI: ringkasan 2 kalimat. Kalimat kedua sebaiknya menyebut apa yang pembaca dapat.]',
    body: [
      block('[ISI: pembuka. Mulai dari masalah nyata pembaca, bukan definisi.]'),
      block('Subjudul pertama', 'h2'),
      block('[ISI: isi bagian pertama. Satu ide per paragraf, sertakan angka atau contoh konkret.]'),
      block('Subjudul kedua', 'h2'),
      block('[ISI: isi bagian kedua. Tutup dengan langkah yang bisa dijalankan pembaca minggu ini.]'),
    ],
    authorBio: '[ISI: satu kalimat tentang penulis dan perannya di Relevate.]',
  },
  en: {
    title: 'Example: [FILL: a title that promises one specific answer]',
    excerpt: '[FILL: 2-sentence summary. The second sentence should state what the reader gets.]',
    body: [
      block('[FILL: opening. Start from a real reader problem, not a definition.]'),
      block('First subheading', 'h2'),
      block('[FILL: body of the first section. One idea per paragraph, include numbers or concrete examples.]'),
      block('Second subheading', 'h2'),
      block('[FILL: body of the second section. Close with an action the reader can take this week.]'),
    ],
    authorBio: '[FILL: one sentence about the author and their role at Relevate.]',
  },
  seo: {
    metaTitleId: 'Contoh artikel insight | Relevate',
    metaTitleEn: 'Example insight article | Relevate',
    metaDescId: '[ISI: meta description Bahasa Indonesia, maksimal 155 karakter.]',
    metaDescEn: '[FILL: English meta description, max 155 characters.]',
  },
}

async function upsert(doc: { _id: string }) {
  const existing = await client.getDocument(doc._id)
  if (existing) {
    console.log(`skip ${doc._id} (sudah ada)`)
    return
  }
  await client.createIfNotExists(doc as never)
  console.log(`✓ dibuat ${doc._id}`)
}

async function run() {
  await upsert(caseStudyDoc)
  await upsert(insightDoc)
  console.log('\nSelesai. Dua dokumen contoh siap dipakai sebagai template penulisan.')
}

run()
