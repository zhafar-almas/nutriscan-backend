// Memanggil cetakan data yang sudah kita buat sebelumnya
const Child = require('../models/Child');

// Fungsi untuk menerima dan menyimpan data anak baru
const tambahDataAnak = async (req, res) => {
  try {
    // req.body adalah tempat berkumpulnya data yang dikirim oleh pengguna (Front-End)
    const { nama, umur_bulan, jenis_kelamin, berat_badan_kg, tinggi_badan_cm } = req.body;

    // Membuat salinan data baru sesuai cetakan
    const anakBaru = new Child({
      nama,
      umur_bulan,
      jenis_kelamin,
      berat_badan_kg,
      tinggi_badan_cm
    });

    // Perintah sakti untuk menyimpan secara permanen ke MongoDB
    const dataTersimpan = await anakBaru.save();

    // Memberikan jawaban (response) sukses ke Front-End
    res.status(201).json({
      sukses: true,
      pesan: 'Data profil anak berhasil disimpan!',
      data: dataTersimpan
    });
    
  } catch (error) {
    // Mencegah server mati total (crash) jika ada kesalahan
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi kesalahan pada server',
      error: error.message
    });
  }
};

// Fungsi untuk mengambil semua data anak
const ambilDataAnak = async (req, res) => {
  try {
    // Child.find() akan mencari dan mengambil seluruh data dari koleksi anak di MongoDB
    const daftarAnak = await Child.find();

    // Memberikan jawaban sukses beserta datanya ke Front-End
    res.status(200).json({
      sukses: true,
      pesan: 'Daftar data anak berhasil diambil!',
      data: daftarAnak
    });
    
  } catch (error) {
    // Menangkap error jika database gagal merespons
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi kesalahan pada server saat mengambil data',
      error: error.message
    });
  }
};

// Fungsi untuk menghapus data anak berdasarkan ID
const hapusDataAnak = async (req, res) => {
  try {
    // Mencari dan menghapus data berdasarkan ID yang dikirim di URL
    const anakDihapus = await Child.findByIdAndDelete(req.params.id);

    // Jika ID tidak ditemukan di database
    if (!anakDihapus) {
      return res.status(404).json({
        sukses: false,
        pesan: 'Data profil anak tidak ditemukan!'
      });
    }

    // Jika berhasil dihapus
    res.status(200).json({
      sukses: true,
      pesan: 'Data profil anak berhasil dihapus!'
    });

  } catch (error) {
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi kesalahan pada server saat menghapus data',
      error: error.message
    });
  }
};

// Mengekspor ketiga fungsi agar bisa digunakan oleh Routes
module.exports = { tambahDataAnak, ambilDataAnak, hapusDataAnak };