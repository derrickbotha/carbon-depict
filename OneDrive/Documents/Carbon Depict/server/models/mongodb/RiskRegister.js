/**
 * Risk Register Model
 *
 * Stores ESG and climate-related risks with TCFD alignment
 * Supports risk assessment, mitigation planning, and scenario analysis
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Sub-schema for controls
const ControlSchema = new Schema({
  controlName: {
    type: String,
    required: true
  },
  controlType: {
    type: String,
    enum: ['preventive', 'detective', 'corrective', 'directive'],
    required: true
  },
  effectiveness: {
    type: String,
    enum: ['not_effective', 'partially_effective', 'effective', 'highly_effective'],
    default: 'partially_effective'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: Date,
  implementationStatus: {
    type: String,
    enum: ['planned', 'in_progress', 'implemented', 'under_review'],
    default: 'planned'
  }
}, { _id: true })

// Sub-schema for scenarios
const ScenarioSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  timeHorizon: {
    type: String,
    enum: ['short', 'medium', 'long']
  },
  financialImpact: Number,
  likelihood: String,
  notes: String
}, { _id: true })

const RiskRegisterSchema = new Schema({
  // Company Reference
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },

  // Risk Identification
  riskId: {
    type: String,
    required: true,
    unique: true
  },

  riskName: {
    type: String,
    required: true
  },

  // Risk Classification
  riskType: {
    type: String,
    enum: ['physical', 'transition', 'liability', 'strategic', 'operational', 'reputational', 'compliance'],
    required: true,
    index: true
  },

  category: {
    type: String,
    enum: ['climate', 'environmental', 'social', 'governance', 'financial'],
    required: true
  },

  // Description
  description: {
    type: String,
    required: true
  },
  causes: [String],
  consequences: [String],

  // Risk Assessment
  likelihood: {
    type: String,
    enum: ['rare', 'unlikely', 'possible', 'likely', 'almost_certain'],
    required: true
  },
  likelihoodScore: {
    type: Number,
    min: 1,
    max: 5
  },

  impact: {
    type: String,
    enum: ['insignificant', 'minor', 'moderate', 'major', 'catastrophic'],
    required: true
  },
  impactScore: {
    type: Number,
    min: 1,
    max: 5
  },

  inherentRiskScore: {
    type: Number,
    min: 1,
    max: 25
  },

  // Financial Impact
  financialImpact: {
    potentialLoss: Number,
    potentialGain: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },

  // Mitigation
  controls: [ControlSchema],

  mitigationPlan: String,
  mitigationActions: [{
    action: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    dueDate: Date,
    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed', 'overdue']
    }
  }],

  residualRiskScore: {
    type: Number,
    min: 1,
    max: 25
  },

  // Time Horizon
  timeHorizon: {
    type: String,
    enum: ['short', 'medium', 'long'],
    default: 'medium'
  },

  // Scenario Analysis
  scenarios: [ScenarioSchema],

  // Risk Status
  status: {
    type: String,
    enum: ['identified', 'under_review', 'mitigated', 'accepted', 'transferred', 'closed'],
    default: 'identified',
    index: true
  },

  // Ownership & Governance
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  reviewFrequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'semi_annually', 'annually']
  },

  lastReviewed: Date,
  nextReview: Date,

  // TCFD Alignment
  tcfdAligned: {
    type: Boolean,
    default: false
  },
  tcfdCategory: {
    type: String,
    enum: ['governance', 'strategy', 'risk_management', 'metrics_targets']
  },

  relatedMetrics: [{
    type: Schema.Types.ObjectId,
    ref: 'ESGMetric'
  }],

  // Supporting Documentation
  supportingDocuments: [{
    name: String,
    url: String,
    uploadedAt: Date
  }],

  // Comments
  comments: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

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
  timestamps: true
})

// Indexes
RiskRegisterSchema.index({ companyId: 1, riskType: 1, status: 1 })
RiskRegisterSchema.index({ companyId: 1, category: 1 })
RiskRegisterSchema.index({ owner: 1 })

// Pre-save: Calculate risk scores
RiskRegisterSchema.pre('save', function(next) {
  const likelihoodMap = { rare: 1, unlikely: 2, possible: 3, likely: 4, almost_certain: 5 }
  const impactMap = { insignificant: 1, minor: 2, moderate: 3, major: 4, catastrophic: 5 }

  this.likelihoodScore = likelihoodMap[this.likelihood]
  this.impactScore = impactMap[this.impact]
  this.inherentRiskScore = this.likelihoodScore * this.impactScore

  // Calculate residual risk if not set
  if (!this.residualRiskScore && this.controls && this.controls.length > 0) {
    const avgEffectiveness = this.controls.reduce((sum, c) => {
      const effectivenessMap = { not_effective: 0, partially_effective: 0.3, effective: 0.6, highly_effective: 0.9 }
      return sum + (effectivenessMap[c.effectiveness] || 0)
    }, 0) / this.controls.length

    this.residualRiskScore = Math.max(1, Math.round(this.inherentRiskScore * (1 - avgEffectiveness)))
  }

  next()
})

// Static method to get risk matrix
RiskRegisterSchema.statics.getRiskMatrix = function(companyId) {
  return this.find({ companyId, status: { $ne: 'closed' } })
    .select('riskName riskType category likelihoodScore impactScore inherentRiskScore residualRiskScore')
    .lean()
}

const RiskRegister = mongoose.model('RiskRegister', RiskRegisterSchema)

module.exports = RiskRegister
