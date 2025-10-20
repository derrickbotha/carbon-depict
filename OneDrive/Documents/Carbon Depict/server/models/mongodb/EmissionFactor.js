const mongoose = require('mongoose')

/**
 * EmissionFactor Model (MongoDB)
 * Stores DEFRA 2025 emission factors with versioning
 * Non-relational structure allows flexibility for factor updates
 */
const emissionFactorSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      index: true,
      // fuels, electricity, refrigerants, passenger-transport, etc.
    },
    subcategory: {
      type: String,
      required: true,
      index: true,
      // diesel, petrol, van-class-1, R134a, etc.
    },
    name: {
      type: String,
      required: true,
      // Display name: "Diesel (average biofuel blend)"
    },
    description: {
      type: String,
      // Additional details about the factor
    },
    factor: {
      type: Number,
      required: true,
      // Emission factor value
    },
    unit: {
      type: String,
      required: true,
      // kgCO2e/litre, kgCO2e/kWh, kgCO2e/km, etc.
    },
    scope: {
      type: String,
      required: true,
      enum: ['Scope 1', 'Scope 2', 'Scope 3', 'Mixed'],
    },
    // Breakdown by GHG gas
    breakdown: {
      co2: { type: Number, default: 0 },
      ch4: { type: Number, default: 0 },
      n2o: { type: Number, default: 0 },
      hfc: { type: Number, default: 0 },
      pfc: { type: Number, default: 0 },
      sf6: { type: Number, default: 0 },
      nf3: { type: Number, default: 0 },
    },
    // Source information
    source: {
      type: String,
      default: 'DEFRA 2025',
      // DEFRA 2025, IEA, custom, etc.
    },
    sourceUrl: {
      type: String,
    },
    gwpVersion: {
      type: String,
      default: 'AR5',
      enum: ['AR4', 'AR5', 'AR6'],
      // IPCC Assessment Report version
    },
    // Regional specificity
    region: {
      type: String,
      default: 'UK',
      // UK, US, EU, Asia, Africa, Global
    },
    country: {
      type: String,
      // Specific country if applicable
    },
    // Versioning for annual updates
    version: {
      type: String,
      required: true,
      default: '2025',
      // 2024, 2025, 2026, etc.
    },
    validFrom: {
      type: Date,
      required: true,
      default: Date.now,
    },
    validTo: {
      type: Date,
      // Null if current version
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Additional metadata (flexible)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Can store: vehicle size, load percentage, fuel type, etc.
    },
    // Tags for search/filtering
    tags: [String],
  },
  {
    timestamps: true,
    collection: 'emission_factors',
  }
)

// Compound indexes for efficient queries
emissionFactorSchema.index({ category: 1, subcategory: 1, isActive: 1 })
emissionFactorSchema.index({ region: 1, isActive: 1 })
emissionFactorSchema.index({ version: 1, isActive: 1 })
emissionFactorSchema.index({ validFrom: 1, validTo: 1 })

// Static method to get current factor
emissionFactorSchema.statics.getCurrentFactor = async function (category, subcategory, region = 'UK') {
  return await this.findOne({
    category,
    subcategory,
    region,
    isActive: true,
    validFrom: { $lte: new Date() },
    $or: [{ validTo: null }, { validTo: { $gte: new Date() } }],
  }).sort({ version: -1 })
}

// Static method to get all factors for a category
emissionFactorSchema.statics.getFactorsByCategory = async function (category, region = 'UK') {
  return await this.find({
    category,
    region,
    isActive: true,
    validFrom: { $lte: new Date() },
    $or: [{ validTo: null }, { validTo: { $gte: new Date() } }],
  }).sort({ subcategory: 1 })
}

const EmissionFactor = mongoose.model('EmissionFactor', emissionFactorSchema)

module.exports = EmissionFactor
