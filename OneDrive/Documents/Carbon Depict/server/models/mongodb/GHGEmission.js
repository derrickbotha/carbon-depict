const mongoose = require('mongoose')

const GHGEmissionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
    },
    sourceType: {
      type: String,
      trim: true,
      default: 'stationary_combustion',
    },
    scope: {
      type: String,
      enum: ['scope1', 'scope2', 'scope3'],
      default: 'scope1',
    },
    activityType: {
      type: String,
      trim: true,
    },
    activityValue: {
      type: Number,
      default: 0,
    },
    activityUnit: {
      type: String,
      trim: true,
    },
    emissionFactor: {
      type: Number,
      default: 0,
    },
    co2e: {
      type: Number,
      default: 0,
    },
    reportingPeriod: {
      type: String,
      trim: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

GHGEmissionSchema.index({ companyId: 1, reportingPeriod: 1 })
GHGEmissionSchema.index({ facilityId: 1 })
GHGEmissionSchema.index({ scope: 1 })

module.exports = mongoose.model('GHGEmission', GHGEmissionSchema)
