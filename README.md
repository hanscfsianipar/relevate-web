# Relevate.id

Website Relevate. Infrastruktur disalin dari hanscfs.com: Next.js 16 + Sanity CMS + Vercel, bilingual (Indonesia / English).

Dokumen ini ditulis supaya orang baru bisa mengurus situs ini tanpa mempelajari infrastrukturnya dari awal.

---

## 1. Empat bagian yang menyusun situs ini

| Bagian | Fungsi | Siapa yang pegang |
| --- | --- | --- |
| Sanity | Database konten dan tempat mengedit teks/gambar | Semua editor konten |
| GitHub | Menyimpan kode dan riwayat perubahan | Pemilik repo dan developer |
| Vercel | Menjalankan situs dan mengatur domain | Pemilik akun Vercel |
| Resend | Mengirim email dari form kontak | Pemilik akun Resend |

Alur sederhananya:

```
Editor ubah konten di Sanity  ->  tekan Publish  ->  situs berubah (tanpa deploy)
Developer ubah kode di GitHub ->  Vercel build otomatis ->  situs berubah
```

## 2. Siapa bisa mengedit apa

| Peran | Tempat kerja | Yang bisa diubah |
| --- | --- | --- |
| Editor konten (tanpa coding) | `relevate.id/studio` | Semua teks halaman, artikel insight, studi kasus, pengalaman, event speaking, SEO title dan description |
| Developer | GitHub | Layout, komponen, style, logika form, sitemap |

Editor konten tidak perlu akun GitHub dan tidak perlu menyentuh kode. Semua isi halaman diambil dari Sanity.

## 3. Cara edit konten (untuk tim non-teknis)

1. Buka `https://www.relevate.id/studio` dan login dengan akun yang diundang.
2. Pilih jenis konten di sidebar kiri: Home Page, About Page, Insight, Case Study, Experience, Service, Speaking Page, Contact Page.
3. Ubah teks. Setiap dokumen punya dua tab bahasa: **Bahasa Indonesia** dan **English**.
4. Tekan **Publish**. Situs memakai cache 60 detik, jadi perubahan muncul paling lama sekitar satu menit.
5. Kalau ingin langsung segar, buka dokumen, klik menu tiga titik, pilih **Revalidate site**.

Aturan isi yang wajib diikuti:

- Satu perubahan bahasa Indonesia wajib disertai perubahan bahasa English di publikasi yang sama. Jangan biarkan salah satu bahasa tertinggal.
- Jangan pakai em dash (—) di teks yang dilihat publik.
- Judul dan angka harus berasal dari data nyata. Kalau angka belum ada, tulis penanda yang jelas, jangan dikarang.

## 4. Struktur folder

```
app/
  [locale]/            semua halaman /id/... dan /en/...
    about, case-studies, contact, experience, insights, services, speaking
  page.tsx             halaman pemilih bahasa di "/" (layout sendiri, di luar [locale])
  studio/              Sanity Studio yang ditanam di /studio
  api/contact          endpoint form kontak (Resend)
  api/revalidate       endpoint tombol Revalidate
  sitemap*.xml         sitemap index, halaman, dan artikel
components/            komponen UI dan section
lib/site-config.ts     identitas brand: nama, URL, email, sosial, nama Studio
lib/sanity/            client, helper fetch, dan semua query
messages/id.json       teks antarmuka bahasa Indonesia
messages/en.json       teks antarmuka bahasa English
schemas/               skema dokumen Sanity
scripts/               seed contoh, assign shortId
```

Aturan penting: `app/[locale]/layout.tsx` dan `app/page.tsx` adalah dua layout terpisah. Apa pun yang harus muncul di semua halaman (script, meta, font, analytics) wajib dipasang di keduanya.

## 5. Menjalankan di komputer sendiri

```bash
git clone <repo relevate>
cd relevate.id
cp .env.example .env.local   # isi nilainya
npm install
npm run dev                  # http://localhost:3000
```

Build produksi:

```bash
npm run build && npm start
```

Catatan: build tetap berhasil walau Sanity belum punya data. Fungsi `fetchList` dan `fetchOne` di `lib/sanity/client.ts` menahan error dan mengembalikan kosong, lalu halaman memakai copy fallback. Jadi situs bisa jalan sebelum CMS diisi.

## 6. Environment variables

