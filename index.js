const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Panggil library cors

// 1. Memanggil file routes yang baru saja dibuat
const childRoutes = require('./routes/childRoutes'); 

dotenv.config();
connectDB();

// INISIALISASI APP DULU
const app = express();
const port = process.env.PORT || 3000;

// BARU GUNAKAN MIDDLEWARE
app.use(cors()); // Posisikan di sini!

// 2. WAJIB DITAMBAHKAN: Middleware agar server bisa membaca data JSON
app.use(express.json());

// 3. Mendaftarkan alamat utama untuk fitur anak
app.use('/api/children', childRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));

app.get('/', (req, res) => {
  res.send('Halo! Server backend NutriScan sudah menyala dan siap menerima data.');
});

// MODIFIKASI KHUSUS VERCEL: Jalankan server di port HANYA jika tidak sedang di Vercel (production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server NutriScan berjalan di http://localhost:${port}`);
  });
}

// Ekspor app untuk digunakan oleh Vercel
module.exports = app;