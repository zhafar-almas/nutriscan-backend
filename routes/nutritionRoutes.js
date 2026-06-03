const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: '/tmp' });

const { 
    tambahCatatanNutrisi, 
    lihatRiwayatNutrisi, 
    updateCatatanNutrisi, 
    hapusCatatanNutrisi,
    analyzeFoodImage 
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, tambahCatatanNutrisi);            
router.get('/:childId', protect, lihatRiwayatNutrisi);      
router.put('/:id', protect, updateCatatanNutrisi);          
router.delete('/:id', protect, hapusCatatanNutrisi);        

router.post('/analyze', protect, upload.single('file'), analyzeFoodImage);

module.exports = router;