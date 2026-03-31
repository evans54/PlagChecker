const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  getBundles,
  getUserSlots,
  addSlots,
  createBundle,
  updateBundle,
  deleteBundle
} = require('../controllers/bundleController');

const router = express.Router();

// Get all available bundles (public)
router.get('/', getBundles);

// Get user's current slots (protected)
router.get('/slots', authMiddleware, getUserSlots);

// Add slots to user account (protected)
router.post('/slots', authMiddleware, addSlots);

// Create new bundle (admin only)
router.post('/', authMiddleware, adminMiddleware, createBundle);

// Update bundle (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateBundle);

// Delete bundle (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteBundle);

module.exports = router;
