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
5. **Vercel**: import repo, isi environment variables di atas. Deploy production dijalankan lewat GitHub Actions (lihat bagian 11), jadi setelah import tambahkan tiga secrets Vercel di GitHub.
6. **Domain**: di Vercel, tambahkan `relevate.id` dan `www.relevate.id` (sudah dilakukan). Di panel DNS Hostinger, hapus record parking `A @ 2.57.91.91` dan `CNAME www relevate.id`, lalu isi:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `216.198.79.1` |
   | A | `@` | `64.29.17.1` |
   | CNAME | `www` | `031df1d74cc4f822.vercel-dns-017.com` |

   Nilai lama yang juga masih sah kalau mau seragam dengan hanscfs.com: `A @ 76.76.21.21` dan `CNAME www cname.vercel-dns.com`.

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
| Push ke `main` tapi situs tidak berubah | Buka tab Actions di GitHub. Biasanya secrets Vercel belum diisi, atau build gagal |
| Vercel tidak deploy otomatis saat ada commit | Memang dimatikan lewat `vercel.json` (`git.deploymentEnabled: false`). Deploy lewat GitHub Actions |
| PR tidak dapat komentar URL preview | Cek workflow Preview deployment di tab Actions, dan pastikan PR berasal dari branch di repo ini, bukan fork |

## 10. Yang masih perlu diganti sebelum publik

- `lib/site-config.ts`: nama brand, tagline, email kontak, akun sosial (masih kosong, jadi ikon sosial tidak tampil).
- `messages/id.json` dan `messages/en.json`: copy bawaan masih generik dan perlu disesuaikan dengan posisi Relevate.
- `components/sections/company-logo-strip.tsx`: daftar logo masih kosong.
- `public/` dan `app/`: icon masih placeholder huruf R. Ganti `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` dengan logo Relevate.
- Dua dokumen contoh di Sanity: ganti isinya atau hapus setelah punya konten asli.

## 11. Deploy lewat GitHub Actions

### Identitas setup saat ini

Dicatat supaya tidak perlu dicari ulang:

| Hal | Nilai |
| --- | --- |
| Vercel team (org) | `team_11g0oBkvRm8c6Gy3gV8o4jLj` (Hobby) |
| Vercel project | `prj_PF2AhosUflnS7R3zkk17LsTIfTav` (`relevate-web`) |
| Sanity project | `pcx1y31m` |
| Domain utama | `www.relevate.id`, apex `relevate.id` redirect 308 ke www |
| Proteksi deployment | Vercel Authentication untuk semua URL `*.vercel.app`, domain sendiri terbuka |

Deploy production tidak lewat Git integration Vercel, tapi lewat Actions. Alasannya satu: di paket Hobby, Vercel hanya membangun commit yang author-nya pemilik akun. Dengan Actions, siapa pun di tim boleh commit dan deploy tetap jalan.

Konsekuensinya: `vercel.json` berisi `git.deploymentEnabled: false`, jadi commit ke GitHub tidak memicu build Vercel secara langsung. Jangan panik kalau dashboard Vercel tidak menunjukkan deployment baru. Yang menentukan adalah tab Actions di GitHub.

### Secrets yang dibutuhkan

Settings, Secrets and variables, Actions, New repository secret:

| Nama | Isi | Cara dapat |
| --- | --- | --- |
| `VERCEL_TOKEN` | Token akun Vercel | `vercel.com/account/tokens`, Create Token, scope akun penuh |
| `VERCEL_ORG_ID` | ID akun atau tim | `vercel link` di folder project, lalu buka `.vercel/project.json`, ambil `orgId` |
| `VERCEL_PROJECT_ID` | ID project | File yang sama, ambil `projectId` |

`vercel link` dijalankan sekali di komputer sendiri. Isi `.vercel/` sudah masuk gitignore, jadi tidak ikut ke repo.

### Alur kerjanya

| Kejadian | Yang terjadi |
| --- | --- |
| Push ke `main` | Workflow Deploy production: build dan deploy ke production |
| Buka atau update Pull Request | Workflow Preview deployment: deploy ke URL preview, lalu komentar link-nya di PR |
| Butuh deploy ulang tanpa commit | Tab Actions, pilih Deploy production, Run workflow |

### Deploy manual kalau Actions bermasalah

Dari komputer yang sudah punya akses:

```bash
npx vercel@latest --prod
```

Atau pakai token tanpa login interaktif:

```bash
VERCEL_TOKEN=xxx npx vercel@latest --prod --yes
```

### Batas yang perlu diingat

- Saat pertama kali import repo, situs belum online sampai workflow Deploy production dijalankan sekali. Isi secrets dulu, lalu Run workflow
- Repo private memakai menit Actions gratis 2.000 per bulan. Satu deploy sekitar 2 sampai 4 menit, jadi masih jauh dari batas untuk tim kecil
- PR dari fork tidak mendapat preview, karena secrets tidak tersedia di sana. Untuk tim internal ini tidak masalah
- Kalau nanti pindah ke Pro, kamu bisa memilih: tetap pakai Actions, atau matikan `git.deploymentEnabled` dan serahkan deploy ke Vercel
