/**
 * CSRD (Corporate Sustainability Reporting Directive) Disclosure Model
 *
 * Stores data for all 11 ESRS modules with nested disclosure tracking
 * Supports EU CSRD compliance reporting requirements
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Sub-schema for individual disclosures
const DisclosureItemSchema = new Schema({
  disclosureId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  metricId: {
    type: Schema.Types.ObjectId,
    ref: 'ESGMetric'
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  notes: String
}, { _id: false })

const CSRDDisclosureSchema = new Schema({
  // Company Reference
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },

  // User who created/owns this disclosure
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Reporting Period
  reportingPeriod: {
    type: String,
    required: true,
    match: /^\d{4}$/,  // YYYY format
    index: true
  },

  // ESRS 2: General Disclosures
  generalDisclosures: {
    strategy: [DisclosureItemSchema],
    governance: [DisclosureItemSchema],
    materialityAssessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'MaterialityAssessment'
    }
  },

  // Environmental Standards (E1-E5)
  environmental: {
    // E1: Climate Change
    climateChange: [DisclosureItemSchema],

    // E2: Pollution
    pollution: [DisclosureItemSchema],

    // E3: Water and Marine Resources
    water: [DisclosureItemSchema],

    // E4: Biodiversity and Ecosystems
    biodiversity: [DisclosureItemSchema],

    // E5: Circular Economy
    circularEconomy: [DisclosureItemSchema]
  },

  // Social Standards (S1-S4)
  social: {
    // S1: Own Workforce
    ownWorkforce: [DisclosureItemSchema],

    // S2: Workers in the Value Chain
    valueChainWorkers: [DisclosureItemSchema],

    // S3: Affected Communities
    communities: [DisclosureItemSchema],

    // S4: Consumers and End-users
    consumers: [DisclosureItemSchema]
  },

  // Governance Standards (G1)
  governance: {
    // G1: Business Conduct
    businessConduct: [DisclosureItemSchema]
  },

  // Completion Status Tracking
  completionStatus: {
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    byModule: {
      type: Map,
      of: Number,
      default: {}
    }
  },

  // Workflow Status
  status: {
    type: String,
    enum: ['draft', 'in_progress', 'completed', 'under_review', 'submitted', 'published'],
    default: 'draft',
    index: true
  },

  // Approval Workflow
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  submittedAt: Date,

  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,

  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,

  // Comments and Notes
  reviewComments: [{
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

  // Timestamps
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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

// Indexes for performance
CSRDDisclosureSchema.index({ companyId: 1, reportingPeriod: 1 })
CSRDDisclosureSchema.index({ companyId: 1, status: 1 })
CSRDDisclosureSchema.index({ companyId: 1, reportingPeriod: 1, status: 1 })

// Method to calculate completion percentage
CSRDDisclosureSchema.methods.calculateCompletionStatus = function() {
  let totalDisclosures = 0
  let completedDisclosures = 0

  const moduleCompletion = {}

  // Helper function to count disclosures
  const countDisclosures = (disclosures, moduleName) => {
    if (!disclosures || disclosures.length === 0) return { total: 0, completed: 0 }

    const total = disclosures.length
    const completed = disclosures.filter(d => d.completed).length

    moduleCompletion[moduleName] = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed }
  }

  // Count general disclosures
  if (this.generalDisclosures) {
    const strategy = countDisclosures(this.generalDisclosures.strategy, 'ESRS2-Strategy')
    const governance = countDisclosures(this.generalDisclosures.governance, 'ESRS2-Governance')
    totalDisclosures += strategy.total + governance.total
    completedDisclosures += strategy.completed + governance.completed
  }

  // Count environmental disclosures
  if (this.environmental) {
    const e1 = countDisclosures(this.environmental.climateChange, 'E1-ClimateChange')
    const e2 = countDisclosures(this.environmental.pollution, 'E2-Pollution')
    const e3 = countDisclosures(this.environmental.water, 'E3-Water')
    const e4 = countDisclosures(this.environmental.biodiversity, 'E4-Biodiversity')
    const e5 = countDisclosures(this.environmental.circularEconomy, 'E5-CircularEconomy')
    totalDisclosures += e1.total + e2.total + e3.total + e4.total + e5.total
    completedDisclosures += e1.completed + e2.completed + e3.completed + e4.completed + e5.completed
  }

  // Count social disclosures
  if (this.social) {
    const s1 = countDisclosures(this.social.ownWorkforce, 'S1-OwnWorkforce')
    const s2 = countDisclosures(this.social.valueChainWorkers, 'S2-ValueChain')
    const s3 = countDisclosures(this.social.communities, 'S3-Communities')
    const s4 = countDisclosures(this.social.consumers, 'S4-Consumers')
    totalDisclosures += s1.total + s2.total + s3.total + s4.total
    completedDisclosures += s1.completed + s2.completed + s3.completed + s4.completed
  }

  // Count governance disclosures
  if (this.governance) {
    const g1 = countDisclosures(this.governance.businessConduct, 'G1-BusinessConduct')
    totalDisclosures += g1.total
    completedDisclosures += g1.completed
  }

  // Calculate overall completion
  const overallCompletion = totalDisclosures > 0
    ? Math.round((completedDisclosures / totalDisclosures) * 100)
    : 0

  // Update completion status
  this.completionStatus = {
    overall: overallCompletion,
    byModule: moduleCompletion
  }

  return {
    overall: overallCompletion,
    modules: moduleCompletion,
    totalDisclosures,
    completedDisclosures
  }
}

// Pre-save hook to calculate completion status
CSRDDisclosureSchema.pre('save', function(next) {
  if (this.isModified('generalDisclosures') ||
      this.isModified('environmental') ||
      this.isModified('social') ||
      this.isModified('governance')) {
    this.calculateCompletionStatus()
  }
  next()
})

// Virtual for total disclosure count
CSRDDisclosureSchema.virtual('totalDisclosureCount').get(function() {
  let count = 0

  if (this.generalDisclosures) {
    count += (this.generalDisclosures.strategy || []).length
    count += (this.generalDisclosures.governance || []).length
  }

  if (this.environmental) {
    count += (this.environmental.climateChange || []).length
    count += (this.environmental.pollution || []).length
    count += (this.environmental.water || []).length
    count += (this.environmental.biodiversity || []).length
    count += (this.environmental.circularEconomy || []).length
  }

  if (this.social) {
    count += (this.social.ownWorkforce || []).length
    count += (this.social.valueChainWorkers || []).length
    count += (this.social.communities || []).length
    count += (this.social.consumers || []).length
  }

  if (this.governance) {
    count += (this.governance.businessConduct || []).length
  }

  return count
})

// Static method to get disclosures by company and period
CSRDDisclosureSchema.statics.findByCompanyAndPeriod = function(companyId, reportingPeriod) {
  return this.findOne({ companyId, reportingPeriod })
    .populate('userId', 'firstName lastName email')
    .populate('materialityAssessmentId')
    .populate('submittedBy approvedBy reviewedBy', 'firstName lastName')
}

// Static method to get latest disclosure for a company
CSRDDisclosureSchema.statics.findLatestByCompany = function(companyId) {
  return this.findOne({ companyId })
    .sort({ reportingPeriod: -1 })
    .populate('userId', 'firstName lastName email')
}

const CSRDDisclosure = mongoose.model('CSRDDisclosure', CSRDDisclosureSchema)

module.exports = CSRDDisclosure
