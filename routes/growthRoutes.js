const express = require('express');
const router = express.Router();
const { tambahRiwayat, ambilRiwayat } = require('../controllers/growthController');
const { protect } = require('../middleware/authMiddleware');

// Endpoint untuk Pertumbuhan
router.post('/', protect, tambahRiwayat);
router.get('/:childId', protect, ambilRiwayat);

module.exports = router;