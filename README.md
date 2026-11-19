# SIPONDOK — PWA (GitHub Pages)

Sistem Informasi Pesantren & Sekolah Terpadu. Folder ini berisi **5 berkas** untuk dipasang di GitHub Pages sebagai aplikasi PWA yang dapat di-install di ponsel/PC dan tetap bisa dipakai saat offline.

| Berkas | Fungsi |
|---|---|
| `index.html` | Aplikasi lengkap (UI + logika), terhubung ke Web App Apps Script |
| `manifest.webmanifest` | Identitas PWA (nama, ikon, warna, pintasan) |
| `sw.js` | Service worker: cache aplikasi, pustaka, ubin peta (terbatas) |
| `offline.html` | Halaman cadangan saat tidak ada internet |
| `README.md` | Panduan ini |

## Pemasangan
1. Pasang dulu backend Apps Script (folder `02_KLIEN_AppsScript`) dan salin URL Web App (`https://script.google.com/macros/s/…/exec`).
2. Buat repositori GitHub (mis. `sipondok`), unggah ke-5 berkas ini ke root.
3. **Settings → Pages → Deploy from a branch → main / root** → simpan. Tunggu ±1 menit.
4. Buka `https://<username>.github.io/sipondok/`, klik **Server** di layar login, tempel URL Web App → **Simpan & uji**.
   (Atau isi `window.__API_URL = '...'` di bagian bawah `index.html` agar semua perangkat langsung terhubung.)
5. Pasang sebagai aplikasi: Chrome → menu ⋮ → *Install app* / *Tambahkan ke layar utama*.

## Mode offline
- Aplikasi & data terakhir yang dibuka tetap tampil saat offline.
- Presensi, setoran hafalan, presensi asrama, pelanggaran, jurnal mengajar, buku tamu yang dicatat offline disimpan di perangkat lalu **otomatis tersinkron** (idempoten, tidak dobel) saat online.
- Transaksi keuangan **tidak** dapat dilakukan offline (demi integritas).

## Pembaruan
Ganti `index.html` dan `sw.js` dengan versi baru. Versi cache berubah otomatis sehingga pengguna mendapat versi terbaru pada kunjungan berikutnya.

## Keamanan
- Tidak ada kunci rahasia di berkas ini. Semua otorisasi dilakukan di server Apps Script.
- Atribusi peta (OpenStreetMap, Esri, OpenTopoMap) wajib tetap tampil.

© Penyedia SIPONDOK — penggunaan tunduk pada EULA dan lisensi aktif.
