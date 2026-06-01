const mongoose = require('mongoose');

// Membuat cetakan (schema) untuk profil anak
const childSchema = new mongoose.Schema({
  // TAMBAHAN: Mendaftarkan userId sebagai relasi ke model User
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  nama: {
    type: String,
    required: true // Wajib diisi
  },
  umur_bulan: {
    type: Number,
    required: true // Disimpan dalam bulan agar akurat untuk balita
  },
  jenis_kelamin: {
    type: String,
    enum: ['Laki-laki', 'Perempuan'], // Hanya menerima dua pilihan ini
    required: true
  },
  berat_badan_kg: {
    type: Number,
    required: true
  },
  tinggi_badan_cm: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Otomatis mencatat kapan data dibuat dan diubah
});

// Mengekspor cetakan agar bisa digunakan di file lain
module.exports = mongoose.model('Child', childSchema);