# Untuk tim Relevate

Untuk Timothy Indarto dan Muhammad Disha. Kamu mengerjakan UI/UX sekaligus isi konten, jadi kedua jalur di bawah ini relevan.

Kalau kamu memakai AI agent (Claude, Codex, Cursor), suruh agennya membaca **AGENTS.md** lebih dulu. File itu berisi aturan wajib, peta folder, perintah, dan definisi selesai. Dokumen ini untuk manusia.

## Jalur 1: mengisi konten di Sanity

1. Tunggu email undangan dari Sanity, terima, lalu buat akun (boleh pakai Google)
2. Buka `https://www.relevate.id/studio`
3. Pilih jenis konten di sidebar kiri
4. Setiap dokumen punya dua tab: **Bahasa Indonesia** dan **English**. Isi dua-duanya
5. Tekan **Publish**. Situs memakai cache 60 detik, perubahan muncul sekitar satu menit kemudian

Aturan isi:

- Selalu isi versi Indonesia dan English
- Jangan pakai em dash. Pakai koma, titik dua, atau titik
- Angka dan klaim harus dari data nyata. Kalau belum ada, tulis penanda seperti `[ISI: angka baseline]`, jangan dikarang
- Setiap gambar wajib punya Alt Text dan Sumber Gambar. Tanpa itu Sanity menolak publish
- Jangan hapus dokumen orang lain. Kalau ragu, tanya dulu

## Jalur 2: mengubah tampilan atau kode

Kamu butuh akses repo GitHub, bukan akun Vercel.

Setup pertama kali, sekali saja:

```bash
git clone https://github.com/hanscfsianipar/relevate-web.git
cd relevate-web
npm install
cp .env.example .env.local
```

Isi `.env.local`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=pcx1y31m
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<token Sanity milikmu sendiri>
```

Lalu `npm run dev`, buka `http://localhost:3000` dan `http://localhost:3000/studio`.

Alur setiap perubahan:

1. Buat branch sendiri, jangan kerja di `main`
2. Kerjakan perubahan, lalu `npm run build` sampai lolos
3. Push branch, buka Pull Request
4. URL preview muncul otomatis di komentar PR. Cek versi `/id/...` dan `/en/...` di situ
5. Setelah di-merge, production ter-update sendiri lewat GitHub Actions

Jangan disentuh:

- Environment variables, `vercel.json`, folder `.github`
- File `.env` dan token apa pun
- Slug dan shortId dokumen yang sudah publish, karena itu jadi URL permanen

Satu PR satu tujuan. Perbaikan kecil dan fitur besar jangan dicampur dalam satu PR.

## Aturan versi dan konflik

Supaya semua perubahan tercatat dan tidak saling menimpa:

- Mulai selalu dari `main` yang terbaru: `git checkout main && git pull origin main`, baru buat branch
- Nama branch: `feat/...`, `fix/...`, `content/...`, `docs/...`, `chore/...`
- Commit kecil-kecil, pesannya jelas. Contoh: `content(about): rewrite hero copy in id and en`
- Sebelum buka PR, rapikan dengan `git fetch origin && git rebase origin/main`. Kalau ada konflik, selesaikan lalu `npm run build` lagi
- Merge pakai **Create a merge commit**, jangan squash. Merge commit itu yang jadi catatan deploy
- Minimal satu orang lain membaca PR sebelum merge. Ini kesepakatan, bukan otomatis, jadi tolong dijaga
- Sebelum mulai kerja di halaman atau section tertentu, cek PR yang sedang terbuka. Kalau ada yang mengerjakan area yang sama, bicarakan dulu
- Konflik paling sering terjadi di `messages/id.json` dan `messages/en.json` karena satu file dipakai bersama. Kalau dua orang mengubah file itu, yang kedua wajib rebase sebelum minta review

Riwayat perubahan ada di commit, judul PR, dan isi PR. Setiap deploy production terikat ke satu commit SHA, jadi selalu bisa dilacak.

## Yang tidak dibagikan

Dashboard Vercel, token Sanity milik Hans, isi `.env` produksi, dan akses Hostinger tetap di Hans. Dua akses di atas sudah cukup untuk semua pekerjaan UI/UX dan konten.

## Kalau agenmu perlu menulis ke Sanity langsung

Studio di browser cukup untuk mengisi konten manual. Tapi kalau agenmu harus membuat atau mengubah dokumen lewat kode atau MCP, agen itu butuh token Sanity milikmu sendiri:

1. Buka `sanity.io/manage`, pilih project Relevate, tab API, bagian Tokens
2. Add API token, nama bebas, role Editor atau Developer
3. Simpan di `.env.local` di laptopmu, jangan di repo
4. Jangan pakai token milik orang lain, dan jangan pernah commit token

Kalau Hans sudah membuatkan token untukmu, pakai token itu, dan simpan hanya di `.env.local`. Token hanya ditampilkan sekali saat dibuat, jadi kalau hilang, minta Hans mencabut lalu buat yang baru.

Env minimal untuk kerja lokal:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=pcx1y31m
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<token milikmu sendiri>
```

## Prompt awal untuk agen

Tiga contoh yang bisa langsung dipakai, sesuaikan isinya.

**Menambah artikel insight**

```
Baca AGENTS.md dan TEAM.md di repo ini. Lalu buat satu insight baru di Sanity
untuk topik "[topik]". Isi dua bahasa: id dan en. Panjang 900 sampai 1200 kata
per bahasa. Sertakan feature image 16:9, imageAlt, imageSourceName, dan
imageSourceUrl. Jangan mengarang angka; kalau butuh data, tulis [ISI: ...].
Setelah selesai, tunjukkan URL preview dan daftar placeholder yang tersisa.
```

**Mengubah copy di halaman**

```
Baca AGENTS.md. Ubah copy section hero di halaman home. Perubahan harus
konsisten di messages/id.json, messages/en.json, dan fallback di
app/[locale]/page.tsx. Tanpa em dash. Jalankan npm run build, lalu tunjukkan
diff dan hasil build.
```

**Merapikan tampilan section**

```
Baca AGENTS.md. Perbaiki jarak vertikal dan ukuran tipografi pada section
layanan di halaman home. Jangan ubah struktur data Sanity dan jangan sentuh
folder .github atau vercel.json. Pastikan versi /id dan /en sama baiknya,
lalu buka PR dengan screenshot sebelum dan sesudah.
```

## Urutan hari pertama

1. Publish satu perubahan kecil di Sanity, cek muncul di `www.relevate.id/id/tentang`
2. Buat satu branch, ubah satu teks di `messages/id.json` dan `messages/en.json`, buka PR, lihat URL preview
3. Kalau dua langkah itu mulus, baru ambil pekerjaan besar

## Kontak

Hans, untuk akses, keputusan desain, dan hal yang tidak jelas.
