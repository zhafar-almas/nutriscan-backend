const Child = require('../models/Child');

const tambahDataAnak = async (req, res) => {
  try {
    const { nama, umur_bulan, jenis_kelamin, berat_badan_kg, tinggi_badan_cm } = req.body;

    const userId = req.user.id; 

    const anakBaru = new Child({
      userId, 
      nama,
      umur_bulan,
      jenis_kelamin,
      berat_badan_kg,
      tinggi_badan_cm
    });

    const dataTersimpan = await anakBaru.save();

    res.status(201).json({
      sukses: true,
      pesan: 'Data profil anak berhasil disimpan!',
      data: dataTersimpan
    });
    
  } catch (error) {
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi kesalahan pada server',
      error: error.message
    });
  }
};

const ambilDataAnak = async (req, res) => {
  try {
    const userId = req.user.id;

    const daftarAnak = await Child.find({ userId: userId });

    res.status(200).json({
      sukses: true,
      pesan: 'Daftar data anak berhasil diambil!',
      data: daftarAnak
    });
    
  } catch (error) {
    res.status(500).json({
      sukses: false,
      pesan: 'Terjadi kesalahan pada server saat mengambil data',
      error: error.message
    });
  }
};

const hapusDataAnak = async (req, res) => {
  try {
    const userId = req.user.id;

    const anakDihapus = await Child.findOneAndDelete({ _id: req.params.id, userId: userId });

    if (!anakDihapus) {
      return res.status(404).json({
        sukses: false,
        pesan: 'Data profil anak tidak ditemukan atau Anda tidak memiliki akses!'
      });
    }

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

const editDataAnak = async (req, res) => {
  try {
    const { nama, umur_bulan, jenis_kelamin, berat_badan_kg, tinggi_badan_cm } = req.body;
    
    const userId = req.user.id;

    const anakDiupdate = await Child.findOneAndUpdate(
      { _id: req.params.id, userId: userId }, 
      {
        nama,
        umur_bulan,
        jenis_kelamin,
        berat_badan_kg,
        tinggi_badan_cm
      },
      { new: true, runValidators: true } 
    );

    if (!anakDiupdate) {
      return res.status(404).json({
        sukses: false,
        pesan: 'Data profil anak tidak ditemukan atau Anda tidak memiliki akses!'
      });
    }

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

module.exports = { tambahDataAnak, ambilDataAnak, hapusDataAnak, editDataAnak };