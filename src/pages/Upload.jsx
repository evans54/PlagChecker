import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UploadCard from '../components/UploadCard';

const Upload = () => {
  const { user, updateSlots } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert('Please select a PDF, DOCX, or TXT file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    if (user.slots <= 0) {
      alert('You have no upload slots remaining. Please purchase more bundles.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Placeholder for actual API call
      await uploadDocument(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update user slots (mock)
      updateSlots(user.slots - 1);
      
      setTimeout(() => {
        alert('File uploaded successfully! Report will be generated shortly.');
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      clearInterval(progressInterval);
      alert('Upload failed. Please try again.');
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const uploadDocument = async (file) => {
    // Placeholder API call
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Document</h1>
        
        {/* Upload Slot Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="text-blue-400">ℹ️</div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You have <span className="font-bold">{user.slots}</span> upload slots remaining. 
                Each upload consumes one slot.
              </p>
            </div>
          </div>
        </div>

        <UploadCard 
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
        
        {/* File Requirements */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">File Requirements</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Supported formats: PDF, DOCX, TXT
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Maximum file size: 10MB
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Documents will be checked for plagiarism and AI-generated content
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Reports are generated within 2-5 minutes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Upload;
