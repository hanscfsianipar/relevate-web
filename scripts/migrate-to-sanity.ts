/**
 * Migration script: hardcoded content → Sanity
 * Run: npx tsx scripts/migrate-to-sanity.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// ─── Portable Text helpers ────────────────────────────────────────────────────

function key() {
  return Math.random().toString(36).slice(2, 10)
}

function span(text: string, marks: string[] = []) {
  return { _type: 'span', _key: key(), text, marks }
}

function block(children: ReturnType<typeof span>[], style = 'normal', listItem?: string) {
  const b: Record<string, unknown> = {
    _type: 'block', _key: key(), style, children, markDefs: [],
  }
  if (listItem) b.listItem = listItem
  return b
}

function parseInline(html: string): ReturnType<typeof span>[] {
  const spans: ReturnType<typeof span>[] = []
  const regex = /(<em>.*?<\/em>|<strong>.*?<\/strong>|[^<]+)/gi
  const matches = html.match(regex) ?? []
  for (const m of matches) {
    if (m.startsWith('<em>')) spans.push(span(m.replace(/<\/?em>/gi, ''), ['em']))
    else if (m.startsWith('<strong>')) spans.push(span(m.replace(/<\/?strong>/gi, ''), ['strong']))
    else spans.push(span(m))
  }
  return spans.length ? spans : [span(html)]
}

function htmlToPT(html: string): ReturnType<typeof block>[] {
  const blocks: ReturnType<typeof block>[] = []
  const parts = html
    .replace(/<\/?(ul|ol)>/gi, '')
    .split(/(<h2>[\s\S]*?<\/h2>|<p>[\s\S]*?<\/p>|<li>[\s\S]*?<\/li>)/gi)
    .map(s => s.trim()).filter(Boolean)
  for (const part of parts) {
    if (part.startsWith('<h2>')) {
      blocks.push(block([span(part.replace(/<\/?h2>/gi, '').trim())], 'h2'))
    } else if (part.startsWith('<li>')) {
      blocks.push(block(parseInline(part.replace(/<\/?li>/gi, '').trim()), 'normal', 'number'))
    } else if (part.startsWith('<p>')) {
      const inner = part.replace(/<\/?p>/gi, '').trim()
      if (inner) blocks.push(block(parseInline(inner)))
    } else if (!part.match(/^</) && part.trim()) {
      blocks.push(block([span(part.trim())]))
    }
  }
  return blocks
}

// ─── Experience data ──────────────────────────────────────────────────────────

const experiences = [
  {
    slug: 'vidio-gm-marketing-analyst',
    company: 'Vidio',
    role: 'GM of Marketing Analyst',
    periodStart: '2024',
    startDate: 'Jun 2024',
    periodEnd: null,
    endDate: null,
    industry: 'OTT/Streaming',
    highlight: {
      id: 'Memimpin fungsi marketing analytics Vidio, bangun infrastruktur data dan dorong budaya keputusan berbasis insight lintas divisi.',
      en: "Leading Vidio's marketing analytics function, building data infrastructure and a cross-division insight-driven decision culture.",
    },
    tags: ['Analytics', 'Data Governance', 'Marketing Strategy'],
    metric: { value: '370+', label: { id: 'Proses terstandarisasi', en: 'Standardized processes' } },
    tools: ['GA4', 'BigQuery', 'Looker Studio', 'Python', 'SQL', 'Amplitude', 'Meta Ads Manager', 'Google Ads'],
    appraisal: {
      period: '2025',
      managerQuotes: [
        { id: '"Sudah bangun fondasi yang kuat untuk kultur data-driven... dikenal luas sebagai \'the data guy\'."', en: '"Solid foundation for a data-driven culture... strong reputation as \'the data guy\'."' },
        { id: '"Prosesnya sekarang jauh lebih simpel... tidak ada lagi kejutan last-minute yang bikin stres."', en: '"Process is much simpler now... eliminates stressful last-minute surprises."' },
      ],
    },
    id: {
      companyContext: 'Vidio adalah platform streaming video on demand terbesar di Indonesia, dengan puluhan juta pengguna aktif dan ribuan konten film, serial, olahraga, dan siaran langsung.',
      whatIDid: `<p>Setelah tiga tahun pimpin SEO di Vidio, saya dipercaya ambil peran lebih luas: bangun fungsi marketing analytics yang menyentuh seluruh divisi, dari akuisisi sampai retensi.</p>
<p>Tantangan terbesarnya bukan soal teknologi. Banyak keputusan masih diambil dari intuisi atau laporan <em>ad hoc</em> yang tidak konsisten antar tim. Saya mulai dengan definisikan ulang struktur data dan metrik standar yang disepakati bersama.</p>
<p>Dari sana, saya bangun infrastruktur reporting yang memungkinkan setiap divisi lihat performa mereka secara <em>real-time</em>. Yang lebih penting: paham <em>kenapa</em> angka bergerak, bukan cuma <em>apa</em> yang terjadi.</p>`,
      achievements: [
        { stat: '370+', label: 'Notifikasi boost post terstandarisasi', context: 'Proses Social Media boost post yang sebelumnya tidak konsisten kini terdokumentasi dan jalan otomatis' },
        { stat: '5 dari 5', label: 'Objective selesai sesuai target', context: 'Social media data pool, campaign tracking, ekstraksi data VOS, Blog improvement, dan standarisasi proses semuanya delivered' },
      ],
      approach: 'Data bukan tujuan, tapi alat. Analytics infrastructure yang bagus bukan soal dashboard yang cantik, tapi soal pertanyaan bisnis apa yang bisa dijawab lebih cepat.',
      lessons: 'Tantangan terbesar transformasi data-driven bukan teknikal, tapi manusiawi. Bangun kepercayaan tim terhadap data butuh lebih banyak energi daripada bangun pipeline-nya sendiri.',
    },
    en: {
      companyContext: "Vidio is Indonesia's largest video on demand streaming platform, with tens of millions of active users and thousands of films, series, sports events, and live broadcasts.",
      whatIDid: `<p>After three years leading SEO at Vidio, I was trusted to take on a broader role: building a marketing analytics function that touches every division, from acquisition to retention.</p>
<p>The biggest challenge wasn't technology. Many decisions were still made based on intuition or <em>ad hoc</em> reports inconsistent across teams. I started by redefining the data structure and standard metrics collectively agreed upon.</p>
<p>From there, I built a reporting infrastructure enabling every division to see their performance in <em>real-time</em>, and more importantly: to understand <em>why</em> numbers move, not just <em>what</em> is happening.</p>`,
      achievements: [
        { stat: '370+', label: 'Social media boost notifications standardized', context: 'A previously inconsistent boost post process is now documented and runs automatically' },
        { stat: '5 out of 5', label: 'All objectives delivered on target', context: 'Social media data pool, campaign tracking, VOS data extraction, Blog improvement, and process standardization all delivered' },
      ],
      approach: "Data is not the goal, it's the tool. Good analytics infrastructure isn't about pretty dashboards, it's about which business questions can be answered faster.",
      lessons: "The biggest challenge of data-driven transformation isn't technical, it's human. Building team trust in data requires more energy than building the pipeline itself.",
    },
  },
  {
    slug: 'vidio-gm-seo',
    company: 'Vidio',
    role: 'GM of SEO',
    periodStart: '2021',
    startDate: 'Jan 2021',
    periodEnd: null,
    endDate: null,
    industry: 'OTT/Streaming',
    highlight: {
      id: 'Bangun dan pimpin strategi SEO platform streaming terbesar Indonesia, jutaan halaman konten film, serial, dan siaran langsung.',
      en: "Built and led the SEO strategy for Indonesia's largest streaming platform, covering millions of pages across films, series, and live broadcasts.",
    },
    tags: ['SEO', 'Technical SEO', 'Content Strategy'],
    metric: { value: '20K+', label: { id: 'Kata kunci ranking', en: 'Ranking keywords' } },
    tools: ['Google Search Console', 'Ahrefs', 'Screaming Frog', 'Python', 'BigQuery', 'Looker Studio', 'Google Analytics 4'],
    appraisal: {
      period: '2025',
      managerQuotes: [
        { id: '"Meski keyword-nya sulit, mereka konsisten berhasil menang di media action."', en: '"Even with high-difficulty keywords, they consistently manage to win the media action."' },
      ],
    },
    id: {
      companyContext: 'Vidio adalah platform streaming video on demand terbesar di Indonesia, rumah bagi konten premium Emtek Group, olahraga internasional, dan jutaan jam konten hiburan.',
      whatIDid: `<p>Bergabung saat Vidio sedang agresif ekspansi konten, saya menghadapi tantangan SEO yang jarang ditemui di industri lain: bagaimana bikin search engine paham dan indeks jutaan halaman konten yang terus bertambah setiap hari.</p>
<p>Saya bangun strategi SEO dari fondasi: arsitektur URL, <em>schema markup</em> untuk konten video, optimasi page speed, dan content strategy yang menyasar kueri yang benar-benar diketik orang ketika cari tontonan.</p>
<p>Yang beda dari pekerjaan ini adalah skala. Aturan yang kerja untuk satu halaman harus bisa otomatis berlaku untuk ratusan ribu halaman. Saya bangun sistem, bukan sekadar optimasi halaman per halaman.</p>`,
      achievements: [
        { stat: '20.282', label: 'Keyword ranking di Google', context: 'Rata-rata 1.910 keyword baru per bulan, termasuk keyword kompetitif Bad Guys, Malam Pertama, Sugar Baby' },
        { stat: '1,87 juta', label: 'Halaman berhasil diindeks', context: 'Dari total yang ditemukan crawler, 1.879.407 halaman berhasil diindeks. Hanya 17.251 yang belum masuk indeks' },
        { stat: '3.000+', label: 'Pertandingan olahraga dipantau via ViTA', context: 'Link pre-game dan live streaming Vidio konsisten hadir lebih awal dari platform OTT pesaing' },
      ],
      approach: 'SEO di platform konten bukan soal nulis satu artikel yang bagus. Ini soal bangun sistem yang hasilkan sinyal relevansi secara konsisten di skala industri.',
      lessons: 'Di skala ini, kesalahan kecil bisa berdampak besar. Saya belajar pentingnya staged testing dan monitoring ketat sebelum terapkan perubahan ke seluruh platform.',
    },
    en: {
      companyContext: "Vidio is Indonesia's largest video on demand streaming platform, home to premium Emtek Group content, international sports, and millions of hours of entertainment.",
      whatIDid: `<p>Joining during Vidio's aggressive content expansion phase, I faced an SEO challenge rarely encountered in other industries: how to make search engines understand and index millions of content pages growing every day.</p>
<p>I built the SEO strategy from the foundation: URL architecture, <em>schema markup</em> for video content, page speed optimization, and a content strategy targeting the actual queries people type when looking for something to watch.</p>
<p>What made this work different was scale. Rules that work for one page must automatically apply to hundreds of thousands of pages. I built systems, not just page-by-page optimizations.</p>`,
      achievements: [
        { stat: '20,282', label: 'Ranking keywords on Google', context: 'Average 1,910 new keywords per month, including competitive keywords Bad Guys, Malam Pertama, Sugar Baby' },
        { stat: '1.87 million', label: 'Pages successfully indexed', context: 'Of all pages discovered by crawler, 1,879,407 successfully indexed. Only 17,251 remaining outside the index' },
        { stat: '3,000+', label: 'Sports matches monitored via ViTA', context: 'Vidio pre-game and live streaming links consistently published ahead of competing OTT platforms' },
      ],
      approach: "SEO on a content platform isn't about writing one great article. It's about building systems that generate relevance signals consistently at industry scale.",
      lessons: "At this scale, small mistakes can have outsized impact. I learned the importance of staged testing and tight monitoring before rolling out changes platform-wide.",
    },
  },
  {
    slug: 'shopback',
    company: 'ShopBack',
    role: 'SEO Manager',
    periodStart: '2020',
    startDate: 'Jun 2020',
    periodEnd: '2021',
    endDate: 'Jan 2021',
    industry: 'Fintech',
    highlight: {
      id: 'Kelola strategi SEO untuk platform cashback di ruang fintech dan e-commerce yang sangat kompetitif.',
      en: 'Managed SEO strategy for a high-competition cashback platform across fintech and e-commerce categories.',
    },
    tags: ['SEO', 'Fintech', 'Content Strategy'],
    metric: null,
    tools: ['Ahrefs', 'Google Search Console', 'Screaming Frog', 'Google Analytics', 'SEMrush', 'Looker Studio'],
    appraisal: null,
    id: {
      companyContext: 'ShopBack adalah platform cashback dan rewards terbesar di Asia Tenggara, beroperasi di Indonesia, Singapura, Malaysia, dan beberapa negara lainnya.',
      whatIDid: `<p>ShopBack beroperasi di ruang yang sangat kompetitif: setiap kueri belanja atau produk diperebutkan bersama marketplace besar seperti Tokopedia, Shopee, dan Lazada. Di sini SEO bukan soal kalahkan mereka head-on, tapi cari ruang yang belum mereka isi.</p>
<p>Saya fokus pada dua hal: konten yang jawab pertanyaan spesifik seputar cashback dan promo, plus optimasi teknikal ribuan halaman merchant.</p>
<p>Meski singkat, masa ini kasih saya eksposur SEO di level regional dan cara platform fintech susun arsitektur informasi mereka.</p>`,
      achievements: [
        { stat: 'Regional', label: 'Eksposur strategi SEO lintas pasar Asia Tenggara', context: 'Paham nuansa SEO di pasar yang beda bahasa dan search behavior-nya' },
        { stat: 'Ribuan', label: 'Halaman merchant dioptimasi secara sistematis', context: 'Template dan standar konten yang bisa diterapkan ke seluruh halaman mitra' },
        { stat: 'Intent', label: 'Content strategy berbasis intent cashback dan promo', context: 'Menyasar kueri high-intent yang langsung relevan dengan business model ShopBack' },
      ],
      approach: 'Di ruang yang didominasi marketplace raksasa, menang di SEO berarti main di lapangan berbeda: jadi sumber paling relevan untuk pertanyaan yang spesifik dan transaksional.',
      lessons: 'Tenure singkat mengajarkan saya untuk gerak cepat dan prioritas ketat. Tidak semua peluang SEO layak dikejar, pilih yang dampaknya paling langsung terasa ke bisnis.',
    },
    en: {
      companyContext: 'ShopBack is the largest cashback and rewards platform in Southeast Asia, operating in Indonesia, Singapore, Malaysia, and several other countries.',
      whatIDid: `<p>ShopBack operates in a highly competitive space: every shopping or product query is contested alongside major marketplaces like Tokopedia, Shopee, and Lazada. Here, SEO isn't about beating them head-on, but finding spaces they haven't filled.</p>
<p>I focused on two things: content answering specific questions around cashback and promotions, and technical optimization of thousands of merchant pages.</p>
<p>Although relatively brief, this period gave me exposure to SEO at a regional level and how fintech platforms structure their information architecture.</p>`,
      achievements: [
        { stat: 'Regional', label: 'SEO strategy exposure across Southeast Asian markets', context: 'Understanding SEO nuances across markets with different languages and search behaviors' },
        { stat: 'Thousands', label: 'Merchant pages optimized systematically', context: 'Content templates and standards applicable across all partner pages' },
        { stat: 'Intent', label: 'Content strategy based on cashback and promo intent', context: "Targeting high-intent queries directly relevant to ShopBack's business model" },
      ],
      approach: "In a space dominated by giant marketplaces, winning at SEO means playing a different field: becoming the most relevant source for specific, transactional questions.",
      lessons: "A short tenure taught me to move fast and prioritize tightly. Not every SEO opportunity is worth pursuing; choose the ones with the most direct business impact.",
    },
  },
  {
    slug: 'lamudi',
    company: 'Lamudi.co.id',
    role: 'SEO Manager',
    periodStart: '2019',
    startDate: 'Dec 2019',
    periodEnd: '2020',
    endDate: 'May 2020',
    industry: 'PropTech',
    highlight: {
      id: 'Optimasi organic visibility portal properti terkemuka di pasar real estate digital Indonesia yang ketat.',
      en: "Optimized organic visibility for a leading property portal amid fierce competition in Indonesia's digital real estate market.",
    },
    tags: ['SEO', 'PropTech', 'Content SEO'],
    metric: null,
    tools: ['Google Search Console', 'SEMrush', 'Google Analytics', 'WordPress', 'Screaming Frog', 'Ahrefs'],
    appraisal: null,
    id: {
      companyContext: 'Lamudi adalah portal properti yang beroperasi di berbagai pasar berkembang, termasuk Indonesia, di mana pencarian properti online terus tumbuh signifikan.',
      whatIDid: `<p>Properti adalah salah satu kategori paling kompetitif di pencarian organik Indonesia. Lamudi bersaing langsung dengan Rumah123, 99.co, dan OLX Properti, semua dengan domain authority yang kuat.</p>
<p>Pendekatan saya: konten berbasis lokasi dan tipe properti yang sangat spesifik. Daripada bersaing di kueri generik, saya fokus bangun visibility di long-tail queries yang tunjukkan real purchase <em>intent</em>.</p>
<p>Selain konten, saya juga kerjakan sisi teknikal: page speed halaman listing, struktur internal link, dan schema untuk properti yang bantu search engine paham tipe konten yang kami sajikan.</p>`,
      achievements: [
        { stat: 'Long-tail', label: 'Strategi dominasi pencarian berbasis lokasi spesifik', context: 'Optimasi ribuan kombinasi kueri kecamatan, tipe properti, dan harga' },
        { stat: 'Schema', label: 'Implementasi structured data untuk listing properti', context: 'Tingkatkan visibility di SERP lewat rich snippet yang relevan' },
        { stat: 'Teknikal', label: 'Optimasi performa halaman dan struktur internal link', context: 'Fondasi teknikal yang dukung indexing ribuan listing aktif' },
      ],
      approach: 'Di pasar properti, pembeli tidak cari rumah secara generik. Mereka cari rumah di lokasi spesifik, dengan budget spesifik. SEO strategy harus cerminkan spesifisitas itu.',
      lessons: 'Periode singkat ini memperkuat keyakinan saya bahwa SEO berbasis data lokal dan intent yang tepat jauh lebih efektif daripada kejar volume pencarian besar tapi conversion-nya rendah.',
    },
    en: {
      companyContext: 'Lamudi is a property portal operating across emerging markets, including Indonesia, where online property search continues to grow significantly.',
      whatIDid: `<p>Real estate is one of the most competitive categories in Indonesian organic search. Lamudi competed directly with Rumah123, 99.co, and OLX Properti, all with strong domain authority.</p>
<p>My approach was location and property-type content that was highly specific. Rather than competing on generic queries, I focused on building visibility in long-tail queries showing real purchase <em>intent</em>.</p>
<p>Beyond content, I also worked on the technical side: listing page speed, internal link structure, and property schema that helps search engines understand the type of content we were serving.</p>`,
      achievements: [
        { stat: 'Long-tail', label: 'Location-based search dominance strategy', context: 'Optimizing thousands of query combinations by sub-district, property type, and price' },
        { stat: 'Schema', label: 'Structured data implementation for property listings', context: 'Increased SERP visibility through relevant rich snippets' },
        { stat: 'Technical', label: 'Page performance and internal link structure optimization', context: 'Technical foundation supporting indexing of thousands of active listings' },
      ],
      approach: "In the property market, buyers don't search for homes generically. They search for homes in a specific location, at a specific budget. SEO strategy must reflect that specificity.",
      lessons: "This brief period reinforced my belief that SEO based on local data and precise intent is more effective than chasing high search volumes with low conversion rates.",
    },
  },
  {
    slug: 'ruparupacom',
    company: 'Ruparupacom',
    role: 'SEO Team Lead',
    periodStart: '2016',
    startDate: 'Jul 2016',
    periodEnd: '2019',
    endDate: 'Dec 2019',
    industry: 'E-commerce',
    highlight: {
      id: 'Bangun tim SEO dari nol dan pimpin optimasi organik e-commerce multi-kategori dengan jutaan SKU.',
      en: 'Built an SEO team from scratch and led organic optimization for a multi-category e-commerce platform with millions of SKUs.',
    },
    tags: ['SEO', 'Technical SEO', 'Team Lead'],
    metric: null,
    tools: ['Google Search Console', 'Ahrefs', 'Screaming Frog', 'Majestic', 'Google Analytics', 'Python', 'Excel'],
    appraisal: null,
    id: {
      companyContext: 'Ruparupacom adalah platform e-commerce milik Kawan Lama Group, jual produk dari kategori rumah tangga, furnitur, elektronik, sampai perlengkapan outdoor dengan jutaan SKU.',
      whatIDid: `<p>Saya bergabung sebagai SEO Specialist saat tim SEO Ruparupacom baru terbentuk. Dua tahun kemudian, dipromosikan jadi Team Lead dan bertanggung jawab atas strategi sekaligus pengembangan tim.</p>
<p>Tantangan terbesar e-commerce dengan jutaan SKU adalah konsistensi. Setiap produk baru harus memenuhi standar SEO tertentu: URL yang bersih, deskripsi yang unik, kategorisasi yang tepat. Tanpa sistem, ini mustahil dikerjakan manual.</p>
<p>Saya bangun template optimasi dan workflow yang memungkinkan tim kecil kelola skala besar. Saya juga mulai pakai Python untuk otomasi technical audit, sesuatu yang jadi dasar cara kerja saya sampai sekarang.</p>`,
      achievements: [
        { stat: 'Tim SEO', label: 'Bangun dan pimpin tim dari nol', context: 'Dari tidak ada tim sampai tim yang punya proses, standar, dan KPI yang jelas' },
        { stat: 'Jutaan SKU', label: 'Sistem optimasi yang jalan di skala e-commerce penuh', context: 'Template, workflow, dan otomasi yang pastikan konsistensi SEO di setiap kategori' },
        { stat: 'Python', label: 'Pertama kali integrasikan technical automation ke dalam SEO workflow', context: 'Audit crawl, analisis log, dan monitoring yang sebelumnya manual kini otomatis' },
      ],
      approach: 'SEO e-commerce bukan pekerjaan satu orang. Ini pekerjaan sistem. Tugas seorang lead adalah pastikan standar bisa dijalankan siapa pun di tim, tanpa kehilangan konsistensi.',
      lessons: 'Jadi Team Lead mengajarkan saya bahwa teknis saja tidak cukup. Kemampuan jelaskan SEO ke non-teknis, meyakinkan stakeholder, dan delegasi dengan jelas sama pentingnya dengan kuasai tools.',
    },
    en: {
      companyContext: "Ruparupacom is an e-commerce platform owned by the Kawan Lama Group, selling products across household, furniture, electronics, and outdoor equipment categories with millions of SKUs.",
      whatIDid: `<p>I joined as an SEO Specialist when Ruparupacom's SEO team was newly formed. Two years later, I was promoted to Team Lead, responsible for both strategy and team development.</p>
<p>The biggest challenge for e-commerce with millions of SKUs is consistency. Every new product must meet certain SEO standards: clean URLs, unique descriptions, proper categorization. Without a system, this is impossible to do manually.</p>
<p>I built optimization templates and workflows enabling a small team to manage large scale. I also started using Python for technical audit automation, something that became the foundation of how I work today.</p>`,
      achievements: [
        { stat: 'SEO Team', label: 'Built and led a team from scratch', context: 'From no team to one with clear processes, standards, and KPIs' },
        { stat: 'Millions of SKUs', label: 'Optimization system running at full e-commerce scale', context: 'Templates, workflows, and automation ensuring SEO consistency across every category' },
        { stat: 'Python', label: 'First integration of technical automation into SEO workflow', context: 'Crawl audits, log analysis, and monitoring that were previously manual are now automated' },
      ],
      approach: "E-commerce SEO isn't one person's job. It's a systems job. A lead's task is ensuring standards can be executed by anyone on the team without losing consistency.",
      lessons: "Becoming a Team Lead taught me that technical skills alone aren't enough. The ability to explain SEO to non-technical people, convince stakeholders, and delegate clearly is just as important as mastering tools.",
    },
  },
  {
    slug: 'pinnacle',
    company: 'PT. Pinnacle Management Consulting',
    role: 'Online Marketing Specialist',
    periodStart: '2014',
    startDate: 'Feb 2014',
    periodEnd: '2016',
    endDate: 'Jul 2016',
    industry: 'Consulting',
    highlight: {
      id: 'Kelola strategi digital marketing untuk portofolio klien B2B lintas industri.',
      en: 'Managed digital marketing strategies for a portfolio of B2B clients across various industries.',
    },
    tags: ['Online Marketing', 'SEM', 'Social Media'],
    metric: null,
    tools: ['Google Ads', 'Google Analytics', 'Facebook Ads Manager', 'SEMrush', 'Hootsuite', 'Mailchimp'],
    appraisal: null,
    id: {
      companyContext: 'PT. Pinnacle Management Consulting adalah firma konsultan manajemen berbasis di Bandung, melayani klien dari berbagai industri dengan kebutuhan strategi bisnis dan digital marketing.',
      whatIDid: `<p>Ini adalah peran pertama saya yang benar-benar terjun ke digital marketing secara profesional. Di sini saya belajar kelola banyak klien dengan industri berbeda secara bersamaan, sesuatu yang mengajarkan adaptabilitas yang sangat berharga.</p>
<p>Saya kerjakan campuran layanan: SEO awal, Google Ads, media sosial, dan email marketing. Belum ada spesialisasi ketat di sini, tapi justru inilah yang kasih saya fondasi luas sebelum pilih mendalami SEO.</p>
<p>Menghadapi klien B2B juga membentuk cara saya komunikasikan soal marketing: bukan sekadar laporan traffic, tapi bagaimana aktivitas digital berkorelasi dengan pipeline dan konversi bisnis.</p>`,
      achievements: [
        { stat: 'Multi-klien', label: 'Kelola kampanye untuk berbagai industri secara bersamaan', context: 'Dari manufaktur, edukasi, sampai jasa profesional dengan kebutuhan yang berbeda' },
        { stat: 'Generalis', label: 'Fondasi menyeluruh di seluruh channel digital marketing', context: 'SEO, SEM, social media, email, dan analytics sebelum pilih spesialisasi' },
        { stat: 'B2B', label: 'Pengalaman komunikasi marketing ke audiens bisnis', context: 'Belajar jelaskan value digital marketing dalam bahasa bisnis, bukan bahasa teknis' },
      ],
      approach: 'Sebagai generalis, kamu dipaksa benar-benar pahami bisnis klien sebelum rekomendasikan channel apapun. Ini yang bentuk kebiasaan saya untuk selalu mulai dari tujuan bisnis, bukan dari tools.',
      lessons: 'Pengalaman generalis di awal karir adalah investasi jangka panjang. Paham bagaimana semua channel berinteraksi membuat saya jauh lebih efektif ketika akhirnya pilih spesialisasi di SEO.',
    },
    en: {
      companyContext: 'PT. Pinnacle Management Consulting is a management consulting firm based in Bandung, serving clients from various industries with business strategy and digital marketing needs.',
      whatIDid: `<p>This was my first role truly immersed in the professional digital marketing world. Here I learned to manage multiple clients from different industries simultaneously, something that taught me invaluable adaptability.</p>
<p>I handled a mix of services: early SEO, Google Ads, social media, and email marketing. No strict specialization yet, but this is precisely what gave me a broad foundation before choosing to deepen my SEO expertise.</p>
<p>Working with B2B clients also shaped how I communicate about marketing: not just traffic reports, but how digital activities correlate with pipeline and business conversions.</p>`,
      achievements: [
        { stat: 'Multi-client', label: 'Managing campaigns across various industries simultaneously', context: 'From manufacturing, education, to professional services with different needs' },
        { stat: 'Generalist', label: 'Comprehensive foundation across all digital marketing channels', context: 'SEO, SEM, social media, email, and analytics before choosing specialization' },
        { stat: 'B2B', label: 'Marketing communication experience to business audiences', context: 'Learning to explain digital marketing value in business language, not technical jargon' },
      ],
      approach: "As a generalist, you're forced to truly understand a client's business before recommending any channel. This formed my habit of always starting from business goals, not tools.",
      lessons: "A generalist experience early in your career is a long-term investment. Understanding how all channels interact made me far more effective when I finally chose to specialize in SEO.",
    },
  },
  {
    slug: 'wadezig',
    company: 'Wadezig Organization',
    role: 'Social Media Marketing Specialist',
    periodStart: '2013',
    startDate: 'Apr 2013',
    periodEnd: '2013',
    endDate: 'Aug 2013',
    industry: 'Fashion/Retail',
    highlight: {
      id: 'Bangun kehadiran media sosial brand fashion lokal Bandung di awal era digital marketing.',
      en: 'Built social media presence for a local Bandung fashion brand at the onset of the digital marketing era.',
    },
    tags: ['Social Media', 'Content Marketing'],
    metric: null,
    tools: ['Facebook Ads', 'Instagram', 'Canva', 'Buffer', 'Google Analytics'],
    appraisal: null,
    id: {
      companyContext: 'Wadezig adalah brand fashion lokal asal Bandung yang aktif bangun komunitas di media sosial, di masa Instagram baru mulai booming dan brand lokal mulai lirik digital.',
      whatIDid: `<p>Ini adalah pengalaman pertama saya di dunia marketing, sebelum kuliah selesai. Wadezig kasih saya ruang untuk belajar langsung: buat konten, kelola komunitas, dan mulai eksperimen dengan iklan di Facebook yang waktu itu masih relatif murah.</p>
<p>Di sini saya pertama kali rasakan langsung bagaimana konten yang tepat bisa gerakkan percakapan, dan bagaimana brand lokal bisa bersaing perhatian dengan brand besar hanya dengan kreativitas.</p>
<p>Meski singkat, pengalaman ini menanamkan ketertarikan saya pada relasi antara konten, komunitas, dan konversi. Sesuatu yang terus saya bawa sampai ke pekerjaan saya yang paling teknikal sekalipun.</p>`,
      achievements: [
        { stat: 'Awal', label: 'Pengalaman pertama bangun kehadiran digital brand', context: 'Kelola seluruh konten dan interaksi media sosial brand fashion lokal' },
        { stat: 'Komunitas', label: 'Bangun organic engagement di era awal Instagram', context: 'Saat algoritma masih sederhana dan konten autentik punya jangkauan nyata' },
        { stat: 'Dasar', label: 'Fondasi pemahaman konten dan perilaku audiens digital', context: 'Pengalaman pertama yang bentuk cara saya lihat hubungan konten dan konversi' },
      ],
      approach: 'Brand lokal tidak bisa kalahkan budget iklan brand besar. Tapi bisa kalahkan mereka di keautentikan dan kedekatan dengan komunitas.',
      lessons: 'Pengalaman ini mengajarkan bahwa marketing yang paling efektif adalah yang terasa personal dan relevan, bukan yang paling besar anggarannya.',
    },
    en: {
      companyContext: 'Wadezig is a local fashion brand from Bandung that actively built its community on social media, at a time when Instagram was just beginning to boom and local brands were starting to look at digital.',
      whatIDid: `<p>This was my first experience in the marketing world, before finishing university. Wadezig gave me space to learn hands-on: create content, manage community, and start experimenting with Facebook ads that were still relatively cheap at the time.</p>
<p>Here I first felt firsthand how the right content can move conversations, and how a local brand can compete for attention against big brands through creativity alone.</p>
<p>Though brief, this experience planted my interest in the relationship between content, community, and conversion. Something I continue to carry into even my most technical work.</p>`,
      achievements: [
        { stat: 'First', label: "First experience building a brand's digital presence", context: 'Managed all content and social media interactions for a local fashion brand' },
        { stat: 'Community', label: 'Built organic engagement in the early Instagram era', context: 'When algorithms were simpler and authentic content had real reach' },
        { stat: 'Foundation', label: 'Foundation of understanding content and digital audience behavior', context: 'The first experience that shaped how I see the relationship between content and conversion' },
      ],
      approach: "Local brands can't outspend big brand advertising budgets. But they can outperform them in authenticity and community closeness.",
      lessons: "This experience taught me that the most effective marketing is what feels personal and relevant, not what has the biggest budget.",
    },
  },
]

// ─── Case Study data ──────────────────────────────────────────────────────────

const caseStudies = [
  {
    slug: 'bareksa-seo-recovery',
    industry: 'Fintech',
    service: 'Independent SEO Consultation',
    heroMetric: '13x',
    metricLabel: { id: 'Impressions organik', en: 'Organic impressions' },
    timeframe: { id: 'di fase pertama', en: 'in the first phase' },
    title: {
      id: 'Balikkan penurunan traffic Bareksa di tengah Google Core Update',
      en: "Reversing Bareksa's traffic decline through a Google Core Update",
    },
    summary: {
      id: 'Bareksa alami penurunan organic traffic yang konsisten saat dua Core Update Google datang berturut-turut. Root cause-nya bukan update-nya, tapi technical debt yang lama menumpuk diam-diam.',
      en: "Bareksa was facing a consistent organic traffic decline when two consecutive Google Core Updates hit. The real problem wasn't the updates: it was years of accumulated technical debt quietly catching up.",
    },
    // Flat array — single set of metrics used for both locales
    metrics: [
      { stat: '>13x', label: 'Organic impressions (first phase)', context: 'From a consistent decline driven by years of accumulated technical debt quietly catching up' },
      { stat: '>85%', label: 'Error pages reduced', context: 'From a critical volume to near-zero within a single batch engagement' },
      { stat: 'Tens of thousands', label: 'Bareksapedia monthly visitors', context: "Grown from zero in six months, now functioning as a direct conversion funnel into Bareksa's financial products" },
    ],
    challenge: {
      id: `Bareksa alami penurunan organic traffic yang konsisten memasuki 2021. Situasi makin berat saat Google Core Update datang berturut-turut di Juni dan Juli tahun yang sama.

Yang bikin situasinya rumit: root cause-nya bukan update-nya itu sendiri. Update Google hanya mempercepat dampak dari isu teknikal lama yang tidak pernah dibenahi. Canonical yang konflik, halaman yang tidak terindeks, mobile serving yang berbeda dari desktop, HTTPS yang bermasalah di platform YMYL. Semuanya menumpuk diam-diam.

Pertanyaannya bukan "bagaimana recover dari update?" tapi "apa yang sebenarnya sudah salah jauh sebelum update itu datang?"`,
      en: `Bareksa had been experiencing a consistent decline in organic traffic entering 2021. The situation became more difficult as Google Core Updates hit in both June and July of that year.

What made it complex: the updates weren't the root cause. Google's algorithm changes simply accelerated the impact of long-standing technical issues that had never been resolved. Conflicting canonicals, unindexed pages, inconsistent mobile vs. desktop serving, HTTPS failures on a YMYL platform. All of it had been quietly accumulating.

The question wasn't "how do we recover from the update?" It was "what was already broken long before the update arrived?"`,
    },
    approach: {
      id: `Konsultasi ini berjalan dalam tiga fase selama sembilan bulan.

Fase 1 (Mei–Agustus 2021): prioritas utama adalah stabilisasi. Audit menyeluruh menemukan banyak isu teknikal mendasar: canonical yang konflik, user-agent serving yang berbeda antara Googlebot Desktop dan Smartphone, H1 yang hilang atau salah konteks, dan HTTPS yang bermasalah. Krusial, karena Bareksa masuk kategori YMYL (Your Money, Your Life) yang diperlakukan Google dengan standar paling ketat.

Proyek paling signifikan di fase ini adalah migrasi Bareksapedia dari Single Page Application ke multi-page dengan meta tags dan Open Graph yang lengkap. Keputusan teknikal yang hasilnya baru terasa di fase berikutnya.

Fase 2 (Agustus–November 2021): setelah fondasi stabil, fokus beralih ke performa dan konten. Migrasi CSR ke SSR akhirnya selesai, item paling krusial karena halaman yang di-render di sisi client sering terlihat kosong oleh Googlebot. Paralel dengan itu, halaman produk baru dioptimasi visibility-nya, dan A/B testing CTA di artikel dimulai dengan tracking code tersendiri.

Fase 3 (November 2021–Februari 2022): bukan lagi soal perbaikan besar. Fokusnya adalah jaga posisi yang sudah dicapai dan dorong konten ke arah konversi bisnis yang lebih konkret.`,
      en: `The consultation ran across three phases over nine months.

Phase 1 (May–August 2021): the priority was stabilization. A comprehensive audit uncovered numerous fundamental technical issues: conflicting canonicals, different user-agent serving between Googlebot Desktop and Smartphone, missing or contextually wrong H1 tags, and HTTPS failures. Critical, because Bareksa falls under the YMYL (Your Money, Your Life) category that Google holds to its strictest standards.

The most significant project in this phase was migrating Bareksapedia from a Single Page Application to a multi-page architecture with proper meta tags and Open Graph. A technical decision whose real impact would only be felt in the next phase.

Phase 2 (August–November 2021): with the foundation stable, focus shifted to performance and content. The CSR to SSR migration was finally completed, the most critical pending item since client-side rendered pages often appear empty to Googlebot. In parallel, new product pages were optimized for visibility, and CTA A/B testing in articles began with dedicated tracking codes.

Phase 3 (November 2021–February 2022): no longer about major fixes. The focus was maintaining achieved positions while pushing content toward more concrete business conversions.`,
    },
    results: {
      id: `Di fase pertama saja, organic impressions tumbuh lebih dari 13x dan error pages turun lebih dari 85%. Organic traffic mulai bergerak meski perbaikan teknikal masih berjalan.

Momentum terbesar datang dari Bareksapedia. Dari hampir nol pengunjung organik, dalam enam bulan tumbuh ke puluhan ribu pengunjung per bulan. Ini bukan sekadar traffic source baru: Bareksapedia dirancang sebagai direct conversion funnel, dengan CTA ke produk keuangan Bareksa yang terpasang rapi di dalam kamus investasi.

Di akhir engagement, organic clicks tumbuh lebih dari 50% dibanding kondisi awal, error pages tersisa kurang dari 3% dari volume semula, dan halaman produk utama sudah punya posisi stabil di hasil pencarian.

Yang paling penting: ketika engagement berakhir, tim internal Bareksa sudah punya sistem, standar, dan pemahaman yang cukup untuk lanjut sendiri.`,
      en: `In the first phase alone, organic impressions grew more than 13x and error pages dropped more than 85%. Organic traffic started moving even as technical fixes were still underway.

The biggest momentum came from Bareksapedia. From near-zero organic visitors, it grew to tens of thousands of monthly visitors within six months. This wasn't just a new traffic source: Bareksapedia was designed as a direct conversion funnel, with CTAs into Bareksa's financial products embedded naturally within an investment glossary.

By the end of the engagement, organic clicks had grown more than 50% compared to the start of the consultation, error pages were down to less than 3% of their original volume, and key product pages had established stable search rankings.

Most importantly: when the engagement ended, Bareksa's internal team had the systems, standards, and understanding to continue independently.`,
    },
  },
]

// ─── Insights data ────────────────────────────────────────────────────────────

const insights = [
  {
    slug: 'mengapa-seo-bukan-sekadar-konten',
    category: 'SEO Strategy',
    readTime: 7,
    date: '2024-12-15',
    title: { id: 'Mengapa SEO bukan hanya tentang membuat lebih banyak konten', en: "Why SEO isn't just about creating more content" },
    excerpt: {
      id: 'Banyak tim marketing percaya bahwa solusi SEO adalah memproduksi lebih banyak konten. Tapi data menunjukkan sesuatu yang berbeda.',
      en: "Many marketing teams believe the solution to SEO is to produce more content. But data shows something different.",
    },
    authorBio: {
      id: 'SEO & Marketing Analytics Consultant. Membantu bisnis tumbuh melalui data dan strategi.',
      en: 'SEO & Marketing Analytics Consultant. Helping businesses grow through data and strategy.',
    },
    body: {
      id: `<p>Ketika klien baru datang ke saya dengan masalah SEO, respons pertama mereka hampir selalu sama: <em>"Kami perlu lebih banyak konten."</em></p>
<p>Ini pemahaman yang logis, Google suka konten, lebih banyak konten berarti lebih banyak kesempatan untuk ditemukan. Tapi logika ini sering kali menyesatkan.</p>
<h2>Data yang tidak berbohong</h2>
<p>Dari 10 klien terakhir yang datang dengan masalah traffic organik stagnan, 7 di antaranya punya masalah teknikal yang lebih fundamental dari konten. Duplicate content, crawl budget yang habis untuk halaman tidak penting, atau canonical tags yang salah.</p>
<p>Konten baru yang dibuat di atas fondasi teknikal yang rusak seperti membangun rumah di atas pasir, tidak akan bertahan.</p>
<h2>Urutan yang benar</h2>
<p>Sebelum memutuskan strategi konten, tanya dua pertanyaan ini:</p>
<ol><li>Apakah konten yang sudah ada terindeks dengan benar?</li><li>Apakah Google bisa merayapi situs Anda secara efisien?</li></ol>
<p>Jika jawabannya tidak, memproduksi lebih banyak konten hanya akan memperparah masalah, karena Anda menambah lebih banyak halaman yang tidak diindeks.</p>`,
      en: `<p>When a new client comes to me with an SEO problem, their first response is almost always the same: <em>"We need more content."</em></p>
<p>This is a logical assumption. Google likes content, more content means more chances to be found. But this logic is often misleading.</p>
<h2>Data that doesn't lie</h2>
<p>Of the last 10 clients who came to me with stagnant organic traffic, 7 had technical problems more fundamental than content. Duplicate content, crawl budget wasted on unimportant pages, or incorrect canonical tags.</p>
<p>New content built on top of a broken technical foundation is like building a house on sand. It won't hold.</p>
<h2>The right order</h2>
<p>Before deciding on a content strategy, ask these two questions:</p>
<ol><li>Is the existing content indexed correctly?</li><li>Can Google crawl your site efficiently?</li></ol>
<p>If the answer is no, producing more content will only make the problem worse. You're adding more pages that aren't being indexed.</p>`,
    },
  },
  {
    slug: 'ga4-untuk-marketer',
    category: 'Analytics',
    readTime: 9,
    date: '2024-11-28',
    title: { id: 'GA4 untuk marketer: apa yang benar-benar penting', en: 'GA4 for marketers: what actually matters' },
    excerpt: {
      id: 'GA4 punya ratusan fitur. Tapi sebagai marketer, Anda hanya butuh menguasai 10% dari itu untuk membuat keputusan yang lebih baik.',
      en: "GA4 has hundreds of features. But as a marketer, you only need to master 10% of them to make better decisions.",
    },
    authorBio: {
      id: 'SEO & Marketing Analytics Consultant. Membantu bisnis tumbuh melalui data dan strategi.',
      en: 'SEO & Marketing Analytics Consultant. Helping businesses grow through data and strategy.',
    },
    body: {
      id: `<p>GA4 sering terasa overwhelming. Interface baru, terminologi berbeda, laporan yang tidak ada di tempat yang sama seperti UA. Banyak marketer yang sudah ada di GA4 berbulan-bulan tapi masih belum yakin apa yang sebenarnya mereka lihat.</p>
<h2>Mulai dari pertanyaan, bukan fitur</h2>
<p>Kesalahan terbesar dengan GA4 adalah mencoba pelajari semua fiturnya. GA4 adalah alat, bukan tujuan. Mulailah dari pertanyaan bisnis yang ingin Anda jawab, lalu cari fitur yang menjawab pertanyaan itu.</p>
<h2>Tiga hal yang harus Anda kuasai dulu</h2>
<p>Pertama, Events. GA4 berbasis event, bukan sesi. Pahami event apa yang sudah tracking secara otomatis dan event apa yang perlu Anda setup sendiri.</p>
<p>Kedua, Conversions. Tentukan apa yang dianggap konversi untuk bisnis Anda dan pastikan itu ditandai dengan benar di GA4.</p>
<p>Ketiga, Explorations. Laporan standar GA4 terbatas. Explorations adalah di mana Anda bisa bangun analisis yang lebih dalam sesuai kebutuhan spesifik Anda.</p>`,
      en: `<p>GA4 often feels overwhelming. New interface, different terminology, reports not where they used to be in UA. Many marketers have been on GA4 for months but still aren't sure what they're actually looking at.</p>
<h2>Start from questions, not features</h2>
<p>The biggest mistake with GA4 is trying to learn all its features. GA4 is a tool, not a destination. Start from the business questions you want to answer, then find the feature that answers them.</p>
<h2>Three things to master first</h2>
<p>First, Events. GA4 is event-based, not session-based. Understand what events are already tracking automatically and what events you need to set up yourself.</p>
<p>Second, Conversions. Define what counts as a conversion for your business and make sure it's properly marked in GA4.</p>
<p>Third, Explorations. GA4's standard reports are limited. Explorations is where you can build deeper analysis tailored to your specific needs.</p>`,
    },
  },
  {
    slug: 'attribution-modeling-sederhana',
    category: 'Analytics',
    readTime: 12,
    date: '2024-11-10',
    title: { id: 'Attribution modeling: panduan yang tidak bikin pusing', en: "Attribution modeling: a guide that won't make your head spin" },
    excerpt: {
      id: 'Last-click attribution sudah mati. Tapi multi-touch attribution yang terlalu kompleks juga tidak selalu membantu. Di mana titik tengahnya?',
      en: "Last-click attribution is dead. But overly complex multi-touch attribution doesn't always help either. Where's the middle ground?",
    },
    authorBio: {
      id: 'SEO & Marketing Analytics Consultant. Membantu bisnis tumbuh melalui data dan strategi.',
      en: 'SEO & Marketing Analytics Consultant. Helping businesses grow through data and strategy.',
    },
    body: {
      id: `<p>Attribution modeling adalah salah satu topik yang paling sering dibicarakan tapi paling jarang dipahami dengan benar di dunia marketing digital.</p>
<h2>Kenapa last-click tidak cukup</h2>
<p>Last-click attribution memberi 100% kredit konversi ke touchpoint terakhir sebelum pembelian. Masalahnya: customer journey modern melibatkan banyak touchpoint. Organic search, social media, email, direct. Jika Anda hanya lihat last-click, Anda mungkin undervalue channel yang sebenarnya memulai perjalanan pembelian.</p>
<h2>Tapi apakah multi-touch selalu lebih baik?</h2>
<p>Tidak selalu. Multi-touch attribution yang kompleks butuh data yang bersih, volume konversi yang cukup, dan pemahaman statistik yang kuat untuk diinterpretasikan dengan benar. Banyak bisnis belum siap untuk ini.</p>
<h2>Titik tengah yang pragmatis</h2>
<p>Untuk sebagian besar bisnis, pendekatan yang paling actionable adalah: gunakan data-driven attribution di GA4 sebagai baseline, tapi supplement dengan first-click analysis untuk pahami channel mana yang paling sering memulai perjalanan pembelian.</p>`,
      en: `<p>Attribution modeling is one of the most talked about but least properly understood topics in digital marketing.</p>
<h2>Why last-click isn't enough</h2>
<p>Last-click attribution gives 100% conversion credit to the last touchpoint before purchase. The problem: modern customer journeys involve many touchpoints. Organic search, social media, email, direct. If you only look at last-click, you may undervalue channels that actually initiated the purchase journey.</p>
<h2>But is multi-touch always better?</h2>
<p>Not always. Complex multi-touch attribution requires clean data, sufficient conversion volume, and strong statistical understanding to interpret correctly. Many businesses aren't ready for this.</p>
<h2>The pragmatic middle ground</h2>
<p>For most businesses, the most actionable approach is: use data-driven attribution in GA4 as a baseline, but supplement with first-click analysis to understand which channels most often initiate the purchase journey.</p>`,
    },
  },
]

// ─── Migration runner ─────────────────────────────────────────────────────────

async function migrate() {
  console.log('Starting migration...\n')

  // Experience
  console.log('── Migrating Experience ──')
  for (const exp of experiences) {
    const doc = {
      _id: `experience-${exp.slug}`,
      _type: 'experience',
      slug: { _type: 'slug', current: exp.slug },
      company: exp.company,
      role: exp.role,
      periodStart: exp.periodStart,
      startDate: exp.startDate,
      periodEnd: exp.periodEnd ?? undefined,
      endDate: exp.endDate ?? undefined,
      industry: exp.industry,
      tags: exp.tags,
      metric: exp.metric ?? undefined,
      tools: exp.tools,
      appraisal: exp.appraisal ? {
        period: exp.appraisal.period,
        managerQuotes: exp.appraisal.managerQuotes.map(q => ({ ...q, _key: key() })),
      } : undefined,
      id: {
        highlight: exp.highlight.id,
        companyContext: exp.id.companyContext,
        whatIDid: htmlToPT(exp.id.whatIDid),
        achievements: exp.id.achievements.map(a => ({ ...a, _key: key() })),
        approach: exp.id.approach,
        lessons: exp.id.lessons,
      },
      en: {
        highlight: exp.highlight.en,
        companyContext: exp.en.companyContext,
        whatIDid: htmlToPT(exp.en.whatIDid),
        achievements: exp.en.achievements.map(a => ({ ...a, _key: key() })),
        approach: exp.en.approach,
        lessons: exp.en.lessons,
      },
      seo: {
        metaTitleId: '',
        metaTitleEn: '',
        metaDescId: '',
        metaDescEn: '',
        noIndex: false,
      },
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${exp.company} – ${exp.role}`)
  }

  // Case Studies
  console.log('\n── Migrating Case Studies ──')
  for (const cs of caseStudies) {
    const doc = {
      _id: `caseStudy-${cs.slug}`,
      _type: 'caseStudy',
      slug: { _type: 'slug', current: cs.slug },
      industry: cs.industry,
      service: cs.service,
      heroMetric: cs.heroMetric,
      metrics: cs.metrics.map(m => ({ ...m, _key: key() })),
      id: {
        title: cs.title.id,
        metricLabel: cs.metricLabel.id,
        timeframe: cs.timeframe.id,
        summary: cs.summary.id,
        challenge: cs.challenge.id,
        approach: cs.approach.id,
        results: cs.results.id,
      },
      en: {
        title: cs.title.en,
        metricLabel: cs.metricLabel.en,
        timeframe: cs.timeframe.en,
        summary: cs.summary.en,
        challenge: cs.challenge.en,
        approach: cs.approach.en,
        results: cs.results.en,
      },
      seo: {
        metaTitleId: '',
        metaTitleEn: '',
        metaDescId: '',
        metaDescEn: '',
        noIndex: false,
      },
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${cs.slug}`)
  }

  // Insights
  console.log('\n── Migrating Insights ──')
  for (const ins of insights) {
    const doc = {
      _id: `insight-${ins.slug}`,
      _type: 'insight',
      slug: { _type: 'slug', current: ins.slug },
      category: ins.category,
      readTime: ins.readTime,
      date: ins.date,
      id: {
        title: ins.title.id,
        excerpt: ins.excerpt.id,
        body: htmlToPT(ins.body.id),
        authorBio: ins.authorBio.id,
      },
      en: {
        title: ins.title.en,
        excerpt: ins.excerpt.en,
        body: htmlToPT(ins.body.en),
        authorBio: ins.authorBio.en,
      },
      seo: {
        metaTitleId: '',
        metaTitleEn: '',
        metaDescId: '',
        metaDescEn: '',
        noIndex: false,
      },
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${ins.slug}`)
  }

  await migratePages()
  await migrateHomePage()

  console.log('\n✅ Migration complete!')
}

// ─── Pages migration ──────────────────────────────────────────────────────────

async function migratePages() {
  // ── About Page ──────────────────────────────────────────────────────────────
  console.log('\n── Migrating About Page ──')

  const aboutDoc = {
    _id: 'aboutPage',
    _type: 'aboutPage',
    id: {
      headingLine1: 'Saya tidak percaya angka',
      headingLine2: 'yang tidak bisa saya pertanyakan.',
      paragraphs: [
        block(parseInline('Perjalanan saya dimulai dari SEO, bukan karena teknikal-nya, tapi karena pertanyaannya: <em>mengapa</em> konten ini ditemukan dan yang lain tidak? Dari sana, saya masuk ke analytics, lalu ke sesuatu yang lebih dalam: <strong>bagaimana variabel satu memengaruhi yang lain</strong>.')),
        block(parseInline('Kebanyakan marketer berhenti di metrik permukaan. Saya tidak. Saya cari driver yang sesungguhnya: variabel mana yang benar-benar menggerakkan pertumbuhan, bukan yang hanya berkorelasi dengannya. Perbedaan ini kecil secara tampilan, tapi besar dalam keputusan.')),
        block(parseInline('Saya berpikir dalam bentuk sistem dan model. Setiap engagement biasanya berakhir dengan sesuatu yang bisa dipakai ulang: framework, scoring logic, atau pipeline yang menjawab pertanyaan yang sama di masa depan tanpa harus memulai dari nol.')),
        block(parseInline('Saya bekerja paling baik dengan tim yang ingin tahu <strong>mengapa</strong>. Yang tidak puas dengan "traffic naik" tanpa bisa menjelaskan kenapa, dan tidak nyaman dengan keputusan besar berbasis intuisi saja.')),
      ],
      seeExperience: 'Lihat pengalaman kerja saya',
      coreValuesLabel: 'Keahlian Utama',
      coreValues: [
        { _key: key(), label: 'Logic', desc: 'Causality over correlation. Saya cari sebab, bukan sekadar pola.' },
        { _key: key(), label: 'Branding', desc: 'Identitas yang konsisten adalah sistem, bukan estetika semata.' },
        { _key: key(), label: 'Storytelling', desc: 'Data tanpa narasi tidak bergerak. Narasi tanpa data tidak dipercaya.' },
        { _key: key(), label: 'Empathy', desc: 'Insight terbaik lahir dari memahami manusia di balik angka.' },
      ],
      achievementsTitle: 'Apa yang Pernah Saya Bangun',
      achievements: [
        { _key: key(), title: 'SEO Visibility & Intent Ownership', desc: 'Memenangkan SERP pada keyword kompetitif dan menggeser dominasi intent pencarian. Dari tidak muncul sama sekali, menjadi entitas utama di ekosistem search.' },
        { _key: key(), title: 'Engagement Score (Custom Metric System)', desc: 'Mendesain metrik komposit dengan variable weighting untuk evaluasi performa konten. Menggantikan raw metric yang misleading dengan decision tool yang actionable.' },
        { _key: key(), title: 'Data Consistency & Tracking Framework', desc: 'Membangun sistem yang menghubungkan aktivitas marketing dengan outcome secara terstruktur: framework, logic, dan dokumentasi yang bisa dipakai tim lintas fungsi.' },
        { _key: key(), title: 'Regression Analysis dalam Marketing', desc: 'Mengaplikasikan causal modeling untuk mengidentifikasi driver utama metric bisnis. Memisahkan signal dari noise sebelum keputusan diambil.' },
        { _key: key(), title: 'Data Pipeline & Automation Skala Besar', desc: 'Mengelola dan mengotomasi analisis ratusan ribu baris data menggunakan Google Sheets dan Apps Script, melampaui batas analisis manual.' },
        { _key: key(), title: 'AI Workflow & AI-Driven Visibility', desc: 'Menginisiasi integrasi AI dalam workflow marketing dan eksplorasi AI-driven discovery. Memposisikan kerja di gelombang berikutnya sebelum menjadi standar.' },
        { _key: key(), title: 'Product & CMS Thinking', desc: 'Berkontribusi dalam desain struktur CMS dan subscription model untuk platform berbasis konten. Bergerak dari marketer menuju product-oriented growth thinker.' },
      ],
      ctaHeadline: 'Punya pertanyaan yang belum bisa dijawab oleh data yang ada?',
      ctaButton: 'Mari Diskusi',
    },
    en: {
      headingLine1: "I don't trust numbers",
      headingLine2: "I can't question.",
      paragraphs: [
        block(parseInline('My journey started with SEO, not because of the technical side, but because of the question: <em>why</em> does this content get found while others don\'t? From there I moved into analytics, then into something deeper: <strong>how one variable actually influences another</strong>.')),
        block(parseInline("Most marketers stop at surface metrics. I don't. I look for the real drivers: which variables actually move growth, not just the ones that correlate with it. The difference looks small, but it is large when decisions are on the line.")),
        block(parseInline("I think in systems and models. Every engagement usually ends with something reusable: a framework, scoring logic, or a pipeline that can answer the same question in the future without starting from scratch.")),
        block(parseInline('I work best with teams who want to know <strong>why</strong>. Who aren\'t satisfied with "traffic went up" without being able to explain it, and who aren\'t comfortable making big decisions on intuition alone.')),
      ],
      seeExperience: 'View my work history',
      coreValuesLabel: 'Core Principles',
      coreValues: [
        { _key: key(), label: 'Logic', desc: 'Causality over correlation. I look for causes, not just patterns.' },
        { _key: key(), label: 'Branding', desc: 'Consistent identity is a system, not just aesthetics.' },
        { _key: key(), label: 'Storytelling', desc: "Data without narrative doesn't move. Narrative without data isn't trusted." },
        { _key: key(), label: 'Empathy', desc: 'The best insights come from understanding the humans behind the numbers.' },
      ],
      achievementsTitle: "What I've Built",
      achievements: [
        { _key: key(), title: 'SEO Visibility & Intent Ownership', desc: 'Won SERP on competitive keywords and shifted search intent dominance. From no presence at all to becoming the primary entity in the search ecosystem.' },
        { _key: key(), title: 'Engagement Score (Custom Metric System)', desc: 'Designed a composite metric with variable weighting for content performance evaluation. Replaced misleading raw metrics with an actionable decision tool.' },
        { _key: key(), title: 'Data Consistency & Tracking Framework', desc: 'Built a system connecting marketing activities to outcomes in a structured way: framework, logic, and documentation usable across team functions.' },
        { _key: key(), title: 'Regression Analysis in Marketing', desc: 'Applied causal modeling to identify the primary drivers of business metrics. Separated signal from noise before decisions are made.' },
        { _key: key(), title: 'Data Pipeline & Large-Scale Automation', desc: 'Managed and automated analysis of hundreds of thousands of rows using Google Sheets and Apps Script, exceeding manual analysis limits.' },
        { _key: key(), title: 'AI Workflow & AI-Driven Visibility', desc: 'Initiated AI integration in marketing workflows and explored AI-driven discovery. Positioned the work ahead of the next wave before it became standard.' },
        { _key: key(), title: 'Product & CMS Thinking', desc: 'Contributed to CMS structure design and subscription model for a content-based platform. Moving from marketer toward product-oriented growth thinker.' },
      ],
      ctaHeadline: "Have a question your current data can't answer?",
      ctaButton: "Let's Talk",
    },
    skills: [
      {
        _key: key(),
        category: 'SEO',
        tagline: 'Intent & visibility control: beyond keyword ranking',
        tags: [
          { _key: key(), label: 'Search Intent Modeling', highlight: true },
          { _key: key(), label: 'SERP Positioning', highlight: true },
          { _key: key(), label: 'Entity-Based SEO', highlight: true },
          { _key: key(), label: 'AI / LLM Visibility Optimization', highlight: true },
          { _key: key(), label: 'Intent Ownership Strategy', highlight: false },
          { _key: key(), label: 'Organic Attribution Modeling', highlight: false },
          { _key: key(), label: 'SEO Measurement Framework', highlight: false },
          { _key: key(), label: 'Content-Search Alignment', highlight: false },
          { _key: key(), label: 'Technical SEO', highlight: false },
          { _key: key(), label: 'Core Web Vitals', highlight: false },
        ],
      },
      {
        _key: key(),
        category: 'Analytics & Data',
        tagline: 'Finding real drivers, not just reading what happened',
        tags: [
          { _key: key(), label: 'Causal Analysis', highlight: true },
          { _key: key(), label: 'Metric Engineering', highlight: true },
          { _key: key(), label: 'Hypothesis-Driven Analysis', highlight: true },
          { _key: key(), label: 'Signal vs Noise Analysis', highlight: true },
          { _key: key(), label: 'Attribution Modeling', highlight: false },
          { _key: key(), label: 'Decision-Oriented Analytics', highlight: false },
          { _key: key(), label: 'Data Consistency Framework', highlight: false },
          { _key: key(), label: 'Growth Driver Identification', highlight: false },
          { _key: key(), label: 'Google Analytics 4', highlight: false },
          { _key: key(), label: 'BigQuery', highlight: false },
          { _key: key(), label: 'Looker Studio', highlight: false },
        ],
      },
      {
        _key: key(),
        category: 'Systems & Automation',
        tagline: 'Turning simple tools into scalable systems',
        tags: [
          { _key: key(), label: 'Scalable Spreadsheet Systems', highlight: true },
          { _key: key(), label: 'Workflow Automation', highlight: true },
          { _key: key(), label: 'AI-Assisted Analysis', highlight: true },
          { _key: key(), label: 'Custom Data Pipelines', highlight: false },
          { _key: key(), label: 'Lightweight Data Engineering', highlight: false },
          { _key: key(), label: 'Google Sheets (Advanced)', highlight: false },
          { _key: key(), label: 'Apps Script', highlight: false },
          { _key: key(), label: 'Google Search Console', highlight: false },
          { _key: key(), label: 'Ahrefs', highlight: false },
        ],
      },
    ],
    seo: {
      metaTitleId: '',
      metaTitleEn: '',
      metaDescId: '',
      metaDescEn: '',
      noIndex: false,
    },
  }
  await client.createOrReplace(aboutDoc)
  console.log('  ✓ aboutPage')

  // ── Services Index Page ──────────────────────────────────────────────────────
  console.log('\n── Migrating Services Index Page ──')

  const servicesPageDoc = {
    _id: 'servicesPage',
    _type: 'servicesPage',
    id: {
      processHeading: 'Bagaimana Kita Bekerja Sama',
      process: [
        { _key: key(), step: '01', title: 'Discovery', desc: 'Kita mulai dengan pertanyaan yang tepat, bukan langsung ke solusi. Saya perlu paham konteks bisnis, bukan cuma gejalanya.' },
        { _key: key(), step: '02', title: 'Audit & Diagnosis', desc: 'Saya cari root cause-nya, bukan cuma surface problem. Apa yang benar-benar terjadi vs. apa yang terlihat terjadi.' },
        { _key: key(), step: '03', title: 'Strategy & Model', desc: 'Rencana yang bisa dijelaskan logikanya: variabel apa yang diubah, hipotesisnya apa, dan bagaimana cara ukur hasilnya.' },
        { _key: key(), step: '04', title: 'Execute & Learn', desc: 'Eksekusi dengan tracking ketat. Setiap aksi adalah eksperimen. Hasilnya yang menentukan langkah berikutnya.' },
      ],
      learnMore: 'Pelajari lebih lanjut',
      ctaBannerHeadline: 'Ada proyek yang ingin kamu diskusikan?',
    },
    en: {
      processHeading: 'How We Work Together',
      process: [
        { _key: key(), step: '01', title: 'Discovery', desc: 'We start with the right questions, not solutions. I need to understand the business context, not just the symptoms.' },
        { _key: key(), step: '02', title: 'Audit & Diagnosis', desc: "I look for the root cause, not just the surface problem. What's actually happening vs. what appears to be happening." },
        { _key: key(), step: '03', title: 'Strategy & Model', desc: 'A plan whose logic can be explained: which variables to change, with what hypothesis, and how to measure results.' },
        { _key: key(), step: '04', title: 'Execute & Learn', desc: 'Execute with tight tracking. Every action is an experiment. The results tell us what to do next.' },
      ],
      learnMore: 'Learn more',
      ctaBannerHeadline: "Have a project you'd like to discuss?",
    },
    seo: {
      metaTitleId: '',
      metaTitleEn: '',
      metaDescId: '',
      metaDescEn: '',
      noIndex: false,
    },
  }
  await client.createOrReplace(servicesPageDoc)
  console.log('  ✓ servicesPage')

  // ── Service Pages ────────────────────────────────────────────────────────────
  console.log('\n── Migrating Service Pages ──')

  const seoConsultingDoc = {
    _id: 'servicePage-seo-consulting',
    _type: 'servicePage',
    slug: { _type: 'slug', current: 'seo-consulting' },
    title: 'SEO Consulting',
    keywords: ['SEO Strategy', 'Technical SEO', 'Content SEO', 'YMYL', 'Indexability', 'Rendering Audit', 'SEO Audit'],
    caseStudy: {
      slug: 'bareksa-seo-recovery',
      labelId: 'Lihat contoh nyata',
      labelEn: 'See a real example',
      metaId: 'Bareksa: Membalikkan penurunan traffic di tengah Google Core Update',
      metaEn: 'Bareksa: Reversing traffic decline through a Google Core Update',
    },
    id: {
      tagline: 'Bukan soal traffic semata. Tapi traffic yang punya intent.',
      description: 'Sebelum ada solusi, harus ada diagnosis. Saya cari root cause-nya dulu, bukan langsung loncat ke taktik.',
      outcomes: [
        'Technical audit: canonical conflict, rendering issue, indexability',
        'YMYL compliance untuk fintech, health, dan legal platform',
        'Keyword strategy dari real search intent, bukan sekadar volume',
        'Content yang kerja sebagai conversion funnel, bukan cuma traffic',
      ],
      subtitle: 'Organic growth dari diagnosis yang jujur, dieksekusi bertahap.',
      hero: 'Traffic turun saat Google Core Update. Halaman tidak terindeks meski sudah dipublish. Kompetitor outrank padahal konten kamu lebih baik. Masalah seperti ini jarang berdiri sendiri. Biasanya ada technical debt yang menumpuk diam-diam: canonical yang konflik, halaman yang di-render di sisi client jadi terlihat kosong oleh Googlebot, atau mobile serving yang berbeda dari desktop. Pekerjaan saya dimulai dari sana.',
      problem: [
        'Traffic organik turun setelah Google Core Update dan tidak tahu harus mulai dari mana',
        'Halaman sudah dipublish tapi tidak muncul di hasil pencarian',
        'Platform pakai Client-Side Rendering (SPA) yang tidak ramah Googlebot',
        'Situs masuk kategori YMYL tapi belum memenuhi standar teknikal Google',
        'Content strategy tidak nyambung ke funnel bisnis, cuma kejar traffic',
      ],
      deliverables: [
        {
          _key: key(),
          title: 'Fase 1: Fondasi Teknikal',
          items: [
            'Audit canonical: temukan dan perbaiki konflik yang bikin Google bingung',
            'Audit rendering: identifikasi halaman yang terlihat kosong oleh Googlebot karena CSR',
            'User-agent serving: pastikan Googlebot Desktop dan Smartphone dapat konten yang konsisten',
            'HTTPS dan YMYL compliance: krusial untuk platform keuangan, kesehatan, dan hukum',
            'XML sitemap dan meta tags yang terstruktur per kategori konten',
          ],
        },
        {
          _key: key(),
          title: 'Fase 2: Visibilitas & Konten',
          items: [
            'Keyword strategy dari real search intent, bukan cuma volume pencarian',
            'Content architecture sebagai conversion funnel, bukan sekadar sumber traffic',
            'Optimasi halaman produk baru untuk visibility di hasil pencarian',
            'A/B testing elemen konten dengan tracking yang terukur',
          ],
        },
        {
          _key: key(),
          title: 'Fase 3: Stabilisasi & Handover',
          items: [
            'Monitoring posisi dan deteksi regresi teknikal secara proaktif',
            'Dokumentasi standar SEO yang bisa dijalankan tim internal',
            'Reporting yang menjelaskan driver perubahan, bukan cuma metrik',
          ],
        },
      ],
      faqs: [
        { _key: key(), q: 'Berapa lama untuk melihat hasil?', a: 'Perbaikan teknikal bisa terasa dalam 4-8 minggu. Pertumbuhan traffic yang signifikan butuh 3-6 bulan. Tapi dari pengalaman saya, fix teknikal yang tepat bisa menghasilkan lonjakan besar di fase awal, terutama kalau ada isu indexing yang selama ini menahan visibility.' },
        { _key: key(), q: 'Apa itu YMYL dan kenapa relevan?', a: 'YMYL (Your Money, Your Life) adalah kategori konten yang Google anggap berdampak langsung pada keuangan, kesehatan, atau keselamatan pengguna. Google terapkan standar kualitas teknikal dan konten yang jauh lebih ketat untuk situs di kategori ini. Platform fintech, asuransi, medis, dan hukum masuk sini.' },
        { _key: key(), q: 'Situs saya pakai React/Next.js, ada masalah?', a: 'Tergantung implementasinya. Framework modern bisa sangat SEO-friendly kalau dikonfigurasi dengan Server-Side Rendering (SSR) atau Static Generation. Tapi kalau masih pakai Client-Side Rendering murni, halaman kamu mungkin terlihat kosong oleh Googlebot. Ini salah satu hal pertama yang saya cek.' },
        { _key: key(), q: 'Apa yang beda dari pendekatan kamu?', a: "Saya tidak declare victory sebelum ada konfirmasi nyata dari Google. Setiap perubahan teknikal diverifikasi lewat Search Console, bukan cuma dicatat sebagai 'done'. Dan setiap rekomendasi punya alasan yang bisa dijelaskan, bukan sekadar generic best practice." },
      ],
    },
    en: {
      tagline: 'Not just traffic. Traffic that actually converts.',
      description: 'Before any solution, there has to be a diagnosis. I find the root cause first, not just jump straight to tactics.',
      outcomes: [
        'Technical audit: canonical conflicts, rendering issues, indexability',
        'YMYL compliance for fintech, health, and legal platforms',
        'Keyword strategy from real search intent, not just volume',
        'Content that works as a conversion funnel, not just a traffic driver',
      ],
      subtitle: 'Organic growth built on honest diagnosis, executed in phases.',
      hero: "Traffic drops during a Google Core Update. Pages don't get indexed despite being published. Competitors outrank you even though your content is better. Problems like these rarely stand alone. There's usually accumulated technical debt quietly catching up: conflicting canonicals, pages rendered on the client side that appear empty to Googlebot, or mobile serving inconsistent with desktop. That's where my work begins.",
      problem: [
        "Organic traffic dropped after a Google Core Update and you don't know where to start",
        "Pages are published but don't appear in search results",
        "The platform uses Client-Side Rendering (SPA) that isn't Googlebot-friendly",
        "The site falls under YMYL but hasn't met Google's technical standards",
        "Content strategy isn't connected to the business funnel, only chasing traffic",
      ],
      deliverables: [
        {
          _key: key(),
          title: 'Phase 1: Technical Foundation',
          items: [
            "Canonical audit: find and fix conflicts that confuse Google's crawlers",
            'Rendering audit: identify pages appearing empty to Googlebot due to CSR',
            'User-agent serving: ensure Googlebot Desktop and Smartphone receive consistent content',
            'HTTPS and YMYL compliance: critical for finance, health, and legal platforms',
            'Structured XML sitemaps and meta tags organized by content category',
          ],
        },
        {
          _key: key(),
          title: 'Phase 2: Visibility & Content',
          items: [
            'Keyword strategy based on real search intent, not just search volume',
            'Content architecture as a conversion funnel, not just a traffic source',
            'New product page optimization for search visibility',
            'Content element A/B testing with measurable tracking',
          ],
        },
        {
          _key: key(),
          title: 'Phase 3: Stabilization & Handover',
          items: [
            'Proactive position monitoring and technical regression detection',
            'SEO standards documentation your internal team can operate independently',
            'Reporting that explains what drove changes, not just what the metrics are',
          ],
        },
      ],
      faqs: [
        { _key: key(), q: 'How long does it take to see results?', a: 'Technical fixes can show movement in 4-8 weeks. Significant traffic growth takes 3-6 months. But in my experience, the right technical fix can produce a large early jump, especially when indexing issues have been silently suppressing visibility.' },
        { _key: key(), q: 'What is YMYL and why does it matter?', a: "YMYL (Your Money, Your Life) refers to content that Google considers to have a direct impact on users' finances, health, or safety. Google applies far stricter quality standards to sites in this category. Fintech, insurance, medical, and legal platforms all fall under this." },
        { _key: key(), q: 'My site uses React/Next.js. Is that a problem?', a: "It depends on the implementation. Modern frameworks can be very SEO-friendly when configured with Server-Side Rendering (SSR) or Static Generation. But if you're still using pure Client-Side Rendering, your pages may appear empty to Googlebot. This is one of the first things I check." },
        { _key: key(), q: 'What differentiates your approach?', a: "I don't declare victory before there's real confirmation from Google. Every technical change is verified through Search Console, not just marked as 'done'. And every recommendation has a reason that can be explained, not just a generic best practice." },
      ],
    },
    seo: {
      metaTitleId: '',
      metaTitleEn: '',
      metaDescId: '',
      metaDescEn: '',
      noIndex: false,
    },
  }
  await client.createOrReplace(seoConsultingDoc)
  console.log('  ✓ servicePage-seo-consulting')

  const marketingAnalyticsDoc = {
    _id: 'servicePage-marketing-analytics',
    _type: 'servicePage',
    slug: { _type: 'slug', current: 'marketing-analytics' },
    title: 'Marketing Analytics',
    keywords: ['GA4', 'Google Tag Manager', 'Looker Studio', 'BigQuery', 'Attribution'],
    id: {
      tagline: 'Banyak metrik yang kamu pantau tidak menjawab pertanyaan bisnis yang sesungguhnya.',
      description: 'Saya bantu kamu bedakan mana real signal, mana noise. Dari tracking setup yang akurat sampai attribution model yang jujur, supaya keputusan besar tidak lagi berbasis tebakan.',
      outcomes: [
        'GA4 implementation & audit: pastikan data yang masuk bisa dipercaya',
        'Google Tag Manager setup & governance',
        'Custom dashboard di Looker Studio yang menjawab pertanyaan bisnis nyata',
        'Attribution modeling: channel mana yang benar-benar convert',
        'BigQuery integration untuk analisis yang lebih dalam',
      ],
      subtitle: 'Dari data yang membingungkan ke keputusan yang jelas.',
      hero: 'Dashboard kamu penuh angka, tapi ketika diminta jelaskan ROI ke direksi, kamu tidak yakin. GA4 sudah dipasang, tapi tracking-nya kacau. Marketing analytics bukan soal kumpulkan data. Tapi soal ubah data itu jadi keputusan.',
      problem: [
        'GA4 baru dipasang tapi data tidak akurat atau incomplete',
        "Tidak bisa jawab pertanyaan 'channel mana yang benar-benar convert?'",
        'Dashboard yang ada tidak berguna untuk pengambilan keputusan',
        'Data tersebar di banyak platform dan tidak bisa dikonsolidasi',
      ],
      deliverables: [
        {
          _key: key(),
          title: 'Analytics Foundation',
          items: [
            'GA4 audit atau full implementation dari awal',
            'GTM setup dengan event tracking yang clean dan terdokumentasi',
            'Conversion tracking yang akurat di semua touchpoints',
            'Data layer implementation untuk data yang lebih kaya',
          ],
        },
        {
          _key: key(),
          title: 'Insights & Reporting',
          items: [
            'Custom Looker Studio dashboard untuk setiap stakeholder',
            'BigQuery integration untuk advanced analysis',
            'Attribution modeling yang sesuai dengan business model kamu',
            'Monthly analytics review dengan narrative yang jelas',
          ],
        },
      ],
      faqs: [
        { _key: key(), q: 'Apakah saya perlu migrasi dari UA ke GA4?', a: 'Universal Analytics sudah tidak aktif sejak Juli 2023. Kalau kamu belum fully migrate, sekarang saat yang tepat. Saya bisa bantu pastikan tidak ada data yang hilang dalam prosesnya.' },
        { _key: key(), q: 'Apa bedanya audit GA4 vs. implementation?', a: 'Audit cocok kalau GA4 sudah ada tapi kamu curiga data tidak akurat. Implementation cocok kalau kamu mulai dari nol atau mau rebuild yang lebih terstruktur.' },
        { _key: key(), q: 'Apakah kamu juga bisa handle BigQuery dan SQL?', a: 'Ya. Untuk analisis yang lebih dalam atau data warehouse, saya bisa setup BigQuery integration dan buat custom queries yang tidak bisa dilakukan di GA4 standar.' },
      ],
    },
    en: {
      tagline: 'Many metrics you track may be misleading',
      description: "I help you identify what's real signal and what's noise. From accurate tracking setup to honest attribution modeling, so big decisions aren't based on guesswork.",
      outcomes: [
        'GA4 implementation & audit: ensure incoming data is trustworthy',
        'Google Tag Manager setup & governance',
        'Custom Looker Studio dashboards that answer business questions',
        'Attribution modeling: which channels actually convert',
        'BigQuery integration for deeper analysis',
      ],
      subtitle: 'From confusing data to clear decisions.',
      hero: "Your dashboard is full of numbers, but when asked to explain ROI to the board, you're not sure. GA4 is installed, but the tracking is a mess. Marketing analytics isn't about collecting data. It's about turning it into decisions.",
      problem: [
        'GA4 was recently installed but data is inaccurate or incomplete',
        "You can't answer 'which channel is actually converting?'",
        "The dashboards you have aren't useful for decision-making",
        "Data is spread across many platforms and can't be consolidated",
      ],
      deliverables: [
        {
          _key: key(),
          title: 'Analytics Foundation',
          items: [
            'GA4 audit or full implementation from scratch',
            'GTM setup with clean, documented event tracking',
            'Accurate conversion tracking across all touchpoints',
            'Data layer implementation for richer data',
          ],
        },
        {
          _key: key(),
          title: 'Insights & Reporting',
          items: [
            'Custom Looker Studio dashboards for each stakeholder',
            'BigQuery integration for advanced analysis',
            'Attribution modeling suited to your business model',
            'Monthly analytics review with clear narrative',
          ],
        },
      ],
      faqs: [
        { _key: key(), q: 'Do I need to migrate from UA to GA4?', a: 'Universal Analytics has been inactive since July 2023. If you have not fully migrated, now is the time. I can help ensure no data is lost in the process.' },
        { _key: key(), q: "What's the difference between a GA4 audit and implementation?", a: 'An audit is right if GA4 already exists but you suspect the data is inaccurate. Implementation is right if you are starting from scratch or want a more structured rebuild.' },
        { _key: key(), q: 'Can you also handle BigQuery and SQL?', a: 'Yes. For deeper analysis or data warehousing, I can set up BigQuery integration and create custom queries not possible in standard GA4.' },
      ],
    },
    seo: {
      metaTitleId: '',
      metaTitleEn: '',
      metaDescId: '',
      metaDescEn: '',
      noIndex: false,
    },
  }
  await client.createOrReplace(marketingAnalyticsDoc)
  console.log('  ✓ servicePage-marketing-analytics')

  // ── Contact Page ─────────────────────────────────────────────────────────────
  console.log('\n── Migrating Contact Page ──')

  const contactPageDoc = {
    _id: 'contactPage',
    _type: 'contactPage',
    email: 'hello@hans.id',
    linkedinUrl: 'https://linkedin.com/in/hans',
    id: {
      discussionHeading: 'Yang bisa kita diskusikan',
      items: [
        'Audit SEO atau strategy baru',
        'Setup atau audit GA4 & GTM',
        'Dashboard analytics & reporting',
        'Konsultasi 1-on-1',
        'Proyek custom lainnya',
      ],
      responseNote: 'Saya biasanya merespons dalam 24 jam.',
    },
    en: {
      discussionHeading: 'What we can discuss',
      items: [
        'SEO audit or new strategy',
        'GA4 & GTM setup or audit',
        'Analytics dashboards & reporting',
        '1-on-1 consultation',
        'Custom projects',
      ],
      responseNote: 'I usually respond within 24 hours.',
    },
    seo: {
      metaTitleId: '',
      metaTitleEn: '',
      metaDescId: '',
      metaDescEn: '',
      noIndex: false,
    },
  }
  await client.createOrReplace(contactPageDoc)
  console.log('  ✓ contactPage')
}

// ─── Home Page migration ──────────────────────────────────────────────────────

async function migrateHomePage() {
  console.log('\n── Migrating Home Page ──')

  const homePageDoc = {
    _id: 'homePage',
    _type: 'homePage',
    id: {
      rootTagline: 'Strategi berbasis data, cerita yang bermakna.',
      heroTagline: 'Marketing Strategist Berbasis Data',
      heroHeadline: 'Saya Cari Apa yang Benar-Benar Menggerakkan Pertumbuhan.',
      heroSubheadline: 'Sebagian besar masalah marketing sebenarnya adalah masalah pengukuran. Saya bantu kamu cari driver pertumbuhan yang sesungguhnya, lalu bangun sistem di sekitarnya.',
      ctaPrimary: 'Lihat Karya Saya',
      ctaSecondary: 'Bekerja Sama',
      servicesTitle: 'Apa yang Saya Kerjakan',
      services: [
        { _key: key(), slug: 'seo-consulting', title: 'SEO Consulting', desc: 'Saya tidak hanya lapor traffic naik. Saya cari driver yang sesungguhnya dan jelaskan apa yang harus diubah.', ctaLabel: 'Pelajari lebih lanjut' },
        { _key: key(), slug: 'marketing-analytics', title: 'Marketing Analytics', desc: 'Saya bantu tim menemukan mana yang real signal dan mana yang noise, supaya keputusan tidak lagi berbasis tebakan.', ctaLabel: 'Pelajari lebih lanjut' },
        { _key: key(), slug: 'services', title: 'Growth Strategy', desc: 'Menggabungkan causal thinking, sistem data, dan strategi untuk menciptakan pertumbuhan yang bisa dijelaskan logikanya.', ctaLabel: 'Lihat semua layanan' },
      ],
      expertiseTitle: 'Keahlian & Tools',
      ctaBannerHeadline: 'Siap Ubah Data Jadi Pertumbuhan?',
      ctaBannerCta: 'Mari Bicara',
      previouslyAt: 'Lintas industri',
    },
    en: {
      rootTagline: 'Data-driven strategy, meaningful storytelling.',
      heroTagline: 'Data-Driven Marketing Strategist',
      heroHeadline: 'I Find What Actually Drives Growth.',
      heroSubheadline: 'Most marketing problems are actually measurement problems. I help you find the real growth drivers, then build systems around them.',
      ctaPrimary: 'View My Work',
      ctaSecondary: 'Work Together',
      servicesTitle: 'What I Do',
      services: [
        { _key: key(), slug: 'seo-consulting', title: 'SEO Consulting', desc: "I don't just report traffic going up. I find the real drivers and explain what needs to change.", ctaLabel: 'Learn more' },
        { _key: key(), slug: 'marketing-analytics', title: 'Marketing Analytics', desc: "I help teams separate real signal from noise, so decisions aren't based on guesswork.", ctaLabel: 'Learn more' },
        { _key: key(), slug: 'services', title: 'Growth Strategy', desc: 'Combining causal thinking, data systems, and strategy to build growth that can be logically explained.', ctaLabel: 'View all services' },
      ],
      expertiseTitle: 'Skills & Expertise',
      ctaBannerHeadline: 'Ready to Turn Data Into Growth?',
      ctaBannerCta: "Let's Talk",
      previouslyAt: 'Across industries',
    },
    seo: {
      metaTitleId: '',
      metaTitleEn: '',
      metaDescId: '',
      metaDescEn: '',
      noIndex: false,
    },
  }

  await client.createOrReplace(homePageDoc)
  console.log('  ✓ homePage')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
