const Report = require('../models/Report');
const Upload = require('../models/Upload');
const fs = require('fs').promises;
const path = require('path');

// Get all reports for a user
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const userId = req.user._id;

    // Build query
    const query = { userId };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get reports
    const reports = await Report.find(query)
      .populate('uploadId', 'fileName fileType fileSize')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          current: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reports'
    });
  }
};

// Get single report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: id, userId })
      .populate('uploadId', 'fileName fileType fileSize originalName createdAt');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: {
        report
      }
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching report'
    });
  }
};

// Download report PDF
const downloadReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: id, userId });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Report is not ready for download'
      });
    }

    if (!report.pdfPath) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found'
      });
    }

    // Check if file exists
    try {
      await fs.access(report.pdfPath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found on server'
      });
    }

    // Set appropriate headers
    const fileName = `plagiarism-report-${report.title}.txt`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'text/plain');

    // Send file
    const fileStream = require('fs').createReadStream(report.pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error downloading report'
    });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: id, userId });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Delete associated upload
    await Upload.findByIdAndDelete(report.uploadId);

    // Delete PDF file if it exists
    if (report.pdfPath) {
      try {
        await fs.unlink(report.pdfPath);
      } catch (error) {
        console.error('Error deleting PDF file:', error);
      }
    }

    // Delete report
    await Report.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting report'
    });
  }
};

// Get report statistics
const getReportStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Report.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          completedReports: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          processingReports: {
            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
          },
          avgPlagiarismScore: { $avg: '$plagiarismScore' },
          avgAIScore: { $avg: '$aiScore' },
          highPlagiarismCount: {
            $sum: { $cond: [{ $gte: ['$plagiarismScore', 60] }, 1, 0] }
          },
          highAICount: {
            $sum: { $cond: [{ $gte: ['$aiScore', 60] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalReports: 0,
      completedReports: 0,
      processingReports: 0,
      avgPlagiarismScore: 0,
      avgAIScore: 0,
      highPlagiarismCount: 0,
      highAICount: 0
    };

    res.json({
      success: true,
      data: {
        stats: result
      }
    });
  } catch (error) {
    console.error('Get report stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching report statistics'
    });
  }
};

// Get recent reports (for dashboard)
const getRecentReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 5;

    const reports = await Report.find({ userId })
      .populate('uploadId', 'fileName fileType')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: {
        reports
      }
    });
  } catch (error) {
    console.error('Get recent reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recent reports'
    });
  }
};

// Regenerate report PDF
const regenerateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: id, userId })
      .populate('uploadId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot regenerate report for incomplete analysis'
      });
    }

    // Import the PDF generation function from uploadController
    const { generatePDFReport } = require('./uploadController');
    
    // Generate new PDF
    const pdfPath = await generatePDFReport(
      report._id,
      report.uploadId,
      report.plagiarismScore,
      report.aiScore,
      report.sources
    );

    // Update report with new PDF path
    await Report.findByIdAndUpdate(id, { pdfPath });

    res.json({
      success: true,
      message: 'Report regenerated successfully',
      data: {
        pdfPath
      }
    });
  } catch (error) {
    console.error('Regenerate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error regenerating report'
    });
  }
};

module.exports = {
  getReports,
  getReportById,
  downloadReport,
  deleteReport,
  getReportStats,
  getRecentReports,
  regenerateReport
};
