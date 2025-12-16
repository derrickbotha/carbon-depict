/**
 * MongoDB Models Index
 * Non-relational data optimized for AI/ML, document storage, and flexible schemas
 */

// Core organization and user models
const Company = require('./Company')
const User = require('./User')
const Location = require('./Location')
const Facility = require('./Facility')

// ESG data models
const GHGEmission = require('./GHGEmission')
const ESGMetric = require('./ESGMetric')
const GRIDisclosure = require('./GRIDisclosure')
const CSRDDisclosure = require('./CSRDDisclosure')
const MaterialityAssessment = require('./MaterialityAssessment')
const Scope3Emission = require('./Scope3Emission')
const RiskRegister = require('./RiskRegister')
const ESGTarget = require('./ESGTarget')
const SBTiTarget = require('./SBTiTarget')
const PCAFAssessment = require('./PCAFAssessment')

// Existing models
const EmissionFactor = require('./EmissionFactor')
const AIInference = require('./AIInference')
const ActivityLog = require('./ActivityLog')
const FrameworkTemplate = require('./FrameworkTemplate')
const StakeholderEngagement = require('./StakeholderEngagement')
const SupplierAssessment = require('./SupplierAssessment')
const IncidentLog = require('./IncidentLog')

// New AI/ML models
const MLModelPrediction = require('./MLModelPrediction')
const DocumentEmbedding = require('./DocumentEmbedding')

module.exports = {
  // Core relational replacements
  Company,
  User,
  Location,
  Facility,

  // Emissions models
  GHGEmission,
  Scope3Emission,

  // ESG & Framework models
  ESGMetric,
  GRIDisclosure,
  CSRDDisclosure,

  // Assessments
  MaterialityAssessment,
  SupplierAssessment,

  // Risk & Targets
  RiskRegister,
  ESGTarget,
  SBTiTarget,

  // Financial institutions
  PCAFAssessment,

  // Data and factors
  EmissionFactor,

  // AI and ML
  AIInference, // Legacy
  MLModelPrediction, // New comprehensive ML model
  DocumentEmbedding, // Vector embeddings for semantic search

  // Logging and tracking
  ActivityLog,
  IncidentLog,

  // Templates and engagement
  FrameworkTemplate,
  StakeholderEngagement,
}
