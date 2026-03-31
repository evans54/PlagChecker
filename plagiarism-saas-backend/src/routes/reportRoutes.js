const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getReports,
  getReportById,
  downloadReport,
  deleteReport,
  getReportStats,
  getRecentReports,
  regenerateReport
} = require('../controllers/reportController');

const router = express.Router();

// Get all reports for user (protected)
router.get('/', authMiddleware, getReports);

// Get report statistics (protected)
router.get('/stats', authMiddleware, getReportStats);

// Get recent reports for dashboard (protected)
router.get('/recent', authMiddleware, getRecentReports);

// Get single report by ID (protected)
router.get('/:id', authMiddleware, getReportById);

// Download report PDF (protected)
router.get('/:id/download', authMiddleware, downloadReport);

// Regenerate report PDF (protected)
router.post('/:id/regenerate', authMiddleware, regenerateReport);

// Delete report (protected)
router.delete('/:id', authMiddleware, deleteReport);

module.exports = router;
