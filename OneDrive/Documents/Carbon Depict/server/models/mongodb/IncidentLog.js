const mongoose = require('mongoose')

/**
 * IncidentLog Model (MongoDB)
 * Stores ESG incidents, violations, and grievances
 */
const incidentLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      index: true,
      // Reporter
    },
    // Incident identification
    incidentId: {
      type: String,
      required: true,
      unique: true,
    },
    incidentDate: {
      type: Date,
      required: true,
      index: true,
    },
    reportedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // Classification
    incidentType: {
      type: String,
      required: true,
      enum: [
        'environmental-spill',
        'environmental-violation',
        'work-injury',
        'work-fatality',
        'occupational-disease',
        'discrimination',
        'harassment',
        'child-labor',
        'forced-labor',
        'human-rights-violation',
        'corruption',
        'bribery',
        'data-breach',
        'product-safety',
        'customer-complaint',
        'supply-chain-violation',
        'community-grievance',
        'other',
      ],
      index: true,
    },
    pillar: {
      type: String,
      enum: ['Environmental', 'Social', 'Governance'],
    },
    severity: {
      type: String,
      required: true,
      enum: ['minor', 'moderate', 'major', 'critical', 'catastrophic'],
      index: true,
    },
    // Location
    location: {
      facility: String,
      department: String,
      country: String,
      region: String,
      gpsCoordinates: {
        lat: Number,
        lon: Number,
      },
    },
    // Description
    description: {
      type: String,
      required: true,
    },
    rootCause: {
      type: String,
    },
    contributingFactors: [String],
    // Impact
    impact: {
      environmental: {
        spill: {
          substance: String,
          volume: Number,
          unit: String,
        },
        airEmissions: Boolean,
        waterContamination: Boolean,
        soilContamination: Boolean,
        wildlifeImpact: Boolean,
        estimatedCost: Number, // USD
      },
      social: {
        peopleAffected: Number,
        injuries: {
          minor: Number,
          serious: Number,
          fatal: Number,
        },
        medicalTreatment: Boolean,
        lostTimeIncidents: Number,
        psychologicalHarm: Boolean,
      },
      financial: {
        directCost: Number, // USD
        fines: Number,
        legalCost: Number,
        remediationCost: Number,
      },
      reputational: {
        mediaAttention: Boolean,
        customerComplaints: Number,
        stakeholderConcerns: Boolean,
      },
    },
    // Legal and regulatory
    regulatoryViolation: {
      type: Boolean,
      default: false,
    },
    regulationsViolated: [String],
    authoritiesNotified: {
      type: Boolean,
      default: false,
    },
    authoritiesList: [String],
    finesIssued: {
      type: Boolean,
      default: false,
    },
    fineAmount: {
      type: Number,
    },
    legalActionTaken: {
      type: Boolean,
      default: false,
    },
    // Response
    immediateActions: {
      type: String,
    },
    evacuationRequired: {
      type: Boolean,
    },
    emergencyServicesContacted: {
      type: Boolean,
    },
    // Investigation
    investigationDate: {
      type: Date,
    },
    investigator: {
      type: String,
    },
    investigationFindings: {
      type: String,
    },
    evidenceCollected: [
      {
        type: String,
        filePath: String,
        description: String,
      },
    ],
    // Corrective actions
    correctiveActions: [
      {
        action: String,
        responsible: String,
        deadline: Date,
        status: {
          type: String,
          enum: ['planned', 'in-progress', 'completed', 'overdue'],
        },
        completionDate: Date,
        effectiveness: String, // effective, partially-effective, ineffective
      },
    ],
    // Preventive actions
    preventiveActions: [
      {
        action: String,
        responsible: String,
        deadline: Date,
        status: String,
      },
    ],
    // Remediation
    remediationPlan: {
      type: String,
    },
    remediationStatus: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
    },
    remediationCost: {
      type: Number,
    },
    // Follow-up
    followUpDate: {
      type: Date,
    },
    followUpNotes: {
      type: String,
    },
    lessonsLearned: {
      type: String,
    },
    // Closure
    status: {
      type: String,
      required: true,
      enum: ['open', 'under-investigation', 'remediation', 'closed', 'reopened'],
      default: 'open',
    },
    closureDate: {
      type: Date,
    },
    closedBy: {
      type: String,
    },
    // Reporting
    reportedInPublicDisclosure: {
      type: Boolean,
      default: false,
    },
    relatedFrameworks: [String], // GRI 403-9, GRI 306-3, ESRS E2-4, etc.
    // Confidentiality
    isConfidential: {
      type: Boolean,
      default: false,
    },
    accessRestriction: [String], // User roles who can access
  },
  {
    timestamps: true,
    collection: 'incident_logs',
  }
)

// Indexes
incidentLogSchema.index({ companyId: 1, incidentDate: -1 })
incidentLogSchema.index({ incidentType: 1, severity: 1 })
incidentLogSchema.index({ status: 1 })
incidentLogSchema.index({ pillar: 1 })

const IncidentLog = mongoose.model('IncidentLog', incidentLogSchema)

module.exports = IncidentLog
