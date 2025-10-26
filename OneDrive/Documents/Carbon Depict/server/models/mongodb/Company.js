const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      enum: ['agriculture', 'energy', 'fleet', 'food', 'manufacturing', 'education', 'other'],
    },
    region: {
      type: String,
      default: 'uk',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    country: {
      type: String,
      default: '',
      trim: true,
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'enterprise'],
      default: 'small',
    },
    subscription: {
      type: String,
      enum: ['free', 'professional', 'enterprise'],
      default: 'free',
    },
    subscriptionValidUntil: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        emailDomain: null,
        allowedDomains: [],
        requireEmailVerification: true,
        autoApproveUsers: false,
        dateFormat: 'yyyy-mm-dd',
        unitSystem: 'metric',
        notifications: {
          email: true,
          monthlyReports: true,
          factorUpdates: false,
        },
      }),
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

CompanySchema.index({ name: 1 }, { unique: true })
CompanySchema.index({ industry: 1 })
CompanySchema.index({ region: 1 })

CompanySchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'companyId',
})

module.exports = mongoose.model('Company', CompanySchema)
