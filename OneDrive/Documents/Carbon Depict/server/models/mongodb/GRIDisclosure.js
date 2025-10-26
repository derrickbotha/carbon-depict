const mongoose = require('mongoose')

const GRIDisclosureSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    disclosureId: {
      type: String,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    subtopic: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    evidence: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'completed'],
      default: 'draft',
    },
    completedAt: {
      type: Date,
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

GRIDisclosureSchema.index({ companyId: 1, disclosureId: 1 })

module.exports = mongoose.model('GRIDisclosure', GRIDisclosureSchema)
