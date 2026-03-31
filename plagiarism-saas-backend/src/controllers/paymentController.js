const axios = require('axios');
const User = require('../models/User');
const Bundle = require('../models/Bundle');

// M-Pesa STK Push
const initiateSTKPush = async (req, res) => {
  try {
    const { phoneNumber, amount, bundleId } = req.body;

    // Validate input
    if (!phoneNumber || !amount || !bundleId) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, amount, and bundle ID are required'
      });
    }

    // Validate phone number format (Kenyan)
    if (!/^07[0-9]{8}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Use format: 07XXXXXXXX'
      });
    }

    // Get bundle details
    const bundle = await Bundle.findById(bundleId);
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }

    // Verify amount matches bundle price
    if (parseFloat(amount) !== bundle.price) {
      return res.status(400).json({
        success: false,
        message: 'Amount does not match bundle price'
      });
    }

    // Get M-Pesa access token
    const accessToken = await getMpesaAccessToken();
    
    // Format phone number for M-Pesa (remove leading 0 and add 254)
    const formattedPhone = phoneNumber.replace(/^0/, '254');
    
    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -5);
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString('base64');

    // Prepare STK Push request
    const stkPushRequest = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `BUNDLE_${bundleId}`,
      TransactionDesc: `Purchase of ${bundle.name} bundle`
    };

    // Send STK Push request
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPushRequest,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.ResponseCode === '0') {
      res.json({
        success: true,
        message: 'STK Push initiated successfully',
        data: {
          checkoutRequestID: response.data.CheckoutRequestID,
          merchantRequestID: response.data.MerchantRequestID,
          customerMessage: response.data.CustomerMessage
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to initiate STK Push',
        error: response.data
      });
    }
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Server error initiating payment'
    });
  }
};

// Get M-Pesa access token
const getMpesaAccessToken = async () => {
  try {
    const auth = Buffer.from(
      process.env.MPESA_CONSUMER_KEY + ':' + process.env.MPESA_CONSUMER_SECRET
    ).toString('base64');

    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
};

// M-Pesa callback handler
const mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;

    if (stkCallback.ResultCode === '0') {
      // Payment successful
      const { CheckoutRequestID } = stkCallback;
      
      // Extract bundle information from AccountReference
      const accountReference = stkCallback.AccountReference;
      const bundleId = accountReference.replace('BUNDLE_', '');
      
      // Get the user (you might need to store CheckoutRequestID -> User mapping)
      // For now, we'll assume you have a way to identify the user
      // This would typically be stored in a temporary payment tracking table
      
      // Add slots to user
      const bundle = await Bundle.findById(bundleId);
      if (bundle) {
        // You need to implement user identification from the payment
        // This is a simplified version - in production, you'd track payments properly
        console.log(`Payment successful for bundle: ${bundle.name}`);
      }
    }

    res.json({
      success: true,
      message: 'Callback processed successfully'
    });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing callback'
    });
  }
};

// Check payment status
const checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestID } = req.params;

    if (!checkoutRequestID) {
      return res.status(400).json({
        success: false,
        message: 'Checkout request ID is required'
      });
    }

    // Get M-Pesa access token
    const accessToken = await getMpesaAccessToken();
    
    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -5);
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString('base64');

    // Check payment status
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { ResultCode, ResultDesc } = response.data;

    res.json({
      success: true,
      data: {
        status: ResultCode === '0' ? 'success' : 'pending',
        message: ResultDesc
      }
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking payment status'
    });
  }
};

module.exports = {
  initiateSTKPush,
  mpesaCallback,
  checkPaymentStatus
};
