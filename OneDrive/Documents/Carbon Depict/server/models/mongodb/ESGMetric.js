const mongoose = require('mongoose')

/**
 * ESG Metric Schema - Phase 3 Week 9: Database Schema Optimization
 * Enhanced with validation, optimized indexes, and data integrity constraints
 */
const ESGMetricSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    framework: {
      type: String,
      trim: true,
      enum: {
        values: ['GRI', 'SASB', 'TCFD', 'CDP', 'UNGC', 'SDG', 'CSRD', 'CUSTOM'],
        message: '{VALUE} is not a valid ESG framework'
      },
      index: true,
    },
    pillar: {
      type: String,
      trim: true,
      required: [true, 'Pillar is required'],
      enum: {
        values: ['environmental', 'social', 'governance'],
        message: '{VALUE} is not a valid ESG pillar'
      },
      index: true,
    },
    topic: {
      type: String,
      trim: true,
      required: [true, 'Topic is required'],
      index: true,
    },
    subTopic: {
      type: String,
      trim: true,
      index: true,
    },
    metricName: {
      type: String,
      trim: true,
      required: [true, 'Metric name is required'],
      maxlength: [200, 'Metric name cannot exceed 200 characters'],
    },
    value: {
      type: Number,
      required: [true, 'Value is required'],
      validate: {
        validator: function(v) {
          return !isNaN(v) && isFinite(v)
        },
        message: 'Value must be a valid number'
      }
    },
    unit: {
      type: String,
      trim: true,
      required: [true, 'Unit is required'],
      maxlength: [50, 'Unit cannot exceed 50 characters'],
    },
    reportingPeriod: {
      type: String,
      trim: true,
      required: [true, 'Reporting period is required'],
      index: true,
      validate: {
        validator: function(v) {
          return /^\d{4}(-Q[1-4]|-\d{2})?$/.test(v)
        },
        message: 'Reporting period must be in format YYYY, YYYY-Q1, or YYYY-MM'
      }
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      validate: {
        validator: function(v) {
          return !this.endDate || v <= this.endDate
        },
        message: 'Start date must be before or equal to end date'
      }
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(v) {
          return !this.startDate || v >= this.startDate
        },
        message: 'End date must be after or equal to start date'
      }
    },
    methodology: {
      type: String,
      trim: true,
      maxlength: [500, 'Methodology cannot exceed 500 characters'],
    },
    dataSource: {
      type: String,
      trim: true,
      required: [true, 'Data source is required'],
      maxlength: [200, 'Data source cannot exceed 200 characters'],
    },
    dataQuality: {
      type: String,
      default: 'measured',
      trim: true,
      enum: {
        values: ['measured', 'estimated', 'calculated', 'modeled', 'third_party'],
        message: '{VALUE} is not a valid data quality level'
      },
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
    },
    complianceScore: {
      type: Number,
      default: 0,
      min: [0, 'Compliance score cannot be negative'],
      max: [100, 'Compliance score cannot exceed 100'],
    },
    complianceStatus: {
      type: String,
      enum: ['compliant', 'non_compliant', 'pending', 'not_applicable'],
      default: 'pending',
      index: true,
    },
    complianceAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    proofs: {
      type: [
        {
          type: {
            type: String,
            trim: true,
            enum: ['document', 'certificate', 'report', 'invoice', 'image', 'other'],
          },
          fileUrl: {
            type: String,
            required: true,
          },
          fileName: {
            type: String,
            required: true,
          },
          fileSize: Number,
          mimeType: String,
          description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
          },
          uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
          status: {
            type: String,
            enum: ['pending_review', 'approved', 'rejected'],
            default: 'pending_review',
          },
          reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          reviewedAt: Date,
        },
      ],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return v.every(tag => tag.length <= 50)
        },
        message: 'Each tag must be 50 characters or less'
      }
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    // Approval workflow
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'changes_requested'],
      default: 'pending',
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Compound indexes for common query patterns (performance optimization)
ESGMetricSchema.index({ companyId: 1, framework: 1, reportingPeriod: 1 })
ESGMetricSchema.index({ companyId: 1, status: 1, updatedAt: -1 })
ESGMetricSchema.index({ companyId: 1, topic: 1, createdAt: -1 })
ESGMetricSchema.index({ companyId: 1, pillar: 1, reportingPeriod: 1 })
ESGMetricSchema.index({ companyId: 1, approvalStatus: 1, createdAt: -1 })
ESGMetricSchema.index({ companyId: 1, complianceStatus: 1 })

