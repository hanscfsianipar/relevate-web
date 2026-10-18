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

```bash
git clone https://github.com/hanscfsianipar/relevate-web.git
cd relevate-web
npm install
npm run dev
```

Alurnya:

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

## Yang tidak dibagikan

Dashboard Vercel, token Sanity, isi `.env`, dan akses Hostinger tetap di Hans. Dua akses di atas sudah cukup untuk semua pekerjaan UI/UX dan konten.

## Kontak

Hans, untuk akses, keputusan desain, dan hal yang tidak jelas.
