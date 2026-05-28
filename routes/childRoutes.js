const express = require('express');
const router = express.Router();

// Memanggil fungsi pengolah data dari controller
const { tambahDataAnak, ambilDataAnak, hapusDataAnak } = require('../controllers/childController');
const { protect } = require('../middleware/authMiddleware');

// Endpoint ini sekarang TERKUNCI, wajib bawa token!

// 1. Rute untuk MENAMBAH data (POST)
router.post('/', protect, tambahDataAnak);

// 2. Rute BARU untuk MENGAMBIL data (GET)
router.get('/', protect, ambilDataAnak);

// 3. Rute BARU untuk MENGHAPUS data (DELETE)
router.delete('/:id', protect, hapusDataAnak);

module.exports = router;