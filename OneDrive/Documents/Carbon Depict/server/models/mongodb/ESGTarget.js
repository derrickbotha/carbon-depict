/**
 * ESG Target Model
 *
 * Stores ESG targets with progress tracking, milestones, and actions
 * Supports science-based targets (SBTi) validation
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Sub-schema for milestones
const MilestoneSchema = new Schema({
  year: {
    type: Number,
    required: true
  },
  description: String,
  targetValue: {
    type: Number,
    required: true
  },
  achieved: {
    type: Boolean,
    default: false
  },
  achievedDate: Date,
  achievedValue: Number
}, { _id: true })

// Sub-schema for actions
const ActionSchema = new Schema({
  actionName: {
    type: String,
    required: true
  },
  description: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  dueDate: Date,
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'delayed', 'cancelled'],
    default: 'planned'
  },
  impact: {
    type: Number,
    min: 0
  },
  impactUnit: String,
  completedDate: Date
}, { _id: true })

const ESGTargetSchema = new Schema({
  // Company Reference
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },

  // Target Details
  targetName: {
    type: String,
    required: true
  },

  targetType: {
    type: String,
    enum: ['absolute', 'intensity', 'qualitative'],
    required: true,
    index: true
  },

  category: {
    type: String,
    enum: ['environmental', 'social', 'governance'],
    required: true,
    index: true
  },

  topic: {
    type: String,
    required: true
  },
  subtopic: String,

  // Baseline
  baselineYear: {
    type: Number,
    required: true
  },
  baselineValue: {
    type: Number,
    required: true
  },
  baselineDescription: String,

  // Target
  targetYear: {
    type: Number,
    required: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },

  // Reduction/Improvement Percentage
  reductionPercentage: Number,

  // Science-Based Targets
  isScienceBased: {
    type: Boolean,
    default: false
  },
  sbtiValidated: {
    type: Boolean,
    default: false
  },
  sbtiValidationDate: Date,
  sbtiCategory: {
    type: String,
    enum: ['near_term', 'long_term', 'net_zero']
  },
  temperatureAlignment: {
    type: String,
    enum: ['1.5°C', '2°C', 'well_below_2°C']
  },

  // Scope (for emissions targets)
  scope: [{
    type: String,
    enum: ['scope1', 'scope2', 'scope3']
  }],
  scope3Categories: [String],

  // Progress Tracking
  currentValue: Number,
  currentYear: Number,
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  status: {
    type: String,
    enum: ['on_track', 'at_risk', 'off_track', 'achieved', 'abandoned', 'revised'],
    default: 'on_track',
    index: true
  },

  // Milestones
  milestones: [MilestoneSchema],

  // Actions
  actions: [ActionSchema],

  // Ownership & Governance
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stakeholders: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Related Metrics
  relatedMetrics: [{
    type: Schema.Types.ObjectId,
    ref: 'ESGMetric'
  }],

  // Framework Alignment
  frameworks: [{
    type: String,
    enum: ['SBTi', 'SDG', 'GRI', 'SASB', 'TCFD', 'CSRD', 'CDP', 'UNGC']
  }],

  sdgAlignment: [{
    sdgNumber: {
      type: Number,
      min: 1,
      max: 17
    },
    targetNumber: String
  }],

  // Review & Reporting
  reviewFrequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'semi_annually', 'annually']
  },
  lastReviewed: Date,
  nextReview: Date,

  // Comments & Updates
  progressUpdates: [{
    date: {
      type: Date,
      default: Date.now
    },
    value: Number,
    comment: String,
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Supporting Documentation
  supportingDocuments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],

  notes: String,

  // Metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },

  // Audit Trail
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
ESGTargetSchema.index({ companyId: 1, targetType: 1, status: 1 })
ESGTargetSchema.index({ companyId: 1, category: 1 })
ESGTargetSchema.index({ owner: 1 })
ESGTargetSchema.index({ sbtiValidated: 1 })

// Virtual for years remaining
ESGTargetSchema.virtual('yearsRemaining').get(function() {
  const currentYear = new Date().getFullYear()
  return this.targetYear - currentYear
})

// Method to calculate progress
ESGTargetSchema.methods.calculateProgress = function() {
  if (!this.currentValue || this.targetType === 'qualitative') {
    return this.progress || 0
  }

  const baselineValue = this.baselineValue
  const targetValue = this.targetValue
  const currentValue = this.currentValue

  // For reduction targets (baseline > target)
  if (baselineValue > targetValue) {
    const totalReduction = baselineValue - targetValue
    const currentReduction = baselineValue - currentValue
    this.progress = Math.min(100, Math.max(0, (currentReduction / totalReduction) * 100))
  }
  // For improvement targets (baseline < target)
  else {
    const totalImprovement = targetValue - baselineValue
    const currentImprovement = currentValue - baselineValue
    this.progress = Math.min(100, Math.max(0, (currentImprovement / totalImprovement) * 100))
  }

  // Update status based on progress
  const yearsElapsed = (new Date().getFullYear()) - this.baselineYear
  const totalYears = this.targetYear - this.baselineYear
  const expectedProgress = (yearsElapsed / totalYears) * 100

  if (this.progress >= 100) {
    this.status = 'achieved'
  } else if (this.progress >= expectedProgress - 10) {
    this.status = 'on_track'
  } else if (this.progress >= expectedProgress - 25) {
    this.status = 'at_risk'
  } else {
    this.status = 'off_track'
  }

  return this.progress
}

// Pre-save hook
ESGTargetSchema.pre('save', function(next) {
  if (this.isModified('currentValue') || this.isModified('baselineValue') || this.isModified('targetValue')) {
    this.calculateProgress()
  }

  // Calculate reduction percentage
  if (this.baselineValue && this.targetValue) {
    this.reductionPercentage = ((this.baselineValue - this.targetValue) / this.baselineValue) * 100
  }

  next()
})

// Static method to get targets by category
ESGTargetSchema.statics.getByCategory = function(companyId, category) {
  return this.find({ companyId, category, status: { $ne: 'abandoned' } })
    .populate('owner', 'firstName lastName')
    .sort({ targetYear: 1 })
}

// Static method to get on-track targets
ESGTargetSchema.statics.getOnTrack = function(companyId) {
  return this.find({ companyId, status: 'on_track' })
    .populate('owner', 'firstName lastName')
}

const ESGTarget = mongoose.model('ESGTarget', ESGTargetSchema)

module.exports = ESGTarget
