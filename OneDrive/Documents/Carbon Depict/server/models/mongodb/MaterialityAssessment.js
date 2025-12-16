/**
 * Materiality Assessment Model
 *
 * Stores double materiality assessment data including stakeholder engagement,
 * material topics identification, and impact/financial scoring
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Sub-schema for stakeholder groups
const StakeholderGroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['internal', 'external'],
    required: true
  },
  category: {
    type: String,
    enum: [
      'employees', 'investors', 'customers', 'suppliers',
      'communities', 'regulators', 'ngos', 'media', 'other'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  engagementMethod: {
    type: String,
    enum: ['survey', 'interview', 'workshop', 'focus_group', 'consultation', 'other']
  },
  contactCount: {
    type: Number,
    default: 0
  },
  lastEngagement: Date,
  notes: String
}, { _id: true })

// Sub-schema for material topics
const MaterialTopicSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Environmental', 'Social', 'Governance'],
    required: true
  },
  subcategory: String,

  // Double Materiality Scoring
  impactScore: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  financialScore: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },

  // Stakeholder Input
  stakeholderConcern: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },

  // Materiality Determination
  isMaterial: {
    type: Boolean,
    default: false
  },

  // Framework Alignment
  frameworks: [{
    type: String,
    enum: ['GRI', 'SASB', 'TCFD', 'CSRD', 'CDP', 'SDG', 'ISSB', 'UNGC']
  }],

  // Risk & Opportunity
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical']
  },
  opportunityLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'significant']
  },

  // Mitigation & Strategy
  mitigationStrategy: String,
  relatedPolicies: [String],

  // Data Collection Status
  dataCollectionStatus: {
    formId: String,
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed']
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    requiredFor: [String]
  },

  // Supporting Evidence
  evidenceDocuments: [{
    name: String,
    url: String,
    uploadedAt: Date
  }],

  notes: String
}, { _id: true })

const MaterialityAssessmentSchema = new Schema({
  // Company Reference
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },

  // User who created this assessment
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Assessment Year
  assessmentYear: {
    type: String,
    required: true,
    match: /^\d{4}$/,  // YYYY format
    index: true
  },

  // Methodology
  methodology: {
    type: String,
    enum: ['single', 'double', 'dynamic'],
    default: 'double',
    required: true
  },

  // Stakeholder Engagement
  stakeholderGroups: [StakeholderGroupSchema],

  // Material Topics
  materialTopics: [MaterialTopicSchema],

  // Materiality Matrix Results
  materialityMatrix: {
    highPriority: [{
      type: Schema.Types.ObjectId
    }],
    mediumPriority: [{
      type: Schema.Types.ObjectId
    }],
    lowPriority: [{
      type: Schema.Types.ObjectId
    }]
  },

  // Assessment Process
  processSteps: [{
    step: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    completedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Approval Workflow
  status: {
    type: String,
    enum: ['draft', 'under_review', 'approved', 'published', 'archived'],
    default: 'draft',
    index: true
  },

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

  publishedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  publishedAt: Date,

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

  // Next Review
  nextReviewDate: Date,

  // Metadata
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },

  // Audit Trail
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

// Compound Indexes
MaterialityAssessmentSchema.index({ companyId: 1, assessmentYear: 1 }, { unique: true })
MaterialityAssessmentSchema.index({ companyId: 1, status: 1 })

// Virtual for total material topics count
MaterialityAssessmentSchema.virtual('materialTopicsCount').get(function() {
  return this.materialTopics ? this.materialTopics.filter(t => t.isMaterial).length : 0
})

// Virtual for total topics count
MaterialityAssessmentSchema.virtual('totalTopicsCount').get(function() {
  return this.materialTopics ? this.materialTopics.length : 0
})

// Method to categorize topics by materiality
MaterialityAssessmentSchema.methods.categorizeByMateriality = function() {
  const highPriority = []
  const mediumPriority = []
  const lowPriority = []

  if (!this.materialTopics) return { highPriority, mediumPriority, lowPriority }

  this.materialTopics.forEach(topic => {
    if (!topic.isMaterial) return

    // Double materiality logic: high if either score >= 7
    const avgScore = (topic.impactScore + topic.financialScore) / 2

    if (topic.impactScore >= 7 || topic.financialScore >= 7 || avgScore >= 7) {
      highPriority.push(topic._id)
    } else if (avgScore >= 4) {
      mediumPriority.push(topic._id)
    } else {
      lowPriority.push(topic._id)
    }
  })

  return { highPriority, mediumPriority, lowPriority }
}

// Method to update materiality matrix
MaterialityAssessmentSchema.methods.updateMaterialityMatrix = function() {
  const categorized = this.categorizeByMateriality()
  this.materialityMatrix = categorized
  return this.materialityMatrix
}

// Pre-save hook to update materiality matrix
MaterialityAssessmentSchema.pre('save', function(next) {
  if (this.isModified('materialTopics')) {
    this.updateMaterialityMatrix()
  }
  next()
})

// Static method to find by company and year
MaterialityAssessmentSchema.statics.findByCompanyAndYear = function(companyId, assessmentYear) {
  return this.findOne({ companyId, assessmentYear })
    .populate('userId', 'firstName lastName email')
    .populate('approvedBy reviewedBy publishedBy', 'firstName lastName')
}

// Static method to get latest assessment
MaterialityAssessmentSchema.statics.findLatestByCompany = function(companyId) {
  return this.findOne({ companyId, status: { $ne: 'archived' } })
    .sort({ assessmentYear: -1 })
    .populate('userId', 'firstName lastName email')
}

// Static method to get material topics for a company
MaterialityAssessmentSchema.statics.getMaterialTopics = async function(companyId, assessmentYear) {
  const assessment = await this.findByCompanyAndYear(companyId, assessmentYear)
  if (!assessment) return []

  return assessment.materialTopics.filter(t => t.isMaterial)
}

const MaterialityAssessment = mongoose.model('MaterialityAssessment', MaterialityAssessmentSchema)

module.exports = MaterialityAssessment