// Covering index for dashboard queries
ESGMetricSchema.index(
  { companyId: 1, pillar: 1, status: 1, reportingPeriod: 1 },
  { name: 'dashboard_query_index' }
)

// Text index for searching
ESGMetricSchema.index({ metricName: 'text', notes: 'text', tags: 'text' })

// Date range queries
ESGMetricSchema.index({ startDate: 1, endDate: 1 })

// Virtuals
ESGMetricSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24))
  }
  return 0
})

ESGMetricSchema.virtual('proofCount').get(function() {
  return this.proofs ? this.proofs.length : 0
})

ESGMetricSchema.virtual('hasApprovedProofs').get(function() {
  return this.proofs && this.proofs.some(p => p.status === 'approved')
})

// Instance methods
ESGMetricSchema.methods = {
  /**
   * Publish this metric
   */
  async publish() {
    this.status = 'published'
    this.isDraft = false
    return this.save()
  },

  /**
   * Archive this metric
   */
  async archive() {
    this.status = 'archived'
    return this.save()
  },

  /**
   * Approve this metric
   */
  async approve(userId) {
    this.approvalStatus = 'approved'
    this.approvedBy = userId
    this.approvedAt = new Date()
    return this.save()
  },

  /**
   * Reject this metric
   */
  async reject(userId) {
    this.approvalStatus = 'rejected'
    this.approvedBy = userId
    this.approvedAt = new Date()
    return this.save()
  },

  /**
   * Request changes for this metric
   */
  async requestChanges(userId) {
    this.approvalStatus = 'changes_requested'
    this.approvedBy = userId
    this.approvedAt = new Date()
    return this.save()
  },

  /**
   * Add proof document
   */
  addProof(proofData) {
    this.proofs.push(proofData)
    return this.save()
  },

  /**
   * Check if metric is complete
   */
  isComplete() {
    return (
      this.value !== null &&
      this.value !== undefined &&
      this.unit &&
      this.dataSource &&
      this.hasApprovedProofs
    )
  },
}

// Static methods
ESGMetricSchema.statics = {
  /**
   * Get metrics by pillar for a company
   */
  async getByPillar(companyId, pillar, reportingPeriod) {
    return this.find({
      companyId: mongoose.Types.ObjectId(companyId),
      pillar,
      reportingPeriod,
      status: { $ne: 'archived' }
    })
    .sort({ topic: 1, metricName: 1 })
    .lean()
  },

  /**
   * Get metrics summary for dashboard
   */
  async getDashboardSummary(companyId, reportingPeriod) {
    return this.aggregate([
      {
        $match: {
          companyId: mongoose.Types.ObjectId(companyId),
          reportingPeriod,
          status: { $ne: 'archived' }
        }
      },
      {
        $group: {
          _id: '$pillar',
          totalMetrics: { $sum: 1 },
          publishedMetrics: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          avgComplianceScore: { $avg: '$complianceScore' },
          compliantCount: {
            $sum: { $cond: [{ $eq: ['$complianceStatus', 'compliant'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
  },

  /**
   * Find metrics pending approval
   */
  async findPendingApproval(companyId, limit = 50) {
    return this.find({
      companyId,
      approvalStatus: 'pending',
      status: { $ne: 'archived' }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .lean()
  },

  /**
   * Get compliance summary
   */
  async getComplianceSummary(companyId, framework, reportingPeriod) {
    return this.aggregate([
      {
        $match: {
          companyId: mongoose.Types.ObjectId(companyId),
          framework,
          reportingPeriod
        }
      },
      {
        $group: {
          _id: '$complianceStatus',
          count: { $sum: 1 },
          avgScore: { $avg: '$complianceScore' }
        }
      }
    ])
  },
}

// Pre-save middleware to sync isDraft with status
ESGMetricSchema.pre('save', function(next) {
  this.isDraft = this.status === 'draft'
  next()
})

// Pre-save middleware to validate date range
ESGMetricSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    next(new Error('Start date must be before or equal to end date'))
  } else {
    next()
  }
})

module.exports = mongoose.model('ESGMetric', ESGMetricSchema)
