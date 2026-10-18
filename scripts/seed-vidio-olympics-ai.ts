/**
 * Seed script: Vidio Olympics AI Pipeline case study → Sanity
 * Run once: npx tsx scripts/seed-vidio-olympics-ai.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const SLUG = 'vidio-olympics-ai-pipeline'

async function main() {
  // Guard: skip if document already exists
  const existing = await client.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0]._id`,
    { slug: SLUG }
  )
  if (existing) {
    console.log(`Already exists (${existing}). Skipping.`)
    return
  }

  const doc = {
    _type: 'caseStudy',
    slug: { _type: 'slug', current: SLUG },
    industry: 'Media & Entertainment',
    service: 'AI Automation',
    heroMetric: 'Top 5',
    metrics: [
      {
        _key: 'metric1',
        stat: 'Top 5',
        label: 'Country ranking for Olympics content',
        context: 'Google benchmark, Paris 2024',
      },
      {
        _key: 'metric2',
        stat: '2,834',
        label: 'Olympic video assets uploaded and tagged',
        context: 'Via Google ViTA & Onebox',
      },
      {
        _key: 'metric3',
        stat: '~100%',
        label: 'Athlete and sports detection automated by AI',
        context: 'vs. fully manual tagging',
      },
      {
        _key: 'metric4',
        stat: 'Top',
        label: 'Global broadcaster recognition',
        context: 'Acknowledged by Google team',
      },
    ],
    id: {
      title: 'Sistem AI untuk Olimpiade: Indonesia Masuk Top 5 Dunia',
      metricLabel: 'peringkat negara secara global untuk konten Olimpiade di Google',
      timeframe: 'Olimpiade Paris 2024',
      summary:
        'Membangun sistem AI berbasis GPT-4 mini dari nol untuk memproses 2.834 aset video Olimpiade, mengotomatisasi deteksi atlet, negara, cabang olahraga, dan nomor pertandingan. Hasilnya: Google mengakui Indonesia sebagai Top 5 negara di dunia dan Vidio sebagai salah satu top broadcaster global.',
      challenge:
        'Olimpiade menghasilkan ribuan konten video dalam waktu singkat. Setiap aset perlu ditag secara akurat dengan informasi atlet, negara asal, cabang olahraga, dan nomor pertandingan agar konten dapat ditemukan di Google. Melakukan ini secara manual tidak mungkin dalam skala dan kecepatan yang dibutuhkan. Tantangan bertambah karena AI pada masa itu belum secanggih sekarang: banyak kasus tepi yang perlu ditangani, dan prompt perlu terus disesuaikan agar hasilnya konsisten.',
      approach:
        'Merancang dan membangun sistem otomatisasi berbasis AI menggunakan GPT-4 mini sebagai mesin deteksi. Model ini dihubungkan ke Google Sheets via Google Apps Script, sehingga tim bisa bekerja di antarmuka yang sudah mereka kenal tanpa perlu alat baru. Setiap baris data konten diproses secara otomatis: AI mendeteksi nama atlet, negara asal, cabang olahraga, dan nomor pertandingan dari judul dan metadata. Sistem ini dibangun secara iteratif, dengan banyak penyesuaian prompt untuk menangani variasi nama atlet internasional dan format konten yang tidak konsisten.',
      results:
        '2.834 aset berhasil diunggah dan ditag ke sistem Google (ViTA dan Olympics Onebox). Indonesia meraih peringkat Top 5 negara di dunia berdasarkan kontribusi konten Olimpiade. Google secara resmi mengakui Vidio sebagai salah satu top broadcaster global dari sisi volume konten. Pencapaian ini mendapat pengakuan langsung dari tim Google, disampaikan ke tim konten dan leadership Vidio.',
    },
    en: {
      title: 'AI-Powered Olympics Pipeline: Indonesia Ranks Top 5 Globally',
      metricLabel: 'global country ranking for Olympics content on Google',
      timeframe: 'Paris Olympics 2024',
      summary:
        'Built an AI system using GPT-4 mini from scratch to process 2,834 Olympic video assets, automating detection of athletes, countries, sports, and competition numbers. The result: Google recognized Indonesia as a Top 5 country globally and Vidio as one of the world\'s top broadcasters by content volume.',
      challenge:
        'The Olympics generates thousands of video assets in a matter of weeks. Each asset required accurate tagging with athlete names, home countries, sports categories, and event numbers to be discoverable on Google. Doing this manually was not feasible at the required scale and speed. The challenge was compounded because AI at the time was less mature than today: edge cases were frequent, and prompts needed constant refinement to produce consistent results.',
      approach:
        'Designed and built an AI automation system using GPT-4 mini as the detection engine. The model was connected to Google Sheets via Google Apps Script, letting the team work within a familiar interface without adopting new tooling. Each content row was processed automatically: the AI detected athlete names, home countries, sports categories, and competition numbers from titles and metadata. The system was built iteratively, with extensive prompt engineering to handle variations in international athlete names and inconsistent content formats.',
      results:
        '2,834 assets were successfully uploaded and tagged to Google\'s systems (ViTA and Olympics Onebox). Indonesia ranked in the Top 5 countries worldwide by Olympics content contribution. Google formally recognized Vidio as one of the top global broadcasters by content volume. This achievement received direct acknowledgment from the Google team, passed on to the content team and Vidio\'s leadership.',
    },
  }

  const result = await client.create(doc)
  console.log(`Created: ${result._id}`)
  console.log(`ID route: /id/studi-kasus/${SLUG}`)
  console.log(`EN route: /en/case-studies/${SLUG}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
