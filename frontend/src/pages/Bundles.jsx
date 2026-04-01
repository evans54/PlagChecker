import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BundleCard from '../components/BundleCard';
import PaymentModal from '../components/PaymentModal';
import { bundlesAPI } from '../api/api';

const Bundles = () => {
  const { user, updateSlots } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const response = await bundlesAPI.getBundles();
      if (response.success) {
        setBundles(response.data.bundles);
      }
    } catch (error) {
      console.error('Error fetching bundles:', error);
      // Fallback to mock data
      setBundles([
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
          description: 'Most popular choice for regular users',
          popular: true
        },
        {
          id: 4,
          name: 'Professional',
          uploads: 20,
          price: 600,
          description: 'Ideal for heavy users and researchers',
          popular: false
        },
        {
          id: 5,
          name: 'Premium',
          uploads: 50,
          price: 1200,
          description: 'Best value for institutions',
          popular: false
        },
        {
          id: 6,
          name: 'Enterprise',
          uploads: 100,
          price: 2000,
          description: 'Unlimited access for organizations',
          popular: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bundles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Yourlify Bundle</h1>
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
                <strong>M-Pesa Payment:</strong> All payments are processed securely via M-Pesa STK Push. 
                You'll receive a prompt on your phone to complete the payment.
              </p>
            </div>
          </div>
        </div>

        {/* Current Slots */}
        {user && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="text-blue-400">📊</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Current Upload Slots:</strong> You have {user.slots} upload slot{user.slots !== 1 ? 's' : ''} available.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bundle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onBuy={handleBuyBundle}
            />
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedBundle && (
          <PaymentModal
            bundle={selectedBundle}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Bundles;
