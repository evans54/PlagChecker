import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ReportCard from '../components/ReportCard';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for recent reports
  const recentReports = [
    {
      id: 1,
      title: 'Research Paper on Climate Change',
      plagiarismScore: 12,
      aiScore: 5,
      status: 'completed',
      date: '2024-03-30'
    },
    {
      id: 2,
      title: 'Essay on Shakespeare',
      plagiarismScore: 8,
      aiScore: 2,
      status: 'completed',
      date: '2024-03-29'
    },
    {
      id: 3,
      title: 'Lab Report - Chemistry',
      plagiarismScore: 15,
      aiScore: 8,
      status: 'processing',
      date: '2024-03-28'
    },
    {
      id: 4,
      title: 'History Assignment',
      plagiarismScore: 5,
      aiScore: 1,
      status: 'completed',
      date: '2024-03-27'
    },
    {
      id: 5,
      title: 'Mathematics Problem Set',
      plagiarismScore: 3,
      aiScore: 0,
      status: 'completed',
      date: '2024-03-26'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600 mb-2">{user.slots}</div>
            <div className="text-gray-600">Upload Slots Remaining</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600 mb-2">12</div>
            <div className="text-gray-600">Total Reports</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-yellow-600 mb-2">2</div>
            <div className="text-gray-600">Processing</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-purple-600 mb-2">10</div>
            <div className="text-gray-600">Completed</div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              to="/upload" 
              className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              <div className="text-2xl mb-2">📤</div>
              <div>Upload Document</div>
            </Link>
            
            <Link 
              to="/bundles" 
              className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors"
            >
              <div className="text-2xl mb-2">🛒</div>
              <div>Buy More Slots</div>
            </Link>
            
            <Link 
              to="/reports" 
              className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <div>View All Reports</div>
            </Link>
          </div>
        </div>
        
        {/* Recent Reports */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Reports</h2>
            <Link 
              to="/reports" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