| Nama | Wajib | Isi |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ya | `https://www.relevate.id` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ya | ID project Sanity Relevate |
| `NEXT_PUBLIC_SANITY_DATASET` | ya | `production` |
| `SANITY_API_TOKEN` | ya | Token Editor, untuk upload gambar dan revalidate |
| `CONTACT_EMAIL` | tidak | Tujuan email form kontak, default `hello@relevate.id` |
| `RESEND_API_KEY` | tidak | Tanpa ini form tetap menerima submit tapi tidak mengirim email |
| `REVALIDATE_SECRET` | tidak | Rahasia endpoint `/api/revalidate` |
| `SANITY_STUDIO_REVALIDATE_SECRET` | tidak | Harus sama dengan `REVALIDATE_SECRET` agar tombol Revalidate bekerja |
| `SANITY_STUDIO_SITE_URL` | tidak | URL publik situs, dipakai tombol Revalidate |
| `NEXT_PUBLIC_GA_ID` | tidak | Measurement ID GA4, tanpa ini script GA tidak dimuat |
| `AUTHOR_SECRET` | tidak | Hanya untuk halaman `/upload` |

Nilai yang sama harus diisi di Vercel (Project Settings, Environment Variables untuk Production, Preview, dan Development).

## 7. Setup awal dari nol (checklist)

Estimasi 60 sampai 90 menit, sekali jalan.

1. **Sanity**: buat project baru di `sanity.io/manage`, dataset `production`, lalu buat token Editor. Salin project ID.
2. **Seed contoh**: jalankan `npx tsx scripts/seed-examples.ts` supaya ada 1 studi kasus dan 1 artikel contoh sebagai template penulisan.
3. **Undang editor**: di Sanity, buka project, Members, Invite. Beri role Editor. Paket gratis dibatasi 3 user termasuk pemilik.
4. **GitHub**: buat repo private, push kode ini, undang developer sebagai collaborator bila perlu.
5. **Vercel**: import repo, isi environment variables di atas, deploy.
6. **Domain**: di Vercel, tambahkan `relevate.id` dan `www.relevate.id`. Di panel DNS Niagahoster, arahkan sesuai instruksi Vercel (biasanya A record ke `76.76.21.21` untuk apex dan CNAME `www` ke `cname.vercel-dns.com`). Pilih satu versi kanonik, lalu redirect versi satunya.
7. **Resend**: verifikasi domain `relevate.id` supaya email form dikirim dari alamat sendiri, lalu pasang `RESEND_API_KEY`.
8. **Uji**: kirim form kontak, buka `/sitemap.xml`, `/robots.txt`, `/studio`, satu halaman `/id` dan satu halaman `/en`.

## 8. Biaya yang perlu diketahui

- **Vercel**: tahap awal pakai Hobby (gratis). Catatan resmi Vercel: Hobby dibatasi untuk pemakaian non-komersial, jadi rencanakan upgrade ke Pro sekitar 20 dolar per bulan per akun begitu situs dipakai untuk jualan atau traffic naik. Limit Hobby yang paling cepat terasa: bandwidth 100 GB per bulan dan kuota build.
- **Sanity**: paket gratis 3 user dan 2 dataset. Sesuai keputusan awal, cukup 3 user: pemilik ditambah 2 editor. Kalau nanti perlu editor ketiga, biaya sekitar 15 dolar per user per bulan.
- **Resend**: gratis untuk volume kecil, cukup untuk form kontak.
- **Domain**: biaya tahunan di Niagahoster.

## 9. Troubleshooting

| Gejala | Sebab dan solusi |
| --- | --- |
| Build gagal dengan `Dataset not found` | Project ID atau dataset salah, atau dataset belum dibuat di Sanity |
| Halaman tampil dengan teks contoh bawaan | Dokumen Sanity untuk halaman itu belum dibuat atau belum di-publish |
| Tombol Revalidate gagal | `SANITY_STUDIO_REVALIDATE_SECRET` tidak sama dengan `REVALIDATE_SECRET`, atau `SANITY_STUDIO_SITE_URL` kosong |
| Form tidak mengirim email | `RESEND_API_KEY` kosong atau domain belum diverifikasi di Resend |
| Gambar dari Sanity tidak muncul | Hostname `cdn.sanity.io` harus ada di `next.config.ts` pada `images.remotePatterns` |
| Perubahan konten tidak muncul setelah 1 menit | Cek dokumen sudah Publish, bukan masih draft |

## 10. Yang masih perlu diganti sebelum publik

- `lib/site-config.ts`: nama brand, tagline, email kontak, akun sosial (masih kosong, jadi ikon sosial tidak tampil).
- `messages/id.json` dan `messages/en.json`: copy bawaan masih generik dan perlu disesuaikan dengan posisi Relevate.
- `components/sections/company-logo-strip.tsx`: daftar logo masih kosong.
- `public/` dan `app/`: favicon serta icon masih bawaan template. Ganti `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`.
- Dua dokumen contoh di Sanity: ganti isinya atau hapus setelah punya konten asli.
