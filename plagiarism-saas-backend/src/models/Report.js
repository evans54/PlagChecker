const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload',
    required: [true, 'Upload ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true
  },
  plagiarismScore: {
    type: Number,
    required: [true, 'Plagiarism score is required'],
    min: 0,
    max: 100
  },
  aiScore: {
    type: Number,
    required: [true, 'AI score is required'],
    min: 0,
    max: 100
  },
  sources: [{
    url: String,
    title: String,
    similarity: Number
  }],
  summary: {
    type: String,
    trim: true
  },
  pdfPath: {
    type: String
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);
