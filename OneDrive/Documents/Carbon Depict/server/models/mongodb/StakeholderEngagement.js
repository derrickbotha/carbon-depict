const mongoose = require('mongoose')

/**
 * StakeholderEngagement Model (MongoDB)
 * Stores stakeholder consultation logs and feedback
 */
const stakeholderEngagementSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      index: true,
      // UUID from PostgreSQL
    },
    engagementType: {
      type: String,
      required: true,
      enum: [
        'survey',
        'interview',
        'workshop',
        'focus-group',
        'public-consultation',
        'board-meeting',
        'investor-call',
        'community-meeting',
        'supplier-assessment',
      ],
    },
    purpose: {
      type: String,
      required: true,
      enum: [
        'materiality-assessment',
        'strategy-development',
        'risk-identification',
        'feedback-collection',
        'grievance-handling',
        'reporting-validation',
        'target-setting',
      ],
    },
    // Timing
    engagementDate: {
      type: Date,
      required: true,
      index: true,
    },
    reportingPeriod: {
      type: String,
      // FY2024, Q1-2025
    },
    // Stakeholder groups
    stakeholderGroups: [
      {
        type: String,
        enum: [
          'employees',
          'investors',
          'customers',
          'suppliers',
          'communities',
          'regulators',
          'ngos',
          'academia',
          'media',
          'indigenous-peoples',
        ],
      },
    ],
    numberOfParticipants: {
      type: Number,
    },
    participantDemographics: {
      type: mongoose.Schema.Types.Mixed,
      // Gender, age, geography breakdown
    },
    // Topics discussed
    topics: [
      {
        topic: String,
        pillar: {
          type: String,
          enum: ['Environmental', 'Social', 'Governance'],
        },
        priorityRanking: Number, // 1-5, stakeholder priority
        feedback: String,
      },
    ],
    // Key findings
    keyFindings: {
      type: String,
    },
    priorityIssues: [String],
    concerns: [String],
    suggestions: [String],
    // Materiality input
    materialityInput: [
      {
        topic: String,
        impactRating: Number, // 1-5
        financialRating: Number, // 1-5
        comments: String,
      },
    ],
    // Actions taken
    actionsTaken: [
      {
        action: String,
        responsible: String,
        deadline: Date,
        status: {
          type: String,
          enum: ['planned', 'in-progress', 'completed', 'cancelled'],
        },
      },
    ],
    // Documentation
    methodology: {
      type: String,
    },
    facilitators: [String],
    documentation: [
      {
        type: String, // File path
        description: String,
      },
    ],
    // Framework alignment
    relatedFrameworks: [String], // GRI 2-29, ESRS 2-SBM-3, etc.
    // Follow-up
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
    },
    nextEngagement: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'stakeholder_engagements',
  }
)

// Indexes
stakeholderEngagementSchema.index({ companyId: 1, engagementDate: -1 })
stakeholderEngagementSchema.index({ engagementType: 1, purpose: 1 })
stakeholderEngagementSchema.index({ stakeholderGroups: 1 })

const StakeholderEngagement = mongoose.model('StakeholderEngagement', stakeholderEngagementSchema)

module.exports = StakeholderEngagement
