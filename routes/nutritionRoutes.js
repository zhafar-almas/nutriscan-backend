const express = require('express');
const router = express.Router();
const multer = require('multer'); // 1. Memanggil library multer

// 2. Konfigurasi Multer untuk menyimpan file sementara ke folder 'uploads/'
const upload = multer({ dest: '/tmp' });

// Memanggil fungsi dari controller dan middleware satpam
const { 
    tambahCatatanNutrisi, 
    lihatRiwayatNutrisi, 
    updateCatatanNutrisi, 
    hapusCatatanNutrisi,
    analyzeFoodImage // 3. Panggil fungsi AI yang baru dibuat
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

// Semua rute ini dikunci oleh protect (Wajib pakai Token JWT)
router.post('/', protect, tambahCatatanNutrisi);            // Tambah data (CREATE)
router.get('/:childId', protect, lihatRiwayatNutrisi);      // Lihat data (READ)
router.put('/:id', protect, updateCatatanNutrisi);          // Ubah data (UPDATE)
router.delete('/:id', protect, hapusCatatanNutrisi);        // Hapus data (DELETE)

// 4. Rute BARU: Menerima foto makanan, diamankan dengan protect, dan diproses oleh multer
router.post('/analyze', protect, upload.single('file'), analyzeFoodImage);

module.exports = router;