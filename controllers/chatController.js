const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi Gemini dengan API Key dari .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleGiziChat = async (req, res) => {
  try {
    const { message } = req.body;

    // Validasi: Pastikan Front-End mengirimkan pesan
    if (!message) {
      return res.status(400).json({
        sukses: false,
        pesan: "Pesan (message) wajib diisi."
      });
    }

    // MENGGUNAKAN MODEL GEMINI-PRO (Paling Stabil)
    const model = genAI.getGenerativeModel({
      model: "gemini-pro"
    });

    // MENGGABUNGKAN INSTRUKSI SISTEM KE DALAM PROMPT
    const prompt = `Anda adalah Asisten Gizi AI NutriScan. Tugas Anda adalah memberikan konsultasi menu MPASI personal, resep bubur sehat, jadwal makan anak, atau solusi keluhan gizi anak berbasis standar WHO. Berikan jawaban yang ramah, ringkas, informatif, mudah dipahami orang tua, dan gunakan bahasa Indonesia yang santun.

Pertanyaan Pengguna: ${message}`;

    // Kirim pesan ke Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textBalasan = response.text();

    // Kembalikan jawaban ke Front-End
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