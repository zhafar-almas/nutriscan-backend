# NutriScan - Back-End RESTful API

## 1. Deskripsi Singkat Proyek

NutriScan adalah aplikasi pelacakan gizi pintar berbasis AI untuk mendukung "Healthy Lives & Well-being". Repositori ini berisi layanan Back-End berupa RESTful API yang dibangun menggunakan Node.js, Express, dan MongoDB. API ini bertugas mengelola otentikasi pengguna, data profil balita, riwayat pencatatan Z-Score, dan menjembatani komunikasi data dari Front-End.

## 2. Petunjuk Setup Environment

Untuk menyiapkan lingkungan kerja di komputer lokal, ikuti langkah berikut:

1. Pastikan Node.js sudah terinstal.
2. Lakukan _clone_ repositori ini.
3. Buka terminal dan jalankan perintah: `npm install` untuk mengunduh semua dependensi.
4. Salin file `.env.example` menjadi `.env`, lalu lengkapi nilainya:
   - `MONGO_URI`: Isi dengan URL koneksi MongoDB aslimu.
   - `JWT_SECRET`: Isi dengan kunci rahasia untuk token login.
   - `GEMINI_API_KEY`: Isi dengan API Key dari Google Gemini.

## 3. Tautan Model ML (Jika Ada)

*Model Machine Learning untuk deteksi gambar makanan tidak berada di repositori ini, melainkan dipisah pada layanan *microservices* mandiri milik tim AI.*

## 4. Cara Menjalankan Aplikasi

Setelah dependensi terinstal dan file `.env` sudah diatur, jalankan server lokal dengan perintah:
`npm run dev` atau `npm start`
Server akan berjalan secara default di `http://localhost:3000`.
