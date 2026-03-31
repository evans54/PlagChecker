import { useState } from 'react';

const PaymentModal = ({ bundle, onClose, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      alert('Please enter your M-Pesa phone number');
      return;
    }

    // Validate phone number (Kenyan format)
    if (!/^07[0-9]{8}$/.test(phoneNumber)) {
      alert('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate M-Pesa STK Push
      await simulateMpesaPayment(bundle.id, phoneNumber);
      
      setPaymentStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      setPaymentStatus('error');
      setIsProcessing(false);
    }
  };

  const simulateMpesaPayment = async (bundleId, phone) => {
    // Placeholder for actual M-Pesa API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('Payment failed'));
        }
      }, 3000);
    });
  };

  const resetModal = () => {
    setPhoneNumber('');
    setIsProcessing(false);
    setPaymentStatus('idle');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!bundle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isProcessing}
          >
            ×
          </button>
        </div>

        {paymentStatus === 'idle' && (
          <div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{bundle.name} Bundle</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{bundle.uploads} Uploads</span>
                <span className="text-2xl font-bold text-blue-600">KES {bundle.price}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0712345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your M-Pesa registered phone number
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="text-yellow-400">⚠️</div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You will receive an M-Pesa STK Push on your phone to complete the payment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Pay KES {bundle.price}
                </button>
              </div>
            </form>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div className="text-center py-8">
            <div className="text-green-600 text-6xl mb-4">💳</div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600 mb-4">Please check your phone for M-Pesa STK Push...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center py-8">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your {bundle.uploads} upload slots have been added to your account.
            </p>
            <button
              onClick={handleClose}
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="text-center py-8">
            <div className="text-red-600 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-4">
              The payment could not be completed. Please try again.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={resetModal}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
