const Nutrition = require('../models/Nutrition');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

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

exports.lihatRiwayatNutrisi = async (req, res) => {
    try {
        const { childId } = req.params; 
        const riwayat = await Nutrition.find({ childId }).sort({ tanggal_pencatatan: -1 });

        res.status(200).json({ sukses: true, total_data: riwayat.length, data: riwayat });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

exports.updateCatatanNutrisi = async (req, res) => {
    try {
        const { id } = req.params; 
        const updateData = await Nutrition.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateData) return res.status(404).json({ pesan: "Catatan tidak ditemukan!" });
        
        res.status(200).json({ sukses: true, pesan: "Catatan berhasil diperbarui!", data: updateData });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

exports.hapusCatatanNutrisi = async (req, res) => {
    try {
        const { id } = req.params; 
        const hapusData = await Nutrition.findByIdAndDelete(id);

        if (!hapusData) return res.status(404).json({ pesan: "Catatan tidak ditemukan!" });

        res.status(200).json({ sukses: true, pesan: "Catatan berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ pesan: "Terjadi kesalahan server", error: error.message });
    }
};

exports.analyzeFoodImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ sukses: false, pesan: "Harap unggah foto makanan." });
        }

        const { childId } = req.body;
        if (!childId) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(400).json({ sukses: false, pesan: "ID Anak (childId) wajib diisi untuk mencatat nutrisi." });
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(req.file.path));

        const aiBaseUrl = process.env.AI_SCAN_URL || 'https://suryapratama62474-nutriscan-api-backend.hf.space/scan';

        const aiResponse = await axios.post(aiBaseUrl, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log("=== HASIL JSON DARI SERVER AI ===", aiResponse.data);

        const hasilGiziAI = aiResponse.data;

        const catatanNutrisiBaru = new Nutrition({
            childId: childId,
            nama_makanan: hasilGiziAI.data.makanan,
            kalori: hasilGiziAI.data.nutrisi.kalori,
            karbohidrat_g: hasilGiziAI.data.nutrisi.karbohidrat,
            protein_g: hasilGiziAI.data.nutrisi.protein,
            lemak_g: hasilGiziAI.data.nutrisi.lemak
        });

        await catatanNutrisiBaru.save();

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(201).json({
            sukses: true,
            pesan: "Foto berhasil dianalisis oleh AI dan otomatis dicatat ke database!",
            data: catatanNutrisiBaru
        });

    } catch (error) {
        console.error("Gagal memproses gambar:", error.message);
        
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ sukses: false, pesan: "Terjadi kesalahan saat memproses gambar ke AI.", error: error.message });
    }
};