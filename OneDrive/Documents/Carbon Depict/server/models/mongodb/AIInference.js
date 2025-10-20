const mongoose = require('mongoose')

/**
 * AIInference Model (MongoDB)
 * Stores AI inference history and results
 * Non-relational structure for flexible AI response data
 */
const aiInferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      // UUID from PostgreSQL User
    },
    companyId: {
      type: String,
      required: true,
      index: true,
      // UUID from PostgreSQL Company
    },
    inferenceType: {
      type: String,
      required: true,
      enum: ['vehicle', 'equipment', 'regional-factor', 'validation', 'suggestion'],
    },
    // Input data
    query: {
      type: String,
      required: true,
      // Original user input: "Toyota Hilux mini van"
    },
    context: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Additional context data
    },
    // AI Response
    response: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      // Flexible structure for AI output
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      // Confidence score from AI
    },
    suggestions: [
      {
        value: String,
        label: String,
        confidence: Number,
      },
    ],
    // Metadata
    aiProvider: {
      type: String,
      default: 'grok',
      // grok, openai, custom
    },
    model: {
      type: String,
      // Model version used
    },
    processingTime: {
      type: Number,
      // Time in milliseconds
    },
    tokensUsed: {
      type: Number,
    },
    // User feedback
    userFeedback: {
      helpful: { type: Boolean },
      selectedSuggestion: { type: String },
      comment: { type: String },
    },
    status: {
      type: String,
      enum: ['success', 'partial', 'failed'],
      default: 'success',
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'ai_inferences',
  }
)

// Indexes for querying
aiInferenceSchema.index({ userId: 1, createdAt: -1 })
aiInferenceSchema.index({ companyId: 1, inferenceType: 1 })
aiInferenceSchema.index({ status: 1 })

const AIInference = mongoose.model('AIInference', aiInferenceSchema)

module.exports = AIInference
