/**
 * Seed script: Vidio VideoObject Markup case study → Sanity
 * Run once: npx tsx scripts/seed-vidio-case-study.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const SLUG = 'vidio-videoobject-markup'

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
    service: 'Technical SEO',
    heroMetric: '3x',
    metrics: [
      {
        _key: 'metric1',
        stat: '3x',
        label: 'Video impressions on Google Search',
        context: 'Q1 2022 vs Q1 2023',
      },
      {
        _key: 'metric2',
        stat: '2x',
        label: 'Video clicks on Google Search',
        context: 'Q1 2022 vs Q1 2023',
      },
      {
        _key: 'metric3',
        stat: '1M+',
        label: 'Videos with VideoObject markup',
        context: "Across Vidio's content catalog",
      },
      {
        _key: 'metric4',
        stat: '~30%',
        label: 'Growth in video publishing',
        context: 'Q1 2022 to Q1 2023',
      },
    ],
    testimonial: {
      quote:
        'Vidio is the foremost OTT platform in Indonesia, and optimizing our videos on Google has been incredibly valuable to video content searchers. Our data shows a remarkable growth in video impressions and clicks.',
      author: 'Hermawan Sutanto',
      authorTitle: 'Managing Director at Vidio',
    },
    id: {
      title: 'Pilot VideoObject Markup Bersama Google: 3x Lebih Banyak Tayang Video',
      metricLabel: 'peningkatan impressi video di Google Search',
      timeframe: 'Q1 2022 hingga Q1 2023',
      summary:
        'Vidio mengimplementasikan VideoObject structured data markup untuk lebih dari 1 juta video, menghasilkan lonjakan dramatis dalam visibilitas pencarian organik Google.',
      challenge:
        'Googlebot kesulitan merayapi format file video M3U8 (protokol HLS) yang digunakan Vidio. File yang tidak dapat diakses dapat menyebabkan kegagalan seluruh proses pengambilan data video, sehingga konten video lokal yang relevan sulit ditemukan oleh pengguna Indonesia melalui Google Search.',
      approach:
        'Mengimplementasikan VideoObject structured data markup tanpa mengubah format video M3U8 yang sudah ada. Menetapkan URL yang stabil dan dapat diakses untuk setiap file video guna mencegah kegagalan crawling Googlebot. Menambahkan properti contentUrl yang sesuai, lalu memvalidasi implementasi menggunakan fitur Video enhancement di Search Console dan URL inspection tool. Project ini dijalankan sebagai pilot resmi bersama tim Google Search Central.',
      results:
        'Impressi video di Google Search meningkat 3x lipat. Klik video meningkat 2x lipat. Pertumbuhan penerbitan video sekitar 30% dari Q1 2022 ke Q1 2023. Project pilot ini dijadikan case study resmi oleh Google dan didokumentasikan di Google Search Central (developers.google.com/search/case-studies/vidio-case-study).',
    },
    en: {
      title: 'VideoObject Markup Pilot with Google: 3x More Video Impressions',
      metricLabel: 'increase in video impressions on Google Search',
      timeframe: 'Q1 2022 to Q1 2023',
      summary:
        'Vidio implemented VideoObject structured data markup for over 1 million videos, producing a dramatic jump in organic search visibility on Google.',
      challenge:
        'Googlebot had difficulty crawling M3U8 (HLS protocol) video files used by Vidio. Inaccessible files referenced by M3U8 files could cause entire video byte-fetch failures, making locally relevant content hard to discover for Indonesian users on Google Search.',
      approach:
        'Implemented VideoObject structured data markup without changing the existing M3U8 video format. Established stable, accessible URLs for each video file to prevent Googlebot crawl failures. Added the appropriate contentUrl property and validated the implementation using Search Console\'s Video enhancement section and URL inspection tool. This project ran as an official pilot with the Google Search Central team.',
      results:
        'Video impressions on Google Search increased 3x. Video clicks increased 2x. Video publishing grew approximately 30% from Q1 2022 to Q1 2023. The pilot was adopted as an official Google case study, documented at developers.google.com/search/case-studies/vidio-case-study.',
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
