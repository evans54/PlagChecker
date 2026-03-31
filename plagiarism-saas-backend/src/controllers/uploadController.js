const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Upload = require('../models/Upload');
const User = require('../models/User');
const Report = require('../models/Report');
const copyscapeAPI = require('../utils/copyscapeAPI');
const copyleaksAPI = require('../utils/copyleaksAPI');
const gptZeroAPI = require('../utils/gptZeroAPI');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}).single('file');

// Upload file middleware
const uploadFile = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'File upload error.',
        error: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

// Process uploaded file
const processUpload = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check user slots
    const user = await User.findById(userId);
    if (user.slots <= 0) {
      // Clean up uploaded file
      await fs.unlink(file.path).catch(() => {});
      
      return res.status(400).json({
        success: false,
        message: 'No upload slots available. Please purchase a bundle.'
      });
    }

    // Create upload record
    const uploadRecord = new Upload({
      userId,
      fileName: file.filename,
      originalName: file.originalname,
      fileSize: file.size,
      fileType: path.extname(file.originalname).substring(1),
      filePath: file.path,
      status: 'processing'
    });

    await uploadRecord.save();

    // Start processing asynchronously
    processFileAsync(uploadRecord._id, file.path, file.originalname);

    // Decrement user slots
    await User.findByIdAndUpdate(userId, { $inc: { slots: -1 } });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully. Processing started.',
      data: {
        uploadId: uploadRecord._id,
        fileName: file.originalname,
        fileSize: file.size,
        status: 'processing'
      }
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: 'Server error during file upload'
    });
  }
};

// Process file asynchronously
async function processFileAsync(uploadId, filePath, originalName) {
  try {
    // Update upload status to processing
    await Upload.findByIdAndUpdate(uploadId, {
      status: 'processing',
      processingStartedAt: new Date()
    });

    // Read file
    const fileBuffer = await fs.readFile(filePath);
    const fileType = path.extname(originalName).substring(1);

    // Extract text from file
    let text = '';
    if (fileType === 'txt') {
      text = fileBuffer.toString('utf8');
    } else {
      // For PDF and DOCX, you'd use proper text extraction libraries
      // For now, we'll use a simplified approach
      text = fileBuffer.toString('utf8').substring(0, 10000);
    }

    // Run plagiarism checks
    const [copyscapeResult, copyleaksResult, gptZeroResult] = await Promise.allSettled([
      copyscapeAPI.checkPlagiarism(text, originalName),
      copyleaksAPI.checkPlagiarism(fileBuffer, originalName, fileType),
      gptZeroAPI.checkAIContent(text, originalName)
    ]);

    // Calculate scores
    let plagiarismScore = 0;
    let aiScore = 0;
    let sources = [];

    // Process plagiarism results
    if (copyscapeResult.status === 'fulfilled' && copyscapeResult.value.success) {
      plagiarismScore = Math.max(plagiarismScore, copyscapeResult.value.plagiarismScore);
      sources = sources.concat(copyscapeResult.value.sources);
    }

    if (copyleaksResult.status === 'fulfilled' && copyleaksResult.value.success) {
      plagiarismScore = Math.max(plagiarismScore, copyleaksResult.value.plagiarismScore);
      sources = sources.concat(copyleaksResult.value.sources);
    }

    // Process AI detection result
    if (gptZeroResult.status === 'fulfilled' && gptZeroResult.value.success) {
      aiScore = gptZeroResult.value.aiScore;
    }

    // Remove duplicate sources and sort by similarity
    sources = sources
      .filter((source, index, self) => 
        index === self.findIndex(s => s.url === source.url)
      )
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // Keep top 10 sources

    // Update upload record
    await Upload.findByIdAndUpdate(uploadId, {
      status: 'completed',
      plagiarismScore,
      aiScore,
      completedAt: new Date()
    });

    // Get upload details for report
    const upload = await Upload.findById(uploadId);

    // Create report
    const report = new Report({
      uploadId: upload._id,
      userId: upload.userId,
      title: upload.originalName,
      plagiarismScore,
      aiScore,
      sources,
      summary: generateSummary(plagiarismScore, aiScore, sources.length),
      status: 'completed'
    });

    await report.save();

    // Generate PDF report (simplified - in production, use a proper PDF library)
    const pdfPath = await generatePDFReport(report._id, upload, plagiarismScore, aiScore, sources);
    
    await Report.findByIdAndUpdate(report._id, { pdfPath });

    console.log(`Processing completed for upload: ${uploadId}`);
  } catch (error) {
    console.error('Error processing file:', error);
    
    // Update upload status to failed
    await Upload.findByIdAndUpdate(uploadId, {
      status: 'failed',
      completedAt: new Date()
    });
  }
}

