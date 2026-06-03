const express = require('express');
const router = express.Router();

const { tambahDataAnak, ambilDataAnak, hapusDataAnak, editDataAnak } = require('../controllers/childController');
const { protect } = require('../middleware/authMiddleware');


router.post('/', protect, tambahDataAnak);

router.get('/', protect, ambilDataAnak);

router.delete('/:id', protect, hapusDataAnak);

router.put('/:id', protect, editDataAnak);

module.exports = router;