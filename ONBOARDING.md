# Mulai di sini

Panduan awal untuk Timothy dan Disha. Sebagian besar langkah bisa dikerjakan AI agent kalian. Yang harus manual hanya empat hal di bagian pertama.

## 1. Yang harus manual, sekali saja

1. **Terima undangan GitHub** lewat email, atau buka `github.com/hanscfsianipar/relevate-web` dan klik accept
2. **Pasang Node.js versi 20 atau lebih baru** (`node -v` untuk cek)
3. **Terima token Sanity dari Hans lewat chat pribadi.** Jangan minta di grup, jangan tempel ke chat AI, jangan screenshot

   Cara aman menyimpannya, khusus pengguna Hermes:

   ```
   Tolong simpan token ini ke .env.local di root repo relevate-web.
   Aturan: chmod 600, jangan tulis ke file lain, jangan tampilkan nilainya
   di jawaban, jangan pernah commit. Setelah selesai, jalankan npm run check:env
   dan laporkan hasilnya.
   ```

   Setelah itu hapus pesan WhatsApp yang berisi token. Repo ini punya pengaman: hook pre-commit menolak commit berisi file `.env` atau pola token, dan workflow Guard secrets memindai seluruh repo di setiap PR.
4. **Clone repo** kalau belum ada:

   ```bash
   git clone https://github.com/hanscfsianipar/relevate-web.git
   cd relevate-web
   ```

Setelah empat langkah itu, sisanya serahkan ke agent.

## 2. Prompt untuk AI agent kalian

Copy paste seluruh blok di bawah ini ke agent, ganti `<namamu>` dengan nama sendiri, dan lampirkan token Sanity saat agent memintanya di langkah 4.

```
Kamu adalah AI agent yang membantuku mengerjakan website Relevate. Stack: Next.js 16 App Router, React 19, Tailwind v4, Sanity CMS, dua bahasa (Indonesia dan English). Repo sudah ada di laptopku.

ATURAN DASAR, jangan dilanggar:
- Baca AGENTS.md dan TEAM.md di root repo sebelum melakukan apa pun. Kalau prompt ini bertentangan dengan AGENTS.md, AGENTS.md yang menang.
- Jangan pernah menulis token, password, atau isi .env ke dalam kode, commit, PR, log, atau jawaban chat.
- Jangan push ke branch main. Semua perubahan lewat branch dan Pull Request.
- Jangan mengubah .github/, vercel.json, i18n/routing.ts, atau lib/sanity/client.ts tanpa persetujuan eksplisit dariku.
- Kalau ada error yang tidak selesai dalam 10 menit, berhenti dan laporkan. Jangan menonaktifkan pengecekan, jangan menghapus validasi.

TUGAS PERTAMA. Lakukan berurutan, laporkan hasil tiap langkah, dan berhenti kalau ada yang gagal:

1. Tampilkan hasil `pwd`, `git remote -v`, `git status`, dan `node -v`.
2. Baca AGENTS.md, TEAM.md, dan README.md. Ringkas 10 aturan yang paling relevan untuk pekerjaan ini.
3. Jalankan `npm install`, lalu `npm run build`. Laporkan hasil build. Kalau gagal, tunjukkan error lengkap dan berhenti.
4. Pastikan ada file `.env.local` di root dengan empat baris ini:
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SANITY_PROJECT_ID=pcx1y31m
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=<token yang kuberikan>
   Jangan pernah menampilkan nilai token di jawaban atau log.
5. Jalankan `npm run dev` di background, tunggu sampai siap, lalu cek status HTTP dan laporkan hasilnya untuk halaman: /id, /en, /id/tentang, /id/layanan, /id/studi-kasus, /id/insight, dan /studio.
6. Pastikan `git status` bersih dan `.env.local` tidak terdeteksi git.
7. Buat branch `chore/onboarding-<namamu>`. Tambahkan satu baris di tabel "Sudah onboarding" pada file ONBOARDING.md berisi namamu dan tanggal hari ini, kolom PR dibiarkan kosong. Commit dengan pesan `chore(onboarding): add <namamu>`, push, lalu buka Pull Request ke main.
8. Laporkan nomor PR dan URL preview yang muncul di komentar bot pada PR itu. Jangan merge.
9. Berhenti dan tunggu instruksiku sebelum mengerjakan pekerjaan lain.

Jangan mengubah kode, copy, atau konten Sanity pada tugas pertama ini. Tujuannya memastikan lingkungan kerjaku benar sebelum kerja sungguhan.
```

Kalau agent berhenti di tengah karena tidak bisa melakukan sesuatu (misalnya tidak bisa menjalankan dua proses sekaligus), kerjakan bagian itu manual lalu minta agent lanjut dari langkah berikutnya.

## 3. Tanda onboarding berhasil

Semua ini harus benar sebelum ambil pekerjaan nyata:

- `npm run build` lolos tanpa error
- Tujuh halaman yang dicek membalas 200
- `/studio` bisa dipakai login, dan menyimpan satu perubahan berhasil
- `git status` bersih, `.env.local` tidak ikut git
- PR onboarding terbuka dan punya komentar berisi URL preview
- URL preview itu bisa dibuka dari HP kalian

## 4. Setelah onboarding, mulai kerja

Pilih satu, sesuaikan topiknya.

**Menulis artikel**

```
Baca AGENTS.md. Buat satu insight baru di Sanity untuk topik "[topik]".
Isi dua bahasa, id dan en, 900 sampai 1200 kata per bahasa.
Sertakan feature image 16:9, imageAlt, imageSourceName, imageSourceUrl.
Jangan mengarang angka; kalau butuh data, tulis [ISI: ...] dan daftarkan di akhir.
Setelah selesai, tunjukkan daftar placeholder dan buka PR kalau ada perubahan kode.
```

**Mengubah copy halaman**

```
Baca AGENTS.md. Ubah copy section "[section]" di halaman "[halaman]".
Perubahan harus konsisten di messages/id.json, messages/en.json, dan fallback
di file halaman terkait. Tanpa em dash. Jalankan npm run build, lalu tunjukkan
diff dan hasil build. Buka PR, jangan merge.
```

**Merapikan tampilan**

```
Baca AGENTS.md. Rapikan "[apa yang mau dirapikan]" pada section "[section]".
Jangan ubah struktur data Sanity, jangan sentuh .github atau vercel.json.
Pastikan versi /id dan /en sama baiknya. Jalankan npm run build,
buka PR dengan ringkasan perubahan dan screenshot sebelum dan sesudah.
```

## 5. Kalau ada masalah

| Gejala | Penyebab dan solusi |
| --- | --- |
| `npm install` gagal | Node.js terlalu lama. Pasang versi 20 atau lebih baru |
| `npm run build` gagal karena Sanity | `.env.local` belum ada atau project ID salah. Harus `pcx1y31m` |
| `/studio` kosong atau minta login terus | Token atau CORS. Cek dengan Hans |
| PR tidak dapat komentar preview | Buka tab Actions di GitHub, lihat workflow Preview deployment. Biasanya build gagal |
| Port 3000 dipakai | `npm run dev -- -p 3001`, lalu sesuaikan `NEXT_PUBLIC_SITE_URL` |
| Perubahan Sanity tidak muncul | Cache 60 detik. Tunggu, atau tekan Publish lagi satu kali |

## 6. Sudah onboarding

| Nama | Tanggal | PR |
| --- | --- | --- |
| Hans | 18 Oktober 2026 | - |
