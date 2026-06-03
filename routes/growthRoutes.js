const express = require('express');
const router = express.Router();

const { 
    tambahRiwayat, 
    ambilRiwayat, 
    editRiwayat, 
    hapusRiwayat 
} = require('../controllers/growthController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, tambahRiwayat);                  
router.get('/:childId', protect, ambilRiwayat);            
router.put('/:id', protect, editRiwayat);                  
router.delete('/:id', protect, hapusRiwayat);              

module.exports = router;