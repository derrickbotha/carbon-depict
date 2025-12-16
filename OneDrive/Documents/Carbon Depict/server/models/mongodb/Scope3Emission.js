/**
 * Scope 3 Emission Model
 *
 * Stores Scope 3 emissions data across all 15 categories
 * Supports value chain emissions tracking with data quality assessment
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Scope3EmissionSchema = new Schema({
  // Company Reference
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
    index: true
  },

  // Scope 3 Category (1-15)
  category: {
    type: String,
    enum: [
      'purchased_goods_services',    // Category 1
      'capital_goods',               // Category 2
      'fuel_energy',                 // Category 3
      'upstream_transportation',     // Category 4
      'waste',                       // Category 5
      'business_travel',             // Category 6
      'employee_commuting',          // Category 7
      'upstream_leased_assets',      // Category 8
      'downstream_transportation',   // Category 9
      'processing_products',         // Category 10
      'use_of_products',            // Category 11
      'end_of_life',                // Category 12
      'downstream_leased_assets',   // Category 13
      'franchises',                 // Category 14
      'investments'                  // Category 15
    ],
    required: true,
    index: true
  },

  categoryNumber: {
    type: Number,
    min: 1,
    max: 15
  },

  categoryName: {
    type: String,
    required: true
  },

  subcategory: String,

  // Activity Data
  activityData: {
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    source: String,
    dataCollectionMethod: String
  },

  // Calculation Method
  calculationMethod: {
    type: String,
    enum: ['supplier_specific', 'hybrid', 'average_data', 'spend_based', 'average_product'],
    required: true
  },

  // Emission Factor
  emissionFactor: {
    type: Number,
    required: true
  },
  emissionFactorUnit: String,
  emissionFactorSource: {
    type: String,
    required: true
  },

  // Data Quality
  dataQuality: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  dataQualityScore: {
    type: Number,
    min: 1,
    max: 5
  },

  // Results (in tCO2e)
  co2e: {
    type: Number,
    required: true
  },

  breakdown: {
    co2: Number,
    ch4: Number,
    n2o: Number,
    otherGHG: Number
  },

  // Supplier Data (for upstream categories)
  supplierId: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  supplierName: String,
  supplierEngagement: {
    type: Boolean,
    default: false
  },
  primaryData: {
    type: Boolean,
    default: false
  },

  // Verification
  verificationStatus: {
    type: String,
    enum: ['unverified', 'internal_review', 'third_party_verified'],
    default: 'unverified'
  },
  verifiedBy: String,
  verifiedAt: Date,

  // Supporting Documentation
  supportingDocuments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],

  notes: String,
  assumptions: [String],

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
Scope3EmissionSchema.index({ companyId: 1, category: 1, reportingPeriod: 1 })
Scope3EmissionSchema.index({ companyId: 1, reportingPeriod: 1 })
Scope3EmissionSchema.index({ supplierId: 1 })

// Pre-save: Set category number
Scope3EmissionSchema.pre('save', function(next) {
  const categoryMap = {
    'purchased_goods_services': 1,
    'capital_goods': 2,
    'fuel_energy': 3,
    'upstream_transportation': 4,
    'waste': 5,
    'business_travel': 6,
    'employee_commuting': 7,
    'upstream_leased_assets': 8,
    'downstream_transportation': 9,
    'processing_products': 10,
    'use_of_products': 11,
    'end_of_life': 12,
    'downstream_leased_assets': 13,
    'franchises': 14,
    'investments': 15
  }

  this.categoryNumber = categoryMap[this.category]
  next()
})

// Static method to get total by category
Scope3EmissionSchema.statics.getTotalByCategory = function(companyId, reportingPeriod) {
  return this.aggregate([
    {
      $match: {
        companyId: mongoose.Types.ObjectId(companyId),
        reportingPeriod
      }
    },
    {
      $group: {
        _id: { category: '$category', categoryNumber: '$categoryNumber' },
        totalCO2e: { $sum: '$co2e' },
        count: { $sum: 1 },
        avgDataQualityScore: { $avg: '$dataQualityScore' }
      }
    },
    {
      $sort: { '_id.categoryNumber': 1 }
    }
  ])
}

// Static method to get scope 3 totals
Scope3EmissionSchema.statics.getScope3Total = async function(companyId, reportingPeriod) {
  const result = await this.aggregate([
    {
      $match: {
        companyId: mongoose.Types.ObjectId(companyId),
        reportingPeriod
      }
    },
    {
      $group: {
        _id: null,
        totalCO2e: { $sum: '$co2e' },
        count: { $sum: 1 },
        avgDataQuality: { $avg: '$dataQualityScore' }
      }
    }
  ])

  return result[0] || { totalCO2e: 0, count: 0, avgDataQuality: 0 }
}

const Scope3Emission = mongoose.model('Scope3Emission', Scope3EmissionSchema)

module.exports = Scope3Emission
