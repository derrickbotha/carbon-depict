const mongoose = require('mongoose')

const FacilitySchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    facilityType: {
      type: String,
      enum: [
        'office',
        'manufacturing',
        'warehouse',
        'retail',
        'data_center',
        'fleet',
        'other',
      ],
      default: 'office',
    },
    isActive: {
      type: Boolean,
      default: true,
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

FacilitySchema.index({ companyId: 1, isActive: 1 })
FacilitySchema.index({ locationId: 1 })

module.exports = mongoose.model('Facility', FacilitySchema)
