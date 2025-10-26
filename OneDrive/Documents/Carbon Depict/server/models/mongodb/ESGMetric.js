const mongoose = require('mongoose')

const ESGMetricSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    framework: {
      type: String,
      trim: true,
    },
    pillar: {
      type: String,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    subTopic: {
      type: String,
      trim: true,
    },
    metricName: {
      type: String,
      trim: true,
    },
    value: {
      type: Number,
    },
    unit: {
      type: String,
      trim: true,
    },
    reportingPeriod: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    methodology: {
      type: String,
      trim: true,
    },
    dataSource: {
      type: String,
      trim: true,
    },
    dataQuality: {
      type: String,
      default: 'measured',
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    complianceScore: {
      type: Number,
      default: 0,
    },
    complianceStatus: {
      type: String,
      enum: ['compliant', 'non_compliant', 'pending'],
      default: 'pending',
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
          },
          fileUrl: String,
          fileName: String,
          description: String,
          uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          uploadedAt: Date,
          status: {
            type: String,
            default: 'pending_review',
          },
        },
      ],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

ESGMetricSchema.index({ companyId: 1, framework: 1, reportingPeriod: 1 })
ESGMetricSchema.index({ companyId: 1, status: 1 })

module.exports = mongoose.model('ESGMetric', ESGMetricSchema)
