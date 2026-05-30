const express = require('express');
const router = express.Router();

// Panggil semua fungsi dari controller, termasuk editRiwayat dan hapusRiwayat
const { 
    tambahRiwayat, 
    ambilRiwayat, 
    editRiwayat, 
    hapusRiwayat 
} = require('../controllers/growthController');
const { protect } = require('../middleware/authMiddleware');

// Endpoint untuk Pertumbuhan
router.post('/', protect, tambahRiwayat);                  // Tambah riwayat
router.get('/:childId', protect, ambilRiwayat);            // Ambil riwayat berdasarkan ID anak
router.put('/:id', protect, editRiwayat);                  // Edit riwayat berdasarkan ID growth
router.delete('/:id', protect, hapusRiwayat);              // Hapus riwayat berdasarkan ID growth

module.exports = router;