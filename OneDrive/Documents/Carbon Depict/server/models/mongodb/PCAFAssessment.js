/**
 * PCAF (Partnership for Carbon Accounting Financials) Assessment Model
 *
 * Stores financed emissions data for financial institutions
 * Supports portfolio-level carbon accounting across asset classes
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Sub-schema for individual assets
const AssetSchema = new Schema({
  // Asset Identification
  assetId: String,
  assetClass: {
    type: String,
    enum: [
      'listed_equity',
      'corporate_bonds',
      'business_loans',
      'project_finance',
      'commercial_real_estate',
      'mortgages',
      'motor_vehicles',
      'unlisted_equity'
    ],
    required: true
  },

  // Client/Borrower Information
  clientName: String,
  clientId: String,
  sector: String,
  subsector: String,
  geography: String,
  sizeCategory: {
    type: String,
    enum: ['small', 'medium', 'large']
  },

  // Attribution Factors
  outstandingAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },

  // Company Value (for attribution)
  companyValue: {
    type: Number,
    required: true
  },
  companyValueType: {
    type: String,
    enum: ['EVIC', 'total_assets', 'total_equity'],
    required: true
  },

  // Attribution Factor calculation: outstandingAmount / companyValue
  attributionFactor: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },

  // Emissions Data
  borrowerEmissions: {
    type: Number,
    required: true
  },
  borrowerEmissionsScope: {
    type: String,
    enum: ['scope1', 'scope2', 'scope1_2', 'scope1_2_3'],
    default: 'scope1_2'
  },

  // Attributed Emissions = borrowerEmissions * attributionFactor
  attributedEmissions: {
    type: Number,
    required: true
  },

  // Data Quality Score (1-5, where 1 is highest quality)
  dataQualityScore: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  // Calculation Method & Data Source
  calculationMethod: {
    type: String,
    enum: [
      'reported_emissions',
      'physical_activity_based',
      'economic_activity_based',
      'composite'
    ],
    required: true
  },

  dataSource: {
    type: String,
    enum: [
      'client_reported',
      'third_party_data',
      'estimated',
      'peer_average',
      'sector_average'
    ],
    required: true
  },

  primaryData: {
    type: Boolean,
    default: false
  },

  // Emissions Intensity
  emissionsIntensity: Number,
  intensityMetric: String,

  // Temporal Coverage
  dataYear: Number,
  dataAge: Number,  // Years old

  // Notes
  notes: String
}, { _id: true })

const PCAFAssessmentSchema = new Schema({
  // Company Reference (Financial Institution)
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },

  // Reporting Period
  reportingPeriod: {
    type: String,
    required: true,
    match: /^\d{4}$/,
    index: true
  },

  // Portfolio Overview
  portfolioType: {
    type: String,
    enum: ['loans', 'investments', 'project_finance', 'insurance', 'mixed'],
    required: true
  },

  portfolioName: String,

  totalExposure: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },

  // Individual Assets
  assets: [AssetSchema],

  // Aggregate Metrics
  totals: {
    totalFinancedEmissions: {
      type: Number,
      default: 0
    },
    totalAttributedEmissions: {
      type: Number,
      default: 0
    },
    weightedAverageDataQuality: {
      type: Number,
      default: 0,
      min: 1,
      max: 5
    },
    assetCount: {
      type: Number,
      default: 0
    }
  },

  // Breakdown by Asset Class
  breakdownByAssetClass: {
    type: Map,
    of: {
      emissions: Number,
      assetCount: Number,
      exposure: Number,
      avgDataQuality: Number
    }
  },

  // Breakdown by Sector
  breakdownBySector: {
    type: Map,
    of: {
      emissions: Number,
      assetCount: Number,
      exposure: Number
    }
  },

  // Breakdown by Geography
  breakdownByGeography: {
    type: Map,
    of: {
      emissions: Number,
      assetCount: Number,
      exposure: Number
    }
  },

  // Data Quality Summary
  dataQualityDistribution: {
    score1: { type: Number, default: 0 },
    score2: { type: Number, default: 0 },
    score3: { type: Number, default: 0 },
    score4: { type: Number, default: 0 },
    score5: { type: Number, default: 0 }
  },

  // Methodology & Assumptions
  methodology: String,
  assumptions: [String],
  exclusions: [String],

  // Status
  status: {
    type: String,
    enum: ['draft', 'in_progress', 'completed', 'published'],
    default: 'draft',
    index: true
  },

  // Verification
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: String,
  verifiedAt: Date,

  // Supporting Documentation
  supportingDocuments: [{
    name: String,
    type: String,
    url: String,
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
  timestamps: true
})

// Indexes
PCAFAssessmentSchema.index({ companyId: 1, reportingPeriod: 1 })
PCAFAssessmentSchema.index({ companyId: 1, portfolioType: 1 })

// Method to calculate totals and breakdowns
PCAFAssessmentSchema.methods.calculateAggregates = function() {
  if (!this.assets || this.assets.length === 0) {
    return
  }

  // Calculate totals
  let totalEmissions = 0
  let totalDataQuality = 0
  const assetClassBreakdown = new Map()
  const sectorBreakdown = new Map()
  const geographyBreakdown = new Map()
  const dataQualityDist = { score1: 0, score2: 0, score3: 0, score4: 0, score5: 0 }

  this.assets.forEach(asset => {
    totalEmissions += asset.attributedEmissions
    totalDataQuality += asset.dataQualityScore

    // Data quality distribution
    dataQualityDist[`score${asset.dataQualityScore}`] = (dataQualityDist[`score${asset.dataQualityScore}`] || 0) + 1

    // Asset class breakdown
    const assetClass = asset.assetClass
    if (!assetClassBreakdown.has(assetClass)) {
      assetClassBreakdown.set(assetClass, {
        emissions: 0,
        assetCount: 0,
        exposure: 0,
        avgDataQuality: 0
      })
    }
    const acData = assetClassBreakdown.get(assetClass)
    acData.emissions += asset.attributedEmissions
    acData.assetCount += 1
    acData.exposure += asset.outstandingAmount
    acData.avgDataQuality += asset.dataQualityScore

    // Sector breakdown
    if (asset.sector) {
      if (!sectorBreakdown.has(asset.sector)) {
        sectorBreakdown.set(asset.sector, { emissions: 0, assetCount: 0, exposure: 0 })
      }
      const sData = sectorBreakdown.get(asset.sector)
      sData.emissions += asset.attributedEmissions
      sData.assetCount += 1
      sData.exposure += asset.outstandingAmount
    }

    // Geography breakdown
    if (asset.geography) {
      if (!geographyBreakdown.has(asset.geography)) {
        geographyBreakdown.set(asset.geography, { emissions: 0, assetCount: 0, exposure: 0 })
      }
      const gData = geographyBreakdown.get(asset.geography)
      gData.emissions += asset.attributedEmissions
      gData.assetCount += 1
      gData.exposure += asset.outstandingAmount
    }
  })

  // Average data quality per asset class
  assetClassBreakdown.forEach((value, key) => {
    value.avgDataQuality = value.avgDataQuality / value.assetCount
  })

  // Update document
  this.totals = {
    totalFinancedEmissions: totalEmissions,
    totalAttributedEmissions: totalEmissions,
    weightedAverageDataQuality: totalDataQuality / this.assets.length,
    assetCount: this.assets.length
  }

  this.breakdownByAssetClass = assetClassBreakdown
  this.breakdownBySector = sectorBreakdown
  this.breakdownByGeography = geographyBreakdown
  this.dataQualityDistribution = dataQualityDist
}

// Pre-save hook to calculate attribution and aggregates
PCAFAssessmentSchema.pre('save', function(next) {
  // Calculate attribution factors for assets
  if (this.assets) {
    this.assets.forEach(asset => {
      asset.attributionFactor = asset.outstandingAmount / asset.companyValue
      asset.attributedEmissions = asset.borrowerEmissions * asset.attributionFactor
    })
  }

  // Calculate aggregates
  if (this.isModified('assets')) {
    this.calculateAggregates()
  }

  next()
})

// Static method to get portfolio emissions trend
PCAFAssessmentSchema.statics.getEmissionsTrend = function(companyId) {
  return this.aggregate([
    {
      $match: { companyId: mongoose.Types.ObjectId(companyId) }
    },
    {
      $group: {
        _id: '$reportingPeriod',
        totalEmissions: { $sum: '$totals.totalFinancedEmissions' },
        avgDataQuality: { $avg: '$totals.weightedAverageDataQuality' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])
}

const PCAFAssessment = mongoose.model('PCAFAssessment', PCAFAssessmentSchema)

module.exports = PCAFAssessment
