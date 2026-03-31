import { Link } from 'react-router-dom';

const ReportCard = ({ report }) => {
  const getScoreColor = (score) => {
    if (score < 10) return 'text-green-600';
    if (score < 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'text-green-600' : 'text-yellow-600';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
          <p className="text-sm text-gray-500">{report.date}</p>
        </div>
        <span className={`text-sm font-medium ${getStatusColor(report.status)}`}>
          {report.status === 'completed' ? '✓ Completed' : '⏳ Processing'}
        </span>
      </div>
      
      {report.status === 'completed' && (
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{report.plagiarismScore}%</div>
            <div className={`text-sm ${getScoreColor(report.plagiarismScore)}`}>Plagiarism</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{report.aiScore}%</div>
            <div className={`text-sm ${getScoreColor(report.aiScore)}`}>AI Content</div>
          </div>
        </div>
      )}
      
      {report.status === 'completed' && (
        <div className="flex space-x-2">
          <Link
            to={`/reports/${report.id}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm text-center"
          >
            View Details
          </Link>
          <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors text-sm">
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportCard;
