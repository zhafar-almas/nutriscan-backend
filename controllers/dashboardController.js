const Child = require('../models/Child');
const Nutrition = require('../models/Nutrition');

const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const anakUser = await Child.find({ userId: userId }).lean();
        const total_anak = anakUser.length;

        const tren_pertumbuhan = anakUser.map(anak => {
            return {
                id: anak._id,
                nama: anak.nama,
                data: [{ 
                    usia_bulan: anak.umur_bulan, 
                    tinggi_badan: anak.tinggi_badan_cm, 
                    status: 'Normal' 
                }]
            }
        });

        const mulaiHariIni = new Date();
        mulaiHariIni.setHours(0, 0, 0, 0);
        
        const akhirHariIni = new Date();
        akhirHariIni.setHours(23, 59, 59, 999);

        const childIds = anakUser.map(anak => anak._id);
        
        const riwayatScanHariIni = await Nutrition.find({
            childId: { $in: childIds },
            createdAt: { $gte: mulaiHariIni, $lte: akhirHariIni } 
        })
        .sort({ createdAt: -1 }) 
        .lean();

        const scan_hari_ini = riwayatScanHariIni.length;

        res.status(200).json({
            sukses: true,
            data: {
                statistik: {
                    total_anak: total_anak,
                    scan_hari_ini: scan_hari_ini,
                    status_waspada: 0 
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