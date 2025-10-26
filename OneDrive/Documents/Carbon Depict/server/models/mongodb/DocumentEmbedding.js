const mongoose = require('mongoose')

/**
 * DocumentEmbedding Schema (MongoDB)
 * Stores document embeddings for semantic search, RAG, and AI processing
 * Supports vector similarity search for intelligent document retrieval
 */
const DocumentEmbeddingSchema = new mongoose.Schema(
  {
    // Document identification
    documentId: {
      type: String, // UUID or file reference
      required: true,
      unique: true,
      index: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: [
        'sustainability_report',
        'esg_report',
        'emissions_data',
        'audit_report',
        'policy_document',
        'certification',
        'invoice',
        'utility_bill',
        'contract',
        'regulatory_filing',
        'internal_memo',
        'research_paper',
        'news_article',
        'other',
      ],
      index: true,
    },
    
    // Company context
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      index: true,
    },
    
    // Document metadata
    filename: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      description: 'File size in bytes',
    },
    mimeType: {
      type: String,
    },
    filePath: {
      type: String,
      description: 'Storage path or URL',
    },
    
    // Content
    fullText: {
      type: String,
      description: 'Full extracted text content',
    },
    textChunks: [{
      chunkId: String,
      content: String,
      startPosition: Number,
      endPosition: Number,
      pageNumber: Number,
      embedding: [Number], // Vector embedding for this chunk
    }],
    
    // Embedding (Vector representation)
    embedding: {
      type: [Number],
      required: true,
      description: 'High-dimensional vector (e.g., 1536 dimensions for OpenAI)',
    },
    embeddingModel: {
      type: String,
      required: true,
      default: 'text-embedding-ada-002',
      description: 'OpenAI, Cohere, custom model name',
    },
    embeddingDimensions: {
      type: Number,
      required: true,
      description: 'Vector dimensionality',
    },
    embeddingVersion: {
      type: String,
      default: '1.0.0',
    },
    
    // Extracted metadata (AI-powered)
    extractedData: {
      // Key-value pairs extracted by AI
      emissionsData: mongoose.Schema.Types.Mixed,
      energyData: mongoose.Schema.Types.Mixed,
      dates: [Date],
      locations: [String],
      organizations: [String],
      metrics: mongoose.Schema.Types.Mixed,
      
      // ESG-specific
      frameworks: [String], // GRI, TCFD, CDP identified
      topics: [String],
      sdgs: [Number], // SDG numbers
      
      // Financial
      amounts: [{
        value: Number,
        currency: String,
        context: String,
      }],
    },
    
    // NLP analysis
    nlpAnalysis: {
      language: {
        type: String,
        default: 'en',
      },
      sentiment: {
        score: Number, // -1 to 1
        label: {
          type: String,
          enum: ['positive', 'neutral', 'negative'],
        },
      },
      keyPhrases: [String],
      entities: [{
        text: String,
        type: String, // PERSON, ORG, GPE, DATE, etc.
        confidence: Number,
      }],
      topics: [{
        topic: String,
        confidence: Number,
      }],
    },
    
    // Classification
    classification: {
      category: String,
      subcategory: String,
      confidence: Number,
      tags: [String],
    },
    
    // Temporal
    documentDate: {
      type: Date,
      description: 'Date of document creation/issuance',
    },
    reportingPeriod: {
      start: Date,
      end: Date,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    processedAt: {
      type: Date,
    },
    
    // Quality and validation
    qualityScore: {
      type: Number,
      min: 0,
      max: 1,
      description: 'OCR/extraction quality',
    },
    isValidated: {
      type: Boolean,
      default: false,
    },
    validatedBy: String,
    validatedAt: Date,
    
    // Verification
    checksum: {
      type: String,
      description: 'File hash for integrity',
    },
    version: {
      type: Number,
      default: 1,
    },
    previousVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      description: 'Reference to previous version (DocumentEmbedding)'
    },
    
    // Access control
    visibility: {
      type: String,
      enum: ['private', 'company', 'public'],
      default: 'company',
    },
    accessList: [{
      userId: String,
      permission: {
        type: String,
        enum: ['read', 'write', 'admin'],
      },
    }],
    
    // Usage tracking
    queryCount: {
      type: Number,
      default: 0,
      description: 'Number of times retrieved in searches',
    },
    lastAccessed: {
      type: Date,
    },
    
    // Related entities
    relatedEmissionIds: [String],
    relatedMetricIds: [String],
    relatedReportIds: [String],
    relatedDocuments: [{
      documentId: String,
      similarityScore: Number,
    }],
    
    // Status
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed', 'archived'],
      default: 'processing',
      index: true,
    },
    errorMessage: String,
    
    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'document_embeddings',
  }
)

// Indexes
DocumentEmbeddingSchema.index({ companyId: 1, uploadedAt: -1 })
DocumentEmbeddingSchema.index({ companyId: 1, documentType: 1, status: 1 })
DocumentEmbeddingSchema.index({ documentDate: 1 })
DocumentEmbeddingSchema.index({ 'classification.category': 1 })
DocumentEmbeddingSchema.index({ 'extractedData.frameworks': 1 })
DocumentEmbeddingSchema.index({ queryCount: -1 })
DocumentEmbeddingSchema.index({ status: 1, processedAt: -1 })

// Text index for full-text search
DocumentEmbeddingSchema.index({ fullText: 'text', 'extractedData': 'text' })

// TTL index - auto-delete after 5 years if archived
DocumentEmbeddingSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 157680000, partialFilterExpression: { status: 'archived' } }
)

// Virtual for age
DocumentEmbeddingSchema.virtual('age').get(function() {
  return Date.now() - this.uploadedAt
})

// Method to calculate cosine similarity
DocumentEmbeddingSchema.methods.cosineSimilarity = function(otherEmbedding) {
  if (!this.embedding || !otherEmbedding || this.embedding.length !== otherEmbedding.length) {
    return null
  }
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < this.embedding.length; i++) {
    dotProduct += this.embedding[i] * otherEmbedding[i]
    normA += this.embedding[i] * this.embedding[i]
    normB += otherEmbedding[i] * otherEmbedding[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Static method for semantic search (requires vector database or manual calculation)
DocumentEmbeddingSchema.statics.semanticSearch = async function(queryEmbedding, companyId, limit = 10) {
  // This is a simplified version - in production, use a vector database like Pinecone, Weaviate, or pgvector
  const documents = await this.find({
    companyId,
    status: 'completed',
    embedding: { $exists: true },
  }).limit(100) // Pre-filter for performance
  
  const results = documents.map(doc => ({
    document: doc,
    similarity: doc.cosineSimilarity(queryEmbedding),
  }))
  
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(r => r.document)
}

// Method to increment query count
DocumentEmbeddingSchema.methods.recordAccess = async function() {
  this.queryCount += 1
  this.lastAccessed = new Date()
  return await this.save()
}

module.exports = mongoose.model('DocumentEmbedding', DocumentEmbeddingSchema)
