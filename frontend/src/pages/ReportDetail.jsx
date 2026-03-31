import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ReportDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock detailed report data
  const report = {
    id: parseInt(id),
    title: 'Research Paper on Climate Change',
    fileName: 'climate_change_research.pdf',
    uploadDate: '2024-03-30',
    completedDate: '2024-03-30',
    status: 'completed',
    plagiarismScore: 12,
    aiScore: 5,
    wordCount: 2500,
    pageCount: 8,
    sources: [
      {
        id: 1,
        title: 'Climate Change Impacts on Agriculture',
        author: 'Smith et al.',
        year: 2023,
        similarity: 85,
        url: 'https://example.com/source1'
      },
      {
        id: 2,
        title: 'Global Warming Effects',
        author: 'Johnson, M.',
        year: 2022,
        similarity: 72,
        url: 'https://example.com/source2'
      },
      {
        id: 3,
        title: 'Environmental Studies Review',
        author: 'Brown & Lee',
        year: 2021,
        similarity: 68,
        url: 'https://example.com/source3'
      }
    ],
    sections: [
      {
        name: 'Introduction',
        plagiarismScore: 8,
        aiScore: 3,
        wordCount: 350
      },
      {
        name: 'Literature Review',
        plagiarismScore: 15,
        aiScore: 7,
        wordCount: 800
      },
      {
        name: 'Methodology',
        plagiarismScore: 5,
        aiScore: 2,
        wordCount: 400
      },
      {
        name: 'Results',
        plagiarismScore: 10,
        aiScore: 4,
        wordCount: 600
      },
      {
        name: 'Conclusion',
        plagiarismScore: 12,
        aiScore: 6,
        wordCount: 350
      }
    ]
  };

  const getScoreColor = (score) => {
    if (score < 10) return 'text-green-600 bg-green-50';
    if (score < 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLevel = (score) => {
    if (score < 10) return 'Low';
    if (score < 20) return 'Medium';
    return 'High';
  };

  const handleDownloadPDF = () => {
    alert('Downloading PDF report...');
  };

  const handleShareReport = () => {
    alert('Share functionality would open a share dialog');
  };

  if (!report) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
            <Link to="/reports" className="text-blue-600 hover:text-blue-800">
              ← Back to Reports
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/reports" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Reports
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>📄 {report.fileName}</span>
                <span>📅 Uploaded: {report.uploadDate}</span>
                <span>✅ Completed: {report.completedDate}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleShareReport}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Share
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Plagiarism Score</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl font-bold text-gray-900">{report.plagiarismScore}%</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(report.plagiarismScore)}`}>
                {getScoreLevel(report.plagiarismScore)}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  report.plagiarismScore < 10 ? 'bg-green-500' : 
                  report.plagiarismScore < 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${report.plagiarismScore}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">AI Content Score</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl font-bold text-gray-900">{report.aiScore}%</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(report.aiScore)}`}>
                {getScoreLevel(report.aiScore)}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  report.aiScore < 10 ? 'bg-green-500' : 
                  report.aiScore < 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${report.aiScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Document Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Document Information</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Word Count</h3>
              <p className="text-lg font-semibold">{report.wordCount.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Page Count</h3>
              <p className="text-lg font-semibold">{report.pageCount}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Sources Found</h3>
              <p className="text-lg font-semibold">{report.sources.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Processing Time</h3>
              <p className="text-lg font-semibold">2 min 34 sec</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'sources', 'sections'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Summary</h3>
                  <p className="text-gray-600">
                    This document shows a {getScoreLevel(report.plagiarismScore).toLowerCase()} level of similarity 
                    with existing sources. The AI content detection indicates {getScoreLevel(report.aiScore).toLowerCase()} 
                    likelihood of AI-generated content. Review the identified sources and sections for detailed analysis.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Cite all sources properly to reduce plagiarism score</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Review sections with high similarity scores</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Consider paraphrasing content from identified sources</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'sources' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Matching Sources</h3>
                <div className="space-y-4">
                  {report.sources.map(source => (
                    <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{source.title}</h4>
                          <p className="text-sm text-gray-600">{source.author} ({source.year})</p>
                        </div>
                        <div className="ml-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(source.similarity)}`}>
                            {source.similarity}% match
                          </div>
                        </div>
                      </div>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Source →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sections' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Section Analysis</h3>
                <div className="space-y-4">
                  {report.sections.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">{section.name}</h4>
                        <span className="text-sm text-gray-600">{section.wordCount} words</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Plagiarism</span>
                            <span className={`text-sm font-medium ${getScoreColor(section.plagiarismScore)}`}>
                              {section.plagiarismScore}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                section.plagiarismScore < 10 ? 'bg-green-500' : 
                                section.plagiarismScore < 20 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${section.plagiarismScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">AI Content</span>
                            <span className={`text-sm font-medium ${getScoreColor(section.aiScore)}`}>
                              {section.aiScore}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                section.aiScore < 10 ? 'bg-green-500' : 
                                section.aiScore < 20 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${section.aiScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
