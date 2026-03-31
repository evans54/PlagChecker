const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');

const router = express.Router();

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user profile (protected)
router.get('/profile', authMiddleware, getProfile);

// Update user profile (protected)
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
