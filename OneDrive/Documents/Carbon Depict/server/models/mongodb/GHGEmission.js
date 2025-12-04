const mongoose = require('mongoose')

/**
 * GHG Emission Schema - Phase 3 Week 9: Database Schema Optimization
 * Enhanced with validation, optimized indexes, and data integrity constraints
 */
const GHGEmissionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
      index: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      index: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      index: true,
    },
    sourceType: {
      type: String,
      trim: true,
      default: 'stationary_combustion',
      enum: {
        values: [
          'stationary_combustion',
          'mobile_combustion',
          'process_emissions',
          'fugitive_emissions',
          'electricity',
          'steam_heating_cooling',
          'business_travel',
          'employee_commuting',
          'waste_disposal',
          'upstream_transportation',
          'downstream_transportation',
          'purchased_goods',
          'capital_goods',
          'other'
        ],
        message: '{VALUE} is not a valid source type'
      }
    },
    scope: {
      type: String,
      enum: {
        values: ['scope1', 'scope2', 'scope3'],
        message: '{VALUE} is not a valid scope'
      },
      required: [true, 'Scope is required'],
      default: 'scope1',
      index: true,
    },
    activityType: {
      type: String,
      trim: true,
      required: [true, 'Activity type is required'],
    },
    activityValue: {
      type: Number,
      required: [true, 'Activity value is required'],
      min: [0, 'Activity value cannot be negative'],
      validate: {
        validator: function(v) {
          return !isNaN(v) && isFinite(v)
        },
        message: 'Activity value must be a valid number'
      }
    },
    activityUnit: {
      type: String,
      trim: true,
      required: [true, 'Activity unit is required'],
      enum: {
        values: [
          'kWh', 'MWh', 'GJ', 'therms',
          'litres', 'gallons', 'm3', 'kg', 'tonnes',
          'miles', 'km', 'passenger-km', 'tonne-km',
          'units', 'hours', 'days'
        ],
        message: '{VALUE} is not a valid activity unit'
      }
    },
    emissionFactor: {
      type: Number,
      required: [true, 'Emission factor is required'],
      min: [0, 'Emission factor cannot be negative'],
    },
    emissionFactorSource: {
      type: String,
      trim: true,
      enum: ['DEFRA', 'EPA', 'IEA', 'GHG_PROTOCOL', 'CUSTOM'],
      default: 'DEFRA',
    },
    co2e: {
      type: Number,
      required: [true, 'CO2e value is required'],
      min: [0, 'CO2e cannot be negative'],
    },
    reportingPeriod: {
      type: String,
      trim: true,
      required: [true, 'Reporting period is required'],
      index: true,
      validate: {
        validator: function(v) {
          // Validates format: YYYY or YYYY-Q1 or YYYY-MM
          return /^\d{4}(-Q[1-4]|-\d{2})?$/.test(v)
        },
        message: 'Reporting period must be in format YYYY, YYYY-Q1, or YYYY-MM'
      }
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      index: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Audit fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user ID is required'],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Compound indexes for common query patterns (performance optimization)
GHGEmissionSchema.index({ companyId: 1, reportingPeriod: 1 })
GHGEmissionSchema.index({ companyId: 1, scope: 1, recordedAt: -1 })
GHGEmissionSchema.index({ companyId: 1, verificationStatus: 1, recordedAt: -1 })
GHGEmissionSchema.index({ facilityId: 1, reportingPeriod: 1 })
GHGEmissionSchema.index({ facilityId: 1, scope: 1, recordedAt: -1 })

// Covering index for reporting queries (includes all fields needed for reports)
GHGEmissionSchema.index(
  { companyId: 1, reportingPeriod: 1, scope: 1 },
  { name: 'reporting_query_index' }
)

// Text index for searching notes
GHGEmissionSchema.index({ notes: 'text', activityType: 'text' })

// Virtual for emission intensity (if applicable)
GHGEmissionSchema.virtual('emissionIntensity').get(function() {
  return this.activityValue > 0 ? this.co2e / this.activityValue : 0
})

// Instance methods
GHGEmissionSchema.methods = {
  /**
   * Verify this emission record
   */
  async verify(userId) {
    this.verificationStatus = 'verified'
    this.verifiedBy = userId
    this.verifiedAt = new Date()
    return this.save()
  },

  /**
   * Reject this emission record
   */
  async reject(userId) {
    this.verificationStatus = 'rejected'
    this.verifiedBy = userId
    this.verifiedAt = new Date()
    return this.save()
  },

  /**
   * Check if this emission record is verified
   */
  isVerified() {
    return this.verificationStatus === 'verified'
  },
}

// Static methods
GHGEmissionSchema.statics = {
  /**
   * Get emissions by company and period with aggregation
   */
  async getEmissionsByPeriod(companyId, reportingPeriod) {
    return this.aggregate([
      {
        $match: {
          companyId: mongoose.Types.ObjectId(companyId),
          reportingPeriod,
          verificationStatus: { $ne: 'rejected' }
        }
      },
      {
        $group: {
          _id: '$scope',
          totalCO2e: { $sum: '$co2e' },
          count: { $sum: 1 },
          avgEmissionFactor: { $avg: '$emissionFactor' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
  },

  /**
   * Get total emissions by scope for a company
   */
  async getTotalEmissionsByScope(companyId, startDate, endDate) {
    const query = {
      companyId: mongoose.Types.ObjectId(companyId),
      verificationStatus: { $ne: 'rejected' }
    }

    if (startDate && endDate) {
      query.recordedAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    return this.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$scope',
          totalCO2e: { $sum: '$co2e' },
          count: { $sum: 1 }
        }
      }
    ])
  },

  /**
   * Find emissions needing verification
   */
  async findPendingVerification(companyId, limit = 50) {
    return this.find({
      companyId,
      verificationStatus: 'pending'
    })
    .sort({ recordedAt: -1 })
    .limit(limit)
    .populate('createdBy', 'name email')
    .lean()
  },
}

// Pre-save middleware to calculate CO2e if not provided
GHGEmissionSchema.pre('save', function(next) {
  if (this.isModified('activityValue') || this.isModified('emissionFactor')) {
    this.co2e = this.activityValue * this.emissionFactor
  }
  next()
})

// Pre-save middleware to set updatedBy
GHGEmissionSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew && this._updateUserId) {
    this.updatedBy = this._updateUserId
  }
  next()
})

module.exports = mongoose.model('GHGEmission', GHGEmissionSchema)
