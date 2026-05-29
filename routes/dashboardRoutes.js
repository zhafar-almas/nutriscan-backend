const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Endpoint: GET /api/dashboard/summary
// Wajib login untuk melihat dashboard
router.get('/summary', protect, getDashboardSummary);

module.exports = router;