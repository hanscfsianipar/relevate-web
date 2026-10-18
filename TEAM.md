# Untuk tim Relevate

Dokumen ini untuk dibagikan ke orang yang membantu mengisi atau mengubah situs. Tidak perlu paham infrastruktur.

## Kalau kamu mengisi konten

Kamu hanya butuh satu hal: akses Sanity.

1. Tunggu email undangan dari Sanity, lalu terima dan buat akun (boleh pakai Google)
2. Buka `https://www.relevate.id/studio`
3. Pilih jenis konten di sidebar kiri
4. Setiap dokumen punya dua tab: **Bahasa Indonesia** dan **English**. Isi dua-duanya
5. Tekan **Publish**. Situs memakai cache 60 detik, jadi perubahan muncul sekitar satu menit kemudian

Yang perlu diingat:

- Selalu isi versi Indonesia dan English. Jangan tinggalkan salah satu kosong
- Jangan pakai em dash. Pakai koma, titik dua, atau titik
- Angka dan klaim harus dari data nyata. Kalau belum ada angkanya, tulis penanda yang jelas, jangan dikarang
- Jangan hapus dokumen orang lain. Kalau ragu, tanya dulu

Kalau tombol Publish sudah ditekan tapi halaman belum berubah setelah dua menit, hubungi Hans. Jangan publish berkali-kali.

## Kalau kamu mengubah tampilan atau kode

Kamu butuh akses ke repo GitHub, bukan ke Vercel.

1. Clone repo dan buat branch sendiri
   ```bash
   git clone https://github.com/hanscfsianipar/relevate-web.git
   cd relevate-web
   npm install
   npm run dev
   ```
2. Kerjakan perubahan di branch, lalu push dan buka Pull Request
3. Otomatis muncul URL preview di komentar PR. Lihat hasilnya di situ
4. Setelah disetujui dan di-merge, situs production ter-update sendiri dalam beberapa menit

Aturan:

- Jangan mengubah isi environment variables, `vercel.json`, atau file di folder `.github`
- Jangan commit `.env` atau token apa pun
- Satu PR satu tujuan. Perbaikan kecil dan fitur besar jangan dicampur
- Copy di `messages/id.json` dan `messages/en.json` harus selalu sepasang

## Yang tidak dibagikan

Dashboard Vercel, token Sanity, isi `.env`, dan akses Hostinger tetap di Hans. Semua kebutuhan tim sudah tercakup oleh dua akses di atas.

## Kontak

Hans, untuk akses, keputusan desain, dan hal yang tidak jelas.
