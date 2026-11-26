# Panduan Edit & Publikasi Website (Untuk Pemula)

Folder ini berisi website **Laboratorium Simulasi dan Komputasi Tambang — UPN Yogyakarta**.

## 1. Cara Melihat Tampilan Website di Laptop
1. Klik dua kali file `index.html` untuk membukanya langsung di browser (Chrome/Edge).
2. Klik kotak **Acara 01 – 08** untuk masuk ke halaman ruang khusus masing-masing acara (`acara.html?id=01` s.d. `acara.html?id=08`).

## 2. Bagian yang Perlu Diedit Saat Data Sudah Siap
- **Link Google Drive Dokumen Umum, Study Case, dan Buku Panduan:**
  Buka `index.html`, ganti `href="https://drive.google.com/"` dengan link folder Google Drive asli.
- **Isi Tiap Ruang Acara (Judul, Tujuan, Modul, Dataset, Tugas, Langkah, Catatan) & Tim Asisten:**
  Cukup edit satu file saja yaitu **`data.js`**.
  - Simpan foto kegiatan atau foto asisten ke dalam folder `assets/`.
  - Isi kolom `foto: "assets/nama-file.jpg"` di `data.js`.

## 3. Cara Meng-online-kan & Memperbarui Gratis di Netlify
1. Buka **Netlify Drop** (`https://app.netlify.com/drop`) lalu seret (*drag-and-drop*) seluruh folder `web-lab-simkomtam`.
2. Jika suatu saat ingin mengedit setelah *online*, ubah file di folder ini lalu seret ulang folder yang sama ke tab **Deploys** di dashboard Netlify (alamat link website tidak akan berubah).
