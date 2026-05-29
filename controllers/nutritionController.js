const Nutrition = require('../models/Nutrition');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// 1. CREATE: Menambah catatan makanan (Dari input manual atau AI)
exports.tambahCatatanNutrisi = async (req, res) => {
    try {
        const { childId, nama_makanan, kalori, karbohidrat_g, protein_g, lemak_g } = req.body;

        const catatanBaru = new Nutrition({
            childId,
            nama_makanan,
            kalori,
            karbohidrat_g,
            protein_g,
            lemak_g
        });

        await catatanBaru.save();
        res.status(201).json({ sukses: true, pesan: "Catatan nutrisi berhasil ditambahkan!", data: catatanBaru });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

// 2. READ: Melihat riwayat makanan berdasarkan ID Anak
exports.lihatRiwayatNutrisi = async (req, res) => {
    try {
        const { childId } = req.params; // Mengambil ID anak dari parameter URL
        const riwayat = await Nutrition.find({ childId }).sort({ tanggal_pencatatan: -1 }); // Diurutkan dari yang paling baru

        res.status(200).json({ sukses: true, total_data: riwayat.length, data: riwayat });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

// 3. UPDATE: Mengubah data makanan jika ada salah deteksi/ketik
exports.updateCatatanNutrisi = async (req, res) => {
    try {
        const { id } = req.params; // ID dari catatan nutrisi yang mau diubah
        const updateData = await Nutrition.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateData) return res.status(404).json({ pesan: "Catatan tidak ditemukan!" });
        
        res.status(200).json({ sukses: true, pesan: "Catatan berhasil diperbarui!", data: updateData });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

// 4. DELETE: Menghapus catatan makanan
exports.hapusCatatanNutrisi = async (req, res) => {
    try {
        const { id } = req.params; // ID dari catatan nutrisi yang mau dihapus
        const hapusData = await Nutrition.findByIdAndDelete(id);

        if (!hapusData) return res.status(404).json({ pesan: "Catatan tidak ditemukan!" });

        res.status(200).json({ sukses: true, pesan: "Catatan berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

// 5. ANALYZE: Menerima foto dari Front-End, kirim ke AI, dan simpan hasilnya ke MongoDB
exports.analyzeFoodImage = async (req, res) => {
    try {
        // 1. Validasi apakah ada file yang diunggah
        if (!req.file) {
            return res.status(400).json({ sukses: false, pesan: "Harap unggah foto makanan." });
        }

        // 2. Ambil childId dari body (dikirim bersamaan dengan file di form-data)
        const { childId } = req.body;
        if (!childId) {
            // Hapus file sementara jika childId tidak ada
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(400).json({ sukses: false, pesan: "ID Anak (childId) wajib diisi untuk mencatat nutrisi." });
        }

        // 3. Siapkan file foto untuk dikirim ke Python AI
        const form = new FormData();
        form.append('file', fs.createReadStream(req.file.path));

        // 4. Tembak API Python AI di Hugging Face
        // Menggunakan URL default Hugging Face jika process.env.AI_SCAN_URL belum diatur
        const aiBaseUrl = process.env.AI_SCAN_URL || 'https://suryapratama62474-nutriscan-api-backend.hf.space/scan';

        const aiResponse = await axios.post(aiBaseUrl, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        // Tangkap hasil dari AI
        const hasilGiziAI = aiResponse.data;

        // 5. SIMPAN KE MONGOODB: Petakan hasil AI ke dalam skema database
        const catatanNutrisiBaru = new Nutrition({
            childId: childId,
            nama_makanan: hasilGiziAI.nama_makanan,
            kalori: hasilGiziAI.kalori,
            karbohidrat_g: hasilGiziAI.karbohidrat,
            protein_g: hasilGiziAI.protein,
            lemak_g: hasilGiziAI.lemak
        });

        // Jalankan perintah save ke database
        await catatanNutrisiBaru.save();

        // 6. Hapus file foto sementara agar tidak memenuhi penyimpanan server
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // 7. Kembalikan hasil sukses beserta data yang sudah tersimpan di DB
        res.status(201).json({
            sukses: true,
            pesan: "Foto berhasil dianalisis oleh AI dan otomatis dicatat ke database!",
            data: catatanNutrisiBaru
        });

    } catch (error) {
        console.error("Gagal memproses gambar:", error.message);
        
        // Hapus file sementara jika terjadi error agar tidak menumpuk
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan saat memproses gambar ke AI.", error: error.message });
    }
};