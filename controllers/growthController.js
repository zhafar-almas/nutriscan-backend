const Growth = require('../models/Growth');
const Child = require('../models/Child');
const ZScore = require('../models/ZScore'); // Tambahan: Model ZScore dari WHO

// 1. POST: Menambah data pengukuran baru ke riwayat
const tambahRiwayat = async (req, res) => {
  try {
    const { childId, usia_bulan, tinggi_badan_cm, berat_badan_kg } = req.body;

    // A. Cari tahu jenis kelamin anak dari database Child
    const profilAnak = await Child.findById(childId);
    if (!profilAnak) {
      return res.status(404).json({ sukses: false, pesan: "Data anak tidak ditemukan!" });
    }

    // B. Standardisasi format gender agar cocok dengan database WHO
    let genderUser = profilAnak.jenis_kelamin;
    if (genderUser.toLowerCase() === 'laki-laki') genderUser = 'Laki-Laki';
    if (genderUser.toLowerCase() === 'perempuan') genderUser = 'Perempuan';

    // C. Tarik data batas ambang WHO dari database ZScore
    const dataWHO = await ZScore.findOne({ 
      Umur_Bulan: usia_bulan, 
      Jenis_Kelamin: genderUser 
    });

    // D. Logic Engine Keputusan Klinis
    let statusKalkulasi = "Data WHO belum tersedia"; 
    
    if (dataWHO) {
      const tinggi = parseFloat(tinggi_badan_cm);

      if (tinggi < dataWHO.SD3_Negatif) {
        statusKalkulasi = "Sangat Pendek (Severely Stunted)";
      } else if (tinggi < dataWHO.SD2_Negatif) {
        statusKalkulasi = "Pendek (Stunted)";
      } else if (tinggi <= dataWHO.SD2_Positif) {
        statusKalkulasi = "Normal";
      } else if (tinggi <= dataWHO.SD3_Positif) {
        statusKalkulasi = "Tinggi";
      } else {
        statusKalkulasi = "Sangat Tinggi (Kondisi Medis Khusus)";
      }
    }

    // E. Simpan data baru
    const riwayatBaru = new Growth({
      childId,
      usia_bulan,
      tinggi_badan_cm,
      berat_badan_kg,
      status_gizi: statusKalkulasi // Hasil perhitungan otomatis masuk ke sini
    });
    
    await riwayatBaru.save();

    res.status(201).json({
      sukses: true,
      pesan: 'Data pertumbuhan berhasil ditambahkan dan status gizi otomatis terhitung!',
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
    
    // Ambil data dan URUTKAN dari bulan terkecil ke terbesar
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
        const { id } = req.params; 
        let updatePayload = req.body;

        // Fitur Tambahan: Jika user mengubah Tinggi atau Usia, hitung ulang status gizinya!
        if (updatePayload.tinggi_badan_cm || updatePayload.usia_bulan) {
            const riwayatLama = await Growth.findById(id);
            if (!riwayatLama) return res.status(404).json({ pesan: "Data riwayat tidak ditemukan!" });

            const profilAnak = await Child.findById(riwayatLama.childId);
            let genderUser = profilAnak.jenis_kelamin;
            if (genderUser.toLowerCase() === 'laki-laki') genderUser = 'Laki-Laki';
            if (genderUser.toLowerCase() === 'perempuan') genderUser = 'Perempuan';

            const usiaCek = updatePayload.usia_bulan || riwayatLama.usia_bulan;
            const tinggiCek = updatePayload.tinggi_badan_cm || riwayatLama.tinggi_badan_cm;

            const dataWHO = await ZScore.findOne({ Umur_Bulan: usiaCek, Jenis_Kelamin: genderUser });
            
            if (dataWHO) {
                const tinggi = parseFloat(tinggiCek);
                if (tinggi < dataWHO.SD3_Negatif) updatePayload.status_gizi = "Sangat Pendek (Severely Stunted)";
                else if (tinggi < dataWHO.SD2_Negatif) updatePayload.status_gizi = "Pendek (Stunted)";
                else if (tinggi <= dataWHO.SD2_Positif) updatePayload.status_gizi = "Normal";
                else if (tinggi <= dataWHO.SD3_Positif) updatePayload.status_gizi = "Tinggi";
                else updatePayload.status_gizi = "Sangat Tinggi (Kondisi Medis Khusus)";
            } else {
                updatePayload.status_gizi = "Data WHO belum tersedia";
            }
        }

        const updateData = await Growth.findByIdAndUpdate(id, updatePayload, { new: true });

        if (!updateData) return res.status(404).json({ pesan: "Data riwayat tidak ditemukan!" });
        
        res.status(200).json({ sukses: true, pesan: "Data riwayat berhasil diperbarui!", data: updateData });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

// 4. DELETE: Menghapus satu data riwayat pengukuran
const hapusRiwayat = async (req, res) => {
    try {
        const { id } = req.params; 
        const hapusData = await Growth.findByIdAndDelete(id);

        if (!hapusData) return res.status(404).json({ pesan: "Data riwayat tidak ditemukan!" });

        res.status(200).json({ sukses: true, pesan: "Data riwayat berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

// Pastikan semua fungsi diekspor
module.exports = { tambahRiwayat, ambilRiwayat, editRiwayat, hapusRiwayat };