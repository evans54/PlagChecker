const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  initiateSTKPush,
  mpesaCallback,
  checkPaymentStatus
} = require('../controllers/paymentController');

const router = express.Router();

// Initiate M-Pesa STK Push (protected)
router.post('/mpesa-stk', authMiddleware, initiateSTKPush);

// M-Pesa callback URL (public - called by M-Pesa)
router.post('/mpesa-callback', mpesaCallback);

// Check payment status (protected)
router.get('/mpesa-status/:checkoutRequestID', authMiddleware, checkPaymentStatus);

module.exports = router;
