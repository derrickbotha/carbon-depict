const mongoose = require('mongoose')

/**
 * MLModelPrediction Schema (MongoDB)
 * Stores AI/ML model predictions, training data, and inference results
 * Optimized for high-volume AI processing and model versioning
 */
const MLModelPredictionSchema = new mongoose.Schema(
  {
    // Model identification
    modelName: {
      type: String,
      required: true,
      index: true,
      enum: [
        'emissions_forecasting',
        'anomaly_detection',
        'energy_optimization',
        'carbon_intensity_prediction',
        'esg_score_prediction',
        'risk_assessment',
        'text_classification',
        'document_extraction',
        'image_analysis',
        'time_series_forecast',
        'recommendation_engine',
      ],
    },
    modelVersion: {
      type: String,
      required: true,
      default: '1.0.0',
    },
    modelType: {
      type: String,
      enum: ['classification', 'regression', 'clustering', 'nlp', 'computer_vision', 'time_series', 'other'],
    },
    
    // Company context
    companyId: {
      type: String, // UUID from PostgreSQL
      required: true,
      index: true,
    },
    userId: {
      type: String, // UUID from PostgreSQL
      index: true,
    },
    
    // Input data
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      description: 'Raw input features fed to the model',
    },
    inputFeatures: {
      type: [String],
      description: 'List of feature names used',
    },
    
    // Prediction results
    prediction: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      description: 'Model output/prediction',
    },
    predictionType: {
      type: String,
      enum: ['numeric', 'classification', 'probability', 'ranking', 'embedding', 'text', 'other'],
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      description: 'Prediction confidence score (0-1)',
    },
    probabilityDistribution: {
      type: Map,
      of: Number,
      description: 'For classification: class probabilities',
    },
    
    // Model performance metrics
    metrics: {
      accuracy: Number,
      precision: Number,
      recall: Number,
      f1Score: Number,
      rmse: Number,
      mae: Number,
      r2Score: Number,
      auc: Number,
      custom: mongoose.Schema.Types.Mixed,
    },
    
    // Temporal context
    predictionDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    targetDate: {
      type: Date,
      description: 'Date/period the prediction is for',
    },
    forecastHorizon: {
      type: String,
      description: '7d, 30d, 1y, etc.',
    },
    
    // Training context
    trainingDataset: {
      name: String,
      version: String,
      recordCount: Number,
      dateRange: {
        start: Date,
        end: Date,
      },
    },
    trainedAt: {
      type: Date,
    },
    
    // Feature importance (for explainability)
    featureImportance: {
      type: Map,
      of: Number,
      description: 'SHAP values, feature importance scores',
    },
    
    // Explainability (XAI)
    explanation: {
      type: mongoose.Schema.Types.Mixed,
      description: 'LIME, SHAP, or other explainability outputs',
    },
    shapValues: {
      type: Map,
      of: Number,
    },
    
    // Validation and monitoring
    isValidated: {
      type: Boolean,
      default: false,
    },
    actualValue: {
      type: mongoose.Schema.Types.Mixed,
      description: 'Actual outcome for validation',
    },
    error: {
      type: Number,
      description: 'Prediction error (predicted - actual)',
    },
    isPredictionAccurate: {
      type: Boolean,
    },
    
    // Status and feedback
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'validated', 'rejected'],
      default: 'completed',
      index: true,
    },
    userFeedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      feedbackDate: Date,
    },
    
    // Usage context
    useCase: {
      type: String,
      description: 'How/where this prediction was used',
    },
    triggeredBy: {
      type: String,
      enum: ['scheduled', 'user_request', 'api_call', 'automated_workflow', 'batch_job'],
      default: 'user_request',
    },
    
    // Processing metadata
    processingTime: {
      type: Number,
      description: 'Inference time in milliseconds',
    },
    computeResources: {
      cpu: String,
      gpu: String,
      memory: String,
    },
    
    // Environment
    environment: {
      type: String,
      enum: ['development', 'staging', 'production'],
      default: 'production',
    },
    
    // References to related data
    relatedEmissionIds: [{
      type: String, // UUIDs from GHGEmission
    }],
    relatedMetricIds: [{
      type: String, // UUIDs from ESGMetric
    }],
    relatedDocumentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentEmbedding',
    }],
    
    // Additional metadata
    tags: [String],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'ml_model_predictions',
  }
)

// Indexes for analytics and queries
MLModelPredictionSchema.index({ companyId: 1, predictionDate: -1 })
MLModelPredictionSchema.index({ modelName: 1, modelVersion: 1, predictionDate: -1 })
MLModelPredictionSchema.index({ companyId: 1, modelName: 1, status: 1 })
MLModelPredictionSchema.index({ predictionDate: -1 }, { expireAfterSeconds: 63072000 }) // TTL: 2 years
MLModelPredictionSchema.index({ 'userFeedback.rating': 1 })
MLModelPredictionSchema.index({ isValidated: 1, isPredictionAccurate: 1 })

// Virtual for prediction age
MLModelPredictionSchema.virtual('age').get(function() {
  return Date.now() - this.predictionDate
})

// Method to calculate accuracy
MLModelPredictionSchema.methods.calculateAccuracy = function() {
  if (this.actualValue !== null && this.actualValue !== undefined) {
    const predicted = parseFloat(this.prediction)
    const actual = parseFloat(this.actualValue)
    
    if (!isNaN(predicted) && !isNaN(actual)) {
      this.error = predicted - actual
      const percentError = Math.abs(this.error / actual) * 100
      this.isPredictionAccurate = percentError <= 10 // Within 10%
      return this.isPredictionAccurate
    }
  }
  return null
}

// Static method to get model performance
MLModelPredictionSchema.statics.getModelPerformance = async function(modelName, modelVersion, companyId) {
  return await this.aggregate([
    {
      $match: {
        modelName,
        ...(modelVersion && { modelVersion }),
        ...(companyId && { companyId }),
        isValidated: true,
        actualValue: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: { modelName: '$modelName', modelVersion: '$modelVersion' },
        avgConfidence: { $avg: '$confidence' },
        avgError: { $avg: '$error' },
        accuracyRate: {
          $avg: { $cond: [{ $eq: ['$isPredictionAccurate', true] }, 1, 0] },
        },
        totalPredictions: { $sum: 1 },
        avgProcessingTime: { $avg: '$processingTime' },
      },
    },
  ])
}

module.exports = mongoose.model('MLModelPrediction', MLModelPredictionSchema)
