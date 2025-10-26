const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema(
  {
    // Company and user association
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    
    // Report identification
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    
    // Framework compliance
    framework: {
      type: String,
      required: true,
      enum: ['GRI', 'TCFD', 'CDP', 'CSRD', 'SBTi', 'SDG'],
      index: true,
    },
    
    // Report type and period
    reportType: {
      type: String,
      required: true,
      enum: ['Annual', 'Quarterly', 'Monthly', 'Questionnaire', 'Verification'],
    },
    reportingPeriod: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    
    // Status and workflow
    status: {
      type: String,
      enum: ['Draft', 'In Progress', 'Published', 'Archived'],
      default: 'Draft',
      index: true,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    
    // Compliance tracking
    complianceStatus: {
      type: String,
      enum: ['compliant', 'non_compliant', 'pending', 'under_review'],
      default: 'pending',
    },
    complianceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    frameworkRequirements: [{
      requirement: String,
      status: { type: String, enum: ['met', 'not_met', 'partial', 'not_applicable', 'pending'] },
      evidence: String,
      lastUpdated: Date,
    }],
    
    // Generated content
    sections: [{
      sectionId: String,
      sectionName: String,
      content: mongoose.Schema.Types.Mixed,
      order: Number,
      complianceStatus: String,
    }],
    
    // Data source tracking
    dataSources: [{
      type: String, // 'emission', 'esg_metric', 'manual_entry'
      sourceId: mongoose.Schema.Types.ObjectId,
      sourceType: String,
      verified: { type: Boolean, default: false },
      verificationDate: Date,
    }],
    
    // File information
    filePath: {
      type: String,
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number, // bytes
    },
    fileFormat: {
      type: String,
      enum: ['pdf', 'xlsx', 'docx', 'html'],
      default: 'pdf',
    },
    
    // Publication details
    publishedAt: {
      type: Date,
    },
    publishDate: {
      type: Date,
    },
    
    // Assurance and verification
    hasExternalAssurance: {
      type: Boolean,
      default: false,
    },
    assuranceProvider: {
      type: String,
    },
    assuranceLevel: {
      type: String,
      enum: ['limited', 'reasonable', 'none'],
    },
    
    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    
    // Tags for categorization
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient querying
ReportSchema.index({ companyId: 1, framework: 1, reportingPeriod: 1 })
ReportSchema.index({ companyId: 1, status: 1 })
ReportSchema.index({ framework: 1, status: 1 })
ReportSchema.index({ 'createdBy': 1 })

module.exports = mongoose.model('Report', ReportSchema)

