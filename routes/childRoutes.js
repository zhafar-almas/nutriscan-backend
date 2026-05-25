const express = require('express');
const router = express.Router();

// Memanggil fungsi pengolah data dari controller
const { tambahDataAnak } = require('../controllers/childController');
const { protect } = require('../middleware/authMiddleware');

// Endpoint ini sekarang TERKUNCI, wajib bawa token!
router.post('/', protect, tambahDataAnak);

module.exports = router;