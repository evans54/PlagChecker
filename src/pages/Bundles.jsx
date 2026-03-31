import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BundleCard from '../components/BundleCard';
import PaymentModal from '../components/PaymentModal';

const Bundles = () => {
  const { user, updateSlots } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);

  const bundles = [
    {
      id: 1,
      name: 'Starter',
      uploads: 1,
      price: 50,
      description: 'Perfect for single document checks',
      popular: false
    },
    {
      id: 2,
      name: 'Basic',
      uploads: 5,
      price: 200,
      description: 'Great for occasional users',
      popular: false
    },
    {
      id: 3,
      name: 'Standard',
      uploads: 10,
      price: 350,
      description: 'Most popular choice',
      popular: true
    },
    {
      id: 4,
      name: 'Professional',
      uploads: 20,
      price: 600,
      description: 'For regular users',
      popular: false
    },
    {
      id: 5,
      name: 'Advanced',
      uploads: 50,
      price: 1200,
      description: 'Best value for heavy users',
      popular: false
    },
    {
      id: 6,
      name: 'Enterprise',
      uploads: 100,
      price: 2000,
      description: 'Unlimited access for institutions',
      popular: false
    }
  ];

  const handleBuyBundle = (bundle) => {
    setSelectedBundle(bundle);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // Update user slots
    updateSlots((selectedBundle?.uploads || 0) + (user?.slots || 0));
    setSelectedBundle(null);
    alert('Payment successful! Your upload slots have been updated.');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Bundle</h1>
          <p className="text-lg text-gray-600">
            Select the perfect bundle for your plagiarism checking needs
          </p>
        </div>

        {/* Payment Info */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="text-green-400">💳</div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>M-Pesa Payment:</strong> Secure instant payment via M-Pesa. 
                Your upload slots will be credited immediately after successful payment.
              </p>
            </div>
          </div>
        </div>

        {/* Bundle Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {bundles.map(bundle => (
            <BundleCard 
              key={bundle.id}
              bundle={bundle}
              onBuy={() => handleBuyBundle(bundle)}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">What's Included</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-lg">All Bundles Include:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced plagiarism detection
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  AI content detection
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Detailed PDF reports
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Fast processing (2-5 minutes)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  30-day report access
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Payment & Security:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Secure M-Pesa integration
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Instant slot crediting
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Payment confirmation
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Refund policy available
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  24/7 customer support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          bundle={selectedBundle}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Bundles;
