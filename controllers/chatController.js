const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleGiziChat = async (req, res) => {
  try {
    const { message, childData } = req.body;

    if (!message) {
      return res.status(400).json({
        sukses: false,
        pesan: "Pesan (message) wajib diisi."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    let konteksAnak = "";
    if (childData) {
      konteksAnak = `
INFORMASI PROFIL ANAK SAAT INI:
- Nama: ${childData.nama || 'Tidak diketahui'}
- Umur: ${childData.umur_bulan || 'Tidak diketahui'} bulan
- Jenis Kelamin: ${childData.jenis_kelamin || 'Tidak diketahui'}
- Berat Badan: ${childData.berat_badan_kg || 'Tidak diketahui'} kg
- Tinggi Badan: ${childData.tinggi_badan_cm || 'Tidak diketahui'} cm

INSTRUKSI WAJIB UNTUK AI:
1. Gunakan data profil anak di atas untuk memberikan jawaban yang 100% personal dan spesifik.
2. JANGAN PERNAH menanyakan lagi umur, berat badan, atau jenis kelamin anak jika datanya sudah ada di atas.
3. Langsung berikan rekomendasi MPASI, porsi, atau status gizi yang sesuai dengan umur (${childData.umur_bulan || 'yang disebutkan'}) bulan.
`;
    }

    const prompt = `Anda adalah Asisten Gizi AI NutriScan. Tugas Anda adalah memberikan konsultasi menu MPASI personal, resep bubur sehat, jadwal makan anak, atau solusi keluhan gizi anak berbasis standar WHO. Berikan jawaban yang ramah, ringkas, informatif, mudah dipahami orang tua, dan gunakan bahasa Indonesia yang santun.

${konteksAnak}

Pertanyaan Pengguna: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textBalasan = response.text();

    return res.status(200).json({
      sukses: true,
      balasan: textBalasan
    });

  } catch (error) {
    console.error("Error Gemini API:", error);
    return res.status(500).json({
      sukses: false,
      pesan: "Terjadi kesalahan pada server Asisten AI.",
      error: error.message
    });
  }
};

module.exports = { handleGiziChat };