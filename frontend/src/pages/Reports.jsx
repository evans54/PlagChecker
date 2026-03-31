import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReportCard from '../components/ReportCard';

const Reports = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for all reports
  const allReports = [
    {
      id: 1,
      title: 'Research Paper on Climate Change',
      plagiarismScore: 12,
      aiScore: 5,
      status: 'completed',
      date: '2024-03-30',
      type: 'PDF'
    },
    {
      id: 2,
      title: 'Essay on Shakespeare',
      plagiarismScore: 8,
      aiScore: 2,
      status: 'completed',
      date: '2024-03-29',
      type: 'DOCX'
    },
    {
      id: 3,
      title: 'Lab Report - Chemistry',
      plagiarismScore: 15,
      aiScore: 8,
      status: 'processing',
      date: '2024-03-28',
      type: 'PDF'
    },
    {
      id: 4,
      title: 'History Assignment',
      plagiarismScore: 5,
      aiScore: 1,
      status: 'completed',
      date: '2024-03-27',
      type: 'TXT'
    },
    {
      id: 5,
      title: 'Mathematics Problem Set',
      plagiarismScore: 3,
      aiScore: 0,
      status: 'completed',
      date: '2024-03-26',
      type: 'PDF'
    },
    {
      id: 6,
      title: 'Biology Lab Report',
      plagiarismScore: 22,
      aiScore: 12,
      status: 'completed',
      date: '2024-03-25',
      type: 'DOCX'
    },
    {
      id: 7,
      title: 'Literature Review',
      plagiarismScore: 18,
      aiScore: 6,
      status: 'processing',
      date: '2024-03-24',
      type: 'PDF'
    },
    {
      id: 8,
      title: 'Case Study Analysis',
      plagiarismScore: 7,
      aiScore: 3,
      status: 'completed',
      date: '2024-03-23',
      type: 'DOCX'
    }
  ];

  const filteredReports = allReports.filter(report => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'completed' && report.status === 'completed') ||
      (filter === 'processing' && report.status === 'processing');
    
    const matchesSearch = 
      searchTerm === '' ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleDownloadReport = (reportId) => {
    // Placeholder for download functionality
    alert(`Downloading report for document ID: ${reportId}`);
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'text-green-600' : 'text-yellow-600';
  };

  const getScoreColor = (score) => {
    if (score < 10) return 'text-green-600';
    if (score < 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({allReports.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed ({allReports.filter(r => r.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'processing' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Processing ({allReports.filter(r => r.status === 'processing').length})
          </button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {allReports.length}
            </div>
            <div className="text-gray-600">Total Reports</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {allReports.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {allReports.filter(r => r.status === 'processing').length}
            </div>
            <div className="text-gray-600">Processing</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {Math.round(allReports.reduce((acc, r) => acc + r.plagiarismScore, 0) / allReports.length)}%
            </div>
            <div className="text-gray-600">Avg Plagiarism</div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plagiarism
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Detection
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${getScoreColor(report.plagiarismScore)}`}>
                        {report.plagiarismScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${getScoreColor(report.aiScore)}`}>
                        {report.aiScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(report.status)}`}>
                        {report.status === 'completed' ? '✓ Completed' : '⏳ Processing'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {report.status === 'completed' ? (
                        <div className="flex space-x-2">
                          <Link
                            to={`/reports/${report.id}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            View Details
                          </Link>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDownloadReport(report.id)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            Download PDF
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">Processing...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Upload your first document to see reports here.' 
                : `No ${filter} reports found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
