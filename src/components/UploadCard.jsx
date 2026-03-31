const UploadCard = ({ selectedFile, onFileSelect, onUpload, isUploading, uploadProgress }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {isUploading ? (
          <div className="space-y-4">
            <div className="text-blue-600 text-4xl">⏳</div>
            <h3 className="text-lg font-semibold">Uploading...</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
          </div>
        ) : selectedFile ? (
          <div className="space-y-4">
            <div className="text-green-600 text-4xl">📄</div>
            <div>
              <h3 className="text-lg font-semibold">{selectedFile.name}</h3>
              <p className="text-sm text-gray-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onUpload}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Document
              </button>
              <button
                onClick={() => document.getElementById('file-input').click()}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Choose Different File
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-gray-400 text-4xl">📁</div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Drop your file here</h3>
              <p className="text-sm text-gray-600 mb-4">
                or click to browse from your computer
              </p>
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={onFileSelect}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById('file-input').click()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choose File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;
