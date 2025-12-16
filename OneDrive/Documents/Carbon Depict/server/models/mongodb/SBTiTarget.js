/**
 * SBTi (Science Based Targets initiative) Target Model
 *
 * Stores SBTi-specific target commitments and validation data
 * Tracks near-term, long-term, and net-zero targets
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Sub-schema for individual scope targets
const ScopeTargetSchema = new Schema({
  targetId: {
    type: Schema.Types.ObjectId,
    ref: 'ESGTarget'
  },
  reduction: {
    type: Number,
    min: 0,
    max: 100
  },
  baseYear: Number,
  baselineEmissions: Number,
  targetYear: Number,
  targetEmissions: Number
}, { _id: false })

// Sub-schema for annual progress
const AnnualProgressSchema = new Schema({
  year: {
    type: Number,
    required: true
  },
  scope1: Number,
  scope2: Number,
  scope3: Number,
  totalEmissions: Number,
  reportedDate: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { _id: true })

const SBTiTargetSchema = new Schema({
  // Company Reference
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
    unique: true
  },

  // Submission Status
  submissionStatus: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'validated', 'rejected', 'expired'],
    default: 'draft',
    index: true
  },

  submissionDate: Date,
  validationDate: Date,
  expiryDate: Date,

  validationComments: [String],

  // Company Profile
  sector: {
    type: String,
    required: true
  },
  subsector: String,
  employeeCount: Number,
  revenue: Number,
  revenueCurrency: {
    type: String,
    default: 'USD'
  },

  // Near-Term Targets (5-10 years from base year)
  nearTerm: {
    scope1: ScopeTargetSchema,
    scope2: ScopeTargetSchema,
    scope3: {
      included: {
        type: Boolean,
        default: false
      },
      targetId: {
        type: Schema.Types.ObjectId,
        ref: 'ESGTarget'
      },
      reduction: {
        type: Number,
        min: 0,
        max: 100
      },
      categories: [String],
      coveragePercentage: Number
    },
    baseYear: {
      type: Number,
      required: true
    },
    targetYear: {
      type: Number,
      required: true
    },
    temperatureAlignment: {
      type: String,
      enum: ['1.5°C', '2°C', 'well_below_2°C'],
      default: '1.5°C'
    }
  },

  // Long-Term Targets (net-zero by 2050 or sooner)
  longTerm: {
    targetId: {
      type: Schema.Types.ObjectId,
      ref: 'ESGTarget'
    },
    netZeroYear: {
      type: Number,
      min: 2040,
      max: 2050
    },
    scope1Reduction: Number,
    scope2Reduction: Number,
    scope3Reduction: Number,
    residualEmissions: Number,
    neutralizationPlan: String
  },

  // Scope 3 Screening
  scope3Screening: {
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date,
    totalScope3: Number,
    categoriesAssessed: [{
      category: {
        type: String,
        required: true
      },
      categoryNumber: Number,
      emissions: Number,
      percentage: Number,
      included: {
        type: Boolean,
        default: false
      },
      exclusionReason: String
    }]
  },

  // Progress Tracking
  annualProgress: [AnnualProgressSchema],

  // Methodology
  calculationMethod: String,
  boundaryDescription: String,
  assumptions: [String],

  // Renewable Energy Commitment
  renewableEnergyCommitment: {
    committed: {
      type: Boolean,
      default: false
    },
    targetPercentage: Number,
    targetYear: Number
  },

  // Forest, Land and Agriculture (FLAG) Targets
  flagTargets: {
    applicable: {
      type: Boolean,
      default: false
    },
    included: {
      type: Boolean,
      default: false
    },
    targetId: {
      type: Schema.Types.ObjectId,
      ref: 'ESGTarget'
    }
  },

  // Supporting Documentation
  supportingDocuments: [{
    name: String,
    documentType: {
      type: String,
      enum: ['emissions_inventory', 'target_letter', 'validation_report', 'progress_report', 'other']
    },
    url: String,
    uploadedAt: Date
  }],

  // Contact Information
  contactPerson: {
    name: String,
    email: String,
    role: String
  },

  // Public Disclosure
  publiclyDisclosed: {
    type: Boolean,
    default: false
  },
  disclosureDate: Date,
  disclosureUrl: String,

  // Review & Recalculation
  lastRecalculation: Date,
  recalculationReason: String,
  nextReview: Date,

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
SBTiTargetSchema.index({ companyId: 1, submissionStatus: 1 })
SBTiTargetSchema.index({ submissionDate: 1 })
SBTiTargetSchema.index({ validationDate: 1 })

// Virtual for years to net-zero
SBTiTargetSchema.virtual('yearsToNetZero').get(function() {
  if (!this.longTerm || !this.longTerm.netZeroYear) return null
  return this.longTerm.netZeroYear - new Date().getFullYear()
})

// Method to calculate scope 3 coverage
SBTiTargetSchema.methods.calculateScope3Coverage = function() {
  if (!this.scope3Screening || !this.scope3Screening.categoriesAssessed) {
    return 0
  }

  const includedCategories = this.scope3Screening.categoriesAssessed.filter(c => c.included)
  const totalPercentage = includedCategories.reduce((sum, c) => sum + (c.percentage || 0), 0)

  if (this.nearTerm && this.nearTerm.scope3) {
    this.nearTerm.scope3.coveragePercentage = totalPercentage
  }

  return totalPercentage
}

// Method to check if targets meet SBTi criteria
SBTiTargetSchema.methods.validateSBTiCriteria = function() {
  const errors = []

  // Near-term target year must be 5-10 years from base year
  if (this.nearTerm) {
    const yearsFromBase = this.nearTerm.targetYear - this.nearTerm.baseYear
    if (yearsFromBase < 5 || yearsFromBase > 10) {
      errors.push('Near-term target must be 5-10 years from base year')
    }

    // Scope 3 must be included if > 40% of total emissions
    if (this.scope3Screening && this.scope3Screening.totalScope3) {
      const scope3Percentage = this.scope3Screening.totalScope3
      if (scope3Percentage > 40 && !this.nearTerm.scope3.included) {
        errors.push('Scope 3 must be included if it represents >40% of total emissions')
      }
    }

    // Scope 3 coverage must be >= 67% if included
    if (this.nearTerm.scope3 && this.nearTerm.scope3.included) {
      const coverage = this.calculateScope3Coverage()
      if (coverage < 67) {
        errors.push('Scope 3 target must cover at least 67% of scope 3 emissions')
      }
    }
  }

  // Long-term target must be net-zero by 2050 or earlier
  if (this.longTerm && this.longTerm.netZeroYear && this.longTerm.netZeroYear > 2050) {
    errors.push('Net-zero target must be 2050 or earlier')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Pre-save hook
SBTiTargetSchema.pre('save', function(next) {
  if (this.isModified('scope3Screening')) {
    this.calculateScope3Coverage()
  }
  next()
})

// Static method to get companies with validated targets
SBTiTargetSchema.statics.getValidatedTargets = function() {
  return this.find({ submissionStatus: 'validated' })
    .populate('companyId', 'name industry')
    .sort({ validationDate: -1 })
}

const SBTiTarget = mongoose.model('SBTiTarget', SBTiTargetSchema)

module.exports = SBTiTarget
