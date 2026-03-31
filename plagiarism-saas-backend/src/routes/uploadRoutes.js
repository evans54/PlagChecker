const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { uploadFile, processUpload, getUploadStatus } = require('../controllers/uploadController');

const router = express.Router();

// Upload file (protected)
router.post('/upload', authMiddleware, uploadFile, processUpload);

// Get upload status (protected)
router.get('/upload/:uploadId', authMiddleware, getUploadStatus);

module.exports = router;
