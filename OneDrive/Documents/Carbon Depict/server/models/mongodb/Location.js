const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    parentLocationId: {
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
    locationType: {
      type: String,
      enum: [
        'headquarters',
        'office',
        'warehouse',
        'factory',
        'retail_store',
        'data_center',
        'distribution_center',
        'branch',
        'remote',
        'other',
      ],
      default: 'office',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'planned', 'closed'],
      default: 'active',
    },
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      default: 'UTC',
      trim: true,
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

LocationSchema.index({ companyId: 1, status: 1 })
LocationSchema.index({ companyId: 1, parentLocationId: 1 })
LocationSchema.index({ code: 1 }, { sparse: true, unique: false })

module.exports = mongoose.model('Location', LocationSchema)
