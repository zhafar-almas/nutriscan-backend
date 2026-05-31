// Memanggil cetakan data yang sudah kita buat sebelumnya
const Child = require('../models/Child');

// Fungsi untuk menerima dan menyimpan data anak baru
const tambahDataAnak = async (req, res) => {
  try {
    // req.body adalah tempat berkumpulnya data yang dikirim oleh pengguna (Front-End)
    const { nama, umur_bulan, jenis_kelamin, berat_badan_kg, tinggi_badan_cm } = req.body;

    // Ambil ID user yang sedang login dari token (req.user)
    const userId = req.user.id; 

    // Membuat salinan data baru sesuai cetakan
    const anakBaru = new Child({
      userId, // Menyambungkan data anak dengan user yang membuatnya
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
    // PERBAIKAN: Ambil ID user dari token, lalu filter database berdasarkan ID tersebut
    const userId = req.user.id;

    // Child.find() sekarang hanya akan mengambil data anak milik user yang sedang login
    const daftarAnak = await Child.find({ userId: userId });

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
    const userId = req.user.id;

    // PERBAIKAN: Mencari dan menghapus data berdasarkan ID anak DAN ID user (keamanan)
    const anakDihapus = await Child.findOneAndDelete({ _id: req.params.id, userId: userId });

    // Jika ID tidak ditemukan di database atau bukan milik user tersebut
    if (!anakDihapus) {
      return res.status(404).json({
        sukses: false,
        pesan: 'Data profil anak tidak ditemukan atau Anda tidak memiliki akses!'
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

// Fungsi untuk memperbarui (edit) data anak berdasarkan ID
const editDataAnak = async (req, res) => {
  try {
    // Menangkap data baru yang dikirim oleh Front-End
    const { nama, umur_bulan, jenis_kelamin, berat_badan_kg, tinggi_badan_cm } = req.body;
    
    const userId = req.user.id;

    // PERBAIKAN: Mencari anak berdasarkan ID anak DAN memastikan itu milik user yang sedang login
    const anakDiupdate = await Child.findOneAndUpdate(
      { _id: req.params.id, userId: userId }, 
      {
        nama,
        umur_bulan,
        jenis_kelamin,
        berat_badan_kg,
        tinggi_badan_cm
      },
      // { new: true } mengembalikan data yang SUDAH di-update, bukan data lama
      // { runValidators: true } memastikan data baru tetap mengikuti aturan skema
      { new: true, runValidators: true } 
    );

    // Jika ID tidak ditemukan di database atau bukan milik user tersebut
    if (!anakDiupdate) {
      return res.status(404).json({
        sukses: false,
        pesan: 'Data profil anak tidak ditemukan atau Anda tidak memiliki akses!'
      });
    }

    // Jika berhasil diperbarui
    res.status(200).json({
      sukses: true,
      pesan: 'Data profil anak berhasil diperbarui!',
      data: anakDiupdate
    });

  } catch (error) {
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi kesalahan pada server saat memperbarui data',
      error: error.message
    });
  }
};

// Mengekspor semua fungsi agar bisa digunakan oleh Routes
module.exports = { tambahDataAnak, ambilDataAnak, hapusDataAnak, editDataAnak };