const Growth = require('../models/Growth');
const Child = require('../models/Child');

// 1. POST: Menambah data pengukuran baru ke riwayat
const tambahRiwayat = async (req, res) => {
  try {
    const { childId, usia_bulan, tinggi_badan_cm, berat_badan_kg, status_gizi } = req.body;

    // Simpan data baru
    const riwayatBaru = new Growth({
      childId,
      usia_bulan,
      tinggi_badan_cm,
      berat_badan_kg,
      status_gizi: status_gizi || 'Belum dihitung' // Opsional, bisa dikirim FE
    });
    await riwayatBaru.save();

    res.status(201).json({
      sukses: true,
      pesan: 'Data pertumbuhan bulan ini berhasil ditambahkan!',
      data: riwayatBaru
    });
  } catch (error) {
    res.status(500).json({ sukses: false, pesan: 'Server error', error: error.message });
  }
};

// 2. GET: Mengambil riwayat anak untuk di-render di tabel dan grafik
const ambilRiwayat = async (req, res) => {
  try {
    const { childId } = req.params;
    
    // Ambil data dan URUTKAN dari bulan terkecil ke terbesar (wajib untuk grafik X-axis)
    const riwayat = await Growth.find({ childId }).sort({ usia_bulan: 1 });

    res.status(200).json({
      sukses: true,
      total_data: riwayat.length,
      data: riwayat
    });
  } catch (error) {
    res.status(500).json({ sukses: false, pesan: 'Server error', error: error.message });
  }
};

// 3. PUT: Mengedit satu data riwayat pengukuran
const editRiwayat = async (req, res) => {
    try {
        const { id } = req.params; // ID dari Growth (bukan ID anak)
        const updateData = await Growth.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateData) return res.status(404).json({ pesan: "Data riwayat tidak ditemukan!" });
        
        res.status(200).json({ sukses: true, pesan: "Data riwayat berhasil diperbarui!", data: updateData });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

// 4. DELETE: Menghapus satu data riwayat pengukuran
const hapusRiwayat = async (req, res) => {
    try {
        const { id } = req.params; // ID dari Growth
        const hapusData = await Growth.findByIdAndDelete(id);

        if (!hapusData) return res.status(404).json({ pesan: "Data riwayat tidak ditemukan!" });

        res.status(200).json({ sukses: true, pesan: "Data riwayat berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

// Pastikan semua fungsi diekspor
module.exports = { tambahRiwayat, ambilRiwayat, editRiwayat, hapusRiwayat };