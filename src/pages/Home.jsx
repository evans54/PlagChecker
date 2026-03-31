import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to PlagCheck
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Advanced Plagiarism Detection for Students
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
              <p className="text-gray-600 mb-4">
                Upload PDF, DOCX, or TXT files for instant plagiarism checking
              </p>
              <Link 
                to="/upload" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Start Upload
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-3xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">Buy Bundles</h3>
              <p className="text-gray-600 mb-4">
                Purchase upload bundles at discounted rates with M-Pesa
              </p>
              <Link 
                to="/bundles" 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                View Bundles
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-purple-600 text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">View Reports</h3>
              <p className="text-gray-600 mb-4">
                Access detailed plagiarism and AI detection reports
              </p>
              <Link 
                to="/reports" 
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                View Reports
              </Link>
            </div>
          </div>
          
          <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Why Choose PlagCheck?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold mb-2">🔍 Advanced Detection</h3>
                <p className="text-gray-600">State-of-the-art plagiarism and AI content detection</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">⚡ Fast Results</h3>
                <p className="text-gray-600">Get comprehensive reports within minutes</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">💳 Flexible Pricing</h3>
                <p className="text-gray-600">Pay per upload or buy bundles for better value</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📱 Easy Payment</h3>
                <p className="text-gray-600">Seamless M-Pesa integration for Kenyan students</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
