const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Endpoint: POST /api/auth/register
router.post('/register', registerUser);
// Endpoint: POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;