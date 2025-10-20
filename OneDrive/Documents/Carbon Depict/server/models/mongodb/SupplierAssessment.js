const mongoose = require('mongoose')

/**
 * SupplierAssessment Model (MongoDB)
 * Stores supplier ESG assessments and due diligence
 */
const supplierAssessmentSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    // Supplier information
    supplierId: {
      type: String,
      required: true,
      index: true,
    },
    supplierName: {
      type: String,
      required: true,
    },
    supplierCountry: {
      type: String,
      required: true,
    },
    supplierRegion: {
      type: String,
    },
    supplierType: {
      type: String,
      enum: ['tier-1', 'tier-2', 'tier-3', 'service-provider', 'subcontractor'],
    },
    supplierCategory: {
      type: String,
      // Raw materials, manufacturing, logistics, services, etc.
    },
    annualSpend: {
      type: Number,
      // USD
    },
    percentageOfTotalSpend: {
      type: Number,
      // 0-100
    },
    contractType: {
      type: String,
      enum: ['one-time', 'short-term', 'long-term', 'strategic'],
    },
    // Assessment details
    assessmentDate: {
      type: Date,
      required: true,
      index: true,
    },
    assessmentType: {
      type: String,
      required: true,
      enum: ['onboarding', 'annual-review', 'audit', 'risk-triggered', 'incident-investigation'],
    },
    assessmentMethod: {
      type: String,
      enum: ['self-assessment', 'desk-review', 'on-site-audit', 'third-party-audit', 'certification'],
    },
    assessor: {
      type: String,
    },
    // ESG scoring
    environmentalScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    socialScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    governanceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      index: true,
    },
    riskRating: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      index: true,
    },
    // Environmental assessment
    environmental: {
      ghgEmissions: {
        reported: Boolean,
        scope1: Number,
        scope2: Number,
        scope3: Number,
        unit: String,
      },
      energyManagement: {
        renewableEnergy: Number, // %
        energyEfficiencyPrograms: Boolean,
        iso50001: Boolean,
      },
      waterManagement: {
        waterWithdrawal: Number,
        waterRecycling: Number,
        waterStressArea: Boolean,
      },
      wasteManagement: {
        wasteGenerated: Number,
        recyclingRate: Number,
        hazardousWaste: Boolean,
      },
      pollutionControl: {
        airEmissions: Boolean,
        waterDischarge: Boolean,
        chemicalsManaged: Boolean,
      },
      biodiversity: {
        protectedAreasImpact: Boolean,
        deforestationRisk: Boolean,
      },
      certifications: [String], // ISO 14001, FSC, MSC, etc.
    },
    // Social assessment
    social: {
      laborRights: {
        collectiveBargaining: Boolean,
        fairWages: Boolean,
        workingHours: String,
        childLabor: {
          risk: String, // none, low, medium, high
          remediation: String,
        },
        forcedLabor: {
          risk: String,
          remediation: String,
        },
      },
      healthSafety: {
        ohsManagementSystem: Boolean,
        iso45001: Boolean,
        fatalityRate: Number,
        injuryRate: Number,
        trainingHours: Number,
      },
      diversity: {
        genderDiversity: Number, // % female
        ethnicDiversity: Boolean,
        disabilityInclusion: Boolean,
      },
      humanRights: {
        humanRightsPolicy: Boolean,
        dueDiligence: Boolean,
        grievanceMechanism: Boolean,
        indigenousPeoples: Boolean,
      },
      communityImpact: {
        localHiring: Number, // %
        communityPrograms: Boolean,
        landRights: Boolean,
      },
      certifications: [String], // SA8000, Fair Trade, etc.
    },
    // Governance assessment
    governance: {
      antiCorruption: {
        policy: Boolean,
        training: Boolean,
        incidents: Number,
      },
      ethics: {
        codeOfConduct: Boolean,
        whistleblowerMechanism: Boolean,
        conflictOfInterest: Boolean,
      },
      supplyChain: {
        supplierCode: Boolean,
        tierNMapping: Boolean,
        dueDiligence: Boolean,
      },
      dataPrivacy: {
        gdprCompliant: Boolean,
        dataBreaches: Number,
      },
      certifications: [String], // ISO 37001, etc.
    },
    // Risk identification
    risksIdentified: [
      {
        riskType: String,
        severity: String, // low, medium, high, critical
        likelihood: String,
        description: String,
        mitigation: String,
        deadline: Date,
      },
    ],
    // Non-compliance issues
    nonCompliance: [
      {
        issue: String,
        framework: String, // Supplier code, law, standard
        severity: String,
        correctiveAction: String,
        deadline: Date,
        status: String,
      },
    ],
    // Corrective action plans
    correctiveActions: [
      {
        action: String,
        responsible: String,
        deadline: Date,
        status: {
          type: String,
          enum: ['open', 'in-progress', 'completed', 'overdue'],
        },
        verificationDate: Date,
      },
    ],
    // Engagement and improvement
    engagementLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    improvementPlan: {
      type: String,
    },
    capacityBuilding: [
      {
        topic: String,
        date: Date,
        participants: Number,
      },
    ],
    // Decision
    approvalStatus: {
      type: String,
      enum: ['approved', 'conditional', 'rejected', 'under-review'],
      index: true,
    },
    approvedBy: {
      type: String,
    },
    contractRenewal: {
      type: Boolean,
    },
    nextAssessmentDate: {
      type: Date,
    },
    // Framework alignment
    relatedFrameworks: [String], // GRI 308, GRI 414, ESRS S2, etc.
    // Documentation
    documents: [
      {
        type: String,
        filePath: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'supplier_assessments',
  }
)

// Indexes
supplierAssessmentSchema.index({ companyId: 1, supplierId: 1, assessmentDate: -1 })
supplierAssessmentSchema.index({ overallScore: 1, riskRating: 1 })
supplierAssessmentSchema.index({ approvalStatus: 1 })

const SupplierAssessment = mongoose.model('SupplierAssessment', supplierAssessmentSchema)

module.exports = SupplierAssessment
