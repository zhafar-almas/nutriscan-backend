const Child = require('../models/Child');
const Nutrition = require('../models/Nutrition');

// Fungsi untuk mengambil seluruh ringkasan Dashboard
const getDashboardSummary = async (req, res) => {
    try {
        // Ambil ID User yang sedang login (dari token/authMiddleware)
        // Kita asumsikan skema Child memiliki field 'userId'
        const userId = req.user._id;

        // --- 1. Ambil Data Anak ---
        const anakUser = await Child.find({ userId: userId }).lean();
        const total_anak = anakUser.length;

        // Siapkan variabel untuk grafik
        // Asumsi: Skema Child menyimpan riwayat pengukuran di field array 'riwayat_pertumbuhan'
        // Jika belum ada, gunakan data tinggi saat ini sebagai titik awal grafik.
        const tren_pertumbuhan = anakUser.map(anak => {
            return {
                id: anak._id,
                nama: anak.nama,
                data: [{ 
                    usia_bulan: anak.umur_bulan, 
                    tinggi_badan: anak.tinggi_badan_cm, 
                    status: 'Normal' // Placeholder: Ganti jika Z-Score sudah jalan
                }]
            }
        });

        // --- 2. Ambil Data Nutrisi (Scan Hari Ini) ---
        // Buat rentang waktu dari jam 00:00 sampai 23:59 hari ini
        const mulaiHariIni = new Date();
        mulaiHariIni.setHours(0, 0, 0, 0);
        
        const akhirHariIni = new Date();
        akhirHariIni.setHours(23, 59, 59, 999);

        // Cari riwayat nutrisi HARI INI yang nyambung ke ID anak milik user ini
        const childIds = anakUser.map(anak => anak._id);
        
        const riwayatScanHariIni = await Nutrition.find({
            childId: { $in: childIds },
            createdAt: { $gte: mulaiHariIni, $lte: akhirHariIni } // Asumsi field timestamp adalah createdAt
        })
        .sort({ createdAt: -1 }) // Urutkan terbaru di atas
        .lean();

        const scan_hari_ini = riwayatScanHariIni.length;

        // --- 3. Format Data & Kirim Balasan ---
        res.status(200).json({
            sukses: true,
            data: {
                statistik: {
                    total_anak: total_anak,
                    scan_hari_ini: scan_hari_ini,
                    status_waspada: 0 // Placeholder: Harus nunggu kalkulasi Z-Score 
                },
                grafik_pertumbuhan: tren_pertumbuhan,
                riwayat_scan_terakhir: riwayatScanHariIni
            }
        });

    } catch (error) {
        console.error("Error Dashboard API:", error);
        res.status(500).json({
            sukses: false,
            pesan: "Gagal memuat ringkasan Dashboard.",
            error: error.message
        });
    }
};

module.exports = { getDashboardSummary };