// Generate summary for report
function generateSummary(plagiarismScore, aiScore, sourceCount) {
  let summary = `This document has a plagiarism score of ${plagiarismScore}% and an AI content score of ${aiScore}%. `;
  
  if (plagiarismScore < 10) {
    summary += 'The content appears to be largely original with minimal matching sources.';
  } else if (plagiarismScore < 30) {
    summary += 'The content shows some similarity with existing sources but maintains significant originality.';
  } else if (plagiarismScore < 60) {
    summary += 'The content has moderate similarity with multiple sources and may require citation review.';
  } else {
    summary += 'The content shows high similarity with existing sources and significant revision may be needed.';
  }

  if (aiScore > 70) {
    summary += ' The text exhibits strong characteristics of AI-generated content.';
  } else if (aiScore > 40) {
    summary += ' The text shows some characteristics of AI-generated content.';
  }

  if (sourceCount > 0) {
    summary += ` Found ${sourceCount} potential source${sourceCount > 1 ? 's' : ''} for further review.`;
  }

  return summary;
}

// Generate PDF report (simplified implementation)
async function generatePDFReport(reportId, upload, plagiarismScore, aiScore, sources) {
  try {
    const reportsDir = path.join(__dirname, '../../reports');
    await fs.mkdir(reportsDir, { recursive: true });
    
    const pdfPath = path.join(reportsDir, `report-${reportId}.txt`);
    
    let reportContent = `PLAGIARISM DETECTION REPORT\n`;
    reportContent += `=============================\n\n`;
    reportContent += `File Name: ${upload.originalName}\n`;
    reportContent += `Upload Date: ${upload.createdAt.toLocaleDateString()}\n`;
    reportContent += `File Size: ${(upload.fileSize / 1024).toFixed(2)} KB\n`;
    reportContent += `File Type: ${upload.fileType.toUpperCase()}\n\n`;
    
    reportContent += `RESULTS\n`;
    reportContent += `-------\n`;
    reportContent += `Plagiarism Score: ${plagiarismScore}%\n`;
    reportContent += `AI Content Score: ${aiScore}%\n\n`;
    
    if (sources.length > 0) {
      reportContent += `POTENTIAL SOURCES\n`;
      reportContent += `----------------\n`;
      sources.forEach((source, index) => {
        reportContent += `${index + 1}. ${source.title}\n`;
        reportContent += `   URL: ${source.url}\n`;
        reportContent += `   Similarity: ${source.similarity}%\n\n`;
      });
    }
    
    reportContent += `SUMMARY\n`;
    reportContent += `-------\n`;
    reportContent += generateSummary(plagiarismScore, aiScore, sources.length);
    
    await fs.writeFile(pdfPath, reportContent);
    
    return pdfPath;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return null;
  }
}

// Get upload status
const getUploadStatus = async (req, res) => {
  try {
    const { uploadId } = req.params;
    
    const upload = await Upload.findOne({ 
      _id: uploadId, 
      userId: req.user._id 
    });

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    res.json({
      success: true,
      data: {
        uploadId: upload._id,
        fileName: upload.originalName,
        status: upload.status,
        plagiarismScore: upload.plagiarismScore,
        aiScore: upload.aiScore,
        createdAt: upload.createdAt,
        completedAt: upload.completedAt
      }
    });
  } catch (error) {
    console.error('Get upload status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching upload status'
    });
  }
};

module.exports = {
  uploadFile,
  processUpload,
  getUploadStatus
};
